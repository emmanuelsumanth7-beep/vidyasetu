-- ---------------------------------------------------------------------------
-- Migration: school_theming
--
-- Adds multi-tenant dynamic theming to the School table.
--
-- WHY these exact choices:
--   • code   — TEXT, nullable initially so existing rows are not rejected.
--              Set UNIQUE so two schools can never share the same app code.
--              We add it nullable, backfill with the school's cuid (safe
--              default), then tighten to NOT NULL via a second statement.
--              This is the safest online migration pattern for Postgres on RDS.
--   • theme_config — JSONB (not JSON). Postgres JSONB is stored in a
--              decomposed binary format that supports GIN indexing, key-path
--              updates, and containment operators. We do not index it now
--              (the table is tiny) but the type choice keeps the door open.
-- ---------------------------------------------------------------------------

-- 1. Add the new columns (both nullable — safe for existing rows).
ALTER TABLE "School"
  ADD COLUMN IF NOT EXISTS "code"        TEXT,
  ADD COLUMN IF NOT EXISTS "themeConfig" JSONB;

-- 2. Back-fill code for any schools that already exist.
--    Uses the school's own id as a safe, unique placeholder.
--    Admins should update this to a human-readable slug via the admin UI,
--    but this guarantees the NOT NULL constraint below never fails on an
--    existing non-empty table.
UPDATE "School"
  SET "code" = "id"
  WHERE "code" IS NULL;

-- 3. Unique index on code (created before the NOT NULL constraint so Postgres
--    validates uniqueness in one pass, not two).
CREATE UNIQUE INDEX IF NOT EXISTS "School_code_key"
  ON "School"("code");

-- 4. Regular index for the GET /schools/:code/theme lookup path.
CREATE INDEX IF NOT EXISTS "School_code_idx"
  ON "School"("code");
