/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
import base from './base'
import getTransformedPath from '../helpers/getTransformedPath'
import utils from '../helpers/utils'

export default class node extends base {
  constructor(options) {
    super()
    this._lock = null
    this._openLock = null
    this.lm = null
    this.options = {
      id: utils.guid(),
      name: '',
      text: '',
      image: '',
      groupId: null,
      xPos: 0,
      yPos: 0,
      height: 10,
      width: 10,
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: '#000',
      borderOpacity: 1,
      lineColor: '#000000',
      lineOpacity: 1,
      lineEffect: '',
      lineWidth: 5,
      opacity: 1,
      textOpacity: 1,
      showDelete: true,
      showAddAndDeleteConditionally: false,
      showResize: true,
      showAdd: true,
      showRelationshipConnector: true,
      showRelationshipDelete: true,
      showRelationshipProperties: true,
      showRelationshipReassign: true,
      showRotate: true,
      showMenu: true,
      showColorTab: true,
      showTextTab: true,
      showShapeTab: true,
      showImageTab: true,
      showEffectTab: true,
      spaceBetweenNodesWhenAdding: 30,
      disableMenuAsTemplate: false,
      disableDrag: false, // lower level than allowDrag to permanently disable
      allowDrag: true,
      allowMenu: true,
      allowContext: true,
      allowResize: true,
      isLocked: false,
      isComment: false,
      backgroundColor: '90-#031634-#2D579A',
      foregroundColor: '#fff',
      fontSize: 18,
      fontFamily: 'Roboto',
      fontStyle: 'normal',
      vectorPath: '',
      rotate: {
        rotationAngle: 0,
      },
      textOffset: {
        x: 0,
        y: 0,
        width: 10,
        height: 10,
      },
      textBounds: {
        x: 0,
        y: 0,
        width: 10,
        height: 10,
      },
      textXAlign: 'middle',
      textYAlign: 'middle',
      link: {
        show: false,
        type: '',
        data: '',
        thumbnail: { width: 175, height: 175 },
      },
      parentArrowForChildren: [], // parent arrows are not displayed by default
      noChildArrowForChildren: [], // child arrows are displayed by default
      filters: {
        vect: null,
        text: null,
        line: null,
      },
    }

    Object.assign(this.options, options)
    if (this.options.name === '') this.options.name = this.options.id

    this.constants = {
      statusPanelAtRest: 33,
      statusPanelExpanded: 200,
    }
  }

  // get vect() {
  //   return this.vect;
  // }

  // get text() {
  //   return this.text;
  // }

  // get link() {
  //   return this.link;
  // }

  // set vect(val) {
  //   this.vect = val;
  // }

  // set text(val) {
  //   this.text = val;
  // }

  // set link(val) {
  //   this.link = val;
  // }

  _url(opt) {
    return this.options.ajax.rootUrl + this.options.ajax.urlFlavor + opt
  }

  del() {
    const _unlinkId = this.options.id

    this.slate.nodes.closeAllMenus()
    this.slate.nodes.closeAllLineOptions()
    this.relationships.removeAll()

    this.slate.options.allowDrag = true

    // unlink any links
    this.slate.nodes.allNodes.forEach((nd) => {
      if (
        nd.options.link &&
        nd.options.link.show &&
        nd.options.link.data === _unlinkId
      ) {
        Object.assign(nd.options.link, { show: false, type: '', data: '' })
        nd.link.hide()
      }
    })

    this.slate.nodes.remove(this)
  }

  getTransformString(opts = {}) {
    const _transforms = []
    let rotationTransform

    if (opts.action === 'resize') {
      const resizeTransform = `s${opts.sx},${opts.sy}`
      _transforms.push(resizeTransform)
    }

    if (opts.rotate) {
      rotationTransform = `R${opts.rotate.rotationAngle}, ${opts.rotate.point.x}, ${opts.rotate.point.y}`
    } else if (this.options.rotate.rotationAngle) {
      rotationTransform = `R${this.options.rotate.rotationAngle}, ${
        this.options.rotate.point.x - (opts.dx || 0)
      }, ${this.options.rotate.point.y - (opts.dy || 0)}`
    }
    if (rotationTransform) {
      _transforms.push(rotationTransform)
    }

    if (opts.action === 'translate') {
      const translationTransform = `T${opts.dx}, ${opts.dy}`
      // console.log("node transform string ", translationTransform);
      _transforms.push(translationTransform)
    }

    return _transforms.join(' ')
  }

