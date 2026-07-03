"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Target,
  Eye,
  Building2,
  Lightbulb,
  CheckCircle,
  Heart,
  ArrowUpRight,
  Users,
  Globe2,
  Award,
} from "lucide-react";
import { team } from "@/data/team";

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    desc: "We chase the new, but ship the proven - pairing AI-first thinking with tools your team can hire for.",
  },
  {
    icon: Eye,
    title: "Transparency",
    desc: "Honest timelines, public progress, and weekly demos. No status-meeting theatre, no end-of-quarter surprises.",
  },
  {
    icon: CheckCircle,
    title: "Craft & Quality",
    desc: "Typed, tested, observable code - and interfaces that feel obvious. Nothing gets shipped we wouldn't be proud of.",
  },
  {
    icon: Heart,
    title: "Client-First",
    desc: "Your roadmap, your business, your wins. We measure success by your KPIs, not our line items.",
  },
];

const milestones = [
  { year: "2026", title: "Ishswami Tech registered", detail: "Started as a Pune-based technology services business focused on practical software delivery." },
  { year: "Now", title: "Client-platform focus", detail: "Building websites, apps, payment flows, automation, and operational platforms for growing businesses." },
  { year: "Next", title: "Reliable delivery systems", detail: "Strengthening reusable engineering patterns, support processes, and production-ready platform components." },
];

const stats = [
  { icon: Users, value: "Focused", label: "Delivery model" },
  { icon: Globe2, value: "Pune", label: "India based" },
  { icon: Award, value: "2026", label: "Registered" },
  { icon: Sparkles, value: "Multi", label: "Domain capability" },
];

