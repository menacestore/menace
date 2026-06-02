-- Migration 003: Colors palette
-- Created: 2026-05-31
-- Applied: 2026-05-31

CREATE TABLE IF NOT EXISTS colors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  hex VARCHAR(7) NOT NULL CHECK (hex ~ '^#[0-9A-Fa-f]{6}$'),
  slug VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE product_variants ADD COLUMN IF NOT EXISTS color_id UUID REFERENCES colors(id) ON DELETE SET NULL;
