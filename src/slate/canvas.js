/* eslint-disable no-underscore-dangle */
import uniq from 'lodash.uniq'
import utils from '../helpers/utils'
import sbIcons from '../helpers/sbIcons'
import { Raphael } from '../deps/raphael/raphael.svg'
import { shapes } from '../deps/raphael/raphael.fn.shapes'
import { extensions } from '../deps/raphael/raphael.el.extensions'
import embedGoogleFonts from '../helpers/embedGoogleFonts'
import '../deps/emile'

export default class canvas {
  constructor(slate) {
    const self = this
    self.slate = slate
    let c = slate.options.container
    if (typeof c === 'string') c = utils.el(c)
    if (c === undefined || c === null) {
      throw new Error('You must provide a container to initiate the canvas!')
    }

    // customize raphael -- modifies global Raphael for all other imports
    shapes(Raphael)
    extensions(Raphael)

    self.isDragging = false
    self.slate.paper = null
    self.internal = null
    self.status = null
    self.imageFolder = null
    self.dken = null
    self.eve = {
      init: ['onmousedown', 'ontouchstart'],
      drag: ['onmousemove', 'ontouchmove'],
      up: ['onmouseup', 'ontouchend', 'onmouseout'],
      gest: ['ongesturestart', 'ongesturechange', 'ongestureend'],
    }
  }

