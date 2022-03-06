/* eslint-disable no-underscore-dangle */
import utils from '../helpers/utils'

export default class grid {
  constructor(slate) {
    this.slate = slate
    this._grid = null

    // produce the required grid patterns
    // <defs>
    //   <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
    //     <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" stroke-width="0.5"/>
    //   </pattern>
    //   <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
    //     <rect width="100" height="100" fill="url(#smallGrid)"/>
    //     <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" stroke-width="1"/>
    //   </pattern>
    // </defs>`;
  }

  setGrid() {
    const gbg = this.slate.options.containerStyle.backgroundColor
    const gridColor = utils.whiteOrBlack(gbg)

    if (!this.slate.options.viewPort.gridSize) {
      this.slate.options.viewPort.gridSize = 50
    }
    const { gridSize } = this.slate.options.viewPort

    this.slate.paper.def({
      tag: 'pattern',
      id: 'sbSmallGrid',
      height: gridSize,
      width: gridSize,
      patternUnits: 'userSpaceOnUse',
      inside: [
        {
          type: 'path',
          attrs: {
            d: `M ${gridSize} 0 L 0 0 0 ${gridSize}`,
            fill: 'none',
            stroke: gridColor,
            'stroke-width': '0.5',
          },
        },
      ],
    })
    this.slate.paper.def({
      tag: 'pattern',
      id: 'sbGrid',
      height: gridSize * 10,
      width: gridSize * 10,
      patternUnits: 'userSpaceOnUse',
      inside: [
        {
          type: 'rect',
          attrs: {
            width: gridSize * 10,
            height: gridSize * 10,
            fill: 'url(#sbSmallGrid)',
          },
        },
        {
          type: 'path',
          attrs: {
            d: `M ${gridSize * 10} 0 L 0 0 0 ${gridSize * 10}`,
            fill: 'none',
            stroke: gridColor,
            'stroke-width': '0.5',
          },
        },
      ],
    })
  }

  show() {
    const self = this
    this.setGrid()
    self._grid = self.slate.paper
      .rect(
        0,
        0,
        self.slate.options.viewPort.width,
        self.slate.options.viewPort.height
      )
      .attr({ fill: 'url(#sbGrid)' })
      .toBack()
    self.slate.canvas.bgToBack()
  }

  toBack() {
    this._grid?.toBack()
  }

  destroy() {
    this._grid?.remove()
  }
}
