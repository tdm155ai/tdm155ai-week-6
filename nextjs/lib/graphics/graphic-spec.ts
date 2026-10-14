// The graphic model, shared by the browser preview and the server renderer.
// Every length is in pixels on a 1920x1080 frame; a render at 4K multiplies
// them by 2, and the preview scales the whole frame down with a transform.

export type FontMeta = {
  label: string;
  /** File under lib/graphics/fonts — must also be declared in fonts.ts. */
  file: string;
  weight: 400 | 500 | 600 | 700;
  style: "normal" | "italic";
};

export const FONTS = {
  "inter-bold": { label: "Inter Bold", file: "Inter-Bold.ttf", weight: 700, style: "normal" },
  inter: { label: "Inter", file: "Inter-Regular.ttf", weight: 400, style: "normal" },
  "newsreader-italic": { label: "Newsreader Italic", file: "Newsreader-Italic.ttf", weight: 400, style: "italic" },
  "newsreader-semibold": { label: "Newsreader Semibold", file: "Newsreader-SemiBold.ttf", weight: 600, style: "normal" },
  "playfair-bold": { label: "Playfair Display Bold", file: "PlayfairDisplay-Bold.ttf", weight: 700, style: "normal" },
  anton: { label: "Anton", file: "Anton-Regular.ttf", weight: 400, style: "normal" },
  "bebas-neue": { label: "Bebas Neue", file: "BebasNeue-Regular.ttf", weight: 400, style: "normal" },
  "oswald-medium": { label: "Oswald Medium", file: "Oswald-Medium.ttf", weight: 500, style: "normal" },
  "space-mono-bold": { label: "Space Mono Bold", file: "SpaceMono-Bold.ttf", weight: 700, style: "normal" },
  "caveat-bold": { label: "Caveat Bold", file: "Caveat-Bold.ttf", weight: 700, style: "normal" },
} as const satisfies Record<string, FontMeta>;

export type FontId = keyof typeof FONTS;

export const FRAME = { width: 1920, height: 1080 };

export type Template = "lower-third" | "title" | "bug";
export type Align = "left" | "center" | "right";
export type Plate = "none" | "solid" | "gradient";
export type Background = "transparent" | "solid" | "green" | "black" | "blue" | "image";

export type LiveEffect = "none" | "splash" | "strands" | "ghost" | "rain";
export type RainGlyphs = "matrix" | "binary" | "hex" | "greek" | "ipa" | "text";
export const RAIN_GLYPHS: [RainGlyphs, string][] = [["matrix", "Katakana"], ["binary", "Binary"], ["hex", "Hex"], ["greek", "Greek"], ["ipa", "IPA"], ["text", "This graphic’s text"]];

export type Spec = {
  effect: LiveEffect;
  effectColor: string;
  effectRainbow: boolean;

  // Live shader extras. Splash and ghost are cursor-driven; strands run on their own.
  /** How fast the dye fades. */
  splashDecay: number;
  /** How fast the motion settles. */
  splashVelocityDecay: number;
  splashCurl: number;
  splashRadius: number;
  /** Push from the cursor, in thousands. */
  splashForce: number;
  splashPressure: number;
  /** How often rainbow colors change. */
  splashColorSpeed: number;
  splashShading: boolean;

  strandsCount: number;
  strandsSpeed: number;
  strandsAmplitude: number;
  strandsWaviness: number;
  strandsThickness: number;
  strandsGlow: number;
  strandsTaper: number;
  strandsSpread: number;
  strandsIntensity: number;
  strandsSaturation: number;
  strandsScale: number;
  strandsHueShift: number;
  /** Center of the strands, % of the frame from its center. */
  strandsX: number;
  strandsY: number;
  /** Degrees, counterclockwise. */
  strandsRotation: number;

  /** Number of trail samples; changing it restarts the effect. */
  ghostTrail: number;
  /** How long the smoke drifts after the cursor stops, 0–0.99. */
  ghostInertia: number;
  /** Seconds before the smoke fades once the cursor stops. */
  ghostFadeDelay: number;
  ghostFadeDuration: number;
  ghostBrightness: number;
  ghostBloom: number;
  ghostBloomRadius: number;
  ghostGrain: number;

  /** Glyph rain: which characters fall, how fast (1 = normal), trail length in cells, glyph size in px on a
   *  1920-wide frame, and whether a dimmer layer falls behind. */
  rainGlyphs: RainGlyphs;
  rainSpeed: number;
  rainTrail: number;
  rainSize: number;
  rainDepth: boolean;
  template: Template;
  primary: string;
  secondary: string;
  primaryFont: FontId;
  secondaryFont: FontId;
  primarySize: number;
  secondarySize: number;
  primaryColor: string;
  secondaryColor: string;
  uppercase: boolean;
  /** Letter spacing in em. */
  tracking: number;
  align: Align;
  /** Distance from the frame edge, px. */
  marginX: number;
  marginY: number;

  plate: Plate;
  plateColor: string;
  plateOpacity: number;
  platePadding: number;
  plateRadius: number;
  accent: boolean;
  accentColor: string;
  accentWidth: number;

  shadow: boolean;
  shadowColor: string;
  shadowOpacity: number;
  shadowBlur: number;
  shadowDistance: number;

  glow: boolean;
  glowColor: string;
  glowSize: number;
  /** How many stacked shadows make the glow, 1–4. */
  glowStrength: number;

  outline: boolean;
  outlineColor: string;
  outlineWidth: number;

  background: Background;
  backgroundColor: string;
};

