-- ============================================================
-- Echo Pulse Invitations Table — Supabase Migration
-- ============================================================
-- Stores teammate invitation intents created during onboarding.
-- GDPR note: Only emails the user EXPLICITLY selected are stored.
-- The full imported contact list is NEVER persisted.
-- ============================================================

CREATE TABLE IF NOT EXISTS public.invitations (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  inviter_email TEXT NOT NULL,
  inviter_name  TEXT DEFAULT '',
  company_name  TEXT DEFAULT '',
  invitee_email TEXT NOT NULL,
  invitee_name  TEXT DEFAULT '',
  source        TEXT DEFAULT 'manual'
                  CHECK (source IN ('google', 'microsoft', 'manual', 'csv')),
  status        TEXT DEFAULT 'pending'
                  CHECK (status IN ('pending', 'sent', 'accepted', 'expired', 'cancelled')),
  created_at    TIMESTAMPTZ DEFAULT now(),
  sent_at       TIMESTAMPTZ,
  accepted_at   TIMESTAMPTZ
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_invitations_inviter
  ON public.invitations (inviter_email);
CREATE INDEX IF NOT EXISTS idx_invitations_invitee
  ON public.invitations (invitee_email);
CREATE INDEX IF NOT EXISTS idx_invitations_status
  ON public.invitations (status);
CREATE INDEX IF NOT EXISTS idx_invitations_company
  ON public.invitations (company_name);

-- Row Level Security
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (from the API with service key)
CREATE POLICY "Allow anon insert invitations"
  ON public.invitations FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow service_role full access
CREATE POLICY "Service role full access invitations"
  ON public.invitations FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to read their own invitations
CREATE POLICY "Authenticated read own invitations"
  ON public.invitations FOR SELECT
  TO authenticated
  USING (
    inviter_email = auth.jwt()->>'email'
    OR invitee_email = auth.jwt()->>'email'
  );
