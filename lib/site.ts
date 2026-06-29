import type { Metadata } from "next";

export const siteConfig = {
  name: "IshSwamiTech Solutions",
  shortName: "IshSwamiTech",
  url: "https://ishswamitech.vercel.app",
  title: "IshSwamiTech Solutions | Custom Software, AI, Cloud & Product Design",
  description:
    "IshSwamiTech Solutions builds high-performance web apps, mobile apps, AI products, cloud platforms, and UX systems for startups and growing businesses.",
  tagline: "Turning Vision Into Digital Reality",
  email: "hello@ishswamitech.com",
  phone: "+91-7218378311",
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
