import "@fontsource-variable/inter";
import "./globals.css";

export const metadata = {
  title: { default: "Sketches and Studies · TDM 155AI week 6", template: "%s · TDM 155AI week 6" },
  description: "TDM 155AI week 6: Sketches and Studies. Readings, a notebook, and tools.",
};

export const viewport = {
  colorScheme: "dark",
  themeColor: "#121412",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
