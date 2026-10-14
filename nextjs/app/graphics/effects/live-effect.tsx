"use client";

import { useEffect, useRef } from "react";
import type { Spec } from "@/lib/graphics/graphic-spec";
import SplashCursor from "./SplashCursor";
import Strands from "./Strands";
import GhostCursor from "./GhostCursor";
import GlyphRain from "./GlyphRain";

const BLACK = { r: 0, g: 0, b: 0 };

export function LiveEffect({ spec, onStream }: { spec: Spec; onStream?: (stream: MediaStream | null) => void }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = host.current;
    if (!element || !onStream) return;
    let stream: MediaStream | null = null;
    let activeCanvas: HTMLCanvasElement | null = null;
    const attach = () => {
      const canvas = element.querySelector("canvas");
      if (!canvas || canvas === activeCanvas) return;
      stream?.getTracks().forEach((track) => track.stop());
      activeCanvas = canvas;
      stream = canvas.captureStream(30);
      onStream(stream);
    };
    const observer = new MutationObserver(attach);
    observer.observe(element, { childList: true, subtree: true });
    attach();
    return () => {
      observer.disconnect();
      stream?.getTracks().forEach((track) => track.stop());
      onStream(null);
    };
  }, [spec.effect, spec.effectColor, spec.effectRainbow, onStream]);

  return (
    <div ref={host} className="absolute inset-0 z-0 bg-black" style={{ position: "absolute" }}>
      {spec.effect === "splash" && (
        <SplashCursor
          BACK_COLOR={BLACK}
          TRANSPARENT={false}
          DYE_RESOLUTION={1024}
          COLOR={spec.effectColor}
          RAINBOW_MODE={spec.effectRainbow}
          DENSITY_DISSIPATION={spec.splashDecay}
          VELOCITY_DISSIPATION={spec.splashVelocityDecay}
          CURL={spec.splashCurl}
          SPLAT_RADIUS={spec.splashRadius}
          SPLAT_FORCE={spec.splashForce * 1000}
          PRESSURE={spec.splashPressure}
          COLOR_UPDATE_SPEED={spec.splashColorSpeed}
          SHADING={spec.splashShading}
        />
      )}
      {spec.effect === "strands" && (
        <Strands
          colors={spec.effectRainbow ? ["#ff4242", "#7c3aed", "#06b6d4", "#eab308"] : [spec.effectColor]}
          count={spec.strandsCount}
          speed={spec.strandsSpeed}
          amplitude={spec.strandsAmplitude}
          waviness={spec.strandsWaviness}
          thickness={spec.strandsThickness}
          glow={spec.strandsGlow}
          taper={spec.strandsTaper}
          spread={spec.strandsSpread}
          intensity={spec.strandsIntensity}
          saturation={spec.strandsSaturation}
          scale={spec.strandsScale}
          hueShift={spec.strandsHueShift}
          offsetX={spec.strandsX / 100}
          offsetY={spec.strandsY / 100}
          rotation={spec.strandsRotation}
        />
      )}
      {spec.effect === "ghost" && (
        <GhostCursor
          color={spec.effectColor}
          mixBlendMode="normal"
          maxDevicePixelRatio={1}
          trailLength={spec.ghostTrail}
          inertia={spec.ghostInertia}
          fadeDelayMs={spec.ghostFadeDelay * 1000}
          fadeDurationMs={spec.ghostFadeDuration * 1000}
          brightness={spec.ghostBrightness}
          bloomStrength={spec.ghostBloom}
          bloomRadius={spec.ghostBloomRadius}
          grainIntensity={spec.ghostGrain}
        />
      )}
      {spec.effect === "rain" && <GlyphRain color={spec.effectColor} rainbow={spec.effectRainbow} glyphs={spec.rainGlyphs} text={`${spec.primary}${spec.secondary}`} speed={spec.rainSpeed} trail={spec.rainTrail} size={spec.rainSize} depth={spec.rainDepth} />}
    </div>
  );
}
