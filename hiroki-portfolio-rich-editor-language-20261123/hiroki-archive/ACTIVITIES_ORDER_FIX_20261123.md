# Activities cross-category ordering fix (2026-11-23)

- Activities sidebar now combines career_items and education_items into one sorted list.
- Up/down controls move items across the Work / Education boundary.
- sort_order is stored INSIDE the existing career_items and education_items JSONB records; no new SQL column or migration required.
- When two swapped entries occur in the same primary phase, its existing phase_items[].activity_order is updated in the same onChange operation, so the published About timeline follows the new ordering. Other phase orders remain unchanged.
- No existing entries, IDs, translations, images or phase memberships are removed.
- Click Save About to persist. Changes are not published just by clicking arrows.
- Build/runtime verification: see delivery note; no Supabase production writes or deploys performed.
