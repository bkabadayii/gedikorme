/** Rate limiter binding shape (Workers Rate Limiting). */
export type RateLimiter = { limit(options: { key: string }): Promise<{ success: boolean }> };

export type ServerEnv = {
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  TURNSTILE_SITE_KEY?: string;
  /** Recipient of every inquiry. A secret: never written to the repo. */
  INQUIRY_TO?: string;
  /** Optional overrides, mainly for tests and local runs. */
  INQUIRY_FROM?: string;
  RESEND_API_BASE?: string;
  INQUIRY_LIMITER?: RateLimiter;
};

const KEYS = [
  "RESEND_API_KEY", "TURNSTILE_SECRET_KEY", "TURNSTILE_SITE_KEY",
  "INQUIRY_TO", "INQUIRY_FROM", "RESEND_API_BASE",
] as const;

/**
 * Bindings on the Workers runtime (`cloudflare:workers`), process.env under
 * `next dev`. The specifier is a variable so bundlers leave it for workerd.
 */
export async function getServerEnv(): Promise<ServerEnv> {
  const out: ServerEnv = {};
  for (const k of KEYS) {
    const v = process.env[k];
    if (v) out[k] = v;
  }
  try {
    const specifier = "cloudflare:workers";
    const mod = (await import(/* @vite-ignore */ /* webpackIgnore: true */ /* turbopackIgnore: true */ specifier)) as {
      env?: ServerEnv;
    };
    if (mod.env) {
      for (const k of KEYS) if (typeof mod.env[k] === "string" && mod.env[k]) out[k] = mod.env[k];
      if (mod.env.INQUIRY_LIMITER) out.INQUIRY_LIMITER = mod.env.INQUIRY_LIMITER;
    }
  } catch {
    /* not on Workers: process.env only */
  }
  return out;
}
