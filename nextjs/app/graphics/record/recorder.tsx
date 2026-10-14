"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FRAME, normalizeSpec, type Spec } from "@/lib/graphics/graphic-spec";
import { PRESET_STORAGE_KEY, STORAGE_KEY, type SavedPreset } from "../graphic-editor";

// Webcam plus the graphic, composited on a 1920x1080 canvas and recorded with MediaRecorder. The overlay is the
// same PNG the editor exports (/api/graphics/render, background forced to None), so what's recorded matches the export.
// The canvas is what gets recorded: the camera can be mirrored, the text never is.

type Source = { id: string; name: string; spec: Spec };
type Take = { url: string; size: number; file?: string; error?: string };

const TYPES = ["video/mp4;codecs=avc1.42E01E,mp4a.40.2", "video/mp4", "video/webm;codecs=vp9,opus", "video/webm"];
const FADE_MS = 300;

function readSources(): Source[] {
  const sources: Source[] = [];
  try {
    const current = localStorage.getItem(STORAGE_KEY);
    sources.push({ id: "current", name: "Current graphic (live from the editor)", spec: normalizeSpec(current ? JSON.parse(current) : {}) });
  } catch {
    sources.push({ id: "current", name: "Current graphic", spec: normalizeSpec({}) });
  }
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(PRESET_STORAGE_KEY) ?? "[]");
    if (Array.isArray(saved)) {
      (saved as SavedPreset[]).forEach((p, i) => {
        if (p && typeof p.id === "string") sources.push({ id: p.id, name: `${i + 1}. ${p.name}`, spec: normalizeSpec(p.spec) });
      });
    }
  } catch {}
  return sources;
}

