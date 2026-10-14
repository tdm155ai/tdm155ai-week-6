import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { getEntries, getEntry, getRoot, resolveMarkdownHref } from "../lib/content.mjs";

// Run from nextjs/ (`pnpm test`): lib/content.mjs reads content/ under the current directory.

test("the concepts folder has its categories, each with an essay and its entries", async () => {
  const concepts = (await getEntry(["concepts"]))?.entry;
  assert.ok(concepts, "content/concepts/ exists");
  assert.equal(concepts.kind, "folder");
  const names = concepts.folders.map((folder) => folder.slug.replace(/^concepts\//, ""));
  assert.deepEqual(names.slice(0, 2), ["learning", "learning-with-ai"], "the two foundation categories come first");
  assert.equal(names.length, 11);
  for (const folder of concepts.folders) {
    assert.ok(folder.content.trim().length > 0, `${folder.slug} has an essay`);
    assert.ok(folder.docs.length >= 18, `${folder.slug} has its entries`);
    assert.notEqual(folder.order, 999, `${folder.slug} has an order`);
  }
});

test("relative links between Markdown files become routes", () => {
  assert.equal(resolveMarkdownHref("repetition.md", "concepts/music"), "/concepts/music/repetition");
  assert.equal(resolveMarkdownHref("../learning/repetition.md", "concepts/music"), "/concepts/learning/repetition");
  assert.equal(resolveMarkdownHref("README.md", "concepts/music"), "/concepts/music");
});

test("the site keeps this week's collections and excludes the retired notebook tools", async () => {
  const root = await getRoot();
  const folders = new Map(root.folders.map((folder) => [folder.slug, folder]));
  for (const collection of ["concepts", "skills", "explorations"]) {
    assert.ok(folders.get(collection)?.count > 0, `${collection} retains its content`);
  }
  for (const retired of ["dictate", "transcribe", "notebook", "graphics", "readings"]) {
    assert.equal(await getEntry([retired]), null);
  }
  for (const slug of ["concepts/visual-art/study", "concepts/visual-art/sketchbook", "skills/intro-to-skills", "skills/origin-story"]) {
    assert.ok((await getEntry(slug.split("/")))?.entry.content.trim(), `${slug} remains readable`);
  }
});

test("all imported explorations remain readable after removing capture features", async () => {
  const manifest = JSON.parse(await readFile(new URL("../content/explorations/_import.json", import.meta.url), "utf8"));
  const entries = new Map((await getEntries()).map((entry) => [entry.slug, entry]));
  assert.ok(manifest.pages.length >= 49);
  for (const page of manifest.pages) {
    const slug = page.destination.replace(/\.md$/, "");
    const entry = entries.get(slug);
    assert.ok(entry?.content.trim(), `${slug} remains readable`);
    assert.equal(entry.data.source_commit, manifest.commit);
  }
  const horse = entries.get("explorations/sequences/leonardo-sforza-horse");
  assert.ok(horse.data.sequence.some((item) => item.image), "Leonardo's artifact images remain available");
});
