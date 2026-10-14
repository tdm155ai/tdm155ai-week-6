import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, readdir, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

test("voice and photographs persist to the same notebook, including failure recovery", async () => {
  const originalCwd = process.cwd();
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.OPENROUTER_API_KEY;
  const sandbox = await mkdtemp(path.join(os.tmpdir(), "tdm-notebook-test-"));
  await mkdir(path.join(sandbox, "nextjs"));
  process.chdir(path.join(sandbox, "nextjs"));
  try {
    const photoRoute = await import("../app/api/transcribe/route.js");
    const audioRoute = await import("../app/api/dictate/route.js");
    const mediaRoute = await import("../app/notebook-media/[filename]/route.js");
    const { getEntry } = await import("../lib/content.mjs");
    const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jz1kAAAAASUVORK5CYII=", "base64");
    const photos = (images = [png]) => {
      const form = new FormData();
      images.forEach((image, index) => form.append("images", new Blob([image], { type: "image/png" }), `page-${index}.png`));
      return new Request("http://localhost/api/transcribe", { method: "POST", body: form });
    };

    delete process.env.OPENROUTER_API_KEY;
    globalThis.fetch = async () => { throw new Error("Unexpected network call"); };
    assert.equal((await photoRoute.POST(photos([]))).status, 400);
    assert.equal((await photoRoute.POST(photos([Buffer.from("not a photo")]))).status, 415);
    assert.equal((await photoRoute.POST(photos(Array(13).fill(png)))).status, 413);
    const noKey = await (await photoRoute.POST(photos())).json();
    assert.ok(noKey.warning);
    assert.equal(noKey.href, undefined);
    assert.equal((await readdir(path.join(sandbox, "nextjs/_media/notebook"))).length, 2);

    process.env.OPENROUTER_API_KEY = "test-placeholder";
    let sent;
    globalThis.fetch = async (url, options) => {
      sent = JSON.parse(options.body);
      return Response.json({ choices: [{ finish_reason: "stop", message: { content: "TITLE: Test photographed note\nDESCRIPTION: A handwritten list.\n---\n## Page 1\n- Keep [illegible]\n\n## Page 2\nSecond page" } }] });
    };
    const saved = await (await photoRoute.POST(photos([png, png]))).json();
    assert.match(saved.href, /^\/notebook\//);
    assert.equal(sent.messages[0].content.filter((part) => part.type === "image_url").length, 2);
    const markdown = await readFile(path.join(sandbox, saved.file), "utf8");
    assert.match(markdown, /source: photograph/);
    assert.match(markdown, /\[illegible\]/);
    assert.match(markdown, /Source photograph 2/);
    assert.doesNotMatch(markdown, /dictation:/);
    const mediaName = saved.images[0].split("/").pop();
    const served = await mediaRoute.GET(null, { params: Promise.resolve({ filename: mediaName }) });
    assert.equal(served.status, 200);
    assert.deepEqual(Buffer.from(await served.arrayBuffer()), png);
    assert.equal((await mediaRoute.GET(null, { params: Promise.resolve({ filename: `${saved.id}.json` }) })).status, 404);
    assert.equal((await mediaRoute.GET(null, { params: Promise.resolve({ filename: "../secret.png" }) })).status, 404);

    const notebookFiles = await readdir(path.join(sandbox, "nextjs/content/notebook"));
    globalThis.fetch = async () => Response.json({ error: { message: "Model unavailable" } }, { status: 503 });
    const failedResponse = await photoRoute.POST(photos());
    assert.equal(failedResponse.status, 502);
    const failed = await failedResponse.json();
    assert.match(failed.error, /Photographs saved/);
    assert.deepEqual(await readdir(path.join(sandbox, "nextjs/content/notebook")), notebookFiles);
    const record = JSON.parse(await readFile(path.join(sandbox, "nextjs/_media/notebook", `${failed.id}.json`), "utf8"));
    assert.match(record.error, /Model unavailable/);
    assert.ok(record.images.length);

    globalThis.fetch = async (url, options) => {
      const payload = JSON.parse(options.body);
      const reply = Array.isArray(payload.messages[0].content)
        ? "Remember to compare notebooks."
        : "TITLE: Spoken note\nDESCRIPTION: Compare notebooks.\n---\nRemember to compare notebooks.";
      return Response.json({ choices: [{ message: { content: reply } }] });
    };
    const wav = Buffer.alloc(44);
    wav.write("RIFF", 0); wav.write("WAVE", 8);
    const form = new FormData();
    form.append("audio", new Blob([wav], { type: "audio/wav" }), "note.wav");
    const spoken = await (await audioRoute.POST(new Request("http://localhost/api/dictate", { method: "POST", body: form }))).json();
    assert.match(spoken.href, /^\/notebook\//);
    assert.match(await readFile(path.join(sandbox, spoken.file), "utf8"), /source: dictation/);
    assert.equal((await getEntry(["notebook"])).entry.docs.length, 2);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.OPENROUTER_API_KEY;
    else process.env.OPENROUTER_API_KEY = originalKey;
    process.chdir(originalCwd);
    await rm(sandbox, { recursive: true, force: true });
  }
});
