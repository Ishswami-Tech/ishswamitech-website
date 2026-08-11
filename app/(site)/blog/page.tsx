import type { Metadata } from "next";
import { blogPosts } from "@/data/blog";
import { PageHero } from "@/components/ui/page-hero";
import { BlogIndex } from "@/components/blog/blog-index";
import { createPageMetadata, siteConfig } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Insights",
  description:
    "Field notes, deep dives, and case studies on web engineering, AI, mobile, design, and shipping software that grows.",
  path: "/blog",
  keywords: ["software engineering blog", "web development insights", "technology articles"],
});

export default function BlogPage() {
  return (
    <>
      <PageHero
        breadcrumb="Insights"
        eyebrow={`${siteConfig.shortName} insights`}
        title="Practical writing on building modern software"
        lead="Field notes, deep dives, and case studies covering web engineering, AI, mobile, design, and the operating model behind shipping products that grow."
      />
      <BlogIndex posts={blogPosts} />
    </>
  );
}
