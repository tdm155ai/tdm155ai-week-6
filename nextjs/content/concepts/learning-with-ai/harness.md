---
title: Harness
description: The loop around the model, with its tools, files, and checks; where the human stands in it.
author: claude
order: 24
---

A model by itself takes text and returns text. A harness is the program wrapped around it that turns that into work: it assembles the context, sends it, reads the reply, and when the model asks to read a file, run a script, search the web, or edit something, the harness does that and sends the result back, around and around until the task is done. Claude Code and Codex are harnesses. The chat box is a very thin one. When people say "the agent," they mean a model in a harness, and much of what makes an agent capable, or dangerous, is in the harness rather than the model.

The harness is where this week's objects live. A skill is loaded by the harness. An evaluation is run by it. The tool calls and file changes it shows are the workflow layer of the black box made visible, which is why working in a harness teaches you more about what a model did than working in a chat. And the harness is where you stand. You approve or refuse actions; you read the diff; you write the files it reads; you decide when it is done. The design question for any task is where in the loop the human is: before (writing the instructions), during (approving each step), after (reviewing the output), or nowhere, which is a choice too, and should be a deliberate one.

For the skills you keep, put yourself in the loop early, at the attempt; for the ones you delegate, put yourself at the check. A harness that lets you see every step and a habit of not looking are, together, the same as a chat box.

See also: [the interface](the-interface.md), [agent skill](agent-skill.md), [iteration](iteration.md), [context](context.md), [black box](black-box.md).
