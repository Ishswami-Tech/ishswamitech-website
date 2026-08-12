import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StructuredData from "@/components/layout/structured-data";
import { MotionProvider } from "@/components/motion/motion-provider";
import { SpotlightRoot } from "@/components/motion/spotlight-root";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { siteConfig } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.shortName,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "technology",
  alternates: {
    canonical: siteConfig.url,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1024,
        height: 1024,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={inter.variable}>
      <head>
        {/*
          Motion serialises a reveal's `initial` variant into the server HTML,
          so every scroll-revealed section ships as `opacity: 0` and is only
          made visible once the bundle hydrates. If scripting is unavailable
          that never happens and the page renders blank below the header —
          which for a marketing site means no content for the visitor and
          nothing meaningful for a non-executing crawler.

          `scripting: none` covers browsers with JS turned off; the <noscript>
          block covers everything that predates the media feature.
        */}
        <style>{`@media (scripting: none){[data-reveal]{opacity:1!important;transform:none!important}}`}</style>
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="bg-[var(--background)] text-[var(--foreground)] antialiased">
        <StructuredData />
        <MotionProvider>
          {/* Single ambient layer for the whole app. Sections that want
              something louder mount their own <AnimatedBackground> locally. */}
          <AnimatedBackground variant="minimal" position="fixed" intensity="subtle" />
          {/* Single pointer listener behind every `.spotlight` card surface. */}
          <SpotlightRoot />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
