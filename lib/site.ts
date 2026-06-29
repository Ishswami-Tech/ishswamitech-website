import type { Metadata } from "next";

export const siteConfig = {
  name: "IshSwamiTech Solutions",
  shortName: "IshSwamiTech",
  url: "https://ishswamitech.vercel.app",
  title: "IshSwamiTech Solutions | Custom Software, AI, Cloud & Product Design",
  description:
    "IshSwamiTech Solutions builds high-performance web apps, mobile apps, AI products, cloud platforms, and UX systems for startups and growing businesses.",
  tagline: "Turning Vision Into Digital Reality",
  email: "info@ishswami.in",
  phone: "+91-9226263215",
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
  ],
  social: {
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    x: "https://twitter.com",
  },
} as const;

export const legalEntity = {
  enterpriseName: "ISHSWAMI TECH",
  displayName: "IshSwamiTech Solutions",
  registeredEmail: "info@ishswami.in",
  registeredPhone: "+91-9226263215",
  publicLocation: "Pune, India",
} as const;

export const paymentCollectionDisclosure =
  "Where enabled for a client platform, online payments may be collected by ISHSWAMI TECH as the technology and payment collection partner. The underlying healthcare, consultation, or clinic service is delivered by the respective service provider under its own professional responsibility.";

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
