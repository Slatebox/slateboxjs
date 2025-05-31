/* eslint-disable no-underscore-dangle */
import utils from '../helpers/utils';

export default class grid {
  constructor(slate) {
    this.slate = slate;
    this._grid = null;
    if (this.slate.options.viewPort.showGrid) {
      this.show();
    }
  }

  setGrid() {
    // Grid is now handled by FabricJS canvas rendering instead of SVG patterns
    const gbg = this.slate.options.containerStyle.backgroundColor;
    const gridColor = utils.whiteOrBlack(gbg);

    if (!this.slate.options.viewPort.gridSize) {
      this.slate.options.viewPort.gridSize = 50;
    }

    this.gridColor = gridColor;
  }

  show() {
    const self = this;
    this.setGrid();

    // Create FabricJS-based grid instead of SVG patterns
    const { gridSize } = self.slate.options.viewPort;
    const canvas = self.slate.paper;
    const width = self.slate.options.viewPort.width;
    const height = self.slate.options.viewPort.height;

    // Create a group to hold all grid lines
    const gridLines = [];

    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      const line = new fabric.Line([x, 0, x, height], {
        stroke: self.gridColor,
        strokeWidth: x % (gridSize * 10) === 0 ? 1 : 0.5,
        selectable: false,
        evented: false,
        excludeFromExport: true,
      });
      gridLines.push(line);
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      const line = new fabric.Line([0, y, width, y], {
        stroke: self.gridColor,
        strokeWidth: y % (gridSize * 10) === 0 ? 1 : 0.5,
        selectable: false,
        evented: false,
        excludeFromExport: true,
      });
      gridLines.push(line);
    }

    // Create group and add to canvas
    self._grid = new fabric.Group(gridLines, {
      selectable: false,
      evented: false,
      excludeFromExport: true,
    });

    canvas.add(self._grid);
    self._grid.sendToBack();
    canvas.renderAll();
  }

  toBack() {
    if (this._grid) {
      this._grid.sendToBack();
      this.slate.paper.renderAll();
    }
  }

  destroy() {
    if (this._grid) {
      this.slate.paper.remove(this._grid);
      this._grid = null;
    }
  }
}
