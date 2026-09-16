import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1,
  beforeSend(event) {
    // Scrub PHI/PII
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
