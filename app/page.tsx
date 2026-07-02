"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  Globe,
  Smartphone,
  Monitor,
  Brain,
  Cloud,
  Palette,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Rocket,
  Star,
  Search,
  Layout,
  Code,
  TestTube,
  HeadphonesIcon,
} from "lucide-react";
import { services } from "@/data/services";
import { testimonials } from "@/data/testimonials";
import { marqueeTech } from "@/data/techStack";
import AnimatedCounter from "@/components/AnimatedCounter";
import { absoluteUrl, siteConfig } from "@/lib/site";

const serviceIcons: Record<string, React.ElementType> = {
  Globe,
  Smartphone,
  Monitor,
  Brain,
  Cloud,
  Palette,
};

const differentiators = [
  {
    icon: Rocket,
    title: "Outcome-Focused Delivery",
    description:
      "Product and engineering ownership from discovery to launch - not ticket-takers waiting for direction.",
  },
  {
    icon: Search,
    title: "Search-Ready Foundation",
    description:
      "Performant pages, semantic structure, and conversion-aware UX baked into every build, so growth doesn't require a rewrite.",
  },
  {
    icon: ShieldCheck,
    title: "Scalable Architecture",
    description:
      "Modern, well-typed stacks and clean systems built for integrations, growth, and the features you will ship next.",
  },
];

const deliverySteps = [
  {
    phase: "Week 1",
    icon: Search,
    title: "Discover",
    detail: "Align on business goals, users, success metrics, and technical constraints before any code is written.",
  },
  {
    phase: "Week 2",
    icon: Layout,
    title: "Blueprint",
    detail: "Define the roadmap, interface direction, system architecture, and delivery milestones you can plan around.",
  },
  {
    phase: "Week 3+",
    icon: Code,
    title: "Build",
    detail: "Ship iteratively across design, engineering, and QA - with weekly demos so progress is visible from day one.",
  },
  {
    phase: "Launch",
    icon: Rocket,
    title: "Scale",
    detail: "Deploy with confidence: SEO checks, analytics, performance audits, and a support plan that actually responds.",
  },
];

const industries = [
  "SaaS & Platforms",
  "Fintech",
  "Healthtech",
  "E-commerce",
  "EdTech",
  "Logistics",
  "Real Estate",
  "Media & Creator",
];

