"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Loader2, AlertTriangle, ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/site";

type CallbackState = "verifying" | "success" | "error";

function normalizeBaseUrl(rawUrl: string, fallback: string): string {
  const value = (rawUrl || fallback || "").trim().replace(/\/+$/u, "");
  return value || fallback;
}

export default function PaymentCallbackClient({ queryString }: { queryString: string }) {
  const [state, setState] = useState<CallbackState>("verifying");
  const [message, setMessage] = useState("Confirming payment...");
  const [redirectUrl, setRedirectUrl] = useState<string>("");

  const query = useMemo(() => new URLSearchParams(queryString), [queryString]);
  const fallbackRedirectUrl = useMemo(() => {
    const viddhakarmaBase = normalizeBaseUrl(
      process.env.NEXT_PUBLIC_VIDDHAKARMA_URL || "",
      "https://www.viddhakarma.com"
    );
    const targetUrl = new URL(`${viddhakarmaBase}/payment/callback`);
    targetUrl.search = query.toString();
    return targetUrl.toString();
  }, [query]);

  useEffect(() => {
    const run = async () => {
      const clinicId = query.get("clinicId") || "";
      const orderId = query.get("orderId") || "";
      const paymentId = query.get("paymentId") || orderId;
      const provider = query.get("provider") || "cashfree";
      const appointmentId = query.get("appointmentId") || "";
      const appointmentType = query.get("appointmentType") || "";

      if (!clinicId || !orderId) {
        setState("error");
        setMessage("Missing payment details.");
        return;
      }

      const backendBase = normalizeBaseUrl(
        process.env.NEXT_PUBLIC_BACKEND_URL || "",
        "https://backend-service-v1.ishswami.in"
      );

      const callbackQuery = new URLSearchParams({
        clinicId,
        orderId,
        provider,
      });
      if (paymentId) {
        callbackQuery.set("paymentId", paymentId);
      }
      if (appointmentId) {
        callbackQuery.set("appointmentId", appointmentId);
      }
      if (appointmentType) {
        callbackQuery.set("appointmentType", appointmentType);
      }

      try {
        const response = await fetch(`${backendBase}/api/v1/payments/callback?${callbackQuery.toString()}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Clinic-ID": clinicId,
          },
          body: JSON.stringify({ orderId }),
        });

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || "Payment verification failed");
        }

        const targetUrl = new URL(fallbackRedirectUrl);
        targetUrl.search = callbackQuery.toString();

        setRedirectUrl(targetUrl.toString());
        setState("success");
        setMessage("Payment confirmed. Returning to Viddhakarma...");
        window.location.replace(targetUrl.toString());
      } catch (error) {
        setState("error");
        setMessage(error instanceof Error ? error.message : "Unable to verify the payment.");
      }
    };

    void run();
  }, [query]);

  const icon =
    state === "success" ? (
      <CheckCircle2 className="h-6 w-6 text-emerald-300" />
    ) : state === "error" ? (
      <AlertTriangle className="h-6 w-6 text-amber-300" />
    ) : (
      <Loader2 className="h-6 w-6 animate-spin text-cyan-300" />
    );

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center px-4 py-16">
      <div className="w-full rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
          Ishswami Tech Payment Callback
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Finalizing your payment</h1>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          The payment was routed through Ishswami Tech and is now being synchronized back to your Viddhakarma dashboard.
        </p>

        <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/25 p-5">
          <div className="flex items-start gap-3">
            {icon}
            <div>
              <p className="text-sm font-medium text-white">{message}</p>
              <p className="mt-1 text-sm leading-6 text-slate-300">
                If the redirect does not happen automatically, use the button below to continue.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <a
              href={redirectUrl || fallbackRedirectUrl}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#42e8f4] px-5 py-3 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5"
            >
              Continue to dashboard
              <ArrowRight className="h-4 w-4" />
            </a>
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
