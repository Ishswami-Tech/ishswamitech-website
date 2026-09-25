import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
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

/**
 * Display face, headings only.
 *
 * Inter is the right workhorse for a dense dark UI and stays on body, labels
 * and controls. What the page lacked was any contrast between the two roles —
 * `--font-heading` was aliased straight back to Inter, so a heading and a form
 * label were the same typeface at different weights.
 *
 * Sora is geometric where Inter is neutral, which reads as a deliberate pair
 * rather than a size change, and it holds the tight negative tracking the hero
 * sets at 4rem+. Only the three weights the heading roles actually use are
 * loaded — 600 does nearly all of the work.
 */
const sora = Sora({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-sora",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${inter.variable} ${sora.variable}`}
    >
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