export const DEFAULT_SPEC: Spec = {
  effect: "none",
  effectColor: "#60a5fa",
  effectRainbow: true,

  splashDecay: 3.5,
  splashVelocityDecay: 2,
  splashCurl: 3,
  splashRadius: 0.2,
  splashForce: 6,
  splashPressure: 0.1,
  splashColorSpeed: 10,
  splashShading: true,

  strandsCount: 6,
  strandsSpeed: 0.5,
  strandsAmplitude: 1,
  strandsWaviness: 1,
  strandsThickness: 0.7,
  strandsGlow: 2.6,
  strandsTaper: 3,
  strandsSpread: 1,
  strandsIntensity: 0.6,
  strandsSaturation: 1.5,
  strandsScale: 1.5,
  strandsHueShift: 0,
  strandsX: 0,
  strandsY: 0,
  strandsRotation: 0,

  ghostTrail: 50,
  ghostInertia: 0.5,
  ghostFadeDelay: 1,
  ghostFadeDuration: 1.5,
  ghostBrightness: 1,
  ghostBloom: 0.1,
  ghostBloomRadius: 1,
  ghostGrain: 0.05,

  rainGlyphs: "matrix",
  rainSpeed: 1,
  rainTrail: 18,
  rainSize: 26,
  rainDepth: true,
  template: "lower-third",
  primary: "Blue Sky",
  secondary: "Learning Lab, Bok Center",
  primaryFont: "inter-bold",
  secondaryFont: "inter",
  primarySize: 64,
  secondarySize: 36,
  primaryColor: "#ffffff",
  secondaryColor: "#d6e4ff",
  uppercase: false,
  tracking: 0,
  align: "left",
  marginX: 150,
  marginY: 110,

  plate: "solid",
  plateColor: "#0b1f4d",
  plateOpacity: 85,
  platePadding: 28,
  plateRadius: 0,
  accent: true,
  accentColor: "#3b82f6",
  accentWidth: 10,

  shadow: true,
  shadowColor: "#000000",
  shadowOpacity: 60,
  shadowBlur: 12,
  shadowDistance: 4,

  glow: false,
  glowColor: "#60a5fa",
  glowSize: 18,
  glowStrength: 2,

  outline: false,
  outlineColor: "#000000",
  outlineWidth: 2,

  background: "transparent",
  backgroundColor: "#1e293b",
};

export const PRESETS: { name: string; spec: Partial<Spec> }[] = [
  { name: "Blue bar", spec: {} },
  {
    name: "Clean shadow",
    spec: { plate: "none", accent: false, shadow: true, shadowOpacity: 75, shadowBlur: 16, glow: false, secondaryColor: "#ffffff" },
  },
  {
    name: "Neon glow",
    spec: {
      plate: "none", accent: false, shadow: false, glow: true, glowColor: "#22d3ee", glowSize: 22, glowStrength: 3,
      primaryFont: "bebas-neue", secondaryFont: "space-mono-bold", primarySize: 96, secondarySize: 28,
      uppercase: true, tracking: 0.04, primaryColor: "#ecfeff", secondaryColor: "#a5f3fc",
    },
  },
  {
    name: "News strap",
    spec: {
      plate: "solid", plateColor: "#ffffff", plateOpacity: 100, accent: true, accentColor: "#dc2626", accentWidth: 14,
      primaryFont: "oswald-medium", secondaryFont: "inter", primaryColor: "#111111", secondaryColor: "#444444",
      uppercase: true, shadow: false, glow: false,
    },
  },
  {
    name: "Editorial title",
    spec: {
      template: "title", plate: "none", accent: false, align: "center",
      primaryFont: "playfair-bold", secondaryFont: "newsreader-italic", primarySize: 120, secondarySize: 44,
      primaryColor: "#ffffff", secondaryColor: "#e5e7eb", shadow: true, shadowBlur: 24, shadowOpacity: 70, glow: false,
    },
  },
  {
    name: "Corner bug",
    spec: {
      template: "bug", align: "right", primary: "LIVE", secondary: "", plate: "solid", plateColor: "#dc2626",
      plateOpacity: 100, plateRadius: 8, platePadding: 14, accent: false, primaryFont: "inter-bold", primarySize: 36,
      uppercase: true, tracking: 0.08, shadow: false, glow: false, marginX: 96, marginY: 64,
    },
  },
];

