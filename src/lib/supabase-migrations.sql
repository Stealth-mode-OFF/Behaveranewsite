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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
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
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW())
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

-- Public can read published posts/case studies
CREATE POLICY "Public posts are readable" ON posts
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public case studies are readable" ON case_studies
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authors are readable" ON authors
  FOR SELECT USING (TRUE);

-- Admin can do everything (will check in app logic)
CREATE POLICY "Admins can manage posts" ON posts
  FOR ALL USING (TRUE) WITH CHECK (TRUE);

CREATE POLICY "Admins can manage case studies" ON case_studies
  FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- Insert sample data
INSERT INTO authors (name, avatar, role) VALUES
  ('Sarah Connor', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', 'HR Specialist'),
  ('John Smith', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150', 'Data Analyst')
ON CONFLICT DO NOTHING;
