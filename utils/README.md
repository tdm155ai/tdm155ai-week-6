# Generation scripts

The image and text scripts from weeks 2 and 4: one command line for OpenRouter, fal, and Harvard's HUIT gateways (OpenAI, Gemini, and Claude through Bedrock). Run them from the repo root, outside `nextjs/`. They need Node 22.12 or newer and no npm packages. The Next app has its own dependencies and commands in `nextjs/`.

## Set up your keys

If you do not already have a `.env` in this repo, copy the empty template:

```sh
cp .env.example .env
```

Open `.env` and fill in `OPENROUTER_API_KEY` and `FAL_API_KEY` (and `HUIT_API_KEY` if you have one) with the keys provided in class. If `.env` already exists, update it rather than replacing it. Keep keys out of prompts, pages, screenshots, and Slack. `.env` and `output/` are ignored by Git; `.env.example` contains no keys.

## Try it

Preview a request without sending it or using credits:

```sh
node utils/generate-text.mjs openrouter "Reply with the single word HELLO." --model openai/gpt-5-mini --dry-run
```

Remove `--dry-run` to send it. Each run saves its output and its request and response records in a new folder under `output/text/` or `output/image/`.

An image:

```sh
node utils/generate-image.mjs fal "a small red apple on a white background" --model fal-ai/flux/dev
```

A reference image goes in with `--ref FILE` (PNG, JPEG, or WebP; repeatable). On fal, pick an editing endpoint; it receives references as `image_urls`, or add `--ref-field image_url` for an endpoint that takes one. `--help` on any script lists its options.

[`examples.md`](examples.md) has a working command for every provider and model route, with the models that worked.

## Find a model

```sh
node utils/list-text-models.mjs
node utils/list-image-models.mjs
node utils/list-fal-models.mjs --category image-to-image
```

Model availability and accepted parameters change; the offline tests don't establish that a particular live model is available today.

## All the scripts

| Script | Purpose |
| --- | --- |
| `generate-text.mjs` | Text from `openrouter`, `fal`, `huit-openai`, `huit-gemini`, or `huit-bedrock`. |
| `generate-image.mjs` | Images from `openrouter`, `fal`, `huit-openai`, or `huit-gemini`, with optional reference images. |
| `batch-text.mjs` | Compare text responses across models. |
| `batch-images.mjs` | Compare one text prompt across models and build a local HTML gallery. |
| `list-openrouter-models.mjs`, `list-text-models.mjs`, `list-image-models.mjs`, `list-fal-models.mjs` | Browse model catalogues. |
| `stills.mjs` | Extract video frames; requires ffmpeg and ffprobe. |

Package shortcuts mirror the direct commands: `pnpm text` runs `node utils/generate-text.mjs`, `pnpm image` runs `node utils/generate-image.mjs`, and `pnpm models` runs `node utils/list-image-models.mjs`. Run the offline tests with `pnpm test` (or `node --test utils/test/*.test.mjs`).

## Provenance

Copied on 2026-10-07 from `tdm155ai-week-4/utils/`, without that week's gallery sync. Week 4 copied them unchanged from `tdm155ai-week-2/utils/`; the generation adapters originally came from the Learning Lab's `ai-lab-context-pack/utils/`, and the model listers, batches, and stills tool were developed for week 2. Week 2's transcription, transcript player, comic, image compression, and local server scripts were left out. This is a local copy, not a sync. No credentials or generated media were copied.

Copied again on 2026-10-14 into `tdm155ai-week-6`, unchanged, from The Notebook's `interface/utils/` (itself a copy of `tdm155ai-week-5/utils/` by way of `ai-lab-week-5`).
