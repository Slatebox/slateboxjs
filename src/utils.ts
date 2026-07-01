/**
 * utils.ts - Utility functions matching v1 Slatebox.utils
 *
 * Provides all utility functions used by the app.
 */

import { pathBBox, transformPath } from "./vendor/raphael-path";

/** Generate a unique ID string */
export function guid(length: number = 10): string {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Determine whether white or black text has better contrast against the
 * given background color. Uses the v1 WCAG relative-luminance contrast
 * algorithm so drop-in results match the original library exactly.
 */
export function whiteOrBlack(hexColor: string): "#ffffff" | "#000000" {
  function getRGB(c: string): number {
    return parseInt(c, 16) || 0;
  }
  function getsRGB(c: string): number {
    const v = getRGB(c) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  }
  function getLuminance(hex: string): number {
    return (
      0.2126 * getsRGB(hex.substr(1, 2)) +
      0.7152 * getsRGB(hex.substr(3, 2)) +
      0.0722 * getsRGB(hex.substr(-2))
    );
  }
  function getContrast(f: string, b: string): number {
    const L1 = getLuminance(f);
    const L2 = getLuminance(b);
    return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
  }
  const whiteContrast = getContrast(hexColor || "#fff", "#ffffff");
  const blackContrast = getContrast(hexColor || "#fff", "#000000");
  return whiteContrast > blackContrast ? "#ffffff" : "#000000";
}

/**
 * Measure text dimensions — v1 contract: font string is
 * `"<style> <size>pt <family>"` and the result is `{width, height}`
 * (multi-line aware; height accumulates per line).
 */
export function getTextWidth(
  text: string,
  font: string = "normal 10pt Arial"
): { width: number; height: number } {
  const splitText = String(text).split("\n");
  const fontSplit = font.split(" ");
  const fontWeight = "normal";
  const fontSize = fontSplit?.[0]?.includes("pt")
    ? parseFloat(fontSplit?.[0]?.replace(/pt/gi, ""))
    : 10;
  const fontFamily = fontSplit?.slice(1).join(" ").trim();

  if (typeof document === "undefined") {
    return {
      width: Math.max(...splitText.map((t) => t.length)) * fontSize * 0.6,
      height: splitText.length * fontSize * 1.4 + 10,
    };
  }

  const textWidthCanvas = document.createElement("canvas");
  const metrics: TextMetrics[] = [];
  const multiplier = 0.98;
  splitText.forEach((t) => {
    const context = textWidthCanvas.getContext("2d");
    if (!context) return;
    const calculatedFontSize = fontSize * multiplier;
    context.font = `${fontWeight} ${calculatedFontSize}pt ${fontFamily}`;
    metrics.push(context.measureText(t));
  });
  textWidthCanvas.remove();

  if (metrics.length === 0) {
    return {
      width: Math.max(...splitText.map((t) => t.length)) * fontSize * 0.6,
      height: splitText.length * fontSize * 1.4 + 10,
    };
  }

  let height = 0;
  metrics.forEach((m) => {
    height +=
      ((m as any).actualBoundingBoxAscent || fontSize) +
      ((m as any).actualBoundingBoxDescent || fontSize * 0.3) +
      5;
  });
  return {
    width: Math.max(...metrics.map((m) => m.width)),
    height: height + 10,
  };
}

/**
 * Get the bounding box of an SVG path string — v1 contract: Raphael-style
 * bbox `{x, y, x2, y2, width, height, cx, cy}` computed analytically
 * (curves included), no DOM required.
 */
export function getBBox(opts: { path: string }): {
  x: number;
  y: number;
  x2: number;
  y2: number;
  width: number;
  height: number;
  cx: number;
  cy: number;
} {
  if (!opts?.path) {
    return { x: 0, y: 0, x2: 100, y2: 100, width: 100, height: 100, cx: 50, cy: 50 };
  }
  return pathBBox(opts.path);
}

/**
 * v1: `Slatebox.utils._transformPath(path, transform)` — apply a Raphael
 * transform string (`t/T`, `s/S`, `r/R`, `m/M`) to a path, returning the
 * curve-ified transformed path string. Scale/rotate without explicit
 * centers pivot on the path's bounding-box center, exactly like Raphael.
 */
export function _transformPath(path: string, transform: string): string {
  return transformPath(path, transform);
}

/**
 * Create multi-line text by wrapping at a given number of lines.
 */
export function createMultiLineText(text: string, lineCount: number): string {
  const words = String(text).split(/ /g);
  const chars = String(text).split("");
  const charsPerLine = chars.length / lineCount;
  const lines: string[] = [];
  let wordsOnLine: string[] = [];
  let curCharCount = 0;
  words.forEach((w) => {
    curCharCount += w.length;
    if (curCharCount < charsPerLine || lines.length === lineCount - 1) {
      wordsOnLine.push(w);
    } else {
      lines.push(wordsOnLine.join(" "));
      curCharCount = w.length;
      wordsOnLine = [w];
    }
  });
  if (wordsOnLine.length > 0) {
    lines.push(wordsOnLine.join(" "));
  }
  return lines.join("\n");
}

/** Generate random integer between min and max (inclusive) */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Calculate proportionate width and height for resizing,
 * preserving aspect ratio.
 */
export function obtainProportionateWidthAndHeightForResizing(
  originalWidth: number,
  originalHeight: number,
  targetWidth: number,
  targetHeight: number,
  preserveAspectRatio: boolean = true
): { width: number; height: number } {
  if (!preserveAspectRatio) {
    return { width: targetWidth, height: targetHeight };
  }

  const ratio = Math.min(
    targetWidth / originalWidth,
    targetHeight / originalHeight
  );

  return {
    width: originalWidth * ratio,
    height: originalHeight * ratio,
  };
}

/**
 * Build node style from a theme definition.
 */
export function buildNodeStyleFromTheme(opts: {
  theme: any;
  childNumber: number;
}): any {
  // Re-export from Theme.ts for backwards compatibility
  const { buildNodeStyleFromTheme: build } = require("./core/Theme");
  return build(opts.theme, opts.childNumber);
}

/** Make a string safe for use in URLs */
export function safeForUrls(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

/** Check if value is a DOM element */
export function isElement(obj: any): boolean {
  return obj instanceof HTMLElement || obj instanceof SVGElement;
}

/** Shorthand for document.getElementById */
export function el(id: string): HTMLElement | null {
  if (typeof document === "undefined") return null;
  return document.getElementById(id);
}

/** Detect Safari browser */
export function isSafari(): boolean {
  if (typeof navigator === "undefined") return false;
  return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

/** Detect mobile device */
export function isMobile(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/** Stop event propagation and prevent default */
export function stopEvent(evt: Event): void {
  if (evt) {
    evt.preventDefault();
    evt.stopPropagation();
  }
}

/** Split an array into chunks of a given size */
export function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}
