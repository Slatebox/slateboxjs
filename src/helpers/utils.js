/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import { Raphael } from '../deps/raphael/raphael.svg'

export default class utils {
  static easing = {
    elastic(pos) {
      return (
        -1 * 4 ** (-8 * pos) * Math.sin(((pos * 6 - 1) * (2 * Math.PI)) / 2) + 1
      )
    },
    swingFromTo(pos) {
      let s = 1.70158
      return (pos /= 0.5) < 1
        ? 0.5 * (pos * pos * (((s *= 1.525) + 1) * pos - s))
        : 0.5 * ((pos -= 2) * pos * (((s *= 1.525) + 1) * pos + s) + 2)
    },
    swingFrom(pos) {
      const s = 1.70158
      return pos * pos * ((s + 1) * pos - s)
    },
    swingTo(pos) {
      const s = 1.70158
      return (pos -= 1) * pos * ((s + 1) * pos + s) + 1
    },
    bounce(pos) {
      if (pos < 1 / 2.75) {
        return 7.5625 * pos * pos
      }
      if (pos < 2 / 2.75) {
        return 7.5625 * (pos -= 1.5 / 2.75) * pos + 0.75
      }
      if (pos < 2.5 / 2.75) {
        return 7.5625 * (pos -= 2.25 / 2.75) * pos + 0.9375
      }
      return 7.5625 * (pos -= 2.625 / 2.75) * pos + 0.984375
    },
    bouncePast(pos) {
      if (pos < 1 / 2.75) {
        return 7.5625 * pos * pos
      }
      if (pos < 2 / 2.75) {
        return 2 - (7.5625 * (pos -= 1.5 / 2.75) * pos + 0.75)
      }
      if (pos < 2.5 / 2.75) {
        return 2 - (7.5625 * (pos -= 2.25 / 2.75) * pos + 0.9375)
      }
      return 2 - (7.5625 * (pos -= 2.625 / 2.75) * pos + 0.984375)
    },
    easeFromTo(pos) {
      if ((pos /= 0.5) < 1) {
        return 0.5 * pos ** 4
      }
      return -0.5 * ((pos -= 2) * pos ** 3 - 2)
    },
    easeFrom(pos) {
      return pos ** 4
    },
    easeTo(pos) {
      return pos ** 0.25
    },
    none(pos) {
      return -Math.cos(pos * Math.PI) / 2 + 0.5
    },
  }

  static availColors = [
    { hex: '000000', to: '575757', fore: 'fff' }, // black //six to a row
    { hex: 'FFFFFF', to: 'd9d9d9', fore: '000' }, // white
    { hex: 'FF0000', to: 'a31616', fore: '000' }, // red
    { hex: 'C3FF68', to: 'afff68', fore: '000' }, // green
    { hex: '0B486B', to: '3B88B5', fore: 'fff' }, // blue
    { hex: 'FBB829', to: 'cd900e', fore: '000' }, // orange
    { hex: 'BFF202', to: 'D1F940', fore: '000' }, // yellow
    { hex: 'FF0066', to: 'aa1d55', fore: '000' }, /// pink
    { hex: '800F25', to: '3d0812', fore: 'fff' }, // dark red
    { hex: 'A40802', to: 'd70b03', fore: 'fff' }, // red
    { hex: 'FF5EAA', to: 'cf5d93', fore: '000' }, // strong pink
    { hex: '740062', to: 'D962C6', fore: 'fff' }, // purple
    { hex: 'FF4242', to: 'A61515', fore: 'fff' }, // red
    { hex: 'D15C57', to: '9D5C58', fore: '000' }, // pinkish
    { hex: 'FCFBE3', to: 'c9c56f', fore: '000' }, // light yellow-white
    { hex: 'FF9900', to: 'c98826', fore: '000' }, // orange
    { hex: '369001', to: '9CEE6C', fore: '000' }, // green
    { hex: '9E906E', to: '675324', fore: 'fff' }, // brown
    { hex: 'F3D915', to: 'F9EA7C', fore: '000' }, // yellow 2
    { hex: '031634', to: '2D579A', fore: 'fff' }, // dark blue
    { hex: '556270', to: '7b92ab', fore: 'fff' }, // gray-blue
    { hex: '1693A5', to: '23aad6', fore: 'fff' }, // turquoise
    { hex: 'ADD8C7', to: '59a989', fore: '000' }, // light turquoise
    {
      special: {
        // line options display only colors; node menu displays colors and transparent button
        color: { hex: '8D5800', to: 'EB9605' },
        other: { transparent: true }, // transparent
      },
    },
  ]

