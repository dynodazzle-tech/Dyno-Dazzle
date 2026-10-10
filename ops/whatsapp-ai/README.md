# DynoDazzle WhatsApp AI Bridge (QR-based)

This is a separate service; it does not alter the DynoDazzle website runtime. It links a WhatsApp account as a companion device using the open-source Baileys WhatsApp-Web protocol library, then sends inbound direct messages to n8n for AI replies.

## Important limitations

- This is an unofficial integration, not the WhatsApp Business Platform API. Protocol changes, disconnections, or account restrictions are possible. Use responsibly; no bulk or unsolicited messaging.
- Do not publish QR codes, session files, bridge tokens, or message logs. Session files grant access to the linked account.
- AI replies are disabled until explicitly enabled in server environment.
- The QR page must be reachable only by the owner, ideally via SSH tunnel or authenticated reverse proxy. Do not expose it publicly.
- Start with a separate test WhatsApp account if possible.

## Requirements

- Node.js 20+ (Node 22 recommended)
- Existing n8n instance with a reachable production webhook
- An AI model credential in n8n; the existing Gemini credential can be reused
- Persistent private disk for `auth_info_baileys/`

## Run locally or on a server

1. Copy `.env.example` to `.env` and set long random secrets.
2. Set `N8N_WEBHOOK_URL` to the production webhook URL created in n8n.
3. Install and start:
   ```bash
   npm install
   npm start
   ```
4. Open the private QR page at `http://127.0.0.1:3088/admin/qr?token=YOUR_BRIDGE_TOKEN` and scan it from WhatsApp > Linked devices > Link a device.
5. Check `/health` and test with AUTO_REPLY_ENABLED=false first.
6. Enable automatic replies only after a successful test.

## n8n webhook contract

The bridge sends JSON:
```json
{
  "event": "message",
  "messageId": "WhatsApp message id",
  "from": "sender JID",
  "pushName": "contact display name",
  "text": "incoming message text",
  "timestamp": "ISO-8601 timestamp"
}
```

It sends `x-bridge-secret: <N8N_SHARED_SECRET>`. The n8n workflow should verify this header before calling the AI model. Return JSON `{ "reply": "..." }` or `{ "reply": "", "skip": true }`.

## Deployment note

Keep the service private behind localhost, SSH tunnel, VPN, or authenticated reverse proxy. Persist the auth folder and restrict its permissions. Do not add credentials or QR/session data to Git.
