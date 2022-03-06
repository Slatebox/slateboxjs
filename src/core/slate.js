/* eslint-disable no-template-curly-in-string */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable new-cap */
/* eslint-disable import/no-cycle */
import uniq from 'lodash.uniq'
import merge from 'deepmerge'
import utils from '../helpers/utils'
import getTransformedPath from '../helpers/getTransformedPath'
import canvas from '../slate/canvas'
import collab from '../slate/collab'
import nodeController from '../slate/nodeController'
import multiSelection from '../slate/multiSelection'
import birdsEye from '../slate/birdsEye'
import inertia from '../slate/inertia'
import controller from '../slate/controller'
import zoomSlider from '../slate/zoomSlider'
import undoRedo from '../slate/undoRedo'
import grid from '../slate/grid'
import comments from '../slate/comments'
import keyboard from '../slate/keyboard'
import filters from '../slate/filters'

import base from './base'
import node from './node'

export default class slate extends base {
  constructor(_options, events, collaboration) {
    super(_options)
    this.options = {
      id: _options.id || utils.guid(),
      container: '',
      instance: '',
      name: '',
      description: '',
      basedOnThemeId: '',
      syncWithTheme: false,
      containerStyle: {
        width: 'auto',
        height: 'auto',
        backgroundColor: 'transparent',
        backgroundImage: '',
        backgroundSize: '',
        backgroundEffect: '',
        backgroundColorAsGradient: false, // linear|radial
        backgroundGradientType: null,
        backgroundGradientColors: [],
        backgroundGradientStrategy: null, // shades|palette
      },
      viewPort: {
        useInertiaScrolling: true,
        showGrid: false,
        snapToObjects: true,
        gridSize: 50,
        originalWidth: 50000,
        width: 50000,
        height: 50000,
        left: 5000,
        top: 5000,
        zoom: { w: 50000, h: 50000, r: 1 },
      },
      enabled: true,
      allowDrag: true,
      showbirdsEye: true,
      sizeOfbirdsEye: 200,
      showMultiSelect: true,
      showZoom: true,
      showUndoRedo: true,
      showStatus: true,
      showLocks: true,
      mindMapMode: true,
      isPublic: true,
      isFeatured: false,
      isCommunity: false,
      autoEnableDefaultFilters: true,
    }

    this.options = merge(this.options, _options)
    this.events = events || {
      onNodeDragged: null,
      onCanvasClicked: null,
      onImagesRequested: null,
      onRequestSave: null,
      isReadOnly: null,
    }

    this.collaboration = collaboration || {
      allow: true,
      localizedOnly: false,
      userIdOverride: null,
      onCollaboration: null,
    }

    // console.log("SLATE - share details are", this.options.shareId, this.options.userId, this.options.orgId);

    // ensure container is always an object
    if (!utils.isElement(this.options.container)) {
      this.options.container = utils.el(this.options.container)
    }

    this.constants = {
      statusPanelAtRest: 33,
      statusPanelExpanded: 200,
    }

    this.glows = []
    this.tips = []
    this.tempNodeId = utils.guid()
    this.allLines = []
  }

  init() {
    const self = this
    // instantiate all the dependencies for the slate -- order here is importantish
    // (birdsEye, undoRedo, zoomSlider are used in canvas, and inertia uses canvas)
    self.nodes = new nodeController(self)
    self.collab = new collab(self)
    self.birdsEye = new birdsEye(self)
    self.zoomSlider = new zoomSlider(self)
    if (!self.isReadOnly() && !self.isCommentOnly()) {
      self.undoRedo = new undoRedo(self)
      self.multiSelection = new multiSelection(self)
    }
    self.controller = new controller(self)
    self.filters = new filters(self)
    self.canvas = new canvas(self)
    self.canvas.init()
    if (self.multiSelection) {
      self.multiSelection.init()
    }
    self.inertia = new inertia(self)
    self.grid = new grid(self)
    self.comments = new comments(self)
    self.keyboard = new keyboard(self)

    self.autoLoadFilters()

    if (self.options.onInitCompleted) {
      self.options.onInitCompleted.apply(self)
    }

    return self
  }

