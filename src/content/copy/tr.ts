const trCopy = {
  meta: {
    siteName: "Gedik Örme",
    description: "Gedik Örme, 1997'den beri örme kumaş üretiminde. Örme, boya ve apre.",
  },
  nav: {
    fabrics: "Kumaşlar",
    production: "Üretim",
    about: "Hakkımızda",
    contact: "İletişim",
    quote: "Teklif İste",
    language: "Dil",
  },
  home: {
    title: "Gedik Örme",
    lead: "Örme kumaş üreticisi. Örme, boya ve apre.",
    explore: "Kumaşları İncele",
    quote: "Teklif İste",
  },
  pages: {
    fabrics: "Kumaşlar",
    production: "Üretim",
    about: "Hakkımızda",
    contact: "İletişim",
    requestQuote: "Teklif İste",
    soon: "Bu sayfa hazırlanıyor.",
  },
} as const;

type Widen<T> = { -readonly [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };

export type Copy = Widen<typeof trCopy>;
export const tr: Copy = trCopy;
