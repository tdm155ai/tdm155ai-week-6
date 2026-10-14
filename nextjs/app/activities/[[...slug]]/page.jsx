import Link from "next/link";
import { notFound } from "next/navigation";
import { getEntry } from "../../../lib/content.mjs";
import { SiteFooter, SiteHeader } from "../../components/Chrome.jsx";
import { DocsArticle, SidebarFolder } from "../../components/DocsSidebar.jsx";

// Read the Markdown on each request so edits and new files appear on refresh.
export const dynamic = "force-dynamic";

// content/activities/ as a docs site, like /skills: the week's activities (the skills talk and the three lab rotations),
// every document in a sidebar and the one you pick beside it. /activities shows activities/README.md.

async function find(params) {
  const { slug = [] } = await params;
  const activities = (await getEntry(["activities"]))?.entry;
  if (!activities) return null;
  if (!slug.length) return { activities, entry: activities };
  const found = await getEntry(["activities", ...slug]);
  return found ? { activities, entry: found.entry } : null;
}

export async function generateMetadata({ params }) {
  const found = await find(params);
  return found ? { title: found.entry.title, description: found.entry.description } : {};
}

export default async function ActivitiesPage({ params }) {
  const found = await find(params);
  if (!found) notFound();
  const { activities, entry } = found;

  return (
    <>
      <SiteHeader current="activities" />
      <div className="docs-shell">
        <aside className="docs-sidebar">
          <Link className="eyebrow sidebar-title" href={activities.href} aria-current={entry === activities ? "page" : undefined}>{activities.title}</Link>
          <nav aria-label={`${activities.title} contents`}>
            <SidebarFolder folder={activities} current={entry.href} top />
            {activities.count === 0 && <p className="sidebar-empty">Nothing here yet.</p>}
          </nav>
        </aside>
        <main id="main" className="docs-main">
          <DocsArticle entry={entry} eyebrow={entry === activities ? "Activities" : entry.eyebrow} />
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
