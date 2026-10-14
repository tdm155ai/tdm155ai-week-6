---
title: fal's agent skills
description: Read cinematography, prompting, and recipes as examples of skills that work together.
author: codex
order: 1
checked: 2026-10-14
---

# fal's agent skills

The [fal-ai-community/skills repository](https://github.com/fal-ai-community/skills) contains agent skills and supporting reference files. Read the actual Markdown files on GitHub to see how the instructions are organized. Its execution workflow uses the separate [genmedia CLI](https://github.com/fal-ai-community/genmedia-cli); those commands require that tool to be installed and configured.

| Start here | What to look for |
| --- | --- |
| [cinematography/SKILL.md](https://github.com/fal-ai-community/skills/blob/main/skills/cinematography/SKILL.md) | How shot direction gathers subject, context, framing, motion, atmosphere, and color; how it checks the endpoint schema before executing. |
| [fal-prompting/SKILL.md](https://github.com/fal-ai-community/skills/blob/main/skills/fal-prompting/SKILL.md) | How a short entry point sends the agent to family-specific references for Kling, GPT Image 2, and Happy Horse. |
| [fal-recipes/SKILL.md](https://github.com/fal-ai-community/skills/blob/main/skills/fal-recipes/SKILL.md) | How a production job combines inputs, generation steps, prompts, and review criteria. |
| [Character-design recipe](https://github.com/fal-ai-community/skills/blob/main/skills/fal-recipes/references/character-design.md) | A reference to investigate when building your character-continuity workflow. |
| [Cinematography recipe](https://github.com/fal-ai-community/skills/blob/main/skills/fal-recipes/references/cinematography.md) | A reference to investigate when connecting shot planning to still and video generation. |

Read the prompting advice for the family you actually select. fal's prompting skill contrasts short prompts for Happy Horse with longer structured prompts for GPT Image 2; treat that as family-specific advice to test, rather than a universal word-count rule. [Source: fal-prompting](https://github.com/fal-ai-community/skills/blob/main/skills/fal-prompting/SKILL.md).

For the challenge, notice the separation of jobs. One skill can preserve approved character facts; another can change the camera and light; a script can validate the provider's input fields. Decide where the human reviews the image before the next step runs.

fal's [How to Generate Videos With AI](https://fal.ai/learn/tools/how-to-generate-videos-with-ai) is a broader orientation to text-to-video and reference-driven workflows. Use the model's API page for parameter names and accepted values when you implement your script.
