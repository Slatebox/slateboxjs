/* eslint-disable no-param-reassign */
import invoke from 'lodash.invoke'
import refreshRelationships from '../helpers/refreshRelationships'
import utils from '../helpers/utils'

export default class lineOptions {
  constructor(slate, node) {
    this.slate = slate
    this.node = node
    this.m = {}
  }

  broadcast(pkg) {
    pkg.data.id = this.node.options.id
    this.slate.collab?.send(pkg)
  }

  set(pkg) {
    const a = this.node.relationships.associations[pkg.index]
    if (pkg.updateChild) {
      a.child.options[pkg.prop] = pkg.val
    } else {
      this.node.options[pkg.prop] = pkg.val
    }
    if (pkg.val === 'toggle') {
      a[pkg.prop] = a[pkg.prop] ? ![pkg.prop] : true
    } else {
      a[pkg.prop] = pkg.val
    }
    refreshRelationships({ relationships: [a], nodes: [this.node] })
  }

  show(e, c) {
    const self = this

    self.hideAll()
    self.slate.nodes.closeAllLineOptions(c.id)
    const a = self.node.relationships.associations.find((ax) => ax.id === c.id)

    const r = self.slate.paper
    const mp = utils.mousePos(e)
    const off = utils.positionedOffset(self.slate.options.container)
    const z = self.slate.options.viewPort.zoom.r
    const opacity = '1.0'
    let x = (mp.x + self.slate.options.viewPort.left - off.left - 90) / z
    let y = (mp.y + self.slate.options.viewPort.top - off.top - 30) / z

    const bb = a.line.getBBox()
    x = bb.cx
    y = bb.cy

    self.m[c.id] = r.set()

    const transformToolbar = (xx, yy) => ['t', x + xx, ',', y + yy].join()
    const toolbarAttr = {
      fill: '#fff',
      'fill-opacity': opacity,
      stroke: '#333',
      'stroke-width': 1,
      cursor: 'pointer',
    }
    const toolbar = []

    const reassign = self.node.options.showRelationshipReassign
      ? r.handle().attr(toolbarAttr).transform(transformToolbar(15, 0))
      : null
    const props = self.node.options.showRelationshipProperties
      ? r.setting().attr(toolbarAttr).transform(transformToolbar(-15, 0))
      : null
    const del = self.node.options.showRelationshipDelete
      ? r
          .trash()
          .transform(transformToolbar(-45, 0))
          .attr({ fill: '#fff', stroke: '#f00' })
      : null

    if (reassign) toolbar.push(reassign)
    if (toolbar) toolbar.push(props)
    if (del) toolbar.push(del)

    const toolbarGlows = []
    toolbar.forEach((toolbarElem) => {
      toolbarElem.mouseover(function g() {
        toolbarGlows.push(this.glow())
        utils.stopEvent(e)
      })
      toolbarElem.mouseout(() => {
        toolbarGlows.forEach((t) => {
          t.remove()
        })
        utils.stopEvent(e)
      })
    })

    if (props) {
      props.mousedown((ex) => {
        utils.stopEvent(ex)
        toolbarGlows.forEach((t) => {
          t.remove()
        })
        const assoc = self.node.relationships.associations.find(
          (ax) => ax.id === c.id
        )
        if (self.slate.events?.onLineMenuRequested) {
          self.hideAll()
          self.slate.events?.onLineMenuRequested(self.node, assoc, () => {
            // finished
          })
        }
      })
    }

    function removeRelationship(ex) {
      toolbarGlows.forEach((t) => {
        t.remove()
      })
      utils.stopEvent(ex)
      if (self.slate.options.enabled) {
        const pkg = {
          type: 'removeRelationship',
          data: { parent: c.parent.options.id, child: c.child.options.id },
        }
        self.slate.nodes.removeRelationship(pkg.data)
        self.slate.birdsEye?.relationshipsChanged(pkg)
        self.broadcast(pkg)
        self.hide(c.id)
      }
    }

    // reassign relationship
    if (reassign) {
      reassign.mousedown(() => {
        removeRelationship()
        self.node.relationships.initiateTempNode(e, c.parent, {
          showChildArrow: a.showChildArrow,
          showParentArrow: a.showParentArrow,
        })
      })
    }

    // remove relationship
    if (del) {
      del.mousedown(() => {
        removeRelationship()
      })
    }

    toolbar.forEach((toolbarElem) => {
      self.m[c.id].push(toolbarElem)
    })
    return self
  }

  hide(id) {
    if (this.m[id]) {
      invoke(this.m[id], 'remove')
      this.m[id] = null
    }
  }

  hideAll() {
    const self = this
    // self.slate.unglow();
    self.node.relationships.associations
      .map((r) => r.id)
      .forEach((id) => {
        self.hide(id)
      })
  }
}
