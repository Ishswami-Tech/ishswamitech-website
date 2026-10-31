# Ishswami Payment Bridge — Multi-App, Multi-Provider Guide

How any app (Yoga, Shop, a new one) takes payments through the Ishswami bridge using Razorpay, Cashfree or PhonePe.

> Viddhakarma keeps using the legacy routes (`/payments/start`, `/payment/callback`, see
> [payment-bridge.md](./payment-bridge.md)). Everything below is for the generic `/pay/*` routes used by all other apps.

## Contents

1. [What the bridge is (and is not)](#1-what-the-bridge-is-and-is-not)
2. [Architecture and payment flow](#2-architecture-and-payment-flow)
3. [Onboarding checklist for a new app](#3-onboarding-checklist-for-a-new-app)
4. [Bridge configuration](#4-bridge-configuration)
5. [App side: create the order](#5-app-side-create-the-order)
6. [Provider guide: Razorpay, Cashfree, PhonePe](#6-provider-guide)
7. [Token reference](#7-token-reference)
8. [Verify endpoint contract](#8-verify-endpoint-contract)
9. [Return to the app](#9-return-to-the-app)
10. [Webhooks](#10-webhooks)
11. [Security model](#11-security-model)
12. [Troubleshooting](#12-troubleshooting)
13. [Adding a new provider](#13-adding-a-new-provider)
14. [Reference implementation: Vishwayog](#14-reference-implementation-vishwayog)
15. [Environment variables](#15-environment-variables)

---

## 1. What the bridge is (and is not)

The bridge is a small Next.js site on the Ishswami domain. Payment gateways are approved for that domain, so every
app opens its checkout from here.

| The bridge does | The bridge does not |
| --- | --- |
| Verify a signed token from the app | Create gateway orders |
| Open Razorpay / Cashfree / PhonePe checkout | Store orders, users or payment history |
| Ask the app's backend if the order was paid | Decide whether a payment succeeded |
| Redirect the user back to the app | Receive gateway webhooks |

The app always owns the order, the gateway credentials and the final decision. The bridge is stateless.

## 2. Architecture and payment flow

```
 Student           App frontend        App backend              Bridge                 Gateway
    | click Pay        |                   |                       |                      |
    |----------------->| POST /checkout    |                       |                      |
    |                  |------------------>| 1. create order ------------------------->   |
    |                  |                   |<------------------ order id / session -------|
    |                  |                   | 2. sign token (HMAC)  |                      |
    |                  |<-- bridge URL ----|                       |                      |
    |<-- redirect -----|                   |                       |                      |
    |----------------------------- GET /pay/start?token=… ------->| 3. verify token      |
    |<------------------------- opens gateway checkout ---------------------------------->|
    |  (student pays)                                              |                      |
    |----------------------- GET /pay/callback?appId&orderId ---->| 4. POST verifyUrl ->  App backend
    |                                                              |<- {success:true} <-- 5. app re-reads
    |                                                              |                         order from gateway
    |<------------------- redirect to returnUrl?paymentStatus=… ---|
```

Steps 1, 2 and 5 are the app's job. Steps 3 and 4 are the bridge's. Money movement happens only between the student and
the gateway.

## 3. Onboarding checklist for a new app

Do these in order. Each item names who does it.

- [ ] **Decide the `appId`**, for example `shop`. Lowercase letters, digits, `-`, `_` (2–32 chars). `viddhakarma` is reserved.
- [ ] **Generate a secret**: `openssl rand -hex 32`. One per app, never reused.
- [ ] **Bridge:** add the app to `PAYMENT_BRIDGE_APPS` ([section 4](#4-bridge-configuration)) and redeploy.
- [ ] **App:** set `PAYMENT_BRIDGE_URL`, `PAYMENT_BRIDGE_APP_ID`, `PAYMENT_BRIDGE_SECRET` and the gateway credentials.
- [ ] **App:** implement order creation + token signing ([section 5](#5-app-side-create-the-order)).
- [ ] **App:** implement the verify endpoint ([section 8](#8-verify-endpoint-contract)).
- [ ] **App:** build the return page ([section 9](#9-return-to-the-app)).
- [ ] **Gateways:** configure per-provider settings and add the app's webhook ([sections 6 and 10](#6-provider-guide)).
- [ ] **Test** each provider in sandbox: success, cancel, failed card, and closing the tab mid-payment.
- [ ] **Go live:** switch gateway environments to production and repeat one real low-value payment per provider.

## 4. Bridge configuration

Set the server-only env var `PAYMENT_BRIDGE_APPS` on the bridge: a JSON object keyed by `appId`.

```json
{
  "vishwayog": {
    "name": "Vishwayog",
    "returnUrl": "https://yoga.example.com/#student-membership",
    "verifyUrl": "https://yoga.example.com/api/bridge/verify",
    "secret": "<64 hex chars>"
  },
  "shop": {
    "name": "Shop",
    "returnUrl": "https://shop.example.com/order/result",
    "verifyUrl": "https://api.shop.example.com/bridge/verify",
    "secret": "<another 64 hex chars>"
  }
}
```

| Field | Rules |
| --- | --- |
| `name` | Shown on the Razorpay checkout and the "go back" button. |
| `returnUrl` | Where the student lands after payment. Result params are appended to its query string. May contain a `#hash`. |
| `verifyUrl` | Server-to-server endpoint on the app's backend ([section 8](#8-verify-endpoint-contract)). |
| `secret` | At least 32 characters. Shared only between the bridge and this app. Never sent to a browser. |

Both URLs must be `https` (`http` is allowed for `localhost` only). An invalid registry makes the bridge show
"Payments are temporarily unavailable" and log the reason; it never falls back to another app.

The return destination always comes from this registry, never from the request, so the bridge cannot be used as an
open redirect.

## 5. App side: create the order

For every payment the app's backend must:

1. Create the order at the gateway with **its own gateway credentials** (see [section 6](#6-provider-guide)).
2. Store its own order record (id, amount, user, gateway order id, status).
3. Sign a token and redirect the browser to `${PAYMENT_BRIDGE_URL}/pay/start?token=<token>`.

Token format: `base64url(json) + "." + base64url(HMAC_SHA256(secret, base64url(json)))`.

```ts
import { createHmac } from "node:crypto";

export function bridgeUrl(checkout: Record<string, unknown>): string {
  const now = Math.floor(Date.now() / 1000);
  const body = Buffer.from(
    JSON.stringify({ appId: process.env.PAYMENT_BRIDGE_APP_ID, ...checkout, iat: now, exp: now + 600 }),
  ).toString("base64url");
  const sig = createHmac("sha256", process.env.PAYMENT_BRIDGE_SECRET!).update(body).digest("base64url");
  return `${process.env.PAYMENT_BRIDGE_URL}/pay/start?token=${body}.${sig}`;
}
```

Other languages: same three steps (JSON, base64url, HMAC-SHA256). Python:

```python
import base64, hashlib, hmac, json, time

def bridge_url(secret: bytes, base: str, payload: dict) -> str:
    now = int(time.time())
    body = base64.urlsafe_b64encode(
        json.dumps({**payload, "iat": now, "exp": now + 600}, separators=(",", ":")).encode()
    ).rstrip(b"=")
    sig = base64.urlsafe_b64encode(hmac.new(secret, body, hashlib.sha256).digest()).rstrip(b"=")
    return f"{base}/pay/start?token={body.decode()}.{sig.decode()}"
```

Node/Next.js apps can copy `src/lib/payments/bridge.ts` and `src/lib/payments/gateways/` from the vishwayog repo as-is.

## 6. Provider guide

All providers share the same token and verify contract. Only the checkout data in the token and the gateway-side setup
differ.

| | Razorpay | Cashfree | PhonePe |
| --- | --- | --- | --- |
| `provider` value | `razorpay` | `cashfree` | `phonepe` |
| Checkout opened by bridge | Razorpay modal | Cashfree JS checkout | Redirect to hosted page |
| Token must carry | `orderId` (+ `razorpayKeyId`) | `orderId` + `paymentSessionId` | `orderId` + `gatewayRedirectUrl` |
| Who sends the student back | Bridge (modal success handler) | Bridge (`returnUrl` passed to the SDK) | **PhonePe**, to the URL you set on the order |
| Order amount unit | paise | **rupees** (e.g. `500.00`) | paise |
| Recurring | Yes (Subscriptions) | No (one-time) | No (one-time) |
| How the app checks payment | `GET /v1/orders/{id}/payments` has a `captured` payment | `GET /orders/{id}` is `PAID` | `GET /checkout/v2/order/{id}/status` is `COMPLETED` |

### 6.1 Razorpay

**Order (one-time)** — `POST https://api.razorpay.com/v1/orders` with Basic auth (`key_id:key_secret`):
`{ "amount": 50000, "currency": "INR", "receipt": "<your order id>" }` → returns `id` (`order_…`).

Token fields:
```json
{ "provider": "razorpay", "orderId": "order_Abc123", "amount": 50000, "currency": "INR", "razorpayKeyId": "rzp_live_xxx" }
```
`razorpayKeyId` is the public key id; if omitted the bridge falls back to its `NEXT_PUBLIC_RAZORPAY_KEY_ID`.

**Subscription (autopay)** — create the plan once in the Razorpay dashboard, then
`POST /v1/subscriptions` with `{ plan_id, total_count, customer_notify: 1 }` → `id` (`sub_…`). Token:
```json
{ "provider": "razorpay", "orderId": "sub_Abc123", "amount": 50000, "currency": "INR",
  "razorpayKeyId": "rzp_live_xxx", "razorpayMode": "subscription" }
```
The bridge then opens checkout with `subscription_id` and sends `mode: "subscription"`, `paymentId` and
`razorpaySignature` in the verify request. The app validates the signature
`HMAC_SHA256(key_secret, paymentId + "|" + subscriptionId)`. Activation should still come from Razorpay's
`subscription.activated` / `subscription.charged` webhooks.

Razorpay settings: add the bridge domain under **Settings → Website and App Details** if Razorpay requires it for your
account.

### 6.2 Cashfree

**Order** — `POST {base}/orders` with headers `x-client-id`, `x-client-secret`, `x-api-version: 2025-01-01`.
`base` is `https://sandbox.cashfree.com/pg` or `https://api.cashfree.com/pg`.
```json
{ "order_id": "<your unique id>", "order_amount": 500.00, "order_currency": "INR",
  "customer_details": { "customer_id": "u1", "customer_phone": "9876543210", "customer_email": "a@b.com" },
  "order_meta": { "notify_url": "https://app.example.com/api/webhooks/cashfree" } }
```
`customer_phone` is mandatory and must be a valid 10-digit number. The response gives `payment_session_id`.

Token fields:
```json
{ "provider": "cashfree", "orderId": "<order_id>", "amount": 50000, "currency": "INR", "paymentSessionId": "session_xxx" }
```
Note the unit difference: Cashfree's API takes rupees; the token `amount` stays in paise (it is only used for display).
The bridge picks Cashfree's mode from its own `NEXT_PUBLIC_CASHFREE_MODE` (`production` or `sandbox`), which must match
the credentials the app used.

### 6.3 PhonePe

PhonePe is redirect-based, so the **order's return URL must point at the bridge callback**. This is the one setup step
that is easy to miss.

1. Get an access token — `POST {identity}/v1/oauth/token`, form fields `client_id`, `client_version`, `client_secret`,
   `grant_type=client_credentials`. Reuse it until `expires_at`.
2. Create the order — `POST {pg}/checkout/v2/pay` with `Authorization: O-Bearer <token>`:
```json
{ "merchantOrderId": "<your unique id, max 63 chars>", "amount": 50000, "expireAfter": 1200,
  "paymentFlow": { "type": "PG_CHECKOUT",
    "merchantUrls": { "redirectUrl": "https://<bridge>/pay/callback?appId=shop&orderId=<merchantOrderId>&provider=phonepe" } } }
```
3. The response contains `redirectUrl` (the hosted payment page).

| Environment | `identity` | `pg` |
| --- | --- | --- |
| Sandbox | `https://api-preprod.phonepe.com/apis/pg-sandbox` | `https://api-preprod.phonepe.com/apis/pg-sandbox` |
| Production | `https://api.phonepe.com/apis/identity-manager` | `https://api.phonepe.com/apis/pg` |

Token fields:
```json
{ "provider": "phonepe", "orderId": "<merchantOrderId>", "amount": 50000, "currency": "INR",
  "gatewayRedirectUrl": "https://mercury.phonepe.com/transact/…" }
```
`gatewayRedirectUrl` must be `https` on a PhonePe domain; anything else is rejected. Status check:
`GET {pg}/checkout/v2/order/{merchantOrderId}/status`, where `state: "COMPLETED"` means paid.

> The PhonePe v2 calls in the vishwayog reference code follow PhonePe's documented API but were not run against the
> sandbox. Run one sandbox payment before relying on them.

### 6.4 Offering several providers in one app

Let the student choose, then create the order with the chosen provider only. Rules that keep it safe:

- One order record per attempt; never reuse a gateway order id across providers.
- Use your own order id as `receipt` / `order_id` / `merchantOrderId` where the gateway allows it, so webhooks and the
  verify call can find the order.
- Offer only providers whose credentials are configured (vishwayog does this in `getGateways()`).
- Look up orders by `(provider, providerOrderId)`, since two gateways could in theory issue the same id.

## 7. Token reference

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `appId` | string | yes | Must match a registry key. |
| `provider` | `razorpay` \| `cashfree` \| `phonepe` | yes | |
| `orderId` | string | yes | `[A-Za-z0-9_.-]`, 1–128 chars. Gateway order id (or `sub_…`). |
| `amount` | number | yes | Positive, smallest unit (paise). Razorpay uses it directly. |
| `currency` | string | yes | 3 letters, e.g. `INR`. |
| `description` | string | no | ≤255 chars. |
| `displayAmount` | string | no | ≤32 chars, shown while loading. |
| `razorpayKeyId` | string | no | Razorpay public key id. |
| `razorpayMode` | `order` \| `subscription` | no | Razorpay only. |
| `paymentSessionId` | string | cashfree | |
| `gatewayRedirectUrl` | https URL | phonepe | Gateway domains only. |
| `iat` / `exp` | unix seconds | yes | `exp − iat ≤ 900`. `iat` may be at most 30 s in the future. |

A token that fails any rule shows "This payment link is invalid" (or "expired") and nothing is opened.

## 8. Verify endpoint contract

After the student returns, the bridge calls the app's `verifyUrl`:

```
POST <verifyUrl>
Content-Type: application/json
X-Bridge-Timestamp: <unix seconds>
X-Bridge-Signature: hex( HMAC_SHA256(secret, "<timestamp>.<raw body>") )

{ "appId": "shop", "orderId": "order_Abc123", "paymentId": "pay_…", "provider": "razorpay",
  "razorpaySignature": "…", "mode": "subscription" }      // paymentId / signature / mode only when present
```

The app must:

1. Verify the signature against the **raw** body and reject if the timestamp is more than ~5 minutes old (401).
2. Check `appId` is its own.
3. Find the order and **ask the gateway** for its real status. Never trust the body for payment status.
4. Compare the gateway's paid amount to the order amount.
5. Mark the order paid (idempotently) and reply `{ "success": true }`. Otherwise reply `{ "success": false }`.

The bridge treats anything other than HTTP 2xx with `"success": true` as a failed payment (15 s timeout). The handler
will also be called more than once for the same order if the student refreshes the callback page, so it must be
idempotent. A webhook may arrive at the same moment; guard the "mark paid" step so it happens once (vishwayog uses a
single conditional `UPDATE … WHERE status <> 'PAID'`).

## 9. Return to the app

The student is redirected to `returnUrl` with these query parameters added:

| Param | Values |
| --- | --- |
| `paymentStatus` | `SUCCESS`, `FAILED` or `CANCELLED` |
| `paymentVerified` | `1` only for `SUCCESS`, else `0` |
| `orderId` | the order id from the token |
| `paymentId`, `provider` | when known |

`SUCCESS` means "the app's own verify endpoint said yes". Still re-check the order in your backend before unlocking
anything, and handle `FAILED` as "not confirmed yet" — UPI payments can complete a few seconds later via webhook. A
good return page polls the app's own order/membership status for up to a minute.

## 10. Webhooks

The bridge does **not** receive webhooks. Each app registers its own at each gateway, pointing at its own backend, so
adding an app never touches other apps or Viddhakarma.

| Gateway | How the sender is authenticated | What to do |
| --- | --- | --- |
| Razorpay | `X-Razorpay-Signature` = HMAC-SHA256(webhook secret, raw body) | On `order.paid` / `payment.captured` settle the order; on `subscription.*` update the subscription. |
| Cashfree | `x-webhook-signature` = base64 HMAC-SHA256(client secret, `x-webhook-timestamp` + raw body) | Read `data.order.order_id`, then settle. |
| PhonePe | `Authorization` = SHA-256 of `username:password` set on the PhonePe dashboard | Read `payload.merchantOrderId`, then settle. |

Best practice used in vishwayog: after authenticating the webhook, ignore the payload's payment status and re-read the
order from the gateway API. A forged or replayed webhook then cannot grant access.

If several apps share one gateway account and the gateway allows only one webhook URL, register a small router that
reads your own order id and forwards to the right app. Razorpay supports several webhook endpoints per account; check
the current Cashfree and PhonePe dashboards for their limits before relying on one URL per app.

## 11. Security model

- **Per-app secrets.** A leaked secret affects one app only. Rotate by changing it in both places and redeploying.
- **Signed, short-lived tokens** (≤15 min). Tampering with amount, provider or order id breaks the signature.
- **Redirect targets** come from the registry; gateway redirect URLs are restricted to `https` on gateway domains.
- **The app decides.** The bridge never marks anything paid; the app verifies with the gateway itself.
- **Timing-safe comparison** for every HMAC check.
- Keep `PAYMENT_BRIDGE_APPS` out of client bundles (it is not `NEXT_PUBLIC_`) and out of logs.
- Limits to know about: a valid token can be reopened until it expires, which only reopens the same order. Gateway
  secrets live in each app, so a compromised app can create orders on that merchant account — scope keys accordingly.

## 12. Troubleshooting

| Symptom | Likely cause |
| --- | --- |
| "This payment link is invalid" | Wrong `appId`, secret mismatch, bad base64url, or a provider field missing (`paymentSessionId` / `gatewayRedirectUrl`). |
| "This payment link has expired" | Token older than `exp`, or server clocks differ by more than a few minutes. |
| "Payments are temporarily unavailable" | `PAYMENT_BRIDGE_APPS` is not valid JSON, a secret is under 32 chars, or a URL is not https. Check the bridge logs for `app registry is misconfigured`. |
| Cashfree checkout does nothing | `NEXT_PUBLIC_CASHFREE_MODE` does not match the credentials' environment. |
| Razorpay "key is not configured" | No `razorpayKeyId` in the token and no `NEXT_PUBLIC_RAZORPAY_KEY_ID` on the bridge. |
| Paid, but the app shows `FAILED` | The verify endpoint returned non-2xx, was slow (>15 s), or the gateway had not yet reported the payment. Check that it replies `{"success": true}` and retries the gateway check briefly. |
| Verify endpoint gets 401s from the app's own check | Verifying a parsed/re-serialised body instead of the **raw** body, or a stale timestamp. |
| PhonePe returns the student to the wrong place | The order's `redirectUrl` does not point at `/pay/callback?appId=…&orderId=…&provider=phonepe`. |
| Duplicate payments rows | Verify and webhook both ran and "mark paid" is not guarded. |

## 13. Adding a new provider

Today the bridge supports `razorpay`, `cashfree` and `phonepe`. Payment domains for Paytm, PayU and Easebuzz are
already accepted for redirect URLs, but those providers are not enabled. Redirect-based providers are the easy case:

1. **Bridge `lib/bridge/token.ts`:** add the name to the `provider` enum and, if it needs a field (like a hosted URL),
   add a rule in `superRefine` next to the PhonePe rule. Add any new gateway domain to `GATEWAY_HOSTS`.
2. **Bridge `app/pay/start/pay-start-client.tsx`:** redirect-based providers already work through the
   `gatewayRedirectUrl` path. SDK-based providers need an opening branch like the Cashfree one.
3. **Bridge `app/pay/callback/page.tsx`:** add the name to the `PROVIDERS` set.
4. **Tests:** add token cases to `lib/bridge/token.test.ts` (`npm test`).
5. **Each app:** add the gateway's order-creation and status-check code (copy the shape of
   `src/lib/payments/gateways/phonepe.ts`), a webhook route, and the credentials.

No change is needed to the registry, the verify contract or the return flow.

## 14. Reference implementation: Vishwayog

In the `vishwayog` repo:

| Path | Role |
| --- | --- |
| `src/lib/payments/bridge.ts` | Sign tokens; authenticate the bridge's verify call |
| `src/lib/payments/gateways/{razorpay,cashfree,phonepe}.ts` | Create order + read status per gateway |
| `src/lib/payments/webhooks.ts` | Cashfree / PhonePe webhook authentication |
| `src/lib/services/payment-orders.ts` | `startCheckout`, `settleOrder` (idempotent, amount-checked) |
| `src/app/api/payments/checkout/route.ts` | Creates the order and returns the bridge URL |
| `src/app/api/bridge/verify/route.ts` | The verify endpoint |
| `src/app/api/webhooks/{razorpay,cashfree,phonepe}/route.ts` | Webhooks |
| `tests/unit`, `tests/db` | Unit tests and Postgres integration tests (`bun run test:unit`, `bun run test:db`) |

Bridge entry for it:
```json
{"vishwayog":{"name":"Vishwayog","returnUrl":"https://<domain>/#student-membership","verifyUrl":"https://<domain>/api/bridge/verify","secret":"<same as PAYMENT_BRIDGE_SECRET>"}}
```

## 15. Environment variables

**Bridge (`ishswamitech-website`)**

| Variable | Purpose |
| --- | --- |
| `PAYMENT_BRIDGE_APPS` | App registry JSON (section 4). Server-only. |
| `NEXT_PUBLIC_CASHFREE_MODE` | `production` or `sandbox` (default `sandbox`). |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Optional default Razorpay key id. |
| `NEXT_PUBLIC_BACKEND_URL`, `NEXT_PUBLIC_VIDDHAKARMA_URL` | Legacy Viddhakarma routes only. |

**Each app**

| Variable | Purpose |
| --- | --- |
| `PAYMENT_BRIDGE_URL` | Bridge origin, e.g. `https://www.ishswami.in`. |
| `PAYMENT_BRIDGE_APP_ID` | This app's registry key. |
| `PAYMENT_BRIDGE_SECRET` | The secret from this app's registry entry. |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `RAZORPAY_PLAN_ID` | Razorpay (plan id only for autopay). |
| `CASHFREE_APP_ID`, `CASHFREE_SECRET_KEY`, `CASHFREE_ENVIRONMENT` | Cashfree. |
| `PHONEPE_CLIENT_ID`, `PHONEPE_CLIENT_SECRET`, `PHONEPE_CLIENT_VERSION`, `PHONEPE_ENVIRONMENT` | PhonePe. |
| `PHONEPE_WEBHOOK_USERNAME`, `PHONEPE_WEBHOOK_PASSWORD` | PhonePe webhook authentication. |
