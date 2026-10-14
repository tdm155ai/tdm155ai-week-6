import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components/Chrome.jsx";
import "./tools.css";

export const metadata = { title: "Tools" };

// The studio tools for the week: capture reference stills, the live gallery of captures, the video generator that
// runs utils/generate-video.mjs, and the gallery of the clips it made.
const tools = [
  { href: "/capture", title: "Capture", copy: "Photograph poses, props, and the studio camera's view with a webcam or the Web Presenter feed. Stills save to the app's _media/ folder." },
  { href: "/live", title: "Live gallery", copy: "Every still captured so far, newest first, refreshing on its own. Pick from here when you need a reference image." },
  { href: "/tools/video", title: "Video generator", copy: "Make a clip from a prompt, or from a first-frame or reference image you upload or pick from the gallery. It runs the same script as pnpm video and shows you the command." },
  { href: "/tools/videos", title: "Video gallery", copy: "Every clip the generator made, looping, with its prompt, model, and reference. Finished jobs appear here on their own." },
];

export default function ToolsPage() {
  return (
    <>
      <SiteHeader current="tools" />
      <main id="main" className="tools-main">
        <p className="eyebrow">Studies and Skills · Tools</p>
        <h1>Tools</h1>
        <p className="tools-lede">The studio tools for the week, in the order a shot gets made: capture a reference, find it in the gallery, generate the clip, and check it against the others.</p>
        <div className="tools-grid">
          {tools.map((tool) => <Link key={tool.href} href={tool.href}><strong>{tool.title}</strong><span>{tool.copy}</span></Link>)}
        </div>
        <p className="tools-links"><Link href="/activities/rotation-3-ai-video">Rotation 3: AI video and continuity</Link><Link href="/skills/video-prompting-challenge">Video skills challenge</Link></p>
      </main>
      <SiteFooter />
    </>
  );
}
