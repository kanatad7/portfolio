-- Run in Supabase SQL Editor ONCE for an EXISTING installation.
ALTER TABLE public.entries DROP CONSTRAINT IF EXISTS entries_section_check;
ALTER TABLE public.entries ADD CONSTRAINT entries_section_check CHECK (section IN ('works','research','archive'));
ALTER TABLE public.entries ADD COLUMN IF NOT EXISTS archive_kind text NOT NULL DEFAULT 'single';
ALTER TABLE public.entries ADD COLUMN IF NOT EXISTS archive_images jsonb NOT NULL DEFAULT '[]'::jsonb;
ALTER TABLE public.entries ADD COLUMN IF NOT EXISTS material text NOT NULL DEFAULT '';
ALTER TABLE public.entries ADD COLUMN IF NOT EXISTS method text NOT NULL DEFAULT '';
