import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Contact IshSwamiTech",
  description:
    "Contact IshSwamiTech Solutions to discuss your web, mobile, AI, cloud, or design project and request a proposal.",
  path: "/contact",
  keywords: ["contact software company", "request software quote", "app development consultation"],
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
