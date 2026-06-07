-- Migration 004: Remove unused tax column from orders
-- Created: 2026-06-07

ALTER TABLE orders DROP COLUMN IF EXISTS tax;
