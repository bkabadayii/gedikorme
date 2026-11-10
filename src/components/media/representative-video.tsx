"use client";

import { useEffect, useRef } from "react";

/** Muted looping clip that plays only while on screen and never under reduced
 *  motion (poster stays). Every use sits beside a visible "representative" label;
 *  the clips are stock footage, not Gedik Örme's own. See docs/media-manifest.md. */
export function RepresentativeVideo({
  src,
  poster,
  alt,
  className = "",
}: {
  src: string;
  poster: string;
  alt: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className={`block h-full w-full object-cover ${className}`}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={alt}
    />
  );
}