function clock(ms: number) {
  const s = Math.floor(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function Recorder() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const media = useRef<MediaStream | null>(null);
  const overlay = useRef<ImageBitmap | null>(null);
  const alpha = useRef(1);
  const target = useRef(1);
  const mirrorRef = useRef(true);
  const recorder = useRef<MediaRecorder | null>(null);

  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [mics, setMics] = useState<MediaDeviceInfo[]>([]);
  const [cameraId, setCameraId] = useState("");
  const [micId, setMicId] = useState("");
  const [mirror, setMirror] = useState(true);
  const [sources, setSources] = useState<Source[]>([]);
  const [sourceId, setSourceId] = useState("current");
  const [showGraphic, setShowGraphic] = useState(true);
  const [title, setTitle] = useState("");
  const [recording, setRecording] = useState(false);
  const [started, setStarted] = useState(0);
  const [now, setNow] = useState(0);
  const [takes, setTakes] = useState<Take[]>([]);
  const [error, setError] = useState<string | null>(null);

  mirrorRef.current = mirror;
  target.current = showGraphic ? 1 : 0;

  // The graphics saved in the editor (same origin, so same localStorage). The storage event fires when the editor,
  // open in another tab, changes them, so the overlay follows the editor while you work.
  useEffect(() => {
    setSources(readSources());
    let timer = 0;
    const changed = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY && event.key !== PRESET_STORAGE_KEY) return;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setSources(readSources()), 250);
    };
    window.addEventListener("storage", changed);
    return () => { window.removeEventListener("storage", changed); window.clearTimeout(timer); };
  }, []);

  const source = sources.find((s) => s.id === sourceId) ?? sources[0];
  const specJson = source ? JSON.stringify(source.spec) : "";

  // Render the chosen graphic to a transparent PNG and keep it as a bitmap for the draw loop.
  useEffect(() => {
    if (!specJson) return;
    const controller = new AbortController();
    const spec = { ...JSON.parse(specJson), background: "transparent", effect: "none" };
    fetch("/api/graphics/render", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ spec, scale: 1 }), signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error((await response.json()).error ?? "Render failed.");
        return createImageBitmap(await response.blob());
      })
      .then((bitmap) => { overlay.current?.close(); overlay.current = bitmap; })
      .catch((cause) => { if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : "Render failed."); });
    return () => controller.abort();
  }, [specJson]);

  // Open the camera and microphone; reopen when either is changed. Falls back to video only without a microphone.
  useEffect(() => {
    let cancelled = false;
    const video1080 = { width: { ideal: 1920 }, height: { ideal: 1080 }, ...(cameraId ? { deviceId: { exact: cameraId } } : {}) };
    const audio = micId ? { deviceId: { exact: micId } } : true;
    (async () => {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: video1080, audio });
      } catch {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: video1080 });
        } catch (cause) {
          setError(cause instanceof Error ? `Camera: ${cause.message}` : "Could not open the camera.");
          return;
        }
      }
      if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }
      media.current?.getTracks().forEach((t) => t.stop());
      media.current = stream;
      if (video.current) { video.current.srcObject = stream; void video.current.play().catch(() => {}); }
      setError(null);
      const devices = await navigator.mediaDevices.enumerateDevices();
      setCameras(devices.filter((d) => d.kind === "videoinput"));
      setMics(devices.filter((d) => d.kind === "audioinput"));
    })();
    return () => { cancelled = true; };
  }, [cameraId, micId]);

  useEffect(() => () => { media.current?.getTracks().forEach((t) => t.stop()); overlay.current?.close(); }, []);

  // The draw loop: camera (cover-fit, optionally mirrored), then the graphic, faded in and out.
  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    let frame = 0;
    let last = performance.now();
    const draw = (time: number) => {
      const step = (time - last) / FADE_MS;
      last = time;
      alpha.current = target.current > alpha.current ? Math.min(target.current, alpha.current + step) : Math.max(target.current, alpha.current - step);
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, FRAME.width, FRAME.height);
      const v = video.current;
      if (v && v.videoWidth) {
        const k = Math.max(FRAME.width / v.videoWidth, FRAME.height / v.videoHeight);
        const w = v.videoWidth * k;
        const h = v.videoHeight * k;
        ctx.save();
        if (mirrorRef.current) { ctx.translate(FRAME.width, 0); ctx.scale(-1, 1); }
        ctx.drawImage(v, (FRAME.width - w) / 2, (FRAME.height - h) / 2, w, h);
        ctx.restore();
      }
      if (overlay.current && alpha.current > 0) {
        ctx.globalAlpha = alpha.current;
        ctx.drawImage(overlay.current, 0, 0, FRAME.width, FRAME.height);
        ctx.globalAlpha = 1;
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!recording) return;
    const timer = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, [recording]);

  const start = useCallback(() => {
    if (!canvas.current || recorder.current) return;
    const mimeType = TYPES.find((t) => MediaRecorder.isTypeSupported(t));
    const stream = canvas.current.captureStream(30);
    media.current?.getAudioTracks().forEach((t) => stream.addTrack(t));
    const rec = new MediaRecorder(stream, { ...(mimeType ? { mimeType } : {}), videoBitsPerSecond: 8_000_000 });
    const chunks: Blob[] = [];
    rec.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
    rec.onstop = async () => {
      stream.getVideoTracks().forEach((t) => t.stop());
      recorder.current = null;
      setRecording(false);
      const type = (rec.mimeType || mimeType || "video/webm").split(";")[0];
      const blob = new Blob(chunks, { type });
      const take: Take = { url: URL.createObjectURL(blob), size: blob.size };
      try {
        const response = await fetch(`/api/graphics/recordings?title=${encodeURIComponent(title)}`, { method: "POST", headers: { "content-type": type }, body: blob });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error ?? "Save failed.");
        take.file = result.file;
      } catch (cause) {
        take.error = cause instanceof Error ? cause.message : "Save failed.";
      }
      setTakes((list) => [take, ...list]);
    };
    rec.start(1000);
    recorder.current = rec;
    setStarted(Date.now());
    setNow(Date.now());
    setRecording(true);
  }, [title]);

  const stop = useCallback(() => recorder.current?.stop(), []);

  // G shows or hides the graphic, R starts and stops, 0 picks the current graphic and 1–9 a saved one.
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      const el = event.target as HTMLElement;
      if (el.closest("input, textarea, select") || event.metaKey || event.ctrlKey || event.altKey) return;
      const k = event.key.toLowerCase();
      if (k === "g") setShowGraphic((v) => !v);
      else if (k === "r") (recorder.current ? stop : start)();
      else if (k === "0") setSourceId("current");
      else if (/^[1-9]$/.test(k) && sources[Number(k)]) setSourceId(sources[Number(k)].id);
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [sources, start, stop]);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="w-full shrink-0 space-y-5 overflow-y-auto border-neutral-800 p-5 text-sm lg:h-screen lg:w-[380px] lg:border-r">
        <header>
          <h1 className="text-lg font-semibold">Record</h1>
          <p className="text-neutral-400">Your webcam with a graphic on top. Design the graphic in the <a href="/graphics" target="_blank" className="underline">editor</a>; this page follows it.</p>
        </header>

        <Group title="Graphic">
          <select className="field" value={source?.id ?? "current"} onChange={(e) => setSourceId(e.target.value)}>
            {sources.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <label className="flex cursor-pointer items-center gap-3">
            <input type="checkbox" checked={showGraphic} onChange={(e) => setShowGraphic(e.target.checked)} />
            <span>Show the graphic <span className="text-neutral-500">(G)</span></span>
          </label>
          <p className="text-xs text-neutral-500">Toggle it while recording to bring the lower third in and out. 0 picks the current graphic, 1–9 a saved one. Shaders and backgrounds are left out: the camera is the background.</p>
        </Group>

        <Group title="Camera & microphone">
          <select className="field" value={cameraId} disabled={recording} onChange={(e) => setCameraId(e.target.value)}>
            <option value="">Default camera</option>
            {cameras.map((d, i) => <option key={d.deviceId} value={d.deviceId}>{d.label || `Camera ${i + 1}`}</option>)}
          </select>
          <select className="field" value={micId} disabled={recording} onChange={(e) => setMicId(e.target.value)}>
            <option value="">Default microphone</option>
            {mics.map((d, i) => <option key={d.deviceId} value={d.deviceId}>{d.label || `Microphone ${i + 1}`}</option>)}
          </select>
          <label className="flex cursor-pointer items-center gap-3">
            <input type="checkbox" checked={mirror} onChange={(e) => setMirror(e.target.checked)} />
            <span>Mirror the camera <span className="text-neutral-500">(the text stays readable)</span></span>
          </label>
        </Group>

        <Group title="Take">
          <input className="field" placeholder="Name this take (optional)" value={title} disabled={recording} onChange={(e) => setTitle(e.target.value)} />
          <button
            className={`w-full rounded px-3 py-3 font-semibold text-white ${recording ? "bg-neutral-700 hover:bg-neutral-600" : "bg-red-600 hover:bg-red-500"}`}
            onClick={recording ? stop : start}
          >
            {recording ? `Stop · ${clock(now - started)}` : "Record (R)"}
          </button>
          <p className="text-xs text-neutral-500">Keep this tab in front while recording: browsers slow down hidden tabs. Takes are saved to <code>nextjs/_media/recordings/</code>.</p>
        </Group>

        {error && <p role="alert" className="text-red-400">{error}</p>}

        {takes.length > 0 && (
          <Group title="Takes">
            {takes.map((take) => (
              <div key={take.url} className="space-y-1">
                <video src={take.url} controls className="w-full rounded" />
                <p className="text-xs text-neutral-400">
                  {take.file ? <code>{take.file}</code> : <span className="text-red-400">Not saved: {take.error}</span>}
                  {" · "}{(take.size / 1e6).toFixed(1)} MB{" · "}
                  <a className="underline" href={take.url} download={take.file?.split("/").pop() ?? "take"}>Download</a>
                </p>
              </div>
            ))}
          </Group>
        )}
      </aside>

      <main className="flex min-w-0 flex-1 items-center justify-center p-5">
        <div className="relative w-full max-w-[1400px]">
          <canvas ref={canvas} width={FRAME.width} height={FRAME.height} className={`block aspect-video w-full rounded bg-black ${recording ? "ring-4 ring-red-600" : "ring-1 ring-neutral-800"}`} />
          {recording && <span className="absolute left-4 top-4 rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white">REC {clock(now - started)}</span>}
        </div>
        <video ref={video} muted playsInline className="hidden" />
      </main>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{title}</h2>
      {children}
    </section>
  );
}
