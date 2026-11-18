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
    let nodes = [...this.slate.nodes.allNodes];

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

  /**
   * Build the hierarchical presentation layout (preziData) — a tree of root
   * nodes → children with per-node metrics + descriptions. This is the structure
   * the AI consumes to decide the presentation ORDER (ported from v1
   * slate.extractPresentationLayout). Bbox is relative to the content top-left.
   */
  public extractPresentationLayout(): any {
    const all: any[] = this.slate.nodes?.allNodes || [];
    const nodes = all.filter((n) => !n.options?.isCategory);

    // Content bounds (orientation) for relative bbox coordinates.
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    nodes.forEach((n) => {
      const o = n.options || {};
      minX = Math.min(minX, o.x || 0);
      minY = Math.min(minY, o.y || 0);
      maxX = Math.max(maxX, (o.x || 0) + (o.width || 0));
      maxY = Math.max(maxY, (o.y || 0) + (o.height || 0));
    });
    if (!isFinite(minX)) {
      minX = 0;
      minY = 0;
      maxX = 0;
      maxY = 0;
    }
    const orient = { left: minX, top: minY, width: maxX - minX, height: maxY - minY };

    const byId = new Map<string, any>(nodes.map((n) => [n.id, n]));
    const childIdsOf = (node: any): string[] =>
      (node.relationships?.associations || [])
        .map((a: any) => a.childId)
        .filter((id: string) => byId.has(id));
    const childIds = new Set(nodes.flatMap(childIdsOf));

    const processed = new Set<string>();
    const processNode = (node: any): any => {
      if (processed.has(node.id)) return null;
      processed.add(node.id);
      const o = node.options || {};
      const children = childIdsOf(node)
        .map((id) => byId.get(id))
        .filter(Boolean);
      return {
        nodeId: node.id,
        metrics: {
          rotation: Math.ceil(o.rotate?.rotationAngle || 0),
          bbox: {
            x: Number(((o.x || 0) - orient.left).toFixed(2)),
            y: Number(((o.y || 0) - orient.top).toFixed(2)),
            width: Number((o.width || 0).toFixed(2)),
            height: Number((o.height || 0).toFixed(2)),
          },
        },
        description: o.text || o.description || "",
        image: o.image,
        numberOfChildrenNodes: children.length,
        childrenNodes: children.map(processNode).filter(Boolean),
      };
    };

    const roots = nodes.filter((node) => !childIds.has(node.id)).map(processNode);
    // A disconnected loop has no parentless node. Start a tree for each
    // unvisited component so its scenes have bounds and the camera can visit it.
    for (const node of nodes) {
      if (!processed.has(node.id)) roots.push(processNode(node));
    }
    return {
      presentationHeight: Math.ceil(orient.height),
      presentationWidth: Math.ceil(orient.width),
      nodes: roots,
    };
  }

  /**
   * Set the step order explicitly (e.g. from the AI's returned ordering). IDs
   * that don't exist are skipped; any nodes the AI omitted are appended in the
   * default layout order so nothing is lost.
   */
  public setStepOrder(nodeIds: string[]): PresentationStep[] {
    const all: any[] = this.slate.nodes?.allNodes || [];
    const exists = new Set(all.map((n) => n.id));
    const seen = new Set<string>();
    const ordered: string[] = [];
    (nodeIds || []).forEach((id) => {
      if (exists.has(id) && !seen.has(id)) {
        seen.add(id);
        ordered.push(id);
      }
    });
    // Append any missing nodes in default order.
    this.extractLayout().forEach((s) => {
      if (!seen.has(s.nodeId)) {
        seen.add(s.nodeId);
        ordered.push(s.nodeId);
      }
    });
    this.steps = ordered.map((nodeId, index) => ({ nodeId, index }));
    this.currentStep = -1;
    return this.steps;
  }

  /** Start presentation mode */
  public start(duration = 450): void {
    if (this.steps.length === 0) {
      this.extractLayout();
    }
    this.isActive = true;
    this.currentStep = -1;
    this.next(duration);
  }

  /** Stop presentation mode */
  public stop(): void {
    this.isActive = false;
    this.currentStep = -1;
    if (this._animRaf !== null) {
      cancelAnimationFrame(this._animRaf);
      this._animRaf = null;
    }
  }

  /** Go to next step */
  public next(duration = 450): boolean {
    if (this.currentStep >= this.steps.length - 1) return false;
    this.currentStep++;
    this.goToStep(this.currentStep, duration);
    return true;
  }

  /** Go to previous step */
  public previous(duration = 450): boolean {
    if (this.currentStep <= 0) return false;
    this.currentStep--;
    this.goToStep(this.currentStep, duration);
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

    // Each step is an absolute camera position. The gesture plugin's reported
    // zoom is deliberately 1 when gestures are disabled, even after a fit.
    try {
      const o = node.options;
      const width = o.width || 0;
      const height = o.height || 0;
      const nx = (o.x || 0) + width / 2;
      const ny = (o.y || 0) + height / 2;
      const canvas = this.slate.canvas;
      const vb = canvas.viewbox();
      const viewport = this.slate.panZoom.getViewportSize();
      const radians = (o.rotate?.rotationAngle || 0) * Math.PI / 180;
      const cos = Math.abs(Math.cos(radians));
      const sin = Math.abs(Math.sin(radians));
      const frameWidth = Math.max(1, width * cos + height * sin);
      const frameHeight = Math.max(1, height * cos + width * sin);
      const zoom = Math.min(this.zoomLevel > 0 ? this.zoomLevel : 1,
        0.9 * viewport.w / frameWidth, 0.9 * viewport.h / frameHeight);
      const tw = viewport.w / zoom;
      const th = viewport.h / zoom;
      const target = { x: nx - tw / 2, y: ny - th / 2, width: tw, height: th };
      this.animateViewbox(
        { x: vb.x, y: vb.y, width: vb.width, height: vb.height },
        target,
        duration
      );
    } catch {
      // Best-effort pan/zoom
    }
    // Note: intentionally do NOT select the node — presentation is a clean,
    // read-only view (no edit toolbar / handles / connection anchors).
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
