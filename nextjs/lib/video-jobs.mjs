// Video generation jobs for /tools/video: each job is a folder in _media/videos/<id>/ holding job.json (what was
// asked), an optional reference image, log.txt, and run/ (the folder utils/generate-video.mjs writes: request.json,
// the provider receipt, response.json, video-01.mp4). The page runs the same script students run from the
// terminal, as a child process of the Next server, so the tool and the command line do exactly the same thing.
import { spawn } from "node:child_process";
import { mkdir, readdir, readFile, writeFile, copyFile, stat } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { mediaRoot, resolveMedia } from "./media.mjs";

export const repoRoot = path.resolve(/* turbopackIgnore: true */ process.cwd(), "..");
export const videosRoot = path.join(mediaRoot, "videos");
const script = path.join(repoRoot, "utils", "generate-video.mjs");

// A few models to start from; the form also takes any model id. Durations and sizes are what the providers listed
// on 2026-10-14 (node utils/list-openrouter-models.mjs --type video; node utils/list-fal-models.mjs --category ...).
export const presets = [
  { provider: "openrouter", id: "google/veo-3.1-lite", label: "Veo 3.1 Lite (OpenRouter) · text or first frame · 4/6/8 s · 720p/1080p · 16:9 9:16", durations: [4, 6, 8], resolutions: ["720p", "1080p"], aspects: ["16:9", "9:16"] },
  { provider: "openrouter", id: "google/veo-3.1-fast", label: "Veo 3.1 Fast (OpenRouter) · text or first/last frame · 4/6/8 s · 720p/1080p", durations: [4, 6, 8], resolutions: ["720p", "1080p"], aspects: ["16:9", "9:16"] },
  { provider: "openrouter", id: "alibaba/wan-2.6", label: "Wan 2.6 (OpenRouter) · text or first frame · 5/10 s · 720p/1080p", durations: [5, 10], resolutions: ["720p", "1080p"], aspects: ["16:9", "9:16"] },
  { provider: "openrouter", id: "bytedance/seedance-2.0-mini", label: "Seedance 2.0 Mini (OpenRouter) · text, frames, or references · 4–15 s · 480p/720p", durations: [4, 5, 6, 8, 10], resolutions: ["480p", "720p"], aspects: ["16:9", "9:16", "1:1", "4:3", "3:4"] },
  { provider: "openrouter", id: "x-ai/grok-imagine-video-1.5-lite", label: "Grok Imagine 1.5 Lite (OpenRouter) · text or first frame · 1–15 s · 480p/720p/1080p", durations: [2, 4, 6, 8, 10], resolutions: ["480p", "720p", "1080p"], aspects: ["16:9", "9:16", "1:1", "4:3", "3:4"] },
  { provider: "fal", id: "fal-ai/ltx-2.3/text-to-video/fast", label: "LTX 2.3 Fast, text to video (fal) · 6–20 s · 1080p+ · 16:9 9:16", durations: [6, 8, 10, 12], resolutions: ["1080p", "1440p"], aspects: ["16:9", "9:16"], reference: false },
  { provider: "fal", id: "fal-ai/ltx-2.3/image-to-video/fast", label: "LTX 2.3 Fast, image to video (fal) · first frame · 6–20 s · 1080p+", durations: [6, 8, 10, 12], resolutions: ["1080p", "1440p"], aspects: ["16:9", "9:16"], reference: true },
  { provider: "fal", id: "fal-ai/kling-video/v2.5-turbo/pro/image-to-video", label: "Kling 2.5 Turbo Pro, image to video (fal) · first frame · 5/10 s", durations: [5, 10], resolutions: [], aspects: ["16:9", "9:16", "1:1"], reference: true },
  { provider: "fal", id: "fal-ai/wan/v2.7/text-to-video", label: "Wan 2.7, text to video (fal) · 5/10 s · 720p/1080p", durations: [5, 10], resolutions: ["720p", "1080p"], aspects: ["16:9", "9:16", "1:1"], reference: false },
];

export const referenceFields = {
  openrouter: [["first_frame", "First frame (image to video)"], ["last_frame", "Last frame"], ["reference", "Style or subject reference"]],
  fal: [["image_url", "First frame (image_url)"], ["end_image_url", "Last frame (end_image_url)"], ["image_urls", "Reference images (image_urls)"]],
};

const imageTypes = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" };

function clean(value, max = 200) { return String(value ?? "").trim().slice(0, max); }