  init() {
    const self = this
    const imageFolder = self.slate.options.imageFolder || '/images/'
    const c = self.slate.options.container
    const { slate } = self

    self.Canvas = {
      objInitPos: {},
      objInitialMousePos: { x: 0, y: 0 },
      initDrag(e) {
        if (slate.isCtrl) {
          slate.multiSelection?.start()
        }
        if (slate.options.allowDrag) {
          self.isDragging = true

          slate.multiSelection?.end()
          slate.nodes?.closeAllMenus()

          const m = utils.mousePos(e)
          self.Canvas.objInitPos = utils.positionedOffset(self.internal)
          const offsets = utils.positionedOffset(slate.options.container)
          self.Canvas.objInitialMousePos = {
            x: m.x + offsets.left,
            y: m.y + offsets.top,
          }
          const xy = self.cp(e)

          if (self.status)
            self.status.innerHTML = `${Math.abs(xy.x)}, ${Math.abs(xy.y)}`

          if (slate.options.showStatus) {
            if (self.status) self.status.style.display = 'block'
            slate.multiSelection?.hide()
          }

          self.internal.style.cursor = `url(${imageFolder}closedhand.cur), default`

          if (m.allTouches) {
            slate.options.lastTouches = m.allTouches
          }

          if (slate.removeContextMenus) slate.removeContextMenus()

          slate.draggingZoom = self.slate.options.viewPort.zoom

          // hide filters during dragging
          slate.toggleFilters(true)

          utils.stopEvent(e)
        } else if (slate.onSelectionStart) {
          slate.onSelectionStart.apply(self, [e])
        } else {
          utils.stopEvent(e)
        }
      },
      setCursor() {
        if (self.isDragging)
          self.internal.style.cursor = `url(${imageFolder}closedhand.cur), default`
        else
          self.internal.style.cursor = `url(${imageFolder}openhand.cur), default`
      },
      onDrag(e) {
        requestAnimationFrame(() => {
          // broadcast custom collab
          const mp = utils.mousePos(e)
          slate.collab?.send({ type: 'onMouseMoved', data: mp })

          if (self.isDragging && slate.options.allowDrag) {
            const xy = self.cp(e)
            if (xy.allTouches && xy.allTouches.length > 1) {
              slate.options.lastTouches = xy.allTouches
            }

            if (self.status)
              self.status.innerHTML = `${Math.abs(xy.x)}, ${Math.abs(xy.y)}`
            self.internal.style.left = `${xy.x}px`
            self.internal.style.top = `${xy.y}px`
          }
        })
      },
      endDrag(e) {
        if (self.isDragging && slate.options.allowDrag) {
          self.isDragging = false

          self.internal.style.cursor = `url(${imageFolder}openhand.cur), default`
          if (self.status) self.status.style.display = 'none'
          slate.multiSelection?.show()

          const xy = self.cp(e)
          slate.draggingZoom = null
          self.endDrag(xy)

          // show filters after dragging
          slate.toggleFilters(false)
        }
      },
    }

    // wipe it clean
    if (!slate.options.preserve) c.innerHTML = ''

    if (self.slate.paper) {
      self.slate.paper.clear()
    }

    if (self.internal) {
      c.removeChild(self.internal)
    }

    // internal
    self.internal = document.createElement('div')
    self.internal.setAttribute(
      'class',
      `slateboxInternal_${self.slate.options.id}`
    )
    // console.log("setting slate canvas", `slateboxInternal_${self.slate.options.id}`);
    const _w = slate.options.viewPort.width
    const _h = slate.options.viewPort.height
    const _l = slate.options.viewPort.left
    const _t = slate.options.viewPort.top
    self.internal.style.width = `${_w + 100000}px`
    self.internal.style.height = `${_h + 100000}px`
    self.internal.style.left = `${_l * -1}px`
    self.internal.style.top = `${_t * -1}px`
    self.internal.style.position = 'absolute'
    self.internal.style['-webkit-transform'] = `translateZ(0)`
    self.internal.style.transform = `translateZ(0)` // `translate3d(0,0,0)`; //helps with GPU based rendering
    c.appendChild(self.internal)

    self.internal.addEventListener('mousedown', () => {
      self.slate?.events?.onCanvasClicked?.apply()
    })

    // status
    if (self.slate.options.showStatus) {
      self.status = document.createElement('div')
      self.status.style.position = 'absolute'
      self.status.style.height = '20px'
      self.status.style.left = '5px'
      self.status.style.color = '#000'
      self.status.style.fontSize = '10pt'
      self.status.style.fontFamily = 'trebuchet ms'
      self.status.style.top = '0px'
      self.status.style.display = 'none'
      self.status.style.padding = '5px'
      self.status.style.filter = 'alpha(opacity=80)'
      self.status.style.opacity = '.80'
      self.status.style.backgroundColor = '#ffff99'
      self.status.style.fontWeight = 'bold'
      c.appendChild(self.status)
    }

    // style container
    c.style.position = 'relative'
    c.style.overflow = 'hidden'

    // style internal
    self.internal.style.borderTop = `${slate.borderTop}px`
    self.internal.style.cursor = `url(${imageFolder}openhand.cur), default`
    self.slate.paper = Raphael(self.internal, _w, _h)

    self.refreshBackground()

    if (slate.options.allowDrag) {
      self.wire()
    }

    slate.options.viewPort.originalHeight = _h
    slate.options.viewPort.originalWidth = _w

    // set up initial zoom params
    self.resize(_w)

    // show zoom slider
    if (slate.options.showZoom) {
      if (slate.zoomSlider) slate.zoomSlider.show(slate.options.viewPort.width)
    }

    // show undo redo
    if (slate.options.showUndoRedo) {
      if (slate.undoRedo) slate.undoRedo.show()
    }

    // show birdsEye -- this is self referential on canvas in loadJSON inside slate, so this must be deferred until canvas constructor is done.
    if (slate.options.showbirdsEye) {
      if (slate.birdsEye.enabled()) {
        slate.birdsEye.reload(slate.exportJSON())
      } else {
        slate.birdsEye.show({
          size: slate.options.sizeOfbirdsEye || 200,
          onHandleMove() {},
        })
      }
    }

    // set up the shareable/branding if need be
    if (
      !slate.options.isbirdsEye &&
      (slate.options.isSharing || slate.options.isEmbedding)
    ) {
      const _btnSize = 25
      const _scaleSize = _btnSize - 3
      const _iframe = document.getElementById('snap_slate')

      const _parent = document.createElement('div')
      _parent.className = 'sb_parent_shareable'

      const _styles = utils.buildStyle({
        height: _iframe ? `${_scaleSize + 8}px` : `${_scaleSize}px`,
      })
      _parent.setAttribute('style', _styles)

      if (slate.options.isEmbedding && !slate.options.nobrand) {
        const _brand = document.createElement('a')
        _brand.className = 'sb_brand'
        _brand.setAttribute('href', 'https://slatebox.com')
        _brand.innerHTML = 'built with slatebox'
        _parent.appendChild(_brand)
      }

      if (!slate.options.isbirdsEye && slate.options.isSharing) {
        const _svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${_btnSize}" height="${_btnSize}"><path fill="#333" stroke="#000" d="{path}" stroke-dasharray="none" stroke-width="1" opacity="1" fill-opacity="1"></path></svg>`
        // stick sharing buttons (one-click png export and one-click copy embed)
        ;['download', 'embed'].forEach((e) => {
          const _btn = document.createElement('div')
          _btn.className = 'sb_share'
          _btn.setAttribute('data-action', e)
          const _bstyles = utils.buildStyle({
            width: `${_btnSize}px`,
            height: `${_btnSize}px`,
          })
          _btn.setAttribute('style', _bstyles)
          const _new = utils.centerAndScalePathToFitContainer({
            containerSize: _btnSize,
            scaleSize: _scaleSize,
            path: sbIcons.icons[e],
          })
          _btn.innerHTML = _svg.replace(/{path}/gi, _new.path)
          _parent.appendChild(_btn)

          utils.addEvent(_btn, 'click', () => {
            const _act = this.getAttribute('data-action')
            switch (_act) {
              case 'embed': {
                const _et = document.createElement('textarea')
                document.body.appendChild(_et)
                let _val = ''

                if (_iframe) {
                  _val = `<iframe id='sb_embed_${slate.options.id}' src='${window.location.href}' width='${_iframe.clientWidth}' height='${_iframe.clientHeight}' frameborder='0' scrolling='no'></iframe>`
                } else {
                  const _ele = slate.options.container.parentElement
                  const _raw = _ele.innerHTML
                  const _split = _raw.split('<div class="slateboxInternal"')
                  const _orig = `${_split[0]}<script>${
                    _split[1].split('<script>')[1]
                  }`
                  _val = `<div id="sb_embed_${slate.options.id}">${_orig}</div>`
                }

                _et.value = _val
                _et.select()
                document.execCommand('copy')
                document.body.removeChild(_et)

                const _note = document.createElement('div')
                _note.innerHTML = 'Copied!'
                _note.setAttribute(
                  'style',
                  utils.buildStyle({
                    'font-size': '11pt',
                    'text-align': 'center',
                    padding: '4px',
                    'margin-right': '-1px',
                    width: '125px',
                    height: '22px',
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    'background-color': '#333',
                    color: '#fff',
                  })
                )
                _parent.appendChild(_note)

                window.setTimeout(() => {
                  _parent.removeChild(_note)
                }, 1500)

                break
              }
              case 'download': {
                slate.png()
                break
              }
              default: {
                break
              }
            }
          })
        })
      }

      if (slate.options.isEmbedding && _parent.innerHTML !== '') {
        c.appendChild(_parent)
      }
    }

    self.windowSize = utils.windowSize()
    self.containerOffset = utils.positionedOffset(self.slate.options.container)
    utils.addEvent(window, 'resize', () => {
      self.windowSize = utils.windowSize()
      self.containerOffset = utils.positionedOffset(
        self.slate.options.container
      )
      if (self.dken !== null) {
        self.dken.style.width = `${self.ws.width}px`
        self.dken.style.height = `${self.ws.height}px`
      }
    })

    setTimeout(() => {
      self.slate.birdsEye?.setBe()
      self.slate.birdsEye?.refresh()
    }, 500)
    self.completeInit = true
  } // init

