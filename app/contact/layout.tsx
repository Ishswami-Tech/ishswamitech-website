import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
<<<<<<< Updated upstream
  title: "Contact Ishswami Tech",
  description:
    "Contact Ishswami Tech to discuss your web, mobile, AI, cloud, or design project and request a proposal.",
=======
  title: "Contact Us",
  description:
    "Contact IshSwamiTech to discuss your web, mobile, AI, cloud, or design project and request a proposal.",
>>>>>>> Stashed changes
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
