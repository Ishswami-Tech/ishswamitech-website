import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CookieConsent from "@/components/layout/cookie-consent";
import ScrollToTop from "@/components/layout/scroll-to-top";
import { PageTransition } from "@/components/motion/page-transition";

/**
 * Chrome for the public marketing site. Payment routes live outside this group
 * so they render bare without any runtime pathname checks.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[var(--radius-lg)] focus:bg-[var(--primary)] focus:px-4 focus:py-2 focus:text-[var(--text-on-brand)]"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="relative min-h-screen">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <ScrollToTop />
      <CookieConsent />
    </>
  );
}
