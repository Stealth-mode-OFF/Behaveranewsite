-- Supabase Lead Submission Setup
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/jugjqgkguozarsmclgse/sql/new

-- Create leads table
create table if not exists leads (
  id uuid primary key default uuid_generate_v4(),
  email text not null,
  name text,
  first_name text,
  last_name text,
  phone text,
  company text,
  company_size text,
  role text,
  source text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create index on email for faster lookups
create index if not exists leads_email_idx on leads(email);

-- Create index on source for analytics
create index if not exists leads_source_idx on leads(source);

-- Create index on created_at for time-based queries
create index if not exists leads_created_at_idx on leads(created_at desc);

-- Enable Row Level Security
alter table leads enable row level security;

-- Allow inserts from anyone (for form submissions)
create policy "Allow anonymous inserts"
  on leads for insert
  to anon
  with check (true);

-- Allow reading for authenticated users only (for admin dashboard)
create policy "Allow authenticated reads"
  on leads for select
  to authenticated
  using (true);

-- Allow service role full access
create policy "Allow service role full access"
  on leads for all
  to service_role
  using (true);

-- Success message
select 'Leads table created successfully! 🎉' as message;
