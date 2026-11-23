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
  private _viewObserver: MutationObserver | null = null;
  private _sizeObserver: ResizeObserver | null = null;
  private fitButton: HTMLButtonElement | null = null;
  private zoomInButton: HTMLButtonElement | null = null;
  private zoomOutButton: HTMLButtonElement | null = null;
  private rule: HTMLElement | null = null;
  /** Whether the control is laid out for a narrow canvas (null before it is laid out). */
  private compact: boolean | null = null;

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
    this._viewObserver?.disconnect();
    this._viewObserver = null;
    this._sizeObserver?.disconnect();
    this._sizeObserver = null;
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

  /** Lay the control out for the canvas's width now: a slim column on a phone, a short pill on a wider screen. */
  private arrange(): void {
    const container = this.container;
    if (!container || !this.slider || !this.label || !this.rule || !this.fitButton || !this.zoomInButton || !this.zoomOutButton) return;
    const width = this.slate.element?.clientWidth || (typeof innerWidth === "number" ? innerWidth : 1024);
    const narrow = width < 600;
    if (narrow === this.compact) return;
    this.compact = narrow;
    container.toggleAttribute("data-compact", narrow);
    // `position` still picks top or bottom; a phone keeps the control at the right edge, a wider screen at the left.
    const top = this.options.position!.startsWith("top");
    const edge = narrow ? 12 : 16;
    const side = narrow || this.options.position === "top-right" ? `right: ${edge}px;` : `left: ${edge}px;`;
    const display = container.style.display === "none" ? "none" : "flex";
    container.style.cssText = `
      position: absolute;
      ${top ? "top" : "bottom"}: calc(var(--slatebox-zoom-offset, 0px) + ${edge}px); ${side}
      display: ${display};
      flex-direction: ${narrow ? "column" : "row"};
      align-items: center;
      gap: ${narrow ? 0 : 2}px;
      background: var(--slatebox-zoom-bg, rgba(255, 255, 255, 0.94));
      color: var(--slatebox-zoom-ink, #1f3d33);
      border: 1px solid var(--slatebox-zoom-line, #d9ddcf);
      box-shadow: 0 2px 10px rgba(20, 40, 30, 0.10);
      padding: ${narrow ? "4px 0" : "2px 6px"};
      border-radius: ${narrow ? 14 : 999}px;
      z-index: 1000;
      font-family: var(--slatebox-board-font, system-ui, sans-serif);
      font-size: 12px;
      font-variant-numeric: tabular-nums;
      user-select: none;
    `;
    for (const button of [this.fitButton, this.zoomOutButton, this.zoomInButton]) {
      button.style.cssText = `background:none;border:none;color:inherit;cursor:pointer;font-size:${narrow ? 20 : 16}px;line-height:1;` +
        `width:${narrow ? 40 : 28}px;height:${narrow ? 40 : 28}px;border-radius:999px;display:grid;place-items:center;padding:0;font-family:inherit;`;
    }
    this.slider.style.cssText = narrow ? "display:none" : "width: 72px; cursor: pointer; accent-color: var(--slatebox-zoom-ink, #1f3d33);";
    this.label.style.cssText = narrow ? "font-size:11px;font-weight:600;padding:2px 0;opacity:.85" : "min-width: 38px; text-align: right; font-weight: 600; padding-right: 4px;";
    this.rule.style.cssText = narrow ? "width:20px;height:1px;background:var(--slatebox-zoom-line,#d9ddcf);margin:2px 0" : "width:1px;height:16px;background:var(--slatebox-zoom-line,#d9ddcf);margin:0 2px";
    const parts = narrow ? [this.zoomInButton, this.label, this.zoomOutButton, this.rule, this.fitButton]
      : [this.fitButton, this.rule, this.zoomOutButton, this.slider, this.zoomInButton, this.label];
    for (const part of parts) container.appendChild(part);
    // The slider is left out of a phone's control.
    if (narrow) this.slider.remove();
  }

  private create(): void {
    if (!this.slate.element) return;

    // Ensure parent has relative positioning
    this.slate.element.style.position =
      this.slate.element.style.position || "relative";

    this.container = document.createElement("div");
    this.container.className = "slatebox-zoom-slider";

    // One compact control in the host's colours (--slatebox-zoom-bg, -ink, -line).
    // Wide: a short pill at the bottom left, clear of a host's add button at the bottom right:
    //   ⤢ | − ━━○━━ + 100%. Narrow (a canvas under 600px, a phone): a slim column at the right
    //   edge: + / 100% / − / ⤢, every button a finger's 40px, and no slider (a pinch zooms).
    const button = (text: string, label: string, onClick: () => void) => {
      const el = document.createElement("button");
      el.type = "button";
      el.textContent = text;
      el.title = label;
      el.setAttribute("aria-label", label);
      el.onclick = onClick;
      return el;
    };
    this.fitButton = button("⤢", "Fit to content", () => this.slate.fitToContent?.());
    this.fitButton.setAttribute("aria-label", "fitToContent");
    this.zoomOutButton = button("−", "Zoom out", () => this.slate.zoomOut?.());
    this.zoomInButton = button("+", "Zoom in", () => this.slate.zoomIn?.());

    this.slider = document.createElement("input");
    this.slider.type = "range";
    this.slider.min = String(this.options.minZoom);
    this.slider.max = String(this.options.maxZoom);
    this.slider.step = "0.1";
    this.slider.value = "1";
    this.slider.setAttribute("aria-label", "Zoom");
    this.slider.oninput = () => {
      const val = parseFloat(this.slider!.value);
      this.slate.zoom?.(val);
      this.update();
    };

    this.label = document.createElement("span");
    this.label.className = "slatebox-zoom-label";
    this.label.textContent = "100%";

    // A thin rule between fit and the zoom buttons (a div, so the label stays the control's only span).
    this.rule = document.createElement("div");
    this.rule.setAttribute("aria-hidden", "true");

    this.arrange();
    if (typeof ResizeObserver !== "undefined") {
      this._sizeObserver = new ResizeObserver(() => this.arrange());
      this._sizeObserver.observe(this.slate.element);
    }

    this.slate.element.appendChild(this.container);

    // The label and the slider follow the view itself. Every zoom, whoever makes it
    // (the wheel, a pinch, these buttons, fitToContent, a host's own call), ends in a
    // new viewBox on the canvas, so that is what is watched; a resize of the canvas
    // changes the viewBox too.
    this.update();
    const svg = this.slate.canvas?.node as SVGSVGElement | undefined;
    if (svg && typeof MutationObserver !== "undefined") {
      this._viewObserver = new MutationObserver(() => this.update());
      this._viewObserver.observe(svg, { attributes: true, attributeFilter: ["viewBox"] });
    }
  }
}
