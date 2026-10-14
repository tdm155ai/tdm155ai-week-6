# tdm155ai-week-6

TDM 155AI week 6 (class 2026-10-14): Sketches and Studies. A local Next app in `nextjs/` that renders a folder of Markdown, with a docs-style `/readings`, dictation and photo transcription into a notebook, and the generation scripts for OpenRouter, fal, and HUIT in `utils/`. Private; nested in `ll-26-27/the-notebook` at `apps/tdm155ai-week-6/`.

**Copied 2026-10-14 from The Notebook's `interface/`** (`ll-26-27/the-notebook` at `e75a6a3`), every tracked file except its own notes and README, then changed:

- Everything the app shows moved inside it, to `nextjs/content/` (served from the root; its README is the home page). The Notebook's interface read `_content/` and `_context/` from the repo above it; the `/context` mount was dropped.
- `notebook/` moved to `nextjs/content/notebook/` and `_media/` to `nextjs/_media/` (gitignored).
- A new `/readings` route (`nextjs/app/readings/`): `nextjs/content/readings/` as a docs site, with every document listed in a sidebar (folders inside it as headed groups) and the one you click beside it. No previous/next pager. Modeled on the sidebar in `tdm155ai-week-4`.
- A `/concepts` route (2026-10-14, `nextjs/app/concepts/`): `nextjs/content/concepts/` in two levels, categories first, then one category's concepts at a time. Both routes share `nextjs/app/components/DocsSidebar.jsx`.
- Names changed: site title, package names, OpenRouter `X-Title`, graphics storage keys.

## Layout

| Path | What |
| --- | --- |
| `nextjs/` | The app: forced dark, Inter, red accent; `/print` is always light |
| `nextjs/content/` | The site's Markdown: `content/a/b.md` is `/a/b` |
| `nextjs/content/readings/` | The week's reading, shown at `/readings` with a sidebar |
| `nextjs/content/concepts/` | The key concepts: one folder per category, its README the category's essay, at `/concepts` |
| `nextjs/content/notebook/` | Dictated and photographed notes, newest first, at `/notebook` |
| `nextjs/_media/` | Gitignored, local only: recordings, photographs, transcription records |
| `utils/` | Text and image generation for OpenRouter, fal, and HUIT; see [utils/README.md](utils/README.md) |
| `output/` | Gitignored: what the `utils/` scripts make |

## Routes

| URL | What |
| --- | --- |
| `/` | The home page (`nextjs/content/README.md`), the tools, and a map of everything |
| `/readings`, `/readings/...` | The readings as a docs site: sidebar of every document, the chosen one beside it |
| `/concepts`, `/concepts/<category>/...` | The key concepts in two levels: the sidebar lists the categories, then, inside a category, only that category's concepts (with a link back to all categories) |
| `/notebook/...`, any other path | Any folder or document in `nextjs/content/` |
| `/dictate` | Record a note; it is transcribed and cleaned up on OpenRouter and written to `nextjs/content/notebook/` |
| `/transcribe` | Photograph or upload pages; a faithful transcription is written to `nextjs/content/notebook/` |
| `/graphics`, `/graphics/record` | Lower thirds, titles, and corner bugs; the webcam with a graphic on top, recorded to `nextjs/_media/recordings/` |
| `/print` | Light print versions: put `/print` in front of any page's address, or `/print/all` |

## Run the app

Use Node 22 or later (`nextjs/.node-version`).

```sh
cd nextjs
pnpm install
pnpm dev
```

Copy `nextjs/.env.example` to `nextjs/.env.local` and set `OPENROUTER_API_KEY`. Without it, `/dictate` and `/transcribe` ask for the user's own key and keep it in that browser. Restart `pnpm dev` after editing it. Tests: `pnpm test` in `nextjs/`.

## Run the scripts

From the repo root, copy `.env.example` to `.env` and fill in `OPENROUTER_API_KEY`, `FAL_API_KEY`, and (optionally) `HUIT_API_KEY`. The scripts need no packages:

```sh
pnpm text openrouter "Reply with the single word HELLO." --model openai/gpt-5-mini --dry-run
pnpm image fal "a small red apple on a white background" --model fal-ai/flux/dev
```

See [utils/README.md](utils/README.md) for every command.
