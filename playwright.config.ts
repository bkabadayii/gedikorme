import { defineConfig, devices } from "@playwright/test";

const port = 3001;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL: `http://localhost:${port}`, trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-375", use: { ...devices["Desktop Chrome"], viewport: { width: 375, height: 800 }, hasTouch: true } },
  ],
  webServer: {
    command: `npm run dev:vinext -- --port ${port}`,
    url: `http://localhost:${port}/en`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    // No Turnstile key: the form submits without a token, and /api/inquiry is mocked per test.
    env: { TURNSTILE_SITE_KEY: "", TURNSTILE_SECRET_KEY: "", RESEND_API_KEY: "", INQUIRY_TO: "" },
  },
});
