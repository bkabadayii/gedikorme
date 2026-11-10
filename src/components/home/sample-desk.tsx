"use client";

import { useRef } from "react";

export type DeskCard = { name: string; colour: string; spec: string; sampleLabel: string; image: string };

/** Three ivory sample cards in real CSS perspective. They tilt toward the pointer
 *  and the hovered card lifts; reduced motion keeps them still. All swatches are
 *  representative colours, labelled as sample content. */
export function SampleDesk({ cards }: { cards: DeskCard[] }) {
  const root = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--rx", `${((e.clientY - r.top) / r.height - 0.5) * -7}deg`);
    el.style.setProperty("--ry", `${((e.clientX - r.left) / r.width - 0.5) * 9}deg`);
  };
  const onLeave = () => {
    root.current?.style.setProperty("--rx", "0deg");
    root.current?.style.setProperty("--ry", "0deg");
  };

  // Deliberately unequal: one large lead sample, a squarer mid sample, a tall narrow one.
  const placement = [
    "left-[0%] top-[8%] w-[52%] md:w-[54%] [--r:-2deg] [--rx0:12deg] [--ry0:-10deg]",
    "left-[40%] top-[56%] w-[46%] md:left-[42%] md:top-[40%] md:w-[34%] [--r:3deg] [--rx0:9deg] [--ry0:-7deg]",
    "left-[64%] top-[0%] w-[34%] md:left-[70%] md:w-[26%] [--r:5deg] [--rx0:14deg] [--ry0:-14deg]",
  ];
  const ratios = ["300 / 390", "1 / 1.08", "3 / 5"];

  return (
    <div className="relative">
      <div
        ref={root}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="desk relative w-full"
        style={{ aspectRatio: "var(--desk-ratio)" }}
      >
        {cards.map((c, i) => (
          <figure
            key={c.name}
            className={`desk-card absolute bg-card ${placement[i]}`}
            style={{ aspectRatio: ratios[i] }}
          >
            <div
              className="pinked absolute inset-x-[3.5%] top-[3%] bottom-[27%] sm:bottom-[22%]"
              style={{ backgroundColor: c.colour }}
            >
              {/* Illustrative placeholder render; swap the file for catalog photography. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/fabrics/${c.image}-sm.webp`}
                srcSet={`/fabrics/${c.image}-sm.webp 500w, /fabrics/${c.image}.webp 1000w`}
                sizes="(min-width: 768px) 24vw, 46vw"
                width={1000}
                height={1300}
                alt=""
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="absolute inset-x-[5%] bottom-[4%] leading-tight">
              <span className="block font-display text-[0.72rem] leading-tight sm:text-base">{c.name}</span>
              <span className="label mt-1 block !text-[0.55rem] !tracking-[0.16em] text-ink/80 sm:!text-[0.6rem]">{c.sampleLabel}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
