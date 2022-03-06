/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import throttle from 'lodash.throttle'
import clone from 'lodash.clone'
import kdTree from 'static-kdtree'
import { Raphael } from '../deps/raphael/raphael.svg'
import utils from '../helpers/utils'
import sbIcons from '../helpers/sbIcons'

export default class resize {
  constructor(slate, node) {
    const self = this

    self.slate = slate
    self.node = node
    self.resize = null
    self.resizeTemp = null

    self.origX = null
    self.origY = null
    self.lastDx = null
    self.lastDy = null
    self._minWidth = 5
    self._minHeight = 5
    self._dragAllowed = false
    self._origWidth = null
    self._origHeight = null
    self._isResizing = false
    self.origPath = null
    self.origPoint = {}

    self.resizeEvents = {
      start() {
        const s = this

        self.node.toggleImage({ active: true, keepResizerOpen: true })
        self.origPath = self.node.options.vectorPath
        self.origPoint = self.node.options.rotate.point
        self.origX = self.resizeTemp.attr('x')
        self.origY = self.resizeTemp.attr('y')
        self.node.options.hasResized = true

        // create a huge dragging area in order to prevent mouse from losing focus on the correct element
        self.resizeTemp.attr({
          x: self.resizeTemp.attr('x') - 1000,
          y: self.resizeTemp.attr('y') - 1000,
          width: 10000,
          height: 10000,
        })

        self.slate.isBeingResized = true

        self.node.relationships.updateAssociationsWith({
          activeNode: self.node.options.id,
          currentDx: 0,
          currentDy: 0,
          action: 'resize',
        })

        self.lastDx = 0
        self.lastDy = 0
        const bbr = self.resize.getBBox()
        self.resize.ox = bbr.x
        self.resize.oy = bbr.y

        self._isResizing = true

        self.slate.multiSelection?.end()

        // the resize coords at the start
        s.ox = s.attr('x')
        s.oy = s.attr('y')

        self.node.setStartDrag()
        self.node.connectors.remove()
        self.node.rotate.hide()

        self._dragAllowed = self.slate.options.allowDrag
        self.slate.disable(false, true)

        if (self.node.options.text !== ' ') {
          self._minWidth = 10
          self._minHeight = 10
        }

        self._origWidth = self.node.options.width
        self._origHeight = self.node.options.height

        self.foreignPoints = self.slate.nodes.allNodes
          .filter((n) => n.options.id !== self.node.options.id)
          .map((n) => ({
            id: n.options.id,
            bbox: n.vect.getBBox(),
            point: [n.options.xPos, n.options.yPos],
          }))
        self.kdTree = kdTree(self.foreignPoints.map((fp) => fp.point))
        self.node.relationships.conditionallyHideAll()
        self.slate.toggleFilters(false)
      },
      move(dx, dy) {
        const s = this
        try {
          const _zr = self.slate.options.viewPort.zoom.r

          // for snapping
          if (
            self.slate.options.viewPort.showGrid &&
            self.slate.options.viewPort.snapToGrid
          ) {
            const gridSize = self.slate.options.viewPort.gridSize || 10
            dx = Math.round(dx / gridSize) * gridSize
            dy = Math.round(dy / gridSize) * gridSize
          }

          dx += dx / _zr - dx
          dy += dy / _zr - dy

          const nearest = self.kdTree.knn(
            [node.options.xPos, node.options.yPos],
            5
          )
          nearest.forEach((n) => {
            self.node.gridLines.draw(
              self.foreignPoints[n].id,
              dx,
              dy,
              self.foreignPoints[n].bbox,
              false,
              200
            )
          })

          let transWidth = self._origWidth + dx * 2
          let transHeight = self._origHeight + dy * 2

          if (
            self.slate.isCtrl &&
            self.node.options.origVectWidth &&
            self.node.options.origVectHeight
          ) {
            const max = Math.max(transWidth, transHeight)
            // keep it proportional to the original dimensions unless ctrl is pressed while resizing
            if (max === transWidth) {
              // change width
              transWidth =
                (self.node.options.origVectWidth * transHeight) /
                self.node.options.origVectHeight
            } else {
              // change height
              transHeight =
                (self.node.options.origVectHeight * transWidth) /
                self.node.options.origVectWidth
            }
          }

          if (transWidth > self._minWidth) {
            s.attr({ x: s.ox + dx })
          } else {
            // tx = 0;
            s.attr({ x: s.ox })
          }

          if (transHeight > self._minHeight) {
            s.attr({ y: s.oy + dy })
          } else {
            // ty = 0;
            s.attr({ y: s.oy })
          }
          // if (transWidth > self._minWidth && transHeight > self._minHeight) {
          const ts = `T${dx}, ${dy}`
          self.resize.transform(ts)
          // }

          self.node.events?.onResizing?.apply(self, [transWidth, transHeight])

          self.set(transWidth, transHeight, {
            isMoving: true,
            getRotationPoint: self.node.options.rotate.rotationAngle,
          })
          self.node.images.imageSizeCorrection() // self is a potential performance choke point
          self.lastDx = dx * 2
          self.lastDy = dy * 2
        } catch (err) {
          finalize()
        }
      },
      async up() {
        self.slate.toggleFilters(false)
        finalize()
      },
    }

    function finalize() {
      // self.resizeTemp.attr({ x: self.origX + self.lastDx, y: self.origY + self.lastDy, width: self.resize.attr("width"), height: self.resize.attr("height") });

      // self.node.options.vectorPath = _optimizedContext.path;
      self.node.vect.attr({ path: self.node.options.vectorPath })
      self.node.relationships.showAll(true)
      self.slate.isBeingResized = false

      self._isResizing = false
      self.slate.enable(false, true)
      self.resize.remove()
      self.resizeTemp.remove()
      self.node.setEndDrag()
      // self.node.relationships.wireHoverEvents();

      const _bbox = self.node.vect.getBBox()
      self.node.toggleImage({
        active: false,
        width: _bbox.width,
        height: _bbox.height,
      })

      self.node.options.width = _bbox.width
      self.node.options.height = _bbox.height
      self.node.options.xPos = _bbox.x
      self.node.options.yPos = _bbox.y

      self.node.editor.setTextOffset()
      self.node.text.attr(
        self.node.textCoords({
          x: self.node.options.xPos,
          y: self.node.options.yPos,
        })
      )

      self.node.gridLines.clear()
      delete self.foreignPoints
      delete self.kdTree

      if (self.node.events && self.node.events?.onResized) {
        self.node.events.onResized.apply(self, [self.send])
      } else {
        self.send()
      }
    }
  }

