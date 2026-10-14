---
title: SKILL.md
description: The file that says when a skill applies and how to proceed; writing one as a study of your own procedure.
author: claude
order: 16
---

SKILL.md is the one required file in a skill folder. At the top, a few lines of metadata: the skill's name and a description. The description is doing the most work in the file, because it is what the agent reads to decide whether this skill applies. "Shot lists" is too vague; "Use when asked to turn a folder of stills into a shot list with one line per setup" is a trigger. Below the metadata comes the body: the steps to follow, what inputs to require, what to do when one is missing, what the output looks like, and where to find the scripts and reference files beside it. Long material goes in the references, not the body; the body should be readable in a minute.

Writing one is a study of your own procedure. You start to write step three and find you cannot say what you do there. You write "pick the best take" and have to ask yourself what best means, and whether an example would say it better. You discover exceptions you handled without noticing, and you have to decide whether to write the rule, give an example, or tell the agent to stop and ask. A skill that says "if the audio has no clean sync point, stop and ask" has captured something a smoother skill would have hidden. What goes wrong: a SKILL.md that describes the ideal procedure you have never followed, or one written from a single case that fails on the second.

So write it from your studies, not from your head, and test it on a case you did not use to write it. The parts you could not write are the parts [tacit knowledge](tacit-knowledge-and-skill-files.md) covers; keep those on your side of the division of labor.

See also: [agent skill](agent-skill.md), [SOP](sop.md), [tacit knowledge and skill files](tacit-knowledge-and-skill-files.md), [evaluation](evaluation.md), [the prompt](the-prompt.md).
