/* eslint-disable no-underscore-dangle */
import utils from '../helpers/utils'

export default class keyboard {
  constructor(slate) {
    const self = this
    self.slate = slate
    self.bindGlobalUp = self.keyUp.bind(self)
    self.bindGlobalDown = self.keyDown.bind(self)
    self.bindGlobal()
  }

  bindGlobal() {
    const self = this
    utils.addEvent(document, 'keydown', self.bindGlobalDown)
    utils.addEvent(document, 'keyup', self.bindGlobalUp)
  }

  unbindGlobal() {
    const self = this
    utils.removeEvent(document, 'keydown', self.bindGlobalDown)
    utils.removeEvent(document, 'keyup', self.bindGlobalUp)
  }

  key(e, blnKeyDown) {
    const self = this
    const node = self.slate.nodes.allNodes.find((n) => n.menu.isOpen())
    const key = utils.getKey(e)
    switch (key) {
      case 91:
      case 17: // ctrl
        self.slate.isCtrl = blnKeyDown
        break
      case 16: // shift
        self.slate.isShift = blnKeyDown
        break
      case 18: // alt
        self.slate.isAlt = blnKeyDown
        break
      default:
        break
    }
    if (node) {
      switch (key) {
        case 37:
        case 38:
        case 39:
        case 40: {
          if (blnKeyDown) {
            let span = 2
            if (self.slate.options.viewPort.zoom.r >= 1) {
              span = 1
            } else if (self.slate.options.viewPort.zoom.r <= 0.5) {
              span = 5
            }
            node.relationships._initDrag(self, e)
            if (key === 37) {
              // left
              node.relationships.enactMove(-span, 0, true)
            } else if (key === 38) {
              // up
              node.relationships.enactMove(0, -span, true)
            } else if (key === 39) {
              // right
              if (self.slate.isCtrl) {
                node.connectors.addNode(true)
              } else {
                node.relationships.enactMove(span, 0, true)
              }
            } else if (key === 40) {
              // down
              node.relationships.enactMove(0, span, true)
            }
            node.relationships.showMenu()
          } else {
            node.relationships.finishDrag(true)
          }
          break
        }
        default:
          break
      }
    }
  }

  keyUp(e) {
    this.key(e, false)
  }

  keyDown(e) {
    this.key(e, true)
  }
}
