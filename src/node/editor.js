/* eslint-disable no-param-reassign */
import utils from '../helpers/utils'
import { Raphael } from '../deps/raphael/raphael.svg'

export default class editor {
  constructor(slate, node) {
    this.slate = slate
    this.node = node
  }

  setTextOffset() {
    if (this.node.options.allowDrag) {
      this.node.options.textBounds = this.node.vect.getBBox()
      this.node.options.textOffset = {
        x:
          this.node.options.textBounds.cx -
          this.node.options.textBounds.width / 2 -
          this.node.options.xPos,
        y: this.node.options.textBounds.cy - this.node.options.yPos,
        width: this.node.options.textBounds.width,
        height: this.node.options.textBounds.height,
      }
    }
  }

  set(t, s, f, c, opacity, ta, tb, isCategory) {
    const tempShim = `§` // utils.guid().substring(3);

    if (!t && t !== '') {
      t = this.node.options.text || tempShim
    }
    if (!s) {
      s = this.node.options.fontSize || 12
    }
    if (opacity == null) {
      opacity = this.node.options.textOpacity || 1
    }
    if (!f) {
      f = this.node.options.fontFamily || 'Roboto'
    }
    if (!c) {
      c = this.node.options.foregroundColor || '#000'
    }
    if (!ta) {
      ta = this.node.options.textXAlign || 'middle'
    }
    if (!tb) {
      tb = this.node.options.textYAlign || 'middle'
    }

    // ensure text is always legible if it is set to the same as background
    if (c === this.node.options.backgroundColor) {
      c = utils.whiteOrBlack(this.node.options.backgroundColor)
    }

    this.node.options.text = t
    this.node.options.fontSize = s
    this.node.options.fontFamily = f
    this.node.options.foregroundColor = c
    this.node.options.textOpacity = opacity
    this.node.options.textXAlign = ta
    this.node.options.textYAlign = tb

    let coords = null
    this.setTextOffset()
    coords = this.node.textCoords()
    if (!this.node.text) {
      this.node.text = this.slate.paper.text(
        this.node.options.xPos + coords.x,
        this.node.options.yPos + coords.y,
        t
      )
    }

    coords = this.node.textCoords({
      x: this.node.options.xPos,
      y: this.node.options.yPos,
    })
    this.node.text.attr(coords)

    this.node.text.attr({ text: t })
    this.node.text.attr({ 'font-size': `${s}pt` })
    this.node.text.attr({ 'font-family': f })
    this.node.text.attr({ fill: c })
    this.node.text.attr({ 'text-anchor': ta })
    this.node.text.attr({ 'text-baseline': tb })
    this.node.text.attr({ 'fill-opacity': opacity })
    this.node.text.attr({ class: 'slatebox-text' })
    const noSelect = [
      '-webkit-user-select',
      '-moz-user-select',
      '-ms-user-select',
      'user-select',
    ]
      .map((sx) => `${sx}: none;`)
      .join(' ')
    this.node.text.attr({ style: noSelect })

    if (this.slate.options.autoResizeNodesBasedOnText) {
      const textDimens = utils.getTextWidth(
        this.node.options.text,
        `${this.node.options.fontSize}pt ${this.node.options.fontFamily}`
      )
      // don't replace text if the shape is alpha, otherwise the intent here is to copy the text
      // console.log(
      //   'textDimens',
      //   this.node.options.text,
      //   `${this.node.options.fontSize}pt ${this.node.options.fontFamily}`,
      //   textDimens.width,
      //   textDimens.fontBoundingBoxAscent + textDimens.fontBoundingBoxDescent
      // )

      let nodebb = this.node.vect.getBBox()
      const widthScalar = (textDimens.width - 20) / nodebb.width
      const heightScalar =
        (textDimens.fontBoundingBoxAscent +
          textDimens.fontBoundingBoxDescent -
          20) /
        nodebb.height
      const scaledVectPath = Raphael.transformPath(
        this.node.options.vectorPath,
        `s${widthScalar}, ${heightScalar}`
      ).toString()
      this.node.options.vectorPath = scaledVectPath
      nodebb = this.node.vect.getBBox()
      this.node.options.width = nodebb.width
      this.node.options.height = nodebb.height
      this.node.vect.attr({ path: scaledVectPath })
      this.node.relationships &&
        this.node.relationships.refreshOwnRelationships()
    }

    if (tempShim === t) {
      this.node.options.text = ''
      this.node.text.attr({ text: '' })
    } else {
      setTimeout(() => {
        this.node.text.attr({ text: t })
      }, 10)
    }
  }
}
