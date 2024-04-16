/* eslint-disable no-underscore-dangle */
import utils from '../helpers/utils'

export default class keyboard {
  constructor(slate) {
    const self = this
    if (!slate.options.isbirdsEye) {
      self.slate = slate
      self.bindGlobalUp = self.keyUp.bind(self)
      self.bindGlobalDown = self.keyDown.bind(self)
      self.span = 0
      self.bindGlobal()
    }
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
      case 17: // ctrl or cmd
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
            if (self.slate.options.viewPort.zoom.r >= 1) {
              self.span += 1
            } else if (self.slate.options.viewPort.zoom.r <= 0.5) {
              self.span += 5
            } else {
              self.span += 2
            }
            node.relationships._initDrag(self, e)
            if (key === 37) {
              // left
              node.relationships.enactMove(-self.span, 0, true)
            } else if (key === 38) {
              // up
              node.relationships.enactMove(0, -self.span, true)
            } else if (key === 39) {
              // right
              if (self.slate.isCtrl) {
                node.connectors.addNode(true)
              } else {
                node.relationships.enactMove(self.span, 0, true)
              }
            } else if (key === 40) {
              // down
              node.relationships.enactMove(0, self.span, true)
            }
            node.relationships.showMenu()
          } else {
            self.span = 0
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
    this.keyboardActive = false
  }

  keyDown(e) {
    this.key(e, true)
    this.keyboardActive = true
    // always have an escape hatch
    setTimeout(() => {
      if (self.slate) {
        self.slate.isCtrl = false
        self.slate.isShift = false
        self.slate.isAlt = false
      }
    }, 5000)
  }
}
