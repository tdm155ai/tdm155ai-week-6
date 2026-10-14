// Adapted from the Learning Lab capture kit, 2026-10-14. Files stay on the machine running Next.
import { createReadStream } from "node:fs";
import { mkdir, readdir, readFile, realpath, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { Readable } from "node:stream";

export const mediaRoot = path.resolve(/* turbopackIgnore: true */ process.cwd(), "..", "_media");
const types = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".avif": "image/avif", ".gif": "image/gif", ".mp4": "video/mp4", ".mov": "video/quicktime", ".webm": "video/webm" };

export function resolveMedia(segments, root = mediaRoot) {
  if (!Array.isArray(segments) || segments.some((part) => typeof part !== "string" || part.startsWith(".") || part.includes("\\"))) return null;
  const file = path.resolve(root, ...segments);
  return file.startsWith(root + path.sep) ? file : null;
}

export async function saveStill(bytes, label = "", root = mediaRoot) {
  if (!bytes.length || bytes.length > 25 * 1024 * 1024) throw new Error("The still must be smaller than 25 MB.");
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[2] !== 0xff) throw new Error("Capture must be a JPEG image.");
  const directory = path.join(root, "webcam");
  await mkdir(/* turbopackIgnore: true */ directory, { recursive: true });
  const filename = `still-${new Date().toISOString().replace(/[:.]/g, "-")}-${randomUUID().slice(0, 8)}.jpg`;
  await writeFile(/* turbopackIgnore: true */ path.join(directory, filename), bytes, { flag: "wx" });
  const note = { label: String(label).trim().slice(0, 200), source: "webcam", captured: new Date().toISOString() };
  await writeFile(/* turbopackIgnore: true */ path.join(directory, `${filename}.json`), JSON.stringify(note, null, 2) + "\n", { flag: "wx" });
  return { filename, src: `/media/webcam/${encodeURIComponent(filename)}`, label: note.label, path: `_media/webcam/${filename}` };
}

export async function listMedia(root = mediaRoot) {
  const items = [];
  async function visit(directory, segments = []) {
    let entries;
    try { entries = await readdir(/* turbopackIgnore: true */ directory, { withFileTypes: true }); }
    catch (error) { if (error.code === "ENOENT") return; throw error; }
    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      const file = path.join(directory, entry.name);
      const parts = [...segments, entry.name];
      if (entry.isDirectory()) { await visit(file, parts); continue; }
      if (!entry.isFile()) continue;
      const mime = types[path.extname(entry.name).toLowerCase()];
      if (!mime) continue;
      const info = await stat(/* turbopackIgnore: true */ file);
      let label = "";
      try { label = JSON.parse(await readFile(/* turbopackIgnore: true */ `${file}.json`, "utf8")).label || ""; } catch {}
      items.push({ name: entry.name, label, src: "/media/" + parts.map(encodeURIComponent).join("/"), type: mime.startsWith("video/") ? "video" : "image", modified: info.mtimeMs, folder: segments.join("/") });
    }
  }
  await visit(root);
  return items.sort((a, b) => b.modified - a.modified);
}

export async function mediaResponse(request, segments, root = mediaRoot) {
  const file = resolveMedia(segments, root);
  const mime = file && types[path.extname(file).toLowerCase()];
  if (!mime) return new Response("Not found", { status: 404 });
  let info;
  try {
    const canonicalRoot = await realpath(/* turbopackIgnore: true */ root);
    const canonicalFile = await realpath(/* turbopackIgnore: true */ file);
    if (!canonicalFile.startsWith(canonicalRoot + path.sep)) return new Response("Not found", { status: 404 });
    info = await stat(/* turbopackIgnore: true */ file);
  } catch { return new Response("Not found", { status: 404 }); }
  if (!info.isFile()) return new Response("Not found", { status: 404 });
  const headers = { "Content-Type": mime, "Accept-Ranges": "bytes", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" };
  const range = request.headers.get("range");
  if (range) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (!match || (!match[1] && !match[2])) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${info.size}` } });
    const start = match[1] ? Number(match[1]) : Math.max(0, info.size - Number(match[2]));
    const end = match[1] && match[2] ? Math.min(Number(match[2]), info.size - 1) : info.size - 1;
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start >= info.size || start > end) return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${info.size}` } });
    return new Response(Readable.toWeb(createReadStream(/* turbopackIgnore: true */ file, { start, end })), { status: 206, headers: { ...headers, "Content-Range": `bytes ${start}-${end}/${info.size}`, "Content-Length": String(end - start + 1) } });
  }
  return new Response(Readable.toWeb(createReadStream(/* turbopackIgnore: true */ file)), { headers: { ...headers, "Content-Length": String(info.size) } });
}
