import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Blog",
  description:
    "Read Ishswami Tech insights on scalable web apps, mobile product development, AI integration, cloud architecture, and design systems.",
  path: "/blog",
  keywords: ["software engineering blog", "AI blog", "web development insights"],
});

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
