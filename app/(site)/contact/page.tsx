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
import { MediaFrame } from "@/components/ui/media-frame";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { ContactForm } from "@/components/contact/contact-form";
import {
  activeSocialLinks,
  createPageMetadata,
  legalEntity,
  siteConfig,
  telHref,
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
  { icon: Clock, label: "Response Within 24 Hours" },
  { icon: ShieldCheck, label: "NDA Before Discovery" },
  { icon: MessageSquare, label: "No Sales Pressure" },
];

const contactChannels = [
  {
    icon: Mail,
    label: "Email Us",
    value: siteConfig.email,
    detail: "For new projects, partnerships, and general questions",
    href: `mailto:${siteConfig.email}`,
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
        title="Let's Build Something Worth Talking About"
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

            {/* Both lines get their own card rather than being crammed into one
                value: each is a separate tap target on a phone, which is the
                device most of this page's calls actually start from. */}
            <StaggerItem>
              <Card tone="solid" className="group" padding="md">
                <div className="flex items-start gap-4">
                  <CardIcon>
                    <Phone className="h-5 w-5" aria-hidden />
                  </CardIcon>
                  <div className="min-w-0">
                    <p className="type-band-label mb-1">Call Us</p>
                    <ul className="flex flex-col gap-1">
                      {siteConfig.phones.map(({ number, label }) => (
                        <li key={number}>
                          <a
                            href={telHref(number)}
                            className="type-card-title inline-flex items-baseline gap-2 text-[var(--foreground)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--accent)]"
                          >
                            {number}
                            <span className="type-tag text-[var(--text-tertiary)]">{label}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-1 text-[var(--text-base)] text-[var(--text-tertiary)]">
                      Mon – Fri, 10:00 AM – 7:00 PM IST
                    </p>
                  </div>
                </div>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <MediaFrame
                src="/Assets/aiml.jpg"
                alt="The IshSwamiTech team reviewing a product build together"
                ratio="wide"
                sizes="(max-width: 1024px) 100vw, 45vw"
              >
                <p className="type-ui text-[var(--foreground)]">
                  Senior-Led Delivery, From Pune to Wherever You Are
                </p>
              </MediaFrame>
            </StaggerItem>

            <StaggerItem>
              <Card tone="highlight" padding="md">
                <CardIcon className="mb-3">
                  <Sparkles className="h-5 w-5" aria-hidden />
                </CardIcon>
                <h2 className="type-card-title mb-2 text-[var(--foreground)]">
                  Prefer a Real Conversation?
                </h2>
                <p className="type-body mb-4 text-[var(--text-secondary)]">
                  Book a free 30-minute discovery call. We&apos;ll talk scope, timeline, and whether
                  we&apos;re a fit.
                </p>
                <a
                  href={`mailto:${siteConfig.email}?subject=Discovery%20call`}
                  className="type-ui group/link inline-flex items-center gap-1.5 text-[var(--accent)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--accent-strong)]"
                >
                  Schedule a Call
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
                  <span className="type-band-label">Or Find Us On</span>
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
                            className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-tertiary)] transition-[color,border-color,translate] duration-[var(--duration-fast)] hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:text-[var(--accent)] motion-reduce:transform-none"
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
          title="Frequently Asked Questions"
          lead="The questions we hear most often. Don't see yours? Just ask in your message."
        />
        <Accordion items={contactFaq} />
      </Section>
    </>
  );
}
