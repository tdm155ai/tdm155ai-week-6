import { saveStill } from "../../../lib/media.mjs";

export const runtime = "nodejs";

export async function POST(request) {
  const origin = request.headers.get("origin");
  if ((origin && origin !== new URL(request.url).origin) || request.headers.get("sec-fetch-site") === "cross-site") return Response.json({ error: "Open capture on this app to save a still." }, { status: 403 });
  if (Number(request.headers.get("content-length")) > 26 * 1024 * 1024) return Response.json({ error: "The still is too large." }, { status: 413 });
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!file || typeof file.arrayBuffer !== "function" || file.type !== "image/jpeg") return Response.json({ error: "Choose a JPEG still." }, { status: 400 });
    if (file.size > 25 * 1024 * 1024) return Response.json({ error: "The still is too large." }, { status: 413 });
    const bytes = Buffer.from(await file.arrayBuffer());
    if (bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[2] !== 0xff) return Response.json({ error: "That file is not a JPEG still." }, { status: 400 });
    return Response.json(await saveStill(bytes, form.get("label") || ""), { status: 201 });
  } catch (error) {
    return Response.json({ error: `Could not save the still: ${error.message}` }, { status: 500 });
  }
}
