# tdm155ai-week-6

TDM 155AI week 6 (class 2026-10-14): Sketches and Studies. A local Next app in `nextjs/` that renders a folder of Markdown as four sections (`/activities`, `/concepts`, `/skills`, `/explorations`), and the generation scripts for OpenRouter, fal, and HUIT in `utils/`. Private; nested in `ll-26-27/the-notebook` at `apps/tdm155ai-week-6/`.

**Copied 2026-10-14 from The Notebook's `interface/`** (`ll-26-27/the-notebook` at `e75a6a3`), every tracked file except its own notes and README, then changed:

- Everything the app shows moved inside it, to `nextjs/content/` (served from the root; its README is the home page). The Notebook's interface read `_content/` and `_context/` from the repo above it; the `/context` mount was dropped.
- A docs-site route (first `/readings`, now `/skills`, `nextjs/app/skills/`): a folder of Markdown with every document listed in a sidebar (folders inside it as headed groups) and the one you click beside it. No previous/next pager. Modeled on the sidebar in `tdm155ai-week-4`.
- A `/concepts` route (2026-10-14, `nextjs/app/concepts/`): `nextjs/content/concepts/` in two levels, categories first, then one category's concepts at a time. The docs-style routes share `nextjs/app/components/DocsSidebar.jsx`.
- Names changed: site title, package names.
- **Removed later on 2026-10-14**, as last week's leftovers: the readings section, the student notebook (`content/notebook/`, `/dictate`, `/transcribe`, the `_media/` folder, the OpenRouter key in `nextjs/.env.local`), and the `/graphics` package (with Tailwind, TypeScript, three, and ogl). The app is now plain JavaScript and CSS with no API routes.

## Layout

**Explorations (2026-10-14):** `/explorations` brings in all 49 example pages from Madeleine's `ll-26-27/ll-week-6` at `5678a7b`: 10 sequences, 23 study cases, and 16 practice cases. A field filter browses the collection. Detail and print pages display the frontmatter images, artifact roles, captions, and source/license links. Eight exercise sections are explicitly optional and collapsible on screen. The copy retains Claude authorship and source metadata; `nextjs/content/explorations/_import.json` records corrections. Source plans, hidden research notes, and the interactive studio were not copied. Keats's manuscript panels link to Houghton rather than embedding scans whose redistribution conditions remain unresolved.

| Path | What |
| --- | --- |
| `nextjs/` | The app: forced dark, Inter, red accent; `/print` is always light |
| `nextjs/content/` | The site's Markdown: `content/a/b.md` is `/a/b` |
| `nextjs/content/activities/` | The day's plan: the skills talk and the three lab rotations, at `/activities` with a sidebar |
| `nextjs/content/concepts/` | The key concepts: one folder per category, its README the category's essay, at `/concepts` |
| `nextjs/content/skills/` | The week's Claude skills, explained, at `/skills` with a sidebar |
| `nextjs/content/explorations/` | Illustrated cases (sequences, studies, practice), at `/explorations` |
| `nextjs/content/who-used-to-make-this.md` | The headcount essay the home page opens with, at `/who-used-to-make-this` |
| `utils/` | Text and image generation for OpenRouter, fal, and HUIT; see [utils/README.md](utils/README.md) |
| `output/` | Gitignored: what the `utils/` scripts make |
| `.agents/skills/origin-story/` | The origin-story skill (`.claude/skills/origin-story` links to it), from the `ll-kits` origin-story kit; `examples/` holds its sample plan and script |

## Routes

| URL | What |
| --- | --- |
| `/` | The home page: the intro essay in `nextjs/content/README.md` |
| `/activities`, `/activities/...` | The day's plan as a docs site: the skills talk and one page per rotation |
| `/concepts`, `/concepts/<category>/...` | The key concepts in two levels: the sidebar lists the categories, then, inside a category, only that category's concepts (with a link back to all categories) |
| `/skills`, `/skills/...` | The skills pages as a docs site: sidebar of every document, the chosen one beside it |
| `/explorations`, `/explorations/...` | A gallery of 49 cases, field filtering, and illustrated detail pages with optional exercises |
| `/who-used-to-make-this`, any other path | Any folder or document in `nextjs/content/` |
| `/print` | Light print versions: put `/print` in front of any page's address, or `/print/all` |

## Run the app

Use Node 22 or later (`nextjs/.node-version`).

```sh
cd nextjs
pnpm install
pnpm dev
```

The app needs no keys. Tests: `pnpm test` in `nextjs/`.

## Run the scripts

From the repo root, copy `.env.example` to `.env` and fill in `OPENROUTER_API_KEY`, `FAL_API_KEY`, and (optionally) `HUIT_API_KEY`. The text and image scripts need no packages; the comic tools need Sharp, so run `pnpm install` at the root once before using them:

```sh
pnpm text openrouter "Reply with the single word HELLO." --model openai/gpt-5-mini --dry-run
pnpm image fal "a small red apple on a white background" --model fal-ai/flux/dev
```

See [utils/README.md](utils/README.md) for every command.

## Origin-story comics

Added 2026-10-14 from the origin-story kit (`ll-26-27/ll-kits`, `kits/origin-story/`). Ask Claude to use the `origin-story` skill with your story, four or eight panels, a style or genre, and optional photos of yourself; say "just go with what you have" to skip its questions. It writes the script first, makes a character sheet from your photos, generates the pages, and builds a folder with an `index.html` reader and gallery (in `~/Downloads` unless you name another place). The tools are `utils/comic.mjs` and `utils/compress-image.mjs` (`pnpm comic`, `pnpm compress-image`); the skill's `references/comic-production.md` has every command.