  url(opt) {
    return this.options.ajax.rootUrl + this.options.ajax.urlFlavor + opt
  }

  glow(obj) {
    this.glows.push(obj.glow())
  }

  unglow() {
    // console.log("removing glows ", this.glows);
    this.glows.forEach((glow) => {
      glow.remove()
    })
    this.glows = []
  }

  addtip(tip) {
    if (tip) this.tips.push(tip)
  }

  untooltip() {
    this.tips.forEach((tip) => {
      tip && tip.remove()
    })
  }

  toggleFilters(blnHide, nodeId, esc) {
    // hide filters during dragging
    if (this.nodes.allNodes.length > 20) {
      this.nodes.allNodes.forEach((n) => {
        if (!nodeId || n.options.id === nodeId) {
          n.toggleFilters(blnHide)
        }
      })
      this.allLines
        .filter((l) => l.lineEffect)
        .forEach((c) => {
          if (blnHide) {
            c.line.attr('filter', '')
          } else {
            c.line.attr('filter', `url(#${c.lineEffect})`)
          }
        })
      if (blnHide) {
        this.canvas.hideBg()
      }
      if (esc) {
        setTimeout(() => {
          this.toggleFilters(!blnHide)
          this.canvas.hideBg(1)
        }, 500)
      }
    }
  }

  removeContextMenus() {
    const _cm = utils.select('div.sb_cm')
    _cm.forEach((elem) => {
      document.body.removeChild(elem)
    })
  }

  remove() {
    this.nodes.allNodes.forEach((nn) => {
      nn.del()
    })
    this.paper.remove()
    // delete self;
  }

  zoom(x, y, w, h, fit) {
    this.nodes.closeAllLineOptions()
    this.paper.setViewBox(x, y, w, h, fit)
  }

  png(ropts, cb) {
    const self = this
    self.svg(
      { useDataImageUrls: true, backgroundOnly: ropts?.backgroundOnly },
      (opts) => {
        if (self.events.onCreateImage) {
          self.events.onCreateImage(
            { svg: opts.svg, orient: opts.orient, type: 'png' },
            (err, base64) => {
              if (err) {
                console.error('Unable to create png server side', svg, err)
              } else if (ropts?.base64) {
                cb(base64)
              } else {
                const img = new Image()
                img.src = base64
                img.onload = () => {
                  const cnvs = document.createElement('canvas')
                  cnvs.width = img.naturalWidth
                  cnvs.height = img.naturalHeight
                  const ctx = cnvs.getContext('2d')
                  ctx.imageSmoothingEnabled = false
                  ctx.drawImage(img, 0, 0)
                  const link = document.createElement('a')
                  link.setAttribute(
                    'download',
                    `${(self.options.name || 'slate')
                      .replace(/[^a-z0-9]/gi, '_')
                      .toLowerCase()}_${self.options.id}.png`
                  )
                  cnvs.toBlob((blob) => {
                    link.href = URL.createObjectURL(blob)
                    const event = new MouseEvent('click')
                    link.dispatchEvent(event)
                    cb && cb()
                  })
                }
              }
            }
          )
        } else {
          const cnvs = document.createElement('canvas')
          cnvs.width = opts.orient.width
          cnvs.height = opts.orient.height
          const blb = new Blob([opts.svg], {
            type: 'image/svg+xml;charset=utf8',
          })
          const url = URL.createObjectURL(blb)
          if (ropts?.base64) {
            cb(`url('${url}')`)
          } else {
            const ctx = cnvs.getContext('2d')
            const img = document.createElement('img')
            img.src = url
            img.onload = () => {
              ctx.drawImage(img, 0, 0)
              const imgsrc = cnvs.toDataURL('image/png')
              const a = document.createElement('a')
              a.download = `${(self.options.name || 'slate')
                .replace(/[^a-z0-9]/gi, '_')
                .toLowerCase()}_${self.options.id}.png`
              a.href = imgsrc
              a.click()
              URL.revokeObjectURL(img.src)
              cb && cb()
            }
            img.onerror = (err) => {
              console.log('error loading image', err)
            }
          }
        }
      }
    )
  }

