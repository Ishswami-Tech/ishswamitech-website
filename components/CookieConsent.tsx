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
            <div className="glass rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2 rounded-lg bg-[#00D4FF]/20 shrink-0">
                  <Cookie className="w-5 h-5 text-[#00D4FF]" />
                </div>
                <div>
                  <h3
                    id="cookie-consent-title"
                    className="font-heading font-semibold text-[var(--foreground)] mb-1"
                  >
                    We use cookies
                  </h3>
                  <p id="cookie-consent-desc" className="text-[var(--text-muted)] text-sm">
                    We use cookies to enhance your experience and analyze site traffic. By clicking
                    {" "}Accept, you consent to our use of cookies.{" "}
                    <Link href="/privacy-policy" className="text-[#00D4FF] hover:underline">
                      Learn more
                    </Link>
                  </p>
                </div>
              </div>
              <button
                onClick={accept}
                className="px-5 py-2.5 rounded-lg bg-[#00D4FF] text-[#0A0F1E] font-semibold text-sm hover:bg-[#00D4FF]/90 transition-colors shrink-0"
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
