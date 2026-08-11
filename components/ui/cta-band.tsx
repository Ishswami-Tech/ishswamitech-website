import { ArrowUpRight } from "lucide-react";
import { Button } from "./button";
import { Section } from "./section";
import { AnimatedBackground } from "./animated-background";
import { Reveal } from "@/components/motion/reveal";

type Cta = { label: string; href: string };

/**
 * Closing call to action. Home, services, pricing and about all ended with a
 * near-identical block; the only real differences were the copy and the
 * reassurance list, so those are the props.
 */
export function CtaBand({
  eyebrow,
  title,
  lead,
  primary,
  secondary,
  assurances,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  primary: Cta;
  secondary?: Cta;
  assurances: ReadonlyArray<{ icon: React.ElementType; text: string }>;
}) {
  return (
    <Section>
      <Reveal variant="scale">
        <div className="gradient-border relative overflow-hidden rounded-[var(--radius-3xl)] bg-[var(--surface)] p-8 md:p-12">
          <AnimatedBackground variant="spotlight" intensity="subtle" />

          <div className="relative z-10 grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-center">
            <div>
              <p className="type-eyebrow mb-3.5">{eyebrow}</p>
              <h2 className="type-section-title mb-4 text-[var(--foreground)]">{title}</h2>
              <p className="type-lead mb-8 max-w-xl">{lead}</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button href={primary.href} size="lg">
                  {primary.label}
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </Button>
                {secondary && (
                  <Button href={secondary.href} variant="secondary" size="lg">
                    {secondary.label}
                  </Button>
                )}
              </div>
            </div>

            <ul className="grid gap-2.5">
              {assurances.map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-glass)] px-4 py-3 text-[var(--text-base)] text-[var(--text-secondary)] backdrop-blur-md"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface-tint-strong)] text-[var(--accent)]">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
