import type { Metadata } from "next";

export const siteConfig = {
  name: "Ishswami Tech",
  shortName: "Ishswami",
  url: "https://ishswami.in",
  title: "Ishswami Tech | Custom Software, AI, Cloud & Product Design",
  description:
    "Ishswami Tech builds high-performance web apps, mobile apps, AI products, cloud platforms, and UX systems for startups, clinics, creators, and growing businesses.",
  tagline: "Turning Vision Into Digital Reality",
  email: "info@ishswami.in",
  phone: "+91-9226263215",
  logo: "/logo.png",
  ogImage: "/logo.png",
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
  enterpriseName: "ISHSWAMI TECH",
  displayName: "Ishswami Tech",
  registeredEmail: "info@ishswami.in",
  registeredPhone: "+91-9226263215",
  publicLocation: "Pune, India",
} as const;

export const paymentCollectionDisclosure =
  "Where enabled for a client platform, online payments may be collected by ISHSWAMI TECH as the technology and payment collection partner. The underlying service, product, booking, subscription, consultation, event, or digital deliverable is provided by the respective client, merchant, clinic, creator, educator, consultant, or service provider under its own responsibility.";

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
