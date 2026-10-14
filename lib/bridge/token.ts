import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import type { PaymentApp, PaymentAppRegistry } from "./app-registry.ts";

/**
 * Signed handoff token: `base64url(json).base64url(hmacSha256(secret, base64url(json)))`.
 * The app's backend creates the gateway order, then signs this token with its own secret,
 * so the bridge only ever opens orders that app really created.
 */

export const MAX_TOKEN_LIFETIME_SECONDS = 900;
const CLOCK_SKEW_SECONDS = 30;

const GATEWAY_HOSTS = [
  "phonepe.com",
  "cashfree.com",
  "razorpay.com",
  "paytm.com",
  "easebuzz.in",
  "payu.in",
] as const;

function isGatewayUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") {
      return false;
    }
    const host = url.hostname.toLowerCase();
    return GATEWAY_HOSTS.some((allowed) => host === allowed || host.endsWith(`.${allowed}`));
  } catch {
    return false;
  }
}

const bridgePayloadSchema = z
  .object({
    appId: z.string().regex(/^[a-z0-9][a-z0-9_-]{1,31}$/),
    provider: z.enum(["razorpay", "cashfree", "phonepe"]),
    orderId: z.string().regex(/^[\w.-]{1,128}$/),
    /** Smallest currency unit (paise for INR), passed straight to the gateway. */
    amount: z.number().positive(),
    currency: z.string().length(3),
    description: z.string().max(255).optional(),
    displayAmount: z.string().max(32).optional(),
    paymentSessionId: z.string().min(1).max(512).optional(),
    razorpayKeyId: z.string().min(1).max(128).optional(),
    /** "subscription" opens Razorpay checkout with `subscription_id` (orderId holds the sub id). */
    razorpayMode: z.enum(["order", "subscription"]).optional(),
    gatewayRedirectUrl: z.string().refine(isGatewayUrl, "not an allowed gateway URL").optional(),
    /**
     * Optional branding / prefill fields. Deliberately lenient (`unknown`): they are validated and
     * dropped individually by `sanitizeBranding` / `decryptBridgeCustomer`, so a bad value can never
     * invalidate an otherwise valid token. They are covered by the HMAC like every other field.
     */
    displayName: z.unknown().optional(),
    logoUrl: z.unknown().optional(),
    note: z.unknown().optional(),
    customerEnc: z.unknown().optional(),
    iat: z.number().int(),
    exp: z.number().int(),
  })
  .superRefine((payload, ctx) => {
    const requireField = (present: boolean, path: string, message: string): void => {
      if (!present) {
        ctx.addIssue({ code: "custom", path: [path], message });
      }
    };
    if (payload.provider === "cashfree") {
      requireField(Boolean(payload.paymentSessionId), "paymentSessionId", "required for cashfree");
    }
    if (payload.provider === "phonepe") {
      requireField(Boolean(payload.gatewayRedirectUrl), "gatewayRedirectUrl", "required for phonepe");
    }
    if (payload.razorpayMode === "subscription" && payload.provider !== "razorpay") {
      ctx.addIssue({ code: "custom", path: ["razorpayMode"], message: "subscription mode is razorpay-only" });
    }
    if (payload.exp - payload.iat > MAX_TOKEN_LIFETIME_SECONDS) {
      ctx.addIssue({ code: "custom", path: ["exp"], message: "token lifetime too long" });
    }
  });

export type BridgePayload = z.infer<typeof bridgePayloadSchema>;
export type BridgeTokenInput = z.input<typeof bridgePayloadSchema>;

export type VerifyTokenResult =
  | { readonly ok: true; readonly payload: BridgePayload; readonly app: PaymentApp }
  | { readonly ok: false; readonly reason: "malformed" | "unknown_app" | "bad_signature" | "invalid_payload" | "expired" };

function sign(body: string, secret: string): Buffer {
  return createHmac("sha256", secret).update(body).digest();
}

/** Used by tests and by reference clients; the bridge itself only verifies. */
export function signBridgeToken(input: BridgeTokenInput, secret: string): string {
  const body = Buffer.from(JSON.stringify(input)).toString("base64url");
  return `${body}.${sign(body, secret).toString("base64url")}`;
}

function readAppId(body: string): string | null {
  try {
    const parsed: unknown = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (typeof parsed === "object" && parsed !== null && "appId" in parsed) {
      const appId = (parsed as { appId: unknown }).appId;
      return typeof appId === "string" ? appId : null;
    }
  } catch {
    // Fall through: malformed body.
  }
  return null;
}

export function verifyBridgeToken(
  token: string,
  registry: PaymentAppRegistry,
  nowSeconds: number = Math.floor(Date.now() / 1000),
): VerifyTokenResult {
  const parts = token.trim().split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return { ok: false, reason: "malformed" };
  }
  const [body, signature] = parts;

  const appId = readAppId(body);
  if (!appId) {
    return { ok: false, reason: "malformed" };
  }

  const app = Object.hasOwn(registry, appId) ? registry[appId] : undefined;
  if (!app) {
    return { ok: false, reason: "unknown_app" };
  }

  const expected = sign(body, app.secret);
  const provided = Buffer.from(signature, "base64url");
  if (provided.length !== expected.length || !timingSafeEqual(provided, expected)) {
    return { ok: false, reason: "bad_signature" };
  }

  const parsed = bridgePayloadSchema.safeParse(JSON.parse(Buffer.from(body, "base64url").toString("utf8")));
  if (!parsed.success || parsed.data.appId !== app.appId) {
    return { ok: false, reason: "invalid_payload" };
  }

  const payload = parsed.data;
  if (payload.iat > nowSeconds + CLOCK_SKEW_SECONDS) {
    return { ok: false, reason: "invalid_payload" };
  }
  if (payload.exp < nowSeconds) {
    return { ok: false, reason: "expired" };
  }

  return { ok: true, payload, app };
}
