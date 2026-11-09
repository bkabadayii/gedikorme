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
    menu: "Menü",
    primary: "Ana menü",
    close: "Kapat",
    language: "Dil",
  },
  home: {
    title: "Her kumaşın ardında bir uzmanlık var.",
    titleEmphasis: "uzmanlık",
    lead: "Zeytinburnu'ndan örme, boyama ve apre. Numuneleri masada inceleyin, teklifinizi doğrudan ekibe iletin.",
    explore: "Kumaşları Keşfet",
    contact: "Bizimle İletişime Geç",
    identity: "EST. 1997 · İSTANBUL, TÜRKİYE · ÖRME · BOYAMA · APRE",
    sampleLabel: "TEMSİLİ ÖRNEK",
    quote: "Teklif İste",
    sampleNote: "Örnek katalog: adlar ve renkler temsilidir; Gedik Örme ürünü olarak doğrulanmamıştır.",
    unknown: "Bilgi için ulaşın",
    desk: [
      { name: "Ribana · Adaçayı", colour: "#9aa59b", spec: "İçerik: bilgi için ulaşın" },
      { name: "İnterlok · Kiremit", colour: "#a8574f", spec: "Gramaj: bilgi için ulaşın" },
      { name: "Süprem · Lacivert", colour: "#2f3a4a", spec: "En: bilgi için ulaşın" },
    ],
    categoriesTitle: "Kumaşlara göz atın",
    categoriesLead: "Katalog hazırlanırken örnek kategoriler.",
    categories: [
      { name: "Süprem", note: "Düz, yumuşak yüzeyli örme.", colour: "#b9987f" },
      { name: "Ribana", note: "Esnek, çizgili yapı.", colour: "#6c7f6a" },
      { name: "İnterlok", note: "İki yüzü de düzgün, dolgun örme.", colour: "#c3b2a2" },
      { name: "Polar", note: "Tüylü, sıcak tutan yüzey.", colour: "#3d4a5c" },
    ],
    categoriesCta: "Tüm kumaşlar",
    processTitle: "Üretim, üç adımda",
    processLead: "Kumaşın ilmekten sevkiyata yolu. Ayrıntılar Üretim sayfasında doğrulandıkça eklenecek.",
    process: [
      { name: "Örme", note: "İplik, örme makinesinde kumaşa dönüşür." },
      { name: "Boyama", note: "Kumaş, istenen renge boyanır." },
      { name: "Apre", note: "Son işlemle kumaşa istenen tutum verilir." },
    ],
    processCta: "Üretimi inceleyin",
    storyTitle: "Zeytinburnu'ndan, örme kumaş.",
    storyBody: "Gedik Örme, Zeytinburnu'nda örme kumaş üretir. Ekibimizle konuşarak aradığınız kumaşı birlikte netleştirebilirsiniz.",
    storyNote: "Kuruluş yılı ve adresler sahibiyle teyit edilecektir.",
    storyCta: "Hakkımızda",
    inquiryTitle: "Aradığınız kumaşı anlatın.",
    inquiryBody: "Kumaşları seçerek ya da yalnızca ihtiyacınızı yazarak teklif isteyin. WhatsApp, e-posta ve telefon da açık.",
    inquiryCta: "Teklif İste",
    contactCta: "İletişime Geç",
  },
  footer: {
    tagline: "Örme kumaş üreticisi. Örme, boyama, apre.",
    address: "Telsiz Mah., Karanfil Sok. No:26, Zeytinburnu, İstanbul",
    addressNote: "Adres ve iletişim bilgileri yayın öncesi teyit edilecek.",
    navTitle: "Sayfalar",
    contactTitle: "İletişim",
    phone: "+90 541 833 43 28",
    email: "info@gedikorme.com",
    rights: "Tüm hakları saklıdır.",
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

type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Widen<U>[]
    : { -readonly [K in keyof T]: Widen<T[K]> };

export type Copy = Widen<typeof trCopy>;
export const tr: Copy = trCopy;
