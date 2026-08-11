"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, CalendarClock, Check, Sparkles, X } from "lucide-react";
import { plans, type BillingMode } from "@/data/pricing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardIcon } from "@/components/ui/card";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { transition } from "@/lib/motion";
import { cn } from "@/lib/utils";

const modes = [
  { value: "project" as const, label: "Project-based" },
  { value: "monthly" as const, label: "Monthly retainer" },
];

/**
 * Crossfades the price when the billing mode changes, so the number reads as
 * having been swapped rather than having silently mutated.
 */
function AnimatedPrice({ value, billing }: { value: string; billing: BillingMode }) {
  return (
    <span className="block overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={billing}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={transition.fast}
          className="type-stat block text-3xl text-[var(--foreground)]"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function PricingPlans() {
  const [billing, setBilling] = useState<BillingMode>("project");

  return (
    <>
      <SegmentedControl
        options={modes}
        value={billing}
        onChange={setBilling}
        label="Billing mode"
        className="mb-12"
      />

      <Stagger as="ul" className="grid w-full gap-5 text-left lg:grid-cols-3">
        {plans.map((plan) => (
          <StaggerItem as="li" key={plan.name} className="h-full">
            <div
              className={cn(
                "relative flex h-full flex-col rounded-[var(--radius-2xl)] p-7",
                "transition-[transform,box-shadow,border-color] duration-[var(--duration-normal)] ease-[var(--ease-out)]",
                "hover:-translate-y-1 motion-reduce:transform-none motion-reduce:hover:transform-none",
                plan.popular
                  ? "gradient-border bg-[linear-gradient(150deg,var(--surface-overlay),var(--surface))] shadow-[var(--shadow-glow)] hover:shadow-[var(--shadow-glow-strong)]"
                  : "border border-[var(--border)] bg-[var(--surface-raised)] shadow-[var(--shadow-sm)] hover:border-[var(--border-strong)] hover:shadow-[var(--shadow-lg)]"
              )}
            >
              {plan.popular && (
                <Badge
                  tone="gradient"
                  className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap"
                >
                  <Sparkles className="h-3 w-3" aria-hidden />
                  Most popular
                </Badge>
              )}

              <div className="mb-6 flex items-start justify-between gap-3">
                <CardIcon>
                  <plan.icon className="h-5 w-5" aria-hidden />
                </CardIcon>
                <Badge tone="neutral">
                  <CalendarClock className="h-3 w-3" aria-hidden />
                  {plan.timeline[billing]}
                </Badge>
              </div>

              <h3 className="type-panel-title mb-1.5 text-[var(--foreground)]">{plan.name}</h3>
              <p className="type-body mb-6 text-[var(--text-secondary)]">{plan.desc}</p>

              <div className="mb-6 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] p-5">
                <span className="type-stat-label mb-1.5 block">
                  {billing === "project" ? "Project range" : "Monthly retainer"}
                </span>
                <AnimatedPrice value={plan.price[billing]} billing={billing} />
              </div>

              <ul className="mb-6 flex flex-1 flex-col gap-2.5">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-[var(--text-base)] text-[var(--text-secondary)]"
                  >
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--success)]" aria-hidden />
                    <span>{feature}</span>
                  </li>
                ))}
                {plan.notIncluded.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-[var(--text-base)] text-[var(--text-tertiary)]"
                  >
                    <X className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                    <span>
                      <span className="sr-only">Not included: </span>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                href="/contact"
                variant={plan.popular ? "primary" : "secondary"}
                fullWidth
              >
                {plan.cta}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </>
  );
}
