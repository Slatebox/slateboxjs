import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { exportSVG, exportPNG, inlinePictures } from "../../src/core/Export";
import type { ExportOptions } from "../../src/core/Export";

// ---------------------------------------------------------------------------
// Mock browser APIs that jsdom does not implement:
//   - HTMLCanvasElement.getContext (requires node-canvas package)
//   - URL.createObjectURL / URL.revokeObjectURL
// ---------------------------------------------------------------------------

const FAKE_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

/** Create a fake object URL that can be revoked without errors. */
function fakeObjectURL(): string {
  return "blob:mock/" + Math.random().toString(36).slice(2);
}

beforeEach(() => {
  // URL.createObjectURL / revokeObjectURL — not available in jsdom but used by exportPNG
  (URL as any).createObjectURL = vi.fn().mockReturnValue(fakeObjectURL());
  (URL as any).revokeObjectURL = vi.fn();
});

function createMockContext2D(): CanvasRenderingContext2D {
  // Return a proxied object that quacks like a 2D context.
  // The actual methods exportPNG calls are: fillStyle (set), fillRect, drawImage
  return {
    fillStyle: "",
    fillRect: vi.fn(),
    drawImage: vi.fn(),
    // Stubs for any other CanvasRenderingContext2D access
    canvas: {} as any,
    globalAlpha: 1,
    globalCompositeOperation: "source-over",
    getContextAttributes: vi.fn(),
    setTransform: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
  } as unknown as CanvasRenderingContext2D;
}

function mockCanvasGetContext(): CanvasRenderingContext2D {
  const ctx = createMockContext2D();
  vi.spyOn(
    HTMLCanvasElement.prototype,
    "getContext"
  ).mockImplementation((type: string) => {
    if (type === "2d") return ctx;
    return null;
  });
  return ctx;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Create a realistic mock slate with a real SVG DOM tree inside canvas.node.
 * The SVG contains a background rect, selection handles, connection handles,
 * a coordinates group, and two data nodes — exactly what exportSVG processes.
 */
function createMockSlate(
  overrides: Record<string, any> = {}
): any {
  const svgRoot = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  svgRoot.setAttribute("width", "800");
  svgRoot.setAttribute("height", "600");
  svgRoot.setAttribute("viewBox", "0 0 800 600");

  // --- Background ---
  const bgRect = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );
  bgRect.setAttribute("data-background", "true");
  bgRect.setAttribute("width", "800");
  bgRect.setAttribute("height", "600");
  bgRect.setAttribute("fill", "#ffffff");
  svgRoot.appendChild(bgRect);

  // --- Elements that should be stripped from export ---
  const selHandle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );
  selHandle.setAttribute("class", "svg_select_handle");
  svgRoot.appendChild(selHandle);

  const selRotHandle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );
  selRotHandle.setAttribute("class", "svg_select_handle_rot");
  svgRoot.appendChild(selRotHandle);

  const selBoundingRect = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );
  selBoundingRect.setAttribute("class", "svg_select_boundingRect");
  svgRoot.appendChild(selBoundingRect);

  const connHandle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
  );
  connHandle.setAttribute("class", "connection-handle");
  svgRoot.appendChild(connHandle);

  const coords = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g"
  );
  coords.setAttribute("id", "slate-coordinates");
  svgRoot.appendChild(coords);

  // --- Node groups ---
  const node1 = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g"
  );
  node1.setAttribute("data-node-id", "node-1");
  const n1Rect = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );
  n1Rect.setAttribute("width", "100");
  n1Rect.setAttribute("height", "60");
  n1Rect.setAttribute("fill", "#ff0000");
  node1.appendChild(n1Rect);
  svgRoot.appendChild(node1);

  const node2 = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g"
  );
  node2.setAttribute("data-node-id", "node-2");
  const n2Rect = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );
  n2Rect.setAttribute("width", "120");
  n2Rect.setAttribute("height", "80");
  n2Rect.setAttribute("fill", "#00ff00");
  node2.appendChild(n2Rect);
  svgRoot.appendChild(node2);

  return {
    canvas: {
      node: svgRoot,
      viewbox: vi.fn().mockReturnValue({
        x: 0,
        y: 0,
        width: 800,
        height: 600,
      }),
    },
    options: {
      containerStyle: {
        backgroundColor: "#ffffff",
      },
    },
    ...overrides,
  };
}