  copy(opts) {
    const self = this
    if (!self.copySlate) {
      self.copySlate = new slate({
        container: opts.container,
        containerStyle: this.options.containerStyle,
        defaultLineColor: this.options.defaultLineColor,
        viewPort: this.options.viewPort,
        name: this.options.name,
        description: this.options.description,
        showbirdsEye: false,
        showMultiSelect: false,
        showUndoRedo: false,
        showZoom: false,
      }).init()
    }

    const _json = JSON.parse(this.exportJSON())
    _json.nodes.forEach((nde) => {
      const _mpkg = opts.moves
        ? opts.moves.find((m) => m.id === nde.options.id || m.id === '*')
        : null
      if (_mpkg) {
        nde.options.xPos += _mpkg.x
        nde.options.yPos += _mpkg.y
        const _transforms = [`t${_mpkg.x}, ${_mpkg.y}`]
        nde.options.vectorPath = getTransformedPath(
          node.options.vectorPath,
          _transforms
        )
      }
    })

    self.copySlate.loadJSON(JSON.stringify(_json))
    self.copySlate.nodes.refreshAllRelationships()

    return self.copySlate
  }

  svg(opts, cb) {
    const self = this

    const _nodesToOrient = opts.nodes
      ? self.nodes.allNodes.filter((n) => opts.nodes.indexOf(n.options.id) > -1)
      : null
    const _orient = self.getOrientation(_nodesToOrient, true)
    const _r = 1 // this.options.viewPort.zoom.r || 1;
    const _resizedSlate = JSON.parse(self.exportJSON())
    if (opts.backgroundOnly) {
      _resizedSlate.nodes = []
    }
    _resizedSlate.nodes.forEach((n) => {
      const _ty = n.options.yPos * _r
      const _tx = n.options.xPos * _r
      const _width = n.options.width
      const _height = n.options.height
      n.options.yPos = _ty - _orient.top
      n.options.xPos = _tx - _orient.left
      n.options.width = _width * _r
      n.options.height = _height * _r
      if (n.options.rotate && n.options.rotate.point) {
        n.options.rotate.point.x = n.options.rotate.point.x * _r - _orient.left
        n.options.rotate.point.y = n.options.rotate.point.y * _r - _orient.top
      }
      const _updatedPath = utils._transformPath(
        n.options.vectorPath,
        [
          'T',
          (_orient.left / _r) * -1,
          ',',
          (_orient.top / _r) * -1,
          's',
          ',',
          _r,
          ',',
          _r,
        ].join('')
      )
      n.options.vectorPath = _updatedPath
    })

    const _div = document.createElement('div')
    _div.setAttribute('id', 'tempSvgSlate')
    _div.style.width = `${_orient.width}px`
    _div.style.height = `${_orient.height}px`
    _div.style.visibility = 'hidden'

    document.body.appendChild(_div)

    const exportOptions = merge(_resizedSlate.options, {
      container: 'tempSvgSlate',
      containerStyle: {
        backgroundColor: _resizedSlate.options.containerStyle.backgroundColor,
        backgroundColorAsGradient:
          _resizedSlate.options.containerStyle.backgroundColorAsGradient,
        backgroundGradientType:
          _resizedSlate.options.containerStyle.backgroundGradientType,
        backgroundGradientColors:
          _resizedSlate.options.containerStyle.backgroundGradientColors,
        backgroundGradientStrategy:
          _resizedSlate.options.containerStyle.backgroundGradientStrategy,
      },
      defaultLineColor: _resizedSlate.options.defaultLineColor,
      viewPort: {
        allowDrag: false,
        originalWidth: _orient.width,
        width: _orient.width,
        height: _orient.height,
        left: 0,
        top: 0,
        zoom: { w: _orient.width * 1.5, h: _orient.height * 1.5 },
        showGrid: false,
      },
      name: _resizedSlate.options.name,
      description: _resizedSlate.options.description,
      showbirdsEye: false,
      showMultiSelect: false,
      showUndoRedo: false,
      showZoom: false,
      showLocks: false,
      isEmbedding: true,
    })

    // we don't yet load the nodes by default even though they're passed in on the options below...
    const _exportCanvas = new slate(exportOptions).init()

    // ...that's done in the loadJSON...which seems weird
    _exportCanvas.loadJSON(
      JSON.stringify({ options: exportOptions, nodes: _resizedSlate.nodes }),
      false,
      true
    )
    // events don't serialize, so add them explicitly
    _exportCanvas.events = self.events
    _exportCanvas.nodes.refreshAllRelationships()

    // add the bgColor (this is done on html styling in slatebox proper view)
    let bg = null
    if (_resizedSlate.options.containerStyle.backgroundImage) {
      const img = document.createElement('img')
      img.setAttribute(
        'src',
        _resizedSlate.options.containerStyle.backgroundImage
      )
      img.style.visibility = 'hidden'
      document.body.appendChild(img)
      let bw = img.naturalWidth
      let bh = img.naturalHeight
      if (self.options.containerStyle.backgroundSize === 'cover') {
        const ratio = self.canvas.internal.parentElement.offsetWidth / bw
        bw *= ratio
        bh *= ratio
      } else {
        // TODO: handle repeat by calcing how many paper.images should be added to an array of [bg] and then simulate the repeat effect
        // need to see if _orient.width > bw and if so, add another horizontally, and if _orient.height > bh, then add another by the multiple vertically as well
      }
      img.remove()
      const iw = Math.max(bw, _orient.width)
      const ih = Math.max(bh, _orient.height)
      bg = _exportCanvas.paper.image(
        _resizedSlate.options.containerStyle.backgroundImage,
        0,
        0,
        iw,
        ih
      )
    } else {
      bg = _exportCanvas.paper.rect(0, 0, _orient.width, _orient.height).attr({
        fill: _resizedSlate.options.containerStyle.backgroundColor,
        stroke: 'none',
      })
    }
    bg.toBack()

    // the timeout is critical to ensure that the SVG canvas settles
    // and the url-fill images appear.
    setTimeout(async () => {
      _exportCanvas.canvas.rawSVG((svg) => {
        cb({ svg, orient: _orient })
        _div.remove()
      })
    }, 100)
  }

