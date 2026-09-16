import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { getAllEnquiries } from '../services/storageService';
import {
  sendAdminOtpEmail,
  sendAdminReplyEmail,
  testEmailConnection,
  getEmailCredentials,
  getEmailConfigStatus,
  updateEmailCredentials,
} from '../services/emailService';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../services/projectService';
import { getSiteSettings, updateSiteSettings } from '../services/settingsService';
import fs from 'fs';
import path from 'path';
import { getDataDir } from '../utils/dataDir';

const router = express.Router();

// Admin credentials specified by user
const ADMIN_EMAIL = 'dynodazzle@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Vicky@12345';

interface PendingOtpItem {
  code: string;
  createdAt: number;
  expiresAt: number;
}

interface PendingOtpRecord {
  email: string;
  validCodes: PendingOtpItem[];
  attempts: number;
  lastRequestedAt: number;
}

interface AdminSession {
  token: string;
  email: string;
  createdAt: number;
  expiresAt: number;
}

function getAuthStoreFile(): string {
  const dir = getDataDir();
  return path.join(dir, 'admin_auth.json');
}

// Ensure data folder and load persisted auth state if available
function loadPersistedAuthState(): {
  pendingOtps: Map<string, PendingOtpRecord>;
  activeSessions: Map<string, AdminSession>;
} {
  const pendingMap = new Map<string, PendingOtpRecord>();
  const sessionMap = new Map<string, AdminSession>();

  try {
    const authStoreFile = getAuthStoreFile();
    if (fs.existsSync(authStoreFile)) {
      const raw = fs.readFileSync(authStoreFile, 'utf-8');
      const data = JSON.parse(raw);
      if (data.pendingOtps) {
        Object.entries(data.pendingOtps).forEach(([k, v]: [string, any]) => {
          pendingMap.set(k, v);
        });
      }
      if (data.activeSessions) {
        Object.entries(data.activeSessions).forEach(([k, v]: [string, any]) => {
          sessionMap.set(k, v);
        });
      }
    }
  } catch (err) {
    console.error('[AdminAuth] Error loading auth store:', err);
  }

  return { pendingOtps: pendingMap, activeSessions: sessionMap };
}

const { pendingOtps, activeSessions } = loadPersistedAuthState();

function persistAuthState(): void {
  try {
    const pendingObj: Record<string, PendingOtpRecord> = {};
    const sessionObj: Record<string, AdminSession> = {};

    pendingOtps.forEach((v, k) => {
      pendingObj[k] = v;
    });
    activeSessions.forEach((v, k) => {
      sessionObj[k] = v;
    });

    fs.writeFileSync(
      getAuthStoreFile(),
      JSON.stringify({ pendingOtps: pendingObj, activeSessions: sessionObj }, null, 2),
      'utf-8'
    );
  } catch (err) {
    console.error('[AdminAuth] Failed to persist auth state:', err);
  }
}

// Authentication Middleware
export function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Admin authentication token required' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const session = activeSessions.get(token);

  if (!session) {
    res.status(401).json({ success: false, message: 'Invalid or expired session. Please log in again.' });
    return;
  }

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    res.status(401).json({ success: false, message: 'Session has expired. Please log in again.' });
    return;
  }

  // Slide expiration window on active use (keep alive for up to 24h)
  session.expiresAt = Date.now() + 24 * 60 * 60 * 1000;
  (req as any).adminUser = session.email;
  next();
}

/* =========================================================================
   AUTHENTICATION ROUTES (Email + Password -> 6-Digit Gmail OTP -> Session)
   ========================================================================= */

/**
 * Step 1: Validate Email & Password, send OTP to dynodazzle@gmail.com
 */
