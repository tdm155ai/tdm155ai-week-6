import localFont from "next/font/local";
import type { FontId } from "./graphic-spec";

// next/font/local needs literal paths, so each face is declared by hand. Ids
// and files must match FONTS in graphic-spec.ts: the server render reads the
// same files, which keeps the preview and the exported PNG in one typeface.
const interBold = localFont({ src: "./fonts/Inter-Bold.ttf", weight: "700", style: "normal", display: "swap" });
const inter = localFont({ src: "./fonts/Inter-Regular.ttf", weight: "400", style: "normal", display: "swap" });
const newsreaderItalic = localFont({ src: "./fonts/Newsreader-Italic.ttf", weight: "400", style: "italic", display: "swap" });
const newsreaderSemibold = localFont({ src: "./fonts/Newsreader-SemiBold.ttf", weight: "600", style: "normal", display: "swap" });
const playfairBold = localFont({ src: "./fonts/PlayfairDisplay-Bold.ttf", weight: "700", style: "normal", display: "swap" });
const anton = localFont({ src: "./fonts/Anton-Regular.ttf", weight: "400", style: "normal", display: "swap" });
const bebasNeue = localFont({ src: "./fonts/BebasNeue-Regular.ttf", weight: "400", style: "normal", display: "swap" });
const oswaldMedium = localFont({ src: "./fonts/Oswald-Medium.ttf", weight: "500", style: "normal", display: "swap" });
const spaceMonoBold = localFont({ src: "./fonts/SpaceMono-Bold.ttf", weight: "700", style: "normal", display: "swap" });
const caveatBold = localFont({ src: "./fonts/Caveat-Bold.ttf", weight: "700", style: "normal", display: "swap" });

export const FONT_FAMILIES: Record<FontId, string> = {
  "inter-bold": interBold.style.fontFamily,
  inter: inter.style.fontFamily,
  "newsreader-italic": newsreaderItalic.style.fontFamily,
  "newsreader-semibold": newsreaderSemibold.style.fontFamily,
  "playfair-bold": playfairBold.style.fontFamily,
  anton: anton.style.fontFamily,
  "bebas-neue": bebasNeue.style.fontFamily,
  "oswald-medium": oswaldMedium.style.fontFamily,
  "space-mono-bold": spaceMonoBold.style.fontFamily,
  "caveat-bold": caveatBold.style.fontFamily,
};
