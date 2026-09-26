import type { Metadata } from "next";

export const siteConfig = {
  name: "IshSwamiTech",
  shortName: "IshSwamiTech",
  /** The wordmark in two parts: the logo sets "Tech" in gold, and the brand
   *  text mirrors it. Split here so every place that renders it agrees. */
  wordmark: { primary: "IshSwami", accent: "Tech" },
  url: "https://ishswami.in",
  title: "IshSwamiTech | Custom Software, AI, Cloud & Product Design",
  description:
    "IshSwamiTech builds high-performance web apps, mobile apps, AI products, cloud platforms, and UX systems for startups and growing businesses.",
  tagline: "Turning Vision Into Digital Reality",
  email: "info@ishswami.in",
  /**
   * Primary line. Stays a scalar because schema.org `telephone`, the legal
   * pages and the payment disclosures all want exactly one canonical number.
   * `phones` is what the UI lists wherever it has room for more than one.
   */
  phone: "+91-7218378311",
  phones: [
    { number: "+91-7218378311", label: "Primary" },
    { number: "+91-7888154917", label: "Direct" },
  ],
  /*
    Two forms of the same logo, because one cannot serve both schemes. The
    lockup's "IshSwami" is dark navy and disappears on the dark footer and
    hero, so anywhere on a dark surface uses the mark — which carries enough
    gold to read on either — beside type in the site's own font.
  */
  logo: "/Assets/brand/logo-mark.png",
  logoLockup: "/Assets/brand/logo-lockup.png",
  ogImage: "/Assets/hero_img.jpg",
  locale: "en_US",
  keywords: [
    "custom software development company",
    "web development company",
    "mobile app development company",
    "AI software development",
    "cloud solutions company",
    "UI UX design agency",
    "Next.js development company",
    "React development company",
    "startup product development",
    "software outsourcing India",
    "IshSwamiTech",
    "Ish Swami Tech",
    "ishswamitech",
  ],
  social: {
    linkedin: "",
    github: "",
    instagram: "",
    youtube: "",
    x: "",
  },
} as const;

export const legalEntity = {
  enterpriseName: "ISHSWAMITECH",
  displayName: "IshSwamiTech",
  registeredEmail: siteConfig.email,
  registeredPhone: siteConfig.phone,
  publicLocation: "Pune, India",
} as const;

export const paymentCollectionDisclosure =
  "Where enabled for a client platform, online payments may be collected by IshSwamiTech as the technology and payment collection partner. The underlying service, product, booking, subscription, consultation, event, or digital deliverable is provided by the respective client, merchant, clinic, creator, educator, consultant, or service provider under its own responsibility.";

export type SocialPlatform = keyof typeof siteConfig.social;

/**
 * Only platforms with a configured URL. Consumers must use this rather than
 * reading `siteConfig.social` directly, so unconfigured profiles never render
 * as empty-href links.
 */
export const activeSocialLinks: ReadonlyArray<{ platform: SocialPlatform; href: string }> =
  (Object.entries(siteConfig.social) as Array<[SocialPlatform, string]>)
    .filter(([, href]) => href.length > 0)
    .map(([platform, href]) => ({ platform, href }));

export function absoluteUrl(path = "") {
  return path ? `${siteConfig.url}${path}` : siteConfig.url;
}

/**
 * `tel:` target for a display number. The separators we print for legibility
 * are not valid in the URI, and some Android dialers silently drop everything
 * after the first one rather than failing loudly.
 */
export function telHref(number: string) {
  return `tel:${number.replace(/[^\d+]/g, "")}`;
}

type MetadataInput = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  images?: string[];
};

export function createPageMetadata({
  title,
  description,
  path = "",
  keywords = [],
  images = [siteConfig.ogImage],
}: MetadataInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    keywords: [...siteConfig.keywords, ...keywords],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: images.map((image) => ({
        url: image,
        alt: title,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}
