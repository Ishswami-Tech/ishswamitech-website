import type { Metadata } from "next";
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
  ArrowUpRight,
  Search,
  Layout,
  Code,
  TestTube,
  Rocket,
  Headphones,
  Check,
  MessageSquare,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";
import { services } from "@/data/services";
import { Container } from "@/components/ui/container";
import { Section, SectionHeader } from "@/components/ui/section";
import { Card, CardIcon } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TechBadge } from "@/components/ui/badge";
import { PageHero } from "@/components/ui/page-hero";
import { CtaBand } from "@/components/ui/cta-band";
import { MediaFrame } from "@/components/ui/media-frame";
import { Reveal } from "@/components/motion/reveal";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { Tilt } from "@/components/motion/tilt";
import { createPageMetadata, siteConfig } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Services",
  description:
    "Web, mobile, desktop, AI, cloud, design, API, security, e-commerce, and ERP/CRM services delivered end-to-end by IshSwamiTech.",
  path: "/services",
  keywords: ["software development services", "custom app development", "cloud consulting"],
});

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
  { icon: Search, title: "Discover", desc: "Understand your business, users, and the success metrics that actually matter." },
  { icon: Layout, title: "Plan", desc: "Roadmap, architecture, and milestones — written down, agreed, and tracked." },
  { icon: Palette, title: "Design", desc: "Wireframes, prototypes, and a visual system aligned with your brand." },
  { icon: Code, title: "Build", desc: "Agile sprints with weekly demos. Production-grade from day one." },
  { icon: TestTube, title: "Test", desc: "QA, security review, performance audits, and accessibility checks." },
  { icon: Rocket, title: "Launch", desc: "Deploy, monitor, instrument analytics, and run the day-one checklist." },
  { icon: Headphones, title: "Support", desc: "Bug fixes, iteration, and continuous improvement on a clear retainer." },
];

const consultationPoints = [
  { icon: MessageSquare, text: "No Sales Pressure — Just Useful Advice" },
  { icon: FileCheck2, text: "Fixed-Scope Quotes if We're a Fit" },
  { icon: ShieldCheck, text: "NDA-Protected From the First Email" },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        breadcrumb="Services"
        eyebrow={`${siteConfig.shortName} Services`}
        title="Software Services, End-to-End and Under One Roof"
        lead="From idea to launch — and the long tail of iteration after. We design, engineer, deploy, and maintain modern digital products across every major platform."
        aside={
          <Card tone="highlight" padding="md">
            <p className="type-eyebrow mb-3">{services.length} Capabilities</p>
            <p className="type-body text-[var(--text-secondary)]">
              One team, {services.length} core capabilities. No outsourcing, no handoffs, no
              &ldquo;that&apos;s not our scope&rdquo; — just senior people who can take your project
              from zero to production.
            </p>
          </Card>
        }
      />

      {/* Jump nav */}
      <section className="sticky top-[var(--navbar-height)] z-30 border-y border-[var(--border)] bg-[var(--surface-glass-strong)] backdrop-blur-xl">
        <Container>
          <nav aria-label="Jump to a service" className="overflow-x-auto">
            <ul className="flex min-w-max gap-2 py-3">
              {services.map((service) => {
                const Icon = iconMap[service.icon] ?? Globe;
                return (
                  <li key={service.id}>
                    <a
                      href={`#${service.slug}`}
                      className="type-ui inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--border)] bg-[var(--surface-raised)] px-3.5 py-1.5 text-[var(--text-tertiary)] transition-[color,border-color,translate] duration-[var(--duration-fast)] hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:text-[var(--foreground)] motion-reduce:transform-none"
                    >
                      <Icon className="h-3.5 w-3.5" style={{ color: service.color }} aria-hidden />
                      {service.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </Container>
      </section>

      {/* Service detail */}
      <Section>
        <div className="flex flex-col gap-6">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] ?? Globe;
            const reverse = index % 2 === 1;

            return (
              <Reveal as="article" key={service.id} className="scroll-mt-32">
                <Card id={service.slug} tone="solid" className="relative overflow-hidden" padding="lg">
                  {/* Per-service accent wash, tinted from the service's own colour. */}
                  <div
                    className="absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
                    style={{ backgroundColor: `color-mix(in srgb, ${service.color} 12%, transparent)` }}
                    aria-hidden
                  />

                  <div className="relative grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr]">
                    <div className={reverse ? "lg:order-2" : undefined}>
                      <div className="mb-5 flex items-center gap-4">
                        <CardIcon tint={service.color}>
                          <Icon className="h-5 w-5" aria-hidden />
                        </CardIcon>
                        <span className="type-index">
                          {String(index + 1).padStart(2, "0")} / {services.length}
                        </span>
                      </div>

                      <h2 className="type-section-title mb-3 text-[var(--foreground)]">
                        {service.title}
                      </h2>
                      <p className="type-body mb-6 text-[var(--text-secondary)]">
                        {service.description}
                      </p>

                      <div className="mb-6">
                        <h3 className="type-band-label mb-3">Stack</h3>
                        <ul className="flex flex-wrap gap-1.5">
                          {service.technologies.map((tech) => (
                            <li key={tech}>
                              <TechBadge name={tech} tone="outline" />
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button href="/contact">
                        Get a Quote
                        <ArrowUpRight className="h-4 w-4" aria-hidden />
                      </Button>
                    </div>

                    <div className={reverse ? "lg:order-1" : undefined}>
                      <MediaFrame
                        src={service.image}
                        alt=""
                        ratio="video"
                        tint={service.color}
                        strength={0.5}
                        interactive={false}
                        sizes="(max-width: 1024px) 100vw, 55vw"
                        className="mb-6"
                      />

                      <h3 className="type-band-label mb-4">What&apos;s Included</h3>
                      <ul className="grid gap-2.5 sm:grid-cols-2">
                        {service.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-2.5 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-raised)] px-3.5 py-2.5 text-[var(--text-base)] text-[var(--text-secondary)]"
                          >
                            <Check
                              className="mt-0.5 h-3.5 w-3.5 shrink-0"
                              style={{ color: service.color }}
                              aria-hidden
                            />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* Process */}
      <Section tone="band">
        <SectionHeader
          align="center"
          eyebrow="How We Work"
          title="A Practical Delivery Process for Serious Product Builds"
          lead="Seven repeatable phases that keep projects on time, on budget, and on track for the outcomes you actually care about."
        />

        <Stagger as="ol" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, index) => (
            <StaggerItem as="li" key={step.title} className="h-full">
              <Tilt className="h-full">
                <Card tone="solid" className="h-full" interactive padding="md">
                  <div className="mb-4 flex items-center justify-between">
                    <CardIcon>
                      <step.icon className="h-5 w-5" aria-hidden />
                    </CardIcon>
                    <span className="type-index">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="type-card-title mb-2 text-[var(--foreground)]">{step.title}</h3>
                  <p className="type-body text-[var(--text-secondary)]">{step.desc}</p>
                </Card>
              </Tilt>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* CTA */}
      <CtaBand
        eyebrow="Not Sure Where to Start?"
        title="Book a Free 30-Minute Discovery Call"
        lead="Walk us through your idea, current state, or roadmap. We'll help you scope the right phase — even if it's not with us."
        primary={{ label: "Book Free Consultation", href: "/contact" }}
        secondary={{ label: "See Pricing", href: "/pricing" }}
        assurances={consultationPoints}
      />
    </>
  );
}
