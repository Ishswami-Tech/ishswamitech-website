"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Plus } from "lucide-react";
import { duration, easeOut } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type AccordionItem = {
  id: number | string;
  question: string;
  answer: string;
};

export function Accordion({ items }: { items: readonly AccordionItem[] }) {
  const [openId, setOpenId] = useState<AccordionItem["id"] | null>(null);
  const reduced = useReducedMotion();
  const baseId = useId();

  return (
    <div className="flex flex-col gap-2.5">
      {items.map((item) => {
        const isOpen = openId === item.id;
        const panelId = `${baseId}-panel-${item.id}`;
        const buttonId = `${baseId}-button-${item.id}`;

        return (
          <div
            key={item.id}
            className={cn(
              "overflow-hidden rounded-[var(--radius-xl)] border bg-[var(--surface-raised)]",
              "transition-[border-color,background-color,box-shadow]",
              "duration-[var(--duration-normal)] ease-[var(--ease-out)]",
              isOpen
                ? "border-[var(--border-strong)] shadow-[var(--shadow-md)]"
                : "border-[var(--border)] hover:border-[var(--border-hover)]"
            )}
          >
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span
                  className={cn(
                    "type-card-title transition-colors duration-[var(--duration-fast)]",
                    isOpen ? "text-[var(--foreground)]" : "text-[var(--text-secondary)]"
                  )}
                >
                  {item.question}
                </span>
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border",
                    "transition-[rotate,background-color,border-color,color]",
                    "duration-[var(--duration-normal)] ease-[var(--ease-out)]",
                    "motion-reduce:transition-none",
                    isOpen
                      ? "rotate-45 border-transparent bg-[var(--primary)] text-[var(--text-on-brand)]"
                      : "border-[var(--border)] text-[var(--text-tertiary)]"
                  )}
                >
                  <Plus className="h-3.5 w-3.5" aria-hidden />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  /* Height is the one property worth animating off the compositor
                     here: transform-based collapse either clips the text or
                     scales it. Kept short so the layout cost stays trivial. */
                  initial={reduced ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: reduced ? 0 : duration.normal, ease: easeOut }}
                  className="overflow-hidden"
                >
                  <p className="type-body px-5 pb-5 text-[var(--text-secondary)]">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
