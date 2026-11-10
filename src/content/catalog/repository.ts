import type { Locale } from "@/lib/i18n/config";
import { categories as seedCategories, fabrics as seedFabrics } from "./seed";
import type { Category, Fabric } from "./types";

/**
 * The only door to catalog data. Pages never import the seed directly, so the
 * real catalog can replace it by changing the two source constants below.
 */
const fabrics: readonly Fabric[] = seedFabrics;
const categories: readonly Category[] = seedCategories;

export const listFabrics = (): readonly Fabric[] => fabrics;
export const listCategories = (): readonly Category[] => categories;
export const getFabric = (id: string) => fabrics.find((f) => f.id === id);
export const getFabricBySlug = (locale: Locale, slug: string) =>
  fabrics.find((f) => f.slug[locale] === slug);
export const getCategory = (id: string) => categories.find((c) => c.id === id);

/** Lowercase, accent-insensitive (ı/İ, ş, ğ, ü, ö, ç) so "suprem" finds "Süprem". */
export function fold(value: string): string {
  return value
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export type CatalogQuery = { q?: string; category?: string };

/** Search matches code, names, summaries and keywords in both languages. */
export function searchFabrics({ q, category }: CatalogQuery): Fabric[] {
  const needle = fold((q ?? "").trim());
  return fabrics.filter((f) => {
    if (category && f.categoryId !== category) return false;
    if (!needle) return true;
    const hay = fold(
      [
        f.code, f.name.tr, f.name.en, f.summary.tr, f.summary.en,
        ...(f.searchKeywords?.tr ?? []), ...(f.searchKeywords?.en ?? []),
      ].join(" "),
    );
    return hay.includes(needle);
  });
}

/** Same category first, then the rest in catalog order; never the fabric itself. */
export function relatedFabrics(fabric: Fabric, count = 3): Fabric[] {
  const others = fabrics.filter((f) => f.id !== fabric.id);
  const same = others.filter((f) => f.categoryId === fabric.categoryId);
  const rest = others.filter((f) => f.categoryId !== fabric.categoryId);
  return [...same, ...rest].slice(0, count);
}

/**
 * Spec filters exist only where at least one fabric has the data, so the UI
 * never shows an empty or inaccurate control (plan §5, catalog).
 */
export function availableSpecFilters() {
  const has = (pick: (f: Fabric) => unknown) => fabrics.some((f) => pick(f) !== undefined);
  return {
    composition: has((f) => f.specifications?.composition),
    gsm: has((f) => f.specifications?.gsm),
    application: has((f) => f.specifications?.applications),
  };
}
