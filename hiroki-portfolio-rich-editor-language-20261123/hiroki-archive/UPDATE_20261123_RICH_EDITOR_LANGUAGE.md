# 2026-11-23 — Works / Research editor and language labels

Based on `hiroki-portfolio-activities-order-fix-20261123.zip`; all previous updates remain included.

## Changes
1. About > expanded Activities > Related projects/links: associated **internal** Works/Archive/Research titles now use the current public page language (`en`, `ja`, `zh`) with the existing fallback mechanism. Arbitrary external links retain their own user-entered labels; these do not have translated fields.
2. Admin > entry list: added English / 日本語 / 繁體中文 language tabs, sharing the existing entry editing language setting. Item titles use the chosen language and fall back to previously registered titles/slug if absent. Archive is included.
3. Admin > Works and Research Body: replaced the markdown textarea toolbar with a shared visual editor. Edit headings, bold/italic, bullet lists and links directly; upload/insert images and edit their captions inline. Existing `body_en`, `body_ja`, `body_zh` columns still store Markdown; pre-existing Markdown is parsed into editable elements and serialized back to Markdown. Public `RichBody` renderer remains unchanged. The title and summary inputs remain unchanged. No new packages or SQL migrations required.
4. Body image upload folder now uses `entry-body/` for both Works and Research; existing URLs remain valid.

## Validation and limits
- TypeScript/TSX syntax/transpilation check passed for changed components.
- Full `npm run build` could not be run: required packages are not cached in the environment and offline installation failed.
- Editing features rely on the browser's native contenteditable formatting commands; test Chrome/mobile, image caption editing, links, language switching and save before production rollout.
- Existing Markdown supported by the existing public renderer is preserved semantically; editing and saving may normalize blank lines and heading syntax. Make a DB backup before deploying and test existing lengthy articles. Complex Markdown/HTML not supported by the previous renderer is not guaranteed lossless.
- Neither GitHub, Vercel nor Supabase was changed.
