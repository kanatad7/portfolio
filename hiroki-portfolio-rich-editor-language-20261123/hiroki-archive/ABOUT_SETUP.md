# New About editor setup

This release includes the previous Works gallery / upload improvements, plus editable About (profile photograph, biography, work history, education, skills, email and links in English/Japanese/Traditional Chinese).

1. Supabase SQL Editor: first review/run `supabase/works-images-and-storage.sql` if not already applied. This sets up the Works `works_images` column and `portfolio-images` public bucket plus restricted upload policies. If any policy names already exist, check before re-running; those CREATE POLICY statements are not idempotent.
2. Run `supabase/about-profile.sql`. It creates `site_profile` and read/admin-write RLS; it preserves existing content.
3. Deploy repository update on `main`. Ensure Vercel deployment Ready.
4. `/admin` -> `Edit About / Profile` -> upload portrait and enter content -> `Save About`. `/about` will display the saved record; until then, legacy About placeholder remains visible.

Uploaded photos are **public** by design and anyone with their URL can view them. Don't upload private images. If you replace an image, the previous image remains in Storage and can be manually removed later. The site uses free-text career/education/skills fields (newlines preserved), not separate editable timeline records. For URLs, use full `https://` addresses. If profile data can't be loaded, the previous text is shown. No passwords or API keys belong in this package.
