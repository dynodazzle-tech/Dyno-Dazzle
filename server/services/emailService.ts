import nodemailer, { Transporter } from 'nodemailer';

interface SendEnquiryEmailsParams {
  name: string;
  email: string;
  phone: string;
  company?: string;
  service: string;
  budget: string;
  message: string;
  enquiryId: string;
}

interface EmailResult {
  success: boolean;
  emailSent: boolean;
  message: string;
}

export async function sendEnquiryEmails(params: SendEnquiryEmailsParams): Promise<EmailResult> {
  const { name, email, phone, company, service, budget, message, enquiryId } = params;

  // Gmail Configuration
  const gmailUser = (process.env.GMAIL_USER || (process.env.SMTP_USER && process.env.SMTP_USER.includes('@gmail.com') ? process.env.SMTP_USER : undefined))?.trim();
  const rawGmailPass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASSWORD;
  const gmailPass = rawGmailPass ? rawGmailPass.replace(/\s+/g, '') : undefined;

  // General SMTP Configuration fallback
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD;
  const smtpSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;

  const adminRecipient = process.env.NOTIFICATION_EMAIL || gmailUser || 'dynodazzle@gmail.com';
  const fromEmail = gmailUser ? `DynoDazzle <${gmailUser}>` : (process.env.SMTP_FROM || 'DynoDazzle <no-reply@dynodazzle.in>');

  let transporter: Transporter | null = null;

  // 1. Check if Gmail is configured via GMAIL_USER + GMAIL_APP_PASSWORD
  if (gmailUser && gmailPass) {
    console.log(`[EmailService] Creating Gmail transport using account: ${gmailUser}`);
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });
  } else if (smtpHost && smtpUser && smtpPass) {
    // 2. Fallback to generic SMTP
    console.log(`[EmailService] Creating SMTP transport using host: ${smtpHost}:${smtpPort}`);
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  // If no transport credentials are configured
  if (!transporter) {
    console.log('[EmailService] Neither Gmail (GMAIL_USER & GMAIL_APP_PASSWORD) nor SMTP credentials are set in environment.');
    console.log(`[EmailService] In local dev mode: would send notification to: ${adminRecipient}`);
    console.log(`[EmailService] In local dev mode: would send confirmation email to: ${email}`);
    console.log(`[EmailService] Lead details: ${name} | ${phone} | ${service} | ${budget}`);

    return {
      success: true,
      emailSent: false,
      message: 'Enquiry recorded. Gmail credentials (GMAIL_USER, GMAIL_APP_PASSWORD) not configured on host.',
    };
  }

  try {
    // 1. Admin Alert to DynoDazzle Team
    const adminMailOptions = {
      from: fromEmail,
      to: adminRecipient,
      replyTo: email,
      subject: `[DynoDazzle Lead #${enquiryId}] ${name} - ${service}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #070b14; color: #f1f5f9; padding: 28px; border-radius: 14px; border: 1px solid #1e293b;">
          <div style="border-bottom: 1px solid #1e293b; padding-bottom: 16px; margin-bottom: 20px;">
            <span style="background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">
              New Project Lead
            </span>
            <h2 style="color: #ffffff; margin: 12px 0 4px 0; font-size: 22px;">DynoDazzle Project Inquiry</h2>
            <p style="color: #94a3b8; font-size: 13px; margin: 0;">Ref ID: <code style="color: #38bdf8; font-family: monospace;">#${enquiryId}</code></p>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
              <td style="padding: 10px 0; color: #94a3b8; width: 140px;"><strong>Client Name:</strong></td>
              <td style="padding: 10px 0; color: #ffffff; font-weight: 600;">${name}</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
              <td style="padding: 10px 0; color: #94a3b8;"><strong>Email Address:</strong></td>
              <td style="padding: 10px 0; color: #38bdf8;"><a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">${email}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
              <td style="padding: 10px 0; color: #94a3b8;"><strong>Phone / WhatsApp:</strong></td>
              <td style="padding: 10px 0; color: #34d399; font-weight: 600;"><a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}" style="color: #34d399; text-decoration: none;">${phone}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
              <td style="padding: 10px 0; color: #94a3b8;"><strong>Company:</strong></td>
              <td style="padding: 10px 0; color: #e2e8f0;">${company || '—'}</td>
            </tr>
            <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
              <td style="padding: 10px 0; color: #94a3b8;"><strong>Service Required:</strong></td>
              <td style="padding: 10px 0; color: #818cf8; font-weight: bold;">${service}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #94a3b8;"><strong>Budget Range:</strong></td>
              <td style="padding: 10px 0; color: #fbbf24; font-weight: bold;">${budget}</td>
            </tr>
          </table>

          <div style="background: #0f172a; padding: 18px; border-radius: 10px; border: 1px solid #1e293b; margin-bottom: 20px;">
            <p style="margin: 0 0 8px 0; color: #94a3b8; font-size: 12px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.05em;">Project Requirements</p>
            <p style="white-space: pre-wrap; color: #cbd5e1; line-height: 1.6; margin: 0; font-size: 14px;">${message}</p>
          </div>

          <div style="padding: 12px 16px; background: rgba(56, 189, 248, 0.08); border-radius: 8px; font-size: 12px; color: #94a3b8;">
            Quick Action: <a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(name)}%2C%20thank%20you%20for%20reaching%20out%20to%20DynoDazzle%20regarding%20${encodeURIComponent(service)}." style="color: #34d399; font-weight: bold; text-decoration: none;">Reply on WhatsApp →</a>
          </div>
        </div>
      `,
    };

    // 2. Client Confirmation Email
    const userMailOptions = {
      from: fromEmail,
      to: email,
      subject: `Enquiry Received — DynoDazzle (Ref: #${enquiryId})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #070b14; color: #f1f5f9; padding: 32px; border-radius: 14px; border: 1px solid #1e293b;">
          <div style="text-align: center; margin-bottom: 28px;">
            <h1 style="color: #38bdf8; font-size: 28px; margin: 0; letter-spacing: -0.5px; font-weight: 800;">DynoDazzle</h1>
            <p style="color: #94a3b8; font-size: 13px; margin-top: 6px; letter-spacing: 0.05em; text-transform: uppercase;">Technology • Digital Services • Solutions</p>
          </div>
          
          <h2 style="color: #ffffff; font-size: 19px; margin: 0 0 12px 0;">Hello ${name},</h2>
          <p style="color: #cbd5e1; line-height: 1.6; font-size: 14px; margin-bottom: 20px;">
            Thank you for reaching out to <strong>DynoDazzle</strong>. We have received your project enquiry regarding <strong>${service}</strong> and our team has started reviewing your requirements.
          </p>

          <div style="background: #0f172a; padding: 20px; border-radius: 10px; border: 1px solid #1e293b; margin: 20px 0;">
            <p style="margin: 0 0 12px 0; color: #38bdf8; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Your Enquiry Summary</p>
            <div style="font-size: 13px; color: #cbd5e1; line-height: 1.8;">
              <div>• <strong>Service:</strong> <span style="color: #ffffff;">${service}</span></div>
              <div>• <strong>Budget Range:</strong> <span style="color: #fbbf24;">${budget}</span></div>
              <div>• <strong>Reference ID:</strong> <span style="color: #38bdf8; font-family: monospace;">#${enquiryId}</span></div>
            </div>
          </div>

          <p style="color: #cbd5e1; line-height: 1.6; font-size: 14px;">
            One of our technology specialists will connect with you via email or phone shortly to discuss next steps, milestones, and deliverable timelines.
          </p>

          <div style="margin-top: 24px; padding: 18px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 10px; text-align: center;">
            <p style="margin: 0 0 10px 0; color: #34d399; font-weight: 600; font-size: 14px;">Need a faster response or direct assistance?</p>
            <a href="https://wa.me/917770032149?text=Hello%20DynoDazzle%2C%20following%20up%20on%20my%20enquiry%20%23${enquiryId}" style="display: inline-block; background: #10b981; color: #022c22; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 14px;">
              Chat With Us on WhatsApp (+91 7770032149) →
            </a>
          </div>

          <hr style="border-color: #1e293b; margin: 28px 0 20px 0;" />
          <div style="color: #64748b; font-size: 12px; line-height: 1.6;">
            <p style="margin: 2px 0;"><strong>DynoDazzle</strong> • Building Digital Solutions With Purpose</p>
            <p style="margin: 2px 0;">Website: <a href="https://dynodazzle.in" style="color: #38bdf8; text-decoration: none;">dynodazzle.in</a> | Email: <a href="mailto:dynodazzle@gmail.com" style="color: #38bdf8; text-decoration: none;">dynodazzle@gmail.com</a></p>
          </div>
        </div>
      `,
    };

    // Send both in parallel
    const [adminInfo, userInfo] = await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    console.log(`[EmailService] Admin email sent: ${adminInfo.messageId}`);
    console.log(`[EmailService] Client confirmation email sent to ${email}: ${userInfo.messageId}`);

    return {
      success: true,
      emailSent: true,
      message: 'Confirmation and notification emails sent successfully via Gmail/SMTP.',
    };
  } catch (error: unknown) {
    console.error('[EmailService] Email delivery failed:', error);
    return {
      success: false,
      emailSent: false,
      message: error instanceof Error ? error.message : 'Email delivery error',
    };
  }
}