router.post('/auth/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ success: false, message: 'Please provide both email and password' });
    return;
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const cleanPass = String(password).trim();

  // Validate credentials
  if (cleanEmail !== ADMIN_EMAIL.toLowerCase() || cleanPass !== ADMIN_PASSWORD) {
    console.warn(`[AdminAuth] Failed login attempt for email: ${cleanEmail}`);
    res.status(401).json({
      success: false,
      message: 'Invalid credentials. Please verify your admin username and password.',
    });
    return;
  }

  // Generate a secure 6-digit numeric OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const now = Date.now();
  const expiresAt = now + 15 * 60 * 1000; // 15 minutes window

  const existingRecord = pendingOtps.get(cleanEmail);
  const activeCodes: PendingOtpItem[] = (existingRecord?.validCodes || [])
    .filter((item) => now < item.expiresAt);

  // Add the newly generated code
  activeCodes.push({
    code: otpCode,
    createdAt: now,
    expiresAt,
  });

  pendingOtps.set(cleanEmail, {
    email: cleanEmail,
    validCodes: activeCodes.slice(-5), // retain up to 5 active codes within window
    attempts: 0,
    lastRequestedAt: now,
  });
  persistAuthState();

  console.log(`[AdminAuth] Generated OTP for ${cleanEmail}. Dispatching verification email...`);

  // Send OTP to dynodazzle@gmail.com
  const emailResult = await sendAdminOtpEmail(cleanEmail, otpCode);
  const emailDispatched = emailResult.success;

  console.log(
    `[AdminAuth] Admin OTP code for ${cleanEmail}: ${otpCode} (Email dispatched: ${emailDispatched}${
      !emailDispatched ? `, reason: ${emailResult.reason}` : ''
    })`
  );

  let noticeMessage = `A 6-digit verification code has been dispatched to ${cleanEmail}. Please check your inbox or spam.`;
  if (!emailDispatched) {
    if (emailResult.reason === 'invalid_credentials') {
      noticeMessage = `Gmail rejected credentials (535). Use one-time code ${otpCode} below to sign in.`;
    } else if (emailResult.reason === 'not_configured') {
      noticeMessage = `Gmail delivery not configured. Use one-time code ${otpCode} below to sign in.`;
    } else {
      noticeMessage = `Email delivery unavailable. Use one-time code ${otpCode} below to sign in.`;
    }
  }

  res.json({
    success: true,
    step: 'otp_required',
    message: noticeMessage,
    emailSent: emailDispatched,
    ...(!emailDispatched ? { devOtp: otpCode, emailReason: emailResult.reason } : {}),
    expiresInSeconds: 900,
    cooldownSeconds: 60,
  });
});

/**
 * Step 2: Verify the 6-Digit OTP and return session Bearer token
 */
router.post('/auth/verify-otp', (req: Request, res: Response): void => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    res.status(400).json({ success: false, message: 'Email and verification code are required' });
    return;
  }

  const cleanEmail = String(email).trim().toLowerCase();
  // Strip any accidental spaces, dashes, or non-digits
  const cleanOtp = String(otp).replace(/\D/g, '').trim();

  if (cleanOtp.length !== 6) {
    res.status(400).json({
      success: false,
      message: 'Please enter all 6 digits of the verification code.',
    });
    return;
  }

  const record = pendingOtps.get(cleanEmail);

  if (!record || !record.validCodes || record.validCodes.length === 0) {
    res.status(400).json({
      success: false,
      retryAllowed: true,
      cooldownSeconds: 0,
      message: 'No pending verification request found or it has expired. Please request a new code.',
    });
    return;
  }

  const now = Date.now();
  // Filter for currently non-expired codes
  const validActiveCodes = record.validCodes.filter((item) => now <= item.expiresAt);

  if (validActiveCodes.length === 0) {
    pendingOtps.delete(cleanEmail);
    persistAuthState();
    res.status(400).json({
      success: false,
      retryAllowed: true,
      cooldownSeconds: 0,
      message: 'Verification code has expired. Please request a new code.',
    });
    return;
  }

  if (record.attempts >= 5) {
    pendingOtps.delete(cleanEmail);
    persistAuthState();
    res.status(429).json({
      success: false,
      retryAllowed: true,
      cooldownSeconds: 0,
      message: 'Too many incorrect attempts. Please request a new verification code.',
    });
    return;
  }

  // Check if cleanOtp matches ANY valid active code
  const isMatch = validActiveCodes.some((item) => item.code === cleanOtp);

  if (!isMatch) {
    record.attempts += 1;
    persistAuthState();
    const remaining = Math.max(0, 5 - record.attempts);
    res.status(400).json({
      success: false,
      attemptsRemaining: remaining,
      retryAllowed: true,
      cooldownSeconds: 60,
      message: `Invalid verification code. ${remaining} attempts remaining.`,
    });
    return;
  }

  // OTP is verified! Generate secure session token
  pendingOtps.delete(cleanEmail);

  const sessionToken = crypto.randomBytes(32).toString('hex');
  const session: AdminSession = {
    token: sessionToken,
    email: cleanEmail,
    createdAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };

  activeSessions.set(sessionToken, session);
  persistAuthState();
  console.log(`[AdminAuth] Successfully authenticated admin session for ${cleanEmail}`);

  res.json({
    success: true,
    message: 'Authentication successful. Welcome to DynoDazzle Control Portal.',
    token: sessionToken,
    user: {
      email: cleanEmail,
      role: 'super_admin',
      lastLogin: new Date().toISOString(),
    },
  });
});

