"use client";

import { useEffect, useRef, useState } from "react";
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

type PaymentIntentRecord = Record<string, unknown>;

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

export default function PaymentStartClient({
  payload,
  paymentIntent,
}: {
  payload: PaymentBridgePayload;
  paymentIntent: PaymentIntentRecord | null;
}) {
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [statusLabel, setStatusLabel] = useState("Preparing secure checkout...");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState("");
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) {
      return;
    }
    startedRef.current = true;

    const openGateway = async () => {
      if (!payload) {
        setStatus("error");
        setErrorMessage("Invalid payment payload. Please reopen the payment link.");
        setErrorDetails("The payment payload could not be decoded from the URL.");
        return;
      }

      if (!paymentIntent) {
        setStatus("error");
        setErrorMessage("Unable to prepare payment session.");
        setErrorDetails("The backend did not return a payment intent.");
        return;
      }

      const provider = String(payload.provider || "").toLowerCase();
      const amount = Number(paymentIntent.amount || payload.amount);
      const displayAmount = String(payload.displayAmount || "");
      const orderId = String(
        paymentIntent.orderId ||
          paymentIntent.paymentId ||
          paymentIntent.paymentIntentId ||
          payload.orderId ||
          ""
      );
      const gatewayRedirectUrl =
        getAllowedRedirectUrl(
          getFirstString(
            paymentIntent.gatewayRedirectUrl,
            paymentIntent.paymentLink,
            getRedirectUrlCandidate(paymentIntent),
            getRedirectUrlCandidate((paymentIntent.metadata as Record<string, unknown> | undefined) || undefined),
            getRedirectUrlCandidate((paymentIntent.providerResponse as Record<string, unknown> | undefined) || undefined)
          )
        ) || "";
      const callbackUrl =
        getAllowedRedirectUrl(String(paymentIntent.callbackUrl || payload.callbackUrl || "")) || "";

      try {
        setStatus("loading");
        setStatusLabel(
          displayAmount
            ? `Connecting to payment gateway for INR ${displayAmount}...`
            : "Connecting to payment gateway..."
        );
        setErrorMessage("");

        if (provider === "razorpay") {
          setStatusLabel("Opening Razorpay checkout...");
          const razorpayKeyId = String(
            paymentIntent.razorpayKeyId || payload.razorpayKeyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || ""
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

        setStatusLabel("Redirecting to payment gateway...");
        window.location.replace(gatewayRedirectUrl);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setErrorMessage(message || "Payment gateway could not be opened.");
        setErrorDetails(
          [
            `provider=${payload.provider || ""}`,
            `appointmentId=${payload.appointmentId || ""}`,
            `clinicId=${payload.clinicId || ""}`,
            `status=${status}`,
            `message=${message}`,
          ].join("\n")
        );
        setStatus("error");
      }
    };

    void openGateway();
  }, [paymentIntent, payload, status]);

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
        </div>
      )}
    </div>
  );
}