/**
 * Creates or gets the active email transporter
 */
export function getEmailTransporter(): Transporter | null {
  const gmailUser = (
    process.env.GMAIL_USER ||
    (process.env.SMTP_USER && process.env.SMTP_USER.includes('@gmail.com') ? process.env.SMTP_USER : undefined) ||
    'dynodazzle@gmail.com'
  ).trim();
  const rawGmailPass = (
    process.env.GMAIL_APP_PASSWORD ||
    process.env.SMTP_PASSWORD ||
    'jshs kpmh yfrh sbbn'
  ).trim();
  const gmailPass = rawGmailPass.replace(/\s+/g, '');

  if (gmailUser && gmailPass) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASSWORD;
  const smtpSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;

  if (smtpHost && smtpUser && smtpPass) {
    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  }

  return null;
}

/**
 * Sends a 6-digit OTP to dynodazzle@gmail.com for admin login verification
 */
export async function sendAdminOtpEmail(toEmail: string, otpCode: string): Promise<boolean> {
  const transporter = getEmailTransporter();
  const gmailUser = (process.env.GMAIL_USER || 'dynodazzle@gmail.com').trim();
  const fromEmail = `DynoDazzle Security <${gmailUser}>`;

  if (!transporter) {
    console.warn('[EmailService] Transporter not configured. Simulation OTP:', otpCode);
    return false;
  }

  try {
    const mailOptions = {
      from: fromEmail,
      to: toEmail,
      subject: `[DynoDazzle Security] Your Admin Login Verification Code: ${otpCode}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 540px; margin: 0 auto; background: #070b14; color: #f1f5f9; padding: 32px; border-radius: 14px; border: 1px solid #1e293b;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #38bdf8; font-size: 26px; margin: 0; font-weight: 800; letter-spacing: -0.5px;">DynoDazzle</h1>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.08em;">Administrative Control Portal</p>
          </div>

          <div style="background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 10px; padding: 20px; text-align: center; margin: 24px 0;">
            <p style="color: #94a3b8; font-size: 13px; margin: 0 0 12px 0;">Your one-time verification code is:</p>
            <div style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #38bdf8; font-family: monospace; background: #0b1329; padding: 14px 20px; border-radius: 8px; display: inline-block; border: 1px solid #1e293b;">
              ${otpCode}
            </div>
            <p style="color: #64748b; font-size: 12px; margin: 12px 0 0 0;">Valid for <strong>10 minutes</strong>. Do not disclose this code to anyone.</p>
          </div>

          <p style="color: #cbd5e1; font-size: 13px; line-height: 1.6;">
            A login attempt was initiated for the DynoDazzle administrative control panel. If this was not you, please ensure your password remains secure.
          </p>

          <hr style="border-color: #1e293b; margin: 24px 0 16px 0;" />
          <div style="color: #64748b; font-size: 11px; text-align: center;">
            DynoDazzle Technologies &bull; Secure Authentication Service &bull; dynodazzle.in
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] OTP email sent to ${toEmail}. Message ID: ${info.messageId}`);
    return true;
  } catch (err) {
    console.error('[EmailService] Failed to send admin OTP email:', err);
    return false;
  }
}

