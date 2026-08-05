import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { ContourProvider } from "@/components/contour-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Contour",
  description: "Contour UI kit",
};

export const viewport: Viewport = {
  viewportFit: "cover",
};

// Applies every persisted ContourProvider preference (theme, tint, and the
// three accessibility toggles) before hydration so styles/tokens.css's
// overrides apply immediately -- avoids a flash of the wrong appearance.
// Keep this in sync with ContourProvider's own effects, which re-apply the
// same values post-hydration.
const themeInitScript = `
(function () {
  var html = document.documentElement;
  var theme = localStorage.getItem("contour-theme");
  var dark = theme === "dark" || (theme !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  html.classList.toggle("dark", dark);

  var validTints = ["red","orange","yellow","green","mint","teal","cyan","blue","indigo","purple","pink","brown"];
  var tint = localStorage.getItem("contour-tint");
  if (tint && validTints.indexOf(tint) !== -1) {
    html.style.setProperty("--tint", "var(--color-" + tint + ")");
  }

  if (localStorage.getItem("contour-reduce-transparency") === "1") html.classList.add("reduce-transparency");
  if (localStorage.getItem("contour-reduce-motion") === "1") html.classList.add("reduce-motion");
  if (localStorage.getItem("contour-high-contrast") === "1") html.classList.add("high-contrast");
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning is required here -- themeInitScript below
    // mutates this element's class/style before React hydrates (dark mode,
    // tint, and the three accessibility overrides), which would otherwise
    // be flagged as a mismatch against the server-rendered markup on every
    // load where any of those differ from the defaults.
    <html lang="en" className={`${inter.variable} antialiased`} suppressHydrationWarning>
      <body>
        <Script
          id="contour-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <ContourProvider>{children}</ContourProvider>
      </body>
    </html>
  );
}
