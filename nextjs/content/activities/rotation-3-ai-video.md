---
title: "Rotation 3: AI video and continuity"
description: Generate video from Claude Code, build continuity skills, and make plates for live greenscreen performance in the studio.
author: claude
order: 4
---

## The skill

- Keeping a character, a prop, and a place the same from shot to shot across generated video: the [character consistency](../concepts/learning-with-ai/character-consistency.md) problem.
- The studies that solve it are old: the [model sheet](../concepts/visual-art/model-sheet.md), the [storyboard](../concepts/visual-art/storyboard.md), the [animatic](../concepts/film/animatic.md), and film's [continuity](../concepts/film/continuity.md) records.

## What you build

- Generate video from the command line or Claude Code, and make skills that give you control over the process.
- A character sheet: one figure from several angles, in one style.
- Prop references and a background reference.
- A storyboard of a few shots, then the shots, then the check: is it the same character, the same cup, the same room?
- A background plate for a live greenscreen performance. You will go on the studio stage and try the background with your performance; the key happens in the ATEM.

## Tools and references

- [Challenge: build a set of video prompting skills](../skills/video-prompting-challenge.md): choose connected jobs, make references, approve stills, generate clips, and review continuity.
- [Open the capture machine](/capture): use a webcam or the Web Presenter's USB webcam output to capture poses, props, camera framing, and the live composite. [View the capture gallery](/live). Network streaming is in process.
- [Kling AI prompt guide](https://kling.ai/blog/kling-ai-prompt-guide): scene direction, camera language, references, and multi-shot planning.
- [fal's cinematography and prompting skills](../skills/reference/fal-skills.md): inspect the Markdown instructions and their reference files.
- [Higgsfield's camera controls](../skills/reference/higgsfield.md): decide which controls your own skills and scripts need to express.
- [Veo, Seedance, and Runway guide map](../skills/reference/model-guides.md) and [first/last-frame controls](../skills/reference/images-and-frames.md): use the documentation for your chosen endpoint.
- [Character references and background plates](../skills/reference/characters-and-plates.md): studies to try before the live stage test.
- [Studio streaming setup](../skills/reference/streaming-setup.md): connecting the Web Presenter, MediaMTX server, and capture page.

## The scripts you will run

The `utils/` folder at the root of this repo generates text, images, and video from the command line, through OpenRouter or fal, with the keys in the repo's `.env`. Run them from the repo root. Every run lands in its own folder under `output/` with the request and the response saved beside the result, so you can see exactly what was sent.

```sh
pnpm image fal "a character sheet: a young lighthouse keeper in a yellow raincoat, front, side, and back views, white background" --model fal-ai/flux/dev
pnpm video openrouter "the lighthouse keeper walks along the jetty at dusk, handheld, waves on the right" --model google/veo-3.1-lite --duration 4 --resolution 720p --aspect 16:9 --ref approved-shot.png --dry-run
pnpm video fal "the same keeper turns to face the camera as the beam sweeps past" --model fal-ai/ltx-2.3/image-to-video/fast --duration 6 --ref approved-shot.png --dry-run
```

- `pnpm image` makes the stills: the character sheet, the prop, the background. Add `--ref photo.png` on an editing model to work from a photograph. Compose and approve an actual scene image, saved here as `approved-shot.png`, before using it as a first frame. Keep the multi-view character sheet as an identity reference.
- `pnpm video` makes the clip. With `--ref` the image is the first frame (`--ref-field last_frame` or `reference` on OpenRouter changes what it is for); without it the prompt alone drives the shot. The script submits the job, waits, and prints the path of the `.mp4`. The examples above use `--dry-run` to show the request without spending anything; remove it when ready to generate.
- Find models with `node utils/list-openrouter-models.mjs --type video` (durations, resolutions, aspect ratios) or `node utils/list-fal-models.mjs --category image-to-video`. `--help` on any script lists its options; [utils/README.md](https://github.com/tdm155ai/tdm155ai-week-6/blob/main/utils/README.md) has the rest.
- `node utils/stills.mjs clip.mp4` pulls frames and a contact sheet out of a clip, which is how you check continuity between shots.

## Rebuilding the app

- An app like Higgsfield hides the steps behind one interface. Rebuilding them in code (reference images in, prompts per shot, a script that runs them) is [reopening the box](../concepts/learning-with-ai/reopening-the-box.md). See also [the interface](../concepts/learning-with-ai/the-interface.md) and [abstraction](../concepts/learning-with-ai/abstraction.md).
- The scripts above are the starting point; what you write down to make them repeatable (which model, which reference, which prompt pattern, what to check) is the beginning of a [skill for Claude](../concepts/learning-with-ai/agent-skill.md). Compare the [origin story](../skills/origin-story.md) skill, which already runs a character sheet and panel generation in order.

## Where the feedback comes from

- Side-by-side frames, as in the contact sheet; a partner naming what drifted.
- [Iteration](../concepts/learning-with-ai/iteration.md): a changed output is not evidence you learned; the note about why you changed the reference is.
- Capture the ATEM program output to compare the plate's horizon, scale, and lighting with the live performer. Revise the plate or stage setup based on what you see.

## To fill in

- The sample character or whether students bring their Unit 2 character.
- How many shots in the storyboard and how long the rotation has.