/**
 * Sends a direct email reply from admin (dynodazzle@gmail.com) to a client enquiry
 */
export async function sendAdminReplyEmail(params: {
  clientEmail: string;
  clientName: string;
  subject: string;
  messageBody: string;
  enquiryId?: string;
}): Promise<{ success: boolean; error?: string }> {
  const { clientEmail, clientName, subject, messageBody, enquiryId } = params;
  const transporter = getEmailTransporter();
  const gmailUser = (process.env.GMAIL_USER || 'dynodazzle@gmail.com').trim();
  const fromEmail = `DynoDazzle <${gmailUser}>`;

  if (!transporter) {
    return { success: false, error: 'Email transporter not configured' };
  }

  try {
    const mailOptions = {
      from: fromEmail,
      to: clientEmail,
      cc: gmailUser,
      replyTo: gmailUser,
      subject: subject || `Regarding your enquiry with DynoDazzle`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #070b14; color: #f1f5f9; padding: 32px; border-radius: 14px; border: 1px solid #1e293b;">
          <div style="border-bottom: 1px solid #1e293b; padding-bottom: 16px; margin-bottom: 20px;">
            <h1 style="color: #38bdf8; font-size: 24px; margin: 0; font-weight: 800;">DynoDazzle</h1>
            <p style="color: #94a3b8; font-size: 12px; margin-top: 4px;">Technology &bull; Digital Services &bull; Solutions</p>
          </div>

          <h2 style="color: #ffffff; font-size: 18px; margin: 0 0 16px 0;">Hello ${clientName},</h2>
          
          <div style="color: #cbd5e1; font-size: 14px; line-height: 1.7; white-space: pre-wrap; background: #0f172a; padding: 20px; border-radius: 10px; border: 1px solid #1e293b; margin-bottom: 24px;">
${messageBody}
          </div>

          <div style="padding: 16px; background: rgba(56, 189, 248, 0.08); border-radius: 10px; border: 1px solid rgba(56, 189, 248, 0.2); margin-bottom: 24px;">
            <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: bold; color: #38bdf8;">Have questions or need immediate updates?</p>
            <p style="margin: 0; font-size: 13px; color: #94a3b8;">
              You can reply directly to this email, or connect with us on WhatsApp at 
              <a href="https://wa.me/917770032149" style="color: #34d399; font-weight: bold; text-decoration: none;">+91 7770032149</a>.
            </p>
          </div>

          <hr style="border-color: #1e293b; margin: 24px 0 16px 0;" />
          <div style="color: #64748b; font-size: 12px; line-height: 1.6;">
            <p style="margin: 2px 0;"><strong>DynoDazzle Team</strong></p>
            <p style="margin: 2px 0;">Website: <a href="https://dynodazzle.in" style="color: #38bdf8; text-decoration: none;">dynodazzle.in</a> &bull; Email: <a href="mailto:dynodazzle@gmail.com" style="color: #38bdf8; text-decoration: none;">dynodazzle@gmail.com</a></p>
            ${enquiryId ? `<p style="margin: 4px 0 0 0; font-size: 11px; color: #475569;">Reference: #${enquiryId}</p>` : ''}
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Admin reply email sent to ${clientEmail}. Message ID: ${info.messageId}`);
    return { success: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[EmailService] Failed to send admin reply email:', msg);
    return { success: false, error: msg };
  }
}

