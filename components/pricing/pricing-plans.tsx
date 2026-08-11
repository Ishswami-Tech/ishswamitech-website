"use client";

import { useId, useState } from "react";
import { ArrowUpRight, CalendarClock, Check, Sparkles, X } from "lucide-react";
import { plans, type BillingMode } from "@/data/pricing";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const modes: ReadonlyArray<{ value: BillingMode; label: string }> = [
  { value: "project", label: "Project-based" },
  { value: "monthly", label: "Monthly retainer" },
];

export function PricingPlans() {
  const [billing, setBilling] = useState<BillingMode>("project");
  const groupId = useId();

  return (
    <>
      <div
        role="radiogroup"
        aria-label="Billing mode"
        className="mb-12 inline-flex items-center gap-1 rounded-full border border-[var(--border)] bg-[var(--card)] p-1 backdrop-blur-xl"
      >
        {modes.map((mode) => {
          const active = billing === mode.value;
          return (
            <button
              key={mode.value}
              type="button"
              role="radio"
              aria-checked={active}
              id={`${groupId}-${mode.value}`}
              onClick={() => setBilling(mode.value)}
              className={cn(
                "type-ui rounded-full px-5 py-2 transition-all",
                active
                  ? "bg-[var(--accent)] text-[var(--button-foreground)] shadow-[var(--button-shadow)]"
                  : "text-[var(--text-muted)] hover:text-[var(--foreground)]"
              )}
            >
              {mode.label}
            </button>
          );
        })}
      </div>

      <ul className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <li key={plan.name} className="h-full">
            <div
              className={cn(
                "relative flex h-full flex-col rounded-[var(--radius-2xl)] border p-8 transition-colors",
                plan.popular
                  ? "border-[var(--border-strong)] bg-gradient-to-br from-[var(--card)] via-[var(--card)] to-[var(--card-soft)] shadow-[var(--button-shadow)]"
                  : "glass border-[var(--border)] hover:border-[var(--border-strong)]"
              )}
            >
              {plan.popular && (
                <p className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full [background:var(--button-gradient)] px-3 py-1 text-xs font-semibold text-[var(--button-foreground)] shadow-[var(--button-shadow)]">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  Most popular
                </p>
              )}

              <div className="mb-6 flex items-start justify-between gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--card-soft)] text-[var(--accent)]">
                  <plan.icon className="h-5 w-5" aria-hidden />
                </span>
                <span className="type-ui inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs text-[var(--text-muted)]">
                  <CalendarClock className="h-3.5 w-3.5" aria-hidden />
                  {plan.timeline[billing]}
                </span>
              </div>

              <h3 className="type-panel-title mb-1.5 text-[var(--foreground)]">{plan.name}</h3>
              <p className="type-body mb-6 text-sm text-[var(--text-muted)]">{plan.desc}</p>

              <p className="mb-6 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] p-5">
                <span className="type-stat-label mb-1 block">
                  {billing === "project" ? "Project range" : "Monthly retainer"}
                </span>
                <span className="type-stat block text-3xl text-[var(--foreground)]">
                  {plan.price[billing]}
                </span>
              </p>

              <ul className="mb-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="type-body flex items-start gap-2.5 text-sm text-[var(--foreground)]"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--success)]" aria-hidden />
                    <span>{feature}</span>
                  </li>
                ))}
                {plan.notIncluded.map((feature) => (
                  <li
                    key={feature}
                    className="type-body flex items-start gap-2.5 text-sm text-[var(--text-subtle)]"
                  >
                    <X className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
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
                size="md"
                fullWidth
              >
                {plan.cta}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
