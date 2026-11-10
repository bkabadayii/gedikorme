import { bindings, defineConfig, defineWorker } from "cf/config";

export default defineConfig({
  worker: defineWorker({
    name: "gedik-orme",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-11-09",
    compatibilityFlags: ["nodejs_compat"],
    // Serve on <name>.<subdomain>.workers.dev until the domain cutover is approved.
    workersDev: true,
    // Per-version URLs (<version>-<name>.<subdomain>.workers.dev) back PR previews.
    previewUrls: true,
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    env: {
      ASSETS: bindings.assets(),
      // RESEND_API_KEY, TURNSTILE_SECRET_KEY, TURNSTILE_SITE_KEY and INQUIRY_TO are deliberately
      // not declared: a declared secret is required at deploy time, and mail delivery waits for
      // Phase 5. Once set out-of-band (see DEPLOYMENT.md) they still reach `env` at runtime;
      // without them /api/inquiry answers 503 not_configured.
      // At most 5 inquiry submissions per minute per client IP.
      INQUIRY_LIMITER: bindings.rateLimit({ namespace: "7341", simple: { limit: 5, period: 60 } }),
    },
  }),
});
