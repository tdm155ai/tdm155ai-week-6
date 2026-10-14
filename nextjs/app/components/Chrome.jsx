import Link from "next/link";
import { site } from "../../lib/content.mjs";

// `current` marks the page you're on: "activities", "concepts", "skills", "explorations", or nothing.
export function SiteHeader({ current = "" }) {
  return (
    <header className="site-header">
      <Link className="wordmark" href="/">
        {site.title} <span>{site.label}</span>
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/activities" aria-current={current === "activities" ? "page" : undefined}>Activities</Link>
        <Link href="/concepts" aria-current={current === "concepts" ? "page" : undefined}>Concepts</Link>
        <Link href="/skills" aria-current={current === "skills" ? "page" : undefined}>Skills</Link>
        <Link href="/explorations" aria-current={current === "explorations" ? "page" : undefined}>Explorations</Link>
        <Link href="/tools" aria-current={current === "tools" ? "page" : undefined}>Tools</Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link href="/">{site.title}</Link>
      <span>{site.term}</span>
    </footer>
  );
}
