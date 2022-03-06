/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
import kdTree from 'static-kdtree'
import utils from '../helpers/utils'

export default class rotate {
  static getRotationAngle(origPoint, newPoint, centerPoint) {
    const vx = origPoint.x - centerPoint.x
    const vy = origPoint.y - centerPoint.y
    const ux = newPoint.x - centerPoint.x
    const uy = newPoint.y - centerPoint.y
    const magnitudeV = Math.sqrt(vx ** 2 + vy ** 2)
    const magnitudeU = Math.sqrt(ux ** 2 + uy ** 2)
    let angleDegrees
    if (
      (vx === 0 && vy === 0) ||
      (ux === 0 && uy === 0) ||
      (vx === ux && vy === uy)
    ) {
      // at least one vector is the 0 vector and the angle between u and v doesn't exist
    } else {
      const cosine = (vx * ux + vy * uy) / (magnitudeV * magnitudeU)
      const angleRadians = Math.acos(cosine)
      angleDegrees = (angleRadians * 180) / Math.PI // unsigned angle

      const detVxU = vx * uy - vy * ux // cross product of V and U (VxU)
      if (detVxU < 0) {
        angleDegrees = -angleDegrees // add negative sign
      } else {
        // no need to do anything because angle sign is correct
      }
    }
    return angleDegrees
  }

  rta() {
    const self = this
    self.rotate.transform(
      `R${self.rotationAngle}, ${self.origCenter.x}, ${self.origCenter.y}`
    )
    const rotationContext = {
      rotate: {
        rotationAngle:
          (self.node.options.rotate.rotationAngle + self.rotationAngle) % 360,
        point: self.origCenter,
      },
    }
    const transformString = self.node.getTransformString(rotationContext)
    self.node.vect.transform(transformString)
    self.node.text.transform(transformString)
  }

