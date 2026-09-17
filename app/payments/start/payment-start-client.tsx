"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { load as loadCashfree } from "@cashfreepayments/cashfree-js";
import { Loader2 } from "lucide-react";

type PaymentBridgePayload = {
  provider?: string;
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

type PaymentIntentResolveResponse = {
  success: boolean;
  payload?: PaymentBridgePayload;
  paymentIntent?: PaymentIntentRecord;
  error?: string;
  message?: string;
};

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
    const isAllowed = allowedHosts.some(
      (allowedHost) => host === allowedHost || host.endsWith(`.${allowedHost}`),
    );
    return isAllowed ? url.toString() : null;
  } catch {
    return null;
  }
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
    nestedResponse?.url,
  );
}

function hasPrebuiltGatewayTarget(
  payload: PaymentBridgePayload | PaymentIntentRecord | null | undefined,
): boolean {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const record = payload as Record<string, unknown>;
  const provider = String(record.provider || "").toLowerCase();
  const gatewayUrl = getAllowedRedirectUrl(
    getFirstString(
      record.gatewayRedirectUrl,
      record.paymentLink,
      record.redirectUrl,
      record.redirect_url,
      record.checkoutUrl,
      record.url,
      getRedirectUrlCandidate(record),
      getRedirectUrlCandidate(record.data as Record<string, unknown> | undefined),
      getRedirectUrlCandidate(record.result as Record<string, unknown> | undefined),
      getRedirectUrlCandidate(record.response as Record<string, unknown> | undefined),
    ),
  );

  if (gatewayUrl) {
    return true;
  }

  if (provider === "razorpay") {
    return Boolean(record.orderId && record.razorpayKeyId);
  }

  if (provider === "cashfree") {
    return Boolean(record.orderId && record.paymentSessionId);
  }

  return false;
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

function buildCallbackRedirectUrl(
  callbackUrl: string,
  params: Record<string, string | undefined>,
): string {
  const target = new URL(callbackUrl);
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      target.searchParams.set(key, value);
    }
  }
  return target.toString();
}



function collectRawPayloadCandidates(initialRawPayload?: string): string[] {
  const candidates = new Set<string>();

  const addCandidate = (value?: string | null) => {
    if (value && value.trim()) {
      candidates.add(value.trim());
    }
  };

  addCandidate(initialRawPayload);

  const searchParams = new URLSearchParams(window.location.search);
  for (const key of ["payload", "data", "token"]) {
    addCandidate(searchParams.get(key));
  }

  const hashValue = window.location.hash.startsWith("#")
    ? window.location.hash.slice(1)
    : window.location.hash;
  if (hashValue && hashValue.trim()) {
    const hashParams = new URLSearchParams(hashValue);
    for (const key of ["payload", "data", "token"]) {
      addCandidate(hashParams.get(key));
    }
    if (!hashValue.includes("=")) {
      addCandidate(hashValue);
    }
  }

  return Array.from(candidates);
}

