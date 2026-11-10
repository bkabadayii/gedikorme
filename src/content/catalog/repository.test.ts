import { describe, expect, it } from "vitest";
import {
  availableSpecFilters, fold, getFabricBySlug, listCategories, listFabrics,
  relatedFabrics, searchFabrics,
} from "./repository";

describe("seed catalog", () => {
  it("has ten sample fabrics with unique ids, codes and slugs per locale", () => {
    const all = listFabrics();
    expect(all).toHaveLength(10);
    expect(new Set(all.map((f) => f.id)).size).toBe(10);
    expect(new Set(all.map((f) => f.code)).size).toBe(10);
    for (const l of ["tr", "en"] as const) expect(new Set(all.map((f) => f.slug[l])).size).toBe(10);
    expect(all.every((f) => f.status === "sample")).toBe(true);
  });

  it("references only existing categories and invents no specifications", () => {
    const ids = new Set(listCategories().map((c) => c.id));
    for (const f of listFabrics()) {
      expect(ids.has(f.categoryId)).toBe(true);
      expect(f.specifications).toBeUndefined();
    }
  });
});

describe("lookup and search", () => {
  it("finds a fabric by its localized slug only in that locale", () => {
    expect(getFabricBySlug("tr", "suprem")?.id).toBe("single-jersey");
    expect(getFabricBySlug("en", "single-jersey")?.id).toBe("single-jersey");
    expect(getFabricBySlug("tr", "single-jersey")).toBeUndefined();
  });

  it("folds Turkish letters so plain ASCII finds them", () => {
    expect(fold("Süprem İnterlok Kaşkorse")).toBe("suprem interlok kaskorse");
    expect(searchFabrics({ q: "suprem" }).map((f) => f.id)).toEqual(["single-jersey"]);
    expect(searchFabrics({ q: "INTERLOK" })[0]?.id).toBe("interlock");
  });

  it("searches codes and both languages", () => {
    expect(searchFabrics({ q: "demo-010" })[0]?.id).toBe("mesh-knit");
    expect(searchFabrics({ q: "mesh" })[0]?.id).toBe("mesh-knit");
    expect(searchFabrics({ q: "polo" })[0]?.id).toBe("pique-knit");
  });

  it("filters by category and combines it with search", () => {
    expect(searchFabrics({ category: "fleece" })).toHaveLength(2);
    expect(searchFabrics({ category: "fleece", q: "uc" })).toHaveLength(1);
    expect(searchFabrics({ q: "nothing-matches-this" })).toEqual([]);
  });
});

describe("related and filters", () => {
  it("puts the same category first and never returns the fabric itself", () => {
    const rib = getFabricBySlug("en", "rib-knit")!;
    const rel = relatedFabrics(rib, 3);
    expect(rel).toHaveLength(3);
    expect(rel.some((f) => f.id === rib.id)).toBe(false);
    expect(rel.slice(0, 2).every((f) => f.categoryId === "rib")).toBe(true);
  });

  it("offers no spec filters while no fabric has spec data", () => {
    expect(availableSpecFilters()).toEqual({ composition: false, gsm: false, application: false });
  });
});
