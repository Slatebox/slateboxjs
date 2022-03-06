/* eslint-disable no-underscore-dangle */
import invoke from 'lodash.invoke'

export default class menu {
  constructor(slate, node) {
    this.slate = slate
    this.node = node
    this._m = null
    this._isOpen = false
  }

  isOpen() {
    return this._isOpen
  }

  show() {
    const self = this
    const r = self.slate.paper
    if (self._m) {
      invoke(self._m, 'remove')
      self._m = null
    }

    const bb = self.node.vect.getBBox()
    const _x = bb.x
    const _y = bb.y
    self._m = r.set()
    self._isOpen = true

    // right, bottom, and settings connectors
    self.node.connectors.show(_x, _y, self._m, () => {
      if (self.slate.events?.onMenuRequested) {
        self.slate.events?.onMenuRequested(self.node, () => {})
      }
    })
  }

  hide(exceptionElemId) {
    if (this._m) {
      this._m.forEach((m) => {
        if (m.id !== exceptionElemId) {
          m.remove()
        }
      })
      this._m.items = exceptionElemId
        ? null
        : this._m.items.filter((item) => item.id !== exceptionElemId)
      this.node?.connectors?.iconBar?.remove()
    }

    this.node.rotate.hide()
    this._isOpen = false
  }
}
