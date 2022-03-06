/* eslint-disable new-cap */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import kdTree from 'static-kdtree'
import refreshRelationships from '../helpers/refreshRelationships'
import getHorizontalCurve from '../helpers/getHorizontalCurve'
import utils from '../helpers/utils'
import sbIcons from '../helpers/sbIcons'
import node from '../core/node'

export default class relationships {
  constructor(slate, node) {
    const self = this
    self.slate = slate
    self.node = node
    self.PATH_COMPLEXITY_LIMIT = 100000
    self.associations = []
    self._isLastAlt = false
    self._isLastShift = false
    self.selectedNodes = []
    self.relationshipsToTranslate = []
    self.relationshipsToRefresh = []
    self._dx = 0
    self._dy = 0
    self.collabSent = null
    self.ft = null
    self.kdTree = null
    self.gracefulClear = null

    self.dragEvents = {
      move(dx, dy) {
        self.enactMove(dx, dy)
      },
      async up() {
        self.finishDrag(true)
      },
      dragger(x, y, e) {
        if (!self.slate.canvas.isDragging) {
          self.node.toggleImage({ active: true })
          // self.slate.canvas._bg?.hide();
          if (self.node.events?.onClick) {
            self.node.events.onClick.apply(self, [
              function () {
                self._initDrag(self, e)
              },
            ])
          } else {
            self._initDrag(self, e)
          }
        }
      },
    }
  }

  showMenu(e) {
    const self = this
    self.slate.nodes.closeAllMenus({ exception: self.node.options.id })
    self.slate.enable()
    if (
      self.node?.menu?.show &&
      self.node.options.allowMenu &&
      !self.node.menu.isOpen()
    ) {
      if (self.node?.options.groupId) {
        self.slate.multiSelection.showGroup(self.node?.options.groupId)
      }
      self.node.menu.show()
    }
    utils.stopEvent(e)
  }

  finishDrag(blnBroadcast) {
    const self = this
    self.selectedNodes.forEach((nd) => {
      // the transformPath here converts the transient transforms that happened during the movement
      // to become permanent on the "attr" properties.
      utils.transformPath(nd, `T${self._dx},${self._dy}`)
      nd.vect.currentDx = 0
      nd.vect.currentDy = 0
      nd.editor.setTextOffset()
    })

    refreshRelationships({
      relationships: self.relationshipsToRefresh,
      nodes: self.selectedNodes,
      dx: 0,
      dy: 0,
    })
    self.slate.nodes.saveRelationships(self.relationshipsToTranslate, {
      dx: self._dx,
      dy: self._dy,
    })

    if (blnBroadcast) {
      self.send({
        nodes: self.selectedNodes,
        relationships: self.relationshipsToRefresh.concat(
          self.relationshipsToTranslate
        ),
      })
      self.selectedNodes.forEach((n) => {
        n.relationships.showAll(true)
      })

      if (self.foreignPoints?.length > 0) {
        self.kdTree.dispose()
        delete self.foreignPoints
        clearTimeout(self.gracefulClear)
        self.gracefulClear = setTimeout(() => {
          self.node.gridLines.clear()
        }, 200)
      }
    }

    // console.log("here we go", self.selectedNodes);
    // self.slate.canvas._bg?.show();
    self.slate.toggleFilters(false)
    self.showMenu()
  }

  enactMove(dx, dy, blnFinish) {
    const self = this

    dx = Math.ceil(dx)
    dy = Math.ceil(dy)

    // adjust the dx and dy if snapping to grid
    // if (slate.options.viewPort.showGrid && slate.options.viewPort.snapToGrid) {
    //   let gridSize = slate.options.viewPort.gridSize || 10;
    //   dx = Math.round(dx / gridSize) * gridSize;
    //   dy = Math.round(dy / gridSize) * gridSize;
    // }

    const z = self.slate.options.viewPort.zoom.r
    dx += dx / z - dx
    dy += dy / z - dy

    self.selectedNodes.forEach((nd, i) => {
      nd.vect.currentDx = dx
      nd.vect.currentDy = dy
      nd.translateWith({ dx, dy })

      // console.log("yPos ", i, node.options.yPos);

      // only snap and show guidelines for primary moving node, none of its children
      if (i === 0 && nd.options.id !== self.slate.tempNodeId) {
        // const nbb = node.vect.getBBox();
        const nearest = self.kdTree.knn([nd.options.xPos, nd.options.yPos], 2) // , 1);

        nearest.forEach((n) => {
          ;({ dx, dy } = self.node.gridLines.draw(
            self.foreignPoints[n].id,
            dx,
            dy,
            self.foreignPoints[n].bbox
          ))
        })
      }
    })

    self.slate.nodes.translateRelationships(self.relationshipsToTranslate, {
      dx,
      dy,
    })
    refreshRelationships({
      relationships: self.relationshipsToRefresh,
      nodes: self.selectedNodes,
      dx,
      dy,
    })

    self._dx = dx
    self._dy = dy

    if (blnFinish) {
      self.finishDrag(false)
    }
  }

