"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 600);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
        })
      }
      className="fixed bottom-6 right-6 z-40 rounded-full border border-[var(--border)] bg-[var(--card)] p-3 text-[var(--accent)] shadow-[var(--navbar-shadow)] backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-[var(--border-strong)] hover:bg-[var(--card-soft)] motion-reduce:hover:translate-y-0"
      aria-label="Scroll to top"
    >
      <ArrowUp size={20} aria-hidden />
    </button>
  );
}
