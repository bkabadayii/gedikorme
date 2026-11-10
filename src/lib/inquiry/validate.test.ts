import { describe, expect, it } from "vitest";
import { CONSENT_VERSION, LIMITS, validateInquiry } from "./validate";

const ids = new Set(["a", "b"]);
const ok = {
  kind: "contact", locale: "en", name: "N", email: "n@example.com", message: "Hi",
  consent: { accepted: true, version: CONSENT_VERSION },
};

describe("validateInquiry", () => {
  it("accepts a minimal contact message and drops empty optionals", () => {
    const r = validateInquiry({ ...ok, company: "  ", phone: "" }, ids);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.company).toBeUndefined();
      expect(r.data.items).toEqual([]);
    }
  });

  it("requires name, email, message and consent on a contact message", () => {
    const r = validateInquiry({ kind: "contact", locale: "tr" }, ids);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.fields).toMatchObject({ name: "required", email: "required", message: "required", consent: "required" });
  });

  it("does not require a message on a quote request", () => {
    const r = validateInquiry({ ...ok, kind: "quote", message: "" }, ids);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.message).toBe("");
    const q = validateInquiry({ kind: "quote", locale: "tr" }, ids);
    if (!q.ok) expect(q.fields.message).toBeUndefined();
  });

  it("enforces lengths and formats", () => {
    const r = validateInquiry({ ...ok, message: "x".repeat(LIMITS.message + 1), phone: "call me", email: "a@b" }, ids);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.fields).toMatchObject({ message: "too_long", phone: "invalid", email: "invalid" });
  });

  it("requires the current consent wording version", () => {
    const r = validateInquiry({ ...ok, consent: { accepted: true, version: "old" } }, ids);
    expect(r.ok).toBe(false);
  });

  it("allows a quote with no fabrics, checks ids, notes and duplicates", () => {
    expect(validateInquiry({ ...ok, kind: "quote" }, ids).ok).toBe(true);
    expect(validateInquiry({ ...ok, items: [{ id: "a", note: "n" }, { id: "b" }] }, ids).ok).toBe(true);
    expect(validateInquiry({ ...ok, items: [{ id: "zzz" }] }, ids).ok).toBe(false);
    expect(validateInquiry({ ...ok, items: [{ id: "a" }, { id: "a" }] }, ids).ok).toBe(false);
    expect(validateInquiry({ ...ok, items: [{ id: "a", note: "x".repeat(LIMITS.itemNote + 1) }] }, ids).ok).toBe(false);
  });

  it("rejects a non-object body", () => {
    expect(validateInquiry(null, ids).ok).toBe(false);
    expect(validateInquiry([], ids).ok).toBe(false);
  });
});
