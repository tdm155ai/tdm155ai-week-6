import assert from "node:assert/strict";
import test from "node:test";
import { getEntry, resolveMarkdownHref } from "../lib/content.mjs";

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
