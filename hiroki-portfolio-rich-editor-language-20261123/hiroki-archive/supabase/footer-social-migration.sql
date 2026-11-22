-- Apply after about-profile.sql; preserves existing content.
ALTER TABLE public.site_profile ADD COLUMN IF NOT EXISTS linkedin text NOT NULL DEFAULT '';
