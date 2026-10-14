"use client";

import { useEffect, useRef } from "react";
import type { RainGlyphs } from "@/lib/graphics/graphic-spec";

// Glyph rain: a grid of columns, each with falling drops (a bright head and a trail that fades behind it), on black.
// Every cell is tracked (option 2 of the brief in the README): each column keeps its characters, and each drop its
// head, speed, and trail. Glyphs are drawn once into an atlas with the glow baked in and copied with drawImage.
// A second, smaller and dimmer layer sits behind for depth. Near the pointer the drops slow down (bullet time);
// a click starts a burst of drops that fans out from the click. Sizes are relative to a 1920-wide frame, so the
// preview, the display window, and any size in between look the same.

export const GLYPH_SETS: Record<Exclude<RainGlyphs, "text">, string> = {
  matrix: "ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾎﾏﾐﾑﾒﾓﾔﾕﾗﾘﾜ0123456789Z:.=*+-<>¦|",
  binary: "01",
  hex: "0123456789ABCDEF",
  greek: "αβγδεζηθικλμνξοπρστυφχψωΓΔΘΛΞΠΣΦΨΩ",
  ipa: "ɑɐɒæɓʙβɔɕçɗɖðəɚɛɜɞɟʄɡɠɢʛɦɧħɥʜɨɪʝɭɬɫɮʟɱɯɰŋɳɲɴøɵɸθœɶʘɹɺɾɻʀʁɽʂʃʈʧʉʊʋⱱʌɣɤʍχʎʏʑʐʒʔʡʕʢ",
};

const FONT = '"Hiragino Sans", "Yu Gothic", "Noto Sans JP", "Space Mono", ui-monospace, Menlo, monospace';
const FRAME_WIDTH = 1920;
const MAX_WIDTH = 1920; // backing pixels: enough for 1080p capture, cheap enough for the preview
const HUES = 12; // rainbow mode: the spectrum in bands across the frame
const BACK = { scale: 0.6, speed: 0.55, alpha: 0.38 }; // the depth layer

type Props = {
  color: string;
  rainbow: boolean;
  glyphs: RainGlyphs;
  /** The graphic's own text, for the "text" glyph set. */
  text: string;
  speed: number;
  trail: number;
  /** Glyph size in px on a 1920-wide frame. */
  size: number;
  depth: boolean;
};

type Drop = { head: number; speed: number; trail: number; delay: number; top: number; slow: number; burst: boolean };
type Column = { chars: Uint16Array; hue: number; drops: Drop[] };
type Layer = { cell: number; cols: number; rows: number; columns: Column[]; speed: number; alpha: number };

function glyphsFor(props: Props) {
  if (props.glyphs === "text") {
    const unique = [...new Set([...props.text].filter((ch) => ch.trim()))].slice(0, 96).join("");
    return unique || GLYPH_SETS.matrix;
  }
  return GLYPH_SETS[props.glyphs] ?? GLYPH_SETS.matrix;
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);

function newDrop(rows: number, trail: number, spread: number): Drop {
  return { head: -rand(0, rows * spread), speed: rand(8, 18), trail: Math.max(3, Math.round(trail * rand(0.6, 1.4))), delay: 0, top: -Infinity, slow: 1, burst: false };
}

function makeLayer(width: number, height: number, cell: number, glyphCount: number, trail: number, speed: number, alpha: number): Layer {
  const cols = Math.ceil(width / cell);
  const rows = Math.ceil(height / cell) + 1;
  const columns = Array.from({ length: cols }, (_, i) => {
    const chars = new Uint16Array(rows);
    for (let r = 0; r < rows; r++) chars[r] = Math.floor(Math.random() * glyphCount);
    return { chars, hue: Math.min(HUES - 1, Math.floor((i / cols) * HUES)), drops: [newDrop(rows, trail, 1.2)] };
  });
  return { cell, cols, rows, columns, speed, alpha };
}

