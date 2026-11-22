-- Run once in Supabase SQL Editor. Do not add credentials to the repository.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade
);
create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  section text not null check(section in ('works','research','archive')),
  slug text not null,
  title_en text not null default '', title_ja text not null default '', title_zh text not null default '',
  summary_en text not null default '', summary_ja text not null default '', summary_zh text not null default '',
  body_en text not null default '', body_ja text not null default '', body_zh text not null default '',
  category text not null default '', year text not null default '', cover_url text,
  published boolean not null default false, sort_order integer not null default 10,
  archive_kind text not null default 'single' check(archive_kind in ('single','series')), archive_images jsonb not null default '[]'::jsonb, material text not null default '', method text not null default '',
  created_at timestamptz not null default now(),
  unique(section,slug)
);
create index if not exists entries_public_index on public.entries(section,published,sort_order);
alter table public.admin_users enable row level security;
alter table public.entries enable row level security;
create policy "Admins can see self membership" on public.admin_users for select to authenticated using (user_id = (select auth.uid()));
create policy "Read public or admin entries" on public.entries for select to anon, authenticated using (
 published or exists(select 1 from public.admin_users a where a.user_id = (select auth.uid()))
);
create policy "Admin insert" on public.entries for insert to authenticated with check (exists(select 1 from public.admin_users a where a.user_id = (select auth.uid())));
create policy "Admin update" on public.entries for update to authenticated using (exists(select 1 from public.admin_users a where a.user_id = (select auth.uid()))) with check (exists(select 1 from public.admin_users a where a.user_id = (select auth.uid())));
create policy "Admin delete" on public.entries for delete to authenticated using (exists(select 1 from public.admin_users a where a.user_id = (select auth.uid())));
-- After creating your user in Supabase Authentication > Users, manually run:
-- insert into public.admin_users(user_id) values ('YOUR_AUTH_USER_UUID');
-- Do not allow public inserts into admin_users.
