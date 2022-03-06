/* eslint-disable */
import sbIcons from '../../helpers/sbIcons.js'

export const shapes = function (R) {
  const c =
    'M16,1.466C7.973,1.466,1.466,7.973,1.466,16c0,8.027,6.507,14.534,14.534,14.534c8.027,0,14.534-6.507,14.534-14.534C30.534,7.973,24.027,1.466,16,1.466z'

  const { icons } = sbIcons

  R.fn.handle = function (x, y) {
    return this.path(icons.handle + c)
  }

  R.fn.editor = function (x, y) {
    return this.path(icons.editor + c)
  }

  R.fn.deleter = function (x, y) {
    return this.path(icons.deleter + c)
  }

  R.fn.trash = function () {
    return this.path(icons.trash + c).attr({ fill: '#000' })
  }

  R.fn.searcher = function (x, y) {
    return this.path(icons.searcher + c)
  }

  R.fn.plus = function (x, y) {
    return this.path(icons.plus + c)
  }

  R.fn.merge = function (x, y) {
    return this.path(icons.plus + c)
  }

  R.fn.copy = function (x, y) {
    return this.path(icons.copy + c)
  }

  R.fn.minus = function (x, y) {
    return this.path(icons.minus + c)
  }

  R.fn.link = function (x, y) {
    return this.path(icons.link + c)
  }

  R.fn.up = function (x, y) {
    return this.path(icons.up)
  }

  R.fn.down = function (x, y) {
    return this.path(icons.up).transform('r180')
  }

  R.fn.setting = function (x, y) {
    return this.path(icons.settings + c).transform('s,.9,.9')
  }

  R.fn.arrow = function () {
    return this.path(icons.arrow + c)
  }

  R.fn.arrowHead = function () {
    return this.path(icons.arrowHead)
      .attr({ fill: '#648CB2' })
      .transform('s0.7')
  }

  R.fn.linkArrow = function () {
    return this.path(icons.arrow + c).attr({ fill: '#648CB2' })
  }

  R.fn.lockClosed = function () {
    return this.path(icons.lockClosed)
  }

  R.fn.lockOpen = function () {
    return this.path(icons.lockOpen)
  }

  R.fn.speechbubble = function (x, y, txt) {
    const _bubble = this.set()
    _bubble
      .push(
        this.path(icons.speechbubble)
          .transform(['t', x, ',', y].join())
          .scale(6, 4)
          .scale(-1, 1)
      )
      .attr({ fill: '#fff', stroke: '#000', 'stroke-width': 3 })
    _bubble.push(this.text(x + 10, y + 10, txt).attr({ 'font-size': 12 }))
    return _bubble
  }

  R.fn.undo = function (path) {
    return this.path(icons.undo)
  }

  R.fn.redo = function (path) {
    return this.path(icons.undo).transform('s-1,1')
  }

  R.fn.resize = function () {
    return this.path(
      `M24 10.999v-10.999h-11l3.379 3.379-13.001 13-3.378-3.378v10.999h11l-3.379-3.379 13.001-13z`
    )
  }

  R.fn.resizeLines = function () {
    return this.image(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAXCAYAAAAP6L+eAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAEBJREFUeNpiYKAuYAPijUD8n1aGVowaOmoo/QyNpYWh+UB8g1aGSowaOmroqKEEAE0MZaCVoQxEFH3e5BgKEGAAnnVBs4ro6nUAAAAASUVORK5CYII=',
      0,
      0,
      22,
      23
    )
  }
}
