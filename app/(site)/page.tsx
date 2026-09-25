import Link from "next/link";
import Image from "next/image";
import {
  Globe,
  Smartphone,
  Monitor,
  Brain,
  Cloud,
  Palette,
  ArrowRight,
  ArrowUpRight,
  Check,
  ShieldCheck,
  Star,
  Headphones,
  FileCheck2,
} from "lucide-react";
import { services } from "@/data/services";
import { testimonials } from "@/data/testimonials";
import { marqueeTech } from "@/data/techStack";
import {
  companyStats,
  deliverySteps,
  differentiators,
  engagementIncludes,
  heroHighlights,
  industries,
  stackGroups,
} from "@/data/home";
import { Container } from "@/components/ui/container";
import { Section, SectionHeader } from "@/components/ui/section";
import { Card, CardIcon } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge, StatusDot, TechBadge } from "@/components/ui/badge";
import { techIcon } from "@/lib/tech-icons";
import { CtaBand } from "@/components/ui/cta-band";
import { MediaFrame } from "@/components/ui/media-frame";
import { AiCore } from "@/components/ui/ai-core";
import { Reveal } from "@/components/motion/reveal";
import { DrawLine } from "@/components/motion/draw-line";
import { Parallax } from "@/components/motion/parallax";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { Tilt } from "@/components/motion/tilt";
import { WordReveal } from "@/components/motion/word-reveal";
import AnimatedCounter from "@/components/ui/animated-counter";
import { absoluteUrl, siteConfig } from "@/lib/site";

const serviceIcons: Record<string, React.ElementType> = {
  Globe,
  Smartphone,
  Monitor,
  Brain,
  Cloud,
  Palette,
};