  _broadcast(pkg) {
    this.slate.collab?.send(pkg)
  }

  _hitTest(mp) {
    const self = this
    let overNode = null
    const off = utils.positionedOffset(self.slate.options.container)
    self.slate.nodes.allNodes.forEach((nd) => {
      if (
        nd.options.id !== self.slate.tempNodeId &&
        nd.options.id !== self.node.options.id &&
        nd.options.allowContext &&
        nd.options.allowResize
      ) {
        const _bb = nd.vect.getBBox()

        const _zr = self.slate.options.viewPort.zoom.r
        const xp = self.slate.options.viewPort.left + mp.x - off.left
        const yp = self.slate.options.viewPort.top + mp.y - off.top

        const c = {
          x: xp + (xp / _zr - xp),
          y: yp + (yp / _zr - yp),
        }

        if (
          c.x > _bb.x &&
          c.x < _bb.x + _bb.width &&
          c.y > _bb.y &&
          c.y < _bb.y + _bb.height
        ) {
          overNode = nd
        }
      }
    })
    return overNode
  }

  _remove(associations, type, obj) {
    const _na = []
    const self = this
    associations.forEach((association) => {
      if (association[type].options.id === obj.options.id) {
        self.removeRelationship(association)
      } else {
        _na.push(association)
      }
    })
    return _na
  }

  _initDrag(vect, e) {
    const self = this
    self.selectedNodes = []
    self.relationshipsToRefresh = []
    self.relationshipsToTranslate = []
    self.collabSent = false
    self._dx = 0
    self._dy = 0
    self.slate.multiSelection?.end()
    if (self.slate.options.linking) {
      self.slate.options.linking.onNode.apply(vect, [self])
    } else if (self.node.options.allowDrag && !self.node.options.disableDrag) {
      self.selectedNodes = self.getSelectedNodes()
      const _associations = self.slate.nodes.getRelevantAssociationsWith(
        self.selectedNodes
      )
      self.relationshipsToTranslate = _associations.relationshipsToTranslate
      self.relationshipsToRefresh = _associations.relationshipsToRefresh
      self.selectedNodes.forEach((n) => {
        n.setStartDrag()
        n.vect.ox = n.options.xPos
        n.vect.oy = n.options.yPos
      })
      const selectedIds = self.selectedNodes.map((n) => n.options.id)
      self.foreignPoints = self.slate.nodes.allNodes
        .filter((n) => selectedIds.indexOf(n.options.id) === -1)
        .map((n) => ({
          id: n.options.id,
          bbox: n.vect.getBBox(),
          point: [n.options.xPos, n.options.yPos],
        }))
      self.kdTree = kdTree(self.foreignPoints.map((fp) => fp.point))
      self.conditionallyHideAll()
    } else {
      utils.stopEvent(e)
    }
  }

  async initiateTempNode(e, _parent, _assocPkg) {
    const self = this
    const mp = utils.mousePos(e)
    const _slate = _parent.slate

    const off = utils.positionedOffset(_slate.options.container)

    const _zr = self.slate.options.viewPort.zoom.r
    const xp = _slate.options.viewPort.left + mp.x - off.left
    const yp = _slate.options.viewPort.top + mp.y - off.top

    const _xPos = xp + (xp / _zr - xp)
    const _yPos = yp + (yp / _zr - yp)

    const _path = utils._transformPath(
      sbIcons.icons.handle,
      `T${_xPos - 15}, ${_yPos - 15}`
    )
    const _tempNode = new node({
      id: self.slate.tempNodeId,
      xPos: _xPos,
      yPos: _yPos,
      lineColor: '#990000',
      backgroundColor: '#ffffff',
      vectorPath: _path,
      width: 30,
      height: 30,
    })

    _slate.nodes.add(_tempNode, true)
    const _tempRelationship = _parent.relationships.addAssociation(
      _tempNode,
      _assocPkg,
      true
    )

    _tempRelationship.hoveredOver = null
    _tempRelationship.lastHoveredOver = null

    // initiates the drag
    _tempNode.vect.start(e) // , off.x, off.y);
    _slate.options.allowDrag = false

    _tempNode.vect.mousemove((ex) => {
      // is there a current hit?
      if (_tempRelationship.hoveredOver === null) {
        _tempRelationship.hoveredOver = self._hitTest(utils.mousePos(ex))
        if (_tempRelationship.hoveredOver !== null) {
          // yes, currently over a node -- scale it
          _tempRelationship.hoveredOver.vect.animate(
            { 'stroke-width': 5 },
            500,
            () => {
              _tempRelationship.hoveredOver.vect.animate(
                { 'stroke-width': self.node.options.borderWidth },
                500,
                () => {
                  _tempRelationship.hoveredOver = null
                }
              )
            }
          )
        }
      }
    })

    _tempNode.vect.mouseup((ex) => {
      _parent.relationships.removeAssociation(_tempNode)
      _tempNode.slate.nodes.remove(_tempNode)

      const overNode = self._hitTest(utils.mousePos(ex))
      if (overNode !== null) {
        // overNode.vect.transform("s1,1,");
        // check if overNode has any parents
        const _relevantAssociations =
          overNode.relationships.associations.filter(
            (association) =>
              overNode.options.id === association.child.options.id
          )
        overNode.options.parents = _relevantAssociations.map(
          (a) => a.parent.options.id
        )
        // check if the two nodes are already associated -- multiple associations between two nodes are currently not supported
        const relevantAssociation = _parent.relationships.associations.find(
          (association) =>
            (association.child.options.id === overNode.options.id &&
              association.parent.options.id === _parent.options.id) ||
            (association.parent.options.id === overNode.options.id &&
              association.child.options.id === _parent.options.id)
        )
        if (!relevantAssociation) {
          _parent.relationships.addAssociation(overNode, _assocPkg)
          const _pkgx = {
            type: 'addRelationship',
            data: {
              type: 'association',
              parent: _parent.options.id,
              child: overNode.options.id,
            },
          }
          self.slate.birdsEye?.relationshipsChanged(_pkgx)
          self._broadcast(_pkgx)
        }
      }

      if (self.slate.options.enabled) _parent.slate.options.allowDrag = true
    })
  }

