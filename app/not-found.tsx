import Link from "next/link";
import { ArrowUpRight, Briefcase, Compass, Home, Mail, Tag } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardIcon } from "@/components/ui/card";

const quickLinks = [
  { href: "/services", label: "Services", icon: Briefcase, desc: "What we build & how" },
  { href: "/pricing", label: "Pricing", icon: Tag, desc: "Plans & ranges" },
  { href: "/about", label: "About", icon: Compass, desc: "Who we are" },
  { href: "/contact", label: "Contact", icon: Mail, desc: "Start a conversation" },
];

/**
 * Lives outside the (site) route group, so it renders its own chrome — Next.js
 * applies only the root layout to unmatched URLs.
 */
export default function NotFound() {
  return (
    <>
      <Navbar />
      <main
        id="main-content"
        className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 py-32"
      >
        <div
          className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[var(--accent)]/15 blur-3xl"
          aria-hidden
        />
        <div
          className="absolute -bottom-40 right-1/4 h-80 w-80 rounded-full bg-[var(--secondary)]/15 blur-3xl"
          aria-hidden
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <p className="type-eyebrow mb-4">Page not found</p>

          <p
            className="font-heading mb-6 text-7xl font-bold gradient-text md:text-9xl"
            aria-hidden
          >
            404
          </p>

          <h1 className="type-section-title mb-3 text-[var(--foreground)]">
            We can&apos;t find that page
          </h1>

          <p className="type-lead mx-auto mb-10 max-w-md">
            The page you&apos;re looking for might have moved, been renamed, or never existed.
            Let&apos;s get you back on track.
          </p>

          <div className="mb-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/">
              <Home className="h-4 w-4" aria-hidden />
              Back to home
            </Button>
            <Button href="/contact" variant="secondary">
              Get in touch
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Button>
          </div>

          <h2 className="type-band-label mb-4">Or explore</h2>
          <ul className="mx-auto grid max-w-2xl grid-cols-2 gap-3 md:grid-cols-4">
            {quickLinks.map((link) => (
              <li key={link.href} className="h-full">
                <Link href={link.href} className="group block h-full">
                  <Card
                    className="flex h-full flex-col items-center gap-2 text-center"
                    interactive
                    padding="sm"
                  >
                    <CardIcon className="h-10 w-10">
                      <link.icon className="h-5 w-5" aria-hidden />
                    </CardIcon>
                    <span className="type-card-title text-sm text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                      {link.label}
                    </span>
                    <span className="type-body text-xs text-[var(--text-secondary)]">{link.desc}</span>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
