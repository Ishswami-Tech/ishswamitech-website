import { headers as getHeaders } from "next/headers";

export type PaymentBridgePayload = {
  provider: string;
  amount: number;
  displayAmount?: string;
  currency: string;
  description?: string;
  clinicId: string;
  appointmentId?: string;
  subscriptionId?: string;
  invoiceId?: string;
  prescriptionId?: string;
  appointmentType?: string;
  callbackUrl?: string;
  orderId?: string;
  paymentId?: string;
  gatewayRedirectUrl?: string;
  paymentLink?: string;
  paymentSessionId?: string;
  razorpayKeyId?: string;
  paymentIntentId?: string;
};

type PaymentIntentRecord = Record<string, unknown>;

const DEFAULT_BACKEND_BASE_URL = "https://backend-service-v1.ishswami.in";
const DEFAULT_VIDDHAKARMA_BASE_URL = "https://www.viddhakarma.com";

function normalizeBaseUrl(rawUrl: string, fallback: string): string {
  const value = (rawUrl || fallback || "").trim().replace(/\/+$/u, "");
  return value || fallback;
}

function uniqueCandidates(values: Array<string | undefined | null>): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const value of values) {
    const candidate = typeof value === "string" ? value.trim() : "";
    if (!candidate || seen.has(candidate)) {
      continue;
    }
    seen.add(candidate);
    result.push(candidate);
  }

  return result;
}

function decodeRepeatedly(value: string, maxRounds = 3): string[] {
  const candidates: string[] = [value];
  let current = value;

  for (let index = 0; index < maxRounds; index += 1) {
    try {
      const decoded = decodeURIComponent(current);
      if (!decoded || decoded === current) {
        break;
      }
      candidates.push(decoded);
      current = decoded;
    } catch {
      break;
    }
  }

  return uniqueCandidates(candidates);
}

function extractNestedPayloadCandidates(value: string): string[] {
  const extracted: string[] = [];

  const collectFromSearchParams = (query: string): void => {
    try {
      const params = new URLSearchParams(query.startsWith("?") ? query.slice(1) : query);
      for (const key of ["payload", "data", "token"]) {
        const nested = params.get(key);
        if (nested) {
          extracted.push(nested);
        }
      }
    } catch {
      // Ignore malformed query strings and continue with the raw candidate.
    }
  };

  if (value.includes("://")) {
    try {
      const url = new URL(value);
      collectFromSearchParams(url.search);
      collectFromSearchParams(url.searchParams.toString());
    } catch {
      // Ignore invalid URLs and fall back to generic parsing.
    }
  }

  if (value.includes("=") || value.includes("&") || value.startsWith("?")) {
    collectFromSearchParams(value);
  }

  return extracted;
}

