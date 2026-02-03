# Supabase Setup for Echo Pulse CMS

Since you opted to set up the connection later, here are the instructions to prepare your Supabase database when you are ready.

## 1. Create Tables

Run the following SQL in your Supabase SQL Editor:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Authors Table (Optional, or link to auth.users)
create table authors (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  avatar text,
  role text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Blog Posts Table
create table posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text, -- HTML content
  cover_image text,
  author_id uuid references authors(id),
  status text check (status in ('draft', 'published')) default 'draft',
  tags text[], -- Array of strings
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Case Studies Table
create table case_studies (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  client_name text,
  industry text,
  challenge text,
  solution text,
  results jsonb, -- Store array of {label, value} objects
  content text,
  cover_image text,
  status text check (status in ('draft', 'published')) default 'draft',
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Storage Buckets
-- You will need to create a public storage bucket named 'cms-images' for uploading covers.
```

## 2. Row Level Security (RLS)

Don't forget to enable RLS to protect your data.

```sql
alter table posts enable row level security;
alter table case_studies enable row level security;

-- Public read access
create policy "Public posts are viewable by everyone" on posts
  for select using (status = 'published');

create policy "Public case studies are viewable by everyone" on case_studies
  for select using (status = 'published');

-- Admin write access (Assuming authenticated users are admins for now)
create policy "Admins can do everything" on posts
  for all using (auth.role() = 'authenticated');

create policy "Admins can do everything" on case_studies
  for all using (auth.role() = 'authenticated');
```

## 3. Connecting to the App

1. Install Supabase client: `npm install @supabase/supabase-js`
2. Create `.env` file with:
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
3. Update `src/lib/cms-service.ts` to replace mock data calls with `supabase.from('posts').select('*')` etc.
