import path from "node:path";
import { fileURLToPath } from "node:url";

const appRoot = path.dirname(fileURLToPath(import.meta.url));

// The app's Markdown is in content/ and recordings land in _media/, both inside nextjs/. It runs locally and reads
// content/ at request time; the tracing include below brings it along if the app is ever deployed.
export default {
  allowedDevOrigins: ["127.0.0.1", "localhost", "*.local"],
  turbopack: { root: appRoot },
  outputFileTracingRoot: appRoot,
  outputFileTracingIncludes: {
    "/*": ["./content/**/*"],
    // The graphics renderer reads its fonts with fs at request time.
    "/api/graphics/render": ["./lib/graphics/fonts/*.ttf"],
  },
};
