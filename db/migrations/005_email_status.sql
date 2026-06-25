-- Migration 005: Track transactional email delivery per order
-- Created: 2026-06-25
-- Adds columns so email-send failures are persisted and surfaced in the admin
-- dashboard instead of being silently swallowed.

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS confirmation_email_status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (confirmation_email_status IN ('pending', 'sent', 'failed'));

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS confirmation_email_error TEXT;

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS admin_notification_status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (admin_notification_status IN ('pending', 'sent', 'failed'));
