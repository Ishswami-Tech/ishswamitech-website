"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
<<<<<<< Updated upstream
import { legalContacts, paymentCollectionDisclosure, privacySections } from "@/lib/legal/policy-content";
=======
import { siteConfig } from "@/lib/site";

const sections = [
  {
    id: "data",
    title: "1. What data we collect",
    body: `IshSwamiTech collects information you provide directly — such as name, email, phone number, company name, and project details — when you contact us or use our services. We also automatically collect technical information when you visit our website, including IP address, browser type, device details, and usage data.`,
  },
  {
    id: "use",
    title: "2. How we use your data",
    body: `We use your data to deliver and improve our services, communicate about active projects, send marketing communications (only with your consent), and comply with legal obligations. We never sell your personal information to third parties.`,
  },
  {
    id: "sharing",
    title: "3. Third-party sharing",
    body: `We may share your data with trusted service providers who assist us in operating our business — including hosting, analytics, and email infrastructure. These providers are contractually obligated to protect your data. We may also disclose information when legally required.`,
  },
  {
    id: "cookies",
    title: "4. Cookies",
    body: `We use cookies and similar technologies to enhance your experience, analyze site traffic, and personalize content. You can control cookie preferences through your browser settings. Essential cookies are necessary for the website to function properly.`,
  },
  {
    id: "rights",
    title: "5. Your rights",
    body: `Depending on your location, you may have the right to access, correct, delete, or port your personal data. You may also have the right to object to or restrict certain processing. To exercise these rights, contact us at the address below.`,
  },
  {
    id: "contact",
    title: "6. Contact",
    body: `For questions about this Privacy Policy or our data practices, reach out to us anytime.`,
  },
];
>>>>>>> Stashed changes

export default function PrivacyPolicyPage() {
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
              <span className="text-[var(--foreground)]">Privacy</span>
            </nav>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--card-soft)] text-[var(--accent)]">
              <Shield className="h-6 w-6" />
            </div>
            <p className="type-eyebrow mb-3">IshSwamiTech legal</p>
            <h1 className="type-page-title mb-3 text-[var(--foreground)]">Privacy Policy</h1>
            <p className="type-body text-[var(--text-muted)]">Last updated: February 2026 - Effective immediately</p>
            <p className="type-body mt-4 leading-relaxed text-[var(--text-muted)]">
              This policy explains how Ishswami Tech collects and uses information to operate the website, projects, and connected digital services.
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
                  {privacySections.map((section) => (
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
              <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
                <p className="type-body leading-relaxed text-[var(--text-muted)]">{paymentCollectionDisclosure}</p>
              </section>

              {privacySections.map((section) => (
                <section key={section.id} id={section.id} className="scroll-mt-28">
                  <h2 className="type-panel-title mb-3 text-[var(--foreground)]">{section.title}</h2>
                  <p className="type-body leading-relaxed text-[var(--text-muted)]">{section.body}</p>
                  {section.id === "grievance" && (
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
