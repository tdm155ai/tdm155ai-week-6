"use client";

import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";

// Times are measured from the beginning of the original video, in seconds.
const clips = {
  sun: { videoId: "jefNSYYFm5w", startSeconds: 33, endSeconds: 132 },
  rain: { videoId: "jefNSYYFm5w", startSeconds: 149, endSeconds: 249 },
};
function videoUrl(clip, origin) {
  return `https://www.youtube.com/embed/${clip.videoId}?start=${clip.startSeconds}&end=${clip.endSeconds}&autoplay=1&mute=1&playsinline=1&controls=0&enablejsapi=1&origin=${encodeURIComponent(origin)}`;
}

let apiPromise;
function loadPlayerApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!apiPromise) apiPromise = new Promise((resolve, reject) => {
    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { previousReady?.(); resolve(window.YT); };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.onerror = () => { apiPromise = undefined; reject(new Error("YouTube player API could not load")); };
    document.head.appendChild(script);
  });
  return apiPromise;
}

export default function NotebookWink() {
  const [playing, setPlaying] = useState(false);
  const [sound, setSound] = useState(false);
  const [mode, setMode] = useState("sun");
  const [embedUrl, setEmbedUrl] = useState("");
  const [origin, setOrigin] = useState("");
  const modeRef = useRef("sun");
  const soundRef = useRef(false);
  const player = useRef(null);
  const controller = useRef(null);
  const trigger = useRef(null);

  useEffect(() => { setOrigin(window.location.origin); }, []);

  useEffect(() => {
    if (!playing) return;
    let cancelled = false;
    loadPlayerApi().then((YT) => {
      if (cancelled || !player.current) return;
      controller.current = new YT.Player(player.current, {
        events: {
          onReady: (event) => {
            if (cancelled) return;
            event.target[soundRef.current ? "unMute" : "mute"]();
            // Use the latest choice, including changes while the API was loading.
            event.target.loadVideoById(clips[modeRef.current]);
          },
          onStateChange: (event) => {
            // Native playlist looping discards the start/end range after the first pass.
            if (!cancelled && event.data === YT.PlayerState.ENDED) event.target.loadVideoById(clips[modeRef.current]);
          },
        },
      });
    }).catch(() => { /* The iframe still plays the bounded section once if the API cannot load. */ });
    return () => {
      cancelled = true;
      controller.current?.destroy();
      controller.current = null;
    };
  }, [playing]);

  useEffect(() => {
    if (!playing) return;
    document.body.classList.add("gosling-playing");
    const escape = (event) => {
      if (event.key === "Escape") { setPlaying(false); trigger.current?.focus(); }
    };
    window.addEventListener("keydown", escape);
    return () => {
      document.body.classList.remove("gosling-playing");
      window.removeEventListener("keydown", escape);
    };
  }, [playing]);

  function close() {
    setPlaying(false);
    trigger.current?.focus();
  }

  function toggleSound() {
    if (controller.current?.[sound ? "mute" : "unMute"]) controller.current[sound ? "mute" : "unMute"]();
    else player.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func: sound ? "mute" : "unMute", args: [] }), "https://www.youtube.com");
    soundRef.current = !sound;
    setSound(!sound);
  }

  function chooseMode(next) {
    modeRef.current = next;
    setMode(next);
    if (!playing) return;
    if (controller.current?.loadVideoById) controller.current.loadVideoById(clips[next]);
    else player.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "loadVideoById", args: [clips[next]] }), "https://www.youtube.com");
  }

  function togglePlaying() {
    if (!playing) setEmbedUrl(videoUrl(clips[modeRef.current], origin));
    setPlaying(!playing);
  }

  return <>
    <aside className="notebook-wink" aria-label="Your notebook">
      <p>Get started on your first big project by researching, learning, writing, and prototyping with AI assistance. Put all of your references, sources, tutorials, and more in The Notebook. <span>No, not that one.</span></p>
      <p><span>Fewer rowboats, more Markdown.</span></p>
      <div>
        <Link href="/notebook">Open your Notebook →</Link>
        <button ref={trigger} type="button" className="gosling-trigger" aria-expanded={playing} title="A cinematic detour" onClick={togglePlaying}>gosling</button>
        <div className="gosling-modes" role="group" aria-label="Background video mode">
          <button type="button" aria-pressed={mode === "sun"} onClick={() => chooseMode("sun")}>Sun mode</button>
          <button type="button" aria-pressed={mode === "rain"} onClick={() => chooseMode("rain")}>Rain mode</button>
        </div>
        <button type="button" className="gosling-trigger gosling-sound" onClick={toggleSound} aria-pressed={sound} disabled={!playing}>{sound ? "Sound off" : "Sound on"}</button>
      </div>
    </aside>
    {playing && createPortal(<>
      <div className="gosling-background" aria-hidden="true">
        <iframe ref={player} src={embedUrl} title="The Notebook — a cinematic detour" tabIndex={-1} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
        <div className="gosling-shade" />
      </div>
      <div className="gosling-controls" aria-label="Background video controls">
        <button type="button" onClick={close}>Back to the notebook ×</button>
      </div>
    </>, document.body)}
  </>;
}
