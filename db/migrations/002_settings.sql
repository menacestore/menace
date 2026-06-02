-- Migration 002: Settings table for configurable shipping
-- Created: 2026-05-17

CREATE TABLE IF NOT EXISTS settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Default shipping settings
INSERT INTO settings (key, value) VALUES
  ('shipping_threshold', '15000'),
  ('shipping_cost', '250')
ON CONFLICT (key) DO NOTHING;