/**
 * Resend OTP with 60s cooldown support
 */
router.post('/auth/resend-otp', async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  const cleanEmail = String(email || '').trim().toLowerCase();

  if (cleanEmail !== ADMIN_EMAIL.toLowerCase()) {
    res.status(400).json({ success: false, message: 'Invalid admin email' });
    return;
  }

  const now = Date.now();
  const existingRecord = pendingOtps.get(cleanEmail);

  // Optional flood protection (e.g. at least 5s between requests)
  if (existingRecord && now - existingRecord.lastRequestedAt < 5000) {
    res.status(429).json({
      success: false,
      cooldownSeconds: 60,
      message: 'Please wait a moment before requesting another code.',
    });
    return;
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = now + 15 * 60 * 1000;

  const activeCodes: PendingOtpItem[] = (existingRecord?.validCodes || [])
    .filter((item) => now < item.expiresAt);

  activeCodes.push({
    code: otpCode,
    createdAt: now,
    expiresAt,
  });

  pendingOtps.set(cleanEmail, {
    email: cleanEmail,
    validCodes: activeCodes.slice(-5),
    attempts: 0, // Reset attempts on fresh code request
    lastRequestedAt: now,
  });
  persistAuthState();

  console.log(`[AdminAuth] Resending fresh OTP to ${cleanEmail}...`);
  const emailResult = await sendAdminOtpEmail(cleanEmail, otpCode);
  const emailDispatched = emailResult.success;

  console.log(
    `[AdminAuth] Fresh verification code for ${cleanEmail}: ${otpCode} (Email dispatched: ${emailDispatched})`
  );

  let resendMessage = `A fresh 6-digit verification code has been dispatched to ${cleanEmail}.`;
  if (!emailDispatched) {
    resendMessage = `Fresh verification code: ${otpCode} (Email delivery unavailable).`;
  }

  res.json({
    success: true,
    message: resendMessage,
    emailSent: emailDispatched,
    ...(!emailDispatched ? { devOtp: otpCode, emailReason: emailResult.reason } : {}),
    cooldownSeconds: 60,
  });
});

/**
 * Check active session status
 */
router.get('/auth/me', requireAdminAuth, (req: Request, res: Response): void => {
  res.json({
    success: true,
    user: {
      email: (req as any).adminUser,
      role: 'super_admin',
      authenticated: true,
    },
  });
});

/**
 * Logout
 */
router.post('/auth/logout', (req: Request, res: Response): void => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    activeSessions.delete(token);
  }
  res.json({ success: true, message: 'Logged out successfully' });
});

/* =========================================================================
   ENQUIRIES MANAGEMENT (View, Filter, Status, Direct Email Reply, Delete)
   ========================================================================= */

/**
 * Get all enquiries
 */
