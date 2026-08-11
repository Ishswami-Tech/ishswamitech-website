"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Stagger position within a group, in units of 60ms. */
  index?: number;
  /** Animate on mount instead of on scroll — use for above-the-fold content. */
  immediate?: boolean;
  as?: "div" | "article" | "figure" | "li" | "span";
};

/**
 * Scroll-reveal wrapper. Exists so pages can stay server components and only
 * ship this small client boundary rather than the whole page tree.
 */
export function Reveal({
  children,
  className,
  index = 0,
  immediate = false,
  as = "div",
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as];

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const transition = { duration: 0.5, delay: index * 0.06, ease: [0.2, 0.8, 0.2, 1] as const };
  const animation = { opacity: 1, y: 0 };

  return (
    <MotionTag
      className={cn(className)}
      initial={{ opacity: 0, y: 20 }}
      transition={transition}
      {...(immediate
        ? { animate: animation }
        : { whileInView: animation, viewport: { once: true, margin: "-80px" } })}
    >
      {children}
    </MotionTag>
  );
}
