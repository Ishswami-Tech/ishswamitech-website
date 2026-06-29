"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  Sparkles,
  ArrowUpRight,
  ChevronDown,
  Brush,
  Search,
  Wrench,
  Brain,
  ShieldCheck,
  CalendarClock,
  Briefcase,
} from "lucide-react";
import { pricingFaq } from "@/data/faq";

const plans = [
  {
    name: "Starter",
    icon: Sparkles,
    desc: "For founders validating an idea or shipping a v1",
    price: "From Rs. 25,000",
    timeline: "2 - 4 weeks",
    features: [
      "Single-platform web or mobile app",
      "Up to 5 core screens / features",
      "Brand-aware UI implementation",
      "30-day post-launch support",
      "Source code + documentation",
    ],
    notIncluded: ["Multi-platform delivery", "Dedicated team", "Ongoing retainer"],
    cta: "Get started",
    popular: false,
  },
  {
    name: "Growth",
    icon: Briefcase,
    desc: "For SMBs scaling a product with traction",
    price: "From Rs. 75,000",
    timeline: "4 - 12 weeks",
    features: [
      "Full-stack custom application",
      "Multi-platform (web + mobile)",
      "Advanced features & integrations",
      "REST / GraphQL API development",
      "Performance & SEO optimization",
      "60-day post-launch support",
    ],
    notIncluded: ["Dedicated team", "24/7 SLA"],
    cta: "Talk to sales",
    popular: true,
  },
  {
    name: "Enterprise",
    icon: ShieldCheck,
    desc: "For organizations with complex needs and SLAs",
    price: "Custom Quote",
    timeline: "Ongoing",
    features: [
      "Complex enterprise systems",
      "All platforms - web, mobile, desktop",
      "Ongoing retainer with dedicated team",
      "Custom SLA with response targets",
      "Security audit & compliance review",
      "24/7 incident response",
      "Architecture and DevOps consulting",
    ],
    notIncluded: [],
    cta: "Contact sales",
    popular: false,
  },
];

const addOns = [
  {
    icon: Brush,
    name: "UI/UX Design",
    price: "From Rs. 25,000",
    desc: "Wireframes, prototypes, and a complete brand-aligned visual system.",
  },
  {
    icon: Search,
    name: "SEO Optimization",
    price: "From Rs. 15,000",
    desc: "Technical SEO audit, schema, page speed, and content recommendations.",
  },
  {
    icon: Wrench,
    name: "Maintenance Retainer",
    price: "From Rs. 15,000 / mo",
    desc: "Bug fixes, security patches, dependency upgrades, and small features.",
  },
  {
    icon: Brain,
    name: "AI Integration",
    price: "From Rs. 50,000",
    desc: "GPT, embeddings, RAG, or custom models added to an existing product.",
  },
];

const includedAcrossAll = [
  "Discovery call & written scope",
  "Senior engineering leadership",
  "Weekly demos & shared backlog",
  "Source code & full ownership",
  "Mobile-responsive by default",
  "Production-grade hosting setup",
];

