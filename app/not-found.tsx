import Link from "next/link";
import { ArrowUpRight, Briefcase, Compass, Home, Mail, Tag } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ScrollToTop from "@/components/layout/scroll-to-top";
import { Button } from "@/components/ui/button";
import { Card, CardIcon } from "@/components/ui/card";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";

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
        className="relative isolate flex min-h-[100svh] items-center justify-center overflow-hidden px-4 py-32"
      >
        <AnimatedBackground variant="aurora" />

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <Reveal immediate variant="fade">
            <p className="type-eyebrow mb-4">Page not found</p>
          </Reveal>

          <Reveal immediate variant="scale" delay={0.06}>
            <p className="gradient-text mb-6 text-8xl font-semibold tracking-[-0.05em] md:text-9xl" aria-hidden>
              404
            </p>
          </Reveal>

          <Reveal immediate delay={0.12}>
            <h1 className="type-section-title mb-3 text-[var(--foreground)]">
              We Can&apos;t Find That Page
            </h1>
            <p className="type-lead mx-auto mb-10 max-w-md">
              The page you&apos;re looking for might have moved, been renamed, or never existed.
              Let&apos;s get you back on track.
            </p>

            <div className="mb-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/" size="lg">
                <Home className="h-4 w-4" aria-hidden />
                Back to home
              </Button>
              <Button href="/contact" variant="secondary" size="lg">
                Get in touch
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </Reveal>

          <h2 className="type-band-label mb-4">Or explore</h2>
          <Stagger as="ul" immediate delay={0.2} className="mx-auto grid max-w-2xl grid-cols-2 gap-3 md:grid-cols-4">
            {quickLinks.map((link) => (
              <StaggerItem as="li" key={link.href} className="h-full">
                <Link href={link.href} className="group block h-full">
                  <Card
                    tone="glass"
                    className="flex h-full flex-col items-center gap-2 text-center"
                    interactive
                    padding="sm"
                  >
                    <CardIcon size="sm">
                      <link.icon className="h-4 w-4" aria-hidden />
                    </CardIcon>
                    <span className="type-card-title text-[var(--text-base)] text-[var(--foreground)] transition-colors duration-[var(--duration-fast)] group-hover:text-[var(--accent)]">
                      {link.label}
                    </span>
                    <span className="text-[var(--text-xs)] text-[var(--text-tertiary)]">
                      {link.desc}
                    </span>
                  </Card>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
