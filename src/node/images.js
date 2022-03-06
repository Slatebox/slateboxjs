import '../deps/emile'

export default class images {
  constructor(slate, node) {
    this.slate = slate
    this.node = node
  }

  getTargetImageDimensions() {
    let transImageHeight
    let transImageWidth
    const origImageRatio =
      this.node.options.imageOrigWidth / this.node.options.imageOrigHeight

    const noRotationPath = this.slate.paper.path(this.node.vect.attr('path'))
    const noRotationBB = noRotationPath.getBBox()
    const nodeRatio = noRotationBB.width / noRotationBB.height
    if (origImageRatio < nodeRatio) {
      transImageWidth = noRotationBB.width
      transImageHeight = noRotationBB.width / origImageRatio
    } else if (origImageRatio > nodeRatio) {
      transImageHeight = noRotationBB.height
      transImageWidth = noRotationBB.height * origImageRatio
    } else {
      transImageWidth = noRotationBB.width
      transImageHeight = noRotationBB.height
    }

    noRotationPath.remove()

    return {
      width: transImageWidth,
      height: transImageHeight,
    }
  }

  imageSizeCorrection() {
    if (this.node.vect.pattern) {
      const targetImageDimensions = this.getTargetImageDimensions()
      const img = this.node.vect.pattern.getElementsByTagName('image')[0]
      img.setAttribute('height', targetImageDimensions.height)
      img.setAttribute('width', targetImageDimensions.width)
    }
  }

  set(img, w, h, blnKeepResizerOpen) {
    this.node.vect.data({ relativeFill: true })
    this.node.options.image = img
    this.node.options.origImage = { w, h } // needed for image copying if done later
    this.node.options.imageOrigHeight = h // for scaling node to image size purposes; this value should never be changed
    this.node.options.imageOrigWidth = w
    this.node.options['fill-opacity'] = 1

    const sz = {
      fill: `url(${this.node.options.image})`,
      'stroke-width': this.node.options.borderWidth,
      stroke: '#000',
    }

    const targetImageDimensions = this.getTargetImageDimensions()

    this.node.vect.imageOrigHeight = targetImageDimensions.height
    this.node.vect.imageOrigWidth = targetImageDimensions.width

    this.node.vect.attr({ 'fill-opacity': 1 }) // IMPORTANT: for some reason Raphael breaks when setting 'sz' object and this at the same time
    this.node.vect.attr(sz)

    const rotatedBB = this.node.vect.getBBox()
    this.node.options.width = rotatedBB.width
    this.node.options.height = rotatedBB.height

    this.node.relationships.refreshOwnRelationships()
    if (blnKeepResizerOpen) {
      this.node.setPosition({ x: rotatedBB.x, y: rotatedBB.y }, true)
      this.node.menu?.hide()
      this.node.rotate?.hide()
    } else {
      this.node.setPosition({ x: rotatedBB.x, y: rotatedBB.y })
    }
    this.node.connectors?.remove()
  }
}
