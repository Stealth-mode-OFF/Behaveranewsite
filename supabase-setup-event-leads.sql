-- Supabase Event Leads table setup
-- Run this in Supabase SQL Editor

-- Create event_leads table (separate from generic leads table)
create table if not exists event_leads (
  id uuid primary key default uuid_generate_v4(),

  -- Core fields
  email text not null,
  company text not null,
  phone text,
  contact_name text,

  -- Qualification
  employees_bucket text not null,       -- '1-49' | '50-199' | '200-999' | '1000+'
  feedback_frequency text not null,     -- 'no' | 'ad_hoc' | 'quarterly' | 'monthly_plus'
  decision_role text not null,          -- 'decision_maker' | 'co_decision_maker' | 'connector'

  -- GDPR consent
  consent_contact boolean not null default false,
  consent_marketing boolean not null default false,
  consent_privacy_url text,
  consent_version text,

  -- Tracking / source
  source_page text default 'behavera.com/scan_QR',
  source_src text,
  source_rep text,
  source_booth text,
  source_event text,
  source_meta jsonb,

  -- Client info
  client_user_agent text,
  client_locale text,
  client_tz text,

  -- Timestamps
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Indexes
create index if not exists event_leads_email_idx on event_leads(email);
create index if not exists event_leads_source_event_idx on event_leads(source_event);
create index if not exists event_leads_created_at_idx on event_leads(created_at desc);

-- Row Level Security
alter table event_leads enable row level security;

-- Allow anonymous inserts (for serverless function via service key)
create policy "Allow anonymous inserts"
  on event_leads for insert
  to anon
  with check (true);

-- Allow authenticated reads (admin)
create policy "Allow authenticated reads"
  on event_leads for select
  to authenticated
  using (true);

-- Allow service role full access
create policy "Allow service role full access"
  on event_leads for all
  to service_role
  using (true);

select 'event_leads table created successfully!' as message;
