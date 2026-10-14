---
title: Context
description: What the model has in front of it right now; context as working memory, and why it differs from what the model knows.
author: claude
order: 21
---

Claude does not know your footage. It does not know what you decided yesterday, what the teacher said, or what is in the folder next to the one you opened. What it has is its context: the text in front of it in this session, which is the system's instructions, your messages, the files it has read, the results of the tools it has run, and any skill it has loaded. Everything it does is computed from that plus what it learned in training. Context is the model's working memory, and like working memory it is limited, it fills, and it empties when the session ends.

The distinction that matters is between context and knowledge. What the model knows is fixed by [training](model-training.md) and cannot be changed by you. What it has in context is entirely up to you, and that is where all of this week's work happens: a prompt, an example, a skill file, a reference document, a transcript are all ways of putting something into context. This is why instructions can change behavior without changing the model, and why they stop working the moment they are not there. It is also why a model's answer about your project can be confidently wrong: it is working from what it was given, and if the thing it needed was in a file it did not read, it will fill the gap with something plausible.

Practically: know what is in the context when you ask. In a harness you can see which files were read; in a chat you have to remember what you pasted. When a result is wrong, the first question is not "why is the model bad" but "what did it have," which is the cheapest box to open.

See also: [the prompt](the-prompt.md), [few-shot](few-shot.md), [agent skill](agent-skill.md), [model training](model-training.md), [harness](harness.md).
