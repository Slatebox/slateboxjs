/* eslint-disable */
export const extensions = function (R) {
  R.el.loop = function (_options) {
    const _self = this
    const options = {
      pkg: [{ 'stroke-width': 3 }, { 'stroke-width': 1 }],
      duration: 200,
      repeat: false,
    }
    Object.assign(options, _options)

    function loop() {
      _self.animate(options.pkg[0], options.duration, () => {
        _self.animate(options.pkg[1], options.duration, () => {
          if (options.repeat) {
            loop()
          }
        })
      })
    }
    loop()
    return _self
  }

  R.el.tooltip = function (obj, w, h) {
    if (w === undefined) w = 80
    if (h === undefined) h = 20
    const _tt = this.paper.set()
    const pos = this.getBBox()

    if (obj.type === 'text') {
      // text tooltip
      _tt.push(
        this.paper
          .rect(pos.x, pos.y + h * -1 - 10, w, h, 5)
          .attr({ fill: '#fff' })
      )
      _tt.push(
        this.paper.text(pos.x + 5, pos.y - 20, '').attr({
          'text-anchor': 'start',
          stroke: '#fff',
          'font-size': 13,
          fill: '#fff',
        })
      )
    } else {
      // image tooltip
      const xpad = w * -1 - 5
      _tt.push(
        this.paper
          .rect(pos.x + xpad, pos.y + (h / 2) * -1, w, h, 15)
          .attr({ 'stroke-width': 2, stroke: '#fff', 'z-index': 9999 })
      )
      _tt
        .push(this.paper.rect(pos.x + xpad, pos.y + (h / 2 - 45), w, 47, 15))
        .attr({ 'stroke-width': 2, fill: '90-#333-#000', 'z-index': 9999 })
      _tt.push(
        this.paper.text(pos.x + xpad + w / 2, pos.y + (h / 2 - 20), '').attr({
          'text-anchor': 'middle',
          stroke: '#fff',
          'font-weight': 'normal',
          'font-family': 'Verdana',
          'font-size': 11,
          'z-index': 999,
        })
      )
    }

    const s = this
    if (!s.removed) {
      s.tt = _tt
      if (obj.type === 'text') {
        s.tt[0].animate({ stroke: '#000', fill: '#333' }, 200, () => {
          s.tt[1].attr({ text: obj.msg })
        })
      } else {
        s.tt[0].animate({ stroke: '#000', fill: '#333' }, 200, () => {
          // s.tt[1].attr({  });
          s.tt[2].attr({ text: obj.msg })
        })
      }
    }

    return s.tt
  }

  R.el.untooltip = function () {
    this.tt && this.tt.remove()
    return this
  }
}
