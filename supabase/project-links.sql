-- Run once before uploading the corresponding code. Existing entry data is preserved.
ALTER TABLE public.entries
ADD COLUMN IF NOT EXISTS links jsonb NOT NULL DEFAULT '[]'::jsonb;
