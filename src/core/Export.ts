/**
 * Export.ts - SVG and PNG export functionality
 *
 * Provides methods to export the slate canvas as SVG or PNG.
 */

export interface ExportOptions {
  /** Exclude the background from export */
  noBackground?: boolean;
  /** Export only the background (no nodes) */
  backgroundOnly?: boolean;
  /** Specific nodes to include (if undefined, all nodes) */
  nodes?: any[];
  /** For PNG: return as base64 string */
  base64?: boolean;
  /** For PNG: return as binary Blob */
  asBinary?: boolean;
  /** For PNG: include alpha transparency */
  alpha?: boolean;
  /** Use data image URLs for embedded images */
  useDataImageUrls?: boolean;
  /** Scale factor for PNG export */
  scale?: number;
}

const OMIT = "data-export-omit";
/** Set by layers that are only ever drawn for the view (AgentPresence, AgentSuggestions): no export keeps them. */
const NEVER = "data-export-never";

/**
 * The canvas elements of every note a host has marked `exportable: false`
 * (see DragPolicy), with each line drawn to or from one: its path, hit area and label.
 */
function elementsLeftOut(slate: any): Element[] {
  const nodes: any[] = slate.nodes?.allNodes ?? [];
  if (typeof slate.governanceOf !== "function" || nodes.length === 0) return [];
  const out = new Set<string>();
  for (const node of nodes) {
    if (slate.governanceOf(node)?.capabilities?.exportable === false) out.add(node.id);
  }
  if (out.size === 0) return [];
  const elements: Element[] = [];
  const take = (el: any) => {
    if (el && typeof el.setAttribute === "function") elements.push(el);
  };
  for (const node of nodes) {
    if (out.has(node.id)) take(node.svgGroup?.node);
    for (const connection of node.connector?.getConnections?.() ?? []) {
      if (!out.has(node.id) && !out.has(connection?.target?.id)) continue;
      const line = connection.connectable;
      take(line?.connector?.node);
      take(line?.hitArea?.node);
      take(line?.label?.node);
      take(line?.labelBg?.node);
    }
  }
  return elements;
}

type Box = { x: number; y: number; width: number; height: number };

/**
 * In the copy of the canvas, draw each board's chrome plain (slate.boardChromes, see workshops/boardChrome.ts) and
 * return the boxes it fills; or, with `leaveOut`, take it out. A preview's chrome is always left out.
 */
function paintChromePlain(slate: any, svgNode: SVGElement, leaveOut: boolean): Box[] {
  const groups = Array.from(svgNode.querySelectorAll("g[data-board-chrome]"));
  if (!groups.length) return [];
  const entries: any[] = slate?.boardChromes instanceof Set ? Array.from(slate.boardChromes) : [];
  const boxes: Box[] = [];
  for (const under of groups) {
    if (under.hasAttribute("data-board-badges")) continue;
    const scope = under.getAttribute("data-board-scope") ?? "main";
    const over = groups.find((g) => g.hasAttribute("data-board-badges") && (g.getAttribute("data-board-scope") ?? "main") === scope) ?? null;
    const entry = entries.find((e) => e.scope === scope && !e.draft);
    if (leaveOut || !entry || under.hasAttribute("data-workshop-draft")) {
      under.remove();
      over?.remove();
      continue;
    }
    try {
      entry.paintPlain(under, over);
      const box = entry.plainBox();
      if (box && [box.x, box.y, box.width, box.height].every(Number.isFinite)) boxes.push(box);
    } catch {
      under.remove();
      over?.remove();
    }
  }
  return boxes;
}

/**
 * Export the slate canvas as SVG string.
 */