  constructor(slate, node) {
    const self = this
    self.slate = slate
    self.node = node
    self.rotate = null
    self.rotateTemp = null
    self._dragAllowed = false
    self._isResizing = false
    self._initPosFix = false
    self.origCenter = {} // during rotation raphael changes the center point of bbox for some reason
    self.rotationAngle = null
    self.relationshipsToTranslate = []
    self.relationshipsToRefresh = []
    self.selectedNodes = []
    self.rotateEvents = {
      start() {
        const s = this

        self.selectedNodes = self.node.relationships.getSelectedNodes()
        const _associations = self.slate.nodes.getRelevantAssociationsWith(
          self.selectedNodes
        )
        self.relationshipsToTranslate = _associations.relationshipsToTranslate
        self.relationshipsToRefresh = _associations.relationshipsToRefresh

        self.slate.isBeingResized = true
        self._initPosFix = false
        self.rotateTemp.attr({
          x: self.rotateTemp.attr('x') - 1000,
          y: self.rotateTemp.attr('y') - 1000,
          width: 10000,
          height: 10000,
        })

        self.rotate.ox = self.rotate.attr('x')
        self.rotate.oy = self.rotate.attr('y')

        self.node.relationships.updateAssociationsWith({
          activeNode: self.node.options.id,
          currentDx: 0,
          currentDy: 0,
          action: 'rotate',
        })

        self._isResizing = true
        const tempPath = self.slate.paper.path(self.node.vect.attr('path'))
        const noRotationBB = tempPath.getBBox()

        if (
          !self.node.options.rotate?.point ||
          Object.entries(self.node.options.rotate.point).length === 0
        ) {
          self.node.options.rotate.point = {
            x: noRotationBB.cx,
            y: noRotationBB.cy,
          }
        }
        tempPath.remove()
        self.slate.multiSelection?.end()
        s.ox = noRotationBB.x
        s.oy = noRotationBB.y
        self.origCenter = self.node.options.rotate.point

        self.foreignPoints = self.slate.nodes.allNodes
          .filter((n) => n.options.id !== self.node.options.id)
          .map((n) => ({
            id: n.options.id,
            bbox: n.vect.getBBox(),
            point: [n.options.xPos, n.options.yPos],
          }))
        self.kdTree = kdTree(self.foreignPoints.map((fp) => fp.point))

        self.node.setStartDrag()
        self.node.connectors.remove()
        self.node.resize.hide()
        self._dragAllowed = self.slate.options.allowDrag
        self.slate.disable(false, true)
        self.slate.toggleFilters(true, self.node.options.id)
      },
      move(dx, dy) {
        const s = this
        try {
          // for snapping
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

          /*
          Rotation angle is obtained using vector properties. Further explanation can be found here: https://stackoverflow.com/questions/10507620/finding-the-angle-between-vectors
          Vectors are of form:
          v = <vx, vy>
          u = <ux, uy>
          Notation explanation:
          ||v|| - magnitude of vector v
          v . u - dot product of vectors u and v (commutative)
          v x u - cross product of vectors v and u (not commutative!); for 2D vectors it is essentially the determinant of a 2D matrix created by v and u
    
          cos(angle) = (v . u)/(||v|| * ||u||)
          angle = arccos((v . u)/(||v|| * ||u||))
          angle is unsigned, i.e. it assumes values 0 and PI radians
    
          If v x u < 0 then the angle needs a negative sign; otherwise the sign is already correct.
    
          If either vector is a 0 vector, i.e. v = <0, 0> or u = <0, 0> then the angle between v and u does not exist
          and the function will return an undefined angle.
    
          The returned angle is converted to degrees and is between -180 and 180.
          */

          self.rotationAngle = rotate.getRotationAngle(
            { x: s.ox, y: s.oy },
            { x: s.ox + dx, y: s.oy + dy },
            self.origCenter
          )

          if (self.rotationAngle) {
            // const _ra = Math.abs(Math.ceil(self.node.vect.matrix.split().rotate));
            // const _ra = Math.abs(Math.ceil(self.rotationAngle)); //

            // if (!self.node.snappedAt && ([0, 45, 90, 135, 180, 225, 270].indexOf(_ra) > -1)) { //% 45 === 0 || _ra === 0 || (_ra + 1) % 270 === 0)) {
            //   console.log("snapped ra is ", self.node.options.rotate.rotationAngle, self.rotationAngle, _ra, self.node.vect.matrix.split().rotate);
            //   //self.rotationAngle = _ra;
            //   //self.rotationAngle = Math.abs(Math.ceil(self.rotationAngle));
            //   self.node.snappedAt = _ra; // self.rotationAngle;
            //   _rta();
            // } else if (self.rotationAngle >= self.node.snappedAt + 25 || self.rotationAngle <= self.node.snappedAt - 25) {
            //   delete self.node.snappedAt;
            // }

            if (!self.node.snappedAt) {
              self.rta()
            }
          }
        } catch (err) {
          finalize()
        }
      },
      up() {
        finalize()
        self.slate.toggleFilters(false, self.node.options.id)
      },
    }

    function finalize() {
      const _ran = self.node.snappedAt || self.rotationAngle
      if (_ran) {
        const rotationContext = {
          rotationAngle: (self.node.options.rotate.rotationAngle + _ran) % 360,
          point: self.origCenter,
        }
        Object.assign(self.node.options.rotate, rotationContext)

        const bb = self.node.vect.getBBox()

        self.node.options.width = bb.width
        self.node.options.height = bb.height

        self.rotateTemp.remove()

        self.node.relationships.updateAssociationsWith({
          rotationAngle: self.node.options.rotate.rotationAngle,
        })

        self.node.gridLines.clear()
        delete self.foreignPoints
        delete self.kdTree

        delete self.node.snappedAt
      }

      self.slate.isBeingResized = false
      self.node.menu.hide()
      self._isResizing = false
      self.slate.enable(false, true)
      self.node.setEndDrag()
      self.node.relationships.refreshOwnRelationships()
      self.node.relationships.showOwn()

      self.rotate.remove()

      if (self.node.events?.onRotated?.apply) {
        self.node.events?.onRotated?.apply(self, [_self.send])
      } else {
        self.send()
      }
    }
  }

