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

  try {
    // Clone the SVG to avoid modifying the original
    const svgNode = canvas.node.cloneNode(true) as SVGElement;

    // Remove non-exportable elements
    const removeSelectors = [
      ".svg_select_handle",
      ".svg_select_handle_rot",
      ".svg_select_boundingRect",
      ".connection-handle",
      "#slate-coordinates",
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
    // Get SVG dimensions
    const canvas = slate.canvas;
    const viewbox = canvas.viewbox();
    const width = viewbox.width * scale;
    const height = viewbox.height * scale;

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
