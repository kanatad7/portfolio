# Weekend launch notes / 週末公開用

## Updated
- Palette: background #F4F4F4; type #1A5B8C
- Navigation: Works / Archive / Research / About (CV redirected to About)
- Archive: square grid, single/series, popup with split photo/content, category filtering, additional photos, simple ordering controls in /admin.
- Existing Works and Research entries stay intact. About CV contains editable provisional wording.

## If you already have Supabase running
1. In Supabase SQL Editor run `supabase/archive-migration.sql` ONCE. This preserves existing entries.
2. Deploy this Next.js code to the existing linked GitHub repo/Vercel project; maintain environment variables.
3. Log into `/admin` using the allowlisted admin, create an `Archive` entry and add an image URL (can use publicly available hosted image URLs).
4. To create series, select type Series and add extra image URLs one per line. Order archive entries with ↑ ↓ buttons; changes are saved to Supabase.
5. Replace placeholder content in About and demo entries before presenting as actual work.

## If Supabase is NOT configured
Follow README.md to create a Supabase project and run `supabase/schema.sql` instead. /admin requires Supabase configuration. The site will display demo entries for Works and Research only; Archive will be empty until you publish entries.

## Later improvements
Image upload to Supabase Storage, drag and drop sorting, image crop focus, series item-specific descriptions, deeper cross-links Research ↔ Archive, full editorial design refinement, and a dedicated About CMS editor.

## Caveats
This package does not modify your live Vercel deployment until you commit and deploy it. Verify dependencies and build in your dev environment.
