/**
 * Presentation.ts - Step-through presentation mode
 *
 * Allows stepping through nodes in order, zooming/panning to each.
 */

export interface PresentationStep {
  nodeId: string;
  index: number;
}

export class Presentation {
  private slate: any;
  private steps: PresentationStep[] = [];
  private currentStep: number = -1;
  private isActive: boolean = false;
  /** Zoom level applied when focusing a step's node. */
  public zoomLevel: number = 1.5;

  constructor(slate: any) {
    this.slate = slate;
  }

  /**
   * Extract presentation layout from current nodes.
   * Orders nodes by their _presentationIndex or by position (top-to-bottom, left-to-right).
   */
  public extractLayout(opts?: {
    nodeIds?: string[];
  }): PresentationStep[] {
    let nodes = this.slate.nodes.allNodes;

    // Filter to specific nodes if provided
    if (opts?.nodeIds) {
      const ids = new Set(opts.nodeIds);
      nodes = nodes.filter((n: any) => ids.has(n.id));
    }

    // Sort by presentation index if available, otherwise by position
    nodes.sort((a: any, b: any) => {
      const ai = a.options._presentationIndex;
      const bi = b.options._presentationIndex;
      if (ai !== undefined && bi !== undefined) return ai - bi;

      // Sort by Y then X (top-to-bottom, left-to-right)
      const dy = (a.options.y || 0) - (b.options.y || 0);
      if (Math.abs(dy) > 30) return dy;
      return (a.options.x || 0) - (b.options.x || 0);
    });

    this.steps = nodes.map((node: any, index: number) => ({
      nodeId: node.id,
      index,
    }));

    return this.steps;
  }

  /** Start presentation mode */
  public start(): void {
    if (this.steps.length === 0) {
      this.extractLayout();
    }
    this.isActive = true;
    this.currentStep = -1;
    this.next();
  }

  /** Stop presentation mode */
  public stop(): void {
    this.isActive = false;
    this.currentStep = -1;
  }

  /** Go to next step */
  public next(): boolean {
    if (this.currentStep >= this.steps.length - 1) return false;
    this.currentStep++;
    this.goToStep(this.currentStep);
    return true;
  }

  /** Go to previous step */
  public previous(): boolean {
    if (this.currentStep <= 0) return false;
    this.currentStep--;
    this.goToStep(this.currentStep);
    return true;
  }

  /**
   * Go to a specific step, smoothly panning+zooming the viewport so the step's
   * node is centered (P3). Pass duration 0 for an instant jump.
   */
  public goToStep(index: number, duration: number = 450): void {
    if (index < 0 || index >= this.steps.length) return;

    this.currentStep = index;
    const step = this.steps[index];
    const node: any = this.slate.nodes.one(step.nodeId);
    if (!node) return;

    // Center on the node's WORLD center. The target viewbox has the node's
    // center in the middle; its dimensions come from the target zoom: at zoom Z
    // the viewbox is (containerPx / Z), i.e. current viewbox scaled by
    // (currentZoom / Z). We then tween the viewbox from current → target.
    try {
      const o = node.options || {};
      const nx = (o.x || 0) + (o.width || 0) / 2;
      const ny = (o.y || 0) + (o.height || 0) / 2;

      const canvas = (this.slate as any).canvas;
      const vb = canvas.viewbox();
      const zc = (this.slate as any).panZoom?.getZoom?.() ?? 1;
      const tw = (vb.width * zc) / this.zoomLevel;
      const th = (vb.height * zc) / this.zoomLevel;
      const target = { x: nx - tw / 2, y: ny - th / 2, width: tw, height: th };
      this.animateViewbox(
        { x: vb.x, y: vb.y, width: vb.width, height: vb.height },
        target,
        duration
      );
    } catch {
      // Best-effort pan/zoom
    }

    // Select the node
    this.slate.selectNodes([node], false);
  }

  private _animRaf: number | null = null;

  /** Tween the canvas viewbox from → to over `duration` ms (easeInOutQuad). */
  private animateViewbox(
    from: { x: number; y: number; width: number; height: number },
    to: { x: number; y: number; width: number; height: number },
    duration: number
  ): void {
    const canvas = (this.slate as any).canvas;
    const set = (x: number, y: number, w: number, h: number) => {
      try {
        canvas.viewbox(x, y, w, h);
      } catch {
        /* noop */
      }
    };
    if (this._animRaf != null) {
      try {
        cancelAnimationFrame(this._animRaf);
      } catch {
        /* noop */
      }
      this._animRaf = null;
    }
    if (!duration || duration <= 0 || typeof requestAnimationFrame === "undefined") {
      set(to.x, to.y, to.width, to.height);
      return;
    }
    const ease = (t: number) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    let startTs: number | null = null;
    const tick = (now: number) => {
      if (startTs === null) startTs = now;
      const p = Math.min(1, (now - startTs) / duration);
      const e = ease(p);
      set(
        from.x + (to.x - from.x) * e,
        from.y + (to.y - from.y) * e,
        from.width + (to.width - from.width) * e,
        from.height + (to.height - from.height) * e
      );
      if (p < 1) this._animRaf = requestAnimationFrame(tick);
      else this._animRaf = null;
    };
    this._animRaf = requestAnimationFrame(tick);
  }

  /** Get current step index */
  public getCurrentStep(): number {
    return this.currentStep;
  }

  /** Get total steps */
  public getTotalSteps(): number {
    return this.steps.length;
  }

  /** Check if presentation is active */
  public isPresenting(): boolean {
    return this.isActive;
  }

  /** Destroy the presentation, stopping if active */
  public destroy(): void {
    this.stop();
    this.steps = [];
    this.currentStep = -1;
    (this as any).slate = null;
  }
}