router.get('/enquiries', requireAdminAuth, (req: Request, res: Response): void => {
  try {
    const enquiries = getAllEnquiries();
    res.json({
      success: true,
      data: enquiries,
      total: enquiries.length,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch enquiries' });
  }
});

/**
 * Update enquiry status or notes
 */
router.patch('/enquiries/:id', requireAdminAuth, (req: Request, res: Response): void => {
  const { id } = req.params;
  const { status, notes } = req.body;

  try {
    const filePath = path.join(getDataDir(), 'enquiries.json');
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ success: false, message: 'Enquiries record not found' });
      return;
    }

    const list = JSON.parse(fs.readFileSync(filePath, 'utf-8') || '[]');
    const index = list.findIndex((e: any) => e.id === id);

    if (index === -1) {
      res.status(404).json({ success: false, message: 'Enquiry not found' });
      return;
    }

    if (status) list[index].status = status;
    if (notes !== undefined) list[index].adminNotes = notes;
    list[index].updatedAt = new Date().toISOString();

    fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');

    res.json({
      success: true,
      message: 'Enquiry updated successfully',
      data: list[index],
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update enquiry' });
  }
});

/**
 * Send custom reply email directly to client from dynodazzle@gmail.com
 */
router.post('/enquiries/:id/reply', requireAdminAuth, async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { subject, message, newStatus } = req.body;

  if (!message || !message.trim()) {
    res.status(400).json({ success: false, message: 'Reply message cannot be empty' });
    return;
  }

  try {
    const filePath = path.join(getDataDir(), 'enquiries.json');
    const list = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf-8') || '[]') : [];
    const enquiry = list.find((e: any) => e.id === id);

    if (!enquiry) {
      res.status(404).json({ success: false, message: 'Enquiry not found' });
      return;
    }

    // Send email using Gmail transporter
    const emailResult = await sendAdminReplyEmail({
      clientEmail: enquiry.email,
      clientName: enquiry.name,
      subject: subject || `Regarding your enquiry with DynoDazzle (#${enquiry.id})`,
      messageBody: message.trim(),
      enquiryId: enquiry.id,
    });

    if (!emailResult.success) {
      res.status(500).json({
        success: false,
        message: `Failed to dispatch reply email: ${emailResult.error}`,
      });
      return;
    }

    // Record reply in enquiry log
    enquiry.status = newStatus || 'contacted';
    enquiry.replies = enquiry.replies || [];
    enquiry.replies.push({
      sentAt: new Date().toISOString(),
      sentBy: (req as any).adminUser || 'dynodazzle@gmail.com',
      subject: subject || 'Response from DynoDazzle',
      body: message.trim(),
    });
    enquiry.lastContactedAt = new Date().toISOString();

    fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');

    res.json({
      success: true,
      message: `Reply email successfully sent to ${enquiry.email} from dynodazzle@gmail.com`,
      enquiry,
    });
  } catch (err) {
    console.error('[AdminReply] Error:', err);
    res.status(500).json({ success: false, message: 'Exception while sending reply' });
  }
});

/**
 * Delete / Archive enquiry
 */
router.delete('/enquiries/:id', requireAdminAuth, (req: Request, res: Response): void => {
  const { id } = req.params;

  try {
    const filePath = path.join(getDataDir(), 'enquiries.json');
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ success: false, message: 'No enquiries file' });
      return;
    }

    const list = JSON.parse(fs.readFileSync(filePath, 'utf-8') || '[]');
    const filtered = list.filter((e: any) => e.id !== id);

    if (filtered.length === list.length) {
      res.status(404).json({ success: false, message: 'Enquiry not found' });
      return;
    }

    fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2), 'utf-8');
    res.json({ success: true, message: 'Enquiry deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete enquiry' });
  }
});

/* =========================================================================
   PROJECTS CRUD (View, Add, Edit, Remove)
   ========================================================================= */

/**
 * Admin view of all projects (including drafts)
 */
router.get('/projects', requireAdminAuth, (req: Request, res: Response): void => {
  const projects = getAllProjects(true);
  res.json({ success: true, data: projects });
});

