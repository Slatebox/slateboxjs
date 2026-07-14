/**
 * FontLoader.ts - Google Fonts loading on demand
 *
 * Loads fonts from Google Fonts API, caches loaded fonts,
 * and provides a method to scan all nodes and load unique fonts.
 */

const loadedFonts: Set<string> = new Set();
const pendingLoads: Map<string, Promise<void>> = new Map();

// System fonts that don't need loading
const systemFonts = new Set([
  "arial",
  "arial, sans-serif",
  "helvetica",
  "helvetica, sans-serif",
  "times new roman",
  "times",
  "courier",
  "courier new",
  "georgia",
  "verdana",
  "tahoma",
  "trebuchet ms",
  "sans-serif",
  "serif",
  "monospace",
  "cursive",
  "fantasy",
]);

/**
 * Load a single Google Font by name.
 * Idempotent — won't reload already-loaded fonts.
 */
export function loadFont(fontFamily: string): Promise<void> {
  // Normalize font name
  const normalized = fontFamily.trim();
  const lower = normalized.toLowerCase();

  // Skip system fonts
  if (systemFonts.has(lower)) {
    return Promise.resolve();
  }

  // Already loaded
  if (loadedFonts.has(lower)) {
    return Promise.resolve();
  }

  // Already loading
  if (pendingLoads.has(lower)) {
    return pendingLoads.get(lower)!;
  }

  const promise = new Promise<void>((resolve, reject) => {
    if (typeof document === "undefined") {
      resolve();
      return;
    }

    // Extract just the font name (remove fallbacks like ", sans-serif")
    const primaryFont = normalized.split(",")[0].trim().replace(/['"]/g, "");

    // Host apps (e.g. slatebox.com via @fontsource) often bundle fonts
    // themselves — if the face is already available, don't inject a
    // competing Google Fonts stylesheet
    try {
      if (document.fonts?.check?.(`12px "${primaryFont}"`)) {
        loadedFonts.add(lower);
        resolve();
        return;
      }
    } catch {
      // document.fonts unavailable (older browsers/jsdom) — proceed to load
    }

    // Create link element for Google Fonts
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      primaryFont
    )}:wght@300;400;500;600;700&display=swap`;

    link.onload = () => {
      loadedFonts.add(lower);
      pendingLoads.delete(lower);
      console.log("FONT_DEBUG: Loaded font:", primaryFont);
      resolve();
    };

    link.onerror = () => {
      pendingLoads.delete(lower);
      console.warn("FONT_DEBUG: Failed to load font:", primaryFont);
      // Resolve anyway — don't block rendering for a font failure
      resolve();
    };

    document.head.appendChild(link);
  });

  pendingLoads.set(lower, promise);
  return promise;
}

/**
 * Scan all nodes in a slate and load any unique fonts.
 */
export async function loadAllFonts(slate: any): Promise<void> {
  const fonts = new Set<string>();

  const nodes = slate.nodes?.allNodes || [];
  for (const node of nodes) {
    if (node.options?.fontFamily) {
      fonts.add(node.options.fontFamily);
    }
  }

  const promises = Array.from(fonts).map((f) => loadFont(f));
  await Promise.all(promises);

  console.log("FONT_DEBUG: All fonts loaded:", Array.from(fonts));
}

/** Check if a font has been loaded */
export function isFontLoaded(fontFamily: string): boolean {
  return loadedFonts.has(fontFamily.toLowerCase().trim());
}