  cp(e) {
    const m = utils.mousePos(e)

    let difX =
      this.Canvas.objInitPos.left + (m.x - this.Canvas.objInitialMousePos.x)
    let difY =
      this.Canvas.objInitPos.top + (m.y - this.Canvas.objInitialMousePos.y)

    const _width = this.slate.options.containerStyle.width
    const _height = this.slate.options.containerStyle.height
    const _vpWidth = this.slate.options.viewPort.width
    const _vpHeight = this.slate.options.viewPort.height

    if (difX > 0) difX = 0
    else if (Math.abs(difX) + _width > _vpWidth) difX = _width - _vpWidth
    if (difY > 0) difY = 0
    else if (Math.abs(difY) + _height > _vpHeight) difY = _height - _vpHeight

    return { x: difX, y: difY }
  }

  endDrag(coords) {
    this.slate.options.viewPort.left = Math.abs(coords.x)
    this.slate.options.viewPort.top = Math.abs(coords.y)

    this.internal.style.left = `${coords.x}px`
    this.internal.style.top = `${coords.y}px`

    const curPos = utils.positionedOffset(this.internal)
    const moved = {
      x: this.Canvas.objInitPos.left - curPos.left,
      y: this.Canvas.objInitPos.top - curPos.top,
    }

    this.slate.birdsEye?.refresh(true)

    if (this.slate.collaboration.allow) {
      this.broadcast(moved)
    }
  }

