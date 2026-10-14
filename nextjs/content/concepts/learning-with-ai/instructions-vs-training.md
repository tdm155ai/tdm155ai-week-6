---
title: Instructions vs. training
description: Editing a skill file is not learning in the weights; the four different ways a system improves, and the evidence for each.
author: claude
order: 18
---

"I taught Claude to make shot lists." That sentence can mean four different things, and the week's main piece of mental hygiene is to say which. One: you practiced, and your own ability to see what a shot list needs changed; the evidence is a new attempt by you, unaided. Two: you revised a skill file, so the instructions and references the model loads are better; the evidence is running the same fixed cases before and after and comparing. Three: you changed a script, so a piece of the behavior is now deterministic (the date format is enforced by code, not by asking nicely); the evidence is output checks and the failures the script catches. Four: a model was trained, so its parameters changed; the evidence is a separately specified evaluation, and this almost never happened in your project.

Only the first is learning in the sense the Learning category means. The second and third are revisions to an external artifact; the model next session is the same model, with better instructions in front of it. This is not a lesser thing. An instruction can be read, diffed, and tested in a way a habit cannot. But it is a different thing, and crediting it wrong causes confusion later: if a task became reliable because a script now enforces a rule, the model did not internalize the rule, and neither did you. The attribution has to be right for the next decision to be right, which is the same reason the [division of labor](division-of-labor.md) gets written down.

For the record this week, label each improvement with its mechanism: "me," "file," "script," "model." The last one you will mostly not get to write, and [model training](model-training.md) explains why.

See also: [agent skill](agent-skill.md), [model training](model-training.md), [evaluation](evaluation.md), [practice](../learning/practice.md), [division of labor](division-of-labor.md).
