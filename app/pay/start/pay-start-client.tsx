"use client";

import { useEffect, useRef, useState } from "react";
import { load as loadCashfree } from "@cashfreepayments/cashfree-js";
import { Loader2 } from "lucide-react";

interface PayablePayment {
  provider: "razorpay" | "cashfree" | "phonepe";
  orderId: string;
  amount: number;
  currency: string;
  description?: string;
  displayAmount?: string;
  paymentSessionId?: string;
  razorpayKeyId?: string;
  razorpayMode?: "order" | "subscription";
  gatewayRedirectUrl?: string;
}

interface RazorpayHandlerResponse {
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_subscription_id?: string;
  razorpay_signature?: string;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: () => void) => void;
}

type RazorpayConstructor = new (options: {
  key: string;
  amount?: number;
  currency?: string;
  name: string;
  description?: string;
  order_id?: string;
  subscription_id?: string;
  theme?: { color?: string };
  modal?: { ondismiss?: () => void };
  handler: (response: RazorpayHandlerResponse) => void;
}) => RazorpayInstance;

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

function buildCallbackUrl(appId: string, params: Record<string, string | undefined>): string {
  const target = new URL("/pay/callback", window.location.origin);
  target.searchParams.set("appId", appId);
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      target.searchParams.set(key, value);
    }
  }
  return target.toString();
}

export default function PayStartClient({
  appId,
  appName,
  payment,
  cancelUrl,
  failureUrl,
}: {
  appId: string;
  appName: string;
  payment: PayablePayment;
  cancelUrl: string;
  failureUrl: string;
}) {
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [statusLabel, setStatusLabel] = useState("Preparing secure checkout...");
  const [errorMessage, setErrorMessage] = useState("");
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) {
      return;
    }
    startedRef.current = true;

    const openGateway = async (): Promise<void> => {
      try {
        setStatusLabel(
          payment.displayAmount
            ? `Connecting to payment gateway for ${payment.currency} ${payment.displayAmount}...`
            : "Connecting to payment gateway...",
        );

        if (payment.provider === "cashfree") {
          if (!payment.paymentSessionId) {
            throw new Error("Cashfree payment session is missing.");
          }
          const mode = process.env.NEXT_PUBLIC_CASHFREE_MODE === "production" ? "production" : "sandbox";
          const cashfree = await loadCashfree({ mode });
          if (!cashfree) {
            throw new Error("Cashfree checkout is not available.");
          }
          await cashfree.checkout({
            paymentSessionId: payment.paymentSessionId,
            returnUrl: buildCallbackUrl(appId, { orderId: payment.orderId, provider: "cashfree" }),
            redirectTarget: "_self",
          });
          return;
        }

        if (payment.provider === "razorpay") {
          const keyId = payment.razorpayKeyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "";
          if (!keyId) {
            throw new Error("Razorpay key is not configured.");
          }
          await loadRazorpayScript();
          const Razorpay = (window as unknown as Window & { Razorpay: RazorpayConstructor }).Razorpay;

          const isSubscription = payment.razorpayMode === "subscription";
          const checkout = new Razorpay({
            key: keyId,
            name: appName,
            description: payment.description,
            theme: { color: "#0B5E45" },
            ...(isSubscription
              ? { subscription_id: payment.orderId }
              : { amount: payment.amount, currency: payment.currency, order_id: payment.orderId }),
            handler: (response) => {
              window.location.replace(
                buildCallbackUrl(appId, {
                  mode: isSubscription ? "subscription" : undefined,
                  orderId: isSubscription
                    ? payment.orderId
                    : response.razorpay_order_id || payment.orderId,
                  paymentId: response.razorpay_payment_id,
                  provider: "razorpay",
                  razorpaySignature: response.razorpay_signature,
                }),
              );
            },
            modal: {
              ondismiss: () => {
                setStatusLabel("Payment cancelled. Redirecting back...");
                window.location.replace(cancelUrl);
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

        if (!payment.gatewayRedirectUrl) {
          throw new Error("Gateway redirect URL is missing.");
        }
        setStatusLabel("Redirecting to payment gateway...");
        window.location.replace(payment.gatewayRedirectUrl);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : "Payment gateway could not be opened.");
        setStatus("error");
      }
    };

    void openGateway();
  }, [appId, appName, cancelUrl, payment]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      {status === "loading" ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-7 w-7 animate-spin text-[var(--success)]" />
          <p className="text-sm text-[var(--text-secondary)]">{statusLabel}</p>
        </div>
      ) : (
        <div className="max-w-lg rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-left text-sm text-[var(--danger)]">
          <p className="text-center font-medium">
            {errorMessage || "Payment gateway could not be opened. Please go back and try again."}
          </p>
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={() => window.location.replace(failureUrl)}
              className="rounded-xl border border-red-400/30 bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--danger)] transition-colors hover:bg-[var(--surface-overlay)]"
            >
              Go back to {appName}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
