import type { Metadata, Viewport } from "next";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import BottomNav from "@/components/BottomNav";

export const viewport: Viewport = {
  themeColor: "#2D3A8C",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "RentalInvoice — Free Invoice Generator for Rental Businesses",
  description: "Generate professional invoices for villas, hotels, cottages and camping instantly. Free, no login required.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RentalInvoice",
  },
  openGraph: {
    title: "RentalInvoice",
    description: "Free invoice generator for rental businesses",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      </head>
      <body className="antialiased">
        <SessionProvider>
          {children}
          <BottomNav />
        </SessionProvider>
      </body>
    </html>
  );
}