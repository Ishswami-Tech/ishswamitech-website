import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Software Development Services",
  description:
    "Explore IshSwamiTech services across web development, mobile apps, AI/ML, desktop software, cloud engineering, and UI/UX design.",
  path: "/services",
  keywords: ["software development services", "web and mobile app services", "AI consulting services"],
});

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
