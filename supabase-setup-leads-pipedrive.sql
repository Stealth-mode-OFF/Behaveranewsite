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

-- ── event_leads table ──
ALTER TABLE event_leads
  ADD COLUMN IF NOT EXISTS processed boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS event_leads_processed_idx ON event_leads(processed);

-- ── RLS: allow authenticated updates for toggling processed in admin ──
DO $$
BEGIN
  -- leads update policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'leads' AND policyname = 'Allow authenticated updates'
  ) THEN
    CREATE POLICY "Allow authenticated updates" ON leads FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;

  -- event_leads update policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'event_leads' AND policyname = 'Allow authenticated updates'
  ) THEN
    CREATE POLICY "Allow authenticated updates" ON event_leads FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

SELECT 'Pipedrive + processed columns added to leads & event_leads ✅' AS message;
