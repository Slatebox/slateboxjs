import utils from '../helpers/utils'

export default class zoomSlider {
  constructor(slate) {
    const self = this
    self.slate = slate
    self.slider = null
    self.sliderId = `sb-zoom-slider-${utils.guid().substring(8)}`
  }

  setValue(val) {
    if (this.slider) this.slider.setValue(val)
  }

  hide() {
    if (utils.el(`slateSlider_${this.slate.options.id}`) !== null) {
      this.slate.options.container.removeChild(
        utils.el(`slateSlider_${this.slate.options.id}`)
      )
    }
  }

  show(_options) {
    const self = this
    if (!self.slate.isReadOnly() && !self.slate.isCommentOnly()) {
      self.hide()

      const options = {
        height: 320,
        width: 28,
        offset: { left: 39, top: 85 },
        slider: { height: 300, min: 6000, max: 200000, set: 5000 },
      }

      Object.assign(options, _options)

      const c = self.slate.options.container
      const scx = document.createElement('div')
      scx.setAttribute('id', `slateSlider_${self.slate.options.id}`)
      scx.style.position = 'absolute'
      scx.style.height = `${options.height}px`
      scx.style.width = `${options.width}px`
      scx.style.left = `${options.offset.left}px`
      scx.style.top = `${options.offset.top}px`
      scx.style.borderRadius = '7px'
      scx.style.border = '1px solid #ccc'
      scx.style.backgroundColor = '#fff'
      c.appendChild(scx)

      self.slider = document.createElement('input')
      self.slider.setAttribute('orient', 'vertical')
      self.slider.setAttribute('type', 'range')
      self.slider.setAttribute('min', '6000')
      self.slider.setAttribute('step', '50')
      self.slider.setAttribute('max', '200000')
      self.slider.setAttribute('value', self.slate.options.viewPort.zoom.w)
      self.slider.setAttribute('id', self.sliderId)
      self.slider.style['writing-mode'] = 'bt-lr'
      self.slider.style['-webkit-appearance'] = 'slider-vertical'
      self.slider.style.width = `20px`
      self.slider.style.height = `${options.height - 5}px`
      self.slider.style.padding = `0 5px`
      self.slider.style.transform = `rotate(180deg)`

      self.slider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value)
        self.set(val)
        self.slate.birdsEye?.refresh(true)
      })

      self.slider.addEventListener('change', (e) => {
        const val = parseFloat(e.target.value)
        self.set(val)
        self.slate.collab?.send({ type: 'onZoom', data: { zoomLevel: val } })
      })

      scx.appendChild(self.slider)
    }
  }

  set(val) {
    const self = this
    if (self.slider) self.slider.value = val
    if (self.slate.canvas.resize(val) || !self.slate.canvas.completeInit) {
      self.slate.zoom(0, 0, val, val, false)
      const z = self.slate.options.viewPort.zoom
      self.slate.options.viewPort.width = z.w
      self.slate.options.viewPort.height = z.h
      self.slate.options.viewPort.left = z.l
      self.slate.options.viewPort.top = z.t
    }
  }
}
