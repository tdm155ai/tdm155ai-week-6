import Link from "next/link";
import { listJobs } from "../../../lib/video-jobs.mjs";
import { SiteFooter, SiteHeader } from "../../components/Chrome.jsx";
import AutoRefresh from "../../live/AutoRefresh.jsx";
import "../tools.css";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const metadata = { title: "Video gallery" };

// Every clip the generator made, looping, newest first, with the jobs still rendering shown as pending.
export default async function VideoGalleryPage() {
  const jobs = await listJobs();
  const done = jobs.filter((job) => job.status === "done").length;
  return (
    <>
      <SiteHeader current="tools" />
      <main id="main" className="tools-main">
        <AutoRefresh />
        <p className="eyebrow">Tools · Video gallery</p>
        <h1>Video gallery</h1>
        <p className="tools-lede">The clips made with the <Link href="/tools/video">video generator</Link>, looping, with the prompt, model, and reference that made each one. Compare them side by side: is it the same character, the same cup, the same room?</p>
        <p className="tools-links"><Link href="/tools">← Tools</Link><Link href="/tools/video">Make another →</Link></p>
        <p className="video-hint">{done} {done === 1 ? "clip" : "clips"}{jobs.length > done ? `, ${jobs.length - done} still rendering or failed` : ""} · newest first · refreshes every 5 seconds · files in <code>_media/videos/</code></p>
        {jobs.length === 0 ? <p className="video-hint">Nothing yet. <Link href="/tools/video">Generate the first clip.</Link></p> : <div className="video-gallery">
          {jobs.map((job) => <figure key={job.id}>
            {job.status === "done" ? <video src={job.src} autoPlay loop muted playsInline controls preload="metadata" /> : <div className="video-pending">{job.status === "running" ? "Rendering…" : "Failed"}</div>}
            <figcaption>
              <strong>{job.prompt}</strong>
              <span className="video-meta">{job.provider} · {job.model}{Object.entries(job.options || {}).map(([k, v]) => ` · ${k} ${v}`).join("")}</span>
              {job.reference && <span className="video-meta"><img className="video-ref-thumb" src={job.referenceSrc} alt="" />{job.reference.role} · {job.reference.source}</span>}
              {job.status === "failed" && <span className="video-meta">{job.detail}</span>}
              <span className="video-meta">{new Date(job.created).toLocaleString()}{job.status === "done" && <> · <a href={job.src} download={`${job.id}.mp4`}>Download</a></>}</span>
            </figcaption>
          </figure>)}
        </div>}
      </main>
      <SiteFooter />
    </>
  );
}
