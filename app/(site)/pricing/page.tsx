import type { Metadata } from "next";
import { ArrowUpRight, Check } from "lucide-react";
import { addOns, includedAcrossAll } from "@/data/pricing";
import { pricingFaq } from "@/data/faq";
import { Container } from "@/components/ui/container";
import { Section, SectionHeader } from "@/components/ui/section";
import { Card, CardIcon } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { PricingPlans } from "@/components/pricing/pricing-plans";
import { createPageMetadata, siteConfig } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Pricing",
  description:
    "Transparent project and retainer pricing for web, mobile, AI, and cloud work — with fixed-scope quotes after a free discovery call.",
  path: "/pricing",
  keywords: ["software development pricing", "app development cost", "web development packages"],
});

export default function PricingPage() {
  return (
    <>
      <PageHero
        breadcrumb="Pricing"
        align="center"
        eyebrow={`${siteConfig.shortName} pricing`}
        title="Plans that scale with your stage"
        lead="Honest ranges, fixed-scope quotes, and the flexibility to mix project and retainer work. Every engagement starts with a free discovery call — no commitment required."
      />

      <Section spacing="tight" className="pt-0">
        <div className="text-center">
          <PricingPlans />
        </div>
      </Section>

      {/* Included in every plan */}
      <section className="site-section--tight border-y border-[var(--border)] bg-[var(--band)]">
        <Container>
          <h2 className="type-band-label mb-8 text-center text-[var(--accent)]">
            Included in every plan
          </h2>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {includedAcrossAll.map((item, index) => (
              <Reveal as="li" key={item} index={index}>
                <span className="type-body flex h-full items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)] backdrop-blur-xl">
                  <Check className="h-4 w-4 shrink-0 text-[var(--success)]" aria-hidden />
                  {item}
                </span>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* Add-ons */}
      <Section>
        <SectionHeader
          align="center"
          eyebrow="Add-on services"
          title="Add-on capabilities, scoped separately"
          lead="Layer these onto any plan, or use them as a stand-alone engagement on an existing product."
        />

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {addOns.map((addon, index) => (
            <Reveal as="li" key={addon.name} index={index} className="h-full">
              <Card className="flex h-full flex-col" interactive padding="md">
                <CardIcon className="mb-4 h-11 w-11">
                  <addon.icon className="h-5 w-5" aria-hidden />
                </CardIcon>
                <h3 className="type-card-title mb-2 text-[var(--foreground)]">{addon.name}</h3>
                <p className="type-body mb-5 flex-1 text-sm text-[var(--text-muted)]">
                  {addon.desc}
                </p>
                <p className="font-mono text-sm font-semibold text-[var(--accent)]">
                  {addon.price}
                </p>
              </Card>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* FAQ */}
      <Section tone="band" width="narrow">
        <SectionHeader align="center" eyebrow="FAQ" title="Pricing questions, answered" />
        <Accordion items={pricingFaq} />
      </Section>

      {/* CTA */}
      <Section>
        <Reveal>
          <Card tone="highlight" padding="lg" className="relative overflow-hidden text-center">
            <div
              className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[var(--accent)]/15 blur-3xl"
              aria-hidden
            />
            <div
              className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-[var(--secondary)]/15 blur-3xl"
              aria-hidden
            />
            <div className="relative">
              <p className="type-eyebrow mb-4">Still deciding?</p>
              <h2 className="type-section-title mb-4 text-[var(--foreground)]">
                Not sure which plan fits your project?
              </h2>
              <p className="type-lead mx-auto mb-8 max-w-xl">
                Tell us about your idea in a 30-minute call. We&apos;ll recommend the right plan —
                or honestly tell you if we&apos;re not the right fit.
              </p>
              <Button href="/contact">
                Book free consultation
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </Card>
        </Reveal>
      </Section>
    </>
  );
}
