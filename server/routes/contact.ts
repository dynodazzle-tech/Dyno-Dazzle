import express, { Request, Response } from 'express';
import { saveEnquiry, updateEnquiryEmailStatus } from '../services/storageService';
import { sendEnquiryEmails } from '../services/emailService';

const router = express.Router();

// Email regex validation
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Clean phone validation (digits, plus, spaces, dashes, parentheses)
const PHONE_CLEAN_REGEX = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\./0-9]{6,16}$/;

function sanitize(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/[<>]/g, ''); // strip angle brackets
}

router.post('/contact', async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      service,
      budget,
      message,
      consent,
      honeypot,
    } = req.body;

    // 1. Anti-bot honeypot check
    if (honeypot && String(honeypot).trim() !== '') {
      console.warn('[Contact Route] Bot activity caught via honeypot field.');
      // Return 200 so bots think they succeeded without flooding storage
      return res.status(200).json({
        success: true,
        message: 'Your enquiry has been received by DynoDazzle.',
        enquiryId: 'dd-bot-filtered',
        emailSent: false,
      });
    }

    const cleanName = sanitize(name);
    const cleanEmail = sanitize(email).toLowerCase();
    const cleanPhone = sanitize(phone);
    const cleanCompany = sanitize(company);
    const cleanService = sanitize(service);
    const cleanBudget = sanitize(budget);
    const cleanMessage = sanitize(message);

    const errors: Record<string, string> = {};

    if (!cleanName || cleanName.length < 2) {
      errors.name = 'Please enter your full name (at least 2 characters).';
    }

    if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (!cleanPhone || !PHONE_CLEAN_REGEX.test(cleanPhone)) {
      errors.phone = 'Please enter a valid phone number (at least 7 digits).';
    }

    if (!cleanService) {
      errors.service = 'Please select a required service category.';
    }

    if (!cleanBudget) {
      errors.budget = 'Please select your estimated budget range.';
    }

    if (!cleanMessage || cleanMessage.length < 10) {
      errors.message = 'Please provide details about your project (at least 10 characters).';
    }

    if (!consent) {
      errors.consent = 'Please agree to be contacted regarding your enquiry.';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Please review and complete all required fields.',
        errors,
      });
    }

    // 2. Persist to storage
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    const saved = await saveEnquiry({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      company: cleanCompany,
      service: cleanService,
      budget: cleanBudget,
      message: cleanMessage,
      emailSent: false,
      ip: clientIp,
      userAgent,
    });

    // 3. Dispatch emails (notification & user confirmation)
    let emailStatus = false;
    try {
      const emailResult = await sendEnquiryEmails({
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        company: cleanCompany,
        service: cleanService,
        budget: cleanBudget,
        message: cleanMessage,
        enquiryId: saved.id,
      });
      emailStatus = emailResult.emailSent;
      if (emailStatus) {
        await updateEnquiryEmailStatus(saved.id, true);
      }
    } catch (emailErr) {
      console.error('[Contact Route] Email trigger error:', emailErr);
      // We do not fail the request if database/file save succeeded!
    }

    return res.status(200).json({
      success: true,
      message: 'Your enquiry has been received by DynoDazzle.',
      enquiryId: saved.id,
      emailSent: emailStatus,
    });
  } catch (error: unknown) {
    console.error('[Contact Route] Unexpected error handling contact enquiry:', error);
    return res.status(500).json({
      success: false,
      message: 'Something went wrong while sending your enquiry. Please try again or contact us on WhatsApp.',
    });
  }
});

export default router;
