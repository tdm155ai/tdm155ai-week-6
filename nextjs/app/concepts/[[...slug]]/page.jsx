import Link from "next/link";
import { notFound } from "next/navigation";
import { getEntry } from "../../../lib/content.mjs";
import { SiteFooter, SiteHeader } from "../../components/Chrome.jsx";
import { DocsArticle, SidebarFolder } from "../../components/DocsSidebar.jsx";

// Read the Markdown on each request so edits and new files appear on refresh.
export const dynamic = "force-dynamic";

// content/concepts/ as a docs site in two levels. Each folder in it is a category (music/, visual-art/, …), its
// README.md the category's essay. At /concepts the sidebar lists the categories; inside a category
// (/concepts/music, /concepts/music/etude) it lists only that category's concepts, with a link back to all of them.
// Loose files in content/concepts/ other than the README are listed under the categories.

async function find(params) {
  const { slug = [] } = await params;
  const concepts = (await getEntry(["concepts"]))?.entry;
  if (!concepts) return null;
  if (!slug.length) return { concepts, category: null, entry: concepts };
  const found = await getEntry(["concepts", ...slug]);
  if (!found) return null;
  // The category is the first folder below concepts/: the entry itself, or the top of its trail.
  const categorySlug = `concepts/${decodeURIComponent(slug[0])}`;
  const category = concepts.folders.find((folder) => folder.slug === categorySlug) || null;
  return { concepts, category, entry: found.entry };
}

export async function generateMetadata({ params }) {
  const found = await find(params);
  return found ? { title: found.entry.title, description: found.entry.description } : {};
}

function CategoryList({ concepts, current }) {
  return (
    <div className="sidebar-group">
      {concepts.folders.map((folder) => (
        <Link className="sidebar-link sidebar-category" key={folder.href} href={folder.href} aria-current={current === folder.href ? "page" : undefined}>
          {folder.title}<span className="sidebar-count">{folder.count}</span>
        </Link>
      ))}
      {concepts.docs.length > 0 && (
        <div className="sidebar-subgroup">
          {concepts.docs.map((doc) => <Link className="sidebar-link" key={doc.href} href={doc.href} aria-current={current === doc.href ? "page" : undefined}>{doc.title}</Link>)}
        </div>
      )}
    </div>
  );
}

// The categories as cards on /concepts, below its README.
function CategoryIndex({ concepts }) {
  if (!concepts.folders.length) return <p className="empty-state">No categories yet. Add a folder to <code>{concepts.source}</code>.</p>;
  return (
    <ul className="category-index">
      {concepts.folders.map((folder) => (
        <li key={folder.href}>
          <Link href={folder.href}>
            <strong>{folder.title}</strong>
            <span className="eyebrow">{folder.count} concept{folder.count === 1 ? "" : "s"}</span>
            {folder.description && <span className="category-note">{folder.description}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default async function ConceptsPage({ params }) {
  const found = await find(params);
  if (!found) notFound();
  const { concepts, category, entry } = found;

  return (
    <>
      <SiteHeader current="concepts" />
      <div className="docs-shell">
        <aside className="docs-sidebar">
          {category ? (
            <>
              <Link className="eyebrow sidebar-back" href={concepts.href}>← All categories</Link>
              <Link className="sidebar-title sidebar-category-title" href={category.href} aria-current={entry.href === category.href ? "page" : undefined}>{category.title}</Link>
              <nav aria-label={`${category.title} concepts`}>
                <SidebarFolder folder={category} current={entry.href} top />
                {category.count === 0 && <p className="sidebar-empty">No concepts here yet.</p>}
              </nav>
            </>
          ) : (
            <>
              <Link className="eyebrow sidebar-title" href={concepts.href} aria-current={entry.href === concepts.href ? "page" : undefined}>{concepts.title}</Link>
              <nav aria-label="Concept categories">
                <CategoryList concepts={concepts} current={entry.href} />
                {concepts.folders.length === 0 && concepts.docs.length === 0 && <p className="sidebar-empty">No categories yet.</p>}
              </nav>
            </>
          )}
        </aside>
        <main id="main" className="docs-main">
          <DocsArticle entry={entry} eyebrow={entry.href === concepts.href ? "Key concepts" : entry.href === category?.href ? `Key concepts · ${category.count} concept${category.count === 1 ? "" : "s"}` : category?.title || "Key concepts"}>
            {entry.href === concepts.href ? <CategoryIndex concepts={concepts} /> : undefined}
          </DocsArticle>
        </main>
      </div>
      <SiteFooter />
    </>
  );
}