export default function AboutPage() {
  return (
    <div>
      {/* HERO */}
      <section className="page-hero relative">
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
              <span className="text-[var(--foreground)]">About</span>
            </nav>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid items-end gap-10 lg:grid-cols-[1.3fr_1fr]"
          >
            <div>
              <p className="type-eyebrow mb-4">About Ishswami Tech</p>
              <h1 className="type-page-title mb-5 text-[var(--foreground)]">
                We&apos;re builders, thinkers, and product-minded problem solvers.
              </h1>
              <p className="type-lead max-w-2xl">
                Ishswami Tech helps founders and growing teams turn ambitious
                ideas into shipped products. We blend practical product engineering, AI capability,
                and a design eye that respects both pixels and conversion rates.
              </p>
              <p className="type-body mt-4 max-w-2xl text-[var(--text-muted)]">
                Founder's name: Manisha Santosh Bhujbal
              </p>
            </div>

            <div className="glass rounded-2xl border border-[var(--border)] p-6">
              <p className="type-eyebrow mb-3 text-[var(--secondary)]">In one line</p>
              <p className="type-quote text-[var(--foreground)]">
                Premium engineering, design that converts, and a team that genuinely cares about
                your launch.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="site-section--tight border-y border-[var(--border)] bg-[var(--home-strip-bg)]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, i) => {
              const StatIcon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 rounded-2xl"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--card-soft)] text-[var(--accent)]">
                    <StatIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="type-stat text-2xl text-[var(--stat-number)]">{stat.value}</p>
                    <p className="type-stat-label text-[var(--text-muted)]">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="site-section">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-[var(--accent)]/15 to-[var(--secondary)]/15 blur-2xl" />
              <div className="glass relative overflow-hidden rounded-2xl border border-[var(--border-strong)] aspect-video">
                <Image
                  src="/Assets/Programmers_4.jpg"
                  alt="Ishswami Tech engineering team collaborating"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--card)] p-5 backdrop-blur-xl md:block">
                <p className="type-stat text-3xl text-[var(--accent)]">2026</p>
                <p className="type-stat-label">Registered in Pune</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="type-eyebrow mb-3">Our story</p>
              <h2 className="type-section-title mb-5 text-[var(--foreground)]">
                Born from a frustration with how software gets built
              </h2>
              <p className="type-body mb-4 text-[var(--text-muted)]">
                Ishswami Tech was started by a small team of engineers and designers who&apos;d seen
                one too many projects ship late, over budget, and with the soul drained out of
                them. We knew there was a better way to build - and we wanted to prove it.
              </p>
              <p className="type-body mb-8 text-[var(--text-muted)]">
                That conviction is still the engine: clear
                scope, focused execution, and software that actually moves your business
                forward. From SaaS platforms and AI features to mobile apps and full cloud
                migrations - if it&apos;s on your roadmap, it&apos;s in our wheelhouse.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--card-soft)] text-[var(--accent)]">
                    <Target className="h-5 w-5" />
                  </div>
                  <h3 className="type-card-title mb-1.5 text-[var(--foreground)]">Mission</h3>
                  <p className="type-body text-sm text-[var(--text-muted)]">
                    Build digital products that respect the user, the business, and the team that
                    has to maintain them.
                  </p>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--card-soft)] text-[var(--secondary)]">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h3 className="type-card-title mb-1.5 text-[var(--foreground)]">Vision</h3>
                  <p className="type-body text-sm text-[var(--text-muted)]">
                    A world where every great idea has the software to back it - and a team that
                    can ship it without melting down.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="site-section bg-[var(--home-band-bg)]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <p className="type-eyebrow mb-4">What guides us</p>
            <h2 className="type-section-title mb-4 text-[var(--foreground)]">Core values</h2>
            <p className="type-lead mx-auto max-w-2xl">
              Not poster slogans - actual operating principles you&apos;ll see in every sprint,
              demo, and standup.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => {
              const ValueIcon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="glass group h-full rounded-2xl border border-[var(--border)] p-6 transition-all hover:-translate-y-1 hover:border-[var(--border-strong)]"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--border-strong)] bg-[var(--card-soft)] text-[var(--accent)] transition-colors group-hover:bg-[var(--accent)]/15">
                    <ValueIcon className="h-5 w-5" />
                  </div>
                  <h3 className="type-card-title mb-2 text-[var(--foreground)]">{value.title}</h3>
                  <p className="type-body text-[var(--text-muted)]">{value.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="site-section">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
          >
            <div className="max-w-2xl">
              <p className="type-eyebrow mb-3">Delivery coverage</p>
              <h2 className="type-section-title text-[var(--foreground)]">A compact team model</h2>
              <p className="type-lead mt-3">
                The site presents the capabilities clients interact with most: scope, engineering,
                mobile delivery, AI integration, and support.
              </p>
            </div>
            <Link
              href="/contact"
              className="type-ui inline-flex items-center gap-2 text-[var(--accent)] transition-colors hover:text-[var(--link-emphasis)]"
            >
              Start a project
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {team.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass group h-full rounded-2xl border border-[var(--border)] p-5 transition-all hover:-translate-y-1 hover:border-[var(--border-strong)]"
              >
                <div className="relative mx-auto mb-4 aspect-square w-24 overflow-hidden rounded-2xl">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="96px"
                  />
                </div>
                <h3 className="type-card-title text-center text-base text-[var(--foreground)]">
                  {member.name}
                </h3>
                <p className="type-body mb-3 text-center text-sm text-[var(--text-muted)]">
                  {member.role}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* JOURNEY */}
      <section className="site-section bg-[var(--home-band-bg)]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <p className="type-eyebrow mb-4">Our journey</p>
            <h2 className="type-section-title mb-4 text-[var(--foreground)]">
              Milestones we&apos;re proud of
            </h2>
            <p className="type-lead mx-auto max-w-2xl">
              A straightforward path from registration to reliable client delivery.
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 hidden w-px bg-gradient-to-b from-[var(--accent)]/40 via-[var(--border)] to-transparent md:left-1/2 md:block" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className={`relative md:grid md:grid-cols-2 md:gap-12 ${
                    i % 2 === 0 ? "" : "md:[&>*:first-child]:col-start-2"
                  }`}
                >
                  <div className={`glass rounded-2xl border border-[var(--border)] p-6 ${
                    i % 2 === 1 ? "md:text-right" : ""
                  }`}>
                    <p className="type-stat mb-1 text-2xl text-[var(--accent)]">{m.year}</p>
                    <h3 className="type-card-title mb-1.5 text-[var(--foreground)]">{m.title}</h3>
                    <p className="type-body text-sm text-[var(--text-muted)]">{m.detail}</p>
                  </div>
                  <div
                    className="absolute left-3 top-6 hidden h-3 w-3 rounded-full border-2 border-[var(--background)] bg-[var(--accent)] md:left-1/2 md:block md:-translate-x-1/2"
                    aria-hidden
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="site-section site-section--ruled">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <p className="type-eyebrow mb-4">Capabilities</p>
            <h2 className="type-section-title mb-4 text-[var(--foreground)]">
              Platforms we build with
            </h2>
            <p className="type-lead mx-auto max-w-2xl">
              Practical tools and service areas used for client websites, apps, automations, and operations.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
            {[
              { name: "Cloud deployments", desc: "AWS, Azure, GCP, Vercel" },
              { name: "Web platforms", desc: "Next.js, React, APIs" },
              { name: "Mobile apps", desc: "Android, iOS, cross-platform" },
              { name: "AI workflows", desc: "Assistants, automation, search" },
            ].map((partner, i) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="glass flex items-center gap-4 rounded-2xl border border-[var(--border)] p-5 transition-colors hover:border-[var(--border-strong)]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--card-soft)] text-[var(--accent)]">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <p className="type-card-title text-sm text-[var(--foreground)]">{partner.name}</p>
                  <p className="type-body text-xs text-[var(--text-muted)]">{partner.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
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
            <div className="relative">
              <p className="type-eyebrow mb-4">Work with us</p>
              <h2 className="type-section-title mb-4 text-[var(--foreground)]">
                Let&apos;s build something worth talking about
              </h2>
              <p className="type-lead mx-auto mb-8 max-w-xl">
                Whether you&apos;re scoping a new product, modernizing an old one, or scaling a
                team - we&apos;d love to hear about it.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full [background:var(--button-gradient)] px-7 py-3.5 font-semibold text-[var(--button-foreground)] shadow-[var(--button-shadow)] transition-all hover:-translate-y-0.5"
                >
                  Start a conversation
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--card)] px-7 py-3.5 font-semibold text-[var(--foreground)] transition-all hover:bg-[var(--card-soft)]"
                >
                  Browse our services
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
