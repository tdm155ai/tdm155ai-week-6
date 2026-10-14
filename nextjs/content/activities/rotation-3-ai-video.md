---
title: "Rotation 3: AI video and continuity"
description: Character sheets, prop references, backgrounds, and story continuity. Rebuilding in code what an app like Higgsfield does for you.
author: claude
order: 4
---

## The skill

- Keeping a character, a prop, and a place the same from shot to shot across generated video: the [character consistency](../concepts/learning-with-ai/character-consistency.md) problem.
- The studies that solve it are old: the [model sheet](../concepts/visual-art/model-sheet.md), the [storyboard](../concepts/visual-art/storyboard.md), the [animatic](../concepts/film/animatic.md), and film's [continuity](../concepts/film/continuity.md) records.

## What you build

- A character sheet: one figure from several angles, in one style.
- Prop references and a background reference.
- A storyboard of a few shots, then the shots, then the check: is it the same character, the same cup, the same room?

## Rebuilding the app

- An app like Higgsfield hides the steps behind one interface. Rebuilding them in code (reference images in, prompts per shot, a script that runs them) is [reopening the box](../concepts/learning-with-ai/reopening-the-box.md). See also [the interface](../concepts/learning-with-ai/the-interface.md) and [abstraction](../concepts/learning-with-ai/abstraction.md).
- The scripts in `utils/` (OpenRouter, fal) are the starting point; what you write down to make them repeatable is the beginning of a [skill for Claude](../concepts/learning-with-ai/agent-skill.md). Compare the [origin story](../skills/origin-story.md) skill, which already runs a character sheet and panel generation in order.

## Where the feedback comes from

- Side-by-side frames, as in the contact sheet; a partner naming what drifted.
- [Iteration](../concepts/learning-with-ai/iteration.md): a changed output is not evidence you learned; the note about why you changed the reference is.

## To fill in

- Which models and which utils commands, with a dry-run example.
- The sample character or whether students bring their Unit 2 character.
- How many shots in the storyboard and how long the rotation has.