export function exportSVG(
  slate: any,
  opts: ExportOptions = {},
  callback?: (svg: string) => void
): string {
  const canvas = slate.canvas;
  if (!canvas) {
    const err = "";
    callback?.(err);
    return err;
  }

  // Notes a host keeps out of the picture (exportable: false) and their lines are
  // tagged on the canvas for the moment of the clone, then dropped from the copy.
  const omitted = elementsLeftOut(slate);
  try {
    // Clone the SVG to avoid modifying the original
    for (const el of omitted) el.setAttribute(OMIT, "");
    let svgNode: SVGElement;
    try {
      svgNode = canvas.node.cloneNode(true) as SVGElement;
    } finally {
      for (const el of omitted) el.removeAttribute(OMIT);
    }

    // Remove non-exportable elements
    const removeSelectors = [
      // All svg.select.js overlays (handles, rotate handle, bounding rect,
      // selection shape) — matched by prefix so none are missed.
      '[class*="svg_select"]',
      ".connection-handle", // node drag-to-connect plugs
      ".connector-handle", // line endpoint drag handles (distinct class!)
      ".connector-handle-glyph", // the marks on those handles (follows / pinned / free)
      ".line-tool-preview", // the line tool's line while drawing
      ".line-tool-tip",
      // UI chrome that shouldn't appear in an exported diagram:
      ".comment-badge", // comment-count badges (rendered in the node group)
      ".node-link-badge", // link indicator badge (also in the node group)
      // A playing video's player and its close button: a picture shows the poster
      // with its play button and caption (kept: they are the media note's look).
      ".media-note-player",
      ".media-note-close",
      ".node-cog", // selection toolbar (delete/connect/cog pill)
      ".node-toolbar",
      ".line-cog", // line selection pill (delete/cog) — parallel to the node cog
      ".line-toolbar",
      "#slate-coordinates",
      // Connector hit areas: invisible wide paths used only for click detection
      // (attribute-tagged, so the class selectors above miss them). Not visible
      // content — strip them so the export has no near-invisible cruft / bbox skew.
      '[connectortype="hitarea"]',
      // Layers drawn for the view and never part of the slate: the agents at work, their pointers (and edge markers) and
      // the ghosts of what they suggest. Nothing an agent has not had kept is part of the slate, so no picture shows it.
      // They are named by this one attribute, not by their own, so the canvas entry names nothing of the agents' drawing
      // (that stays in slateboxjs/presence).
      `[${NEVER}]`,
      // Notes left out of exports by their host, and their lines.
      `[${OMIT}]`,
    ];

    for (const sel of removeSelectors) {
      const elements = svgNode.querySelectorAll(sel);
      elements.forEach((el) => el.remove());
    }

    // A board's chrome (its name, its legend, its rule badges: workshops/boardChrome.ts) is drawn for the view now: grown
    // for a zoomed-out view, and framed while the board is in focus. A picture of the whole slate shows it plain, as at
    // 100% and out of focus; a picture of some notes only, or of the background, leaves it out, as it does a preview's.
    const chromeBoxes = paintChromePlain(slate, svgNode, Boolean(opts.backgroundOnly || opts.nodes));

    // Handle background option
    if (opts.noBackground) {
      // Remove background rect if exists
      const bgRect = svgNode.querySelector("rect[data-background]");
      if (bgRect) bgRect.remove();
    }

    // Handle nodes filtering
    if (opts.backgroundOnly) {
      // Remove all node groups
      const groups = svgNode.querySelectorAll("[data-node-id]");
      groups.forEach((g) => g.remove());
    } else if (opts.nodes) {
      // Keep only specified nodes — accepts node objects OR id strings
      // (v1's node.png passes ids: slate.png({nodes: [id], ...}))
      const keepIds = new Set(
        opts.nodes.map((n: any) => (typeof n === "string" ? n : n.id))
      );
      const allGroups = svgNode.querySelectorAll("[data-node-id]");
      allGroups.forEach((g) => {
        const nodeId = g.getAttribute("data-node-id");
        if (nodeId && !keepIds.has(nodeId)) {
          g.remove();
        }
      });
    }

    // Frame the export to the CONTENT bounds (all remaining node groups), NOT the
    // canvas's current pan/zoom viewBox — otherwise a scrolled or zoomed-in view
    // exports clipped or blank. This gives the whole diagram every time (Miro).
    try {
      const groups = svgNode.querySelectorAll("[data-node-id]");
      if (groups.length > 0) {
        const pad = 40;
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        for (const g of Array.from(groups)) {
          const id = g.getAttribute("data-node-id");
          const node = slate.nodes?.one?.(id);
          const o = node?.options;
          if (!o) continue;
          const x = o.x || 0;
          const y = o.y || 0;
          const w = o.width || 0;
          const h = o.height || 0;
          // Account for ROTATION: a rotated node's corners extend past its
          // un-rotated bbox, so frame to the rotated corner extent or it gets
          // clipped. rotate may be a number or a {rotationAngle} object.
          const angle =
            Number(
              typeof o.rotate === "object" ? o.rotate?.rotationAngle : o.rotate
            ) || 0;
          if (angle) {
            const cx = x + w / 2;
            const cy = y + h / 2;
            const rad = (angle * Math.PI) / 180;
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);
            for (const [px, py] of [
              [x, y],
              [x + w, y],
              [x + w, y + h],
              [x, y + h],
            ]) {
              const dx = px - cx;
              const dy = py - cy;
              const rx = cx + dx * cos - dy * sin;
              const ry = cy + dx * sin + dy * cos;
              minX = Math.min(minX, rx);
              minY = Math.min(minY, ry);
              maxX = Math.max(maxX, rx);
              maxY = Math.max(maxY, ry);
            }
          } else {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x + w);
            maxY = Math.max(maxY, y + h);
          }
        }
        for (const box of chromeBoxes) {
          minX = Math.min(minX, box.x);
          minY = Math.min(minY, box.y);
          maxX = Math.max(maxX, box.x + box.width);
          maxY = Math.max(maxY, box.y + box.height);
        }
        if (isFinite(minX) && maxX > minX) {
          const vbW = maxX - minX + pad * 2;
          const vbH = maxY - minY + pad * 2;
          svgNode.setAttribute(
            "viewBox",
            `${minX - pad} ${minY - pad} ${vbW} ${vbH}`
          );
          svgNode.setAttribute("width", String(Math.round(vbW)));
          svgNode.setAttribute("height", String(Math.round(vbH)));
          svgNode.setAttribute("preserveAspectRatio", "xMidYMid meet");
        }
      }
    } catch (e) {
      /* noop — fall back to the cloned canvas viewBox */
    }

    // Serialize to string
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svgNode);

    // Add XML declaration
    svgString =
      '<?xml version="1.0" encoding="UTF-8"?>\n' + svgString;

    callback?.(svgString);
    return svgString;
  } catch (error) {
    console.error("EXPORT_DEBUG: SVG export failed:", error);
    const err = "";
    callback?.(err);
    return err;
  }
}

