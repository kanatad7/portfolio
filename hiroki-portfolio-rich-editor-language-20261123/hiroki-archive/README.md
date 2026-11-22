# HIROKI TANAKA — Personal Archive Starter

Responsive (desktop/mobile) portfolio starter with Works, Research, CV, About, EN/JP/Traditional Chinese language toggle, and password-protected Supabase content dashboard.

## What is implemented
- Public home, Works/Research lists and detail views, CV, About
- Language toggle stored in browser (English, 日本語, 繁體中文)
- Supabase-authenticated `/admin` editor for Works and Research: create, edit, delete, draft/publish, three-language text, image URL, sort order
- Supabase PostgreSQL schema and row-level security (RLS) to restrict writes to allowlisted admins
- Demo entries **only when Supabase variables are absent**. After connecting Supabase, create your entries in `/admin`.
- Mobile menu and responsive desktop/tablet/mobile design

## Local startup
1. Install Node.js 20.9+ (Node 22 LTS recommended).
2. `npm install`
3. `npm run dev` and open http://localhost:3000

Without Supabase settings, public demo pages work. The admin prompts you to connect Supabase.

## Connect Supabase
1. Create a project at https://supabase.com/dashboard
2. Open **SQL Editor**, run `supabase/schema.sql` (one time; do not run the create-policy lines repeatedly).
3. Go to **Authentication → Users**, manually add your admin email/password user. Disable public user signups in Auth settings unless you need them.
4. Copy that user's **UUID**. In SQL Editor run:
   `insert into public.admin_users(user_id) values ('YOUR_AUTH_USER_UUID');`
5. Project Settings → API: copy Project URL and **publishable/anon** key (not service_role/secret key).
6. Copy `.env.example` to `.env.local`, populate:
   `NEXT_PUBLIC_SUPABASE_URL=...`
   `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`
7. Restart `npm run dev`, visit `/admin` and sign in.
8. Create Works or Research items and check the public pages. `published=false` stays private.

### Security notes
- RLS allows non-admin visitors to read **published** entries only. Only IDs in `admin_users` can change data.
- Never commit `.env.local`, service role keys, or a password. Do not put service role keys in browser-facing `NEXT_PUBLIC_...` variables.
- This starter stores cover images as HTTPS URLs. You can later add Supabase Storage and an image uploader with a controlled write policy.
- Login and language choice currently use the browser session/localStorage; locale is not represented in URLs and is not SEO-localized yet.
- CV/About text is initially defined in code (`lib/data.ts`, `app/cv/page.tsx`, `app/about/page.tsx`); the admin edits only Works/Research in this first version.

## GitHub → Vercel
1. Create a new **private or public GitHub repository**.
2. Upload/unzip these project files to the **repository root** (not the ZIP itself), then commit.
3. At https://vercel.com/new choose **Import Git Repository**, select it.
4. Framework: Next.js (auto-detected). Add the two environment variables from `.env.local` through Vercel → Project Settings → Environment Variables, for Production (and Preview if desired).
5. Deploy. Future GitHub pushes deploy automatically.
6. Consider a custom domain later.

## Useful paths
- `/` homepage
- `/works`, `/works/[slug]` projects
- `/research`, `/research/[slug]` research
- `/cv`, `/about` static pages
- `/admin` Supabase-powered dashboard

## Future improvements
- Add a profiles/CV table + editor
- Photo uploads to Supabase Storage
- Multi-image gallery, rich text/Markdown editor, tags and year filters
- Language-specific URLs and SEO metadata
- Contact form with spam protection

## Demo data is intentionally illustrative
The sample entries are placeholders based on broad project interests shared during planning. Replace with verified titles, dates, photographs, profile information and project descriptions before public launch.
