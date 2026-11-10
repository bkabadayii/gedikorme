import { describe, expect, it, vi } from "vitest";
import { CONSENT_VERSION } from "@/lib/inquiry/validate";
import { handleInquiry, type Deps } from "./inquiry-handler";

const fabrics = [{ id: "single-jersey", code: "DEMO-001", name: "Süprem" }];
const env = { RESEND_API_KEY: "re_test", TURNSTILE_SECRET_KEY: "ts_test", INQUIRY_TO: "owner@example.invalid" };
const valid = {
  kind: "quote", locale: "tr", name: "Ayşe Yılmaz", email: "ayse@example.com",
  message: "Süprem için fiyat ve termin öğrenmek istiyorum.",
  items: [{ id: "single-jersey", note: "Kırmızı" }],
  consent: { accepted: true, version: CONSENT_VERSION },
  turnstileToken: "token", website: "",
};

type Calls = { url: string; init?: RequestInit }[];
function fakeFetch(opts: { human?: boolean; resend?: number } = {}) {
  const calls: Calls = [];
  const impl = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
    const u = String(url);
    calls.push({ url: u, init });
    if (u.includes("siteverify")) return Response.json({ success: opts.human ?? true });
    return Response.json({ id: "email_1" }, { status: opts.resend ?? 200 });
  }) as unknown as typeof fetch;
  return { impl, calls };
}

const req = (body: unknown, headers: Record<string, string> = {}) =>
  new Request("http://test/api/inquiry", {
    method: "POST",
    headers,
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

const run = (body: unknown, over: Partial<Deps> = {}, headers?: Record<string, string>) => {
  const logs: Record<string, unknown>[] = [];
  const f = fakeFetch();
  const p = handleInquiry(req(body, headers), {
    env, fabrics, fetchImpl: f.impl, randomBytes: (n) => new Uint8Array(n).fill(1),
    now: () => new Date("2026-11-10T10:00:00Z"), log: (e) => logs.push(e), ...over,
  });
  return { p, logs, f };
};

describe("handleInquiry", () => {
  it("sends the mail and returns a reference only after Resend accepts it", async () => {
    const { p, f, logs } = run(valid);
    const res = await p;
    expect(res.status).toBe(200);
    const json = (await res.json()) as { ok: boolean; ref: string };
    expect(json.ok).toBe(true);
    expect(json.ref).toMatch(/^GO-[A-Z2-9]{4}-[A-Z2-9]{4}$/);
    const send = f.calls.find((c) => c.url.includes("/emails"))!;
    const sent = JSON.parse(send.init!.body as string);
    expect(sent.to).toEqual([env.INQUIRY_TO]);
    expect(sent.reply_to).toBe("ayse@example.com");
    expect(sent.from).toContain("onboarding@resend.dev");
    expect(sent.text).toContain("DEMO-001 Süprem: Kırmızı");
    expect(sent.text).toContain(CONSENT_VERSION);
    expect(logs).toEqual([{ event: "inquiry", outcome: "sent", kind: "quote", locale: "tr", fabricCount: 1 }]);
  });

  it("never puts personal data in logs", async () => {
    const { p, logs } = run(valid);
    await p;
    const text = JSON.stringify(logs);
    for (const secret of ["Ayşe", "ayse@example.com", "Süprem için"]) expect(text).not.toContain(secret);
  });

  it("forwards the client's idempotency key", async () => {
    const { p, f } = run(valid, {}, { "Idempotency-Key": "abc-123" });
    await p;
    const send = f.calls.find((c) => c.url.includes("/emails"))!;
    expect((send.init!.headers as Record<string, string>)["Idempotency-Key"]).toBe("abc-123");
  });

  it("returns a generic 422 for a tripped honeypot, without naming the field", async () => {
    const res = await run({ ...valid, website: "spam" }).p;
    expect(res.status).toBe(422);
    const text = await res.text();
    expect(text).toBe(JSON.stringify({ error: "invalid_input" }));
    expect(text).not.toContain("website");
  });

  it("is 503 not_configured when a secret is missing", async () => {
    const res = await run(valid, { env: { ...env, INQUIRY_TO: undefined } }).p;
    expect(res.status).toBe(503);
  });

  it("reports field errors with 422 and sends nothing", async () => {
    const { p, f } = run({ ...valid, kind: "contact", email: "bad", message: "", consent: { accepted: false } });
    const res = await p;
    expect(res.status).toBe(422);
    const json = (await res.json()) as { fields: Record<string, string> };
    expect(json.fields).toMatchObject({ email: "invalid", message: "required", consent: "required" });
    expect(f.calls).toHaveLength(0);
  });

  it("rejects unknown fabric ids", async () => {
    const res = await run({ ...valid, items: [{ id: "nope" }] }).p;
    expect(res.status).toBe(422);
  });

  it("is 403 when Turnstile does not verify, and sends nothing", async () => {
    const f = fakeFetch({ human: false });
    const res = await run(valid, { fetchImpl: f.impl }).p;
    expect(res.status).toBe(403);
    expect(f.calls.some((c) => c.url.includes("/emails"))).toBe(false);
  });

  it("is 403 without a token", async () => {
    const res = await run({ ...valid, turnstileToken: "" }).p;
    expect(res.status).toBe(403);
  });

  it("is 502, not success, when Resend refuses", async () => {
    const f = fakeFetch({ resend: 422 });
    const res = await run(valid, { fetchImpl: f.impl }).p;
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: "delivery_failed" });
  });

  it("is 429 with Retry-After when the limiter says no", async () => {
    const res = await run(valid, { env: { ...env, INQUIRY_LIMITER: { limit: async () => ({ success: false }) } } }).p;
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBe("60");
  });

  it("rejects oversized and malformed bodies", async () => {
    expect((await run("x".repeat(25_000)).p).status).toBe(413);
    expect((await run("nope").p).status).toBe(400);
    expect((await run("[1,2]").p).status).toBe(400);
  });
});
