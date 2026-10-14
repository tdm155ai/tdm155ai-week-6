import Link from "next/link";
import { notFound } from "next/navigation";
import { getEntry } from "../../../lib/content.mjs";
import { explorationGroups, getExplorationCards } from "../../../lib/explorations.mjs";
import { SiteHeader, SiteFooter } from "../../components/Chrome.jsx";
import Markdown from "../../components/Markdown.jsx";
import ExplorationArtifacts from "../../components/ExplorationArtifacts.jsx";
import ExplorationBody from "../../components/ExplorationBody.jsx";
import ExplorationsClient from "../ExplorationsClient.jsx";

export const dynamic = "force-dynamic";

async function find(params) {
  const { slug = [] } = await params;
  return getEntry(["explorations", ...slug]);
}

export async function generateMetadata({ params }) {
  const found = await find(params);
  return found ? { title: found.entry.title, description: found.entry.description } : {};
}

export default async function ExplorationsPage({ params }) {
  const found = await find(params);
  if (!found) notFound();
  const { entry } = found;
  const folder = entry.kind === "folder";
  const cards = folder ? (await getExplorationCards()).filter((card) => entry.slug === "explorations" || card.slug.startsWith(`${entry.slug}/`)) : [];
  return <>
    <SiteHeader current="explorations" />
    <main id="main" className={folder ? "explorations-main" : "exploration-detail"}>
      {entry.slug !== "explorations" && <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/explorations">Explorations</Link><span>/</span><span>{entry.title}</span></nav>}
      <header className="article-heading">
        <p className="eyebrow">Explorations{folder ? ` · ${cards.length} cases` : entry.data.domain ? ` · ${entry.data.domain}` : ""}</p>
        <h1>{entry.title}</h1>{entry.description && <p className="lede">{entry.description}</p>}
        {!folder && <p className="exploration-provenance">From Madeleine's Learning Lab week 6 collection · Written with Claude</p>}
        <p className="updated"><Link className="print-link" href={`/print${entry.href}`}>Print {folder ? "this collection" : "this exploration"}</Link></p>
      </header>
      {folder ? <>
        {entry.content.trim() && <article className="prose"><Markdown doc={entry} /></article>}
        <ExplorationsClient cards={cards} groups={explorationGroups} />
      </> : <>
        <ExplorationArtifacts entry={entry} />
        <ExplorationBody entry={entry} />
        <nav className="exploration-onward" aria-label="Continue exploring"><Link href="/explorations">← All explorations</Link><Link href="/concepts">Key concepts →</Link><Link href="/readings">Readings →</Link></nav>
      </>}
    </main>
    <SiteFooter />
  </>;
}
