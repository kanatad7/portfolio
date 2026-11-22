-- Run once in Supabase SQL Editor BEFORE deploying the updated About page.
-- Additive migration: existing profile, career_items and education_items are untouched.
BEGIN;
ALTER TABLE public.site_profile
  ADD COLUMN IF NOT EXISTS phase_items jsonb NOT NULL DEFAULT '[]'::jsonb;
COMMIT;
