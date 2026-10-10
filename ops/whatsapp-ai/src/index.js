import 'dotenv/config';
import express from 'express';
import pino from 'pino';
import QRCode from 'qrcode';
import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys';
import fs from 'node:fs';
import path from 'node:path';

const app = express();
app.use(express.json({ limit: '256kb' }));

const PORT = Number(process.env.PORT || 3088);
const HOST = process.env.HOST || '127.0.0.1';
const BRIDGE_TOKEN = process.env.BRIDGE_TOKEN || '';
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || '';
const N8N_SHARED_SECRET = process.env.N8N_SHARED_SECRET || '';
const AUTH_DIR = path.resolve(process.env.AUTH_DIR || './auth_info_baileys');
const AUTO_REPLY_ENABLED = String(process.env.AUTO_REPLY_ENABLED || 'false').toLowerCase() === 'true';
const REPLY_TO_GROUPS = String(process.env.REPLY_TO_GROUPS || 'false').toLowerCase() === 'true';
const ignoredSenders = new Set((process.env.IGNORE_SENDERS || '').split(',').map(x => x.trim()).filter(Boolean));

let sock;
let qrDataUrl = null;
let connectionState = 'starting';
let lastError = null;
const processed = new Set();

function safeEqual(a, b) {
  if (!a || !b) return false;
  const aa = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return aa.length === bb.length && aa.equals(bb);
}
function requireAdmin(req, res, next) {
  if (!BRIDGE_TOKEN || !safeEqual(req.query.token || req.headers['x-bridge-token'], BRIDGE_TOKEN)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}
function log(level, message, extra = {}) {
  // Never log message bodies, QR contents, tokens, or auth state.
  logger[level]({ ...extra }, message);
}
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

app.get('/health', (_req, res) => res.json({
  ok: true,
  service: 'dynodazzle-whatsapp-ai-bridge',
  connection: connectionState,
  autoReplyEnabled: AUTO_REPLY_ENABLED,
  lastError
}));
app.get('/admin/status', requireAdmin, (_req, res) => res.json({
  connection: connectionState,
  qrAvailable: Boolean(qrDataUrl),
  autoReplyEnabled: AUTO_REPLY_ENABLED,
  lastError
}));
app.get('/admin/qr', requireAdmin, (_req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (!qrDataUrl) return res.status(404).send('QR is not currently available. Check /admin/status.');
  res.type('html').send(`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>DynoDazzle WhatsApp Link</title></head><body style="font-family:system-ui;max-width:520px;margin:32px auto;padding:16px;text-align:center"><h2>DynoDazzle WhatsApp Link</h2><p>Keep this page private. Scan with WhatsApp → Linked devices → Link a device.</p><img alt="WhatsApp pairing QR" style="width:min(90vw,360px)" src="${qrDataUrl}"><p>Refresh this page if the QR expires. Never share this QR.</p></body></html>`);
});

async function handleInbound(message) {
  const key = message?.key;
  if (!key || key.fromMe || !message.message) return;
  const jid = key.remoteJid || '';
  if (!jid || jid === 'status@broadcast') return;
  const isGroup = jid.endsWith('@g.us');
  if (isGroup && !REPLY_TO_GROUPS) return;

  const msgId = key.id || '';
  if (!msgId || processed.has(msgId)) return;
  processed.add(msgId);
  if (processed.size > 5000) processed.clear();

  const text = message.message.conversation
    || message.message.extendedTextMessage?.text
    || message.message.imageMessage?.caption
    || message.message.videoMessage?.caption
    || '';
  if (!text.trim()) return;

  const senderNumber = jid.split('@')[0];
  if (ignoredSenders.has(jid) || ignoredSenders.has(senderNumber)) return;

  if (!AUTO_REPLY_ENABLED) {
    log('info', 'Inbound message received; auto-reply disabled', { messageId: msgId });
    return;
  }
  if (!N8N_WEBHOOK_URL || !N8N_SHARED_SECRET) {
    log('error', 'Missing n8n webhook configuration');
    return;
  }

  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-bridge-secret': N8N_SHARED_SECRET },
      body: JSON.stringify({
        event: 'message',
        messageId: msgId,
        from: jid,
        pushName: message.pushName || '',
        text: text.slice(0, 8000),
        timestamp: new Date(Number(message.messageTimestamp || Math.floor(Date.now() / 1000)) * 1000).toISOString()
      }),
      signal: AbortSignal.timeout(45000)
    });
    if (!response.ok) throw new Error(`n8n responded HTTP ${response.status}`);
    const data = await response.json();
    if (data?.skip || typeof data?.reply !== 'string' || !data.reply.trim()) return;
    await sock.sendMessage(jid, { text: data.reply.trim().slice(0, 4000) }, { quoted: message });
    log('info', 'Automated reply sent', { messageId: msgId });
  } catch (error) {
    lastError = error?.message || 'Unknown message processing error';
    log('error', 'Inbound processing failed', { messageId: msgId, error: lastError });
  }
}

async function startWhatsApp() {
  fs.mkdirSync(AUTH_DIR, { recursive: true, mode: 0o700 });
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
  sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    markOnlineOnConnect: false,
    syncFullHistory: false
  });
  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      qrDataUrl = await QRCode.toDataURL(qr, { margin: 2, width: 360 });
      connectionState = 'qr_ready';
      log('info', 'New WhatsApp QR available on private admin page');
    }
    if (connection === 'open') {
      qrDataUrl = null;
      connectionState = 'connected';
      lastError = null;
      log('info', 'WhatsApp companion session connected');
    }
    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      connectionState = statusCode === DisconnectReason.loggedOut ? 'logged_out' : 'disconnected';
      log('warn', 'WhatsApp connection closed', { statusCode });
      if (statusCode !== DisconnectReason.loggedOut) {
        setTimeout(() => startWhatsApp().catch(err => {
          lastError = err?.message || 'Reconnect failed';
          log('error', 'Reconnect failed', { error: lastError });
        }), 3000);
      }
    }
  });
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    for (const message of messages || []) await handleInbound(message);
  });
}

app.listen(PORT, HOST, () => log('info', 'Bridge HTTP server started', { host: HOST, port: PORT }));
startWhatsApp().catch(err => {
  lastError = err?.message || 'Startup failed';
  connectionState = 'error';
  log('error', 'WhatsApp startup failed', { error: lastError });
});
