import assert from "node:assert/strict";
import { mkdtemp, readFile, symlink, writeFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { listMedia, mediaResponse, resolveMedia, saveStill } from "../lib/media.mjs";

test("captured stills persist with labels and are discoverable in the gallery", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "week6-capture-"));
  try {
    const bytes = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 1, 2, 3]);
    const first = await saveStill(bytes, "Stage camera reference", root);
    const second = await saveStill(bytes, "Prop reference", root);
    assert.notEqual(first.filename, second.filename, "rapid captures have distinct filenames");
    assert.deepEqual(await readFile(path.join(root, "webcam", first.filename)), bytes);
    const items = await listMedia(root);
    assert.equal(items.length, 2, "JSON sidecars stay out of the media gallery");
    assert.ok(items.some((item) => item.label === "Stage camera reference" && item.src === first.src));
    const response = await mediaResponse(new Request("http://localhost/media", { headers: { range: "bytes=1-3" } }), ["webcam", first.filename], root);
    assert.equal(response.status, 206);
    assert.equal(response.headers.get("content-range"), "bytes 1-3/7");
    assert.deepEqual(Buffer.from(await response.arrayBuffer()), bytes.subarray(1, 4));
    await assert.rejects(saveStill(Buffer.from("not an image"), "", root), /JPEG/);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test("media serving refuses traversal, sidecars, and symlinks outside the media folder", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "week6-media-"));
  const outside = path.join(path.dirname(root), `${path.basename(root)}-outside.jpg`);
  try {
    assert.equal(resolveMedia(["..", "outside.jpg"], root), null);
    assert.equal(resolveMedia(["nested/../../outside.jpg"], root), null);
    assert.equal(resolveMedia([".hidden.jpg"], root), null);
    const request = new Request("http://localhost/media");
    assert.equal((await mediaResponse(request, ["record.json"], root)).status, 404);
    await writeFile(outside, "private");
    await symlink(outside, path.join(root, "escape.jpg"));
    assert.equal((await mediaResponse(request, ["escape.jpg"], root)).status, 404);
    assert.deepEqual(await listMedia(root), []);
  } finally { await rm(root, { recursive: true, force: true }); await rm(outside, { force: true }); }
});
