"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

type CallbackState = "verifying" | "error";

function normalizeBaseUrl(rawUrl: string, fallback: string): string {
  const value = (rawUrl || fallback || "").trim().replace(/\/+$/u, "");
  return value || fallback;
}

export default function PaymentCallbackClient({ queryString }: { queryString: string }) {
  const [state, setState] = useState<CallbackState>("verifying");
  const startedRef = useRef(false);

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
    if (startedRef.current) {
      return;
    }
    startedRef.current = true;

    const run = async () => {
      const clinicId = query.get("clinicId") || "";
      const orderId = query.get("orderId") || "";
      const paymentId = query.get("paymentId") || orderId;
      const provider = query.get("provider") || "cashfree";
      const appointmentId = query.get("appointmentId") || "";
      const appointmentType = query.get("appointmentType") || "";

      if (!clinicId || !orderId) {
        setState("error");
        window.location.replace(fallbackRedirectUrl);
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
          credentials: "include",
          mode: "cors",
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
        window.location.replace(targetUrl.toString());
      } catch (error) {
        setState("error");
        window.location.replace(fallbackRedirectUrl);
      }
    };

    void run();
  }, [fallbackRedirectUrl, query]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="h-7 w-7 animate-spin text-emerald-400" />
      </div>
    </div>
  );
}