/**
 * Create a minimal slate that has no canvas at all — exercises the early-exit
 * path in both exportSVG and exportPNG.
 */
function createCanvaslessSlate(): any {
  return { canvas: null, options: {} };
}

/**
 * A mock Image class that lets tests manually trigger onload / onerror.
 * Replace `window.Image` with this before calling exportPNG.
 */
class MockControllableImage {
  onload: (() => void) | null = null;
  onerror: ((err: any) => void) | null = null;
  src: string = "";

  triggerLoad(): void {
    this.onload?.();
  }

  triggerError(err?: any): void {
    this.onerror?.(err || new Event("error"));
  }
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Export", () => {
  let mockSlate: any;

  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ===================================================================
  //  exportSVG
  // ===================================================================

  describe("exportSVG", () => {
    beforeEach(() => {
      mockSlate = createMockSlate();
    });

    it("should return an SVG string with XML declaration", () => {
      const result = exportSVG(mockSlate);
      expect(result).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(result).toContain("<svg");
      expect(result).toContain("</svg>");
    });

    it("should preserve the background rect in the output", () => {
      const result = exportSVG(mockSlate);
      expect(result).toContain("data-background");
      expect(result).toContain('fill="#ffffff"');
    });

    it("should strip selection handles from the output", () => {
      const result = exportSVG(mockSlate);
      expect(result).not.toContain("svg_select_handle");
      expect(result).not.toContain("svg_select_boundingRect");
    });

    it("should strip connection handles from the output", () => {
      const result = exportSVG(mockSlate);
      expect(result).not.toContain("connection-handle");
    });

    it("leaves agents at work out: their pointers and the ghosts of what they suggest", () => {
      const ns = "http://www.w3.org/2000/svg";
      const root = mockSlate.canvas.node as SVGElement;
      const pointers = document.createElementNS(ns, "g");
      // As AgentPresence and AgentSuggestions draw their layers (their tests hold them to it).
      pointers.setAttribute("data-agent-presence", "");
      pointers.setAttribute("data-export-never", "");
      pointers.appendChild(document.createElementNS(ns, "text")).textContent = "Test Diagrams";
      const ghosts = document.createElementNS(ns, "g");
      ghosts.setAttribute("data-agent-suggestions", "");
      ghosts.setAttribute("data-export-never", "");
      ghosts.appendChild(document.createElementNS(ns, "rect")).setAttribute("data-agent-ghost", "n9");
      root.appendChild(pointers);
      root.appendChild(ghosts);
      const result = exportSVG(mockSlate);
      expect(result).not.toContain("data-agent-presence");
      expect(result).not.toContain("data-agent-suggestions");
      expect(result).not.toContain("Test Diagrams");
      expect(result).not.toContain("data-agent-ghost");
      expect(result).toContain('data-node-id="node-1"');
      // the canvas itself keeps them
      expect(root.querySelector("[data-agent-presence]")).not.toBeNull();
    });

    it("should strip the coordinates overlay from the output", () => {
      const result = exportSVG(mockSlate);
      expect(result).not.toContain("slate-coordinates");
    });

    it("should keep node groups in the output by default", () => {
      const result = exportSVG(mockSlate);
      expect(result).toContain('data-node-id="node-1"');
      expect(result).toContain('data-node-id="node-2"');
      expect(result).toContain('fill="#ff0000"');
      expect(result).toContain('fill="#00ff00"');
    });

    it("should call the callback with the SVG string", () => {
      const callback = vi.fn();
      const result = exportSVG(mockSlate, {}, callback);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(result);
    });

    it("should return empty string when slate has no canvas", () => {
      const result = exportSVG(createCanvaslessSlate());
      expect(result).toBe("");
    });

    it("should call callback with empty string when slate has no canvas", () => {
      const callback = vi.fn();
      const result = exportSVG(createCanvaslessSlate(), {}, callback);
      expect(result).toBe("");
      expect(callback).toHaveBeenCalledWith("");
    });

    describe("noBackground option", () => {
      it("should remove the background rect", () => {
        const result = exportSVG(mockSlate, { noBackground: true });
        expect(result).not.toContain("data-background");
      });

      it("should still include nodes", () => {
        const result = exportSVG(mockSlate, { noBackground: true });
        expect(result).toContain('data-node-id="node-1"');
        expect(result).toContain('data-node-id="node-2"');
      });
    });

    describe("backgroundOnly option", () => {
      it("should remove all node groups", () => {
        const result = exportSVG(mockSlate, { backgroundOnly: true });
        expect(result).not.toContain("data-node-id");
      });

      it("should keep the background", () => {
        const result = exportSVG(mockSlate, { backgroundOnly: true });
        expect(result).toContain("data-background");
      });
    });

    describe("frame and size options (a page to print)", () => {
      it("frames exactly the box given, with no padding, at the printed size", () => {
        const result = exportSVG(mockSlate, { nodes: [{ id: "node-1" }], frame: { x: 264, y: 84, width: 816, height: 1056 }, size: { width: "8.5in", height: "11in" } });
        expect(result).toContain('viewBox="264 84 816 1056"');
        expect(result).toContain('width="8.5in"');
        expect(result).toContain('height="11in"');
        expect(result).not.toContain('data-node-id="node-2"');
      });

      it("without a size, the frame's own size in px", () => {
        const result = exportSVG(mockSlate, { frame: { x: 0, y: 0, width: 793.7, height: 1122.52 } });
        expect(result).toContain('viewBox="0 0 793.7 1122.52"');
        expect(result).toContain('width="793.7"');
      });

      it("a size that is not a length is left out", () => {
        const result = exportSVG(mockSlate, { frame: { x: 0, y: 0, width: 100, height: 50 }, size: { width: "8.5in;x", height: "11in" } });
        expect(result).toContain('width="100"');
      });
    });

    describe("nodes option (filtered export)", () => {
      it("should include only the specified nodes", () => {
        const result = exportSVG(mockSlate, {
          nodes: [{ id: "node-1" }],
        });
        expect(result).toContain('data-node-id="node-1"');
        expect(result).not.toContain('data-node-id="node-2"');
      });

      it("should include multiple specified nodes", () => {
        const result = exportSVG(mockSlate, {
          nodes: [{ id: "node-1" }, { id: "node-2" }],
        });
        expect(result).toContain('data-node-id="node-1"');
        expect(result).toContain('data-node-id="node-2"');
      });

      it("should remove all nodes when none match", () => {
        const result = exportSVG(mockSlate, {
          nodes: [{ id: "nonexistent" }],
        });
        expect(result).not.toContain("data-node-id");
      });

      it("should keep the background when filtering nodes", () => {
        const result = exportSVG(mockSlate, {
          nodes: [{ id: "node-1" }],
        });
        expect(result).toContain("data-background");
      });
    });

    describe("notes a host leaves out of exports (exportable: false)", () => {
      // A host's provisional drawing (a conversation preview, say) is on the canvas but not
      // part of the diagram: no export shows it, its lines, or room framed for it.
      function slateWithProvisionalNote() {
        const slate = createMockSlate();
        const svg: SVGElement = slate.canvas.node;
        const ns = "http://www.w3.org/2000/svg";
        const group = (id: string) => svg.querySelector(`[data-node-id="${id}"]`)!;
        const path = (type: string, d: string) => {
          const el = document.createElementNS(ns, "path");
          el.setAttribute("connectortype", type);
          el.setAttribute("d", d);
          svg.appendChild(el);
          return el;
        };
        // node-2 is provisional; it holds a line to node-1, and node-1 holds a line to it.
        const fromProvisional = { connector: path("default", "M 0 0 L 1 1"), hitArea: path("hitarea", "M 0 0 L 1 1") };
        const toProvisional = { connector: path("default", "M 5 5 L 9 9"), hitArea: path("hitarea", "M 5 5 L 9 9") };
        const keptLine = path("default", "M 2 2 L 3 3");
        const asSvgJs = (line: any) => ({ connector: { node: line.connector }, hitArea: { node: line.hitArea } });
        const node1: any = { id: "node-1", options: { x: 0, y: 0, width: 100, height: 60 }, svgGroup: { node: group("node-1") } };
        const node2: any = { id: "node-2", options: { x: 900, y: 900, width: 120, height: 80 }, svgGroup: { node: group("node-2") } };
        node1.connector = { getConnections: () => [
          { id: "node-1->node-2", source: node1, target: node2, connectable: asSvgJs(toProvisional) },
          { id: "node-1->node-1", source: node1, target: node1, connectable: { connector: { node: keptLine } } },
        ] };
        node2.connector = { getConnections: () => [{ id: "node-2->node-1", source: node2, target: node1, connectable: asSvgJs(fromProvisional) }] };
        const nodes = [node1, node2];
        slate.nodes = { allNodes: nodes, one: (id: string) => nodes.find((n) => n.id === id) };
        slate.governanceOf = (node: any) => node === node2
          ? { policy: {}, capabilities: { persist: false, exportable: false } }
          : null;
        return { slate, svg, keptLine };
      }

      it("leaves the note and every line to or from it out of the SVG", () => {
        const { slate } = slateWithProvisionalNote();
        const result = exportSVG(slate);
        expect(result).toContain('data-node-id="node-1"');
        expect(result).not.toContain('data-node-id="node-2"');
        expect(result).not.toContain("M 0 0 L 1 1");
        expect(result).not.toContain("M 5 5 L 9 9");
        expect(result).toContain("M 2 2 L 3 3");
      });

      it("frames the export to the notes that are exported", () => {
        const { slate } = slateWithProvisionalNote();
        const result = exportSVG(slate);
        // node-1 alone (0,0 100x60) with 40 of padding; node-2 at 900,900 is not counted.
        expect(result).toContain('viewBox="-40 -40 180 140"');
      });

      it("leaves the canvas itself as it was", () => {
        const { slate, svg } = slateWithProvisionalNote();
        exportSVG(slate);
        expect(svg.querySelector('[data-node-id="node-2"]')).not.toBeNull();
        expect(svg.querySelectorAll("[data-export-omit]").length).toBe(0);
      });

      it("keeps a governed note that is exportable (a workshop's cards)", () => {
        const { slate } = slateWithProvisionalNote();
        slate.governanceOf = () => ({ policy: {}, capabilities: { persist: false, exportable: true } });
        const result = exportSVG(slate);
        expect(result).toContain('data-node-id="node-2"');
        expect(result).toContain("M 0 0 L 1 1");
      });
    });

    describe("error handling", () => {
      it("should return empty string and log error when cloneNode throws", () => {
        // Replace canvas.node with a plain object that throws on cloneNode
        const badSlate = {
          canvas: {
            node: {
              cloneNode: vi.fn().mockImplementation(() => {
                throw new Error("clone failed");
              }),
            },
          },
        };
        const callback = vi.fn();
        const result = exportSVG(badSlate, {}, callback);

        expect(result).toBe("");
        expect(callback).toHaveBeenCalledWith("");
        expect(console.error).toHaveBeenCalledWith(
          "EXPORT_DEBUG: SVG export failed:",
          expect.any(Error)
        );
      });

      it("should return empty string and log error when XMLSerializer fails", () => {
        // Make querySelectorAll throw (covers the general catch)
        const badSlate = {
          canvas: {
            node: {
              cloneNode: vi.fn().mockReturnValue({
                querySelectorAll: vi.fn().mockImplementation(() => {
                  throw new Error("query failed");
                }),
              }),
            },
          },
        };
        const callback = vi.fn();
        const result = exportSVG(badSlate, {}, callback);

        expect(result).toBe("");
        expect(callback).toHaveBeenCalledWith("");
        expect(console.error).toHaveBeenCalledWith(
          "EXPORT_DEBUG: SVG export failed:",
          expect.any(Error)
        );
      });
    });
  });