  broadcast(moved) {
    this.slate.collab?.send({
      type: 'onCanvasMove',
      data: {
        left: this.slate.options.viewPort.left,
        top: this.slate.options.viewPort.top,
        relative: moved,
        orient: this.slate.getOrientation(),
      },
    })
  }

  zoom(_opts) {
    const self = this
    const opts = {
      dur: 500,
      callbacks: { after: null, during: null },
      easing: 'easeFromTo',
      zoomPercent: 100,
    }

    Object.assign(opts, _opts)

    self.slate.nodes.closeAllConnectors()

    const _startZoom = self.slate.options.viewPort.zoom.w
    const _targetZoom =
      self.slate.options.viewPort.originalWidth *
      (100 / parseInt(opts.zoomPercent, 10))
    const _zoomDif = Math.abs(_targetZoom - _startZoom)

    opts.dur = !opts.dur && opts.dur !== 0 ? 500 : opts.dur

    // eslint-disable-next-line no-undef
    emile(self.internal, 'padding:1px', {
      duration: opts.dur,
      before() {
        self.slate.options.allowDrag = false
      },
      after() {
        self.slate.options.allowDrag = true
        self.slate.zoomSlider.set(_targetZoom)
        self.slate.birdsEye?.refresh(true)
        opts.callbacks?.after?.apply(self.slate, [_targetZoom])
      },
      during(pc) {
        const _val =
          _targetZoom > _startZoom
            ? _startZoom + _zoomDif * pc
            : _startZoom - _zoomDif * pc
        self.slate.zoom(0, 0, _val, _val, false)
        self.slate.canvas.resize(_val)
        self.slate.birdsEye?.refresh(true)
        opts.callbacks?.during?.apply(pc)
      },
      easing: utils.easing[opts.easing],
    })
  }

  move(_opts) {
    const self = this
    const opts = {
      x: 0,
      y: 0,
      dur: 500,
      callbacks: { after: null, during: null },
      isAbsolute: true,
      easing: 'easeFromTo',
    }

    Object.assign(opts, _opts)

    let { x } = opts
    let { y } = opts
    if (opts.isAbsolute === false) {
      x = self.slate.options.viewPort.left + x
      y = self.slate.options.viewPort.top + y
    }

    self.slate.nodes.closeAllConnectors()
    if (opts.dur > 0) {
      // eslint-disable-next-line no-undef
      emile(self.internal, `left:${x * -1}px;top:${y * -1}px`, {
        duration: opts.dur,
        before() {
          self.slate.options.allowDrag = false
        },
        after() {
          self.slate.options.allowDrag = true
          self.slate.options.viewPort.left = Math.abs(
            parseInt(self.internal.style.left.replace('px', ''), 10)
          )
          self.slate.options.viewPort.top = Math.abs(
            parseInt(self.internal.style.top.replace('px', ''), 10)
          )
          self.slate.birdsEye?.refresh(true)
          opts.callbacks.after.apply(self.slate)
        },
        during(pc) {
          self.slate.birdsEye?.refresh(true)
          opts.callbacks?.during?.apply(pc)
        },
        easing: utils.easing[opts.easing],
      })
    } else {
      window.requestAnimationFrame(() => {
        self.internal.style.left = `${x * -1}px`
        self.internal.style.top = `${y * -1}px`
        self.slate.options.viewPort.left = Math.abs(x)
        self.slate.options.viewPort.top = Math.abs(y)
        opts.callbacks?.after?.apply(self.slate)
      })
    }
    // }
  }

