import type { Metadata } from "next";
import { redirect } from "next/navigation";
import {
  buildViddhakarmaRedirectUrl,
  verifyPaymentCallbackOnServer,
} from "@/lib/payment-bridge.server";

export const metadata: Metadata = {
  title: "Payment",
  description: "Verifying payment.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
};

type SearchParams = Record<string, string | string[] | undefined>;

function getSearchParam(searchParams: SearchParams, key: string): string {
  const value = searchParams[key];
  if (Array.isArray(value)) {
    return value[0] || "";
  }
  return value || "";
}

export default async function PaymentCallbackPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const normalizedSearchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (Array.isArray(value)) {
      const firstValue = value[0];
      if (firstValue) {
        normalizedSearchParams.set(key, firstValue);
      }
      continue;
    }

    if (value) {
      normalizedSearchParams.set(key, value);
    }
  }

  const clinicId = getSearchParam(searchParams, "clinicId");
  const orderId = getSearchParam(searchParams, "orderId");
  const paymentId = getSearchParam(searchParams, "paymentId") || orderId;
  const provider = getSearchParam(searchParams, "provider") || "cashfree";
  const appointmentId = getSearchParam(searchParams, "appointmentId");
  const appointmentType = getSearchParam(searchParams, "appointmentType");
  const handoffToken = getSearchParam(searchParams, "handoff_token");

  let responseSuccess = false;
  let responseAppointmentType: string | undefined;
  let responseAppointmentId: string | undefined;
  let responseOrderId: string | undefined;
  let responsePaymentId: string | undefined;
  let responseProvider: string | undefined;
  let responseClinicId: string | undefined;

  try {
    const response = await verifyPaymentCallbackOnServer({
      clinicId,
      orderId,
      paymentId,
      provider,
      handoffToken,
    });
    responseSuccess = response.success;
    responseAppointmentType = response.appointmentType;
    responseAppointmentId = response.appointmentId;
    responseOrderId = response.orderId;
    responsePaymentId = response.paymentId;
    responseProvider = response.provider;
    responseClinicId = response.clinicId;
  } catch {
    redirect(
      buildViddhakarmaRedirectUrl({
        appointmentType,
        appointmentId,
        orderId,
        paymentId,
        provider,
        clinicId,
        paymentVerified: "0",
        paymentStatus: "FAILED",
      }),
    );
  }

  if (handoffToken) {
    if (responseSuccess) {
      redirect(
        buildViddhakarmaRedirectUrl({
          appointmentType: responseAppointmentType || appointmentType,
          appointmentId: responseAppointmentId || appointmentId,
          orderId: responseOrderId || orderId,
          paymentId: responsePaymentId || paymentId,
          provider: responseProvider || provider,
          clinicId: responseClinicId || clinicId,
          paymentVerified: "1",
          paymentStatus: "SUCCESS",
        }),
      );
    }

    redirect(
      buildViddhakarmaRedirectUrl({
        appointmentType,
        appointmentId,
        orderId,
        paymentId,
        provider,
        clinicId,
        paymentVerified: "0",
        paymentStatus: "FAILED",
      }),
    );
    return;
  }

  if (responseSuccess) {
    redirect(
      buildViddhakarmaRedirectUrl({
        appointmentType,
        appointmentId,
        orderId: responseOrderId || orderId,
        paymentId: responsePaymentId || paymentId,
        provider: responseProvider || provider,
        clinicId: responseClinicId || clinicId,
        paymentVerified: "1",
        paymentStatus: "SUCCESS",
      }),
    );
  }

  redirect(
    buildViddhakarmaRedirectUrl({
      appointmentType,
      appointmentId,
      orderId,
      paymentId,
      provider,
      clinicId,
      paymentVerified: "0",
      paymentStatus: "FAILED",
    }),
  );
}
