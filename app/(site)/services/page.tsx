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
  ArrowRight,
  ArrowUpRight,
  Search,
  Layout,
  Code,
  TestTube,
  Rocket,
  Headphones,
  Check,
} from "lucide-react";
import { services } from "@/data/services";
import { Container } from "@/components/ui/container";
import { Section, SectionHeader } from "@/components/ui/section";
import { Card, CardIcon } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/motion/reveal";
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
  "No sales pressure — just useful advice",
  "Fixed-scope quotes if we're a fit",
  "NDA-protected from the first email",
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        breadcrumb="Services"
        eyebrow={`${siteConfig.shortName} services`}
        title="Software services, end-to-end and under one roof"
        lead="From idea to launch — and the long tail of iteration after. We design, engineer, deploy, and maintain modern digital products across every major platform."
        aside={
          <Card padding="md">
            <p className="type-eyebrow mb-3 text-[var(--secondary)]">
              {services.length} capabilities
            </p>
            <p className="type-body text-[var(--foreground)]">
              One team, {services.length} core capabilities. No outsourcing, no handoffs, no
              &ldquo;that&apos;s not our scope&rdquo; — just senior people who can take your project
              from zero to production.
            </p>
          </Card>
        }
      />

      {/* Jump nav */}
      <section className="border-y border-[var(--border)] bg-[var(--band)]">
        <Container>
          <nav aria-label="Jump to a service" className="overflow-x-auto">
            <ul className="flex min-w-max gap-2 py-4">
              {services.map((service) => {
                const Icon = iconMap[service.icon] ?? Globe;
                return (
                  <li key={service.id}>
                    <a
                      href={`#${service.slug}`}
                      className="type-ui inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-[var(--text-muted)] backdrop-blur-xl transition-all hover:border-[var(--border-strong)] hover:text-[var(--accent)]"
                    >
                      <Icon className="h-4 w-4" style={{ color: service.color }} aria-hidden />
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
        <div className="space-y-8">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] ?? Globe;
            const reverse = index % 2 === 1;

            return (
              <Reveal as="article" key={service.id} className="scroll-mt-24">
                <Card id={service.slug} className="relative overflow-hidden" padding="lg">
                  <div
                    className="absolute -right-20 -top-20 h-60 w-60 rounded-full opacity-50 blur-3xl"
                    style={{ backgroundColor: `${service.color}1A` }}
                    aria-hidden
                  />

                  <div className="relative grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr]">
                    <div className={reverse ? "lg:order-2" : undefined}>
                      <div className="mb-5 flex items-center gap-4">
                        <CardIcon tint={service.color} className="h-14 w-14 rounded-[var(--radius-lg)]">
                          <Icon className="h-7 w-7" aria-hidden />
                        </CardIcon>
                        <span className="type-index text-[var(--text-muted)]">
                          {String(index + 1).padStart(2, "0")} / {services.length}
                        </span>
                      </div>

                      <h2 className="type-section-title mb-3 text-[var(--foreground)]">
                        {service.title}
                      </h2>
                      <p className="type-body mb-6 text-[var(--text-muted)]">
                        {service.description}
                      </p>

                      <div className="mb-6">
                        <h3 className="type-band-label mb-3 text-[var(--accent)]">Stack</h3>
                        <ul className="flex flex-wrap gap-2">
                          {service.technologies.map((tech) => (
                            <li key={tech}>
                              <Badge tone="outline">{tech}</Badge>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Button href="/contact" size="md">
                        Get a quote
                        <ArrowUpRight className="h-4 w-4" aria-hidden />
                      </Button>
                    </div>

                    <div className={reverse ? "lg:order-1" : undefined}>
                      <h3 className="type-band-label mb-4 text-[var(--accent)]">
                        What&apos;s included
                      </h3>
                      <ul className="grid gap-3 sm:grid-cols-2">
                        {service.features.map((feature) => (
                          <li
                            key={feature}
                            className="type-body flex items-start gap-2.5 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--foreground)]"
                          >
                            <Check
                              className="mt-0.5 h-4 w-4 shrink-0"
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
          eyebrow="How we work"
          title="A practical delivery process for serious product builds"
          lead="Seven repeatable phases that keep projects on time, on budget, and on track for the outcomes you actually care about."
        />

        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, index) => (
            <Reveal as="li" key={step.title} index={index}>
              <Card className="h-full" padding="md">
                <div className="mb-4 flex items-center justify-between">
                  <CardIcon>
                    <step.icon className="h-5 w-5" aria-hidden />
                  </CardIcon>
                  <span className="type-index text-[var(--secondary)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="type-card-title mb-2 text-[var(--foreground)]">{step.title}</h3>
                <p className="type-body text-sm text-[var(--text-muted)]">{step.desc}</p>
              </Card>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* CTA */}
      <Section>
        <Reveal>
          <Card tone="highlight" padding="lg" className="relative overflow-hidden">
            <div
              className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[var(--accent)]/15 blur-3xl"
              aria-hidden
            />
            <div className="relative grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
              <div>
                <p className="type-eyebrow mb-4">Not sure where to start?</p>
                <h2 className="type-section-title mb-4 text-[var(--foreground)]">
                  Book a free 30-minute discovery call
                </h2>
                <p className="type-lead mb-8 max-w-xl">
                  Walk us through your idea, current state, or roadmap. We&apos;ll help you scope
                  the right phase — even if it&apos;s not with us.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button href="/contact">
                    Book free consultation
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </Button>
                  <Button href="/pricing" variant="secondary">
                    See pricing
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
              </div>

              <ul className="space-y-3">
                {consultationPoints.map((point) => (
                  <li
                    key={point}
                    className="type-body flex items-start gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] px-4 py-3 backdrop-blur-xl"
                  >
                    <span
                      className="mt-1.5 inline-flex h-2 w-2 shrink-0 rounded-full bg-[var(--accent)]"
                      aria-hidden
                    />
                    <span>{point}</span>
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