const INLINE_LIMITS = Object.freeze({ pictures: 40, bytes: 8 * 1024 * 1024, timeoutMs: 5000 });

/**
 * A picture drawn from an SVG held in an <img> loads nothing from outside it, so
 * every note's picture (a photo, a video note's poster) is written into the SVG
 * as a data address first. A picture that cannot be read (another site that does
 * not allow it, too large, too slow) is left as it was: the note is still drawn,
 * without that picture.
 */
/** True when the SVG draws a picture from an address (not already a data address). */
export function hasOutsidePictures(svgString: string): boolean {
  return /<image\b[^>]*?\s(?:xlink:)?href="(?!data:)[^"]+"/.test(svgString);
}

export async function inlinePictures(svgString: string, fetcher: typeof fetch | undefined = globalThis.fetch): Promise<string> {
  if (!fetcher || typeof FileReader === "undefined") return svgString;
  const pattern = /(<image\b[^>]*?\s(?:xlink:)?href=")([^"]+)(")/g;
  const wanted = new Set<string>();
  for (const match of svgString.matchAll(pattern)) {
    const href = match[2].replace(/&amp;/g, "&");
    if (!/^data:/i.test(href) && wanted.size < INLINE_LIMITS.pictures) wanted.add(href);
  }
  if (!wanted.size) return svgString;
  const base = typeof document !== "undefined" ? document.baseURI : undefined;
  const read = async (href: string): Promise<string | null> => {
    let url: URL;
    try {
      url = new URL(href, base);
    } catch {
      return null;
    }
    if (url.protocol !== "https:" && url.protocol !== "http:") return null;
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timer = setTimeout(() => controller?.abort(), INLINE_LIMITS.timeoutMs);
    try {
      const response = await fetcher(url.href, { mode: "cors", credentials: "omit", signal: controller?.signal });
      if (!response.ok) return null;
      const blob = await response.blob();
      if (!blob.size || blob.size > INLINE_LIMITS.bytes || !/^image\//.test(blob.type)) return null;
      return await new Promise<string | null>((done) => {
        const reader = new FileReader();
        reader.onload = () => done(typeof reader.result === "string" ? reader.result : null);
        reader.onerror = () => done(null);
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    } finally {
      clearTimeout(timer);
    }
  };
  const inlined = new Map<string, string>();
  await Promise.all([...wanted].map(async (href) => {
    const data = await read(href);
    if (data) inlined.set(href, data);
  }));
  if (!inlined.size) return svgString;
  return svgString.replace(pattern, (whole, head, href, tail) => {
    const data = inlined.get(href.replace(/&amp;/g, "&"));
    return data ? `${head}${data}${tail}` : whole;
  });
}

/**
 * Export the slate canvas as PNG.
 *
 * @returns Promise that resolves with base64 string or Blob
 */
export async function exportPNG(
  slate: any,
  opts: ExportOptions = {},
  callback?: (result: string | Blob) => void
): Promise<string | Blob> {
  const drawn = exportSVG(slate, opts);
  // Pictures are written into the SVG, so the PNG shows them (a video note's poster included).
  // (A slate with no picture is drawn at once, as before.)
  const svgString = drawn && hasOutsidePictures(drawn) ? await inlinePictures(drawn) : drawn;
  if (!svgString) {
    const result = opts.asBinary ? new Blob() : "";
    callback?.(result);
    return result;
  }

  const scale = opts.scale || 2; // Default 2x for better quality

  try {
    // Size the PNG to the EXPORTED svg's dimensions (fit-to-content), NOT the
    // canvas's current pan/zoom viewport — else the PNG comes out at the viewport
    // size with the diagram letterboxed/mis-scaled. exportSVG stamps the content
    // viewBox; read its W/H, falling back to the viewport only if absent.
    const canvas = slate.canvas;
    let baseW: number;
    let baseH: number;
    const vbMatch = svgString.match(
      /viewBox="[\d.\-]+\s+[\d.\-]+\s+([\d.\-]+)\s+([\d.\-]+)"/
    );
    if (vbMatch) {
      baseW = parseFloat(vbMatch[1]);
      baseH = parseFloat(vbMatch[2]);
    } else {
      const viewbox = canvas.viewbox();
      baseW = viewbox.width;
      baseH = viewbox.height;
    }
    const width = baseW * scale;
    const height = baseH * scale;

    // Create canvas element for rendering
    const renderCanvas = document.createElement("canvas");
    renderCanvas.width = width;
    renderCanvas.height = height;
    const ctx = renderCanvas.getContext("2d")!;

    // Set white background unless alpha is requested
    if (!opts.alpha) {
      ctx.fillStyle =
        slate.options.containerStyle?.backgroundColor || "#ffffff";
      ctx.fillRect(0, 0, width, height);
    }

    // Create image from SVG
    const img = new Image();
    const svgBlob = new Blob([svgString], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    return new Promise<string | Blob>((resolve, reject) => {
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);

        if (opts.asBinary) {
          renderCanvas.toBlob(
            (blob) => {
              const result = blob || new Blob();
              callback?.(result);
              resolve(result);
            },
            "image/png"
          );
        } else {
          const dataUrl = renderCanvas.toDataURL("image/png");
          const result = opts.base64
            ? dataUrl.split(",")[1] // Just the base64 part
            : dataUrl; // Full data URL
          callback?.(result);
          resolve(result);
        }
      };

      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        console.error("EXPORT_DEBUG: PNG rendering failed:", err);
        const result = opts.asBinary ? new Blob() : "";
        callback?.(result);
        resolve(result);
      };

      img.src = url;
    });
  } catch (error) {
    console.error("EXPORT_DEBUG: PNG export failed:", error);
    const result = opts.asBinary ? new Blob() : "";
    callback?.(result);
    return result;
  }
}
