import type { Metadata } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";
import { notFound } from "next/navigation";
import { getCopy } from "@/content/copy";
import { htmlLang, isLocale, locales } from "@/lib/i18n/config";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { ClothBackground } from "@/components/ui/cloth-background";
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
  return {
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

  return (
    <html lang={htmlLang[locale]} className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-screen antialiased">
        <ClothBackground />
        <SiteHeader locale={locale} />
        <main>{children}</main>
        <SiteFooter locale={locale} />
      </body>
    </html>
  );
}
