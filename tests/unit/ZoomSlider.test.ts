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

  describe("destroy", () => {
    it("should remove the slider from DOM", () => {
      const slider = new ZoomSlider(mockSlate, { enabled: true });
      expect(container.querySelector(".slatebox-zoom-slider")).not.toBeNull();

      slider.destroy();
      expect(container.querySelector(".slatebox-zoom-slider")).toBeNull();
    });
  });
});