  static polygonCache = {}

  static async pause(millis) {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve()
      }, millis)
    })
  }

  static windowSize() {
    let w = 0
    let h = 0

    // IE
    if (!window.innerWidth) {
      // strict mode
      if (!(document.documentElement.clientWidth == 0)) {
        w = document.documentElement.clientWidth
        h = document.documentElement.clientHeight
      }
      // quirks mode
      else {
        w = document.body.clientWidth
        h = document.body.clientHeight
      }
    }
    // w3c
    else {
      w = window.innerWidth
      h = window.innerHeight
    }
    return { width: w, height: h }
  }

  static isElement(o) {
    return typeof HTMLElement === 'object'
      ? o instanceof HTMLElement // DOM2
      : typeof o === 'object' &&
          o.nodeType === 1 &&
          typeof o.nodeName === 'string'
  }

  // convenience
  static el(id) {
    if (id.indexOf('#') > -1 || id.indexOf('.') > -1) {
      return document.querySelector(id)
    }
    return document.getElementById(id)
  }

  // let arr = select("elem.className");
  static select(query) {
    const els = []
    const index = query.indexOf('.')
    if (index !== -1) {
      const tag = query.slice(0, index) || '*'
      const klass = query.slice(index + 1, query.length)

      const all = document.getElementsByTagName(tag)
      for (let d = 0; d < all.length; d += 1) {
        const elem = all[d]
        if (elem.className && elem.className.indexOf(klass) !== -1) {
          els.push(elem)
        }
      }
    }
    return els
  }

  static getKey(e) {
    let keyCode = 0
    try {
      keyCode = e.keyCode
    } catch (Err) {
      keyCode = e.which
    }
    return keyCode
  }

  // fix event inconsistencies across browsers
  static stopEvent(e) {
    e = e || window.event

    if (e.preventDefault) {
      e.stopPropagation()
      e.preventDefault()
    } else {
      e.returnValue = false
      e.cancelBubble = true
    }
    return false
  }

  static toShortDateString(jsonDate) {
    let date = jsonDate
    try {
      const d = new Date(parseInt(jsonDate.substr(6), 10))
      date = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`
    } catch (Err) {}

    return date
  }

  static addEvent(obj, type, fn) {
    obj.addEventListener(type, fn)
  }

  static removeEvent(obj, type, fn) {
    obj.removeEventListener(type, fn)
  }

  // push an event listener into existing array of listeners
  static bind(to, evt, fn) {
    to[evt] = to[evt] || []
    to[evt].push(fn)
  }

  static imageExists(u, cb, id) {
    const iid = `temp_${utils.guid()}`
    const img = document.body.appendChild(document.createElement('img'))
    img.style.position = 'absolute'
    img.style.top = '-10000px'
    img.style.left = '-10000px'
    img.setAttribute('src', u)
    img.setAttribute('id', iid)

    this.addEvent(img, 'load', function (e) {
      const d = getDimensions(img)
      document.body.removeChild(img)
      cb.apply(this, [true, d.width, d.height, id])
    })

    this.addEvent(img, 'error', function (e) {
      document.body.removeChild(img)
      cb.apply(this, [false, 0, 0, id])
    })
  }

  static ajax(u, f, d, v, x, h) {
    x = this.ActiveXObject
    // the guid is essential to break the cache because ie8< seems to want to cache this. argh.
    u = [u, u.indexOf('?') === -1 ? '?' : '&', `guid=${utils.guid()}`].join('')
    x = new (x || XMLHttpRequest)('Microsoft.XMLHTTP')
    const vx = d ? v || 'POST' : v || 'GET'
    x.open(vx, u, 1)
    x.setRequestHeader('Content-type', 'application/json; charset=utf-8')
    h.forEach((hElem) => {
      x.setRequestHeader(hElem.n, hElem.v)
    })
    x.onreadystatechange = () => {
      // eslint-disable-next-line no-unused-expressions
      x.readyState > 3 && f ? f(x.responseText, x) : 0
    }
    x.send(d)
  }

  static hasClass(el, className) {
    if (el.classList) el.classList.contains(className)
    else new RegExp(`(^| )${className}( |$)`, 'gi').test(el.className)
  }

  static addClass(el, className) {
    if (el.classList) el.classList.add(className)
    else el.className += ` ${className}`
  }

  static S4() {
    // eslint-disable-next-line no-bitwise
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }

  static guid() {
    return this.S4() + this.S4() + this.S4()
  }

  static getJSON(url, callback) {
    const id = this.S4() + this.S4()
    let script = document.createElement('script')
    const token = `__jsonp${id}`

    // callback should be a global function
    window[token] = callback

    // url should have "?" parameter which is to be replaced with a global callback name
    script.src = url.replace(/\?(&|$)/, `__jsonp${id}$1`)

    // clean up on load: remove script tag, null script variable and delete global callback function
    script.onload = () => {
      script = null
    }
    document.getElementsByTagName('head')[0].appendChild(script)
  }

  static getBBox(opts) {
    const cont = document.createElement('div')
    cont.setAttribute('id', 'hiddenPaper')
    cont.style.display = 'none'
    document.body.appendChild(cont)
    const pp = new Raphael(cont)
    const bb = pp.path(opts.path).getBBox()
    document.body.removeChild(cont)
    return bb
  }

  static positionedOffset(obj) {
    let curleft = 0
    let curtop = 0
    if (obj.offsetParent) {
      do {
        curleft += obj.offsetLeft
        curtop += obj.offsetTop
        // eslint-disable-next-line no-cond-assign
      } while ((obj = obj.offsetParent))
    }
    return { left: curleft, top: curtop }
  }

  static getDimensions(ele) {
    let width = 0
    let height = 0
    if (typeof ele.clip !== 'undefined') {
      width = ele.clip.width
      height = ele.clip.height
    } else if (ele.style?.pixelWidth) {
      width = ele.style.pixelWidth
      height = ele.style.pixelHeight
    } else {
      width = ele.offsetWidth
      height = ele.offsetHeight
    }
    return { width, height }
  }

  static mousePos(e) {
    let mouseX = null
    let mouseY = null
    const allTouches = []
    if (e.targetTouches) {
      if (e.targetTouches.length) {
        const t = e.targetTouches[0]
        mouseX = t.clientX
        mouseY = t.clientY
        e.targetTouches.forEach((tx) => {
          allTouches.push({
            x: e.targetTouches[tx].clientX,
            y: e.targetTouches[tx].clientY,
          })
        })
      }
    } else {
      mouseX = e.pageX
      mouseY = e.pageY
    }
    return { x: mouseX, y: mouseY, allTouches }
  }

  static centerAndScalePathToFitContainer(opts) {
    // scale and transform the path to fit the box...
    // first get the bbox of the untouched path
    let bb = this.getBBox({ path: opts.path })

    // calculate the scale of the path
    const scale = opts.scaleSize / Math.max(bb.width, bb.height)

    // scale the untouched path
    let newPath = this._transformPath(
      opts.path,
      ['s', scale, ',', scale].join('')
    )

    // go get the bbox of the scaled path
    bb = this.getBBox({ path: newPath })

    // finally, move the scaled vector to the centered x,y coords
    // of the enclosed box
    const tp = [
      'T',
      bb.x * -1 + (opts.containerSize - bb.width) / 2,
      ',',
      bb.y * -1 + (opts.containerSize - bb.height) / 2,
    ].join('')

    newPath = this._transformPath(newPath, tp)

    return { path: newPath, width: bb.width, height: bb.height }
  }

  static buildStyle(_styles) {
    let _str = ''
    Object.keys(_styles).forEach((k) => {
      _str += `${k}:${_styles[k]};`
    })
    return _str
  }

  static whiteOrBlack(hex) {
    return Raphael.rgb2hsb(hex).b < 0.4 ? '#fff' : '#000'
  }

  static _transformPath(original, transform) {
    const rpath = Raphael.transformPath(original, transform).toString()
    return rpath
  }

  static transformPath(_node, _transformation) {
    const _path = Raphael.transformPath(
      _node.vect.attr('path').toString(),
      _transformation
    ).toString()
    _node.options.vectorPath = _path
    _node.vect.transform('')
    _node.vect.attr({ path: _node.options.vectorPath })
    const bb = _node.vect.getBBox()
    const rotationContext = {
      point: {
        x: bb.cx,
        y: bb.cy,
      },
    }
    Object.assign(_node.options.rotate, rotationContext)
    const transformString = _node.getTransformString()
    _node.vect.transform(transformString)

    _node.text.transform('')
    // xPos and yPos are updated in the setPosition in Slatebox.node.js
    _node.text.attr(
      _node.textCoords({ x: _node.options.xPos, y: _node.options.yPos })
    )
    _node.text.transform(transformString)
  }

  static htmlToElement(html) {
    const template = document.createElement('template')
    html = html.trim()
    template.innerHTML = html
    return template.content.firstChild
  }

  static toDataUrl = (url) =>
    fetch(url, { mode: 'cors' })
      .then((response) => response.blob())
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
          })
      )
}
