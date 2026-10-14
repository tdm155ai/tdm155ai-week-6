import { randomUUID } from "node:crypto";
import { cleanUp, dictateConfig, publicConfig, saveAudio, saveSidecar, stamp, transcribe, withTimeout, writeNote } from "../../../lib/dictate.mjs";

export const dynamic = "force-dynamic";

// About 40 minutes of 16 kHz mono 16-bit audio.
const maxBytes = 80 * 1024 * 1024;

// The capture page asks whether a key is set and which models will run.
export async function GET() {
  return Response.json(publicConfig());
}

// Body: multipart form with `audio` (a WAV made in the browser) and an optional `hint` (what the note is about).
// The recording is saved first, so a failed model call never loses it.
export async function POST(request) {
  let form;
  try { form = await request.formData(); } catch { return Response.json({ error: "Expected a multipart form." }, { status: 400 }); }

  const audio = form.get("audio");
  const hint = String(form.get("hint") || "").trim().slice(0, 2000);
  if (!audio || typeof audio.arrayBuffer !== "function") return Response.json({ error: "No audio in the request." }, { status: 400 });
  if (audio.size > maxBytes) return Response.json({ error: "Recording is too long." }, { status: 413 });

  const wav = Buffer.from(await audio.arrayBuffer());
  if (wav.toString("ascii", 0, 4) !== "RIFF" || wav.toString("ascii", 8, 12) !== "WAVE") return Response.json({ error: "Only WAV recordings are accepted." }, { status: 415 });

  const date = new Date();
  const id = `${stamp(date)}-${randomUUID()}`;
  try { await saveAudio(wav, id); } catch (error) { return Response.json({ error: `Could not save the recording: ${error.message}` }, { status: 500 }); }

  const config = dictateConfig(request);
  const result = { id, audio: `nextjs/_media/dictation/${id}.wav` };
  const sidecar = { created: date.toISOString(), hint, transcribeModel: config.transcribeModel, cleanupModel: config.cleanupModel };
  if (!config.apiKey) {
    await saveSidecar(id, sidecar).catch(() => {});
    return Response.json({ ...result, warning: "Recording saved. Add an OpenRouter key on this page (or OPENROUTER_API_KEY in .env.local) to transcribe it." });
  }

  try {
    result.transcript = await withTimeout(transcribe(wav, config), 300000, "Transcription");
  } catch (error) {
    await saveSidecar(id, { ...sidecar, error: `transcription failed: ${error.message}` }).catch(() => {});
    return Response.json({ ...result, error: `Recording saved, but transcription failed: ${error.message}` }, { status: 502 });
  }
  sidecar.transcript = result.transcript;
  if (/^\[no speech\]$/i.test(result.transcript)) {
    await saveSidecar(id, sidecar).catch(() => {});
    return Response.json({ ...result, warning: "No speech in that recording, so no note was made." });
  }

  // If the cleanup fails, the note is still written, with the raw transcript as its body.
  let doc;
  try {
    doc = await withTimeout(cleanUp(result.transcript, hint, config), 180000, "Cleanup");
  } catch (error) {
    result.warning = `Cleanup failed (${error.message}); the note has the raw transcript.`;
    doc = { title: "", description: "", body: result.transcript };
  }
  doc.title ||= `Dictated note, ${date.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}`;
  doc.description ||= hint || "";

  try {
    const note = await writeNote({ id, date, ...doc });
    Object.assign(result, { title: doc.title, description: doc.description, href: `/${note.slug}`, file: note.file });
    sidecar.note = note.file;
  } catch (error) {
    result.error = `Transcribed, but the note couldn't be written: ${error.message}`;
  }
  await saveSidecar(id, sidecar).catch(() => {});
  return Response.json(result, { status: result.error ? 500 : 200 });
}