  show(x, y) {
    const self = this
    if (self.node.options.allowResize) {
      self.resizeTemp?.remove()
      const r = self.slate.paper
      const resizePath = utils._transformPath(
        sbIcons.icons.resize,
        `t${x - 5},${y - 5} r95`
      )
      self.resize = r.path(resizePath).attr({ fill: '#fff', stroke: '#000' })
      self.resizeTemp = r
        .rect(x - 6, y - 6, 20, 20)
        .attr({ fill: '#f00', opacity: 0.00000001 })
        .toFront()

      self.resizeTemp.mouseover((e) => {
        self.node.overMenuButton = true
        self.resizeTemp.attr({ cursor: 'pointer' })
      })

      self.resizeTemp.mouseout((e) => {
        self.node.overMenuButton = false
      })

      self.resizeTemp.drag(
        self.resizeEvents.move,
        self.resizeEvents.start,
        self.resizeEvents.up
      )

      return self.resize
    }
  }

  hide() {
    this.resizeTemp?.remove()
    this.resize?.remove()
  }

  send() {
    // broadcast change to birdsEye and collaborators
    const textAttrs = this.node.text.attrs
    const pkg = {
      type: 'onNodeResized',
      data: {
        id: this.node.options.id,
        textPosition: {
          x: textAttrs.x,
          y: textAttrs.y,
        },
        rotate: this.node.options.rotate,
        vectorPath: this.node.options.vectorPath,
        associations: this.node.relationships.associations.map((a) => ({
          parentId: a.parent.options.id,
          childId: a.child.options.id,
          linePath: a.line.attr('path').toString(),
        })),
      },
    }
    const currentRotationPoint = clone(this.node.options.rotate.point)
    this.slate.birdsEye?.nodeChanged(pkg)
    this.node.options.rotate.point = currentRotationPoint
    this.slate.collab?.send(pkg)
  }