  _visibility(action) {
    if (this.node.options.id !== this.slate.tempNodeId) {
      for (
        let i = this.associations.length;
        i < this.associations.length;
        i += 1
      ) {
        this.associations[i].line[action]()
      }
    }
  }

  removeAll() {
    const self = this
    self.associations.forEach((association) => {
      association.child.relationships.removeAssociation(self.node) // .parent);
      association.parent.relationships.removeAssociation(self.node)
      self.removeRelationship(association)
    })
    self.associations = []
  }

  removeAssociation(_node) {
    this.associations = this._remove(this.associations, 'child', _node)
    this.associations = this._remove(this.associations, 'parent', _node)
    return this
  }

  setKeys({ isShift, isAlt }) {
    this._isLastShift = isShift
    this._isLastAlt = isAlt
  }

  addAssociation(_node, assocPkg) {
    assocPkg = assocPkg || {}

    // make sure this doesn't already exist
    let _connection = this.associations.find(
      (a) => a.child.options.id === _node.options.id
    )

    if (!_connection) {
      const _copts = {
        id: utils.guid(),
        parent: this.node,
        child: _node,
        lineColor: assocPkg.lineColor || this.node.options.lineColor,
        lineWidth: assocPkg.lineWidth || this.node.options.lineWidth,
        lineOpacity: assocPkg.lineOpacity || this.node.options.lineOpacity,
        lineEffect: assocPkg.lineEffect || this.node.options.lineEffect,
        blnStraight: assocPkg.isStraightLine || false,
        showParentArrow:
          assocPkg.showParentArrow ||
          this.node.options.parentArrowForChildren.includes(_node.options.id),
        showChildArrow:
          assocPkg.showChildArrow ||
          !this.node.options.noChildArrowForChildren.includes(_node.options.id),
      }

      _connection = this.createNewRelationship(_copts)
      _connection.line.toBack()

      this.associations.push(_connection)
      _node.relationships.associations.push(_connection)

      this.wireLineEvents(_connection)
    }

    _node.slate.allLines.push(_connection) // helper for managing raw line attrs

    return _connection
  }

  createNewRelationship(opts) {
    const { paper } = this.slate

    const association = {
      parent: null,
      child: null,
      lineColor: '#fff',
      lineOpacity: 1,
      lineEffect: '',
      lineWidth: 20,
      blnStraight: false,
      showParentArrow: false,
      showChildArrow: true,
    }
    Object.assign(association, opts)

    const _attr = {
      stroke: association.lineColor,
      class: 'association',
      fill: 'none',
      'stroke-width': association.lineWidth,
      'fill-opacity': association.lineOpacity,
      filter: association.lineEffect ? `url(#${association.lineEffect})` : '',
      opacity: association.lineOpacity,
    }

    // these two generic points will be adjusted after the line is created
    const origPoint = { x: 1, y: 1 }
    const endPoint = { x: 200, y: 200 }
    if (!association.line) {
      Object.assign(association, {
        line: paper.path(getHorizontalCurve(origPoint, endPoint)).attr(_attr),
      })
    }
    if (association.child && association.parent) {
      refreshRelationships({
        relationships: [association],
        nodes: [association.parent],
      })
    }

    return association
  }

