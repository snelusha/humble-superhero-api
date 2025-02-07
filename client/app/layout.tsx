import "@/styles/globals.css";

import { geistMono, geistSans } from "@/styles/fonts";

import { cn } from "@/styles/utils";

import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "humble heroes",
  description: "Made by snelusha",
  authors: [{ name: "snelusha", url: "http://snelusha.dev" }],
};

export const viewport: Viewport = {
  colorScheme: "only light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(geistSans.variable, geistMono.variable)}>
        {children}
      </body>
    </html>
  );
}