function parsePaymentBridgePayloadCandidate(candidate: string): PaymentBridgePayload | null {
  const normalized = candidate
    .trim()
    .replace(/^payload=/i, "")
    .replace(/^data=/i, "")
    .replace(/^token=/i, "")
    .replace(/^["']|["']$/gu, "")
    .replace(/\s+/gu, "");

  if (!normalized) {
    return null;
  }

  if (normalized.startsWith("{") || normalized.startsWith("[")) {
    try {
      return JSON.parse(normalized) as PaymentBridgePayload;
    } catch {
      // Continue to base64/base64url decoding.
    }
  }

  const safeBase64 = normalized
    .replace(/-/g, "+")
    .replace(/_/g, "/")
    .replace(/ /g, "+");
  const padded = safeBase64.padEnd(Math.ceil(safeBase64.length / 4) * 4, "=");

  try {
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const decoded = new TextDecoder().decode(bytes).trim().replace(/^payload=/i, "");
    if (decoded.startsWith("{")) {
      return JSON.parse(decoded) as PaymentBridgePayload;
    }
  } catch (error) {
    console.error("[PaymentBridge] Failed to decode payload candidate:", error);
  }

  return null;
}

function getBackendBaseUrl(): string {
  return normalizeBaseUrl(process.env.NEXT_PUBLIC_BACKEND_URL || "", DEFAULT_BACKEND_BASE_URL);
}

function getViddhakarmaBaseUrl(): string {
  return normalizeBaseUrl(process.env.NEXT_PUBLIC_VIDDHAKARMA_URL || "", DEFAULT_VIDDHAKARMA_BASE_URL);
}

export function decodePaymentBridgePayload(rawPayload: string): PaymentBridgePayload | null {
  if (!rawPayload) {
    return null;
  }

  const candidates = uniqueCandidates([
    rawPayload.trim(),
    ...decodeRepeatedly(rawPayload.trim(), 3),
    ...extractNestedPayloadCandidates(rawPayload.trim()),
    ...decodeRepeatedly(decodeURIComponentSafe(rawPayload.trim()), 2),
  ]);

  for (const candidate of candidates) {
    const parsed = parsePaymentBridgePayloadCandidate(candidate);
    if (parsed) {
      return parsed;
    }
  }

  return null;
}

function decodeURIComponentSafe(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function getAllowedRedirectUrl(candidate: string): string | null {
  if (!candidate) {
    return null;
  }

  try {
    const url = new URL(candidate);
    const host = url.hostname.toLowerCase();
    const allowedHosts = [
      "phonepe.com",
      "cashfree.com",
      "razorpay.com",
      "paytm.com",
      "easebuzz.in",
      "payu.in",
      "backend-service-v1.ishswami.in",
      "ishswami.in",
      "www.viddhakarma.com",
      "viddhakarma.com",
    ];
    const isAllowed = allowedHosts.some((allowedHost) => host === allowedHost || host.endsWith(`.${allowedHost}`));
    return isAllowed ? url.toString() : null;
  } catch {
    return null;
  }
}

export function getFirstString(...values: Array<unknown>): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }
  return "";
}

export function buildViddhakarmaRedirectUrl(
  params: {
    appointmentType: string;
    appointmentId: string;
    orderId: string;
    paymentId: string;
    provider: string;
    clinicId: string;
    paymentVerified?: string;
    paymentStatus?: string;
  }
): string {
  const viddhakarmaBase = getViddhakarmaBaseUrl();
  const redirectPath =
    params.appointmentType === "VIDEO_CALL" || params.appointmentId
      ? "/patient/appointments"
      : "/patient/payments?tab=payments";
  const target = new URL(`${viddhakarmaBase}${redirectPath}`);
  target.searchParams.set("paymentVerified", params.paymentVerified || "1");
  if (params.paymentStatus) {
    target.searchParams.set("paymentStatus", params.paymentStatus);
  }
  if (params.appointmentId) {
    target.searchParams.set("appointmentId", params.appointmentId);
  }
  if (params.orderId) {
    target.searchParams.set("orderId", params.orderId);
  }
  if (params.paymentId) {
    target.searchParams.set("paymentId", params.paymentId);
  }
  if (params.provider) {
    target.searchParams.set("provider", params.provider);
  }
  if (params.clinicId) {
    target.searchParams.set("clinicId", params.clinicId);
  }
  return target.toString();
}

export function buildFallbackCallbackUrl(queryString: string): string {
  const viddhakarmaBase = getViddhakarmaBaseUrl();
  const targetUrl = new URL(`${viddhakarmaBase}/payment/callback`);
  targetUrl.search = queryString;
  return targetUrl.toString();
}

async function getForwardHeaders(extraHeaders?: Record<string, string>): Promise<HeadersInit> {
  const requestHeaders = await getHeaders();
  const forwarded: Record<string, string> = {};
  const passthroughHeaders = [
    "cookie",
    "authorization",
    "x-session-id",
    "x-clinic-id",
    "x-client-version",
    "x-client-platform",
    "x-request-id",
    "x-internal-request-token",
    "user-agent",
    "origin",
    "referer",
  ];

  for (const headerName of passthroughHeaders) {
    const value = requestHeaders.get(headerName);
    if (value) {
      forwarded[headerName] = value;
    }
  }

  if (extraHeaders) {
    for (const [key, value] of Object.entries(extraHeaders)) {
      if (value) {
        forwarded[key] = value;
      }
    }
  }

  return forwarded;
}

async function fetchJson(
  url: string,
  init: RequestInit & { timeoutMs?: number } = {}
): Promise<{ ok: boolean; status: number; data?: unknown; text?: string }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), init.timeoutMs || 15000);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
      cache: "no-store",
    });
    const text = await response.text();
    let data: unknown = undefined;
    if (text) {
      try {
        data = JSON.parse(text) as unknown;
      } catch {
        data = text;
      }
    }

    return { ok: response.ok, status: response.status, data, text };
  } finally {
    clearTimeout(timeoutId);
  }
}

function buildPaymentIntentEndpoint(
  payload: PaymentBridgePayload,
  provider: string
): { url: string; body?: string } {
  const backendBase = getBackendBaseUrl();

  if (payload.subscriptionId) {
    return {
      url: `${backendBase}/api/v1/billing/subscriptions/${payload.subscriptionId}/process-payment?provider=${provider}`,
    };
  }

  if (payload.appointmentId) {
    return {
      url: `${backendBase}/api/v1/billing/appointments/${payload.appointmentId}/process-payment?provider=${provider}`,
      body: payload.appointmentType ? JSON.stringify({ appointmentType: payload.appointmentType }) : undefined,
    };
  }

  if (payload.invoiceId) {
    return {
      url: `${backendBase}/api/v1/billing/invoices/${payload.invoiceId}/process-payment?provider=${provider}`,
    };
  }

  if (payload.prescriptionId) {
    return {
      url: `${backendBase}/api/v1/pharmacy/prescriptions/${payload.prescriptionId}/process-payment?provider=${provider}`,
    };
  }

  throw new Error("Missing payment target details.");
}

