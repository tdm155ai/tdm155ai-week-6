---
title: Origin story
description: The skill in this repo that turns your story and photos into a four- or eight-panel comic. What it does, how to use it, how it's built, and how to make one like it.
author: claude
order: 2
---

# Origin story

`origin-story` is a Claude skill that ships with this repo. Give it a few sentences about where you come from and what you can do, and optionally a photo or two, and it writes a comic script, designs your character, generates the art, and builds a little comic book you can open in a browser: four or eight panels, with a page reader and a gallery of every image it made.

It's a good first skill to study because it is a whole production workflow in miniature. A comic used to take a writer, a character designer, a penciller, a letterer, and an editor. The skill doesn't pretend those jobs disappeared. It writes down how each one should be done, in order, and hands the repeatable parts to scripts.

## Using it

1. **Set up once.** From the repo root, run `pnpm install` (the comic tools need Sharp for image processing). Put an OpenRouter key in the root `.env` as `OPENROUTER_API_KEY` (or a fal key as `FAL_API_KEY`, or a Harvard key as `HUIT_API_KEY`). Keys stay in `.env` and never go in the comic.
2. **Open Claude Code in the repo** and ask for it, in your own words or by name:

   > Use /origin-story. I grew up on a dairy farm in Wisconsin, and now I edit documentaries. Here's a photo of me. Make it four panels.

3. **Answer one question, or don't.** Claude reads what you gave it and offers *one* chance to add the details that would help most: the actual ability, a scene where it first showed up, the tone, your appearance. You can add them, ask for a longer interview (one question at a time), or say "just go with what you have."
4. **Review the script.** Before any images, Claude writes the panel-by-panel script: what's drawn, the caption boxes, the dialogue. If you asked to see the text first, it stops here for your edits.
5. **Watch it build.** It makes a character sheet for you (if the comic needs one), checks it, then generates the panels one at a time and inspects each.
6. **Open the comic.** By default it lands in `~/Downloads/<comic-title>/`. Open `index.html`: there's a page reader and a gallery of every image, including the alternatives. The folder works on its own, so you can move it, zip it, or send it.

Things you can ask for: eight panels instead of four; a particular genre of origin (a DC-like "elsewhere" origin, a cosmic accident, a mutant, a hero built from tools and practice); a team comic where several people's origins are framed by the story of how they met; a specific image model.

## How it's built

```text
.agents/skills/origin-story/
  SKILL.md                     the instructions Claude follows, in order
  agents/openai.yaml           the same skill described for other agents
  references/
    interview.md               how to ask, and when to stop asking
    story-craft.md             from a life to four or eight panels; genre variations
    comic-production.md        the plan file and the commands
    image-workflow.md          character consistency and model handling
    learning-lab-brief.md      the original example (four Lab staff), only for that comic
  scripts/prepare.mjs          turns a script into image prompts
utils/comic.mjs                the production tool: init, status, generate, import, render
```

`.claude/skills/origin-story` is a link to `.agents/skills/origin-story`, which is how Claude Code finds it.

What each part does:

- **`SKILL.md` is short and in order.** Start with what the person gave you. Choose four or eight panels and a rendering mode. Write the script before generating anything. Make a production plan. Generate the character sheets, then the panels, inspecting each one. Build the reader and check it. Each step points to the reference file that holds the details, so Claude only reads `story-craft.md` when it's writing the story.
- **The references hold the craft knowledge.** `story-craft.md` is what a comics writer knows: find the causal line from a place to an ability; give each panel one drawable instant; use narration boxes for the context a reader needs; read only the lettering back and ask whether a stranger could follow it. `interview.md` is what a good interviewer knows: ask one thing at a time, follow the interesting answer, stop when the person says stop. `image-workflow.md` is what a character designer and continuity supervisor know: make a character sheet first, attach the image itself (not a description of it) to every panel request, check that the face is still the same face.
- **The scripts hold what should be the same every time.** `utils/comic.mjs` creates the comic folder, keeps track of every job and every take, compresses reference images, calls the image model, never overwrites an earlier image, and rebuilds the HTML reader after each one. Claude doesn't have to reinvent any of that, and it can't get it subtly wrong.
- **The rules encode taste and ethics.** Show a particular ability working; don't label a generic virtue. Don't invent trauma or a tidy lesson. Keep invented stage business separate from facts about the person. Don't claim a likeness when there was no photo. These are the judgments a good editor would make, written down so the agent makes them too.

## Making one like it

Pick a production workflow you care about, from your Unit 2 project or from the [key concepts](/concepts): a storyboard, a podcast episode, a product photo shoot, a music video treatment, a lower-thirds package. Then:

1. **Do it by hand first, with Claude, in conversation.** Get one good result. Notice which steps mattered, which decisions you made, and where Claude went wrong without your help.
2. **List the roles.** Who would have done this job before (see [Who used to make this?](/who-used-to-make-this))? What did each of them know? That list is the outline for your references.
3. **Decide what you're learning and what Claude is doing.** This is the week's question. Some steps you want to internalize yourself: do those as studies, and maybe leave them out of the skill. Others you want Claude to do the right way: write those down.
4. **Write `SKILL.md`.** A description that says what it does and when to use it, then the steps in order. Keep it short. Ask Claude to draft it from your conversation; then edit it until it's what you would say.
5. **Move the craft into `references/`.** One file per kind of knowledge (the interview, the writing, the images), linked from the step that needs it.
6. **Move the repeatable parts into scripts.** If a step is a command or some code that should be identical every time, make it a script. You can start by asking Claude to write one, borrowing from `utils/`.
7. **Put it in `.claude/skills/<name>/`** (or in `.agents/skills/<name>/` with a link from `.claude/skills/`, like this one).
8. **Test it on a new case and revise.** Start a fresh Claude Code session, ask for the job without explaining anything, and watch what happens. Every place it goes wrong is something the skill didn't say. Fix the skill, not the result, and run it again.

That last step is a study in the painter's sense: the same problem attempted again with one thing changed, until you can see what makes it work.
