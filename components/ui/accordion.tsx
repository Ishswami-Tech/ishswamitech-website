"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type AccordionItem = {
  id: number | string;
  question: string;
  answer: string;
};

export function Accordion({ items }: { items: readonly AccordionItem[] }) {
  const [openId, setOpenId] = useState<AccordionItem["id"] | null>(null);
  const reduceMotion = useReducedMotion();
  const baseId = useId();

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isOpen = openId === item.id;
        const panelId = `${baseId}-panel-${item.id}`;
        const buttonId = `${baseId}-button-${item.id}`;

        return (
          <div
            key={item.id}
            className={cn(
              "glass overflow-hidden rounded-[var(--radius-xl)] border transition-colors",
              isOpen ? "border-[var(--border-strong)]" : "border-[var(--border)]"
            )}
          >
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-[var(--card-soft)]"
              >
                <span className="type-card-title text-base text-[var(--foreground)]">
                  {item.question}
                </span>
                <ChevronDown
                  aria-hidden
                  className={cn(
                    "h-5 w-5 shrink-0 text-[var(--accent)] transition-transform duration-300",
                    isOpen && "rotate-180"
                  )}
                />
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={reduceMotion ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="type-body px-6 pb-5 text-[var(--text-muted)]">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
