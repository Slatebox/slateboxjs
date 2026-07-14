/**
 * Grid.ts - Grid overlay and snap-to-grid functionality
 */

export interface GridOptions {
  enabled?: boolean;
  gridSize?: number;
  gridColor?: string;
  gridOpacity?: number;
  snapToGrid?: boolean;
  snapToObjects?: boolean;
}

export class Grid {
  private slate: any;
  private options: GridOptions;
  private gridGroup: any = null;
  private isVisible: boolean = false;

  constructor(slate: any, options: GridOptions = {}) {
    this.slate = slate;
    this.options = {
      enabled: false,
      gridSize: 20,
      gridColor: "#e0e0e0",
      gridOpacity: 0.5,
      snapToGrid: false,
      snapToObjects: false,
      ...options,
    };
  }

  /** Show the grid overlay */
  public show(): void {
    if (this.isVisible) return;

    this.isVisible = true;
    this.render();
  }

  /** Hide the grid overlay */
  public hide(): void {
    this.isVisible = false;
    if (this.gridGroup) {
      this.gridGroup.remove();
      this.gridGroup = null;
    }
  }

  /** Destroy the grid and clean up */
  public destroy(): void {
    this.hide();
  }

  /** Toggle grid visibility */
  public toggle(): void {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }

  /** Check if grid is currently visible */
  public isShown(): boolean {
    return this.isVisible;
  }

  /** Snap a coordinate to the nearest grid point */
  public snapPoint(
    x: number,
    y: number
  ): { x: number; y: number } {
    if (!this.options.snapToGrid) return { x, y };

    const size = this.options.gridSize!;
    return {
      x: Math.round(x / size) * size,
      y: Math.round(y / size) * size,
    };
  }

  /** Update grid options */
  public updateOptions(options: Partial<GridOptions>): void {
    Object.assign(this.options, options);
    if (this.isVisible) {
      this.hide();
      this.show();
    }
  }

  // ─── Private ─────────────────────────────────────────────────────

  private render(): void {
    if (!this.slate.canvas) return;

    // Remove old grid
    if (this.gridGroup) {
      this.gridGroup.remove();
    }

    const canvas = this.slate.canvas;
    const viewbox = canvas.viewbox();
    const size = this.options.gridSize!;
    const color = this.options.gridColor!;
    const opacity = this.options.gridOpacity!;

    // Extend grid beyond viewbox for panning
    const startX = Math.floor(viewbox.x / size) * size - size * 5;
    const startY = Math.floor(viewbox.y / size) * size - size * 5;
    const endX = viewbox.x + viewbox.width + size * 5;
    const endY = viewbox.y + viewbox.height + size * 5;

    this.gridGroup = canvas.group().attr("pointer-events", "none");

    // Draw vertical lines
    for (let x = startX; x <= endX; x += size) {
      this.gridGroup
        .line(x, startY, x, endY)
        .stroke({ color, width: 0.5, opacity });
    }

    // Draw horizontal lines
    for (let y = startY; y <= endY; y += size) {
      this.gridGroup
        .line(startX, y, endX, y)
        .stroke({ color, width: 0.5, opacity });
    }

    // Send grid to back
    this.gridGroup.back();
  }
}
