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
  Sparkles,
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
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
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
      <section className="relative flex min-h-[92svh] items-center overflow-hidden">
        <Image
          src="/Assets/hero_img.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#040814]/85" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#040814] via-[#040814]/75 to-[#040814]/25"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_18%_28%,rgba(61,217,235,0.16),transparent_46%),radial-gradient(circle_at_86%_72%,rgba(167,139,250,0.13),transparent_52%)]"
          aria-hidden
        />

        <Container className="relative z-10 pb-20 pt-32">
          <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
            <Reveal immediate className="max-w-2xl">
              <p className="type-ui mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-[#d7e5f6] backdrop-blur-xl">
                <span className="relative flex h-2 w-2 shrink-0" aria-hidden>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
                </span>
                Accepting new projects · Senior-led delivery
              </p>

              <h1 className="type-hero mb-6 text-white">
                Software that{" "}
                <span className="gradient-text">looks sharp, loads fast,</span> and{" "}
                <span className="gradient-text">earns its keep</span>.
              </h1>

              <p className="type-lead mb-10 max-w-xl text-[#c4d4e8]">
                {siteConfig.shortName} designs and builds websites, SaaS platforms, mobile apps, AI
                features, and cloud systems for ambitious founders and growing teams — with the
                engineering depth to ship and the product taste to make it feel inevitable.
              </p>

              <div className="mb-12 flex flex-col gap-3 sm:flex-row">
                <Button href="/contact">
                  Start your project
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </Button>
                <Button href="/services" variant="ghost">
                  Explore services
                </Button>
              </div>

              <ul className="grid max-w-xl gap-3 sm:grid-cols-3">
                {heroHighlights.map((item) => (
                  <li
                    key={item}
                    className="type-ui flex items-start gap-2 rounded-[var(--radius-lg)] border border-white/10 bg-white/[0.04] px-4 py-3 text-[#d7e5f6] backdrop-blur-xl"
                  >
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-strong)]" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal immediate index={2} className="relative">
              <div
                className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-[var(--accent)]/20 via-transparent to-[var(--secondary)]/20 blur-2xl"
                aria-hidden
              />
              <div className="relative rounded-[var(--radius-2xl)] border border-white/15 bg-[#071321]/75 p-7 backdrop-blur-2xl md:p-8">
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <p className="type-eyebrow text-[var(--accent-strong)]">How we engage</p>
                    <p className="type-panel-title mt-2 text-white">
                      Premium execution, zero agency clutter
                    </p>
                  </div>
                  <Badge tone="accent" className="shrink-0 border-[#ffb547]/30 bg-[#ffb547]/10 text-[#ffd79b]">
                    Senior-led
                  </Badge>
                </div>

                <ul className="space-y-3">
                  {engagementIncludes.map((item) => (
                    <li
                      key={item}
                      className="type-body flex items-start gap-3 rounded-[var(--radius-lg)] border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-[#d5e3f2]"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <p className="type-body mt-6 border-t border-white/10 pt-5 text-sm text-[#9db4ca]">
                  Every engagement starts with a written scope and a fixed-price quote before any
                  code is written.
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ------------------------------------------------------- TECH MARQUEE */}
      <section
        aria-labelledby="tech-marquee-heading"
        className="site-section--tight overflow-hidden border-y border-[var(--border)] bg-[var(--band)] backdrop-blur-xl"
      >
        <h2 id="tech-marquee-heading" className="type-band-label mb-6 text-center">
          Technologies we engineer with
        </h2>
        <div className="marquee gap-12">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0 gap-12 pr-12" aria-hidden={copy === 1}>
              {marqueeTech.map((tech) => (
                <li
                  key={tech.name}
                  className="type-tech-row flex items-center gap-2 whitespace-nowrap text-[var(--text-muted)]"
                >
                  <tech.icon className="h-5 w-5 shrink-0" aria-hidden />
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
          title="A cleaner delivery model, with stronger product thinking"
          aside={
            <p className="type-lead max-w-xl">
              Clear scope, thoughtful UX, and engineering you can grow with — so stakeholders see
              real progress every week and customers get a product that feels intentional.
            </p>
          }
        />

        <div className="grid gap-6 md:grid-cols-3">
          {differentiators.map((item, index) => (
            <Reveal key={item.title} index={index}>
              <Card className="group relative h-full overflow-hidden" padding="md">
                <div
                  className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[var(--accent)]/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100"
                  aria-hidden
                />
                <div className="relative">
                  <div className="mb-5 flex items-center justify-between">
                    <CardIcon>
                      <item.icon className="h-5 w-5" aria-hidden />
                    </CardIcon>
                    <span className="type-index text-[var(--secondary)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="type-block-title mb-3 text-[var(--foreground)]">{item.title}</h3>
                  <p className="type-body text-[var(--text-muted)]">{item.description}</p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------------ SERVICES */}
      <Section tone="ruled">
        <SectionHeader
          eyebrow="What we build"
          title="End-to-end software, designed and delivered in-house"
          aside={
            <Link
              href="/services"
              className="type-ui inline-flex items-center gap-2 text-[var(--accent)] transition-colors hover:text-[var(--link-emphasis)]"
            >
              View all services
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          }
        />

        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.slice(0, 6).map((service, index) => {
            const Icon = serviceIcons[service.icon] ?? Globe;
            return (
              <Reveal as="li" key={service.id} index={index} className="h-full">
                <Link href={`/services#${service.slug}`} className="block h-full">
                  <Card className="group relative flex h-full flex-col overflow-hidden" interactive padding="md">
                    <div
                      className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden
                    />
                    <CardIcon tint={service.color} className="mb-5">
                      <Icon className="h-6 w-6" aria-hidden />
                    </CardIcon>
                    <h3 className="type-card-title mb-2 text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                      {service.title}
                    </h3>
                    <p className="type-body mb-5 flex-1 text-[var(--text-muted)]">
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
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        aria-hidden
                      />
                    </span>
                  </Card>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </Section>

      {/* ------------------------------------------------------------- PROCESS */}
      <Section tone="band">
        <SectionHeader
          align="center"
          eyebrow="Proven process"
          title="A simple path from idea to launch"
          lead="No mystery, no surprises. Aligned goals, a concrete plan, iterative build cycles, and a launch checklist that covers performance and discovery."
        />

        <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {deliverySteps.map((step, index) => (
            <Reveal as="li" key={step.title} index={index}>
              <Card className="h-full" padding="md">
                <div className="mb-5 flex items-center justify-between">
                  <CardIcon>
                    <step.icon className="h-5 w-5" aria-hidden />
                  </CardIcon>
                  <span className="type-index text-[var(--secondary)]">{step.phase}</span>
                </div>
                <h3 className="type-block-title mb-3 text-[var(--foreground)]">{step.title}</h3>
                <p className="type-body text-[var(--text-muted)]">{step.detail}</p>
              </Card>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* --------------------------------------------------------- STATS STRIP */}
      <section className="site-section--tight border-y border-[var(--border)] bg-[var(--elevated)]">
        <Container>
          <dl className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {companyStats.map((stat, index) => (
              <Reveal key={stat.label} index={index}>
                <dd className="type-stat mb-1 text-3xl text-[var(--stat-number)] md:text-5xl">
                  {stat.count !== undefined ? (
                    <AnimatedCounter end={stat.count} suffix={stat.suffix} />
                  ) : (
                    stat.value
                  )}
                </dd>
                <dt className="type-stat-label">{stat.label}</dt>
              </Reveal>
            ))}
          </dl>
        </Container>
      </section>

      {/* ---------------------------------------------------------- INDUSTRIES */}
      <Section>
        <SectionHeader
          align="center"
          eyebrow="Industries we serve"
          title="Domain depth across the products people actually use"
        />

        <ul className="mx-auto flex max-w-4xl flex-wrap justify-center gap-3">
          {industries.map((industry, index) => (
            <Reveal as="li" key={industry} index={index}>
              <span className="type-ui block rounded-full border border-[var(--border)] bg-[var(--card)] px-5 py-2.5 text-[var(--foreground)] backdrop-blur-xl transition-colors hover:border-[var(--border-strong)] hover:text-[var(--accent)]">
                {industry}
              </span>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* -------------------------------------------------------- TESTIMONIALS */}
      <Section tone="elevated">
        <SectionHeader
          align="center"
          eyebrow="Client feedback"
          title="What clients say about working with us"
          lead="Recurring themes from the kind of work we focus on: clarity, speed, and practical execution."
        />

        <ul className="grid gap-6 lg:grid-cols-3">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <Reveal as="li" key={testimonial.id} index={index} className="h-full">
              <figure className="glass flex h-full flex-col rounded-[var(--radius-2xl)] p-6 md:p-7">
                <div
                  className="mb-4 flex items-center gap-1"
                  role="img"
                  aria-label={`${testimonial.rating} out of 5 stars`}
                >
                  {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className="h-4 w-4 fill-[var(--warning)] text-[var(--warning)]"
                      aria-hidden
                    />
                  ))}
                </div>
                <blockquote className="type-body mb-6 flex-1 text-[var(--foreground)]">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <figcaption className="border-t border-[var(--border)] pt-5">
                  <p className="type-card-title text-base text-[var(--foreground)]">
                    {testimonial.name}
                  </p>
                  <p className="type-body text-sm text-[var(--text-muted)]">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* ---------------------------------------------------------- TECH STACK */}
      <Section tone="ruled">
        <SectionHeader
          align="center"
          eyebrow="Our stack"
          title="Modern, battle-tested tooling"
          lead="We pick the right tool for the job, not the trendy one — production-grade frameworks your team can actually hire for."
        />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {stackGroups.map((group, index) => (
            <Reveal key={group.label} index={index}>
              <Card className="h-full" padding="sm">
                <h3 className="type-band-label mb-3 text-[var(--accent)]">{group.label}</h3>
                <ul className="flex flex-col gap-1.5">
                  {group.techs.map((tech) => (
                    <li key={tech} className="type-body text-sm text-[var(--text-muted)]">
                      {tech}
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------------ CTA BAND */}
      <Section>
        <Reveal>
          <Card tone="highlight" padding="lg" className="relative overflow-hidden">
            <div
              className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[var(--accent)]/15 blur-3xl"
              aria-hidden
            />
            <div
              className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-[var(--secondary)]/15 blur-3xl"
              aria-hidden
            />

            <div className="relative grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
              <div>
                <p className="type-eyebrow mb-4">Let&apos;s build</p>
                <h2 className="type-section-title mb-4 text-[var(--foreground)]">
                  Ready to turn your vision into a product that ships?
                </h2>
                <p className="type-lead mb-8 max-w-xl">
                  Tell us about your project in a 30-minute discovery call. You&apos;ll walk away
                  with a concrete scope, a timeline, and an honest sense of what it&apos;ll take.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button href="/contact">
                    Book a discovery call
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </Button>
                  <Button href="/pricing" variant="secondary">
                    See pricing
                  </Button>
                </div>
              </div>

              <ul className="grid gap-3">
                {ctaAssurances.map(({ icon: Icon, text }) => (
                  <li
                    key={text}
                    className="type-body flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 backdrop-blur-xl"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--card-soft)] text-[var(--accent)]">
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </Reveal>
      </Section>
    </>
  );
}
