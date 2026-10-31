"use client";

import type { ReactNode } from "react";
import { TempsAnalyticsProvider } from "@temps-sdk/react-analytics";

/**
 * Temps analytics wrapper. The provider already skips localhost; the
 * NEXT_PUBLIC_TEMPS_ANALYTICS_DISABLED=true kill switch turns it off anywhere
 * else (e.g. hosting that does not serve /api/_temps). Session recording is
 * left at the SDK default (off) because the payment pages carry sensitive data.
 */
const DISABLED = process.env.NEXT_PUBLIC_TEMPS_ANALYTICS_DISABLED === "true";

export function TempsAnalytics({ children }: { children: ReactNode }) {
  return (
    <TempsAnalyticsProvider basePath="/api/_temps" disabled={DISABLED}>
      {children}
    </TempsAnalyticsProvider>
  );
}
