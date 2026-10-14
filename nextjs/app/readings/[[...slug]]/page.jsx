import Link from "next/link";
import { notFound } from "next/navigation";
import { getEntry } from "../../../lib/content.mjs";
import { SiteFooter, SiteHeader } from "../../components/Chrome.jsx";
import { DocsArticle, SidebarFolder } from "../../components/DocsSidebar.jsx";

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

export default async function ReadingsPage({ params }) {
  const found = await find(params);
  if (!found) notFound();
  const { readings, entry } = found;

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
          <DocsArticle entry={entry} eyebrow={entry === readings ? "Readings" : entry.eyebrow} />
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
