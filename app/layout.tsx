import type { Metadata } from "next";
import "./globals.css";

import { PreferencesProvider } from "@/components/providers/preferences-provider";
import { getPreferencesInitScript } from "@/lib/preferences/storage";

export const metadata: Metadata = {
  title: "Contour",
  description: "An adaptive UI kit for the web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        {/* Sets the theme/motion classes on <html> before first paint - see
            PreferencesProvider for why this needs to run outside React. */}
        <script dangerouslySetInnerHTML={{ __html: getPreferencesInitScript() }} />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <PreferencesProvider>{children}</PreferencesProvider>
      </body>
    </html>
  );
}
