import type { Metadata } from "next";
import { Manrope, Newsreader } from "next/font/google";
import { notFound } from "next/navigation";
import { getCopy } from "@/content/copy";
import { htmlLang, isLocale, locales } from "@/lib/i18n/config";
import { SiteHeader } from "@/components/layout/site-header";
import "../globals.css";

// Both families ship latin-ext, which carries ğ ü ş ı İ ö ç.
const display = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin", "latin-ext"],
});
const sans = Manrope({
  variable: "--font-manrope",
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
        <SiteHeader locale={locale} />
        <main>{children}</main>
      </body>
    </html>
  );
}
