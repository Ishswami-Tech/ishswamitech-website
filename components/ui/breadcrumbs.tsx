import Link from "next/link";

export function Breadcrumbs({ current }: { current: string }) {
  return (
    <nav aria-label="Breadcrumb" className="type-ui mb-6 text-[var(--text-secondary)]">
      <ol className="flex items-center gap-2">
        <li>
          <Link href="/" className="transition-colors hover:text-[var(--accent)]">
            Home
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li className="text-[var(--foreground)]" aria-current="page">
          {current}
        </li>
      </ol>
    </nav>
  );
}
