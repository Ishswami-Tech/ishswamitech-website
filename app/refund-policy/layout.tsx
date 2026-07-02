import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Refund Policy",
  description: "Read the IshSwamiTech refund policy for software projects, retainers, and service engagements.",
  path: "/refund-policy",
});

export default function RefundPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
