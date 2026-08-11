import { cn } from "@/lib/utils";

/**
 * Shimmer placeholder. The sweep is a single composited pseudo-element (see
 * `.skeleton` in globals.css) rather than an opacity pulse, so a screen full
 * of these doesn't flash — which is both ugly and a vestibular trigger.
 */
export function Skeleton({
  className,
  rounded = "md",
}: {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "full";
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "skeleton",
        rounded === "sm" && "rounded-[var(--radius-sm)]",
        rounded === "md" && "rounded-[var(--radius-md)]",
        rounded === "lg" && "rounded-[var(--radius-xl)]",
        rounded === "full" && "rounded-full",
        className
      )}
    />
  );
}

/** Placeholder shaped like the article cards on the blog index. */
export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--border)] bg-[var(--surface-raised)]">
      <Skeleton className="aspect-video w-full" rounded="sm" />
      <div className="flex flex-col gap-3 p-5">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/5" />
        <Skeleton className="mt-2 h-4 w-28" />
      </div>
    </div>
  );
}

/** Multi-line text placeholder; the last line is short so it reads as prose. */
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn("h-4", index === lines - 1 ? "w-2/5" : "w-full")}
        />
      ))}
    </div>
  );
}
