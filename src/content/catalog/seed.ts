import type { Category, Fabric } from "./types";

/**
 * Sample catalog (docs/plan.md §6). Representative knitted-fabric types only:
 * NOT verified as produced or sold by Gedik Örme. No specifications are set on
 * purpose; the detail page shows "Bilgi için ulaşın" for every missing value.
 * Swap this file (or the repository's source) for the real catalog later.
 */
export const categories: Category[] = [
  { id: "jersey", name: { tr: "Süprem", en: "Jersey" } },
  { id: "rib", name: { tr: "Ribana ve kaşkorse", en: "Rib knits" } },
  { id: "interlock", name: { tr: "İnterlok", en: "Interlock" } },
  { id: "fleece", name: { tr: "Şardonlu", en: "Fleece" } },
  { id: "textured", name: { tr: "Dokulu ve desenli", en: "Textured and patterned" } },
  { id: "open", name: { tr: "Açık yapılı", en: "Open structures" } },
];

export const fabrics: Fabric[] = [
  {
    id: "single-jersey", code: "DEMO-001", status: "sample", featured: true,
    slug: { tr: "suprem", en: "single-jersey" },
    name: { tr: "Süprem", en: "Single Jersey" },
    summary: {
      tr: "Günlük giyimde sık kullanılan, çok yönlü tek yüzlü örme.",
      en: "A versatile single-knit structure often used in casual clothing.",
    },
    categoryId: "jersey", swatch: { texture: "jersey", colour: "#b9987f" },
    searchKeywords: { tr: ["tişört", "penye"], en: ["t-shirt", "jersey"] },
  },
  {
    id: "rib-knit", code: "DEMO-002", status: "sample", featured: true,
    slug: { tr: "ribana", en: "rib-knit" },
    name: { tr: "Ribana", en: "Rib Knit" },
    summary: {
      tr: "Esneme ve toparlanma özelliğiyle bilinen çizgili örme.",
      en: "A ribbed knit with stretch and recovery characteristics.",
    },
    categoryId: "rib", swatch: { texture: "rib", colour: "#6c7f6a" },
    searchKeywords: { tr: ["yaka", "bilek"], en: ["cuff", "collar"] },
  },
  {
    id: "interlock", code: "DEMO-003", status: "sample", featured: true,
    slug: { tr: "interlok", en: "interlock" },
    name: { tr: "İnterlok", en: "Interlock" },
    summary: {
      tr: "İki yüzü de düzgün, yumuşak tutumlu çift katlı örme.",
      en: "A double-knit construction with a smooth hand feel.",
    },
    categoryId: "interlock", swatch: { texture: "interlock", colour: "#c3b2a2" },
  },
  {
    id: "two-thread-fleece", code: "DEMO-004", status: "sample",
    slug: { tr: "iki-iplik", en: "two-thread-fleece" },
    name: { tr: "İki İplik", en: "Two-Thread Fleece" },
    summary: {
      tr: "Hafif sweatshirt kumaşlarıyla anılan şardonlu örme.",
      en: "A knit associated with lightweight sweatwear.",
    },
    categoryId: "fleece", swatch: { texture: "fleece", colour: "#3d4a5c" },
    searchKeywords: { tr: ["sweatshirt", "şardon"], en: ["sweatshirt", "brushed"] },
  },
  {
    id: "three-thread-fleece", code: "DEMO-005", status: "sample",
    slug: { tr: "uc-iplik", en: "three-thread-fleece" },
    name: { tr: "Üç İplik", en: "Three-Thread Fleece" },
    summary: {
      tr: "Daha dolgun, sweatshirt odaklı örme yapı.",
      en: "A heavier, sweatwear-oriented knit construction.",
    },
    categoryId: "fleece", swatch: { texture: "fleece", colour: "#a8574f" },
    searchKeywords: { tr: ["sweatshirt", "şardon"], en: ["sweatshirt", "brushed"] },
  },
  {
    id: "pique-knit", code: "DEMO-006", status: "sample",
    slug: { tr: "pike", en: "pique-knit" },
    name: { tr: "Pike", en: "Piqué Knit" },
    summary: {
      tr: "Polo tipi giyimde yaygın, dokulu yüzeyli örme.",
      en: "A textured knit commonly used in polo-style clothing.",
    },
    categoryId: "textured", swatch: { texture: "pique", colour: "#2f3a4a" },
    searchKeywords: { tr: ["polo"], en: ["polo"] },
  },
  {
    id: "fine-rib-knit", code: "DEMO-007", status: "sample",
    slug: { tr: "kaskorse", en: "fine-rib-knit" },
    name: { tr: "Kaşkorse", en: "Fine Rib Knit" },
    summary: {
      tr: "Vücuda oturan giyimde sık görülen ince ribana dokusu.",
      en: "A fine rib texture often used in fitted apparel.",
    },
    categoryId: "rib", swatch: { texture: "fine-rib", colour: "#9aa59b" },
  },
  {
    id: "ottoman-rib-knit", code: "DEMO-008", status: "sample",
    slug: { tr: "selanik", en: "ottoman-rib-knit" },
    name: { tr: "Selanik", en: "Milano / Ottoman Rib Knit" },
    summary: {
      tr: "Belirgin dokulu, kalın çizgili örme.",
      en: "A knit with a pronounced, ridged texture.",
    },
    categoryId: "rib", swatch: { texture: "ottoman", colour: "#7a3b45" },
  },
  {
    id: "jacquard-knit", code: "DEMO-009", status: "sample",
    slug: { tr: "jakarli-orme", en: "jacquard-knit" },
    name: { tr: "Jakarlı Örme", en: "Jacquard Knit" },
    summary: {
      tr: "Deseni örgü yapısıyla oluşturulan örme.",
      en: "A patterned knit formed through the knitting structure.",
    },
    categoryId: "textured", swatch: { texture: "jacquard", colour: "#46576b" },
    searchKeywords: { tr: ["desen", "jakar"], en: ["pattern"] },
  },
  {
    id: "mesh-knit", code: "DEMO-010", status: "sample",
    slug: { tr: "file-orme", en: "mesh-knit" },
    name: { tr: "File Örme", en: "Mesh Knit" },
    summary: {
      tr: "Nefes alan kullanımlarda sık görülen açık yapılı örme.",
      en: "An open construction often used for breathable applications.",
    },
    categoryId: "open", swatch: { texture: "mesh", colour: "#c9bfae" },
    searchKeywords: { tr: ["file", "spor"], en: ["sport", "breathable"] },
  },
];
