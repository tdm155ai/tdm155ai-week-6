import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { EventEmitter } from "node:events";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { createJob, listJobs, planJob, readJob, scriptArguments } from "../lib/video-jobs.mjs";

// A fake child process: records its arguments, then exits with the code the test chooses.
function fakeSpawn(calls, code = 0) {
  return (command, args, options) => {
    const child = new EventEmitter();
    child.stdout = new EventEmitter(); child.stderr = new EventEmitter();
    calls.push({ command, args, options });
    setTimeout(() => { child.stderr.emit("data", "fal request x; receipt: y\n"); child.emit("exit", code); }, 5);
    return child;
  };
}

test("planJob checks the form and scriptArguments builds the command students would type", () => {
  const plan = planJob({ provider: "openrouter", model: "google/veo-3.1-lite", prompt: "  A cat on a jetty ", duration: "4", resolution: "720p", aspect: "16:9", audio: "false", refField: "last_frame" });
  assert.equal(plan.prompt, "A cat on a jetty");
  assert.deepEqual(plan.options, { duration: "4", resolution: "720p", aspect: "16:9", audio: "false" });
  const args = scriptArguments(plan, "/tmp/reference.jpg");
  assert.ok(args[0].endsWith("utils/generate-video.mjs"));
  assert.deepEqual(args.slice(1), ["openrouter", "A cat on a jetty", "--model", "google/veo-3.1-lite", "--duration", "4", "--resolution", "720p", "--aspect", "16:9", "--audio", "false", "--ref", "/tmp/reference.jpg", "--ref-field", "last_frame"]);
  assert.equal(planJob({ provider: "fal", model: "fal-ai/ltx-2.3/text-to-video/fast", prompt: "x" }).refField, "image_url");
  assert.throws(() => planJob({ provider: "huit-gemini", model: "m", prompt: "x" }), /OpenRouter or fal/);
  assert.throws(() => planJob({ provider: "fal", model: "--dry-run", prompt: "x" }), /model id/);
  assert.throws(() => planJob({ provider: "fal", model: "a/b", prompt: "x", duration: "4; rm -rf" }), /whole number/);
  assert.throws(() => planJob({ provider: "fal", model: "a/b", prompt: "x", refField: "first_frame" }), /reference role/);
  assert.throws(() => planJob({ provider: "openrouter", model: "a/b", prompt: "   " }), /Write a prompt/);
});

test("createJob saves the reference and record, starts the script with --out, and the record follows the clip", async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "video-jobs-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const calls = [];
  const upload = { name: "frame.png", type: "image/png", size: 4, arrayBuffer: async () => new Uint8Array([137, 80, 78, 71]).buffer };
  const job = await createJob({ provider: "fal", model: "fal-ai/ltx-2.3/image-to-video/fast", prompt: "walk", duration: "6" }, { upload }, { root, spawn: fakeSpawn(calls), cwd: root });
  assert.equal(job.status, "running");
  assert.equal(job.reference.file, "reference.png");
  assert.equal(calls.length, 1);
  assert.equal(calls[0].options.cwd, root);
  const args = calls[0].args;
  assert.equal(args.at(-1), path.join(root, job.id, "run"));
  assert.equal(args[args.indexOf("--ref") + 1], path.join(root, job.id, "reference.png"));
  await new Promise((done) => setTimeout(done, 30));
  const after = JSON.parse(await readFile(path.join(root, job.id, "job.json"), "utf8"));
  assert.equal(after.status, "done");
  assert.match(after.log, /receipt/);
  // No clip on disk yet, so readJob reports what the record says; once the clip exists, it is done regardless.
  assert.equal((await readJob(job.id, root)).src, "");
  await mkdir(path.join(root, job.id, "run"), { recursive: true });
  await writeFile(path.join(root, job.id, "run", "video-01.mp4"), "mp4");
  const read = await readJob(job.id, root);
  assert.equal(read.status, "done");
  assert.equal(read.src, `/media/videos/${encodeURIComponent(job.id)}/run/video-01.mp4`);
  assert.equal(read.referenceSrc, `/media/videos/${encodeURIComponent(job.id)}/reference.png`);
  assert.equal((await listJobs(root))[0].id, job.id);
  await assert.rejects(() => createJob({ provider: "fal", model: "a/b", prompt: "x" }, { upload: { ...upload, type: "text/plain" } }, { root, spawn: fakeSpawn(calls), cwd: root }), /JPEG, PNG, or WebP/);
  await assert.rejects(() => createJob({ provider: "fal", model: "a/b", prompt: "x" }, { gallerySrc: "/media/../../.env" }, { root, spawn: fakeSpawn(calls), cwd: root }), /not a JPEG/);
  assert.equal(await readJob("../../etc", root), null);
});

test("a failed script marks the job failed with its exit code", async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "video-jobs-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const job = await createJob({ provider: "openrouter", model: "google/veo-3.1-lite", prompt: "x" }, {}, { root, spawn: fakeSpawn([], 1), cwd: root });
  await new Promise((done) => setTimeout(done, 30));
  const read = await readJob(job.id, root);
  assert.equal(read.status, "failed");
  assert.match(read.detail, /code 1/);
  assert.equal(read.reference, null);
});
