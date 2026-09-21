import type { Metadata } from "next";
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
import { PageHero } from "@/components/ui/page-hero";
import { CtaBand } from "@/components/ui/cta-band";
import { MediaFrame } from "@/components/ui/media-frame";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { Tilt } from "@/components/motion/tilt";
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
    title: "Craft & Quality",
    desc: "Typed, tested, observable code — and interfaces that feel obvious. Nothing ships we wouldn't be proud of.",
  },
  {
    icon: Heart,
    title: "Client-First",
    desc: "Your roadmap, your business, your wins. We measure success by your KPIs, not our line items.",
  },
];

const milestones = [
  {
    year: "2026",
    title: `${siteConfig.shortName} Registered`,
    detail:
      "Started as a Pune-based technology services business focused on practical software delivery.",
  },
  {
    year: "Now",
    title: "Client-Platform Focus",
    detail:
      "Building websites, apps, payment flows, automation, and operational platforms for growing businesses.",
  },
  {
    year: "Next",
    title: "Reliable Delivery Systems",
    detail:
      "Strengthening reusable engineering patterns, support processes, and production-ready platform components.",
  },
];

const stats = [
  { icon: Award, value: "2026", label: "Registered" },
  { icon: Globe2, value: "Pune", label: "India Based" },
  { icon: Users, value: "Focused", label: "Delivery Model" },
  { icon: Sparkles, value: "Multi", label: "Domain Capability" },
];

const capabilities = [
  { name: "Cloud Deployments", desc: "AWS, Azure, GCP, Vercel" },
  { name: "Web Platforms", desc: "Next.js, React, APIs" },
  { name: "Mobile Apps", desc: "Android, iOS, cross-platform" },
  { name: "AI Workflows", desc: "Assistants, automation, search" },
];

