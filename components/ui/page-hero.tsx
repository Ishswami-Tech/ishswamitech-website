import { Breadcrumbs } from "./breadcrumbs";
import { Container } from "./container";
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
  children?: React.ReactNode;
}) {
  const centered = align === "center";

  return (
    <section className={cn("page-hero", compact && "page-hero--compact")}>
      <Container width={width}>
        <Reveal immediate>
          <Breadcrumbs current={breadcrumb} />
        </Reveal>

        <Reveal
          immediate
          index={1}
          className={cn(
            centered && "text-center",
            aside && !centered && "grid items-end gap-10 lg:grid-cols-[1.25fr_1fr]"
          )}
        >
          <div>
            {eyebrow && <p className="type-eyebrow mb-4">{eyebrow}</p>}
            <h1 className="type-page-title mb-5 text-[var(--foreground)]">{title}</h1>
            {lead && (
              <p className={cn("type-lead max-w-2xl", centered && "mx-auto")}>{lead}</p>
            )}
            {children}
          </div>
          {aside && <div>{aside}</div>}
        </Reveal>
      </Container>
    </section>
  );
}
