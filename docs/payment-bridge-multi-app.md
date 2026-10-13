# Payment Bridge — adding another app (Yoga, Shop, ...)

Viddhakarma keeps using the legacy routes (`/payments/start`, `/payment/callback`). Every other app uses the
generic routes below. The bridge never creates orders for these apps; it only opens the gateway and reports back.

| Route | Purpose |
| --- | --- |
| `/pay/start?token=<signed token>` | Opens Razorpay / Cashfree / redirect gateway for an order the app already created |
| `/pay/callback?appId=…&orderId=…` | Asks the app's backend if the order was paid, then redirects the user back |

Razorpay Subscriptions are supported with `razorpayMode: "subscription"` in the token (put the `sub_…` id in
`orderId`). The callback then forwards `mode: "subscription"` in the verify request.

## 1. Register the app (bridge side)

Add an entry to the server-only `PAYMENT_BRIDGE_APPS` env var (JSON, keyed by `appId`):

```json
{
  "yoga": {
    "name": "Yoga",
    "returnUrl": "https://yoga.example.com/payment/result",
    "verifyUrl": "https://api.yoga.example.com/bridge/verify",
    "secret": "<32+ random characters, unique per app>"
  }
}
```

- `appId`: lowercase letters, digits, `-`, `_` (2–32 chars). `viddhakarma` is reserved.
- `returnUrl` / `verifyUrl` must be `https` (plain `http` only for localhost).
- Generate a secret with `openssl rand -hex 32`. Put the same value in the app's backend config.
- The return destination is always taken from this registry, never from the request.

## 2. Create the order (app backend)

The app's backend creates the gateway order with its own gateway credentials (this decides where the money
settles), and gets the Razorpay order id / Cashfree `payment_session_id` / PhonePe redirect URL back.

## 3. Sign a token and send the user to the bridge

```ts
const body = Buffer.from(JSON.stringify({
  appId: "yoga",
  provider: "razorpay",            // razorpay | cashfree | phonepe
  orderId: "order_Abc123",         // gateway order id
  amount: 49900,                   // smallest unit (paise), passed straight to the gateway
  currency: "INR",
  description: "Yoga monthly plan",
  displayAmount: "499.00",         // optional, shown while loading
  razorpayKeyId: "rzp_live_xxx",   // razorpay (falls back to NEXT_PUBLIC_RAZORPAY_KEY_ID)
  paymentSessionId: "session_…",   // required for cashfree
  gatewayRedirectUrl: "https://…", // required for phonepe (must be https on a gateway domain)
  iat: now,                        // unix seconds
  exp: now + 600,                  // max lifetime 900s
})).toString("base64url");

const sig = createHmac("sha256", SECRET).update(body).digest("base64url");
const url = `https://<bridge-domain>/pay/start?token=${body}.${sig}`;
```

For PhonePe (and any provider that redirects back on its own), configure the gateway's redirect URL for the
order as `https://<bridge-domain>/pay/callback?appId=yoga&orderId=<orderId>&provider=phonepe`.

## 4. Implement the verify endpoint (app backend)

The bridge calls `POST verifyUrl` server-to-server after the user returns from the gateway:

```
Headers: X-Bridge-Timestamp: <unix seconds>
         X-Bridge-Signature: hex(HMAC-SHA256(secret, `${timestamp}.${rawBody}`))
Body:    { "appId", "orderId", "paymentId"?, "provider"?, "razorpaySignature"? }
Reply:   { "success": true }   // only when YOUR backend has confirmed the payment with the gateway
```

Reject the request if the signature is wrong or the timestamp is more than ~5 minutes old. Anything other than an
HTTP 2xx with `"success": true` is treated as a failed payment.

## 5. Handle the return

The user lands on `returnUrl` with `paymentStatus` (`SUCCESS` | `FAILED` | `CANCELLED`), `paymentVerified`
(`1`/`0`), `orderId`, `paymentId`, `provider`. Treat these as hints only — always re-check the order status in
your own backend before unlocking anything.

## Worked example: Vishwayog (yoga app)

Reference implementation lives in the `vishwayog` repo (`src/lib/payments/`, `src/app/api/bridge/verify`).

Bridge env (`PAYMENT_BRIDGE_APPS`):

```json
{"vishwayog":{"name":"Vishwayog","returnUrl":"https://<vishwayog-domain>/#student-membership","verifyUrl":"https://<vishwayog-domain>/api/bridge/verify","secret":"<same value as PAYMENT_BRIDGE_SECRET in vishwayog>"}}
```

Vishwayog env: `PAYMENT_BRIDGE_URL` (this site's origin), `PAYMENT_BRIDGE_APP_ID=vishwayog`, `PAYMENT_BRIDGE_SECRET`,
plus the gateway credentials (`RAZORPAY_*`, `CASHFREE_*`, `PHONEPE_*`). Flow: student picks a gateway → vishwayog
`POST /api/payments/checkout` creates the order and returns a signed `/pay/start` URL → bridge opens the gateway →
bridge calls vishwayog `/api/bridge/verify`, which re-reads the order status from the gateway → student returns to
`/#student-membership?paymentStatus=…`.

## Webhooks

Webhooks are not handled by the bridge. Register one webhook per app directly at the gateway, pointing to that app's
backend. The Viddhakarma webhooks are unchanged.

## Environment

- `PAYMENT_BRIDGE_APPS` — registry above (server-only).
- `NEXT_PUBLIC_CASHFREE_MODE` — `production` or `sandbox` (default `sandbox`).
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` — optional default Razorpay key id.
