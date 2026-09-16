import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  beforeSend(event) {
    // Scrub PHI/PII from healthcare application
    if (event.request) {
      const scrub = (obj: any) => {
        if (!obj || typeof obj !== "object") return;
        for (const key of Object.keys(obj)) {
          if (/name|email|phone|address|dob|medical|patient|diagnosis|prescription|ssn|aadhaar|pan/i.test(key)) {
            obj[key] = "[REDACTED]";
          } else if (typeof obj[key] === "object") scrub(obj[key]);
        }
      };
      scrub(event.request);
    }
    return event;
  },
});