  resize(val) {
    const uval = parseInt(val, 10)

    const R = this.slate.options.viewPort.width / uval
    const dimen = utils.getDimensions(this.slate.options.container)
    let _top = this.slate.options.viewPort.top * -1 * R
    let _left = this.slate.options.viewPort.left * -1 * R

    const _centerY = ((dimen.height / 2) * R - dimen.height / 2) * -1
    const _centerX = ((dimen.width / 2) * R - dimen.width / 2) * -1

    _top += _centerY
    _left += _centerX

    const threshold = this.slate.options.viewPort.originalWidth - 1000

    if (-_top > threshold || -_left > threshold) {
      return false
    }
    this.internal.style.top = `${_top}px`
    this.internal.style.left = `${_left}px`
    this.slate.options.viewPort.zoom = {
      w: uval,
      h: uval,
      l: parseFloat(_left * -1),
      t: parseFloat(_top * -1),
      r: this.slate.options.viewPort.originalWidth / uval,
    }
    return true
  }

  clear() {
    this.slate.options.container.innerHTML = ''
    return this.slate._
  }

  wire() {
    const self = this
    self.eve.init.forEach((ee) => {
      self.internal[ee] = self.Canvas.initDrag
    })
    self.eve.drag.forEach((ee) => {
      self.internal[ee] = self.Canvas.onDrag
    })
    self.eve.up.forEach((ee) => {
      self.internal[ee] = self.Canvas.endDrag
    })
  }

  unwire() {
    const self = this
    self.eve.init.forEach((ee) => {
      self.internal[ee] = null
    })
    self.eve.drag.forEach((ee) => {
      self.internal[ee] = null
    })
    self.eve.up.forEach((ee) => {
      self.internal[ee] = null
    })
  }

  rawSVG(cb) {
    const self = this

    function finalize(svg) {
      if (self.slate.events.onOptimizeSVG) {
        self.slate.events.onOptimizeSVG(svg, (err, optimized) => {
          if (err) {
            console.error('Unable to optimize slate svg export', err)
          } else {
            cb(optimized)
          }
        })
      } else {
        cb(svg)
      }
    }

    function extractImages(__svg) {
      let ssvg = __svg
      const images = uniq(
        self.slate.nodes.allNodes.map((n) => n.options.image).filter((f) => !!f)
      )
      if (images.length > 0) {
        images.forEach((i, ind) => {
          if (self.slate.events.onBase64ImageRequested) {
            // server side gen
            let imageType = 'png'
            if (i.indexOf('jpg')) {
              imageType = 'jpeg'
            } else if (i.indexOf('gif')) {
              imageType = 'gif'
            }
            self.slate.events.onBase64ImageRequested(
              i,
              imageType,
              (err, res) => {
                if (err) {
                  console.error('Unable to retrieve base64 from image', err)
                } else {
                  const ix = i.replace(/&/gi, '&amp;')
                  while (ssvg.indexOf(ix) > -1) {
                    ssvg = ssvg.replace(ix, res)
                  }
                }
                if (ind + 1 === images.length) {
                  finalize(ssvg)
                }
              }
            )
          } else {
            // client side only -- good luck with CORS - this method should be avoided
            utils
              .toDataUrl(i)
              .then((dataUrl) => {
                ssvg = ssvg.replace(new RegExp(i, 'gi'), dataUrl)
              })
              .catch((err) => {
                console.error('Unable to get image', err)
              })
              .finally(() => {
                if (ind + 1 === images.length) {
                  finalize(ssvg)
                }
              })
          }
        })
      } else {
        finalize(ssvg)
      }
    }

    // always embed fonts and fix links -- a style node is always added in the init
    embedGoogleFonts({
      fonts: uniq(self.slate.nodes.allNodes.map((n) => n.options.fontFamily)),
      text: uniq(
        self.slate.nodes.allNodes.flatMap((n) =>
          n.options.text.replace(/ /gi, '').split('')
        )
      )
        .join('')
        .trim(),
      styleNode: self.internal.querySelector('svg > defs > style'),
    }).then(() => {
      // need to swap out xlink:href with href for the blob to work w/ the pixelate (or other) filter
      let __svg = self.internal.innerHTML.replace(/xlink:href/gi, 'href')
      const slateBg = self.slate.options.containerStyle.backgroundImage
      if (slateBg) {
        // server side gen
        let bgImageType = 'png'
        if (slateBg.indexOf('jpg')) {
          bgImageType = 'jpeg'
        } else if (slateBg.indexOf('gif')) {
          bgImageType = 'gif'
        }
        self.slate.events.onBase64ImageRequested(
          slateBg,
          bgImageType,
          (err, res) => {
            if (err) {
              console.error('Unable to retrieve base64 from image', err)
            } else {
              __svg = __svg.replace(slateBg, res)
            }
            extractImages(__svg)
          }
        )
      } else {
        extractImages(__svg)
      }
    })
  }

