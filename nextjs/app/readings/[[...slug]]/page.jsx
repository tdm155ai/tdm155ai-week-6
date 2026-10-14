import Link from "next/link";
import { notFound } from "next/navigation";
import { getEntry } from "../../../lib/content.mjs";
import { SiteFooter, SiteHeader } from "../../components/Chrome.jsx";
import Markdown from "../../components/Markdown.jsx";

// Read the Markdown on each request so edits and new files appear on refresh.
export const dynamic = "force-dynamic";

// content/readings/ as a docs site: every document in the folder, and in the folders inside it, listed in a sidebar
// (folders as headed groups), and the one you pick beside it. /readings shows readings/README.md. No previous/next
// pager: you move between documents with the sidebar.

async function find(params) {
  const { slug = [] } = await params;
  const readings = (await getEntry(["readings"]))?.entry;
  if (!readings) return null;
  if (!slug.length) return { readings, entry: readings };
  const found = await getEntry(["readings", ...slug]);
  return found ? { readings, entry: found.entry } : null;
}

export async function generateMetadata({ params }) {
  const found = await find(params);
  return found ? { title: found.entry.title, description: found.entry.description } : {};
}

function SidebarFolder({ folder, current, top = false }) {
  return (
    <div className={top ? "sidebar-group" : "sidebar-group sidebar-subgroup"}>
      {!top && <Link className="sidebar-heading" href={folder.href} aria-current={current === folder.href ? "page" : undefined}>{folder.title}</Link>}
      {folder.docs.map((doc) => <Link className="sidebar-link" key={doc.href} href={doc.href} aria-current={current === doc.href ? "page" : undefined}>{doc.title}</Link>)}
      {folder.folders.map((child) => <SidebarFolder key={child.href} folder={child} current={current} />)}
    </div>
  );
}

// A folder with no README of its own lists its documents, so the page isn't empty.
function FolderContents({ folder }) {
  const docs = [...folder.docs, ...folder.folders.flatMap((child) => child.docs)];
  if (!docs.length) return <p className="empty-state">Nothing here yet. Add a Markdown file to <code>{folder.source}</code>.</p>;
  return (
    <ul className="readings-index">
      {docs.map((doc) => <li key={doc.href}><Link href={doc.href}>{doc.title}</Link>{doc.description && <span>{doc.description}</span>}</li>)}
    </ul>
  );
}

export default async function ReadingsPage({ params }) {
  const found = await find(params);
  if (!found) notFound();
  const { readings, entry } = found;
  const hasIntro = entry.content.trim().length > 0;

  return (
    <>
      <SiteHeader current="readings" />
      <div className="docs-shell">
        <aside className="docs-sidebar">
          <Link className="eyebrow sidebar-title" href={readings.href} aria-current={entry === readings ? "page" : undefined}>{readings.title}</Link>
          <nav aria-label={`${readings.title} contents`}>
            <SidebarFolder folder={readings} current={entry.href} top />
            {readings.count === 0 && <p className="sidebar-empty">Nothing here yet.</p>}
          </nav>
        </aside>
        <main id="main" className="docs-main">
          <header className="docs-heading">
            <p className="eyebrow">{entry === readings ? "Readings" : entry.eyebrow}</p>
            <h1>{entry.title}</h1>
            {entry.description && <p className="lede">{entry.description}</p>}
            <p className="updated">
              {entry.updated && <>Updated {entry.updated} · </>}
              In the repo: <code>{entry.source}</code> · <Link className="print-link" href={`/print${entry.href}`}>Print {entry.kind === "folder" ? "this folder" : "this page"}</Link>
            </p>
          </header>
          {hasIntro && <article className="prose"><Markdown doc={entry} /></article>}
          {entry.kind === "folder" && !hasIntro && <FolderContents folder={entry} />}
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
