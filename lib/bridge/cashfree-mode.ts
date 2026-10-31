/**
 * Cashfree's JS SDK rejects a payment_session_id minted in the other environment
 * ("payment_session_id_invalid"). The mode must therefore follow the ORDER (the clinic's own
 * Cashfree credentials decide sandbox vs production), not this site's build env. The build env
 * is only the fallback when the order did not say.
 */

export type CashfreeMode = "sandbox" | "production";

function asMode(value: unknown): CashfreeMode | undefined {
  if (typeof value !== "string") {
    return undefined;
  }
  const normalized = value.trim().toLowerCase();
  if (normalized === "sandbox" || normalized === "test") {
    return "sandbox";
  }
  if (normalized === "production" || normalized === "prod" || normalized === "live") {
    return "production";
  }
  return undefined;
}

function readRecord(value: unknown): Record<string, unknown> | undefined {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : undefined;
}

/** Mode the order itself carries (intent first, then the bridge payload), if any. */
export function readOrderCashfreeMode(...sources: ReadonlyArray<unknown>): CashfreeMode | undefined {
  for (const source of sources) {
    const record = readRecord(source);
    if (!record) {
      continue;
    }
    const metadata = readRecord(record.metadata);
    const mode = asMode(metadata?.environment) ?? asMode(record.environment) ?? asMode(record.cashfreeMode);
    if (mode) {
      return mode;
    }
  }
  return undefined;
}

/** Order mode, else the site's configured mode, else sandbox (never silently production). */
export function resolveCashfreeMode(
  buildEnvMode: string | undefined,
  ...sources: ReadonlyArray<unknown>
): CashfreeMode {
  return readOrderCashfreeMode(...sources) ?? asMode(buildEnvMode) ?? "sandbox";
}
