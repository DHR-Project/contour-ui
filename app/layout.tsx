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

// Sets the .dark class before hydration so styles/tokens.css's dark tokens
// apply immediately -- avoids a flash of the wrong color scheme.
const themeInitScript = `
(function () {
  var stored = localStorage.getItem("contour-theme");
  var dark = stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("dark", dark);
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
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
