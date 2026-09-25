import { NextResponse } from "next/server";
import {
  createPaymentIntentOnServer,
  decodePaymentBridgePayload,
  hasExistingGatewayOrder,
  isPrebuiltPaymentIntent,
} from "@/lib/payment-bridge.server";

export const runtime = "nodejs";

type ResolvePaymentIntentRequest = {
  rawPayload?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ResolvePaymentIntentRequest | null;
  const rawPayload = typeof body?.rawPayload === "string" ? body.rawPayload.trim() : "";

  if (!rawPayload) {
    return NextResponse.json(
      { success: false, error: "Missing payment payload." },
      { status: 400 },
    );
  }

  const payload = decodePaymentBridgePayload(rawPayload);
  if (!payload) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid payment payload. Please reopen the payment link.",
      },
      { status: 400 },
    );
  }

  if (!payload.clinicId || !payload.appointmentId) {
    return NextResponse.json(
      {
        success: false,
        error: "Payment payload is missing clinic or appointment details.",
        payload,
      },
      { status: 400 },
    );
  }

  if (Number.isFinite(payload.amount) === false || payload.amount <= 0) {
    return NextResponse.json(
      {
        success: false,
        error: "Payment amount is invalid or missing.",
        payload,
      },
      { status: 400 },
    );
  }

  const isPrebuilt = isPrebuiltPaymentIntent(payload);
  if (!isPrebuilt && hasExistingGatewayOrder(payload)) {
    // Never open a second gateway order for a payment that already has one.
    return NextResponse.json(
      {
        success: false,
        error:
          "This payment session is incomplete. Please go back and tap Pay again.",
        payload,
      },
      { status: 409 },
    );
  }

  try {
    const provider = String(payload.provider || "").toLowerCase();
    const paymentIntent = isPrebuilt
      ? payload
      : await createPaymentIntentOnServer(payload, provider);

    return NextResponse.json({
      success: true,
      payload,
      paymentIntent,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Payment gateway could not be opened.",
        payload,
      },
      { status: 500 },
    );
  }
}
