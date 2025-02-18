/* eslint-disable */
import { eve } from '../eve.js';
import { R } from './raphael.core.js';

export const Raphael = (function () {
  const has = 'hasOwnProperty';
  const Str = String;
  const toFloat = parseFloat;
  const toInt = parseInt;
  const math = Math;
  const mmax = math.max;
  const { abs } = math;
  const { pow } = math;
  const separator = /[, ]+/;
  const E = '';
  const S = ' ';
  const xlink = 'http://www.w3.org/1999/xlink';
  const markers = {
    block: 'M5,0 0,2.5 5,5z',
    classic: 'M5,0 0,2.5 5,5 3.5,3 3.5,2z',
    diamond: 'M2.5,0 5,2.5 2.5,5 0,2.5z',
    open: 'M6,1 1,3.5 6,6',
    oval: 'M2.5,0A2.5,2.5,0,0,1,2.5,5 2.5,2.5,0,0,1,2.5,0z',
  };
  const markerCounter = {};
  var $ = function (el, attr) {
    if (attr) {
      if (typeof el === 'string') {
        el = $(el);
      }
      for (const key in attr)
        if (attr[has](key)) {
          if (key.substring(0, 6) == 'xlink:') {
            el.setAttributeNS(xlink, key.substring(6), Str(attr[key]));
          } else {
            el.setAttribute(key, Str(attr[key]));
          }
        }
    } else {
      el = R._g.doc.createElementNS('http://www.w3.org/2000/svg', el);
      el.style && (el.style.webkitTapHighlightColor = 'rgba(0,0,0,0)');
    }
    return el;
  };
  const addGradientFill = function (element, gradient) {
    let type = 'linear';
    let id = element.id + gradient;
    let fx = 0.5;
    let fy = 0.5;
    const o = element.node;
    const SVG = element.paper;
    const s = o.style;
    let el = R._g.doc.getElementById(id);
    if (!el) {
      gradient = Str(gradient).replace(R._radial_gradient, (all, _fx, _fy) => {
        type = 'radial';
        if (_fx && _fy) {
          fx = toFloat(_fx);
          fy = toFloat(_fy);
          const dir =
            (fy > 0.5) * 2 - 1(fx - 0.5) ** 2 + (fy - 0.5) ** 2 > 0.25 &&
            (fy = math.sqrt(0.25 - (fx - 0.5) ** 2) * dir + 0.5) &&
            fy != 0.5 &&
            (fy = fy.toFixed(5) - 1e-5 * dir);
        }
        return E;
      });
      gradient = gradient.split(/\s*\-\s*/);
      if (type == 'linear') {
        let angle = gradient.shift();
        angle = -toFloat(angle);
        if (isNaN(angle)) {
          return null;
        }
        var vector = [0, 0, math.cos(R.rad(angle)), math.sin(R.rad(angle))];
        const max = 1 / (mmax(abs(vector[2]), abs(vector[3])) || 1);
        vector[2] *= max;
        vector[3] *= max;
        if (vector[2] < 0) {
          vector[0] = -vector[2];
          vector[2] = 0;
        }
        if (vector[3] < 0) {
          vector[1] = -vector[3];
          vector[3] = 0;
        }
      }
      const dots = R._parseDots(gradient);
      if (!dots) {
        return null;
      }
      id = id.replace(/[\(\)\s,\xb0#]/g, '_');

      if (element.gradient && id != element.gradient.id) {
        SVG.defs.removeChild(element.gradient);
        delete element.gradient;
      }

      if (!element.gradient) {
        el = $(`${type}Gradient`, { id });
        element.gradient = el;
        $(
          el,
          type == 'radial'
            ? {
                fx,
                fy,
              }
            : {
                x1: vector[0],
                y1: vector[1],
                x2: vector[2],
                y2: vector[3],
                gradientTransform: element.matrix.invert(),
              }
        );
        SVG.defs.appendChild(el);
        for (let i = 0, ii = dots.length; i < ii; i++) {
          el.appendChild(
            $('stop', {
              offset: dots[i].offset ? dots[i].offset : i ? '100%' : '0%',
              'stop-color': dots[i].color || '#fff',
              'stop-opacity': isFinite(dots[i].opacity) ? dots[i].opacity : 1,
            })
          );
        }
      }
    }
    $(o, {
      fill: fillurl(id),
      opacity: 1,
      'fill-opacity': 1,
    });
    s.fill = E;
    s.opacity = 1;
    s.fillOpacity = 1;
    return 1;
  };
  const isIE9or10 = function () {
    const mode = document.documentMode;
    return mode && (mode === 9 || mode === 10);
  };
  var fillurl = function (id) {
    // SLATEBOX - always make the fillurl relative to the page, makes svg exports work
    return `url('#${id}')`;
    // if (isIE9or10()) {
    //     return "url('#" + id + "')";
    // }
    // var location = document.location;
    // var locationString = (
    //     location.protocol + '//' +
    //     location.host +
    //     location.pathname +
    //     location.search
    // );
    // return "url('" + locationString + "#" + id + "')";
  };
  // SLATEBOX - edit for image filling (not tiling patterns) of path elements
  const updatePosition = function (o) {
    if (!o.data('relativeFill')) {
      const bbox = o.getBBox(1);
      $(o.pattern, {
        patternTransform: `${o.matrix.invert()} translate(${bbox.x},${bbox.y})`,
      });
    }
  };
  const addArrow = function (o, value, isEnd) {
    if (o.type == 'path') {
      const values = Str(value).toLowerCase().split('-');
      const p = o.paper;
      const se = isEnd ? 'end' : 'start';
      const { node } = o;
      const { attrs } = o;
      const stroke = attrs['stroke-width'];
      let i = values.length;
      let type = 'classic';
      let from;
      let to;
      let dx;
      let refX;
      let attr;
      let w = 3;
      let h = 3;
      let t = 5;
      while (i--) {
        switch (values[i]) {
          case 'block':
          case 'classic':
          case 'oval':
          case 'diamond':
          case 'open':
          case 'none':
            type = values[i];
            break;
          case 'wide':
            h = 5;
            break;
          case 'narrow':
            h = 2;
            break;
          case 'long':
            w = 5;
            break;
          case 'short':
            w = 2;
            break;
        }
      }
      if (type == 'open') {
        w += 2;
        h += 2;
        t += 2;
        dx = 1;
        refX = isEnd ? 4 : 1;
        attr = {
          fill: 'none',
          stroke: attrs.stroke,
        };
      } else {
        refX = dx = w / 2;
        attr = {
          fill: attrs.stroke,
          stroke: 'none',
        };
      }
      if (o._.arrows) {
        if (isEnd) {
          o._.arrows.endPath && markerCounter[o._.arrows.endPath]--;
          o._.arrows.endMarker && markerCounter[o._.arrows.endMarker]--;
        } else {
          o._.arrows.startPath && markerCounter[o._.arrows.startPath]--;
          o._.arrows.startMarker && markerCounter[o._.arrows.startMarker]--;
        }
      } else {
        o._.arrows = {};
      }
      if (type != 'none') {
        const pathId = `raphael-marker-${type}`;
        const markerId = `raphael-marker-${se}${type}${w}${h}-obj${o.id}`;
        // SLATEBOX - addition to make sure arrows show in svg extract
        if (
          !R._g.doc.getElementById(pathId) ||
          (R._g.doc.getElementById(pathId) &&
            getComputedStyle(R._g.doc.getElementById(pathId)).display ===
              'none')
        ) {
          p.defs.appendChild(
            $($('path'), {
              'stroke-linecap': 'round',
              d: markers[type],
              id: pathId,
            })
          );
          markerCounter[pathId] = 1;
        } else {
          markerCounter[pathId]++;
        }
        let marker = R._g.doc.getElementById(markerId);
        let use;
        if (!marker) {
          marker = $($('marker'), {
            id: markerId,
            markerHeight: h,
            markerWidth: w,
            orient: 'auto',
            refX,
            refY: h / 2,
          });
          use = $($('use'), {
            'xlink:href': `#${pathId}`,
            transform: `${isEnd ? `rotate(180 ${w / 2} ${h / 2}) ` : E}scale(${
              w / t
            },${h / t})`,
            'stroke-width': (1 / ((w / t + h / t) / 2)).toFixed(4),
          });
          marker.appendChild(use);
          p.defs.appendChild(marker);
          markerCounter[markerId] = 1;
        } else {
          markerCounter[markerId]++;
          use = marker.getElementsByTagName('use')[0];
        }
        $(use, attr);
        const delta = dx * (type != 'diamond' && type != 'oval');
        if (isEnd) {
          from = o._.arrows.startdx * stroke || 0;
          to = R.getTotalLength(attrs.path) - delta * stroke;
        } else {
          from = delta * stroke;
          to = R.getTotalLength(attrs.path) - (o._.arrows.enddx * stroke || 0);
        }
        attr = {};
        attr[`marker-${se}`] = `url(#${markerId})`;
        if (to || from) {
          attr.d = R.getSubpath(attrs.path, from, to);
        }
        $(node, attr);
        o._.arrows[`${se}Path`] = pathId;
        o._.arrows[`${se}Marker`] = markerId;
        o._.arrows[`${se}dx`] = delta;
        o._.arrows[`${se}Type`] = type;
        o._.arrows[`${se}String`] = value;
      } else {
        if (isEnd) {
          from = o._.arrows.startdx * stroke || 0;
          to = R.getTotalLength(attrs.path) - from;
        } else {
          from = 0;
          to = R.getTotalLength(attrs.path) - (o._.arrows.enddx * stroke || 0);
        }
        o._.arrows[`${se}Path`] &&
          $(node, { d: R.getSubpath(attrs.path, from, to) });
        delete o._.arrows[`${se}Path`];
        delete o._.arrows[`${se}Marker`];
        delete o._.arrows[`${se}dx`];
        delete o._.arrows[`${se}Type`];
        delete o._.arrows[`${se}String`];
      }
      for (attr in markerCounter)
        if (markerCounter[has](attr) && !markerCounter[attr]) {
          const item = R._g.doc.getElementById(attr);
          item && item.parentNode.removeChild(item);
        }
    }
  };
  const dasharray = {
    '-': [3, 1],
    '.': [1, 1],
    '-.': [3, 1, 1, 1],
    '-..': [3, 1, 1, 1, 1, 1],
    '. ': [1, 3],
    '- ': [4, 3],
    '--': [8, 3],
    '- .': [4, 3, 1, 3],
    '--.': [8, 3, 1, 3],
    '--..': [8, 3, 1, 3, 1, 3],
  };
  const addDashes = function (o, value, params) {
    value = dasharray[Str(value).toLowerCase()];
    if (value) {
      const width = o.attrs['stroke-width'] || '1';
      const butt =
        { round: width, square: width, butt: 0 }[
          o.attrs['stroke-linecap'] || params['stroke-linecap']
        ] || 0;
      const dashes = [];
      let i = value.length;
      while (i--) {
        dashes[i] = value[i] * width + (i % 2 ? 1 : -1) * butt;
      }
      $(o.node, { 'stroke-dasharray': dashes.join(',') });
    } else {
      $(o.node, { 'stroke-dasharray': 'none' });
    }
  };
  const setFillAndStroke = function (o, params) {
    const { node } = o;
    const { attrs } = o;
    const vis = node.style.visibility;
    node.style.visibility = 'hidden';
    for (let att in params) {
      if (params[has](att)) {
        if (!R._availableAttrs[has](att)) {
          continue;
        }
        let value = params[att];
        attrs[att] = value;
        switch (att) {
          case 'blur':
            o.blur(value);
            break;
          case 'title':
            var title = node.getElementsByTagName('title');

            // Use the existing <title>.
            if (title.length && (title = title[0])) {
              title.firstChild.nodeValue = value;
            } else {
              title = $('title');
              const val = R._g.doc.createTextNode(value);
              title.appendChild(val);
              node.appendChild(title);
            }
            break;
          case 'href':
          case 'target':
            var pn = node.parentNode;
            if (pn.tagName.toLowerCase() != 'a') {
              const hl = $('a');
              pn.insertBefore(hl, node);
              hl.appendChild(node);
              pn = hl;
            }
            if (att == 'target') {
              pn.setAttributeNS(
                xlink,
                'show',
                value == 'blank' ? 'new' : value
              );
            } else {
              pn.setAttributeNS(xlink, att, value);
            }
            break;
          case 'cursor':
            node.style.cursor = value;
            break;
          case 'transform':
            o.transform(value);
            break;
          case 'arrow-start':
            addArrow(o, value);
            break;
          case 'arrow-end':
            addArrow(o, value, 1);
            break;
          case 'clip-rect':
            var rect = Str(value).split(separator);
            if (rect.length == 4) {
              o.clip &&
                o.clip.parentNode.parentNode.removeChild(o.clip.parentNode);
              var el = $('clipPath');
              const rc = $('rect');
              el.id = R.createUUID();
              $(rc, {
                x: rect[0],
                y: rect[1],
                width: rect[2],
                height: rect[3],
              });
              el.appendChild(rc);
              o.paper.defs.appendChild(el);
              $(node, { 'clip-path': `url(#${el.id})` });
              o.clip = rc;
            }
            if (!value) {
              const path = node.getAttribute('clip-path');
              if (path) {
                const clip = R._g.doc.getElementById(
                  path.replace(/(^url\(#|\)$)/g, E)
                );
                clip && clip.parentNode.removeChild(clip);
                $(node, { 'clip-path': E });
                delete o.clip;
              }
            }
            break;
          case 'path':
            // SLATEBOX - changed "$(node, {d: value ? attrs.path = R._pathToAbsolute(value) : "M0,0"});"
            // to $(node, {d: value ? attrs.path = value : "M0,0"}); in the line below -->
            if (o.type == 'path') {
              $(node, { d: value ? (attrs.path = value) : 'M0,0' }); // <--
              o._.dirty = 1;
              if (o._.arrows) {
                'startString' in o._.arrows &&
                  addArrow(o, o._.arrows.startString);
                'endString' in o._.arrows &&
                  addArrow(o, o._.arrows.endString, 1);
              }
            }
            break;
          case 'width':
            node.setAttribute(att, value);
            o._.dirty = 1;
            if (attrs.fx) {
              att = 'x';
              value = attrs.x;
            } else {
              break;
            }
          case 'x':
            if (attrs.fx) {
              value = -attrs.x - (attrs.width || 0);
            }
          case 'rx':
            if (att == 'rx' && o.type == 'rect') {
              break;
            }
          case 'cx':
            node.setAttribute(att, value);
            o.pattern && updatePosition(o);
            o._.dirty = 1;
            break;
          case 'height':
            node.setAttribute(att, value);
            o._.dirty = 1;
            if (attrs.fy) {
              att = 'y';
              value = attrs.y;
            } else {
              break;
            }
          case 'y':
            if (attrs.fy) {
              value = -attrs.y - (attrs.height || 0);
            }
          case 'ry':
            if (att == 'ry' && o.type == 'rect') {
              break;
            }
          case 'cy':
            node.setAttribute(att, value);
            o.pattern && updatePosition(o);
            o._.dirty = 1;
            break;
          case 'r':
            if (o.type == 'rect') {
              $(node, { rx: value, ry: value });
            } else {
              node.setAttribute(att, value);
            }
            o._.dirty = 1;
            break;
          case 'src':
            if (o.type == 'image') {
              node.setAttributeNS(xlink, 'href', value);
            }
            break;
          case 'stroke-width':
            if (o._.sx != 1 || o._.sy != 1) {
              value /= mmax(abs(o._.sx), abs(o._.sy)) || 1;
            }
            node.setAttribute(att, value);
            if (attrs['stroke-dasharray']) {
              addDashes(o, attrs['stroke-dasharray'], params);
            }
            if (o._.arrows) {
              'startString' in o._.arrows &&
                addArrow(o, o._.arrows.startString);
              'endString' in o._.arrows && addArrow(o, o._.arrows.endString, 1);
            }
            break;
          case 'stroke-dasharray':
            addDashes(o, value, params);
            break;
          case 'fill':
            // SLATEBOX a few edits for image filling (not tiling patterns) of path elements
            var relativeFill = o.data('relativeFill');
            var isURL = Str(value).match(R._ISURL);
            if (isURL) {
              if (value.indexOf('(#') > -1) {
                // internal reference
                $(node, { fill: value });
              } else {
                // image, external
                el = $('pattern');
                var ig = $('image');
                el.id = R.createUUID();
                $(el, {
                  x: 0,
                  y: 0,
                  patternUnits: relativeFill
                    ? 'objectBoundingBox'
                    : 'userSpaceOnUse',
                  height: 1,
                  width: 1,
                });
                $(ig, { x: 0, y: 0, 'xlink:href': isURL[1] });
                el.appendChild(ig);
                (function (el) {
                  R._preload(isURL[1], function () {
                    const w = this.offsetWidth;
                    const h = this.offsetHeight;
                    const tempPath = o.paper.path(o.attr('path'));
                    const bbox = tempPath.getBBox();
                    $(el, {
                      width: relativeFill ? 1 : w,
                      height: relativeFill ? 1 : h,
                    });
                    // SLATEBOX - image fixes for FF/safari
                    $(ig, {
                      width: relativeFill ? o.imageOrigWidth || bbox.width : w,
                      height: relativeFill
                        ? o.imageOrigHeight || bbox.height
                        : h,
                    });

                    delete o.imageOrigHeight;
                    delete o.imageOrigWidth;
                    tempPath.remove();
                    // end image fixes for SB
                  });
                })(el);
                o.paper.defs.appendChild(el);
                $(node, { fill: `url(#${el.id})` });
                o.pattern = el;
                o.pattern && updatePosition(o);
              }

              break;
            }
            var clr = R.getRGB(value);
            if (!clr.error) {
              delete params.gradient;
              delete attrs.gradient;
              !R.is(attrs.opacity, 'undefined') &&
                R.is(params.opacity, 'undefined') &&
                $(node, { opacity: attrs.opacity });
              !R.is(attrs['fill-opacity'], 'undefined') &&
                R.is(params['fill-opacity'], 'undefined') &&
                $(node, { 'fill-opacity': attrs['fill-opacity'] });
            } else if (
              (o.type == 'circle' ||
                o.type == 'ellipse' ||
                Str(value).charAt() != 'r') &&
              addGradientFill(o, value)
            ) {
              if ('opacity' in attrs || 'fill-opacity' in attrs) {
                var gradient = R._g.doc.getElementById(
                  node.getAttribute('fill').replace(/^url\(#|\)$/g, E)
                );
                if (gradient) {
                  var stops = gradient.getElementsByTagName('stop');
                  $(stops[stops.length - 1], {
                    'stop-opacity':
                      ('opacity' in attrs ? attrs.opacity : 1) *
                      ('fill-opacity' in attrs ? attrs['fill-opacity'] : 1),
                  });
                }
              }
              attrs.gradient = value;
              attrs.fill = 'none';
              break;
            }
            clr[has]('opacity') &&
              $(node, {
                'fill-opacity':
                  clr.opacity > 1 ? clr.opacity / 100 : clr.opacity,
              });
          case 'stroke':
            clr = R.getRGB(value);
            node.setAttribute(att, clr.hex);
            att == 'stroke' &&
              clr[has]('opacity') &&
              $(node, {
                'stroke-opacity':
                  clr.opacity > 1 ? clr.opacity / 100 : clr.opacity,
              });
            if (att == 'stroke' && o._.arrows) {
              'startString' in o._.arrows &&
                addArrow(o, o._.arrows.startString);
              'endString' in o._.arrows && addArrow(o, o._.arrows.endString, 1);
            }
            break;
          case 'gradient':
            (o.type == 'circle' ||
              o.type == 'ellipse' ||
              Str(value).charAt() != 'r') &&
              addGradientFill(o, value);
            break;
          case 'opacity':
            if (attrs.gradient && !attrs[has]('stroke-opacity')) {
              $(node, { 'stroke-opacity': value > 1 ? value / 100 : value });
            }
          // fall
          case 'fill-opacity':
            if (attrs.gradient) {
              gradient = R._g.doc.getElementById(
                node.getAttribute('fill').replace(/^url\(#|\)$/g, E)
              );
              if (gradient) {
                stops = gradient.getElementsByTagName('stop');
                $(stops[stops.length - 1], { 'stop-opacity': value });
              }
              break;
            }
          default:
            att == 'font-size' && (value = `${toInt(value, 10)}px`);
            var cssrule = att.replace(/(\-.)/g, (w) =>
              w.substring(1).toUpperCase()
            );
            node.style[cssrule] = value;
            o._.dirty = 1;
            node.setAttribute(att, value);
            break;
        }
      }
    }

    tuneText(o, params);
    node.style.visibility = vis;
  };
  const leading = 1.2;
  var tuneText = function (el, params) {
    if (
      el.type != 'text' ||
      !(
        params[has]('text') ||
        params[has]('font') ||
        params[has]('font-size') ||
        params[has]('x') ||
        params[has]('y')
      )
    ) {
      return;
    }
    const a = el.attrs;
    const { node } = el;
    const fontSize = node.firstChild
      ? toInt(
          R._g.doc.defaultView
            .getComputedStyle(node.firstChild, E)
            .getPropertyValue('font-size'),
          10
        )
      : 10;

    if (params[has]('text')) {
      a.text = params.text;
      while (node.firstChild) {
        node.removeChild(node.firstChild);
      }
      const texts = Str(params.text).split('\n');
      var tspans = [];
      let tspan;
      for (var i = 0, ii = texts.length; i < ii; i++) {
        tspan = $('tspan');
        i && $(tspan, { dy: fontSize * leading, x: a.x });
        tspan.appendChild(R._g.doc.createTextNode(texts[i]));
        node.appendChild(tspan);
        tspans[i] = tspan;
      }
    } else {
      tspans = node.getElementsByTagName('tspan');
      for (i = 0, ii = tspans.length; i < ii; i++)
        if (i) {
          $(tspans[i], { dy: fontSize * leading, x: a.x });
        } else {
          $(tspans[0], { dy: 0 });
        }
    }
    $(node, { x: a.x, y: a.y });
    el._.dirty = 1;
    const bb = el._getBBox();
    const dif = a.y - (bb.y + bb.height / 2);
    dif && R.is(dif, 'finite') && $(tspans[0], { dy: dif });
  };
  const getRealNode = function (node) {
    if (node.parentNode && node.parentNode.tagName.toLowerCase() === 'a') {
      return node.parentNode;
    }
    return node;
  };
  const Element = function (node, svg) {
    const X = 0;
    const Y = 0;
    /* \
       * Element.node
       [ property (object) ]
       **
       * Gives you a reference to the DOM object, so you can assign event handlers or just mess around.
       **
       * Note: Don’t mess with it.
       > Usage
       | // draw a circle at coordinate 10,10 with radius of 10
       | var c = paper.circle(10, 10, 10);
       | c.node.onclick = function () {
       |     c.attr("fill", "red");
       | };
      \ */
    this[0] = this.node = node;
    /* \
       * Element.raphael
       [ property (object) ]
       **
       * Internal reference to @Raphael object. In case it is not available.
       > Usage
       | Raphael.el.red = function () {
       |     var hsb = this.paper.raphael.rgb2hsb(this.attr("fill"));
       |     hsb.h = 1;
       |     this.attr({fill: this.paper.raphael.hsb2rgb(hsb).hex});
       | }
      \ */
    node.raphael = true;
    /* \
       * Element.id
       [ property (number) ]
       **
       * Unique id of the element. Especially useful when you want to listen to events of the element,
       * because all events are fired in format `<module>.<action>.<id>`. Also useful for @Paper.getById method.
      \ */
    this.id = guid();
    node.raphaelid = this.id;

    /**
     * Method that returns a 5 letter/digit id, enough for 36^5 = 60466176 elements
     * @returns {string} id
     */
    function guid() {
      return `0000${((Math.random() * 36 ** 5) << 0).toString(36)}`.slice(-5);
    }

    this.matrix = R.matrix();
    this.realPath = null;
    /* \
       * Element.paper
       [ property (object) ]
       **
       * Internal reference to “paper” where object drawn. Mainly for use in plugins and element extensions.
       > Usage
       | Raphael.el.cross = function () {
       |     this.attr({fill: "red"});
       |     this.paper.path("M10,10L50,50M50,10L10,50")
       |         .attr({stroke: "red"});
       | }
      \ */
    this.paper = svg;
    this.attrs = this.attrs || {};
    this._ = {
      transform: [],
      sx: 1,
      sy: 1,
      deg: 0,
      dx: 0,
      dy: 0,
      dirty: 1,
    };
    !svg.bottom && (svg.bottom = this);
    /* \
       * Element.prev
       [ property (object) ]
       **
       * Reference to the previous element in the hierarchy.
      \ */
    this.prev = svg.top;
    svg.top && (svg.top.next = this);
    svg.top = this;
    /* \
       * Element.next
       [ property (object) ]
       **
       * Reference to the next element in the hierarchy.
      \ */
    this.next = null;
  };
  const elproto = R.el;

  Element.prototype = elproto;
  elproto.constructor = Element;

  R._engine.path = function (pathString, SVG) {
    const el = $('path');
    SVG.canvas && SVG.canvas.appendChild(el);
    const p = new Element(el, SVG);
    p.type = 'path';
    setFillAndStroke(p, {
      fill: 'none',
      stroke: '#000',
      path: pathString,
    });
    return p;
  };
  /* \
   * Element.rotate
   [ method ]
   **
   * Deprecated! Use @Element.transform instead.
   * Adds rotation by given angle around given point to the list of
   * transformations of the element.
   > Parameters
   - deg (number) angle in degrees
   - cx (number) #optional x coordinate of the centre of rotation
   - cy (number) #optional y coordinate of the centre of rotation
   * If cx & cy aren’t specified centre of the shape is used as a point of rotation.
   = (object) @Element
  \ */
  elproto.rotate = function (deg, cx, cy) {
    if (this.removed) {
      return this;
    }
    deg = Str(deg).split(separator);
    if (deg.length - 1) {
      cx = toFloat(deg[1]);
      cy = toFloat(deg[2]);
    }
    deg = toFloat(deg[0]);
    cy == null && (cx = cy);
    if (cx == null || cy == null) {
      const bbox = this.getBBox(1);
      cx = bbox.x + bbox.width / 2;
      cy = bbox.y + bbox.height / 2;
    }
    this.transform(this._.transform.concat([['r', deg, cx, cy]]));
    return this;
  };
  /* \
   * Element.scale
   [ method ]
   **
   * Deprecated! Use @Element.transform instead.
   * Adds scale by given amount relative to given point to the list of
   * transformations of the element.
   > Parameters
   - sx (number) horisontal scale amount
   - sy (number) vertical scale amount
   - cx (number) #optional x coordinate of the centre of scale
   - cy (number) #optional y coordinate of the centre of scale
   * If cx & cy aren’t specified centre of the shape is used instead.
   = (object) @Element
  \ */
  elproto.scale = function (sx, sy, cx, cy) {
    if (this.removed) {
      return this;
    }
    sx = Str(sx).split(separator);
    if (sx.length - 1) {
      sy = toFloat(sx[1]);
      cx = toFloat(sx[2]);
      cy = toFloat(sx[3]);
    }
    sx = toFloat(sx[0]);
    sy == null && (sy = sx);
    cy == null && (cx = cy);
    if (cx == null || cy == null) {
      var bbox = this.getBBox(1);
    }
    cx = cx == null ? bbox.x + bbox.width / 2 : cx;
    cy = cy == null ? bbox.y + bbox.height / 2 : cy;
    this.transform(this._.transform.concat([['s', sx, sy, cx, cy]]));
    return this;
  };
  /* \
   * Element.translate
   [ method ]
   **
   * Deprecated! Use @Element.transform instead.
   * Adds translation by given amount to the list of transformations of the element.
   > Parameters
   - dx (number) horisontal shift
   - dy (number) vertical shift
   = (object) @Element
  \ */
  elproto.translate = function (dx, dy) {
    if (this.removed) {
      return this;
    }
    dx = Str(dx).split(separator);
    if (dx.length - 1) {
      dy = toFloat(dx[1]);
    }
    dx = toFloat(dx[0]) || 0;
    dy = +dy || 0;
    this.transform(this._.transform.concat([['t', dx, dy]]));
    return this;
  };
  /* \
   * Element.transform
   [ method ]
   **
   * Adds transformation to the element which is separate to other attributes,
   * i.e. translation doesn’t change `x` or `y` of the rectange. The format
   * of transformation string is similar to the path string syntax:
   | "t100,100r30,100,100s2,2,100,100r45s1.5"
   * Each letter is a command. There are four commands: `t` is for translate, `r` is for rotate, `s` is for
   * scale and `m` is for matrix.
   *
   * There are also alternative “absolute” translation, rotation and scale: `T`, `R` and `S`. They will not take previous transformation into account. For example, `...T100,0` will always move element 100 px horisontally, while `...t100,0` could move it vertically if there is `r90` before. Just compare results of `r90t100,0` and `r90T100,0`.
   *
   * So, the example line above could be read like “translate by 100, 100; rotate 30° around 100, 100; scale twice around 100, 100;
   * rotate 45° around centre; scale 1.5 times relative to centre”. As you can see rotate and scale commands have origin
   * coordinates as optional parameters, the default is the centre point of the element.
   * Matrix accepts six parameters.
   > Usage
   | var el = paper.rect(10, 20, 300, 200);
   | // translate 100, 100, rotate 45°, translate -100, 0
   | el.transform("t100,100r45t-100,0");
   | // if you want you can append or prepend transformations
   | el.transform("...t50,50");
   | el.transform("s2...");
   | // or even wrap
   | el.transform("t50,50...t-50-50");
   | // to reset transformation call method with empty string
   | el.transform("");
   | // to get current value call it without parameters
   | console.log(el.transform());
   > Parameters
   - tstr (string) #optional transformation string
   * If tstr isn’t specified
   = (string) current transformation string
   * else
   = (object) @Element
  \ */
  elproto.transform = function (tstr) {
    const { _ } = this;
    if (tstr == null) {
      return _.transform;
    }
    R._extractTransform(this, tstr);

    this.clip && $(this.clip, { transform: this.matrix.invert() });
    this.pattern && updatePosition(this);
    this.node && $(this.node, { transform: this.matrix });

    if (_.sx != 1 || _.sy != 1) {
      const sw = this.attrs[has]('stroke-width')
        ? this.attrs['stroke-width']
        : 1;
      this.attr({ 'stroke-width': sw });
    }

    return this;
  };
  /* \
   * Element.hide
   [ method ]
   **
   * Makes element invisible. See @Element.show.
   = (object) @Element
  \ */
  elproto.hide = function () {
    if (!this.removed) this.node.style.display = 'none';
    return this;
  };
  /* \
   * Element.show
   [ method ]
   **
   * Makes element visible. See @Element.hide.
   = (object) @Element
  \ */
  elproto.show = function () {
    if (!this.removed) this.node.style.display = '';
    return this;
  };
  /* \
   * Element.remove
   [ method ]
   **
   * Removes element from the paper.
  \ */
  elproto.remove = function () {
    const node = getRealNode(this.node);
    if (this.removed || !node.parentNode) {
      return;
    }
    const { paper } = this;
    paper.__set__ && paper.__set__.exclude(this);
    eve.unbind(`raphael.*.*.${this.id}`);
    if (this.gradient) {
      paper.defs.removeChild(this.gradient);
    }
    R._tear(this, paper);

    node.parentNode.removeChild(node);

    // Remove custom data for element
    this.removeData();

    for (const i in this) {
      this[i] = typeof this[i] === 'function' ? R._removedFactory(i) : null;
    }
    this.removed = true;
  };
  elproto._getBBox = function () {
    if (this.node.style.display == 'none') {
      this.show();
      var hide = true;
    }
    let canvasHidden = false;
    let containerStyle;
    if (this.paper.canvas.parentElement) {
      containerStyle = this.paper.canvas.parentElement.style;
    } // IE10+ can't find parentElement
    else if (this.paper.canvas.parentNode) {
      containerStyle = this.paper.canvas.parentNode.style;
    }

    if (containerStyle && containerStyle.display == 'none') {
      canvasHidden = true;
      containerStyle.display = '';
    }
    let bbox = {};
    try {
      bbox = this.node.getBBox();
    } catch (e) {
      // Firefox 3.0.x, 25.0.1 (probably more versions affected) play badly here - possible fix
      bbox = {
        x: this.node.clientLeft,
        y: this.node.clientTop,
        width: this.node.clientWidth,
        height: this.node.clientHeight,
      };
    } finally {
      bbox = bbox || {};
      if (canvasHidden) {
        containerStyle.display = 'none';
      }
    }
    hide && this.hide();
    return bbox;
  };
  /* \
   * Element.attr
   [ method ]
   **
   * Sets the attributes of the element.
   > Parameters
   - attrName (string) attribute’s name
   - value (string) value
   * or
   - params (object) object of name/value pairs
   * or
   - attrName (string) attribute’s name
   * or
   - attrNames (array) in this case method returns array of current values for given attribute names
   = (object) @Element if attrsName & value or params are passed in.
   = (...) value of the attribute if only attrsName is passed in.
   = (array) array of values of the attribute if attrsNames is passed in.
   = (object) object of attributes if nothing is passed in.
   > Possible parameters
   # <p>Please refer to the <a href="http://www.w3.org/TR/SVG/" title="The W3C Recommendation for the SVG language describes these properties in detail.">SVG specification</a> for an explanation of these parameters.</p>
   o arrow-end (string) arrowhead on the end of the path. The format for string is `<type>[-<width>[-<length>]]`. Possible types: `classic`, `block`, `open`, `oval`, `diamond`, `none`, width: `wide`, `narrow`, `medium`, length: `long`, `short`, `midium`.
   o clip-rect (string) comma or space separated values: x, y, width and height
   o cursor (string) CSS type of the cursor
   o cx (number) the x-axis coordinate of the center of the circle, or ellipse
   o cy (number) the y-axis coordinate of the center of the circle, or ellipse
   o fill (string) colour, gradient or image
   o fill-opacity (number)
   o font (string)
   o font-family (string)
   o font-size (number) font size in pixels
   o font-weight (string)
   o height (number)
   o href (string) URL, if specified element behaves as hyperlink
   o opacity (number)
   o path (string) SVG path string format
   o r (number) radius of the circle, ellipse or rounded corner on the rect
   o rx (number) horisontal radius of the ellipse
   o ry (number) vertical radius of the ellipse
   o src (string) image URL, only works for @Element.image element
   o stroke (string) stroke colour
   o stroke-dasharray (string) [“”, “none”, “`-`”, “`.`”, “`-.`”, “`-..`”, “`. `”, “`- `”, “`--`”, “`- .`”, “`--.`”, “`--..`”]
   o stroke-linecap (string) [“`butt`”, “`square`”, “`round`”]
   o stroke-linejoin (string) [“`bevel`”, “`round`”, “`miter`”]
   o stroke-miterlimit (number)
   o stroke-opacity (number)
   o stroke-width (number) stroke width in pixels, default is '1'
   o target (string) used with href
   o text (string) contents of the text element. Use `\n` for multiline text
   o text-anchor (string) [“`start`”, “`middle`”, “`end`”], default is “`middle`”
   o title (string) will create tooltip with a given text
   o transform (string) see @Element.transform
   o width (number)
   o x (number)
   o y (number)
   > Gradients
   * Linear gradient format: “`‹angle›-‹colour›[-‹colour›[:‹offset›]]*-‹colour›`”, example: “`90-#fff-#000`” – 90°
   * gradient from white to black or “`0-#fff-#f00:20-#000`” – 0° gradient from white via red (at 20%) to black.
   *
   * radial gradient: “`r[(‹fx›, ‹fy›)]‹colour›[-‹colour›[:‹offset›]]*-‹colour›`”, example: “`r#fff-#000`” –
   * gradient from white to black or “`r(0.25, 0.75)#fff-#000`” – gradient from white to black with focus point
   * at 0.25, 0.75. Focus point coordinates are in 0..1 range. Radial gradients can only be applied to circles and ellipses.
   > Path String
   # <p>Please refer to <a href="http://www.w3.org/TR/SVG/paths.html#PathData" title="Details of a path’s data attribute’s format are described in the SVG specification.">SVG documentation regarding path string</a>. Raphaël fully supports it.</p>
   > Colour Parsing
   # <ul>
   #     <li>Colour name (“<code>red</code>”, “<code>green</code>”, “<code>cornflowerblue</code>”, etc)</li>
   #     <li>#••• — shortened HTML colour: (“<code>#000</code>”, “<code>#fc0</code>”, etc)</li>
   #     <li>#•••••• — full length HTML colour: (“<code>#000000</code>”, “<code>#bd2300</code>”)</li>
   #     <li>rgb(•••, •••, •••) — red, green and blue channels’ values: (“<code>rgb(200,&nbsp;100,&nbsp;0)</code>”)</li>
   #     <li>rgb(•••%, •••%, •••%) — same as above, but in %: (“<code>rgb(100%,&nbsp;175%,&nbsp;0%)</code>”)</li>
   #     <li>rgba(•••, •••, •••, •••) — red, green and blue channels’ values: (“<code>rgba(200,&nbsp;100,&nbsp;0, .5)</code>”)</li>
   #     <li>rgba(•••%, •••%, •••%, •••%) — same as above, but in %: (“<code>rgba(100%,&nbsp;175%,&nbsp;0%, 50%)</code>”)</li>
   #     <li>hsb(•••, •••, •••) — hue, saturation and brightness values: (“<code>hsb(0.5,&nbsp;0.25,&nbsp;1)</code>”)</li>
   #     <li>hsb(•••%, •••%, •••%) — same as above, but in %</li>
   #     <li>hsba(•••, •••, •••, •••) — same as above, but with opacity</li>
   #     <li>hsl(•••, •••, •••) — almost the same as hsb, see <a href="http://en.wikipedia.org/wiki/HSL_and_HSV" title="HSL and HSV - Wikipedia, the free encyclopedia">Wikipedia page</a></li>
   #     <li>hsl(•••%, •••%, •••%) — same as above, but in %</li>
   #     <li>hsla(•••, •••, •••, •••) — same as above, but with opacity</li>
   #     <li>Optionally for hsb and hsl you could specify hue as a degree: “<code>hsl(240deg,&nbsp;1,&nbsp;.5)</code>” or, if you want to go fancy, “<code>hsl(240°,&nbsp;1,&nbsp;.5)</code>”</li>
   # </ul>
  \ */
  elproto.attr = function (name, value) {
    if (this.removed) {
      return this;
    }
    // SLATEBOX - add ability to add data- attributes to elements
    if (name?.startsWith?.('data-')) {
      this.node.setAttribute(name, value);
      return this;
    }
    if (name == null) {
      const res = {};
      for (const a in this.attrs)
        if (this.attrs[has](a)) {
          res[a] = this.attrs[a];
        }
      res.gradient &&
        res.fill == 'none' &&
        (res.fill = res.gradient) &&
        delete res.gradient;
      res.transform = this._.transform;
      return res;
    }
    if (value == null && R.is(name, 'string')) {
      if (name == 'fill' && this.attrs.fill == 'none' && this.attrs.gradient) {
        return this.attrs.gradient;
      }
      if (name == 'transform') {
        return this._.transform;
      }
      const names = name.split(separator);
      var out = {};
      for (var i = 0, ii = names.length; i < ii; i++) {
        name = names[i];
        if (name in this.attrs) {
          out[name] = this.attrs[name];
        } else if (R.is(this.paper.customAttributes[name], 'function')) {
          out[name] = this.paper.customAttributes[name].def;
        } else {
          out[name] = R._availableAttrs[name];
        }
      }
      return ii - 1 ? out : out[names[0]];
    }
    if (value == null && R.is(name, 'array')) {
      out = {};
      for (i = 0, ii = name.length; i < ii; i++) {
        out[name[i]] = this.attr(name[i]);
      }
      return out;
    }
    if (value != null) {
      var params = {};
      params[name] = value;
    } else if (name != null && R.is(name, 'object')) {
      params = name;
    }
    for (var key in params) {
      eve(`raphael.attr.${key}.${this.id}`, this, params[key]);
    }
    for (key in this.paper.customAttributes) {
      if (
        this.paper.customAttributes[has](key) &&
        params[has](key) &&
        R.is(this.paper.customAttributes[key], 'function')
      ) {
        const par = this.paper.customAttributes[key].apply(
          this,
          [].concat(params[key])
        );
        this.attrs[key] = params[key];
        for (const subkey in par)
          if (par[has](subkey)) {
            params[subkey] = par[subkey];
          }
      }
    }
    setFillAndStroke(this, params);
    return this;
  };
  /* \
   * Element.toFront
   [ method ]
   **
   * Moves the element so it is the closest to the viewer’s eyes, on top of other elements.
   = (object) @Element
  \ */
  elproto.toFront = function () {
    if (this.removed) {
      return this;
    }
    const node = getRealNode(this.node);
    node.parentNode.appendChild(node);
    const svg = this.paper;
    svg.top != this && R._tofront(this, svg);
    return this;
  };
  /* \
   * Element.toBack
   [ method ]
   **
   * Moves the element so it is the furthest from the viewer’s eyes, behind other elements.
   = (object) @Element
  \ */
  elproto.toBack = function () {
    if (this.removed) {
      return this;
    }
    const node = getRealNode(this.node);
    const { parentNode } = node;
    parentNode.insertBefore(node, parentNode.firstChild);
    R._toback(this, this.paper);
    const svg = this.paper;
    return this;
  };
  /* \
   * Element.insertAfter
   [ method ]
   **
   * Inserts current object after the given one.
   = (object) @Element
  \ */
  elproto.insertAfter = function (element) {
    if (this.removed || !element) {
      return this;
    }

    const node = getRealNode(this.node);
    const afterNode = getRealNode(
      element.node || element[element.length - 1].node
    );
    if (afterNode.nextSibling) {
      afterNode.parentNode.insertBefore(node, afterNode.nextSibling);
    } else {
      afterNode.parentNode.appendChild(node);
    }
    R._insertafter(this, element, this.paper);
    return this;
  };
  /* \
   * Element.insertBefore
   [ method ]
   **
   * Inserts current object before the given one.
   = (object) @Element
  \ */
  elproto.insertBefore = function (element) {
    if (this.removed || !element) {
      return this;
    }

    const node = getRealNode(this.node);
    const beforeNode = getRealNode(element.node || element[0].node);
    beforeNode.parentNode.insertBefore(node, beforeNode);
    R._insertbefore(this, element, this.paper);
    return this;
  };
  elproto.blur = function (size) {
    // Experimental. No Safari support. Use it on your own risk.
    const t = this;
    if (+size !== 0) {
      const fltr = $('filter');
      const blur = $('feGaussianBlur');
      t.attrs.blur = size;
      fltr.id = R.createUUID();
      $(blur, { stdDeviation: +size || 1.5 });
      fltr.appendChild(blur);
      t.paper.defs.appendChild(fltr);
      t._blur = fltr;
      $(t.node, { filter: `url(#${fltr.id})` });
    } else {
      if (t._blur) {
        t._blur.parentNode.removeChild(t._blur);
        delete t._blur;
        delete t.attrs.blur;
      }
      t.node.removeAttribute('filter');
    }
    return t;
  };
  R._engine.circle = function (svg, x, y, r) {
    const el = $('circle');
    svg.canvas && svg.canvas.appendChild(el);
    const res = new Element(el, svg);
    res.attrs = { cx: x, cy: y, r, fill: 'none', stroke: '#000' };
    res.type = 'circle';
    $(el, res.attrs);
    return res;
  };
  R._engine.rect = function (svg, x, y, w, h, r) {
    const el = $('rect');
    svg.canvas && svg.canvas.appendChild(el);
    const res = new Element(el, svg);
    res.attrs = {
      x,
      y,
      width: w,
      height: h,
      rx: r || 0,
      ry: r || 0,
      fill: 'none',
      stroke: '#000',
    };
    res.type = 'rect';
    $(el, res.attrs);
    return res;
  };
  R._engine.g = function (svg, gAttrs) {
    const el = $('g');
    svg.canvas && svg.canvas.appendChild(el);
    const res = new Element(el, svg);
    res.type = 'g';
    res.canvas = res.node;
    // adding support for adding elements inside <g>
    const elements = [
      'circle',
      'rect',
      'ellipse',
      'image',
      'text',
      'g',
      'path',
    ];
    elements.forEach((element) => {
      res[element] = function () {
        const args = [res];
        for (let i = 0; i < arguments.length; i++) args.push(arguments[i]);
        const out = R._engine[element].apply(this, args);
        return out;
      };
    });
    // SLATEBOX - add class to the g element
    const attrs = { ...res.attrs, ...gAttrs };
    $(el, attrs);
    return res;
  };
  R._engine.def = function (def) {
    // SLATEBOX - add ability to programattically add defs
    // {
    //   type: "pattern",
    //   id: "smallGrid",
    //   height: 10,
    //   width: 10,
    //   patternUnits: "userSpaceOnUse",
    //   inside: {
    //     type: "path",
    //     attrs: {
    //       d: "M 10 0 L 0 0 0 10",
    //       fill: "none",
    //       stroke: "gray",
    //       "stroke-width": "0.5"
    //     }
    //   }
    // }
    /*
      <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" stroke-width="0.5"/>
      </pattern>
    */

    const id = def.id || `raphael-def-${R.createUUID()}`;

    // SLATEBOX - add ability to programattically add style tags
    if (def.css) {
      // lookup or create the style tag in the defs
      // and either append the def.css as a string inside,
      // or create a new style tag with the css
      const style = this.defs.querySelector(`style[id="${id}"]`);
      if (!style) {
        style = $('style');
        style.id = id;
        this.defs.appendChild(style);
      }
      style.textContent = `${style.textContent} ${def.css}`;
      return;
    }

    // if exists, remove and rebuild
    const exists = Array.prototype.slice
      .call(this.defs.children)
      .find((c) => c.getAttribute('id') === id);
    exists && this.defs.removeChild(exists);

    const defOpts = {
      id,
    };

    Object.assign(defOpts, { ...def });
    // no need to have inside=[object object] as it is used elsewhere below
    delete defOpts.inside;

    // if (def.height != null) defOpts.height = def.height;
    // if (def.width != null) defOpts.width = def.width;
    // switch (def.type) {
    //   case "pattern": {
    //     defOpts.patternUnits = def.patternUnits || "userSpaceOnUse";
    //     break;
    //   }
    //   case "filter": {
    //     if (def.x != null) defOpts.x = def.x;
    //     if (def.y != null) defOpts.y = def.y;
    //     break;
    //   }
    //   case "style": {
    //     defOpts.type = "text/css";
    //     break;
    //   }
    //   case "path": {
    //     Object.assign(defOpts, {...def});
    //     break;
    //   }
    // }

    // always rebuild
    const rDef = $($(def.tag || 'pattern'), defOpts);
    if (def.inside) {
      def.inside.forEach((i) => {
        if (typeof i === 'string') {
          const existingText = rDef.textContent;
          rDef.textContent = `${existingText} ${i}`;
        } else {
          const ins = $($(i.type), i.attrs || {});
          rDef.appendChild(ins);
          if (i.nested) {
            if (i.nested.forEach) {
              i.nested.forEach((nx) => {
                const nest = $($(nx.type), nx.attrs || {});
                ins.appendChild(nest);
              });
            } else {
              Object.keys(i.nested).forEach((n) => {
                const nest = $($(n), i.nested[n] || {});
                ins.appendChild(nest);
              });
            }
          }
        }
      });
    }
    this.defs.appendChild(rDef);
  };
  R._engine.ellipse = function (svg, x, y, rx, ry) {
    const el = $('ellipse');
    svg.canvas && svg.canvas.appendChild(el);
    const res = new Element(el, svg);
    res.attrs = { cx: x, cy: y, rx, ry, fill: 'none', stroke: '#000' };
    res.type = 'ellipse';
    $(el, res.attrs);
    return res;
  };
  R._engine.image = function (svg, src, x, y, w, h) {
    const el = $('image');
    $(el, { x, y, width: w, height: h, preserveAspectRatio: 'none' });
    el.setAttributeNS(xlink, 'href', src);
    svg.canvas && svg.canvas.appendChild(el);
    const res = new Element(el, svg);
    res.attrs = { x, y, width: w, height: h, src };
    res.type = 'image';
    return res;
  };
  R._engine.text = function (svg, x, y, text) {
    const el = $('text');
    svg.canvas && svg.canvas.appendChild(el);
    const res = new Element(el, svg);
    res.attrs = {
      x,
      y,
      'text-anchor': 'middle',
      text,
      'font-family': R._availableAttrs['font-family'],
      'font-size': R._availableAttrs['font-size'],
      stroke: 'none',
      fill: '#000',
    };
    res.type = 'text';
    setFillAndStroke(res, res.attrs);
    return res;
  };
  R._engine.setSize = function (width, height) {
    this.width = width || this.width;
    this.height = height || this.height;
    this.canvas.setAttribute('width', this.width);
    this.canvas.setAttribute('height', this.height);
    if (this._viewBox) {
      this.setViewBox.apply(this, this._viewBox);
    }
    return this;
  };
  R._engine.create = function () {
    const con = R._getContainer.apply(0, arguments);
    let container = con && con.container;
    let { x, y, width, height } = con;
    if (!container) {
      throw new Error('SVG container not found.');
    }
    const cnvs = $('svg');
    const css = 'overflow:hidden;';
    let isFloating;
    x = x || 0;
    y = y || 0;
    width = width || 512;
    height = height || 342;
    $(cnvs, {
      height,
      width,
      xmlns: 'http://www.w3.org/2000/svg',
    });
    if (container == 1) {
      cnvs.style.cssText = `${css}position:absolute;left:${x}px;top:${y}px`;
      R._g.doc.body.appendChild(cnvs);
      isFloating = 1;
    } else {
      cnvs.style.cssText = `${css}position:relative`;
      if (container.firstChild) {
        container.insertBefore(cnvs, container.firstChild);
      } else {
        container.appendChild(cnvs);
      }
    }
    container = new R._Paper();
    container.width = width;
    container.height = height;
    container.canvas = cnvs;
    container.clear();
    container._left = container._top = 0;
    isFloating && (container.renderfix = function () {});
    container.renderfix();
    return container;
  };
  R._engine.setViewBox = function (x, y, w, h, fit) {
    eve('raphael.setViewBox', this, this._viewBox, [x, y, w, h, fit]);
    const paperSize = this.getSize();
    let size = mmax(w / paperSize.width, h / paperSize.height);
    let { top } = this;
    const aspectRatio = fit ? 'xMidYMid meet' : 'xMinYMin';
    let vb;
    let sw;
    if (x == null) {
      if (this._vbSize) {
        size = 1;
      }
      delete this._vbSize;
      vb = `0 0 ${this.width}${S}${this.height}`;
    } else {
      this._vbSize = size;
      vb = x + S + y + S + w + S + h;
    }
    $(this.canvas, {
      viewBox: vb,
      preserveAspectRatio: aspectRatio,
    });
    while (size && top) {
      sw = 'stroke-width' in top.attrs ? top.attrs['stroke-width'] : 1;
      top.attr({ 'stroke-width': sw });
      top._.dirty = 1;
      top._.dirtyT = 1;
      top = top.prev;
    }
    this._viewBox = [x, y, w, h, !!fit];
    return this;
  };
  /* \
   * Paper.renderfix
   [ method ]
   **
   * Fixes the issue of Firefox and IE9 regarding subpixel rendering. If paper is dependent
   * on other elements after reflow it could shift half pixel which cause for lines to lost their crispness.
   * This method fixes the issue.
   **
     Special thanks to Mariusz Nowak (http://www.medikoo.com/) for this method.
  \ */
  R.prototype.renderfix = function () {
    const cnvs = this.canvas;
    const s = cnvs.style;
    let pos;
    try {
      pos = cnvs.getScreenCTM() || cnvs.createSVGMatrix();
    } catch (e) {
      pos = cnvs.createSVGMatrix();
    }
    const left = -pos.e % 1;
    const top = -pos.f % 1;
    if (left || top) {
      if (left) {
        this._left = (this._left + left) % 1;
        s.left = `${this._left}px`;
      }
      if (top) {
        this._top = (this._top + top) % 1;
        s.top = `${this._top}px`;
      }
    }
  };
  /* \
   * Paper.clear
   [ method ]
   **
   * Clears the paper, i.e. removes all the elements.
  \ */
  R.prototype.clear = function () {
    R.eve('raphael.clear', this);
    const c = this.canvas;
    while (c.firstChild) {
      c.removeChild(c.firstChild);
    }
    this.bottom = this.top = null;
    c.appendChild((this.defs = $('defs')));
  };
  /* \
   * Paper.remove
   [ method ]
   **
   * Removes the paper from the DOM.
  \ */
  R.prototype.remove = function () {
    eve('raphael.remove', this);
    this.canvas.parentNode && this.canvas.parentNode.removeChild(this.canvas);
    for (const i in this) {
      this[i] = typeof this[i] === 'function' ? R._removedFactory(i) : null;
    }
  };
  const setproto = R.st;

  for (const method in elproto)
    if (elproto[has](method) && !setproto[has](method)) {
      setproto[method] = (function (methodname) {
        return function () {
          const arg = arguments;
          return this.forEach((el) => {
            el[methodname].apply(el, arg);
          });
        };
      })(method);
    }

  return R;
})();