  bgToBack() {
    this._bg?.toBack()
  }

  hideBg(t) {
    const self = this
    const e = self.slate.options.containerStyle.backgroundEffect
    self._bg?.remove()
    delete self._bg
    if (e) {
      if (!self.slate.options.isbirdsEye) {
        clearTimeout(self.showBgTimeout)
        self.showBgTimeout = setTimeout(() => {
          const attrs = { filter: `url(#${e})` }
          if (self.slate.filters.availableFilters[e]?.fill) {
            attrs.fill = `url(#${self.slate.filters.availableFilters[e]?.fill})`
          }
          self._bg = self.slate.paper
            .rect(
              0,
              0,
              self.slate.options.viewPort.width,
              self.slate.options.viewPort.height
            )
            .attr(attrs)
            .toBack()
        }, t || 2500)
      }
    }
    self.refreshBackground()
  }

  refreshBackground() {
    const self = this

    self.internal.style.backgroundColor = ''
    self.internal.parentElement.style.backgroundImage = ''
    self.internal.parentElement.style.backgroundSize = ''
    self.internal.parentElement.style.background = ''
    self.internal.style.backgroundSize = ''
    self.internal.style.backgroundPosition = ''

    if (self.slate.options.containerStyle.backgroundEffect) {
      self.slate.options.containerStyle.backgroundColor =
        self.slate.filters.availableFilters[
          self.slate.options.containerStyle.backgroundEffect
        ].backgroundColor
    }

    if (self.slate.options.containerStyle.backgroundImage) {
      self.slate.options.containerStyle.prevBackgroundColor =
        self.slate.options.containerStyle.backgroundColor
      self.slate.options.containerStyle.backgroundColor = 'transparent'
      self.internal.parentElement.style.backgroundImage = `url('${self.slate.options.containerStyle.backgroundImage}')`
      if (self.slate.options.containerStyle.backgroundSize) {
        self.internal.parentElement.style.backgroundSize =
          self.slate.options.containerStyle.backgroundSize
      }
    }

    // show only on first load
    if (!self.initBg && self.slate.options.containerStyle.backgroundEffect) {
      self.initBg = true
      self.hideBg(1)
    }

    switch (self.slate.options.containerStyle.backgroundColor) {
      case 'transparent': {
        if (!self.slate.options.isbirdsEye) {
          if (self.slate.options.isEmbedding) {
            self.internal.style.backgroundColor = ''
          } else if (!self.slate.options.containerStyle.backgroundImage) {
            self.internal.style.backgroundImage =
              'linear-gradient(45deg,rgba(13,26,43,0.1) 25%,transparent 25%,transparent 75%,rgba(13,26,43,0.1) 75%),linear-gradient(45deg,rgba(13,26,43,0.1) 25%,transparent 25%,transparent 75%,rgba(13,26,43,0.1) 75%)'
            self.internal.style.backgroundSize = '12px 12px'
            self.internal.style.backgroundPosition = '0 0,6px 6px'
          }
        }
        break
      }
      default: {
        if (self.slate.options.containerStyle.backgroundColorAsGradient) {
          self.internal.style.backgroundColor = ''
          const bgStyle = `${
            self.slate.options.containerStyle.backgroundGradientType
          }-gradient(${self.slate.options.containerStyle.backgroundGradientColors.join(
            ','
          )})`
          self.internal.parentElement.style.background = bgStyle
        } else {
          self.internal.style.backgroundColor =
            self.slate.options.containerStyle.backgroundColor || '#fff'
        }
        break
      }
    }
    self.slate.grid?.setGrid()
  }

  get() {
    return this.internal
  }

  draggable() {
    return this.internal
  }
}