export default function PaymentStartClient({
  payload,
  paymentIntent,
  initialRawPayload,
  fallbackUrl,
}: {
  payload: PaymentBridgePayload | null;
  paymentIntent: PaymentIntentRecord | null;
  initialRawPayload?: string;
  fallbackUrl?: string;
}) {
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [statusLabel, setStatusLabel] = useState("Preparing secure checkout...");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState("");
  const startedRef = useRef(false);

  const resolvedFallbackUrl = useMemo(() => {
    if (fallbackUrl) {
      return fallbackUrl;
    }

    const viddhakarmaBase = (
      process.env.NEXT_PUBLIC_VIDDHAKARMA_URL || "https://www.viddhakarma.com"
    ).trim().replace(/\/+$/u, "");
    return `${viddhakarmaBase}/payment/callback`;
  }, [fallbackUrl]);

  useEffect(() => {
    if (startedRef.current) {
      return;
    }
    startedRef.current = true;

    const openGateway = async () => {
      let resolvedPayload = payload;
      let resolvedPaymentIntent = paymentIntent;
      let lastErrorMessage = "";

      if (!resolvedPayload || !resolvedPaymentIntent) {
        const rawPayloadCandidates = collectRawPayloadCandidates(initialRawPayload);
        if (!rawPayloadCandidates.length) {
          setStatus("error");
          setErrorMessage("Invalid payment payload. Please reopen the payment link.");
          setErrorDetails("The payment payload could not be decoded from the URL.");
          return;
        }

        setStatusLabel("Recovering payment session...");

        for (const rawPayload of rawPayloadCandidates) {
          const resolveResponse = await fetch("/api/payment-intents/resolve", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ rawPayload }),
          });

          const resolved = (await resolveResponse.json().catch(() => null)) as
            | PaymentIntentResolveResponse
            | null;

          if (resolveResponse.ok && resolved?.success && resolved.payload && resolved.paymentIntent) {
            resolvedPayload = resolved.payload;
            resolvedPaymentIntent = resolved.paymentIntent;
            lastErrorMessage = "";
            break;
          }

          lastErrorMessage =
            resolved?.error ||
            resolved?.message ||
            (await resolveResponse.text().catch(() => "")) ||
            "Invalid payment payload. Please reopen the payment link.";
        }

      }

      if (!resolvedPayload || !resolvedPaymentIntent) {
        if (resolvedPayload && hasPrebuiltGatewayTarget(resolvedPayload)) {
          resolvedPaymentIntent = resolvedPayload as PaymentIntentRecord;
        } else {
          throw new Error(
            lastErrorMessage || "Invalid payment payload. Please reopen the payment link.",
          );
        }
      }

      if (!resolvedPayload) {
        setStatus("error");
        setErrorMessage("Invalid payment payload. Please reopen the payment link.");
        setErrorDetails("The payment payload could not be decoded from the URL.");
        return;
      }

      if (!resolvedPaymentIntent) {
        if (hasPrebuiltGatewayTarget(resolvedPayload)) {
          resolvedPaymentIntent = resolvedPayload as PaymentIntentRecord;
        } else {
          setStatus("error");
          setErrorMessage("Unable to prepare payment session.");
          setErrorDetails("The backend did not return a payment intent.");
          return;
        }
      }

      const provider = String(
        paymentIntent?.provider || resolvedPayload.provider || "",
      ).toLowerCase();
      const amount = Number(resolvedPaymentIntent.amount || resolvedPayload.amount);
      const displayAmount = String(resolvedPayload.displayAmount || "");
      const orderId = String(
        resolvedPaymentIntent.orderId ||
          resolvedPaymentIntent.paymentId ||
          resolvedPaymentIntent.paymentIntentId ||
          resolvedPayload.orderId ||
          "",
      );
      const gatewayRedirectUrl =
        getAllowedRedirectUrl(
          getFirstString(
            resolvedPaymentIntent.gatewayRedirectUrl,
            resolvedPaymentIntent.paymentLink,
            getRedirectUrlCandidate(resolvedPaymentIntent),
            getRedirectUrlCandidate(
              (resolvedPaymentIntent.metadata as Record<string, unknown> | undefined) ||
                undefined,
            ),
            getRedirectUrlCandidate(
              (resolvedPaymentIntent.providerResponse as Record<string, unknown> | undefined) ||
                undefined,
            ),
          ),
        ) || "";
      const callbackUrl =
        getAllowedRedirectUrl(
          String(resolvedPaymentIntent.callbackUrl || resolvedPayload.callbackUrl || ""),
        ) || "";
      const paymentMetadata =
        (resolvedPaymentIntent.metadata as Record<string, unknown> | undefined) || {};
      const providerResponse =
        (resolvedPaymentIntent.providerResponse as Record<string, unknown> | undefined) || {};
      const paymentSessionId = String(
        resolvedPaymentIntent.paymentSessionId ||
          resolvedPayload.paymentSessionId ||
          paymentMetadata.paymentSessionId ||
          providerResponse.payment_session_id ||
          "",
      );

      try {
        setStatus("loading");
        setStatusLabel(
          displayAmount
            ? `Connecting to payment gateway for INR ${displayAmount}...`
            : "Connecting to payment gateway...",
        );
        setErrorMessage("");

        if (provider === "cashfree") {
          setStatusLabel("Opening Cashfree checkout...");
          if (!orderId || !paymentSessionId) {
            throw new Error("Cashfree payment session was not returned by the server.");
          }

          const cashfreeMode =
            process.env.NEXT_PUBLIC_CASHFREE_MODE === "production" ? "production" : "sandbox";
          const cashfree = await loadCashfree({ mode: cashfreeMode });
          if (!cashfree) {
            throw new Error("Cashfree checkout is not available.");
          }

          const redirectTarget = buildCallbackRedirectUrl(
            callbackUrl || resolvedFallbackUrl,
            {
              paymentId: orderId,
              orderId,
              provider,
              clinicId: String(
                resolvedPaymentIntent.clinicId || resolvedPayload.clinicId || "",
              ),
              appointmentId: resolvedPayload.appointmentId,
              appointmentType: resolvedPayload.appointmentType,
            },
          );
          await cashfree.checkout({
            paymentSessionId,
            returnUrl: redirectTarget,
            redirectTarget: "_self",
          });
          return;
        }

        if (provider === "razorpay") {
          setStatusLabel("Opening Razorpay checkout...");
          const razorpayKeyId = String(
            resolvedPaymentIntent.razorpayKeyId ||
              resolvedPayload.razorpayKeyId ||
              process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
              "",
          );
          if (!razorpayKeyId) {
            throw new Error("Razorpay key is not configured.");
          }
          if (!orderId) {
            throw new Error("Order ID not received from server.");
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
            amount,
            currency: String(
              resolvedPaymentIntent.currency || resolvedPayload.currency || "INR",
            ),
            name: "Payment",
            description: String(
              resolvedPaymentIntent.description ||
                resolvedPayload.description ||
                "Payment",
            ),
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
                  clinicId: String(
                    resolvedPaymentIntent.clinicId || resolvedPayload.clinicId || "",
                  ),
                  razorpaySignature: response.razorpay_signature,
                });
                window.location.replace(redirectTarget);
              }
            },
            modal: {
              ondismiss: () => {
                setStatus("error");
                setErrorMessage("Payment was cancelled. You can try again when you're ready.");
              },
            },
          });

          checkout.on("payment.failed", () => {
            setStatus("error");
            setErrorMessage("Payment failed. Please try again or use a different payment method.");
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
        setErrorMessage(message || "Payment gateway could not be opened.");
        setErrorDetails(
          [
            `provider=${resolvedPayload?.provider || ""}`,
            `appointmentId=${resolvedPayload?.appointmentId || ""}`,
            `clinicId=${resolvedPayload?.clinicId || ""}`,
            `status=${status}`,
            `message=${message}`,
          ].join("\n"),
        );
        setStatus("error");
      }
    };

    void openGateway();
  }, [initialRawPayload, paymentIntent, payload, resolvedFallbackUrl, status]);

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
            <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap rounded-xl bg-black/30 p-3 text-xs leading-5 text-red-100/90">
              {errorDetails}
            </pre>
          ) : null}
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={() => window.location.replace(resolvedFallbackUrl)}
              className="rounded-xl border border-red-400/30 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/15"
            >
              Go back to Viddhakarma
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
