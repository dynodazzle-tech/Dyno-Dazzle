import fs from 'fs';
import path from 'path';
import { insertEnquiryToSupabase, updateEnquiryEmailStatusInSupabase } from './supabaseService';

export interface StoredEnquiry {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  budget: string;
  message: string;
  emailSent: boolean;
  status: 'new' | 'reviewed' | 'contacted' | 'in_progress' | 'converted' | 'closed';
  ip?: string;
  userAgent?: string;
  adminNotes?: string;
  lastContactedAt?: string;
  replies?: Array<{
    sentAt: string;
    sentBy: string;
    subject: string;
    body: string;
  }>;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const ENQUIRIES_FILE = path.join(DATA_DIR, 'enquiries.json');

// Ensure data directory exists
function ensureStorage() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(ENQUIRIES_FILE)) {
      fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('[Storage] Error ensuring storage directory:', err);
  }
}

export async function saveEnquiry(enquiry: Omit<StoredEnquiry, 'id' | 'timestamp' | 'status'>): Promise<StoredEnquiry> {
  ensureStorage();
  
  const id = `dd-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const fullEnquiry: StoredEnquiry = {
    id,
    timestamp: new Date().toISOString(),
    status: 'new',
    ...enquiry,
  };

  // 1. Local backup persistence
  try {
    const raw = fs.readFileSync(ENQUIRIES_FILE, 'utf-8');
    const list: StoredEnquiry[] = JSON.parse(raw || '[]');
    list.unshift(fullEnquiry);
    // Keep last 1000 enquiries in JSON file
    fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify(list.slice(0, 1000), null, 2), 'utf-8');
    console.log(`[Storage] Saved enquiry ${id} from ${fullEnquiry.name} (${fullEnquiry.email}) to local storage`);
  } catch (err) {
    console.error('[Storage] Failed to save enquiry to local file:', err);
  }

  // 2. Supabase Cloud Database persistence
  try {
    await insertEnquiryToSupabase({
      id: fullEnquiry.id,
      name: fullEnquiry.name,
      email: fullEnquiry.email,
      phone: fullEnquiry.phone,
      company: fullEnquiry.company,
      service: fullEnquiry.service,
      budget: fullEnquiry.budget,
      message: fullEnquiry.message,
      status: fullEnquiry.status,
      ip_address: fullEnquiry.ip,
      user_agent: fullEnquiry.userAgent,
      email_sent: fullEnquiry.emailSent,
      created_at: fullEnquiry.timestamp,
    });
  } catch (err) {
    console.error('[Storage] Supabase push error:', err);
  }

  return fullEnquiry;
}

export async function updateEnquiryEmailStatus(id: string, emailSent: boolean): Promise<void> {
  // Update local file
  try {
    const raw = fs.readFileSync(ENQUIRIES_FILE, 'utf-8');
    const list: StoredEnquiry[] = JSON.parse(raw || '[]');
    const item = list.find((e) => e.id === id);
    if (item) {
      item.emailSent = emailSent;
      fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify(list, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('[Storage] Could not update local email status:', err);
  }

  // Update Supabase
  await updateEnquiryEmailStatusInSupabase(id, emailSent);
}

export function getAllEnquiries(): StoredEnquiry[] {
  ensureStorage();
  try {
    const raw = fs.readFileSync(ENQUIRIES_FILE, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch {
    return [];
  }
}

