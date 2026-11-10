/** Confirmed contact details used for tap-to-call and WhatsApp links. */
export const WHATSAPP_NUMBER = "905424187785"; // +90 542 418 77 85, confirmed as WhatsApp

/** wa.me link with a prefilled message. Fabric names and codes only; no personal data. */
export function whatsappHref(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
