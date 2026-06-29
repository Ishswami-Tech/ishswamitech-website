"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { legalEntity, paymentCollectionDisclosure, siteConfig } from "@/lib/site";

const sections = [
  {
    title: "1. Software and technology services",
    body: "Refunds for custom software, app development, website development, maintenance, and consulting services are governed by the signed proposal, statement of work, or invoice terms. Work already delivered, approved, or consumed is generally not refundable unless separately agreed in writing.",
  },
  {
    title: "2. Client-platform payments",
    body: "For client platforms, Ishswami Tech may collect online payments as the technology and payment collection partner. The actual service, product, booking, subscription, consultation, event, digital content, or deliverable is provided by the respective client or service provider.",
  },
  {
    title: "3. Cancellations, no-shows, and service-specific rules",
    body: "Cancellation and refund eligibility depends on the type of service being purchased and the client/provider policy shown for that service. For healthcare video appointments, payment is non-refundable once completed because the selected provider slot is reserved. Missed video appointments require a fresh booking unless the provider separately approves rescheduling.",
  },
  {
    title: "4. Approved refund timelines",
    body: "If a refund is approved, it will be initiated to the original payment method where possible. Bank, card, UPI, or payment gateway settlement timelines may take 5 to 7 business days after initiation.",
  },
  {
    title: "5. Gateway and processing charges",
    body: "Payment gateway, bank, or platform charges may be non-refundable where they have already been charged by the payment processor or bank.",
  },
];

export default function RefundCancellationPage() {
  return (
    <div>
      <section className="page-hero page-hero--compact">
        <div className="container mx-auto max-w-4xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <nav className="type-ui text-[var(--text-muted)]">
              <Link href="/" className="transition-colors hover:text-[var(--accent)]">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-[var(--foreground)]">Refund & cancellation</span>
            </nav>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--card-soft)] text-[var(--accent)]">
              <RotateCcw className="h-6 w-6" />
            </div>
            <p className="type-eyebrow mb-3">Legal</p>
            <h1 className="type-page-title mb-3 text-[var(--foreground)]">
              Refund & Cancellation Policy
            </h1>
            <p className="type-body text-[var(--text-muted)]">
              Last updated: February 2026 - Effective immediately
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
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
              <p className="type-body leading-relaxed text-[var(--text-muted)]">
                {paymentCollectionDisclosure}
              </p>
            </div>

            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="type-panel-title mb-3 text-[var(--foreground)]">{section.title}</h2>
                <p className="type-body leading-relaxed text-[var(--text-muted)]">{section.body}</p>
              </section>
            ))}

            <section className="rounded-2xl border border-[var(--border)] bg-[var(--card-soft)] p-6">
              <h2 className="type-panel-title mb-3 text-[var(--foreground)]">Contact for refund support</h2>
              <p className="type-body leading-relaxed text-[var(--text-muted)]">
                Email{" "}
                <a href={`mailto:${siteConfig.email}`} className="text-[var(--accent)] hover:underline">
                  {siteConfig.email}
                </a>{" "}
                or call{" "}
                <a href={`tel:${legalEntity.registeredPhone}`} className="text-[var(--accent)] hover:underline">
                  {legalEntity.registeredPhone}
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
