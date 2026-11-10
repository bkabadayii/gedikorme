"use client";

import Link from "next/link";
import { useInquiry } from "@/lib/inquiry/store";

/** Header link to the quote page, with the basket count once something is selected. */
export function QuoteLink({ href, label, className }: { href: string; label: string; className: string }) {
  const { ids } = useInquiry();
  return (
    <Link href={href} className={className}>
      {label}
      {ids.length > 0 && (
        <span className="ml-2 font-display text-base normal-case italic tracking-normal text-brass" aria-label={`${ids.length}`}>
          ({ids.length})
        </span>
      )}
    </Link>
  );
}