  autoLoadFilters() {
    const self = this
    // if auto filter is on, then these filters become immediately availalbe in their default form
    if (
      self.options.autoEnableDefaultFilters &&
      self.filters?.availableFilters
    ) {
      Object.keys(self.filters.availableFilters).forEach((type) => {
        self.filters.add(
          {
            id: type,
            filters: self.filters.availableFilters[type].filters,
          },
          true
        )
        if (self.filters.availableFilters[type].deps) {
          self.filters.addDeps(self.filters.availableFilters[type].deps)
        }
      })
    }
  }

  loadJSON(_jsonSlate, blnPreserve, blnSkipZoom, useMainCanvas = false) {
    const self = this

    if (blnPreserve === undefined) {
      self.paper && self.paper.clear()
      if (self.nodes) self.nodes.allNodes = []
    }

    const loadedSlate = JSON.parse(_jsonSlate)
    Object.assign(self.options, loadedSlate.options)

    self.autoLoadFilters()

    // bgcolor set
    self.canvas?.refreshBackground()

    // grid
    if (self.options.viewPort.showGrid) {
      self.grid?.show()
    } else {
      self.grid?.destroy()
    }

    // zoom
    if (!blnSkipZoom) {
      const val = Math.max(
        self.options.viewPort.zoom.w,
        self.options.viewPort.zoom.h
      )
      self.zoomSlider?.set(val)
    }

    // sort nodes by their last painted order to honor toBack/toFront
    loadedSlate.nodes.sort((n1, n2) => {
      const i1 = loadedSlate.options.nodeOrder?.findIndex(
        (n) => n === n1.options.id
      )
      const i2 = loadedSlate.options.nodeOrder?.findIndex(
        (n) => n === n2.options.id
      )
      return i1 - i2
    })

    const deferredRelationships = []
    loadedSlate.nodes.forEach((n) => {
      n.options.allowDrag = true // must default
      n.options.allowMenu = true
      const _boundTo = new node(n.options)
      self.nodes.add(_boundTo, useMainCanvas)
      deferredRelationships.push({ bt: _boundTo, json: n })
    })

    deferredRelationships.forEach((relationship) => {
      const _bounded = relationship
      _bounded.bt.addRelationships(_bounded.json)
    })

    if (self.options.showLocks) {
      self.displayLocks()
    }

    // refreshes all relationships
    self.nodes.allNodes.forEach((_node) => {
      _node.relationships.updateAssociationsWith({
        activeNode: _node.options.id,
        currentDx: 0,
        currentDy: 0,
      })
    })
    self.nodes.refreshAllRelationships()

    // finally invoke toFront in order
    self.nodes.allNodes.forEach((n) => n.toFront())

    // always add style tag to the <defs> for font embedding
    self.paper.def({
      tag: 'style',
      type: 'text/css',
      id: `embeddedSBStyles_${self.options.id}`,
    })

    self.paper.def({
      tag: 'path',
      id: `raphael-marker-classic`,
      'stroke-linecap': 'round',
      d: 'M5,0 0,2.5 5,5 3.5,3 3.5,2z',
    })

    self.loadAllFonts()
    if (!blnSkipZoom) {
      self.controller.centerOnNodes({ dur: 0 })
    }
  }

