"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { transition } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Insights" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, restDelta: 0.001 });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 border-b bg-[var(--surface)]",
          "transition-[border-color,box-shadow]",
          "duration-[var(--duration-normal)] ease-[var(--ease-out)]",
          // Opaque white, not glass. The bar spans a dark home hero and light
          // heroes on every other page, and no single text colour survives
          // both — so it carries its own surface. Translucent white did carry
          // one, but over the dark hero 72% white composites to a murky grey
          // that reads as unfinished rather than as glass. Solid keeps the
          // logo and nav on the surface they were drawn for.
          //
          // No backdrop-blur either: blurring what is behind an opaque fill
          // buys a compositing layer and nothing visible.
          isScrolled
            ? "border-[var(--border)] shadow-[var(--shadow-md)]"
            : "border-transparent"
        )}
      >
        <nav aria-label="Main" className="container">
          <div className="flex h-[var(--navbar-height)] items-center justify-between gap-4">
            {/* Mark as artwork, name as live type. The full lockup carried its
                own baked-in wordmark, which put a second typeface next to
                every heading on the site; setting the name in the display face
                puts the header back in the same voice. `font-heading` is the
                Tailwind bridge to --font-display-stack, so it tracks Sora
                rather than pinning the family here. */}
            <Link
              href="/"
              className="group flex items-center gap-2.5"
              aria-label={`${siteConfig.shortName} home`}
            >
              <Image
                src={siteConfig.logo}
                alt=""
                width={658}
                height={658}
                priority
                className={cn(
                  "h-9 w-9 shrink-0",
                  "transition-transform duration-[var(--duration-normal)] ease-[var(--ease-out)]",
                  "group-hover:scale-105 motion-reduce:transform-none"
                )}
              />
              <span className="font-heading text-[var(--text-xl)] font-semibold tracking-[-0.022em] text-[var(--foreground)]">
                {siteConfig.wordmark.primary}
                <span className="text-[var(--brand-gold)]">{siteConfig.wordmark.accent}</span>
              </span>
            </Link>

            <ul className="hidden items-center gap-0.5 lg:flex">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative block rounded-[var(--radius-md)] px-3.5 py-2",
                        "text-[var(--text-base)] font-medium",
                        "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)]",
                        active
                          ? "text-[var(--foreground)]"
                          : "text-[var(--text-tertiary)] hover:text-[var(--foreground)]"
                      )}
                    >
                      {/* Slides between items via shared layout. MotionConfig
                          turns that into an instant swap under reduced motion. */}
                      {active && (
                        <motion.span
                          aria-hidden
                          layoutId="nav-active"
                          transition={transition.spring}
                          className="absolute inset-0 rounded-[var(--radius-md)] bg-[var(--surface-tint-strong)]"
                        />
                      )}
                      <span className="relative">{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-2">
              <Link
                href="/contact"
                className={cn(
                  "group/cta hidden items-center gap-1.5 rounded-[var(--radius-lg)] px-4 py-2.5",
                  "text-[var(--text-base)] font-medium text-[var(--text-on-brand)]",
                  "[background-image:var(--gradient-primary)] shadow-[var(--shadow-glow)]",
                  "transition-[translate,scale,box-shadow] duration-[var(--duration-fast)] ease-[var(--ease-out)]",
                  "hover:-translate-y-px hover:shadow-[var(--shadow-glow-strong)]",
                  "motion-reduce:transform-none lg:inline-flex"
                )}
              >
                Get a Quote
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-[var(--duration-fast)] group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
                  aria-hidden
                />
              </Link>

              <button
                type="button"
                className={cn(
                  "rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-raised)] p-2.5",
                  "text-[var(--foreground)] transition-colors duration-[var(--duration-fast)]",
                  "hover:border-[var(--border-hover)] lg:hidden"
                )}
                onClick={() => setIsMenuOpen((open) => !open)}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
                aria-controls="mobile-nav"
              >
                {isMenuOpen ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
              </button>
            </div>
          </div>
        </nav>

        {/* Reading progress. Scales a single element on the GPU rather than
            animating width, and only shows once the header is condensed. */}
        <motion.div
          aria-hidden
          style={{ scaleX: reduced ? 0 : progress }}
          className={cn(
            "absolute inset-x-0 bottom-0 h-px origin-left [background-image:var(--gradient-primary)]",
            "transition-opacity duration-[var(--duration-normal)]",
            isScrolled ? "opacity-100" : "opacity-0"
          )}
        />
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition.fast}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <button
              type="button"
              className="absolute inset-0 h-full w-full cursor-default bg-[rgb(var(--scrim-rgb)/0.55)] backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
              tabIndex={-1}
            />

            <motion.div
              id="mobile-nav"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={transition.normal}
              className={cn(
                "absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col",
                "border-l border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-xl)]"
              )}
            >
              <div className="flex h-[var(--navbar-height)] items-center justify-between border-b border-[var(--border)] px-5">
                <span className="font-heading text-[var(--text-md)] font-semibold tracking-[-0.022em] text-[var(--foreground)]">
                  {siteConfig.wordmark.primary}
                  <span className="text-[var(--brand-gold)]">{siteConfig.wordmark.accent}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close menu"
                  className="rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-raised)] p-2 text-[var(--foreground)]"
                >
                  <X size={16} aria-hidden />
                </button>
              </div>

              <nav aria-label="Mobile" className="flex-1 overflow-y-auto p-4">
                <ul className="flex flex-col gap-1">
                  {navLinks.map((link) => {
                    const active = isActive(link.href);
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setIsMenuOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex items-center justify-between rounded-[var(--radius-lg)] px-4 py-3",
                            "text-[var(--text-md)] font-medium transition-colors duration-[var(--duration-fast)]",
                            active
                              ? "bg-[var(--surface-tint-strong)] text-[var(--foreground)]"
                              : "text-[var(--text-secondary)] hover:bg-[var(--surface-tint)] hover:text-[var(--foreground)]"
                          )}
                        >
                          {link.label}
                          <ArrowUpRight className="h-4 w-4 opacity-40" aria-hidden />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="border-t border-[var(--border)] p-4">
                <Link
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-lg)] px-5 py-3",
                    "font-medium text-[var(--text-on-brand)]",
                    "[background-image:var(--gradient-primary)] shadow-[var(--shadow-glow)]"
                  )}
                >
                  Get a Quote
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
