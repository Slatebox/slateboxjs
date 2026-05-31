/**
 * ZoomSlider.ts - Visual zoom slider control
 *
 * Creates a zoom slider UI element that integrates with PanZoom.
 */

export interface ZoomSliderOptions {
  enabled?: boolean;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  minZoom?: number;
  maxZoom?: number;
}

export class ZoomSlider {
  private slate: any;
  private options: ZoomSliderOptions;
  private container: HTMLElement | null = null;
  private slider: HTMLInputElement | null = null;
  private label: HTMLElement | null = null;
  private _intervalId: ReturnType<typeof setInterval> | null = null;

  constructor(slate: any, options: ZoomSliderOptions = {}) {
    this.slate = slate;
    this.options = {
      enabled: false,
      position: "bottom-right",
      minZoom: 0.1,
      maxZoom: 10,
      ...options,
    };

    if (this.options.enabled) {
      this.create();
    }
  }

  /** Show the zoom slider */
  public show(): void {
    if (!this.container) {
      this.create();
    }
    if (this.container) {
      this.container.style.display = "flex";
    }
  }

  /** Hide the zoom slider */
  public hide(): void {
    if (this.container) {
      this.container.style.display = "none";
    }
  }

  /** Destroy the zoom slider */
  public destroy(): void {
    // Clear the refresh interval
    if (this._intervalId !== null) {
      clearInterval(this._intervalId);
      this._intervalId = null;
    }
    if (this.container) {
      this.container.remove();
      this.container = null;
      this.slider = null;
      this.label = null;
    }
  }

  /** Update the slider to reflect current zoom level */
  public update(): void {
    if (!this.slider || !this.label) return;
    const zoom = this.slate.getZoom?.() || 1;
    this.slider.value = String(zoom);
    this.label.textContent = `${Math.round(zoom * 100)}%`;
  }

  // ─── Private ─────────────────────────────────────────────────────

  private create(): void {
    if (!this.slate.element) return;

    // Ensure parent has relative positioning
    this.slate.element.style.position =
      this.slate.element.style.position || "relative";

    this.container = document.createElement("div");
    this.container.className = "slatebox-zoom-slider";

    // Position based on option
    const positionStyles: Record<string, string> = {
      "bottom-right": "bottom: 10px; right: 10px;",
      "bottom-left": "bottom: 10px; left: 10px;",
      "top-right": "top: 10px; right: 10px;",
      "top-left": "top: 10px; left: 10px;",
    };

    this.container.style.cssText = `
      position: absolute;
      ${positionStyles[this.options.position!]}
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 6px 12px;
      border-radius: 4px;
      z-index: 1000;
      font-family: sans-serif;
      font-size: 12px;
    `;

    // Zoom out button
    const zoomOut = document.createElement("button");
    zoomOut.textContent = "-";
    zoomOut.style.cssText =
      "background:none;border:none;color:white;cursor:pointer;font-size:16px;padding:0 4px;";
    zoomOut.onclick = () => this.slate.zoomOut?.();
    this.container.appendChild(zoomOut);

    // Slider
    this.slider = document.createElement("input");
    this.slider.type = "range";
    this.slider.min = String(this.options.minZoom);
    this.slider.max = String(this.options.maxZoom);
    this.slider.step = "0.1";
    this.slider.value = "1";
    this.slider.style.cssText = "width: 100px; cursor: pointer;";
    this.slider.oninput = () => {
      const val = parseFloat(this.slider!.value);
      this.slate.zoom?.(val);
      this.update();
    };
    this.container.appendChild(this.slider);

    // Zoom in button
    const zoomIn = document.createElement("button");
    zoomIn.textContent = "+";
    zoomIn.style.cssText =
      "background:none;border:none;color:white;cursor:pointer;font-size:16px;padding:0 4px;";
    zoomIn.onclick = () => this.slate.zoomIn?.();
    this.container.appendChild(zoomIn);

    // Label
    this.label = document.createElement("span");
    this.label.textContent = "100%";
    this.label.style.cssText = "min-width: 40px; text-align: right;";
    this.container.appendChild(this.label);

    this.slate.element.appendChild(this.container);

    // Update periodically
    this._intervalId = setInterval(() => this.update(), 500);
  }
}