  loadAllFonts() {
    // load all fonts
    const fonts = uniq(
      this.nodes.allNodes.map((n) => n.options.fontFamily)
    ).join('|')
    if (document.getElementById('googleFonts')) {
      document
        .getElementById('googleFonts')
        .setAttribute(
          'href',
          `https://fonts.googleapis.com/css?family=${fonts}`
        )
    } else {
      const sc = document.createElement('link')
      sc.setAttribute('src', 'https://fonts.googleapis.com/css?family=${fonts}')
      sc.setAttribute('id', 'googleFonts')
      sc.setAttribute('rel', 'stylesheet')
      sc.setAttribute('type', 'text/css')
      document.head.appendChild(sc)
    }
  }

  displayLocks() {
    this.nodes.allNodes.forEach((nd) => {
      nd.initLock()
    })
  }

  hideLocks() {
    this.nodes.allNodes.forEach((nd) => {
      nd.hideLock()
    })
  }

  isReadOnly() {
    return (
      !this.events.isReadOnly ||
      (this.events.isReadOnly && this.events.isReadOnly())
    )
  }

  isCommentOnly() {
    return (
      !this.events.isCommentOnly ||
      (this.events.isCommentOnly && this.events.isCommentOnly())
    )
  }

  canRemoveComments() {
    return (
      !this.events.canRemoveComments ||
      (this.events.canRemoveComments && this.events.canRemoveComments())
    )
  }

