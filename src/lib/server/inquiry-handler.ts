import { validateInquiry } from "@/lib/inquiry/validate";
import type { ServerEnv } from "./env";
import { buildMail, makeRef, type FabricRef } from "./format";
import { sendMail } from "./resend";
import { verifyTurnstile } from "./turnstile";

export const MAX_BODY_BYTES = 20_000;
const DEFAULT_FROM = "Gedik Örme <onboarding@resend.dev>";

export type Deps = {
  env: ServerEnv;
  fabrics: FabricRef[];
  fetchImpl?: typeof fetch;
  randomBytes?: (n: number) => Uint8Array;
  now?: () => Date;
  log?: (event: Record<string, unknown>) => void;
};

const json = (body: unknown, status: number, headers?: Record<string, string>) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });

/**
 * POST /api/inquiry. Success is returned only after Resend accepts the mail;
 * every failure says so. Logs carry counts and outcomes, never personal data.
 */
export async function handleInquiry(request: Request, deps: Deps): Promise<Response> {
  const { env } = deps;
  const log = deps.log ?? ((e) => console.log(JSON.stringify(e)));
  const random = deps.randomBytes ?? ((n) => crypto.getRandomValues(new Uint8Array(n)));
  const ctx: { kind?: string; locale?: string; fabricCount: number } = { fabricCount: 0 };
  const done = (outcome: string, res: Response) => {
    log({ event: "inquiry", outcome, kind: ctx.kind, locale: ctx.locale, fabricCount: ctx.fabricCount });
    return res;
  };

  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return done("too_large", json({ error: "payload_too_large" }, 413));
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(text);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) throw new Error("shape");
    body = parsed as Record<string, unknown>;
  } catch {
    return done("invalid_json", json({ error: "invalid_json" }, 400));
  }
  ctx.kind = typeof body.kind === "string" ? body.kind : undefined;
  ctx.locale = typeof body.locale === "string" ? body.locale : undefined;

  // Honeypot: a generic 422 that never names the field.
  if (body.website !== undefined && body.website !== "") {
    return done("honeypot", json({ error: "invalid_input" }, 422));
  }

  if (!env.RESEND_API_KEY || !env.TURNSTILE_SECRET_KEY || !env.INQUIRY_TO) {
    return done("not_configured", json({ error: "not_configured" }, 503));
  }

  const ip = request.headers.get("CF-Connecting-IP") ?? undefined;
  if (env.INQUIRY_LIMITER) {
    const { success } = await env.INQUIRY_LIMITER.limit({ key: ip ?? "anonymous" });
    if (!success) return done("rate_limited", json({ error: "rate_limited", retryAfter: 60 }, 429, { "Retry-After": "60" }));
  }

  const result = validateInquiry(body, new Set(deps.fabrics.map((f) => f.id)));
  if (!result.ok) return done("invalid_input", json({ error: "invalid_input", fields: result.fields }, 422));
  const input = result.data;
  ctx.fabricCount = input.items.length;

  const token = typeof body.turnstileToken === "string" ? body.turnstileToken : "";
  const human = token ? await verifyTurnstile(token, env.TURNSTILE_SECRET_KEY, ip, deps.fetchImpl) : false;
  if (!human) return done("turnstile_failed", json({ error: "turnstile_failed" }, 403));

  const ref = makeRef(random(8));
  const mail = buildMail(input, ref, deps.fabrics, (deps.now ?? (() => new Date()))());
  const requestKey = request.headers.get("Idempotency-Key");
  const sent = await sendMail(
    {
      from: env.INQUIRY_FROM ?? DEFAULT_FROM,
      to: env.INQUIRY_TO,
      replyTo: input.email,
      subject: mail.subject,
      text: mail.text,
      idempotencyKey: requestKey && requestKey.length <= 100 ? requestKey : ref,
    },
    env.RESEND_API_KEY,
    env.RESEND_API_BASE,
    deps.fetchImpl,
  );
  if (!sent.ok) return done("delivery_failed", json({ error: "delivery_failed" }, 502));
  return done("sent", json({ ok: true, ref }, 200));
}
