import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseClient: SupabaseClient | null = null;
let isInitialized = false;

/**
 * Lazy initialization of Supabase client to prevent startup crash if keys are not provided.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (isInitialized) {
    return supabaseClient;
  }

  const supabaseProjectId = process.env.SUPABASE_PROJECT_ID || 'apkhcyxwflxespvenioo';
  const supabaseUrl =
    process.env.SUPABASE_URL ||
    (supabaseProjectId ? `https://${supabaseProjectId}.supabase.co` : undefined) ||
    'https://apkhcyxwflxespvenioo.supabase.co';
  // Prefer service role key for backend writes that bypass RLS, fallback to anon or publishable key
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    'sb_publishable_PM9Gdj6_EDzMTvaBN2pmOQ_BofbfchY';

  if (supabaseUrl && supabaseKey) {
    try {
      supabaseClient = createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      });
      console.log('[Supabase] Client initialized successfully for URL:', supabaseUrl);
    } catch (err) {
      console.error('[Supabase] Failed to initialize Supabase client:', err);
      supabaseClient = null;
    }
  } else {
    console.log('[Supabase] Environment variables (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY) not provided. Operating in local storage mode.');
  }

  isInitialized = true;
  return supabaseClient;
}

export interface SupabaseEnquiryRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  service: string;
  budget: string;
  message: string;
  status: string;
  ip_address?: string;
  user_agent?: string;
  email_sent: boolean;
  created_at?: string;
}

/**
 * Inserts an enquiry into Supabase database table `enquiries`
 */
export async function insertEnquiryToSupabase(record: SupabaseEnquiryRecord): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase client not configured' };
  }

  try {
    const { error } = await client
      .from('enquiries')
      .insert([
        {
          id: record.id,
          name: record.name,
          email: record.email,
          phone: record.phone,
          company: record.company || null,
          service: record.service,
          budget: record.budget,
          message: record.message,
          status: record.status || 'new',
          ip_address: record.ip_address || null,
          user_agent: record.user_agent || null,
          email_sent: record.email_sent,
          created_at: record.created_at || new Date().toISOString(),
        },
      ]);

    if (error) {
      if (error.code === '42501') {
        console.warn('[Supabase] RLS policy blocked insert (Error 42501). To allow inserts with anon/publishable key, run: CREATE POLICY "Allow anon insert" ON public.enquiries FOR INSERT TO anon WITH CHECK (true); in Supabase SQL editor, or set SUPABASE_SERVICE_ROLE_KEY.');
      } else {
        console.error('[Supabase] Error inserting enquiry row:', error.message);
      }
      return { success: false, error: error.message };
    }

    console.log(`[Supabase] Successfully stored enquiry ${record.id} in Supabase table 'enquiries'`);
    return { success: true };
  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error('[Supabase] Exception while inserting enquiry:', errMsg);
    return { success: false, error: errMsg };
  }
}

/**
 * Update email_sent status in Supabase
 */
export async function updateEnquiryEmailStatusInSupabase(id: string, emailSent: boolean): Promise<void> {
  const client = getSupabaseClient();
  if (!client) return;

  try {
    const { error } = await client
      .from('enquiries')
      .update({ email_sent: emailSent })
      .eq('id', id);

    if (error) {
      console.warn(`[Supabase] Failed to update email_sent status for ${id}:`, error.message);
    }
  } catch (err) {
    console.warn(`[Supabase] Exception updating email_sent status for ${id}:`, err);
  }
}
