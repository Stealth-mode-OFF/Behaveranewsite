-- Migration: Add Pipedrive IDs + processed column to leads & event_leads tables
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/gruomxlcwerzevjohqdo/sql/new
--
-- Adds pipedrive_lead_id, pipedrive_person_id, processed columns so the admin UI
-- can link directly to Pipedrive and track processing status.

-- ── leads table ──
ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS pipedrive_lead_id text,
  ADD COLUMN IF NOT EXISTS pipedrive_person_id bigint,
  ADD COLUMN IF NOT EXISTS processed boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS leads_pipedrive_lead_id_idx
  ON leads(pipedrive_lead_id)
  WHERE pipedrive_lead_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS leads_processed_idx ON leads(processed);

-- ── event_leads table ── (skipped: table does not exist yet)
-- ALTER TABLE event_leads
--   ADD COLUMN IF NOT EXISTS processed boolean NOT NULL DEFAULT false;
-- CREATE INDEX IF NOT EXISTS event_leads_processed_idx ON event_leads(processed);

-- ── RLS: allow authenticated updates for toggling processed in admin ──
DO $$
BEGIN
  -- leads update policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'leads' AND policyname = 'Allow authenticated updates'
  ) THEN
    CREATE POLICY "Allow authenticated updates" ON leads FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

SELECT 'Pipedrive + processed columns added to leads ✅' AS message;

-- ── admin_audit_log table ──
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  endpoint text NOT NULL,
  method text NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS admin_audit_log_email_idx ON admin_audit_log(email);
CREATE INDEX IF NOT EXISTS admin_audit_log_timestamp_idx ON admin_audit_log(timestamp DESC);

ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'admin_audit_log' AND policyname = 'Service role full access'
  ) THEN
    CREATE POLICY "Service role full access" ON admin_audit_log FOR ALL TO service_role USING (true) WITH CHECK (true);
  END IF;
END $$;
