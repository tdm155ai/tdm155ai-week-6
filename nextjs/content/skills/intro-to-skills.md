---
title: What is a Claude skill?
description: Skills are folders of instructions and tools that Claude loads when a task calls for them. How they work, and how to write one.
author: claude
order: 1
---

# What is a Claude skill?

A **skill** is a folder that teaches Claude how to do a particular job. At minimum it holds one file, `SKILL.md`, with a name, a one-line description, and instructions. It can also hold reference documents, examples, templates, and scripts. Claude Code, the Claude apps, and the Claude API can all use skills.

The idea is close to the studio's: a skill captures *how a job is done well* so it doesn't have to be explained again every time. A standard operating procedure for a person is an ancestor of the skill; a skill is an SOP that an agent can read and follow, with the tools attached.

## How Claude uses a skill

1. **It sees the description.** At the start of a session Claude reads only each skill's name and description, a line or two each. That is cheap, so you can have many skills installed.
2. **It decides the skill applies.** When your request matches a description ("make me an origin-story comic"), Claude opens that skill's `SKILL.md`. You can also call a skill by name with a slash command, like `/origin-story`.
3. **It reads more only as needed.** `SKILL.md` points to reference files ("for the interview, read `references/interview.md`"), and Claude opens them when it reaches that step. This is called *progressive disclosure*: the skill can hold a lot of knowledge without filling Claude's attention with all of it at once.
4. **It runs the scripts.** Anything that should be done the same way every time (resizing images, building an HTML reader, calling an API) goes in a script the skill tells Claude to run, rather than in prose Claude has to reinterpret.

## What a skill is not

A skill doesn't change the model. Claude doesn't *learn* in the sense that you learn when you practice: nothing is trained into its weights, and it forgets the skill the moment it's no longer loaded. What a skill does is put the right knowledge in front of the model at the right time. That is why writing one is a test of what *you* know. If you can't say what a good storyboard, a good mix, or a good character sheet looks like, the skill can't either.

## Where skills live

In a project, skills go in `.claude/skills/<name>/`. This repo keeps the real folder in `.agents/skills/<name>/` (so other coding agents can use it too) and links it from `.claude/skills/<name>`. Skills you want in every project go in `~/.claude/skills/<name>/` in your home folder.

## Anatomy of `SKILL.md`

```markdown
---
name: storyboard
description: Turn a scene description into a six-panel storyboard with shot sizes and camera notes. Use when the user asks for a storyboard, shot list, or boards for a scene.
---

# Storyboard

1. Ask for the scene, the location, and the characters if they're missing.
2. Break the scene into six beats. For each, choose a shot size and camera move.
3. Write the panel list before generating any images.
4. ...

For shot-size conventions, read [references/shots.md](references/shots.md).
```

- **The description is the trigger.** Say what the skill does *and* when to use it, in the words someone would use to ask for it.
- **The body is instructions, in order.** Write them the way you'd brief a capable assistant who has never done this job: the steps, the decisions, the common mistakes, and what "done" looks like.
- **Keep `SKILL.md` short.** Move long background, examples, and checklists into `references/` and link them from the step where they're needed.
- **Put the repeatable parts in scripts.** If the same command or code would be written every time, write it once in `scripts/`.

## Making one

The easiest way: do the job with Claude once, by hand, in conversation. When it comes out well, ask Claude to turn what you just did into a skill. Then use it on a new case, notice where it goes wrong, and revise the skill. That loop of trying, noticing, and revising is a study, the same as a page of drawn hands.
