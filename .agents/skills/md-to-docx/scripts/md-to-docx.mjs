#!/usr/bin/env node
// Convert Markdown files (or folders of them) to Word .docx with pandoc.
//
//   node md-to-docx.mjs <file.md|folder>... [--out <dir>] [--reference-doc <style.docx>] [--toc] [--strip-frontmatter]
//
// Each .docx lands beside its source unless --out is given. Images are resolved
// relative to each Markdown file's own folder, so relative image paths work.

import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, extname, join, relative, resolve } from "node:path";

const args = process.argv.slice(2);
const inputs = [];
const opts = { out: null, referenceDoc: null, toc: false, stripFrontmatter: false };

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "--out") opts.out = resolve(args[++i]);
  else if (a === "--reference-doc") opts.referenceDoc = resolve(args[++i]);
  else if (a === "--toc") opts.toc = true;
  else if (a === "--strip-frontmatter") opts.stripFrontmatter = true;
  else if (a === "-h" || a === "--help") usage(0);
  else if (a.startsWith("--")) { console.error(`Unknown option ${a}`); usage(1); }
  else if (!a.trim()) { console.error("Empty path given."); process.exit(1); }
  else inputs.push(resolve(a));
}
if (!inputs.length) usage(1);

function usage(code) {
  console.log("Usage: md-to-docx.mjs <file.md|folder>... [--out <dir>] [--reference-doc <style.docx>] [--toc] [--strip-frontmatter]");
  process.exit(code);
}

const pandoc = spawnSync("pandoc", ["--version"], { encoding: "utf8" });
if (pandoc.error || pandoc.status !== 0) {
  console.error("pandoc is not installed. Install it (macOS: `brew install pandoc`; others: https://pandoc.org/installing.html) and run again.");
  process.exit(2);
}

if (opts.referenceDoc && !existsSync(opts.referenceDoc)) {
  console.error(`Reference doc not found: ${opts.referenceDoc}`);
  process.exit(1);
}

// Returns { src, rel } pairs; rel is the path under the input folder, so that
// --out keeps the folder structure and same-named files don't overwrite each other.
function collect(p, root = null) {
  if (!existsSync(p)) { console.error(`Not found: ${p}`); return []; }
  if (statSync(p).isDirectory()) {
    return readdirSync(p, { withFileTypes: true })
      .filter((e) => !e.name.startsWith(".") && e.name !== "node_modules")
      .flatMap((e) => collect(join(p, e.name), root ?? p));
  }
  if (![".md", ".markdown"].includes(extname(p).toLowerCase())) return [];
  return [{ src: p, rel: root ? dirname(relative(root, p)) : "." }];
}

const files = inputs.flatMap((p) => collect(p));
if (!files.length) { console.error("No Markdown files found."); process.exit(1); }

let failed = 0;
for (const { src, rel } of files) {
  const outDir = opts.out ? join(opts.out, rel) : dirname(src);
  mkdirSync(outDir, { recursive: true });
  const dest = join(outDir, basename(src, extname(src)) + ".docx");

  let input = src;
  let tmp = null;
  if (opts.stripFrontmatter) {
    const text = readFileSync(src, "utf8").replace(/^---\r?\n[\s\S]*?\r?\n(---|\.\.\.)\r?\n/, "");
    tmp = join(tmpdir(), `md-to-docx-${process.pid}-${basename(src)}`);
    writeFileSync(tmp, text);
    input = tmp;
  }

  const pandocArgs = [
    input,
    "--from", "markdown+pipe_tables+grid_tables+footnotes+task_lists+autolink_bare_uris+yaml_metadata_block",
    "--to", "docx",
    "--output", dest,
    "--resource-path", dirname(src),
    "--standalone",
  ];
  if (opts.toc) pandocArgs.push("--toc");
  if (opts.referenceDoc) pandocArgs.push("--reference-doc", opts.referenceDoc);

  const r = spawnSync("pandoc", pandocArgs, { encoding: "utf8" });
  if (tmp) rmSync(tmp, { force: true });
  if (r.stderr?.trim()) console.error(r.stderr.trim());
  if (r.status === 0) console.log(`${src} -> ${dest}`);
  else { failed++; console.error(`FAILED: ${src}`); }
}

process.exit(failed ? 1 : 0);
