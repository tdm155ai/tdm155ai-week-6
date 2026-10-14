"use client";

import { useState } from "react";
import { commonsThumb } from "../../lib/commons.mjs";

export default function ExplorationImage({ src, width = 1280, alt = "", ...props }) {
  const [failed, setFailed] = useState(false);
  return <img src={failed ? src : commonsThumb(src, width)} alt={alt} loading="lazy" onError={() => setFailed(true)} {...props} />;
}