  // ===================================================================
  //  exportPNG
  // ===================================================================

  describe("exportPNG", () => {
    let mockImage: MockControllableImage;
    let mockCtx: CanvasRenderingContext2D;

    beforeEach(() => {
      mockSlate = createMockSlate();
      mockImage = new MockControllableImage();

      // Mock the 2D context so getContext("2d") doesn't throw
      mockCtx = mockCanvasGetContext();

      // Also mock toDataURL and toBlob on the canvas prototype so the
      // specific canvas created inside exportPNG returns something useful.
      vi.spyOn(
        HTMLCanvasElement.prototype,
        "toDataURL"
      ).mockReturnValue("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==");

      vi.spyOn(
        HTMLCanvasElement.prototype,
        "toBlob"
      ).mockImplementation(function (
        callback: BlobCallback
      ) {
        callback(new Blob(["fake-png"], { type: "image/png" }));
      });

      // Replace the global Image constructor with our controllable mock
      vi.stubGlobal("Image", vi.fn(() => mockImage) as any);
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it("should return a data URL string", async () => {
      const promise = exportPNG(mockSlate);
      mockImage.triggerLoad();
      const result = await promise;

      expect(result).toEqual(expect.any(String));
      expect(result).toContain("data:image/png;base64,");
    });

    it("should call the callback with the result", async () => {
      const callback = vi.fn();
      const promise = exportPNG(mockSlate, {}, callback);
      mockImage.triggerLoad();
      const result = await promise;

      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(result);
    });

    it("should return empty string when exportSVG yields no SVG (no canvas)", async () => {
      const result = await exportPNG(createCanvaslessSlate());
      expect(result).toBe("");
    });

    it("should call callback with empty string when no canvas", async () => {
      const callback = vi.fn();
      const result = await exportPNG(createCanvaslessSlate(), {}, callback);
      expect(result).toBe("");
      expect(callback).toHaveBeenCalledWith("");
    });

    describe("base64 option", () => {
      it("should return just the base64 payload without the data-URL prefix", async () => {
        const promise = exportPNG(mockSlate, { base64: true });
        mockImage.triggerLoad();
        const result = await promise;

        expect(result).toEqual(expect.any(String));
        expect(result).not.toContain("data:image/png;base64,");
        // Should be valid base64
        expect(() => atob(result as string)).not.toThrow();
      });
    });

    describe("asBinary option", () => {
      it("should return a Blob", async () => {
        const promise = exportPNG(mockSlate, { asBinary: true });
        mockImage.triggerLoad();
        const result = await promise;

        expect(result).toBeInstanceOf(Blob);
        expect((result as Blob).type).toBe("image/png");
      });
    });

    describe("scale option", () => {
      it("should render a PNG using the exported (fit-to-content) dimensions", async () => {
        // PNG dimensions now derive from the exported SVG's content viewBox (not the
        // canvas viewport), so exporting while scrolled/zoomed still frames the
        // diagram. It only falls back to canvas.viewbox() when the SVG has no viewBox.
        const promise = exportPNG(mockSlate, { scale: 1 });
        mockImage.triggerLoad();
        const result = await promise;

        expect(result).toContain("data:image/png;base64,");
      });
    });

    describe("alpha option", () => {
      it("should not crash when alpha is true", async () => {
        const promise = exportPNG(mockSlate, { alpha: true });
        mockImage.triggerLoad();
        const result = await promise;

        expect(result).toEqual(expect.any(String));
        expect(result).toContain("data:image/png;base64,");
      });
    });

    describe("error handling", () => {
      it("should return empty string when the Image fails to load", async () => {
        const callback = vi.fn();
        const promise = exportPNG(mockSlate, {}, callback);
        mockImage.triggerError(new Error("image load failed"));
        const result = await promise;

        expect(result).toBe("");
        expect(callback).toHaveBeenCalledWith("");
        expect(console.error).toHaveBeenCalledWith(
          "EXPORT_DEBUG: PNG rendering failed:",
          expect.any(Error)
        );
      });

      it("should return empty Blob when Image fails with asBinary", async () => {
        const promise = exportPNG(mockSlate, { asBinary: true });
        mockImage.triggerError();
        const result = await promise;

        expect(result).toBeInstanceOf(Blob);
        expect((result as Blob).size).toBe(0);
      });

      it("should return empty string when exportSVG returns empty (no canvas)", async () => {
        const result = await exportPNG(createCanvaslessSlate());
        expect(result).toBe("");
      });

      it("should not crash when callback is omitted", async () => {
        const promise = exportPNG(mockSlate);
        mockImage.triggerLoad();
        await expect(promise).resolves.toEqual(expect.any(String));
      });

      it("should not crash when callback is omitted on error path", async () => {
        const promise = exportPNG(mockSlate);
        mockImage.triggerError();
        await expect(promise).resolves.toBe("");
      });
    });
  });
});

describe("inlinePictures: a PNG shows every note's picture", () => {
  const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const answer = (type = "image/png", ok = true) =>
    ({ ok, blob: async () => new Blob([png], { type }) }) as unknown as Response;

  it("writes a picture (a video note's poster) into the SVG as a data address", async () => {
    const fetcher = vi.fn(async () => answer());
    const svg = '<svg><image href="/sbimages/media-posters%2Fyoutube%2Fx.jpg" width="320"/><image xlink:href="https://files.example/a.png?x=1&amp;y=2"/></svg>';
    const out = await inlinePictures(svg, fetcher as any);
    expect(out).not.toContain("/sbimages/");
    expect(out).not.toContain("files.example");
    expect(out.match(/data:image\/png;base64,/g)).toHaveLength(2);
    expect(fetcher).toHaveBeenCalledWith(expect.stringContaining("y=2"), expect.objectContaining({ mode: "cors", credentials: "omit" }));
  });

  it("leaves a picture it cannot read, data addresses, and other schemes as they were", async () => {
    const fetcher = vi.fn(async (url: string) => (url.includes("blocked") ? Promise.reject(new Error("cors")) : answer("text/html")));
    const svg = '<svg><image href="https://blocked.example/a.png"/><image href="https://files.example/page"/><image href="data:image/png;base64,AA=="/><image href="javascript:alert(1)"/></svg>';
    const out = await inlinePictures(svg, fetcher as any);
    expect(out).toBe(svg);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });
});

describe("exportSVG draws the slate's own background", () => {
  it("a styled slate's dark canvas becomes rect[data-background] behind everything", () => {
    const slate = createMockSlate({ options: { containerStyle: { backgroundColor: "#0b0016" } } });
    const svg = exportSVG(slate);
    const doc = new DOMParser().parseFromString(svg.replace(/^<\?xml[^>]*>\n/, ""), "image/svg+xml");
    const rects = doc.querySelectorAll("rect[data-background]");
    expect(rects.length).toBe(1);
    expect(rects[0].getAttribute("fill")).toBe("#0b0016");
    expect(doc.documentElement.firstElementChild).toBe(rects[0]);
  });

  it("stays behind the notes when the lines' markers <defs> comes after them", () => {
    // The canvas writes the arrow markers' <defs> after the notes and lines it has drawn. A rect placed
    // after that <defs> painted over every note (the site player's plain story showed a blank panel).
    const slate = createMockSlate({ options: { containerStyle: { backgroundColor: "#f3f1e4" } } });
    const svgRoot: SVGSVGElement = slate.canvas.node;
    const markers = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    markers.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "marker"));
    svgRoot.appendChild(markers);
    const doc = new DOMParser().parseFromString(exportSVG(slate).replace(/^<\?xml[^>]*>\n/, ""), "image/svg+xml");
    const rect = doc.querySelector("rect[data-background]");
    expect(rect?.getAttribute("fill")).toBe("#f3f1e4");
    expect(doc.documentElement.firstElementChild).toBe(rect);
    const children = [...doc.documentElement.children];
    const firstNote = children.findIndex((el) => el.hasAttribute("data-node-id"));
    expect(firstNote).toBeGreaterThan(children.indexOf(rect as Element));
  });

