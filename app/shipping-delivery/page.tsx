"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, PackageCheck } from "lucide-react";
import { paymentCollectionDisclosure, siteConfig } from "@/lib/site";

const sections = [
  {
    title: "1. No physical shipping",
    body: "IshSwamiTech provides software, digital products, technology services, and platform services. We do not ship physical goods for these services unless a separate written agreement specifically says otherwise.",
  },
  {
    title: "2. Digital service delivery",
    body: "Software, website, mobile app, cloud, AI, support, and consulting deliverables are provided electronically through agreed channels such as email, project management tools, repositories, cloud environments, or production deployments.",
  },
  {
    title: "3. Appointment and consultation delivery",
    body: "For healthcare platforms operated for clients, appointment confirmations are delivered digitally through the app, website, SMS, WhatsApp, email, or other configured channels. The actual healthcare service is delivered by the listed clinic or practitioner.",
  },
  {
    title: "4. Delivery timelines",
    body: "Project delivery timelines are defined in the proposal, invoice, or statement of work. Appointment confirmations are normally generated immediately after successful booking and payment confirmation, subject to provider and payment gateway availability.",
  },
];

export default function ShippingDeliveryPage() {
  return (
    <div>
      <section className="page-hero page-hero--compact">
        <div className="container mx-auto max-w-4xl px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <nav className="type-ui text-[var(--text-muted)]">
              <Link href="/" className="transition-colors hover:text-[var(--accent)]">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-[var(--foreground)]">Shipping & delivery</span>
            </nav>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--card-soft)] text-[var(--accent)]">
              <PackageCheck className="h-6 w-6" />
            </div>
            <p className="type-eyebrow mb-3">Legal</p>
            <h1 className="type-page-title mb-3 text-[var(--foreground)]">
              Shipping & Delivery Policy
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
              <h2 className="type-panel-title mb-3 text-[var(--foreground)]">Delivery support</h2>
              <p className="type-body leading-relaxed text-[var(--text-muted)]">
                For delivery or booking confirmation issues, contact{" "}
                <a href={`mailto:${siteConfig.email}`} className="text-[var(--accent)] hover:underline">
                  {siteConfig.email}
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
