import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
import { Section, SectionHeader } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Card, CardIcon } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { createPageMetadata, siteConfig } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: `About ${siteConfig.name}`,
  description:
    "Meet the team behind IshSwamiTech and learn how we build reliable software products with a client-first mindset.",
  path: "/about",
  keywords: ["software company about page", "technology team", "product engineering company"],
});

const founderName = "Manisha Santosh Bhujbal";

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    desc: "We chase the new but ship the proven — pairing AI-first thinking with tools your team can hire for.",
  },
  {
    icon: Eye,
    title: "Transparency",
    desc: "Honest timelines, visible progress, and weekly demos. No status-meeting theatre, no end-of-quarter surprises.",
  },
  {
    icon: CheckCircle,
    title: "Craft & quality",
    desc: "Typed, tested, observable code — and interfaces that feel obvious. Nothing ships we wouldn't be proud of.",
  },
  {
    icon: Heart,
    title: "Client-first",
    desc: "Your roadmap, your business, your wins. We measure success by your KPIs, not our line items.",
  },
];

const milestones = [
  {
    year: "2026",
    title: `${siteConfig.shortName} registered`,
    detail:
      "Started as a Pune-based technology services business focused on practical software delivery.",
  },
  {
    year: "Now",
    title: "Client-platform focus",
    detail:
      "Building websites, apps, payment flows, automation, and operational platforms for growing businesses.",
  },
  {
    year: "Next",
    title: "Reliable delivery systems",
    detail:
      "Strengthening reusable engineering patterns, support processes, and production-ready platform components.",
  },
];

const stats = [
  { icon: Award, value: "2026", label: "Registered" },
  { icon: Globe2, value: "Pune", label: "India based" },
  { icon: Users, value: "Focused", label: "Delivery model" },
  { icon: Sparkles, value: "Multi", label: "Domain capability" },
];

