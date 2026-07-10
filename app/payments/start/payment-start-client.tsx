"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

type PaymentBridgePayload = {
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

function decodePayload(rawPayload: string): PaymentBridgePayload | null {
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
      const binary = window.atob(padded);
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
      const json = new TextDecoder().decode(bytes);
      return JSON.parse(json) as PaymentBridgePayload;
    } catch {
      // Try the next candidate.
    }
  }

  return null;
}

function getAllowedRedirectUrl(candidate: string): string | null {
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

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as Window & { Razorpay?: unknown }).Razorpay) {
      resolve();
      return;
    }

    const existing = document.getElementById("razorpay-checkout-script");
    if (existing) {
      const interval = window.setInterval(() => {
        if ((window as Window & { Razorpay?: unknown }).Razorpay) {
          window.clearInterval(interval);
          resolve();
        }
      }, 100);
      return;
    }

    const script = document.createElement("script");
    script.id = "razorpay-checkout-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay checkout"));
    document.body.appendChild(script);
  });
}

function ensurePreconnect(origin: string): void {
  if (typeof document === "undefined" || !origin) {
    return;
  }

  try {
    const existing = document.head.querySelector<HTMLLinkElement>(`link[rel="preconnect"][href="${origin}"]`);
    if (existing) {
      return;
    }

    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = origin;
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  } catch {
    // Best-effort performance hint only.
  }
}

function buildCallbackRedirectUrl(
  callbackUrl: string,
  params: Record<string, string | undefined>
): string {
  const target = new URL(callbackUrl);
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      target.searchParams.set(key, value);
    }
  }
  return target.toString();
}

function normalizeBaseUrl(rawUrl: string, fallback: string): string {
  const value = (rawUrl || fallback || "").trim().replace(/\/+$/u, "");
  return value || fallback;
}

function buildPaymentIntentEndpoint(payload: PaymentBridgePayload, provider: string): { url: string; body?: string } {
  const backendBase = normalizeBaseUrl(
    process.env.NEXT_PUBLIC_BACKEND_URL || "",
    "https://backend-service-v1.ishswami.in"
  );

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

function getFirstString(...values: Array<unknown>): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }
  return "";
}

function getRedirectUrlCandidate(source: Record<string, unknown> | undefined): string {
  if (!source) {
    return "";
  }

  const nestedData = source.data as Record<string, unknown> | undefined;
  const nestedResult = source.result as Record<string, unknown> | undefined;
  const nestedResponse = source.response as Record<string, unknown> | undefined;

  return getFirstString(
    source.gatewayRedirectUrl,
    source.paymentLink,
    source.redirectUrl,
    source.redirect_url,
    source.checkoutUrl,
    source.url,
    nestedData?.redirectUrl,
    nestedData?.redirect_url,
    nestedData?.paymentLink,
    nestedData?.payment_link,
    nestedData?.checkoutUrl,
    nestedData?.url,
    nestedResult?.redirectUrl,
    nestedResult?.redirect_url,
    nestedResult?.paymentLink,
    nestedResult?.payment_link,
    nestedResult?.checkoutUrl,
    nestedResult?.url,
    nestedResponse?.redirectUrl,
    nestedResponse?.redirect_url,
    nestedResponse?.paymentLink,
    nestedResponse?.payment_link,
    nestedResponse?.checkoutUrl,
    nestedResponse?.url
  );
}

async function createPaymentIntentFromBridge(
  payload: PaymentBridgePayload,
  provider: string
): Promise<Record<string, unknown>> {
  const request = buildPaymentIntentEndpoint(payload, provider);
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 12000);

  const response = await fetch(request.url, {
    method: "POST",
    credentials: "include",
    mode: "cors",
    signal: controller.signal,
    headers: {
      "Content-Type": "application/json",
      "X-Clinic-ID": payload.clinicId,
    },
    body: request.body,
  });

  window.clearTimeout(timeoutId);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      text || `HTTP ${response.status} ${response.statusText} while creating payment intent from ${request.url}.`
    );
  }

  const json = (await response.json()) as Record<string, unknown>;
  return (
    ((json.data as Record<string, unknown> | undefined)?.paymentIntent as Record<string, unknown> | undefined) ||
    (json.paymentIntent as Record<string, unknown> | undefined) ||
    json
  ) as Record<string, unknown>;
}

