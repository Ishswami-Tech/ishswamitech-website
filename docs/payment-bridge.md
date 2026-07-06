# Ishswami Payment Bridge

This project hosts the merchant-side payment bridge used by Viddhakarma to open payment gateways from the Ishswami domain.

## Purpose

- Receive a signed payload from the Viddhakarma frontend.
- Create or reuse a payment intent from the backend when needed.
- Open the selected gateway on the Ishswami domain.
- Verify the payment callback and return the user to the Viddhakarma callback page.

## Public routes

- `/payments/start`
- `/payment/callback`

## Supported providers

- `razorpay`
- `cashfree`
- `phonepe`

## Payment flow

1. Viddhakarma sends the user to `/payments/start` with a base64url-encoded payload.
2. The bridge decodes the payload and validates the target redirect URL.
3. If the payload does not already contain a payment intent, the bridge creates one from the backend.
4. For Razorpay, the bridge loads `https://checkout.razorpay.com/v1/checkout.js` and opens the modal.
5. For redirect-based providers, the bridge sends the browser to the gateway redirect URL.
6. After payment, the gateway or backend returns the user to `/payment/callback`.
7. The callback page verifies the payment with the backend and redirects the user back to Viddhakarma.

## Required environment variables

Frontend runtime:

- `NEXT_PUBLIC_BACKEND_URL`
- `NEXT_PUBLIC_VIDDHAKARMA_URL`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` only when Razorpay is opened from the bridge

Backend alignment:

- `PAYMENT_ENABLED_PROVIDERS`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `CASHFREE_*` and `PHONEPE_*` values as configured in the backend

## Notes

- The bridge is intentionally hosted on the Ishswami domain so gateway scripts and payment origin checks stay aligned with merchant requirements.
- The Viddhakarma frontend only passes the user into the bridge and then receives the final callback result back from it.

