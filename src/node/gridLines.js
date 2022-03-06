/* eslint-disable no-param-reassign */
import utils from '../helpers/utils'

export default class gridLines {
  constructor(slate, node) {
    this.slate = slate
    this.node = node
    this.guideWings = 20000
    this.guideAttrs = { 'stroke-dasharray': '--', stroke: '#000' }
    this.guideLines = {
      rightVerticals: {},
      leftVerticals: {},
      topHorizontals: {},
      bottomHorizontals: {},
    }
  }

  clear() {
    const self = this
    ;[
      'rightVerticals',
      'leftVerticals',
      'topHorizontals',
      'bottomHorizontals',
    ].forEach((p) => {
      if (self.guideLines[p]) {
        Object.keys(self.guideLines[p]).forEach((k) =>
          self.guideLines[p][k].remove()
        )
      }
      self.guideLines[p] = {}
    })
  }

  draw(
    id,
    dx,
    dy,
    bb,
    translateNode = true,
    guideVisibleAt = 100,
    guideSnapAt = 20
  ) {
    const self = this
    const snapToObjects =
      self.slate.options.viewPort.snapToObjects != null
        ? self.slate.options.viewPort.snapToObjects
        : true
    let pinnedY = false
    let pinnedX = false
    const nbb = self.node.vect.getBBox()
    self.guideAttrs.stroke = utils.whiteOrBlack(
      self.slate.options.containerStyle.backgroundColor
    )

    // RIGHT VERTICAL LINE boundary
    if (
      (nbb.x - bb.x2 < guideVisibleAt && nbb.x - bb.x2 >= 0) ||
      (bb.x2 - nbb.x2 < guideVisibleAt && bb.x2 - nbb.x2 >= 0)
    ) {
      if (!self.guideLines.rightVerticals[id]) {
        self.guideLines.rightVerticals[id] = self.slate.paper
          .path(
            `M ${bb.x2} ${bb.y - self.guideWings} L ${bb.x2} ${
              bb.y2 + self.guideWings
            }`
          )
          .attr(self.guideAttrs)
      }
      pinnedX =
        (nbb.x - bb.x2 < guideSnapAt && nbb.x - bb.x2 >= 0) ||
        (bb.x2 - nbb.x2 < guideSnapAt && bb.x2 - nbb.x2 >= 0)
      if (pinnedX && snapToObjects) {
        if (nbb.x - bb.x2 < guideSnapAt && nbb.x - bb.x2 >= 0) {
          dx -= nbb.x - bb.x2
        } else {
          dx += bb.x2 - nbb.x2
        }
      }
    } else {
      self.guideLines?.rightVerticals[id]?.remove()
      delete self.guideLines?.rightVerticals[id]
    }

    // LEFT VERTICAL LINE boundary
    if (
      !pinnedX &&
      ((bb.x - nbb.x2 < guideVisibleAt && bb.x - nbb.x2 >= 0) ||
        (nbb.x - bb.x < guideVisibleAt && nbb.x - bb.x >= 0))
    ) {
      if (!self.guideLines.leftVerticals[id]) {
        self.guideLines.leftVerticals[id] = self.slate.paper
          .path(
            `M ${bb.x} ${bb.y - self.guideWings} L ${bb.x} ${
              bb.y2 + self.guideWings
            }`
          )
          .attr(self.guideAttrs)
      }
      pinnedX =
        (bb.x - nbb.x2 < guideSnapAt && bb.x - nbb.x2 >= 0) ||
        (nbb.x - bb.x < guideSnapAt && nbb.x - bb.x >= 0)
      if (pinnedX && snapToObjects) {
        if (bb.x - nbb.x2 < guideSnapAt && bb.x - nbb.x2 >= 0) {
          dx += bb.x - nbb.x2
        } else {
          dx -= nbb.x - bb.x
        }
      }
    } else {
      self.guideLines?.leftVerticals[id]?.remove()
      delete self.guideLines?.leftVerticals[id]
    }

    // TOP HORIZONTAL LINE boundary
    if (
      (bb.y - nbb.y2 < guideVisibleAt && bb.y - nbb.y2 >= 0) ||
      (nbb.y - bb.y < guideVisibleAt && nbb.y - bb.y >= 0)
    ) {
      if (!self.guideLines.topHorizontals[id]) {
        self.guideLines.topHorizontals[id] = self.slate.paper
          .path(
            `M ${bb.x - self.guideWings} ${bb.y} L ${bb.x2 + self.guideWings} ${
              bb.y
            }`
          )
          .attr(self.guideAttrs)
      }
      pinnedY =
        (bb.y - nbb.y2 < guideSnapAt && bb.y - nbb.y2 >= 0) ||
        (nbb.y - bb.y < guideSnapAt && nbb.y - bb.y >= 0)
      if (pinnedY && snapToObjects) {
        if (bb.y - nbb.y2 < guideSnapAt && bb.y - nbb.y2 >= 0) {
          // coming from top
          dy += bb.y - nbb.y2
        } else {
          // coming from underneath
          dy -= nbb.y - bb.y
        }
      }
    } else {
      self.guideLines?.topHorizontals[id]?.remove()
      delete self.guideLines?.topHorizontals[id]
    }

    // BOTTOM HORIZONTAL LINE boundary
    if (
      !pinnedY &&
      ((nbb.y - bb.y2 < guideVisibleAt && nbb.y - bb.y2 >= 0) ||
        (bb.y2 - nbb.y2 < guideVisibleAt && bb.y2 - nbb.y2 >= 0))
    ) {
      if (!self.guideLines.bottomHorizontals[id]) {
        self.guideLines.bottomHorizontals[id] = self.slate.paper
          .path(
            `M ${bb.x - self.guideWings} ${bb.y2} L ${
              bb.x2 + self.guideWings
            } ${bb.y2}`
          )
          .attr(self.guideAttrs)
      }
      pinnedY =
        (nbb.y - bb.y2 < guideSnapAt && nbb.y - bb.y2 >= 0) ||
        (bb.y2 - nbb.y2 < guideSnapAt && bb.y2 - nbb.y2 >= 0)
      if (pinnedY && snapToObjects) {
        if (nbb.y - bb.y2 < guideSnapAt && nbb.y - bb.y2 >= 0) {
          dy -= nbb.y - bb.y2
        } else {
          dy += bb.y2 - nbb.y2
        }
      }
    } else {
      self.guideLines?.bottomHorizontals[id]?.remove()
      delete self.guideLines?.bottomHorizontals[id]
    }

    if (translateNode && (pinnedX || pinnedY)) {
      self.node.translateWith({ dx, dy })
    }

    return { dx, dy }
  }
}
