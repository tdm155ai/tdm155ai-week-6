"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { LiveEffect } from "@/app/graphics/effects/live-effect";
import { Graphic } from "@/lib/graphics/graphic";
import { FONT_FAMILIES } from "@/lib/graphics/fonts";
import {
  DEFAULT_SPEC,
  FONTS,
  FRAME,
  PRESETS,
  RAIN_GLYPHS,
  normalizeSpec,
  type FontId,
  type Spec,
} from "@/lib/graphics/graphic-spec";

import { DEFAULT_STAGE, type Stage } from "@/lib/graphics/stage";
import { WebcamLayer } from "./webcam-layer";

export const PRESET_STORAGE_KEY = "tdm155ai-week-6-graphics:saved-presets";
export type SavedPreset = { id: string; name: string; spec: Spec; image: string | null };

export const STORAGE_KEY = "tdm155ai-week-6-graphics:spec";

export function GraphicEditor() {
  const [storedSpec, setSpec] = useState<Spec>(DEFAULT_SPEC);
  // Fill fields the state predates (e.g. kept across a hot reload after the spec grew).
  const spec = useMemo(() => ({ ...DEFAULT_SPEC, ...storedSpec }), [storedSpec]);
  const [image, setImage] = useState<string | null>(null);
  const [scale, setScale] = useState<1 | 2>(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [savedPresets, setSavedPresets] = useState<SavedPreset[]>([]);
  const [presetName, setPresetName] = useState("");
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [presetError, setPresetError] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>(DEFAULT_STAGE);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const listCameras = useCallback(() => {
    void navigator.mediaDevices.enumerateDevices().then((devices) => setCameras(devices.filter((d) => d.kind === "videoinput")));
  }, []);

  useEffect(() => {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(PRESET_STORAGE_KEY) ?? "[]");
      if (Array.isArray(stored)) setSavedPresets(stored.filter((p) => p && typeof p.id === "string" && typeof p.name === "string" && p.spec).map((p) => ({ id: p.id, name: p.name, spec: normalizeSpec(p.spec), image: typeof p.image === "string" ? p.image : null })));
    } catch { setPresetError("Saved presets could not be loaded."); }
  }, []);

  function persistPresets(next: SavedPreset[]) {
    try {
      localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(next));
      setSavedPresets(next);
      setPresetError(null);
      return true;
    } catch {
      setPresetError("Could not save presets. Browser storage may be full; try a smaller background image.");
      return false;
    }
  }

  function savePreset() {
    const preset = { id: crypto.randomUUID(), name: presetName.trim() || spec.primary.trim() || `Graphic ${savedPresets.length + 1}`, spec: { ...spec }, image: spec.background === "image" ? image : null };
    if (persistPresets([...savedPresets, preset])) {
      setPresetName("");
      setActivePreset(preset.id);
    }
  }

  function launchPreset(preset: SavedPreset) {
    setSpec({ ...preset.spec });
    setImage(preset.image);
    setActivePreset(preset.id);
    setStage((s) => ({ ...s, showGraphic: true })); // launching puts it on screen
  }

  const activeIndex = savedPresets.findIndex((p) => p.id === activePreset);

  // G shows or hides the graphic (not while typing).
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement).closest("input, textarea, select") || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key.toLowerCase() === "g") setStage((s) => ({ ...s, showGraphic: !s.showGraphic }));
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setSpec(normalizeSpec(JSON.parse(saved)));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(spec));
    } catch {}
  }, [spec]);

  const set = <K extends keyof Spec>(key: K, value: Spec[K]) => setSpec((s) => ({ ...s, [key]: value }));

  async function exportPng() {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/graphics/render", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ spec, scale, backgroundImage: spec.background === "image" ? image : null }),
      });
      if (!response.ok) throw new Error((await response.json()).error ?? "Render failed.");
      const blob = await response.blob();
      const slug =
        (spec.primary || "graphic").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) ||
        "graphic";
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${spec.template}-${slug}-${scale === 2 ? "4k" : "1080p"}.png`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Render failed.");
    } finally {
      setBusy(false);
    }
  }

  function loadImage(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImage(String(reader.result));
      set("background", "image");
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="w-full shrink-0 space-y-5 overflow-y-auto border-neutral-800 p-5 text-sm lg:h-screen lg:w-[380px] lg:border-r">
        <header>
          <h1 className="text-lg font-semibold">Graphics</h1>
          <p className="text-neutral-400">Lower thirds, titles, and bugs as PNGs for the edit.</p>
          <a href="/graphics/record" target="_blank" className="mt-3 inline-block rounded-lg bg-red-600 px-3 py-2 font-semibold text-white hover:bg-red-500">Record with webcam →</a>
        </header>

        <Section title="Saved graphics">
          <div className="flex gap-2">
            <input className="field min-w-0 flex-1" aria-label="Preset name" placeholder="Name this graphic" value={presetName} onChange={(e) => setPresetName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") savePreset(); }} />
            <button className="rounded-lg bg-blue-600 px-3 py-2 hover:bg-blue-500" onClick={savePreset}>Save</button>
          </div>
          <p className="text-xs text-neutral-500">Save the current text, styling, and background. Click a card to launch it.</p>
          {savedPresets.length > 0 && <>
            <div className="flex gap-2">
              <button className="flex-1 rounded-lg border border-neutral-700 px-3 py-2 disabled:opacity-30" disabled={activeIndex <= 0} onClick={() => launchPreset(savedPresets[activeIndex - 1])}>Previous</button>
              <button className="flex-1 rounded-lg bg-neutral-200 px-3 py-2 text-neutral-900 disabled:opacity-30" disabled={activeIndex >= savedPresets.length - 1} onClick={() => launchPreset(savedPresets[activeIndex + 1])}>{activeIndex < 0 ? "Launch first" : "Launch next"}</button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {savedPresets.map((preset, index) => (
                <div key={preset.id} className={`overflow-hidden rounded-xl border ${activePreset === preset.id ? "border-blue-400 bg-blue-950/40" : "border-neutral-700 bg-neutral-900"}`}>
                  <button className="block w-full space-y-2 p-3 text-left hover:bg-white/5" onClick={() => launchPreset(preset)} aria-pressed={activePreset === preset.id}>
                    <div className="pointer-events-none"><Preview spec={preset.spec} image={preset.image} /></div>
                    <div className="flex gap-2"><span className="text-neutral-500">{index + 1}</span><span className="truncate font-medium">{preset.name}</span></div>
                    <span className="block text-xs text-neutral-500">{preset.spec.effect !== "none" ? `${preset.spec.effect} shader` : preset.spec.template}</span>
                    <span className="block text-xs text-blue-300">{activePreset === preset.id ? "Selected · launch again" : "Launch"}</span>
                  </button>
                  <div className="flex justify-between border-t border-neutral-800 px-3 py-2 text-xs">
                    <button className="text-neutral-400 hover:text-white disabled:opacity-30" disabled={activePreset !== preset.id} onClick={() => persistPresets(savedPresets.map((p) => p.id === preset.id ? { ...p, spec: { ...spec }, image: spec.background === "image" ? image : null } : p))}>Update</button>
                    <button className="text-neutral-500 hover:text-red-400" aria-label={`Delete ${preset.name}`} onClick={() => { if (persistPresets(savedPresets.filter((p) => p.id !== preset.id)) && activePreset === preset.id) setActivePreset(null); }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </>}
          {presetError && <p role="alert" className="text-xs text-red-400">{presetError}</p>}
          <p className="text-xs text-neutral-500">Saved in this browser on this computer.</p>
        </Section>

        <Section title="Camera">
          <Toggle label="Show camera" value={stage.webcam} onChange={(on) => setStage((s) => ({ ...s, webcam: on, showGraphic: !on }))} />
          {stage.webcam && <>
            <select className="field" value={stage.deviceId} onChange={(e) => setStage((s) => ({ ...s, deviceId: e.target.value }))}>
              <option value="">Default camera</option>
              {cameras.map((d, i) => <option key={d.deviceId} value={d.deviceId}>{d.label || `Camera ${i + 1}`}</option>)}
            </select>
            <Toggle label="Mirror the camera" value={stage.mirror} onChange={(v) => setStage((s) => ({ ...s, mirror: v }))} />
          </>}
          <Toggle label="Show the graphic (G)" value={stage.showGraphic} onChange={(v) => setStage((s) => ({ ...s, showGraphic: v }))} />
          <p className="text-xs text-neutral-500">The camera fills the preview behind the graphic; off, you see the background. Turning the camera on hides the graphic; bring it in with G or by launching a saved graphic. Live shaders glow over the camera (their black drops out).</p>
        </Section>

        <Section title="Style starters">
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                className="rounded border border-neutral-700 px-2 py-1 hover:bg-neutral-800"
                onClick={() =>
                  setSpec((s) => ({ ...DEFAULT_SPEC, ...p.spec, primary: p.spec.primary ?? s.primary, secondary: p.spec.secondary ?? s.secondary, background: s.background, backgroundColor: s.backgroundColor }))
                }
              >
                {p.name}
              </button>
            ))}
          </div>
        </Section>

        <Section title="Text">
          <Segmented
            value={spec.template}
            options={[["lower-third", "Lower third"], ["title", "Title"], ["bug", "Corner bug"]]}
            onChange={(v) => set("template", v)}
          />
          <textarea className="field h-16" value={spec.primary} onChange={(e) => set("primary", e.target.value)} placeholder="Primary line (name, title)" />
          <textarea className="field h-14" value={spec.secondary} onChange={(e) => set("secondary", e.target.value)} placeholder="Secondary line (role, place)" />
          <Segmented
            value={spec.align}
            options={[["left", "Left"], ["center", "Center"], ["right", "Right"]]}
            onChange={(v) => set("align", v)}
          />
        </Section>

        <Section title="Fonts">
          <FontPicker label="Primary" value={spec.primaryFont} onChange={(v) => set("primaryFont", v)} />
          <Range label="Primary size" value={spec.primarySize} min={16} max={240} onChange={(v) => set("primarySize", v)} />
          <Color label="Primary color" value={spec.primaryColor} onChange={(v) => set("primaryColor", v)} />
          <FontPicker label="Secondary" value={spec.secondaryFont} onChange={(v) => set("secondaryFont", v)} />
          <Range label="Secondary size" value={spec.secondarySize} min={12} max={140} onChange={(v) => set("secondarySize", v)} />
          <Color label="Secondary color" value={spec.secondaryColor} onChange={(v) => set("secondaryColor", v)} />
          <Range label="Tracking" value={spec.tracking} min={-0.05} max={0.3} step={0.01} onChange={(v) => set("tracking", v)} />
          <Toggle label="Uppercase" value={spec.uppercase} onChange={(v) => set("uppercase", v)} />
        </Section>

        <Section title="Plate & accent">
          <Segmented
            value={spec.plate}
            options={[["none", "None"], ["solid", "Solid"], ["gradient", "Fade"]]}
            onChange={(v) => set("plate", v)}
          />
          {spec.plate !== "none" && (
            <>
              <Color label="Plate color" value={spec.plateColor} onChange={(v) => set("plateColor", v)} />
              <Range label="Plate opacity" value={spec.plateOpacity} min={0} max={100} onChange={(v) => set("plateOpacity", v)} />
              <Range label="Padding" value={spec.platePadding} min={0} max={80} onChange={(v) => set("platePadding", v)} />
              <Range label="Corner radius" value={spec.plateRadius} min={0} max={60} onChange={(v) => set("plateRadius", v)} />
            </>
          )}
          <Toggle label="Accent bar" value={spec.accent} onChange={(v) => set("accent", v)} />
          {spec.accent && (
            <>
              <Color label="Accent color" value={spec.accentColor} onChange={(v) => set("accentColor", v)} />
              <Range label="Accent width" value={spec.accentWidth} min={2} max={40} onChange={(v) => set("accentWidth", v)} />
            </>
          )}
        </Section>

        <Section title="Live shaders">
          <Segmented value={spec.effect} options={[["none", "Off"], ["splash", "Splash"], ["strands", "Strands"], ["ghost", "Ghost"], ["rain", "Rain"]]} onChange={(v) => set("effect", v)} />
          {spec.effect !== "none" && <>
            <Color label="Effect color" value={spec.effectColor} onChange={(v) => set("effectColor", v)} />
            {spec.effect !== "ghost" && <Toggle label="Rainbow colors" value={spec.effectRainbow} onChange={(v) => set("effectRainbow", v)} />}
            {spec.effect === "rain" && <>
              <label className="flex items-center gap-3">
                <span className="w-32 shrink-0 text-neutral-400">Glyphs</span>
                <select className="field flex-1" value={spec.rainGlyphs} onChange={(e) => set("rainGlyphs", e.target.value as Spec["rainGlyphs"])}>
                  {RAIN_GLYPHS.map(([id, label]) => <option key={id} value={id}>{label}</option>)}
                </select>
              </label>
              <p className="text-xs text-neutral-400">Hover to slow the rain around the pointer (bullet time). Click to start a burst.</p>
            </>}
            <EffectExtras spec={spec} set={set} reset={(keys) => setSpec((s) => ({ ...s, ...Object.fromEntries(keys.map((k) => [k, DEFAULT_SPEC[k]])) }))} />
            <p className="text-xs text-neutral-400">Move your cursor inside the preview.</p>
          </>}
          <p className="text-xs text-neutral-500">Live effects use a black background. PNG exports contain the graphic without animation.</p>
        </Section>

        <Section title="Text effects">
          <Toggle label="Drop shadow" value={spec.shadow} onChange={(v) => set("shadow", v)} />
          {spec.shadow && (
            <>
              <Color label="Shadow color" value={spec.shadowColor} onChange={(v) => set("shadowColor", v)} />
              <Range label="Shadow opacity" value={spec.shadowOpacity} min={0} max={100} onChange={(v) => set("shadowOpacity", v)} />
              <Range label="Shadow blur" value={spec.shadowBlur} min={0} max={60} onChange={(v) => set("shadowBlur", v)} />
              <Range label="Shadow distance" value={spec.shadowDistance} min={0} max={40} onChange={(v) => set("shadowDistance", v)} />
            </>
          )}
          <Toggle label="Glow" value={spec.glow} onChange={(v) => set("glow", v)} />
          {spec.glow && (
            <>
              <Color label="Glow color" value={spec.glowColor} onChange={(v) => set("glowColor", v)} />
              <Range label="Glow size" value={spec.glowSize} min={2} max={60} onChange={(v) => set("glowSize", v)} />
              <Range label="Glow strength" value={spec.glowStrength} min={1} max={4} onChange={(v) => set("glowStrength", v)} />
            </>
          )}
          <Toggle label="Outline" value={spec.outline} onChange={(v) => set("outline", v)} />
          {spec.outline && (
            <>
              <Color label="Outline color" value={spec.outlineColor} onChange={(v) => set("outlineColor", v)} />
              <Range label="Outline width" value={spec.outlineWidth} min={1} max={12} onChange={(v) => set("outlineWidth", v)} />
            </>
          )}
        </Section>

        <Section title="Position">
          <Range label="Side margin" value={spec.marginX} min={0} max={600} onChange={(v) => set("marginX", v)} />
          <Range label="Edge margin" value={spec.marginY} min={0} max={500} onChange={(v) => set("marginY", v)} />
        </Section>

        <Section title="Background">
          <Segmented
            value={spec.background}
            options={[["transparent", "None"], ["solid", "Color"], ["green", "Green"], ["black", "Black"], ["image", "Image"]]}
            onChange={(v) => set("background", v)}
          />
          {spec.background === "solid" && (
            <Color label="Background" value={spec.backgroundColor} onChange={(v) => set("backgroundColor", v)} />
          )}
          <label className="block text-neutral-400">
            Frame grab or still (preview and export)
            <input type="file" accept="image/*" className="mt-1 block w-full text-xs" onChange={(e) => loadImage(e.target.files?.[0])} />
          </label>
          <p className="text-xs text-neutral-500">“None” exports a PNG with alpha, for a track above the video.</p>
        </Section>

        <Section title="Export">
          <Segmented value={String(scale)} options={[["1", "1920×1080"], ["2", "3840×2160"]]} onChange={(v) => setScale(v === "2" ? 2 : 1)} />
          <button
            className="w-full rounded bg-blue-600 px-3 py-2 font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
            onClick={exportPng}
            disabled={busy}
          >
            {busy ? "Rendering…" : "Download PNG"}
          </button>
          {error && <p className="text-red-400">{error}</p>}
          <button className="text-xs text-neutral-500 underline" onClick={() => setSpec(DEFAULT_SPEC)}>
            Reset everything
          </button>
        </Section>
      </aside>

      <main className="flex h-dvh min-h-0 min-w-0 flex-1 flex-col justify-center gap-4 p-5">
        <div className="flex h-full min-h-0 w-full max-w-[1400px] flex-col gap-3 self-center">
          <div className="flex min-h-0 flex-1 items-center justify-center p-[5px]"><Preview spec={spec} image={image} live fitContainer stage={stage} onCamera={listCameras} /></div>
        </div>
      </main>
    </div>
  );
}

type PreviewProps = { spec: Spec; image: string | null; live?: boolean; fitContainer?: boolean; stage?: Stage; onCamera?: () => void };

export function Preview(props: PreviewProps) {
  return <SizedPreview {...props} />;
}

function SizedPreview({ spec, image, live = false, fitContainer = false, stage = DEFAULT_STAGE, onCamera }: PreviewProps) {
  const box = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState(0.4);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setFit(fitContainer ? Math.min(entry.contentRect.width / FRAME.width, entry.contentRect.height / FRAME.height) : entry.contentRect.width / FRAME.width));
    observer.observe(fitContainer ? el.parentElement! : el);
    return () => observer.disconnect();
  }, [fitContainer]);

  return (
    <div ref={box} style={fitContainer ? { width: FRAME.width * fit, flexShrink: 0 } : undefined} className={`relative isolate aspect-video w-full overflow-hidden checker rounded shadow-2xl ${live ? "ring-[5px] ring-neutral-500" : ""}`}>
      {stage.webcam && <WebcamLayer deviceId={stage.deviceId} mirror={stage.mirror} onReady={onCamera} />}
      {/* Over the camera, the shader is screen-blended: its black drops out and what glows stays. */}
      {live && spec.effect !== "none" && <div className="absolute inset-0 z-[1]" style={stage.webcam ? { mixBlendMode: "screen" } : undefined}><LiveEffect spec={spec} /></div>}
      <div className={`${live || stage.webcam ? "pointer-events-none relative z-10" : ""} transition-opacity duration-300`} style={{ width: FRAME.width, height: FRAME.height, transform: `scale(${fit})`, transformOrigin: "top left", opacity: stage.showGraphic ? 1 : 0 }}>
        <Graphic spec={stage.webcam || (live && spec.effect !== "none") ? { ...spec, background: "transparent" } : spec} family={(id) => FONT_FAMILIES[id]} backgroundImage={image} />
      </div>
    </div>
  );
}

type SetSpec = <K extends keyof Spec>(key: K, value: Spec[K]) => void;

function EffectExtras({ spec, set, reset }: { spec: Spec; set: SetSpec; reset: (keys: (keyof Spec)[]) => void }) {
  if (spec.effect === "none") return null;
  // Each effect's extras are the spec keys named after it (splashDecay, strandsSpeed, ...).
  const keys = (Object.keys(DEFAULT_SPEC) as (keyof Spec)[]).filter((k) => k.startsWith(spec.effect));
  return (
    <details className="rounded border border-neutral-800 px-3 py-2">
      <summary className="cursor-pointer select-none text-neutral-300">Extra properties</summary>
      <div className="mt-3 space-y-2">
        {spec.effect === "splash" && <>
          <Range label="Dye decay" value={spec.splashDecay} min={0} max={10} step={0.1} onChange={(v) => set("splashDecay", v)} />
          <Range label="Motion decay" value={spec.splashVelocityDecay} min={0} max={10} step={0.1} onChange={(v) => set("splashVelocityDecay", v)} />
          <Range label="Swirl (curl)" value={spec.splashCurl} min={0} max={50} step={0.5} onChange={(v) => set("splashCurl", v)} />
          <Range label="Splat size" value={spec.splashRadius} min={0.02} max={1} step={0.01} onChange={(v) => set("splashRadius", v)} />
          <Range label="Force (×1000)" value={spec.splashForce} min={0.5} max={20} step={0.5} onChange={(v) => set("splashForce", v)} />
          <Range label="Pressure" value={spec.splashPressure} min={0} max={1} step={0.05} onChange={(v) => set("splashPressure", v)} />
          {spec.effectRainbow && <Range label="Color change" value={spec.splashColorSpeed} min={0} max={40} step={1} onChange={(v) => set("splashColorSpeed", v)} />}
          <Toggle label="3D shading" value={spec.splashShading} onChange={(v) => set("splashShading", v)} />
        </>}
        {spec.effect === "strands" && <>
          <Range label="Strands" value={spec.strandsCount} min={1} max={12} onChange={(v) => set("strandsCount", v)} />
          <Range label="Speed" value={spec.strandsSpeed} min={0} max={3} step={0.05} onChange={(v) => set("strandsSpeed", v)} />
          <Range label="Amplitude" value={spec.strandsAmplitude} min={0} max={4} step={0.05} onChange={(v) => set("strandsAmplitude", v)} />
          <Range label="Waviness" value={spec.strandsWaviness} min={0.1} max={4} step={0.05} onChange={(v) => set("strandsWaviness", v)} />
          <Range label="Thickness" value={spec.strandsThickness} min={0.1} max={3} step={0.05} onChange={(v) => set("strandsThickness", v)} />
          <Range label="Glow" value={spec.strandsGlow} min={0.2} max={8} step={0.1} onChange={(v) => set("strandsGlow", v)} />
          <Range label="Edge taper" value={spec.strandsTaper} min={0} max={10} step={0.1} onChange={(v) => set("strandsTaper", v)} />
          <Range label="Spread" value={spec.strandsSpread} min={0} max={4} step={0.05} onChange={(v) => set("strandsSpread", v)} />
          <Range label="Intensity" value={spec.strandsIntensity} min={0} max={1} step={0.01} onChange={(v) => set("strandsIntensity", v)} />
          <Range label="Saturation" value={spec.strandsSaturation} min={0} max={3} step={0.05} onChange={(v) => set("strandsSaturation", v)} />
          {spec.effectRainbow && <Range label="Hue shift" value={spec.strandsHueShift} min={0} max={1} step={0.01} onChange={(v) => set("strandsHueShift", v)} />}
          <Range label="Size" value={spec.strandsScale} min={0.3} max={4} step={0.05} onChange={(v) => set("strandsScale", v)} />
          <Range label="Position X %" value={spec.strandsX} min={-50} max={50} onChange={(v) => set("strandsX", v)} />
          <Range label="Position Y %" value={spec.strandsY} min={-50} max={50} onChange={(v) => set("strandsY", v)} />
          <Range label="Rotation °" value={spec.strandsRotation} min={-180} max={180} onChange={(v) => set("strandsRotation", v)} />
        </>}
        {spec.effect === "ghost" && <>
          <Range label="Trail length" value={spec.ghostTrail} min={1} max={150} onChange={(v) => set("ghostTrail", v)} />
          <Range label="Drift (inertia)" value={spec.ghostInertia} min={0} max={0.98} step={0.01} onChange={(v) => set("ghostInertia", v)} />
          <Range label="Fade after (s)" value={spec.ghostFadeDelay} min={0} max={10} step={0.1} onChange={(v) => set("ghostFadeDelay", v)} />
          <Range label="Fade length (s)" value={spec.ghostFadeDuration} min={0.1} max={10} step={0.1} onChange={(v) => set("ghostFadeDuration", v)} />
          <Range label="Brightness" value={spec.ghostBrightness} min={0} max={4} step={0.05} onChange={(v) => set("ghostBrightness", v)} />
          <Range label="Bloom" value={spec.ghostBloom} min={0} max={3} step={0.05} onChange={(v) => set("ghostBloom", v)} />
          <Range label="Bloom radius" value={spec.ghostBloomRadius} min={0} max={1} step={0.05} onChange={(v) => set("ghostBloomRadius", v)} />
          <Range label="Grain" value={spec.ghostGrain} min={0} max={0.5} step={0.01} onChange={(v) => set("ghostGrain", v)} />
          <p className="text-xs text-neutral-500">Changing the trail length restarts the effect.</p>
        </>}
        {spec.effect === "rain" && <>
          <Range label="Fall speed" value={spec.rainSpeed} min={0.1} max={4} step={0.1} onChange={(v) => set("rainSpeed", v)} />
          <Range label="Trail length" value={spec.rainTrail} min={3} max={60} onChange={(v) => set("rainTrail", v)} />
          <Range label="Glyph size" value={spec.rainSize} min={10} max={96} onChange={(v) => set("rainSize", v)} />
          <Toggle label="Depth (a dimmer layer behind)" value={spec.rainDepth} onChange={(v) => set("rainDepth", v)} />
        </>}
        <button className="text-xs text-neutral-500 underline" onClick={() => reset(keys)}>Reset these</button>
      </div>
    </details>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{title}</h2>
      {children}
    </section>
  );
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: [T, string][];
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex overflow-hidden rounded border border-neutral-700">
      {options.map(([v, label]) => (
        <button
          key={v}
          className={`flex-1 px-2 py-1 ${v === value ? "bg-neutral-200 text-neutral-900" : "hover:bg-neutral-800"}`}
          onClick={() => onChange(v)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function Range({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex items-center gap-3">
      <span className="w-32 shrink-0 text-neutral-400">{label}</span>
      <input type="range" className="flex-1" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      <span className="w-10 text-right tabular-nums text-neutral-400">{value}</span>
    </label>
  );
}

function Color({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="flex items-center gap-3">
      <span className="w-32 shrink-0 text-neutral-400">{label}</span>
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-7 w-10 cursor-pointer bg-transparent" />
      <span className="font-mono text-xs text-neutral-500">{value}</span>
    </label>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

function FontPicker({ label, value, onChange }: { label: string; value: FontId; onChange: (value: FontId) => void }) {
  return (
    <label className="flex items-center gap-3">
      <span className="w-32 shrink-0 text-neutral-400">{label}</span>
      <select
        className="field flex-1"
        value={value}
        onChange={(e) => onChange(e.target.value as FontId)}
        style={{ fontFamily: FONT_FAMILIES[value] }}
      >
        {(Object.keys(FONTS) as FontId[]).map((id) => (
          <option key={id} value={id}>
            {FONTS[id].label}
          </option>
        ))}
      </select>
    </label>
  );
}