export function isPrebuiltPaymentIntent(payload: PaymentBridgePayload): boolean {
  return Boolean(
    payload.orderId ||
      payload.paymentSessionId ||
      payload.paymentLink ||
      payload.gatewayRedirectUrl
  );
}

export async function createPaymentIntentOnServer(
  payload: PaymentBridgePayload,
  provider: string
): Promise<PaymentIntentRecord> {
  const request = buildPaymentIntentEndpoint(payload, provider);
  const forwardedHeaders = await getForwardHeaders({ "X-Clinic-ID": payload.clinicId });
  const headers = {
    "Content-Type": "application/json",
    "X-Clinic-ID": payload.clinicId,
    ...forwardedHeaders,
  };

  const response = await fetchJson(request.url, {
    method: "POST",
    headers,
    body: request.body,
    timeoutMs: 15000,
  });

  if (!response.ok) {
    throw new Error(
      typeof response.text === "string" && response.text.trim()
        ? response.text
        : `HTTP ${response.status} while creating payment intent.`
    );
  }

  const json = (response.data as Record<string, unknown>) || {};
  return (
    ((json.data as Record<string, unknown> | undefined)?.paymentIntent as Record<string, unknown> | undefined) ||
    (json.paymentIntent as Record<string, unknown> | undefined) ||
    json
  );
}

export async function verifyPaymentCallbackOnServer(params: {
  clinicId?: string;
  orderId: string;
  paymentId?: string;
  provider?: string;
  handoffToken?: string;
}): Promise<{
  success: boolean;
  message?: string;
  error?: string;
  payment?: unknown;
  invoice?: unknown;
  appointment?: unknown;
  clinicId?: string;
  orderId?: string;
  paymentId?: string;
  provider?: string;
  appointmentId?: string;
  appointmentType?: string;
}> {
  const queryParams = new URLSearchParams();
  if (params.handoffToken) {
    queryParams.set("handoff_token", params.handoffToken);
    if (params.orderId) queryParams.set("order_id", params.orderId);
    if (params.paymentId) queryParams.set("payment_id", params.paymentId);
    if (params.provider) queryParams.set("provider", params.provider);
  } else {
    if (!params.clinicId) {
      throw new Error("Clinic ID is required for payment verification");
    }
    queryParams.set("clinicId", params.clinicId);
    queryParams.set("paymentId", params.paymentId || params.orderId);
    queryParams.set("orderId", params.orderId);
    if (params.provider) {
      queryParams.set("provider", params.provider);
    }
  }

  const backendBase = getBackendBaseUrl();
  const endpoint = params.handoffToken
    ? `${backendBase}/api/v1/payments/callback/handoff?${queryParams.toString()}`
    : `${backendBase}/api/v1/payments/callback?${queryParams.toString()}`;

  const response = await fetchJson(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(await getForwardHeaders(params.clinicId ? { "X-Clinic-ID": params.clinicId } : undefined)),
    },
    body: JSON.stringify({ orderId: params.orderId }),
    timeoutMs: 15000,
  });

  if (!response.ok) {
    throw new Error(
      typeof response.text === "string" && response.text.trim()
        ? response.text
        : `HTTP ${response.status} while verifying payment callback.`
    );
  }

  const data = (response.data as Record<string, unknown>) || {};
  return {
    success: Boolean(data.success ?? true),
    message: typeof data.message === "string" ? data.message : "Payment verified successfully",
    ...(data.payment ? { payment: data.payment } : {}),
    ...(data.invoice ? { invoice: data.invoice } : {}),
    ...(data.appointment ? { appointment: data.appointment } : {}),
    ...(typeof data.clinicId === "string" ? { clinicId: data.clinicId } : {}),
    ...(typeof data.orderId === "string" ? { orderId: data.orderId } : {}),
    ...(typeof data.paymentId === "string" ? { paymentId: data.paymentId } : {}),
    ...(typeof data.provider === "string" ? { provider: data.provider } : {}),
    ...(typeof data.appointmentId === "string" ? { appointmentId: data.appointmentId } : {}),
    ...(typeof data.appointmentType === "string" ? { appointmentType: data.appointmentType } : {}),
  };
}
