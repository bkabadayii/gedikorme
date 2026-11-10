import type { Locale } from "@/lib/i18n/config";

export type ContentStatus = "sample" | "draft" | "verified";

/** Procedural swatch textures (see `.tex-*` in globals.css). */
export type Texture =
  | "jersey" | "rib" | "interlock" | "fleece" | "pique"
  | "fine-rib" | "ottoman" | "jacquard" | "mesh";

export type Localized = Record<Locale, string>;

export type Category = { id: string; name: Localized };

export type Specifications = {
  composition?: Array<{ fiber: string; percent: number }>;
  gsm?: { min?: number; max?: number };
  widthCm?: { min?: number; max?: number };
  finishes?: string[];
  applications?: string[];
  colors?: string[];
  moq?: { value: number; unit: string };
};

export type Fabric = {
  /** Stable, never language-dependent. */
  id: string;
  /** Demo code, or the confirmed SKU once real data replaces the seed. */
  code: string;
  status: ContentStatus;
  slug: Localized;
  name: Localized;
  summary: Localized;
  categoryId: string;
  /** Procedural stand-in shown until photography exists. */
  swatch: { texture: Texture; colour: string };
  /** Real photography; empty while the catalog is sample data. */
  imageAssets?: Array<{ src: string; alt: Localized; isRepresentative: boolean }>;
  /** Unknown stays undefined, never zero. */
  specifications?: Specifications;
  searchKeywords?: Record<Locale, string[]>;
  featured?: boolean;
};
