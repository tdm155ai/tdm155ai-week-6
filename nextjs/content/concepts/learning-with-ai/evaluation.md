---
title: Evaluation
description: Tests for a skill, and how you know it works; the eval as the model's version of the exam.
author: claude
order: 23
---

You have built a skill that turns a folder of stills into a shot list. Does it work? The way to know is an evaluation: a small set of cases with answers you have judged in advance, run through the skill, with the results compared against your judgment. Three cases at minimum. The original case you built the skill from, which it had better pass. A new valid case it has not seen, which is the real test. And a case where the right behavior is to decline or ask: a folder with no stills, a still with no readable metadata. A skill that confidently produces a shot list from nothing has failed the third case, and that is the most important one to write.

The eval is the model's version of the exam, and it has the same relation to practice that the exam has. During development, the skill seems to work because you are watching it on the cases you are thinking about; the eval is the unassisted test on cases you were not. It measures the arrangement (model plus file plus scripts), not the model's learning, and it tells you whether the file is good. For your own learning the analogue is the unaided attempt, and the two should not be confused: a skill that passes its eval is evidence about the skill, not about you. What goes wrong: evaluating only on the case you wrote from; judging a skill by how long and thorough it looks; and changing the definition of the target midway so that whatever came out counts as passing.

Keep the cases. When you revise the skill, run them again; that is the comparison that tells you whether the revision helped, and it is the only form of feedback a file can get.

See also: [learning vs. performance](../learning/learning-vs-performance.md), [feedback](../learning/feedback.md), [agent skill](agent-skill.md), [studies for an agent](studies-for-an-agent.md), [iteration](iteration.md).
