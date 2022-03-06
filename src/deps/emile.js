/* eslint-disable */
// emile.js (c) 2009 Thomas Fuchs
// Licensed under the terms of the MIT license.

;(function (emile, container) {
  const parseEl = document.createElement('div')
  const props = (
    'backgroundColor borderBottomColor borderBottomWidth borderLeftColor borderLeftWidth ' +
    'borderRightColor borderRightWidth borderSpacing borderTopColor borderTopWidth bottom color fontSize ' +
    'fontWeight height left letterSpacing lineHeight marginBottom marginLeft marginRight marginTop maxHeight ' +
    'maxWidth minHeight minWidth opacity outlineColor outlineOffset outlineWidth paddingBottom paddingLeft ' +
    'paddingRight paddingTop right textIndent top width wordSpacing zIndex'
  ).split(' ')

  function interpolate(source, target, pos) {
    return parseFloat(source + (target - source) * pos).toFixed(3)
  }
  function s(str, p, c) {
    return str.substr(p, c || 1)
  }
  function color(source, target, pos) {
    let i = 2
    let j
    let c
    let tmp
    const v = []
    const r = []
    while (((j = 3), (c = arguments[i - 1]), i--))
      if (s(c, 0) == 'r') {
        c = c.match(/\d+/g)
        while (j--) v.push(~~c[j])
      } else {
        if (c.length == 4)
          c = `#${s(c, 1)}${s(c, 1)}${s(c, 2)}${s(c, 2)}${s(c, 3)}${s(c, 3)}`
        while (j--) v.push(parseInt(s(c, 1 + j * 2, 2), 16))
      }
    while (j--) {
      tmp = ~~(v[j + 3] + (v[j] - v[j + 3]) * pos)
      r.push(tmp < 0 ? 0 : tmp > 255 ? 255 : tmp)
    }
    return `rgb(${r.join(',')})`
  }

  function parse(prop) {
    const p = parseFloat(prop)
    const q = prop.replace(/^[\-\d\.]+/, '')
    return Number.isNaN(p)
      ? { v: q, f: color, u: '' }
      : { v: p, f: interpolate, u: q }
  }

  function normalize(style) {
    let css
    const rules = {}
    let i = props.length
    let v
    parseEl.innerHTML = `<div style="${style}"></div>`
    css = parseEl.childNodes[0].style
    while (i--) if ((v = css[props[i]])) rules[props[i]] = parse(v)
    return rules
  }

  container[emile] = function (el, style, opts) {
    el = typeof el === 'string' ? document.getElementById(el) : el
    opts = opts || {}
    const target = normalize(style)
    const comp = el.currentStyle ? el.currentStyle : getComputedStyle(el, null)
    let prop
    const current = {}
    const start = +new Date()
    const dur = opts.duration || 200
    const finish = start + dur
    let interval
    const easing =
      opts.easing ||
      function (pos) {
        return -Math.cos(pos * Math.PI) / 2 + 0.5
      }
    for (prop in target) current[prop] = parse(comp[prop])
    interval = setInterval(function () {
      window.requestAnimationFrame(() => {
        const time = +new Date()
        const pos = time > finish ? 1 : (time - start) / dur
        for (prop in target) {
          const tv = opts.onMove
            ? opts.onMove(prop)
            : target[prop].f(current[prop].v, target[prop].v, easing(pos))
          el.style[prop] = tv + target[prop].u
        }
        if (time > finish) {
          clearInterval(interval)
          opts.after && opts.after()
        } else {
          opts.during && opts.during.apply(this, [(time - start) / dur])
        }
      })
    }, 10)
  }
})('emile', window)
