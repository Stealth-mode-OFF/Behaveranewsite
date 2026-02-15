-- Supabase Onboarding Data Setup
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/jugjqgkguozarsmclgse/sql/new
-- This creates tables to store the COMPLETE onboarding flow data:
-- company info, ARES registry data, teams, team members, OAuth contacts

-- ─── 1. Onboarding Submissions ───
create table if not exists onboarding_submissions (
  id uuid primary key default gen_random_uuid(),
  
  -- Company info (Step 1)
  company_name text not null,
  company_id text,                         -- IČO from Czech ARES registry
  rep_name text not null,
  rep_email text not null,
  billing_email text,
  admin_name text,
  admin_email text,
  employee_count integer,
  
  -- Plan choice (Step 4)
  billing_interval text check (billing_interval in ('monthly', 'yearly')),
  agreed_to_terms boolean default false,
  
  -- OAuth source (Step 2)
  oauth_provider text check (oauth_provider in ('google', 'microsoft', null)),
  
  -- Processing metadata
  status text not null default 'new' check (status in ('new', 'contacted', 'onboarding', 'active', 'rejected')),
  pipedrive_person_id integer,
  pipedrive_lead_id text,
  notes text,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── 2. Onboarding Teams ───
create table if not exists onboarding_teams (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references onboarding_submissions(id) on delete cascade,
  name text not null,
  leader_email text,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- ─── 3. Onboarding Team Members ───
create table if not exists onboarding_team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references onboarding_teams(id) on delete cascade,
  name text not null default '',
  email text not null,
  photo_url text default '',
  created_at timestamptz default now()
);

-- ─── Indexes ───
create index if not exists onboarding_submissions_email_idx on onboarding_submissions(rep_email);
create index if not exists onboarding_submissions_company_id_idx on onboarding_submissions(company_id);
create index if not exists onboarding_submissions_status_idx on onboarding_submissions(status);
create index if not exists onboarding_submissions_created_idx on onboarding_submissions(created_at desc);
create index if not exists onboarding_teams_submission_idx on onboarding_teams(submission_id);
create index if not exists onboarding_team_members_team_idx on onboarding_team_members(team_id);

-- ─── Row Level Security ───
alter table onboarding_submissions enable row level security;
alter table onboarding_teams enable row level security;
alter table onboarding_team_members enable row level security;

-- Service role can do everything (used by API endpoint)
create policy "Service role full access on submissions"
  on onboarding_submissions for all to service_role using (true);

create policy "Service role full access on teams"
  on onboarding_teams for all to service_role using (true);

create policy "Service role full access on members"
  on onboarding_team_members for all to service_role using (true);

-- Anon can insert (for form submissions via API)
create policy "Allow anon insert submissions"
  on onboarding_submissions for insert to anon with check (true);

create policy "Allow anon insert teams"
  on onboarding_teams for insert to anon with check (true);

create policy "Allow anon insert members"
  on onboarding_team_members for insert to anon with check (true);

-- Authenticated users can read (admin dashboard)
create policy "Allow authenticated reads on submissions"
  on onboarding_submissions for select to authenticated using (true);

create policy "Allow authenticated reads on teams"
  on onboarding_teams for select to authenticated using (true);

create policy "Allow authenticated reads on members"
  on onboarding_team_members for select to authenticated using (true);

-- ─── Updated_at trigger ───
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger onboarding_submissions_updated_at
  before update on onboarding_submissions
  for each row execute function update_updated_at();

-- ─── Handy view: submissions with team counts ───
create or replace view onboarding_overview as
select
  s.id,
  s.company_name,
  s.company_id,
  s.rep_name,
  s.rep_email,
  s.admin_email,
  s.employee_count,
  s.billing_interval,
  s.oauth_provider,
  s.status,
  s.pipedrive_person_id,
  s.pipedrive_lead_id,
  s.created_at,
  count(distinct t.id) as team_count,
  count(distinct m.id) as total_members
from onboarding_submissions s
left join onboarding_teams t on t.submission_id = s.id
left join onboarding_team_members m on m.team_id = t.id
group by s.id
order by s.created_at desc;

select 'Onboarding tables created successfully! 🎉' as message;
