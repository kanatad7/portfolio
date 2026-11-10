# About follow-up display & admin save fix (2026-11-11)

## Changes
- Public About photo: enlarge desktop width to responsive 210–270px; mobile up to 190px; preserve original ratio. Body typography remains 16px desktop / 15px mobile.
- Public phase headings: remove automatic `01 /`, `02 /` sequence; show the multilingual phase name alone.
- About admin Save: remain on currently selected editing section and language and selected activity, displaying an inline success/error message. No automatic return to the entries list.

## Installation
Upload project files from inside `hiroki-archive/` to the repository root, or replace only `app/about/page.tsx`, `app/admin/page.tsx`, and `app/globals.css` if the previously delivered 20261111 update is already deployed. No new SQL required.

## Notes
Uses the supplied 20261111 project ZIP as base, not live GitHub state. Keep any newer independent changes made since then.
