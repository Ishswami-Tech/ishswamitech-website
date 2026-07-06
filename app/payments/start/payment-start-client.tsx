"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

type PaymentBridgePayload = {
  provider: string;
  amount: number;
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

  try {
    const normalized = rawPayload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const binary = window.atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json) as PaymentBridgePayload;
  } catch {
    return null;
  }
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

async function createPaymentIntentFromBridge(
  payload: PaymentBridgePayload,
  provider: string
): Promise<Record<string, unknown>> {
  const request = buildPaymentIntentEndpoint(payload, provider);
  const response = await fetch(request.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Clinic-ID": payload.clinicId,
    },
    body: request.body,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to create payment intent.");
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
  const startedRef = useRef(false);

  const payload = useMemo(() => decodePayload(payloadParam), [payloadParam]);

  const openGateway = async () => {
    if (!payload) {
      setStatus("error");
      return;
    }

    const provider = String(payload.provider || "").toLowerCase();

    try {
      setStatus("loading");

      const paymentIntent = (
        payload.orderId || payload.paymentSessionId || payload.paymentLink || payload.gatewayRedirectUrl
          ? payload
          : await createPaymentIntentFromBridge(payload, provider)
      ) as Record<string, unknown> & PaymentBridgePayload;

      const orderId = String(paymentIntent.orderId || paymentIntent.paymentId || paymentIntent.paymentIntentId || "");
      const gatewayRedirectUrl =
        getAllowedRedirectUrl(
          String(
            paymentIntent.gatewayRedirectUrl ||
              paymentIntent.paymentLink ||
              (paymentIntent as Record<string, unknown>).redirectUrl ||
              ""
          )
        ) || "";
      const callbackUrl = getAllowedRedirectUrl(String(paymentIntent.callbackUrl || payload.callbackUrl || "")) || "";

      if (provider === "razorpay") {
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
          amount: Number(paymentIntent.amount || payload.amount),
          currency: String(paymentIntent.currency || payload.currency || "INR"),
          name: "Payment",
          description: String(paymentIntent.description || payload.description || "Payment"),
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
                clinicId: String(paymentIntent.clinicId || payload.clinicId || ""),
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

      window.location.replace(gatewayRedirectUrl);
    } catch (error) {
      setStatus("error");
    }
  };

  useEffect(() => {
    if (startedRef.current) {
      return;
    }
    startedRef.current = true;

    if ((payload?.provider || "").toLowerCase() === "razorpay") {
      ensurePreconnect("https://checkout.razorpay.com");
    }

    void openGateway();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="h-7 w-7 animate-spin text-emerald-400" />
      </div>
    </div>
  );
}
