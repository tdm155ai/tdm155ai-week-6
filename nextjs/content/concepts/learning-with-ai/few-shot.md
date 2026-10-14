---
title: Few-shot
description: Examples in the prompt as worked examples for a model; what a model takes from them and what it does not.
author: claude
order: 22
---

Give the model three entries from your shot list in exactly the format you use, then say "continue for these stills," and it will continue in kind: same fields, same level of detail, same abbreviations. That is few-shot prompting, a few examples in the context instead of, or alongside, a description. It is the model's version of the worked example from the Learning category, where a novice studies a solved problem with its steps shown and does better on the next one than a novice given only the rule.

What a model takes from examples: the format, the tone, the length, which details are included and which left out, the implicit rules you would have struggled to state. Examples carry more of the tacit part of a task than instructions do, which is why a skill file's references folder is often more valuable than its steps. What it does not reliably take: the reasoning that produced the example. If the example shows a choice without showing why, the model copies the surface of the choice, and so does a student copying a worked solution. The remedy is the same in both cases: show the reasoning when it matters, and choose examples at the edges, where the rule is hard to apply, not in the middle where any example would do. Three well-chosen examples beat ten similar ones.

For the human learner, worked examples stop helping at a certain point, and problems you solve yourself take over. For the model there is no such point; it does not learn from the examples, it uses them each time. That difference is the whole of [instructions vs. training](instructions-vs-training.md) in one case.

See also: [worked example](../learning/worked-example.md), [imitation](../learning/imitation.md), [the prompt](the-prompt.md), [context](context.md), [SKILL.md](skill-md.md).
