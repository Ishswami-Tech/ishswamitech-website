"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return !localStorage.getItem("cookie-consent");
  });

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-[60] p-4 md:p-6"
          role="dialog"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-desc"
        >
          <div className="container mx-auto max-w-4xl">
            <div className="glass flex flex-col items-start gap-4 rounded-xl border border-[var(--border)] p-6 md:flex-row md:items-center">
              <div className="flex flex-1 items-start gap-3">
                <div className="shrink-0 rounded-lg bg-[var(--card-soft)] p-2 text-[var(--accent)]">
                  <Cookie className="h-5 w-5" />
                </div>
                <div>
                  <h3
                    id="cookie-consent-title"
                    className="mb-1 font-heading font-semibold text-[var(--foreground)]"
                  >
                    We use cookies
                  </h3>
                  <p id="cookie-consent-desc" className="text-sm text-[var(--text-muted)]">
                    We use cookies to enhance your experience and analyze site traffic. By clicking
                    {" "}Accept, you consent to our use of cookies.{" "}
                    <Link href="/privacy-policy" className="text-[var(--accent)] hover:underline">
                      Learn more
                    </Link>
                  </p>
                </div>
              </div>
              <button
                onClick={accept}
                className="shrink-0 rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--background)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--button-shadow)]"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
