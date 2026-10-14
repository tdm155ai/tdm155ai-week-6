# TDM 155AI week 6: instructions for AI assistants

This repository is a student's notebook for TDM 155AI (*Making Stuff in the Age of AI*), week 6: Sketches and Studies (class October 14, 2026). It continues week 5's AI-enhanced notebook for the Unit 2 project, in which each student researches, learns, and prototypes a form of media they want to make; week 6 is the studies. This week's activity instructions are still being written; until they arrive, ask the student what they're working on.

## Where things go

Everything the site shows is Markdown in `nextjs/content/`, and each file is a page at the same path (`nextjs/content/skills/a.md` is `/skills/a`). There is no readings section (retired 2026-10-14); the week's one shared essay, the headcount in `nextjs/content/who-used-to-make-this.md`, is linked from the home page.

- **`nextjs/content/concepts/`**: the week's key concepts. Each category (a field or medium: `music/`, `visual-art/`, …) is a folder whose `README.md` is the category's essay, with one Markdown file per concept. `/concepts` lists the categories in the sidebar; inside a category the sidebar lists only its concepts.
- **`nextjs/content/explorations/`**: illustrated cases from Madeleine's week 6 collection: sequences, studies, and practice. `/explorations` is a gallery with a field filter. Preserve original authorship, source metadata, image credits, and qualifications. Sections headed `Optional exercises` display separately from the case account; they are suggestions, not assignments. The hidden `_import.json` records copy provenance and corrections.
- **`nextjs/content/skills/`**: the week's Claude skills, explained: `intro-to-skills.md` and one page per skill (starting with `origin-story.md`). `/skills` shows the folder as a docs site, every document in a sidebar.
- **`nextjs/content/notebook/`**: the student's own work: their notes, plans, observations, and the notes they dictate on `/dictate` or photograph on `/transcribe`. It's theirs. Don't rewrite or delete their notes; add to the notebook only when they ask, and say what you added.
- **`nextjs/content/README.md`**: the home page.

## Writing docs

Every Markdown file you write starts with YAML frontmatter that gives its title, a one-line description, and you as its author, so the student (and anyone reading) can tell your work from theirs:

```yaml
---
title: Lip-syncing to playback
description: How to shoot a performance that matches the song, and how to practice it.
author: claude
---
```

Relative links between `.md` files work, and an image saved beside a doc shows in it. `order:` in the frontmatter sets a document's place in lists and in the sidebars (lower first; otherwise by title).

## The app and the scripts

- The site is a Next app in `nextjs/`. The student runs it themselves: `cd nextjs`, `pnpm install`, `pnpm dev`. Don't start it in the background.
- `/graphics` is a graphics editor (lower thirds, titles, corner bugs) and `/graphics/record` records the webcam with a graphic on top into `nextjs/_media/recordings/`. They are TypeScript and Tailwind (`app/graphics/`, `lib/graphics/`), while the rest of the app is plain JavaScript and its own CSS; keep Tailwind inside `app/graphics/`.
- `utils/` (at the repo root, outside the app) has scripts for generating text and images through OpenRouter, fal, and Harvard's HUIT gateways; see [`utils/README.md`](utils/README.md). Run them from the repo root with `pnpm`. What they make lands in `output/`.
- The `origin-story` skill (`.agents/skills/origin-story/`, linked from `.claude/skills/`) turns a student's story and photos into a four- or eight-panel comic with `utils/comic.mjs`; read its `SKILL.md` when a student asks for an origin story or a comic of themselves. Its `references/learning-lab-brief.md` is about four Learning Lab staff and only matters for comics about them. The comic tools need `pnpm install` at the repo root (Sharp).
- Keys live in `.env` (for `utils/`) and `nextjs/.env.local` (for the app). Never print, copy, or commit them.
