import { Breadcrumbs } from "./breadcrumbs";
import { Container } from "./container";
import { AnimatedBackground, type BackgroundVariant } from "./animated-background";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function PageHero({
  breadcrumb,
  eyebrow,
  title,
  lead,
  aside,
  align = "start",
  compact = false,
  width = "default",
  background = "grid",
  children,
}: {
  breadcrumb: string;
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  aside?: React.ReactNode;
  align?: "start" | "center";
  compact?: boolean;
  width?: "default" | "narrow" | "prose";
  /** Ambient treatment behind the hero. Vary it so pages don't feel identical. */
  background?: BackgroundVariant;
  children?: React.ReactNode;
}) {
  const centered = align === "center";

  return (
    <section
      className={cn("page-hero relative isolate overflow-hidden", compact && "page-hero--compact")}
    >
      <AnimatedBackground variant={background} intensity="subtle" />

      <Container width={width} className="relative z-10">
        <Reveal immediate variant="fade">
          <Breadcrumbs current={breadcrumb} />
        </Reveal>

        <Reveal
          immediate
          delay={0.06}
          className={cn(
            centered && "text-center",
            aside && !centered && "grid items-end gap-10 lg:grid-cols-[1.25fr_1fr]"
          )}
        >
          <div>
            {eyebrow && <p className="type-eyebrow mb-3.5">{eyebrow}</p>}
            <h1 className="type-page-title mb-5 text-[var(--foreground)]">{title}</h1>
            {lead && <p className={cn("type-lead max-w-2xl", centered && "mx-auto")}>{lead}</p>}
            {children}
          </div>
          {aside && <div>{aside}</div>}
        </Reveal>
      </Container>
    </section>
  );
}
