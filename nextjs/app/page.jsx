import Link from "next/link";
import { getRoot, site } from "../lib/content.mjs";
import { SiteFooter, SiteHeader } from "./components/Chrome.jsx";
import Markdown from "./components/Markdown.jsx";
import NotebookWink from "./components/NotebookWink.jsx";

export const dynamic = "force-dynamic";

// The tools that sit beside the docs.
const tools = [
  { href: "/dictate", title: "Dictate", copy: "Press record and talk. Your words become a Markdown note in Notebook." },
  { href: "/transcribe", title: "Transcribe", copy: "Photograph your notes or upload images. Save a faithful transcription to Notebook." },
  { href: "/graphics", title: "Graphics", copy: "Lower thirds, titles, and corner bugs, exported as PNGs or shown in a display window." },
  { href: "/graphics/record", title: "Record with graphics", copy: "Your webcam with a lower third or title on top, recorded with your microphone." },
  { href: "/print", title: "Print", copy: "Any page or folder on light paper: put /print in front of its address." },
];

function ContextMap({ folders }) {
  return (
    <ul className="context-map">
      {folders.map((folder) => (
        <li key={folder.slug}>
          <Link href={folder.href} className="context-row">
            <code>{folder.source}</code>
            <strong>{folder.title}</strong>
            <span className="context-count">{folder.count} doc{folder.count === 1 ? "" : "s"}</span>
            {folder.description && <span className="context-note">{folder.description}</span>}
          </Link>
          {folder.folders.length > 0 && <ContextMap folders={folder.folders} />}
        </li>
      ))}
    </ul>
  );
}

export default async function Home() {
  const root = await getRoot();
  // Folders whose README has `step:` in its frontmatter become numbered steps; everything else is in the map.
  const steps = root.folders.filter((folder) => folder.step).sort((a, b) => a.step - b.step);
  const docs = root.docs;

  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="hero hero-compact" aria-labelledby="site-title">
          <p className="eyebrow">{site.label} · {site.term}</p>
          <h1 id="site-title">{root.title === "Home" ? site.title : root.title}</h1>
          {root.description && <p className="hero-deck">{root.description}</p>}
          {root.content.trim() && <article className="prose hero-intro"><Markdown doc={root} /></article>}
          <NotebookWink />
        </section>

        {steps.length > 0 && (
          <section className="steps" aria-label="Steps">
            {steps.map((step) => (
              <article className="step" key={step.slug}>
                <Link href={step.href} className="step-main">
                  <span className="step-number">{String(step.step).padStart(2, "0")}</span>
                  <span className="step-title">{step.title} <span aria-hidden="true">→</span></span>
                  {step.subtitle && <span className="step-subtitle">{step.subtitle}</span>}
                  <span className="step-copy">{step.description}</span>
                </Link>
                {step.tool && (
                  <Link href={step.tool} className="step-tool">
                    <span className="eyebrow">Open the tool</span>
                    <strong>{step.toolTitle} →</strong>
                  </Link>
                )}
              </article>
            ))}
          </section>
        )}

        <section className="tools" aria-label="Tools">
          {tools.map((tool) => (
            <Link href={tool.href} className="tool-card" key={tool.href}>
              <span className="eyebrow">{tool.href}</span>
              <strong>{tool.title} <span aria-hidden="true">→</span></strong>
              <span>{tool.copy}</span>
            </Link>
          ))}
        </section>

        <section className="home-section" id="docs" aria-labelledby="docs-title">
          <header className="section-heading">
            <p className="eyebrow">The map</p>
            <h2 id="docs-title">What's here</h2>
            <p>Everything here is Markdown in <code>nextjs/content/</code>, from the home page down: <Link href="/readings"><code>readings/</code></Link> is the week's reading, shown as a docs site, and <Link href="/notebook"><code>notebook/</code></Link> is where dictated and photographed notes land. Every folder and document has a page; new files show up on refresh, and images beside a document show in it.</p>
          </header>
          <div className="ai-body">
            {root.folders.length > 0 && <ContextMap folders={root.folders} />}
            {docs.length > 0 && (
              <ul className="context-map context-docs">
                {docs.map((doc) => (
                  <li key={doc.slug}>
                    <Link href={doc.href} className="context-row">
                      <code>{doc.source}</code>
                      <strong>{doc.title}</strong>
                      <span className="context-count">{doc.eyebrow}</span>
                      {doc.description && <span className="context-note">{doc.description}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {root.count === 0 && <p className="empty-state">Nothing here yet. Add a Markdown file to <code>nextjs/content/</code>.</p>}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
