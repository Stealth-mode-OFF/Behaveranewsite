-- Migration: Add Pipedrive IDs to leads table
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/gruomxlcwerzevjohqdo/sql/new
--
-- Adds pipedrive_lead_id and pipedrive_person_id columns so the admin UI
-- can link directly to each lead in Pipedrive.

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS pipedrive_lead_id text,
  ADD COLUMN IF NOT EXISTS pipedrive_person_id bigint,
  ADD COLUMN IF NOT EXISTS processed boolean NOT NULL DEFAULT false;

-- Index for fast lookups when filtering by Pipedrive presence
CREATE INDEX IF NOT EXISTS leads_pipedrive_lead_id_idx
  ON leads(pipedrive_lead_id)
  WHERE pipedrive_lead_id IS NOT NULL;

-- Index for filtering by processed status
CREATE INDEX IF NOT EXISTS leads_processed_idx ON leads(processed);

-- Allow authenticated users to update (for toggling processed in admin)
CREATE POLICY IF NOT EXISTS "Allow authenticated updates"
  ON leads FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

SELECT 'Pipedrive + processed columns added to leads table ✅' AS message;
