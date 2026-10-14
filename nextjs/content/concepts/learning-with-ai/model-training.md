---
title: Model training
description: Pretraining, fine-tuning, LoRA, and RLHF in one entry: what training is, how it resembles practice and how it does not, and why you mostly will not do it.
author: claude
order: 19
---

Training is the process that sets a model's parameters, and it comes in stages. Pretraining is the big one: the model reads an enormous body of text (or images, or both) and is adjusted, step by step, to predict what comes next; this is where nearly all of what it knows comes from. Fine-tuning continues the training on a smaller, chosen set to shift the model toward a task or a style. A LoRA (low-rank adaptation) is a cheap fine-tune that leaves the original weights alone and trains a small add-on; in image generation, a LoRA is how people teach a model a specific character or look from a few dozen pictures. RLHF, reinforcement learning from human feedback, is a later stage in which people rate outputs and the model is adjusted toward the preferred kind. The chat models you use have been through all of these.

Training resembles practice in the obvious way: repeated attempts, a signal about how wrong each one was, and a durable change in the system. The differences matter more. Nothing in training chooses the next task, notices a mismatch, or asks what it is learning; the feedback is a number, not a note; there is no metacognition and no education of attention. Training is what changes the model. Everything you will do this week changes its context instead, and the entry on [instructions vs. training](instructions-vs-training.md) is about not confusing the two.

You will mostly not train a model. It costs data, compute, and evaluation you do not have, and instructions plus examples get you most of the way for most tasks. The one exception within reach is a character LoRA for image generation, and if you make one, it is the one place where "I trained it" is plainly true.

See also: [instructions vs. training](instructions-vs-training.md), [few-shot](few-shot.md), [context](context.md), [character consistency](character-consistency.md), [practice](../learning/practice.md).
