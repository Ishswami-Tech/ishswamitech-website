import { Container } from "@/components/ui/container";
import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

/**
 * Mirrors the blog index layout so the page doesn't reflow when real content
 * arrives — the search field, filter row and card grid all land in place.
 */
export default function BlogLoading() {
  return (
    <>
      <section className="page-hero page-hero--compact">
        <Container>
          <Skeleton className="mb-6 h-4 w-40" />
          <Skeleton className="mb-4 h-4 w-28" />
          <Skeleton className="mb-5 h-11 w-3/4 max-w-xl" rounded="lg" />
          <Skeleton className="h-5 w-full max-w-2xl" />
        </Container>
      </section>

      <section className="site-section--tight site-section--no-top">
        <Container>
          <Skeleton className="mb-6 h-11 w-full max-w-md" rounded="lg" />

          <div className="mb-10 flex flex-wrap gap-2 border-b border-[var(--border)] pb-6">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-8 w-24" rounded="full" />
            ))}
          </div>

          <Skeleton className="mb-8 h-[380px] w-full" rounded="lg" />

          <div className="grid gap-10 lg:grid-cols-3">
            <div className="grid gap-5 md:grid-cols-2 lg:col-span-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
            <div className="flex flex-col gap-5">
              <Skeleton className="h-56 w-full" rounded="lg" />
              <Skeleton className="h-52 w-full" rounded="lg" />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
