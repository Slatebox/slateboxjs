export default class colorPicker {
  constructor(slate, node) {
    this.slate = slate
    this.node = node
  }

  set(cast) {
    this.node.options.backgroundColor = cast.color
    if (cast.opacity != null) this.node.options.opacity = cast.opacity
    this.node.vect.attr({
      fill: cast.color,
      'fill-opacity': this.node.options.opacity,
    })
    if (cast.color === '' && this.node.options.text !== '') {
      this.node.vect.attr({ stroke: this.node.options.borderColor || '#000' })
      this.node.options.borderWidth = 0
    } else {
      this.node.vect.attr({
        stroke: this.node.options.borderColor || '#000',
        'stroke-width': this.node.options.borderWidth,
      })
    }
    this.node.relationships.refreshOwnRelationships()
  }
}
