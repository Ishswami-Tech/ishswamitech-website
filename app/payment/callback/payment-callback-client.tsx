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
  const [redirectCountdown, setRedirectCountdown] = useState(5);
  const startedRef = useRef(false);

  const query = useMemo(() => new URLSearchParams(queryString), [queryString]);

  const buildSuccessRedirectUrl = (params: {
    appointmentType: string;
    appointmentId: string;
    orderId: string;
    paymentId: string;
    provider: string;
    clinicId: string;
  }): string => {
    const viddhakarmaBase = normalizeBaseUrl(
      process.env.NEXT_PUBLIC_VIDDHAKARMA_URL || "",
      "https://www.viddhakarma.com"
    );
    const redirectPath =
      params.appointmentType === "VIDEO_CALL" || params.appointmentId
        ? "/patient/appointments"
        : "/patient/payments?tab=payments";
    const target = new URL(`${viddhakarmaBase}${redirectPath}`);
    target.searchParams.set("paymentVerified", "1");
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
  };

  const fallbackRedirectUrl = useMemo(() => {
    const viddhakarmaBase = normalizeBaseUrl(
      process.env.NEXT_PUBLIC_VIDDHAKARMA_URL || "",
      "https://www.viddhakarma.com"
    );
    const targetUrl = new URL(`${viddhakarmaBase}/patient/appointments`);
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
      const handoffToken = query.get("handoff_token") || "";

      if (!handoffToken && (!clinicId || !orderId)) {
        setState("error");
        return;
      }

      const backendBase = normalizeBaseUrl(
        process.env.NEXT_PUBLIC_BACKEND_URL || "",
        "https://backend-service-v1.ishswami.in"
      );

      const callbackQuery = new URLSearchParams();
      if (handoffToken) {
        callbackQuery.set("handoff_token", handoffToken);
        if (orderId) {
          callbackQuery.set("order_id", orderId);
        }
        if (paymentId) {
          callbackQuery.set("payment_id", paymentId);
        }
        if (provider) {
          callbackQuery.set("provider", provider);
        }
      } else {
        callbackQuery.set("clinicId", clinicId);
        callbackQuery.set("orderId", orderId);
        callbackQuery.set("provider", provider);
        if (paymentId) {
          callbackQuery.set("paymentId", paymentId);
        }
        if (appointmentId) {
          callbackQuery.set("appointmentId", appointmentId);
        }
        if (appointmentType) {
          callbackQuery.set("appointmentType", appointmentType);
        }
      }

      try {
        let callbackPath = handoffToken ? "/api/v1/payments/callback/handoff" : "/api/v1/payments/callback";
        let response = await fetch(`${backendBase}${callbackPath}?${callbackQuery.toString()}`, {
          method: "POST",
          credentials: "include",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            ...(clinicId ? { "X-Clinic-ID": clinicId } : {}),
          },
          body: JSON.stringify({ orderId }),
        });

        // If handoff token is expired/invalid and we have fallback params, try legacy callback
        if (!response.ok && handoffToken && clinicId && orderId && (response.status === 401 || response.status === 403)) {
          const legacyQuery = new URLSearchParams();
          legacyQuery.set("clinicId", clinicId);
          legacyQuery.set("orderId", orderId);
          legacyQuery.set("provider", provider);
          if (paymentId) {
            legacyQuery.set("paymentId", paymentId);
          }
          if (appointmentId) {
            legacyQuery.set("appointmentId", appointmentId);
          }
          if (appointmentType) {
            legacyQuery.set("appointmentType", appointmentType);
          }

          callbackPath = "/api/v1/payments/callback";
          response = await fetch(`${backendBase}${callbackPath}?${legacyQuery.toString()}`, {
            method: "POST",
            credentials: "include",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              "X-Clinic-ID": clinicId,
            },
            body: JSON.stringify({ orderId }),
          });
        }

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || "Payment verification failed");
        }

        const responseBody = (await response.json().catch(() => ({}))) as Record<string, unknown>;
        if (handoffToken && callbackPath.includes("handoff")) {
          const isSuccessful = responseBody.success === true;
          if (!isSuccessful) {
            const errorUrl = new URL(fallbackRedirectUrl);
            errorUrl.searchParams.set("paymentVerified", "0");
            errorUrl.searchParams.set("paymentError", "payment_not_completed");
            if (responseBody.message && typeof responseBody.message === 'string') {
              errorUrl.searchParams.set("message", responseBody.message);
            }
            window.location.replace(errorUrl.toString());
            return;
          }

          const resolvedClinicId = String(responseBody.clinicId || clinicId || "");
          const resolvedOrderId = String(responseBody.orderId || orderId || "");
          const resolvedPaymentId = String(responseBody.paymentId || paymentId || "");
          const resolvedProvider = String(responseBody.provider || provider || "");
          const resolvedAppointmentId = String(responseBody.appointmentId || appointmentId || "");
          const resolvedAppointmentType = String(responseBody.appointmentType || appointmentType || "");
          window.location.replace(
            buildSuccessRedirectUrl({
              appointmentType: resolvedAppointmentType,
              appointmentId: resolvedAppointmentId,
              orderId: resolvedOrderId,
              paymentId: resolvedPaymentId,
              provider: resolvedProvider,
              clinicId: resolvedClinicId,
            })
          );
        } else {
          const targetUrl = new URL(fallbackRedirectUrl);
          targetUrl.search = callbackQuery.toString();
          window.location.replace(targetUrl.toString());
        }
      } catch {
        setState("error");
      }
    };

    void run();
  }, [fallbackRedirectUrl, query]);

  useEffect(() => {
    if (state !== "error") {
      return;
    }

    setRedirectCountdown(5);
    const timer = window.setInterval(() => {
      setRedirectCountdown((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          window.location.replace(fallbackRedirectUrl);
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [fallbackRedirectUrl, state]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      {state === "verifying" ? (
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-7 w-7 animate-spin text-[var(--success)]" />
        </div>
      ) : (
        <div className="max-w-lg rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-left text-sm text-[var(--danger)]">
          <p className="text-center font-medium">
            Payment failed or could not be verified. Redirecting to appointments in {redirectCountdown} seconds.
          </p>
          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={() => window.location.replace(fallbackRedirectUrl)}
              className="rounded-xl border border-red-400/30 bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--danger)] transition-colors hover:bg-[var(--surface-overlay)]"
            >
              Go to appointments now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
