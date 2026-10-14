---
name: md-to-docx
description: Convert Markdown files (.md) into Word documents (.docx), one file, several, or a whole folder, keeping headings, lists, tables, code, links, footnotes and images. Use this whenever the user wants a Markdown note, README, essay, script or page from this repo as a Word file, wants to "export", "save as Word", "turn into a docx", hand a .md to someone who uses Word or Google Docs, or print/submit something written in Markdown, even if they don't say "docx".
---

# Markdown to Word

Turn Markdown into a `.docx` that opens cleanly in Word, Pages or Google Docs. The heavy lifting is pandoc; the bundled script handles the details that usually go wrong (image paths, YAML frontmatter, folders of files) so every conversion is the same one command.

## Convert

Run the script from anywhere; paths are resolved for you:

```sh
node .agents/skills/md-to-docx/scripts/md-to-docx.mjs <file.md|folder>... [options]
```

| Option | What it does |
| --- | --- |
| `--out <dir>` | Write the `.docx` files there instead of beside each source |
| `--reference-doc <style.docx>` | Use another Word file's styles (fonts, heading colors, margins) |
| `--toc` | Add a table of contents at the top |
| `--strip-frontmatter` | Drop the YAML frontmatter instead of turning it into a title block |

A folder is searched recursively for `.md` / `.markdown` files (hidden folders skipped). Each output is named after its source (`essay.md` → `essay.docx`); converting again replaces the earlier `.docx`, which is what people expect from an export. If the user wants to keep an earlier version, use `--out` with a new folder.

If pandoc is missing, the script exits with install instructions (`brew install pandoc` on macOS). Tell the user and stop; don't try to hand-build a .docx.

## Choices to make

- **Where it goes.** Default is beside the source. If the source is inside the repo's `nextjs/content/` and the user didn't name a place, put it in `output/docx/` (gitignored) so Word files don't end up rendered or committed as site content.
- **Frontmatter.** Files in this repo start with `title`, `description`, `author`. By default pandoc turns `title` and `author` into a title block at the top of the document, which suits handouts and essays. If the user wants just the body (pasting into a template, submitting under their own name), use `--strip-frontmatter`. Note that `author: claude` would otherwise appear as the byline; mention it if the user is submitting the document as theirs.
- **Styling.** Pandoc's default look is plain. If the user has a template, school format or wants a specific font, use `--reference-doc` with a .docx that has the styles they want. To make one, `pandoc -o custom-reference.docx --print-default-data-file reference.docx`, then edit its styles in Word.
- **Long documents** with many headings benefit from `--toc`.

## What doesn't carry over

Tell the user about any of these that apply to their file, so nothing silently disappears:

- **Raw HTML** in the Markdown (`<div>`, `<video>`, `<details>`, inline styles) loses its tags and formatting; only the text inside survives, and embeds like video disappear.
- **Remote images** (`https://...`) are fetched when online; if a fetch fails pandoc warns and leaves the image out. Local images need paths relative to the Markdown file, which the script handles.
- **Links to other `.md` files** stay as links to `.md` files, which won't open from Word.
- **Mermaid diagrams, math in unusual syntaxes, and site-specific shortcodes** come through as plain text or code.

Read pandoc's warnings in the script's output (for example `Could not fetch resource`) and pass them on in plain language.

## Check the result

After converting, confirm the file exists and is non-empty, and spot-check the content when it matters (the user is submitting it, or the source had tables or images):

```sh
pandoc output.docx -t plain | head -40
```

Then tell the user where each `.docx` is, as a clickable path, plus anything from the list above that was lost.
