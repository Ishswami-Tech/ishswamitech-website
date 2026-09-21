import type { MetadataRoute } from "next";
import { blogPosts } from "@/data/blog";
import { legalDocuments } from "@/lib/legal/policy-content";
import { siteConfig } from "@/lib/site";

const BASE_URL = siteConfig.url;

const marketingRoutes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/services", changeFrequency: "weekly", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.8 },
  { path: "/blog", changeFrequency: "daily", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = marketingRoutes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Driven by the document registry so a retired policy URL can never be
  // submitted alongside its canonical replacement.
  const legalRoutes: MetadataRoute.Sitemap = Object.values(legalDocuments).map((doc) => ({
    url: `${BASE_URL}/${doc.slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.4,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [...staticRoutes, ...legalRoutes, ...blogRoutes];
}
