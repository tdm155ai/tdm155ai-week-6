import { randomUUID } from "node:crypto";
import { stamp, withTimeout, writeNote } from "../../../lib/dictate.mjs";
import { imageType, photoConfig, photoLimits, savePhotoRecord, savePhotos, transcribePhotos } from "../../../lib/photos.mjs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const { apiKey, model } = photoConfig();
  return Response.json({ ready: Boolean(apiKey), model, limits: photoLimits });
}

export async function POST(request) {
  let form;
  try { form = await request.formData(); } catch { return Response.json({ error: "Expected a multipart form." }, { status: 400 }); }
  const files = form.getAll("images");
  if (!files.length || files.some((file) => typeof file.arrayBuffer !== "function" || !file.size)) {
    return Response.json({ error: "Choose at least one photograph." }, { status: 400 });
  }
  if (files.length > photoLimits.count || files.some((file) => file.size > photoLimits.perImage) || files.reduce((total, file) => total + file.size, 0) > photoLimits.total) {
    return Response.json({ error: "Use up to 12 images, at most 10 MB each and 30 MB altogether." }, { status: 413 });
  }
  const images = [];
  for (const file of files) {
    const bytes = Buffer.from(await file.arrayBuffer());
    const type = imageType(bytes);
    if (!type) return Response.json({ error: "Use JPEG, PNG, or WebP photographs." }, { status: 415 });
    images.push({ bytes, ...type });
  }

  const date = new Date();
  const id = `${stamp(date)}-${randomUUID()}`;
  const hint = String(form.get("hint") || "").trim().slice(0, 2000);
  const config = photoConfig(request);
  let names;
  try { names = await savePhotos(images, id); } catch (error) {
    return Response.json({ error: `Could not save the photographs: ${error.message}` }, { status: 500 });
  }
  const record = { created: date.toISOString(), hint, model: config.model, images: names };
  const result = { id, images: names.map((name) => `/notebook-media/${name}`) };
  if (!config.apiKey) {
    await savePhotoRecord(id, record).catch(() => {});
    return Response.json({ ...result, warning: "Photographs saved. Add an OpenRouter key on this page (or OPENROUTER_API_KEY in .env.local) to transcribe them." });
  }
  try {
    const doc = await withTimeout(transcribePhotos(images, hint, config), 300000, "Photo transcription");
    if (!doc.body) throw new Error("The model returned no transcription.");
    doc.title ||= `Photographed notes, ${date.toLocaleDateString("en-US")}`;
    doc.description ||= hint;
    record.transcript = doc.body;
    const sources = names.map((name, index) => `![Source photograph ${index + 1}](/notebook-media/${name})`).join("\n\n");
    const note = await writeNote({ id, date, ...doc, body: `${doc.body}\n\n## Source photographs\n\n${sources}`, source: "photograph", images: names.map((name) => `nextjs/_media/notebook/${name}`) });
    record.note = note.file;
    Object.assign(result, { title: doc.title, transcript: record.transcript, href: `/${note.slug}`, file: note.file });
  } catch (error) {
    record.error = error.message;
    result.error = `Photographs saved, but the notebook entry couldn't be completed: ${error.message}`;
  }
  await savePhotoRecord(id, record).catch(() => {});
  return Response.json(result, { status: result.error ? 502 : 200 });
}
