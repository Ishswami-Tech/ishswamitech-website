"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Globe,
  Smartphone,
  Monitor,
  Brain,
  Cloud,
  Palette,
  Plug,
  Shield,
  ShoppingCart,
  Building2,
  ArrowRight,
  ArrowUpRight,
  Search,
  Layout,
  Code,
  TestTube,
  Rocket,
  HeadphonesIcon,
  Check,
} from "lucide-react";
import { services } from "@/data/services";
import { siteConfig } from "@/lib/site";

const iconMap: Record<string, React.ElementType> = {
  Globe,
  Smartphone,
  Monitor,
  Brain,
  Cloud,
  Palette,
  Plug,
  Shield,
  ShoppingCart,
  Building2,
};

const processSteps = [
  {
    icon: Search,
    title: "Discover",
    desc: "Understand your business, users, and the success metrics that actually matter.",
  },
  {
    icon: Layout,
    title: "Plan",
    desc: "Roadmap, architecture, and milestones - written down, agreed, and tracked.",
  },
  {
    icon: Palette,
    title: "Design",
    desc: "Wireframes, prototypes, and a visual system aligned with your brand.",
  },
  {
    icon: Code,
    title: "Build",
    desc: "Agile sprints with weekly demos. Production-grade from day one.",
  },
  {
    icon: TestTube,
    title: "Test",
    desc: "QA, security review, performance audits, and accessibility checks.",
  },
  {
    icon: Rocket,
    title: "Launch",
    desc: "Deploy, monitor, instrument analytics, and run the day-one checklist.",
  },
  {
    icon: HeadphonesIcon,
    title: "Support",
    desc: "Bug fixes, iteration, and continuous improvement on a clear retainer.",
  },
];

