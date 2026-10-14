import { SiteHeader } from "../components/Chrome.jsx";
import TranscribeClient from "./TranscribeClient.jsx";

export const metadata = { title: "Transcribe photographs" };

export default function TranscribePage() {
  return <>
    <SiteHeader current="transcribe" />
    <main id="main" className="capture-main">
      <header className="capture-heading">
        <p className="eyebrow">Transcribe</p>
        <h1>Photograph your notes</h1>
        <p>Use your camera or upload images. Arrange the pages, then transcribe them into your Notebook. Unclear handwriting stays marked so you can check it against the photographs.</p>
      </header>
      <TranscribeClient />
    </main>
  </>;
}
