/**
 * utils.ts - Utility functions matching v1 Slatebox.utils
 *
 * Provides all utility functions used by the app.
 */

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
 * Determine whether white or black text has better contrast
 * against the given background color.
 */
export function whiteOrBlack(hexColor: string): "#ffffff" | "#000000" {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // YIQ formula
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "#000000" : "#ffffff";
}

/**
 * Measure the width of text in pixels.
 * Creates a temporary span to measure.
 */
export function getTextWidth(
  text: string,
  fontStr: string = "14px Arial"
): number {
  if (typeof document === "undefined") return text.length * 7;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return text.length * 7;

  ctx.font = fontStr;
  return ctx.measureText(text).width;
}

/**
 * Get bounding box from an SVG path string.
 * Simple approximation based on path commands.
 */
export function getBBox(opts: {
  path: string;
}): { x: number; y: number; width: number; height: number } {
  const path = opts.path;
  const numbers = path.match(/-?\d+\.?\d*/g);
  if (!numbers || numbers.length < 2) {
    return { x: 0, y: 0, width: 100, height: 100 };
  }

  const coords: number[] = numbers.map(Number);
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  for (let i = 0; i < coords.length - 1; i += 2) {
    minX = Math.min(minX, coords[i]);
    maxX = Math.max(maxX, coords[i]);
    minY = Math.min(minY, coords[i + 1]);
    maxY = Math.max(maxY, coords[i + 1]);
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

/**
 * Create multi-line text by wrapping at a given number of lines.
 */
export function createMultiLineText(
  text: string,
  maxWidth: number,
  fontStr: string = "14px Arial"
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = getTextWidth(testLine, fontStr);

    if (width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
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
