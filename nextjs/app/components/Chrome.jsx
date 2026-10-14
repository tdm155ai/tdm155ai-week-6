import Link from "next/link";
import { site } from "../../lib/content.mjs";

// `current` marks the page you're on: "readings", "concepts", "dictate", "transcribe", or nothing.
export function SiteHeader({ current = "" }) {
  return (
    <header className="site-header">
      <Link className="wordmark" href="/">
        {site.title} <span>{site.label}</span>
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/readings" aria-current={current === "readings" ? "page" : undefined}>Readings</Link>
        <Link href="/concepts" aria-current={current === "concepts" ? "page" : undefined}>Concepts</Link>
        <Link href="/notebook">Notebook</Link>
        <Link href="/dictate" aria-current={current === "dictate" ? "page" : undefined}>Dictate</Link>
        <Link href="/transcribe" aria-current={current === "transcribe" ? "page" : undefined}>Transcribe</Link>
        <Link href="/graphics">Graphics</Link>
        <Link href="/print">Print</Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <Link href="/">{site.title}</Link>
      <Link href="/print">Printables</Link>
      <span>{site.term}</span>
    </footer>
  );
}