  rotateMoveVector({ dx, dy }) {
    const _rotationAngle = (-this.options.rotate.rotationAngle * Math.PI) / 180 // conversion to radians
    return {
      dx: dx * Math.cos(_rotationAngle) - dy * Math.sin(_rotationAngle),
      dy: dx * Math.sin(_rotationAngle) + dy * Math.cos(_rotationAngle),
    }
  }

  translateWith({ dx, dy }) {
    // need a rotateMoveVector for both the vect and the text
    const newMoveVector = this.rotateMoveVector({ dx, dy })
    const translateContext = {
      action: 'translate',
      dx: newMoveVector.dx,
      dy: newMoveVector.dy,
    }

    const transformString = this.getTransformString(translateContext)

    // during movement, the only thing that is updated is the transform property on
    // both the text and vect -- the actual attr update happens at the "up" in the
    // relationships.js module -- and the transform("") there causes these transient
    // transforms to be removed and replaced with the permanent attr updates.
    // note the "up" function there calls into the utils.transformPath on Slatebox.js
    // proper where the transform("") and the attr permanent record is done.
    this.vect.transform(transformString)
    this.text.transform(transformString)
    this.setPosition({ x: this.vect.ox + dx, y: this.vect.oy + dy })
  }

  setPosition(p, blnKeepMenusOpen, activeNode, opts = {}) {
    this.options.xPos = p.x
    this.options.yPos = p.y

    const lc = this.linkCoords()
    // not setting the text attr here -- this is
    // this.text.attr(this.textCoords(p));
    // this.text.attr(this.textCoords({x: this.options.xPos, y: this.options.yPos = p.y });
    this.link.transform(
      ['t', lc.x, ',', lc.y, 's', '.8', ',', '.8', 'r', '180'].join()
    )

    // close all open menus
    if (blnKeepMenusOpen !== true) {
      this.slate.nodes.closeAllMenus({ exception: activeNode })
      this.slate.nodes.closeAllLineOptions()
    }
  }

  setStartDrag() {
    this.slate.options.allowDrag = false
    // this.slate.stopEditing();
    this.connectors && this.connectors.reset()
    this.context && this.context.remove()
  }

  setEndDrag() {
    if (this.slate && this.slate.options.enabled) {
      // could be null in case of the tempNode
      this.slate.options.allowDrag = true
    }
    this.slate.displayLocks()
  }

  serialize(lineWidthOverride) {
    const self = this
    const jsonNode = {}
    Object.assign(jsonNode, {
      options: self.options,
    })
    jsonNode.relationships = { associations: [] } // , children: []
    self.relationships.associations.forEach((association) => {
      jsonNode.relationships.associations.push(
        self._bindRel(association, lineWidthOverride)
      )
    })
    return jsonNode
  }

  _bindRel(obj, lineWidthOverride) {
    return {
      childId: obj.child.options.id,
      parentId: obj.parent.options.id,
      isStraightLine: obj.blnStraight,
      lineColor: obj.lineColor,
      lineEffect: obj.lineEffect,
      lineOpacity: obj.lineOpacity,
      lineWidth: lineWidthOverride || obj.lineWidth,
    }
  }

  addRelationships(json, cb) {
    // add parents
    const self = this
    const _lines = []
    if (json.relationships) {
      // add associations
      if (
        json.relationships &&
        json.relationships.associations &&
        json.relationships.associations.forEach
      ) {
        json.relationships.associations.forEach((association) => {
          const _pr = association
          let _pn = null
          self.slate.nodes.allNodes.forEach((node) => {
            if (
              node.options.id === _pr.parentId &&
              self.options.id !== node.options.id
            ) {
              _pn = node
            }
          })
          if (_pn) {
            const _conn = _pn.relationships.addAssociation(self, _pr)
            _lines.push(_conn.line)
          }
        })
      }
    }
    cb?.apply(self, [_lines])
  }

