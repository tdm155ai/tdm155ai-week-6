"use client";

// Webcam selection and full-resolution canvas capture adapted from ll-kits/kits/capture.
import { useCallback, useEffect, useRef, useState } from "react";

export default function CaptureCamera() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const sequence = useRef(0);
  const saving = useRef(false);
  const [cameras, setCameras] = useState([]);
  const [device, setDevice] = useState("");
  const [status, setStatus] = useState("Choose Start camera to open the preview.");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [size, setSize] = useState("");
  const [label, setLabel] = useState("");
  const [recent, setRecent] = useState([]);

  const stop = useCallback(() => {
    sequence.current += 1;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setReady(false);
    setSize("");
    setBusy(false);
  }, []);

  useEffect(() => () => {
    sequence.current += 1;
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  async function start(id = device) {
    stop();
    const attempt = sequence.current;
    setBusy(true);
    setStatus("Opening the camera…");
    if (!navigator.mediaDevices?.getUserMedia) {
      setBusy(false);
      setStatus("Camera access needs localhost or HTTPS. Open this app on the capture computer at http://localhost:3007/capture.");
      return;
    }
    try {
      const constraints = { width: { ideal: 1920 }, height: { ideal: 1080 }, ...(id ? { deviceId: { exact: id } } : {}) };
      const stream = await navigator.mediaDevices.getUserMedia({ video: constraints, audio: false });
      if (sequence.current !== attempt) { stream.getTracks().forEach((track) => track.stop()); return; }
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      if (sequence.current !== attempt) return;
      const devices = await navigator.mediaDevices.enumerateDevices();
      if (sequence.current !== attempt) return;
      setCameras(devices.filter((entry) => entry.kind === "videoinput"));
      setDevice(stream.getVideoTracks()[0]?.getSettings().deviceId || id);
      setStatus("Ready. Capture a still, or press Space.");
    } catch (error) {
      if (sequence.current !== attempt) return;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setReady(false);
      setStatus(error.name === "NotAllowedError" ? "Camera permission was refused. Allow camera access for this page in your browser, then choose Start camera." : `Couldn't open the camera: ${error.message}`);
    } finally { if (sequence.current === attempt) setBusy(false); }
  }

  const capture = useCallback(async () => {
    const video = videoRef.current;
    if (!ready || saving.current || !video?.videoWidth || video.readyState < 2) return;
    saving.current = true;
    setBusy(true);
    setStatus("Saving the still…");
    try {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
      if (!blob) throw new Error("The browser could not create an image.");
      const form = new FormData();
      form.append("file", blob, "still.jpg");
      form.append("label", label);
      const response = await fetch("/api/capture", { method: "POST", body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || `HTTP ${response.status}`);
      setRecent((items) => [result, ...items].slice(0, 12));
      setStatus(`Saved ${result.path}`);
    } catch (error) { setStatus(`Not saved: ${error.message}`); }
    finally { saving.current = false; setBusy(false); }
  }, [ready, label]);

  useEffect(() => {
    function keydown(event) {
      if (event.code !== "Space" || event.repeat || event.target.closest?.("input, select, textarea, button, a, [contenteditable]")) return;
      event.preventDefault();
      capture();
    }
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [capture]);

  return (
    <section className="camera-studio" aria-label="Webcam capture">
      <div className="camera-bar">
        <label htmlFor="camera-device">Camera
          <select id="camera-device" value={device} disabled={busy || !cameras.length} onChange={(event) => { setDevice(event.target.value); start(event.target.value); }}>
            {!cameras.length && <option value="">Default camera</option>}
            {cameras.map((camera, index) => <option key={camera.deviceId} value={camera.deviceId}>{camera.label || `Camera ${index + 1}`}</option>)}
          </select>
        </label>
        <button type="button" onClick={() => start()} disabled={busy}>{streamRef.current ? "Restart camera" : "Start camera"}</button>
        {ready && <button type="button" onClick={() => { stop(); setStatus("Camera stopped."); }} disabled={busy}>Stop camera</button>}
      </div>
      <div className="camera-preview">
        <video ref={videoRef} autoPlay muted playsInline onLoadedData={(event) => { if (!streamRef.current) return; setReady(true); setSize(`${event.currentTarget.videoWidth} × ${event.currentTarget.videoHeight}`); }} onResize={(event) => { if (streamRef.current) setSize(`${event.currentTarget.videoWidth} × ${event.currentTarget.videoHeight}`); }} />
        {!ready && <span>Camera preview</span>}
      </div>
      <div className="camera-bar">
        <label htmlFor="still-label">Label (optional)<input id="still-label" value={label} maxLength={200} onChange={(event) => setLabel(event.target.value)} placeholder="Character pose, prop, or stage reference" /></label>
        <button className="camera-shutter" type="button" onClick={capture} disabled={!ready || busy}>Capture still</button>
        {size && <span className="camera-size">{size}</span>}
      </div>
      <p className="camera-status" role="status" aria-live="polite">{status}</p>
      {recent.length > 0 && <div className="camera-recent" aria-label="Recent captures">{recent.map((item) => <figure key={item.src}><a href={item.src} target="_blank" rel="noreferrer"><img src={item.src} alt={item.label || "Captured reference still"} /></a><figcaption>{item.label || item.filename}<a href={item.src} download={item.filename}>Download JPEG</a></figcaption></figure>)}</div>}
    </section>
  );
}