export default function ServicesPage() {
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
              <span className="text-[var(--foreground)]">Services</span>
            </nav>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid items-end gap-10 lg:grid-cols-[1.2fr_1fr]"
          >
            <div>
              <p className="type-eyebrow mb-4">{siteConfig.shortName} services</p>
              <h1 className="type-page-title mb-5 text-[var(--foreground)]">
                Software services, end-to-end and under one roof
              </h1>
              <p className="type-lead max-w-2xl">
                From idea to launch — and the long tail of iteration after. IshSwamiTech designs,
                engineers, deploys, and maintains modern digital products across every major
                platform.
              </p>
            </div>

            <div className="glass rounded-2xl border border-[var(--border)] p-6">
              <p className="type-eyebrow mb-3 text-[var(--secondary)]">10 capabilities</p>
              <p className="type-body text-[var(--foreground)]">
                One IshSwamiTech team, ten core capabilities. No outsourcing, no handoffs, no
                &ldquo;that&apos;s not our scope&rdquo; — just senior people who can take your project
                from zero to production.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORY NAV */}
      <section className="border-y border-[var(--border)] bg-[var(--home-band-bg)]">
        <div className="container mx-auto overflow-x-auto px-4">
          <div className="flex min-w-max gap-2 py-4">
            {services.map((service) => {
              const Icon = iconMap[service.icon] || Globe;
              return (
                <a
                  key={service.id}
                  href={`#${service.slug}`}
                  className="type-ui group inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-[var(--text-muted)] backdrop-blur-xl transition-all hover:border-[var(--border-strong)] hover:text-[var(--accent)]"
                >
                  <Icon
                    className="h-4 w-4 transition-colors"
                    style={{ color: service.color }}
                  />
                  {service.title}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="site-section">
        <div className="container mx-auto px-4">
          <div className="space-y-8">
            {services.map((service, i) => {
              const Icon = iconMap[service.icon] || Globe;
              const reverse = i % 2 === 1;
              return (
                <motion.article
                  key={service.id}
                  id={service.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="scroll-mt-24"
                >
                  <div className="glass relative overflow-hidden rounded-[2rem] border border-[var(--border)] p-7 transition-colors hover:border-[var(--border-strong)] md:p-10">
                    <div
                      className="absolute -right-20 -top-20 h-60 w-60 rounded-full blur-3xl opacity-50"
                      style={{ backgroundColor: `${service.color}1A` }}
                      aria-hidden
                    />

                    <div
                      className={`relative grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr] ${
                        reverse ? "lg:[&>*:first-child]:order-2" : ""
                      }`}
                    >
                      <div>
                        <div className="mb-5 flex items-center gap-4">
                          <div
                            className="flex h-14 w-14 items-center justify-center rounded-2xl"
                            style={{ backgroundColor: `${service.color}20` }}
                          >
                            <Icon className="h-7 w-7" style={{ color: service.color }} />
                          </div>
                          <span className="type-index text-[var(--text-muted)]">
                            0{i + 1} / {services.length}
                          </span>
                        </div>
                        <h2 className="type-section-title mb-3 text-[var(--foreground)]">
                          {service.title}
                        </h2>
                        <p className="type-body mb-6 text-[var(--text-muted)]">
                          {service.description}
                        </p>

                        <div className="mb-6">
                          <p className="type-band-label mb-3 text-[var(--accent)]">Stack</p>
                          <div className="flex flex-wrap gap-2">
                            {service.technologies.map((tech) => (
                              <span
                                key={tech}
                                className="type-tag rounded-md border border-[var(--border)] bg-[var(--card-soft)] px-2.5 py-1 text-[var(--foreground)]"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        <Link
                          href="/contact"
                          className="inline-flex items-center gap-2 rounded-full [background:var(--button-gradient)] px-5 py-2.5 text-sm font-semibold text-[var(--button-foreground)] shadow-[var(--button-shadow)] transition-all hover:-translate-y-0.5"
                        >
                          Get a quote <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </div>

                      <div>
                        <p className="type-band-label mb-4 text-[var(--accent)]">What&apos;s included</p>
                        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          {service.features.map((feature) => (
                            <li
                              key={feature}
                              className="type-body flex items-start gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)]"
                            >
                              <Check
                                className="mt-0.5 h-4 w-4 shrink-0"
                                style={{ color: service.color }}
                              />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="site-section bg-[var(--home-band-bg)]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <p className="type-eyebrow mb-4">How we work</p>
            <h2 className="type-section-title mb-4 text-[var(--foreground)]">
              A practical delivery process for serious product builds
            </h2>
            <p className="type-lead mx-auto max-w-2xl">
              Seven repeatable phases that keep projects on time, on budget, and on track for the
              outcomes you actually care about.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {processSteps.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="glass relative rounded-2xl border border-[var(--border)] p-6"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--card-soft)] text-[var(--accent)]">
                      <StepIcon className="h-5 w-5" />
                    </div>
                    <p className="type-index text-[var(--secondary)]">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                  </div>
                  <h3 className="type-card-title mb-2 text-[var(--foreground)]">{step.title}</h3>
                  <p className="type-body text-sm text-[var(--text-muted)]">{step.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HELP / CTA */}
      <section className="site-section">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass relative overflow-hidden rounded-[2rem] border border-[var(--border-strong)] p-10 md:p-16"
          >
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[var(--accent)]/15 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-[var(--secondary)]/15 blur-3xl" />

            <div className="relative grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
              <div>
                <p className="type-eyebrow mb-4">Not sure where to start?</p>
                <h2 className="type-section-title mb-4 text-[var(--foreground)]">
                  Book a free 30-min discovery call
                </h2>
                <p className="type-lead mb-8 max-w-xl">
                  Walk us through your idea, current state, or roadmap. We&apos;ll help you scope
                  the right phase - even if it&apos;s not with us.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-full [background:var(--button-gradient)] px-7 py-3.5 font-semibold text-[var(--button-foreground)] shadow-[var(--button-shadow)] transition-all hover:-translate-y-0.5"
                  >
                    Book free consultation <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--card)] px-7 py-3.5 font-semibold text-[var(--foreground)] transition-all hover:bg-[var(--card-soft)]"
                  >
                    See pricing <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <ul className="space-y-3">
                {[
                  "No sales pressure - just useful advice",
                  "Fixed-scope quotes if we're a fit",
                  "NDA-protected from the first email",
                ].map((item) => (
                  <li
                    key={item}
                    className="type-body flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 backdrop-blur-xl"
                  >
                    <span className="mt-1.5 inline-flex h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
