import Link from "next/link";
import { listMedia } from "../../../lib/media.mjs";
import { presets, referenceFields } from "../../../lib/video-jobs.mjs";
import { SiteFooter, SiteHeader } from "../../components/Chrome.jsx";
import VideoGenerator from "./VideoGenerator.jsx";
import "../tools.css";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const metadata = { title: "Video generator" };

export default async function VideoToolPage() {
  // The stills a job can use as its reference: every image in _media/ (captures first), not the clips.
  const stills = (await listMedia()).filter((item) => item.type === "image" && !item.folder.startsWith("videos")).map(({ src, label, name, folder }) => ({ src, label, name, folder }));
  return (
    <>
      <SiteHeader current="tools" />
      <main id="main" className="tools-main">
        <p className="eyebrow">Tools · Video generator</p>
        <h1>Video generator</h1>
        <p className="tools-lede">A prompt, a model, and optionally a reference image, to a clip. This page runs <code>utils/generate-video.mjs</code> on the computer running the app, with the keys in the repo's <code>.env</code>, and shows you the command it ran so you can run the same thing in the terminal.</p>
        <p className="tools-links"><Link href="/tools">← Tools</Link><Link href="/tools/videos">Video gallery →</Link><Link href="/capture">Capture a still</Link></p>
        <VideoGenerator stills={stills} presets={presets} referenceFields={referenceFields} />
      </main>
      <SiteFooter />
    </>
  );
}
