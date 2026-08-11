import type { Metadata } from "next";
import { Check, FileCheck2, MessageSquare, ShieldCheck } from "lucide-react";
import { addOns, includedAcrossAll } from "@/data/pricing";
import { pricingFaq } from "@/data/faq";
import { Container } from "@/components/ui/container";
import { Section, SectionHeader } from "@/components/ui/section";
import { Card, CardIcon } from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import { PageHero } from "@/components/ui/page-hero";
import { CtaBand } from "@/components/ui/cta-band";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { PricingPlans } from "@/components/pricing/pricing-plans";
import { createPageMetadata, siteConfig } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Pricing",
  description:
    "Transparent project and retainer pricing for web, mobile, AI, and cloud work — with fixed-scope quotes after a free discovery call.",
  path: "/pricing",
  keywords: ["software development pricing", "app development cost", "web development packages"],
});

const pricingAssurances = [
  { icon: MessageSquare, text: "A plan recommendation, not a pitch" },
  { icon: FileCheck2, text: "Fixed-scope quote before any code" },
  { icon: ShieldCheck, text: "NDA signed before you share details" },
];

export default function PricingPage() {
  return (
    <>
      <PageHero
        breadcrumb="Pricing"
        align="center"
        background="spotlight"
        eyebrow={`${siteConfig.shortName} pricing`}
        title="Plans that scale with your stage"
        lead="Honest ranges, fixed-scope quotes, and the flexibility to mix project and retainer work. Every engagement starts with a free discovery call — no commitment required."
      />

      <Section spacing="tight" className="pt-0">
        <div className="flex flex-col items-center">
          <PricingPlans />
        </div>
      </Section>

      {/* Included in every plan */}
      <section className="site-section--tight border-y border-[var(--border)] bg-[var(--surface)]">
        <Container>
          <h2 className="type-band-label mb-8 text-center">Included in every plan</h2>
          <Stagger as="ul" gap={0.04} className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {includedAcrossAll.map((item) => (
              <StaggerItem as="li" key={item}>
                <span className="flex h-full items-center gap-2 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-raised)] px-3.5 py-2.5 text-[var(--text-base)] text-[var(--text-secondary)]">
                  <Check className="h-3.5 w-3.5 shrink-0 text-[var(--success)]" aria-hidden />
                  {item}
                </span>
              </StaggerItem>
            ))}
          </Stagger>
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

        <Stagger as="ul" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {addOns.map((addon) => (
            <StaggerItem as="li" key={addon.name} className="h-full">
              <Card tone="solid" className="flex h-full flex-col" interactive padding="md">
                <CardIcon className="mb-4">
                  <addon.icon className="h-5 w-5" aria-hidden />
                </CardIcon>
                <h3 className="type-card-title mb-2 text-[var(--foreground)]">{addon.name}</h3>
                <p className="type-body mb-5 flex-1 text-[var(--text-secondary)]">{addon.desc}</p>
                <p className="font-mono text-[var(--text-base)] font-medium text-[var(--accent)]">
                  {addon.price}
                </p>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* FAQ */}
      <Section tone="band" width="narrow">
        <SectionHeader align="center" eyebrow="FAQ" title="Pricing questions, answered" />
        <Accordion items={pricingFaq} />
      </Section>

      {/* CTA */}
      <CtaBand
        eyebrow="Still deciding?"
        title="Not sure which plan fits your project?"
        lead="Tell us about your idea in a 30-minute call. We'll recommend the right plan — or honestly tell you if we're not the right fit."
        primary={{ label: "Book free consultation", href: "/contact" }}
        secondary={{ label: "Browse services", href: "/services" }}
        assurances={pricingAssurances}
      />
    </>
  );
}