  lazySend() {
    throttle(this.send, 700)
  }

  animateSet(data, opts) {
    const self = this
    self.node.text.animate(
      data.textPosition,
      opts.duration || 500,
      opts.easing || '>'
    )
    self.node.vect.animate(
      {
        path: data.vectorPath,
        transform: `R${data.rotate.rotationAngle}, ${data.rotate.point.x}, ${data.rotate.point.y}`,
      },
      opts.duration || 500,
      opts.easing || '>',
      () => {
        const { image, imageOrigHeight, imageOrigWidth } = self.node.options
        if (image && !!imageOrigHeight && !!imageOrigWidth) {
          self.node.images.imageSizeCorrection()
        }
      }
    )

    opts.associations.forEach((assoc) => {
      const a = self.node.relationships.associations.find(
        (ax) =>
          ax.parent.options.id === assoc.parentId &&
          ax.child.options.id === assoc.childId
      )
      if (opts.animate) {
        if (a) {
          a.line.animate(
            { path: assoc.linePath },
            opts.duration || 500,
            opts.easing || '>',
            () => {
              a.line.attr({ path: assoc.linePath })
            }
          )
        }
      } else if (a) a.line.attr({ path: assoc.linePath })
    })
  }

  set(width, height, opts = {}) {
    // let latt, tatt;
    const self = this

    let pathWithPotentialTransformations = self.node.vect
      .attr('path')
      .toString()

    if (opts.getRotationPoint) {
      self.origPoint = self.node.options.rotate.point
    }

    if (
      self.origPoint &&
      Object.entries(self.origPoint).length > 0 &&
      self.node.options.rotate.rotationAngle > 0
    ) {
      pathWithPotentialTransformations = Raphael.transformPath(
        pathWithPotentialTransformations,
        `R${self.node.options.rotate.rotationAngle}, ${self.origPoint.x}, ${self.origPoint.y}`
      )
    }

    self.node.vect.transform('')
    self.node.text.transform('')
    self.node.vect.attr({ path: pathWithPotentialTransformations })
    self.node.text.attr({ path: pathWithPotentialTransformations })
    const rotationBB = self.node.vect.getBBox()

    let widthScalar = 1
    let heightScalar = 1

    if (width > self._minWidth) {
      widthScalar = width / rotationBB.width
      self.node.options.width = width
    } else {
      widthScalar = self._minWidth / rotationBB.width
      self.node.options.width = self._minWidth
    }

    if (height > self._minHeight) {
      heightScalar = height / rotationBB.height
      self.node.options.height = height
    } else {
      heightScalar = self._minHeight / rotationBB.height
      self.node.options.height = self._minHeight
    }

    const scaleTransform = `s${widthScalar}, ${heightScalar}`
    const scaledVectPath = Raphael.transformPath(
      self.node.vect.attr('path').toString(),
      scaleTransform
    ).toString()
    pathWithPotentialTransformations = scaledVectPath
    self.node.vect.attr({ path: scaledVectPath })
    if (
      self.origPoint &&
      Object.entries(self.origPoint).length > 0 &&
      self.node.options.rotate.rotationAngle > 0
    ) {
      pathWithPotentialTransformations = Raphael.transformPath(
        pathWithPotentialTransformations,
        `R${-self.node.options.rotate.rotationAngle}, ${self.origPoint.x}, ${
          self.origPoint.y
        }`
      ).toString()
    }
    self.node.vect.attr({ path: pathWithPotentialTransformations })
    self.node.options.vectorPath = pathWithPotentialTransformations
    const noRotationBB = self.node.vect.getBBox()

    self.node.options.rotate.point = {
      x: noRotationBB.cx,
      y: noRotationBB.cy,
    }
    self.node.setPosition({ x: noRotationBB.x, y: noRotationBB.y }, true)

    self.node.rotate.applyImageRotation()

    const lc = self.node.linkCoords()
    self.node.link.transform(
      ['t', lc.x, ',', lc.y, 's', '.8', ',', '.8', 'r', '180'].join()
    )
    self.node.relationships.refreshOwnRelationships()

    self.node.editor.setTextOffset()
    self.node.text.attr(
      self.node.textCoords({
        x: self.node.options.xPos,
        y: self.node.options.yPos,
      })
    )
  }
}