export default function PricingPage() {
  const [billing, setBilling] = useState<"project" | "monthly">("project");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div>
      {/* HERO */}
      <section className="page-hero">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <nav className="type-ui text-[var(--text-muted)]">
              <Link href="/" className="hover:text-[var(--accent)] transition-colors">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-[var(--foreground)]">Pricing</span>
            </nav>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <p className="type-eyebrow mb-4">Transparent pricing</p>
            <h1 className="type-page-title mb-5 text-[var(--foreground)]">
              Plans that scale with your stage
            </h1>
            <p className="type-lead mx-auto mb-10 max-w-2xl">
              Honest ranges, fixed-scope quotes, and the flexibility to mix project and retainer
              work. Every engagement starts with a free discovery call - no commitment required.
            </p>

            <div className="inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--card)] p-1 backdrop-blur-xl">
              <button
                type="button"
                onClick={() => setBilling("project")}
                className={`type-ui rounded-full px-5 py-2 transition-all ${
                  billing === "project"
                    ? "bg-[var(--accent)] text-white shadow-[var(--button-shadow)]"
                    : "text-[var(--text-muted)] hover:text-[var(--foreground)]"
                }`}
              >
                Project-based
              </button>
              <button
                type="button"
                onClick={() => setBilling("monthly")}
                className={`type-ui rounded-full px-5 py-2 transition-all ${
                  billing === "monthly"
                    ? "bg-[var(--accent)] text-white shadow-[var(--button-shadow)]"
                    : "text-[var(--text-muted)] hover:text-[var(--foreground)]"
                }`}
              >
                Monthly retainer
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PLANS */}
      <section className="site-section">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {plans.map((plan, i) => {
              const PlanIcon = plan.icon;
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`relative flex flex-col rounded-[2rem] border p-8 transition-all ${
                    plan.popular
                      ? "border-[var(--border-strong)] bg-gradient-to-br from-[var(--card)] via-[var(--card)] to-[var(--card-soft)] shadow-[var(--button-shadow)]"
                      : "glass border-[var(--border)] hover:border-[var(--border-strong)]"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-[var(--button-gradient)] px-3 py-1 text-xs font-semibold text-white shadow-[var(--button-shadow)]">
                      <Sparkles className="h-3.5 w-3.5" />
                      Most popular
                    </div>
                  )}

                  <div className="mb-6 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--card-soft)] text-[var(--accent)]">
                      <PlanIcon className="h-5 w-5" />
                    </div>
                    <span className="type-ui inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs text-[var(--text-muted)]">
                      <CalendarClock className="h-3.5 w-3.5" />
                      {plan.timeline}
                    </span>
                  </div>

                  <h3 className="type-panel-title mb-1.5 text-[var(--foreground)]">{plan.name}</h3>
                  <p className="type-body mb-6 text-sm text-[var(--text-muted)]">{plan.desc}</p>

                  <div className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                    <p className="type-stat-label mb-1 text-[var(--text-muted)]">
                      {billing === "project" ? "Project range" : "Monthly retainer"}
                    </p>
                    <p className="type-stat text-3xl text-[var(--foreground)]">{plan.price}</p>
                  </div>

                  <ul className="mb-6 flex-1 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="type-body flex items-start gap-2.5 text-sm text-[var(--foreground)]">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--success)]" />
                        <span>{f}</span>
                      </li>
                    ))}
                    {plan.notIncluded.map((f) => (
                      <li key={f} className="type-body flex items-start gap-2.5 text-sm text-[var(--text-muted)] line-through opacity-70">
                        <X className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/contact"
                    className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold transition-all ${
                      plan.popular
                        ? "bg-[var(--button-gradient)] text-white shadow-[var(--button-shadow)] hover:-translate-y-0.5"
                        : "border border-[var(--border-strong)] bg-[var(--card)] text-[var(--foreground)] hover:bg-[var(--card-soft)]"
                    }`}
                  >
                    {plan.cta}
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INCLUDED ACROSS ALL */}
      <section className="site-section--tight border-y border-[var(--border)] bg-[var(--home-band-bg)]">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <p className="type-band-label text-[var(--accent)]">Included in every plan</p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {includedAcrossAll.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="type-body flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)] backdrop-blur-xl"
              >
                <Check className="h-4 w-4 shrink-0 text-[var(--success)]" />
                <span>{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ADD-ONS */}
      <section className="site-section">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <p className="type-eyebrow mb-4">Add-on services</p>
            <h2 className="type-section-title mb-4 text-[var(--foreground)]">
              Add-on capabilities, scoped separately
            </h2>
            <p className="type-lead mx-auto max-w-2xl">
              Layer these onto any plan - or use them as a stand-alone engagement on an existing
              product.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {addOns.map((addon, i) => {
              const AddIcon = addon.icon;
              return (
                <motion.div
                  key={addon.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="glass group flex h-full flex-col rounded-2xl border border-[var(--border)] p-6 transition-all hover:-translate-y-1 hover:border-[var(--border-strong)]"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--card-soft)] text-[var(--accent)]">
                    <AddIcon className="h-5 w-5" />
                  </div>
                  <h3 className="type-card-title mb-2 text-[var(--foreground)]">{addon.name}</h3>
                  <p className="type-body mb-5 flex-1 text-sm text-[var(--text-muted)]">
                    {addon.desc}
                  </p>
                  <p className="font-mono text-sm font-semibold text-[var(--accent)]">
                    {addon.price}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="site-section bg-[var(--home-band-bg)]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl"
          >
            <div className="mb-10 text-center">
              <p className="type-eyebrow mb-4">FAQ</p>
              <h2 className="type-section-title text-[var(--foreground)]">
                Pricing questions, answered
              </h2>
            </div>

            <div className="space-y-3">
              {pricingFaq.map((faq) => {
                const isOpen = openFaq === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`glass overflow-hidden rounded-2xl border transition-colors ${
                      isOpen
                        ? "border-[var(--border-strong)]"
                        : "border-[var(--border)]"
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                      className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-[var(--card-soft)]"
                      aria-expanded={isOpen}
                    >
                      <span className="type-card-title text-base text-[var(--foreground)]">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-[var(--accent)] transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-5 type-body text-[var(--text-muted)]">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="site-section">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass relative overflow-hidden rounded-[2rem] border border-[var(--border-strong)] p-10 text-center md:p-16"
          >
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[var(--accent)]/15 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-[var(--secondary)]/15 blur-3xl" />

            <div className="relative">
              <p className="type-eyebrow mb-4">Still deciding?</p>
              <h2 className="type-section-title mb-4 text-[var(--foreground)]">
                Not sure which plan fits your project?
              </h2>
              <p className="type-lead mx-auto mb-8 max-w-xl">
                Tell us about your idea in a 30-minute call. We&apos;ll recommend the right plan
                - or honestly tell you if we&apos;re not the right fit.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--button-gradient)] px-7 py-3.5 font-semibold text-white shadow-[var(--button-shadow)] transition-all hover:-translate-y-0.5"
              >
                Book free consultation
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
