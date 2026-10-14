import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createCipheriv, createHash, randomBytes } from "node:crypto";
import { decryptBridgeCustomer, sanitizeBranding } from "./customer.ts";
import type { PaymentApp } from "./app-registry.ts";

const SECRET = "s".repeat(40);
const app: PaymentApp = {
  appId: "yoga",
  name: "Yoga",
  returnUrl: "https://yoga.example.com/payment/result",
  verifyUrl: "https://api.yoga.example.com/bridge/verify",
  secret: SECRET,
};

function encrypt(plaintext: string, secret: string = SECRET): string {
  const key = createHash("sha256").update(`bridge-prefill:v1:${secret}`, "utf8").digest();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const data = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, tag, data].map((part) => part.toString("base64url")).join(".");
}

const full = { name: "Asha Rao", email: "asha@example.com", contact: "+919876543210" };

describe("decryptBridgeCustomer", () => {
  it("round-trips a valid payload", () => {
    assert.deepEqual(decryptBridgeCustomer(SECRET, encrypt(JSON.stringify(full))), full);
  });

  it("accepts partial payloads", () => {
    assert.deepEqual(decryptBridgeCustomer(SECRET, encrypt(JSON.stringify({ email: "a@b.co" }))), {
      email: "a@b.co",
    });
  });

  it("returns null with the wrong key", () => {
    assert.equal(decryptBridgeCustomer("x".repeat(40), encrypt(JSON.stringify(full))), null);
  });

  it("returns null when ciphertext, tag or iv is tampered", () => {
    const [iv, tag, data] = encrypt(JSON.stringify(full)).split(".");
    const flip = (value: string): string => {
      const buf = Buffer.from(value, "base64url");
      buf[0] ^= 1;
      return buf.toString("base64url");
    };
    assert.equal(decryptBridgeCustomer(SECRET, `${iv}.${tag}.${flip(data)}`), null);
    assert.equal(decryptBridgeCustomer(SECRET, `${iv}.${flip(tag)}.${data}`), null);
    assert.equal(decryptBridgeCustomer(SECRET, `${flip(iv)}.${tag}.${data}`), null);
  });

  it("returns null for malformed input", () => {
    for (const value of ["", "abc", "a.b", "a.b.c.d", "..", undefined, null, 42, {}]) {
      assert.equal(decryptBridgeCustomer(SECRET, value), null);
    }
    const [iv, tag, data] = encrypt(JSON.stringify(full)).split(".");
    assert.equal(decryptBridgeCustomer(SECRET, `${iv.slice(0, 4)}.${tag}.${data}`), null);
    assert.equal(decryptBridgeCustomer(SECRET, `${iv}.${tag.slice(0, 4)}.${data}`), null);
  });

  it("returns null for non-object or empty plaintext", () => {
    for (const text of ["not json", "[]", "null", '"x"', "{}", '{"foo":"bar"}']) {
      assert.equal(decryptBridgeCustomer(SECRET, encrypt(text)), null);
    }
  });

  it("drops invalid fields but keeps valid ones", () => {
    const result = decryptBridgeCustomer(
      SECRET,
      encrypt(JSON.stringify({ name: "Asha", email: "not-an-email", contact: "12ab" })),
    );
    assert.deepEqual(result, { name: "Asha" });
  });

  it("validates contact format", () => {
    const contactOf = (contact: unknown) =>
      decryptBridgeCustomer(SECRET, encrypt(JSON.stringify({ name: "A", contact })))?.contact;
    assert.equal(contactOf("9876543210"), "9876543210");
    assert.equal(contactOf("+919876543210"), "+919876543210");
    assert.equal(contactOf("1234567"), undefined);
    assert.equal(contactOf("1".repeat(16)), undefined);
    assert.equal(contactOf("98765 43210"), undefined);
    assert.equal(contactOf("++919876543210"), undefined);
    assert.equal(contactOf(9876543210), undefined);
  });

  it("rejects over-long and non-string fields", () => {
    const long = "a".repeat(121);
    const result = decryptBridgeCustomer(
      SECRET,
      encrypt(JSON.stringify({ name: long, email: `${long}@example.com`, contact: "9876543210" })),
    );
    assert.deepEqual(result, { contact: "9876543210" });
    assert.equal(decryptBridgeCustomer(SECRET, encrypt(JSON.stringify({ name: 5, email: ["a@b.co"] }))), null);
  });

  it("ignores unknown extra fields", () => {
    const result = decryptBridgeCustomer(SECRET, encrypt(JSON.stringify({ ...full, admin: true })));
    assert.deepEqual(result, full);
  });
});

describe("sanitizeBranding", () => {
  it("falls back to the app name", () => {
    assert.deepEqual(sanitizeBranding(app, {}), { name: "Yoga" });
  });

  it("accepts valid displayName, logo on the return host, and note", () => {
    assert.deepEqual(
      sanitizeBranding(app, {
        displayName: "Shree Vishwayog",
        logoUrl: "https://yoga.example.com/logo.png",
        note: "Collected by Ishswami Tech",
      }),
      { name: "Shree Vishwayog", image: "https://yoga.example.com/logo.png", note: "Collected by Ishswami Tech" },
    );
  });

  it("ignores a logo on another host, non-https, or malformed", () => {
    for (const logoUrl of [
      "https://evil.example.org/logo.png",
      "http://yoga.example.com/logo.png",
      "https://sub.yoga.example.com/logo.png",
      "javascript:alert(1)",
      "not a url",
    ]) {
      assert.equal(sanitizeBranding(app, { logoUrl }).image, undefined, logoUrl);
    }
  });

  it("matches the logo host case-insensitively", () => {
    const result = sanitizeBranding(app, { logoUrl: "https://YOGA.example.com/a.png" });
    assert.ok(result.image);
  });

  it("ignores over-long values", () => {
    const result = sanitizeBranding(app, {
      displayName: "n".repeat(61),
      logoUrl: `https://yoga.example.com/${"a".repeat(300)}`,
      note: "x".repeat(141),
    });
    assert.deepEqual(result, { name: "Yoga" });
  });

  it("accepts values at the exact limits", () => {
    const result = sanitizeBranding(app, { displayName: "n".repeat(60), note: "x".repeat(140) });
    assert.equal(result.name.length, 60);
    assert.equal(result.note?.length, 140);
  });

  it("ignores non-string and blank values", () => {
    const result = sanitizeBranding(app, { displayName: 5, logoUrl: {}, note: "   " });
    assert.deepEqual(result, { name: "Yoga" });
  });
});