export default function HomePage() {
  const reduceMotion = useReducedMotion();
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    image: absoluteUrl(siteConfig.ogImage),
    areaServed: "Worldwide",
    serviceType: services.map((service) => service.title),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* HERO */}
      <section className="relative min-h-[100svh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/Assets/hero_img.jpg"
            alt="Abstract technology backdrop representing modern product delivery"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-[#040814]/82" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#040814] via-[#040814]/70 to-[#040814]/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(61,217,235,0.15),transparent_45%),radial-gradient(circle_at_85%_70%,rgba(236,72,153,0.12),transparent_50%)]" />

        <div className="container mx-auto px-4 pt-32 pb-20 relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <div className="type-ui mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-[#d7e5f6] backdrop-blur-xl">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3dd9eb] opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3dd9eb]" />
                </span>
<<<<<<< Updated upstream
                Accepting new projects · Senior-led delivery
=======
                IshSwamiTech · Accepting Q3 projects · Senior-led delivery
>>>>>>> Stashed changes
              </div>

              <h1 className="type-hero mb-6 text-white">
                IshSwamiTech builds software that{" "}
                <span className="gradient-text">looks sharp, loads fast,</span>
                <br className="hidden md:block" /> and{" "}
                <span className="gradient-text">earns its keep</span>.
              </h1>
              <p className="type-lead mb-10 max-w-xl text-[#c4d4e8] md:text-xl md:leading-relaxed">
<<<<<<< Updated upstream
                We design and build websites, SaaS platforms, mobile apps, AI features, and cloud
                systems for ambitious founders and growing teams - with the engineering depth to
                ship, and the product taste to make it feel inevitable.
=======
                At IshSwamiTech, we design and build websites, SaaS platforms, mobile apps, AI
                features, and cloud systems for ambitious founders and growing teams — with the
                engineering depth to ship, and the product taste to make it feel inevitable.
>>>>>>> Stashed changes
              </p>

              <div className="mb-12 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <Link
                  href="/contact"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-7 py-3.5 font-semibold text-[var(--button-foreground)] shadow-[var(--button-shadow)] transition-all hover:-translate-y-0.5 hover:bg-[var(--link-emphasis)]"
                >
                  Start your project
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-7 py-3.5 font-semibold text-white backdrop-blur-xl transition-all hover:border-white/40 hover:bg-white/[0.08]"
                >
                  Explore services
                </Link>
              </div>

              <div className="grid max-w-xl grid-cols-1 gap-3 text-[#d7e5f6] sm:grid-cols-3">
                {[
                  "Brand-first visual systems",
                  "SEO-aware implementation",
                  "Full-stack under one roof",
                ].map((item) => (
                  <div
                    key={item}
                    className="type-ui flex items-start gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 backdrop-blur-xl"
                  >
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#74f0ff]" aria-hidden />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="relative"
            >
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-[var(--accent)]/20 via-transparent to-[var(--secondary)]/20 blur-2xl" />
              <div className="relative rounded-[2rem] border border-white/15 bg-[#071321]/70 p-6 backdrop-blur-2xl md:p-8">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <p className="type-eyebrow text-[#74f0ff]">Delivery Snapshot</p>
                    <p className="type-panel-title mt-2 text-white">
                      Premium execution, zero agency clutter
                    </p>
                  </div>
                  <span className="type-ui shrink-0 rounded-full border border-[#ffb547]/30 bg-[#ffb547]/10 px-3 py-1 text-xs text-[#ffd79b]">
                    Senior-led
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "2026", label: "Founded in Pune" },
                    { value: "6+", label: "Core service areas" },
                    { value: "3", label: "Web, mobile, cloud" },
                    { value: "1", label: "Focused product team" },
                  ].map((metric) => (
                    <div
                      key={metric.label}
                      className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-4"
                    >
                      <p className="type-stat text-3xl text-white">{metric.value}</p>
                      <p className="type-stat-label mt-1.5 normal-case tracking-normal text-[#9db4ca]">
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-[#0a2033] to-[#08111d] p-5">
                  <p className="type-eyebrow text-[#ffcc73]">What you get</p>
                  <div className="mt-4 space-y-3">
                    {[
                      "Conversion-aware interface design",
                      "Semantic, crawlable page structure",
                      "Performance-minded media decisions",
                      "Launch support with analytics ready",
                    ].map((item) => (
                      <div
                        key={item}
                        className="type-body flex items-start gap-3 text-sm text-[#d5e3f2]"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#3dd9eb]" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.a
          href="#trust-band"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]"
          aria-label="Scroll to next section"
        >
          <span className="type-ui">Scroll</span>
          <span className="block h-8 w-5 rounded-full border border-white/30">
            <span className="mx-auto mt-1.5 block h-2 w-1 animate-bounce rounded-full bg-white/60" />
          </span>
        </motion.a>
      </section>

      {/* TRUST MARQUEE */}
      <section
        id="trust-band"
        className="site-section--tight overflow-hidden border-y border-[var(--home-marquee-border)] bg-[var(--home-band-bg)] backdrop-blur-xl"
      >
        <p className="type-band-label mb-6 px-4 text-center">Technologies we engineer with</p>
        {reduceMotion ? (
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-4 px-4">
            {marqueeTech.map((tech) => (
              <span
                key={tech.name}
                className="type-tech-row flex items-center gap-2 text-[var(--text-muted)]"
              >
                <tech.icon className="h-5 w-5 shrink-0" aria-hidden />
                {tech.name}
              </span>
            ))}
          </div>
        ) : (
          <motion.div
            className="flex gap-12 whitespace-nowrap"
            animate={{ x: [0, -1920] }}
            transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          >
            {[...marqueeTech, ...marqueeTech].map((tech, i) => (
              <span
                key={`${tech.name}-${i}`}
                className="type-tech-row flex items-center gap-2 text-[var(--text-muted)] transition-colors hover:text-[var(--link-emphasis)]"
              >
                <tech.icon className="h-5 w-5 shrink-0" aria-hidden />
                {tech.name}
              </span>
            ))}
          </motion.div>
        )}
      </section>

      {/* WHY US */}
      <section className="site-section site-section--ruled">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
          >
            <div className="max-w-2xl">
              <p className="type-eyebrow mb-3">Why teams choose us</p>
              <h2 className="type-section-title text-[var(--foreground)]">
                A cleaner delivery model - with stronger product thinking
              </h2>
            </div>
            <p className="type-lead max-w-xl">
              Clear scope, thoughtful UX, and engineering you can grow with - so stakeholders see
              real progress every week and customers get a product that feels intentional.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {differentiators.map((item, index) => {
              const ItemIcon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="glass group relative overflow-hidden rounded-[1.75rem] border border-[var(--border)] p-7 transition-all hover:border-[var(--border-strong)] hover:-translate-y-1"
                >
                  <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[var(--accent)]/10 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative">
                    <div className="mb-5 flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--border-strong)] bg-[var(--card-soft)] text-[var(--accent)]">
                        <ItemIcon className="h-5 w-5" />
                      </div>
                      <p className="type-index text-[var(--secondary)]">0{index + 1}</p>
                    </div>
                    <h3 className="type-block-title mb-3 text-[var(--foreground)]">
                      {item.title}
                    </h3>
                    <p className="type-body text-[var(--text-muted)]">{item.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="site-section">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"
          >
            <div className="max-w-2xl">
              <p className="type-eyebrow mb-3">What we build</p>
              <h2 className="type-section-title text-[var(--foreground)]">
                End-to-end software, designed and delivered in-house
              </h2>
            </div>
            <Link
              href="/services"
              className="type-ui inline-flex items-center gap-2 text-[var(--accent)] transition-colors hover:text-[var(--link-emphasis)]"
            >
              View all services
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((service, i) => {
              const Icon = serviceIcons[service.icon] || Globe;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link href={`/services#${service.slug}`} className="block h-full">
                    <div className="glass group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--border)] p-7 transition-all hover:-translate-y-1 hover:border-[var(--border-strong)] hover:shadow-[var(--button-shadow)]">
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                      <div
                        className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${service.color}20` }}
                      >
                        <Icon className="h-6 w-6" style={{ color: service.color }} />
                      </div>
                      <h3 className="type-card-title mb-2 transition-colors group-hover:text-[var(--accent)]">
                        {service.title}
                      </h3>
                      <p className="type-body mb-5 flex-1 text-[var(--text-muted)]">
                        {service.shortDesc}
                      </p>
                      <div className="mb-4 flex flex-wrap gap-1.5">
                        {service.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="type-tag rounded-md border border-[var(--border)] bg-[var(--card-soft)] px-2 py-0.5 text-[var(--text-muted)]"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <span className="type-ui flex items-center gap-1 text-[var(--accent)]">
                        Explore <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
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
            <p className="type-eyebrow mb-4">Proven process</p>
            <h2 className="type-section-title text-[var(--foreground)]">
              A simple path from idea to launch
            </h2>
            <p className="type-lead mx-auto mt-4 max-w-2xl">
              No mystery, no surprises. Aligned goals, a concrete plan, iterative build cycles,
              and a launch checklist that covers performance and discovery.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {deliverySteps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="glass relative rounded-[1.75rem] border border-[var(--border)] p-6"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--card-soft)] text-[var(--accent)]">
                      <StepIcon className="h-5 w-5" />
                    </div>
                    <p className="type-index text-[var(--secondary)]">{step.phase}</p>
                  </div>
                  <h3 className="type-block-title mb-3 text-[var(--foreground)]">{step.title}</h3>
                  <p className="type-body text-[var(--text-muted)]">{step.detail}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="site-section--tight border-y border-[var(--border)] bg-[var(--home-strip-bg)]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {[
              { end: 2026, suffix: "", label: "Founded" },
              { end: 6, suffix: "+", label: "Service areas" },
              { end: 3, suffix: "", label: "Primary platforms" },
              { end: 1, suffix: "", label: "Focused team" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <p className="type-stat mb-1 text-3xl text-[var(--stat-number)] md:text-5xl">
                  <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                </p>
                <p className="type-stat-label text-[var(--text-muted)]">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="site-section site-section--ruled">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <p className="type-eyebrow mb-4">Industries we serve</p>
            <h2 className="type-section-title text-[var(--foreground)]">
              Domain depth across the products people actually use
            </h2>
          </motion.div>

          <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-3">
            {industries.map((industry, i) => (
              <motion.span
                key={industry}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="type-ui rounded-full border border-[var(--border)] bg-[var(--card)] px-5 py-2.5 text-[var(--foreground)] backdrop-blur-xl transition-colors hover:border-[var(--border-strong)] hover:text-[var(--accent)]"
              >
                {industry}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="site-section bg-[var(--home-elevated-bg)]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <p className="type-eyebrow mb-4">Client stories</p>
            <h2 className="type-section-title mb-4 text-[var(--foreground)]">
              Teams that ship with us, again and again
            </h2>
            <p className="type-lead mx-auto max-w-2xl">
              Feedback themes from the type of client work we focus on: clarity, speed, and practical execution.
            </p>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            {testimonials.slice(0, 3).map((t, i) => (
              <motion.figure
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass relative flex h-full flex-col rounded-[1.75rem] border border-[var(--border)] p-7"
              >
                <div className="mb-4 flex items-center gap-1">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star
                      key={idx}
                      className="h-4 w-4 fill-[var(--warning)] text-[var(--warning)]"
                      aria-hidden
                    />
                  ))}
                </div>
                <blockquote className="type-body mb-6 flex-1 text-[var(--foreground)]">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="flex items-center gap-3 border-t border-[var(--border)] pt-5">
                  <div className="relative aspect-square h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-[var(--card-soft)]">
                    <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="type-card-title text-base text-[var(--foreground)]">{t.name}</p>
                    <p className="type-body text-sm text-[var(--text-muted)]">
                      {t.role}, {t.company}
                    </p>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="site-section site-section--ruled">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <p className="type-eyebrow mb-4">Our stack</p>
            <h2 className="type-section-title mb-4 text-[var(--foreground)]">
              Modern, battle-tested tooling
            </h2>
            <p className="type-lead mx-auto max-w-2xl">
              We pick the right tool for the job - not the trendy one. Production-grade frameworks
              your team can actually hire for.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {[
              { label: "Frontend", techs: ["React", "Next.js", "Vue", "TypeScript"] },
              { label: "Backend", techs: ["Node.js", "Python", "Laravel", "FastAPI"] },
              { label: "Mobile", techs: ["Flutter", "React Native", "Swift", "Kotlin"] },
              { label: "Database", techs: ["PostgreSQL", "MongoDB", "Firebase", "Redis"] },
              { label: "Cloud / Ops", techs: ["AWS", "Azure", "GCP", "Docker"] },
              { label: "AI / ML", techs: ["TensorFlow", "PyTorch", "OpenAI"] },
            ].map((group, i) => (
              <motion.div
                key={group.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl border border-[var(--border)] p-5 transition-colors hover:border-[var(--border-strong)]"
              >
                <p className="type-band-label mb-3 text-left text-[var(--accent)]">{group.label}</p>
                <ul className="flex flex-col gap-1.5">
                  {group.techs.map((tech) => (
                    <li
                      key={tech}
                      className="type-body text-sm text-[var(--text-muted)]"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="site-section">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[2rem] border border-[var(--border-strong)] bg-gradient-to-br from-[var(--card)] via-[var(--card)] to-[var(--card-soft)] p-10 backdrop-blur-xl md:p-16"
          >
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[var(--accent)]/15 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-[var(--secondary)]/15 blur-3xl" />

            <div className="relative grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div>
                <p className="type-eyebrow mb-4">Let&apos;s build</p>
                <h2 className="type-section-title mb-4 text-[var(--foreground)]">
                  Ready to turn your vision into a product that ships?
                </h2>
                <p className="type-lead mb-8 max-w-xl">
                  Tell us about your project in a 30-minute discovery call. You&apos;ll walk away
                  with a concrete scope, timeline, and an honest sense of what it&apos;ll take.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-full [background:var(--button-gradient)] px-7 py-3.5 font-semibold text-[var(--button-foreground)] shadow-[var(--button-shadow)] transition-all hover:-translate-y-0.5"
                  >
                    Book a discovery call
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--card)] px-7 py-3.5 font-semibold text-[var(--foreground)] transition-all hover:bg-[var(--card-soft)]"
                  >
                    See pricing
                  </Link>
                </div>
              </div>

              <ul className="grid gap-3">
                {[
                  { icon: HeadphonesIcon, text: "Free 30-minute discovery" },
                  { icon: TestTube, text: "Honest, fixed-scope quotes" },
                  { icon: ShieldCheck, text: "NDA signed before kickoff" },
                ].map(({ icon: ItemIcon, text }) => (
                  <li
                    key={text}
                    className="type-body flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 backdrop-blur-xl"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--card-soft)] text-[var(--accent)]">
                      <ItemIcon className="h-4 w-4" />
                    </div>
                    {text}
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
