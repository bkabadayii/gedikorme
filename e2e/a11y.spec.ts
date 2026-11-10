import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { listFabrics } from "../src/content/catalog/repository";

const paths = [
  "/tr", "/en", "/tr/kumaslar", "/en/fabrics", "/tr/uretim", "/en/production", "/tr/hakkimizda", "/en/about",
  "/tr/iletisim", "/en/contact", "/tr/teklif-iste", "/en/request-quote", "/tr/gizlilik", "/en/privacy",
  `/tr/kumaslar/${listFabrics()[0].slug.tr}`, `/en/fabrics/${listFabrics()[0].slug.en}`,
];

for (const path of paths) {
  test(`axe: ${path}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(
      violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length}) ${v.nodes[0]?.target.join(" ")}`),
    ).toEqual([]);
  });
}
