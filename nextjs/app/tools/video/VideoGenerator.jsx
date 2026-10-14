"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

// The form for one video job. Submits to /api/video, then polls the job until the clip is there.
const quote = (text) => /^[A-Za-z0-9._:/=-]+$/.test(text) ? text : `"${text.replace(/(["\\$`])/g, "\\$1")}"`;

export default function VideoGenerator({ stills, presets, referenceFields }) {
  const [provider, setProvider] = useState("openrouter");
  const [model, setModel] = useState(presets[0].id);
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState("4");
  const [resolution, setResolution] = useState("720p");
  const [aspect, setAspect] = useState("16:9");
  const [audio, setAudio] = useState("false");
  const [refMode, setRefMode] = useState("none");
  const [gallery, setGallery] = useState("");
  const [upload, setUpload] = useState(null);
  const [refField, setRefField] = useState("first_frame");
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  const preset = useMemo(() => presets.find((p) => p.id === model && p.provider === provider), [presets, model, provider]);
  const providerPresets = presets.filter((p) => p.provider === provider);
  const fields = referenceFields[provider];
  const hasReference = refMode === "upload" ? Boolean(upload) : refMode === "gallery" ? Boolean(gallery) : false;

  // Switching provider: pick that provider's first preset and reference role.
  function choose(nextProvider) {
    setProvider(nextProvider);
    const first = presets.find((p) => p.provider === nextProvider);
    if (first) { setModel(first.id); if (first.durations?.length) setDuration(String(first.durations[0])); if (first.resolutions?.length) setResolution(first.resolutions[0]); }
    setRefField(referenceFields[nextProvider][0][0]);
  }
  function pick(id) {
    setModel(id);
    const p = presets.find((x) => x.id === id);
    if (p?.durations?.length && !p.durations.includes(Number(duration))) setDuration(String(p.durations[0]));
    if (p?.resolutions?.length && !p.resolutions.includes(resolution)) setResolution(p.resolutions[0]);
    if (p && p.resolutions && !p.resolutions.length) setResolution("");
  }

  const command = useMemo(() => {
    const parts = ["pnpm", "video", provider, quote(prompt.trim() || "…"), "--model", model];
    if (duration) parts.push("--duration", duration);
    if (resolution) parts.push("--resolution", resolution);
    if (aspect) parts.push("--aspect", aspect);
    if (audio) parts.push("--audio", audio);
    if (hasReference) parts.push("--ref", refMode === "upload" ? upload.name : "_media" + decodeURIComponent(gallery).replace(/^\/media/, ""), "--ref-field", refField);
    return parts.join(" ");
  }, [provider, prompt, model, duration, resolution, aspect, audio, hasReference, refMode, upload, gallery, refField]);

  const falMismatch = provider === "fal" && preset && preset.reference === !hasReference;

  async function submit(event) {
    event.preventDefault();
    setError(""); setBusy(true); setJob(null);
    const form = new FormData();
    for (const [key, value] of Object.entries({ provider, model, prompt, duration, resolution, aspect, audio, refField: hasReference ? refField : "" })) form.set(key, value);
    if (refMode === "upload" && upload) form.set("reference", upload);
    if (refMode === "gallery" && gallery) form.set("gallery", gallery);
    try {
      const response = await fetch("/api/video", { method: "POST", body: form });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || `HTTP ${response.status}`);
      setJob(body);
    } catch (e) { setError(e.message); }
    setBusy(false);
  }

  // Poll the job every 5 seconds until it is done or failed.
  useEffect(() => {
    if (!job || job.status !== "running") return;
    const timer = setInterval(async () => {
      try { const r = await fetch(`/api/video?id=${encodeURIComponent(job.id)}`); if (r.ok) setJob(await r.json()); } catch {}
    }, 5000);
    return () => clearInterval(timer);
  }, [job]);

  return (
    <form className="video-form" onSubmit={submit}>
      <fieldset>
        <legend>The shot</legend>
        <label>Prompt<textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="the lighthouse keeper in the yellow raincoat turns and walks away from the camera, slow handheld, soft light" required /></label>
        <div className="video-row">
          <label>Provider<select value={provider} onChange={(e) => choose(e.target.value)}><option value="openrouter">OpenRouter</option><option value="fal">fal</option></select></label>
          <label>Model<input list="video-models" value={model} onChange={(e) => pick(e.target.value)} required />
            <datalist id="video-models">{providerPresets.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}</datalist></label>
        </div>
        {preset && <p className="video-hint">{preset.label}</p>}
        <div className="video-row">
          <label>Duration (s)<input value={duration} onChange={(e) => setDuration(e.target.value)} inputMode="numeric" list="video-durations" />
            {preset?.durations?.length ? <datalist id="video-durations">{preset.durations.map((d) => <option key={d} value={d} />)}</datalist> : null}</label>
          <label>Resolution<input value={resolution} onChange={(e) => setResolution(e.target.value)} list="video-resolutions" placeholder="720p" />
            {preset?.resolutions?.length ? <datalist id="video-resolutions">{preset.resolutions.map((r) => <option key={r} value={r} />)}</datalist> : null}</label>
          <label>Aspect<input value={aspect} onChange={(e) => setAspect(e.target.value)} list="video-aspects" placeholder="16:9" />
            {preset?.aspects?.length ? <datalist id="video-aspects">{preset.aspects.map((a) => <option key={a} value={a} />)}</datalist> : null}</label>
          <label>Audio<select value={audio} onChange={(e) => setAudio(e.target.value)}><option value="false">Off</option><option value="true">On</option><option value="">Model default</option></select></label>
        </div>
        <p className="video-hint">Each model takes its own durations, resolutions, and aspect ratios; the suggestions come from the provider's listing. Leave a field empty to let the model decide. Models: <code>node utils/list-openrouter-models.mjs --type video</code>, <code>node utils/list-fal-models.mjs --category image-to-video</code>.</p>
      </fieldset>

      <fieldset>
        <legend>Reference image</legend>
        <div className="video-ref-modes">
          {[["none", "No reference"], ["gallery", "From the gallery"], ["upload", "Upload a file"]].map(([mode, label]) => <button type="button" key={mode} aria-pressed={refMode === mode} onClick={() => setRefMode(mode)}>{label}</button>)}
        </div>
        {refMode === "gallery" && (stills.length ? <div className="video-gallery-pick">
          {stills.map((still) => <button type="button" key={still.src} aria-pressed={gallery === still.src} onClick={() => setGallery(still.src)}><img src={still.src} alt={still.label || still.name} loading="lazy" /><span>{still.label || still.name}</span></button>)}
        </div> : <p className="video-hint">No stills yet. <Link href="/capture">Capture one</Link>, or upload a file instead.</p>)}
        {refMode === "upload" && <label>Image (JPEG, PNG, or WebP)<input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setUpload(e.target.files?.[0] || null)} />
          {upload && <img className="video-ref-preview" src={URL.createObjectURL(upload)} alt={upload.name} />}</label>}
        {hasReference && <label>What the image is for<select value={refField} onChange={(e) => setRefField(e.target.value)}>{fields.map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label>}
        {falMismatch && <p className="video-hint">{hasReference ? "This fal endpoint is text-to-video; pick an image-to-video endpoint to use the reference." : "This fal endpoint needs a first-frame image; add a reference or pick a text-to-video endpoint."}</p>}
        <p className="video-hint">Image-to-video uses the still as the first frame of the shot. The still is copied beside the job and sent to the provider as part of the request; it stays on this computer otherwise.</p>
        <p className="video-hint">The command this form runs:</p>
        <pre className="video-command">{command}</pre>
      </fieldset>

      <div className="video-actions">
        <button className="video-go" type="submit" disabled={busy || !prompt.trim() || (refMode !== "none" && !hasReference)}>{busy ? "Starting…" : "Generate"}</button>
        <span className="video-hint">Clips take from half a minute to several minutes. Finished clips appear in the <Link href="/tools/videos">video gallery</Link>; you can leave this page.</span>
      </div>
      {error && <p className="video-status video-status-failed" style={{ gridColumn: "1 / -1" }}>{error}</p>}
      {job && <div className={`video-status video-status-${job.status}`} style={{ gridColumn: "1 / -1" }} aria-live="polite">
        {job.status === "running" && <>Rendering on {job.provider} with <code>{job.model}</code>… checking every five seconds. The job folder is <code>_media/videos/{job.id}/</code>.</>}
        {job.status === "done" && <>Done. <Link href="/tools/videos">Open the gallery</Link> or <a href={job.src} download>download the clip</a>. The request and response records are in <code>_media/videos/{job.id}/run/</code>.<video src={job.src} autoPlay loop muted playsInline controls /></>}
        {job.status === "failed" && <>The job failed. {job.detail}<pre>{job.log}</pre></>}
      </div>}
    </form>
  );
}
