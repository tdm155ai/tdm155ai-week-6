"use client";

import { useCallback, useEffect, useState } from "react";

// When the app has no OPENROUTER_API_KEY in nextjs/.env.local, /dictate and /transcribe ask for the user's own. The key
// is kept in this browser only (localStorage) and sent with each request in the X-OpenRouter-Key header; the server
// uses it for that request and never saves it.

const storageKey = "openrouter-key";

function recall() { try { return localStorage.getItem(storageKey) || ""; } catch { return ""; } }
function remember(value) { try { value ? localStorage.setItem(storageKey, value) : localStorage.removeItem(storageKey); } catch {} }

export function useUserKey() {
  const [key, setKey] = useState("");
  useEffect(() => { setKey(recall()); }, []);
  const save = useCallback((value) => { const trimmed = value.trim(); remember(trimmed); setKey(trimmed); }, []);
  // Headers for fetch: the key when there is one, nothing otherwise.
  const headers = key ? { "X-OpenRouter-Key": key } : {};
  return { key, save, headers };
}

// `config.ready` means the server has its own key, so nothing is asked for.
export default function ApiKeyField({ config, userKey, purpose }) {
  const [draft, setDraft] = useState("");
  if (!config || config.ready) return null;

  if (userKey.key) {
    return (
      <div className="api-key api-key-set">
        <span>Using your OpenRouter key ({userKey.key.slice(0, 8)}…{userKey.key.slice(-4)}), saved in this browser.</span>
        <button type="button" className="photo-secondary" onClick={() => userKey.save("")}>Forget it</button>
      </div>
    );
  }

  return (
    <form className="api-key" onSubmit={(event) => { event.preventDefault(); if (draft.trim()) { userKey.save(draft); setDraft(""); } }}>
      <label>
        <span className="eyebrow">Your OpenRouter API key</span>
        <input type="password" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="sk-or-v1-…" autoComplete="off" spellCheck={false} />
      </label>
      <button type="submit" className="photo-secondary" disabled={!draft.trim()}>Use this key</button>
      <p className="capture-lede">This app has no key of its own, so paste yours to {purpose}. It stays in this browser and goes only to OpenRouter through this app; it isn't saved anywhere else. Without a key, your {purpose === "transcribe photographs" ? "photographs" : "recordings"} are still saved.</p>
    </form>
  );
}
