"use client";

import { useEffect, useRef, useState } from "react";
import ApiKeyField, { useUserKey } from "../components/ApiKeyField.jsx";

export default function TranscribeClient() {
  const video = useRef(null);
  const stream = useRef(null);
  const cameraRequest = useRef(0);
  const urls = useRef(new Set());
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [device, setDevice] = useState("");
  const [pages, setPages] = useState([]);
  const [hint, setHint] = useState("");
  const [busy, setBusy] = useState(false);
  const [config, setConfig] = useState(null);
  const [status, setStatus] = useState({ tone: "muted", text: "Choose images or turn on the camera." });
  const [recent, setRecent] = useState([]);
  const userKey = useUserKey();

  useEffect(() => {
    fetch("/api/transcribe").then((response) => response.json()).then(setConfig).catch(() => {});
    const previews = urls.current;
    return () => {
      cameraRequest.current += 1;
      stream.current?.getTracks().forEach((track) => track.stop());
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  function stopCamera() {
    cameraRequest.current += 1;
    stream.current?.getTracks().forEach((track) => track.stop());
    stream.current = null;
    if (video.current) video.current.srcObject = null;
    setCameraOn(false);
    setCameraLoading(false);
  }

  async function startCamera(selected = device) {
    stopCamera();
    const token = ++cameraRequest.current;
    setCameraLoading(true);
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("Camera access needs localhost or HTTPS. You can still upload images.");
      const next = await navigator.mediaDevices.getUserMedia({ audio: false, video: {
        ...(selected ? { deviceId: { exact: selected } } : { facingMode: { ideal: "environment" } }),
        width: { ideal: 2560 }, height: { ideal: 1920 },
      } });
      if (token !== cameraRequest.current) { next.getTracks().forEach((track) => track.stop()); return; }
      stream.current = next;
      video.current.srcObject = next;
      await video.current.play();
      if (token !== cameraRequest.current) return;
      setCameraOn(true);
      setCameraLoading(false);
      setStatus({ tone: "muted", text: "Hold the page steady in good light, then take a photograph." });
      const devices = await navigator.mediaDevices.enumerateDevices();
      if (token === cameraRequest.current) setCameras(devices.filter((item) => item.kind === "videoinput"));
    } catch (error) {
      if (token === cameraRequest.current) {
        stopCamera();
        setStatus({ tone: "error", text: `Could not open the camera: ${error.message}. You can upload images instead.` });
      }
    }
  }

  function addPages(files) {
    if (!files.length) return;
    if (pages.length + files.length > 12 || files.some((file) => file.size > 10 * 1024 * 1024) || [...pages.map((page) => page.file), ...files].reduce((total, file) => total + file.size, 0) > 30 * 1024 * 1024) {
      setStatus({ tone: "error", text: "Use up to 12 images, at most 10 MB each and 30 MB altogether." });
      return;
    }
    if (files.some((file) => !["image/jpeg", "image/png", "image/webp"].includes(file.type))) {
      setStatus({ tone: "error", text: "Choose JPEG, PNG, or WebP images. Export HEIC photographs as JPEG first." });
      return;
    }
    const additions = files.map((file) => {
      const url = URL.createObjectURL(file);
      urls.current.add(url);
      return { id: crypto.randomUUID(), file, url };
    });
    setPages((items) => [...items, ...additions]);
    setStatus({ tone: "muted", text: "Pages ready. Check their order, then transcribe to Notebook." });
  }

  async function takePhoto() {
    try {
      const preview = video.current;
      if (!preview?.videoWidth || !preview.videoHeight) throw new Error("Wait for the camera preview to appear.");
      const canvas = document.createElement("canvas");
      canvas.width = preview.videoWidth;
      canvas.height = preview.videoHeight;
      canvas.getContext("2d").drawImage(preview, 0, 0);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.95));
      if (!blob) throw new Error("The camera could not make a photograph. Try again.");
      addPages([new File([blob], `page-${Date.now()}.jpg`, { type: "image/jpeg" })]);
    } catch (error) { setStatus({ tone: "error", text: error.message }); }
  }

  function removePage(id) {
    const page = pages.find((item) => item.id === id);
    URL.revokeObjectURL(page.url);
    urls.current.delete(page.url);
    setPages((items) => items.filter((item) => item.id !== id));
  }

  function moveUp(index) {
    setPages((items) => {
      const next = [...items];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }

  async function submit() {
    if (busy || !pages.length) return;
    setBusy(true);
    setStatus({ tone: "muted", text: "Saving and transcribing the photographs… This can take a minute." });
    const form = new FormData();
    pages.forEach((page) => form.append("images", page.file));
    form.append("hint", hint);
    try {
      const response = await fetch("/api/transcribe", { method: "POST", body: form, headers: userKey.headers });
      const result = await response.json();
      if (!response.ok || result.error) throw new Error(result.error || `HTTP ${response.status}`);
      setStatus({ tone: result.warning ? "warn" : "ok", text: result.warning || `Saved to Notebook: ${result.title}`, href: result.href });
      if (result.href) {
        setRecent((items) => [result, ...items].slice(0, 20));
        pages.forEach((page) => { URL.revokeObjectURL(page.url); urls.current.delete(page.url); });
        setPages([]);
        setHint("");
      }
    } catch (error) { setStatus({ tone: "error", text: error.message }); }
    finally { setBusy(false); }
  }

  return <div className="capture photo-capture">
    <div className="photo-actions">
      <label className="photo-upload">Upload images
        <input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={busy} onChange={(event) => { addPages(Array.from(event.target.files || [])); event.target.value = ""; }} />
      </label>
      <button type="button" className="photo-secondary" disabled={busy || cameraLoading} onClick={() => cameraOn ? stopCamera() : startCamera()}>{cameraOn ? "Turn camera off" : cameraLoading ? "Opening camera…" : "Turn camera on"}</button>
      {cameraLoading && <button type="button" className="photo-secondary" onClick={stopCamera}>Cancel camera</button>}
      <a className="capture-link" href="/notebook">Open Notebook →</a>
    </div>
    <div className="photo-camera" hidden={!cameraOn && !cameraLoading}>
      <video ref={video} autoPlay muted playsInline aria-label="Camera preview" />
      <div className="photo-actions">
        {cameras.length > 1 && <label className="capture-device">Camera
          <select value={device} disabled={busy || cameraLoading} onChange={(event) => { setDevice(event.target.value); startCamera(event.target.value); }}>
            <option value="">Default camera</option>
            {cameras.map((camera) => <option key={camera.deviceId} value={camera.deviceId}>{camera.label || "Camera"}</option>)}
          </select>
        </label>}
        <button type="button" className="photo-secondary" disabled={!cameraOn || busy || pages.length >= 12} onClick={takePhoto}>Take photograph</button>
      </div>
    </div>
    <p className="capture-lede">JPEG, PNG, or WebP · Up to 12 pages · 10 MB per image, 30 MB total. Pages are transcribed in the order shown.</p>
    {pages.length > 0 && <ol className="photo-pages" aria-label="Pages to transcribe">
      {pages.map((page, index) => <li key={page.id}>
        <img src={page.url} alt={`Page ${index + 1}: ${page.file.name}`} />
        <span>Page {index + 1} · {page.file.name}</span>
        <div className="photo-actions">
          <button type="button" className="photo-secondary" disabled={busy || index === 0} onClick={() => moveUp(index)} aria-label={`Move page ${index + 1} up`}>Move up</button>
          <button type="button" className="photo-secondary" disabled={busy} onClick={() => removePage(page.id)} aria-label={`Remove page ${index + 1}`}>Remove</button>
        </div>
      </li>)}
    </ol>}
    <label className="capture-hint">
      <span className="eyebrow">What's this about? (optional)</span>
      <textarea rows={2} value={hint} disabled={busy} onChange={(event) => setHint(event.target.value)} placeholder="A topic or names that may help read the handwriting" />
    </label>
    <ApiKeyField config={config} userKey={userKey} purpose="transcribe photographs" />
    <button type="button" className="capture-button" disabled={busy || !pages.length} onClick={submit}>{busy ? "Transcribing…" : "Transcribe to Notebook"}</button>
    <p className={`capture-status capture-status-${status.tone}`} role="status">{status.text}{status.href && <> · <a className="capture-link" href={status.href}>Open note →</a></>}</p>
    {recent.length > 0 && <ul className="capture-recent" aria-label="Recent photographed notes">
      {recent.map((note) => <li key={note.id}>
        <a href={note.href}><strong>{note.title}</strong></a>
        <details><summary>Transcription</summary><p className="capture-description">{note.transcript}</p></details>
      </li>)}
    </ul>}
  </div>;
}
