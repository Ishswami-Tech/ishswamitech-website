import type { Metadata } from "next";
import {
  ArrowRight,
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
import { Stagger, StaggerItem } from "@/components/motion/stagger";
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

const contactChannels = [
  {
    icon: Mail,
    label: "Email us",
    value: siteConfig.email,
    detail: "For new projects, partnerships, and general questions",
    href: `mailto:${siteConfig.email}`,
  },
  {
    icon: Phone,
    label: "Call us",
    value: siteConfig.phone,
    detail: "Mon – Fri, 10:00 AM – 7:00 PM IST",
    href: `tel:${siteConfig.phone}`,
  },
  {
    icon: MapPin,
    label: "Office",
    value: legalEntity.publicLocation,
    detail: "Working with clients across India, the US, UK, and UAE",
    href: undefined,
  },
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
        background="aurora"
        aside={
          <ul className="flex flex-col gap-2.5">
            {trustPoints.map((point) => (
              <li
                key={point.label}
                className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-glass)] px-4 py-3 text-[var(--text-base)] text-[var(--text-secondary)] backdrop-blur-md"
              >
                <CardIcon size="sm">
                  <point.icon className="h-4 w-4" aria-hidden />
                </CardIcon>
                {point.label}
              </li>
            ))}
          </ul>
        }
      />

      <Section spacing="tight" className="pt-0">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <Stagger className="flex flex-col gap-3.5">
            {contactChannels.map((channel) => {
              const Wrapper = channel.href ? "a" : "div";
              return (
                <StaggerItem key={channel.label}>
                  <Wrapper {...(channel.href ? { href: channel.href } : {})} className="block">
                    <Card
                      tone="solid"
                      className="group flex items-start gap-4"
                      interactive={Boolean(channel.href)}
                      padding="md"
                    >
                      <CardIcon>
                        <channel.icon className="h-5 w-5" aria-hidden />
                      </CardIcon>
                      <div>
                        <p className="type-band-label mb-1">{channel.label}</p>
                        <p className="type-card-title break-all text-[var(--foreground)] transition-colors duration-[var(--duration-fast)] group-hover:text-[var(--accent)]">
                          {channel.value}
                        </p>
                        <p className="mt-0.5 text-[var(--text-base)] text-[var(--text-tertiary)]">
                          {channel.detail}
                        </p>
                      </div>
                    </Card>
                  </Wrapper>
                </StaggerItem>
              );
            })}

            <StaggerItem>
              <Card tone="highlight" padding="md">
                <CardIcon className="mb-3">
                  <Sparkles className="h-5 w-5" aria-hidden />
                </CardIcon>
                <h2 className="type-card-title mb-2 text-[var(--foreground)]">
                  Prefer a real conversation?
                </h2>
                <p className="type-body mb-4 text-[var(--text-secondary)]">
                  Book a free 30-minute discovery call. We&apos;ll talk scope, timeline, and whether
                  we&apos;re a fit.
                </p>
                <a
                  href={`mailto:${siteConfig.email}?subject=Discovery%20call`}
                  className="type-ui group/link inline-flex items-center gap-1.5 text-[var(--accent)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--accent-strong)]"
                >
                  Schedule a call
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-[var(--duration-fast)] group-hover/link:translate-x-0.5"
                    aria-hidden
                  />
                </a>
              </Card>
            </StaggerItem>

            {activeSocialLinks.length > 0 && (
              <StaggerItem>
                <div className="flex items-center gap-3 pt-1">
                  <span className="type-band-label">Or find us on</span>
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
                            className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-tertiary)] transition-[color,border-color,transform] duration-[var(--duration-fast)] hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:text-[var(--accent)] motion-reduce:transform-none"
                          >
                            <Icon size={15} aria-hidden />
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </StaggerItem>
            )}
          </Stagger>

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
