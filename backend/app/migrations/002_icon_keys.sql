-- Replace free-text emoji columns with icon keys resolved against the
-- frontend SVG registry (frontend/src/components/ui/Icon.tsx).
--
-- Emoji rendered inconsistently across platforms and carried no theme
-- awareness. Icon keys resolve to inline SVGs that inherit `currentColor`.
--
-- The backfill is best-effort: arbitrary emoji don't map onto a fixed key set,
-- so anything unrecognised lands on 'chip' (a valid, neutral icon). Re-pick
-- those from the admin icon picker after applying.

ALTER TABLE services ADD COLUMN IF NOT EXISTS icon TEXT NOT NULL DEFAULT 'chip';
ALTER TABLE ventures ADD COLUMN IF NOT EXISTS icon TEXT NOT NULL DEFAULT 'chip';

UPDATE services SET icon = CASE
  WHEN emoji IN ('🖥️', '💻', '🌐', '📱') THEN 'markup'
  WHEN emoji IN ('⚙️', '🔧', '🛠️', '🖧')  THEN 'server'
  WHEN emoji IN ('🎨', '✏️', '🖌️')        THEN 'style'
  WHEN emoji IN ('📊', '📈', '📉')         THEN 'chart'
  WHEN emoji IN ('🗄️', '💾')              THEN 'database'
  WHEN emoji IN ('☁️', '🌩️')              THEN 'cloud'
  WHEN emoji IN ('🐳', '📦')               THEN 'container'
  WHEN emoji IN ('🔌', '🔗')               THEN 'api'
  WHEN emoji = '⚛️'                        THEN 'react'
  WHEN emoji IN ('✨', '🚀', '💡')         THEN 'sparkle'
  ELSE 'chip'
END;

UPDATE ventures SET icon = CASE
  WHEN emoji IN ('✨', '🚀', '💡', '🌟') THEN 'sparkle'
  WHEN emoji IN ('📊', '📈')             THEN 'chart'
  WHEN emoji IN ('🎥', '📹', '🎬')       THEN 'markup'
  WHEN emoji IN ('💼', '🏢')             THEN 'briefcase'
  WHEN emoji IN ('🎓', '📚')             THEN 'graduation-cap'
  ELSE 'chip'
END;

ALTER TABLE services DROP COLUMN IF EXISTS emoji;
ALTER TABLE ventures DROP COLUMN IF EXISTS emoji;

-- skills.emoji was never rendered: ToolsGrid derives its icon from the skill
-- name via TechIcon. Drop it outright rather than migrating dead data.
ALTER TABLE skills DROP COLUMN IF EXISTS emoji;
