import { createJob, listJobs, readJob } from "../../../lib/video-jobs.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// POST: start a video job from the /tools/video form (multipart: provider, model, prompt, duration, resolution,
// aspect, audio, seed, refField, and either reference (a file) or gallery (a /media/... still)). Returns the job.
// GET ?id=...: one job's status; GET without id: every job, newest first.
export async function POST(request) {
  const origin = request.headers.get("origin");
  if ((origin && origin !== new URL(request.url).origin) || request.headers.get("sec-fetch-site") === "cross-site") return Response.json({ error: "Open the video tool on this app to generate." }, { status: 403 });
  if (Number(request.headers.get("content-length")) > 26 * 1024 * 1024) return Response.json({ error: "The reference image is too large." }, { status: 413 });
  let form;
  try { form = await request.formData(); } catch { return Response.json({ error: "Could not read the form." }, { status: 400 }); }
  const fields = Object.fromEntries(["provider", "model", "prompt", "duration", "resolution", "aspect", "audio", "seed", "refField"].map((key) => [key, form.get(key) ?? ""]));
  const reference = form.get("reference");
  try {
    const job = await createJob(fields, { upload: reference && typeof reference === "object" ? reference : null, gallerySrc: form.get("gallery") || "" });
    return Response.json(job, { status: 202 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}

export async function GET(request) {
  const id = new URL(request.url).searchParams.get("id");
  if (id) {
    const job = await readJob(id);
    return job ? Response.json(job) : Response.json({ error: "No such job." }, { status: 404 });
  }
  return Response.json(await listJobs());
}
