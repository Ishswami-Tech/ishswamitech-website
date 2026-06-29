"use client";

import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 p-3 rounded-full bg-[#111827] border border-[#8B9CB6]/20 text-[#00D4FF] hover:bg-[#00D4FF]/20 hover:border-[#00D4FF]/50 transition-all z-40"
      aria-label="Scroll to top"
    >
      <ArrowUp size={20} />
    </button>
  );
}
