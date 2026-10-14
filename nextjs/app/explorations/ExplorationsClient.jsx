"use client";

import { useState } from "react";
import Link from "next/link";
import ExplorationImage from "../components/ExplorationImage.jsx";

export default function ExplorationsClient({ cards, groups }) {
  const [domain, setDomain] = useState("");
  const domains = [...new Set(cards.map((card) => card.domain).filter(Boolean))].sort();
  const shown = cards.filter((card) => !domain || card.domain === domain);
  return <>
    <div className="exploration-filters" role="group" aria-label="Filter explorations by field">
      {["", ...domains].map((field) => <button key={field || "all"} type="button" aria-pressed={domain === field} onClick={() => setDomain(field)}>{field || "All fields"}</button>)}
    </div>
    <p className="exploration-count" aria-live="polite">{shown.length} of {cards.length} explorations</p>
    {groups.map((group) => {
      const items = shown.filter((card) => card.group === group.key);
      if (!items.length) return null;
      return <section className="exploration-group" key={group.key} aria-labelledby={`group-${group.key}`}>
        <h2 id={`group-${group.key}`}>{group.title}</h2><p>{group.description}</p>
        <div className="exploration-grid">{items.map((card) => <Link className="exploration-card" href={card.href} key={card.slug}>
          <span className="exploration-card-image">{card.image ? <ExplorationImage src={card.image} width={500} alt={card.imageAlt} /> : <span className="exploration-card-placeholder">{card.kind || "Case"}</span>}</span>
          <span className="exploration-card-copy"><span className="eyebrow">{card.domain}{card.panels ? ` · ${card.panels} objects` : ""}</span><strong>{card.title}</strong><span>{[card.maker, card.period].filter(Boolean).join(" · ")}</span></span>
        </Link>)}</div>
      </section>;
    })}
    {!shown.length && <p>No explorations in this field yet.</p>}
  </>;
}
