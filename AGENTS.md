# TDM 155AI week 6: instructions for AI assistants

This repository is the week 6 reference and toolkit for TDM 155AI (*Making Stuff in the Age of AI*): Studies and Skills (class October 14, 2026). Students are in the Unit 2 project, in which each researches, learns, and prototypes a form of media they want to make; week 6 is the studies. The site has four sections (activities, concepts, skills, explorations) and a Tools tab (`/tools`: webcam capture, the live gallery of stills, a video generator, and a looping gallery of the clips it made). Week 5's student notebook tools are not in this repo. A minimal still capture was reintroduced at Marlon's request on October 14; network streaming is paused in process, with `streaming-server/HANDOFF.md` for work on the target machine.

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
- **`nextjs/content/explorations/`**: illustrated cases from Madeleine's week 6 collection: sequences, studies, practice, and `texts/` (sixteen passages in the makers' and teachers' own words, from public-domain editions, each with its edition, license, and source link). `/explorations` is a gallery with a field filter. Preserve original authorship, source metadata, image credits, and qualifications. Sections headed `Optional exercises` display separately from the case account; they are suggestions, not assignments. The hidden `_import.json` records copy provenance and corrections.
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
- The app is plain JavaScript with its own CSS (`app/globals.css`); no TypeScript or Tailwind. `/capture`, `/api/capture`, `/media/...`, and `/live` provide local webcam still capture and a gallery. `/tools/video` (`app/tools/video/`, `lib/video-jobs.mjs`, `/api/video`) generates a clip by spawning `utils/generate-video.mjs` with the repo's keys, from a prompt and an optional reference still (uploaded, or one of the captures); each job is a folder in `_media/videos/<id>/` with `job.json`, the reference, and the script's `run/` folder, and `/tools/videos` shows the finished clips looping. `_media/` is gitignored; captures and clips stay on the machine running Next. Network streaming is in process, not implemented.
- `utils/` (at the repo root, outside the app) has scripts for generating text, images, and video through OpenRouter, fal, and Harvard's HUIT gateways (video: OpenRouter and fal); see [`utils/README.md`](utils/README.md). Run them from the repo root with `pnpm text`, `pnpm image`, `pnpm video`. What they make lands in `output/`, one folder per run with the request and response records. Video is the rotation 3 tool: `pnpm video openrouter "..." --model google/veo-3.1-lite --duration 4 --ref frame.png` makes a clip from a first frame; `node utils/list-openrouter-models.mjs --type video` and `node utils/list-fal-models.mjs --category image-to-video` list the models.
- The `origin-story` skill (`.agents/skills/origin-story/`, linked from `.claude/skills/`) turns a student's story and photos into a four- or eight-panel comic with `utils/comic.mjs`; read its `SKILL.md` when a student asks for an origin story or a comic of themselves. Its `references/learning-lab-brief.md` is about four Learning Lab staff and only matters for comics about them. The comic tools need `pnpm install` at the repo root (Sharp).
- Keys live in the root `.env`, for `utils/` only; the app needs none. Never print, copy, or commit them.
