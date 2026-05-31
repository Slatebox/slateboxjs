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

  /** Go to a specific step */
  public goToStep(index: number): void {
    if (index < 0 || index >= this.steps.length) return;

    this.currentStep = index;
    const step = this.steps[index];
    const node = this.slate.nodes.one(step.nodeId);
    if (!node) return;

    // Zoom and pan to the node
    try {
      const bbox = node.svgGroup.bbox();
      const cx = bbox.x + bbox.width / 2;
      const cy = bbox.y + bbox.height / 2;

      this.slate.pan({ x: -cx + 400, y: -cy + 300 });
      this.slate.zoom(1.5);
    } catch {
      // Best-effort pan/zoom
    }

    // Select the node
    this.slate.selectNodes([node], false);
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
}