  // the granularity is at the level of the node...
  exportDifference(compare, lineWidthOverride) {
    const _difOpts = { ...this.options }
    delete _difOpts.container

    // birdsEye specific -- if this is not here, then locks
    // show up on the birdsEye
    _difOpts.showLocks = compare.options.showLocks

    const jsonSlate = {
      options: JSON.parse(JSON.stringify(_difOpts)),
      nodes: [],
    }
    const tnid = this.tempNodeId
    this.nodes.allNodes.forEach((nd) => {
      let _exists = false
      const pn = nd
      if (pn.options.id !== tnid) {
        compare.nodes.allNodes.forEach((nodeInner) => {
          if (nodeInner.options.id === pn.options.id) {
            _exists = true
          }
        })
        if (!_exists) {
          jsonSlate.nodes.push(pn.serialize(lineWidthOverride))
        }
      }
    })

    return JSON.stringify(jsonSlate)
  }

  exportJSON() {
    const _cont = this.options.container
    const _pcont = this.collaboration.panelContainer || null
    const _callbacks = this.collaboration.callbacks || null
    const _opts = this.options
    delete _opts.container

    const jsonSlate = { options: JSON.parse(JSON.stringify(_opts)), nodes: [] }
    this.options.container = _cont
    this.collaboration.panelContainer = _pcont
    this.collaboration.callbacks = _callbacks

    delete jsonSlate.options.ajax
    delete jsonSlate.options.container

    const tnid = this.tempNodeId
    this.nodes.allNodes.forEach((nd) => {
      if (nd.options.id !== tnid) {
        jsonSlate.nodes.push(nd.serialize())
      }
    })

    jsonSlate.shareId = this.shareId

    return JSON.stringify(jsonSlate)
  }

  snapshot() {
    const _snap = JSON.parse(this.exportJSON())
    _snap.nodes.allNodes = _snap.nodes
    return _snap
  }

  getOrientation(_nodesToOrient, _alwaysOne) {
    let orient = 'landscape'
    let sWidth = this.options.viewPort.width
    let sHeight = this.options.viewPort.height
    const bb = []
    bb.left = 99999
    bb.right = 0
    bb.top = 99999
    bb.bottom = 0

    const an = _nodesToOrient || this.nodes.allNodes
    if (an.length > 0) {
      for (let _px = 0; _px < an.length; _px += 1) {
        const sbw = 10
        const _bb = an[_px].vect.getBBox()

        const _r = _alwaysOne ? 1 : this.options.viewPort.zoom.r || 1
        const x = _bb.x * _r
        const y = _bb.y * _r
        const w = _bb.width * _r
        const h = _bb.height * _r

        bb.left = Math.abs(Math.min(bb.left, x - sbw))
        bb.right = Math.abs(Math.max(bb.right, x + w + sbw))
        bb.top = Math.abs(Math.min(bb.top, y - sbw))
        bb.bottom = Math.abs(Math.max(bb.bottom, y + h + sbw))
      }

      sWidth = bb.right - bb.left
      sHeight = bb.bottom - bb.top

      if (sHeight > sWidth) {
        orient = 'portrait'
      }
    }
    return {
      orientation: orient,
      height: sHeight,
      width: sWidth,
      left: bb.left,
      top: bb.top,
    }
  }

  resize(_size, dur, pad) {
    let _p = pad || 0
    if (_p < 6) _p = 6
    _size -= _p * 2 || 0
    const orx = this.getOrientation()
    const wp = (orx.width / _size) * this.options.viewPort.width
    const hp = (orx.height / _size) * this.options.viewPort.height
    const sp = Math.max(wp, hp)

    const _r =
      Math.max(this.options.viewPort.width, this.options.viewPort.height) / sp
    const l = orx.left * _r - _p
    const t = orx.top * _r - _p

    zoom(0, 0, sp, sp, true)
    this.options.viewPort.zoom = {
      w: sp,
      h: sp,
      l: parseInt(l * -1, 10),
      t: parseInt(t * -1, 10),
      r: this.options.viewPort.originalWidth / sp,
    }
    this.canvas.move({ x: l, y: t, dur, isAbsolute: true })
  }

