import "@fontsource-variable/inter";
import "./globals.css";

export const metadata = {
  title: { default: "Studies and Skills · TDM 155AI week 6", template: "%s · TDM 155AI week 6" },
  description: "TDM 155AI week 6: Studies and Skills. Concepts, skills, and explorations.",
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
