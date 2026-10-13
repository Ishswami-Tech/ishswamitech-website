import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { signBridgeToken, verifyBridgeToken, type BridgeTokenInput } from "./token.ts";
import type { PaymentApp } from "./app-registry.ts";

const SECRET = "s".repeat(40);
const app: PaymentApp = {
  appId: "yoga",
  name: "Yoga",
  returnUrl: "https://yoga.example.com/payment/result",
  verifyUrl: "https://api.yoga.example.com/bridge/verify",
  secret: SECRET,
};
const apps = { yoga: app };
const now = 1_800_000_000;

function input(overrides: Partial<BridgeTokenInput> = {}): BridgeTokenInput {
  return {
    appId: "yoga",
    provider: "razorpay",
    orderId: "order_123",
    amount: 49900,
    currency: "INR",
    razorpayKeyId: "rzp_live_x",
    iat: now,
    exp: now + 600,
    ...overrides,
  };
}

describe("bridge token", () => {
  it("round-trips a valid token", () => {
    const token = signBridgeToken(input(), SECRET);
    const result = verifyBridgeToken(token, apps, now + 10);
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.payload.orderId, "order_123");
      assert.equal(result.app.appId, "yoga");
    }
  });

  it("rejects a tampered body", () => {
    const [body, sig] = signBridgeToken(input(), SECRET).split(".");
    const forged = Buffer.from(JSON.stringify({ ...input(), amount: 1 })).toString("base64url");
    assert.notEqual(forged, body);
    const result = verifyBridgeToken(`${forged}.${sig}`, apps, now);
    assert.deepEqual(result, { ok: false, reason: "bad_signature" });
  });

  it("rejects a token signed with another app's secret", () => {
    const token = signBridgeToken(input(), "x".repeat(40));
    assert.deepEqual(verifyBridgeToken(token, apps, now), { ok: false, reason: "bad_signature" });
  });

  it("rejects unknown apps", () => {
    const token = signBridgeToken(input({ appId: "shop" }), SECRET);
    assert.deepEqual(verifyBridgeToken(token, apps, now), { ok: false, reason: "unknown_app" });
  });

  it("rejects expired tokens", () => {
    const token = signBridgeToken(input(), SECRET);
    assert.deepEqual(verifyBridgeToken(token, apps, now + 601), { ok: false, reason: "expired" });
  });

  it("rejects tokens with a lifetime over 15 minutes", () => {
    const token = signBridgeToken(input({ exp: now + 3600 }), SECRET);
    assert.deepEqual(verifyBridgeToken(token, apps, now), { ok: false, reason: "invalid_payload" });
  });

  it("rejects tokens issued in the future beyond clock skew", () => {
    const token = signBridgeToken(input({ iat: now + 600, exp: now + 900 }), SECRET);
    assert.deepEqual(verifyBridgeToken(token, apps, now), { ok: false, reason: "invalid_payload" });
  });

  it("accepts razorpay subscription mode and rejects unknown modes", () => {
    const ok = signBridgeToken(input({ orderId: "sub_123", razorpayMode: "subscription" }), SECRET);
    const result = verifyBridgeToken(ok, apps, now);
    assert.equal(result.ok, true);
    if (result.ok) {
      assert.equal(result.payload.razorpayMode, "subscription");
    }
    const bad = signBridgeToken(input({ razorpayMode: "weird" as never }), SECRET);
    assert.deepEqual(verifyBridgeToken(bad, apps, now), { ok: false, reason: "invalid_payload" });
  });

  it("rejects subscription mode for non-razorpay providers", () => {
    const token = signBridgeToken(
      input({ provider: "cashfree", razorpayKeyId: undefined, paymentSessionId: "s", razorpayMode: "subscription" }),
      SECRET,
    );
    assert.deepEqual(verifyBridgeToken(token, apps, now), { ok: false, reason: "invalid_payload" });
  });

  it("rejects malformed input", () => {
    for (const bad of ["", "abc", "a.b.c", "!!.??"]) {
      const result = verifyBridgeToken(bad, apps, now);
      assert.equal(result.ok, false, bad);
    }
  });

  it("requires provider-specific fields", () => {
    const cashfree = signBridgeToken(input({ provider: "cashfree", razorpayKeyId: undefined }), SECRET);
    assert.deepEqual(verifyBridgeToken(cashfree, apps, now), { ok: false, reason: "invalid_payload" });
    const phonepe = signBridgeToken(input({ provider: "phonepe", razorpayKeyId: undefined }), SECRET);
    assert.deepEqual(verifyBridgeToken(phonepe, apps, now), { ok: false, reason: "invalid_payload" });
  });

  it("only allows gateway hosts for gatewayRedirectUrl", () => {
    const evil = signBridgeToken(
      input({ provider: "phonepe", razorpayKeyId: undefined, gatewayRedirectUrl: "https://evil.com/pay" }),
      SECRET,
    );
    assert.deepEqual(verifyBridgeToken(evil, apps, now), { ok: false, reason: "invalid_payload" });
    const ok = signBridgeToken(
      input({
        provider: "phonepe",
        razorpayKeyId: undefined,
        gatewayRedirectUrl: "https://mercury.phonepe.com/pay/abc",
      }),
      SECRET,
    );
    assert.equal(verifyBridgeToken(ok, apps, now).ok, true);
  });

  it("rejects look-alike gateway hosts and non-https urls", () => {
    for (const url of ["https://notphonepe.com/x", "https://phonepe.com.evil.com/x", "http://mercury.phonepe.com/x"]) {
      const token = signBridgeToken(
        input({ provider: "phonepe", razorpayKeyId: undefined, gatewayRedirectUrl: url }),
        SECRET,
      );
      assert.equal(verifyBridgeToken(token, apps, now).ok, false, url);
    }
  });
});
