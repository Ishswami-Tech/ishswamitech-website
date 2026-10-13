import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { buildReturnUrl, signVerifyRequest, verifyPaymentWithApp } from "./verify-client.ts";
import type { PaymentApp } from "./app-registry.ts";

const app: PaymentApp = {
  appId: "yoga",
  name: "Yoga",
  returnUrl: "https://yoga.example.com/payment/result?src=bridge",
  verifyUrl: "https://api.yoga.example.com/bridge/verify",
  secret: "s".repeat(40),
};

const params = { orderId: "order_1", paymentId: "pay_1", provider: "razorpay" } as const;

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
}

describe("signVerifyRequest", () => {
  it("is HMAC-SHA256 over `${timestamp}.${body}`", () => {
    const expected = createHmac("sha256", app.secret).update("123.{}").digest("hex");
    assert.equal(signVerifyRequest(app.secret, "123", "{}"), expected);
  });
});

describe("verifyPaymentWithApp", () => {
  it("sends a signed request and returns success only on explicit true", async () => {
    let seen: { url: string; init: RequestInit } | undefined;
    const fetchImpl = (async (url: string, init: RequestInit) => {
      seen = { url, init };
      return jsonResponse({ success: true });
    }) as unknown as typeof fetch;
    const result = await verifyPaymentWithApp(app, params, { fetchImpl, nowMs: () => 1_000_000 });
    assert.deepEqual(result, { success: true });
    assert.equal(seen?.url, app.verifyUrl);
    const headers = seen?.init.headers as Record<string, string>;
    assert.equal(headers["X-Bridge-Timestamp"], "1000");
    assert.equal(
      headers["X-Bridge-Signature"],
      signVerifyRequest(app.secret, "1000", String(seen?.init.body)),
    );
  });

  it("forwards the checkout mode to the app", async () => {
    let body = "";
    const fetchImpl = (async (_url: string, init: RequestInit) => {
      body = String(init.body);
      return jsonResponse({ success: true });
    }) as unknown as typeof fetch;
    await verifyPaymentWithApp(app, { ...params, mode: "subscription" }, { fetchImpl });
    assert.equal(JSON.parse(body).mode, "subscription");
  });

  it("treats missing or non-true success as failure", async () => {
    for (const body of [{}, { success: "true" }, { success: false }, "ok"]) {
      const fetchImpl = (async () => jsonResponse(body)) as unknown as typeof fetch;
      const result = await verifyPaymentWithApp(app, params, { fetchImpl });
      assert.equal(result.success, false, JSON.stringify(body));
    }
  });

  it("treats http errors and network errors as failure", async () => {
    const http500 = (async () => jsonResponse({ success: true }, 500)) as unknown as typeof fetch;
    assert.equal((await verifyPaymentWithApp(app, params, { fetchImpl: http500 })).success, false);
    const boom = (async () => {
      throw new Error("down");
    }) as unknown as typeof fetch;
    assert.equal((await verifyPaymentWithApp(app, params, { fetchImpl: boom })).success, false);
  });
});

describe("buildReturnUrl", () => {
  it("preserves the app's existing query and appends the result", () => {
    const url = new URL(
      buildReturnUrl(app, { status: "SUCCESS", orderId: "order_1", paymentId: "pay_1", provider: "razorpay" }),
    );
    assert.equal(url.origin, "https://yoga.example.com");
    assert.equal(url.searchParams.get("src"), "bridge");
    assert.equal(url.searchParams.get("paymentStatus"), "SUCCESS");
    assert.equal(url.searchParams.get("paymentVerified"), "1");
    assert.equal(url.searchParams.get("orderId"), "order_1");
  });

  it("marks non-success outcomes as unverified", () => {
    const url = new URL(buildReturnUrl(app, { status: "CANCELLED", orderId: "o" }));
    assert.equal(url.searchParams.get("paymentVerified"), "0");
    assert.equal(url.searchParams.get("paymentStatus"), "CANCELLED");
  });
});
