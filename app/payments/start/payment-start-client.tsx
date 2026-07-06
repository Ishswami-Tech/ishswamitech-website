"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CreditCard,
  Loader2,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { siteConfig } from "@/lib/site";

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
    const existing = document.head.querySelector<HTMLLinkElement>(
      `link[rel="preconnect"][href="${origin}"]`
    );
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
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [message, setMessage] = useState("Preparing secure payment handoff...");

  const payload = useMemo(() => decodePayload(payloadParam), [payloadParam]);

  const openGateway = async () => {
    if (!payload) {
      setStatus("error");
      setMessage("Missing payment details.");
      return;
    }

    const provider = String(payload.provider || "").toLowerCase();

    try {
      setStatus("loading");
      setMessage("Preparing secure payment handoff...");

      const paymentIntent = (
        payload.orderId || payload.paymentSessionId || payload.paymentLink || payload.gatewayRedirectUrl
          ? payload
          : await createPaymentIntentFromBridge(payload, provider)
      ) as Record<string, unknown> & PaymentBridgePayload;

      const orderId =
        String(paymentIntent.orderId || paymentIntent.paymentId || paymentIntent.paymentIntentId || "");
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
          name: siteConfig.name,
          description: String(paymentIntent.description || payload.description || "Secure payment"),
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
              setStatus("ready");
              setMessage("Payment window closed. You can retry when ready.");
            },
          },
        });

        checkout.on("payment.failed", () => {
          setStatus("error");
          setMessage("Razorpay payment failed. Please try again.");
        });

        checkout.open();
        setStatus("ready");
        setMessage("Opening Razorpay checkout...");
        return;
      }

      if (!gatewayRedirectUrl) {
        throw new Error("Gateway redirect URL is missing.");
      }

      window.location.replace(gatewayRedirectUrl);
      setStatus("ready");
      setMessage("Redirecting to secure payment...");
      return;
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to open payment checkout.");
    }
  };

  useEffect(() => {
    if ((payload?.provider || "").toLowerCase() === "razorpay") {
      ensurePreconnect("https://checkout.razorpay.com");
    }
    void openGateway();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const icon =
    status === "error" ? (
      <AlertCircle className="h-6 w-6 text-red-400" />
    ) : status === "ready" ? (
      <ShieldCheck className="h-6 w-6 text-emerald-300" />
    ) : (
      <Loader2 className="h-6 w-6 animate-spin text-cyan-300" />
    );

  const providerLabel = String(payload?.provider || "").toLowerCase();
  const providerIcon =
    providerLabel === "razorpay" ? (
      <CreditCard className="h-4 w-4" />
    ) : (
      <Smartphone className="h-4 w-4" />
    );

  const amountText =
    typeof payload?.amount === "number"
      ? new Intl.NumberFormat("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 2,
        }).format(payload.amount / 100)
      : "—";

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-4 py-16">
      <div className="w-full rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl md:p-10">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-cyan-300">
            {providerIcon}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Ishswami Tech Payment Bridge
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-white">Secure payment handoff</h1>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Merchant</p>
            <p className="mt-2 text-sm font-medium text-white">{siteConfig.name}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Provider</p>
            <p className="mt-2 text-sm font-medium text-white capitalize">{providerLabel || "Payment"}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Amount</p>
            <p className="mt-2 text-sm font-medium text-white">{amountText}</p>
          </div>
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
          <div className="flex items-start gap-3">
            {icon}
            <div className="min-w-0">
              <p className="text-sm font-medium text-white">{message}</p>
              <p className="mt-1 text-sm leading-6 text-slate-300">
                We are opening the gateway from Ishswami Tech so the payment flow stays within the approved payment origin.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => void openGateway()}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#42e8f4] px-5 py-3 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5"
            >
              Continue payment
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href={siteConfig.url}
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/5"
            >
              Back to Ishswami
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
