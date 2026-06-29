"use client";

import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-40 rounded-full border border-[var(--border)] bg-[var(--card)] p-3 text-[var(--accent)] shadow-[var(--navbar-shadow)] transition-all hover:-translate-y-1 hover:border-[var(--border-strong)] hover:bg-[var(--card-soft)]"
      aria-label="Scroll to top"
    >
      <ArrowUp size={20} />
    </button>
  );
}
