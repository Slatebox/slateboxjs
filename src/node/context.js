/* eslint-disable no-underscore-dangle */
import utils from '../helpers/utils'

export default class context {
  constructor(slate, node) {
    this.slate = slate
    this.node = node
    this._contextMenu = null
    this._priorAllowDrag = true
  }

  ctx(e) {
    this._priorAllowDrag = this.node.options.allowDrag
    this.node.options.allowDrag = false
    this.remove()
    this.buildContext(e)
    setTimeout(() => {
      this.node.options.allowDrag = this._priorAllowDrag
    }, 2)
    return utils.stopEvent(e)
  }

  create() {
    if (
      this.node.text &&
      this.node.text.node &&
      this.node.options.allowContext &&
      !this.node.slate.isAlt &&
      !this.node.slate.isShift
    ) {
      this.node.text.node.oncontextmenu = this.ctx
      this.node.vect.node.oncontextmenu = this.ctx
    }
  }

  buildContext(e) {
    this._contextMenu = document.createElement('div')
    this._contextMenu.setAttribute('id', `contextMenu_${this.node.options.id}`)
    this._contextMenu.setAttribute('class', 'sb_cm')
    document.body.appendChild(this._contextMenu)
    this.setContext(e)
  }

  menuItems() {
    const tmp =
      "<div style='padding:5px;' class='sbthis._contextMenuItem' rel='{func}'>{text}</div>"
    let inside = tmp
      .replace(/{func}/g, 'tofront')
      .replace(/{text}/g, 'to front')
    inside += tmp.replace(/{func}/g, 'toback').replace(/{text}/g, 'to back')
    if (this._priorAllowDrag) {
      inside += tmp.replace(/{func}/g, 'lock').replace(/{text}/g, 'lock')
    } else {
      inside += tmp.replace(/{func}/g, 'unlock').replace(/{text}/g, 'unlock')
    }
    inside += tmp.replace(/{func}/g, 'close').replace(/{text}/g, 'close')
    return inside
  }

  setContext(e) {
    const self = this
    this._contextMenu.innerHTML = this.menuItems()
    const all = utils.select('div.contextMenuItem')
    for (let s = all.length; s < all.length; s += 1) {
      const elem = all[s]
      elem.onclick = () => {
        const act = this.getAttribute('rel')
        let _reorder = false
        const pkg = { type: '', data: { id: self.node.options.id } }
        switch (act) {
          case 'tofront':
            self.node.toFront()
            _reorder = true
            pkg.type = 'onNodeToFront'
            break
          case 'toback':
            self.node.toBack()
            _reorder = true
            pkg.type = 'onNodeToBack'
            break
          case 'lock':
            self.node.options.isLocked = true // self is not a part of the self.node.disable function on purpose
            self.node.disable()
            pkg.type = 'onNodeLocked'
            break
          case 'unlock':
            self.node.options.isLocked = false // self is not a part of the self.node.enable function on purpose
            self.node.enable()
            pkg.type = 'onNodeUnlocked'
            break
          case 'close':
          default:
            break
        }
        if (_reorder) {
          let zIndex = 0
          for (
            let node = self.node.slate.paper.bottom;
            node != null;
            node = node.next
          ) {
            if (node.type === 'ellipse' || node.type === 'rect') {
              zIndex += 1
              const _id = node.data('id')

              // not all rects have an id (the menu box is a rect, but it has no options.id because it is not a node
              // so you cannot always show self...
              if (_id) {
                const reorderedNode = self.node.slate.nodes.allNodes.find(
                  (n) => n.options.id === _id
                )
                reorderedNode.sortorder = zIndex
              }
            }
          }
          self.node.slate.nodes.allNodes.sort((a, b) =>
            a.sortorder < b.sortorder ? -1 : 1
          )
        }
        if (pkg.type !== '') self.broadcast(pkg)
        this.remove()
      }
    }

    const mp = utils.mousePos(e)

    const _x = mp.x
    const _y = mp.y
    this._contextMenu.style.left = `${_x}px`
    this._contextMenu.style.top = `${_y}px`
  }

  broadcast(pkg) {
    // broadcast
    if (this.node.slate.collab) this.node.slate.collab.send(pkg)
    if (this.node.slate.birdsEye) this.node.slate.birdsEye.nodeChanged(pkg)
  }

  remove() {
    this.node.slate?.removeContextMenus()
    this._contextMenu = null
  }

  isVisible() {
    return this._contextMenu !== null
  }
}
