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
import ScrollToTop from "./ScrollToTop";
import { legalEntity, siteConfig } from "@/lib/site";

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
    { href: "/refund-policy", label: "Refund policy" },
    { href: "/privacy-policy#cookies", label: "Cookie policy" },
  ],
};

const socialLinks = [
  { href: siteConfig.social.linkedin, label: "LinkedIn", icon: Linkedin },
  { href: siteConfig.social.github, label: "GitHub", icon: Github },
  { href: siteConfig.social.x, label: "X (Twitter)", icon: Twitter },
  { href: siteConfig.social.instagram, label: "Instagram", icon: Instagram },
  { href: siteConfig.social.youtube, label: "YouTube", icon: Youtube },
].filter((link) => Boolean(link.href));

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] backdrop-blur-xl">
      <div className="border-b border-[var(--border)] bg-[var(--home-band-bg)]">
        <div className="container mx-auto px-4 py-12">
          <div className="grid items-center gap-8 md:grid-cols-[1.5fr_1fr]">
            <div>
              <p className="type-eyebrow mb-3">Let&apos;s build</p>
              <h2 className="type-section-title text-[var(--foreground)]">
                Have a project in mind? Let&apos;s talk.
              </h2>
              <p className="type-lead mt-3 max-w-xl">
                We&apos;d love to hear about it. Free 30-minute discovery call, no commitment.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row md:justify-end">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full [background:var(--button-gradient)] px-6 py-3 font-semibold text-[var(--button-foreground)] shadow-[var(--button-shadow)] transition-all hover:-translate-y-0.5"
              >
                Start a project
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--border-strong)] bg-[var(--card)] px-6 py-3 font-semibold text-[var(--foreground)] transition-colors hover:bg-[var(--card-soft)]"
              >
                Browse services
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-6">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="mb-5 flex items-center gap-3">
              <div className="flex items-center justify-center overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] p-1.5">
                <Image
                  src="/Assets/brand/logo-mark.svg"
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-heading text-xl font-bold gradient-text">
                  {siteConfig.shortName}
                </span>
              </div>
            </Link>
            <p className="type-body mb-5 max-w-sm text-sm text-[var(--text-muted)]">
              IshSwamiTech turns vision into digital reality with product engineering, AI
              integration, cloud delivery, and UX systems that help businesses ship faster.
            </p>
            <p className="type-ui mb-6 text-xs uppercase tracking-[0.24em] text-[var(--accent)]">
              Web · Mobile · AI / ML · Cloud · Design
            </p>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--accent)]"
                  aria-label={`${label} (opens in a new tab)`}
                >
                  <Icon size={16} aria-hidden />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="type-band-label mb-4 text-[var(--foreground)]">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="type-body text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="type-band-label mb-4 text-[var(--foreground)]">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="type-body text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="type-band-label mb-4 text-[var(--foreground)]">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="type-body text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="type-band-label mb-4 text-[var(--foreground)]">Get in touch</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="type-body group inline-flex items-start gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                  <span className="break-all">{siteConfig.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="type-body group inline-flex items-start gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                  {siteConfig.phone}
                </a>
              </li>
              <li className="type-body inline-flex items-start gap-2 text-sm text-[var(--text-muted)]">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                {legalEntity.publicLocation}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-[var(--border)] pt-8 md:flex-row md:items-center">
          <p className="type-body text-sm text-[var(--text-muted)]">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="type-body text-xs text-[var(--text-muted)]">
            Crafted with care for founders, product teams, and ambitious builders.
          </p>
        </div>
      </div>

      <ScrollToTop />
    </footer>
  );
}
