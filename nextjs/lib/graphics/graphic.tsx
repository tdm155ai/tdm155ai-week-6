import type { CSSProperties } from "react";
import { FONTS, FRAME, backgroundFill, hexToRgba, textShadow, type FontId, type Spec } from "./graphic-spec";

// The graphic as one element tree, rendered twice: in the browser for the
// preview and by next/og (satori) for the exported PNG. Satori wants inline
// styles and an explicit `display: flex` on every element with children, so
// the markup sticks to that subset.

const FLEX = { left: "flex-start", center: "center", right: "flex-end" } as const;

export function Graphic({
  spec,
  scale = 1,
  family,
  backgroundImage,
}: {
  spec: Spec;
  scale?: number;
  /** Maps a font id to the CSS family name on this side (browser or satori). */
  family: (id: FontId) => string;
  backgroundImage?: string | null;
}) {
  const k = scale;
  const width = FRAME.width * k;
  const height = FRAME.height * k;
  const shadow = textShadow(spec, k);

  const line = (id: FontId, size: number, color: string): CSSProperties => ({
    display: "flex",
    fontFamily: family(id),
    fontWeight: FONTS[id].weight,
    fontStyle: FONTS[id].style,
    fontSize: size * k,
    lineHeight: 1.12,
    letterSpacing: spec.tracking * size * k,
    color,
    textAlign: spec.align,
    textTransform: spec.uppercase ? "uppercase" : "none",
    whiteSpace: "pre-wrap",
    ...(shadow ? { textShadow: shadow } : {}),
    ...(spec.outline
      ? { WebkitTextStroke: `${spec.outlineWidth * k}px ${spec.outlineColor}` }
      : {}),
  });

  const strong = hexToRgba(spec.plateColor, spec.plateOpacity / 100);
  const clear = hexToRgba(spec.plateColor, 0);
  const plateBackground =
    spec.plate === "solid"
      ? strong
      : spec.plate === "gradient"
        ? `linear-gradient(to ${spec.align === "right" ? "left" : "right"}, ${strong}, ${strong} 60%, ${clear})`
        : undefined;
  const pad = spec.plate === "none" ? 0 : spec.platePadding * k;

  const text = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: FLEX[spec.align],
        gap: spec.secondary.trim() ? 6 * k : 0,
        padding: `${pad}px ${pad * 1.4}px`,
        borderRadius: spec.plateRadius * k,
        ...(plateBackground ? { background: plateBackground } : {}),
      }}
    >
      {spec.primary.trim() ? (
        <div style={line(spec.primaryFont, spec.primarySize, spec.primaryColor)}>{spec.primary.trim()}</div>
      ) : null}
      {spec.secondary.trim() ? (
        <div style={line(spec.secondaryFont, spec.secondarySize, spec.secondaryColor)}>{spec.secondary.trim()}</div>
      ) : null}
    </div>
  );

  const bar = spec.accent ? (
    <div style={{ display: "flex", width: spec.accentWidth * k, background: spec.accentColor }} />
  ) : null;

  const block = (
    <div
      style={{
        display: "flex",
        flexDirection: spec.align === "right" ? "row-reverse" : "row",
        alignItems: "stretch",
        maxWidth: width - 2 * spec.marginX * k,
      }}
    >
      {spec.align === "center" ? null : bar}
      {text}
    </div>
  );

  const mx = spec.marginX * k;
  const my = spec.marginY * k;
  const placement: CSSProperties =
    spec.template === "title"
      ? { top: 0, bottom: 0, left: mx, right: mx, alignItems: "center", justifyContent: FLEX[spec.align] }
      : spec.template === "bug"
        ? { top: my, left: mx, right: mx, justifyContent: FLEX[spec.align] }
        : { bottom: my, left: mx, right: mx, justifyContent: FLEX[spec.align] };

  const fill = backgroundFill(spec);

  return (
    <div
      style={{
        display: "flex",
        position: "relative",
        width,
        height,
        overflow: "hidden",
        ...(fill ? { background: fill } : {}),
      }}
    >
      {spec.background === "image" && backgroundImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={backgroundImage}
          alt=""
          width={width}
          height={height}
          style={{ position: "absolute", top: 0, left: 0, width, height, objectFit: "cover" }}
        />
      ) : null}
      <div style={{ display: "flex", position: "absolute", ...placement }}>{block}</div>
    </div>
  );
}
