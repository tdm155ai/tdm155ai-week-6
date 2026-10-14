import { SiteHeader } from "../components/Chrome.jsx";
import DictateClient from "./DictateClient.jsx";

export const dynamic = "force-dynamic";

export const metadata = { title: "Dictate" };

// Dictate a note: the browser records, /api/dictate transcribes and cleans it up, and the note lands in notebook/.
export default function DictatePage() {
  return (
    <>
      <SiteHeader current="dictate" />
      <main id="main" className="capture-main">
        <header className="capture-heading">
          <p className="eyebrow">Dictate</p>
          <h1>Dictate a note</h1>
          <p>Press record (or the space bar), talk, and press it again to stop. Your recording is transcribed, cleaned up, and saved to your <a className="inline-link" href="/notebook">Notebook</a>.</p>
        </header>
        <DictateClient />
      </main>
    </>
  );
}
