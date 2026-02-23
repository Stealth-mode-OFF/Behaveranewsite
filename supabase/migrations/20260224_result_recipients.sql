-- Add result_recipients column to onboarding_teams
-- Stores an array of emails that should receive evaluation results for this team
-- The team leader is always included by default in the frontend

ALTER TABLE onboarding_teams
  ADD COLUMN IF NOT EXISTS result_recipients text[] DEFAULT '{}';

-- Update the v_onboarding_overview view to include result_recipients
DROP VIEW IF EXISTS v_onboarding_overview;

CREATE VIEW v_onboarding_overview AS
SELECT
  s.id                     AS submission_id,
  s.company_name,
  s.company_id,
  s.rep_name,
  s.rep_email,
  s.billing_email,
  s.admin_name,
  s.admin_email,
  s.employee_count,
  s.billing_interval,
  s.oauth_provider,
  s.created_at             AS submitted_at,
  t.id                     AS team_id,
  t.name                   AS team_name,
  t.leader_email,
  t.result_recipients,
  t.sort_order,
  m.id                     AS member_id,
  m.name                   AS member_name,
  m.email                  AS member_email,
  m.photo_url              AS member_photo
FROM onboarding_submissions s
LEFT JOIN onboarding_teams   t ON t.submission_id = s.id
LEFT JOIN onboarding_team_members m ON m.team_id = t.id
ORDER BY s.created_at DESC, t.sort_order, m.email;
