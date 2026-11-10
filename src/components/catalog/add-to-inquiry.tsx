"use client";

import { useRouter } from "next/navigation";
import { useInquiry } from "@/lib/inquiry/store";

export type AddCopy = { add: string; added: string; requestInfo: string };

const primary = "label inline-block bg-ink px-6 py-4 text-card transition-colors duration-200 hover:bg-brass";
const outline = "label inline-block border border-ink px-6 py-4 text-ink transition-colors duration-200 hover:border-brass hover:text-brass";
const text = "label inline-block border-b border-brass-line pb-1.5 transition-colors duration-200 hover:text-brass";

/** Toggle for the inquiry basket. `compact` is the catalog-card text style. */
export function AddToInquiry({
  id,
  copy,
  compact = false,
}: {
  id: string;
  copy: AddCopy;
  compact?: boolean;
}) {
  const { has, add, remove } = useInquiry();
  const inBasket = has(id);
  return (
    <button
      type="button"
      onClick={() => (inBasket ? remove(id) : add(id))}
      aria-pressed={inBasket}
      className={compact ? text : inBasket ? outline : primary}
    >
      {inBasket ? copy.added : copy.add}
    </button>
  );
}

/** Adds the fabric, then opens the quote page where the selection is listed. */
export function RequestInfo({ id, href, copy }: { id: string; href: string; copy: AddCopy }) {
  const { add } = useInquiry();
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => { add(id); router.push(href); }}
      className={text}
    >
      {copy.requestInfo}
    </button>
  );
}
