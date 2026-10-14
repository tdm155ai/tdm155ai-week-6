import { cardFor, sequenceFor } from "../../lib/explorations.mjs";
import { commonsThumb } from "../../lib/commons.mjs";
import ExplorationImage from "./ExplorationImage.jsx";

const roles = { study: "Study", sketch: "Sketch", model: "Model", final: "Finished work", copy: "Later copy", lost: "Lost work", unfinished: "Unfinished work" };

function Credit({ credit, source, license }) {
  if (!credit && !source && !license) return null;
  return <p className="artifact-credit">{credit}{source && <> · <a href={source} target="_blank" rel="noreferrer">Source</a></>}{license && <> · <a href={license} target="_blank" rel="noreferrer">License</a></>}</p>;
}

function ArtifactImage({ src, alt, print }) {
  if (print) return <img src={commonsThumb(src, 1280)} alt={alt} />;
  return <a className="artifact-image-link" href={src} target="_blank" rel="noreferrer" aria-label={`Open full image: ${alt}`}><ExplorationImage src={src} alt={alt} /></a>;
}

export default function ExplorationArtifacts({ entry, print = false }) {
  const card = cardFor(entry);
  const items = sequenceFor(entry);
  return (
    <section className={`exploration-artifacts${print ? " exploration-artifacts-print" : ""}`} aria-label="Objects and images">
      <dl className="exploration-facts">
        {[["Field", card.domain], ["Maker", card.maker], ["When", card.period]].filter(([, value]) => value).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
      </dl>
      {items.length ? <>
        <p className="artifact-intro">Related objects shown together. The dates and notes describe their relationship; their display order is not always a documented chronology.</p>
        <ol className="artifact-sequence">
          {items.map((item, index) => <li key={`${index}-${item.title}`}>
            <figure className={`artifact-panel artifact-role-${item.role}`}>
              {item.image ? <ArtifactImage src={item.image} alt={item.title} print={print} /> : <div className="artifact-placeholder">{roles[item.role] || item.role}{item.imagePage && <a href={item.imagePage} target="_blank" rel="noreferrer">View at the source ↗</a>}</div>}
              <figcaption>
                <p className="eyebrow">{roles[item.role] || item.role}{item.date && ` · ${item.date}`}</p>
                <h2>{item.title}</h2>
                {item.medium && <p className="artifact-meta">{item.medium}</p>}
                {item.collection && <p className="artifact-meta">{item.collection}</p>}
                {item.note && <p>{item.note}</p>}
                <Credit credit={item.credit} source={item.imagePage} license={item.licenseUrl} />
              </figcaption>
            </figure>
          </li>)}
        </ol>
      </> : card.image && <figure className="artifact-single">
        <ArtifactImage src={card.image} alt={card.imageAlt || card.title} print={print} />
        <figcaption><Credit credit={card.imageCredit} source={card.imagePage} license={card.licenseUrl} /></figcaption>
      </figure>}
    </section>
  );
}
