# Editorial update — 2026-10-20

## Before deployment
1. Back up the Supabase database. Run `supabase/editorial-refresh.sql` in the correct Supabase project. Previous migrations must already be applied.
2. Deploy the entire ZIP contents to the existing GitHub repo (prefer a preview branch), then check Vercel build.
3. In `/admin`, use **Edit Homepage** to set multilingual headline/description and select published entries in order; use **Edit About / Profile** for structured experience, education and footer links.

## Compatibility
- Existing Works / Archive / Research entries are not deleted or migrated.
- Existing About text remains visible until the new structured CV list is populated.
- Existing social fields are used as fallback until footer links are added.
- The homepage shows all published entries until a custom selection is saved.
- Research and Works detail images are uncropped and constrained in width.

## Caveats
- `home_settings` must exist before homepage editing works. SQL checks the same admin_users allowlist as the current admin.
- `featured_ids` are entry UUIDs; unpublished items disappear from the homepage but remain selected in settings.
- External image links are loaded directly; source URLs must be valid and public.
