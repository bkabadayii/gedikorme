import { describe, expect, it } from "vitest";
import { GET, POST } from "./route";

const post = (body: unknown) =>
  POST(
    new Request("http://test/api/inquiry", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );

const valid = { name: "Ayşe", email: "ayse@example.com", message: "Süprem hakkında bilgi" };

describe("POST /api/inquiry", () => {
  it("never reports success while delivery is unconfigured", async () => {
    const res = await post(valid);
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: "delivery_not_configured" });
  });

  it("rejects malformed JSON", async () => {
    expect((await post("nope")).status).toBe(400);
  });

  it("rejects invalid email, missing fields and filled honeypot", async () => {
    expect((await post({ ...valid, email: "bad" })).status).toBe(422);
    expect((await post({ ...valid, message: "" })).status).toBe(422);
    expect((await post({ ...valid, website: "spam" })).status).toBe(422);
  });

  it("answers GET with 405", async () => {
    expect(GET().status).toBe(405);
  });
});
