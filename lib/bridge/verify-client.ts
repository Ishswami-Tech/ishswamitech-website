import { createHmac } from "node:crypto";
import type { PaymentApp } from "./app-registry.ts";

const VERIFY_TIMEOUT_MS = 15_000;

export type PaymentOutcome = "SUCCESS" | "FAILED" | "CANCELLED";

export interface VerifyParams {
  readonly orderId: string;
  readonly paymentId?: string;
  readonly provider?: string;
  readonly razorpaySignature?: string;
  /** "subscription" when the order id is a Razorpay subscription id. */
  readonly mode?: "order" | "subscription";
}

export interface VerifyOptions {
  readonly fetchImpl?: typeof fetch;
  readonly nowMs?: () => number;
}

/** HMAC-SHA256 (hex) over `${timestampSeconds}.${rawBody}` so the app can authenticate the bridge. */
export function signVerifyRequest(secret: string, timestampSeconds: string, body: string): string {
  return createHmac("sha256", secret).update(`${timestampSeconds}.${body}`).digest("hex");
}

/**
 * Asks the app's backend whether the order was paid. Anything other than an explicit
 * `{ "success": true }` from a 2xx response counts as a failure.
 */
export async function verifyPaymentWithApp(
  app: PaymentApp,
  params: VerifyParams,
  options: VerifyOptions = {},
): Promise<{ success: boolean }> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const nowMs = options.nowMs ?? Date.now;
  const timestamp = String(Math.floor(nowMs() / 1000));
  const body = JSON.stringify({ appId: app.appId, ...params });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS);
  try {
    const response = await fetchImpl(app.verifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Bridge-Timestamp": timestamp,
        "X-Bridge-Signature": signVerifyRequest(app.secret, timestamp, body),
      },
      body,
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) {
      return { success: false };
    }
    const data: unknown = await response.json().catch(() => null);
    const success = typeof data === "object" && data !== null && (data as { success?: unknown }).success === true;
    return { success };
  } catch (error) {
    console.error(`[payment-bridge] verify call failed for app "${app.appId}":`, error);
    return { success: false };
  } finally {
    clearTimeout(timeout);
  }
}

export interface ReturnUrlParams {
  readonly status: PaymentOutcome;
  readonly orderId: string;
  readonly paymentId?: string;
  readonly provider?: string;
}

/**
 * The destination always comes from the registry, never from the request, so it cannot be
 * used as an open redirect. The result params are hints; apps must re-confirm server-side.
 */
export function buildReturnUrl(app: PaymentApp, params: ReturnUrlParams): string {
  const target = new URL(app.returnUrl);
  target.searchParams.set("paymentStatus", params.status);
  target.searchParams.set("paymentVerified", params.status === "SUCCESS" ? "1" : "0");
  target.searchParams.set("orderId", params.orderId);
  if (params.paymentId) {
    target.searchParams.set("paymentId", params.paymentId);
  }
  if (params.provider) {
    target.searchParams.set("provider", params.provider);
  }
  return target.toString();
}
