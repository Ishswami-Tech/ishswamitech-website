import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Pricing",
  description:
    "Review Ishswami Tech pricing bands for startup builds, growth-stage products, enterprise software, and add-on services.",
  path: "/pricing",
  keywords: ["software project pricing", "app development cost", "custom software pricing"],
});

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