  disable(exemptSlate, exemptNodes) {
    if (!exemptNodes) {
      this.nodes.allNodes.forEach((nd) => {
        nd.disable()
      })
    }

    if (!exemptSlate) {
      this.options.enabled = false
      this.options.allowDrag = false
    }
  }

  enable(exemptSlate, exemptNodes) {
    if (!exemptNodes) {
      this.nodes.allNodes.forEach((nd) => {
        !nd.options.isLocked && nd.enable()
      })
    }
    if (!exemptSlate) {
      this.options.enabled = true
      this.options.allowDrag = true
    }
  }

  reorderNodes() {
    // these ids will come out in the order that they are painted on the screen - toFront and toBack adjusts this, so we need
    // to always keep this hand so that when the slate is reloaded, it can order the nodes by these ids (which are going to be dif
    // from the saved JSON order of arrays)
    const ids = Array.from(
      this.canvas.internal.querySelector('svg').querySelectorAll('path')
    )
      .map((a) => a.getAttribute('rel'))
      .filter((r) => !!r)
    // console.log("order of nodes", ids);
    this.options.nodeOrder = ids
  }

  findChildren(nodeIds, allChildren = []) {
    const self = this
    // get his node's children - then recursively call findChildren on that node
    const nodes = self.nodes.allNodes.filter((n) =>
      nodeIds.includes(n.options.id)
    )
    allChildren = allChildren.concat(nodes.map((n) => n.options.id))
    const children = []
    nodes.forEach((n) => {
      n.relationships.associations
        .filter((a) => a.parent.options.id === n.options.id)
        .forEach((a) => children.push(a.child.options.id))
    })
    if (children.length) {
      return self.findChildren(children, allChildren)
    }
    return allChildren
  }

