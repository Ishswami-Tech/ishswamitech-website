import Link from "next/link";
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
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Button } from "@/components/ui/button";
import { Badge, StatusDot } from "@/components/ui/badge";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { CtaBand } from "@/components/ui/cta-band";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
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
  { icon: Headphones, text: "Free 30-minute discovery" },
  { icon: FileCheck2, text: "Honest, fixed-scope quotes" },
  { icon: ShieldCheck, text: "NDA signed before kickoff" },
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
      <section className="relative isolate flex min-h-[92svh] items-center overflow-hidden">
        <AnimatedBackground variant="aurora" />

        <Container className="relative z-10 pb-24 pt-36">
          <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-2xl">
              <Reveal immediate variant="fade">
                <p className="type-ui mb-8 inline-flex items-center gap-2.5 rounded-[var(--radius-pill)] border border-[var(--border)] bg-[var(--surface-glass)] px-3.5 py-1.5 text-[var(--text-secondary)] backdrop-blur-md">
                  <StatusDot />
                  Accepting new projects · Senior-led delivery
                </p>
              </Reveal>

              <Reveal immediate delay={0.06}>
                <h1 className="type-hero mb-6 text-[var(--foreground)]">
                  Software That <span className="gradient-text">Looks Sharp, Loads Fast,</span> and
                  Earns Its Keep.
                </h1>
              </Reveal>

              <Reveal immediate delay={0.12}>
                <p className="type-lead mb-10 max-w-xl">
                  {siteConfig.shortName} designs and builds websites, SaaS platforms, mobile apps,
                  AI features, and cloud systems for ambitious founders and growing teams — with
                  the engineering depth to ship and the product taste to make it feel inevitable.
                </p>
              </Reveal>

              <Reveal immediate delay={0.18}>
                <div className="mb-12 flex flex-col gap-3 sm:flex-row">
                  <Button href="/contact" size="lg">
                    Start your project
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </Button>
                  <Button href="/services" variant="ghost" size="lg">
                    Explore services
                  </Button>
                </div>
              </Reveal>

              <Stagger as="ul" immediate delay={0.24} className="grid max-w-xl gap-2.5 sm:grid-cols-3">
                {heroHighlights.map((item) => (
                  <StaggerItem
                    as="li"
                    key={item}
                    className="type-ui flex items-start gap-2 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-glass)] px-3.5 py-2.5 text-[var(--text-secondary)] backdrop-blur-md"
                  >
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent)]" aria-hidden />
                    <span>{item}</span>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>

            <Reveal immediate variant="scale" delay={0.2}>
              <SpotlightCard className="p-6 md:p-8">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <p className="type-eyebrow">How we engage</p>
                    <p className="type-panel-title mt-2 text-[var(--foreground)]">
                      Premium execution, zero agency clutter
                    </p>
                  </div>
                  <Badge tone="gradient" className="shrink-0">
                    Senior-led
                  </Badge>
                </div>

                <ul className="flex flex-col gap-2.5">
                  {engagementIncludes.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-raised)] px-3.5 py-2.5 text-[var(--text-base)] text-[var(--text-secondary)]"
                    >
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--accent)]" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-6 border-t border-[var(--border)] pt-5 text-[var(--text-base)] text-[var(--text-tertiary)]">
                  Every engagement starts with a written scope and a fixed-price quote before any
                  code is written.
                </p>
              </SpotlightCard>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------- TECH MARQUEE */}
      <section
        aria-labelledby="tech-marquee-heading"
        className="site-section--tight relative overflow-hidden border-y border-[var(--border)] bg-[var(--surface)]"
      >
        <h2 id="tech-marquee-heading" className="type-band-label mb-6 text-center">
          Technologies we engineer with
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
          eyebrow="Why teams choose us"
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
            <StaggerItem key={item.title}>
              <SpotlightCard className="h-full p-6">
                <div className="mb-5 flex items-center justify-between">
                  <CardIcon>
                    <item.icon className="h-5 w-5" aria-hidden />
                  </CardIcon>
                  <span className="type-index">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="type-block-title mb-2.5 text-[var(--foreground)]">{item.title}</h3>
                <p className="type-body text-[var(--text-secondary)]">{item.description}</p>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* ------------------------------------------------------------ SERVICES */}
      <Section tone="ruled">
        <SectionHeader
          eyebrow="What we build"
          title="End-to-End Software, Designed and Delivered In-House"
          aside={
            <Link
              href="/services"
              className="type-ui group inline-flex items-center gap-1.5 text-[var(--accent)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--accent-strong)]"
            >
              View all services
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
                    padding="md"
                    className="group/card flex h-full flex-col"
                    tone="solid"
                  >
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
                        <Badge key={tech}>{tech}</Badge>
                      ))}
                    </div>
                    <span className="type-ui flex items-center gap-1 text-[var(--accent)]">
                      Explore
                      <ArrowRight
                        className="h-4 w-4 transition-transform duration-[var(--duration-fast)] group-hover/card:translate-x-1"
                        aria-hidden
                      />
                    </span>
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
          eyebrow="Proven process"
          title="A Simple Path From Idea to Launch"
          lead="No mystery, no surprises. Aligned goals, a concrete plan, iterative build cycles, and a launch checklist that covers performance and discovery."
        />

        <Stagger as="ol" className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
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

      {/* ---------------------------------------------------------- INDUSTRIES */}
      <Section>
        <SectionHeader
          align="center"
          eyebrow="Industries we serve"
          title="Domain Depth Across the Products People Actually Use"
        />

        <Stagger as="ul" gap={0.035} className="mx-auto flex max-w-4xl flex-wrap justify-center gap-2.5">
          {industries.map((industry) => (
            <StaggerItem as="li" key={industry} variant="scale">
              <span className="type-ui block rounded-[var(--radius-pill)] border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-2 text-[var(--text-secondary)] transition-[color,border-color,transform] duration-[var(--duration-fast)] hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:text-[var(--foreground)] motion-reduce:transform-none">
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
          eyebrow="Client feedback"
          title="What Clients Say About Working With Us"
          lead="Recurring themes from the kind of work we focus on: clarity, speed, and practical execution."
        />

        <Stagger as="ul" className="grid gap-5 lg:grid-cols-3">
          {testimonials.slice(0, 3).map((testimonial) => (
            <StaggerItem as="li" key={testimonial.id} className="h-full">
              <figure className="glass flex h-full flex-col rounded-[var(--radius-2xl)] p-6">
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
          eyebrow="Our stack"
          title="Modern, Battle-Tested Tooling"
          lead="We pick the right tool for the job, not the trendy one — production-grade frameworks your team can actually hire for."
        />

        <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {stackGroups.map((group) => (
            <StaggerItem key={group.label}>
              <Card tone="solid" padding="sm" className="h-full">
                <h3 className="type-band-label mb-3 text-[var(--accent)]">{group.label}</h3>
                <ul className="flex flex-col gap-1.5">
                  {group.techs.map((tech) => (
                    <li key={tech} className="text-[var(--text-base)] text-[var(--text-secondary)]">
                      {tech}
                    </li>
                  ))}
                </ul>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* ------------------------------------------------------------ CTA BAND */}
      <CtaBand
        eyebrow="Let's build"
        title="Ready to Turn Your Vision Into a Product That Ships?"
        lead="Tell us about your project in a 30-minute discovery call. You'll walk away with a concrete scope, a timeline, and an honest sense of what it'll take."
        primary={{ label: "Book a discovery call", href: "/contact" }}
        secondary={{ label: "See pricing", href: "/pricing" }}
        assurances={ctaAssurances}
      />
    </>
  );
}
