-- Add an optional cover image to projects (shown on cards + detail page).
ALTER TABLE projects ADD COLUMN IF NOT EXISTS cover_url TEXT;
