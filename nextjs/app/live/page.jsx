import Link from "next/link";
import { listMedia } from "../../lib/media.mjs";
import { SiteFooter, SiteHeader } from "../components/Chrome.jsx";
import AutoRefresh from "./AutoRefresh.jsx";
import "../capture/capture.css";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const metadata = { title: "Capture gallery" };

export default async function GalleryPage() {
  const items = await listMedia();
  return (
    <>
      <SiteHeader />
      <main id="main" className="camera-main">
        <AutoRefresh />
        <p className="eyebrow">Video station · Local media</p>
        <h1>Capture gallery</h1>
        <p className="camera-lede">Reference stills and media saved in this app's <code>_media/</code> folder. New captures appear here automatically.</p>
        <p className="camera-links"><Link href="/capture">← Open capture</Link><Link href="/activities/rotation-3-ai-video">Rotation 3</Link><Link href="/skills/video-prompting-challenge">Video skills challenge</Link></p>
        <p className="camera-note">{items.length} {items.length === 1 ? "file" : "files"} · newest first · refreshes every 5 seconds</p>
        {items.length === 0 ? <p className="camera-note">No captures yet. Open capture, start your camera, and take a still.</p> : <div className="camera-recent">{items.map((item) => <figure key={item.src}>{item.type === "video" ? <video src={item.src} controls preload="metadata" playsInline /> : <a href={item.src} target="_blank" rel="noreferrer"><img src={item.src} alt={item.label || "Reference still"} loading="lazy" /></a>}<figcaption>{item.label || item.name}<br />{item.folder}<a href={item.src} download={item.name}>Download</a></figcaption></figure>)}</div>}
      </main>
      <SiteFooter />
    </>
  );
}
