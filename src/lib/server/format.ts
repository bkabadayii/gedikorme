import type { InquiryInput } from "@/lib/inquiry/validate";
import { CONSENT_VERSION } from "@/lib/inquiry/validate";

export type FabricRef = { id: string; code: string; name: string };

/** Short reference the visitor sees and the team can search for. */
export function makeRef(bytes: Uint8Array): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const pick = (i: number) => alphabet[bytes[i] % alphabet.length];
  return `GO-${[0, 1, 2, 3].map(pick).join("")}-${[4, 5, 6, 7].map(pick).join("")}`;
}

export function buildMail(input: InquiryInput, ref: string, fabrics: FabricRef[], now = new Date()) {
  const label = input.kind === "quote" ? "Teklif talebi" : "İletişim";
  const lines: string[] = [
    `Referans: ${ref}`,
    `Tür: ${label} (${input.locale.toUpperCase()})`,
    "",
    `Ad: ${input.name}`,
    `E-posta: ${input.email}`,
  ];
  if (input.company) lines.push(`Firma: ${input.company}`);
  if (input.phone) lines.push(`Telefon/WhatsApp: ${input.phone}`);
  if (input.country) lines.push(`Ülke: ${input.country}`);
  if (input.quantity) lines.push(`Tahmini miktar: ${input.quantity}${input.unit ? ` ${input.unit}` : ""}`);
  if (input.items.length) {
    lines.push("", "Seçilen kumaşlar:");
    for (const it of input.items) {
      const f = fabrics.find((x) => x.id === it.id);
      lines.push(`- ${f ? `${f.code} ${f.name}` : it.id}${it.note ? `: ${it.note}` : ""}`);
    }
  }
  if (input.message) lines.push("", "Mesaj:", input.message);
  lines.push("", `Onay: KVKK metni ${CONSENT_VERSION}, ${now.toISOString()}`);
  return {
    subject: `[Gedik Örme] ${label}: ${input.name.replace(/\s+/g, " ")} · ${ref}`,
    text: lines.join("\n"),
  };
}