const HEX = /^#[0-9a-f]{6}$/i;

export function hexToRgba(hex: string, alpha: number) {
  const value = HEX.test(hex) ? hex : "#000000";
  const r = parseInt(value.slice(1, 3), 16);
  const g = parseInt(value.slice(3, 5), 16);
  const b = parseInt(value.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${Math.round(alpha * 100) / 100})`;
}

/** Coerce anything (a request body, stale localStorage) into a valid spec. */
export function normalizeSpec(input: unknown): Spec {
  const raw = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  const out = { ...DEFAULT_SPEC } as Record<string, unknown>;
  for (const [key, fallback] of Object.entries(DEFAULT_SPEC)) {
    const value = raw[key];
    if (typeof fallback === "number") {
      const n = Number(value);
      if (value !== undefined && Number.isFinite(n)) out[key] = Math.max(-1000, Math.min(1000, n));
    } else if (typeof fallback === "boolean") {
      if (typeof value === "boolean") out[key] = value;
    } else if (typeof value === "string") {
      if (fallback.startsWith("#")) {
        if (HEX.test(value)) out[key] = value.toLowerCase();
      } else {
        out[key] = value.slice(0, 400);
      }
    }
  }
  const spec = out as Spec;
  if (!(spec.primaryFont in FONTS)) spec.primaryFont = DEFAULT_SPEC.primaryFont;
  if (!(spec.secondaryFont in FONTS)) spec.secondaryFont = DEFAULT_SPEC.secondaryFont;
  if (!["lower-third", "title", "bug"].includes(spec.template)) spec.template = DEFAULT_SPEC.template;
  if (!["left", "center", "right"].includes(spec.align)) spec.align = DEFAULT_SPEC.align;
  if (!["none", "solid", "gradient"].includes(spec.plate)) spec.plate = DEFAULT_SPEC.plate;
  if (!["transparent", "solid", "green", "black", "blue", "image"].includes(spec.background)) spec.background = DEFAULT_SPEC.background;
  if (spec.background === "blue") spec.background = "black";
  if (!["none", "splash", "strands", "ghost", "rain"].includes(spec.effect)) spec.effect = "none";
  if (!RAIN_GLYPHS.some(([id]) => id === spec.rainGlyphs)) spec.rainGlyphs = DEFAULT_SPEC.rainGlyphs;
  spec.rainSpeed = Math.max(0.1, Math.min(4, spec.rainSpeed));
  spec.rainTrail = Math.max(3, Math.min(60, Math.round(spec.rainTrail)));
  spec.rainSize = Math.max(10, Math.min(96, spec.rainSize));
  return spec;
}

/** Drop shadow and glow combined into one text-shadow list, scaled by k. */
export function textShadow(spec: Spec, k: number): string | undefined {
  const parts: string[] = [];
  if (spec.shadow) {
    const d = spec.shadowDistance * k;
    parts.push(`${d}px ${d}px ${spec.shadowBlur * k}px ${hexToRgba(spec.shadowColor, spec.shadowOpacity / 100)}`);
  }
  if (spec.glow) {
    const n = Math.max(1, Math.min(4, Math.round(spec.glowStrength)));
    for (let i = 1; i <= n; i++) {
      parts.push(`0px 0px ${spec.glowSize * k * i}px ${spec.glowColor}`);
    }
  }
  return parts.length ? parts.join(", ") : undefined;
}

export function backgroundFill(spec: Spec): string | undefined {
  switch (spec.background) {
    case "solid":
      return spec.backgroundColor;
    case "green":
      return "#00b140";
    case "black":
      return "#000000";
    case "blue":
      return "#0047bb";
    default:
      return undefined;
  }
}
