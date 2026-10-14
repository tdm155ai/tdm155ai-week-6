"use client";

import { useCallback, useEffect, useState } from "react";
import ApiKeyField, { useUserKey } from "../components/ApiKeyField.jsx";
import { MicrophonePicker, RecordButton, toWav, useRecorder, useSpaceBar } from "../components/recorder.js";

export default function DictateClient() {
  const [config, setConfig] = useState(null);
  const [hint, setHint] = useState("");
  const [status, setStatus] = useState({ tone: "muted", text: "Ready. Press Record or the space bar." });
  const [recent, setRecent] = useState([]);
  const userKey = useUserKey();
  const canTranscribe = Boolean(config?.ready || userKey.key);

  useEffect(() => {
    fetch("/api/dictate").then((response) => response.json()).then(setConfig).catch(() => {});
  }, []);

  // Each recording is sent on its own, so the next one can start while the last is still being written up.
  const send = useCallback(async (blob, hintText) => {
    const id = `${Date.now()}-${Math.random()}`;
    const update = (patch) => setRecent((items) => items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    setRecent((items) => [{ id, title: hintText || "New note", note: "Preparing the audio…", tone: "muted" }, ...items].slice(0, 20));
    try {
      const wav = await toWav(blob);
      update({ note: canTranscribe ? "Transcribing and cleaning up… (this can take a minute)" : "Saving the recording…" });
      const form = new FormData();
      form.append("audio", wav, "dictation.wav");
      form.append("hint", hintText);
      const response = await fetch("/api/dictate", { method: "POST", body: form, headers: userKey.headers });
      const result = await response.json();
      if (result.href) {
        const tone = result.warning ? "warn" : "ok";
        update({ title: result.title, href: result.href, description: result.description, transcript: result.transcript, note: result.warning || `Saved to ${result.file}`, tone });
        setStatus({ tone, text: `Note ready: ${result.title}`, href: result.href });
      } else if (!response.ok || result.error) {
        throw new Error(result.error || `HTTP ${response.status}`);
      } else {
        update({ note: result.warning || "Saved.", tone: "warn", transcript: result.transcript });
        setStatus({ tone: "warn", text: result.warning || "Saved." });
      }
    } catch (error) {
      update({ note: error.message, tone: "error" });
      setStatus({ tone: "error", text: error.message });
    }
  }, [canTranscribe, userKey.headers]);

  const onRecorded = useCallback((blob) => {
    setStatus({ tone: "muted", text: "Sent. You can record the next one." });
    setHint("");
    send(blob, hint.trim());
  }, [hint, send]);

  const recorder = useRecorder({ onRecorded, onStatus: setStatus });
  useSpaceBar(recorder.toggle);

  return (
    <div className={recorder.recording ? "capture capture-recording" : "capture"}>
      <div className="capture-bar">
        <MicrophonePicker recorder={recorder} />
        {config && canTranscribe && <span className="capture-models">Transcribe: <code>{config.transcribeModel}</code> · Clean up: <code>{config.cleanupModel}</code></span>}
      </div>

      <ApiKeyField config={config} userKey={userKey} purpose="transcribe recordings" />

      <label className="capture-hint">
        <span className="eyebrow">What's this about? (optional)</span>
        <textarea rows={2} value={hint} onChange={(event) => setHint(event.target.value)} placeholder="A line of context for the cleanup: a meeting, a project, who's involved" disabled={recorder.recording} />
      </label>

      <RecordButton recorder={recorder} />
      <p className={`capture-status capture-status-${status.tone}`} role="status">
        {status.text}
        {status.href && <> · <a className="capture-link" href={status.href}>Open it →</a></>}
      </p>

      {recent.length > 0 && (
        <ul className="capture-recent" aria-label="Your recent notes">
          {recent.map((item) => (
            <li key={item.id}>
              {item.href ? <a href={item.href}><strong>{item.title}</strong></a> : <strong>{item.title}</strong>}
              {item.description && <p className="capture-lede">{item.description}</p>}
              <span className={`capture-note capture-status-${item.tone}`}>{item.note}</span>
              {item.href && <a className="capture-link" href={item.href}>{`${window.location.origin}${item.href}`}</a>}
              {item.transcript && (
                <details>
                  <summary>Raw transcript</summary>
                  <p className="capture-description">{item.transcript}</p>
                </details>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
