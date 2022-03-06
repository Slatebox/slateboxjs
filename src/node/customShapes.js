/* eslint-disable no-underscore-dangle */
import utils from '../helpers/utils'

export default class customShapes {
  constructor(slate, node) {
    this.slate = slate
    this.node = node
  }

  set(path, width, height, sendCollab) {
    let upath = path
    if (width && height) {
      // calculate the scale of the path
      const scale =
        Math.max(this.node.options.width, this.node.options.height) /
        Math.max(width, height)
      upath = utils._transformPath(path, ['s', scale, ',', scale].join(''))
    }
    this.node.shapes.set({
      shape: upath.toString(),
      sendCollab: sendCollab != null ? sendCollab : true,
    })
  }
}
