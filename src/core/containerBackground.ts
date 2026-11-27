/**
 * The CSS a slate's containerStyle paints on its container: a color, a gradient (two or more
 * stops, linear at an angle or radial) or a picture (cover, contain or tiled, with the color laid
 * over it by `backgroundDim` so notes on it stay readable). One answer for the canvas
 * (Slate.applyContainerStyle) and any host that paints the same background around it.
 */
export interface ContainerBackground {
  image: string;
  size: string;
  repeat: string;
  position: string;
}

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
const DIM_MAX = 0.8;

/** A CSS url() for any stored address: quoted, with the characters that could end it escaped. */
export function cssUrl(url: string): string {
  return `url("${url.replace(/[\\"\n\r\f]/g, (c) => `\\${c.charCodeAt(0).toString(16)} `)}")`;
}

/** The color as rgba() at `alpha`; black when it is not a hex color. */
function veil(color: unknown, alpha: number): string {
  const hex = typeof color === "string" && HEX.test(color.trim()) ? color.trim().slice(1) : "000000";
  const full = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${Math.round(alpha * 100) / 100})`;
}

export function containerBackground(cs: Record<string, any> | undefined | null): ContainerBackground {
  const none = { image: "", size: "", repeat: "", position: "" };
  if (!cs) return none;
  const stops = Array.isArray(cs.backgroundGradientColors) ? cs.backgroundGradientColors.filter((c: unknown) => typeof c === "string" && c) : [];
  if (cs.backgroundColorAsGradient && stops.length > 1) {
    const colors = stops.join(", ");
    if (cs.backgroundGradientType === "radial") return { ...none, image: `radial-gradient(circle, ${colors})` };
    const angle = Number(cs.backgroundGradientAngle);
    // A gradient saved without an angle runs top to bottom, as it always has.
    const image = Number.isFinite(angle) && cs.backgroundGradientAngle !== null && cs.backgroundGradientAngle !== undefined
      ? `linear-gradient(${Math.round(((angle % 360) + 360) % 360)}deg, ${colors})`
      : `linear-gradient(${colors})`;
    return { ...none, image };
  }
  if (typeof cs.backgroundImage === "string" && cs.backgroundImage && cs.backgroundImage !== "none") {
    const fit = cs.backgroundSize === "contain" || cs.backgroundSize === "repeat" ? cs.backgroundSize : "cover";
    const dim = Math.min(Math.max(Number(cs.backgroundDim) || 0, 0), DIM_MAX);
    const picture = {
      image: cssUrl(cs.backgroundImage),
      size: fit === "repeat" ? "auto" : fit,
      repeat: fit === "repeat" ? "repeat" : "no-repeat",
      position: "center",
    };
    if (!dim) return picture;
    const over = veil(cs.backgroundColor, dim);
    return {
      image: `linear-gradient(${over}, ${over}), ${picture.image}`,
      size: `100% 100%, ${picture.size}`,
      repeat: `no-repeat, ${picture.repeat}`,
      position: `center, ${picture.position}`,
    };
  }
  return none;
}
