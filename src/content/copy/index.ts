import type { Locale } from "@/lib/i18n/config";
import { en } from "./en";
import { tr, type Copy } from "./tr";

const dictionaries: Record<Locale, Copy> = { tr, en };

export function getCopy(locale: Locale): Copy {
  return dictionaries[locale];
}
