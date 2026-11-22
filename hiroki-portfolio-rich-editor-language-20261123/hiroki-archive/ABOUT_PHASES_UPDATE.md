# About / Parallel Experience update

## Deployment order
1. In the **existing** Supabase project, run `supabase/about-phases.sql` once in SQL Editor. This only adds `site_profile.phase_items` (JSONB); it does not delete existing data.
2. Upload the contents of `hiroki-archive/` to the existing GitHub repository `kanatad7/portfolio` on `main`, preserving the existing Vercel project. Do not commit `.env.local` or secrets.
3. Wait for the existing Vercel automatic deployment and check `/about` and `/admin`.
4. In `/admin` → Edit About / Profile, add phases, then assign existing activities to phases, enter detailed descriptions and links, then Save About. Existing careers appear under Other experiences until assigned. No fake example phases are added automatically.

## Features
- Freely editable/reorderable multilingual phase names, themes, periods, descriptions.
- Multiple simultaneous activities within each phase, timeline bars using start/end year.
- One activity may be assigned to multiple phases; it is primarily displayed in one, referenced in the others, and stored only once.
- Expand/collapse to read longer multilingual descriptions, existing site project links and external URLs.
- Education remains a simpler expandable list.
- Smaller About portrait; narrow-screen responsive view.
- Preserves pre-existing `career_items` / `education_items`, legacy prose and footer links.

## Notes
- The existing Supabase row must remain under id `main`; the migration must be applied before saving the new editor.
- Years are numeric for timeline placement. Period is an independent displayed string. Existing entries without start/end years are preserved, and continue to show readable dates until years are entered.
- For multi-phase entries, use Primary phase to select where the primary timeline bar appears.
- The migration does not alter RLS or other tables.
- No production content was edited or fabricated by this package.
