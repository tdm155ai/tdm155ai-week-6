import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { notebookRoot } from "./content.mjs";

// A dictated note goes through two models on OpenRouter: an audio model writes down what was said, then a text model
// turns that transcript into a document. The recording and the raw transcript stay in nextjs/_media/dictation/ in the
// app (gitignored); the document goes to content/notebook/, where it is a page like any other. Settings come from
// nextjs/.env.local; see .env.example.

export const defaults = {
  transcribeModel: "google/gemini-3.8-flash",
  cleanupModel: "anthropic/claude-sonnet-5.5",
};

export const dictationRoot = path.resolve(process.cwd(), "_media", "dictation");
export const notesRoot = notebookRoot;

const env = (name) => (process.env[name] || "").trim();

// When nextjs/.env.local has no OPENROUTER_API_KEY, a page can send the user's own key with a request, in this header.
// It is used for that request only: never saved, logged, or written into a sidecar.
export const userKeyHeader = "x-openrouter-key";

function userKey(request) {
  const key = (request?.headers?.get(userKeyHeader) || "").trim();
  return /^[\w-]{10,300}$/.test(key) ? key : "";
}

// The server's key wins; otherwise the key the page sent, if any.
export function dictateConfig(request) {
  return {
    apiKey: env("OPENROUTER_API_KEY") || userKey(request),
    transcribeModel: env("TRANSCRIBE_MODEL") || defaults.transcribeModel,
    cleanupModel: env("CLEANUP_MODEL") || defaults.cleanupModel,
  };
}

// What the capture page is allowed to know: whether the server has a key and which models run, not the key. Without
// one (`ready: false`), the page asks for the user's own.
export function publicConfig() {
  const { apiKey, transcribeModel, cleanupModel } = dictateConfig();
  return { ready: Boolean(apiKey), transcribeModel, cleanupModel };
}

// Never let a slow model hang a request forever.
export function withTimeout(promise, ms, what) {
  let timer;
  const timeout = new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`${what} timed out after ${ms / 1000}s`)), ms); });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

export function stamp(date = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

export function slugify(text) {
  return String(text).toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60).replace(/-+$/, "") || "note";
}

export async function chat(model, content, { apiKey, maxTokens }) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "X-Title": "tdm155ai-week-6" },
    body: JSON.stringify({ model, max_tokens: maxTokens, messages: [{ role: "user", content }] }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error?.message || `HTTP ${response.status}`);
  if (data.choices?.[0]?.finish_reason === "length") throw new Error("The transcription exceeded the model output limit; try fewer pages or a shorter recording.");
  const text = data.choices?.[0]?.message?.content;
  const out = (Array.isArray(text) ? text.map((part) => part.text || "").join("") : text || "").trim();
  if (!out) throw new Error("empty response");
  return out;
}

const transcribePrompt = "Transcribe this recording exactly as spoken, in the language spoken. Keep every word, including false starts and filler; the cleanup comes later. Break it into paragraphs where the speaker pauses or changes topic. Mark anything you can't make out as [inaudible]. Return only the transcript: no preamble, no labels, no timestamps. If there is no speech, return [no speech].";

// `wav`: a mono 16-bit WAV, made in the browser from whatever the microphone recorded.
export function transcribe(wav, config) {
  return chat(config.transcribeModel, [
    { type: "text", text: transcribePrompt },
    { type: "input_audio", input_audio: { data: Buffer.from(wav).toString("base64"), format: "wav" } },
  ], { apiKey: config.apiKey, maxTokens: 8000 });
}

function cleanupPrompt(transcript, hint) {
  return `Below is the raw transcript of a note someone dictated to themselves. Turn it into a clean Markdown document they can keep.

- Remove filler, false starts, and repetition; fix punctuation and obvious mis-hearings.
- Keep their meaning, their voice, and their words wherever you can. Don't add facts, advice, or conclusions they didn't say.
- Organize it: short paragraphs, with ## headings and lists where the content has that shape. A short note can be a paragraph or two with no headings.
- Where they gave themselves to-dos, collect them as a task list (- [ ] ...).
- Where something is unclear or [inaudible], keep it marked rather than guessing.

Reply in exactly this format, and nothing else:

TITLE: a short, specific title (no quotes)
DESCRIPTION: one sentence saying what the note is about
---
the document body in Markdown, without a # title line
${hint ? `\nWhat they said about this note before recording: ${hint}\n` : ""}
<transcript>
${transcript}
</transcript>`;
}

// The model's reply as { title, description, body }; anything off-format becomes the body under a plain title.
export function parseCleanup(reply) {
  const match = reply.match(/^\s*TITLE:\s*(.+)\r?\n\s*DESCRIPTION:\s*(.+)\r?\n\s*---\s*\r?\n([\s\S]*)$/);
  if (!match) return { title: "", description: "", body: reply.trim() };
  return { title: match[1].trim(), description: match[2].trim(), body: match[3].replace(/^\s*#\s+[^\n]+\n/, "").trim() };
}

export async function cleanUp(transcript, hint, config) {
  return parseCleanup(await chat(config.cleanupModel, cleanupPrompt(transcript, hint), { apiKey: config.apiKey, maxTokens: 8000 }));
}

export async function saveAudio(wav, id) {
  await mkdir(/* turbopackIgnore: true */ dictationRoot, { recursive: true });
  await writeFile(/* turbopackIgnore: true */ path.join(dictationRoot, `${id}.wav`), wav, { flag: "wx" });
}

export async function saveSidecar(id, data) {
  await writeFile(/* turbopackIgnore: true */ path.join(dictationRoot, `${id}.json`), JSON.stringify(data, null, 2) + "\n");
}

// content/notebook/<yyyymmdd-hhmm>-<title>.md. Both voice and photographs use this writer. `order` lists the newest note first; never overwrites an existing file.
export async function writeNote({ id, date, title, description, body, source = "dictation", images = [] }) {
  await mkdir(/* turbopackIgnore: true */ notesRoot, { recursive: true });
  const minute = id.slice(0, 13);
  const data = { title, description, eyebrow: source === "photograph" ? "Photographed note" : "Dictated note", source, updated: date.toISOString().slice(0, 10), order: -Number(minute.replace("-", "")) };
  if (source === "dictation") data.dictation = `nextjs/_media/dictation/${id}.wav`;
  if (images.length) data.images = images;
  const text = matter.stringify(`\n# ${title}\n\n${body}\n`, data);
  for (let attempt = 0; ; attempt += 1) {
    const name = `${minute}-${slugify(title)}${attempt ? `-${attempt + 1}` : ""}`;
    try {
      await writeFile(/* turbopackIgnore: true */ path.join(notesRoot, `${name}.md`), text, { flag: "wx" });
      return { slug: `notebook/${name}`, file: `nextjs/content/notebook/${name}.md` };
    } catch (error) {
      if (error.code !== "EEXIST" || attempt >= 20) throw error;
    }
  }
}
