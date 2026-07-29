import type { Metadata } from "next";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Kings Movers | Moving & Junk Removal in Charlotte, NC",
    template: "%s | Kings Movers",
  },
  description:
    "Reliable local and long-distance moving, loading, unloading, and junk removal services in Charlotte, NC and surrounding communities.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  openGraph: {
    title: "Kings Movers and Junk Removal Services",
    description:
      "Careful moving and dependable junk removal in Charlotte, NC.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
