import type { Metadata } from "next";
import {
  Clock,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  Sparkles,
  Twitter,
  Youtube,
} from "lucide-react";
import { contactFaq } from "@/data/faq";
import { Section, SectionHeader } from "@/components/ui/section";
import { Card, CardIcon } from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/contact/contact-form";
import {
  activeSocialLinks,
  createPageMetadata,
  legalEntity,
  siteConfig,
  type SocialPlatform,
} from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description:
    "Tell IshSwamiTech about your project and get a reply within one business day. Every engagement starts with a free 30-minute discovery call.",
  path: "/contact",
  keywords: ["contact software company", "hire developers", "project enquiry"],
});

const trustPoints = [
  { icon: Clock, label: "Response within 24 hours" },
  { icon: ShieldCheck, label: "NDA before discovery" },
  { icon: MessageSquare, label: "No sales pressure" },
];

const socialMeta: Record<SocialPlatform, { label: string; icon: React.ElementType }> = {
  linkedin: { label: "LinkedIn", icon: Linkedin },
  github: { label: "GitHub", icon: Github },
  x: { label: "X (Twitter)", icon: Twitter },
  instagram: { label: "Instagram", icon: Instagram },
  youtube: { label: "YouTube", icon: Youtube },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        breadcrumb="Contact"
        eyebrow={`Contact ${siteConfig.shortName}`}
        title="Let's build something worth talking about"
        lead="Tell us about your project and we'll get back within one business day. Every conversation starts with a free 30-minute discovery — no commitment, no scripts."
        aside={
          <ul className="flex flex-col gap-2.5">
            {trustPoints.map((point) => (
              <li
                key={point.label}
                className="type-body flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 backdrop-blur-xl"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--surface-tint)] text-[var(--accent)]">
                  <point.icon className="h-4 w-4" aria-hidden />
                </span>
                {point.label}
              </li>
            ))}
          </ul>
        }
      />

      <Section spacing="tight" className="pt-0">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <Reveal className="space-y-4">
            <a href={`mailto:${siteConfig.email}`} className="block">
              <Card className="group flex items-start gap-4" interactive padding="md">
                <CardIcon className="shrink-0">
                  <Mail className="h-5 w-5" aria-hidden />
                </CardIcon>
                <div>
                  <p className="type-eyebrow mb-1 text-[var(--text-secondary)]">Email us</p>
                  <p className="type-card-title break-all text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                    {siteConfig.email}
                  </p>
                  <p className="type-body text-sm text-[var(--text-secondary)]">
                    For new projects, partnerships, and general questions
                  </p>
                </div>
              </Card>
            </a>

            <a href={`tel:${siteConfig.phone}`} className="block">
              <Card className="group flex items-start gap-4" interactive padding="md">
                <CardIcon className="shrink-0">
                  <Phone className="h-5 w-5" aria-hidden />
                </CardIcon>
                <div>
                  <p className="type-eyebrow mb-1 text-[var(--text-secondary)]">Call us</p>
                  <p className="type-card-title text-[var(--foreground)] transition-colors group-hover:text-[var(--accent)]">
                    {siteConfig.phone}
                  </p>
                  <p className="type-body text-sm text-[var(--text-secondary)]">
                    Mon – Fri, 10:00 AM – 7:00 PM IST
                  </p>
                </div>
              </Card>
            </a>

            <Card className="flex items-start gap-4" padding="md">
              <CardIcon className="shrink-0">
                <MapPin className="h-5 w-5" aria-hidden />
              </CardIcon>
              <div>
                <p className="type-eyebrow mb-1 text-[var(--text-secondary)]">Office</p>
                <p className="type-card-title text-[var(--foreground)]">
                  {legalEntity.publicLocation}
                </p>
                <p className="type-body text-sm text-[var(--text-secondary)]">
                  Working with clients across India, the US, UK, and UAE
                </p>
              </div>
            </Card>

            <Card tone="highlight" className="relative overflow-hidden" padding="md">
              <div
                className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--accent)]/15 blur-2xl"
                aria-hidden
              />
              <div className="relative">
                <CardIcon className="mb-3 h-10 w-10">
                  <Sparkles className="h-5 w-5" aria-hidden />
                </CardIcon>
                <h2 className="type-card-title mb-2 text-[var(--foreground)]">
                  Prefer a real conversation?
                </h2>
                <p className="type-body mb-4 text-sm text-[var(--text-secondary)]">
                  Book a free 30-minute discovery call. We&apos;ll talk scope, timeline, and
                  whether we&apos;re a fit.
                </p>
                <a
                  href={`mailto:${siteConfig.email}?subject=Discovery%20call`}
                  className="type-ui inline-flex items-center gap-2 text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)]"
                >
                  Schedule a call
                  <span aria-hidden>&rarr;</span>
                </a>
              </div>
            </Card>

            {activeSocialLinks.length > 0 && (
              <div className="flex items-center gap-3 px-2 pt-2">
                <span className="type-ui text-[var(--text-secondary)]">Or find us on:</span>
                <ul className="flex items-center gap-2">
                  {activeSocialLinks.map(({ platform, href }) => {
                    const { label, icon: Icon } = socialMeta[platform];
                    return (
                      <li key={platform}>
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${label} (opens in a new tab)`}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--accent)]"
                        >
                          <Icon size={16} aria-hidden />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </Reveal>

          <div>
            <ContactForm />
          </div>
        </div>
      </Section>

      <Section tone="band" width="narrow">
        <SectionHeader
          align="center"
          eyebrow="FAQ"
          title="Frequently asked questions"
          lead="The questions we hear most often. Don't see yours? Just ask in your message."
        />
        <Accordion items={contactFaq} />
      </Section>
    </>
  );
}
