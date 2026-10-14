// Keep Commons originals in the content; request smaller images for cards and reading.
export function commonsThumb(src, width) {
  const match = typeof src === "string" && src.match(/^(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons)\/([0-9a-f]\/[0-9a-f]{2})\/([^/?#]+)$/);
  if (!match || !width) return src;
  const [, base, hash, name] = match;
  const suffix = /\.(?:tiff?)$/i.test(name) ? ".jpg" : /\.svg$/i.test(name) ? ".png" : "";
  return `${base}/thumb/${hash}/${name}/${width}px-${name}${suffix}`;
}