  applyTheme(theme, syncWithTheme, revertTheme) {
    const self = this
    if (!revertTheme) {
      self.options.basedOnThemeId = theme._id
      self.options.syncWithTheme = syncWithTheme
    } else {
      self.options.basedOnThemeId = null
      self.options.syncWithTheme = null
    }
    const nodeStyle = {}
    const currentNodesByColor = {}
    const totChildren = []

    // first apply slate
    if (theme.containerStyle.backgroundImage) {
      self.collab.invoke({
        type: 'onSlateBackgroundImageChanged',
        data: {
          bg: {
            size: theme.containerStyle.backgroundSize,
            url: theme.containerStyle.backgroundImage,
          },
        },
      })
    } else if (theme.containerStyle.backgroundEffect) {
      self.collab.invoke({
        type: 'onSlateBackgroundEffectChanged',
        data: { effect: theme.containerStyle.backgroundEffect },
      })
    } else {
      self.collab.invoke({
        type: 'onSlateBackgroundColorChanged',
        data: {
          color: theme.containerStyle.backgroundColor,
          asGradient: theme.containerStyle.backgroundColorAsGradient,
          gradientType: theme.containerStyle.backgroundGradientType,
          gradientColors: theme.containerStyle.backgroundGradientColors,
          gradientStrategy: theme.containerStyle.backgroundGradientStrategy,
        },
      })
    }
    self.collab.invoke({
      type: 'onLineColorChanged',
      data: { color: theme.defaultLineColor },
    })

    function applyStyle(id) {
      const allKeys = Object.keys(theme.styles)
      const lastStyle = theme.styles[allKeys[allKeys.length - 1]]
      const styleBase = theme.styles[nodeStyle[id]] || lastStyle

      // borders
      self.collab.invoke({
        type: 'onNodeBorderPropertiesChanged',
        data: { id, prop: 'borderWidth', val: styleBase.borderWidth },
      })
      self.collab.invoke({
        type: 'onNodeBorderPropertiesChanged',
        data: { id, prop: 'borderColor', val: styleBase.borderColor },
      })
      self.collab.invoke({
        type: 'onNodeBorderPropertiesChanged',
        data: { id, prop: 'borderOpacity', val: styleBase.borderOpacity },
      })
      self.collab.invoke({
        type: 'onNodeBorderPropertiesChanged',
        data: { id, prop: 'borderStyle', val: styleBase.borderStyle },
      })

      // shape
      if (styleBase.vectorPath && syncWithTheme) {
        // const node = self.nodes.one(id);
        // const sendPath = utils._transformPath(styleBase.vectorPath, `T${node.options.xPos},${node.options.xPos}`);
        self.collab.invoke({
          type: 'onNodeShapeChanged',
          data: { id, shape: styleBase.vectorPath },
        })
      }

      // text
      self.collab.invoke({
        type: 'onNodeTextChanged',
        data: {
          id,
          fontSize: styleBase.fontSize,
          fontFamily: styleBase.fontFamily,
          fontColor: styleBase.foregroundColor,
          textOpacity: styleBase.textOpacity,
        },
      })

      // effects
      self.collab.invoke({
        type: 'onNodeEffectChanged',
        data: { id, filter: { apply: 'text', id: styleBase.filters.text } },
      })

      // background color
      self.collab.invoke({
        type: 'onNodeColorChanged',
        data: {
          id,
          opacity: styleBase.opacity,
          color: styleBase.backgroundColor,
        },
      })

      // effects
      self.collab.invoke({
        type: 'onNodeEffectChanged',
        data: { id, filter: { apply: 'vect', id: styleBase.filters.vect } },
      })

      // lines
      const styleNode = self.nodes.one(id)

      // console.log("node is ", id, node);
      styleNode.relationships.associations.forEach((a, ind) => {
        self.collab.invoke({
          type: 'onLineColorChanged',
          data: { id, color: styleBase.lineColor },
        })
        self.collab.invoke({
          type: 'onLinePropertiesChanged',
          data: {
            id,
            prop: 'lineOpacity',
            val: styleBase.lineOpacity,
            associationId: a.id,
            index: ind,
          },
        })
        self.collab.invoke({
          type: 'onLinePropertiesChanged',
          data: {
            id,
            prop: 'lineEffect',
            val: styleBase.lineEffect,
            associationId: a.id,
            index: ind,
          },
        })
        self.collab.invoke({
          type: 'onLinePropertiesChanged',
          data: {
            id,
            prop: 'lineWidth',
            val: styleBase.lineWidth,
            associationId: a.id,
            index: ind,
          },
        })
      })
    }

    self.nodes.allNodes.forEach((nd) => {
      if (self.options.mindMapMode || syncWithTheme) {
        const children = self.findChildren([nd.options.id])
        totChildren.push(children)
      } else {
        if (!currentNodesByColor[nd.options.backgroundColor]) {
          currentNodesByColor[nd.options.backgroundColor] = []
        }
        currentNodesByColor[nd.options.backgroundColor].push(nd.options.id)
      }
    })

    if (self.options.mindMapMode || syncWithTheme) {
      totChildren.sort((a, b) => a.length - b.length)
      totChildren.forEach((t) => {
        t.forEach((n, ind) => {
          nodeStyle[n] = ind === 0 ? `parent` : `child_${ind}`
        })
      })
    } else {
      const colorsByUsage = Object.keys(currentNodesByColor).sort(
        (a, b) => currentNodesByColor[b].length - currentNodesByColor[a].length
      )
      let styleIndex = -1
      colorsByUsage.forEach((c, index) => {
        if (Object.keys(theme.styles).length < index) {
          styleIndex = -1
        }
        styleIndex += 1
        currentNodesByColor[c].forEach((id) => {
          nodeStyle[id] = styleIndex === 0 ? `parent` : `child_${styleIndex}`
        })
      })
    }

    Object.keys(nodeStyle).forEach((id) => {
      applyStyle(id)
    })
  }
}
