"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// The microphone side of /dictate: pick a microphone, record with a timer and level meter, and hand the
// recording back as a WAV.

const storageKey = "dictate-device";
const sampleRate = 16000;

function remember(key, value) { try { localStorage.setItem(key, value); } catch {} }
function recall(key) { try { return localStorage.getItem(key); } catch { return null; } }

export function clock(ms) {
  const seconds = Math.floor(ms / 1000);
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

// Whatever the browser recorded (WebM/Opus in Chrome, MP4 in Safari), decoded and resampled to 16 kHz mono 16-bit WAV,
// a format every audio model on OpenRouter takes. Speech needs no more than that, and it keeps uploads small.
export async function toWav(blob) {
  const context = new AudioContext();
  let decoded;
  try { decoded = await context.decodeAudioData(await blob.arrayBuffer()); } finally { context.close(); }
  const offline = new OfflineAudioContext(1, Math.max(1, Math.ceil(decoded.duration * sampleRate)), sampleRate);
  const source = offline.createBufferSource();
  source.buffer = decoded;
  source.connect(offline.destination);
  source.start();
  const samples = (await offline.startRendering()).getChannelData(0);

  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  const text = (offset, value) => { for (let i = 0; i < value.length; i++) view.setUint8(offset + i, value.charCodeAt(i)); };
  text(0, "RIFF"); view.setUint32(4, 36 + samples.length * 2, true); text(8, "WAVE");
  text(12, "fmt "); view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true);
  text(36, "data"); view.setUint32(40, samples.length * 2, true);
  for (let i = 0; i < samples.length; i++) {
    const sample = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(44 + i * 2, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
  }
  return new Blob([buffer], { type: "audio/wav" });
}

// `onRecorded(blob)` gets each recording of a second or more; `onStatus({ tone, text })` gets anything worth telling.
export function useRecorder({ onRecorded, onStatus }) {
  const recorderRef = useRef(null);
  const startedRef = useRef(0);
  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState("");
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [level, setLevel] = useState(0);

  const listDevices = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    const mics = (await navigator.mediaDevices.enumerateDevices()).filter((device) => device.kind === "audioinput" && device.deviceId);
    setDevices(mics);
    const saved = recall(storageKey);
    if (saved && mics.some((mic) => mic.deviceId === saved)) setDeviceId(saved);
  }, []);

  useEffect(() => { listDevices(); }, [listDevices]);

  useEffect(() => {
    if (!recording) return;
    const timer = setInterval(() => setElapsed(Date.now() - startedRef.current), 250);
    return () => clearInterval(timer);
  }, [recording]);

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      onStatus({ tone: "error", text: "This browser can't record here. Use Chrome or Safari, and open the app at localhost on this machine." });
      return;
    }
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: deviceId ? { deviceId: { exact: deviceId } } : true });
    } catch (error) {
      if (deviceId && error.name !== "NotAllowedError") { remember(storageKey, ""); setDeviceId(""); }
      onStatus({ tone: "error", text: error.name === "NotAllowedError" ? "Microphone permission was refused. Click the icon in the address bar to allow it, then try again." : `Couldn't open the microphone: ${error.message}` });
      return;
    }
    listDevices();

    // A level meter, so you can see the microphone is hearing you.
    const audio = new AudioContext();
    const analyser = audio.createAnalyser();
    analyser.fftSize = 1024;
    audio.createMediaStreamSource(stream).connect(analyser);
    const data = new Float32Array(analyser.fftSize);
    let frame;
    const tick = () => {
      analyser.getFloatTimeDomainData(data);
      let sum = 0;
      for (const value of data) sum += value * value;
      setLevel(Math.min(1, Math.sqrt(sum / data.length) * 4));
      frame = requestAnimationFrame(tick);
    };
    tick();

    const chunks = [];
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
    recorder.onstop = () => {
      cancelAnimationFrame(frame);
      audio.close();
      stream.getTracks().forEach((track) => track.stop());
      setLevel(0);
      const blob = new Blob(chunks, { type: recorder.mimeType });
      if (Date.now() - startedRef.current < 1000 || !blob.size) { onStatus({ tone: "warn", text: "That was too short to send." }); return; }
      onRecorded(blob);
    };
    recorder.start(1000);
    recorderRef.current = recorder;
    startedRef.current = Date.now();
    setElapsed(0);
    setRecording(true);
    onStatus({ tone: "muted", text: "Recording. Press Stop (or the space bar) when you're done." });
  }, [deviceId, listDevices, onRecorded, onStatus]);

  const stop = useCallback(() => {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    recorderRef.current = null;
    setRecording(false);
  }, []);

  const toggle = useCallback(() => (recording ? stop() : start()), [recording, start, stop]);

  // Stop the microphone if the page goes away mid-recording.
  useEffect(() => () => recorderRef.current?.stream.getTracks().forEach((track) => track.stop()), []);

  const choose = useCallback((id) => {
    setDeviceId(id);
    remember(storageKey, id);
  }, []);

  return { devices, deviceId, choose, recording, elapsed, level, toggle };
}

// The space bar starts and stops recording, except while typing or on a control. `enabled` lets a page pause it.
export function useSpaceBar(action, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    function onKey(event) {
      if (event.code !== "Space" || event.repeat || event.target.closest?.("select, input, button, textarea, summary")) return;
      event.preventDefault();
      action();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [action, enabled]);
}

export function MicrophonePicker({ recorder }) {
  return (
    <label className="capture-device">
      <span className="eyebrow">Microphone</span>
      <select value={recorder.deviceId} onChange={(event) => recorder.choose(event.target.value)} disabled={recorder.recording}>
        <option value="">System default</option>
        {recorder.devices.filter((device) => device.deviceId !== "default").map((device, index) => <option key={device.deviceId} value={device.deviceId}>{device.label || `Microphone ${index + 1}`}</option>)}
      </select>
    </label>
  );
}

export function RecordButton({ recorder, disabled = false, label = "Record" }) {
  return (
    <div className="capture-recorder">
      <button type="button" className="capture-button" onClick={recorder.toggle} aria-pressed={recorder.recording} disabled={disabled && !recorder.recording}>
        <span className="capture-button-dot" aria-hidden="true" />
        {recorder.recording ? "Stop" : label}
      </button>
      <span className="capture-clock" aria-live="off">{clock(recorder.elapsed)}</span>
      <span className="capture-meter" aria-hidden="true"><span style={{ width: `${Math.round(recorder.level * 100)}%` }} /></span>
    </div>
  );
}
