import "./graphics.css";

export const metadata = { title: "Graphics" };

export default function GraphicsLayout({ children }: { children: React.ReactNode }) {
  return <div className="graphics-root">{children}</div>;
}