const ctaAssurances = [
  { icon: Headphones, text: "Free 30-Minute Discovery" },
  { icon: FileCheck2, text: "Honest, Fixed-Scope Quotes" },
  { icon: ShieldCheck, text: "NDA Signed Before Kickoff" },
];

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

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      {/* ---------------------------------------------------------------- HERO */}
      <section
        data-scheme="dark"
        className="relative isolate flex min-h-[86svh] items-center overflow-hidden bg-[var(--background)]"
      >
        {/*
          The artwork is the section's backdrop rather than a column of its
          own, so no <AnimatedBackground> here — anything behind a full-bleed
          opaque image is paid for and never seen.
        */}
        {/* The scrims travel with the artwork so their alignment over it never
            shifts. What the lift exposes at the bottom of the section is the
            page colour — which is exactly what the lowest scrim resolves to,
            so the seam it would otherwise leave is invisible. */}
        {/* z-0, not -z-10. The section now paints its own dark background (it
            declares the scheme), and `isolate` means a negative z-index child
            renders *behind* that background — which silently hid the artwork.
            Sitting at 0 keeps it above the fill and below the copy at z-10. */}
        <Parallax aria-hidden className="absolute inset-0 z-0">
          {/*
            Cyan particle field. Unsplash, free licence for commercial use
            (photo r5lbaK3fDaM). It replaced a laptop render, and the swap
            simplifies everything below it: a render has a subject that has to
            survive the crop, so it needed `object-contain` and a right anchor
            at desktop plus a different fit on phones. A texture has no subject
            — it covers at every width and crops wherever it likes.
          */}
          <Image
            src="/Assets/hero-particles.webp"
            alt=""
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            placeholder="blur"
            blurDataURL="data:image/webp;base64,UklGRjgAAABXRUJQVlA4ICwAAADQAQCdASoQAAkAA8BgJQBOgCHgNO3mAAD+95qu2tdha+rRrjbVejDVvbQAAA=="
            /* Anchored right of centre so the densest part of the wave sits
               opposite the copy instead of behind it. */
            className="object-cover object-[70%_50%]"
          />

          {/*
            Hue correction. The source is lit teal-cyan, which read as a foreign
            accent next to an indigo/violet brand ramp — it was the only place
            on the page with its own colour temperature. `mix-blend-color`
            replaces the hue while keeping the photograph's luminance, so the
            particles keep their shape and glow and simply arrive in-palette.
          */}
          <div
            className="absolute inset-0 mix-blend-color"
            style={{ backgroundColor: "var(--indigo-500)", opacity: 0.62 }}
          />

          {/*
            Readability scrim. Far lighter than the previous artwork needed —
            this source is already near-black where the headline sits, so the
            old 0.94 wash would have flattened it to a plain dark rectangle and
            thrown the image away. 0.82 down the left still clears the contrast
            floor for white type by a wide margin.
          */}
          <div
            className="absolute inset-0 lg:hidden"
            style={{
              background:
                "linear-gradient(to bottom, rgb(var(--scrim-rgb) / 0.88) 0%, rgb(var(--scrim-rgb) / 0.62) 45%, rgb(var(--scrim-rgb) / 0.9) 100%)",
            }}
          />
          <div
            className="absolute inset-0 hidden lg:block"
            style={{
              background:
                "linear-gradient(to right, rgb(var(--scrim-rgb) / 0.82) 0%, rgb(var(--scrim-rgb) / 0.66) 34%, rgb(var(--scrim-rgb) / 0.3) 58%, rgb(var(--scrim-rgb) / 0.05) 82%, rgb(var(--scrim-rgb) / 0) 100%)",
            }}
          />

          {/* Hands off to the page colour so the next section doesn't begin
              with a visible horizontal seam, and darkens the band the proof
              row sits in — the horizontal scrim above has faded out by then. */}
          <div
            className="absolute inset-x-0 bottom-0 h-56 lg:h-72"
            style={{
              background:
                "linear-gradient(to top, var(--background) 22%, rgb(var(--scrim-rgb) / 0.82) 55%, rgb(var(--scrim-rgb) / 0.35) 80%, transparent)",
            }}
          />
        </Parallax>

        {/* The animated mark, in the band of empty artwork to the right of the
            copy. Absolutely positioned rather than a grid cell so it can not
            affect the height of the hero or the position of the proof row —
            and so it can bleed past the container's right gutter, which is what
            keeps it feeling like part of the backdrop rather than a boxed-in
            illustration. Hidden below lg, where there is no space beside the
            copy for it to occupy. */}
        {/* -translate-y-[54%] rather than -1/2: the hero's optical centre sits
            above its geometric one, because the proof row weights the bottom
            third. Lifting it by that 4% lines the chip up with the headline
            instead of with the middle of the box. */}
        <AiCore className="absolute right-[1%] top-1/2 z-0 hidden w-[36vw] max-w-[34rem] -translate-y-[54%] lg:block xl:right-[5%] xl:w-[33vw]" />

        <Container className="relative z-10 pb-12 pt-28">
          <div className="max-w-xl lg:max-w-[35rem] xl:max-w-[39rem]">
            <Reveal immediate variant="fade">
              <p className="type-ui mb-8 inline-flex items-center gap-2.5 rounded-[var(--radius-pill)] border border-[var(--border)] bg-[var(--surface-glass)] px-3.5 py-1.5 text-[var(--text-secondary)] backdrop-blur-md">
                <StatusDot />
                Accepting New Projects · Senior-Led Delivery
              </p>
            </Reveal>

            {/* Word-by-word rather than a single <Reveal>: this is the first
                thing on the page and the only place worth spending that much
                animation on. Everything below it still uses the shared fade. */}
            <h1 className="type-hero mb-6 text-[var(--foreground)]">
              <WordReveal
                delay={0.06}
                segments={[
                  { text: "Software That" },
                  { text: "Looks Sharp, Loads Fast,", accent: true },
                  { text: "and Earns Its Keep." },
                ]}
              />
            </h1>

            <Reveal immediate delay={0.12}>
              <p className="type-lead mb-10 max-w-xl">
                {siteConfig.shortName} designs and builds websites, SaaS platforms, mobile apps, AI
                features, and cloud systems for ambitious founders and growing teams — with the
                engineering depth to ship and the product taste to make it feel inevitable.
              </p>
            </Reveal>

            <Reveal immediate delay={0.18}>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button href="/contact" size="lg">
                  Start Your Project
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </Button>
                <Button href="/services" variant="ghost" size="lg">
                  Explore Services
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Proof row spanning the full width beneath the copy, so the five
              points read as one band rather than a column of chips. */}
          <Stagger
            as="ul"
            immediate
            delay={0.24}
            gap={0.05}
            className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:mt-12 lg:grid-cols-5"
          >
            {heroHighlights.map((item) => (
              <StaggerItem as="li" key={item.title}>
                <item.icon
                  className="mb-3 h-5 w-5 text-[var(--accent)]"
                  strokeWidth={1.75}
                  aria-hidden
                />
                {/* Deliberately not a heading: five <h2>s here would sit above
                    every real section heading in the document outline. */}
                <p className="type-ui mb-1.5 text-[var(--foreground)]">{item.title}</p>
                <p className="text-[var(--text-sm)] leading-[var(--leading-normal)] text-[var(--text-tertiary)]">
                  {item.description}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* ------------------------------------------------------- TECH MARQUEE */}
      <section
        aria-labelledby="tech-marquee-heading"
        className="site-section--tight relative overflow-hidden border-y border-[var(--border)] bg-[var(--surface)]"
      >
        <h2 id="tech-marquee-heading" className="type-band-label mb-6 text-center">
          Technologies We Engineer With
        </h2>
        {/* Edge fade so items enter and leave rather than clipping at the border. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[var(--surface)] to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[var(--surface)] to-transparent"
        />
        <div className="marquee gap-12">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0 gap-12 pr-12" aria-hidden={copy === 1}>
              {marqueeTech.map((tech) => (
                <li
                  key={tech.name}
                  className="type-tech-row flex items-center gap-2 whitespace-nowrap text-[var(--text-tertiary)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--foreground)]"
                >
                  <tech.icon className="h-4 w-4 shrink-0" aria-hidden />
                  {tech.name}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </section>

      {/* -------------------------------------------------------------- WHY US */}
      <Section>
        <SectionHeader
          eyebrow="Why Teams Choose Us"
          title="A Cleaner Delivery Model, With Stronger Product Thinking"
          aside={
            <p className="type-lead max-w-xl">
              Clear scope, thoughtful UX, and engineering you can grow with — so stakeholders see
              real progress every week and customers get a product that feels intentional.
            </p>
          }
        />

        <Stagger className="grid gap-5 md:grid-cols-3">
          {differentiators.map((item, index) => (
            <StaggerItem key={item.title} className="h-full">
              <Tilt className="h-full">
                <Card tone="glass" interactive padding="none" className="h-full p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <CardIcon>
                      <item.icon className="h-5 w-5" aria-hidden />
                    </CardIcon>
                    <span className="type-index">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="type-block-title mb-2.5 text-[var(--foreground)]">{item.title}</h3>
                  <p className="type-body text-[var(--text-secondary)]">{item.description}</p>
                </Card>
              </Tilt>
            </StaggerItem>
          ))}
        </Stagger>

        {/* Displaced from the hero when the artwork took that column. It sits
            here because "how we engage" answers the question the three cards
            above raise, and the fixed-price promise is too concrete to drop. */}
        <Reveal className="mt-5">
          <Card tone="glass" interactive padding="none" className="p-6 lg:p-7">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="type-eyebrow">How We Engage</p>
                <p className="type-panel-title mt-1.5 text-[var(--foreground)]">
                  Premium Execution, Zero Agency Clutter
                </p>
              </div>
              <Badge tone="gradient" className="shrink-0">
                Senior-Led
              </Badge>
            </div>

            <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              {engagementIncludes.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-raised)] px-3.5 py-3 text-[var(--text-base)] leading-[var(--leading-snug)] text-[var(--text-secondary)]"
                >
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent)]" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-5 border-t border-[var(--border)] pt-4 text-[var(--text-base)] text-[var(--text-tertiary)]">
              Every engagement starts with a written scope and a fixed-price quote before any code
              is written.
            </p>
          </Card>
        </Reveal>
      </Section>

      {/* ------------------------------------------------------------ SERVICES */}
      <Section tone="ruled">
        <SectionHeader
          eyebrow="What We Build"
          title="End-to-End Software, Designed and Delivered In-House"
          aside={
            <Link
              href="/services"
              className="type-ui group inline-flex items-center gap-1.5 text-[var(--accent)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--accent-strong)]"
            >
              View All Services
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-[var(--duration-fast)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden
              />
            </Link>
          }
        />

        <Stagger as="ul" className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((service) => {
            const Icon = serviceIcons[service.icon] ?? Globe;
            return (
              <StaggerItem as="li" key={service.id} className="h-full">
                <Link href={`/services#${service.slug}`} className="block h-full">
                  <Card
                    interactive
                    padding="none"
                    className="flex h-full flex-col overflow-hidden"
                    tone="solid"
                  >
                    {/* Duotoned to the service's own accent, which is what keeps
                        six different stock sources reading as one set. */}
                    <MediaFrame
                      src={service.image}
                      alt=""
                      ratio="wide"
                      tint={service.color}
                      strength={0.5}
                      framed={false}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="border-b border-[var(--border)]"
                    />

                    <div className="flex flex-1 flex-col p-5 md:p-6">
                    <CardIcon tint={service.color} className="mb-5">
                      <Icon className="h-5 w-5" aria-hidden />
                    </CardIcon>
                    <h3 className="type-card-title mb-2 text-[var(--foreground)] transition-colors duration-[var(--duration-fast)] group-hover/card:text-[var(--accent)]">
                      {service.title}
                    </h3>
                    <p className="type-body mb-5 flex-1 text-[var(--text-secondary)]">
                      {service.shortDesc}
                    </p>
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {service.technologies.slice(0, 3).map((tech) => (
                        <TechBadge key={tech} name={tech} />
                      ))}
                    </div>
                    <span className="type-ui flex items-center gap-1 text-[var(--accent)]">
                      Explore
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-[var(--duration-fast)] group-hover/card:translate-x-1"
                        aria-hidden
                      />
                    </span>
                    </div>
                  </Card>
                </Link>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Section>

      {/* ------------------------------------------------------------- PROCESS */}
      <Section tone="band" className="relative overflow-hidden">
        <SectionHeader
          align="center"
          eyebrow="Proven Process"
          title="A Simple Path From Idea to Launch"
          lead="No mystery, no surprises. Aligned goals, a concrete plan, iterative build cycles, and a launch checklist that covers performance and discovery."
        />

        {/* Connector behind the row. The cards are opaque, so what shows is a
            lit segment bridging each gutter at icon height — enough to read the
            four steps as one path. Only from lg, where they share a row. */}
        <div className="relative">
          <DrawLine
            delay={0.15}
            className="absolute inset-x-8 top-[2.875rem] hidden h-px opacity-50 [background-image:var(--gradient-primary)] lg:block"
          />

          <Stagger as="ol" className="relative grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {deliverySteps.map((step) => (
              <StaggerItem as="li" key={step.title}>
                <Card tone="solid" padding="md" className="h-full">
                  <div className="mb-5 flex items-center justify-between">
                    <CardIcon>
                      <step.icon className="h-5 w-5" aria-hidden />
                    </CardIcon>
                    <span className="type-index">{step.phase}</span>
                  </div>
                  <h3 className="type-block-title mb-2.5 text-[var(--foreground)]">{step.title}</h3>
                  <p className="type-body text-[var(--text-secondary)]">{step.detail}</p>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Section>

      {/* --------------------------------------------------------- STATS STRIP */}
      <section className="site-section--tight border-b border-[var(--border)] bg-[var(--surface)]">
        <Container>
          <Stagger as="dl" className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {companyStats.map((stat) => (
              <StaggerItem key={stat.label}>
                <dd className="type-stat mb-1.5 text-4xl md:text-5xl">
                  <span className="gradient-text">
                    {stat.count !== undefined ? (
                      <AnimatedCounter end={stat.count} suffix={stat.suffix} />
                    ) : (
                      stat.value
                    )}
                  </span>
                </dd>
                <dt className="type-stat-label">{stat.label}</dt>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* ------------------------------------------------------------ SHOWCASE */}
      <Section tone="ruled">
        <SectionHeader
          eyebrow="Inside the Work"
          title="Craft You Can See, Engineering You Can Audit"
          aside={
            <p className="type-lead max-w-xl">
              Interface, intelligence and infrastructure are one job here, not three vendors — which
              is why the seams between them never end up being your problem.
            </p>
          }
        />

        {/* Deliberately unequal: a 3-up of identical tiles is the stock agency
            grid. One dominant frame with two supporting ones gives the band a
            subject instead of an inventory. */}
        <Stagger className="grid gap-5 lg:grid-cols-3">
          {/* The laptop render that used to run the hero. It reads better here
              than it did up there: a literal product shot is the right thing to
              show under "craft you can see", and it no longer has to compete
              with a headline sitting on top of it. Its own violet is close
              enough to the brand ramp that it takes almost no tint. */}
          <StaggerItem className="lg:col-span-2">
            <MediaFrame
              src="/Assets/hero-visual.webp"
              alt="A product build in progress — editor, analytics and performance panels side by side"
              ratio="video"
              tint="var(--violet-500)"
              strength={0.22}
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="h-full"
            >
              <p className="type-eyebrow mb-1.5">Product Engineering</p>
              <p className="type-panel-title text-[var(--foreground)]">
                Interface, API and infrastructure shipped as one system
              </p>
            </MediaFrame>
          </StaggerItem>

          <StaggerItem className="flex flex-col gap-5">
            <MediaFrame
              src="/Assets/double-exposure-caucasian-man-virtual-reality-vr-headset-is-presumably-gamer-hacker-cracking-code-into-secure-network-server-with-lines-code.jpg"
              alt="Source code projected across a developer during a security review"
              ratio="square"
              tint="var(--cyan-400)"
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="flex-1"
            >
              <p className="type-ui text-[var(--foreground)]">Security &amp; QA From Day One</p>
            </MediaFrame>
            <MediaFrame
              src="/Assets/aiml.jpg"
              alt="An AI assistant surface running alongside a build review"
              ratio="square"
              tint="var(--indigo-400)"
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="flex-1"
            >
              <p className="type-ui text-[var(--foreground)]">AI Wired Into the Product</p>
            </MediaFrame>
          </StaggerItem>
        </Stagger>
      </Section>

      {/* ---------------------------------------------------------- INDUSTRIES */}
      <Section>
        <SectionHeader
          align="center"
          eyebrow="Industries We Serve"
          title="Domain Depth Across the Products People Actually Use"
        />

        <Stagger as="ul" gap={0.035} className="mx-auto flex max-w-4xl flex-wrap justify-center gap-2.5">
          {industries.map((industry) => (
            <StaggerItem as="li" key={industry} variant="scale">
              <span className="type-ui block rounded-[var(--radius-pill)] border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-2 text-[var(--text-secondary)] transition-[color,border-color,translate] duration-[var(--duration-fast)] hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:text-[var(--foreground)] motion-reduce:transform-none">
                {industry}
              </span>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* -------------------------------------------------------- TESTIMONIALS */}
      <Section tone="elevated">
        <SectionHeader
          align="center"
          eyebrow="Client Feedback"
          title="What Clients Say About Working With Us"
          lead="Recurring themes from the kind of work we focus on: clarity, speed, and practical execution."
        />

        <Stagger as="ul" className="grid gap-5 lg:grid-cols-3">
          {testimonials.slice(0, 3).map((testimonial) => (
            <StaggerItem as="li" key={testimonial.id} className="h-full">
              <figure
                data-spotlight=""
                className="glass spotlight flex h-full flex-col rounded-[var(--radius-2xl)] p-6"
              >
                <div
                  className="mb-4 flex items-center gap-0.5"
                  role="img"
                  aria-label={`${testimonial.rating} out of 5 stars`}
                >
                  {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className="h-3.5 w-3.5 fill-[var(--warning)] text-[var(--warning)]"
                      aria-hidden
                    />
                  ))}
                </div>
                <blockquote className="type-quote mb-6 flex-1 text-[var(--foreground)]">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <figcaption className="border-t border-[var(--border)] pt-5">
                  <p className="type-card-title text-[var(--text-md)] text-[var(--foreground)]">
                    {testimonial.name}
                  </p>
                  <p className="text-[var(--text-base)] text-[var(--text-tertiary)]">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* ---------------------------------------------------------- TECH STACK */}
      <Section tone="ruled">
        <SectionHeader
          align="center"
          eyebrow="Our Stack"
          title="Modern, Battle-Tested Tooling"
          lead="We pick the right tool for the job, not the trendy one — production-grade frameworks your team can actually hire for."
        />

        <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {stackGroups.map((group) => (
            <StaggerItem key={group.label}>
              <Card tone="solid" padding="sm" className="h-full">
                <h3 className="type-band-label mb-3 text-[var(--accent)]">{group.label}</h3>
                <ul className="flex flex-col gap-2">
                  {group.techs.map((tech) => {
                    const Icon = techIcon(tech);
                    return (
                      <li
                        key={tech}
                        className="flex items-center gap-2 text-[var(--text-base)] text-[var(--text-secondary)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--foreground)]"
                      >
                        {/* Fixed-width slot whether or not a mark exists, so the
                            names stay on one left edge down the column. */}
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center text-[var(--text-tertiary)]">
                          {Icon && <Icon className="h-3.5 w-3.5" aria-hidden />}
                        </span>
                        {tech}
                      </li>
                    );
                  })}
                </ul>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* ------------------------------------------------------------ CTA BAND */}
      <CtaBand
        eyebrow="Let's Build"
        title="Ready to Turn Your Vision Into a Product That Ships?"
        lead="Tell us about your project in a 30-minute discovery call. You'll walk away with a concrete scope, a timeline, and an honest sense of what it'll take."
        primary={{ label: "Book a Discovery Call", href: "/contact" }}
        secondary={{ label: "Explore Services", href: "/services" }}
        assurances={ctaAssurances}
      />
    </>
  );
}
