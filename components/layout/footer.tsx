import Link from "next/link";
import Image from "next/image";
import {
  Linkedin,
  Github,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { activeSocialLinks, legalEntity, siteConfig, type SocialPlatform } from "@/lib/site";

const footerLinks = {
  company: [
    { href: "/about", label: "About us" },
    { href: "/blog", label: "Insights" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact us" },
  ],
  services: [
    { href: "/services#web-development", label: "Web development" },
    { href: "/services#mobile-development", label: "Mobile apps" },
    { href: "/services#ai-ml", label: "AI / ML" },
    { href: "/services#cloud-solutions", label: "Cloud & DevOps" },
    { href: "/services#ui-ux-design", label: "UI / UX design" },
    { href: "/services#ecommerce", label: "E-commerce" },
  ],
  legal: [
    { href: "/privacy-policy", label: "Privacy policy" },
    { href: "/terms-and-conditions", label: "Terms & conditions" },
    { href: "/refund-cancellation", label: "Refund & cancellation" },
    { href: "/shipping-delivery", label: "Shipping & delivery" },
    { href: "/privacy-policy#cookies", label: "Cookie policy" },
  ],
};

const socialMeta: Record<SocialPlatform, { label: string; icon: React.ElementType }> = {
  linkedin: { label: "LinkedIn", icon: Linkedin },
  github: { label: "GitHub", icon: Github },
  x: { label: "X (Twitter)", icon: Twitter },
  instagram: { label: "Instagram", icon: Instagram },
  youtube: { label: "YouTube", icon: Youtube },
};

function LinkColumn({
  heading,
  links,
}: {
  heading: string;
  links: ReadonlyArray<{ href: string; label: string }>;
}) {
  return (
    <div>
      <h2 className="type-band-label mb-4">{heading}</h2>
      <ul className="flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-[var(--text-base)] text-[var(--text-secondary)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--foreground)]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="relative border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="relative overflow-hidden border-b border-[var(--border)]">
        <AnimatedBackground variant="gradient" intensity="subtle" />
        <Container className="relative z-10 py-14">
          <div className="grid items-center gap-8 md:grid-cols-[1.5fr_1fr]">
            <div>
              <p className="type-eyebrow mb-3">Let&apos;s build</p>
              <p className="type-section-title text-[var(--foreground)]">
                Have a project in mind? Let&apos;s talk.
              </p>
              <p className="type-lead mt-3 max-w-xl">
                Free 30-minute discovery call, no commitment.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
              <Button href="/contact">
                Start a project
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Button>
              <Button href="/services" variant="secondary">
                Browse services
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2">
            <Link href="/" className="mb-5 flex w-fit items-center gap-2.5">
              <span className="flex items-center justify-center overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-tint-strong)] p-1.5">
                <Image src={siteConfig.logo} alt="" width={28} height={28} className="h-7 w-7" />
              </span>
              <span className="text-[var(--text-lg)] font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                {siteConfig.shortName}
              </span>
            </Link>
            <p className="type-body mb-5 max-w-sm text-[var(--text-base)] text-[var(--text-secondary)]">
              {siteConfig.shortName} turns vision into digital reality with product engineering, AI
              integration, cloud delivery, and UX systems that help businesses ship faster.
            </p>
            <p className="type-band-label mb-6 text-[var(--accent)]">
              Web · Mobile · AI / ML · Cloud · Design
            </p>

            {activeSocialLinks.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {activeSocialLinks.map(({ platform, href }) => {
                  const { label, icon: Icon } = socialMeta[platform];
                  return (
                    <li key={platform}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-tertiary)] transition-[color,border-color,transform] duration-[var(--duration-fast)] hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:text-[var(--accent)] motion-reduce:transform-none"
                        aria-label={`${label} (opens in a new tab)`}
                      >
                        <Icon size={15} aria-hidden />
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <LinkColumn heading="Company" links={footerLinks.company} />
          <LinkColumn heading="Services" links={footerLinks.services} />
          <LinkColumn heading="Legal" links={footerLinks.legal} />

          <div>
            <h2 className="type-band-label mb-4">Get in touch</h2>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inline-flex items-start gap-2 text-[var(--text-base)] text-[var(--text-secondary)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--foreground)]"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  <span className="break-all">{siteConfig.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="inline-flex items-start gap-2 text-[var(--text-base)] text-[var(--text-secondary)] transition-colors duration-[var(--duration-fast)] hover:text-[var(--foreground)]"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  {siteConfig.phone}
                </a>
              </li>
              <li className="inline-flex items-start gap-2 text-[var(--text-base)] text-[var(--text-secondary)]">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                {legalEntity.publicLocation}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-[var(--border)] pt-7 md:flex-row md:items-center">
          <p className="text-[var(--text-base)] text-[var(--text-tertiary)]">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-[var(--text-xs)] text-[var(--text-tertiary)]">
            Crafted for founders, product teams, and ambitious builders.
          </p>
        </div>
      </Container>
    </footer>
  );
}
