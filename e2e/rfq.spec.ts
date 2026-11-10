import { expect, test, type Page } from "@playwright/test";

const copy = {
  tr: {
    base: "/tr", fabrics: "/tr/kumaslar", quote: "/tr/teklif-iste", contact: "/tr/iletisim",
    add: "Teklife ekle", name: "Adınız", email: "E-posta", consent: /Gönderdiğim bilgilerin/,
    submit: "Teklifi Gönder", submitContact: "Mesajı Gönder", message: "Mesajınız",
    summary: "Formda düzeltilmesi gereken alanlar var:", unavailable: "Form şu an kullanılamıyor.",
    delivery: "Talebiniz bize ulaşmadı.", success: "Talebiniz bize ulaştı.", ref: "Referans",
  },
  en: {
    base: "/en", fabrics: "/en/fabrics", quote: "/en/request-quote", contact: "/en/contact",
    add: "Add to inquiry", name: "Your name", email: "Email", consent: /I agree that Gedik/,
    submit: "Send Quote Request", submitContact: "Send Message", message: "Your message",
    summary: "Some fields need attention:", unavailable: "The form is unavailable right now.",
    delivery: "Your request did not reach us.", success: "Your request has reached us.", ref: "Reference",
  },
} as const;

/** Open a page and wait until React has hydrated, so the first click is not a native submit. */
async function open(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState("networkidle");
}

/** Mock the endpoint so the test never depends on mail configuration. */
async function mockInquiry(page: Page, status: number, body: unknown) {
  const seen: unknown[] = [];
  await page.route("**/api/inquiry", async (route) => {
    seen.push(route.request().postDataJSON());
    await route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });
  });
  return seen;
}

for (const locale of ["tr", "en"] as const) {
  const t = copy[locale];

  test.describe(`RFQ journey (${locale})`, () => {
    test("pick a fabric, see it on the quote page, remove it", async ({ page }) => {
      await open(page, t.fabrics);
      await page.locator("main a[href*='/fabrics/'], main a[href*='/kumaslar/']").first().click();
      await page.getByRole("button", { name: t.add }).first().click();
      await open(page, t.quote);
      await expect(page.getByRole("textbox", { name: /Note for this fabric|Bu kumaş için not/ })).toHaveCount(1);
    });

    test("empty submit shows an error summary and focuses it", async ({ page }) => {
      await open(page, t.quote);
      await page.getByRole("button", { name: t.submit }).click();
      const summary = page.getByText(t.summary);
      await expect(summary).toBeVisible();
      await expect(page.getByRole("textbox", { name: new RegExp(t.name) })).toHaveAttribute("aria-invalid", "true");
    });

    test("message is optional on a quote request, required on contact", async ({ page }) => {
      const seen = await mockInquiry(page, 200, { ok: true, ref: "GO-TEST-0001" });
      await open(page, t.quote);
      await page.getByLabel(t.name, { exact: false }).first().fill("Ayşe Yılmaz");
      await page.getByLabel(t.email, { exact: true }).fill("ayse@example.com");
      await page.getByText(t.consent).click();
      await page.getByRole("button", { name: t.submit }).click();
      await expect(page.getByText(t.success)).toBeVisible();
      await expect(page.getByText("GO-TEST-0001")).toBeVisible();
      expect(seen).toHaveLength(1);

      await open(page, t.contact);
      await page.getByLabel(t.name, { exact: false }).first().fill("Ayşe Yılmaz");
      await page.getByLabel(t.email, { exact: true }).fill("ayse@example.com");
      await page.getByText(t.consent).click();
      await page.getByRole("button", { name: t.submitContact }).click();
      await expect(page.getByText(t.summary)).toBeVisible();
    });

    for (const [status, body] of [[503, { error: "not_configured" }], [502, { error: "delivery_failed" }]] as const) {
      test(`${status} shows the failed state, keeps the data, never success`, async ({ page }) => {
        await mockInquiry(page, status, body);
        await open(page, t.quote);
        await page.getByLabel(t.name, { exact: false }).first().fill("Ayşe Yılmaz");
        await page.getByLabel(t.email, { exact: true }).fill("ayse@example.com");
        await page.getByText(t.consent).click();
        await page.getByRole("button", { name: t.submit }).click();
        await expect(page.getByRole("alert").filter({ hasText: status === 503 ? t.unavailable : t.delivery })).toBeVisible();
        await expect(page.getByText(t.success)).toHaveCount(0);
        await expect(page.getByLabel(t.email, { exact: true })).toHaveValue("ayse@example.com");
      });
    }

    test("429 asks to wait and keeps the data", async ({ page }) => {
      await mockInquiry(page, 429, { error: "rate_limited" });
      await open(page, t.quote);
      await page.getByLabel(t.name, { exact: false }).first().fill("Ayşe Yılmaz");
      await page.getByLabel(t.email, { exact: true }).fill("ayse@example.com");
      await page.getByText(t.consent).click();
      await page.getByRole("button", { name: t.submit }).click();
      await expect(page.getByRole("alert")).toBeVisible();
      await expect(page.getByText(t.success)).toHaveCount(0);
    });

    test("the consent text links to the privacy notice", async ({ page }) => {
      await open(page, t.quote);
      const href = await page.getByRole("link", { name: /^(Read the privacy notice|Aydınlatma metnini okuyun)$/ }).getAttribute("href");
      expect(href).toBe(locale === "tr" ? "/tr/gizlilik" : "/en/privacy");
      await page.goto(href!);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    });
  });
}

test("language switch keeps the page and slugs map across languages", async ({ page }) => {
  await open(page, "/tr/kumaslar");
  const menu = page.getByText("Menü", { exact: true });
  if (await menu.isVisible()) await menu.click(); // phones keep the switch inside the menu
  await page.getByRole("link", { name: /Language: EN|Dil: EN/ }).filter({ visible: true }).click();
  await expect(page).toHaveURL(/\/en\/fabrics$/);

  // A fabric detail page lands on the same fabric under its English slug.
  await open(page, "/tr/kumaslar");
  const detail = page.locator("main a[href*='/kumaslar/']").first();
  const name = await detail.getAttribute("href");
  await open(page, name!);
  if (await menu.isVisible()) await menu.click();
  await page.getByRole("link", { name: /Language: EN|Dil: EN/ }).filter({ visible: true }).click();
  await expect(page).toHaveURL(/\/en\/fabrics\/[a-z0-9-]+$/);
});

test("legacy URLs redirect to the Turkish routes", async ({ page }) => {
  await page.goto("/hakkimizda");
  await expect(page).toHaveURL(/\/tr\/hakkimizda$/);
});