  show(x, y) {
    const self = this

    if (self.node.options.allowResize) {
      self.rotateTemp?.remove()
      const r = self.slate.paper
      self.rotate = r
        .path(
          'M16.659,24c-5.078,0-9.213-3.987-9.475-9h2.975l-4.5-5l-4.5,5h3.025 c0.264,6.671,5.74,12,12.475,12c3.197,0,6.104-1.21,8.315-3.185l-2.122-2.122C21.188,23.127,19.027,24,16.659,24z M29.133,14c-0.265-6.669-5.74-12-12.475-12c-3.197,0-6.104,1.21-8.315,3.185   l2.122,2.122C12.129,5.873,14.29,5,16.659,5c5.077,0,9.213,3.987,9.475,9h-2.975l4.5,5l4.5-5H29.133z'
        )
        .attr({ fill: '#fff', stroke: '#000', x: x - 5, y: y - 5 })
      let rotatePathBB = self.rotate.getBBox()
      const rotatePathString = utils._transformPath(
        self.rotate.attr('path'),
        `T${x - rotatePathBB.x - 15},${y - rotatePathBB.y - 15}`
      )
      self.rotate.attr({ path: rotatePathString })
      rotatePathBB = self.rotate.getBBox()
      self.rotateTemp = r
        .rect(
          rotatePathBB.x,
          rotatePathBB.y,
          rotatePathBB.width,
          rotatePathBB.height
        )
        .attr({ fill: '#f00', opacity: 0.00000001 })
        .toFront()
      self.rotate.mouseover((e) => {
        self.rotate.attr({ cursor: 'alias' })
      })

      self.rotateTemp.mouseover((e) => {
        self.rotateTemp.attr({ cursor: 'alias' })
      })

      self.rotateTemp.drag(
        self.rotateEvents.move,
        self.rotateEvents.start,
        self.rotateEvents.up
      )
    }
    return self.rotate
  }

  hide() {
    this.rotate?.remove()
    this.rotateTemp?.remove()
  }

  send() {
    // broadcast change to birdsEye and collaborators
    const pkg = {
      type: 'onNodeRotated',
      data: {
        id: this.node.options.id,
        rotate: this.node.options.rotate,
        textOffset: this.node.options.textOffset,
        imageOrigWidth: this.node.options.imageOrigWidth,
        imageOrigHeight: this.node.options.imageOrigHeight,
        associations: this.node.relationships.associations.map((a) => ({
          parentId: a.parent.options.id,
          childId: a.child.options.id,
          linePath: a.line.attr('path').toString(),
        })),
      },
    }
    this.slate.birdsEye?.nodeChanged(pkg)
    this.slate.collab?.send(pkg)
  }

  applyImageRotation(opts = {}) {
    const { r } = this.slate.options.viewPort.zoom
    this.node.vect.transform('')
    this.node.text.transform('')
    const boundingClientRect =
      opts.boundingClientRect || this.node.vect[0].getBoundingClientRect()

    // clone current node to get actual dimensions with no hidden transforms (transform("") doesn't affect bbox -- it still has dimensions as if transforms were still there)
    const tempPath = this.slate.paper.path(this.node.vect.attr('path'))
    const bb = tempPath.getBBox()

    const transformString = this.node.getTransformString(opts)
    this.node.vect.transform(transformString)
    this.node.text.transform(transformString)

    if (this.node.vect.pattern) {
      const img = this.node.vect.pattern.getElementsByTagName('image')[0]
      img.setAttribute('y', (boundingClientRect.height / r - bb.height) / 2 - 4)
      img.setAttribute('x', (boundingClientRect.width / r - bb.width) / 2 - 4)
    }
    tempPath.remove()
  }

  animateSet(data, opts) {
    const self = this

    const transformString = `...R${data.rotationAngle},${data.rotate.point.x}, ${data.rotate.point.y}`

    self.node.vect.animate(
      { transform: transformString },
      opts.duration || 500,
      opts.easing || '>',
      () => {
        const tstr = self.node.getTransformString()
        self.node.vect.transform(tstr)
        // self.node.text.transform(tstr);
        if (opts.cb) opts.cb()
      }
    )

    self.node.text.animate(
      { transform: transformString },
      opts.duration || 500,
      opts.easing || '>',
      () => {
        const tstr = self.node.getTransformString()
        self.node.text.transform(tstr)
      }
    )

    opts.associations.forEach((assoc) => {
      const a = self.node.relationships.associations.find(
        (ax) =>
          ax.parent.options.id === assoc.parentId &&
          ax.child.options.id === assoc.childId
      )
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
    })
  }
}
