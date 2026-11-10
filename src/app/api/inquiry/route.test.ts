import { describe, expect, it } from "vitest";
import { GET, POST } from "./route";

describe("/api/inquiry route", () => {
  it("answers 503 not_configured, never success, when no secrets are set", async () => {
    const res = await POST(
      new Request("http://test/api/inquiry", { method: "POST", body: JSON.stringify({ name: "x" }) }),
    );
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: "not_configured" });
  });

  it("answers GET with 405", () => {
    expect(GET().status).toBe(405);
  });
});
