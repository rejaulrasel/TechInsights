import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { fontSans } from "@/config/fonts";
import { siteConfig } from "@/config/site";
import { Providers } from "@/app/providers";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - Articles for Engineers`,
  },
  description: siteConfig.description,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          " bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex flex-col">
            <main className="container mx-auto max-w-7xl z-[1000]">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
