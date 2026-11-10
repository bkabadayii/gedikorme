import type { Metadata } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getCopy } from "@/content/copy";
import { htmlLang, isLocale, locales } from "@/lib/i18n/config";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ClothBackground } from "@/components/ui/cloth-background";
import { INDEXABLE_HOSTS, SITE_URL } from "@/lib/seo";
import "../globals.css";

// Both families ship latin-ext, which carries ğ ü ş ı İ ö ç.
const display = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
});
const sans = Jost({
  variable: "--font-jost",
  subsets: ["latin", "latin-ext"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = getCopy(locale);
  // workers.dev and preview hosts must not be indexed; only the production hostname is.
  const host = ((await headers()).get("host") ?? "").toLowerCase().replace(/:\d+$/, "");
  const indexable = (INDEXABLE_HOSTS as readonly string[]).includes(host);
  return {
    metadataBase: new URL(SITE_URL),
    ...(indexable ? {} : { robots: { index: false, follow: false } }),
    title: { default: copy.meta.siteName, template: `%s · ${copy.meta.siteName}` },
    description: copy.meta.description,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const f = getCopy(locale).footer;
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Gedik Örme",
    url: SITE_URL,
    logo: `${SITE_URL}/brand/logo.png`,
    foundingDate: "1997",
    telephone: f.phone,
    email: f.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Telsiz, Dursun Kılıç Cd No:38",
      postalCode: "34020",
      addressLocality: "Zeytinburnu",
      addressRegion: "İstanbul",
      addressCountry: "TR",
    },
  };

  return (
    <html lang={htmlLang[locale]} className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-screen antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }} />
        <ClothBackground />
        <SiteHeader locale={locale} />
        <main>{children}</main>
        <SiteFooter locale={locale} />
      </body>
    </html>
  );
}