  toFront() {
    this.relationships?.associations?.forEach((assoc) => {
      assoc.line.toFront()
    })

    this.vect.toFront()
    this.text.toFront()
    this.link.toFront()
    this.slate?.grid.toBack()
    this.slate?.canvas.bgToBack()

    this.slate.reorderNodes()
  }

  toBack() {
    this.link.toBack()
    this.text.toBack()
    this.vect.toBack()
    this.relationships?.associations?.forEach((assoc) => {
      assoc.line.toBack()
    })

    this.slate?.grid.toBack()
    this.slate?.canvas.bgToBack()
    this.slate.reorderNodes()
  }

  hide() {
    this.vect.hide()
    this.text.hide()
    this.options.link.show && this.link.hide()
  }

  show() {
    this.vect.show()
    this.text.show()
    this.options.link.show && this.link.show()
  }

  applyFilters(filter) {
    const self = this
    if (filter) {
      // presumes that the filter has been added to the slate
      if (!self.options.filters[filter.apply]) {
        self.options.filters[filter.apply] = {}
      }
      self.options.filters[filter.apply] = filter.id
    }

    Object.keys(self.options?.filters).forEach((key) => {
      if (self[key]) {
        if (self.options.filters[key]) {
          self[key].attr('filter', `url(#${self.options.filters[key]})`)
        } else {
          self[key].attr('filter', '')
        }
      }
    })
  }

  toggleFilters(blnHide) {
    const self = this
    Object.keys(self.options?.filters).forEach((key) => {
      if (self[key]) {
        if (self.options.filters[key]) {
          if (blnHide) {
            self[key].attr('filter', '')
          } else {
            self[key].attr('filter', `url(#${self.options.filters[key]})`)
          }
        }
      }
    })
  }

  applyBorder(pkg) {
    // first update the border prop if used
    if (pkg) {
      this.options[pkg.prop] = pkg.val
    }
    // next define the full suite
    const vectOpts = {
      stroke: this.options.borderColor,
      'stroke-dasharray': this.options.borderStyle || null,
      'stroke-width':
        this.options.borderWidth != null ? this.options.borderWidth : 1,
      'stroke-opacity':
        this.options.borderOpacity != null ? this.options.borderOpacity : 1,
      'stroke-linecap': 'round',
    }

    if (this.vect) {
      this.vect.attr(vectOpts)
    }
    return vectOpts
  }

  // returns an invisible path with the correct position of a path being dragged. MAKE SURE TO REMOVE IT AFTER YOU ARE DONE WITH IT or there will be a growing number of invisible paths rendering the slate unusable
  getTempPathWithCorrectPositionFor({ pathElement, dx, dy, rotationAngle }) {
    const tempPath = this.slate.paper
      .path(pathElement.attr('path').toString())
      .attr({ opacity: 0 })
    const _transforms = []
    const bb = tempPath.getBBox()
    if (dx != null && dy != null) {
      if (this.options.rotate.rotationAngle) {
        const newMoveVector = this.rotateMoveVector({ dx, dy })
        _transforms.push(`T${newMoveVector.dx},${newMoveVector.dy}`)
      } else {
        _transforms.push(`T${dx},${dy}`)
      }
    }

    if (rotationAngle != null) {
      _transforms.push(`r${rotationAngle}, ${bb.cx}, ${bb.cy}`)
    } else if (this.options.rotate.rotationAngle) {
      _transforms.push(
        `r${this.options.rotate.rotationAngle}, ${this.options.rotate.point.x}, ${this.options.rotate.point.y}`
      )
    }

    tempPath.transform('')
    const transformPath = getTransformedPath(
      tempPath.attr('path').toString(),
      _transforms
    )
    tempPath.attr({ path: transformPath })
    return tempPath
  }

  hideOwnMenus() {
    this.link.hide()
    this.menu.hide()
    // this._lock && this._lock.hide();
    // this._openLock && this._openLock.hide();
  }

  spin(opts) {
    let ii = 0
    const _aa = (opts && opts.angle) || 280
    const _dur = (opts && opts.duration) || 5000
    function _spinner(_angle) {
      ii++
      const _ra =
        ii % 2 === 0
          ? this.options.rotate.rotationAngle - _angle
          : this.options.rotate.rotationAngle + _angle
      const _rotate = { rotate: this.options.rotate, rotationAngle: _ra }
      this.rotate.animateSet(_rotate, {
        duration: _dur,
        cb: () => {
          _spinner(_aa)
        },
      })
    }
    _spinner(_aa)
  }

