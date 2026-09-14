-- DynoDazzle Supabase Database Schema
-- Run this in your Supabase Project -> SQL Editor to create the enquiries table and policies.

CREATE TABLE IF NOT EXISTS public.enquiries (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  service TEXT NOT NULL,
  budget TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  email_sent BOOLEAN DEFAULT false NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- 1. Allow anon / publishable key to insert enquiry submissions
DROP POLICY IF EXISTS "Allow anon insert" ON public.enquiries;
CREATE POLICY "Allow anon insert" ON public.enquiries
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 2. Allow anon / publishable key to update email_sent status
DROP POLICY IF EXISTS "Allow anon update" ON public.enquiries;
CREATE POLICY "Allow anon update" ON public.enquiries
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- 3. Allow backend service role key full access to insert, select, update
DROP POLICY IF EXISTS "Service role full access" ON public.enquiries;
CREATE POLICY "Service role full access" ON public.enquiries
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Add index on created_at and email for fast filtering
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON public.enquiries (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_enquiries_email ON public.enquiries (email);
