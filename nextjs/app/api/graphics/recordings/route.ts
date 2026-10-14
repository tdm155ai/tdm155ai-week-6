import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

// Saves a take from /record to the app's gitignored nextjs/_media/recordings/, named <yyyymmdd-hhmmss>[-title].<ext>.
// Local only: on a static host there is nowhere to write, and /record still offers a download.

const ROOT = path.resolve(process.cwd(), "_media", "recordings");
const EXTENSIONS: Record<string, string> = { "video/mp4": "mp4", "video/webm": "webm" };
const MAX_BYTES = 2 * 1024 ** 3;

export async function POST(request: Request) {
  const type = (request.headers.get("content-type") ?? "").split(";")[0].trim();
  const ext = EXTENSIONS[type];
  if (!ext) return Response.json({ error: "Expected video/mp4 or video/webm." }, { status: 415 });

  const data = Buffer.from(await request.arrayBuffer());
  if (!data.length) return Response.json({ error: "The recording is empty." }, { status: 400 });
  if (data.length > MAX_BYTES) return Response.json({ error: "The recording is over 2 GB." }, { status: 413 });

  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  const stamp = `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
  const slug = (new URL(request.url).searchParams.get("title") ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
  const name = `${stamp}${slug ? `-${slug}` : ""}.${ext}`;

  try {
    await mkdir(ROOT, { recursive: true });
    await writeFile(path.join(ROOT, name), data, { flag: "wx" });
  } catch (cause) {
    return Response.json({ error: cause instanceof Error ? cause.message : "Could not save." }, { status: 500 });
  }
  return Response.json({ file: `nextjs/_media/recordings/${name}` });
}