  it("a gradient background is drawn with a gradient", () => {
    const slate = createMockSlate({
      options: { containerStyle: { backgroundColor: "#111111", backgroundColorAsGradient: true, backgroundGradientType: "linear", backgroundGradientColors: ["#111111", "#333333"], backgroundGradientStrategy: "vertical" } },
    });
    const svg = exportSVG(slate);
    expect(svg).toContain("linearGradient");
    expect(svg).toContain('fill="url(#sb-export-background)"');
  });

  it("noBackground, a white slate and an image background add none", () => {
    expect(exportSVG(createMockSlate({ options: { containerStyle: { backgroundColor: "#0b0016" } } }), { noBackground: true })).not.toContain("data-background");
    const white = exportSVG(createMockSlate());
    expect(white.match(/data-background/g)?.length ?? 0).toBeLessThanOrEqual(1);
    const image = exportSVG(createMockSlate({ options: { containerStyle: { backgroundColor: "#0b0016", backgroundImage: "https://example.com/a.png" } } }));
    expect(image).not.toContain('fill="#0b0016"');
  });
});

describe("exportSVG draws a gradient at its angle", () => {
  it("a linear gradient's angle is its line across the box (90 runs left to right)", () => {
    const slate = createMockSlate({
      options: { containerStyle: { backgroundColor: "#111111", backgroundColorAsGradient: true, backgroundGradientType: "linear", backgroundGradientColors: ["#111111", "#333333", "#555555"], backgroundGradientAngle: 90 } },
    });
    const doc = new DOMParser().parseFromString(exportSVG(slate).replace(/^<\?xml[^>]*>\n/, ""), "image/svg+xml");
    const grad = doc.querySelector("linearGradient")!;
    expect([grad.getAttribute("x1"), grad.getAttribute("y1"), grad.getAttribute("x2"), grad.getAttribute("y2")]).toEqual(["0", "0.5", "1", "0.5"]);
    expect(doc.querySelectorAll("linearGradient stop").length).toBe(3);
  });
});
