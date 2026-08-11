"use client";

import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { pageVariants, transition } from "@/lib/motion";

/**
 * Route-change entrance for the marketing pages.
 *
 * Enter-only by design. An exit animation would need the outgoing tree to stay
 * mounted through the navigation, which in the App Router means intercepting
 * every link and holding the old route — a lot of machinery, and it delays the
 * new page by the length of the exit. Fading the incoming page in reads as
 * smooth without making navigation feel slower than it is.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      data-reveal=""
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      transition={transition.normal}
    >
      {children}
    </motion.div>
  );
}