export default function PaymentStartClient({ payloadParam }: { payloadParam: string }) {
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [statusLabel, setStatusLabel] = useState("Preparing secure checkout...");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [errorDetails, setErrorDetails] = useState<string>("");
  const [resolvedPayloadParam, setResolvedPayloadParam] = useState(payloadParam);
  const startedRef = useRef(false);

  const payload = useMemo(() => decodePayload(resolvedPayloadParam), [resolvedPayloadParam]);

  const openGateway = async () => {
    const currentPayload = payload;
    if (!currentPayload) {
      setStatus("error");
      setErrorMessage("Invalid payment payload. Please reopen the payment link.");
      setErrorDetails("The payment payload could not be decoded from the URL.");
      return;
    }

    const provider = String(currentPayload.provider || "").toLowerCase();
    const amount = Number(currentPayload.amount);
    const backendDisplayAmount = String(currentPayload.displayAmount || "");
    const displayAmount = backendDisplayAmount;

    if (!currentPayload.clinicId || !currentPayload.appointmentId) {
      setStatus("error");
      setErrorMessage("Payment payload is missing clinic or appointment details.");
      setErrorDetails(JSON.stringify(currentPayload, null, 2));
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setStatus("error");
      setErrorMessage("Payment amount is invalid or missing.");
      setErrorDetails(JSON.stringify(currentPayload, null, 2));
      return;
    }

    try {
      setStatus("loading");
      setStatusLabel(
        displayAmount
          ? `Connecting to payment gateway for ₹${displayAmount}...`
          : "Connecting to payment gateway..."
      );
      setErrorMessage("");

      const paymentIntent = (
        currentPayload.orderId ||
        currentPayload.paymentSessionId ||
        currentPayload.paymentLink ||
        currentPayload.gatewayRedirectUrl
          ? currentPayload
          : await createPaymentIntentFromBridge(currentPayload, provider)
      ) as Record<string, unknown> & PaymentBridgePayload;

      const metadata = (paymentIntent.metadata as Record<string, unknown> | undefined) || {};
      const providerResponse = (paymentIntent.providerResponse as Record<string, unknown> | undefined) || {};
      const orderId = String(paymentIntent.orderId || paymentIntent.paymentId || paymentIntent.paymentIntentId || "");
      const gatewayRedirectUrl =
        getAllowedRedirectUrl(
          getFirstString(
            paymentIntent.gatewayRedirectUrl,
            paymentIntent.paymentLink,
            (paymentIntent as Record<string, unknown>).redirectUrl,
            getRedirectUrlCandidate(paymentIntent as Record<string, unknown>),
            metadata.redirectUrl,
            metadata.gatewayRedirectUrl,
            metadata.paymentLink,
            getRedirectUrlCandidate(metadata as Record<string, unknown>),
            providerResponse.redirectUrl,
            providerResponse.redirect_url,
            providerResponse.paymentLink,
            providerResponse.payment_link,
            providerResponse.checkoutUrl,
            providerResponse.url,
            getRedirectUrlCandidate(providerResponse)
          )
        ) || "";
      const callbackUrl = getAllowedRedirectUrl(
        String(paymentIntent.callbackUrl || currentPayload.callbackUrl || "")
      ) || "";

      if (provider === "razorpay") {
        setStatusLabel("Opening Razorpay checkout...");
        const razorpayKeyId = String(paymentIntent.razorpayKeyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "");
        if (!razorpayKeyId) {
          throw new Error("Razorpay key is not configured.");
        }
        if (!orderId) {
          throw new Error("Order ID not received from server");
        }

        await loadRazorpayScript();
        const RazorpayCtor = ((window as unknown) as Window & {
          Razorpay: new (options: {
            key: string;
            amount: number;
            currency: string;
            name: string;
            description?: string;
            order_id?: string;
            theme?: { color?: string };
            modal?: { ondismiss?: () => void };
            handler?: (response: {
              razorpay_payment_id?: string;
              razorpay_order_id?: string;
              razorpay_signature?: string;
            }) => void;
          }) => { open: () => void; on: (event: string, handler: () => void) => void };
        }).Razorpay;

        const checkout = new RazorpayCtor({
          key: razorpayKeyId,
          amount: Number(paymentIntent.amount || currentPayload.amount),
          currency: String(paymentIntent.currency || currentPayload.currency || "INR"),
          name: "Payment",
          description: String(paymentIntent.description || currentPayload.description || "Payment"),
          order_id: orderId,
          theme: { color: "#0B5E45" },
          handler: (response: {
            razorpay_payment_id?: string;
            razorpay_order_id?: string;
            razorpay_signature?: string;
          }) => {
            if (callbackUrl) {
              const redirectTarget = buildCallbackRedirectUrl(callbackUrl, {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id || orderId,
                provider: provider || undefined,
                clinicId: String(paymentIntent.clinicId || currentPayload.clinicId || ""),
                razorpaySignature: response.razorpay_signature,
              });
              window.location.replace(redirectTarget);
            }
          },
          modal: {
            ondismiss: () => {
              setStatus("error");
            },
          },
        });

        checkout.on("payment.failed", () => {
          setStatus("error");
        });

        checkout.open();
        return;
      }

      if (!gatewayRedirectUrl) {
        throw new Error("Gateway redirect URL is missing.");
      }

      setStatusLabel("Redirecting to payment gateway...");
      window.location.replace(gatewayRedirectUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("[PaymentStartClient] Failed to open gateway", {
        provider: currentPayload.provider,
        appointmentId: currentPayload.appointmentId,
        clinicId: currentPayload.clinicId,
        message,
      });
      setErrorMessage(message || "Payment gateway could not be opened.");
      setErrorDetails(
        [
          `provider=${currentPayload.provider || ""}`,
          `appointmentId=${currentPayload.appointmentId || ""}`,
          `clinicId=${currentPayload.clinicId || ""}`,
          `status=${status}`,
          `message=${message}`,
        ].join("\n")
      );
      setStatus("error");
    }
  };

  useEffect(() => {
    if (!resolvedPayloadParam && typeof window !== "undefined") {
      const browserPayload = new URLSearchParams(window.location.search).get("payload") || "";
      if (browserPayload) {
        setResolvedPayloadParam(browserPayload);
      }
    }
  }, [resolvedPayloadParam]);

  useEffect(() => {
    if (startedRef.current) {
      return;
    }

    if (!resolvedPayloadParam) {
      return;
    }

    if (!payload) {
      startedRef.current = true;
      setStatus("error");
      setErrorMessage("Invalid payment payload. Please reopen the payment link.");
      setErrorDetails("The payment payload could not be decoded from the URL.");
      return;
    }

    startedRef.current = true;

    if ((payload.provider || "").toLowerCase() === "razorpay") {
      ensurePreconnect("https://checkout.razorpay.com");
    }

    void openGateway();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      {status === "loading" ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-7 w-7 animate-spin text-emerald-400" />
          <p className="text-sm text-white/70">{statusLabel}</p>
        </div>
      ) : (
        <div className="max-w-lg rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-left text-sm text-red-200">
          <p className="text-center font-medium">
            {errorMessage || "Payment gateway could not be opened. Please go back and try again."}
          </p>
          {errorDetails ? (
            <pre className="mt-3 max-h-64 overflow-auto rounded-xl bg-black/30 p-3 text-xs leading-5 text-red-100/90 whitespace-pre-wrap">
              {errorDetails}
            </pre>
          ) : null}
        </div>
      )}
    </div>
  );
}