// One row per hue for trails and one for heads (near-white, with the hue's glow), one cell per glyph. Each cell is
// padded so the glow has room; drawn cells overlap their neighbours, which the additive blend turns into bloom.
function makeAtlas(glyphs: string, cell: number, color: string, rainbow: boolean, mirror: boolean) {
  const pad = Math.ceil(cell * 0.5);
  const box = cell + 2 * pad;
  const hues = rainbow ? HUES : 1;
  const chars = [...glyphs];
  const atlas = document.createElement("canvas");
  atlas.width = chars.length * box;
  atlas.height = hues * 2 * box;
  const ctx = atlas.getContext("2d")!;
  ctx.font = `${Math.round(cell * 0.86)}px ${FONT}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let h = 0; h < hues; h++) {
    const tint = rainbow ? `hsl(${Math.round((h / hues) * 360)} 100% 62%)` : color;
    for (let head = 0; head < 2; head++) {
      ctx.fillStyle = head ? "#f4fff8" : tint;
      ctx.shadowColor = tint;
      ctx.shadowBlur = cell * (head ? 0.7 : 0.35);
      chars.forEach((ch, i) => {
        ctx.save();
        ctx.translate(i * box + box / 2, (h * 2 + head) * box + box / 2);
        if (mirror) ctx.scale(-1, 1);
        ctx.fillText(ch, 0, 0);
        ctx.restore();
      });
    }
  }
  return { atlas, box, pad, count: chars.length };
}

export default function GlyphRain(props: Props) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const live = useRef(props);
  live.current = props; // read every frame, so changing a setting never restarts the loop

  useEffect(() => {
    const el = canvas.current!;
    const wrap = host.current!;
    const ctx = el.getContext("2d", { alpha: false })!;
    const pointer = { x: 0, y: 0, active: false };
    let width = 0;
    let height = 0;
    let atlasKey = "";
    let gridKey = "";
    let art: ReturnType<typeof makeAtlas> | null = null;
    let layers: Layer[] = [];

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(rect.width * dpr));
      const k = Math.min(1, MAX_WIDTH / w);
      width = Math.round(w * k);
      height = Math.max(1, Math.round(rect.height * dpr * k));
      el.width = width;
      el.height = height;
      gridKey = ""; // rebuild the columns at the new size
    };
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    resize();

    const toCanvas = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * width;
      pointer.y = ((event.clientY - rect.top) / rect.height) * height;
    };
    const move = (event: PointerEvent) => { toCanvas(event); pointer.active = true; };
    const leave = () => { pointer.active = false; };
    const burst = (event: PointerEvent) => {
      toCanvas(event);
      const front = layers[layers.length - 1];
      if (!front) return;
      const p = live.current;
      const cc = Math.floor(pointer.x / front.cell);
      const cr = Math.floor(pointer.y / front.cell);
      for (let d = -9; d <= 9; d++) {
        const column = front.columns[cc + d];
        if (!column || column.drops.length > 5) continue;
        column.drops.push({ head: cr, speed: rand(14, 22), trail: Math.round(p.trail * rand(0.8, 1.2)), delay: Math.abs(d) * 0.045, top: cr, slow: 1, burst: true });
      }
    };
    wrap.addEventListener("pointermove", move, { passive: true });
    wrap.addEventListener("pointerenter", move, { passive: true });
    wrap.addEventListener("pointerleave", leave, { passive: true });
    wrap.addEventListener("pointerdown", burst);

    const step = (layer: Layer, dt: number, p: Props, glyphCount: number) => {
      const sigma = 0.1 * width;
      for (let c = 0; c < layer.cols; c++) {
        const column = layer.columns[c];
        const x = (c + 0.5) * layer.cell;
        for (let i = column.drops.length - 1; i >= 0; i--) {
          const drop = column.drops[i];
          if (drop.delay > 0) { drop.delay -= dt; continue; }
          // Bullet time: the closer the pointer is to this drop's head, the slower it falls. Eased, so it glides.
          let target = 1;
          if (pointer.active) {
            const dx = x - pointer.x;
            const dy = drop.head * layer.cell - pointer.y;
            target = 1 - 0.93 * Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma));
          }
          drop.slow += (target - drop.slow) * Math.min(1, dt * 6);
          const before = Math.floor(drop.head);
          drop.head += drop.speed * layer.speed * p.speed * drop.slow * dt;
          for (let r = before + 1; r <= Math.floor(drop.head); r++) {
            if (r >= 0 && r < layer.rows) column.chars[r] = Math.floor(Math.random() * glyphCount);
          }
          if (drop.head - drop.trail > layer.rows) {
            if (drop.burst) column.drops.splice(i, 1);
            else column.drops[i] = newDrop(layer.rows, p.trail, 0.4);
          }
        }
        // Shuffle: a few cells in each column swap their character now and then.
        let swaps = layer.rows * 0.5 * dt;
        while (swaps > 0) {
          if (swaps >= 1 || Math.random() < swaps) column.chars[Math.floor(Math.random() * layer.rows)] = Math.floor(Math.random() * glyphCount);
          swaps -= 1;
        }
      }
    };

    const draw = (layer: Layer, frontCell: number) => {
      if (!art) return;
      const { atlas, box, pad, count } = art;
      const k = layer.cell / frontCell;
      const size = box * k;
      const offset = pad * k;
      for (let c = 0; c < layer.cols; c++) {
        const column = layer.columns[c];
        const x = c * layer.cell - offset;
        const hueRow = (art && atlas.height > box * 2 ? column.hue : 0) * 2;
        for (const drop of column.drops) {
          if (drop.delay > 0) continue;
          const h = Math.floor(drop.head);
          for (let i = 0; i <= drop.trail; i++) {
            const r = h - i;
            if (r < 0 || r < drop.top) break;
            if (r >= layer.rows) continue;
            const fade = 1 - i / drop.trail;
            ctx.globalAlpha = layer.alpha * fade * Math.sqrt(fade);
            const g = column.chars[r] % count;
            ctx.drawImage(atlas, g * box, (hueRow + (i === 0 ? 1 : 0)) * box, box, box, x, r * layer.cell - offset, size, size);
          }
        }
      }
    };

    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05); // the same speed at 60 and 120 Hz; no leaps after a stall
      last = now;
      const p = live.current;
      const glyphs = glyphsFor(p);
      const cell = Math.max(6, Math.round((p.size * width) / FRAME_WIDTH));
      const nextAtlas = `${glyphs}|${cell}|${p.color}|${p.rainbow}`;
      if (nextAtlas !== atlasKey) {
        art = makeAtlas(glyphs, cell, p.color, p.rainbow, p.glyphs === "matrix");
        atlasKey = nextAtlas;
      }
      const nextGrid = `${width}x${height}|${cell}|${p.depth}|${glyphs.length}`;
      if (nextGrid !== gridKey) {
        const count = [...glyphs].length;
        layers = [makeLayer(width, height, cell, count, p.trail, 1, 1)];
        if (p.depth) layers.unshift(makeLayer(width, height, Math.max(4, Math.round(cell * BACK.scale)), count, p.trail, BACK.speed, BACK.alpha));
        gridKey = nextGrid;
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter"; // glow: overlapping glyphs brighten each other
      for (const layer of layers) {
        step(layer, dt, p, art!.count);
        draw(layer, cell);
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      wrap.removeEventListener("pointermove", move);
      wrap.removeEventListener("pointerenter", move);
      wrap.removeEventListener("pointerleave", leave);
      wrap.removeEventListener("pointerdown", burst);
    };
  }, []);

  return (
    <div ref={host} className="absolute inset-0">
      <canvas ref={canvas} className="block h-full w-full" />
    </div>
  );
}
