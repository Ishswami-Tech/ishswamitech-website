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

  const candidates = new Set<string>([rawPayload.trim()]);

  try {
    candidates.add(decodeURIComponent(rawPayload.trim()));
  } catch {
    // Ignore URI decoding failures and continue with the original candidate.
  }

  for (const candidate of candidates) {
    try {
      if (candidate.startsWith("{")) {
        return JSON.parse(candidate) as PaymentBridgePayload;
      }

      const cleaned = candidate
        .replace(/^payload=/i, "")
        .replace(/\s+/gu, "")
        .replace(/-/g, "+")
        .replace(/_/g, "/");
      const padded = cleaned.padEnd(Math.ceil(cleaned.length / 4) * 4, "=");
      const binary = Buffer.from(padded, "base64").toString("utf8");
      return JSON.parse(binary) as PaymentBridgePayload;
    } catch {
      // Try the next candidate.
    }
  }

  return null;
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
