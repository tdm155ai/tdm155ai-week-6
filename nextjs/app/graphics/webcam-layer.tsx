"use client";

import { useEffect, useRef, useState } from "react";

// The live camera, filling the frame behind the graphic. The editor's preview and the display window each open it
// themselves (same machine, same origin), so nothing is streamed between windows.
export function WebcamLayer({ deviceId, mirror, onReady }: { deviceId: string; mirror: boolean; onReady?: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const ready = useRef(onReady);
  ready.current = onReady;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;
    navigator.mediaDevices
      .getUserMedia({ video: { width: { ideal: 1920 }, height: { ideal: 1080 }, ...(deviceId ? { deviceId: { exact: deviceId } } : {}) }, audio: false })
      .then((s) => {
        if (cancelled) { s.getTracks().forEach((t) => t.stop()); return; }
        stream = s;
        setError(null);
        if (video.current) { video.current.srcObject = s; void video.current.play().catch(() => {}); }
        ready.current?.();
      })
      .catch((cause) => { if (!cancelled) setError(cause instanceof Error ? cause.message : "Could not open the camera."); });
    return () => { cancelled = true; stream?.getTracks().forEach((t) => t.stop()); };
  }, [deviceId]);

  return (
    <div className="absolute inset-0 z-0 bg-black">
      <video ref={video} muted playsInline className="absolute inset-0 h-full w-full object-cover" style={mirror ? { transform: "scaleX(-1)" } : undefined} />
      {error && <p className="absolute left-3 top-3 rounded bg-red-900/80 px-2 py-1 text-xs text-white">Camera: {error}</p>}
    </div>
  );
}
