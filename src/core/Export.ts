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
      // UI chrome that shouldn't appear in an exported diagram:
      ".comment-badge", // comment-count badges (rendered in the node group)
      ".node-link-badge", // link indicator badge (also in the node group)
      ".node-cog", // selection toolbar (delete/connect/cog pill)
      ".node-toolbar",
      ".line-cog", // line selection pill (delete/cog) — parallel to the node cog
      ".line-toolbar",
      "#slate-coordinates",
      // Connector hit areas: invisible wide paths used only for click detection
      // (attribute-tagged, so the class selectors above miss them). Not visible
      // content — strip them so the export has no near-invisible cruft / bbox skew.
      '[connectortype="hitarea"]',
      // Notes left out of exports by their host, and their lines.
      `[${OMIT}]`,
    ];

    for (const sel of removeSelectors) {
      const elements = svgNode.querySelectorAll(sel);
      elements.forEach((el) => el.remove());
    }

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
  const svgString = exportSVG(slate, opts);
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
