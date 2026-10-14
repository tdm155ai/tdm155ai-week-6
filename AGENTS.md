# TDM 155AI week 6: instructions for AI assistants

This repository is the week 6 reference and toolkit for TDM 155AI (*Making Stuff in the Age of AI*): Sketches and Studies (class October 14, 2026). Students are in the Unit 2 project, in which each researches, learns, and prototypes a form of media they want to make; week 6 is the studies. The site has four sections (activities, concepts, skills, explorations) and the repo has the generation scripts and the origin-story skill. Week 5's student notebook and capture tools are not in this repo (removed 2026-10-14).

## This week

The week's question: what do learning and skill look like after AI? Two answers run side by side: skills you build in yourself through studies and practice, and skills you build for Claude. The class on October 14 has two parts (Marlon, that morning):

1. **Talking about learning skills, and learning to make a `.claude` skill.** The concepts in `learning/` and `learning-with-ai/` are the vocabulary; `/skills` explains how a Claude skill works and shows the origin-story skill as the finished example.
2. **Three lab rotations**, one skill each:
   1. **Focus.** Cameras and difficult-to-focus lenses; the skill is focus.
   2. **Block printing, one skill per group.** Group one traces and transfers the image to the block, group two cuts, group three prints. The point: as in old-school web development and film, the skills of a job are distributed across people, and now across people and AI agents. The reflection is about the hand-offs.
   3. **AI video generation.** Character sheets, prop references, backgrounds, and story continuity; rebuilding in code what an app like Higgsfield does through its interface, with the scripts in `utils/`.

The activity pages in `nextjs/content/activities/` are outlines with concept links, filled in through the day. When a student asks what to do, start from the activity page for their rotation, then the concepts it links. Treat the "To fill in" sections as open until Marlon fills them; don't invent timings, materials, or model names.

## Where things go

Everything the site shows is Markdown in `nextjs/content/`, and each file is a page at the same path (`nextjs/content/skills/a.md` is `/skills/a`). There is no readings section (retired 2026-10-14); the week's one shared essay, the headcount in `nextjs/content/who-used-to-make-this.md`, is linked from the home page.

- **`nextjs/content/activities/`**: the day's plan: the skills talk and one page per rotation. `/activities` shows the folder as a docs site, every document in a sidebar; it is the first item in the nav.
- **`nextjs/content/concepts/`**: the week's key concepts. Each category (a field or medium: `music/`, `visual-art/`, …) is a folder whose `README.md` is the category's essay, with one Markdown file per concept. `/concepts` lists the categories in the sidebar; inside a category the sidebar lists only its concepts.
- **`nextjs/content/explorations/`**: illustrated cases from Madeleine's week 6 collection: sequences, studies, and practice. `/explorations` is a gallery with a field filter. Preserve original authorship, source metadata, image credits, and qualifications. Sections headed `Optional exercises` display separately from the case account; they are suggestions, not assignments. The hidden `_import.json` records copy provenance and corrections.
- **`nextjs/content/skills/`**: the week's Claude skills, explained: `intro-to-skills.md` and one page per skill (starting with `origin-story.md`). `/skills` shows the folder as a docs site, every document in a sidebar.
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
- The app is plain JavaScript with its own CSS (`app/globals.css`); no TypeScript, Tailwind, or API routes. Keep it that way.
- `utils/` (at the repo root, outside the app) has scripts for generating text and images through OpenRouter, fal, and Harvard's HUIT gateways; see [`utils/README.md`](utils/README.md). Run them from the repo root with `pnpm`. What they make lands in `output/`.
- The `origin-story` skill (`.agents/skills/origin-story/`, linked from `.claude/skills/`) turns a student's story and photos into a four- or eight-panel comic with `utils/comic.mjs`; read its `SKILL.md` when a student asks for an origin story or a comic of themselves. Its `references/learning-lab-brief.md` is about four Learning Lab staff and only matters for comics about them. The comic tools need `pnpm install` at the repo root (Sharp).
- Keys live in the root `.env`, for `utils/` only; the app needs none. Never print, copy, or commit them.
