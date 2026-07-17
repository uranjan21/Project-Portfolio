-- utsavranjan.info initial schema

-- Profile (single row)
CREATE TABLE profile (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  tagline TEXT NOT NULL DEFAULT '',
  bio TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT,
  photo_url TEXT,
  github TEXT,
  linkedin TEXT,
  twitter TEXT,
  website TEXT,
  meta_description TEXT NOT NULL DEFAULT '',
  keywords TEXT[] NOT NULL DEFAULT '{}',
  og_image TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Stats linked to profile
CREATE TABLE stats (
  id SERIAL PRIMARY KEY,
  profile_id INT NOT NULL REFERENCES profile(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

-- Audience pitches
CREATE TABLE audiences (
  id SERIAL PRIMARY KEY,
  audience_key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  headline TEXT NOT NULL,
  pitch TEXT NOT NULL,
  value_props TEXT[] NOT NULL DEFAULT '{}',
  cta_label TEXT NOT NULL DEFAULT '',
  cta_href TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0
);

-- Services
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  emoji TEXT NOT NULL DEFAULT '',
  summary TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  deliverables TEXT[] NOT NULL DEFAULT '{}',
  tech TEXT[] NOT NULL DEFAULT '{}',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Pricing plans
CREATE TABLE pricing_plans (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  price TEXT NOT NULL DEFAULT '',
  unit TEXT NOT NULL DEFAULT '',
  features TEXT[] NOT NULL DEFAULT '{}',
  highlighted BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0
);

-- Skills
CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  level INT NOT NULL DEFAULT 0 CHECK (level >= 0 AND level <= 100),
  emoji TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

-- Work experience
CREATE TABLE experiences (
  id SERIAL PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  period TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL DEFAULT '',
  highlights TEXT[] NOT NULL DEFAULT '{}',
  tech TEXT[] NOT NULL DEFAULT '{}',
  sort_order INT NOT NULL DEFAULT 0
);

-- Education
CREATE TABLE education (
  id SERIAL PRIMARY KEY,
  institution TEXT NOT NULL,
  degree TEXT NOT NULL,
  period TEXT NOT NULL DEFAULT '',
  detail TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

-- Achievements
CREATE TABLE achievements (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  year TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0
);

-- Ventures ("Beyond the Code")
CREATE TABLE ventures (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  emoji TEXT NOT NULL DEFAULT '',
  tagline TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  live BOOLEAN NOT NULL DEFAULT false,
  url TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

-- FAQs
CREATE TABLE faqs (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

-- Blog posts
CREATE TABLE blog_posts (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  cover_url TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  is_published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Clients (CRM)
CREATE TABLE clients (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  notes TEXT,
  source TEXT CHECK (source IN ('referral', 'website', 'linkedin', 'other')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Projects (enhanced with status + client link)
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  tag TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  details TEXT,
  tech TEXT[] NOT NULL DEFAULT '{}',
  live_url TEXT,
  repo_url TEXT,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('received', 'in_progress', 'completed', 'cancelled')),
  client_id INT REFERENCES clients(id) ON DELETE SET NULL,
  budget TEXT,
  start_date DATE,
  end_date DATE,
  notes TEXT,
  is_public BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Testimonials (linked to clients and projects)
CREATE TABLE testimonials (
  id SERIAL PRIMARY KEY,
  quote TEXT NOT NULL,
  author TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT '',
  rating INT CHECK (rating >= 1 AND rating <= 5),
  client_id INT REFERENCES clients(id) ON DELETE SET NULL,
  project_id INT REFERENCES projects(id) ON DELETE SET NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Contact messages (enhanced with status pipeline)
CREATE TABLE contact_messages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  interest TEXT,
  budget TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'converted', 'archived')),
  client_id INT REFERENCES clients(id) ON DELETE SET NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Follow-ups on contact messages
CREATE TABLE contact_follow_ups (
  id SERIAL PRIMARY KEY,
  message_id INT NOT NULL REFERENCES contact_messages(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Unanswered chat questions
CREATE TABLE unanswered_questions (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'answered', 'dismissed')),
  answer TEXT,
  asked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON blog_posts(is_published, published_at DESC);
CREATE INDEX idx_contact_messages_status ON contact_messages(status);
CREATE INDEX idx_unanswered_questions_status ON unanswered_questions(status);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_public ON projects(is_public);
