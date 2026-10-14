---
title: Agent skill
description: A folder of instructions and tools that tells a model how to do a job; the skill built for Claude is the week's second deliverable.
author: claude
order: 15
---

An agent skill is a folder. Inside it is a file called SKILL.md, which has a name, a short description of when the skill applies, and instructions for how to proceed; beside it, optionally, scripts the agent can run, reference documents it can read, and assets it can use. The folder sits in a place the harness looks (Claude Code reads `.claude/skills/`; other harnesses have their own locations). When you start a task, the agent sees the names and descriptions of all its skills; when one matches, it reads the full instructions. A skill for "make a shot list from a folder of stills" might hold the instructions, a script that extracts image metadata, and two example shot lists in the format you want.

Say plainly what it is and is not. It is text and files that get loaded into the model's context when relevant: procedural knowledge made external. It is not a change to the model. Next session the model is the same model with the same folder available. That is also its strength: you can read it, edit a line, run the task again on a fixed case, and see what changed, which is more than you can say for your own habits. The failure modes are a skill too long to be followed, too general to trigger, or one that hides a judgment the user needed to make.

Building one is the second deliverable, and what it trains in you is not model mechanics. It is the ability to say what you do: to name the steps, find the exceptions, choose a test, and discover which parts you could not write down. The entries on [SKILL.md](skill-md.md), [studies for an agent](studies-for-an-agent.md), and [evaluation](evaluation.md) are the three parts of that work.

See also: [SKILL.md](skill-md.md), [SOP](sop.md), [instructions vs. training](instructions-vs-training.md), [evaluation](evaluation.md), [studies for an agent](studies-for-an-agent.md).
