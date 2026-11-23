import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ZoomSlider } from "../../src/core/ZoomSlider";

describe("ZoomSlider", () => {
  let mockSlate: any;
  let container: HTMLElement;

  beforeEach(() => {
    vi.useFakeTimers();

    container = document.createElement("div");
    container.style.position = "relative";
    document.body.appendChild(container);

    mockSlate = {
      element: container,
      getZoom: vi.fn().mockReturnValue(1),
      zoom: vi.fn(),
      zoomIn: vi.fn(),
      zoomOut: vi.fn(),
    };
  });

  afterEach(() => {
    document.body.removeChild(container);
    vi.useRealTimers();
  });

  describe("constructor", () => {
    it("should not create UI when disabled", () => {
      new ZoomSlider(mockSlate, { enabled: false });
      expect(container.querySelector(".slatebox-zoom-slider")).toBeNull();
    });

    it("should create UI when enabled", () => {
      new ZoomSlider(mockSlate, { enabled: true });
      expect(container.querySelector(".slatebox-zoom-slider")).not.toBeNull();
    });
  });

  describe("show/hide", () => {
    it("should show the slider", () => {
      const slider = new ZoomSlider(mockSlate);
      slider.show();
      const el = container.querySelector(".slatebox-zoom-slider") as HTMLElement;
      expect(el).not.toBeNull();
      expect(el!.style.display).toBe("flex");
    });

    it("should hide the slider", () => {
      const slider = new ZoomSlider(mockSlate, { enabled: true });
      slider.hide();
      const el = container.querySelector(".slatebox-zoom-slider") as HTMLElement;
      expect(el!.style.display).toBe("none");
    });
  });

  describe("update", () => {
    it("should update label text with current zoom", () => {
      const slider = new ZoomSlider(mockSlate, { enabled: true });
      mockSlate.getZoom.mockReturnValue(1.5);
      slider.update();

      const label = container.querySelector("span");
      expect(label!.textContent).toBe("150%");
    });
  });

  describe("following the view", () => {
    it("shows the zoom of the moment as soon as the canvas's viewBox changes, with no timer", async () => {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      container.appendChild(svg);
      mockSlate.canvas = { node: svg };
      mockSlate.getZoom.mockReturnValue(0.5);
      new ZoomSlider(mockSlate, { enabled: true });
      const label = container.querySelector("span")!;
      // Right from the start, not "100%" until something asks.
      expect(label.textContent).toBe("50%");

      // A programmatic fit (or a wheel, a pinch, a host's own call) ends in a new viewBox.
      mockSlate.getZoom.mockReturnValue(0.36);
      svg.setAttribute("viewBox", "0 0 1076 2329");
      await Promise.resolve();
      await Promise.resolve();
      expect(label.textContent).toBe("36%");
      // No interval is involved: no timer was pending or needed.
      expect(vi.getTimerCount()).toBe(0);
    });

    it("stops watching when destroyed", async () => {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      container.appendChild(svg);
      mockSlate.canvas = { node: svg };
      const slider = new ZoomSlider(mockSlate, { enabled: true });
      slider.destroy();
      mockSlate.getZoom.mockClear();
      svg.setAttribute("viewBox", "0 0 10 10");
      await Promise.resolve();
      await Promise.resolve();
      expect(mockSlate.getZoom).not.toHaveBeenCalled();
    });
  });

  describe("one compact control (board polish #5)", () => {
    it("on a phone is a slim column of 40px buttons with no range: +, the zoom, −, fit", () => {
      Object.defineProperty(container, "clientWidth", { configurable: true, value: 390 });
      new ZoomSlider(mockSlate, { enabled: true });
      const el = container.querySelector(".slatebox-zoom-slider") as HTMLElement;
      expect(el.hasAttribute("data-compact")).toBe(true);
      expect(el.style.flexDirection).toBe("column");
      expect(el.style.right).toContain("12px");
      const labels = [...el.querySelectorAll("button")].map((button) => button.getAttribute("aria-label"));
      expect(labels).toEqual(["Zoom in", "Zoom out", "fitToContent"]);
      for (const button of el.querySelectorAll("button")) expect((button as HTMLElement).style.width).toBe("40px");
      expect(el.querySelector('input[type="range"]')).toBeNull();
      expect(el.querySelector("span")!.textContent).toBe("100%");
    });

    it("on a wider canvas is a short pill at the bottom left that keeps its range", () => {
      Object.defineProperty(container, "clientWidth", { configurable: true, value: 1200 });
      new ZoomSlider(mockSlate, { enabled: true });
      const el = container.querySelector(".slatebox-zoom-slider") as HTMLElement;
      expect(el.hasAttribute("data-compact")).toBe(false);
      expect(el.style.flexDirection).toBe("row");
      expect(el.style.left).toContain("16px");
      expect([...el.querySelectorAll("button")].map((button) => button.getAttribute("aria-label"))).toEqual(["fitToContent", "Zoom out", "Zoom in"]);
      expect(el.querySelector('input[type="range"]')).not.toBeNull();
    });
  });

  describe("destroy", () => {
    it("should remove the slider from DOM", () => {
      const slider = new ZoomSlider(mockSlate, { enabled: true });
      expect(container.querySelector(".slatebox-zoom-slider")).not.toBeNull();

      slider.destroy();
      expect(container.querySelector(".slatebox-zoom-slider")).toBeNull();
    });
  });
});
