import { readFile } from "node:fs/promises";
import path from "node:path";
import { photosRoot } from "../../../lib/photos.mjs";

export const runtime = "nodejs";

export async function GET(request, { params }) {
  const { filename } = await params;
  // Only our generated image names are served; sidecars and arbitrary paths stay private.
  if (!/^\d{8}-\d{6}-[a-f0-9-]{36}-\d+\.(jpg|png|webp)$/.test(filename)) return new Response("Not found", { status: 404 });
  try {
    const bytes = await readFile(/* turbopackIgnore: true */ path.join(photosRoot, filename));
    const ext = filename.split(".").pop();
    return new Response(bytes, { headers: { "Content-Type": `image/${ext === "jpg" ? "jpeg" : ext}`, "X-Content-Type-Options": "nosniff" } });
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    return new Response("Not found", { status: 404 });
  }
}
