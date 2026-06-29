"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Home,
  ArrowUpRight,
  Briefcase,
  Mail,
  Tag,
  Compass,
} from "lucide-react";

const quickLinks = [
  { href: "/services", label: "Services", icon: Briefcase, desc: "What we build & how" },
  { href: "/pricing", label: "Pricing", icon: Tag, desc: "Plans & ranges" },
  { href: "/about", label: "About", icon: Compass, desc: "Meet the team" },
  { href: "/contact", label: "Contact", icon: Mail, desc: "Start a conversation" },
];

export default function NotFound() {
  return (
    <main className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 py-32">
      <div
        className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[var(--accent)]/15 blur-3xl"
        aria-hidden
      />
      <div
        className="absolute -bottom-40 right-1/4 h-80 w-80 rounded-full bg-[var(--secondary)]/15 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="type-eyebrow mb-4"
        >
          Page not found
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="font-heading mb-6 text-7xl font-bold md:text-9xl gradient-text glitch-text"
          style={{
            textShadow: "0 0 24px color-mix(in srgb, var(--accent) 35%, transparent)",
          }}
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="type-section-title mb-3 text-[var(--foreground)]"
        >
          We can&apos;t find that page
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="type-lead mx-auto mb-10 max-w-md"
        >
          The page you&apos;re looking for might have moved, been renamed, or never existed.
          Let&apos;s get you back on track.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--button-gradient)] px-7 py-3.5 font-semibold text-white shadow-[var(--button-shadow)] transition-all hover:-translate-y-0.5"
          >
            <Home className="h-4 w-4" />
            Back to home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--card)] px-7 py-3.5 font-semibold text-[var(--foreground)] backdrop-blur-xl transition-colors hover:bg-[var(--card-soft)]"
          >
            Get in touch
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="type-band-label mb-4 text-[var(--text-muted)]">Or explore</p>
          <div className="mx-auto grid max-w-2xl grid-cols-2 gap-3 md:grid-cols-4">
            {quickLinks.map((link) => {
              const LinkIcon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="glass group flex flex-col items-center gap-2 rounded-2xl border border-[var(--border)] p-5 transition-all hover:-translate-y-1 hover:border-[var(--border-strong)]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--card-soft)] text-[var(--accent)]">
                    <LinkIcon className="h-5 w-5" />
                  </div>
                  <span className="type-card-title text-sm text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                    {link.label}
                  </span>
                  <span className="type-body text-xs text-[var(--text-muted)]">{link.desc}</span>
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