const aboutAssurances = [
  { icon: Users, text: "Senior People on Your Project, Not Juniors" },
  { icon: Eye, text: "Weekly Demos, No Status Theatre" },
  { icon: Heart, text: "We Measure Success by Your KPIs" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        breadcrumb="About"
        eyebrow={`About ${siteConfig.shortName}`}
        title={<>We&rsquo;re Builders, Thinkers, and Product-Minded Problem Solvers.</>}
        lead={`${siteConfig.shortName} helps founders and growing teams turn ambitious ideas into shipped products. We blend practical product engineering, AI capability, and a design eye that respects both pixels and conversion rates.`}
        background="aurora"
        aside={
          <Card tone="highlight" padding="md">
            <p className="type-eyebrow mb-3">In One Line</p>
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
      <section className="site-section--tight border-y border-[var(--border)] bg-[var(--surface)]">
        <Container>
          <Stagger as="dl" className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat) => (
              <StaggerItem key={stat.label} className="flex items-center gap-4">
                <CardIcon>
                  <stat.icon className="h-5 w-5" aria-hidden />
                </CardIcon>
                <div>
                  <dd className="type-stat text-2xl text-[var(--foreground)]">{stat.value}</dd>
                  <dt className="type-stat-label">{stat.label}</dt>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>

      {/* Story */}
      <Section>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal variant="right" className="relative">
            <div
              className="absolute -inset-5 rounded-[var(--radius-3xl)] bg-[var(--gradient-primary)] opacity-15 blur-3xl"
              aria-hidden
            />
            <MediaFrame
              src="/Assets/Programmers_4.jpg"
              alt={`${siteConfig.shortName} engineering team collaborating`}
              ratio="video"
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="shadow-[var(--shadow-xl)]"
            />
            <p className="glass-strong absolute -bottom-6 -right-6 hidden rounded-[var(--radius-xl)] p-4 md:block">
              <span className="type-stat block text-2xl text-[var(--foreground)]">2026</span>
              <span className="type-stat-label">Registered in Pune</span>
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="type-eyebrow mb-3">Our Story</p>
            <h2 className="type-section-title mb-5 text-[var(--foreground)]">
              Born From a Frustration With How Software Gets Built
            </h2>
            <p className="type-body mb-4 text-[var(--text-secondary)]">
              {siteConfig.shortName} was founded on a simple observation: too many projects ship
              late, over budget, and with the soul drained out of them. We knew there was a better
              way to build — and we wanted to prove it.
            </p>
            <p className="type-body mb-8 text-[var(--text-secondary)]">
              That conviction is still the engine: clear scope, focused execution, and software
              that actually moves your business forward. From SaaS platforms and AI features to
              mobile apps and full cloud migrations — if it&apos;s on your roadmap, it&apos;s in
              our wheelhouse.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card tone="solid" padding="sm">
                <CardIcon size="sm" className="mb-3">
                  <Target className="h-4 w-4" aria-hidden />
                </CardIcon>
                <h3 className="type-card-title mb-1.5 text-[var(--foreground)]">Mission</h3>
                <p className="type-body text-[var(--text-secondary)]">
                  Build digital products that respect the user, the business, and the team that has
                  to maintain them.
                </p>
              </Card>
              <Card tone="solid" padding="sm">
                <CardIcon size="sm" className="mb-3">
                  <Sparkles className="h-4 w-4" aria-hidden />
                </CardIcon>
                <h3 className="type-card-title mb-1.5 text-[var(--foreground)]">Vision</h3>
                <p className="type-body text-[var(--text-secondary)]">
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
          eyebrow="What Guides Us"
          title="Core Values"
          lead="Not poster slogans — actual operating principles you'll see in every sprint, demo, and standup."
        />

        <Stagger as="ul" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <StaggerItem as="li" key={value.title} className="h-full">
              <Tilt className="h-full">
                <Card tone="solid" className="h-full" interactive padding="md">
                  <CardIcon className="mb-5">
                    <value.icon className="h-5 w-5" aria-hidden />
                  </CardIcon>
                  <h3 className="type-card-title mb-2 text-[var(--foreground)]">{value.title}</h3>
                  <p className="type-body text-[var(--text-secondary)]">{value.desc}</p>
                </Card>
              </Tilt>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* Team */}
      <Section>
        <SectionHeader
          eyebrow="Delivery Coverage"
          title="A Compact Team Model"
          aside={
            <Link
              href="/contact"
              className="type-ui inline-flex items-center gap-2 text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)]"
            >
              Start a project
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          }
        />

        <Stagger as="ul" className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {team.map((member) => (
            <StaggerItem as="li" key={member.id} className="h-full">
              <Card
                tone="solid"
                className="flex h-full flex-col overflow-hidden"
                interactive
                padding="none"
              >
                <MediaFrame
                  src={member.image}
                  alt=""
                  ratio="video"
                  framed={false}
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="border-b border-[var(--border)]"
                />
                <div className="flex-1 p-4">
                  <h3 className="type-card-title text-[var(--text-md)] text-[var(--foreground)]">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-[var(--text-base)] text-[var(--text-tertiary)]">
                    {member.role}
                  </p>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* Journey */}
      <Section tone="band">
        <SectionHeader
          align="center"
          eyebrow="Our Journey"
          title="Where We Are, and Where We're Going"
          lead="A straightforward path from registration to reliable client delivery."
        />

        <Stagger as="ol" gap={0.09} className="relative mx-auto flex max-w-3xl flex-col gap-5">
          <div
            className="absolute bottom-0 left-[7px] top-3 hidden w-px bg-gradient-to-b from-[var(--primary)] via-[var(--border)] to-transparent sm:block"
            aria-hidden
          />
          {milestones.map((milestone) => (
            <StaggerItem as="li" key={milestone.year} className="relative sm:pl-10">
              <span
                className="absolute left-0 top-3 hidden h-[15px] w-[15px] rounded-full border-2 border-[var(--background)] bg-[var(--primary)] shadow-[var(--shadow-glow)] sm:block"
                aria-hidden
              />
              <Card tone="solid" padding="md">
                <p className="type-index mb-1.5 text-[var(--accent)]">{milestone.year}</p>
                <h3 className="type-card-title mb-1.5 text-[var(--foreground)]">
                  {milestone.title}
                </h3>
                <p className="type-body text-[var(--text-secondary)]">{milestone.detail}</p>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* Capabilities */}
      <Section tone="ruled">
        <SectionHeader
          align="center"
          eyebrow="Capabilities"
          title="Platforms We Build With"
          lead="Practical tools and service areas used for client websites, apps, automations, and operations."
        />

        <Stagger as="ul" className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {capabilities.map((capability) => (
            <StaggerItem as="li" key={capability.name} className="h-full">
              <Card tone="solid" interactive className="flex h-full items-center gap-3.5" padding="sm">
                <CardIcon size="sm">
                  <Building2 className="h-4 w-4" aria-hidden />
                </CardIcon>
                <div>
                  <h3 className="type-card-title text-[var(--text-base)] text-[var(--foreground)]">
                    {capability.name}
                  </h3>
                  <p className="text-[var(--text-xs)] text-[var(--text-tertiary)]">
                    {capability.desc}
                  </p>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* CTA */}
      <CtaBand
        eyebrow="Work With Us"
        title="Let's Build Something Worth Talking About"
        lead="Whether you're scoping a new product, modernising an old one, or scaling a team — we'd love to hear about it."
        primary={{ label: "Start a Conversation", href: "/contact" }}
        secondary={{ label: "Browse Our Services", href: "/services" }}
        assurances={aboutAssurances}
      />
    </>
  );
}