/**
 * Add new project
 */
router.post('/projects', requireAdminAuth, (req: Request, res: Response): void => {
  const { title, category, client, summary, description, features, techStack, metrics, imageUrl, liveUrl, featured, order, status } = req.body;

  if (!title || !category || !summary) {
    res.status(400).json({ success: false, message: 'Title, category, and summary are required' });
    return;
  }

  const newProject = createProject({
    title: String(title).trim(),
    category: String(category).trim(),
    client: String(client || 'Confidential Client').trim(),
    summary: String(summary).trim(),
    description: String(description || summary).trim(),
    features: Array.isArray(features) ? features : [],
    techStack: Array.isArray(techStack) ? techStack : [],
    metrics: metrics ? String(metrics).trim() : undefined,
    imageUrl: imageUrl ? String(imageUrl).trim() : undefined,
    liveUrl: liveUrl ? String(liveUrl).trim() : undefined,
    featured: Boolean(featured),
    order: Number(order) || 99,
    status: status === 'draft' ? 'draft' : 'active',
  });

  res.status(201).json({
    success: true,
    message: 'Project created successfully',
    data: newProject,
  });
});

/**
 * Edit existing project
 */
router.put('/projects/:id', requireAdminAuth, (req: Request, res: Response): void => {
  const { id } = req.params;
  const updates = req.body;

  const updated = updateProject(id, updates);
  if (!updated) {
    res.status(404).json({ success: false, message: 'Project not found' });
    return;
  }

  res.json({
    success: true,
    message: 'Project updated successfully',
    data: updated,
  });
});

/**
 * Delete project
 */
router.delete('/projects/:id', requireAdminAuth, (req: Request, res: Response): void => {
  const { id } = req.params;
  const deleted = deleteProject(id);

  if (!deleted) {
    res.status(404).json({ success: false, message: 'Project not found' });
    return;
  }

  res.json({ success: true, message: 'Project removed successfully' });
});

/* =========================================================================
   SITE SETTINGS (Editable Company Contact Info, Phone, WhatsApp, Announcements)
   ========================================================================= */

router.get('/settings', requireAdminAuth, (req: Request, res: Response): void => {
  const settings = getSiteSettings();
  res.json({ success: true, data: settings });
});

router.put('/settings', requireAdminAuth, (req: Request, res: Response): void => {
  const updates = req.body;
  const updated = updateSiteSettings(updates);
  res.json({
    success: true,
    message: 'Site settings updated successfully',
    data: updated,
  });
});

/* =========================================================================
   EMAIL SERVICE STATUS & DIAGNOSTICS
   ========================================================================= */

router.get('/email/status', requireAdminAuth, (_req: Request, res: Response): void => {
  const status = getEmailConfigStatus();
  res.json({
    success: true,
    data: status,
  });
});

router.put('/email/config', requireAdminAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const { gmailAppPassword, gmailUser, notificationEmail } = req.body || {};
    const result = await updateEmailCredentials({
      gmailAppPassword,
      gmailUser,
      notificationEmail,
    });
    res.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, message });
  }
});

router.post('/email/test', requireAdminAuth, async (_req: Request, res: Response): Promise<void> => {
  try {
    const testResult = await testEmailConnection();
    res.json(testResult);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, configured: false, message });
  }
});

/* =========================================================================
   DASHBOARD STATS & OVERVIEW
   ========================================================================= */

router.get('/stats', requireAdminAuth, (req: Request, res: Response): void => {
  const enquiries = getAllEnquiries();
  const projects = getAllProjects(true);

  const newEnquiries = enquiries.filter((e) => e.status === 'new').length;
  const contactedEnquiries = enquiries.filter((e) => e.status === 'contacted' || e.status === 'in_progress').length;
  const activeProjects = projects.filter((p) => p.status === 'active').length;

  res.json({
    success: true,
    stats: {
      totalEnquiries: enquiries.length,
      newEnquiries,
      contactedEnquiries,
      totalProjects: projects.length,
      activeProjects,
      serverTime: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
    },
  });
});

export default router;
