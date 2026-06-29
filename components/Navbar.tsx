"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "border-b border-[var(--border)] bg-[var(--navbar-bg)] py-2.5 shadow-[var(--navbar-shadow)] backdrop-blur-xl"
            : "bg-transparent py-4"
        }`}
      >
        <nav className="container mx-auto flex items-center justify-between px-4">
          <Link href="/" className="group flex items-center gap-3" aria-label="Ishswami Tech home">
            <div className="flex items-center justify-center overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-colors group-hover:bg-[var(--card-soft)]">
              <Image
                src="/logo.png"
                alt=""
                width={40}
                height={40}
                sizes="40px"
                className="h-10 w-10 object-contain"
              />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-heading text-xl font-bold gradient-text">Ishswami</span>
              <span className="type-ui text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                Tech
              </span>
            </div>
          </Link>

          <div className="hidden items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--nav-pill-bg)] px-2 py-1.5 backdrop-blur-xl lg:flex">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    active
                      ? "text-white"
                      : "text-[var(--text-muted)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-[var(--accent)]"
                      transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="hidden items-center gap-2.5 lg:flex">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-1.5 rounded-full bg-[var(--button-gradient)] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--button-shadow)] transition-all hover:-translate-y-0.5"
            >
              Get a quote
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:rotate-45" />
            </Link>
          </div>

          <button
            type="button"
            className="rounded-full border border-[var(--border)] bg-[var(--card)] p-2.5 text-[var(--foreground)] transition-colors hover:bg-[var(--card-soft)] lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-[rgba(8,15,30,0.5)] backdrop-blur-md"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden
            />
            <motion.aside
              id="mobile-nav"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="absolute right-0 top-0 bottom-0 flex w-[88%] max-w-sm flex-col border-l border-[var(--border)] bg-[var(--surface)] backdrop-blur-2xl"
            >
              <div className="flex items-center justify-between border-b border-[var(--border)] p-5">
                <Link
                  href="/"
                  className="flex items-center gap-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Image
                    src="/logo.png"
                    alt=""
                    width={36}
                    height={36}
                    sizes="36px"
                    className="h-9 w-9 object-contain"
                  />
                  <span className="font-heading text-base font-bold gradient-text">
                    Ishswami Tech
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="rounded-full border border-[var(--border)] bg-[var(--card)] p-2 text-[var(--foreground)]"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto p-5">
                <ul className="flex flex-col gap-1.5">
                  {navLinks.map((link) => {
                    const active = isActive(link.href);
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center justify-between rounded-2xl px-4 py-3.5 text-base font-medium transition-colors ${
                            active
                              ? "bg-[var(--accent)] text-white"
                              : "text-[var(--foreground)] hover:bg-[var(--card-soft)]"
                          }`}
                        >
                          {link.label}
                          <ArrowUpRight className="h-4 w-4 opacity-60" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              <div className="border-t border-[var(--border)] p-5">
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--button-gradient)] px-5 py-3.5 text-center font-semibold text-white shadow-[var(--button-shadow)]"
                >
                  Get a quote
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
