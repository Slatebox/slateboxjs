import utils from '../helpers/utils'

export default class controller {
  constructor(slate) {
    this.slate = slate
  }

  static perform(pkg, node, op, cb) {
    const det = op.split('@')
    let dur = pkg.defaultDuration || 300
    const param = det[1]

    switch (det[0]) {
      case 'zoom':
        dur = det.length > 2 ? parseFloat(det[2], 10) : pkg.defaultDuration
        node.zoom(param, dur, cb)
        break
      case 'position': {
        const ease = det.length > 2 ? det[2] : pkg.defaultEasing
        dur = det.length > 3 ? parseFloat(det[3], 10) : pkg.defaultDuration
        node.position(param, cb, ease, dur)
        break
      }
      default:
        break
    }
  }

  scaleToFitNodes(_opts) {
    const opts = {
      nodes: null,
      dur: 0,
      cb: null,
      offset: 0,
      minWidth: 60,
      minHeight: 30,
    }
    Object.assign(opts, _opts)

    const orient = this.slate.getOrientation(opts.nodes)
    const d = utils.getDimensions(this.slate.options.container)
    const r = this.slate.options.viewPort.zoom.r || 1
    const widthZoomPercent = parseInt((d.width / (orient.width / r)) * 100, 10) // division by r converts it back from the scaled version
    const heightZoomPercent = parseInt(
      (d.height / (orient.height / r)) * 100,
      10
    )

    // zoom canvas
    this.slate.canvas.zoom({
      dur: opts.dur,
      callbacks: {
        after() {
          if (opts.cb) opts.cb()
        },
      },
      easing: 'easeFromTo',
      zoomPercent: Math.min(widthZoomPercent, heightZoomPercent),
    })
  }

  // useful for centering the canvas on a collection of nodes
  centerOnNodes(_opts) {
    const self = this

    const opts = {
      nodes: null,
      dur: 500,
      cb: null,
    }
    Object.assign(opts, _opts)
    const orient = self.slate.getOrientation(opts.nodes)
    const d = utils.getDimensions(self.slate.options.container)
    const cw = d.width
    const ch = d.height
    const nw = orient.width
    const nh = orient.height

    // get upper left coords
    const x = orient.left - (cw / 2 - nw / 2)
    const y = orient.top - (ch / 2 - nh / 2)

    self.slate.canvas.move({
      x,
      y,
      isAbsolute: true,
      dur: opts.dur,
      easing: 'swingFromTo',
      callbacks: {
        after() {
          setTimeout(() => {
            self.slate.birdseye?.refresh(true)
          }, 100)
          if (opts.cb) opts.cb()
        },
      },
    })
  }

  // useful for centering the canvas by comparing the viewport's previous width/height to its current width/height
  center(_opts) {
    const self = this
    const opts = {
      previousWindowSize: {},
      dur: 500,
      cb: null,
    }
    Object.assign(opts, _opts)
    const ws = utils.windowSize()
    this.slate.canvas.move({
      x: ((ws.width - opts.previousWindowSize.w) / 2) * -1,
      y: ((ws.height - opts.previousWindowSize.h) / 2) * -1,
      duration: opts.dur,
      isAbsolute: false,
      easing: 'swingFromTo',
      callbacks: {
        after: () => {
          self.slate.birdseye?.refresh(true)
          if (opts.cb) opts.cb()
        },
      },
    })
    return ws
  }

  // experimental
  bop(opts) {
    const dur = opts && opts.dur && opts.dur !== 0 ? opts.dur : 300
    const locale = 'center'
    const ease = 'easeTo'

    const presentNodes = _.map(this.slate.nodes.allNodes, (a) => ({
      name: a.options.name,
      operations: [`position@${locale}@${ease}@${dur}`],
    }))

    this.slate.controller.present({
      nodes: presentNodes,
      // eslint-disable-next-line no-unused-vars
      nodeChanged: (node) => {},
      // eslint-disable-next-line no-unused-vars
      opChanged: (op) => {},
      complete: () => {},
      sync: {
        zoom: true,
        position: true,
      },
    })
  }

  // expiremental
  shakeNodes() {
    const self = this
    let s = 0

    function move() {
      s += 1
      const mPkg = {
        dur: 500,
        moves: [
          {
            id: '*',
            x: s % 2 === 0 ? 20 : -20,
            y: s % 2 === 0 ? -20 : -20,
          },
        ],
      }
      const pkg = self.slate.nodes.nodeMovePackage(mPkg)
      self.slate.nodes.moveNodes(pkg, {
        animate: true,
        cb: () => {
          setTimeout(() => {
            move()
            console.log('all done!')
          }, 4000)
        },
      })
    }

    move()
  }

  pulse(opts) {
    let cycles = 0
    let dur = 10000 // slow
    let czp
    let zp

    function calc() {
      czp = this.slate.options.viewPort.zoom.r * 100
      zp = { in: czp + 5, out: czp - 5 } // nuance;

      if (opts) {
        switch (opts.speed) {
          case 'fast':
            dur = 3000
            break
          default:
            break
        }
        switch (opts.subtlety) {
          case 'trump':
            zp = { in: czp + 60, out: czp - 60 }
            break
          default:
            break
        }
      }
    }

    function run(zpp, cb) {
      this.slate.canvas.zoom({
        dur,
        callbacks: {
          after() {
            if (cb) cb()
          },
        },
        easing: 'easeFromTo',
        zoomPercent: zpp,
      })
    }

    function cycle() {
      run(zp.in, () => {
        run(zp.out, () => {
          cycles += 1
          if (opts && opts.cycle && cycles >= opts.cycle) {
            if (opts.cb) opts.cb()
          } else {
            cycle()
          }
        })
      })
    }

    if (opts && opts.center) {
      this.scaleToFitAndCenter(() => {
        calc()
        cycle()
      })
    } else {
      calc()
      cycle()
    }
  }

  scaleToFitAndCenter(cb, dur) {
    this.slate.controller.scaleToFitNodes({
      dur: dur != null ? dur : 0,
      cb: () => {
        this.centerOnNodes({ dur: 0 })
        if (cb) cb()
      },
    })
  }

  present(pkg) {
    const self = this
    let currentOperations = []
    let n = null

    function next() {
      if (currentOperations.length === 0) {
        if (pkg.nodes.length > 0) {
          const node = pkg.nodes.shift()
          n = this.slate.nodes.allNodes.find(
            (nx) => nx.options.name === node.name
          )
          currentOperations = node.operations
          if (pkg.nodeChanged) pkg.nodeChanged(node)
        }
      }

      if (currentOperations.length > 0) {
        const op = currentOperations.shift()
        if (pkg.opChanged) pkg.opChanged(op)

        controller.perform(pkg, n, op, (p) => {
          const sync = pkg.sync !== undefined ? pkg.sync[p.operation] : false
          switch (p.operation) {
            case 'zoom':
              if (sync) {
                this.slate.collab?.send({
                  type: 'onZoom',
                  data: { id: p.id, zoomLevel: p.zoomLevel },
                })
              }
              break
            case 'position':
              if (sync) {
                this.slate.collab?.send({
                  type: 'onNodePositioned',
                  data: { id: p.id, location: p.location, easing: p.easing },
                })
              }
              break
            default:
              break
          }
          next()
        })
      } else if (pkg.complete) pkg.complete()
    }
    next()
  }
}
