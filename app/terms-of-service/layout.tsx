import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Terms & Conditions",
  description: "Terms and conditions for using IshSwamiTech services and deliverables.",
  path: "/terms-of-service",
});

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
