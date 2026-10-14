---
title: Markdown to Word
description: A small skill that turns any Markdown file, or a folder of them, into Word documents. What it does, how to use it, and how it's built.
author: claude
order: 4
---

# Markdown to Word

`md-to-docx` turns Markdown into `.docx` files you can open in Word, Pages or Google Docs, or hand in. Headings, lists, tables, code, links, footnotes and images come through; the title and author from the frontmatter become a title block.

## Using it

1. **Set up once.** Install [pandoc](https://pandoc.org/installing.html) (`brew install pandoc` on a Mac).
2. **Ask Claude Code**, in your own words or by name:

   > Use /md-to-docx on `nextjs/content/who-used-to-make-this.md`, without the frontmatter.

   > Turn everything in `nextjs/content/skills/` into Word files with a table of contents.

Claude tells you where each `.docx` landed and what didn't carry over (raw HTML, links to other `.md` files, diagrams).

## How it's built

It's the smallest useful shape of a skill: a `SKILL.md` that says when to use it and which choices to make (where the file goes, whether to keep the frontmatter, what to warn about), and one script, `scripts/md-to-docx.mjs`, that does the repeatable part the same way every time. The script wraps pandoc and handles the details that usually go wrong by hand: image paths relative to each Markdown file, folders converted with their structure kept, and frontmatter kept or stripped.

The skill lives in `.agents/skills/md-to-docx/`, linked from `.claude/skills/` like [origin-story](origin-story.md).

You can run the script yourself too:

```sh
node .agents/skills/md-to-docx/scripts/md-to-docx.mjs notes.md --out ~/Desktop
```

Options: `--out <dir>`, `--reference-doc <style.docx>` (borrow another Word file's fonts and styles), `--toc`, `--strip-frontmatter`.
