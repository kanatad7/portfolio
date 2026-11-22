# Footer social links

This version includes the previous Works gallery, image uploads, and editable About functionality.

Before deployment, run `supabase/footer-social-migration.sql` in the **same** Supabase project as the Vercel `portfolio` deployment. The earlier `about-profile.sql` and image-storage migration should already have been applied.

Then upload the updated project files to the GitHub repository and wait for Vercel Ready. In `/admin`, open **Edit About / Profile** and save a Website, Instagram, LinkedIn and/or Email. Only populated fields appear in the shared footer (and About page).

Notes: links are public by design; do not enter private contacts. The earlier package was not fully build-verified, so confirm the Vercel build and test uploads/links before relying on production.
