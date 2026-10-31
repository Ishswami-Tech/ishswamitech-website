import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readOrderCashfreeMode, resolveCashfreeMode } from "./cashfree-mode.ts";

describe("resolveCashfreeMode", () => {
  it("uses the order's sandbox mode even on a production build", () => {
    assert.equal(resolveCashfreeMode("production", { metadata: { environment: "sandbox" } }), "sandbox");
  });

  it("uses the order's production mode on a sandbox build", () => {
    assert.equal(resolveCashfreeMode("sandbox", { environment: "production" }), "production");
  });

  it("checks the intent before the payload", () => {
    assert.equal(
      resolveCashfreeMode("production", { metadata: { environment: "sandbox" } }, { environment: "production" }),
      "sandbox",
    );
  });

  it("falls back to the payload, then the build env", () => {
    assert.equal(resolveCashfreeMode("production", {}, { environment: "sandbox" }), "sandbox");
    assert.equal(resolveCashfreeMode("production", {}, {}), "production");
  });

  it("defaults to sandbox when nothing is known", () => {
    assert.equal(resolveCashfreeMode(undefined, null, undefined), "sandbox");
    assert.equal(resolveCashfreeMode("weird"), "sandbox");
  });

  it("ignores unknown values", () => {
    assert.equal(readOrderCashfreeMode({ environment: "staging" }), undefined);
  });
});