  removeRelationship(association) {
    const self = this
    self.node.slate?.allLines.splice(
      self.slate?.allLines.findIndex((l) => l.id === association.id)
    )
    association.line.remove()
  }

  wireLineEvents(c) {
    const self = this
    if (self.node.options.allowMenu) {
      c.line.node.style.cursor = 'pointer'
      c.line.mousedown((e) => {
        utils.stopEvent(e)
        self.node.lineOptions.show(e, c)
      })
      self.slate?.grid.toBack()
      self.slate?.canvas.bgToBack()
    }
  }

  getSelectedNodes() {
    const self = this
    self.selectedNodes = []
    if (self.node.options.isLocked === false) {
      self.selectedNodes.push(self.node)
      this.syncAssociations(self.node, (c, a) => {
        if (
          !self.selectedNodes.some((n) => n.options.id === c.options.id) &&
          c.options.isLocked === false
        ) {
          self.selectedNodes.push(c)
        }
      })
    }
    return self.selectedNodes
  }

  syncAssociations(nd, cb) {
    const self = this
    if (!self.slate.isCtrl || (self.slate.isCtrl && self.slate.isShift)) {
      nd.relationships.associations.forEach((a) => {
        if (
          a.child.options.id !== self.node.options.id &&
          a.child.options.id !== nd.options.id
        ) {
          if (cb) cb(a.child, a)
          if (self.slate.isCtrl && self.slate.isShift) {
            self.syncAssociations(a.child, cb)
          }
        }
      })
    }
  }

  updateAssociationsWith(opts) {
    const conditionalSet = {}
    if (opts.conditional) {
      opts.conditional.forEach((setContext, i) => {
        conditionalSet[i] = setContext
      })
      delete opts.conditional
    }
    this.associations.forEach((a) => {
      Object.assign(a, opts)
      Object.keys(conditionalSet).forEach((sc) => {
        const setContext = conditionalSet[sc]
        if (setContext.condition(a, setContext.data)) {
          a[setContext.key] = setContext.getValue(a, setContext.data)
        }
      })
    })
  }

  updateSingleAssociationWith(key, opts) {
    const association = this.associations.find(a, key)
    if (association) Object.assign(association, opts)
  }

  send(opts) {
    if (
      this.node.context &&
      !this.node.context.isVisible() &&
      this.node.options.allowDrag &&
      !this.node.options.disableDrag
    ) {
      const pkg = {
        type: 'onNodesMove',
      }

      if (opts.nodes && opts.relationships) {
        pkg.data = this.slate.nodes.nodeMovePackage({
          nodes: opts.nodes,
          relationships: opts.relationships,
        })
      } else {
        pkg.data = this.slate.nodes.nodeMovePackage()
      }
      this.slate.collab?.send(pkg)
      this.slate.birdsEye?.nodeChanged(pkg)
      this.collabSent = true
    }
  }

  conditionallyHideAll() {
    const self = this
    if (self.node.options.id !== self.slate.tempNodeId) {
      const exceeds =
        self.node.options.vectorPath.length > self.PATH_COMPLEXITY_LIMIT
      if (exceeds) {
        self.hideAll(true)
      }
      self.associations.forEach((a) => {
        const cexceed =
          exceeds ||
          a.child.options.vectorPath.length > self.PATH_COMPLEXITY_LIMIT
        a.child.relationships.hideAll(cexceed)
      })
    }
  }

  hideAll(_blnOverride) {
    if ((this.slate.isAlt && this.slate.isShift) || _blnOverride)
      this._visibility('hide')
  }

  hideOwn() {
    this.associations.forEach((association) => {
      association.line.hide()
    })
  }

  showOwn() {
    this.associations.forEach((association) => {
      association.line.show()
    })
  }

  showAll(_blnOverride) {
    if ((this._isLastAlt && this._isLastShift) || _blnOverride)
      this._visibility('show')
  }

  refreshOwnRelationships() {
    refreshRelationships({
      relationships: this.associations,
      nodes: [this.node],
    })
  }

  wireDragEvents() {
    const self = this

    function showText() {
      self.slate.events?.onTextPaneRequested?.apply(this, [self.node, () => {}])
    }

    if (
      !self.slate.isReadOnly() &&
      (!self.slate.isCommentOnly() ||
        (self.slate.isCommentOnly() && self.node.options.isComment))
    ) {
      self.node.vect.drag(
        self.dragEvents.move,
        self.dragEvents.dragger,
        self.dragEvents.up
      )
      self.node.text.mousedown((e) => {
        self.node.vect.start(e)
      })

      self.node.vect.dblclick(() => {
        showText()
      })
      self.node.text.dblclick(() => {
        showText()
      })
    }
  }
}
