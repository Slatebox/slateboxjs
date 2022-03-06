/* eslint-disable new-cap */
/* eslint-disable no-underscore-dangle */
import utils from '../helpers/utils'
import node from '../core/node'

export default class comments {
  constructor(slate) {
    this.slate = slate
    this.engaged = false
  }

  engage() {
    const self = this
    if (!self.engaged) {
      const comment = `M 14.4761 0 H 3.102 C 1.3888 0 0 1.3888 0 3.102 V 8.5307 c 0 1.7132 1.3888 3.102 3.102 3.102 H 9.8297 l 2.803 4.2412 l 0.9018 -4.2412 h 0.9418 c 1.7132 0 3.102 -1.3888 3.102 -3.102 V 3.102 C 17.5781 1.3888 16.1893 0 14.4761 0 z`
      const svg = self.slate.canvas.internal.querySelector('svg')
      svg.addEventListener('mousedown', (e) => {
        const mp = utils.mousePos(e)
        const x = mp.x + self.slate.options.viewPort.left
        const y = mp.y + self.slate.options.viewPort.top

        const tpath = utils._transformPath(comment, `T${x},${y}s2,2`)
        const pbox = utils.getBBox({ path: tpath })

        const commentNodeOpts = {
          text: '',
          xPos: x,
          yPos: y,
          height: pbox.height,
          width: pbox.width,
          vectorPath: tpath,
          allowMenu: false,
          allowDrag: true,
          opacity: 1,
          borderOpacity: 1,
          textOpacity: 1,
        }

        const commentNode = new node(commentNodeOpts)
        self.slate.nodes.add(commentNode)
      })

      self.engaged = true
    }
  }
}
