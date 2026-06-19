import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Villa Invoice",
  description: "Invoice generator for villa rentals",
  manifest: "/manifest.webmanifest",
  themeColor: "#6366f1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Villa Invoice",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}