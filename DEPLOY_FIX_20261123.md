# Vercel TypeScript build failure — deployment correction (2026-11-23)

Observed for commit `47ab7df`:
- `TS2307` in `app/admin/page.tsx`: cannot resolve `@/components/visual-body-editor`.
- `TS7006`: `value` has implicit `any` type in the corresponding `onChange` callback.

This package includes `components/visual-body-editor.tsx` at the **repository root path**, and explicitly annotates `value:string` in `app/admin/page.tsx`. It otherwise carries forward the preceding rich-editor/language ZIP intact.

**IMPORTANT: The ZIP root now directly contains `app/`, `components/`, `lib/`, `supabase/` and other project files.** Upload these **contents**, not their parent folder, to the GitHub repository root. Do not upload the ZIP file as-is and do not place all files under a new `hiroki-archive/` or `hiroki-portfolio-rich-editor-language-20261123/` folder.

Check on GitHub *main* immediately after upload:
- `components/visual-body-editor.tsx` exists.
- `app/admin/page.tsx` imports `@/components/visual-body-editor`.
- `app/admin/page.tsx` contains `onChange={(value:string)=>...}`.

After Vercel completes, verify the production deployment Source SHA and `Ready` status; don't infer success from a GitHub upload. No Supabase migrations are needed. Production build and real-browser save/edit verification have not been run in this environment.
