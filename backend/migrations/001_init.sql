-- ============================================================
--  Store Rating Platform — Initial Schema
--  Run once: psql $DATABASE_URL -f migrations/001_init.sql
-- ============================================================

BEGIN;

-- ── Extensions ───────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- gives us gen_random_uuid()

-- ── Enum: user roles ─────────────────────────────────────────────────────────
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('admin', 'user', 'store_owner');
  END IF;
END
$$;

-- ── Table: users ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(60)   NOT NULL,
  email       VARCHAR(255)  NOT NULL,
  password    TEXT          NOT NULL,
  address     VARCHAR(400),
  role        user_role     NOT NULL DEFAULT 'user',
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

  CONSTRAINT users_email_unique UNIQUE (email)
);

COMMENT ON TABLE  users          IS 'All platform users across all roles.';
COMMENT ON COLUMN users.password IS 'bcrypt-hashed; never store or log plaintext.';

-- ── Table: stores ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS stores (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(60)   NOT NULL,
  email       VARCHAR(255)  NOT NULL,
  address     VARCHAR(400),
  owner_id    UUID          REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

  CONSTRAINT stores_email_unique UNIQUE (email)
);

COMMENT ON TABLE  stores          IS 'Stores registered on the platform.';
COMMENT ON COLUMN stores.owner_id IS 'FK to the store_owner user; null = no owner assigned.';

-- ── Table: ratings ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ratings (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID          NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
  store_id    UUID          NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  value       SMALLINT      NOT NULL CHECK (value BETWEEN 1 AND 5),
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

  -- Enforces one rating per user per store at the DB level
  CONSTRAINT ratings_user_store_unique UNIQUE (user_id, store_id)
);

COMMENT ON TABLE  ratings       IS 'User ratings (1–5) for individual stores.';
COMMENT ON COLUMN ratings.value IS 'Constrained 1–5 by CHECK; enforced again in app layer.';

-- ── Indices ───────────────────────────────────────────────────────────────────
-- Speeds up lookups that the app performs most often

CREATE INDEX IF NOT EXISTS idx_users_email   ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role    ON users(role);

CREATE INDEX IF NOT EXISTS idx_stores_owner  ON stores(owner_id);
CREATE INDEX IF NOT EXISTS idx_stores_name   ON stores(name);

CREATE INDEX IF NOT EXISTS idx_ratings_store ON ratings(store_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user  ON ratings(user_id);

COMMIT;

-- ── Verify ───────────────────────────────────────────────────────────────────
-- Quick sanity check after running the migration
SELECT table_name
FROM   information_schema.tables
WHERE  table_schema = 'public'
  AND  table_name   IN ('users', 'stores', 'ratings')
ORDER  BY table_name;
