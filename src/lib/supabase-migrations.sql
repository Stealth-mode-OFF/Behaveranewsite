-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Authors Table
CREATE TABLE IF NOT EXISTS authors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  avatar TEXT,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- 2. Blog Posts Table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover_image TEXT,
  author_id UUID REFERENCES authors(id),
  status TEXT CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  tags TEXT[],
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
  -- Bilingual CZ fields
  title_cz TEXT,
  excerpt_cz TEXT,
  content_cz TEXT
);

-- 3. Case Studies Table
CREATE TABLE IF NOT EXISTS case_studies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  client_name TEXT,
  industry TEXT,
  challenge TEXT,
  solution TEXT,
  results JSONB,
  content TEXT,
  cover_image TEXT,
  status TEXT CHECK (status IN ('draft', 'published')) DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
  -- Bilingual CZ fields
  title_cz TEXT,
  challenge_cz TEXT,
  solution_cz TEXT,
  content_cz TEXT,
  industry_cz TEXT,
  results_cz JSONB,
  card_summary TEXT,
  card_summary_cz TEXT,
  tags TEXT[],
  employee_count TEXT
);

-- 4. Admin Users Table (for authentication)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
);

-- Enable RLS (Row Level Security)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;

-- Public (anon) can read published posts/case studies
CREATE POLICY "Public posts are readable" ON posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public case studies are readable" ON case_studies
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authors are readable" ON authors
  FOR SELECT USING (TRUE);

-- Authenticated users (admin) can do everything
CREATE POLICY "Authenticated users can read all posts" ON posts
  FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "Authenticated users can insert posts" ON posts
  FOR INSERT TO authenticated WITH CHECK (TRUE);

CREATE POLICY "Authenticated users can update posts" ON posts
  FOR UPDATE TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Authenticated users can delete posts" ON posts
  FOR DELETE TO authenticated USING (TRUE);

CREATE POLICY "Authenticated users can read all case studies" ON case_studies
  FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "Authenticated users can insert case studies" ON case_studies
  FOR INSERT TO authenticated WITH CHECK (TRUE);

CREATE POLICY "Authenticated users can update case studies" ON case_studies
  FOR UPDATE TO authenticated USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Authenticated users can delete case studies" ON case_studies
  FOR DELETE TO authenticated USING (TRUE);

-- Insert sample authors
INSERT INTO authors (name, avatar, role) VALUES
  ('Sarah Connor', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', 'HR Specialist'),
  ('John Smith', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150', 'Data Analyst')
ON CONFLICT DO NOTHING;

-- ═══════════ Upgrade existing tables (run if tables already exist) ═══════════

-- Add CZ columns to posts if missing
ALTER TABLE posts ADD COLUMN IF NOT EXISTS title_cz TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS excerpt_cz TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS content_cz TEXT;

-- Add CZ columns to case_studies if missing
ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS title_cz TEXT;
ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS challenge_cz TEXT;
ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS solution_cz TEXT;
ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS content_cz TEXT;
ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS industry_cz TEXT;
ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS results_cz JSONB;
ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS card_summary TEXT;
ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS card_summary_cz TEXT;
ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS tags TEXT[];
ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS employee_count TEXT;
