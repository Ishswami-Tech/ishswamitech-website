import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "About Ishswami Tech",
  description:
<<<<<<< Updated upstream
    "Meet the team behind Ishswami Tech and learn how we build reliable software products with a client-first mindset.",
=======
    "Meet the team behind IshSwamiTech and learn how we build reliable software products with a client-first mindset.",
>>>>>>> Stashed changes
  path: "/about",
  keywords: ["software company about page", "technology team", "product engineering company"],
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
