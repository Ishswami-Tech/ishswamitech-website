import { registerOTel } from "@vercel/otel";
import type * as SentryNamespace from "@sentry/nextjs";

/**
 * Next.js instrumentation hook (stable in Next 16, no config flag needed).
 *
 * Traces: `@vercel/otel` wires OpenTelemetry for the Node and Edge runtimes.
 * The OTLP exporter reads its endpoint/headers from the standard
 * OTEL_EXPORTER_OTLP_* environment variables, so without them nothing is sent.
 * Spans carry route/method/status only; request and response bodies are never
 * recorded, which matters for the payment routes.
 *
 * Errors: the existing Sentry server/edge configs are loaded only when a DSN
 * is present, so an unconfigured environment keeps behaving exactly as before.
 */
export async function register() {
  const runtime = process.env.NEXT_RUNTIME;

  if (runtime === "nodejs" && process.env.SENTRY_DSN) {
    await import("./sentry.server.config");
  }
  if (runtime === "edge" && process.env.SENTRY_DSN) {
    await import("./sentry.edge.config");
  }

  registerOTel({ serviceName: "ishswamitech-website" });
}

export const onRequestError: typeof SentryNamespace.captureRequestError = async (
  ...args
) => {
  if (!process.env.SENTRY_DSN) return;
  const Sentry = await import("@sentry/nextjs");
  Sentry.captureRequestError(...args);
};