const capabilities = [
  { name: "Cloud deployments", desc: "AWS, Azure, GCP, Vercel" },
  { name: "Web platforms", desc: "Next.js, React, APIs" },
  { name: "Mobile apps", desc: "Android, iOS, cross-platform" },
  { name: "AI workflows", desc: "Assistants, automation, search" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        breadcrumb="About"
        eyebrow={`About ${siteConfig.shortName}`}
        title={<>We&rsquo;re builders, thinkers, and product-minded problem solvers.</>}
        lead={`${siteConfig.shortName} helps founders and growing teams turn ambitious ideas into shipped products. We blend practical product engineering, AI capability, and a design eye that respects both pixels and conversion rates.`}
        aside={
          <Card padding="md">
            <p className="type-eyebrow mb-3 text-[var(--secondary)]">In one line</p>
            <p className="type-quote text-[var(--foreground)]">
              Premium engineering, design that converts, and a team that genuinely cares about your
              launch.
            </p>
          </Card>
        }
      >
        <dl className="mt-6 flex flex-wrap items-baseline gap-x-2">
          <dt className="type-band-label inline">Founder</dt>
          <dd className="type-body text-[var(--foreground)]">{founderName}</dd>
        </dl>
      </PageHero>

      {/* Stats */}
      <section className="site-section--tight border-y border-[var(--border)] bg-[var(--elevated)]">
        <Container>
          <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat, index) => (
              <Reveal key={stat.label} index={index} className="flex items-center gap-4">
                <CardIcon>
                  <stat.icon className="h-5 w-5" aria-hidden />
                </CardIcon>
                <div>
                  <dd className="type-stat text-2xl text-[var(--stat-number)]">{stat.value}</dd>
                  <dt className="type-stat-label">{stat.label}</dt>
                </div>
              </Reveal>
            ))}
          </dl>
        </Container>
      </section>

      {/* Story */}
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal className="relative">
            <div
              className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-[var(--accent)]/15 to-[var(--secondary)]/15 blur-2xl"
              aria-hidden
            />
            <div className="glass relative aspect-video overflow-hidden rounded-[var(--radius-2xl)] border-[var(--border-strong)]">
              <Image
                src="/Assets/Programmers_4.jpg"
                alt={`${siteConfig.shortName} engineering team collaborating`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <p className="absolute -bottom-6 -right-6 hidden rounded-[var(--radius-lg)] border border-[var(--border-strong)] bg-[var(--card)] p-5 backdrop-blur-xl md:block">
              <span className="type-stat block text-3xl text-[var(--accent)]">2026</span>
              <span className="type-stat-label">Registered in Pune</span>
            </p>
          </Reveal>

          <Reveal index={1}>
            <p className="type-eyebrow mb-3">Our story</p>
            <h2 className="type-section-title mb-5 text-[var(--foreground)]">
              Born from a frustration with how software gets built
            </h2>
            <p className="type-body mb-4 text-[var(--text-muted)]">
              {siteConfig.shortName} was founded on a simple observation: too many projects ship
              late, over budget, and with the soul drained out of them. We knew there was a better
              way to build — and we wanted to prove it.
            </p>
            <p className="type-body mb-8 text-[var(--text-muted)]">
              That conviction is still the engine: clear scope, focused execution, and software
              that actually moves your business forward. From SaaS platforms and AI features to
              mobile apps and full cloud migrations — if it&apos;s on your roadmap, it&apos;s in
              our wheelhouse.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card tone="solid" padding="sm">
                <CardIcon className="mb-3 h-10 w-10">
                  <Target className="h-5 w-5" aria-hidden />
                </CardIcon>
                <h3 className="type-card-title mb-1.5 text-[var(--foreground)]">Mission</h3>
                <p className="type-body text-sm text-[var(--text-muted)]">
                  Build digital products that respect the user, the business, and the team that has
                  to maintain them.
                </p>
              </Card>
              <Card tone="solid" padding="sm">
                <CardIcon className="mb-3 h-10 w-10 text-[var(--secondary)]">
                  <Sparkles className="h-5 w-5" aria-hidden />
                </CardIcon>
                <h3 className="type-card-title mb-1.5 text-[var(--foreground)]">Vision</h3>
                <p className="type-body text-sm text-[var(--text-muted)]">
                  A world where every great idea has the software to back it — and a team that can
                  ship it without melting down.
                </p>
              </Card>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Values */}
      <Section tone="band">
        <SectionHeader
          align="center"
          eyebrow="What guides us"
          title="Core values"
          lead="Not poster slogans — actual operating principles you'll see in every sprint, demo, and standup."
        />

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => (
            <Reveal as="li" key={value.title} index={index} className="h-full">
              <Card className="h-full" interactive padding="md">
                <CardIcon className="mb-5">
                  <value.icon className="h-5 w-5" aria-hidden />
                </CardIcon>
                <h3 className="type-card-title mb-2 text-[var(--foreground)]">{value.title}</h3>
                <p className="type-body text-[var(--text-muted)]">{value.desc}</p>
              </Card>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Team */}
      <Section>
        <SectionHeader
          eyebrow="Delivery coverage"
          title="A compact team model"
          aside={
            <Link
              href="/contact"
              className="type-ui inline-flex items-center gap-2 text-[var(--accent)] transition-colors hover:text-[var(--link-emphasis)]"
            >
              Start a project
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          }
        />

        <ul className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {team.map((member, index) => (
            <Reveal as="li" key={member.id} index={index} className="h-full">
              <Card className="group h-full text-center" interactive padding="sm">
                <div className="relative mx-auto mb-4 aspect-square w-24 overflow-hidden rounded-[var(--radius-lg)]">
                  <Image
                    src={member.image}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
                    sizes="96px"
                  />
                </div>
                <h3 className="type-card-title text-base text-[var(--foreground)]">
                  {member.name}
                </h3>
                <p className="type-body mt-1 text-sm text-[var(--text-muted)]">{member.role}</p>
              </Card>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Journey */}
      <Section tone="band">
        <SectionHeader
          align="center"
          eyebrow="Our journey"
          title="Where we are, and where we're going"
          lead="A straightforward path from registration to reliable client delivery."
        />

        <ol className="relative mx-auto max-w-3xl space-y-6">
          <div
            className="absolute bottom-0 left-[7px] top-2 hidden w-px bg-gradient-to-b from-[var(--accent)]/40 via-[var(--border)] to-transparent sm:block"
            aria-hidden
          />
          {milestones.map((milestone, index) => (
            <Reveal as="li" key={milestone.year} index={index} className="relative sm:pl-10">
              <span
                className="absolute left-0 top-2 hidden h-4 w-4 rounded-full border-2 border-[var(--background)] bg-[var(--accent)] sm:block"
                aria-hidden
              />
              <Card padding="md">
                <p className="type-stat mb-1 text-2xl text-[var(--accent)]">{milestone.year}</p>
                <h3 className="type-card-title mb-1.5 text-[var(--foreground)]">
                  {milestone.title}
                </h3>
                <p className="type-body text-sm text-[var(--text-muted)]">{milestone.detail}</p>
              </Card>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* Capabilities */}
      <Section tone="ruled">
        <SectionHeader
          align="center"
          eyebrow="Capabilities"
          title="Platforms we build with"
          lead="Practical tools and service areas used for client websites, apps, automations, and operations."
        />

        <ul className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
          {capabilities.map((capability, index) => (
            <Reveal as="li" key={capability.name} index={index} className="h-full">
              <Card className="flex h-full items-center gap-4" padding="sm">
                <CardIcon className="shrink-0">
                  <Building2 className="h-6 w-6" aria-hidden />
                </CardIcon>
                <div>
                  <h3 className="type-card-title text-sm text-[var(--foreground)]">
                    {capability.name}
                  </h3>
                  <p className="type-body text-xs text-[var(--text-muted)]">{capability.desc}</p>
                </div>
              </Card>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* CTA */}
      <Section>
        <Reveal>
          <Card tone="highlight" padding="lg" className="relative overflow-hidden text-center">
            <div
              className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[var(--accent)]/15 blur-3xl"
              aria-hidden
            />
            <div className="relative">
              <p className="type-eyebrow mb-4">Work with us</p>
              <h2 className="type-section-title mb-4 text-[var(--foreground)]">
                Let&apos;s build something worth talking about
              </h2>
              <p className="type-lead mx-auto mb-8 max-w-xl">
                Whether you&apos;re scoping a new product, modernising an old one, or scaling a
                team — we&apos;d love to hear about it.
              </p>
              <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button href="/contact">
                  Start a conversation
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </Button>
                <Button href="/services" variant="secondary">
                  Browse our services
                </Button>
              </div>
            </div>
          </Card>
        </Reveal>
      </Section>
    </>
  );
}
