import { getEntries } from "./content.mjs";

const field = (data, name) => typeof data?.[name] === "string" || typeof data?.[name] === "number" ? String(data[name]) : "";
const https = (value) => /^https:\/\//i.test(value) ? value : "";

export const explorationGroups = [
  { key: "sequences", title: "Studies and works", description: "Related sketches, studies, and the works they illuminate." },
  { key: "studies", title: "Sketches and working records", description: "Preparatory drawings, scores, storyboards, models, and production records." },
  { key: "practice", title: "Practice and rehearsal", description: "Ways people train, repeat, and refine a craft, with optional exercises." },
  { key: "texts", title: "In their own words", description: "Makers and teachers on study and practice, in excerpts from public-domain editions." },
];

export function licenseUrl(credit = "") {
  const match = credit.match(/CC\s+(BY(?:-NC)?(?:-SA|-ND)?)\s+(\d\.\d)/i);
  if (match) return `https://creativecommons.org/licenses/${match[1].toLowerCase()}/${match[2]}/`;
  return /\bCC0\b/.test(credit) ? "https://creativecommons.org/publicdomain/zero/1.0/" : "";
}

export function sequenceFor(entry) {
  const list = Array.isArray(entry.data?.sequence) ? entry.data.sequence : [];
  return list.filter((item) => item && typeof item === "object" && item.title).map((item) => ({
    title: field(item, "title"), date: field(item, "date"), role: field(item, "role") || "study",
    medium: field(item, "medium"), collection: field(item, "collection"), note: field(item, "note"),
    image: https(field(item, "image")), imagePage: https(field(item, "image_page")),
    credit: field(item, "credit"), licenseUrl: https(field(item, "license_url")) || licenseUrl(field(item, "credit")),
  }));
}

export function cardFor(entry) {
  const data = entry.data || {};
  const sequence = sequenceFor(entry);
  const cover = [...sequence].reverse().find((item) => item.image && ["final", "copy", "unfinished"].includes(item.role)) || sequence.find((item) => item.image);
  return {
    slug: entry.slug, href: entry.href, title: entry.title, description: entry.description,
    group: entry.slug.split("/")[1], kind: sequence.length ? "sequence" : field(data, "kind"),
    domain: field(data, "domain"), maker: field(data, "maker"), period: field(data, "period"),
    image: https(field(data, "image")) || cover?.image || "",
    imageAlt: field(data, "image_alt") || cover?.title || "",
    imageCredit: field(data, "image_credit") || cover?.credit || "",
    imagePage: https(field(data, "image_page")) || cover?.imagePage || "",
    licenseUrl: https(field(data, "license_url")) || licenseUrl(field(data, "image_credit")) || cover?.licenseUrl || "",
    panels: sequence.length,
  };
}

export async function getExplorationCards() {
  return (await getEntries()).filter((entry) => entry.kind === "doc" && entry.slug.startsWith("explorations/")).map(cardFor);
}

// Preserve source sections, but present proposed classroom exercises separately from the case account.
export function splitOptionalExercises(content) {
  const exercises = [];
  const body = content.replace(/^## Optional exercises\s*\n([\s\S]*?)(?=^## |$(?![\s\S]))/gm, (_, text) => {
    exercises.push(text.trim());
    return "";
  });
  return { body: body.trim(), exercises: exercises.join("\n\n") };
}
