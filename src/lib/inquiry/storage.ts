/** Pure helpers for the inquiry basket; the browser store wraps these. */
export const INQUIRY_KEY = "gedik.inquiry.v1";
export const INQUIRY_MAX = 50;

/** Reads a stored list defensively: bad JSON, wrong types and duplicates are dropped. */
export function parseIds(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return [];
    const out: string[] = [];
    for (const v of value) if (typeof v === "string" && !out.includes(v)) out.push(v);
    return out.slice(0, INQUIRY_MAX);
  } catch {
    return [];
  }
}

export const addId = (ids: readonly string[], id: string): string[] =>
  ids.includes(id) ? [...ids] : [...ids, id].slice(-INQUIRY_MAX);

export const removeId = (ids: readonly string[], id: string): string[] => ids.filter((x) => x !== id);