// Check the form and turn it into the script's arguments. Throws a message the form can show.
export function planJob(fields) {
  const provider = clean(fields.provider, 20);
  if (!["openrouter", "fal"].includes(provider)) throw new Error("Choose OpenRouter or fal.");
  const model = clean(fields.model, 120);
  if (!/^[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(model)) throw new Error("Give a model id like google/veo-3.1-lite (letters, digits, dots, dashes, and slashes).");
  const prompt = clean(fields.prompt, 2000);
  if (!prompt) throw new Error("Write a prompt.");
  const options = {};
  for (const [name, test, message] of [
    ["duration", (v) => /^\d{1,3}$/.test(v) && Number(v) > 0, "Duration must be a whole number of seconds."],
    ["resolution", (v) => /^[0-9]{3,4}p$|^[124]K$/i.test(v), "Resolution looks like 720p, 1080p, or 2K."],
    ["aspect", (v) => /^\d{1,2}:\d{1,2}$/.test(v), "Aspect looks like 16:9."],
    ["seed", (v) => /^\d{1,12}$/.test(v), "Seed must be a whole number."],
  ]) {
    const value = clean(fields[name], 12);
    if (!value) continue;
    if (!test(value)) throw new Error(message);
    options[name] = value;
  }
  const audio = clean(fields.audio, 5);
  if (audio && !["true", "false"].includes(audio)) throw new Error("Audio must be on or off.");
  if (audio) options.audio = audio;
  const refField = clean(fields.refField, 20);
  if (refField && !referenceFields[provider].some(([key]) => key === refField)) throw new Error("That reference role is not one this provider accepts.");
  return { provider, model, prompt, options, refField: refField || referenceFields[provider][0][0] };
}

export function scriptArguments(plan, referencePath) {
  const args = [script, plan.provider, plan.prompt, "--model", plan.model];
  for (const [name, value] of Object.entries(plan.options)) args.push(`--${name}`, String(value));
  if (referencePath) args.push("--ref", referencePath, "--ref-field", plan.refField);
  return args;
}

// Save the reference image beside the job: an uploaded file, or a still already in the gallery (/media/...).
async function saveReference(directory, { upload, gallerySrc }) {
  if (upload && typeof upload.arrayBuffer === "function" && upload.size > 0) {
    const extension = imageTypes[upload.type];
    if (!extension) throw new Error("The reference must be a JPEG, PNG, or WebP image.");
    if (upload.size > 25 * 1024 * 1024) throw new Error("The reference must be smaller than 25 MB.");
    const file = path.join(directory, `reference${extension}`);
    await writeFile(/* turbopackIgnore: true */ file, Buffer.from(await upload.arrayBuffer()), { flag: "wx" });
    return { file, source: `upload: ${clean(upload.name, 120)}` };
  }
  const src = clean(gallerySrc, 400);
  if (!src) return null;
  if (!src.startsWith("/media/")) throw new Error("Choose a still from the gallery.");
  const segments = src.slice("/media/".length).split("/").map((part) => decodeURIComponent(part));
  const original = resolveMedia(segments);
  const extension = original && { ".jpg": ".jpg", ".jpeg": ".jpg", ".png": ".png", ".webp": ".webp" }[path.extname(original).toLowerCase()];
  if (!extension) throw new Error("That gallery item is not a JPEG, PNG, or WebP still.");
  const file = path.join(directory, `reference${extension}`);
  await copyFile(/* turbopackIgnore: true */ original, file);
  return { file, source: src };
}

// Create the job folder, save the reference, write job.json, and start the script. Returns the job record.
export async function createJob(fields, { upload, gallerySrc } = {}, deps = {}) {
  const plan = planJob(fields);
  const id = `${new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)}-${randomUUID().slice(0, 6)}`;
  const directory = path.join(deps.root || videosRoot, id);
  await mkdir(/* turbopackIgnore: true */ directory, { recursive: true });
  const reference = await saveReference(directory, { upload, gallerySrc });
  const job = { id, created: new Date().toISOString(), status: "running", provider: plan.provider, model: plan.model, prompt: plan.prompt, options: plan.options,
    reference: reference ? { file: path.basename(reference.file), source: reference.source, role: plan.refField } : null, out: "run" };
  await writeFile(/* turbopackIgnore: true */ path.join(directory, "job.json"), JSON.stringify(job, null, 2) + "\n", { flag: "wx" });
  const args = scriptArguments(plan, reference?.file);
  args.push("--out", path.join(directory, "run"));
  const spawner = deps.spawn || spawn;
  const child = spawner(process.execPath, args, { cwd: deps.cwd || repoRoot, stdio: ["ignore", "pipe", "pipe"], env: { ...process.env } });
  const log = [];
  for (const stream of [child.stdout, child.stderr]) stream?.on("data", (chunk) => { log.push(String(chunk)); if (log.length > 400) log.shift(); });
  const finish = async (status, detail) => {
    const record = { ...job, status, finished: new Date().toISOString(), detail, log: log.join("").slice(-4000) };
    try { await writeFile(/* turbopackIgnore: true */ path.join(directory, "job.json"), JSON.stringify(record, null, 2) + "\n"); } catch {}
  };
  child.on("error", (error) => finish("failed", `Could not start the script: ${error.message}`));
  child.on("exit", (code) => finish(code === 0 ? "done" : "failed", code === 0 ? "" : `The script exited with code ${code}.`));
  return job;
}

export async function readJob(id, root = videosRoot) {
  if (!/^[A-Za-z0-9-]+$/.test(id)) return null;
  const directory = path.join(root, id);
  let job;
  try { job = JSON.parse(await readFile(/* turbopackIgnore: true */ path.join(directory, "job.json"), "utf8")); } catch { return null; }
  const video = path.join(directory, "run", "video-01.mp4");
  let hasVideo = false;
  try { hasVideo = (await stat(/* turbopackIgnore: true */ video)).isFile(); } catch {}
  // The clip is the truth: if it is there the job is done, whatever the record says (a restarted server loses the exit event).
  if (hasVideo) job.status = "done";
  else if (job.status === "running" && Date.now() - Date.parse(job.created) > 45 * 60 * 1000) { job.status = "failed"; job.detail = "No clip after 45 minutes. Check the receipt in the run folder and resume it from the terminal."; }
  const base = `/media/videos/${encodeURIComponent(id)}`;
  return { ...job, src: hasVideo ? `${base}/run/video-01.mp4` : "", referenceSrc: job.reference ? `${base}/${encodeURIComponent(job.reference.file)}` : "" };
}

export async function listJobs(root = videosRoot) {
  let names;
  try { names = await readdir(/* turbopackIgnore: true */ root); } catch (error) { if (error.code === "ENOENT") return []; throw error; }
  const jobs = await Promise.all(names.filter((name) => !name.startsWith(".")).map((name) => readJob(name, root)));
  return jobs.filter(Boolean).sort((a, b) => Date.parse(b.created) - Date.parse(a.created));
}
