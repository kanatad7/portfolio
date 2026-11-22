# HIROKI TANAKA — Works gallery and image upload

## What changed
- Admin: image picker uploads cover photos and multiple supplementary photos to Supabase Storage. JPEG/PNG/WebP/GIF/AVIF, max 10 MB per file. **Always click Save entry after uploading**.
- Works: supplementary photos are displayed below the text, full width, retaining natural aspect ratios. Cover photo remains at top.
- Archive: supplementary photos continue to appear as a slideshow in the modal; can also be uploaded instead of URL-pasted.
- Research: cover upload enabled, unchanged single-cover detail design.

## Deploy safely
1. In Supabase project `hiroki tanaka / portfolio`, review and execute `supabase/works-images-and-storage.sql` with SQL Editor. It creates a public `portfolio-images` bucket, one Works gallery column, and admin-only write storage policies. Do NOT rerun the older schema file.
2. Check whether the `portfolio-images` bucket already exists before running SQL. The policy names are intended for initial use and will conflict if already present. If it exists, inspect existing policies before applying.
3. Upload **contents of this ZIP project folder** to GitHub `kanatad7/portfolio` main (preserve `.env` secrets outside Git). Vercel `portfolio` should deploy automatically.
4. In `/admin`, edit a Works entry, choose files under Cover / Additional images and click Save entry. Verify Works detail gallery. Test Archive similarly.

## Notes
- The existing `archive_images` column is reused for Archive, `works_images` is new. Existing data is preserved.
- Storage URLs are public. Only upload images intended to be public.
- This version does not crop/compress files or clean up uploaded Storage objects when an entry is deleted. Delete unused images through Supabase Storage when needed.
- If the SQL complains about existing policy names, stop and inspect Storage policies; don't delete policies blindly.
- No passwords, anon keys or service role keys are stored in this archive.
