import type { Fabric } from "@/content/catalog/types";

const knit = new Set(["jersey", "interlock"]);

/** Procedural stand-in for fabric photography: a pinked swatch in the fabric's colour. */
export function FabricSwatch({
  fabric,
  label,
  className = "",
  pinked = true,
}: {
  fabric: Fabric;
  label: string;
  className?: string;
  pinked?: boolean;
}) {
  const { texture, colour } = fabric.swatch;
  return (
    <div
      role="img"
      aria-label={label}
      className={`tex tex-${texture} ${knit.has(texture) ? "knit-swatch" : ""} ${pinked ? "pinked" : ""} ${className}`}
      style={{ backgroundColor: colour }}
    />
  );
}
