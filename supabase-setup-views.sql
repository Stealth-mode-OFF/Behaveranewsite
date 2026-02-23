-- ============================================================
-- Behavera Onboarding — Supabase Views
-- Spusť v Supabase SQL Editor (https://supabase.com/dashboard)
-- Po spuštění se views objeví v Table Editor jako tabulky
-- ============================================================

-- 1. DROP old views if they exist
DROP VIEW IF EXISTS v_onboarding_overview CASCADE;
DROP VIEW IF EXISTS v_onboarding_summary CASCADE;

-- ============================================================
-- VIEW: v_onboarding_overview
-- Flat pohled — každý řádek = 1 člen týmu s kompletním kontextem
-- ============================================================
CREATE OR REPLACE VIEW v_onboarding_overview AS
SELECT
  -- Company
  s.company_name                              AS "Firma",
  s.company_id                                AS "IČO",
  CASE s.billing_interval
    WHEN 'yearly'  THEN 'Roční'
    WHEN 'monthly' THEN 'Měsíční'
    ELSE s.billing_interval
  END                                         AS "Plán",
  s.employee_count                            AS "Zaměstnanců",
  CASE s.billing_interval
    WHEN 'yearly'  THEN s.employee_count * 99
    WHEN 'monthly' THEN s.employee_count * 129
    ELSE 0
  END                                         AS "Cena Kč/měs",

  -- Contacts
  s.rep_name                                  AS "Zástupce",
  s.rep_email                                 AS "Email zástupce",
  s.admin_name                                AS "Admin",
  s.admin_email                               AS "Email admin",
  s.billing_email                             AS "Fakturační email",

  -- Team
  t.name                                      AS "Tým",
  t.sort_order + 1                            AS "Tým #",
  t.leader_email                              AS "Team Leader",

  -- Member
  COALESCE(
    NULLIF(m.name, ''),
    INITCAP(REPLACE(SPLIT_PART(m.email, '@', 1), '.', ' '))
  )                                           AS "Člen - celé jméno",
  COALESCE(
    NULLIF(SPLIT_PART(m.name, ' ', 1), ''),
    INITCAP(SPLIT_PART(SPLIT_PART(m.email, '@', 1), '.', 1))
  )                                           AS "Jméno",
  COALESCE(
    NULLIF(
      TRIM(SUBSTRING(m.name FROM POSITION(' ' IN m.name))),
      ''
    ),
    INITCAP(SPLIT_PART(SPLIT_PART(m.email, '@', 1), '.', 2))
  )                                           AS "Příjmení",
  m.email                                     AS "Email člena",

  -- Meta
  s.oauth_provider                            AS "OAuth",
  s.status                                    AS "Status",
  s.pipedrive_person_id                       AS "Pipedrive Person",
  s.pipedrive_lead_id                         AS "Pipedrive Lead",
  s.agreed_to_terms                           AS "Souhlas s podmínkami",
  TO_CHAR(s.created_at AT TIME ZONE 'Europe/Prague', 'DD.MM.YYYY HH24:MI') AS "Datum",
  s.id                                        AS "Submission ID",
  t.id                                        AS "Team ID"

FROM onboarding_submissions s
LEFT JOIN onboarding_teams t        ON t.submission_id = s.id
LEFT JOIN onboarding_team_members m ON m.team_id = t.id
ORDER BY s.created_at DESC, t.sort_order, m.email;


-- ============================================================
-- VIEW: v_onboarding_summary
-- Souhrn per firma — 1 řádek = 1 onboarding submission
-- ============================================================
CREATE OR REPLACE VIEW v_onboarding_summary AS
SELECT
  s.company_name                              AS "Firma",
  s.company_id                                AS "IČO",
  s.rep_name                                  AS "Zástupce",
  s.rep_email                                 AS "Email zástupce",
  s.admin_name                                AS "Admin",
  s.admin_email                               AS "Email admin",
  s.billing_email                             AS "Fakturační email",
  s.employee_count                            AS "Zaměstnanců",
  CASE s.billing_interval
    WHEN 'yearly'  THEN 'Roční'
    WHEN 'monthly' THEN 'Měsíční'
    ELSE s.billing_interval
  END                                         AS "Plán",
  CASE s.billing_interval
    WHEN 'yearly'  THEN s.employee_count * 99
    WHEN 'monthly' THEN s.employee_count * 129
    ELSE 0
  END                                         AS "Cena Kč/měs",
  (SELECT COUNT(*) FROM onboarding_teams t WHERE t.submission_id = s.id)
                                              AS "Počet týmů",
  (SELECT COUNT(*) FROM onboarding_team_members m
   JOIN onboarding_teams t ON t.id = m.team_id
   WHERE t.submission_id = s.id)
                                              AS "Počet členů",
  (SELECT STRING_AGG(t.name, ', ' ORDER BY t.sort_order)
   FROM onboarding_teams t WHERE t.submission_id = s.id)
                                              AS "Názvy týmů",
  s.oauth_provider                            AS "OAuth",
  s.status                                    AS "Status",
  s.agreed_to_terms                           AS "Souhlas",
  s.pipedrive_person_id                       AS "Pipedrive Person",
  s.pipedrive_lead_id                         AS "Pipedrive Lead",
  TO_CHAR(s.created_at AT TIME ZONE 'Europe/Prague', 'DD.MM.YYYY HH24:MI') AS "Datum",
  s.id                                        AS "ID"

FROM onboarding_submissions s
ORDER BY s.created_at DESC;


-- ============================================================
-- Grants — aby views byly čitelné přes API (anon + authenticated)
-- ============================================================
GRANT SELECT ON v_onboarding_overview TO authenticated;
GRANT SELECT ON v_onboarding_summary  TO authenticated;

-- Pokud chceš i přes service_role (admin dashboard apod.)
GRANT SELECT ON v_onboarding_overview TO service_role;
GRANT SELECT ON v_onboarding_summary  TO service_role;

-- ============================================================
-- Hotovo! Otevři Table Editor → v levém menu uvidíš:
--   📊 v_onboarding_overview  (flat detail)
--   📊 v_onboarding_summary   (souhrn per firma)
-- ============================================================
