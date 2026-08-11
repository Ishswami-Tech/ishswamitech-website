"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Insights" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
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
      <header className="fixed inset-x-0 top-3 z-50">
        <nav aria-label="Main" className="container">
          <div
            className={cn(
              "flex items-center justify-between rounded-[var(--radius-xl)] border px-3.5 py-2.5 transition-all duration-300 md:px-4",
              isScrolled
                ? "border-[var(--border-strong)] bg-[var(--navbar-bg)] shadow-[var(--navbar-shadow)] backdrop-blur-2xl"
                : "border-white/10 bg-[#06101d]/70 shadow-[0_16px_46px_rgba(0,0,0,0.24)] backdrop-blur-xl"
            )}
          >
            <Link
              href="/"
              className="group flex items-center gap-3"
              aria-label={`${siteConfig.shortName} home`}
            >
              <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[linear-gradient(135deg,rgba(66,232,244,0.12),rgba(255,184,77,0.08))] p-1 transition-transform group-hover:-translate-y-0.5 motion-reduce:group-hover:translate-y-0">
                <Image src={siteConfig.logo} alt="" width={32} height={32} className="h-8 w-8" />
              </span>
              <span className="font-heading text-lg font-bold gradient-text">
                {siteConfig.shortName}
              </span>
            </Link>

            <ul className="hidden items-center gap-1 rounded-[var(--radius-md)] border border-white/10 bg-[var(--nav-pill-bg)] p-1.5 backdrop-blur-xl lg:flex">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative block rounded-[var(--radius-sm)] px-3.5 py-1.5 text-sm font-semibold transition-colors",
                        active
                          ? "text-[var(--button-foreground)]"
                          : "text-[var(--text-muted)] hover:bg-white/[0.05] hover:text-[var(--foreground)]"
                      )}
                    >
                      {active &&
                        (reduceMotion ? (
                          <span className="absolute inset-0 rounded-[var(--radius-sm)] [background:var(--button-gradient)]" />
                        ) : (
                          <motion.span
                            layoutId="nav-active"
                            className="absolute inset-0 rounded-[var(--radius-sm)] [background:var(--button-gradient)]"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                          />
                        ))}
                      <span className="relative">{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <Link
              href="/contact"
              className="group hidden items-center gap-1.5 rounded-[var(--radius-md)] [background:var(--button-gradient)] px-5 py-2.5 text-sm font-bold text-[var(--button-foreground)] shadow-[var(--button-shadow)] transition-transform hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 lg:inline-flex"
            >
              Get a quote
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform group-hover:rotate-45"
                aria-hidden
              />
            </Link>

            <button
              type="button"
              className="rounded-[var(--radius-md)] border border-[var(--border-strong)] bg-[var(--card)] p-2.5 text-[var(--foreground)] transition-colors hover:bg-[var(--card-soft)] lg:hidden"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
            >
              {isMenuOpen ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <button
              type="button"
              className="absolute inset-0 h-full w-full cursor-default bg-[rgba(3,8,16,0.68)] backdrop-blur-md"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
              tabIndex={-1}
            />
            <motion.div
              id="mobile-nav"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col border-l border-[var(--border-strong)] bg-[#071321]/95 shadow-[var(--navbar-shadow)] backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between border-b border-[var(--border)] bg-white/[0.02] p-5">
                <span className="font-heading text-base font-bold gradient-text">
                  {siteConfig.shortName}
                </span>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close menu"
                  className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] p-2 text-[var(--foreground)]"
                >
                  <X size={18} aria-hidden />
                </button>
              </div>

              <nav aria-label="Mobile" className="flex-1 overflow-y-auto p-5">
                <ul className="flex flex-col gap-1.5">
                  {navLinks.map((link) => {
                    const active = isActive(link.href);
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setIsMenuOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex items-center justify-between rounded-[var(--radius-lg)] px-4 py-3.5 text-base font-medium transition-colors",
                            active
                              ? "[background:var(--button-gradient)] text-[var(--button-foreground)]"
                              : "text-[var(--foreground)] hover:bg-[var(--card-soft)]"
                          )}
                        >
                          {link.label}
                          <ArrowUpRight className="h-4 w-4 opacity-60" aria-hidden />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="border-t border-[var(--border)] p-5">
                <Link
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] [background:var(--button-gradient)] px-5 py-3.5 font-bold text-[var(--button-foreground)] shadow-[var(--button-shadow)]"
                >
                  Get a quote
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
