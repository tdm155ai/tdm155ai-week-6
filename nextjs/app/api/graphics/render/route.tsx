import fs from "node:fs";
import path from "node:path";
import { ImageResponse } from "next/og";
import { Graphic } from "@/lib/graphics/graphic";
import { FONTS, FRAME, normalizeSpec, type FontId } from "@/lib/graphics/graphic-spec";

export const runtime = "nodejs";
export const maxDuration = 60;

// Renders the graphic to a PNG at 1080p or 4K. With a transparent background
// the PNG keeps its alpha channel, ready to drop on a track above the video.

const FONTS_DIR = path.join(process.cwd(), "lib", "graphics", "fonts");
const fontCache = new Map<string, Buffer>();

function fontData(file: string) {
  let data = fontCache.get(file);
  if (!data) {
    data = fs.readFileSync(path.join(FONTS_DIR, file));
    fontCache.set(file, data);
  }
  return data;
}

export async function POST(request: Request) {
  let body: { spec?: unknown; scale?: number; backgroundImage?: string | null };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON request." }, { status: 400 });
  }

  const spec = normalizeSpec(body.spec);
  const scale = body.scale === 2 ? 2 : 1;
  const image =
    typeof body.backgroundImage === "string" && body.backgroundImage.startsWith("data:image/")
      ? body.backgroundImage
      : null;

  const ids = [...new Set<FontId>([spec.primaryFont, spec.secondaryFont])];
  try {
    return new ImageResponse(
      <Graphic spec={spec} scale={scale} family={(id) => id} backgroundImage={image} />,
      {
        width: FRAME.width * scale,
        height: FRAME.height * scale,
        fonts: ids.map((id) => ({
          name: id,
          data: fontData(FONTS[id].file),
          weight: FONTS[id].weight,
          style: FONTS[id].style,
        })),
      },
    );
  } catch (cause) {
    return Response.json(
      { error: cause instanceof Error ? cause.message : "Could not render." },
      { status: 500 },
    );
  }
}
