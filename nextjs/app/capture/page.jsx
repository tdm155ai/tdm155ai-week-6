import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components/Chrome.jsx";
import CaptureCamera from "./CaptureCamera.jsx";
import "./capture.css";

export const metadata = { title: "Capture reference stills" };

export default function CapturePage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="camera-main">
        <p className="eyebrow">Video station · Reference images</p>
        <h1>Capture reference stills</h1>
        <p className="camera-lede">Photograph poses, props, and the studio camera's view. Use a webcam or the Web Presenter's USB webcam output.</p>
        <p className="camera-links"><Link href="/activities/rotation-3-ai-video">← Rotation 3</Link><Link href="/skills/video-prompting-challenge">Video skills challenge</Link><Link href="/live">Open gallery →</Link></p>
        <CaptureCamera />
        <p className="camera-note">Stills save to <code>_media/webcam/</code> on the computer running this app and appear in the gallery. Open this page at localhost or HTTPS for camera access.</p>
      </main>
      <SiteFooter />
    </>
  );
}
