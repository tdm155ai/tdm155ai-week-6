import Link from "next/link";
import { notFound } from "next/navigation";
import { getEntry } from "../../../lib/content.mjs";
import { SiteFooter, SiteHeader } from "../../components/Chrome.jsx";
import { DocsArticle, SidebarFolder } from "../../components/DocsSidebar.jsx";

// Read the Markdown on each request so edits and new files appear on refresh.
export const dynamic = "force-dynamic";

// content/skills/ as a docs site: every document in the folder, and in the folders inside it, listed in a sidebar
// (folders as headed groups), and the one you pick beside it. /skills shows skills/README.md. No previous/next
// pager: you move between documents with the sidebar.

async function find(params) {
  const { slug = [] } = await params;
  const skills = (await getEntry(["skills"]))?.entry;
  if (!skills) return null;
  if (!slug.length) return { skills, entry: skills };
  const found = await getEntry(["skills", ...slug]);
  return found ? { skills, entry: found.entry } : null;
}

export async function generateMetadata({ params }) {
  const found = await find(params);
  return found ? { title: found.entry.title, description: found.entry.description } : {};
}

export default async function SkillsPage({ params }) {
  const found = await find(params);
  if (!found) notFound();
  const { skills, entry } = found;

  return (
    <>
      <SiteHeader current="skills" />
      <div className="docs-shell">
        <aside className="docs-sidebar">
          <Link className="eyebrow sidebar-title" href={skills.href} aria-current={entry === skills ? "page" : undefined}>{skills.title}</Link>
          <nav aria-label={`${skills.title} contents`}>
            <SidebarFolder folder={skills} current={entry.href} top />
            {skills.count === 0 && <p className="sidebar-empty">Nothing here yet.</p>}
          </nav>
        </aside>
        <main id="main" className="docs-main">
          <DocsArticle entry={entry} eyebrow={entry === skills ? "Skills" : entry.eyebrow} />
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
