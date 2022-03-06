import utils from '../helpers/utils'
import { Raphael } from '../deps/raphael/raphael.svg'

export default class undoRedo {
  constructor(slate) {
    this.slate = slate
    this.stateSlate = null
    this.actions = []
    this.actionIndex = -1
    this.toolbar = []
  }

  setVisibility() {
    const self = this
    self.toolbar[0].data({ disabled: false })
    self.toolbar[1].data({ disabled: false })

    if (!this.actions[this.actionIndex - 1]) {
      self.toolbar[0].attr({ 'fill-opacity': '0.3' })
      self.toolbar[0].data({ disabled: true })
    } else {
      self.toolbar[0].attr({ 'fill-opacity': '1.0' })
    }

    if (!this.actions[this.actionIndex + 1]) {
      self.toolbar[1].attr({ 'fill-opacity': '0.3' })
      self.toolbar[1].data({ disabled: true })
    } else {
      self.toolbar[1].attr({ 'fill-opacity': '1.0' })
    }
  }

  run() {
    const state = this.actions[this.actionIndex]
    this.slate.loadJSON(state)
    this.slate.birdsEye?.reload(state)
    const pkg = { type: 'onSaveRequested' }
    this.slate.collaboration?.onCollaboration({
      type: 'custom',
      slate: this.slate,
      pkg,
    })
  }

  undo() {
    if (this.actions[this.actionIndex - 1]) {
      this.actionIndex -= 1
      this.setVisibility()
      this.run()
    } else {
      this.setVisibility()
    }
  }

  redo() {
    if (this.actions[this.actionIndex + 1]) {
      this.actionIndex += 1
      this.setVisibility()
      this.run()
    } else {
      this.setVisibility()
    }
  }

  hide() {
    if (utils.el('slateUndoRedo') !== null) {
      try {
        this.slate.options.container.removeChild(utils.el('slateUndoRedo'))
      } catch (err) {}
    }
  }

  show(_options) {
    const self = this

    self.hide()

    const options = {
      height: 80,
      width: 130,
      offset: { left: 10, top: 8 },
    }

    Object.assign(options, _options)

    const c = self.slate.options.container
    const scx = document.createElement('div')
    scx.setAttribute('id', 'slateUndoRedo')
    scx.style.position = 'absolute'
    scx.style.height = `${options.height}px`
    scx.style.width = `${options.width}px`
    scx.style.left = `${options.offset.left}px`
    scx.style.top = `${options.offset.top}px`
    c.appendChild(scx)

    const x = options.offset.left
    const y = options.offset.top + 30

    options.paper = Raphael('slateUndoRedo', options.width, options.height)

    self.toolbar = [
      options.paper
        .undo()
        .data({ msg: 'Undo', width: 50, height: 22 })
        .attr({ fill: '#fff', cursor: 'pointer' })
        .attr({ fill: '#333', stroke: '#fff' })
        .transform(['t', x, ',', y, 's', '1.5', '1.5'].join()),
      options.paper
        .redo()
        .data({ msg: 'Redo', width: 50, height: 22 })
        .attr({ fill: '#fff', cursor: 'pointer' })
        .attr({ fill: '#333', stroke: '#fff' })
        .transform(['t', x + 50, ',', y, 's', '-1.5', '1.5'].join()),
    ]

    self.toolbar.forEach((toolbarElem) => {
      toolbarElem.mouseover(function m(e) {
        utils.stopEvent(e)
        self.slate.multiSelection?.hide()
        // $(e.target).style.cursor = "pointer";
        if (!this.data('disabled')) {
          self.slate.glow(this)
          const text = this.data('msg')
          self.slate.addtip(
            this.tooltip(
              { type: 'text', msg: text },
              this.data('width'),
              this.data('height')
            )
          )
        }
      })
      toolbarElem.mouseout(function m(e) {
        utils.stopEvent(e)
        self.slate.multiSelection?.show()
        self.slate.unglow()
        this.untooltip()
      })
    })

    self.toolbar[0].mousedown(function m(e) {
      utils.stopEvent(e)
      self.slate.unglow()
      if (!this.data('disabled')) {
        self.undo()
      }
    })

    self.toolbar[1].mousedown(function m(e) {
      utils.stopEvent(e)
      self.slate.unglow()
      if (!this.data('disabled')) {
        self.redo()
      }
    })

    // set the buttons both to be disabled
    self.setVisibility()

    // register the initial state
    setTimeout(() => {
      self.snap(true)
    }, 500)
  }

  snap(init) {
    const self = this
    self.actionIndex += 1
    if (self.actionIndex !== self.actions.length) {
      // work has bene performed, so abandon the forked record
      self.actions.splice(self.actionIndex)
    }
    const exp = self.slate.exportJSON()
    self.actions.push(exp)
    clearTimeout(self.saveSnapshot)
    self.saveSnapshot = setTimeout(async () => {
      if (self.slate.events.onTakeSnapshot) {
        await self.slate.events.onTakeSnapshot({
          slateId: self.slate.options.id,
          snapshot: exp,
        })
      }
    }, 3000) // once the slate settles for 3 secs, take a snapshot

    if (!init) self.setVisibility()
  }
}
