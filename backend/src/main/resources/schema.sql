-- One row per section of the portfolio (profile, projects, skills ...).
-- "content" is JSONB, so adding a new field never needs a database migration.
CREATE TABLE IF NOT EXISTS portfolio_section (
    name       VARCHAR(50) PRIMARY KEY,
    content    JSONB       NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