  move(pkg) {
    const _mPkg = {
      dur: pkg.dur || 500,
      moves: [
        {
          id: this.options.id,
          x: pkg.x,
          y: pkg.y,
        },
      ],
    }
    const _pkg = this.slate.nodes.nodeMovePackage(_mPkg)
    this.slate.nodes.moveNodes(_pkg, {
      animate: true,
      cb: () => {
        pkg.cb && pkg.cb()
      },
    })
  }

  zoom(zoomPercent, duration, cb) {
    /*
    var _startZoom = this.slate.options.viewPort.zoom.w;
    var _targetZoom = this.slate.options.viewPort.originalWidth * (100 / parseInt(zoomPercent));
    var _zoomDif = Math.abs(_targetZoom - _startZoom);
    */

    // UNTIL PAN AND ZOOM WORKS CORRECTLY, THIS WILL
    // ALWAYS BE A SIMPLE PROXY TO ZOOMING THE SLATE
    this.slate.canvas.zoom({
      dur: duration,
      zoomPercent,
      callbacks: {
        during(percentComplete, easing) {
          // additional calcs
        },
        after(zoomVal) {
          cb &&
            cb.apply(this, [
              { id: this.options.id, operation: 'zoom', zoomLevel: zoomVal },
            ])
        },
      },
    })
  }

  position(location, cb, easing, dur) {
    const self = this
    easing = easing || 'easeTo' // 'swingFromTo'
    dur = dur || 500

    const _vpt = self.vect.getBBox()
    const zr = self.slate.options.viewPort.zoom.r
    const d = utils.getDimensions(self.slate.options.container)
    const cw = d.width
    const ch = d.height
    const nw = self.options.width * zr
    const nh = self.options.height * zr
    const pad = 10

    // get upper left coords
    let _x = _vpt.x * zr
    let _y = _vpt.y * zr

    switch (location) {
      case 'lowerright':
        _x = _x - (cw - nw) - pad
        _y = _y - (ch - nh) - pad
        break
      case 'lowerleft':
        _x -= pad
        _y = _y - (ch - nh) - pad
        break
      case 'upperright':
        _x = _x - (cw - nw) - pad
        _y -= pad
        break
      case 'upperleft':
        _x -= pad
        _y -= pad
        break
      default:
        // center
        _x -= cw / 2 - nw / 2
        _y -= ch / 2 - nh / 2
        break
    }

    if (
      _x === self.slate.options.viewPort.left &&
      _y === self.slate.options.viewPort.top
    ) {
      cb.apply()
    } else {
      self.slate.canvas.move({
        x: _x,
        y: _y,
        dur,
        callbacks: {
          after() {
            cb?.apply(self, [
              {
                id: self.options.id,
                operation: 'position',
                location,
                easing,
              },
            ])
          },
        },
        isAbsolute: true,
        easing,
      })
    }
  }

  toggleImage(opts) {
    if (this.options.vectorPath && this.options.remoteImage) {
      if (opts.active) {
        const _svgAsImage = this.options.remoteImage
        this.hidden = { vectorPath: this.options.vectorPath }
        this.shapes.set({
          shape: 'rect',
          keepResizerOpen: opts.keepResizerOpen,
        })
        this.images.set(
          _svgAsImage,
          this.options.width,
          this.options.height,
          opts.keepResizerOpen
        )
        this.text && this.text.hide()
      } else if (this.hidden) {
        this.images.set('', this.options.width, this.options.height)
        this.customShapes.set(this.hidden.vectorPath)
        if (opts.width && opts.height) this.resize.set(opts.width, opts.height)
        this.text && this.text.show()
        this.relationships.showOwn()

        setTimeout(() => {
          this.menu.show()
        }, 100)
        delete this.hidden
      }
    }
  }

  disable() {
    this.options.allowMenu = false
    this.options.allowDrag = false
    this.hideOwnMenus()
    if (this.slate.options.showLocks && this.options.isLocked) {
      this.showLock()
    }
    // this.relationships.unwireHoverEvents();
  }

  enable() {
    this.options.allowMenu = true // _prevAllowMenu || true;
    this.options.allowDrag = true // _prevAllowDrag || true;
    this.hideLock()
    // this.relationships.wireHoverEvents();
  }

