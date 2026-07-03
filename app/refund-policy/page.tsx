"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import { siteConfig } from "@/lib/site";

const sections = [
  {
    id: "overview",
    title: "1. Overview",
    body: `IshSwamiTech provides custom software, design, consulting, and support services. Because most work is planned, staffed, and delivered specifically for each client, refunds are reviewed based on the project agreement, work completed, and any unused prepaid balance.`,
  },
  {
    id: "deposits",
    title: "2. Deposits and kickoff payments",
    body: `Discovery, booking, and kickoff deposits are generally non-refundable once planning, design, engineering, or project management work has started. If no work has begun, we may refund the unused amount after deducting payment gateway or administrative charges where applicable.`,
  },
  {
    id: "milestones",
    title: "3. Milestone-based projects",
    body: `For milestone projects, completed and approved milestones are not refundable. If a project is cancelled before the next milestone begins, any unused prepaid balance may be refunded or converted into credit for future work by mutual agreement.`,
  },
  {
    id: "retainers",
    title: "4. Monthly retainers and support",
    body: `Retainer and support fees cover reserved team capacity, availability, and ongoing maintenance. Fees for the current billing period are not refundable once the period has started, unless a separate written agreement states otherwise.`,
  },
  {
    id: "third-party",
    title: "5. Third-party costs",
    body: `Domain fees, hosting, paid plugins, stock assets, cloud usage, third-party software, API usage, and other external costs are non-refundable once purchased or consumed, because these charges are controlled by outside providers.`,
  },
  {
    id: "requests",
    title: "6. Refund requests",
    body: `To request a refund review, email us with your project name, invoice number, reason for the request, and any supporting details. We aim to review refund requests within 7 - 10 business days. once the refund is approved it will be processed to the original source within 7 -10 days `,
  },
  {
    id: "contact",
    title: "7. Contact",
    body: `For refund questions or billing support, reach out to us anytime.`,
  },
];

export default function RefundPolicyPage() {
  return (
    <div>
      <section className="page-hero page-hero--compact">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <nav className="type-ui text-[var(--text-muted)]">
              <Link href="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-[var(--foreground)]">Refund Policy</span>
            </nav>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--card-soft)] text-[var(--accent)]">
              <RefreshCcw className="h-6 w-6" />
            </div>
            <p className="type-eyebrow mb-3">IshSwamiTech legal</p>
            <h1 className="type-page-title mb-3 text-[var(--foreground)]">Refund Policy</h1>
            <p className="type-body text-[var(--text-muted)]">
              Last updated: June 2026 · Applies to service engagements and project invoices
            </p>
          </motion.div>
        </div>
      </section>

      <section className="site-section--tight site-section--no-top">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid gap-8 lg:grid-cols-[0.3fr_1fr]">
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <p className="type-band-label mb-3 text-[var(--text-muted)]">On this page</p>
                <ul className="space-y-2 border-l border-[var(--border)] pl-4">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="type-ui text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]"
                      >
                        {section.title.replace(/^\d+\.\s/, "")}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="space-y-10"
            >
              {sections.map((section) => (
                <div key={section.id} id={section.id} className="scroll-mt-28">
                  <h2 className="type-panel-title mb-3 text-[var(--foreground)]">
                    {section.title}
                  </h2>
                  <p className="type-body leading-relaxed text-[var(--text-muted)]">
                    {section.body}
                  </p>
                  {section.id === "contact" && (
                    <p className="type-body mt-3 text-[var(--text-muted)]">
                      Email us at{" "}
                      <a
                        href={`mailto:${siteConfig.email}`}
                        className="text-[var(--accent)] hover:underline"
                      >
                        {siteConfig.email}
                      </a>
                      .
                    </p>
                  )}
                </div>
              ))}
            </motion.article>
          </div>
        </div>
      </section>

      <section className="site-section--tight site-section--no-top">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link
            href="/"
            className="type-ui inline-flex items-center gap-2 text-[var(--accent)] hover:text-[var(--link-emphasis)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </section>
    </div>
  );
}
