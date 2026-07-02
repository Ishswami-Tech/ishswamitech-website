import type { Metadata } from "next";

export const siteConfig = {
  name: "IshSwamiTech",
  shortName: "IshSwamiTech",
  url: "https://ishswami.in",
  title: "IshSwamiTech | Custom Software, AI, Cloud & Product Design",
  description:
    "IshSwamiTech builds high-performance web apps, mobile apps, AI products, cloud platforms, and UX systems for startups and growing businesses.",
  tagline: "Turning Vision Into Digital Reality",
  email: "info@ishswami.in",
  phone: "+91-7218378311",
  logo: "/Assets/brand/logo-mark.svg",
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
  registeredEmail: "info@ishswami.in",
  registeredPhone: "+91-7218378311",
  publicLocation: "Pune, India",
} as const;

export const paymentCollectionDisclosure =
  "Where enabled for a client platform, online payments may be collected by IshSwamiTech as the technology and payment collection partner. The underlying service, product, booking, subscription, consultation, event, or digital deliverable is provided by the respective client, merchant, clinic, creator, educator, consultant, or service provider under its own responsibility.";

export function absoluteUrl(path = "") {
  return path ? `${siteConfig.url}${path}` : siteConfig.url;
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