  showLock() {
    const self = this
    const _vpt = self.vect.getBBox()
    const r = self.slate.paper
    if (!self._lock && self.slate.options.showLocks) {
      self._lock = r
        .lockClosed()
        .transform(['t', _vpt.x2 - 10, ',', _vpt.y2 - 10, 's', 0.9, 0.9].join())
        .attr({ fill: '#fff', stroke: '#000' })
      self._lock.mouseover((e) => {
        self.hideLock()
      })
    }
    return self._lock
  }

  hideLock() {
    this.hideOpenLock()
    this._lock && this._lock.remove()
    this._lock = null
    this.slate.unglow()
  }

  showOpenLock() {
    const self = this
    const _vpt = this.vect.getBBox()
    const r = this.slate.paper
    self._openLock = r
      .lockOpen()
      .transform(['t', _vpt.x2 - 10, ',', _vpt.y2 - 10, 's', 0.9, 0.9].join())
      .attr({ fill: '#fff', stroke: '#000' })
    self._openLock.mouseover((e) => {
      self._openLock.attr({ 'stroke-width': '2px', 'stroke-color': '#000' })
      self._openLock.style.cursor = 'pointer'
    })
    self._openLock.mouseout(() => {
      self.hideOpenLock()
      self.showLock()
    })
    self._openLock.mousedown(() => {
      self.enable()
      self.options.isLocked = false
      const pkg = { type: 'onNodeUnlocked', data: { id: self.options.id } }
      self.context.broadcast(pkg)
    })
    return self._openLock
  }

  hideOpenLock() {
    this._openLock && this._openLock.remove()
    this._openLock = null
  }

  initLock() {
    if (this.vect && this.options.isLocked) {
      this.showLock()
    }
  }

  offset() {
    let _x = this.options.xPos - this.slate.options.viewPort.left
    let _y = this.options.yPos - this.slate.options.viewPort.top
    if (this.options.vectorPath === 'ellipse') {
      _x -= this.options.width / 2
      _y -= this.options.height / 2
    }
    return { x: _x, y: _y }
  }

  textCoords(opts = {}) {
    const _useX = opts.x || this.vect.ox || 0
    const _useY = opts.y || this.vect.oy || 0

    // these are the center defaults

    // start
    let _offsetX = this.options?.textOffset?.x || 0
    // middle
    let _offsetY = this.options?.textOffset?.y || 0

    const bbox = this.vect.getBBox()
    const _scale = 1

    switch (this.options.textXAlign) {
      case 'end': {
        _offsetX = _offsetX * _scale + this.options.textOffset.width
        break
      }
      case 'middle': {
        _offsetX = _offsetX * _scale + this.options.textOffset.width / 2
        break
      }
      default: {
        break
      }
    }

    switch (this.options.textYAlign) {
      case 'hanging': {
        _offsetY = _offsetY * _scale - bbox.height / 2
        break
      }
      case 'baseline': {
        _offsetY = _offsetY * _scale + bbox.height / 2
        break
      }
      default: {
        break
      }
    }

    const tx = _useX + _offsetX
    const ty = _useY + _offsetY

    const _tc = { x: tx, y: ty }
    return _tc
  }

  linkCoords() {
    let x = this.options.xPos - 20
    let y = this.options.yPos + this.options.height / 2 - 22

    if (this.vect.type !== 'rect') {
      y = this.options.yPos + this.options.height / 2 - 22
      x = this.options.xPos - 20
    }
    return { x, y }
  }

  _rotate(_opts) {
    const opts = {
      angle: 0,
      cb: null,
      dur: 0,
    }
    Object.assign(opts, _opts)
    const ta = ['r', opts.angle].join('')

    if (opts.dur === 0) {
      this.vect.transform(ta)
      this.text.transform(ta)
      if (this.options.link.show) this.link.transform(ta)
      opts.cb && opts.cb()
    } else {
      const lm = this.slate.paper.set()
      lm.push(this.vect)
      lm.push(this.text)
      if (this.options.link.show) lm.push(this.link)
      lm.animate({ transform: ta }, opts.dur, '>', () => {
        opts.cb && opts.cb()
      })
    }
  }
}
