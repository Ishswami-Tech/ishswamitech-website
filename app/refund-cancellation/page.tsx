"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { legalContacts, refundSections } from "@/lib/legal/policy-content";

export default function RefundCancellationPage() {
  return (
    <div>
      <section className="page-hero page-hero--compact">
        <div className="container mx-auto max-w-4xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <nav className="type-ui text-[var(--text-muted)]">
              <Link href="/" className="transition-colors hover:text-[var(--accent)]">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-[var(--foreground)]">Refund & cancellation</span>
            </nav>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--card-soft)] text-[var(--accent)]">
              <RotateCcw className="h-6 w-6" />
            </div>
            <p className="type-eyebrow mb-3">Legal</p>
            <h1 className="type-page-title mb-3 text-[var(--foreground)]">Refund & Cancellation Policy</h1>
            <p className="type-body text-[var(--text-muted)]">Last updated: February 2026 - Effective immediately</p>
            <p className="type-body mt-4 leading-relaxed text-[var(--text-muted)]">
              This policy applies to service bookings, digital services, and client-platform payments handled through Ishswami Tech.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="site-section--tight site-section--no-top">
        <div className="container mx-auto max-w-4xl px-4">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-8"
          >
            {refundSections.map((section) => (
              <section key={section.title}>
                <h2 className="type-panel-title mb-3 text-[var(--foreground)]">{section.title}</h2>
                <p className="type-body leading-relaxed text-[var(--text-muted)]">{section.body}</p>
              </section>
            ))}

            <section className="rounded-2xl border border-[var(--border)] bg-[var(--card-soft)] p-6">
              <h2 className="type-panel-title mb-3 text-[var(--foreground)]">Refund support</h2>
              <p className="type-body leading-relaxed text-[var(--text-muted)]">
                Email{" "}
                <a href={`mailto:${legalContacts.supportEmail}`} className="text-[var(--accent)] hover:underline">
                  {legalContacts.supportEmail}
                </a>{" "}
                or call{" "}
                <a href={`tel:${legalContacts.supportPhone}`} className="text-[var(--accent)] hover:underline">
                  {legalContacts.supportPhone}
                </a>
                .
              </p>
            </section>
          </motion.article>
        </div>
      </section>

      <section className="site-section--tight site-section--no-top">
        <div className="container mx-auto max-w-4xl px-4">
          <Link href="/" className="type-ui inline-flex items-center gap-2 text-[var(--accent)] hover:text-[var(--link-emphasis)]">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </section>
    </div>
  );
}
