import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseAppRegistry } from "./app-registry.ts";

const valid = {
  yoga: {
    name: "Yoga",
    returnUrl: "https://yoga.example.com/payment/result",
    verifyUrl: "https://api.yoga.example.com/bridge/verify",
    secret: "s".repeat(32),
  },
};

describe("parseAppRegistry", () => {
  it("parses a valid registry and injects appId", () => {
    const registry = parseAppRegistry(JSON.stringify(valid));
    assert.equal(registry.yoga.appId, "yoga");
    assert.equal(registry.yoga.name, "Yoga");
  });

  it("returns an empty registry when unset", () => {
    assert.deepEqual(parseAppRegistry(undefined), {});
    assert.deepEqual(parseAppRegistry("  "), {});
  });

  it("throws on invalid JSON", () => {
    assert.throws(() => parseAppRegistry("{nope"), /PAYMENT_BRIDGE_APPS/);
  });

  it("rejects short secrets", () => {
    const bad = { yoga: { ...valid.yoga, secret: "short" } };
    assert.throws(() => parseAppRegistry(JSON.stringify(bad)), /yoga/);
  });

  it("rejects http urls outside localhost", () => {
    const bad = { yoga: { ...valid.yoga, returnUrl: "http://yoga.example.com/x" } };
    assert.throws(() => parseAppRegistry(JSON.stringify(bad)), /yoga/);
    const local = {
      yoga: { ...valid.yoga, returnUrl: "http://localhost:3000/x", verifyUrl: "http://localhost:4000/v" },
    };
    assert.equal(parseAppRegistry(JSON.stringify(local)).yoga.appId, "yoga");
  });

  it("rejects the reserved viddhakarma id and bad ids", () => {
    assert.throws(() => parseAppRegistry(JSON.stringify({ viddhakarma: valid.yoga })), /viddhakarma/);
    assert.throws(() => parseAppRegistry(JSON.stringify({ "Bad Id!": valid.yoga })), /Bad Id!/);
  });
});
