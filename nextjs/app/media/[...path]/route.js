import { mediaResponse } from "../../../lib/media.mjs";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request, { params }) {
  const { path: segments = [] } = await params;
  return mediaResponse(request, segments);
}
