"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
<<<<<<< Updated upstream
import { legalContacts, termsSections } from "@/lib/legal/policy-content";
=======
import { siteConfig } from "@/lib/site";

const sections = [
  {
    id: "agreement",
    title: "1. Service agreement",
    body: `By engaging IshSwamiTech for software development or related services, you agree to these Terms & Conditions. A separate project agreement or statement of work may specify additional terms for individual projects, and those will take precedence over these general terms where they conflict.`,
  },
  {
    id: "payment",
    title: "2. Payment terms",
    body: `Payment terms are specified in each project agreement. Typically, we require a deposit to begin work, with milestone-based or final payment upon completion. Invoices are due within 30 days unless otherwise agreed in writing. Late payments may incur reasonable interest charges as permitted by law.`,
  },
  {
    id: "ip",
    title: "3. Intellectual property",
    body: `Upon full payment, you receive ownership of the custom deliverables created for your project. Pre-existing materials, tools, frameworks, and reusable components remain our property or the property of their respective licensors. We retain the right to use anonymized work for portfolio and marketing purposes unless otherwise agreed in writing.`,
  },
  {
    id: "liability",
    title: "4. Limitation of liability",
    body: `To the maximum extent permitted by law, IshSwamiTech shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our services. Our total liability shall not exceed the amount paid by you for the specific project giving rise to the claim.`,
  },
  {
    id: "law",
    title: "5. Governing law",
    body: `These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which IshSwamiTech is registered, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of that jurisdiction.`,
  },
  {
    id: "changes",
    title: "6. Changes to these terms",
    body: `We may revise these Terms & Conditions at any time. The current version will always be available on this page, with an updated effective date. Continued use of our services after a change constitutes acceptance of the revised terms.`,
  },
  {
    id: "contact",
    title: "7. Contact",
    body: `For questions about these Terms & Conditions, get in touch with us anytime.`,
  },
];
>>>>>>> Stashed changes

export default function TermsOfServicePage() {
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
              <span className="text-[var(--foreground)]">Terms &amp; Conditions</span>
            </nav>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--card-soft)] text-[var(--accent)]">
              <FileText className="h-6 w-6" />
            </div>
<<<<<<< Updated upstream
            <p className="type-eyebrow mb-3">Legal</p>
            <h1 className="type-page-title mb-3 text-[var(--foreground)]">Terms and Conditions</h1>
            <p className="type-body text-[var(--text-muted)]">Last updated: February 2026 - Effective immediately</p>
            <p className="type-body mt-4 leading-relaxed text-[var(--text-muted)]">
              This document is an electronic record and is intended to serve as a formal reference for website, payment gateway, and compliance use.
=======
            <p className="type-eyebrow mb-3">IshSwamiTech legal</p>
            <h1 className="type-page-title mb-3 text-[var(--foreground)]">Terms &amp; Conditions</h1>
            <p className="type-body text-[var(--text-muted)]">
              Last updated: March 2025 · Effective immediately
>>>>>>> Stashed changes
            </p>
          </motion.div>
        </div>
      </section>

      <section className="site-section--tight site-section--no-top">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="grid gap-8 lg:grid-cols-[0.3fr_1fr]">
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <p className="type-band-label mb-3 text-[var(--text-muted)]">On this page</p>
                <ul className="space-y-2 border-l border-[var(--border)] pl-4">
                  {termsSections.map((section) => (
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
              {termsSections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-28">
                  <h2 className="type-panel-title mb-3 text-[var(--foreground)]">{section.title}</h2>
                  <p className="type-body leading-relaxed text-[var(--text-muted)]">{section.body}</p>
                  {section.id === "contact" && (
                    <p className="type-body mt-3 text-[var(--text-muted)]">
                      Email us at{" "}
                      <a href={`mailto:${legalContacts.supportEmail}`} className="text-[var(--accent)] hover:underline">
                        {legalContacts.supportEmail}
                      </a>{" "}
                      or call{" "}
                      <a href={`tel:${legalContacts.supportPhone}`} className="text-[var(--accent)] hover:underline">
                        {legalContacts.supportPhone}
                      </a>
                      .
                    </p>
                  )}
                </section>
              ))}
            </motion.article>
          </div>
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
