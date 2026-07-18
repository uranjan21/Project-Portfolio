-- Per-audience dynamic content: About copy and focus tags that reorder
-- projects/skills for the selected visitor type.
ALTER TABLE audiences
  ADD COLUMN IF NOT EXISTS about_bio TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS focus_tags TEXT[] NOT NULL DEFAULT '{}';
