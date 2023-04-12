import $i9J9X$lodashuniq from "lodash.uniq";
import $i9J9X$lodashclonedeep from "lodash.clonedeep";
import $i9J9X$deepmerge from "deepmerge";
import $i9J9X$lodashomit from "lodash.omit";
import $i9J9X$lodashinvoke from "lodash.invoke";
import $i9J9X$statickdtree from "static-kdtree";
import $i9J9X$lodashthrottle from "lodash.throttle";
import $i9J9X$lodashclone from "lodash.clone";
import {WheelGestures as $i9J9X$WheelGestures} from "wheel-gestures";




const $f74a27260bed6e25$export$6b962911844bfb1e = function() {
    var version = "0.5.4", has = "hasOwnProperty", separator = /[\.\/]/, comaseparator = /\s*,\s*/, wildcard = "*", numsort = function(a, b) {
        return a - b;
    }, current_event, stop, events = {
        n: {
        }
    }, firstDefined = function() {
        for(var i = 0, ii = this.length; i < ii; i++){
            if (typeof this[i] != "undefined") return this[i];
        }
    }, lastDefined = function() {
        var i = this.length;
        while(--i){
            if (typeof this[i] != "undefined") return this[i];
        }
    }, objtos = Object.prototype.toString, Str = String, isArray = Array.isArray || function(ar) {
        return ar instanceof Array || objtos.call(ar) == "[object Array]";
    }, /*\
   * eve
   [ method ]

   * Fires event with given `name`, given scope and other parameters.

   - name (string) name of the *event*, dot (`.`) or slash (`/`) separated
   - scope (object) context for the event handlers
   - varargs (...) the rest of arguments will be sent to event handlers

   = (object) array of returned values from the listeners. Array has two methods `.firstDefined()` and `.lastDefined()` to get first or last not `undefined` value.
  \*/ $f74a27260bed6e25$export$6b962911844bfb1e = function(name, scope) {
        var oldstop = stop, args = Array.prototype.slice.call(arguments, 2), listeners = $f74a27260bed6e25$export$6b962911844bfb1e.listeners(name), z = 0, l, indexed = [], queue = {
        }, out = [], ce = current_event;
        out.firstDefined = firstDefined;
        out.lastDefined = lastDefined;
        current_event = name;
        stop = 0;
        for(var i = 0, ii = listeners.length; i < ii; i++)if ("zIndex" in listeners[i]) {
            indexed.push(listeners[i].zIndex);
            if (listeners[i].zIndex < 0) queue[listeners[i].zIndex] = listeners[i];
        }
        indexed.sort(numsort);
        while(indexed[z] < 0){
            l = queue[indexed[z++]];
            out.push(l.apply(scope, args));
            if (stop) {
                stop = oldstop;
                return out;
            }
        }
        for(i = 0; i < ii; i++){
            l = listeners[i];
            if ("zIndex" in l) {
                if (l.zIndex == indexed[z]) {
                    out.push(l.apply(scope, args));
                    if (stop) break;
                    do {
                        z++;
                        l = queue[indexed[z]];
                        l && out.push(l.apply(scope, args));
                        if (stop) break;
                    }while (l)
                } else queue[l.zIndex] = l;
            } else {
                out.push(l.apply(scope, args));
                if (stop) break;
            }
        }
        stop = oldstop;
        current_event = ce;
        return out;
    };
    // Undocumented. Debug only.
    $f74a27260bed6e25$export$6b962911844bfb1e._events = events;
    /*\
   * eve.listeners
   [ method ]

   * Internal method which gives you array of all event handlers that will be triggered by the given `name`.

   - name (string) name of the event, dot (`.`) or slash (`/`) separated

   = (array) array of event handlers
  \*/ $f74a27260bed6e25$export$6b962911844bfb1e.listeners = function(name) {
        var names = isArray(name) ? name : name.split(separator), e = events, item, items, k, i, ii, j, jj, nes, es = [
            e
        ], out = [];
        for(i = 0, ii = names.length; i < ii; i++){
            nes = [];
            for(j = 0, jj = es.length; j < jj; j++){
                e = es[j].n;
                items = [
                    e[names[i]],
                    e[wildcard]
                ];
                k = 2;
                while(k--){
                    item = items[k];
                    if (item) {
                        nes.push(item);
                        out = out.concat(item.f || []);
                    }
                }
            }
            es = nes;
        }
        return out;
    };
    /*\
   * eve.separator
   [ method ]

   * If for some reasons you don’t like default separators (`.` or `/`) you can specify yours
   * here. Be aware that if you pass a string longer than one character it will be treated as
   * a list of characters.

   - separator (string) new separator. Empty string resets to default: `.` or `/`.
  \*/ $f74a27260bed6e25$export$6b962911844bfb1e.separator = function(sep) {
        if (sep) {
            sep = Str(sep).replace(/(?=[\.\^\]\[\-])/g, "\\");
            sep = "[" + sep + "]";
            separator = new RegExp(sep);
        } else separator = /[\.\/]/;
    };
    /*\
   * eve.on
   [ method ]
   **
   * Binds given event handler with a given name. You can use wildcards “`*`” for the names:
   | eve.on("*.under.*", f);
   | eve("mouse.under.floor"); // triggers f
   * Use @eve to trigger the listener.
   **
   - name (string) name of the event, dot (`.`) or slash (`/`) separated, with optional wildcards
   - f (function) event handler function
   **
   - name (array) if you don’t want to use separators, you can use array of strings
   - f (function) event handler function
   **
   = (function) returned function accepts a single numeric parameter that represents z-index of the handler. It is an optional feature and only used when you need to ensure that some subset of handlers will be invoked in a given order, despite of the order of assignment.
   > Example:
   | eve.on("mouse", eatIt)(2);
   | eve.on("mouse", scream);
   | eve.on("mouse", catchIt)(1);
   * This will ensure that `catchIt` function will be called before `eatIt`.
   *
   * If you want to put your handler before non-indexed handlers, specify a negative value.
   * Note: I assume most of the time you don’t need to worry about z-index, but it’s nice to have this feature “just in case”.
  \*/ $f74a27260bed6e25$export$6b962911844bfb1e.on = function(name1, f) {
        if (typeof f != "function") return function() {
        };
        var names1 = isArray(name1) ? isArray(name1[0]) ? name1 : [
            name1
        ] : Str(name1).split(comaseparator);
        for(var i1 = 0, ii1 = names1.length; i1 < ii1; i1++)(function(name) {
            var names = isArray(name) ? name : Str(name).split(separator), e = events, exist;
            for(var i = 0, ii = names.length; i < ii; i++){
                e = e.n;
                e = e.hasOwnProperty(names[i]) && e[names[i]] || (e[names[i]] = {
                    n: {
                    }
                });
            }
            e.f = e.f || [];
            for(i = 0, ii = e.f.length; i < ii; i++)if (e.f[i] == f) {
                exist = true;
                break;
            }
            !exist && e.f.push(f);
        })(names1[i1]);
        return function(zIndex) {
            if (+zIndex == +zIndex) f.zIndex = +zIndex;
        };
    };
    /*\
   * eve.f
   [ method ]
   **
   * Returns function that will fire given event with optional arguments.
   * Arguments that will be passed to the result function will be also
   * concated to the list of final arguments.
   | el.onclick = eve.f("click", 1, 2);
   | eve.on("click", function (a, b, c) {
   |     console.log(a, b, c); // 1, 2, [event object]
   | });
   - event (string) event name
   - varargs (…) and any other arguments
   = (function) possible event handler function
  \*/ $f74a27260bed6e25$export$6b962911844bfb1e.f = function(event) {
        var attrs = [].slice.call(arguments, 1);
        return function() {
            $f74a27260bed6e25$export$6b962911844bfb1e.apply(null, [
                event,
                null
            ].concat(attrs).concat([].slice.call(arguments, 0)));
        };
    };
    /*\
   * eve.stop
   [ method ]
   **
   * Is used inside an event handler to stop the event, preventing any subsequent listeners from firing.
  \*/ $f74a27260bed6e25$export$6b962911844bfb1e.stop = function() {
        stop = 1;
    };
    /*\
   * eve.nt
   [ method ]
   **
   * Could be used inside event handler to figure out actual name of the event.
   **
   - subname (string) #optional subname of the event
   **
   = (string) name of the event, if `subname` is not specified
   * or
   = (boolean) `true`, if current event’s name contains `subname`
  \*/ $f74a27260bed6e25$export$6b962911844bfb1e.nt = function(subname) {
        var cur = isArray(current_event) ? current_event.join(".") : current_event;
        if (subname) return new RegExp("(?:\\.|\\/|^)" + subname + "(?:\\.|\\/|$)").test(cur);
        return cur;
    };
    /*\
   * eve.nts
   [ method ]
   **
   * Could be used inside event handler to figure out actual name of the event.
   **
   **
   = (array) names of the event
  \*/ $f74a27260bed6e25$export$6b962911844bfb1e.nts = function() {
        return isArray(current_event) ? current_event : current_event.split(separator);
    };
    /*\
   * eve.off
   [ method ]
   **
   * Removes given function from the list of event listeners assigned to given name.
   * If no arguments specified all the events will be cleared.
   **
   - name (string) name of the event, dot (`.`) or slash (`/`) separated, with optional wildcards
   - f (function) event handler function
  \*/ /*\
   * eve.unbind
   [ method ]
   **
   * See @eve.off
  \*/ $f74a27260bed6e25$export$6b962911844bfb1e.off = $f74a27260bed6e25$export$6b962911844bfb1e.unbind = function(name, f) {
        if (!name) {
            $f74a27260bed6e25$export$6b962911844bfb1e._events = events = {
                n: {
                }
            };
            return;
        }
        var names = isArray(name) ? isArray(name[0]) ? name : [
            name
        ] : Str(name).split(comaseparator);
        if (names.length > 1) {
            for(var i = 0, ii = names.length; i < ii; i++)$f74a27260bed6e25$export$6b962911844bfb1e.off(names[i], f);
            return;
        }
        names = isArray(name) ? name : Str(name).split(separator);
        var e, key, splice, i, ii, j, jj, cur = [
            events
        ], inodes = [];
        for(i = 0, ii = names.length; i < ii; i++)for(j = 0; j < cur.length; j += splice.length - 2){
            splice = [
                j,
                1
            ];
            e = cur[j].n;
            if (names[i] != wildcard) {
                if (e[names[i]]) {
                    splice.push(e[names[i]]);
                    inodes.unshift({
                        n: e,
                        name: names[i]
                    });
                }
            } else {
                for(key in e)if (e[has](key)) {
                    splice.push(e[key]);
                    inodes.unshift({
                        n: e,
                        name: key
                    });
                }
            }
            cur.splice.apply(cur, splice);
        }
        for(i = 0, ii = cur.length; i < ii; i++){
            e = cur[i];
            while(e.n){
                if (f) {
                    if (e.f) {
                        for(j = 0, jj = e.f.length; j < jj; j++)if (e.f[j] == f) {
                            e.f.splice(j, 1);
                            break;
                        }
                        !e.f.length && delete e.f;
                    }
                    for(key in e.n)if (e.n[has](key) && e.n[key].f) {
                        var funcs = e.n[key].f;
                        for(j = 0, jj = funcs.length; j < jj; j++)if (funcs[j] == f) {
                            funcs.splice(j, 1);
                            break;
                        }
                        !funcs.length && delete e.n[key].f;
                    }
                } else {
                    delete e.f;
                    for(key in e.n)if (e.n[has](key) && e.n[key].f) delete e.n[key].f;
                }
                e = e.n;
            }
        }
        // prune inner nodes in path
        prune: for(i = 0, ii = inodes.length; i < ii; i++){
            e = inodes[i];
            for(key in e.n[e.name].f)continue prune;
            for(key in e.n[e.name].n)continue prune;
            // is empty
            delete e.n[e.name];
        }
    };
    /*\
   * eve.once
   [ method ]
   **
   * Binds given event handler with a given name to only run once then unbind itself.
   | eve.once("login", f);
   | eve("login"); // triggers f
   | eve("login"); // no listeners
   * Use @eve to trigger the listener.
   **
   - name (string) name of the event, dot (`.`) or slash (`/`) separated, with optional wildcards
   - f (function) event handler function
   **
   = (function) same return function as @eve.on
  \*/ $f74a27260bed6e25$export$6b962911844bfb1e.once = function(name, f) {
        var f2 = function() {
            $f74a27260bed6e25$export$6b962911844bfb1e.off(name, f2);
            return f.apply(this, arguments);
        };
        return $f74a27260bed6e25$export$6b962911844bfb1e.on(name, f2);
    };
    /*\
   * eve.version
   [ property (string) ]
   **
   * Current version of the library.
  \*/ $f74a27260bed6e25$export$6b962911844bfb1e.version = version;
    $f74a27260bed6e25$export$6b962911844bfb1e.toString = function() {
        return "You are running Eve " + version;
    };
    return $f74a27260bed6e25$export$6b962911844bfb1e;
}();



const $b7c3e249c8a42d1b$export$db202ddc8be9136 = function() {
    /* \
   * Raphael
   [ method ]
   **
   * Creates a canvas object on which to draw.
   * You must do this first, as all future calls to drawing methods
   * from this instance will be bound to this canvas.
   > Parameters
   **
   - container (HTMLElement|string) DOM element or its ID which is going to be a parent for drawing surface
   - width (number)
   - height (number)
   - callback (function) #optional callback function which is going to be executed in the context of newly created paper
   * or
   - x (number)
   - y (number)
   - width (number)
   - height (number)
   - callback (function) #optional callback function which is going to be executed in the context of newly created paper
   * or
   - all (array) (first 3 or 4 elements in the array are equal to [containerID, width, height] or [x, y, width, height]. The rest are element descriptions in format {type: type, <attributes>}). See @Paper.add.
   - callback (function) #optional callback function which is going to be executed in the context of newly created paper
   * or
   - onReadyCallback (function) function that is going to be called on DOM ready event. You can also subscribe to this event via Eve’s “DOMLoad” event. In this case method returns `undefined`.
   = (object) @Paper
   > Usage
   | // Each of the following examples create a canvas
   | // that is 320px wide by 200px high.
   | // Canvas is created at the viewport’s 10,50 coordinate.
   | var paper = Raphael(10, 50, 320, 200);
   | // Canvas is created at the top left corner of the #notepad element
   | // (or its top right corner in dir="rtl" elements)
   | var paper = Raphael(document.getElementById("notepad"), 320, 200);
   | // Same as above
   | var paper = Raphael("notepad", 320, 200);
   | // Image dump
   | var set = Raphael(["notepad", 320, 200, {
   |     type: "rect",
   |     x: 10,
   |     y: 10,
   |     width: 25,
   |     height: 25,
   |     stroke: "#f00"
   | }, {
   |     type: "text",
   |     x: 30,
   |     y: 40,
   |     text: "Dump"
   | }]);
  \ */ function $b7c3e249c8a42d1b$export$db202ddc8be9136(first) {
        if ($b7c3e249c8a42d1b$export$db202ddc8be9136.is(first, 'function')) return loaded1 ? first() : $f74a27260bed6e25$export$6b962911844bfb1e.on('raphael.DOMload', first);
        if ($b7c3e249c8a42d1b$export$db202ddc8be9136.is(first, array1)) return $b7c3e249c8a42d1b$export$db202ddc8be9136._engine.create[apply]($b7c3e249c8a42d1b$export$db202ddc8be9136, first.splice(0, 3 + $b7c3e249c8a42d1b$export$db202ddc8be9136.is(first[0], nu))).add(first);
        const args = Array.prototype.slice.call(arguments, 0);
        if ($b7c3e249c8a42d1b$export$db202ddc8be9136.is(args[args.length - 1], 'function')) {
            const f = args.pop();
            return loaded1 ? f.call($b7c3e249c8a42d1b$export$db202ddc8be9136._engine.create[apply]($b7c3e249c8a42d1b$export$db202ddc8be9136, args)) : $f74a27260bed6e25$export$6b962911844bfb1e.on('raphael.DOMload', ()=>{
                f.call($b7c3e249c8a42d1b$export$db202ddc8be9136._engine.create[apply]($b7c3e249c8a42d1b$export$db202ddc8be9136, args));
            });
        }
        return $b7c3e249c8a42d1b$export$db202ddc8be9136._engine.create[apply]($b7c3e249c8a42d1b$export$db202ddc8be9136, arguments);
    }
    $b7c3e249c8a42d1b$export$db202ddc8be9136.version = '2.2.0';
    $b7c3e249c8a42d1b$export$db202ddc8be9136.eve = $f74a27260bed6e25$export$6b962911844bfb1e;
    let loaded1;
    const separator = /[, ]+/;
    const elements = {
        circle: 1,
        rect: 1,
        path: 1,
        ellipse: 1,
        text: 1,
        image: 1
    };
    const formatrg = /\{(\d+)\}/g;
    const proto = 'prototype';
    const has = 'hasOwnProperty';
    const g1 = {
        doc: document,
        win: window
    };
    const oldRaphael = {
        was: Object.prototype[has].call(g1.win, 'Raphael'),
        is: g1.win.Raphael
    };
    const Paper = function() {
        /* \
       * Paper.ca
       [ property (object) ]
       **
       * Shortcut for @Paper.customAttributes
      \ */ /* \
       * Paper.customAttributes
       [ property (object) ]
       **
       * If you have a set of attributes that you would like to represent
       * as a function of some number you can do it easily with custom attributes:
       > Usage
       | paper.customAttributes.hue = function (num) {
       |     num = num % 1;
       |     return {fill: "hsb(" + num + ", 0.75, 1)"};
       | };
       | // Custom attribute “hue” will change fill
       | // to be given hue with fixed saturation and brightness.
       | // Now you can use it like this:
       | var c = paper.circle(10, 10, 10).attr({hue: .45});
       | // or even like this:
       | c.animate({hue: 1}, 1e3);
       |
       | // You could also create custom attribute
       | // with multiple parameters:
       | paper.customAttributes.hsb = function (h, s, b) {
       |     return {fill: "hsb(" + [h, s, b].join(",") + ")"};
       | };
       | c.attr({hsb: "0.5 .8 1"});
       | c.animate({hsb: [1, 0, 0.5]}, 1e3);
      \ */ this.ca = this.customAttributes = {
        };
    };
    let paperproto;
    const appendChild = 'appendChild';
    var apply = 'apply';
    const concat = 'concat';
    const supportsTouch = 'ontouchstart' in g1.win || g1.win.DocumentTouch && g1.doc instanceof DocumentTouch // taken from Modernizr touch test
    ;
    const E = '';
    const S1 = ' ';
    const Str = String;
    const split = 'split';
    const events1 = 'click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend touchcancel'[split](S1);
    const touchMap = {
        mousedown: 'touchstart',
        mousemove: 'touchmove',
        mouseup: 'touchend'
    };
    const lowerCase = Str.prototype.toLowerCase;
    const math = Math;
    const mmax = math.max;
    const mmin = math.min;
    const { abs: abs  } = math;
    const { pow: pow  } = math;
    const { PI: PI  } = math;
    var nu = 'number';
    const string1 = 'string';
    var array1 = 'array';
    const toString = 'toString';
    const fillString = 'fill';
    const objectToString = Object.prototype.toString;
    const paper1 = {
    };
    const push = 'push';
    const ISURL = $b7c3e249c8a42d1b$export$db202ddc8be9136._ISURL = /^url\(['"]?(.+?)['"]?\)$/i;
    const colourRegExp = /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i;
    const isnan = {
        NaN: 1,
        Infinity: 1,
        '-Infinity': 1
    };
    const bezierrg = /^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/;
    const { round: round1  } = math;
    const setAttribute = 'setAttribute';
    const toFloat = parseFloat;
    const toInt = parseInt;
    const upperCase = Str.prototype.toUpperCase;
    const availableAttrs = $b7c3e249c8a42d1b$export$db202ddc8be9136._availableAttrs = {
        'arrow-end': 'none',
        'arrow-start': 'none',
        blur: 0,
        'clip-rect': '0 0 1e9 1e9',
        cursor: 'default',
        cx: 0,
        cy: 0,
        fill: '#fff',
        'fill-opacity': 1,
        font: '10px "Arial"',
        'font-family': '"Arial"',
        'font-size': '10',
        'font-style': 'normal',
        'font-weight': 400,
        gradient: 0,
        height: 0,
        href: 'http://raphaeljs.com/',
        'letter-spacing': 0,
        opacity: 1,
        path: 'M0,0',
        r: 0,
        rx: 0,
        ry: 0,
        src: '',
        stroke: '#000',
        'stroke-dasharray': '',
        'stroke-linecap': 'butt',
        'stroke-linejoin': 'butt',
        'stroke-miterlimit': 0,
        'stroke-opacity': 1,
        'stroke-width': 1,
        target: '_blank',
        'text-anchor': 'middle',
        title: 'Raphael',
        transform: '',
        width: 0,
        x: 0,
        y: 0,
        class: '',
        filter: ''
    };
    const availableAnimAttrs = $b7c3e249c8a42d1b$export$db202ddc8be9136._availableAnimAttrs = {
        blur: nu,
        'clip-rect': 'csv',
        cx: nu,
        cy: nu,
        fill: 'colour',
        'fill-opacity': nu,
        'font-size': nu,
        height: nu,
        opacity: nu,
        path: 'path',
        r: nu,
        rx: nu,
        ry: nu,
        stroke: 'colour',
        'stroke-opacity': nu,
        'stroke-width': nu,
        transform: 'transform',
        width: nu,
        x: nu,
        y: nu
    };
    const whitespace = /[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]/g;
    const commaSpaces = /[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/;
    const hsrg = {
        hs: 1,
        rg: 1
    };
    const p2s = /,?([achlmqrstvxz]),?/gi;
    const pathCommand = /([achlmrqstvz])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/gi;
    const tCommand = /([rstm])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/gi;
    const pathValues = /(-?\d*\.?\d*(?:e[\-+]?\d+)?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/gi;
    const radial_gradient = $b7c3e249c8a42d1b$export$db202ddc8be9136._radial_gradient = /^r(?:\(([^,]+?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*([^\)]+?)\))?/;
    const eldata = {
    };
    const sortByKey = function(a, b) {
        return a.key - b.key;
    };
    const sortByNumber = function(a, b) {
        return toFloat(a) - toFloat(b);
    };
    const fun = function() {
    };
    const pipe = function(x) {
        return x;
    };
    const rectPath = $b7c3e249c8a42d1b$export$db202ddc8be9136._rectPath = function(x, y, w, h, r) {
        if (r) return [
            [
                'M',
                x + r,
                y
            ],
            [
                'l',
                w - r * 2,
                0
            ],
            [
                'a',
                r,
                r,
                0,
                0,
                1,
                r,
                r
            ],
            [
                'l',
                0,
                h - r * 2
            ],
            [
                'a',
                r,
                r,
                0,
                0,
                1,
                -r,
                r
            ],
            [
                'l',
                r * 2 - w,
                0
            ],
            [
                'a',
                r,
                r,
                0,
                0,
                1,
                -r,
                -r
            ],
            [
                'l',
                0,
                r * 2 - h
            ],
            [
                'a',
                r,
                r,
                0,
                0,
                1,
                r,
                -r
            ],
            [
                'z'
            ], 
        ];
        return [
            [
                'M',
                x,
                y
            ],
            [
                'l',
                w,
                0
            ],
            [
                'l',
                0,
                h
            ],
            [
                'l',
                -w,
                0
            ],
            [
                'z'
            ]
        ];
    };
    const ellipsePath = function(x, y, rx, ry) {
        if (ry == null) ry = rx;
        return [
            [
                'M',
                x,
                y
            ],
            [
                'm',
                0,
                -ry
            ],
            [
                'a',
                rx,
                ry,
                0,
                1,
                1,
                0,
                2 * ry
            ],
            [
                'a',
                rx,
                ry,
                0,
                1,
                1,
                0,
                -2 * ry
            ],
            [
                'z'
            ], 
        ];
    };
    const getPath1 = $b7c3e249c8a42d1b$export$db202ddc8be9136._getPath = {
        path (el) {
            return el.attr('path');
        },
        circle (el) {
            const a = el.attrs;
            return ellipsePath(a.cx, a.cy, a.r);
        },
        ellipse (el) {
            const a = el.attrs;
            return ellipsePath(a.cx, a.cy, a.rx, a.ry);
        },
        rect (el) {
            const a = el.attrs;
            return rectPath(a.x, a.y, a.width, a.height, a.r);
        },
        image (el) {
            const a = el.attrs;
            return rectPath(a.x, a.y, a.width, a.height);
        },
        text (el) {
            const bbox = el._getBBox();
            return rectPath(bbox.x, bbox.y, bbox.width, bbox.height);
        },
        set (el) {
            const bbox = el._getBBox();
            return rectPath(bbox.x, bbox.y, bbox.width, bbox.height);
        },
        g (el) {
            const bbox = el._getBBox();
            return rectPath(bbox.x, bbox.y, bbox.width, bbox.height);
        }
    };
    /* \
     * Raphael.mapPath
     [ method ]
     **
     * Transform the path string with given matrix.
     > Parameters
     - path (string) path string
     - matrix (object) see @Matrix
     = (string) transformed path string
    \ */ const mapPath = $b7c3e249c8a42d1b$export$db202ddc8be9136.mapPath = function(path, matrix) {
        if (!matrix) return path;
        let x;
        let y;
        let i;
        let j;
        let ii;
        let jj;
        let pathi;
        path = path2curve(path);
        for(i = 0, ii = path.length; i < ii; i++){
            pathi = path[i];
            for(j = 1, jj = pathi.length; j < jj; j += 2){
                x = matrix.x(pathi[j], pathi[j + 1]);
                y = matrix.y(pathi[j], pathi[j + 1]);
                pathi[j] = x;
                pathi[j + 1] = y;
            }
        }
        return path;
    };
    $b7c3e249c8a42d1b$export$db202ddc8be9136._g = g1;
    $b7c3e249c8a42d1b$export$db202ddc8be9136.type = 'SVG';
    $b7c3e249c8a42d1b$export$db202ddc8be9136.svg = true;
    $b7c3e249c8a42d1b$export$db202ddc8be9136._Paper = Paper;
    /* \
   * Raphael.fn
   [ property (object) ]
   **
   * You can add your own method to the canvas. For example if you want to draw a pie chart,
   * you can create your own pie chart function and ship it as a Raphaël plugin. To do this
   * you need to extend the `Raphael.fn` object. You should modify the `fn` object before a
   * Raphaël instance is created, otherwise it will take no effect. Please note that the
   * ability for namespaced plugins was removed in Raphael 2.0. It is up to the plugin to
   * ensure any namespacing ensures proper context.
   > Usage
   | Raphael.fn.arrow = function (x1, y1, x2, y2, size) {
   |     return this.path( ... );
   | };
   | // or create namespace
   | Raphael.fn.mystuff = {
   |     arrow: function () {…},
   |     star: function () {…},
   |     // etc…
   | };
   | var paper = Raphael(10, 10, 630, 480);
   | // then use it
   | paper.arrow(10, 10, 30, 30, 5).attr({fill: "#f00"});
   | paper.mystuff.arrow();
   | paper.mystuff.star();
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.fn = paperproto = Paper.prototype = $b7c3e249c8a42d1b$export$db202ddc8be9136.prototype;
    $b7c3e249c8a42d1b$export$db202ddc8be9136._id = 0;
    /* \
   * Raphael.is
   [ method ]
   **
   * Handful of replacements for `typeof` operator.
   > Parameters
   - o (…) any object or primitive
   - type (string) name of the type, i.e. “string”, “function”, “number”, etc.
   = (boolean) is given value is of given type
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.is = function(o, type) {
        type = lowerCase.call(type);
        if (type == 'finite') return !isnan[has](+o);
        if (type == 'array') return o instanceof Array;
        return type == 'null' && o === null || type === typeof o && o !== null || type == 'object' && o === Object(o) || type == 'array' && Array.isArray && Array.isArray(o) || objectToString.call(o).slice(8, -1).toLowerCase() == type;
    };
    function clone(obj) {
        if (typeof obj === 'function' || Object(obj) !== obj) return obj;
        const res = new obj.constructor();
        for(const key in obj)if (obj[has](key)) res[key] = clone(obj[key]);
        return res;
    }
    /* \
   * Raphael.angle
   [ method ]
   **
   * Returns angle between two or three points
   > Parameters
   - x1 (number) x coord of first point
   - y1 (number) y coord of first point
   - x2 (number) x coord of second point
   - y2 (number) y coord of second point
   - x3 (number) #optional x coord of third point
   - y3 (number) #optional y coord of third point
   = (number) angle in degrees.
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.angle = function(x1, y1, x2, y2, x3, y3) {
        if (x3 == null) {
            const x = x1 - x2;
            const y = y1 - y2;
            if (!x && !y) return 0;
            return (180 + math.atan2(-y, -x) * 180 / PI + 360) % 360;
        }
        return $b7c3e249c8a42d1b$export$db202ddc8be9136.angle(x1, y1, x3, y3) - $b7c3e249c8a42d1b$export$db202ddc8be9136.angle(x2, y2, x3, y3);
    };
    /* \
   * Raphael.rad
   [ method ]
   **
   * Transform angle to radians
   > Parameters
   - deg (number) angle in degrees
   = (number) angle in radians.
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.rad = function(deg) {
        return deg % 360 * PI / 180;
    };
    /* \
   * Raphael.deg
   [ method ]
   **
   * Transform angle to degrees
   > Parameters
   - rad (number) angle in radians
   = (number) angle in degrees.
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.deg = function(rad) {
        return Math.round(rad * 180 / PI % 360 * 1000) / 1000;
    };
    /* \
   * Raphael.snapTo
   [ method ]
   **
   * Snaps given value to given grid.
   > Parameters
   - values (array|number) given array of values or step of the grid
   - value (number) value to adjust
   - tolerance (number) #optional tolerance for snapping. Default is `10`.
   = (number) adjusted value.
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.snapTo = function(values, value, tolerance) {
        tolerance = $b7c3e249c8a42d1b$export$db202ddc8be9136.is(tolerance, 'finite') ? tolerance : 10;
        if ($b7c3e249c8a42d1b$export$db202ddc8be9136.is(values, array1)) {
            let i = values.length;
            while(i--)if (abs(values[i] - value) <= tolerance) return values[i];
        } else {
            values = +values;
            const rem = value % values;
            if (rem < tolerance) return value - rem;
            if (rem > values - tolerance) return value - rem + values;
        }
        return value;
    };
    /* \
   * Raphael.createUUID
   [ method ]
   **
   * Returns RFC4122, version 4 ID
  \ */ const createUUID = $b7c3e249c8a42d1b$export$db202ddc8be9136.createUUID = function(uuidRegEx, uuidReplacer) {
        return function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(uuidRegEx, uuidReplacer).toUpperCase();
        };
    }(/[xy]/g, (c)=>{
        const r = math.random() * 16 | 0;
        const v = c == 'x' ? r : r & 3 | 8;
        return v.toString(16);
    });
    /* \
   * Raphael.setWindow
   [ method ]
   **
   * Used when you need to draw in `&lt;iframe>`. Switched window to the iframe one.
   > Parameters
   - newwin (window) new window object
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.setWindow = function(newwin) {
        $f74a27260bed6e25$export$6b962911844bfb1e('raphael.setWindow', $b7c3e249c8a42d1b$export$db202ddc8be9136, g1.win, newwin);
        g1.win = newwin;
        g1.doc = g1.win.document;
        if ($b7c3e249c8a42d1b$export$db202ddc8be9136._engine.initWin) $b7c3e249c8a42d1b$export$db202ddc8be9136._engine.initWin(g1.win);
    };
    var toHex = function(color1) {
        const i = g1.doc.createElement('i');
        i.title = 'Rapha\xebl Colour Picker';
        i.style.display = 'none';
        g1.doc.body.appendChild(i);
        toHex = cacher('toHex', (color)=>{
            i.style.color = color;
            return g1.doc.defaultView.getComputedStyle(i, E).getPropertyValue('color');
        });
        return toHex(color1);
    };
    const hsbtoString = function() {
        return `hsb(${[
            this.h,
            this.s,
            this.b
        ]})`;
    };
    const hsltoString = function() {
        return `hsl(${[
            this.h,
            this.s,
            this.l
        ]})`;
    };
    const rgbtoString = function() {
        return this.hex;
    };
    const prepareRGB = function(r, g, b) {
        if (g == null && $b7c3e249c8a42d1b$export$db202ddc8be9136.is(r, 'object') && 'r' in r && 'g' in r && 'b' in r) {
            b = r.b;
            g = r.g;
            r = r.r;
        }
        if (g == null && $b7c3e249c8a42d1b$export$db202ddc8be9136.is(r, string1)) {
            const clr = $b7c3e249c8a42d1b$export$db202ddc8be9136.getRGB(r);
            r = clr.r;
            g = clr.g;
            b = clr.b;
        }
        if (r > 1 || g > 1 || b > 1) {
            r /= 255;
            g /= 255;
            b /= 255;
        }
        return [
            r,
            g,
            b
        ];
    };
    const packageRGB = function(r, g, b, o) {
        r *= 255;
        g *= 255;
        b *= 255;
        const rgb = {
            r: r,
            g: g,
            b: b,
            hex: $b7c3e249c8a42d1b$export$db202ddc8be9136.rgb(r, g, b),
            toString: rgbtoString
        };
        $b7c3e249c8a42d1b$export$db202ddc8be9136.is(o, 'finite') && (rgb.opacity = o);
        return rgb;
    };
    /* \
   * Raphael.color
   [ method ]
   **
   * Parses the color string and returns object with all values for the given color.
   > Parameters
   - clr (string) color string in one of the supported formats (see @Raphael.getRGB)
   = (object) Combined RGB & HSB object in format:
   o {
   o     r (number) red,
   o     g (number) green,
   o     b (number) blue,
   o     hex (string) color in HTML/CSS format: #••••••,
   o     error (boolean) `true` if string can’t be parsed,
   o     h (number) hue,
   o     s (number) saturation,
   o     v (number) value (brightness),
   o     l (number) lightness
   o }
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.color = function(clr) {
        let rgb;
        if ($b7c3e249c8a42d1b$export$db202ddc8be9136.is(clr, 'object') && 'h' in clr && 's' in clr && 'b' in clr) {
            rgb = $b7c3e249c8a42d1b$export$db202ddc8be9136.hsb2rgb(clr);
            clr.r = rgb.r;
            clr.g = rgb.g;
            clr.b = rgb.b;
            clr.hex = rgb.hex;
        } else if ($b7c3e249c8a42d1b$export$db202ddc8be9136.is(clr, 'object') && 'h' in clr && 's' in clr && 'l' in clr) {
            rgb = $b7c3e249c8a42d1b$export$db202ddc8be9136.hsl2rgb(clr);
            clr.r = rgb.r;
            clr.g = rgb.g;
            clr.b = rgb.b;
            clr.hex = rgb.hex;
        } else {
            if ($b7c3e249c8a42d1b$export$db202ddc8be9136.is(clr, 'string')) clr = $b7c3e249c8a42d1b$export$db202ddc8be9136.getRGB(clr);
            if ($b7c3e249c8a42d1b$export$db202ddc8be9136.is(clr, 'object') && 'r' in clr && 'g' in clr && 'b' in clr) {
                rgb = $b7c3e249c8a42d1b$export$db202ddc8be9136.rgb2hsl(clr);
                clr.h = rgb.h;
                clr.s = rgb.s;
                clr.l = rgb.l;
                rgb = $b7c3e249c8a42d1b$export$db202ddc8be9136.rgb2hsb(clr);
                clr.v = rgb.b;
            } else {
                clr = {
                    hex: 'none'
                };
                clr.r = clr.g = clr.b = clr.h = clr.s = clr.v = clr.l = -1;
            }
        }
        clr.toString = rgbtoString;
        return clr;
    };
    /* \
   * Raphael.hsb2rgb
   [ method ]
   **
   * Converts HSB values to RGB object.
   > Parameters
   - h (number) hue
   - s (number) saturation
   - v (number) value or brightness
   = (object) RGB object in format:
   o {
   o     r (number) red,
   o     g (number) green,
   o     b (number) blue,
   o     hex (string) color in HTML/CSS format: #••••••
   o }
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.hsb2rgb = function(h, s, v, o) {
        if (this.is(h, 'object') && 'h' in h && 's' in h && 'b' in h) {
            v = h.b;
            s = h.s;
            o = h.o;
            h = h.h;
        }
        h *= 360;
        let $b7c3e249c8a42d1b$export$db202ddc8be9136;
        let G;
        let B;
        let X;
        let C;
        h = h % 360 / 60;
        C = v * s;
        X = C * (1 - abs(h % 2 - 1));
        $b7c3e249c8a42d1b$export$db202ddc8be9136 = G = B = v - C;
        h = ~~h;
        $b7c3e249c8a42d1b$export$db202ddc8be9136 += [
            C,
            X,
            0,
            0,
            X,
            C
        ][h];
        G += [
            X,
            C,
            C,
            X,
            0,
            0
        ][h];
        B += [
            0,
            0,
            X,
            C,
            C,
            X
        ][h];
        return packageRGB($b7c3e249c8a42d1b$export$db202ddc8be9136, G, B, o);
    };
    /* \
   * Raphael.hsl2rgb
   [ method ]
   **
   * Converts HSL values to RGB object.
   > Parameters
   - h (number) hue
   - s (number) saturation
   - l (number) luminosity
   = (object) RGB object in format:
   o {
   o     r (number) red,
   o     g (number) green,
   o     b (number) blue,
   o     hex (string) color in HTML/CSS format: #••••••
   o }
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.hsl2rgb = function(h, s, l, o) {
        if (this.is(h, 'object') && 'h' in h && 's' in h && 'l' in h) {
            l = h.l;
            s = h.s;
            h = h.h;
        }
        if (h > 1 || s > 1 || l > 1) {
            h /= 360;
            s /= 100;
            l /= 100;
        }
        h *= 360;
        let $b7c3e249c8a42d1b$export$db202ddc8be9136;
        let G;
        let B;
        let X;
        let C;
        h = h % 360 / 60;
        C = 2 * s * (l < 0.5 ? l : 1 - l);
        X = C * (1 - abs(h % 2 - 1));
        $b7c3e249c8a42d1b$export$db202ddc8be9136 = G = B = l - C / 2;
        h = ~~h;
        $b7c3e249c8a42d1b$export$db202ddc8be9136 += [
            C,
            X,
            0,
            0,
            X,
            C
        ][h];
        G += [
            X,
            C,
            C,
            X,
            0,
            0
        ][h];
        B += [
            0,
            0,
            X,
            C,
            C,
            X
        ][h];
        return packageRGB($b7c3e249c8a42d1b$export$db202ddc8be9136, G, B, o);
    };
    /* \
   * Raphael.rgb2hsb
   [ method ]
   **
   * Converts RGB values to HSB object.
   > Parameters
   - r (number) red
   - g (number) green
   - b (number) blue
   = (object) HSB object in format:
   o {
   o     h (number) hue
   o     s (number) saturation
   o     b (number) brightness
   o }
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.rgb2hsb = function(r, g, b) {
        b = prepareRGB(r, g, b);
        r = b[0];
        g = b[1];
        b = b[2];
        let H;
        let S;
        let V;
        let C;
        V = mmax(r, g, b);
        C = V - mmin(r, g, b);
        H = C == 0 ? null : V == r ? (g - b) / C : V == g ? (b - r) / C + 2 : (r - g) / C + 4;
        H = (H + 360) % 6 * 60 / 360;
        S = C == 0 ? 0 : C / V;
        console.log("checked color", r);
        return {
            h: H,
            s: S,
            b: V,
            toString: hsbtoString
        };
    };
    /* \
   * Raphael.rgb2hsl
   [ method ]
   **
   * Converts RGB values to HSL object.
   > Parameters
   - r (number) red
   - g (number) green
   - b (number) blue
   = (object) HSL object in format:
   o {
   o     h (number) hue
   o     s (number) saturation
   o     l (number) luminosity
   o }
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.rgb2hsl = function(r, g, b) {
        b = prepareRGB(r, g, b);
        r = b[0];
        g = b[1];
        b = b[2];
        let H;
        let S;
        let L;
        let M;
        let m;
        let C;
        M = mmax(r, g, b);
        m = mmin(r, g, b);
        C = M - m;
        H = C == 0 ? null : M == r ? (g - b) / C : M == g ? (b - r) / C + 2 : (r - g) / C + 4;
        H = (H + 360) % 6 * 60 / 360;
        L = (M + m) / 2;
        S = C == 0 ? 0 : L < 0.5 ? C / (2 * L) : C / (2 - 2 * L);
        return {
            h: H,
            s: S,
            l: L,
            toString: hsltoString
        };
    };
    $b7c3e249c8a42d1b$export$db202ddc8be9136._path2string = function() {
        // 2 decimal precision always...
        return this.map((t1)=>[
                t1[0],
                ...t1.slice(1).map((t)=>Math.round(t * 100) / 100
                ), 
            ]
        ).join(',').replace(p2s, '$1');
    };
    function repush(array, item) {
        for(let i = 0, ii = array.length; i < ii; i++)if (array[i] === item) return array.push(array.splice(i, 1)[0]);
    }
    const CACHE = $b7c3e249c8a42d1b$export$db202ddc8be9136.CACHE = {
    };
    function cacher(name, f, scope, postprocessor) {
        function newf() {
            const arg = Array.prototype.slice.call(arguments, 0);
            const args = arg.join('\u2400');
            if (cache[has](args)) {
                repush(count, args);
                return postprocessor ? postprocessor(cache[args]) : cache[args];
            }
            count.length >= 1000 && delete cache[count.shift()];
            count.push(args);
            const cached = cache[args] = f[apply](scope, arg);
            return postprocessor ? postprocessor(cached) : cached;
        }
        var cache = newf.cache = {
        };
        var count = newf.count = [];
        newf.clear = function() {
            cache = newf.cache = {
            };
            count = newf.count = [];
        };
        CACHE[name] = newf;
        return newf;
    }
    $b7c3e249c8a42d1b$export$db202ddc8be9136.clearCaches = function() {
        for(const key in CACHE){
            if (!CACHE.hasOwnProperty(key)) continue;
            CACHE[key].clear();
        }
    };
    const preload = $b7c3e249c8a42d1b$export$db202ddc8be9136._preload = function(src, f) {
        const img = g1.doc.createElement('img');
        img.style.cssText = 'position:absolute;left:-9999em;top:-9999em';
        img.onload = function() {
            f.call(this);
            this.onload = null;
            g1.doc.body.removeChild(this);
        };
        img.onerror = function() {
            g1.doc.body.removeChild(this);
        };
        g1.doc.body.appendChild(img);
        img.src = src;
    };
    function clrToString() {
        return this.hex;
    }
    /* \
   * Raphael.getRGB
   [ method ]
   **
   * Parses colour string as RGB object
   > Parameters
   - colour (string) colour string in one of formats:
   # <ul>
   #     <li>Colour name (“<code>red</code>”, “<code>green</code>”, “<code>cornflowerblue</code>”, etc)</li>
   #     <li>#••• — shortened HTML colour: (“<code>#000</code>”, “<code>#fc0</code>”, etc)</li>
   #     <li>#•••••• — full length HTML colour: (“<code>#000000</code>”, “<code>#bd2300</code>”)</li>
   #     <li>rgb(•••, •••, •••) — red, green and blue channels’ values: (“<code>rgb(200,&nbsp;100,&nbsp;0)</code>”)</li>
   #     <li>rgb(•••%, •••%, •••%) — same as above, but in %: (“<code>rgb(100%,&nbsp;175%,&nbsp;0%)</code>”)</li>
   #     <li>hsb(•••, •••, •••) — hue, saturation and brightness values: (“<code>hsb(0.5,&nbsp;0.25,&nbsp;1)</code>”)</li>
   #     <li>hsb(•••%, •••%, •••%) — same as above, but in %</li>
   #     <li>hsl(•••, •••, •••) — same as hsb</li>
   #     <li>hsl(•••%, •••%, •••%) — same as hsb</li>
   # </ul>
   = (object) RGB object in format:
   o {
   o     r (number) red,
   o     g (number) green,
   o     b (number) blue
   o     hex (string) color in HTML/CSS format: #••••••,
   o     error (boolean) true if string can’t be parsed
   o }
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.getRGB = cacher('getRGB', (colour)=>{
        if (!colour || !!((colour = Str(colour)).indexOf('-') + 1)) return {
            r: -1,
            g: -1,
            b: -1,
            hex: 'none',
            error: 1,
            toString: clrToString
        };
        if (colour == 'none') return {
            r: -1,
            g: -1,
            b: -1,
            hex: 'none',
            toString: clrToString
        };
        !(hsrg[has](colour.toLowerCase().substring(0, 2)) || colour.charAt() == '#') && (colour = toHex(colour));
        let res;
        let red;
        let green;
        let blue;
        let opacity;
        let t;
        let values;
        let rgb = colour.match(colourRegExp);
        if (rgb) {
            if (rgb[2]) {
                blue = toInt(rgb[2].substring(5), 16);
                green = toInt(rgb[2].substring(3, 5), 16);
                red = toInt(rgb[2].substring(1, 3), 16);
            }
            if (rgb[3]) {
                blue = toInt((t = rgb[3].charAt(3)) + t, 16);
                green = toInt((t = rgb[3].charAt(2)) + t, 16);
                red = toInt((t = rgb[3].charAt(1)) + t, 16);
            }
            if (rgb[4]) {
                values = rgb[4][split](commaSpaces);
                red = toFloat(values[0]);
                values[0].slice(-1) == '%' && (red *= 2.55);
                green = toFloat(values[1]);
                values[1].slice(-1) == '%' && (green *= 2.55);
                blue = toFloat(values[2]);
                values[2].slice(-1) == '%' && (blue *= 2.55);
                rgb[1].toLowerCase().slice(0, 4) == 'rgba' && (opacity = toFloat(values[3]));
                values[3] && values[3].slice(-1) == '%' && (opacity /= 100);
            }
            if (rgb[5]) {
                values = rgb[5][split](commaSpaces);
                red = toFloat(values[0]);
                values[0].slice(-1) == '%' && (red *= 2.55);
                green = toFloat(values[1]);
                values[1].slice(-1) == '%' && (green *= 2.55);
                blue = toFloat(values[2]);
                values[2].slice(-1) == '%' && (blue *= 2.55);
                (values[0].slice(-3) == 'deg' || values[0].slice(-1) == '\xb0') && (red /= 360);
                rgb[1].toLowerCase().slice(0, 4) == 'hsba' && (opacity = toFloat(values[3]));
                values[3] && values[3].slice(-1) == '%' && (opacity /= 100);
                return $b7c3e249c8a42d1b$export$db202ddc8be9136.hsb2rgb(red, green, blue, opacity);
            }
            if (rgb[6]) {
                values = rgb[6][split](commaSpaces);
                red = toFloat(values[0]);
                values[0].slice(-1) == '%' && (red *= 2.55);
                green = toFloat(values[1]);
                values[1].slice(-1) == '%' && (green *= 2.55);
                blue = toFloat(values[2]);
                values[2].slice(-1) == '%' && (blue *= 2.55);
                (values[0].slice(-3) == 'deg' || values[0].slice(-1) == '\xb0') && (red /= 360);
                rgb[1].toLowerCase().slice(0, 4) == 'hsla' && (opacity = toFloat(values[3]));
                values[3] && values[3].slice(-1) == '%' && (opacity /= 100);
                return $b7c3e249c8a42d1b$export$db202ddc8be9136.hsl2rgb(red, green, blue, opacity);
            }
            rgb = {
                r: red,
                g: green,
                b: blue,
                toString: clrToString
            };
            rgb.hex = `#${(16777216 | blue | green << 8 | red << 16).toString(16).slice(1)}`;
            $b7c3e249c8a42d1b$export$db202ddc8be9136.is(opacity, 'finite') && (rgb.opacity = opacity);
            return rgb;
        }
        return {
            r: -1,
            g: -1,
            b: -1,
            hex: 'none',
            error: 1,
            toString: clrToString
        };
    }, $b7c3e249c8a42d1b$export$db202ddc8be9136);
    /* \
   * Raphael.hsb
   [ method ]
   **
   * Converts HSB values to hex representation of the colour.
   > Parameters
   - h (number) hue
   - s (number) saturation
   - b (number) value or brightness
   = (string) hex representation of the colour.
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.hsb = cacher('hsb', (h, s, b)=>$b7c3e249c8a42d1b$export$db202ddc8be9136.hsb2rgb(h, s, b).hex
    );
    /* \
   * Raphael.hsl
   [ method ]
   **
   * Converts HSL values to hex representation of the colour.
   > Parameters
   - h (number) hue
   - s (number) saturation
   - l (number) luminosity
   = (string) hex representation of the colour.
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.hsl = cacher('hsl', (h, s, l)=>$b7c3e249c8a42d1b$export$db202ddc8be9136.hsl2rgb(h, s, l).hex
    );
    /* \
   * Raphael.rgb
   [ method ]
   **
   * Converts RGB values to hex representation of the colour.
   > Parameters
   - r (number) red
   - g (number) green
   - b (number) blue
   = (string) hex representation of the colour.
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.rgb = cacher('rgb', (r, g, b)=>{
        function round(x) {
            return x + 0.5 | 0;
        }
        return `#${(16777216 | round(b) | round(g) << 8 | round(r) << 16).toString(16).slice(1)}`;
    });
    /* \
   * Raphael.getColor
   [ method ]
   **
   * On each call returns next colour in the spectrum. To reset it back to red call @Raphael.getColor.reset
   > Parameters
   - value (number) #optional brightness, default is `0.75`
   = (string) hex representation of the colour.
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.getColor = function(value) {
        const start = this.getColor.start = this.getColor.start || {
            h: 0,
            s: 1,
            b: value || 0.75
        };
        const rgb = this.hsb2rgb(start.h, start.s, start.b);
        start.h += 0.075;
        if (start.h > 1) {
            start.h = 0;
            start.s -= 0.2;
            start.s <= 0 && (this.getColor.start = {
                h: 0,
                s: 1,
                b: start.b
            });
        }
        return rgb.hex;
    };
    /* \
   * Raphael.getColor.reset
   [ method ]
   **
   * Resets spectrum position for @Raphael.getColor back to red.
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.getColor.reset = function() {
        delete this.start;
    };
    // http://schepers.cc/getting-to-the-point
    function catmullRom2bezier(crp, z) {
        const d = [];
        for(let i = 0, iLen = crp.length; iLen - 2 * !z > i; i += 2){
            const p = [
                {
                    x: +crp[i - 2],
                    y: +crp[i - 1]
                },
                {
                    x: +crp[i],
                    y: +crp[i + 1]
                },
                {
                    x: +crp[i + 2],
                    y: +crp[i + 3]
                },
                {
                    x: +crp[i + 4],
                    y: +crp[i + 5]
                }, 
            ];
            if (z) {
                if (!i) p[0] = {
                    x: +crp[iLen - 2],
                    y: +crp[iLen - 1]
                };
                else if (iLen - 4 == i) p[3] = {
                    x: +crp[0],
                    y: +crp[1]
                };
                else if (iLen - 2 == i) {
                    p[2] = {
                        x: +crp[0],
                        y: +crp[1]
                    };
                    p[3] = {
                        x: +crp[2],
                        y: +crp[3]
                    };
                }
            } else if (iLen - 4 == i) p[3] = p[2];
            else if (!i) p[0] = {
                x: +crp[i],
                y: +crp[i + 1]
            };
            d.push([
                'C',
                (-p[0].x + 6 * p[1].x + p[2].x) / 6,
                (-p[0].y + 6 * p[1].y + p[2].y) / 6,
                (p[1].x + 6 * p[2].x - p[3].x) / 6,
                (p[1].y + 6 * p[2].y - p[3].y) / 6,
                p[2].x,
                p[2].y, 
            ]);
        }
        return d;
    }
    /* \
   * Raphael.parsePathString
   [ method ]
   **
   * Utility method
   **
   * Parses given path string into an array of arrays of path segments.
   > Parameters
   - pathString (string|array) path string or array of segments (in the last case it will be returned straight away)
   = (array) array of segments.
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.parsePathString = function(pathString) {
        if (!pathString) return null;
        const pth = paths(pathString);
        if (pth.arr) return pathClone(pth.arr);
        const paramCounts = {
            a: 7,
            c: 6,
            h: 1,
            l: 2,
            m: 2,
            r: 4,
            q: 4,
            s: 4,
            t: 2,
            v: 1,
            z: 0
        };
        let data = [];
        if ($b7c3e249c8a42d1b$export$db202ddc8be9136.is(pathString, array1) && $b7c3e249c8a42d1b$export$db202ddc8be9136.is(pathString[0], array1)) // rough assumption
        data = pathClone(pathString);
        if (!data.length) Str(pathString).replace(pathCommand, (a, b1, c)=>{
            const params = [];
            let name = b1.toLowerCase();
            c.replace(pathValues, (a, b)=>{
                b && params.push(+b);
            });
            if (name == 'm' && params.length > 2) {
                data.push([
                    b1
                ][concat](params.splice(0, 2)));
                name = 'l';
                b1 = b1 == 'm' ? 'l' : 'L';
            }
            if (name == 'r') data.push([
                b1
            ][concat](params));
            else while(params.length >= paramCounts[name]){
                data.push([
                    b1
                ][concat](params.splice(0, paramCounts[name])));
                if (!paramCounts[name]) break;
            }
        });
        data.toString = $b7c3e249c8a42d1b$export$db202ddc8be9136._path2string;
        pth.arr = pathClone(data);
        return data;
    };
    /* \
   * Raphael.parseTransformString
   [ method ]
   **
   * Utility method
   **
   * Parses given path string into an array of transformations.
   > Parameters
   - TString (string|array) transform string or array of transformations (in the last case it will be returned straight away)
   = (array) array of transformations.
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.parseTransformString = cacher('parseTransformString', (TString)=>{
        if (!TString) return null;
        const paramCounts = {
            r: 3,
            s: 4,
            t: 2,
            m: 6
        };
        let data = [];
        if ($b7c3e249c8a42d1b$export$db202ddc8be9136.is(TString, array1) && $b7c3e249c8a42d1b$export$db202ddc8be9136.is(TString[0], array1)) // rough assumption
        data = pathClone(TString);
        if (!data.length) Str(TString).replace(tCommand, (a, b2, c)=>{
            const params = [];
            const name = lowerCase.call(b2);
            c.replace(pathValues, (a, b)=>{
                b && params.push(+b);
            });
            data.push([
                b2
            ][concat](params));
        });
        data.toString = $b7c3e249c8a42d1b$export$db202ddc8be9136._path2string;
        return data;
    });
    // PATHS
    var paths = function(ps) {
        const p = paths.ps = paths.ps || {
        };
        if (p[ps]) p[ps].sleep = 100;
        else p[ps] = {
            sleep: 100
        };
        setTimeout(()=>{
            for(const key in p)if (p[has](key) && key != ps) {
                p[key].sleep--;
                !p[key].sleep && delete p[key];
            }
        });
        return p[ps];
    };
    /* \
   * Raphael.findDotsAtSegment
   [ method ]
   **
   * Utility method
   **
   * Find dot coordinates on the given cubic bezier curve at the given t.
   > Parameters
   - p1x (number) x of the first point of the curve
   - p1y (number) y of the first point of the curve
   - c1x (number) x of the first anchor of the curve
   - c1y (number) y of the first anchor of the curve
   - c2x (number) x of the second anchor of the curve
   - c2y (number) y of the second anchor of the curve
   - p2x (number) x of the second point of the curve
   - p2y (number) y of the second point of the curve
   - t (number) position on the curve (0..1)
   = (object) point information in format:
   o {
   o     x: (number) x coordinate of the point
   o     y: (number) y coordinate of the point
   o     m: {
   o         x: (number) x coordinate of the left anchor
   o         y: (number) y coordinate of the left anchor
   o     }
   o     n: {
   o         x: (number) x coordinate of the right anchor
   o         y: (number) y coordinate of the right anchor
   o     }
   o     start: {
   o         x: (number) x coordinate of the start of the curve
   o         y: (number) y coordinate of the start of the curve
   o     }
   o     end: {
   o         x: (number) x coordinate of the end of the curve
   o         y: (number) y coordinate of the end of the curve
   o     }
   o     alpha: (number) angle of the curve derivative at the point
   o }
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.findDotsAtSegment = function(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
        const t1 = 1 - t;
        const t13 = t1 ** 3;
        const t12 = t1 ** 2;
        const t2 = t * t;
        const t3 = t2 * t;
        const x = t13 * p1x + t12 * 3 * t * c1x + t1 * 3 * t * t * c2x + t3 * p2x;
        const y = t13 * p1y + t12 * 3 * t * c1y + t1 * 3 * t * t * c2y + t3 * p2y;
        const mx = p1x + 2 * t * (c1x - p1x) + t2 * (c2x - 2 * c1x + p1x);
        const my = p1y + 2 * t * (c1y - p1y) + t2 * (c2y - 2 * c1y + p1y);
        const nx = c1x + 2 * t * (c2x - c1x) + t2 * (p2x - 2 * c2x + c1x);
        const ny = c1y + 2 * t * (c2y - c1y) + t2 * (p2y - 2 * c2y + c1y);
        const ax = t1 * p1x + t * c1x;
        const ay = t1 * p1y + t * c1y;
        const cx = t1 * c2x + t * p2x;
        const cy = t1 * c2y + t * p2y;
        let alpha = 90 - math.atan2(mx - nx, my - ny) * 180 / PI;
        (mx > nx || my < ny) && (alpha += 180);
        return {
            x: x,
            y: y,
            m: {
                x: mx,
                y: my
            },
            n: {
                x: nx,
                y: ny
            },
            start: {
                x: ax,
                y: ay
            },
            end: {
                x: cx,
                y: cy
            },
            alpha: alpha
        };
    };
    /* \
   * Raphael.bezierBBox
   [ method ]
   **
   * Utility method
   **
   * Return bounding box of a given cubic bezier curve
   > Parameters
   - p1x (number) x of the first point of the curve
   - p1y (number) y of the first point of the curve
   - c1x (number) x of the first anchor of the curve
   - c1y (number) y of the first anchor of the curve
   - c2x (number) x of the second anchor of the curve
   - c2y (number) y of the second anchor of the curve
   - p2x (number) x of the second point of the curve
   - p2y (number) y of the second point of the curve
   * or
   - bez (array) array of six points for bezier curve
   = (object) point information in format:
   o {
   o     min: {
   o         x: (number) x coordinate of the left point
   o         y: (number) y coordinate of the top point
   o     }
   o     max: {
   o         x: (number) x coordinate of the right point
   o         y: (number) y coordinate of the bottom point
   o     }
   o }
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.bezierBBox = function(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y) {
        if (!$b7c3e249c8a42d1b$export$db202ddc8be9136.is(p1x, 'array')) p1x = [
            p1x,
            p1y,
            c1x,
            c1y,
            c2x,
            c2y,
            p2x,
            p2y
        ];
        const bbox = curveDim.apply(null, p1x);
        return {
            x: bbox.min.x,
            y: bbox.min.y,
            x2: bbox.max.x,
            y2: bbox.max.y,
            width: bbox.max.x - bbox.min.x,
            height: bbox.max.y - bbox.min.y
        };
    };
    /* \
   * Raphael.isPointInsideBBox
   [ method ]
   **
   * Utility method
   **
   * Returns `true` if given point is inside bounding boxes.
   > Parameters
   - bbox (string) bounding box
   - x (string) x coordinate of the point
   - y (string) y coordinate of the point
   = (boolean) `true` if point inside
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.isPointInsideBBox = function(bbox, x, y) {
        return x >= bbox.x && x <= bbox.x2 && y >= bbox.y && y <= bbox.y2;
    };
    /* \
   * Raphael.isBBoxIntersect
   [ method ]
   **
   * Utility method
   **
   * Returns `true` if two bounding boxes intersect
   > Parameters
   - bbox1 (string) first bounding box
   - bbox2 (string) second bounding box
   = (boolean) `true` if they intersect
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.isBBoxIntersect = function(bbox1, bbox2) {
        const i = $b7c3e249c8a42d1b$export$db202ddc8be9136.isPointInsideBBox;
        return i(bbox2, bbox1.x, bbox1.y) || i(bbox2, bbox1.x2, bbox1.y) || i(bbox2, bbox1.x, bbox1.y2) || i(bbox2, bbox1.x2, bbox1.y2) || i(bbox1, bbox2.x, bbox2.y) || i(bbox1, bbox2.x2, bbox2.y) || i(bbox1, bbox2.x, bbox2.y2) || i(bbox1, bbox2.x2, bbox2.y2) || (bbox1.x < bbox2.x2 && bbox1.x > bbox2.x || bbox2.x < bbox1.x2 && bbox2.x > bbox1.x) && (bbox1.y < bbox2.y2 && bbox1.y > bbox2.y || bbox2.y < bbox1.y2 && bbox2.y > bbox1.y);
    };
    function base3(t, p1, p2, p3, p4) {
        const t1 = -3 * p1 + 9 * p2 - 9 * p3 + 3 * p4;
        const t2 = t * t1 + 6 * p1 - 12 * p2 + 6 * p3;
        return t * t2 - 3 * p1 + 3 * p2;
    }
    function bezlen(x1, y1, x2, y2, x3, y3, x4, y4, z) {
        if (z == null) z = 1;
        z = z > 1 ? 1 : z < 0 ? 0 : z;
        const z2 = z / 2;
        const n = 12;
        const Tvalues = [
            -0.1252,
            0.1252,
            -0.3678,
            0.3678,
            -0.5873,
            0.5873,
            -0.7699,
            0.7699,
            -0.9041,
            0.9041,
            -0.9816,
            0.9816, 
        ];
        const Cvalues = [
            0.2491,
            0.2491,
            0.2335,
            0.2335,
            0.2032,
            0.2032,
            0.1601,
            0.1601,
            0.1069,
            0.1069,
            0.0472,
            0.0472, 
        ];
        let sum = 0;
        for(let i = 0; i < n; i++){
            const ct = z2 * Tvalues[i] + z2;
            const xbase = base3(ct, x1, x2, x3, x4);
            const ybase = base3(ct, y1, y2, y3, y4);
            const comb = xbase * xbase + ybase * ybase;
            sum += Cvalues[i] * math.sqrt(comb);
        }
        return z2 * sum;
    }
    function getTatLen(x1, y1, x2, y2, x3, y3, x4, y4, ll) {
        if (ll < 0 || bezlen(x1, y1, x2, y2, x3, y3, x4, y4) < ll) return;
        const t = 1;
        let step = t / 2;
        let t2 = t - step;
        let l;
        const e = 0.01;
        l = bezlen(x1, y1, x2, y2, x3, y3, x4, y4, t2);
        while(abs(l - ll) > e){
            step /= 2;
            t2 += (l < ll ? 1 : -1) * step;
            l = bezlen(x1, y1, x2, y2, x3, y3, x4, y4, t2);
        }
        return t2;
    }
    function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
        if (mmax(x1, x2) < mmin(x3, x4) || mmin(x1, x2) > mmax(x3, x4) || mmax(y1, y2) < mmin(y3, y4) || mmin(y1, y2) > mmax(y3, y4)) return;
        const nx = (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4);
        const ny = (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4);
        const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
        if (!denominator) return;
        const px = nx / denominator;
        const py = ny / denominator;
        const px2 = +px.toFixed(2);
        const py2 = +py.toFixed(2);
        if (px2 < +mmin(x1, x2).toFixed(2) || px2 > +mmax(x1, x2).toFixed(2) || px2 < +mmin(x3, x4).toFixed(2) || px2 > +mmax(x3, x4).toFixed(2) || py2 < +mmin(y1, y2).toFixed(2) || py2 > +mmax(y1, y2).toFixed(2) || py2 < +mmin(y3, y4).toFixed(2) || py2 > +mmax(y3, y4).toFixed(2)) return;
        return {
            x: px,
            y: py
        };
    }
    function inter(bez1, bez2) {
        return interHelper(bez1, bez2);
    }
    function interCount(bez1, bez2) {
        return interHelper(bez1, bez2, 1);
    }
    function interHelper(bez1, bez2, justCount) {
        const bbox1 = $b7c3e249c8a42d1b$export$db202ddc8be9136.bezierBBox(bez1);
        const bbox2 = $b7c3e249c8a42d1b$export$db202ddc8be9136.bezierBBox(bez2);
        if (!$b7c3e249c8a42d1b$export$db202ddc8be9136.isBBoxIntersect(bbox1, bbox2)) return justCount ? 0 : [];
        const l1 = bezlen.apply(0, bez1);
        const l2 = bezlen.apply(0, bez2);
        const n1 = mmax(~~(l1 / 5), 1);
        const n2 = mmax(~~(l2 / 5), 1);
        const dots1 = [];
        const dots2 = [];
        const xy = {
        };
        let res = justCount ? 0 : [];
        for(var i = 0; i < n1 + 1; i++){
            var p = $b7c3e249c8a42d1b$export$db202ddc8be9136.findDotsAtSegment.apply($b7c3e249c8a42d1b$export$db202ddc8be9136, bez1.concat(i / n1));
            dots1.push({
                x: p.x,
                y: p.y,
                t: i / n1
            });
        }
        for(i = 0; i < n2 + 1; i++){
            p = $b7c3e249c8a42d1b$export$db202ddc8be9136.findDotsAtSegment.apply($b7c3e249c8a42d1b$export$db202ddc8be9136, bez2.concat(i / n2));
            dots2.push({
                x: p.x,
                y: p.y,
                t: i / n2
            });
        }
        for(i = 0; i < n1; i++)for(let j = 0; j < n2; j++){
            const di = dots1[i];
            const di1 = dots1[i + 1];
            const dj = dots2[j];
            const dj1 = dots2[j + 1];
            const ci = abs(di1.x - di.x) < 0.001 ? 'y' : 'x';
            const cj = abs(dj1.x - dj.x) < 0.001 ? 'y' : 'x';
            const is = intersect(di.x, di.y, di1.x, di1.y, dj.x, dj.y, dj1.x, dj1.y);
            if (is) {
                if (xy[is.x.toFixed(4)] == is.y.toFixed(4)) continue;
                xy[is.x.toFixed(4)] = is.y.toFixed(4);
                const t1 = di.t + abs((is[ci] - di[ci]) / (di1[ci] - di[ci])) * (di1.t - di.t);
                const t2 = dj.t + abs((is[cj] - dj[cj]) / (dj1[cj] - dj[cj])) * (dj1.t - dj.t);
                if (t1 >= 0 && t1 <= 1.001 && t2 >= 0 && t2 <= 1.001) {
                    if (justCount) res++;
                    else res.push({
                        x: is.x,
                        y: is.y,
                        t1: mmin(t1, 1),
                        t2: mmin(t2, 1)
                    });
                }
            }
        }
        return res;
    }
    /* \
   * Raphael.pathIntersection
   [ method ]
   **
   * Utility method
   **
   * Finds intersections of two paths
   > Parameters
   - path1 (string) path string
   - path2 (string) path string
   = (array) dots of intersection
   o [
   o     {
   o         x: (number) x coordinate of the point
   o         y: (number) y coordinate of the point
   o         t1: (number) t value for segment of path1
   o         t2: (number) t value for segment of path2
   o         segment1: (number) order number for segment of path1
   o         segment2: (number) order number for segment of path2
   o         bez1: (array) eight coordinates representing beziér curve for the segment of path1
   o         bez2: (array) eight coordinates representing beziér curve for the segment of path2
   o     }
   o ]
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.pathIntersection = function(path1, path2) {
        return interPathHelper(path1, path2);
    };
    $b7c3e249c8a42d1b$export$db202ddc8be9136.pathIntersectionNumber = function(path1, path2) {
        return interPathHelper(path1, path2, 1);
    };
    function interPathHelper(path1, path2, justCount) {
        path1 = $b7c3e249c8a42d1b$export$db202ddc8be9136._path2curve(path1);
        path2 = $b7c3e249c8a42d1b$export$db202ddc8be9136._path2curve(path2);
        let x1;
        let y1;
        let x2;
        let y2;
        let x1m;
        let y1m;
        let x2m;
        let y2m;
        let bez1;
        let bez2;
        let res = justCount ? 0 : [];
        for(let i = 0, ii = path1.length; i < ii; i++){
            const pi = path1[i];
            if (pi[0] == 'M') {
                x1 = x1m = pi[1];
                y1 = y1m = pi[2];
            } else {
                if (pi[0] == 'C') {
                    bez1 = [
                        x1,
                        y1
                    ].concat(pi.slice(1));
                    x1 = bez1[6];
                    y1 = bez1[7];
                } else {
                    bez1 = [
                        x1,
                        y1,
                        x1,
                        y1,
                        x1m,
                        y1m,
                        x1m,
                        y1m
                    ];
                    x1 = x1m;
                    y1 = y1m;
                }
                for(let j = 0, jj = path2.length; j < jj; j++){
                    const pj = path2[j];
                    if (pj[0] == 'M') {
                        x2 = x2m = pj[1];
                        y2 = y2m = pj[2];
                    } else {
                        if (pj[0] == 'C') {
                            bez2 = [
                                x2,
                                y2
                            ].concat(pj.slice(1));
                            x2 = bez2[6];
                            y2 = bez2[7];
                        } else {
                            bez2 = [
                                x2,
                                y2,
                                x2,
                                y2,
                                x2m,
                                y2m,
                                x2m,
                                y2m
                            ];
                            x2 = x2m;
                            y2 = y2m;
                        }
                        const intr = interHelper(bez1, bez2, justCount);
                        if (justCount) res += intr;
                        else {
                            for(let k = 0, kk = intr.length; k < kk; k++){
                                intr[k].segment1 = i;
                                intr[k].segment2 = j;
                                intr[k].bez1 = bez1;
                                intr[k].bez2 = bez2;
                            }
                            res = res.concat(intr);
                        }
                    }
                }
            }
        }
        return res;
    }
    /* \
   * Raphael.isPointInsidePath
   [ method ]
   **
   * Utility method
   **
   * Returns `true` if given point is inside a given closed path.
   > Parameters
   - path (string) path string
   - x (number) x of the point
   - y (number) y of the point
   = (boolean) true, if point is inside the path
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.isPointInsidePath = function(path, x, y) {
        const bbox = $b7c3e249c8a42d1b$export$db202ddc8be9136.pathBBox(path);
        return $b7c3e249c8a42d1b$export$db202ddc8be9136.isPointInsideBBox(bbox, x, y) && interPathHelper(path, [
            [
                'M',
                x,
                y
            ],
            [
                'H',
                bbox.x2 + 10
            ], 
        ], 1) % 2 == 1;
    };
    $b7c3e249c8a42d1b$export$db202ddc8be9136._removedFactory = function(methodname) {
        return function() {
            $f74a27260bed6e25$export$6b962911844bfb1e('raphael.log', null, `Rapha\xebl: you are calling to method \u201c${methodname}\u201d of removed object`, methodname);
        };
    };
    /* \
   * Raphael.pathBBox
   [ method ]
   **
   * Utility method
   **
   * Return bounding box of a given path
   > Parameters
   - path (string) path string
   = (object) bounding box
   o {
   o     x: (number) x coordinate of the left top point of the box
   o     y: (number) y coordinate of the left top point of the box
   o     x2: (number) x coordinate of the right bottom point of the box
   o     y2: (number) y coordinate of the right bottom point of the box
   o     width: (number) width of the box
   o     height: (number) height of the box
   o     cx: (number) x coordinate of the center of the box
   o     cy: (number) y coordinate of the center of the box
   o }
  \ */ const pathDimensions = $b7c3e249c8a42d1b$export$db202ddc8be9136.pathBBox = function(path) {
        const pth = paths(path);
        if (pth.bbox) return clone(pth.bbox);
        if (!path) return {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            x2: 0,
            y2: 0
        };
        path = path2curve(path);
        let x = 0;
        let y = 0;
        let X = [];
        let Y = [];
        let p;
        for(let i = 0, ii = path.length; i < ii; i++){
            p = path[i];
            if (p[0] == 'M') {
                x = p[1];
                y = p[2];
                X.push(x);
                Y.push(y);
            } else {
                const dim = curveDim(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
                X = X[concat](dim.min.x, dim.max.x);
                Y = Y[concat](dim.min.y, dim.max.y);
                x = p[5];
                y = p[6];
            }
        }
        const xmin = mmin[apply](0, X);
        const ymin = mmin[apply](0, Y);
        const xmax = mmax[apply](0, X);
        const ymax = mmax[apply](0, Y);
        const width = xmax - xmin;
        const height = ymax - ymin;
        const bb = {
            x: xmin,
            y: ymin,
            x2: xmax,
            y2: ymax,
            width: width,
            height: height,
            cx: xmin + width / 2,
            cy: ymin + height / 2
        };
        pth.bbox = clone(bb);
        return bb;
    };
    var pathClone = function(pathArray) {
        // var res = clone(pathArray);
        // Array.slice() is faster then clone(pathArray).
        const res = pathArray.slice(0);
        for(let i = 0, ii = pathArray.length; i < ii; ++i)res[i] = pathArray[i].slice(0);
        res.toString = $b7c3e249c8a42d1b$export$db202ddc8be9136._path2string;
        return res;
    };
    const pathToRelative = $b7c3e249c8a42d1b$export$db202ddc8be9136._pathToRelative = function(pathArray) {
        const pth = paths(pathArray);
        if (pth.rel) return pathClone(pth.rel);
        if (!$b7c3e249c8a42d1b$export$db202ddc8be9136.is(pathArray, array1) || !$b7c3e249c8a42d1b$export$db202ddc8be9136.is(pathArray && pathArray[0], array1)) // rough assumption
        pathArray = $b7c3e249c8a42d1b$export$db202ddc8be9136.parsePathString(pathArray);
        const res = [];
        let x = 0;
        let y = 0;
        let mx = 0;
        let my = 0;
        let start = 0;
        if (pathArray[0][0] == 'M') {
            x = pathArray[0][1];
            y = pathArray[0][2];
            mx = x;
            my = y;
            start++;
            res.push([
                'M',
                x,
                y
            ]);
        }
        for(let i = start, ii = pathArray.length; i < ii; i++){
            let r = res[i] = [];
            const pa = pathArray[i];
            if (pa[0] != lowerCase.call(pa[0])) {
                r[0] = lowerCase.call(pa[0]);
                switch(r[0]){
                    case 'a':
                        r[1] = pa[1];
                        r[2] = pa[2];
                        r[3] = pa[3];
                        r[4] = pa[4];
                        r[5] = pa[5];
                        r[6] = +(pa[6] - x).toFixed(3);
                        r[7] = +(pa[7] - y).toFixed(3);
                        break;
                    case 'v':
                        r[1] = +(pa[1] - y).toFixed(3);
                        break;
                    case 'm':
                        mx = pa[1];
                        my = pa[2];
                    default:
                        for(let j = 1, jj = pa.length; j < jj; j++)r[j] = +(pa[j] - (j % 2 ? x : y)).toFixed(3);
                }
            } else {
                r = res[i] = [];
                if (pa[0] == 'm') {
                    mx = pa[1] + x;
                    my = pa[2] + y;
                }
                for(let k = 0, kk = pa.length; k < kk; k++)res[i][k] = pa[k];
            }
            const len = res[i].length;
            switch(res[i][0]){
                case 'z':
                    x = mx;
                    y = my;
                    break;
                case 'h':
                    x += +res[i][len - 1];
                    break;
                case 'v':
                    y += +res[i][len - 1];
                    break;
                default:
                    x += +res[i][len - 2];
                    y += +res[i][len - 1];
            }
        }
        res.toString = $b7c3e249c8a42d1b$export$db202ddc8be9136._path2string;
        pth.rel = pathClone(res);
        return res;
    };
    const pathToAbsolute = $b7c3e249c8a42d1b$export$db202ddc8be9136._pathToAbsolute = function(pathArray) {
        // return pathArray;
        const pth = paths(pathArray);
        if (pth.abs) return pathClone(pth.abs);
        if (!$b7c3e249c8a42d1b$export$db202ddc8be9136.is(pathArray, array1) || !$b7c3e249c8a42d1b$export$db202ddc8be9136.is(pathArray && pathArray[0], array1)) // rough assumption
        pathArray = $b7c3e249c8a42d1b$export$db202ddc8be9136.parsePathString(pathArray);
        if (!pathArray || !pathArray.length) return [
            [
                'M',
                0,
                0
            ]
        ];
        let res = [];
        let x = 0;
        let y = 0;
        let mx = 0;
        let my = 0;
        let start = 0;
        if (pathArray[0][0] == 'M') {
            x = +pathArray[0][1];
            y = +pathArray[0][2];
            mx = x;
            my = y;
            start++;
            res[0] = [
                'M',
                x,
                y
            ];
        }
        const crz = pathArray.length == 3 && pathArray[0][0] == 'M' && pathArray[1][0].toUpperCase() == 'R' && pathArray[2][0].toUpperCase() == 'Z';
        for(var r, pa, i = start, ii = pathArray.length; i < ii; i++){
            res.push(r = []);
            pa = pathArray[i];
            if (pa[0] != upperCase.call(pa[0])) {
                r[0] = upperCase.call(pa[0]);
                switch(r[0]){
                    case 'A':
                        r[1] = pa[1];
                        r[2] = pa[2];
                        r[3] = pa[3];
                        r[4] = pa[4];
                        r[5] = pa[5];
                        r[6] = +(pa[6] + x);
                        r[7] = +(pa[7] + y);
                        break;
                    case 'V':
                        r[1] = +pa[1] + y;
                        break;
                    case 'H':
                        r[1] = +pa[1] + x;
                        break;
                    case 'R':
                        var dots = [
                            x,
                            y
                        ][concat](pa.slice(1));
                        for(var j = 2, jj = dots.length; j < jj; j++){
                            dots[j] = +dots[j] + x;
                            dots[++j] = +dots[j] + y;
                        }
                        res.pop();
                        res = res[concat](catmullRom2bezier(dots, crz));
                        break;
                    case 'M':
                        mx = +pa[1] + x;
                        my = +pa[2] + y;
                    default:
                        for(j = 1, jj = pa.length; j < jj; j++)r[j] = +pa[j] + (j % 2 ? x : y);
                }
            } else if (pa[0] == 'R') {
                dots = [
                    x,
                    y
                ][concat](pa.slice(1));
                res.pop();
                res = res[concat](catmullRom2bezier(dots, crz));
                r = [
                    'R'
                ][concat](pa.slice(-2));
            } else for(let k = 0, kk = pa.length; k < kk; k++)r[k] = pa[k];
            switch(r[0]){
                case 'Z':
                    x = mx;
                    y = my;
                    break;
                case 'H':
                    x = r[1];
                    break;
                case 'V':
                    y = r[1];
                    break;
                case 'M':
                    mx = r[r.length - 2];
                    my = r[r.length - 1];
                default:
                    x = r[r.length - 2];
                    y = r[r.length - 1];
            }
        }
        res.toString = $b7c3e249c8a42d1b$export$db202ddc8be9136._path2string;
        pth.abs = pathClone(res);
        return res;
    };
    const l2c = function(x1, y1, x2, y2) {
        return [
            x1,
            y1,
            x2,
            y2,
            x2,
            y2
        ];
    };
    const q2c = function(x1, y1, ax, ay, x2, y2) {
        const _13 = 1 / 3;
        const _23 = 2 / 3;
        return [
            _13 * x1 + _23 * ax,
            _13 * y1 + _23 * ay,
            _13 * x2 + _23 * ax,
            _13 * y2 + _23 * ay,
            x2,
            y2, 
        ];
    };
    var a2c = function(x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive) {
        // for more information of where this math came from visit:
        // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
        const _120 = PI * 120 / 180;
        const rad1 = PI / 180 * (+angle || 0);
        let res = [];
        let xy;
        const rotate = cacher('a2c.rotate', (x, y, rad)=>{
            const X = x * math.cos(rad) - y * math.sin(rad);
            const Y = x * math.sin(rad) + y * math.cos(rad);
            return {
                x: X,
                y: Y
            };
        });
        if (!recursive) {
            xy = rotate(x1, y1, -rad1);
            x1 = xy.x;
            y1 = xy.y;
            xy = rotate(x2, y2, -rad1);
            x2 = xy.x;
            y2 = xy.y;
            const cos = math.cos(PI / 180 * angle);
            const sin = math.sin(PI / 180 * angle);
            const x = (x1 - x2) / 2;
            const y = (y1 - y2) / 2;
            let h = x * x / (rx * rx) + y * y / (ry * ry);
            if (h > 1) {
                h = math.sqrt(h);
                rx = h * rx;
                ry = h * ry;
            }
            const rx2 = rx * rx;
            const ry2 = ry * ry;
            const k = (large_arc_flag == sweep_flag ? -1 : 1) * math.sqrt(abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x)));
            var cx = k * rx * y / ry + (x1 + x2) / 2;
            var cy = k * -ry * x / rx + (y1 + y2) / 2;
            var f1 = math.asin(((y1 - cy) / ry).toFixed(9));
            var f2 = math.asin(((y2 - cy) / ry).toFixed(9));
            f1 = x1 < cx ? PI - f1 : f1;
            f2 = x2 < cx ? PI - f2 : f2;
            f1 < 0 && (f1 = PI * 2 + f1);
            f2 < 0 && (f2 = PI * 2 + f2);
            if (sweep_flag && f1 > f2) f1 -= PI * 2;
            if (!sweep_flag && f2 > f1) f2 -= PI * 2;
        } else {
            f1 = recursive[0];
            f2 = recursive[1];
            cx = recursive[2];
            cy = recursive[3];
        }
        let df = f2 - f1;
        if (abs(df) > _120) {
            const f2old = f2;
            const x2old = x2;
            const y2old = y2;
            f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1);
            x2 = cx + rx * math.cos(f2);
            y2 = cy + ry * math.sin(f2);
            res = a2c(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [
                f2,
                f2old,
                cx,
                cy, 
            ]);
        }
        df = f2 - f1;
        const c1 = math.cos(f1);
        const s1 = math.sin(f1);
        const c2 = math.cos(f2);
        const s2 = math.sin(f2);
        const t = math.tan(df / 4);
        const hx = 4 / 3 * rx * t;
        const hy = 4 / 3 * ry * t;
        const m1 = [
            x1,
            y1
        ];
        const m2 = [
            x1 + hx * s1,
            y1 - hy * c1
        ];
        const m3 = [
            x2 + hx * s2,
            y2 - hy * c2
        ];
        const m4 = [
            x2,
            y2
        ];
        m2[0] = 2 * m1[0] - m2[0];
        m2[1] = 2 * m1[1] - m2[1];
        if (recursive) return [
            m2,
            m3,
            m4
        ][concat](res);
        res = [
            m2,
            m3,
            m4
        ][concat](res).join()[split](',');
        const newres = [];
        for(let i = 0, ii = res.length; i < ii; i++)newres[i] = i % 2 ? rotate(res[i - 1], res[i], rad1).y : rotate(res[i], res[i + 1], rad1).x;
        return newres;
    };
    const findDotAtSegment = function(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
        const t1 = 1 - t;
        return {
            x: t1 ** 3 * p1x + t1 ** 2 * 3 * t * c1x + t1 * 3 * t * t * c2x + t ** 3 * p2x,
            y: t1 ** 3 * p1y + t1 ** 2 * 3 * t * c1y + t1 * 3 * t * t * c2y + t ** 3 * p2y
        };
    };
    var curveDim = cacher('curveDim', (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y)=>{
        let a = c2x - 2 * c1x + p1x - (p2x - 2 * c2x + c1x);
        let b = 2 * (c1x - p1x) - 2 * (c2x - c1x);
        let c = p1x - c1x;
        let t1 = (-b + math.sqrt(b * b - 4 * a * c)) / 2 / a;
        let t2 = (-b - math.sqrt(b * b - 4 * a * c)) / 2 / a;
        const y = [
            p1y,
            p2y
        ];
        const x = [
            p1x,
            p2x
        ];
        let dot;
        abs(t1) > '1e12' && (t1 = 0.5);
        abs(t2) > '1e12' && (t2 = 0.5);
        if (t1 > 0 && t1 < 1) {
            dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t1);
            x.push(dot.x);
            y.push(dot.y);
        }
        if (t2 > 0 && t2 < 1) {
            dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t2);
            x.push(dot.x);
            y.push(dot.y);
        }
        a = c2y - 2 * c1y + p1y - (p2y - 2 * c2y + c1y);
        b = 2 * (c1y - p1y) - 2 * (c2y - c1y);
        c = p1y - c1y;
        t1 = (-b + math.sqrt(b * b - 4 * a * c)) / 2 / a;
        t2 = (-b - math.sqrt(b * b - 4 * a * c)) / 2 / a;
        abs(t1) > '1e12' && (t1 = 0.5);
        abs(t2) > '1e12' && (t2 = 0.5);
        if (t1 > 0 && t1 < 1) {
            dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t1);
            x.push(dot.x);
            y.push(dot.y);
        }
        if (t2 > 0 && t2 < 1) {
            dot = findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t2);
            x.push(dot.x);
            y.push(dot.y);
        }
        return {
            min: {
                x: mmin[apply](0, x),
                y: mmin[apply](0, y)
            },
            max: {
                x: mmax[apply](0, x),
                y: mmax[apply](0, y)
            }
        };
    });
    var path2curve = $b7c3e249c8a42d1b$export$db202ddc8be9136._path2curve = cacher('path2curve', (path1, path21)=>{
        const pth = !path21 && paths(path1);
        if (!path21 && pth.curve) return pathClone(pth.curve);
        const p = pathToAbsolute(path1);
        const p2 = path21 && pathToAbsolute(path21);
        const attrs = {
            x: 0,
            y: 0,
            bx: 0,
            by: 0,
            X: 0,
            Y: 0,
            qx: null,
            qy: null
        };
        const attrs2 = {
            x: 0,
            y: 0,
            bx: 0,
            by: 0,
            X: 0,
            Y: 0,
            qx: null,
            qy: null
        };
        const processPath = function(path, d, pcom) {
            let nx;
            let ny;
            const tq = {
                T: 1,
                Q: 1
            };
            if (!path) return [
                'C',
                d.x,
                d.y,
                d.x,
                d.y,
                d.x,
                d.y
            ];
            !(path[0] in tq) && (d.qx = d.qy = null);
            switch(path[0]){
                case 'M':
                    d.X = path[1];
                    d.Y = path[2];
                    break;
                case 'A':
                    path = [
                        'C'
                    ][concat](a2c[apply](0, [
                        d.x,
                        d.y
                    ][concat](path.slice(1))));
                    break;
                case 'S':
                    if (pcom == 'C' || pcom == 'S') {
                        // In "S" case we have to take into account, if the previous command is C/S.
                        nx = d.x * 2 - d.bx // And reflect the previous
                        ;
                        ny = d.y * 2 - d.by // command's control point relative to the current point.
                        ;
                    } else {
                        // or some else or nothing
                        nx = d.x;
                        ny = d.y;
                    }
                    path = [
                        'C',
                        nx,
                        ny
                    ][concat](path.slice(1));
                    break;
                case 'T':
                    if (pcom == 'Q' || pcom == 'T') {
                        // In "T" case we have to take into account, if the previous command is Q/T.
                        d.qx = d.x * 2 - d.qx // And make a reflection similar
                        ;
                        d.qy = d.y * 2 - d.qy // to case "S".
                        ;
                    } else {
                        // or something else or nothing
                        d.qx = d.x;
                        d.qy = d.y;
                    }
                    path = [
                        'C'
                    ][concat](q2c(d.x, d.y, d.qx, d.qy, path[1], path[2]));
                    break;
                case 'Q':
                    d.qx = path[1];
                    d.qy = path[2];
                    path = [
                        'C'
                    ][concat](q2c(d.x, d.y, path[1], path[2], path[3], path[4]));
                    break;
                case 'L':
                    path = [
                        'C'
                    ][concat](l2c(d.x, d.y, path[1], path[2]));
                    break;
                case 'H':
                    path = [
                        'C'
                    ][concat](l2c(d.x, d.y, path[1], d.y));
                    break;
                case 'V':
                    path = [
                        'C'
                    ][concat](l2c(d.x, d.y, d.x, path[1]));
                    break;
                case 'Z':
                    path = [
                        'C'
                    ][concat](l2c(d.x, d.y, d.X, d.Y));
                    break;
            }
            return path;
        };
        const fixArc = function(pp, i) {
            if (pp[i].length > 7) {
                pp[i].shift();
                const pi = pp[i];
                while(pi.length){
                    pcoms1[i] = 'A' // if created multiple C:s, their original seg is saved
                    ;
                    p2 && (pcoms2[i] = 'A') // the same as above
                    ;
                    pp.splice(i++, 0, [
                        'C'
                    ][concat](pi.splice(0, 6)));
                }
                pp.splice(i, 1);
                ii = mmax(p.length, p2 && p2.length || 0);
            }
        };
        const fixM = function(path1, path2, a1, a2, i) {
            if (path1 && path2 && path1[i][0] == 'M' && path2[i][0] != 'M') {
                path2.splice(i, 0, [
                    'M',
                    a2.x,
                    a2.y
                ]);
                a1.bx = 0;
                a1.by = 0;
                a1.x = path1[i][1];
                a1.y = path1[i][2];
                ii = mmax(p.length, p2 && p2.length || 0);
            }
        };
        var pcoms1 = [] // path commands of original path p
        ;
        var pcoms2 = [] // path commands of original path p2
        ;
        let pfirst = '' // temporary holder for original path command
        ;
        let pcom1 = '' // holder for previous path command of original path
        ;
        for(var i2 = 0, ii = mmax(p.length, p2 && p2.length || 0); i2 < ii; i2++){
            p[i2] && (pfirst = p[i2][0]) // save current path command
            ;
            if (pfirst != 'C') {
                // C is not saved yet, because it may be result of conversion
                pcoms1[i2] = pfirst // Save current path command
                ;
                i2 && (pcom1 = pcoms1[i2 - 1]) // Get previous path command pcom
                ;
            }
            p[i2] = processPath(p[i2], attrs, pcom1) // Previous path command is inputted to processPath
            ;
            if (pcoms1[i2] != 'A' && pfirst == 'C') pcoms1[i2] = 'C' // A is the only command
            ;
            // which may produce multiple C:s
            // so we have to make sure that C is also C in original path
            fixArc(p, i2) // fixArc adds also the right amount of A:s to pcoms1
            ;
            if (p2) {
                // the same procedures is done to p2
                p2[i2] && (pfirst = p2[i2][0]);
                if (pfirst != 'C') {
                    pcoms2[i2] = pfirst;
                    i2 && (pcom1 = pcoms2[i2 - 1]);
                }
                p2[i2] = processPath(p2[i2], attrs2, pcom1);
                if (pcoms2[i2] != 'A' && pfirst == 'C') pcoms2[i2] = 'C';
                fixArc(p2, i2);
            }
            fixM(p, p2, attrs, attrs2, i2);
            fixM(p2, p, attrs2, attrs, i2);
            const seg = p[i2];
            const seg2 = p2 && p2[i2];
            const seglen = seg.length;
            const seg2len = p2 && seg2.length;
            attrs.x = seg[seglen - 2];
            attrs.y = seg[seglen - 1];
            attrs.bx = toFloat(seg[seglen - 4]) || attrs.x;
            attrs.by = toFloat(seg[seglen - 3]) || attrs.y;
            attrs2.bx = p2 && (toFloat(seg2[seg2len - 4]) || attrs2.x);
            attrs2.by = p2 && (toFloat(seg2[seg2len - 3]) || attrs2.y);
            attrs2.x = p2 && seg2[seg2len - 2];
            attrs2.y = p2 && seg2[seg2len - 1];
        }
        if (!p2) pth.curve = pathClone(p);
        return p2 ? [
            p,
            p2
        ] : p;
    }, null, pathClone);
    const parseDots = $b7c3e249c8a42d1b$export$db202ddc8be9136._parseDots = cacher('parseDots', (gradient)=>{
        const dots = [];
        for(var i = 0, ii = gradient.length; i < ii; i++){
            const dot = {
            };
            const par = gradient[i].match(/^([^:]*):?([\d\.]*)/);
            dot.color = $b7c3e249c8a42d1b$export$db202ddc8be9136.getRGB(par[1]);
            if (dot.color.error) return null;
            dot.opacity = dot.color.opacity;
            dot.color = dot.color.hex;
            par[2] && (dot.offset = `${par[2]}%`);
            dots.push(dot);
        }
        for(i = 1, ii = dots.length - 1; i < ii; i++)if (!dots[i].offset) {
            let start = toFloat(dots[i - 1].offset || 0);
            let end = 0;
            for(var j = i + 1; j < ii; j++)if (dots[j].offset) {
                end = dots[j].offset;
                break;
            }
            if (!end) {
                end = 100;
                j = ii;
            }
            end = toFloat(end);
            const d = (end - start) / (j - i + 1);
            for(; i < j; i++){
                start += d;
                dots[i].offset = `${start}%`;
            }
        }
        return dots;
    });
    const tear = $b7c3e249c8a42d1b$export$db202ddc8be9136._tear = function(el, paper) {
        el == paper.top && (paper.top = el.prev);
        el == paper.bottom && (paper.bottom = el.next);
        el.next && (el.next.prev = el.prev);
        el.prev && (el.prev.next = el.next);
    };
    const tofront = $b7c3e249c8a42d1b$export$db202ddc8be9136._tofront = function(el, paper) {
        if (paper.top === el) return;
        tear(el, paper);
        el.next = null;
        el.prev = paper.top;
        paper.top.next = el;
        paper.top = el;
    };
    const toback = $b7c3e249c8a42d1b$export$db202ddc8be9136._toback = function(el, paper) {
        if (paper.bottom === el) return;
        tear(el, paper);
        el.next = paper.bottom;
        el.prev = null;
        paper.bottom.prev = el;
        paper.bottom = el;
    };
    const insertafter = $b7c3e249c8a42d1b$export$db202ddc8be9136._insertafter = function(el, el2, paper) {
        tear(el, paper);
        el2 == paper.top && (paper.top = el);
        el2.next && (el2.next.prev = el);
        el.next = el2.next;
        el.prev = el2;
        el2.next = el;
    };
    const insertbefore = $b7c3e249c8a42d1b$export$db202ddc8be9136._insertbefore = function(el, el2, paper) {
        tear(el, paper);
        el2 == paper.bottom && (paper.bottom = el);
        el2.prev && (el2.prev.next = el);
        el.prev = el2.prev;
        el2.prev = el;
        el.next = el2;
    };
    /* \
     * Raphael.toMatrix
     [ method ]
     **
     * Utility method
     **
     * Returns matrix of transformations applied to a given path
     > Parameters
     - path (string) path string
     - transform (string|array) transformation string
     = (object) @Matrix
    \ */ const toMatrix = $b7c3e249c8a42d1b$export$db202ddc8be9136.toMatrix = function(path, transform) {
        const bb = pathDimensions(path);
        const el = {
            _: {
                transform: E
            },
            getBBox () {
                return bb;
            }
        };
        extractTransform(el, transform);
        return el.matrix;
    };
    /* \
     * Raphael.transformPath
     [ method ]
     **
     * Utility method
     **
     * Returns path transformed by a given transformation
     > Parameters
     - path (string) path string
     - transform (string|array) transformation string
     = (string) path
    \ */ const transformPath = $b7c3e249c8a42d1b$export$db202ddc8be9136.transformPath = function(path, transform) {
        return mapPath(path, toMatrix(path, transform));
    };
    var extractTransform = $b7c3e249c8a42d1b$export$db202ddc8be9136._extractTransform = function(el, tstr) {
        if (tstr == null) return el._.transform;
        tstr = Str(tstr).replace(/\.{3}|\u2026/g, el._.transform || E);
        const tdata = $b7c3e249c8a42d1b$export$db202ddc8be9136.parseTransformString(tstr);
        let deg = 0;
        let dx = 0;
        let dy = 0;
        let sx = 1;
        let sy = 1;
        const { _: _  } = el;
        const m = new Matrix();
        _.transform = tdata || [];
        if (tdata) for(let i = 0, ii = tdata.length; i < ii; i++){
            const t = tdata[i];
            const tlen = t.length;
            const command = Str(t[0]).toLowerCase();
            const absolute = t[0] != command;
            const inver = absolute ? m.invert() : 0;
            var x1;
            var y1;
            var x2;
            var y2;
            var bb;
            if (command == 't' && tlen == 3) {
                if (absolute) {
                    x1 = inver.x(0, 0);
                    y1 = inver.y(0, 0);
                    x2 = inver.x(t[1], t[2]);
                    y2 = inver.y(t[1], t[2]);
                    m.translate(x2 - x1, y2 - y1);
                } else m.translate(t[1], t[2]);
            } else if (command == 'r') {
                if (tlen == 2) {
                    bb = bb || el.getBBox(1);
                    m.rotate(t[1], bb.x + bb.width / 2, bb.y + bb.height / 2);
                    deg += t[1];
                } else if (tlen == 4) {
                    if (absolute) {
                        x2 = inver.x(t[2], t[3]);
                        y2 = inver.y(t[2], t[3]);
                        m.rotate(t[1], x2, y2);
                    } else m.rotate(t[1], t[2], t[3]);
                    deg += t[1];
                }
            } else if (command == 's') {
                if (tlen == 2 || tlen == 3) {
                    bb = bb || el.getBBox(1);
                    m.scale(t[1], t[tlen - 1], bb.x + bb.width / 2, bb.y + bb.height / 2);
                    sx *= t[1];
                    sy *= t[tlen - 1];
                } else if (tlen == 5) {
                    if (absolute) {
                        x2 = inver.x(t[3], t[4]);
                        y2 = inver.y(t[3], t[4]);
                        m.scale(t[1], t[2], x2, y2);
                    } else m.scale(t[1], t[2], t[3], t[4]);
                    sx *= t[1];
                    sy *= t[2];
                }
            } else if (command == 'm' && tlen == 7) m.add(t[1], t[2], t[3], t[4], t[5], t[6]);
            _.dirtyT = 1;
            el.matrix = m;
        }
        /* \
       * Element.matrix
       [ property (object) ]
       **
       * Keeps @Matrix object, which represents element transformation
      \ */ el.matrix = m;
        _.sx = sx;
        _.sy = sy;
        _.deg = deg;
        _.dx = dx = m.e;
        _.dy = dy = m.f;
        if (sx == 1 && sy == 1 && !deg && _.bbox) {
            _.bbox.x += +dx;
            _.bbox.y += +dy;
        } else _.dirtyT = 1;
    };
    const getEmpty = function(item) {
        const l = item[0];
        switch(l.toLowerCase()){
            case 't':
                return [
                    l,
                    0,
                    0
                ];
            case 'm':
                return [
                    l,
                    1,
                    0,
                    0,
                    1,
                    0,
                    0
                ];
            case 'r':
                if (item.length == 4) return [
                    l,
                    0,
                    item[2],
                    item[3]
                ];
                return [
                    l,
                    0
                ];
            case 's':
                if (item.length == 5) return [
                    l,
                    1,
                    1,
                    item[3],
                    item[4]
                ];
                if (item.length == 3) return [
                    l,
                    1,
                    1
                ];
                return [
                    l,
                    1
                ];
        }
    };
    const equaliseTransform = $b7c3e249c8a42d1b$export$db202ddc8be9136._equaliseTransform = function(t1, t2) {
        t2 = Str(t2).replace(/\.{3}|\u2026/g, t1);
        t1 = $b7c3e249c8a42d1b$export$db202ddc8be9136.parseTransformString(t1) || [];
        t2 = $b7c3e249c8a42d1b$export$db202ddc8be9136.parseTransformString(t2) || [];
        const maxlength = mmax(t1.length, t2.length);
        const from = [];
        const to = [];
        let i = 0;
        let j;
        let jj;
        let tt1;
        let tt2;
        for(; i < maxlength; i++){
            tt1 = t1[i] || getEmpty(t2[i]);
            tt2 = t2[i] || getEmpty(tt1);
            if (tt1[0] != tt2[0] || tt1[0].toLowerCase() == 'r' && (tt1[2] != tt2[2] || tt1[3] != tt2[3]) || tt1[0].toLowerCase() == 's' && (tt1[3] != tt2[3] || tt1[4] != tt2[4])) return;
            from[i] = [];
            to[i] = [];
            for(j = 0, jj = mmax(tt1.length, tt2.length); j < jj; j++){
                j in tt1 && (from[i][j] = tt1[j]);
                j in tt2 && (to[i][j] = tt2[j]);
            }
        }
        return {
            from: from,
            to: to
        };
    };
    $b7c3e249c8a42d1b$export$db202ddc8be9136._getContainer = function(x, y, w, h) {
        let container;
        container = h == null && !$b7c3e249c8a42d1b$export$db202ddc8be9136.is(x, 'object') ? g1.doc.getElementById(x) : x;
        if (container == null) return;
        if (container.tagName) {
            if (y == null) return {
                container: container,
                width: container.style.pixelWidth || container.offsetWidth,
                height: container.style.pixelHeight || container.offsetHeight
            };
            return {
                container: container,
                width: y,
                height: w
            };
        }
        return {
            container: 1,
            x: x,
            y: y,
            width: w,
            height: h
        };
    };
    /* \
   * Raphael.pathToRelative
   [ method ]
   **
   * Utility method
   **
   * Converts path to relative form
   > Parameters
   - pathString (string|array) path string or array of segments
   = (array) array of segments.
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.pathToRelative = pathToRelative;
    $b7c3e249c8a42d1b$export$db202ddc8be9136._engine = {
    };
    /* \
   * Raphael.path2curve
   [ method ]
   **
   * Utility method
   **
   * Converts path to a new path where all segments are cubic bezier curves.
   > Parameters
   - pathString (string|array) path string or array of segments
   = (array) array of segments.
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.path2curve = path2curve;
    /* \
   * Raphael.matrix
   [ method ]
   **
   * Utility method
   **
   * Returns matrix based on given parameters.
   > Parameters
   - a (number)
   - b (number)
   - c (number)
   - d (number)
   - e (number)
   - f (number)
   = (object) @Matrix
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.matrix = function(a, b, c, d, e, f) {
        return new Matrix(a, b, c, d, e, f);
    };
    function Matrix(a, b, c, d, e, f) {
        if (a != null) {
            this.a = +a;
            this.b = +b;
            this.c = +c;
            this.d = +d;
            this.e = +e;
            this.f = +f;
        } else {
            this.a = 1;
            this.b = 0;
            this.c = 0;
            this.d = 1;
            this.e = 0;
            this.f = 0;
        }
    }
    (function(matrixproto) {
        /* \
     * Matrix.add
     [ method ]
     **
     * Adds given matrix to existing one.
     > Parameters
     - a (number)
     - b (number)
     - c (number)
     - d (number)
     - e (number)
     - f (number)
     or
     - matrix (object) @Matrix
    \ */ matrixproto.add = function(a, b, c, d, e, f) {
            const out = [
                [],
                [],
                []
            ];
            const m = [
                [
                    this.a,
                    this.c,
                    this.e
                ],
                [
                    this.b,
                    this.d,
                    this.f
                ],
                [
                    0,
                    0,
                    1
                ], 
            ];
            let matrix = [
                [
                    a,
                    c,
                    e
                ],
                [
                    b,
                    d,
                    f
                ],
                [
                    0,
                    0,
                    1
                ], 
            ];
            let x;
            let y;
            let z;
            let res;
            if (a && a instanceof Matrix) matrix = [
                [
                    a.a,
                    a.c,
                    a.e
                ],
                [
                    a.b,
                    a.d,
                    a.f
                ],
                [
                    0,
                    0,
                    1
                ], 
            ];
            for(x = 0; x < 3; x++)for(y = 0; y < 3; y++){
                res = 0;
                for(z = 0; z < 3; z++)res += m[x][z] * matrix[z][y];
                out[x][y] = res;
            }
            this.a = out[0][0];
            this.b = out[1][0];
            this.c = out[0][1];
            this.d = out[1][1];
            this.e = out[0][2];
            this.f = out[1][2];
        };
        /* \
     * Matrix.invert
     [ method ]
     **
     * Returns inverted version of the matrix
     = (object) @Matrix
    \ */ matrixproto.invert = function() {
            const me = this;
            const x = me.a * me.d - me.b * me.c;
            return new Matrix(me.d / x, -me.b / x, -me.c / x, me.a / x, (me.c * me.f - me.d * me.e) / x, (me.b * me.e - me.a * me.f) / x);
        };
        /* \
     * Matrix.clone
     [ method ]
     **
     * Returns copy of the matrix
     = (object) @Matrix
    \ */ matrixproto.clone = function() {
            return new Matrix(this.a, this.b, this.c, this.d, this.e, this.f);
        };
        /* \
     * Matrix.translate
     [ method ]
     **
     * Translate the matrix
     > Parameters
     - x (number)
     - y (number)
    \ */ matrixproto.translate = function(x, y) {
            this.add(1, 0, 0, 1, x, y);
        };
        /* \
     * Matrix.scale
     [ method ]
     **
     * Scales the matrix
     > Parameters
     - x (number)
     - y (number) #optional
     - cx (number) #optional
     - cy (number) #optional
    \ */ matrixproto.scale = function(x, y, cx, cy) {
            y == null && (y = x);
            (cx || cy) && this.add(1, 0, 0, 1, cx, cy);
            this.add(x, 0, 0, y, 0, 0);
            (cx || cy) && this.add(1, 0, 0, 1, -cx, -cy);
        };
        /* \
     * Matrix.rotate
     [ method ]
     **
     * Rotates the matrix
     > Parameters
     - a (number)
     - x (number)
     - y (number)
    \ */ matrixproto.rotate = function(a, x, y) {
            a = $b7c3e249c8a42d1b$export$db202ddc8be9136.rad(a);
            x = x || 0;
            y = y || 0;
            const cos = +math.cos(a).toFixed(9);
            const sin = +math.sin(a).toFixed(9);
            this.add(cos, sin, -sin, cos, x, y);
            this.add(1, 0, 0, 1, -x, -y);
        };
        /* \
     * Matrix.x
     [ method ]
     **
     * Return x coordinate for given point after transformation described by the matrix. See also @Matrix.y
     > Parameters
     - x (number)
     - y (number)
     = (number) x
    \ */ matrixproto.x = function(x, y) {
            return x * this.a + y * this.c + this.e;
        };
        /* \
     * Matrix.y
     [ method ]
     **
     * Return y coordinate for given point after transformation described by the matrix. See also @Matrix.x
     > Parameters
     - x (number)
     - y (number)
     = (number) y
    \ */ matrixproto.y = function(x, y) {
            return x * this.b + y * this.d + this.f;
        };
        matrixproto.get = function(i) {
            return +this[Str.fromCharCode(97 + i)].toFixed(4);
        };
        matrixproto.toString = function() {
            return $b7c3e249c8a42d1b$export$db202ddc8be9136.svg ? `matrix(${[
                this.get(0),
                this.get(1),
                this.get(2),
                this.get(3),
                this.get(4),
                this.get(5), 
            ].join()})` : [
                this.get(0),
                this.get(2),
                this.get(1),
                this.get(3),
                0,
                0
            ].join();
        };
        matrixproto.toFilter = function() {
            return `progid:DXImageTransform.Microsoft.Matrix(M11=${this.get(0)}, M12=${this.get(2)}, M21=${this.get(1)}, M22=${this.get(3)}, Dx=${this.get(4)}, Dy=${this.get(5)}, sizingmethod='auto expand')`;
        };
        matrixproto.offset = function() {
            return [
                this.e.toFixed(4),
                this.f.toFixed(4)
            ];
        };
        function norm(a) {
            return a[0] * a[0] + a[1] * a[1];
        }
        function normalize(a) {
            const mag = math.sqrt(norm(a));
            a[0] && (a[0] /= mag);
            a[1] && (a[1] /= mag);
        }
        /* \
     * Matrix.split
     [ method ]
     **
     * Splits matrix into primitive transformations
     = (object) in format:
     o dx (number) translation by x
     o dy (number) translation by y
     o scalex (number) scale by x
     o scaley (number) scale by y
     o shear (number) shear
     o rotate (number) rotation in deg
     o isSimple (boolean) could it be represented via simple transformations
    \ */ matrixproto.split = function() {
            const out = {
            };
            // translation
            out.dx = this.e;
            out.dy = this.f;
            // scale and shear
            const row = [
                [
                    this.a,
                    this.c
                ],
                [
                    this.b,
                    this.d
                ], 
            ];
            out.scalex = math.sqrt(norm(row[0]));
            normalize(row[0]);
            out.shear = row[0][0] * row[1][0] + row[0][1] * row[1][1];
            row[1] = [
                row[1][0] - row[0][0] * out.shear,
                row[1][1] - row[0][1] * out.shear, 
            ];
            out.scaley = math.sqrt(norm(row[1]));
            normalize(row[1]);
            out.shear /= out.scaley;
            // rotation
            const sin = -row[0][1];
            const cos = row[1][1];
            if (cos < 0) {
                out.rotate = $b7c3e249c8a42d1b$export$db202ddc8be9136.deg(math.acos(cos));
                if (sin < 0) out.rotate = 360 - out.rotate;
            } else out.rotate = $b7c3e249c8a42d1b$export$db202ddc8be9136.deg(math.asin(sin));
            out.isSimple = !+out.shear.toFixed(9) && (out.scalex.toFixed(9) == out.scaley.toFixed(9) || !out.rotate);
            out.isSuperSimple = !+out.shear.toFixed(9) && out.scalex.toFixed(9) == out.scaley.toFixed(9) && !out.rotate;
            out.noRotation = !+out.shear.toFixed(9) && !out.rotate;
            return out;
        };
        /* \
     * Matrix.toTransformString
     [ method ]
     **
     * Return transform string that represents given matrix
     = (string) transform string
    \ */ matrixproto.toTransformString = function(shorter) {
            const s = shorter || this[split]();
            if (s.isSimple) {
                s.scalex = +s.scalex.toFixed(4);
                s.scaley = +s.scaley.toFixed(4);
                s.rotate = +s.rotate.toFixed(4);
                return (s.dx || s.dy ? `t${[
                    s.dx,
                    s.dy
                ]}` : E) + (s.scalex != 1 || s.scaley != 1 ? `s${[
                    s.scalex,
                    s.scaley,
                    0,
                    0
                ]}` : E) + (s.rotate ? `r${[
                    s.rotate,
                    0,
                    0
                ]}` : E);
            }
            return `m${[
                this.get(0),
                this.get(1),
                this.get(2),
                this.get(3),
                this.get(4),
                this.get(5), 
            ]}`;
        };
    })(Matrix.prototype);
    const preventDefault = function() {
        this.returnValue = false;
    };
    const preventTouch = function() {
        return this.originalEvent.preventDefault();
    };
    const stopPropagation = function() {
        this.cancelBubble = true;
    };
    const stopTouch = function() {
        return this.originalEvent.stopPropagation();
    };
    const getEventPosition = function(e) {
        const scrollY = g1.doc.documentElement.scrollTop || g1.doc.body.scrollTop;
        const scrollX = g1.doc.documentElement.scrollLeft || g1.doc.body.scrollLeft;
        return {
            x: e.clientX + scrollX,
            y: e.clientY + scrollY
        };
    };
    const addEvent = function() {
        if (g1.doc.addEventListener) return function(obj, type, fn, element) {
            const f = function(e) {
                const pos = getEventPosition(e);
                return fn.call(element, e, pos.x, pos.y);
            };
            obj.addEventListener(type, f, false);
            if (supportsTouch && touchMap[type]) {
                var _f = function(e) {
                    const pos = getEventPosition(e);
                    const olde = e;
                    for(let i = 0, ii = e.targetTouches && e.targetTouches.length; i < ii; i++)if (e.targetTouches[i].target == obj) {
                        e = e.targetTouches[i];
                        e.originalEvent = olde;
                        e.preventDefault = preventTouch;
                        e.stopPropagation = stopTouch;
                        break;
                    }
                    return fn.call(element, e, pos.x, pos.y);
                };
                obj.addEventListener(touchMap[type], _f, false);
            }
            return function() {
                obj.removeEventListener(type, f, false);
                if (supportsTouch && touchMap[type]) obj.removeEventListener(touchMap[type], _f, false);
                return true;
            };
        };
        if (g1.doc.attachEvent) return function(obj, type, fn, element) {
            const f = function(e) {
                e = e || g1.win.event;
                const scrollY = g1.doc.documentElement.scrollTop || g1.doc.body.scrollTop;
                const scrollX = g1.doc.documentElement.scrollLeft || g1.doc.body.scrollLeft;
                const x = e.clientX + scrollX;
                const y = e.clientY + scrollY;
                e.preventDefault = e.preventDefault || preventDefault;
                e.stopPropagation = e.stopPropagation || stopPropagation;
                return fn.call(element, e, x, y);
            };
            obj.attachEvent(`on${type}`, f);
            const detacher = function() {
                obj.detachEvent(`on${type}`, f);
                return true;
            };
            return detacher;
        };
    }();
    let drag = [];
    const dragMove = function(e) {
        let x = e.clientX;
        let y = e.clientY;
        const scrollY = g1.doc.documentElement.scrollTop || g1.doc.body.scrollTop;
        const scrollX = g1.doc.documentElement.scrollLeft || g1.doc.body.scrollLeft;
        let dragi;
        let j = drag.length;
        while(j--){
            dragi = drag[j];
            if (supportsTouch && e.touches) {
                let i = e.touches.length;
                var touch;
                while(i--){
                    touch = e.touches[i];
                    if (touch.identifier == dragi.el._drag.id) {
                        x = touch.clientX;
                        y = touch.clientY;
                        (e.originalEvent ? e.originalEvent : e).preventDefault();
                        break;
                    }
                }
            } else e.preventDefault();
            const { node: node  } = dragi.el;
            var o;
            const next = node.nextSibling;
            const parent = node.parentNode;
            const { display: display  } = node.style;
            g1.win.opera && parent.removeChild(node);
            node.style.display = 'none';
            o = dragi.el.paper.getElementByPoint(x, y);
            node.style.display = display;
            g1.win.opera && (next ? parent.insertBefore(node, next) : parent.appendChild(node));
            o && $f74a27260bed6e25$export$6b962911844bfb1e(`raphael.drag.over.${dragi.el.id}`, dragi.el, o);
            x += scrollX;
            y += scrollY;
            $f74a27260bed6e25$export$6b962911844bfb1e(`raphael.drag.move.${dragi.el.id}`, dragi.move_scope || dragi.el, x - dragi.el._drag.x, y - dragi.el._drag.y, x, y, e);
        }
    };
    var dragUp = function(e) {
        $b7c3e249c8a42d1b$export$db202ddc8be9136.unmousemove(dragMove).unmouseup(dragUp);
        let i = drag.length;
        let dragi;
        while(i--){
            dragi = drag[i];
            dragi.el._drag = {
            };
            $f74a27260bed6e25$export$6b962911844bfb1e(`raphael.drag.end.${dragi.el.id}`, dragi.end_scope || dragi.start_scope || dragi.move_scope || dragi.el, e);
        }
        drag = [];
    };
    /* \
     * Raphael.el
     [ property (object) ]
     **
     * You can add your own method to elements. This is useful when you want to hack default functionality or
     * want to wrap some common transformation or attributes in one method. In difference to canvas methods,
     * you can redefine element method at any time. Expending element methods wouldn’t affect set.
     > Usage
     | Raphael.el.red = function () {
     |     this.attr({fill: "#f00"});
     | };
     | // then use it
     | paper.circle(100, 100, 20).red();
    \ */ const elproto = $b7c3e249c8a42d1b$export$db202ddc8be9136.el = {
    };
    /* \
   * Element.click
   [ method ]
   **
   * Adds event handler for click for the element.
   > Parameters
   - handler (function) handler for the event
   = (object) @Element
  \ */ /* \
   * Element.unclick
   [ method ]
   **
   * Removes event handler for click for the element.
   > Parameters
   - handler (function) #optional handler for the event
   = (object) @Element
  \ */ /* \
   * Element.dblclick
   [ method ]
   **
   * Adds event handler for double click for the element.
   > Parameters
   - handler (function) handler for the event
   = (object) @Element
  \ */ /* \
   * Element.undblclick
   [ method ]
   **
   * Removes event handler for double click for the element.
   > Parameters
   - handler (function) #optional handler for the event
   = (object) @Element
  \ */ /* \
   * Element.mousedown
   [ method ]
   **
   * Adds event handler for mousedown for the element.
   > Parameters
   - handler (function) handler for the event
   = (object) @Element
  \ */ /* \
   * Element.unmousedown
   [ method ]
   **
   * Removes event handler for mousedown for the element.
   > Parameters
   - handler (function) #optional handler for the event
   = (object) @Element
  \ */ /* \
   * Element.mousemove
   [ method ]
   **
   * Adds event handler for mousemove for the element.
   > Parameters
   - handler (function) handler for the event
   = (object) @Element
  \ */ /* \
   * Element.unmousemove
   [ method ]
   **
   * Removes event handler for mousemove for the element.
   > Parameters
   - handler (function) #optional handler for the event
   = (object) @Element
  \ */ /* \
   * Element.mouseout
   [ method ]
   **
   * Adds event handler for mouseout for the element.
   > Parameters
   - handler (function) handler for the event
   = (object) @Element
  \ */ /* \
   * Element.unmouseout
   [ method ]
   **
   * Removes event handler for mouseout for the element.
   > Parameters
   - handler (function) #optional handler for the event
   = (object) @Element
  \ */ /* \
   * Element.mouseover
   [ method ]
   **
   * Adds event handler for mouseover for the element.
   > Parameters
   - handler (function) handler for the event
   = (object) @Element
  \ */ /* \
   * Element.unmouseover
   [ method ]
   **
   * Removes event handler for mouseover for the element.
   > Parameters
   - handler (function) #optional handler for the event
   = (object) @Element
  \ */ /* \
   * Element.mouseup
   [ method ]
   **
   * Adds event handler for mouseup for the element.
   > Parameters
   - handler (function) handler for the event
   = (object) @Element
  \ */ /* \
   * Element.unmouseup
   [ method ]
   **
   * Removes event handler for mouseup for the element.
   > Parameters
   - handler (function) #optional handler for the event
   = (object) @Element
  \ */ /* \
   * Element.touchstart
   [ method ]
   **
   * Adds event handler for touchstart for the element.
   > Parameters
   - handler (function) handler for the event
   = (object) @Element
  \ */ /* \
   * Element.untouchstart
   [ method ]
   **
   * Removes event handler for touchstart for the element.
   > Parameters
   - handler (function) #optional handler for the event
   = (object) @Element
  \ */ /* \
   * Element.touchmove
   [ method ]
   **
   * Adds event handler for touchmove for the element.
   > Parameters
   - handler (function) handler for the event
   = (object) @Element
  \ */ /* \
   * Element.untouchmove
   [ method ]
   **
   * Removes event handler for touchmove for the element.
   > Parameters
   - handler (function) #optional handler for the event
   = (object) @Element
  \ */ /* \
   * Element.touchend
   [ method ]
   **
   * Adds event handler for touchend for the element.
   > Parameters
   - handler (function) handler for the event
   = (object) @Element
  \ */ /* \
   * Element.untouchend
   [ method ]
   **
   * Removes event handler for touchend for the element.
   > Parameters
   - handler (function) #optional handler for the event
   = (object) @Element
  \ */ /* \
   * Element.touchcancel
   [ method ]
   **
   * Adds event handler for touchcancel for the element.
   > Parameters
   - handler (function) handler for the event
   = (object) @Element
  \ */ /* \
   * Element.untouchcancel
   [ method ]
   **
   * Removes event handler for touchcancel for the element.
   > Parameters
   - handler (function) #optional handler for the event
   = (object) @Element
  \ */ for(let i1 = events1.length; i1--;)(function(eventName) {
        $b7c3e249c8a42d1b$export$db202ddc8be9136[eventName] = elproto[eventName] = function(fn, scope) {
            if ($b7c3e249c8a42d1b$export$db202ddc8be9136.is(fn, 'function')) {
                this.events = this.events || [];
                this.events.push({
                    name: eventName,
                    f: fn,
                    unbind: addEvent(this.shape || this.node || g1.doc, eventName, fn, scope || this)
                });
            }
            return this;
        };
        $b7c3e249c8a42d1b$export$db202ddc8be9136[`un${eventName}`] = elproto[`un${eventName}`] = function(fn) {
            const events = this.events || [];
            let l = events.length;
            while(l--)if (events[l].name == eventName && ($b7c3e249c8a42d1b$export$db202ddc8be9136.is(fn, 'undefined') || events[l].f == fn)) {
                events[l].unbind();
                events.splice(l, 1);
                !events.length && delete this.events;
            }
            return this;
        };
    })(events1[i1]);
    /* \
   * Element.data
   [ method ]
   **
   * Adds or retrieves given value associated with given key.
   **
   * See also @Element.removeData
   > Parameters
   - key (string) key to store data
   - value (any) #optional value to store
   = (object) @Element
   * or, if value is not specified:
   = (any) value
   * or, if key and value are not specified:
   = (object) Key/value pairs for all the data associated with the element.
   > Usage
   | for (var i = 0, i < 5, i++) {
   |     paper.circle(10 + 15 * i, 10, 10)
   |          .attr({fill: "#000"})
   |          .data("i", i)
   |          .click(function () {
   |             alert(this.data("i"));
   |          });
   | }
  \ */ elproto.data = function(key, value) {
        const data = eldata[this.id] = eldata[this.id] || {
        };
        if (arguments.length == 0) return data;
        if (arguments.length == 1) {
            if ($b7c3e249c8a42d1b$export$db202ddc8be9136.is(key, 'object')) {
                for(const i in key)if (key[has](i)) this.data(i, key[i]);
                return this;
            }
            $f74a27260bed6e25$export$6b962911844bfb1e(`raphael.data.get.${this.id}`, this, data[key], key);
            return data[key];
        }
        data[key] = value;
        $f74a27260bed6e25$export$6b962911844bfb1e(`raphael.data.set.${this.id}`, this, value, key);
        return this;
    };
    /* \
   * Element.removeData
   [ method ]
   **
   * Removes value associated with an element by given key.
   * If key is not provided, removes all the data of the element.
   > Parameters
   - key (string) #optional key
   = (object) @Element
  \ */ elproto.removeData = function(key) {
        if (key == null) eldata[this.id] = {
        };
        else eldata[this.id] && delete eldata[this.id][key];
        return this;
    };
    /* \
    * Element.getData
    [ method ]
    **
    * Retrieves the element data
    = (object) data
  \ */ elproto.getData = function() {
        return clone(eldata[this.id] || {
        });
    };
    /* \
   * Element.hover
   [ method ]
   **
   * Adds event handlers for hover for the element.
   > Parameters
   - f_in (function) handler for hover in
   - f_out (function) handler for hover out
   - icontext (object) #optional context for hover in handler
   - ocontext (object) #optional context for hover out handler
   = (object) @Element
  \ */ elproto.hover = function(f_in, f_out, scope_in, scope_out) {
        return this.mouseover(f_in, scope_in).mouseout(f_out, scope_out || scope_in);
    };
    /* \
   * Element.unhover
   [ method ]
   **
   * Removes event handlers for hover for the element.
   > Parameters
   - f_in (function) handler for hover in
   - f_out (function) handler for hover out
   = (object) @Element
  \ */ elproto.unhover = function(f_in, f_out) {
        return this.unmouseover(f_in).unmouseout(f_out);
    };
    const draggable = [];
    /* \
   * Element.drag
   [ method ]
   **
   * Adds event handlers for drag of the element.
   > Parameters
   - onmove (function) handler for moving
   - onstart (function) handler for drag start
   - onend (function) handler for drag end
   - mcontext (object) #optional context for moving handler
   - scontext (object) #optional context for drag start handler
   - econtext (object) #optional context for drag end handler
   * Additionally following `drag` events will be triggered: `drag.start.<id>` on start,
   * `drag.end.<id>` on end and `drag.move.<id>` on every move. When element will be dragged over another element
   * `drag.over.<id>` will be fired as well.
   *
   * Start event and start handler will be called in specified context or in context of the element with following parameters:
   o x (number) x position of the mouse
   o y (number) y position of the mouse
   o event (object) DOM event object
   * Move event and move handler will be called in specified context or in context of the element with following parameters:
   o dx (number) shift by x from the start point
   o dy (number) shift by y from the start point
   o x (number) x position of the mouse
   o y (number) y position of the mouse
   o event (object) DOM event object
   * End event and end handler will be called in specified context or in context of the element with following parameters:
   o event (object) DOM event object
   = (object) @Element
  \ */ elproto.drag = function(onmove, onstart, onend, move_scope, start_scope, end_scope) {
        function start(e) {
            (e.originalEvent || e).preventDefault();
            let x = e.clientX;
            let y = e.clientY;
            const scrollY = g1.doc.documentElement.scrollTop || g1.doc.body.scrollTop;
            const scrollX = g1.doc.documentElement.scrollLeft || g1.doc.body.scrollLeft;
            this._drag.id = e.identifier;
            if (supportsTouch && e.touches) {
                let i = e.touches.length;
                let touch;
                while(i--){
                    touch = e.touches[i];
                    this._drag.id = touch.identifier;
                    if (touch.identifier == this._drag.id) {
                        x = touch.clientX;
                        y = touch.clientY;
                        break;
                    }
                }
            }
            this._drag.x = x + scrollX;
            this._drag.y = y + scrollY;
            !drag.length && $b7c3e249c8a42d1b$export$db202ddc8be9136.mousemove(dragMove).mouseup(dragUp);
            drag.push({
                el: this,
                move_scope: move_scope,
                start_scope: start_scope,
                end_scope: end_scope
            });
            onstart && $f74a27260bed6e25$export$6b962911844bfb1e.on(`raphael.drag.start.${this.id}`, onstart);
            onmove && $f74a27260bed6e25$export$6b962911844bfb1e.on(`raphael.drag.move.${this.id}`, onmove);
            onend && $f74a27260bed6e25$export$6b962911844bfb1e.on(`raphael.drag.end.${this.id}`, onend);
            $f74a27260bed6e25$export$6b962911844bfb1e(`raphael.drag.start.${this.id}`, start_scope || move_scope || this, e.clientX + scrollX, e.clientY + scrollY, e);
        }
        this.start = start // SLATEBOX - makes text draggable
        ;
        this._drag = {
        };
        draggable.push({
            el: this,
            start: start
        });
        this.mousedown(start);
        return this;
    };
    /* \
   * Element.onDragOver
   [ method ]
   **
   * Shortcut for assigning event handler for `drag.over.<id>` event, where id is id of the element (see @Element.id).
   > Parameters
   - f (function) handler for event, first argument would be the element you are dragging over
  \ */ elproto.onDragOver = function(f) {
        f ? $f74a27260bed6e25$export$6b962911844bfb1e.on(`raphael.drag.over.${this.id}`, f) : $f74a27260bed6e25$export$6b962911844bfb1e.unbind(`raphael.drag.over.${this.id}`);
    };
    /* \
   * Element.undrag
   [ method ]
   **
   * Removes all drag event handlers from given element.
  \ */ elproto.undrag = function() {
        let i = draggable.length;
        while(i--)if (draggable[i].el == this) {
            this.unmousedown(draggable[i].start);
            draggable.splice(i, 1);
            $f74a27260bed6e25$export$6b962911844bfb1e.unbind(`raphael.drag.*.${this.id}`);
        }
        !draggable.length && $b7c3e249c8a42d1b$export$db202ddc8be9136.unmousemove(dragMove).unmouseup(dragUp);
        drag = [];
    };
    /* \
   * Paper.circle
   [ method ]
   **
   * Draws a circle.
   **
   > Parameters
   **
   - x (number) x coordinate of the centre
   - y (number) y coordinate of the centre
   - r (number) radius
   = (object) Raphaël element object with type “circle”
   **
   > Usage
   | var c = paper.circle(50, 50, 40);
  \ */ paperproto.circle = function(x, y, r) {
        const out = $b7c3e249c8a42d1b$export$db202ddc8be9136._engine.circle(this, x || 0, y || 0, r || 0);
        this.__set__ && this.__set__.push(out);
        return out;
    };
    /* \
   * Paper.rect
   [ method ]
   *
   * Draws a rectangle.
   **
   > Parameters
   **
   - x (number) x coordinate of the top left corner
   - y (number) y coordinate of the top left corner
   - width (number) width
   - height (number) height
   - r (number) #optional radius for rounded corners, default is 0
   = (object) Raphaël element object with type “rect”
   **
   > Usage
   | // regular rectangle
   | var c = paper.rect(10, 10, 50, 50);
   | // rectangle with rounded corners
   | var c = paper.rect(40, 40, 50, 50, 10);
  \ */ paperproto.rect = function(x, y, w, h, r) {
        const out = $b7c3e249c8a42d1b$export$db202ddc8be9136._engine.rect(this, x || 0, y || 0, w || 0, h || 0, r || 0);
        this.__set__ && this.__set__.push(out);
        return out;
    };
    /* \
     * Paper.g
     [ method ]
     *
     * Draws a svg group (g) element.
     **
    \ */ paperproto.g = function() {
        const out = $b7c3e249c8a42d1b$export$db202ddc8be9136._engine.g(this);
        this.__set__ && this.__set__.push(out);
        return out;
    };
    /* \
     * Paper.def
     [ method ]
     *
     * Adds a <def>
     **
    \ */ paperproto.def = function(def) {
        $b7c3e249c8a42d1b$export$db202ddc8be9136._engine.def.call(this, def);
    };
    /* \
   * Paper.ellipse
   [ method ]
   **
   * Draws an ellipse.
   **
   > Parameters
   **
   - x (number) x coordinate of the centre
   - y (number) y coordinate of the centre
   - rx (number) horizontal radius
   - ry (number) vertical radius
   = (object) Raphaël element object with type “ellipse”
   **
   > Usage
   | var c = paper.ellipse(50, 50, 40, 20);
  \ */ paperproto.ellipse = function(x, y, rx, ry) {
        const out = $b7c3e249c8a42d1b$export$db202ddc8be9136._engine.ellipse(this, x || 0, y || 0, rx || 0, ry || 0);
        this.__set__ && this.__set__.push(out);
        return out;
    };
    /* \
   * Paper.path
   [ method ]
   **
   * Creates a path element by given path data string.
   > Parameters
   - pathString (string) #optional path string in SVG format.
   * Path string consists of one-letter commands, followed by comma seprarated arguments in numercal form. Example:
   | "M10,20L30,40"
   * Here we can see two commands: “M”, with arguments `(10, 20)` and “L” with arguments `(30, 40)`. Upper case letter mean command is absolute, lower case—relative.
   *
   # <p>Here is short list of commands available, for more details see <a href="http://www.w3.org/TR/SVG/paths.html#PathData" title="Details of a path's data attribute's format are described in the SVG specification.">SVG path string format</a>.</p>
   # <table><thead><tr><th>Command</th><th>Name</th><th>Parameters</th></tr></thead><tbody>
   # <tr><td>M</td><td>moveto</td><td>(x y)+</td></tr>
   # <tr><td>Z</td><td>closepath</td><td>(none)</td></tr>
   # <tr><td>L</td><td>lineto</td><td>(x y)+</td></tr>
   # <tr><td>H</td><td>horizontal lineto</td><td>x+</td></tr>
   # <tr><td>V</td><td>vertical lineto</td><td>y+</td></tr>
   # <tr><td>C</td><td>curveto</td><td>(x1 y1 x2 y2 x y)+</td></tr>
   # <tr><td>S</td><td>smooth curveto</td><td>(x2 y2 x y)+</td></tr>
   # <tr><td>Q</td><td>quadratic Bézier curveto</td><td>(x1 y1 x y)+</td></tr>
   # <tr><td>T</td><td>smooth quadratic Bézier curveto</td><td>(x y)+</td></tr>
   # <tr><td>A</td><td>elliptical arc</td><td>(rx ry x-axis-rotation large-arc-flag sweep-flag x y)+</td></tr>
   # <tr><td>R</td><td><a href="http://en.wikipedia.org/wiki/Catmull–Rom_spline#Catmull.E2.80.93Rom_spline">Catmull-Rom curveto</a>*</td><td>x1 y1 (x y)+</td></tr></tbody></table>
   * * “Catmull-Rom curveto” is a not standard SVG command and added in 2.0 to make life easier.
   * Note: there is a special case when path consist of just three commands: “M10,10R…z”. In this case path will smoothly connects to its beginning.
   > Usage
   | var c = paper.path("M10 10L90 90");
   | // draw a diagonal line:
   | // move to 10,10, line to 90,90
   * For example of path strings, check out these icons: http://raphaeljs.com/icons/
  \ */ paperproto.path = function(pathString) {
        pathString && !$b7c3e249c8a42d1b$export$db202ddc8be9136.is(pathString, string1) && !$b7c3e249c8a42d1b$export$db202ddc8be9136.is(pathString[0], array1) && (pathString += E);
        const out = $b7c3e249c8a42d1b$export$db202ddc8be9136._engine.path($b7c3e249c8a42d1b$export$db202ddc8be9136.format[apply]($b7c3e249c8a42d1b$export$db202ddc8be9136, arguments), this);
        this.__set__ && this.__set__.push(out);
        return out;
    };
    /* \
   * Paper.image
   [ method ]
   **
   * Embeds an image into the surface.
   **
   > Parameters
   **
   - src (string) URI of the source image
   - x (number) x coordinate position
   - y (number) y coordinate position
   - width (number) width of the image
   - height (number) height of the image
   = (object) Raphaël element object with type “image”
   **
   > Usage
   | var c = paper.image("apple.png", 10, 10, 80, 80);
  \ */ paperproto.image = function(src, x, y, w, h) {
        const out = $b7c3e249c8a42d1b$export$db202ddc8be9136._engine.image(this, src || 'about:blank', x || 0, y || 0, w || 0, h || 0);
        this.__set__ && this.__set__.push(out);
        return out;
    };
    /* \
   * Paper.text
   [ method ]
   **
   * Draws a text string. If you need line breaks, put “\n” in the string.
   **
   > Parameters
   **
   - x (number) x coordinate position
   - y (number) y coordinate position
   - text (string) The text string to draw
   = (object) Raphaël element object with type “text”
   **
   > Usage
   | var t = paper.text(50, 50, "Raphaël\nkicks\nbutt!");
  \ */ paperproto.text = function(x, y, text) {
        const out = $b7c3e249c8a42d1b$export$db202ddc8be9136._engine.text(this, x || 0, y || 0, Str(text));
        this.__set__ && this.__set__.push(out);
        return out;
    };
    /* \
   * Paper.set
   [ method ]
   **
   * Creates array-like object to keep and operate several elements at once.
   * Warning: it doesn’t create any elements for itself in the page, it just groups existing elements.
   * Sets act as pseudo elements — all methods available to an element can be used on a set.
   = (object) array-like object that represents set of elements
   **
   > Usage
   | var st = paper.set();
   | st.push(
   |     paper.circle(10, 10, 5),
   |     paper.circle(30, 10, 5)
   | );
   | st.attr({fill: "red"}); // changes the fill of both circles
  \ */ paperproto.set = function(itemsArray) {
        !$b7c3e249c8a42d1b$export$db202ddc8be9136.is(itemsArray, 'array') && (itemsArray = Array.prototype.splice.call(arguments, 0, arguments.length));
        const out = new Set(itemsArray);
        this.__set__ && this.__set__.push(out);
        out.paper = this;
        out.type = 'set';
        return out;
    };
    /* \
   * Paper.setStart
   [ method ]
   **
   * Creates @Paper.set. All elements that will be created after calling this method and before calling
   * @Paper.setFinish will be added to the set.
   **
   > Usage
   | paper.setStart();
   | paper.circle(10, 10, 5),
   | paper.circle(30, 10, 5)
   | var st = paper.setFinish();
   | st.attr({fill: "red"}); // changes the fill of both circles
  \ */ paperproto.setStart = function(set) {
        this.__set__ = set || this.set();
    };
    /* \
   * Paper.setFinish
   [ method ]
   **
   * See @Paper.setStart. This method finishes catching and returns resulting set.
   **
   = (object) set
  \ */ paperproto.setFinish = function(set) {
        const out = this.__set__;
        delete this.__set__;
        return out;
    };
    /* \
   * Paper.getSize
   [ method ]
   **
   * Obtains current paper actual size.
   **
   = (object)
   \ */ paperproto.getSize = function() {
        const container = this.canvas.parentNode;
        return {
            width: container.offsetWidth,
            height: container.offsetHeight
        };
    };
    /* \
   * Paper.setSize
   [ method ]
   **
   * If you need to change dimensions of the canvas call this method
   **
   > Parameters
   **
   - width (number) new width of the canvas
   - height (number) new height of the canvas
  \ */ paperproto.setSize = function(width, height) {
        return $b7c3e249c8a42d1b$export$db202ddc8be9136._engine.setSize.call(this, width, height);
    };
    /* \
   * Paper.setViewBox
   [ method ]
   **
   * Sets the view box of the paper. Practically it gives you ability to zoom and pan whole paper surface by
   * specifying new boundaries.
   **
   > Parameters
   **
   - x (number) new x position, default is `0`
   - y (number) new y position, default is `0`
   - w (number) new width of the canvas
   - h (number) new height of the canvas
   - fit (boolean) `true` if you want graphics to fit into new boundary box
  \ */ paperproto.setViewBox = function(x, y, w, h, fit) {
        return $b7c3e249c8a42d1b$export$db202ddc8be9136._engine.setViewBox.call(this, x, y, w, h, fit);
    };
    /* \
   * Paper.top
   [ property ]
   **
   * Points to the topmost element on the paper
  \ */ /* \
   * Paper.bottom
   [ property ]
   **
   * Points to the bottom element on the paper
  \ */ paperproto.top = paperproto.bottom = null;
    /* \
   * Paper.raphael
   [ property ]
   **
   * Points to the @Raphael object/function
  \ */ paperproto.raphael = $b7c3e249c8a42d1b$export$db202ddc8be9136;
    const getOffset = function(elem) {
        const box = elem.getBoundingClientRect();
        const doc = elem.ownerDocument;
        const { body: body  } = doc;
        const docElem = doc.documentElement;
        const clientTop = docElem.clientTop || body.clientTop || 0;
        const clientLeft = docElem.clientLeft || body.clientLeft || 0;
        const top = box.top + (g1.win.pageYOffset || docElem.scrollTop || body.scrollTop) - clientTop;
        const left = box.left + (g1.win.pageXOffset || docElem.scrollLeft || body.scrollLeft) - clientLeft;
        return {
            y: top,
            x: left
        };
    };
    /* \
   * Paper.getElementByPoint
   [ method ]
   **
   * Returns you topmost element under given point.
   **
   = (object) Raphaël element object
   > Parameters
   **
   - x (number) x coordinate from the top left corner of the window
   - y (number) y coordinate from the top left corner of the window
   > Usage
   | paper.getElementByPoint(mouseX, mouseY).attr({stroke: "#f00"});
  \ */ paperproto.getElementByPoint = function(x, y) {
        const paper = this;
        const svg = paper.canvas;
        let target = g1.doc.elementFromPoint(x, y);
        if (g1.win.opera && target.tagName == 'svg') {
            const so = getOffset(svg);
            const sr = svg.createSVGRect();
            sr.x = x - so.x;
            sr.y = y - so.y;
            sr.width = sr.height = 1;
            const hits = svg.getIntersectionList(sr, null);
            if (hits.length) target = hits[hits.length - 1];
        }
        if (!target) return null;
        while(target.parentNode && target != svg.parentNode && !target.raphael)target = target.parentNode;
        target == paper.canvas.parentNode && (target = svg);
        target = target && target.raphael ? paper.getById(target.raphaelid) : null;
        return target;
    };
    /* \
   * Paper.getElementsByBBox
   [ method ]
   **
   * Returns set of elements that have an intersecting bounding box
   **
   > Parameters
   **
   - bbox (object) bbox to check with
   = (object) @Set
   \ */ paperproto.getElementsByBBox = function(bbox) {
        const set = this.set();
        this.forEach((el)=>{
            if ($b7c3e249c8a42d1b$export$db202ddc8be9136.isBBoxIntersect(el.getBBox(), bbox)) set.push(el);
        });
        return set;
    };
    /* \
   * Paper.getById
   [ method ]
   **
   * Returns you element by its internal ID.
   **
   > Parameters
   **
   - id (number) id
   = (object) Raphaël element object
  \ */ paperproto.getById = function(id) {
        let bot = this.bottom;
        while(bot){
            if (bot.id == id) return bot;
            bot = bot.next;
        }
        return null;
    };
    /* \
   * Paper.forEach
   [ method ]
   **
   * Executes given function for each element on the paper
   *
   * If callback function returns `false` it will stop loop running.
   **
   > Parameters
   **
   - callback (function) function to run
   - thisArg (object) context object for the callback
   = (object) Paper object
   > Usage
   | paper.forEach(function (el) {
   |     el.attr({ stroke: "blue" });
   | });
  \ */ paperproto.forEach = function(callback, thisArg) {
        let bot = this.bottom;
        while(bot){
            if (callback.call(thisArg, bot) === false) return this;
            bot = bot.next;
        }
        return this;
    };
    /* \
   * Paper.getElementsByPoint
   [ method ]
   **
   * Returns set of elements that have common point inside
   **
   > Parameters
   **
   - x (number) x coordinate of the point
   - y (number) y coordinate of the point
   = (object) @Set
  \ */ paperproto.getElementsByPoint = function(x, y) {
        const set = this.set();
        this.forEach((el)=>{
            if (el.isPointInside(x, y)) set.push(el);
        });
        return set;
    };
    function x_y() {
        return this.x + S1 + this.y;
    }
    function x_y_w_h() {
        return `${this.x + S1 + this.y + S1 + this.width} \xd7 ${this.height}`;
    }
    /* \
   * Element.isPointInside
   [ method ]
   **
   * Determine if given point is inside this element’s shape
   **
   > Parameters
   **
   - x (number) x coordinate of the point
   - y (number) y coordinate of the point
   = (boolean) `true` if point inside the shape
  \ */ elproto.isPointInside = function(x, y) {
        let rp = this.realPath = getPath1[this.type](this);
        if (this.attr('transform') && this.attr('transform').length) rp = $b7c3e249c8a42d1b$export$db202ddc8be9136.transformPath(rp, this.attr('transform'));
        return $b7c3e249c8a42d1b$export$db202ddc8be9136.isPointInsidePath(rp, x, y);
    };
    /* \
   * Element.getBBox
   [ method ]
   **
   * Return bounding box for a given element
   **
   > Parameters
   **
   - isWithoutTransform (boolean) flag, `true` if you want to have bounding box before transformations. Default is `false`.
   = (object) Bounding box object:
   o {
   o     x: (number) top left corner x
   o     y: (number) top left corner y
   o     x2: (number) bottom right corner x
   o     y2: (number) bottom right corner y
   o     width: (number) width
   o     height: (number) height
   o }
  \ */ elproto.getBBox = function(isWithoutTransform) {
        if (this.removed) return {
        };
        const { _: _  } = this;
        if (isWithoutTransform) {
            if (_.dirty || !_.bboxwt) {
                this.realPath = getPath1[this.type](this);
                _.bboxwt = pathDimensions(this.realPath);
                _.bboxwt.toString = x_y_w_h;
                _.dirty = 0;
            }
            return _.bboxwt;
        }
        if (_.dirty || _.dirtyT || !_.bbox) {
            if (_.dirty || !this.realPath) {
                _.bboxwt = 0;
                this.realPath = getPath1[this.type](this);
            }
            _.bbox = pathDimensions(mapPath(this.realPath, this.matrix));
            _.bbox.toString = x_y_w_h;
            _.dirty = _.dirtyT = 0;
        }
        return _.bbox;
    };
    /* \
   * Element.clone
   [ method ]
   **
   = (object) clone of a given element
   **
  \ */ elproto.clone = function() {
        if (this.removed) return null;
        const out = this.paper[this.type]().attr(this.attr());
        this.__set__ && this.__set__.push(out);
        return out;
    };
    /* \
   * Element.glow
   [ method ]
   **
   * Return set of elements that create glow-like effect around given element. See @Paper.set.
   *
   * Note: Glow is not connected to the element. If you change element attributes it won’t adjust itself.
   **
   > Parameters
   **
   - glow (object) #optional parameters object with all properties optional:
   o {
   o     width (number) size of the glow, default is `10`
   o     fill (boolean) will it be filled, default is `false`
   o     opacity (number) opacity, default is `0.5`
   o     offsetx (number) horizontal offset, default is `0`
   o     offsety (number) vertical offset, default is `0`
   o     color (string) glow colour, default is `black`
   o }
   = (object) @Paper.set of elements that represents glow
  \ */ elproto.glow = function(glow) {
        if (this.type == 'text') return null;
        glow = glow || {
        };
        const s = {
            width: (glow.width || 10) + (+this.attr('stroke-width') || 1),
            fill: glow.fill || false,
            opacity: glow.opacity == null ? 0.5 : glow.opacity,
            offsetx: glow.offsetx || 0,
            offsety: glow.offsety || 0,
            color: glow.color || '#000'
        };
        const c = s.width / 2;
        const r = this.paper;
        const out = r.set();
        let path = this.realPath || getPath1[this.type](this);
        path = this.matrix ? mapPath(path, this.matrix) : path;
        for(let i = 1; i < c + 1; i++)out.push(r.path(path).attr({
            stroke: s.color,
            fill: s.fill ? s.color : 'none',
            'stroke-linejoin': 'round',
            'stroke-linecap': 'round',
            'stroke-width': +(s.width / c * i).toFixed(3),
            opacity: +(s.opacity / c).toFixed(3)
        }));
        return out.insertBefore(this).translate(s.offsetx, s.offsety);
    };
    const curveslengths = {
    };
    const getPointAtSegmentLength = function(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, length) {
        if (length == null) return bezlen(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y);
        return $b7c3e249c8a42d1b$export$db202ddc8be9136.findDotsAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, getTatLen(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, length));
    };
    const getLengthFactory = function(istotal, subpath) {
        return function(path, length, onlystart) {
            path = path2curve(path);
            let x;
            let y;
            let p;
            let l;
            let sp = '';
            const subpaths = {
            };
            let point;
            let len = 0;
            for(let i = 0, ii = path.length; i < ii; i++){
                p = path[i];
                if (p[0] == 'M') {
                    x = +p[1];
                    y = +p[2];
                } else {
                    l = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
                    if (len + l > length) {
                        if (subpath && !subpaths.start) {
                            point = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6], length - len);
                            sp += [
                                `C${point.start.x}`,
                                point.start.y,
                                point.m.x,
                                point.m.y,
                                point.x,
                                point.y, 
                            ];
                            if (onlystart) return sp;
                            subpaths.start = sp;
                            sp = [
                                `M${point.x}`,
                                `${point.y}C${point.n.x}`,
                                point.n.y,
                                point.end.x,
                                point.end.y,
                                p[5],
                                p[6], 
                            ].join();
                            len += l;
                            x = +p[5];
                            y = +p[6];
                            continue;
                        }
                        if (!istotal && !subpath) {
                            point = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6], length - len);
                            return {
                                x: point.x,
                                y: point.y,
                                alpha: point.alpha
                            };
                        }
                    }
                    len += l;
                    x = +p[5];
                    y = +p[6];
                }
                sp += p.shift() + p;
            }
            subpaths.end = sp;
            point = istotal ? len : subpath ? subpaths : $b7c3e249c8a42d1b$export$db202ddc8be9136.findDotsAtSegment(x, y, p[0], p[1], p[2], p[3], p[4], p[5], 1);
            point.alpha && (point = {
                x: point.x,
                y: point.y,
                alpha: point.alpha
            });
            return point;
        };
    };
    const getTotalLength = getLengthFactory(1);
    const getPointAtLength = getLengthFactory();
    const getSubpathsAtLength = getLengthFactory(0, 1);
    /* \
   * Raphael.getTotalLength
   [ method ]
   **
   * Returns length of the given path in pixels.
   **
   > Parameters
   **
   - path (string) SVG path string.
   **
   = (number) length.
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.getTotalLength = getTotalLength;
    /* \
   * Raphael.getPointAtLength
   [ method ]
   **
   * Return coordinates of the point located at the given length on the given path.
   **
   > Parameters
   **
   - path (string) SVG path string
   - length (number)
   **
   = (object) representation of the point:
   o {
   o     x: (number) x coordinate
   o     y: (number) y coordinate
   o     alpha: (number) angle of derivative
   o }
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.getPointAtLength = getPointAtLength;
    /* \
   * Raphael.getSubpath
   [ method ]
   **
   * Return subpath of a given path from given length to given length.
   **
   > Parameters
   **
   - path (string) SVG path string
   - from (number) position of the start of the segment
   - to (number) position of the end of the segment
   **
   = (string) pathstring for the segment
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.getSubpath = function(path, from, to) {
        if (this.getTotalLength(path) - to < 0.000001) return getSubpathsAtLength(path, from).end;
        const a = getSubpathsAtLength(path, to, 1);
        return from ? getSubpathsAtLength(a, from).end : a;
    };
    /* \
   * Element.getTotalLength
   [ method ]
   **
   * Returns length of the path in pixels. Only works for element of “path” type.
   = (number) length.
  \ */ elproto.getTotalLength = function() {
        const path = this.getPath();
        if (!path) return;
        if (this.node.getTotalLength) return this.node.getTotalLength();
        return getTotalLength(path);
    };
    /* \
   * Element.getPointAtLength
   [ method ]
   **
   * Return coordinates of the point located at the given length on the given path. Only works for element of “path” type.
   **
   > Parameters
   **
   - length (number)
   **
   = (object) representation of the point:
   o {
   o     x: (number) x coordinate
   o     y: (number) y coordinate
   o     alpha: (number) angle of derivative
   o }
  \ */ elproto.getPointAtLength = function(length) {
        const path = this.getPath();
        if (!path) return;
        return getPointAtLength(path, length);
    };
    /* \
   * Element.getPath
   [ method ]
   **
   * Returns path of the element. Only works for elements of “path” type and simple elements like circle.
   = (object) path
   **
  \ */ elproto.getPath = function() {
        let path;
        const getPath = $b7c3e249c8a42d1b$export$db202ddc8be9136._getPath[this.type];
        if (this.type == 'text' || this.type == 'set') return;
        if (getPath) path = getPath(this);
        return path;
    };
    /* \
   * Element.getSubpath
   [ method ]
   **
   * Return subpath of a given element from given length to given length. Only works for element of “path” type.
   **
   > Parameters
   **
   - from (number) position of the start of the segment
   - to (number) position of the end of the segment
   **
   = (string) pathstring for the segment
  \ */ elproto.getSubpath = function(from, to) {
        const path = this.getPath();
        if (!path) return;
        return $b7c3e249c8a42d1b$export$db202ddc8be9136.getSubpath(path, from, to);
    };
    /* \
   * Raphael.easing_formulas
   [ property ]
   **
   * Object that contains easing formulas for animation. You could extend it with your own. By default it has following list of easing:
   # <ul>
   #     <li>“linear”</li>
   #     <li>“&lt;” or “easeIn” or “ease-in”</li>
   #     <li>“>” or “easeOut” or “ease-out”</li>
   #     <li>“&lt;>” or “easeInOut” or “ease-in-out”</li>
   #     <li>“backIn” or “back-in”</li>
   #     <li>“backOut” or “back-out”</li>
   #     <li>“elastic”</li>
   #     <li>“bounce”</li>
   # </ul>
   # <p>See also <a href="http://raphaeljs.com/easing.html">Easing demo</a>.</p>
  \ */ const ef = $b7c3e249c8a42d1b$export$db202ddc8be9136.easing_formulas = {
        linear (n) {
            return n;
        },
        '<': function(n) {
            return n ** 1.7;
        },
        '>': function(n) {
            return n ** 0.48;
        },
        '<>': function(n) {
            const q = 0.48 - n / 1.04;
            const Q = math.sqrt(0.1734 + q * q);
            const x = Q - q;
            const X = abs(x) ** (1 / 3) * (x < 0 ? -1 : 1);
            const y = -Q - q;
            const Y = abs(y) ** (1 / 3) * (y < 0 ? -1 : 1);
            const t = X + Y + 0.5;
            return (1 - t) * 3 * t * t + t * t * t;
        },
        backIn (n) {
            const s = 1.70158;
            return n * n * ((s + 1) * n - s);
        },
        backOut (n) {
            n -= 1;
            const s = 1.70158;
            return n * n * ((s + 1) * n + s) + 1;
        },
        elastic (n) {
            if (n == !!n) return n;
            return 2 ** (-10 * n) * math.sin((n - 0.075) * (2 * PI) / 0.3) + 1;
        },
        bounce (n) {
            const s = 7.5625;
            const p = 2.75;
            let l;
            if (n < 1 / p) l = s * n * n;
            else if (n < 2 / p) {
                n -= 1.5 / p;
                l = s * n * n + 0.75;
            } else if (n < 2.5 / p) {
                n -= 2.25 / p;
                l = s * n * n + 0.9375;
            } else {
                n -= 2.625 / p;
                l = s * n * n + 0.984375;
            }
            return l;
        }
    };
    ef.easeIn = ef['ease-in'] = ef['<'];
    ef.easeOut = ef['ease-out'] = ef['>'];
    ef.easeInOut = ef['ease-in-out'] = ef['<>'];
    ef['back-in'] = ef.backIn;
    ef['back-out'] = ef.backOut;
    const animationElements = [];
    const requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
        setTimeout(callback, 16);
    };
    var animation = function() {
        const Now = +new Date();
        let l = 0;
        for(; l < animationElements.length; l++){
            const e = animationElements[l];
            if (e.el.removed || e.paused) continue;
            let time = Now - e.start;
            var { ms: ms  } = e;
            const { easing: easing  } = e;
            var { from: from  } = e;
            var { diff: diff  } = e;
            const { to: to  } = e;
            const { t: t  } = e;
            const that1 = e.el;
            const set = {
            };
            var now;
            const init = {
            };
            var key;
            if (e.initstatus) {
                time = (e.initstatus * e.anim.top - e.prev) / (e.percent - e.prev) * ms;
                e.status = e.initstatus;
                delete e.initstatus;
                e.stop && animationElements.splice(l--, 1);
            } else e.status = (e.prev + (e.percent - e.prev) * (time / ms)) / e.anim.top;
            if (time < 0) continue;
            if (time < ms) {
                var pos = easing(time / ms);
                for(var attr in from)if (from[has](attr)) {
                    switch(availableAnimAttrs[attr]){
                        case nu:
                            now = +from[attr] + pos * ms * diff[attr];
                            break;
                        case 'colour':
                            now = `rgb(${[
                                upto255(round1(from[attr].r + pos * ms * diff[attr].r)),
                                upto255(round1(from[attr].g + pos * ms * diff[attr].g)),
                                upto255(round1(from[attr].b + pos * ms * diff[attr].b)), 
                            ].join(',')})`;
                            break;
                        case 'path':
                            now = [];
                            for(var i = 0, ii = from[attr].length; i < ii; i++){
                                now[i] = [
                                    from[attr][i][0]
                                ];
                                for(var j = 1, jj = from[attr][i].length; j < jj; j++)now[i][j] = +from[attr][i][j] + pos * ms * diff[attr][i][j];
                                now[i] = now[i].join(S1);
                            }
                            now = now.join(S1);
                            break;
                        case 'transform':
                            if (diff[attr].real) {
                                now = [];
                                for(i = 0, ii = from[attr].length; i < ii; i++){
                                    now[i] = [
                                        from[attr][i][0]
                                    ];
                                    for(j = 1, jj = from[attr][i].length; j < jj; j++)now[i][j] = from[attr][i][j] + pos * ms * diff[attr][i][j];
                                }
                            } else {
                                const get = function(i) {
                                    return +from[attr][i] + pos * ms * diff[attr][i];
                                };
                                // now = [["r", get(2), 0, 0], ["t", get(3), get(4)], ["s", get(0), get(1), 0, 0]];
                                now = [
                                    [
                                        'm',
                                        get(0),
                                        get(1),
                                        get(2),
                                        get(3),
                                        get(4),
                                        get(5)
                                    ]
                                ];
                            }
                            break;
                        case 'csv':
                            if (attr == 'clip-rect') {
                                now = [];
                                i = 4;
                                while(i--)now[i] = +from[attr][i] + pos * ms * diff[attr][i];
                            }
                            break;
                        default:
                            var from2 = [][concat](from[attr]);
                            now = [];
                            i = that1.paper.customAttributes[attr].length;
                            while(i--)now[i] = +from2[i] + pos * ms * diff[attr][i];
                            break;
                    }
                    set[attr] = now;
                }
                that1.attr(set);
                (function(id, that, anim) {
                    setTimeout(()=>{
                        $f74a27260bed6e25$export$6b962911844bfb1e(`raphael.anim.frame.${id}`, that, anim);
                    });
                })(that1.id, that1, e.anim);
            } else {
                (function(f, el, a) {
                    setTimeout(()=>{
                        $f74a27260bed6e25$export$6b962911844bfb1e(`raphael.anim.frame.${el.id}`, el, a);
                        $f74a27260bed6e25$export$6b962911844bfb1e(`raphael.anim.finish.${el.id}`, el, a);
                        $b7c3e249c8a42d1b$export$db202ddc8be9136.is(f, 'function') && f.call(el);
                    });
                })(e.callback, that1, e.anim);
                that1.attr(to);
                animationElements.splice(l--, 1);
                if (e.repeat > 1 && !e.next) {
                    for(key in to)if (to[has](key)) init[key] = e.totalOrigin[key];
                    e.el.attr(init);
                    runAnimation(e.anim, e.el, e.anim.percents[0], null, e.totalOrigin, e.repeat - 1);
                }
                if (e.next && !e.stop) runAnimation(e.anim, e.el, e.next, null, e.totalOrigin, e.repeat);
            }
        }
        animationElements.length && requestAnimFrame(animation);
    };
    var upto255 = function(color) {
        return color > 255 ? 255 : color < 0 ? 0 : color;
    };
    /* \
   * Element.animateWith
   [ method ]
   **
   * Acts similar to @Element.animate, but ensure that given animation runs in sync with another given element.
   **
   > Parameters
   **
   - el (object) element to sync with
   - anim (object) animation to sync with
   - params (object) #optional final attributes for the element, see also @Element.attr
   - ms (number) #optional number of milliseconds for animation to run
   - easing (string) #optional easing type. Accept on of @Raphael.easing_formulas or CSS format: `cubic&#x2010;bezier(XX,&#160;XX,&#160;XX,&#160;XX)`
   - callback (function) #optional callback function. Will be called at the end of animation.
   * or
   - element (object) element to sync with
   - anim (object) animation to sync with
   - animation (object) #optional animation object, see @Raphael.animation
   **
   = (object) original element
  \ */ elproto.animateWith = function(el, anim, params, ms, easing, callback) {
        const element = this;
        if (element.removed) {
            callback && callback.call(element);
            return element;
        }
        const a = params instanceof Animation ? params : $b7c3e249c8a42d1b$export$db202ddc8be9136.animation(params, ms, easing, callback);
        let x;
        let y;
        runAnimation(a, element, a.percents[0], null, element.attr());
        for(let i = 0, ii = animationElements.length; i < ii; i++)if (animationElements[i].anim == anim && animationElements[i].el == el) {
            animationElements[ii - 1].start = animationElements[i].start;
            break;
        }
        return element;
    //
    //
    // var a = params ? R.animation(params, ms, easing, callback) : anim,
    //     status = element.status(anim);
    // return this.animate(a).status(a, status * anim.ms / a.ms);
    };
    function CubicBezierAtTime(t2, p1x, p1y, p2x, p2y, duration) {
        const cx = 3 * p1x;
        const bx = 3 * (p2x - p1x) - cx;
        const ax = 1 - cx - bx;
        const cy = 3 * p1y;
        const by = 3 * (p2y - p1y) - cy;
        const ay = 1 - cy - by;
        function sampleCurveX(t) {
            return ((ax * t + bx) * t + cx) * t;
        }
        function solve(x, epsilon) {
            const t = solveCurveX(x, epsilon);
            return ((ay * t + by) * t + cy) * t;
        }
        function solveCurveX(x, epsilon) {
            let t0;
            let t1;
            let t2;
            let x2;
            let d2;
            let i;
            for(t2 = x, i = 0; i < 8; i++){
                x2 = sampleCurveX(t2) - x;
                if (abs(x2) < epsilon) return t2;
                d2 = (3 * ax * t2 + 2 * bx) * t2 + cx;
                if (abs(d2) < 0.000001) break;
                t2 -= x2 / d2;
            }
            t0 = 0;
            t1 = 1;
            t2 = x;
            if (t2 < t0) return t0;
            if (t2 > t1) return t1;
            while(t0 < t1){
                x2 = sampleCurveX(t2);
                if (abs(x2 - x) < epsilon) return t2;
                if (x > x2) t0 = t2;
                else t1 = t2;
                t2 = (t1 - t0) / 2 + t0;
            }
            return t2;
        }
        return solve(t2, 1 / (200 * duration));
    }
    elproto.onAnimation = function(f) {
        f ? $f74a27260bed6e25$export$6b962911844bfb1e.on(`raphael.anim.frame.${this.id}`, f) : $f74a27260bed6e25$export$6b962911844bfb1e.unbind(`raphael.anim.frame.${this.id}`);
        return this;
    };
    function Animation(anim, ms) {
        const percents = [];
        const newAnim = {
        };
        this.ms = ms;
        this.times = 1;
        if (anim) {
            for(const attr in anim)if (anim[has](attr)) {
                newAnim[toFloat(attr)] = anim[attr];
                percents.push(toFloat(attr));
            }
            percents.sort(sortByNumber);
        }
        this.anim = newAnim;
        this.top = percents[percents.length - 1];
        this.percents = percents;
    }
    /* \
   * Animation.delay
   [ method ]
   **
   * Creates a copy of existing animation object with given delay.
   **
   > Parameters
   **
   - delay (number) number of ms to pass between animation start and actual animation
   **
   = (object) new altered Animation object
   | var anim = Raphael.animation({cx: 10, cy: 20}, 2e3);
   | circle1.animate(anim); // run the given animation immediately
   | circle2.animate(anim.delay(500)); // run the given animation after 500 ms
  \ */ Animation.prototype.delay = function(delay) {
        const a = new Animation(this.anim, this.ms);
        a.times = this.times;
        a.del = +delay || 0;
        return a;
    };
    /* \
   * Animation.repeat
   [ method ]
   **
   * Creates a copy of existing animation object with given repetition.
   **
   > Parameters
   **
   - repeat (number) number iterations of animation. For infinite animation pass `Infinity`
   **
   = (object) new altered Animation object
  \ */ Animation.prototype.repeat = function(times) {
        const a = new Animation(this.anim, this.ms);
        a.del = this.del;
        a.times = math.floor(mmax(times, 0)) || 1;
        return a;
    };
    function runAnimation(anim, element, percent, status, totalOrigin, times) {
        percent = toFloat(percent);
        let params;
        let isInAnim;
        let isInAnimSet;
        const percents = [];
        let next;
        let prev;
        let timestamp;
        let { ms: ms  } = anim;
        const from = {
        };
        const to = {
        };
        const diff = {
        };
        if (status) for(i = 0, ii = animationElements.length; i < ii; i++){
            var e = animationElements[i];
            if (e.el.id == element.id && e.anim == anim) {
                if (e.percent != percent) {
                    animationElements.splice(i, 1);
                    isInAnimSet = 1;
                } else isInAnim = e;
                element.attr(e.totalOrigin);
                break;
            }
        }
        else status = +to // NaN
        ;
        for(var i = 0, ii = anim.percents.length; i < ii; i++){
            if (anim.percents[i] == percent || anim.percents[i] > status * anim.top) {
                percent = anim.percents[i];
                prev = anim.percents[i - 1] || 0;
                ms = ms / anim.top * (percent - prev);
                next = anim.percents[i + 1];
                params = anim.anim[percent];
                break;
            } else if (status) element.attr(anim.anim[anim.percents[i]]);
        }
        if (!params) return;
        if (!isInAnim) {
            for(const attr in params)if (params[has](attr)) {
                if (availableAnimAttrs[has](attr) || element.paper.customAttributes[has](attr)) {
                    from[attr] = element.attr(attr);
                    from[attr] == null && (from[attr] = availableAttrs[attr]);
                    to[attr] = params[attr];
                    switch(availableAnimAttrs[attr]){
                        case nu:
                            diff[attr] = (to[attr] - from[attr]) / ms;
                            break;
                        case 'colour':
                            from[attr] = $b7c3e249c8a42d1b$export$db202ddc8be9136.getRGB(from[attr]);
                            var toColour = $b7c3e249c8a42d1b$export$db202ddc8be9136.getRGB(to[attr]);
                            diff[attr] = {
                                r: (toColour.r - from[attr].r) / ms,
                                g: (toColour.g - from[attr].g) / ms,
                                b: (toColour.b - from[attr].b) / ms
                            };
                            break;
                        case 'path':
                            var pathes = path2curve(from[attr], to[attr]);
                            var toPath = pathes[1];
                            from[attr] = pathes[0];
                            diff[attr] = [];
                            for(i = 0, ii = from[attr].length; i < ii; i++){
                                diff[attr][i] = [
                                    0
                                ];
                                for(var j = 1, jj = from[attr][i].length; j < jj; j++)diff[attr][i][j] = (toPath[i][j] - from[attr][i][j]) / ms;
                            }
                            break;
                        case 'transform':
                            var { _: _  } = element;
                            var eq = equaliseTransform(_[attr], to[attr]);
                            if (eq) {
                                from[attr] = eq.from;
                                to[attr] = eq.to;
                                diff[attr] = [];
                                diff[attr].real = true;
                                for(i = 0, ii = from[attr].length; i < ii; i++){
                                    diff[attr][i] = [
                                        from[attr][i][0]
                                    ];
                                    for(j = 1, jj = from[attr][i].length; j < jj; j++)diff[attr][i][j] = (to[attr][i][j] - from[attr][i][j]) / ms;
                                }
                            } else {
                                const m = element.matrix || new Matrix();
                                const to2 = {
                                    _: {
                                        transform: _.transform
                                    },
                                    getBBox () {
                                        return element.getBBox(1);
                                    }
                                };
                                from[attr] = [
                                    m.a,
                                    m.b,
                                    m.c,
                                    m.d,
                                    m.e,
                                    m.f
                                ];
                                extractTransform(to2, to[attr]);
                                to[attr] = to2._.transform;
                                diff[attr] = [
                                    (to2.matrix.a - m.a) / ms,
                                    (to2.matrix.b - m.b) / ms,
                                    (to2.matrix.c - m.c) / ms,
                                    (to2.matrix.d - m.d) / ms,
                                    (to2.matrix.e - m.e) / ms,
                                    (to2.matrix.f - m.f) / ms, 
                                ];
                            // from[attr] = [_.sx, _.sy, _.deg, _.dx, _.dy];
                            // var to2 = {_:{}, getBBox: function () { return element.getBBox(); }};
                            // extractTransform(to2, to[attr]);
                            // diff[attr] = [
                            //     (to2._.sx - _.sx) / ms,
                            //     (to2._.sy - _.sy) / ms,
                            //     (to2._.deg - _.deg) / ms,
                            //     (to2._.dx - _.dx) / ms,
                            //     (to2._.dy - _.dy) / ms
                            // ];
                            }
                            break;
                        case 'csv':
                            var values = Str(params[attr])[split](separator);
                            var from2 = Str(from[attr])[split](separator);
                            if (attr == 'clip-rect') {
                                from[attr] = from2;
                                diff[attr] = [];
                                i = from2.length;
                                while(i--)diff[attr][i] = (values[i] - from[attr][i]) / ms;
                            }
                            to[attr] = values;
                            break;
                        default:
                            values = [][concat](params[attr]);
                            from2 = [][concat](from[attr]);
                            diff[attr] = [];
                            i = element.paper.customAttributes[attr].length;
                            while(i--)diff[attr][i] = ((values[i] || 0) - (from2[i] || 0)) / ms;
                            break;
                    }
                }
            }
            const { easing: easing  } = params;
            let easyeasy = $b7c3e249c8a42d1b$export$db202ddc8be9136.easing_formulas[easing];
            if (!easyeasy) {
                easyeasy = Str(easing).match(bezierrg);
                if (easyeasy && easyeasy.length == 5) {
                    const curve = easyeasy;
                    easyeasy = function(t) {
                        return CubicBezierAtTime(t, +curve[1], +curve[2], +curve[3], +curve[4], ms);
                    };
                } else easyeasy = pipe;
            }
            timestamp = params.start || anim.start || +new Date();
            e = {
                anim: anim,
                percent: percent,
                timestamp: timestamp,
                start: timestamp + (anim.del || 0),
                status: 0,
                initstatus: status || 0,
                stop: false,
                ms: ms,
                easing: easyeasy,
                from: from,
                diff: diff,
                to: to,
                el: element,
                callback: params.callback,
                prev: prev,
                next: next,
                repeat: times || anim.times,
                origin: element.attr(),
                totalOrigin: totalOrigin
            };
            animationElements.push(e);
            if (status && !isInAnim && !isInAnimSet) {
                e.stop = true;
                e.start = new Date() - ms * status;
                if (animationElements.length == 1) return animation();
            }
            if (isInAnimSet) e.start = new Date() - e.ms * status;
            animationElements.length == 1 && requestAnimFrame(animation);
        } else {
            isInAnim.initstatus = status;
            isInAnim.start = new Date() - isInAnim.ms * status;
        }
        $f74a27260bed6e25$export$6b962911844bfb1e(`raphael.anim.start.${element.id}`, element, anim);
    }
    /* \
   * Raphael.animation
   [ method ]
   **
   * Creates an animation object that can be passed to the @Element.animate or @Element.animateWith methods.
   * See also @Animation.delay and @Animation.repeat methods.
   **
   > Parameters
   **
   - params (object) final attributes for the element, see also @Element.attr
   - ms (number) number of milliseconds for animation to run
   - easing (string) #optional easing type. Accept one of @Raphael.easing_formulas or CSS format: `cubic&#x2010;bezier(XX,&#160;XX,&#160;XX,&#160;XX)`
   - callback (function) #optional callback function. Will be called at the end of animation.
   **
   = (object) @Animation
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.animation = function(params, ms, easing, callback) {
        if (params instanceof Animation) return params;
        if ($b7c3e249c8a42d1b$export$db202ddc8be9136.is(easing, 'function') || !easing) {
            callback = callback || easing || null;
            easing = null;
        }
        params = Object(params);
        ms = +ms || 0;
        const p = {
        };
        let json;
        let attr;
        for(attr in params)if (params[has](attr) && toFloat(attr) != attr && `${toFloat(attr)}%` != attr) {
            json = true;
            p[attr] = params[attr];
        }
        if (!json) {
            // if percent-like syntax is used and end-of-all animation callback used
            if (callback) {
                // find the last one
                let lastKey = 0;
                for(const i in params){
                    const percent = toInt(i);
                    if (params[has](i) && percent > lastKey) lastKey = percent;
                }
                lastKey += '%';
                // if already defined callback in the last keyframe, skip
                !params[lastKey].callback && (params[lastKey].callback = callback);
            }
            return new Animation(params, ms);
        }
        easing && (p.easing = easing);
        callback && (p.callback = callback);
        return new Animation({
            100: p
        }, ms);
    };
    /* \
   * Element.animate
   [ method ]
   **
   * Creates and starts animation for given element.
   **
   > Parameters
   **
   - params (object) final attributes for the element, see also @Element.attr
   - ms (number) number of milliseconds for animation to run
   - easing (string) #optional easing type. Accept one of @Raphael.easing_formulas or CSS format: `cubic&#x2010;bezier(XX,&#160;XX,&#160;XX,&#160;XX)`
   - callback (function) #optional callback function. Will be called at the end of animation.
   * or
   - animation (object) animation object, see @Raphael.animation
   **
   = (object) original element
  \ */ elproto.animate = function(params, ms, easing, callback) {
        const element = this;
        if (element.removed) {
            callback && callback.call(element);
            return element;
        }
        const anim = params instanceof Animation ? params : $b7c3e249c8a42d1b$export$db202ddc8be9136.animation(params, ms, easing, callback);
        runAnimation(anim, element, anim.percents[0], null, element.attr());
        return element;
    };
    /* \
   * Element.setTime
   [ method ]
   **
   * Sets the status of animation of the element in milliseconds. Similar to @Element.status method.
   **
   > Parameters
   **
   - anim (object) animation object
   - value (number) number of milliseconds from the beginning of the animation
   **
   = (object) original element if `value` is specified
   * Note, that during animation following events are triggered:
   *
   * On each animation frame event `anim.frame.<id>`, on start `anim.start.<id>` and on end `anim.finish.<id>`.
  \ */ elproto.setTime = function(anim, value) {
        if (anim && value != null) this.status(anim, mmin(value, anim.ms) / anim.ms);
        return this;
    };
    /* \
   * Element.status
   [ method ]
   **
   * Gets or sets the status of animation of the element.
   **
   > Parameters
   **
   - anim (object) #optional animation object
   - value (number) #optional 0 – 1. If specified, method works like a setter and sets the status of a given animation to the value. This will cause animation to jump to the given position.
   **
   = (number) status
   * or
   = (array) status if `anim` is not specified. Array of objects in format:
   o {
   o     anim: (object) animation object
   o     status: (number) status
   o }
   * or
   = (object) original element if `value` is specified
  \ */ elproto.status = function(anim, value) {
        const out = [];
        let i = 0;
        let len;
        let e;
        if (value != null) {
            runAnimation(anim, this, -1, mmin(value, 1));
            return this;
        }
        len = animationElements.length;
        for(; i < len; i++){
            e = animationElements[i];
            if (e.el.id == this.id && (!anim || e.anim == anim)) {
                if (anim) return e.status;
                out.push({
                    anim: e.anim,
                    status: e.status
                });
            }
        }
        if (anim) return 0;
        return out;
    };
    /* \
   * Element.pause
   [ method ]
   **
   * Stops animation of the element with ability to resume it later on.
   **
   > Parameters
   **
   - anim (object) #optional animation object
   **
   = (object) original element
  \ */ elproto.pause = function(anim) {
        for(let i = 0; i < animationElements.length; i++)if (animationElements[i].el.id == this.id && (!anim || animationElements[i].anim == anim)) {
            if ($f74a27260bed6e25$export$6b962911844bfb1e(`raphael.anim.pause.${this.id}`, this, animationElements[i].anim) !== false) animationElements[i].paused = true;
        }
        return this;
    };
    /* \
   * Element.resume
   [ method ]
   **
   * Resumes animation if it was paused with @Element.pause method.
   **
   > Parameters
   **
   - anim (object) #optional animation object
   **
   = (object) original element
  \ */ elproto.resume = function(anim) {
        for(let i = 0; i < animationElements.length; i++)if (animationElements[i].el.id == this.id && (!anim || animationElements[i].anim == anim)) {
            const e = animationElements[i];
            if ($f74a27260bed6e25$export$6b962911844bfb1e(`raphael.anim.resume.${this.id}`, this, e.anim) !== false) {
                delete e.paused;
                this.status(e.anim, e.status);
            }
        }
        return this;
    };
    /* \
   * Element.stop
   [ method ]
   **
   * Stops animation of the element.
   **
   > Parameters
   **
   - anim (object) #optional animation object
   **
   = (object) original element
  \ */ elproto.stop = function(anim) {
        for(let i = 0; i < animationElements.length; i++)if (animationElements[i].el.id == this.id && (!anim || animationElements[i].anim == anim)) {
            if ($f74a27260bed6e25$export$6b962911844bfb1e(`raphael.anim.stop.${this.id}`, this, animationElements[i].anim) !== false) animationElements.splice(i--, 1);
        }
        return this;
    };
    function stopAnimation(paper) {
        for(let i = 0; i < animationElements.length; i++)if (animationElements[i].el.paper == paper) animationElements.splice(i--, 1);
    }
    $f74a27260bed6e25$export$6b962911844bfb1e.on('raphael.remove', stopAnimation);
    $f74a27260bed6e25$export$6b962911844bfb1e.on('raphael.clear', stopAnimation);
    elproto.toString = function() {
        return 'Rapha\xebl\u2019s object';
    };
    // Set
    var Set = function(items) {
        this.items = [];
        this.length = 0;
        this.type = 'set';
        if (items) {
            for(let i = 0, ii = items.length; i < ii; i++)if (items[i] && (items[i].constructor == elproto.constructor || items[i].constructor == Set)) {
                this[this.items.length] = this.items[this.items.length] = items[i];
                this.length++;
            }
        }
    };
    const setproto = Set.prototype;
    /* \
   * Set.push
   [ method ]
   **
   * Adds each argument to the current set.
   = (object) original element
  \ */ setproto.push = function() {
        let item;
        let len;
        for(let i = 0, ii = arguments.length; i < ii; i++){
            item = arguments[i];
            if (item && (item.constructor == elproto.constructor || item.constructor == Set)) {
                len = this.items.length;
                this[len] = this.items[len] = item;
                this.length++;
            }
        }
        return this;
    };
    /* \
   * Set.pop
   [ method ]
   **
   * Removes last element and returns it.
   = (object) element
  \ */ setproto.pop = function() {
        this.length && delete this[this.length--];
        return this.items.pop();
    };
    /* \
   * Set.forEach
   [ method ]
   **
   * Executes given function for each element in the set.
   *
   * If function returns `false` it will stop loop running.
   **
   > Parameters
   **
   - callback (function) function to run
   - thisArg (object) context object for the callback
   = (object) Set object
  \ */ setproto.forEach = function(callback, thisArg) {
        for(let i = 0, ii = this.items.length; i < ii; i++){
            if (callback.call(thisArg, this.items[i], i) === false) return this;
        }
        return this;
    };
    for(const method in elproto)if (elproto[has](method)) setproto[method] = (function(methodname) {
        return function() {
            const arg = arguments;
            return this.forEach((el)=>{
                el[methodname][apply](el, arg);
            });
        };
    })(method);
    setproto.attr = function(name, value) {
        if (name && $b7c3e249c8a42d1b$export$db202ddc8be9136.is(name, array1) && $b7c3e249c8a42d1b$export$db202ddc8be9136.is(name[0], 'object')) for(let j = 0, jj = name.length; j < jj; j++)this.items[j].attr(name[j]);
        else for(let i = 0, ii = this.items.length; i < ii; i++)this.items[i].attr(name, value);
        return this;
    };
    /* \
   * Set.clear
   [ method ]
   **
   * Removes all elements from the set
  \ */ setproto.clear = function() {
        while(this.length)this.pop();
    };
    /* \
   * Set.splice
   [ method ]
   **
   * Removes given element from the set
   **
   > Parameters
   **
   - index (number) position of the deletion
   - count (number) number of element to remove
   - insertion… (object) #optional elements to insert
   = (object) set elements that were deleted
  \ */ setproto.splice = function(index, count, insertion) {
        index = index < 0 ? mmax(this.length + index, 0) : index;
        count = mmax(0, mmin(this.length - index, count));
        const tail = [];
        const todel = [];
        const args = [];
        let i;
        for(i = 2; i < arguments.length; i++)args.push(arguments[i]);
        for(i = 0; i < count; i++)todel.push(this[index + i]);
        for(; i < this.length - index; i++)tail.push(this[index + i]);
        const arglen = args.length;
        for(i = 0; i < arglen + tail.length; i++)this.items[index + i] = this[index + i] = i < arglen ? args[i] : tail[i - arglen];
        i = this.items.length = this.length -= count - arglen;
        while(this[i])delete this[i++];
        return new Set(todel);
    };
    /* \
   * Set.exclude
   [ method ]
   **
   * Removes given element from the set
   **
   > Parameters
   **
   - element (object) element to remove
   = (boolean) `true` if object was found & removed from the set
  \ */ setproto.exclude = function(el) {
        for(let i = 0, ii = this.length; i < ii; i++)if (this[i] == el) {
            this.splice(i, 1);
            return true;
        }
    };
    setproto.animate = function(params, ms, easing, callback) {
        ($b7c3e249c8a42d1b$export$db202ddc8be9136.is(easing, 'function') || !easing) && (callback = easing || null);
        let len = this.items.length;
        let i = len;
        let item;
        const set = this;
        let collector;
        if (!len) return this;
        callback && (collector = function() {
            !--len && callback.call(set);
        });
        easing = $b7c3e249c8a42d1b$export$db202ddc8be9136.is(easing, string1) ? easing : collector;
        const anim = $b7c3e249c8a42d1b$export$db202ddc8be9136.animation(params, ms, easing, collector);
        item = this.items[--i].animate(anim);
        while(i--){
            this.items[i] && !this.items[i].removed && this.items[i].animateWith(item, anim, anim);
            this.items[i] && !this.items[i].removed || len--;
        }
        return this;
    };
    setproto.insertAfter = function(el) {
        let i = this.items.length;
        while(i--)this.items[i].insertAfter(el);
        return this;
    };
    setproto.getBBox = function() {
        let x = [];
        let y = [];
        let x2 = [];
        let y2 = [];
        for(let i = this.items.length; i--;)if (!this.items[i].removed) {
            const box = this.items[i].getBBox();
            x.push(box.x);
            y.push(box.y);
            x2.push(box.x + box.width);
            y2.push(box.y + box.height);
        }
        x = mmin[apply](0, x);
        y = mmin[apply](0, y);
        x2 = mmax[apply](0, x2);
        y2 = mmax[apply](0, y2);
        return {
            x: x,
            y: y,
            x2: x2,
            y2: y2,
            width: x2 - x,
            height: y2 - y
        };
    };
    setproto.clone = function(s) {
        s = this.paper.set();
        for(let i = 0, ii = this.items.length; i < ii; i++)s.push(this.items[i].clone());
        return s;
    };
    setproto.toString = function() {
        return 'Rapha\xebl\u2018s set';
    };
    setproto.glow = function(glowConfig) {
        const ret = this.paper.set();
        this.forEach((shape, index)=>{
            const g = shape.glow(glowConfig);
            if (g != null) g.forEach((shape2, index2)=>{
                ret.push(shape2);
            });
        });
        return ret;
    };
    /* \
   * Set.isPointInside
   [ method ]
   **
   * Determine if given point is inside this set’s elements
   **
   > Parameters
   **
   - x (number) x coordinate of the point
   - y (number) y coordinate of the point
   = (boolean) `true` if point is inside any of the set's elements
   \ */ setproto.isPointInside = function(x, y) {
        let isPointInside = false;
        this.forEach((el)=>{
            if (el.isPointInside(x, y)) {
                isPointInside = true;
                return false // stop loop
                ;
            }
        });
        return isPointInside;
    };
    /* \
   * Raphael.registerFont
   [ method ]
   **
   * Adds given font to the registered set of fonts for Raphaël. Should be used as an internal call from within Cufón’s font file.
   * Returns original parameter, so it could be used with chaining.
   # <a href="http://wiki.github.com/sorccu/cufon/about">More about Cufón and how to convert your font form TTF, OTF, etc to JavaScript file.</a>
   **
   > Parameters
   **
   - font (object) the font to register
   = (object) the font you passed in
   > Usage
   | Cufon.registerFont(Raphael.registerFont({…}));
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.registerFont = function(font) {
        if (!font.face) return font;
        this.fonts = this.fonts || {
        };
        const fontcopy = {
            w: font.w,
            face: {
            },
            glyphs: {
            }
        };
        const family = font.face['font-family'];
        for(const prop in font.face)if (font.face[has](prop)) fontcopy.face[prop] = font.face[prop];
        if (this.fonts[family]) this.fonts[family].push(fontcopy);
        else this.fonts[family] = [
            fontcopy
        ];
        if (!font.svg) {
            fontcopy.face['units-per-em'] = toInt(font.face['units-per-em'], 10);
            for(const glyph in font.glyphs)if (font.glyphs[has](glyph)) {
                const path = font.glyphs[glyph];
                fontcopy.glyphs[glyph] = {
                    w: path.w,
                    k: {
                    },
                    d: path.d && `M${path.d.replace(/[mlcxtrv]/g, (command)=>({
                            l: 'L',
                            c: 'C',
                            x: 'z',
                            t: 'm',
                            r: 'l',
                            v: 'c'
                        })[command] || 'M'
                    )}z`
                };
                if (path.k) {
                    for(const k in path.k)if (path[has](k)) fontcopy.glyphs[glyph].k[k] = path.k[k];
                }
            }
        }
        return font;
    };
    /* \
   * Paper.getFont
   [ method ]
   **
   * Finds font object in the registered fonts by given parameters. You could specify only one word from the font name, like “Myriad” for “Myriad Pro”.
   **
   > Parameters
   **
   - family (string) font family name or any word from it
   - weight (string) #optional font weight
   - style (string) #optional font style
   - stretch (string) #optional font stretch
   = (object) the font object
   > Usage
   | paper.print(100, 100, "Test string", paper.getFont("Times", 800), 30);
  \ */ paperproto.getFont = function(family, weight, style, stretch) {
        stretch = stretch || 'normal';
        style = style || 'normal';
        weight = +weight || ({
            normal: 400,
            bold: 700,
            lighter: 300,
            bolder: 800
        })[weight] || 400;
        if (!$b7c3e249c8a42d1b$export$db202ddc8be9136.fonts) return;
        let font = $b7c3e249c8a42d1b$export$db202ddc8be9136.fonts[family];
        if (!font) {
            const name = new RegExp(`(^|\\s)${family.replace(/[^\w\d\s+!~.:_-]/g, E)}(\\s|$)`, 'i');
            for(const fontName in $b7c3e249c8a42d1b$export$db202ddc8be9136.fonts)if ($b7c3e249c8a42d1b$export$db202ddc8be9136.fonts[has](fontName)) {
                if (name.test(fontName)) {
                    font = $b7c3e249c8a42d1b$export$db202ddc8be9136.fonts[fontName];
                    break;
                }
            }
        }
        let thefont;
        if (font) for(let i = 0, ii = font.length; i < ii; i++){
            thefont = font[i];
            if (thefont.face['font-weight'] == weight && (thefont.face['font-style'] == style || !thefont.face['font-style']) && thefont.face['font-stretch'] == stretch) break;
        }
        return thefont;
    };
    /* \
   * Paper.print
   [ method ]
   **
   * Creates path that represent given text written using given font at given position with given size.
   * Result of the method is path element that contains whole text as a separate path.
   **
   > Parameters
   **
   - x (number) x position of the text
   - y (number) y position of the text
   - string (string) text to print
   - font (object) font object, see @Paper.getFont
   - size (number) #optional size of the font, default is `16`
   - origin (string) #optional could be `"baseline"` or `"middle"`, default is `"middle"`
   - letter_spacing (number) #optional number in range `-1..1`, default is `0`
   - line_spacing (number) #optional number in range `1..3`, default is `1`
   = (object) resulting path element, which consist of all letters
   > Usage
   | var txt = r.print(10, 50, "print", r.getFont("Museo"), 30).attr({fill: "#fff"});
  \ */ paperproto.print = function(x, y, string, font, size, origin, letter_spacing, line_spacing) {
        origin = origin || 'middle' // baseline|middle
        ;
        letter_spacing = mmax(mmin(letter_spacing || 0, 1), -1);
        line_spacing = mmax(mmin(line_spacing || 1, 3), 1);
        const letters = Str(string)[split](E);
        let shift = 0;
        let notfirst = 0;
        let path = E;
        let scale;
        $b7c3e249c8a42d1b$export$db202ddc8be9136.is(font, 'string') && (font = this.getFont(font));
        if (font) {
            scale = (size || 16) / font.face['units-per-em'];
            const bb = font.face.bbox[split](separator);
            const top = +bb[0];
            const lineHeight = bb[3] - bb[1];
            let shifty = 0;
            const height = +bb[1] + (origin == 'baseline' ? lineHeight + +font.face.descent : lineHeight / 2);
            for(let i = 0, ii = letters.length; i < ii; i++){
                if (letters[i] == '\n') {
                    shift = 0;
                    curr = 0;
                    notfirst = 0;
                    shifty += lineHeight * line_spacing;
                } else {
                    const prev = notfirst && font.glyphs[letters[i - 1]] || {
                    };
                    var curr = font.glyphs[letters[i]];
                    shift += notfirst ? (prev.w || font.w) + (prev.k && prev.k[letters[i]] || 0) + font.w * letter_spacing : 0;
                    notfirst = 1;
                }
                if (curr && curr.d) path += $b7c3e249c8a42d1b$export$db202ddc8be9136.transformPath(curr.d, [
                    't',
                    shift * scale,
                    shifty * scale,
                    's',
                    scale,
                    scale,
                    top,
                    height,
                    't',
                    (x - top) / scale,
                    (y - height) / scale, 
                ]);
            }
        }
        return this.path(path).attr({
            fill: '#000',
            stroke: 'none'
        });
    };
    /* \
   * Paper.add
   [ method ]
   **
   * Imports elements in JSON array in format `{type: type, <attributes>}`
   **
   > Parameters
   **
   - json (array)
   = (object) resulting set of imported elements
   > Usage
   | paper.add([
   |     {
   |         type: "circle",
   |         cx: 10,
   |         cy: 10,
   |         r: 5
   |     },
   |     {
   |         type: "rect",
   |         x: 10,
   |         y: 10,
   |         width: 10,
   |         height: 10,
   |         fill: "#fc0"
   |     }
   | ]);
  \ */ paperproto.add = function(json) {
        if ($b7c3e249c8a42d1b$export$db202ddc8be9136.is(json, 'array')) {
            var res = this.set();
            let i = 0;
            const ii = json.length;
            let j;
            for(; i < ii; i++){
                j = json[i] || {
                };
                elements[has](j.type) && res.push(this[j.type]().attr(j));
            }
        }
        return res;
    };
    /* \
   * Raphael.format
   [ method ]
   **
   * Simple format function. Replaces construction of type “`{<number>}`” to the corresponding argument.
   **
   > Parameters
   **
   - token (string) string to format
   - … (string) rest of arguments will be treated as parameters for replacement
   = (string) formated string
   > Usage
   | var x = 10,
   |     y = 20,
   |     width = 40,
   |     height = 50;
   | // this will draw a rectangular shape equivalent to "M10,20h40v50h-40z"
   | paper.path(Raphael.format("M{0},{1}h{2}v{3}h{4}z", x, y, width, height, -width));
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.format = function(token, params) {
        const args = $b7c3e249c8a42d1b$export$db202ddc8be9136.is(params, array1) ? [
            0
        ][concat](params) : arguments;
        token && $b7c3e249c8a42d1b$export$db202ddc8be9136.is(token, string1) && args.length - 1 && (token = token.replace(formatrg, (str, i)=>args[++i] == null ? E : args[i]
        ));
        return token || E;
    };
    /* \
   * Raphael.fullfill
   [ method ]
   **
   * A little bit more advanced format function than @Raphael.format. Replaces construction of type “`{<name>}`” to the corresponding argument.
   **
   > Parameters
   **
   - token (string) string to format
   - json (object) object which properties will be used as a replacement
   = (string) formated string
   > Usage
   | // this will draw a rectangular shape equivalent to "M10,20h40v50h-40z"
   | paper.path(Raphael.fullfill("M{x},{y}h{dim.width}v{dim.height}h{dim['negative width']}z", {
   |     x: 10,
   |     y: 20,
   |     dim: {
   |         width: 40,
   |         height: 50,
   |         "negative width": -40
   |     }
   | }));
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.fullfill = (function() {
        const tokenRegex = /\{([^\}]+)\}/g;
        const objNotationRegex = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g // matches .xxxxx or ["xxxxx"] to run over object properties
        ;
        const replacer = function(all, key, obj) {
            let res = obj;
            key.replace(objNotationRegex, (all, name, quote, quotedName, isFunc)=>{
                name = name || quotedName;
                if (res) {
                    if (name in res) res = res[name];
                    typeof res === 'function' && isFunc && (res = res());
                }
            });
            res = `${res == null || res == obj ? all : res}`;
            return res;
        };
        return function(str, obj) {
            return String(str).replace(tokenRegex, (all, key)=>replacer(all, key, obj)
            );
        };
    })();
    /* \
   * Raphael.ninja
   [ method ]
   **
   * If you want to leave no trace of Raphaël (Well, Raphaël creates only one global variable `Raphael`, but anyway.) You can use `ninja` method.
   * Beware, that in this case plugins could stop working, because they are depending on global variable existence.
   **
   = (object) Raphael object
   > Usage
   | (function (local_raphael) {
   |     var paper = local_raphael(10, 10, 320, 200);
   |     …
   | })(Raphael.ninja());
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.ninja = function() {
        if (oldRaphael.was) g1.win.Raphael = oldRaphael.is;
        else {
            // IE8 raises an error when deleting window property
            window.Raphael = undefined;
            try {
                delete window.Raphael;
            } catch (e) {
            }
        }
        return $b7c3e249c8a42d1b$export$db202ddc8be9136;
    };
    /* \
   * Raphael.st
   [ property (object) ]
   **
   * You can add your own method to elements and sets. It is wise to add a set method for each element method
   * you added, so you will be able to call the same method on sets too.
   **
   * See also @Raphael.el.
   > Usage
   | Raphael.el.red = function () {
   |     this.attr({fill: "#f00"});
   | };
   | Raphael.st.red = function () {
   |     this.forEach(function (el) {
   |         el.red();
   |     });
   | };
   | // then use it
   | paper.set(paper.circle(100, 100, 20), paper.circle(110, 100, 20)).red();
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.st = setproto;
    $f74a27260bed6e25$export$6b962911844bfb1e.on('raphael.DOMload', ()=>{
        loaded1 = true;
    });
    (function(doc, loaded, f) {
        if (doc.readyState == null && doc.addEventListener) {
            doc.addEventListener(loaded, f = function() {
                doc.removeEventListener(loaded, f, false);
                doc.readyState = 'complete';
            }, false);
            doc.readyState = 'loading';
        }
        function isLoaded() {
            /in/.test(doc && doc.readyState) ? setTimeout(isLoaded, 9) : $b7c3e249c8a42d1b$export$db202ddc8be9136.eve('raphael.DOMload');
        }
        isLoaded();
    })(document, 'DOMContentLoaded');
    return $b7c3e249c8a42d1b$export$db202ddc8be9136;
}();


const $db87f2586597736c$export$508faed300ccdfb = function() {
    const has = 'hasOwnProperty';
    const Str = String;
    const toFloat = parseFloat;
    const toInt = parseInt;
    const math = Math;
    const mmax = math.max;
    const { abs: abs  } = math;
    const { pow: pow  } = math;
    const separator = /[, ]+/;
    const E = '';
    const S = ' ';
    const xlink = 'http://www.w3.org/1999/xlink';
    const markers = {
        block: 'M5,0 0,2.5 5,5z',
        classic: 'M5,0 0,2.5 5,5 3.5,3 3.5,2z',
        diamond: 'M2.5,0 5,2.5 2.5,5 0,2.5z',
        open: 'M6,1 1,3.5 6,6',
        oval: 'M2.5,0A2.5,2.5,0,0,1,2.5,5 2.5,2.5,0,0,1,2.5,0z'
    };
    const markerCounter = {
    };
    var $ = function(el, attr) {
        if (attr) {
            if (typeof el === 'string') el = $(el);
            for(const key in attr)if (attr[has](key)) {
                if (key.substring(0, 6) == 'xlink:') el.setAttributeNS(xlink, key.substring(6), Str(attr[key]));
                else el.setAttribute(key, Str(attr[key]));
            }
        } else {
            el = $b7c3e249c8a42d1b$export$db202ddc8be9136._g.doc.createElementNS('http://www.w3.org/2000/svg', el);
            el.style && (el.style.webkitTapHighlightColor = 'rgba(0,0,0,0)');
        }
        return el;
    };
    const addGradientFill = function(element, gradient) {
        let type = 'linear';
        let id = element.id + gradient;
        let fx = 0.5;
        let fy = 0.5;
        const o = element.node;
        const SVG = element.paper;
        const s = o.style;
        let el = $b7c3e249c8a42d1b$export$db202ddc8be9136._g.doc.getElementById(id);
        if (!el) {
            gradient = Str(gradient).replace($b7c3e249c8a42d1b$export$db202ddc8be9136._radial_gradient, (all, _fx, _fy)=>{
                type = 'radial';
                if (_fx && _fy) {
                    fx = toFloat(_fx);
                    fy = toFloat(_fy);
                    const dir = (fy > 0.5) * 2 - (1)(fx - 0.5) ** 2 + (fy - 0.5) ** 2 > 0.25 && (fy = math.sqrt(0.25 - (fx - 0.5) ** 2) * dir + 0.5) && fy != 0.5 && (fy = fy.toFixed(5) - 0.00001 * dir);
                }
                return E;
            });
            gradient = gradient.split(/\s*\-\s*/);
            if (type == 'linear') {
                let angle = gradient.shift();
                angle = -toFloat(angle);
                if (isNaN(angle)) return null;
                var vector = [
                    0,
                    0,
                    math.cos($b7c3e249c8a42d1b$export$db202ddc8be9136.rad(angle)),
                    math.sin($b7c3e249c8a42d1b$export$db202ddc8be9136.rad(angle))
                ];
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
            const dots = $b7c3e249c8a42d1b$export$db202ddc8be9136._parseDots(gradient);
            if (!dots) return null;
            id = id.replace(/[\(\)\s,\xb0#]/g, '_');
            if (element.gradient && id != element.gradient.id) {
                SVG.defs.removeChild(element.gradient);
                delete element.gradient;
            }
            if (!element.gradient) {
                el = $(`${type}Gradient`, {
                    id: id
                });
                element.gradient = el;
                $(el, type == 'radial' ? {
                    fx: fx,
                    fy: fy
                } : {
                    x1: vector[0],
                    y1: vector[1],
                    x2: vector[2],
                    y2: vector[3],
                    gradientTransform: element.matrix.invert()
                });
                SVG.defs.appendChild(el);
                for(let i = 0, ii = dots.length; i < ii; i++)el.appendChild($('stop', {
                    offset: dots[i].offset ? dots[i].offset : i ? '100%' : '0%',
                    'stop-color': dots[i].color || '#fff',
                    'stop-opacity': isFinite(dots[i].opacity) ? dots[i].opacity : 1
                }));
            }
        }
        $(o, {
            fill: fillurl(id),
            opacity: 1,
            'fill-opacity': 1
        });
        s.fill = E;
        s.opacity = 1;
        s.fillOpacity = 1;
        return 1;
    };
    const isIE9or10 = function() {
        const mode = document.documentMode;
        return mode && (mode === 9 || mode === 10);
    };
    var fillurl = function(id) {
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
    const updatePosition = function(o) {
        if (!o.data('relativeFill')) {
            const bbox = o.getBBox(1);
            $(o.pattern, {
                patternTransform: `${o.matrix.invert()} translate(${bbox.x},${bbox.y})`
            });
        }
    };
    const addArrow = function(o, value, isEnd) {
        if (o.type == 'path') {
            const values = Str(value).toLowerCase().split('-');
            const p = o.paper;
            const se = isEnd ? 'end' : 'start';
            const { node: node  } = o;
            const { attrs: attrs  } = o;
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
            while(i--)switch(values[i]){
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
            if (type == 'open') {
                w += 2;
                h += 2;
                t += 2;
                dx = 1;
                refX = isEnd ? 4 : 1;
                attr = {
                    fill: 'none',
                    stroke: attrs.stroke
                };
            } else {
                refX = dx = w / 2;
                attr = {
                    fill: attrs.stroke,
                    stroke: 'none'
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
            } else o._.arrows = {
            };
            if (type != 'none') {
                const pathId = `raphael-marker-${type}`;
                const markerId = `raphael-marker-${se}${type}${w}${h}-obj${o.id}`;
                // SLATEBOX - addition to make sure arrows show in svg extract
                if (!$b7c3e249c8a42d1b$export$db202ddc8be9136._g.doc.getElementById(pathId) || $b7c3e249c8a42d1b$export$db202ddc8be9136._g.doc.getElementById(pathId) && getComputedStyle($b7c3e249c8a42d1b$export$db202ddc8be9136._g.doc.getElementById(pathId)).display === 'none') {
                    p.defs.appendChild($($('path'), {
                        'stroke-linecap': 'round',
                        d: markers[type],
                        id: pathId
                    }));
                    markerCounter[pathId] = 1;
                } else markerCounter[pathId]++;
                let marker = $b7c3e249c8a42d1b$export$db202ddc8be9136._g.doc.getElementById(markerId);
                let use;
                if (!marker) {
                    marker = $($('marker'), {
                        id: markerId,
                        markerHeight: h,
                        markerWidth: w,
                        orient: 'auto',
                        refX: refX,
                        refY: h / 2
                    });
                    use = $($('use'), {
                        'xlink:href': `#${pathId}`,
                        transform: `${isEnd ? `rotate(180 ${w / 2} ${h / 2}) ` : E}scale(${w / t},${h / t})`,
                        'stroke-width': (1 / ((w / t + h / t) / 2)).toFixed(4)
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
                    to = $b7c3e249c8a42d1b$export$db202ddc8be9136.getTotalLength(attrs.path) - delta * stroke;
                } else {
                    from = delta * stroke;
                    to = $b7c3e249c8a42d1b$export$db202ddc8be9136.getTotalLength(attrs.path) - (o._.arrows.enddx * stroke || 0);
                }
                attr = {
                };
                attr[`marker-${se}`] = `url(#${markerId})`;
                if (to || from) attr.d = $b7c3e249c8a42d1b$export$db202ddc8be9136.getSubpath(attrs.path, from, to);
                $(node, attr);
                o._.arrows[`${se}Path`] = pathId;
                o._.arrows[`${se}Marker`] = markerId;
                o._.arrows[`${se}dx`] = delta;
                o._.arrows[`${se}Type`] = type;
                o._.arrows[`${se}String`] = value;
            } else {
                if (isEnd) {
                    from = o._.arrows.startdx * stroke || 0;
                    to = $b7c3e249c8a42d1b$export$db202ddc8be9136.getTotalLength(attrs.path) - from;
                } else {
                    from = 0;
                    to = $b7c3e249c8a42d1b$export$db202ddc8be9136.getTotalLength(attrs.path) - (o._.arrows.enddx * stroke || 0);
                }
                o._.arrows[`${se}Path`] && $(node, {
                    d: $b7c3e249c8a42d1b$export$db202ddc8be9136.getSubpath(attrs.path, from, to)
                });
                delete o._.arrows[`${se}Path`];
                delete o._.arrows[`${se}Marker`];
                delete o._.arrows[`${se}dx`];
                delete o._.arrows[`${se}Type`];
                delete o._.arrows[`${se}String`];
            }
            for(attr in markerCounter)if (markerCounter[has](attr) && !markerCounter[attr]) {
                const item = $b7c3e249c8a42d1b$export$db202ddc8be9136._g.doc.getElementById(attr);
                item && item.parentNode.removeChild(item);
            }
        }
    };
    const dasharray = {
        '-': [
            3,
            1
        ],
        '.': [
            1,
            1
        ],
        '-.': [
            3,
            1,
            1,
            1
        ],
        '-..': [
            3,
            1,
            1,
            1,
            1,
            1
        ],
        '. ': [
            1,
            3
        ],
        '- ': [
            4,
            3
        ],
        '--': [
            8,
            3
        ],
        '- .': [
            4,
            3,
            1,
            3
        ],
        '--.': [
            8,
            3,
            1,
            3
        ],
        '--..': [
            8,
            3,
            1,
            3,
            1,
            3
        ]
    };
    const addDashes = function(o, value, params) {
        value = dasharray[Str(value).toLowerCase()];
        if (value) {
            const width = o.attrs['stroke-width'] || '1';
            const butt = {
                round: width,
                square: width,
                butt: 0
            }[o.attrs['stroke-linecap'] || params['stroke-linecap']] || 0;
            const dashes = [];
            let i = value.length;
            while(i--)dashes[i] = value[i] * width + (i % 2 ? 1 : -1) * butt;
            $(o.node, {
                'stroke-dasharray': dashes.join(',')
            });
        } else $(o.node, {
            'stroke-dasharray': 'none'
        });
    };
    const setFillAndStroke = function(o, params) {
        const { node: node  } = o;
        const { attrs: attrs  } = o;
        const vis = node.style.visibility;
        node.style.visibility = 'hidden';
        for(let att in params)if (params[has](att)) {
            if (!$b7c3e249c8a42d1b$export$db202ddc8be9136._availableAttrs[has](att)) continue;
            let value = params[att];
            attrs[att] = value;
            switch(att){
                case 'blur':
                    o.blur(value);
                    break;
                case 'title':
                    var title = node.getElementsByTagName('title');
                    // Use the existing <title>.
                    if (title.length && (title = title[0])) title.firstChild.nodeValue = value;
                    else {
                        title = $('title');
                        const val = $b7c3e249c8a42d1b$export$db202ddc8be9136._g.doc.createTextNode(value);
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
                    if (att == 'target') pn.setAttributeNS(xlink, 'show', value == 'blank' ? 'new' : value);
                    else pn.setAttributeNS(xlink, att, value);
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
                        o.clip && o.clip.parentNode.parentNode.removeChild(o.clip.parentNode);
                        var el = $('clipPath');
                        const rc = $('rect');
                        el.id = $b7c3e249c8a42d1b$export$db202ddc8be9136.createUUID();
                        $(rc, {
                            x: rect[0],
                            y: rect[1],
                            width: rect[2],
                            height: rect[3]
                        });
                        el.appendChild(rc);
                        o.paper.defs.appendChild(el);
                        $(node, {
                            'clip-path': `url(#${el.id})`
                        });
                        o.clip = rc;
                    }
                    if (!value) {
                        const path = node.getAttribute('clip-path');
                        if (path) {
                            const clip = $b7c3e249c8a42d1b$export$db202ddc8be9136._g.doc.getElementById(path.replace(/(^url\(#|\)$)/g, E));
                            clip && clip.parentNode.removeChild(clip);
                            $(node, {
                                'clip-path': E
                            });
                            delete o.clip;
                        }
                    }
                    break;
                case 'path':
                    // SLATEBOX - changed "$(node, {d: value ? attrs.path = R._pathToAbsolute(value) : "M0,0"});"
                    // to $(node, {d: value ? attrs.path = value : "M0,0"}); in the line below -->
                    if (o.type == 'path') {
                        $(node, {
                            d: value ? attrs.path = value : 'M0,0'
                        }) // <--
                        ;
                        o._.dirty = 1;
                        if (o._.arrows) {
                            'startString' in o._.arrows && addArrow(o, o._.arrows.startString);
                            'endString' in o._.arrows && addArrow(o, o._.arrows.endString, 1);
                        }
                    }
                    break;
                case 'width':
                    node.setAttribute(att, value);
                    o._.dirty = 1;
                    if (attrs.fx) {
                        att = 'x';
                        value = attrs.x;
                    } else break;
                case 'x':
                    if (attrs.fx) value = -attrs.x - (attrs.width || 0);
                case 'rx':
                    if (att == 'rx' && o.type == 'rect') break;
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
                    } else break;
                case 'y':
                    if (attrs.fy) value = -attrs.y - (attrs.height || 0);
                case 'ry':
                    if (att == 'ry' && o.type == 'rect') break;
                case 'cy':
                    node.setAttribute(att, value);
                    o.pattern && updatePosition(o);
                    o._.dirty = 1;
                    break;
                case 'r':
                    if (o.type == 'rect') $(node, {
                        rx: value,
                        ry: value
                    });
                    else node.setAttribute(att, value);
                    o._.dirty = 1;
                    break;
                case 'src':
                    if (o.type == 'image') node.setAttributeNS(xlink, 'href', value);
                    break;
                case 'stroke-width':
                    if (o._.sx != 1 || o._.sy != 1) value /= mmax(abs(o._.sx), abs(o._.sy)) || 1;
                    node.setAttribute(att, value);
                    if (attrs['stroke-dasharray']) addDashes(o, attrs['stroke-dasharray'], params);
                    if (o._.arrows) {
                        'startString' in o._.arrows && addArrow(o, o._.arrows.startString);
                        'endString' in o._.arrows && addArrow(o, o._.arrows.endString, 1);
                    }
                    break;
                case 'stroke-dasharray':
                    addDashes(o, value, params);
                    break;
                case 'fill':
                    // SLATEBOX a few edits for image filling (not tiling patterns) of path elements
                    var relativeFill = o.data('relativeFill');
                    var isURL = Str(value).match($b7c3e249c8a42d1b$export$db202ddc8be9136._ISURL);
                    if (isURL) {
                        if (value.indexOf('(#') > -1) // internal reference
                        $(node, {
                            fill: value
                        });
                        else {
                            // image, external
                            el = $('pattern');
                            var ig = $('image');
                            el.id = $b7c3e249c8a42d1b$export$db202ddc8be9136.createUUID();
                            $(el, {
                                x: 0,
                                y: 0,
                                patternUnits: relativeFill ? 'objectBoundingBox' : 'userSpaceOnUse',
                                height: 1,
                                width: 1
                            });
                            $(ig, {
                                x: 0,
                                y: 0,
                                'xlink:href': isURL[1]
                            });
                            el.appendChild(ig);
                            (function(el) {
                                $b7c3e249c8a42d1b$export$db202ddc8be9136._preload(isURL[1], function() {
                                    const w = this.offsetWidth;
                                    const h = this.offsetHeight;
                                    const tempPath = o.paper.path(o.attr('path'));
                                    const bbox = tempPath.getBBox();
                                    $(el, {
                                        width: relativeFill ? 1 : w,
                                        height: relativeFill ? 1 : h
                                    });
                                    // SLATEBOX - image fixes for FF/safari
                                    $(ig, {
                                        width: relativeFill ? o.imageOrigWidth || bbox.width : w,
                                        height: relativeFill ? o.imageOrigHeight || bbox.height : h
                                    });
                                    delete o.imageOrigHeight;
                                    delete o.imageOrigWidth;
                                    tempPath.remove();
                                // end image fixes for SB
                                });
                            })(el);
                            o.paper.defs.appendChild(el);
                            $(node, {
                                fill: `url(#${el.id})`
                            });
                            o.pattern = el;
                            o.pattern && updatePosition(o);
                        }
                        break;
                    }
                    var clr = $b7c3e249c8a42d1b$export$db202ddc8be9136.getRGB(value);
                    if (!clr.error) {
                        delete params.gradient;
                        delete attrs.gradient;
                        !$b7c3e249c8a42d1b$export$db202ddc8be9136.is(attrs.opacity, 'undefined') && $b7c3e249c8a42d1b$export$db202ddc8be9136.is(params.opacity, 'undefined') && $(node, {
                            opacity: attrs.opacity
                        });
                        !$b7c3e249c8a42d1b$export$db202ddc8be9136.is(attrs['fill-opacity'], 'undefined') && $b7c3e249c8a42d1b$export$db202ddc8be9136.is(params['fill-opacity'], 'undefined') && $(node, {
                            'fill-opacity': attrs['fill-opacity']
                        });
                    } else if ((o.type == 'circle' || o.type == 'ellipse' || Str(value).charAt() != 'r') && addGradientFill(o, value)) {
                        if ('opacity' in attrs || 'fill-opacity' in attrs) {
                            var gradient = $b7c3e249c8a42d1b$export$db202ddc8be9136._g.doc.getElementById(node.getAttribute('fill').replace(/^url\(#|\)$/g, E));
                            if (gradient) {
                                var stops = gradient.getElementsByTagName('stop');
                                $(stops[stops.length - 1], {
                                    'stop-opacity': ('opacity' in attrs ? attrs.opacity : 1) * ('fill-opacity' in attrs ? attrs['fill-opacity'] : 1)
                                });
                            }
                        }
                        attrs.gradient = value;
                        attrs.fill = 'none';
                        break;
                    }
                    clr[has]('opacity') && $(node, {
                        'fill-opacity': clr.opacity > 1 ? clr.opacity / 100 : clr.opacity
                    });
                case 'stroke':
                    clr = $b7c3e249c8a42d1b$export$db202ddc8be9136.getRGB(value);
                    node.setAttribute(att, clr.hex);
                    att == 'stroke' && clr[has]('opacity') && $(node, {
                        'stroke-opacity': clr.opacity > 1 ? clr.opacity / 100 : clr.opacity
                    });
                    if (att == 'stroke' && o._.arrows) {
                        'startString' in o._.arrows && addArrow(o, o._.arrows.startString);
                        'endString' in o._.arrows && addArrow(o, o._.arrows.endString, 1);
                    }
                    break;
                case 'gradient':
                    (o.type == 'circle' || o.type == 'ellipse' || Str(value).charAt() != 'r') && addGradientFill(o, value);
                    break;
                case 'opacity':
                    if (attrs.gradient && !attrs[has]('stroke-opacity')) $(node, {
                        'stroke-opacity': value > 1 ? value / 100 : value
                    });
                // fall
                case 'fill-opacity':
                    if (attrs.gradient) {
                        gradient = $b7c3e249c8a42d1b$export$db202ddc8be9136._g.doc.getElementById(node.getAttribute('fill').replace(/^url\(#|\)$/g, E));
                        if (gradient) {
                            stops = gradient.getElementsByTagName('stop');
                            $(stops[stops.length - 1], {
                                'stop-opacity': value
                            });
                        }
                        break;
                    }
                default:
                    att == 'font-size' && (value = `${toInt(value, 10)}px`);
                    var cssrule = att.replace(/(\-.)/g, (w)=>w.substring(1).toUpperCase()
                    );
                    node.style[cssrule] = value;
                    o._.dirty = 1;
                    node.setAttribute(att, value);
                    break;
            }
        }
        tuneText(o, params);
        node.style.visibility = vis;
    };
    const leading = 1.2;
    var tuneText = function(el, params) {
        if (el.type != 'text' || !(params[has]('text') || params[has]('font') || params[has]('font-size') || params[has]('x') || params[has]('y'))) return;
        const a = el.attrs;
        const { node: node  } = el;
        const fontSize = node.firstChild ? toInt($b7c3e249c8a42d1b$export$db202ddc8be9136._g.doc.defaultView.getComputedStyle(node.firstChild, E).getPropertyValue('font-size'), 10) : 10;
        if (params[has]('text')) {
            a.text = params.text;
            while(node.firstChild)node.removeChild(node.firstChild);
            const texts = Str(params.text).split('\n');
            var tspans = [];
            let tspan;
            for(var i = 0, ii = texts.length; i < ii; i++){
                tspan = $('tspan');
                i && $(tspan, {
                    dy: fontSize * leading,
                    x: a.x
                });
                tspan.appendChild($b7c3e249c8a42d1b$export$db202ddc8be9136._g.doc.createTextNode(texts[i]));
                node.appendChild(tspan);
                tspans[i] = tspan;
            }
        } else {
            tspans = node.getElementsByTagName('tspan');
            for(i = 0, ii = tspans.length; i < ii; i++)if (i) $(tspans[i], {
                dy: fontSize * leading,
                x: a.x
            });
            else $(tspans[0], {
                dy: 0
            });
        }
        $(node, {
            x: a.x,
            y: a.y
        });
        el._.dirty = 1;
        const bb = el._getBBox();
        const dif = a.y - (bb.y + bb.height / 2);
        dif && $b7c3e249c8a42d1b$export$db202ddc8be9136.is(dif, 'finite') && $(tspans[0], {
            dy: dif
        });
    };
    const getRealNode = function(node) {
        if (node.parentNode && node.parentNode.tagName.toLowerCase() === 'a') return node.parentNode;
        return node;
    };
    const Element = function(node, svg) {
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
      \ */ this[0] = this.node = node;
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
      \ */ node.raphael = true;
        /* \
       * Element.id
       [ property (number) ]
       **
       * Unique id of the element. Especially useful when you want to listen to events of the element,
       * because all events are fired in format `<module>.<action>.<id>`. Also useful for @Paper.getById method.
      \ */ this.id = guid();
        node.raphaelid = this.id;
        /**
     * Method that returns a 5 letter/digit id, enough for 36^5 = 60466176 elements
     * @returns {string} id
     */ function guid() {
            return `0000${(Math.random() * 36 ** 5 << 0).toString(36)}`.slice(-5);
        }
        this.matrix = $b7c3e249c8a42d1b$export$db202ddc8be9136.matrix();
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
      \ */ this.paper = svg;
        this.attrs = this.attrs || {
        };
        this._ = {
            transform: [],
            sx: 1,
            sy: 1,
            deg: 0,
            dx: 0,
            dy: 0,
            dirty: 1
        };
        !svg.bottom && (svg.bottom = this);
        /* \
       * Element.prev
       [ property (object) ]
       **
       * Reference to the previous element in the hierarchy.
      \ */ this.prev = svg.top;
        svg.top && (svg.top.next = this);
        svg.top = this;
        /* \
       * Element.next
       [ property (object) ]
       **
       * Reference to the next element in the hierarchy.
      \ */ this.next = null;
    };
    const elproto = $b7c3e249c8a42d1b$export$db202ddc8be9136.el;
    Element.prototype = elproto;
    elproto.constructor = Element;
    $b7c3e249c8a42d1b$export$db202ddc8be9136._engine.path = function(pathString, SVG) {
        const el = $('path');
        SVG.canvas && SVG.canvas.appendChild(el);
        const p = new Element(el, SVG);
        p.type = 'path';
        setFillAndStroke(p, {
            fill: 'none',
            stroke: '#000',
            path: pathString
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
  \ */ elproto.rotate = function(deg, cx, cy) {
        if (this.removed) return this;
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
        this.transform(this._.transform.concat([
            [
                'r',
                deg,
                cx,
                cy
            ]
        ]));
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
  \ */ elproto.scale = function(sx, sy, cx, cy) {
        if (this.removed) return this;
        sx = Str(sx).split(separator);
        if (sx.length - 1) {
            sy = toFloat(sx[1]);
            cx = toFloat(sx[2]);
            cy = toFloat(sx[3]);
        }
        sx = toFloat(sx[0]);
        sy == null && (sy = sx);
        cy == null && (cx = cy);
        if (cx == null || cy == null) var bbox = this.getBBox(1);
        cx = cx == null ? bbox.x + bbox.width / 2 : cx;
        cy = cy == null ? bbox.y + bbox.height / 2 : cy;
        this.transform(this._.transform.concat([
            [
                's',
                sx,
                sy,
                cx,
                cy
            ]
        ]));
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
  \ */ elproto.translate = function(dx, dy) {
        if (this.removed) return this;
        dx = Str(dx).split(separator);
        if (dx.length - 1) dy = toFloat(dx[1]);
        dx = toFloat(dx[0]) || 0;
        dy = +dy || 0;
        this.transform(this._.transform.concat([
            [
                't',
                dx,
                dy
            ]
        ]));
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
  \ */ elproto.transform = function(tstr) {
        const { _: _  } = this;
        if (tstr == null) return _.transform;
        $b7c3e249c8a42d1b$export$db202ddc8be9136._extractTransform(this, tstr);
        this.clip && $(this.clip, {
            transform: this.matrix.invert()
        });
        this.pattern && updatePosition(this);
        this.node && $(this.node, {
            transform: this.matrix
        });
        if (_.sx != 1 || _.sy != 1) {
            const sw = this.attrs[has]('stroke-width') ? this.attrs['stroke-width'] : 1;
            this.attr({
                'stroke-width': sw
            });
        }
        return this;
    };
    /* \
   * Element.hide
   [ method ]
   **
   * Makes element invisible. See @Element.show.
   = (object) @Element
  \ */ elproto.hide = function() {
        if (!this.removed) this.node.style.display = 'none';
        return this;
    };
    /* \
   * Element.show
   [ method ]
   **
   * Makes element visible. See @Element.hide.
   = (object) @Element
  \ */ elproto.show = function() {
        if (!this.removed) this.node.style.display = '';
        return this;
    };
    /* \
   * Element.remove
   [ method ]
   **
   * Removes element from the paper.
  \ */ elproto.remove = function() {
        const node = getRealNode(this.node);
        if (this.removed || !node.parentNode) return;
        const { paper: paper  } = this;
        paper.__set__ && paper.__set__.exclude(this);
        $f74a27260bed6e25$export$6b962911844bfb1e.unbind(`raphael.*.*.${this.id}`);
        if (this.gradient) paper.defs.removeChild(this.gradient);
        $b7c3e249c8a42d1b$export$db202ddc8be9136._tear(this, paper);
        node.parentNode.removeChild(node);
        // Remove custom data for element
        this.removeData();
        for(const i in this)this[i] = typeof this[i] === 'function' ? $b7c3e249c8a42d1b$export$db202ddc8be9136._removedFactory(i) : null;
        this.removed = true;
    };
    elproto._getBBox = function() {
        if (this.node.style.display == 'none') {
            this.show();
            var hide = true;
        }
        let canvasHidden = false;
        let containerStyle;
        if (this.paper.canvas.parentElement) containerStyle = this.paper.canvas.parentElement.style;
        else if (this.paper.canvas.parentNode) containerStyle = this.paper.canvas.parentNode.style;
        if (containerStyle && containerStyle.display == 'none') {
            canvasHidden = true;
            containerStyle.display = '';
        }
        let bbox = {
        };
        try {
            bbox = this.node.getBBox();
        } catch (e) {
            // Firefox 3.0.x, 25.0.1 (probably more versions affected) play badly here - possible fix
            bbox = {
                x: this.node.clientLeft,
                y: this.node.clientTop,
                width: this.node.clientWidth,
                height: this.node.clientHeight
            };
        } finally{
            bbox = bbox || {
            };
            if (canvasHidden) containerStyle.display = 'none';
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
  \ */ elproto.attr = function(name, value) {
        if (this.removed) return this;
        if (name == null) {
            const res = {
            };
            for(const a in this.attrs)if (this.attrs[has](a)) res[a] = this.attrs[a];
            res.gradient && res.fill == 'none' && (res.fill = res.gradient) && delete res.gradient;
            res.transform = this._.transform;
            return res;
        }
        if (value == null && $b7c3e249c8a42d1b$export$db202ddc8be9136.is(name, 'string')) {
            if (name == 'fill' && this.attrs.fill == 'none' && this.attrs.gradient) return this.attrs.gradient;
            if (name == 'transform') return this._.transform;
            const names = name.split(separator);
            var out = {
            };
            for(var i = 0, ii = names.length; i < ii; i++){
                name = names[i];
                if (name in this.attrs) out[name] = this.attrs[name];
                else if ($b7c3e249c8a42d1b$export$db202ddc8be9136.is(this.paper.customAttributes[name], 'function')) out[name] = this.paper.customAttributes[name].def;
                else out[name] = $b7c3e249c8a42d1b$export$db202ddc8be9136._availableAttrs[name];
            }
            return ii - 1 ? out : out[names[0]];
        }
        if (value == null && $b7c3e249c8a42d1b$export$db202ddc8be9136.is(name, 'array')) {
            out = {
            };
            for(i = 0, ii = name.length; i < ii; i++)out[name[i]] = this.attr(name[i]);
            return out;
        }
        if (value != null) {
            var params = {
            };
            params[name] = value;
        } else if (name != null && $b7c3e249c8a42d1b$export$db202ddc8be9136.is(name, 'object')) params = name;
        for(var key in params)$f74a27260bed6e25$export$6b962911844bfb1e(`raphael.attr.${key}.${this.id}`, this, params[key]);
        for(key in this.paper.customAttributes)if (this.paper.customAttributes[has](key) && params[has](key) && $b7c3e249c8a42d1b$export$db202ddc8be9136.is(this.paper.customAttributes[key], 'function')) {
            const par = this.paper.customAttributes[key].apply(this, [].concat(params[key]));
            this.attrs[key] = params[key];
            for(const subkey in par)if (par[has](subkey)) params[subkey] = par[subkey];
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
  \ */ elproto.toFront = function() {
        if (this.removed) return this;
        const node = getRealNode(this.node);
        node.parentNode.appendChild(node);
        const svg = this.paper;
        svg.top != this && $b7c3e249c8a42d1b$export$db202ddc8be9136._tofront(this, svg);
        return this;
    };
    /* \
   * Element.toBack
   [ method ]
   **
   * Moves the element so it is the furthest from the viewer’s eyes, behind other elements.
   = (object) @Element
  \ */ elproto.toBack = function() {
        if (this.removed) return this;
        const node = getRealNode(this.node);
        const { parentNode: parentNode  } = node;
        parentNode.insertBefore(node, parentNode.firstChild);
        $b7c3e249c8a42d1b$export$db202ddc8be9136._toback(this, this.paper);
        const svg = this.paper;
        return this;
    };
    /* \
   * Element.insertAfter
   [ method ]
   **
   * Inserts current object after the given one.
   = (object) @Element
  \ */ elproto.insertAfter = function(element) {
        if (this.removed || !element) return this;
        const node = getRealNode(this.node);
        const afterNode = getRealNode(element.node || element[element.length - 1].node);
        if (afterNode.nextSibling) afterNode.parentNode.insertBefore(node, afterNode.nextSibling);
        else afterNode.parentNode.appendChild(node);
        $b7c3e249c8a42d1b$export$db202ddc8be9136._insertafter(this, element, this.paper);
        return this;
    };
    /* \
   * Element.insertBefore
   [ method ]
   **
   * Inserts current object before the given one.
   = (object) @Element
  \ */ elproto.insertBefore = function(element) {
        if (this.removed || !element) return this;
        const node = getRealNode(this.node);
        const beforeNode = getRealNode(element.node || element[0].node);
        beforeNode.parentNode.insertBefore(node, beforeNode);
        $b7c3e249c8a42d1b$export$db202ddc8be9136._insertbefore(this, element, this.paper);
        return this;
    };
    elproto.blur = function(size) {
        // Experimental. No Safari support. Use it on your own risk.
        const t = this;
        if (+size !== 0) {
            const fltr = $('filter');
            const blur = $('feGaussianBlur');
            t.attrs.blur = size;
            fltr.id = $b7c3e249c8a42d1b$export$db202ddc8be9136.createUUID();
            $(blur, {
                stdDeviation: +size || 1.5
            });
            fltr.appendChild(blur);
            t.paper.defs.appendChild(fltr);
            t._blur = fltr;
            $(t.node, {
                filter: `url(#${fltr.id})`
            });
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
    $b7c3e249c8a42d1b$export$db202ddc8be9136._engine.circle = function(svg, x, y, r) {
        const el = $('circle');
        svg.canvas && svg.canvas.appendChild(el);
        const res = new Element(el, svg);
        res.attrs = {
            cx: x,
            cy: y,
            r: r,
            fill: 'none',
            stroke: '#000'
        };
        res.type = 'circle';
        $(el, res.attrs);
        return res;
    };
    $b7c3e249c8a42d1b$export$db202ddc8be9136._engine.rect = function(svg, x, y, w, h, r) {
        const el = $('rect');
        svg.canvas && svg.canvas.appendChild(el);
        const res = new Element(el, svg);
        res.attrs = {
            x: x,
            y: y,
            width: w,
            height: h,
            rx: r || 0,
            ry: r || 0,
            fill: 'none',
            stroke: '#000'
        };
        res.type = 'rect';
        $(el, res.attrs);
        return res;
    };
    $b7c3e249c8a42d1b$export$db202ddc8be9136._engine.g = function(svg) {
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
            'path'
        ];
        elements.forEach((element)=>{
            res[element] = function() {
                const args = [
                    res
                ];
                for(let i = 0; i < arguments.length; i++)args.push(arguments[i]);
                const out = $b7c3e249c8a42d1b$export$db202ddc8be9136._engine[element].apply(this, args);
                return out;
            };
        });
        $(el, res.attrs);
        return res;
    };
    $b7c3e249c8a42d1b$export$db202ddc8be9136._engine.def = function(def) {
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
    */ const id = def.id || `raphael-def-${$b7c3e249c8a42d1b$export$db202ddc8be9136.createUUID()}`;
        // if exists, remove and rebuild
        const exists = Array.prototype.slice.call(this.defs.children).find((c)=>c.getAttribute('id') === id
        );
        exists && this.defs.removeChild(exists);
        const defOpts = {
            id: id
        };
        Object.assign(defOpts, {
            ...def
        });
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
        if (def.inside) def.inside.forEach((i)=>{
            const ins = $($(i.type), i.attrs || {
            });
            rDef.appendChild(ins);
            if (i.nested) {
                if (i.nested.forEach) i.nested.forEach((nx)=>{
                    const nest = $($(nx.type), nx.attrs || {
                    });
                    ins.appendChild(nest);
                });
                else Object.keys(i.nested).forEach((n)=>{
                    const nest = $($(n), i.nested[n] || {
                    });
                    ins.appendChild(nest);
                });
            }
        });
        this.defs.appendChild(rDef);
    };
    $b7c3e249c8a42d1b$export$db202ddc8be9136._engine.ellipse = function(svg, x, y, rx, ry) {
        const el = $('ellipse');
        svg.canvas && svg.canvas.appendChild(el);
        const res = new Element(el, svg);
        res.attrs = {
            cx: x,
            cy: y,
            rx: rx,
            ry: ry,
            fill: 'none',
            stroke: '#000'
        };
        res.type = 'ellipse';
        $(el, res.attrs);
        return res;
    };
    $b7c3e249c8a42d1b$export$db202ddc8be9136._engine.image = function(svg, src, x, y, w, h) {
        const el = $('image');
        $(el, {
            x: x,
            y: y,
            width: w,
            height: h,
            preserveAspectRatio: 'none'
        });
        el.setAttributeNS(xlink, 'href', src);
        svg.canvas && svg.canvas.appendChild(el);
        const res = new Element(el, svg);
        res.attrs = {
            x: x,
            y: y,
            width: w,
            height: h,
            src: src
        };
        res.type = 'image';
        return res;
    };
    $b7c3e249c8a42d1b$export$db202ddc8be9136._engine.text = function(svg, x, y, text) {
        const el = $('text');
        svg.canvas && svg.canvas.appendChild(el);
        const res = new Element(el, svg);
        res.attrs = {
            x: x,
            y: y,
            'text-anchor': 'middle',
            text: text,
            'font-family': $b7c3e249c8a42d1b$export$db202ddc8be9136._availableAttrs['font-family'],
            'font-size': $b7c3e249c8a42d1b$export$db202ddc8be9136._availableAttrs['font-size'],
            stroke: 'none',
            fill: '#000'
        };
        res.type = 'text';
        setFillAndStroke(res, res.attrs);
        return res;
    };
    $b7c3e249c8a42d1b$export$db202ddc8be9136._engine.setSize = function(width, height) {
        this.width = width || this.width;
        this.height = height || this.height;
        this.canvas.setAttribute('width', this.width);
        this.canvas.setAttribute('height', this.height);
        if (this._viewBox) this.setViewBox.apply(this, this._viewBox);
        return this;
    };
    $b7c3e249c8a42d1b$export$db202ddc8be9136._engine.create = function() {
        const con = $b7c3e249c8a42d1b$export$db202ddc8be9136._getContainer.apply(0, arguments);
        let container = con && con.container;
        let { x: x  } = con;
        let { y: y  } = con;
        let { width: width  } = con;
        let { height: height  } = con;
        if (!container) throw new Error('SVG container not found.');
        const cnvs = $('svg');
        const css = 'overflow:hidden;';
        let isFloating;
        x = x || 0;
        y = y || 0;
        width = width || 512;
        height = height || 342;
        $(cnvs, {
            height: height,
            width: width,
            xmlns: 'http://www.w3.org/2000/svg'
        });
        if (container == 1) {
            cnvs.style.cssText = `${css}position:absolute;left:${x}px;top:${y}px`;
            $b7c3e249c8a42d1b$export$db202ddc8be9136._g.doc.body.appendChild(cnvs);
            isFloating = 1;
        } else {
            cnvs.style.cssText = `${css}position:relative`;
            if (container.firstChild) container.insertBefore(cnvs, container.firstChild);
            else container.appendChild(cnvs);
        }
        container = new $b7c3e249c8a42d1b$export$db202ddc8be9136._Paper();
        container.width = width;
        container.height = height;
        container.canvas = cnvs;
        container.clear();
        container._left = container._top = 0;
        isFloating && (container.renderfix = function() {
        });
        container.renderfix();
        return container;
    };
    $b7c3e249c8a42d1b$export$db202ddc8be9136._engine.setViewBox = function(x, y, w, h, fit) {
        $f74a27260bed6e25$export$6b962911844bfb1e('raphael.setViewBox', this, this._viewBox, [
            x,
            y,
            w,
            h,
            fit
        ]);
        const paperSize = this.getSize();
        let size = mmax(w / paperSize.width, h / paperSize.height);
        let { top: top  } = this;
        const aspectRatio = fit ? 'xMidYMid meet' : 'xMinYMin';
        let vb;
        let sw;
        if (x == null) {
            if (this._vbSize) size = 1;
            delete this._vbSize;
            vb = `0 0 ${this.width}${S}${this.height}`;
        } else {
            this._vbSize = size;
            vb = x + S + y + S + w + S + h;
        }
        $(this.canvas, {
            viewBox: vb,
            preserveAspectRatio: aspectRatio
        });
        while(size && top){
            sw = 'stroke-width' in top.attrs ? top.attrs['stroke-width'] : 1;
            top.attr({
                'stroke-width': sw
            });
            top._.dirty = 1;
            top._.dirtyT = 1;
            top = top.prev;
        }
        this._viewBox = [
            x,
            y,
            w,
            h,
            !!fit
        ];
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
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.prototype.renderfix = function() {
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
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.prototype.clear = function() {
        $b7c3e249c8a42d1b$export$db202ddc8be9136.eve('raphael.clear', this);
        const c = this.canvas;
        while(c.firstChild)c.removeChild(c.firstChild);
        this.bottom = this.top = null;
        c.appendChild(this.defs = $('defs'));
    };
    /* \
   * Paper.remove
   [ method ]
   **
   * Removes the paper from the DOM.
  \ */ $b7c3e249c8a42d1b$export$db202ddc8be9136.prototype.remove = function() {
        $f74a27260bed6e25$export$6b962911844bfb1e('raphael.remove', this);
        this.canvas.parentNode && this.canvas.parentNode.removeChild(this.canvas);
        for(const i in this)this[i] = typeof this[i] === 'function' ? $b7c3e249c8a42d1b$export$db202ddc8be9136._removedFactory(i) : null;
    };
    const setproto = $b7c3e249c8a42d1b$export$db202ddc8be9136.st;
    for(const method in elproto)if (elproto[has](method) && !setproto[has](method)) setproto[method] = (function(methodname) {
        return function() {
            const arg = arguments;
            return this.forEach((el)=>{
                el[methodname].apply(el, arg);
            });
        };
    })(method);
    return $b7c3e249c8a42d1b$export$db202ddc8be9136;
}();


class $c09005a36c8880c7$export$2e2bcd8739ae039 {
    static easing = {
        elastic (pos) {
            return -1 * 4 ** (-8 * pos) * Math.sin((pos * 6 - 1) * (2 * Math.PI) / 2) + 1;
        },
        swingFromTo (pos) {
            let s = 1.70158;
            return (pos /= 0.5) < 1 ? 0.5 * (pos * pos * (((s *= 1.525) + 1) * pos - s)) : 0.5 * ((pos -= 2) * pos * (((s *= 1.525) + 1) * pos + s) + 2);
        },
        swingFrom (pos) {
            const s = 1.70158;
            return pos * pos * ((s + 1) * pos - s);
        },
        swingTo (pos) {
            const s = 1.70158;
            return (pos -= 1) * pos * ((s + 1) * pos + s) + 1;
        },
        bounce (pos) {
            if (pos < 1 / 2.75) return 7.5625 * pos * pos;
            if (pos < 2 / 2.75) return 7.5625 * (pos -= 1.5 / 2.75) * pos + 0.75;
            if (pos < 2.5 / 2.75) return 7.5625 * (pos -= 2.25 / 2.75) * pos + 0.9375;
            return 7.5625 * (pos -= 2.625 / 2.75) * pos + 0.984375;
        },
        bouncePast (pos) {
            if (pos < 1 / 2.75) return 7.5625 * pos * pos;
            if (pos < 2 / 2.75) return 2 - (7.5625 * (pos -= 1.5 / 2.75) * pos + 0.75);
            if (pos < 2.5 / 2.75) return 2 - (7.5625 * (pos -= 2.25 / 2.75) * pos + 0.9375);
            return 2 - (7.5625 * (pos -= 2.625 / 2.75) * pos + 0.984375);
        },
        easeFromTo (pos) {
            if ((pos /= 0.5) < 1) return 0.5 * pos ** 4;
            return -0.5 * ((pos -= 2) * pos ** 3 - 2);
        },
        easeFrom (pos) {
            return pos ** 4;
        },
        easeTo (pos) {
            return pos ** 0.25;
        },
        none (pos) {
            return -Math.cos(pos * Math.PI) / 2 + 0.5;
        }
    };
    static availColors = [
        {
            hex: '000000',
            to: '575757',
            fore: 'fff'
        },
        {
            hex: 'FFFFFF',
            to: 'd9d9d9',
            fore: '000'
        },
        {
            hex: 'FF0000',
            to: 'a31616',
            fore: '000'
        },
        {
            hex: 'C3FF68',
            to: 'afff68',
            fore: '000'
        },
        {
            hex: '0B486B',
            to: '3B88B5',
            fore: 'fff'
        },
        {
            hex: 'FBB829',
            to: 'cd900e',
            fore: '000'
        },
        {
            hex: 'BFF202',
            to: 'D1F940',
            fore: '000'
        },
        {
            hex: 'FF0066',
            to: 'aa1d55',
            fore: '000'
        },
        {
            hex: '800F25',
            to: '3d0812',
            fore: 'fff'
        },
        {
            hex: 'A40802',
            to: 'd70b03',
            fore: 'fff'
        },
        {
            hex: 'FF5EAA',
            to: 'cf5d93',
            fore: '000'
        },
        {
            hex: '740062',
            to: 'D962C6',
            fore: 'fff'
        },
        {
            hex: 'FF4242',
            to: 'A61515',
            fore: 'fff'
        },
        {
            hex: 'D15C57',
            to: '9D5C58',
            fore: '000'
        },
        {
            hex: 'FCFBE3',
            to: 'c9c56f',
            fore: '000'
        },
        {
            hex: 'FF9900',
            to: 'c98826',
            fore: '000'
        },
        {
            hex: '369001',
            to: '9CEE6C',
            fore: '000'
        },
        {
            hex: '9E906E',
            to: '675324',
            fore: 'fff'
        },
        {
            hex: 'F3D915',
            to: 'F9EA7C',
            fore: '000'
        },
        {
            hex: '031634',
            to: '2D579A',
            fore: 'fff'
        },
        {
            hex: '556270',
            to: '7b92ab',
            fore: 'fff'
        },
        {
            hex: '1693A5',
            to: '23aad6',
            fore: 'fff'
        },
        {
            hex: 'ADD8C7',
            to: '59a989',
            fore: '000'
        },
        {
            special: {
                // line options display only colors; node menu displays colors and transparent button
                color: {
                    hex: '8D5800',
                    to: 'EB9605'
                },
                other: {
                    transparent: true
                }
            }
        }, 
    ];
    static polygonCache = {
    };
    static async pause(millis) {
        return new Promise((resolve)=>{
            window.setTimeout(()=>{
                resolve();
            }, millis);
        });
    }
    static windowSize() {
        let w = 0;
        let h = 0;
        // IE
        if (!window.innerWidth) {
            // strict mode
            if (!(document.documentElement.clientWidth == 0)) {
                w = document.documentElement.clientWidth;
                h = document.documentElement.clientHeight;
            } else {
                w = document.body.clientWidth;
                h = document.body.clientHeight;
            }
        } else {
            w = window.innerWidth;
            h = window.innerHeight;
        }
        return {
            width: w,
            height: h
        };
    }
    static isElement(o) {
        return typeof HTMLElement === 'object' ? o instanceof HTMLElement // DOM2
         : typeof o === 'object' && o.nodeType === 1 && typeof o.nodeName === 'string';
    }
    // convenience
    static el(id) {
        if (id.indexOf('#') > -1 || id.indexOf('.') > -1) return document.querySelector(id);
        return document.getElementById(id);
    }
    // let arr = select("elem.className");
    static select(query) {
        const els = [];
        const index = query.indexOf('.');
        if (index !== -1) {
            const tag = query.slice(0, index) || '*';
            const klass = query.slice(index + 1, query.length);
            const all = document.getElementsByTagName(tag);
            for(let d = 0; d < all.length; d += 1){
                const elem = all[d];
                if (elem.className && elem.className.indexOf(klass) !== -1) els.push(elem);
            }
        }
        return els;
    }
    static getKey(e) {
        let keyCode = 0;
        try {
            keyCode = e.keyCode;
        } catch (Err) {
            keyCode = e.which;
        }
        return keyCode;
    }
    // fix event inconsistencies across browsers
    static stopEvent(e) {
        e = e || window.event;
        if (e.preventDefault) {
            e.stopPropagation();
            e.preventDefault();
        } else {
            e.returnValue = false;
            e.cancelBubble = true;
        }
        return false;
    }
    static toShortDateString(jsonDate) {
        let date = jsonDate;
        try {
            const d = new Date(parseInt(jsonDate.substr(6), 10));
            date = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
        } catch (Err) {
        }
        return date;
    }
    static addEvent(obj, type, fn) {
        obj.addEventListener(type, fn);
    }
    static removeEvent(obj, type, fn) {
        obj.removeEventListener(type, fn);
    }
    // push an event listener into existing array of listeners
    static bind(to, evt, fn) {
        to[evt] = to[evt] || [];
        to[evt].push(fn);
    }
    static imageExists(u, cb, id) {
        const iid = `temp_${$c09005a36c8880c7$export$2e2bcd8739ae039.guid()}`;
        const img = document.body.appendChild(document.createElement('img'));
        img.style.position = 'absolute';
        img.style.top = '-10000px';
        img.style.left = '-10000px';
        img.setAttribute('src', u);
        img.setAttribute('id', iid);
        this.addEvent(img, 'load', function(e) {
            const d = getDimensions(img);
            document.body.removeChild(img);
            cb.apply(this, [
                true,
                d.width,
                d.height,
                id
            ]);
        });
        this.addEvent(img, 'error', function(e) {
            document.body.removeChild(img);
            cb.apply(this, [
                false,
                0,
                0,
                id
            ]);
        });
    }
    static ajax(u, f, d, v, x, h) {
        x = this.ActiveXObject;
        // the guid is essential to break the cache because ie8< seems to want to cache this. argh.
        u = [
            u,
            u.indexOf('?') === -1 ? '?' : '&',
            `guid=${$c09005a36c8880c7$export$2e2bcd8739ae039.guid()}`
        ].join('');
        x = new (x || XMLHttpRequest)('Microsoft.XMLHTTP');
        const vx = d ? v || 'POST' : v || 'GET';
        x.open(vx, u, 1);
        x.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        h.forEach((hElem)=>{
            x.setRequestHeader(hElem.n, hElem.v);
        });
        x.onreadystatechange = ()=>{
            // eslint-disable-next-line no-unused-expressions
            x.readyState > 3 && f && f(x.responseText, x);
        };
        x.send(d);
    }
    static randomInt(min, max) {
        return Math.floor(min + Math.random() * (max - min + 1));
    }
    static hasClass(el, className) {
        if (el.classList) el.classList.contains(className);
        else new RegExp(`(^| )${className}( |$)`, 'gi').test(el.className);
    }
    static addClass(el, className) {
        if (el.classList) el.classList.add(className);
        else el.className += ` ${className}`;
    }
    static S4() {
        // eslint-disable-next-line no-bitwise
        return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
    }
    static guid(len) {
        let g = this.S4() + this.S4() + this.S4();
        if (len) g = g.replace(/-/gi, '').substring(0, len).toUpperCase();
        return g;
    }
    static getJSON(url, callback) {
        const id = this.S4() + this.S4();
        let script = document.createElement('script');
        const token = `__jsonp${id}`;
        // callback should be a global function
        window[token] = callback;
        // url should have "?" parameter which is to be replaced with a global callback name
        script.src = url.replace(/\?(&|$)/, `__jsonp${id}$1`);
        // clean up on load: remove script tag, null script variable and delete global callback function
        script.onload = ()=>{
            script = null;
        };
        document.getElementsByTagName('head')[0].appendChild(script);
    }
    static getBBox(opts) {
        const cont = document.createElement('div');
        cont.setAttribute('id', 'hiddenPaper');
        cont.style.display = 'none';
        document.body.appendChild(cont);
        const pp = new $db87f2586597736c$export$508faed300ccdfb(cont);
        const bb = pp.path(opts.path).getBBox();
        document.body.removeChild(cont);
        return bb;
    }
    static positionedOffset(obj) {
        let curleft = 0;
        let curtop = 0;
        if (obj.offsetParent) do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        // eslint-disable-next-line no-cond-assign
        }while (obj = obj.offsetParent)
        return {
            left: curleft,
            top: curtop
        };
    }
    static getDimensions(ele) {
        let width = 0;
        let height = 0;
        if (typeof ele.clip !== 'undefined') {
            width = ele.clip.width;
            height = ele.clip.height;
        } else if (ele.style?.pixelWidth) {
            width = ele.style.pixelWidth;
            height = ele.style.pixelHeight;
        } else {
            width = ele.offsetWidth;
            height = ele.offsetHeight;
        }
        return {
            width: width,
            height: height
        };
    }
    static mousePos(e) {
        let mouseX = null;
        let mouseY = null;
        const allTouches = [];
        if (e.targetTouches) {
            if (e.targetTouches.length) {
                const t = e.targetTouches[0];
                mouseX = t.clientX;
                mouseY = t.clientY;
                e.targetTouches.forEach((tx)=>{
                    allTouches.push({
                        x: e.targetTouches[tx].clientX,
                        y: e.targetTouches[tx].clientY
                    });
                });
            }
        } else {
            mouseX = e.pageX;
            mouseY = e.pageY;
        }
        return {
            x: mouseX,
            y: mouseY,
            allTouches: allTouches
        };
    }
    static centerAndScalePathToFitContainer(opts) {
        // scale and transform the path to fit the box...
        // first get the bbox of the untouched path
        let bb = this.getBBox({
            path: opts.path
        });
        // calculate the scale of the path
        const scale = opts.scaleSize / Math.max(bb.width, bb.height);
        // scale the untouched path
        let newPath = this._transformPath(opts.path, [
            's',
            scale,
            ',',
            scale
        ].join(''));
        // go get the bbox of the scaled path
        bb = this.getBBox({
            path: newPath
        });
        // finally, move the scaled vector to the centered x,y coords
        // of the enclosed box
        const tp = [
            'T',
            bb.x * -1 + (opts.containerSize - bb.width) / 2,
            ',',
            bb.y * -1 + (opts.containerSize - bb.height) / 2, 
        ].join('');
        newPath = this._transformPath(newPath, tp);
        return {
            path: newPath,
            width: bb.width,
            height: bb.height
        };
    }
    static buildStyle(_styles) {
        let _str = '';
        Object.keys(_styles).forEach((k)=>{
            _str += `${k}:${_styles[k]};`;
        });
        return _str;
    }
    static getRGBComponents(bgColor) {
        const r = bgColor.substring(1, 3);
        const g = bgColor.substring(3, 5);
        const b = bgColor.substring(5, 7);
        return {
            R: parseInt(r, 16),
            G: parseInt(g, 16),
            B: parseInt(b, 16)
        };
    }
    static whiteOrBlack(hex) {
        function getRGB(c) {
            return parseInt(c, 16) || c;
        }
        function getsRGB(c) {
            return getRGB(c) / 255 <= 0.03928 ? getRGB(c) / 255 / 12.92 : Math.pow((getRGB(c) / 255 + 0.055) / 1.055, 2.4);
        }
        function getLuminance(hexColor) {
            return 0.2126 * getsRGB(hexColor.substr(1, 2)) + 0.7152 * getsRGB(hexColor.substr(3, 2)) + 0.0722 * getsRGB(hexColor.substr(-2));
        }
        function getContrast(f, b) {
            const L1 = getLuminance(f);
            const L2 = getLuminance(b);
            return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
        }
        const whiteContrast = getContrast(hex || '#fff', '#ffffff');
        const blackContrast = getContrast(hex || '#fff', '#000000');
        return whiteContrast > blackContrast ? '#ffffff' : '#000000';
    }
    static _transformPath(original, transform) {
        const rpath = $db87f2586597736c$export$508faed300ccdfb.transformPath(original, transform).toString();
        return rpath;
    }
    static transformPath(_node, _transformation) {
        const _path = $db87f2586597736c$export$508faed300ccdfb.transformPath(_node.vect.attr('path').toString(), _transformation).toString();
        _node.options.vectorPath = _path;
        _node.vect.transform('');
        _node.vect.attr({
            path: _node.options.vectorPath
        });
        const bb = _node.vect.getBBox();
        const rotationContext = {
            point: {
                x: bb.cx,
                y: bb.cy
            }
        };
        Object.assign(_node.options.rotate, rotationContext);
        const transformString = _node.getTransformString();
        _node.vect.transform(transformString);
        _node.text.transform('');
        // xPos and yPos are updated in the setPosition in Slatebox.node.js
        _node.text.attr(_node.textCoords({
            x: _node.options.xPos,
            y: _node.options.yPos
        }));
        _node.text.transform(transformString);
    }
    static htmlToElement(html) {
        const template = document.createElement('template');
        html = html.trim();
        template.innerHTML = html;
        return template.content.firstChild;
    }
    // https://stackoverflow.com/questions/118241/calculate-text-width-with-javascript
    static getTextWidth(text, font) {
        const splitText = text.split('\n');
        const textWidthCanvas = document.createElement('canvas');
        const metrics = [];
        splitText.forEach((t)=>{
            // textWidthCanvas.setAttribute('id', `measuretext`)
            const context = textWidthCanvas.getContext('2d');
            context.font = font;
            metrics.push(context.measureText(t));
        });
        textWidthCanvas.remove();
        let height = 0;
        metrics.forEach((m)=>height += m.fontBoundingBoxAscent + m.fontBoundingBoxDescent
        );
        const red = {
            width: Math.max(...metrics.map((m)=>m.width
            )),
            height: height
        };
        return red;
    }
    static chunk(arr, chunkSize = 1, cache = []) {
        const tmp = [
            ...arr
        ];
        if (chunkSize <= 0) return cache;
        while(tmp.length)cache.push(tmp.splice(0, chunkSize));
        return cache;
    }
    static createMultiLineText(text, lineCount) {
        const words = text.split(/ /g);
        const chars = text.split('');
        const charsPerLine = chars.length / lineCount;
        const lines = [];
        let wordsOnLine = [];
        let curCharCount = 0;
        // console.log(
        //   'words are 1',
        //   words.length,
        //   chars.length,
        //   charsPerLine,
        //   lines.length,
        //   lineCount,
        //   curCharCount
        // )
        words.forEach((w)=>{
            curCharCount += w.length;
            // console.log(
            //   'words are 2',
            //   words.length,
            //   chars.length,
            //   charsPerLine,
            //   lines.length,
            //   lineCount,
            //   curCharCount
            // )
            if (curCharCount < charsPerLine || lines.length === lineCount - 1) wordsOnLine.push(w);
            else {
                lines.push(wordsOnLine.join(' '));
                curCharCount = w.length;
                wordsOnLine = [
                    w
                ];
            }
        });
        if (wordsOnLine.length > 0) lines.push(wordsOnLine.join(' '));
        return lines.join('\n');
    }
    static toDataUrl = (url)=>fetch(url, {
            mode: 'cors'
        }).then((response)=>response.blob()
        ).then((blob)=>new Promise((resolve, reject)=>{
                const reader = new FileReader();
                reader.onloadend = ()=>resolve(reader.result)
                ;
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            })
        )
    ;
}



function $d2703cad5fa90838$export$2e2bcd8739ae039(originalPath, transforms) {
    let transformsArray = transforms;
    let transformedPath = originalPath;
    if (!transforms.find && typeof transforms === 'string') transformsArray = [
        transforms
    ];
    // NOTE: it's safer to apply transforms one by one because this transform string `T${_x * percent}, ${_y * percent}, s${_width/150 * percent}, ${_height/100 * percent}, ${_x}, ${_y}`
    //      would be applied incorrectly - element would be translated using the center of scaling ${_x}, ${_y} which seems to be a bug in raphael.js
    transformsArray.forEach((transform)=>{
        transformedPath = $c09005a36c8880c7$export$2e2bcd8739ae039._transformPath(transformedPath, transform).toString();
    });
    return transformedPath;
}




class $2197852bc26081e6$export$2e2bcd8739ae039 {
    static icons = {
        handle: 'M26.33,15.836l-3.893-1.545l3.136-7.9c0.28-0.705-0.064-1.505-0.771-1.785c-0.707-0.28-1.506,0.065-1.785,0.771l-3.136,7.9l-4.88-1.937l3.135-7.9c0.281-0.706-0.064-1.506-0.77-1.786c-0.706-0.279-1.506,0.065-1.785,0.771l-3.136,7.9L8.554,8.781l-1.614,4.066l2.15,0.854l-2.537,6.391c-0.61,1.54,0.143,3.283,1.683,3.895l1.626,0.646L8.985,26.84c-0.407,1.025,0.095,2.188,1.122,2.596l0.93,0.369c1.026,0.408,2.188-0.095,2.596-1.121l0.877-2.207l1.858,0.737c1.54,0.611,3.284-0.142,3.896-1.682l2.535-6.391l1.918,0.761L26.33,15.836z',
        editor: 'M25.31,2.872l-3.384-2.127c-0.854-0.536-1.979-0.278-2.517,0.576l-1.334,2.123l6.474,4.066l1.335-2.122C26.42,4.533,26.164,3.407,25.31,2.872zM6.555,21.786l6.474,4.066L23.581,9.054l-6.477-4.067L6.555,21.786zM5.566,26.952l-0.143,3.819l3.379-1.787l3.14-1.658l-6.246-3.925L5.566,26.952z',
        deleter: 'M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z',
        searcher: 'M29.772,26.433l-7.126-7.126c0.96-1.583,1.523-3.435,1.524-5.421C24.169,8.093,19.478,3.401,13.688,3.399C7.897,3.401,3.204,8.093,3.204,13.885c0,5.789,4.693,10.481,10.484,10.481c1.987,0,3.839-0.563,5.422-1.523l7.128,7.127L29.772,26.433zM7.203,13.885c0.006-3.582,2.903-6.478,6.484-6.486c3.579,0.008,6.478,2.904,6.484,6.486c-0.007,3.58-2.905,6.476-6.484,6.484C10.106,20.361,7.209,17.465,7.203,13.885z',
        up: 'M1.67892,15.48059l23.55337,0l-11.37616,-13.92457l-12.17721,13.92457z',
        arrow: 'M16,1.466C7.973,1.466,1.466,7.973,1.466,16c0,8.027,6.507,14.534,14.534,14.534c8.027,0,14.534-6.507,14.534-14.534C30.534,7.973,24.027,1.466,16,1.466zM13.665,25.725l-3.536-3.539l6.187-6.187l-6.187-6.187l3.536-3.536l9.724,9.723L13.665,25.725z',
        settings: 'M16.015,12.03c-2.156,0-3.903,1.747-3.903,3.903c0,2.155,1.747,3.903,3.903,3.903c0.494,0,0.962-0.102,1.397-0.27l0.836,1.285l1.359-0.885l-0.831-1.276c0.705-0.706,1.142-1.681,1.142-2.757C19.918,13.777,18.171,12.03,16.015,12.03zM16,1.466C7.973,1.466,1.466,7.973,1.466,16c0,8.027,6.507,14.534,14.534,14.534c8.027,0,14.534-6.507,14.534-14.534C30.534,7.973,24.027,1.466,16,1.466zM26.174,20.809c-0.241,0.504-0.513,0.99-0.826,1.45L22.19,21.58c-0.481,0.526-1.029,0.994-1.634,1.385l0.119,3.202c-0.507,0.23-1.028,0.421-1.569,0.57l-1.955-2.514c-0.372,0.051-0.75,0.086-1.136,0.086c-0.356,0-0.706-0.029-1.051-0.074l-1.945,2.5c-0.541-0.151-1.065-0.342-1.57-0.569l0.117-3.146c-0.634-0.398-1.208-0.88-1.712-1.427L6.78,22.251c-0.313-0.456-0.583-0.944-0.826-1.448l2.088-2.309c-0.226-0.703-0.354-1.451-0.385-2.223l-2.768-1.464c0.055-0.563,0.165-1.107,0.301-1.643l3.084-0.427c0.29-0.702,0.675-1.352,1.135-1.942L8.227,7.894c0.399-0.389,0.83-0.744,1.283-1.07l2.663,1.672c0.65-0.337,1.349-0.593,2.085-0.75l0.968-3.001c0.278-0.021,0.555-0.042,0.837-0.042c0.282,0,0.56,0.022,0.837,0.042l0.976,3.028c0.72,0.163,1.401,0.416,2.036,0.75l2.704-1.697c0.455,0.326,0.887,0.681,1.285,1.07l-1.216,2.986c0.428,0.564,0.793,1.181,1.068,1.845l3.185,0.441c0.135,0.535,0.247,1.081,0.302,1.643l-2.867,1.516c-0.034,0.726-0.15,1.43-0.355,2.1L26.174,20.809z',
        sliderHandle: 'M16,3.5c-4.142,0-7.5,3.358-7.5,7.5c0,4.143,7.5,18.121,7.5,18.121S23.5,15.143,23.5,11C23.5,6.858,20.143,3.5,16,3.5z M16,14.584z',
        speechbubble: 'M16,5.333c-7.732,0-14,4.701-14,10.5c0,1.982,0.741,3.833,2.016,5.414L2,25.667l5.613-1.441c2.339,1.317,5.237,2.107,8.387,2.107c7.732,0,14-4.701,14-10.5C30,10.034,23.732,5.333,16,5.333z',
        link: 'M15.667,4.601c-1.684,1.685-2.34,3.985-2.025,6.173l3.122-3.122c0.004-0.005,0.014-0.008,0.016-0.012c0.21-0.403,0.464-0.789,0.802-1.126c1.774-1.776,4.651-1.775,6.428,0c1.775,1.773,1.777,4.652,0.002,6.429c-0.34,0.34-0.727,0.593-1.131,0.804c-0.004,0.002-0.006,0.006-0.01,0.01l-3.123,3.123c2.188,0.316,4.492-0.34,6.176-2.023c2.832-2.832,2.83-7.423,0-10.255C23.09,1.77,18.499,1.77,15.667,4.601zM14.557,22.067c-0.209,0.405-0.462,0.791-0.801,1.131c-1.775,1.774-4.656,1.774-6.431,0c-1.775-1.774-1.775-4.653,0-6.43c0.339-0.338,0.725-0.591,1.128-0.8c0.004-0.006,0.005-0.012,0.011-0.016l3.121-3.123c-2.187-0.316-4.489,0.342-6.172,2.024c-2.831,2.831-2.83,7.423,0,10.255c2.833,2.831,7.424,2.831,10.257,0c1.684-1.684,2.342-3.986,2.023-6.175l-3.125,3.123C14.565,22.063,14.561,22.065,14.557,22.067zM9.441,18.885l2.197,2.197c0.537,0.537,1.417,0.537,1.953,0l8.302-8.302c0.539-0.536,0.539-1.417,0.002-1.952l-2.199-2.197c-0.536-0.539-1.416-0.539-1.952-0.002l-8.302,8.303C8.904,17.469,8.904,18.349,9.441,18.885z',
        copy: 'M 20.48 7.28 H 9.92 c -0.968 0 -1.76 0.792 -1.76 1.76 v 12.32 h 1.76 V 9.04 h 10.56 V 7.28 z m 2.64 3.52 H 13.44 c -0.968 0 -1.76 0.792 -1.76 1.76 v 12.32 c 0 0.968 0.792 1.76 1.76 1.76 h 9.68 c 0.968 0 1.76 -0.792 1.76 -1.76 V 12.56 c 0 -0.968 -0.792 -1.76 -1.76 -1.76 z m 0 14.08 H 13.44 V 12.56 h 9.68 v 12.32 z',
        plus: 'M25.979,12.896 19.312,12.896 19.312,6.229 12.647,6.229 12.647,12.896 5.979,12.896 5.979,19.562 12.647,19.562 12.647,26.229 19.312,26.229 19.312,19.562 25.979,19.562z',
        minus: 'M25.979,12.896,5.979,12.896,5.979,19.562,25.979,19.562z',
        arrowHead: 'M15.834,29.084 15.834,16.166 2.917,16.166 29.083,2.917z',
        undo: 'M12.981,9.073V6.817l-12.106,6.99l12.106,6.99v-2.422c3.285-0.002,9.052,0.28,9.052,2.269c0,2.78-6.023,4.263-6.023,4.263v2.132c0,0,13.53,0.463,13.53-9.823C29.54,9.134,17.952,8.831,12.981,9.073z',
        lockClosed: 'M24.875,15.334v-4.876c0-4.894-3.981-8.875-8.875-8.875s-8.875,3.981-8.875,8.875v4.876H5.042v15.083h21.916V15.334H24.875zM10.625,10.458c0-2.964,2.411-5.375,5.375-5.375s5.375,2.411,5.375,5.375v4.876h-10.75V10.458zM18.272,26.956h-4.545l1.222-3.667c-0.782-0.389-1.324-1.188-1.324-2.119c0-1.312,1.063-2.375,2.375-2.375s2.375,1.062,2.375,2.375c0,0.932-0.542,1.73-1.324,2.119L18.272,26.956z',
        lockOpen: 'M24.875,15.334v-4.876c0-4.894-3.981-8.875-8.875-8.875s-8.875,3.981-8.875,8.875v0.375h3.5v-0.375c0-2.964,2.411-5.375,5.375-5.375s5.375,2.411,5.375,5.375v4.876H5.042v15.083h21.916V15.334H24.875zM18.272,26.956h-4.545l1.222-3.667c-0.782-0.389-1.324-1.188-1.324-2.119c0-1.312,1.063-2.375,2.375-2.375s2.375,1.062,2.375,2.375c0,0.932-0.542,1.73-1.324,2.119L18.272,26.956z',
        download: 'M62.498910964222794,5C30.742627701282224,5,5,30.744805772836607,5,62.498910964222794C5,94.25519422716337,30.744805772836607,120,62.498910964222794,120C94.25519422716337,120,120,94.2551942271634,120,62.49891096422281C120,30.742627701282238,94.2551942271634,5.000000000000014,62.49891096422281,5.000000000000014C62.49891096422281,5.000000000000014,62.498910964222794,5,62.498910964222794,5M62.50108903577718,90.76374552548342C62.50108903577718,90.76374552548342,43.81105702759522,62.498910964222794,43.81105702759522,62.498910964222794C43.81105702759522,62.498910964222794,51.6085531922953,62.498910964222794,51.6085531922953,62.498910964222794C51.6085531922953,62.498910964222794,51.6085531922953,36.362052311596806,51.6085531922953,36.362052311596806C51.6085531922953,36.362052311596806,71.21119718176479,36.362052311596806,71.21119718176479,36.362052311596806C71.21119718176479,36.362052311596806,71.21119718176479,62.498910964222794,71.21119718176479,62.498910964222794C71.21119718176479,62.498910964222794,81.18676490085039,62.498910964222794,81.18676490085039,62.498910964222794C81.18676490085039,62.498910964222794,62.50108903577718,90.76374552548342,62.50108903577718,90.76374552548342C62.50108903577718,90.76374552548342,62.50108903577718,90.76374552548342,62.50108903577718,90.76374552548342',
        embed: 'M62.49999999999999,5C30.759999999999998,5,5,30.759999999999998,5,62.49999999999999C5,94.23999999999998,30.759999999999998,120,62.49999999999999,120C94.23999999999998,120,120,94.23999999999998,120,62.49999999999999C120,30.760000000000005,94.23999999999998,5,62.49999999999999,5C62.49999999999999,5,62.49999999999999,5,62.49999999999999,5M46.285,74.57499999999999C47.894999999999996,76.41499999999999,47.665,79.28999999999999,45.824999999999996,80.9C43.98499999999999,82.51000000000002,41.10999999999999,82.28,39.5,80.44C39.5,80.44,26.505,65.375,26.505,65.375C25.009999999999998,63.65,25.009999999999998,61.23499999999999,26.505,59.50999999999999C26.505,59.50999999999999,39.385,44.44499999999999,39.385,44.44499999999999C40.19,43.41,41.455,42.834999999999994,42.834999999999994,42.834999999999994C43.86999999999999,42.834999999999994,44.904999999999994,43.17999999999999,45.709999999999994,43.86999999999999C46.62999999999999,44.675,47.20499999999999,45.709999999999994,47.20499999999999,46.974999999999994C47.31999999999999,48.125,46.85999999999999,49.275,46.169999999999995,50.19499999999999C46.169999999999995,50.19499999999999,35.81999999999999,62.49999999999999,35.81999999999999,62.49999999999999C35.81999999999999,62.49999999999999,46.285,74.57499999999999,46.285,74.57499999999999C46.285,74.57499999999999,46.285,74.57499999999999,46.285,74.57499999999999M73.08,49.275C73.08,49.275,60.199999999999996,79.28999999999999,60.199999999999996,79.28999999999999C59.28,81.475,56.519999999999996,82.625,54.334999999999994,81.59C53.184999999999995,81.13,52.37999999999999,80.20999999999998,51.919999999999995,79.17500000000001C51.459999999999994,78.025,51.459999999999994,76.875,51.919999999999995,75.725C51.919999999999995,75.725,64.8,45.709999999999994,64.8,45.709999999999994C65.49,44.099999999999994,67.1,42.949999999999996,68.94,42.949999999999996C69.515,42.949999999999996,70.09,43.065,70.66499999999999,43.294999999999995C71.815,43.754999999999995,72.62,44.675,73.08,45.709999999999994C73.53999999999999,46.974999999999994,73.53999999999999,48.125,73.08,49.275C73.08,49.275,73.08,49.275,73.08,49.275M98.495,65.375C98.495,65.375,85.61499999999998,80.44,85.61499999999998,80.44C84.005,82.28,81.13,82.50999999999999,79.28999999999999,80.9C77.44999999999999,79.29000000000002,77.22,76.41499999999999,78.82999999999998,74.57499999999999C78.82999999999998,74.57499999999999,89.17999999999998,62.49999999999999,89.17999999999998,62.49999999999999C89.17999999999998,62.49999999999999,78.715,50.425,78.715,50.425C77.91,49.505,77.565,48.355,77.68,47.205C77.79499999999999,46.055,78.37,44.905,79.17500000000001,44.099999999999994C79.98000000000002,43.41,81.01499999999999,43.065,82.05000000000001,43.065C83.315,43.065,84.58000000000001,43.64,85.5,44.675C85.5,44.675,98.495,59.739999999999995,98.495,59.739999999999995C99.98999999999998,61.23499999999999,99.98999999999998,63.765,98.495,65.375C98.495,65.375,98.495,65.375,98.495,65.375',
        trash: 'M 13.56 8.28 h 5.28 v -1.54 c 0 -0.0581 -0.0229 -0.1144 -0.0642 -0.1558 c -0.0414 -0.0414 -0.0977 -0.0642 -0.1558 -0.0642 h -4.84 c -0.0581 0 -0.1144 0.0229 -0.1558 0.0642 c -0.0414 0.0414 -0.0642 0.0977 -0.0642 0.1558 v 1.54 z m 9.68 0.88 h -14.08 v 15.84 c 0 0.4858 0.3942 0.88 0.88 0.88 h 12.32 c 0.4858 0 0.88 -0.3942 0.88 -0.88 v -15.84 z m -8.8 3.08 c 0 -0.2429 -0.1971 -0.44 -0.44 -0.44 s -0.44 0.1971 -0.44 0.44 v 10.56 c 0 0.2429 0.1971 0.44 0.44 0.44 s 0.44 -0.1971 0.44 -0.44 v -10.56 z m 4.4 0 c 0 -0.2429 -0.1971 -0.44 -0.44 -0.44 s -0.44 0.1971 -0.44 0.44 v 10.56 c 0 0.2429 0.1971 0.44 0.44 0.44 s 0.44 -0.1971 0.44 -0.44 v -10.56 z m 7.04 -3.96 v 0.88 h -1.76 v 15.84 c 0 0.9724 -0.7876 1.76 -1.76 1.76 h -12.32 c -0.9724 0 -1.76 -0.7876 -1.76 -1.76 v -15.84 h -1.76 v -0.88 h 6.16 v -1.76 c 0 -0.4858 0.3942 -0.88 0.88 -0.88 h 5.28 c 0.4858 0 0.88 0.3942 0.88 0.88 v 1.76 h 6.16 z',
        resize: 'M24 10.999v-10.999h-11l3.379 3.379-13.001 13-3.378-3.378v10.999h11l-3.379-3.379 13.001-13z'
    };
}




const $c77049a435fdbedd$export$4ff7fc6f1af248b5 = function(R) {
    const c = 'M16,1.466C7.973,1.466,1.466,7.973,1.466,16c0,8.027,6.507,14.534,14.534,14.534c8.027,0,14.534-6.507,14.534-14.534C30.534,7.973,24.027,1.466,16,1.466z';
    const { icons: icons  } = $2197852bc26081e6$export$2e2bcd8739ae039;
    R.fn.handle = function(x, y) {
        return this.path(icons.handle + c);
    };
    R.fn.editor = function(x, y) {
        return this.path(icons.editor + c);
    };
    R.fn.deleter = function(x, y) {
        return this.path(icons.deleter + c);
    };
    R.fn.trash = function() {
        return this.path(icons.trash + c).attr({
            fill: '#000'
        });
    };
    R.fn.searcher = function(x, y) {
        return this.path(icons.searcher + c);
    };
    R.fn.plus = function(x, y) {
        return this.path(icons.plus + c);
    };
    R.fn.merge = function(x, y) {
        return this.path(icons.plus + c);
    };
    R.fn.copy = function(x, y) {
        return this.path(icons.copy + c);
    };
    R.fn.minus = function(x, y) {
        return this.path(icons.minus + c);
    };
    R.fn.link = function(x, y) {
        return this.path(icons.link + c);
    };
    R.fn.up = function(x, y) {
        return this.path(icons.up);
    };
    R.fn.down = function(x, y) {
        return this.path(icons.up).transform('r180');
    };
    R.fn.setting = function(x, y) {
        return this.path(icons.settings + c).transform('s,.9,.9');
    };
    R.fn.arrow = function() {
        return this.path(icons.arrow + c);
    };
    R.fn.arrowHead = function() {
        return this.path(icons.arrowHead).attr({
            fill: '#648CB2'
        }).transform('s0.7');
    };
    R.fn.linkArrow = function() {
        return this.path(icons.arrow + c).attr({
            fill: '#648CB2'
        });
    };
    R.fn.lockClosed = function() {
        return this.path(icons.lockClosed);
    };
    R.fn.lockOpen = function() {
        return this.path(icons.lockOpen);
    };
    R.fn.speechbubble = function(x, y, txt) {
        const _bubble = this.set();
        _bubble.push(this.path(icons.speechbubble).transform([
            't',
            x,
            ',',
            y
        ].join()).scale(6, 4).scale(-1, 1)).attr({
            fill: '#fff',
            stroke: '#000',
            'stroke-width': 3
        });
        _bubble.push(this.text(x + 10, y + 10, txt).attr({
            'font-size': 12
        }));
        return _bubble;
    };
    R.fn.undo = function(path) {
        return this.path(icons.undo);
    };
    R.fn.redo = function(path) {
        return this.path(icons.undo).transform('s-1,1');
    };
    R.fn.resize = function() {
        return this.path(`M24 10.999v-10.999h-11l3.379 3.379-13.001 13-3.378-3.378v10.999h11l-3.379-3.379 13.001-13z`);
    };
    R.fn.resizeLines = function() {
        return this.image('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAXCAYAAAAP6L+eAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAEBJREFUeNpiYKAuYAPijUD8n1aGVowaOmoo/QyNpYWh+UB8g1aGSowaOmroqKEEAE0MZaCVoQxEFH3e5BgKEGAAnnVBs4ro6nUAAAAASUVORK5CYII=', 0, 0, 22, 23);
    };
};


const $594678bd339ae115$export$cc3e2d3244e01b7f = function(R) {
    R.el.loop = function(_options) {
        const _self = this;
        const options = {
            pkg: [
                {
                    'stroke-width': 3
                },
                {
                    'stroke-width': 1
                }
            ],
            duration: 200,
            repeat: false
        };
        Object.assign(options, _options);
        function loop() {
            _self.animate(options.pkg[0], options.duration, ()=>{
                _self.animate(options.pkg[1], options.duration, ()=>{
                    if (options.repeat) loop();
                });
            });
        }
        loop();
        return _self;
    };
    R.el.tooltip = function(obj, w, h) {
        if (w === undefined) w = 80;
        if (h === undefined) h = 20;
        const _tt = this.paper.set();
        const pos = this.getBBox();
        if (obj.type === 'text') {
            // text tooltip
            _tt.push(this.paper.rect(pos.x, pos.y + h * -1 - 10, w, h, 5).attr({
                fill: '#fff'
            }));
            _tt.push(this.paper.text(pos.x + 5, pos.y - 20, '').attr({
                'text-anchor': 'start',
                stroke: '#fff',
                'font-size': 13,
                fill: '#fff'
            }));
        } else {
            // image tooltip
            const xpad = w * -1 - 5;
            _tt.push(this.paper.rect(pos.x + xpad, pos.y + h / 2 * -1, w, h, 15).attr({
                'stroke-width': 2,
                stroke: '#fff',
                'z-index': 9999
            }));
            _tt.push(this.paper.rect(pos.x + xpad, pos.y + (h / 2 - 45), w, 47, 15)).attr({
                'stroke-width': 2,
                fill: '90-#333-#000',
                'z-index': 9999
            });
            _tt.push(this.paper.text(pos.x + xpad + w / 2, pos.y + (h / 2 - 20), '').attr({
                'text-anchor': 'middle',
                stroke: '#fff',
                'font-weight': 'normal',
                'font-family': 'Verdana',
                'font-size': 11,
                'z-index': 999
            }));
        }
        const s = this;
        if (!s.removed) {
            s.tt = _tt;
            if (obj.type === 'text') s.tt[0].animate({
                stroke: '#000',
                fill: '#333'
            }, 200, ()=>{
                s.tt[1].attr({
                    text: obj.msg
                });
            });
            else s.tt[0].animate({
                stroke: '#000',
                fill: '#333'
            }, 200, ()=>{
                // s.tt[1].attr({  });
                s.tt[2].attr({
                    text: obj.msg
                });
            });
        }
        return s.tt;
    };
    R.el.untooltip = function() {
        this.tt && this.tt.remove();
        return this;
    };
};


const $587cf398d068430e$var$kCSSFontFacePattern = /(@font\-face {[\s\S]*?})/g;
const $587cf398d068430e$var$kCSSUrlPattern = /url\((https.+?)\)/;
function $587cf398d068430e$var$fontToDataURLViaBlob(fontUrl) {
    return fetch(fontUrl).then((fontResponse)=>fontResponse.blob()
    ).then((fontBlob)=>new Promise((resolve)=>{
            const reader = new FileReader();
            reader.onload = ()=>{
                resolve(reader.result);
            };
            reader.readAsDataURL(fontBlob);
        })
    );
}
function $587cf398d068430e$var$fontToDataURLViaBuffer(fontUrl) {
    return fetch(fontUrl).then((fontResponse)=>Promise.all([
            Promise.resolve(fontResponse.headers.get("content-type")),
            fontResponse.buffer(), 
        ])
    ).then((fontBuffer)=>{
        const b64 = fontBuffer[1].toString("base64");
        return `data:${fontBuffer[0]};base64,${b64}`;
    });
}
function $587cf398d068430e$var$embedFont(fontFace) {
    const fontUrlMatch = $587cf398d068430e$var$kCSSUrlPattern.exec(fontFace);
    let promise;
    if (typeof FileReader !== "undefined") promise = $587cf398d068430e$var$fontToDataURLViaBlob(fontUrlMatch[1]);
    else promise = $587cf398d068430e$var$fontToDataURLViaBuffer(fontUrlMatch[1]);
    return promise.then((dataURL)=>fontFace.replace(fontUrlMatch[1], dataURL)
    );
}
function $587cf398d068430e$var$embedGoogleFonts({ fonts: fonts , text: text , styleNode: styleNode  }) {
    const snode = styleNode;
    const fontQuery = fonts.join("|").replace(/ /g, "+");
    const googleFontUrl = `https://fonts.googleapis.com/css?family=${fontQuery}&text=${text}`;
    if (fonts.length > 0) return fetch(googleFontUrl).then((cssResponse)=>cssResponse.text()
    ).then((cssText)=>{
        let fontFaces = $587cf398d068430e$var$kCSSFontFacePattern.exec(cssText);
        const embedFontPromises = [];
        while(fontFaces != null){
            embedFontPromises.push($587cf398d068430e$var$embedFont(fontFaces[1]));
            fontFaces = $587cf398d068430e$var$kCSSFontFacePattern.exec(cssText);
        }
        return Promise.all(embedFontPromises);
    }).then((results)=>{
        snode.innerHTML += results.join("\n");
        return true;
    });
    return Promise.resolve(true);
}
var $587cf398d068430e$export$2e2bcd8739ae039 = $587cf398d068430e$var$embedGoogleFonts;


(function(emile, container) {
    const parseEl = document.createElement('div');
    const props = "backgroundColor borderBottomColor borderBottomWidth borderLeftColor borderLeftWidth borderRightColor borderRightWidth borderSpacing borderTopColor borderTopWidth bottom color fontSize fontWeight height left letterSpacing lineHeight marginBottom marginLeft marginRight marginTop maxHeight maxWidth minHeight minWidth opacity outlineColor outlineOffset outlineWidth paddingBottom paddingLeft paddingRight paddingTop right textIndent top width wordSpacing zIndex".split(' ');
    function interpolate(source, target, pos) {
        return parseFloat(source + (target - source) * pos).toFixed(3);
    }
    function s(str, p, c) {
        return str.substr(p, c || 1);
    }
    function color(source, target, pos) {
        let i = 2;
        let j;
        let c;
        let tmp;
        const v = [];
        const r = [];
        while(j = 3, c = arguments[i - 1], i--)if (s(c, 0) == 'r') {
            c = c.match(/\d+/g);
            while(j--)v.push(~~c[j]);
        } else {
            if (c.length == 4) c = `#${s(c, 1)}${s(c, 1)}${s(c, 2)}${s(c, 2)}${s(c, 3)}${s(c, 3)}`;
            while(j--)v.push(parseInt(s(c, 1 + j * 2, 2), 16));
        }
        while(j--){
            tmp = ~~(v[j + 3] + (v[j] - v[j + 3]) * pos);
            r.push(tmp < 0 ? 0 : tmp > 255 ? 255 : tmp);
        }
        return `rgb(${r.join(',')})`;
    }
    function parse(prop) {
        const p = parseFloat(prop);
        const q = prop.replace(/^[\-\d\.]+/, '');
        return Number.isNaN(p) ? {
            v: q,
            f: color,
            u: ''
        } : {
            v: p,
            f: interpolate,
            u: q
        };
    }
    function normalize(style) {
        let css;
        const rules = {
        };
        let i = props.length;
        let v;
        parseEl.innerHTML = `<div style="${style}"></div>`;
        css = parseEl.childNodes[0].style;
        while(i--)if (v = css[props[i]]) rules[props[i]] = parse(v);
        return rules;
    }
    container[emile] = function(el, style, opts) {
        el = typeof el === 'string' ? document.getElementById(el) : el;
        opts = opts || {
        };
        const target = normalize(style);
        const comp = el.currentStyle ? el.currentStyle : getComputedStyle(el, null);
        let prop;
        const current = {
        };
        const start = +new Date();
        const dur = opts.duration || 200;
        const finish = start + dur;
        let interval;
        const easing = opts.easing || function(pos) {
            return -Math.cos(pos * Math.PI) / 2 + 0.5;
        };
        for(prop in target)current[prop] = parse(comp[prop]);
        interval = setInterval(function() {
            window.requestAnimationFrame(()=>{
                const time = +new Date();
                const pos = time > finish ? 1 : (time - start) / dur;
                for(prop in target){
                    const tv = opts.onMove ? opts.onMove(prop) : target[prop].f(current[prop].v, target[prop].v, easing(pos));
                    el.style[prop] = tv + target[prop].u;
                }
                if (time > finish) {
                    clearInterval(interval);
                    opts.after && opts.after();
                } else opts.during && opts.during.apply(this, [
                    (time - start) / dur
                ]);
            });
        }, 10);
    };
})('emile', window);


class $aeb71f7ee3eb2c2e$export$2e2bcd8739ae039 {
    constructor(slate){
        const self = this;
        self.slate = slate;
        let c = slate.options.container;
        if (typeof c === 'string') c = $c09005a36c8880c7$export$2e2bcd8739ae039.el(c);
        if (c === undefined || c === null) throw new Error('You must provide a container to initiate the canvas!');
        // customize raphael -- modifies global Raphael for all other imports
        $c77049a435fdbedd$export$4ff7fc6f1af248b5($db87f2586597736c$export$508faed300ccdfb);
        $594678bd339ae115$export$cc3e2d3244e01b7f($db87f2586597736c$export$508faed300ccdfb);
        self.isDragging = false;
        self.slate.paper = null;
        self.internal = null;
        self.status = null;
        self.imageFolder = null;
        self.dken = null;
        self.eve = {
            init: [
                'onmousedown',
                'ontouchstart'
            ],
            drag: [
                'onmousemove',
                'ontouchmove'
            ],
            up: [
                'onmouseup',
                'ontouchend',
                'onmouseout'
            ],
            gest: [
                'ongesturestart',
                'ongesturechange',
                'ongestureend'
            ]
        };
    }
    init() {
        const self = this;
        const imageFolder = self.slate.options.imageFolder || '/images/';
        const c = self.slate.options.container;
        const { slate: slate  } = self;
        self.Canvas = {
            objInitPos: {
            },
            objInitialMousePos: {
                x: 0,
                y: 0
            },
            initDrag (e) {
                if (slate.isCtrl) slate.multiSelection?.start();
                if (slate.options.allowDrag) {
                    self.isDragging = true;
                    slate.multiSelection?.end();
                    slate.nodes?.closeAllMenus();
                    const m = $c09005a36c8880c7$export$2e2bcd8739ae039.mousePos(e);
                    self.Canvas.objInitPos = $c09005a36c8880c7$export$2e2bcd8739ae039.positionedOffset(self.internal);
                    const offsets = $c09005a36c8880c7$export$2e2bcd8739ae039.positionedOffset(slate.options.container);
                    self.Canvas.objInitialMousePos = {
                        x: m.x + offsets.left,
                        y: m.y + offsets.top
                    };
                    const xy = self.cp(e);
                    if (self.status) self.status.innerHTML = `${Math.abs(xy.x)}, ${Math.abs(xy.y)}`;
                    if (slate.options.showStatus) {
                        if (self.status) self.status.style.display = 'block';
                        slate.multiSelection?.hide();
                    }
                    self.internal.style.cursor = `url(${imageFolder}closedhand.cur), default`;
                    if (m.allTouches) slate.options.lastTouches = m.allTouches;
                    if (slate.removeContextMenus) slate.removeContextMenus();
                    slate.draggingZoom = self.slate.options.viewPort.zoom;
                    // hide filters during dragging
                    slate.toggleFilters(true);
                    $c09005a36c8880c7$export$2e2bcd8739ae039.stopEvent(e);
                } else if (slate.onSelectionStart) slate.onSelectionStart.apply(self, [
                    e
                ]);
                else $c09005a36c8880c7$export$2e2bcd8739ae039.stopEvent(e);
            },
            setCursor () {
                if (self.isDragging) self.internal.style.cursor = `url(${imageFolder}closedhand.cur), default`;
                else self.internal.style.cursor = `url(${imageFolder}openhand.cur), default`;
            },
            onDrag (e) {
                requestAnimationFrame(()=>{
                    // broadcast custom collab
                    const mp = $c09005a36c8880c7$export$2e2bcd8739ae039.mousePos(e);
                    const curPos = $c09005a36c8880c7$export$2e2bcd8739ae039.positionedOffset(self.internal);
                    mp.currentZoom = slate.options.viewPort.zoom.r;
                    mp.left = Math.abs(curPos.left);
                    mp.top = Math.abs(curPos.top);
                    slate.collab?.send({
                        type: 'onMouseMoved',
                        data: mp
                    });
                    if (self.isDragging && slate.options.allowDrag) {
                        const xy = self.cp(e);
                        if (xy.allTouches && xy.allTouches.length > 1) slate.options.lastTouches = xy.allTouches;
                        if (self.status) self.status.innerHTML = `${Math.abs(xy.x)}, ${Math.abs(xy.y)}`;
                        self.internal.style.left = `${xy.x}px`;
                        self.internal.style.top = `${xy.y}px`;
                    }
                });
            },
            endDrag (e) {
                if (self.isDragging && slate.options.allowDrag) {
                    self.isDragging = false;
                    self.internal.style.cursor = `url(${imageFolder}openhand.cur), default`;
                    if (self.status) self.status.style.display = 'none';
                    slate.multiSelection?.show();
                    const xy = self.cp(e);
                    slate.draggingZoom = null;
                    self.endDrag(xy);
                    // show filters after dragging
                    slate.toggleFilters(false);
                }
            }
        };
        // wipe it clean
        if (!slate.options.preserve) c.innerHTML = '';
        if (self.slate.paper) self.slate.paper.clear();
        if (self.internal) c.removeChild(self.internal);
        // internal
        self.internal = document.createElement('div');
        self.internal.setAttribute('class', `slateboxInternal_${self.slate.options.id} sb_canvas`);
        // console.log("setting slate canvas", `slateboxInternal_${self.slate.options.id}`);
        const _w = slate.options.viewPort.width;
        const _h = slate.options.viewPort.height;
        const _l = slate.options.viewPort.left;
        const _t = slate.options.viewPort.top;
        self.internal.style.width = `${_w + 100000}px`;
        self.internal.style.height = `${_h + 100000}px`;
        self.internal.style.left = `${_l * -1}px`;
        self.internal.style.top = `${_t * -1}px`;
        self.internal.style.position = 'absolute';
        self.internal.style['-webkit-transform'] = `translateZ(0)`;
        self.internal.style.transform = `translateZ(0)` // `translate3d(0,0,0)`; //helps with GPU based rendering
        ;
        c.appendChild(self.internal);
        self.internal.addEventListener('mousedown', ()=>{
            self.slate?.events?.onCanvasClicked?.apply();
        });
        // status
        if (self.slate.options.showStatus) {
            self.status = document.createElement('div');
            self.status.style.position = 'absolute';
            self.status.style.height = '20px';
            self.status.style.left = '5px';
            self.status.style.color = '#000';
            self.status.style.fontSize = '10pt';
            self.status.style.fontFamily = 'trebuchet ms';
            self.status.style.top = '0px';
            self.status.style.display = 'none';
            self.status.style.padding = '5px';
            self.status.style.filter = 'alpha(opacity=80)';
            self.status.style.opacity = '.80';
            self.status.style.backgroundColor = '#ffff99';
            self.status.style.fontWeight = 'bold';
            c.appendChild(self.status);
        }
        // style container
        c.style.position = 'relative';
        c.style.overflow = 'hidden';
        // style internal
        self.internal.style.borderTop = `${slate.borderTop}px`;
        self.internal.style.cursor = `url(${imageFolder}openhand.cur), default`;
        self.slate.paper = $db87f2586597736c$export$508faed300ccdfb(self.internal, _w, _h);
        self.refreshBackground();
        if (slate.options.allowDrag) self.wire();
        slate.options.viewPort.originalHeight = _h;
        slate.options.viewPort.originalWidth = _w;
        // set up initial zoom params
        self.resize(_w);
        // show zoom slider
        if (slate.options.showZoom) {
            if (slate.zoomSlider) slate.zoomSlider.show(slate.options.viewPort.width);
        }
        // show undo redo
        if (slate.options.showUndoRedo) {
            if (slate.undoRedo) slate.undoRedo.show();
        }
        // show birdsEye -- this is self referential on canvas in loadJSON inside slate, so this must be deferred until canvas constructor is done.
        if (slate.options.showbirdsEye) {
            if (slate.birdsEye.enabled()) slate.birdsEye.reload(slate.exportJSON());
            else slate.birdsEye.show({
                size: slate.options.sizeOfbirdsEye || 200,
                onHandleMove () {
                }
            });
        }
        // set up the shareable/branding if need be
        if (!slate.options.isbirdsEye && (slate.options.isSharing || slate.options.isEmbedding)) {
            const _btnSize = 25;
            const _scaleSize = _btnSize - 3;
            const _iframe = document.getElementById('snap_slate');
            const _parent = document.createElement('div');
            _parent.className = 'sb_parent_shareable';
            const _styles = $c09005a36c8880c7$export$2e2bcd8739ae039.buildStyle({
                height: _iframe ? `${_scaleSize + 8}px` : `${_scaleSize}px`
            });
            _parent.setAttribute('style', _styles);
            if (slate.options.isEmbedding && !slate.options.nobrand) {
                const _brand = document.createElement('a');
                _brand.className = 'sb_brand';
                _brand.setAttribute('href', 'https://slatebox.com');
                _brand.innerHTML = 'built with slatebox';
                _parent.appendChild(_brand);
            }
            if (!slate.options.isbirdsEye && slate.options.isSharing) {
                const _svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${_btnSize}" height="${_btnSize}"><path fill="#333" stroke="#000" d="{path}" stroke-dasharray="none" stroke-width="1" opacity="1" fill-opacity="1"></path></svg>`;
                [
                    'download',
                    'embed'
                ].forEach((e)=>{
                    const _btn = document.createElement('div');
                    _btn.className = 'sb_share';
                    _btn.setAttribute('data-action', e);
                    const _bstyles = $c09005a36c8880c7$export$2e2bcd8739ae039.buildStyle({
                        width: `${_btnSize}px`,
                        height: `${_btnSize}px`
                    });
                    _btn.setAttribute('style', _bstyles);
                    const _new = $c09005a36c8880c7$export$2e2bcd8739ae039.centerAndScalePathToFitContainer({
                        containerSize: _btnSize,
                        scaleSize: _scaleSize,
                        path: $2197852bc26081e6$export$2e2bcd8739ae039.icons[e]
                    });
                    _btn.innerHTML = _svg.replace(/{path}/gi, _new.path);
                    _parent.appendChild(_btn);
                    $c09005a36c8880c7$export$2e2bcd8739ae039.addEvent(_btn, 'click', ()=>{
                        const _act = this.getAttribute('data-action');
                        switch(_act){
                            case 'embed':
                                {
                                    const _et = document.createElement('textarea');
                                    document.body.appendChild(_et);
                                    let _val = '';
                                    if (_iframe) _val = `<iframe id='sb_embed_${slate.options.id}' src='${window.location.href}' width='${_iframe.clientWidth}' height='${_iframe.clientHeight}' frameborder='0' scrolling='no'></iframe>`;
                                    else {
                                        const _ele = slate.options.container.parentElement;
                                        const _raw = _ele.innerHTML;
                                        const _split = _raw.split('<div class="slateboxInternal"');
                                        const _orig = `${_split[0]}<script>${_split[1].split('<script>')[1]}`;
                                        _val = `<div id="sb_embed_${slate.options.id}">${_orig}</div>`;
                                    }
                                    _et.value = _val;
                                    _et.select();
                                    document.execCommand('copy');
                                    document.body.removeChild(_et);
                                    const _note = document.createElement('div');
                                    _note.innerHTML = 'Copied!';
                                    _note.setAttribute('style', $c09005a36c8880c7$export$2e2bcd8739ae039.buildStyle({
                                        'font-size': '11pt',
                                        'text-align': 'center',
                                        padding: '4px',
                                        'margin-right': '-1px',
                                        width: '125px',
                                        height: '22px',
                                        position: 'absolute',
                                        right: 0,
                                        bottom: 0,
                                        'background-color': '#333',
                                        color: '#fff'
                                    }));
                                    _parent.appendChild(_note);
                                    window.setTimeout(()=>{
                                        _parent.removeChild(_note);
                                    }, 1500);
                                    break;
                                }
                            case 'download':
                                slate.png();
                                break;
                            default:
                                break;
                        }
                    });
                });
            }
            if (slate.options.isEmbedding && _parent.innerHTML !== '') c.appendChild(_parent);
        }
        self.windowSize = $c09005a36c8880c7$export$2e2bcd8739ae039.windowSize();
        self.containerOffset = $c09005a36c8880c7$export$2e2bcd8739ae039.positionedOffset(self.slate.options.container);
        $c09005a36c8880c7$export$2e2bcd8739ae039.addEvent(window, 'resize', ()=>{
            self.windowSize = $c09005a36c8880c7$export$2e2bcd8739ae039.windowSize();
            self.containerOffset = $c09005a36c8880c7$export$2e2bcd8739ae039.positionedOffset(self.slate.options.container);
            if (self.dken !== null) {
                self.dken.style.width = `${self.ws.width}px`;
                self.dken.style.height = `${self.ws.height}px`;
            }
        });
        setTimeout(()=>{
            self.slate.birdsEye?.setBe();
            self.slate.birdsEye?.refresh();
        // set init
        // self.Canvas.objInitPos = utils.positionedOffset(self.internal)
        // console.log('init mouse', self.Canvas.objInitPos)
        }, 500);
        // self.cp()
        // self.initDragDefaults()
        self.completeInit = true;
    }
    cp(e) {
        const m = e ? $c09005a36c8880c7$export$2e2bcd8739ae039.mousePos(e) : {
            x: 0,
            y: 0
        };
        let difX = this.Canvas.objInitPos.left + (m.x - this.Canvas.objInitialMousePos.x);
        let difY = this.Canvas.objInitPos.top + (m.y - this.Canvas.objInitialMousePos.y);
        return {
            x: difX,
            y: difY
        };
    }
    endDrag(coords) {
        this.slate.options.viewPort.left = Math.abs(coords.x);
        this.slate.options.viewPort.top = Math.abs(coords.y);
        this.internal.style.left = `${coords.x}px`;
        this.internal.style.top = `${coords.y}px`;
        const curPos = $c09005a36c8880c7$export$2e2bcd8739ae039.positionedOffset(this.internal);
        const moved = {
            x: this.Canvas.objInitPos.left - curPos.left,
            y: this.Canvas.objInitPos.top - curPos.top
        };
        this.slate.birdsEye?.refresh(true);
        if (this.slate.collaboration.allow) this.broadcast(moved);
    }
    broadcast(moved) {
        this.slate.collab?.send({
            type: 'onCanvasMove',
            data: {
                left: this.slate.options.viewPort.left,
                top: this.slate.options.viewPort.top,
                relative: moved,
                orient: this.slate.getOrientation()
            }
        });
    }
    zoom(_opts) {
        const self = this;
        const opts = {
            dur: 500,
            callbacks: {
                after: null,
                during: null
            },
            easing: 'easeFromTo',
            zoomPercent: 100
        };
        Object.assign(opts, _opts);
        self.slate.nodes.closeAllConnectors();
        const _startZoom = self.slate.options.viewPort.zoom.w || 50000;
        const _targetZoom = self.slate.options.viewPort.originalWidth * (100 / parseInt(opts.zoomPercent, 10));
        const _zoomDif = Math.abs(_targetZoom - _startZoom);
        opts.dur = !opts.dur && opts.dur !== 0 ? 500 : opts.dur;
        // eslint-disable-next-line no-undef
        emile(self.internal, 'padding:1px', {
            duration: opts.dur,
            before () {
                self.slate.options.allowDrag = false;
            },
            after () {
                self.slate.options.allowDrag = true;
                self.slate.zoomSlider.set(_targetZoom);
                self.slate.birdsEye?.refresh(true);
                opts.callbacks?.after?.apply(self.slate, [
                    _targetZoom
                ]);
            },
            during (pc) {
                const _val = _targetZoom > _startZoom ? _startZoom + _zoomDif * pc : _startZoom - _zoomDif * pc;
                self.slate.zoom(0, 0, _val, _val, false);
                self.slate.canvas.resize(_val);
                self.slate.birdsEye?.refresh(true);
                opts.callbacks?.during?.apply(pc);
            },
            easing: $c09005a36c8880c7$export$2e2bcd8739ae039.easing[opts.easing]
        });
    }
    move(_opts) {
        const self = this;
        const opts = {
            x: 0,
            y: 0,
            dur: 500,
            callbacks: {
                after: null,
                during: null
            },
            isAbsolute: true,
            easing: 'easeFromTo'
        };
        Object.assign(opts, _opts);
        let { x: x , y: y  } = opts;
        if (opts.isAbsolute === false) {
            x = self.slate.options.viewPort.left + x;
            y = self.slate.options.viewPort.top + y;
        }
        self.slate.nodes.closeAllConnectors();
        if (opts.dur > 0) // eslint-disable-next-line no-undef
        emile(self.internal, `left:${x * -1}px;top:${y * -1}px`, {
            duration: opts.dur,
            before () {
                self.slate.options.allowDrag = false;
            },
            after () {
                self.slate.options.allowDrag = true;
                self.slate.options.viewPort.left = Math.abs(parseInt(self.internal.style.left.replace('px', ''), 10));
                self.slate.options.viewPort.top = Math.abs(parseInt(self.internal.style.top.replace('px', ''), 10));
                self.slate.birdsEye?.refresh(true);
                opts.callbacks.after?.apply(self.slate);
            },
            during (pc) {
                self.slate.birdsEye?.refresh(true);
                opts.callbacks?.during?.apply(pc);
            },
            easing: $c09005a36c8880c7$export$2e2bcd8739ae039.easing[opts.easing]
        });
        else window.requestAnimationFrame(()=>{
            self.internal.style.left = `${x * -1}px`;
            self.internal.style.top = `${y * -1}px`;
            self.slate.options.viewPort.left = Math.abs(x);
            self.slate.options.viewPort.top = Math.abs(y);
            opts.callbacks?.after?.apply(self.slate);
        });
    }
    bbox() {
        const dimen = $c09005a36c8880c7$export$2e2bcd8739ae039.getDimensions(this.slate.options.container);
        return {
            x: Math.abs(this.slate.options.viewPort.top),
            y: Math.abs(this.slate.options.viewPort.left),
            width: dimen.width,
            height: dimen.height
        };
    }
    resize(val) {
        const uval = parseInt(val, 10);
        const R = this.slate.options.viewPort.width / uval;
        const dimen = $c09005a36c8880c7$export$2e2bcd8739ae039.getDimensions(this.slate.options.container);
        let _top = this.slate.options.viewPort.top * -1 * R;
        let _left = this.slate.options.viewPort.left * -1 * R;
        const _centerY = (dimen.height / 2 * R - dimen.height / 2) * -1;
        const _centerX = (dimen.width / 2 * R - dimen.width / 2) * -1;
        _top += _centerY;
        _left += _centerX;
        const threshold = this.slate.options.viewPort.originalWidth - 1000;
        if (-_top > threshold || -_left > threshold) return false;
        this.internal.style.top = `${_top}px`;
        this.internal.style.left = `${_left}px`;
        this.slate.options.viewPort.zoom = {
            w: uval,
            h: uval,
            l: parseFloat(_left * -1),
            t: parseFloat(_top * -1),
            r: this.slate.options.viewPort.originalWidth / uval
        };
        return true;
    }
    clear() {
        this.slate.options.container.innerHTML = '';
        return this.slate._;
    }
    wire() {
        const self = this;
        self.eve.init.forEach((ee)=>{
            self.internal[ee] = self.Canvas.initDrag;
        });
        self.eve.drag.forEach((ee)=>{
            self.internal[ee] = self.Canvas.onDrag;
        });
        self.eve.up.forEach((ee)=>{
            self.internal[ee] = self.Canvas.endDrag;
        });
    }
    unwire() {
        const self = this;
        self.eve.init.forEach((ee)=>{
            self.internal[ee] = null;
        });
        self.eve.drag.forEach((ee)=>{
            self.internal[ee] = null;
        });
        self.eve.up.forEach((ee)=>{
            self.internal[ee] = null;
        });
    }
    rawSVG(cb) {
        const self = this;
        function finalize(svg) {
            if (self.slate.events.onOptimizeSVG) self.slate.events.onOptimizeSVG(svg, (err, optimized)=>{
                if (err) console.error('Unable to optimize slate svg export', err);
                else cb(optimized);
            });
            else cb(svg);
        }
        function extractImages(__svg) {
            let ssvg = __svg;
            const images = $i9J9X$lodashuniq(self.slate.nodes.allNodes.map((n)=>n.options.image
            ).filter((f)=>!!f
            ));
            if (images.length > 0) images.forEach((i, ind)=>{
                if (self.slate.events.onBase64ImageRequested) {
                    // server side gen
                    let imageType = 'png';
                    if (i.indexOf('jpg')) imageType = 'jpeg';
                    else if (i.indexOf('gif')) imageType = 'gif';
                    self.slate.events.onBase64ImageRequested(i, imageType, (err, res)=>{
                        if (err) console.error('Unable to retrieve base64 from image', err);
                        else {
                            const ix = i.replace(/&/gi, '&amp;');
                            while(ssvg.indexOf(ix) > -1)ssvg = ssvg.replace(ix, res);
                        }
                        if (ind + 1 === images.length) finalize(ssvg);
                    });
                } else // client side only -- good luck with CORS - this method should be avoided
                $c09005a36c8880c7$export$2e2bcd8739ae039.toDataUrl(i).then((dataUrl)=>{
                    ssvg = ssvg.replace(new RegExp(i, 'gi'), dataUrl);
                }).catch((err)=>{
                    console.error('Unable to get image', err);
                }).finally(()=>{
                    if (ind + 1 === images.length) finalize(ssvg);
                });
            });
            else finalize(ssvg);
        }
        // always embed fonts and fix links -- a style node is always added in the init
        $587cf398d068430e$export$2e2bcd8739ae039({
            fonts: $i9J9X$lodashuniq(self.slate.nodes.allNodes.map((n)=>n.options.fontFamily
            )),
            text: $i9J9X$lodashuniq(self.slate.nodes.allNodes.flatMap((n)=>n.options.text.replace(/ /gi, '').split('')
            )).join('').trim(),
            styleNode: self.internal.querySelector('svg > defs > style')
        }).then(()=>{
            // need to swap out xlink:href with href for the blob to work w/ the pixelate (or other) filter
            let __svg = self.internal.innerHTML.replace(/xlink:href/gi, 'href');
            const slateBg = self.slate.options.containerStyle.backgroundImage;
            if (slateBg) {
                // server side gen
                let bgImageType = 'png';
                if (slateBg.indexOf('jpg')) bgImageType = 'jpeg';
                else if (slateBg.indexOf('gif')) bgImageType = 'gif';
                self.slate.events.onBase64ImageRequested(slateBg, bgImageType, (err, res)=>{
                    if (err) console.error('Unable to retrieve base64 from image', err);
                    else __svg = __svg.replace(slateBg, res);
                    extractImages(__svg);
                });
            } else extractImages(__svg);
        });
    }
    bgToBack() {
        this._bg?.toBack();
    }
    hideBg(t) {
        const self = this;
        const e = self.slate.options.containerStyle.backgroundEffect;
        self._bg?.remove();
        delete self._bg;
        if (e) {
            if (!self.slate.options.isbirdsEye) {
                clearTimeout(self.showBgTimeout);
                self.showBgTimeout = setTimeout(()=>{
                    const attrs = {
                        filter: `url(#${e})`
                    };
                    if (self.slate.filters.availableFilters[e]?.fill) attrs.fill = `url(#${self.slate.filters.availableFilters[e]?.fill})`;
                    self._bg = self.slate.paper.rect(0, 0, self.slate.options.viewPort.width, self.slate.options.viewPort.height).attr(attrs).toBack();
                }, t || 2500);
            }
        }
        self.refreshBackground();
    }
    refreshBackground() {
        const self = this;
        self.internal.style.backgroundColor = '';
        self.internal.parentElement.style.backgroundImage = '';
        self.internal.parentElement.style.backgroundSize = '';
        self.internal.parentElement.style.background = '';
        self.internal.style.backgroundSize = '';
        self.internal.style.backgroundPosition = '';
        if (self.slate.options.containerStyle.backgroundEffect) self.slate.options.containerStyle.backgroundColor = self.slate.filters.availableFilters[self.slate.options.containerStyle.backgroundEffect].backgroundColor;
        if (self.slate.options.containerStyle.backgroundImage) {
            self.slate.options.containerStyle.prevBackgroundColor = self.slate.options.containerStyle.backgroundColor;
            self.slate.options.containerStyle.backgroundColor = 'transparent';
            self.internal.parentElement.style.backgroundImage = `url('${self.slate.options.containerStyle.backgroundImage}')`;
            if (self.slate.options.containerStyle.backgroundSize) self.internal.parentElement.style.backgroundSize = self.slate.options.containerStyle.backgroundSize;
        }
        // show only on first load
        if (!self.initBg && self.slate.options.containerStyle.backgroundEffect) {
            self.initBg = true;
            self.hideBg(1);
        }
        switch(self.slate.options.containerStyle.backgroundColor){
            case 'transparent':
                if (!self.slate.options.isbirdsEye) {
                    if (self.slate.options.isEmbedding) self.internal.style.backgroundColor = '';
                    else if (!self.slate.options.containerStyle.backgroundImage) {
                        self.internal.style.backgroundImage = 'linear-gradient(45deg,rgba(13,26,43,0.1) 25%,transparent 25%,transparent 75%,rgba(13,26,43,0.1) 75%),linear-gradient(45deg,rgba(13,26,43,0.1) 25%,transparent 25%,transparent 75%,rgba(13,26,43,0.1) 75%)';
                        self.internal.style.backgroundSize = '12px 12px';
                        self.internal.style.backgroundPosition = '0 0,6px 6px';
                    }
                }
                break;
            default:
                if (self.slate.options.containerStyle.backgroundColorAsGradient) {
                    self.internal.style.backgroundColor = '';
                    const bgStyle = `${self.slate.options.containerStyle.backgroundGradientType}-gradient(${self.slate.options.containerStyle.backgroundGradientColors.join(',')})`;
                    self.internal.parentElement.style.background = bgStyle;
                } else self.internal.style.backgroundColor = self.slate.options.containerStyle.backgroundColor || '#fff';
                break;
        }
        self.slate.grid?.setGrid();
    }
    get() {
        return this.internal;
    }
    draggable() {
        return this.internal;
    }
}




/* eslint-disable new-cap */ const $dc3db6ac99a59a76$var$availablePlugins = {
};
class $dc3db6ac99a59a76$export$2e2bcd8739ae039 {
    constructor(initPayload){
        // register any plugins
        if (this.constructor.name !== 'plugin') this.registerPlugins(initPayload);
    }
    registerPlugins(initPayload) {
        const root = this.constructor.name;
        // console.log("registering plugins ", root, base.plugins, base.plugins[root]);
        if ($dc3db6ac99a59a76$var$availablePlugins[root]) $dc3db6ac99a59a76$var$availablePlugins[root].forEach((p)=>{
            const { name: name , plugin: plugin  } = p;
            if (!this.plugins) this.plugins = {
            };
            this.plugins[name] = new plugin(initPayload);
        });
    }
    static registerPlugin(details) {
        if (!details.name || !details.plugin) throw new Error('Plugins must provide a name and a plugin (class definition)');
        const root = Object.getPrototypeOf(details.plugin).name;
        // console.log("creating plugin root ", root);
        if (!$dc3db6ac99a59a76$var$availablePlugins[root]) $dc3db6ac99a59a76$var$availablePlugins[root] = [];
        $dc3db6ac99a59a76$var$availablePlugins[root] = [
            ...$dc3db6ac99a59a76$var$availablePlugins[root],
            details
        ];
    }
}




class $d70659fe9854f6b3$export$2e2bcd8739ae039 extends $dc3db6ac99a59a76$export$2e2bcd8739ae039 {
    constructor(options){
        super();
        this._lock = null;
        this._openLock = null;
        this.lm = null;
        this.options = {
            id: $c09005a36c8880c7$export$2e2bcd8739ae039.guid(),
            name: '',
            text: '',
            image: '',
            groupId: null,
            xPos: 0,
            yPos: 0,
            height: 10,
            width: 10,
            borderStyle: 'solid',
            borderWidth: 1,
            borderColor: '#000',
            borderOpacity: 1,
            lineColor: '#000000',
            lineOpacity: 1,
            lineEffect: '',
            lineWidth: 5,
            opacity: 1,
            textOpacity: 1,
            showDelete: true,
            showAddAndDeleteConditionally: false,
            showResize: true,
            showAdd: true,
            showRelationshipConnector: true,
            showRelationshipDelete: true,
            showRelationshipProperties: true,
            showRelationshipReassign: true,
            showRotate: true,
            showMenu: true,
            showColorTab: true,
            showTextTab: true,
            showShapeTab: true,
            showImageTab: true,
            showEffectTab: true,
            spaceBetweenNodesWhenAdding: 30,
            disableMenuAsTemplate: false,
            disableDrag: false,
            allowDrag: true,
            allowMenu: true,
            allowContext: true,
            allowResize: true,
            isLocked: false,
            isComment: false,
            backgroundColor: '90-#031634-#2D579A',
            foregroundColor: '#fff',
            isCategory: false,
            categoryName: '',
            fontSize: 18,
            fontFamily: 'Roboto',
            shapeHint: 'rectangle',
            vectorPath: '',
            rotate: {
                rotationAngle: 0
            },
            textXAlign: 'middle',
            textYAlign: 'middle',
            link: {
                show: false,
                type: '',
                data: '',
                thumbnail: {
                    width: 175,
                    height: 175
                }
            },
            filters: {
                vect: null,
                text: null
            }
        };
        Object.assign(this.options, options);
        if (this.options.name === '') this.options.name = this.options.id;
        this.constants = {
            statusPanelAtRest: 33,
            statusPanelExpanded: 200
        };
    }
    // get vect() {
    //   return this.vect;
    // }
    // get text() {
    //   return this.text;
    // }
    // get link() {
    //   return this.link;
    // }
    // set vect(val) {
    //   this.vect = val;
    // }
    // set text(val) {
    //   this.text = val;
    // }
    // set link(val) {
    //   this.link = val;
    // }
    _url(opt) {
        return this.options.ajax.rootUrl + this.options.ajax.urlFlavor + opt;
    }
    del() {
        const _unlinkId = this.options.id;
        this.slate.nodes.closeAllMenus();
        this.slate.nodes.closeAllLineOptions();
        this.relationships.removeAll();
        this.slate.options.allowDrag = true;
        // unlink any links
        this.slate.nodes.allNodes.forEach((nd)=>{
            if (nd.options.link && nd.options.link.show && nd.options.link.data === _unlinkId) {
                Object.assign(nd.options.link, {
                    show: false,
                    type: '',
                    data: ''
                });
                nd.link.hide();
            }
        });
        this.slate.nodes.remove(this);
    }
    getTransformString(opts = {
    }) {
        const _transforms = [];
        let rotationTransform;
        if (opts.action === 'resize') {
            const resizeTransform = `s${opts.sx},${opts.sy}`;
            _transforms.push(resizeTransform);
        }
        if (opts.rotate) rotationTransform = `R${opts.rotate.rotationAngle}, ${opts.rotate.point.x}, ${opts.rotate.point.y}`;
        else if (this.options.rotate.rotationAngle) rotationTransform = `R${this.options.rotate.rotationAngle}, ${this.options.rotate.point.x - (opts.dx || 0)}, ${this.options.rotate.point.y - (opts.dy || 0)}`;
        if (rotationTransform) _transforms.push(rotationTransform);
        if (opts.action === 'translate') {
            const translationTransform = `T${opts.dx}, ${opts.dy}`;
            // console.log("node transform string ", translationTransform);
            _transforms.push(translationTransform);
        }
        return _transforms.join(' ');
    }
    rotateMoveVector({ dx: dx , dy: dy  }) {
        const _rotationAngle = -this.options.rotate.rotationAngle * Math.PI / 180 // conversion to radians
        ;
        return {
            dx: dx * Math.cos(_rotationAngle) - dy * Math.sin(_rotationAngle),
            dy: dx * Math.sin(_rotationAngle) + dy * Math.cos(_rotationAngle)
        };
    }
    translateWith({ dx: dx , dy: dy  }) {
        // need a rotateMoveVector for both the vect and the text
        const newMoveVector = this.rotateMoveVector({
            dx: dx,
            dy: dy
        });
        const translateContext = {
            action: 'translate',
            dx: newMoveVector.dx,
            dy: newMoveVector.dy
        };
        const transformString = this.getTransformString(translateContext);
        // during movement, the only thing that is updated is the transform property on
        // both the text and vect -- the actual attr update happens at the "up" in the
        // relationships.js module -- and the transform("") there causes these transient
        // transforms to be removed and replaced with the permanent attr updates.
        // note the "up" function there calls into the utils.transformPath on Slatebox.js
        // proper where the transform("") and the attr permanent record is done.
        this.vect.transform(transformString);
        this.text.transform(transformString);
        this.setPosition({
            x: this.vect.ox + dx,
            y: this.vect.oy + dy
        });
    }
    setPosition(p, blnKeepMenusOpen, activeNode, opts = {
    }) {
        this.options.xPos = p.x;
        this.options.yPos = p.y;
        const lc = this.linkCoords();
        // not setting the text attr here -- this is
        // this.text.attr(this.textCoords(p));
        // this.text.attr(this.textCoords({x: this.options.xPos, y: this.options.yPos = p.y });
        this.link.transform([
            't',
            lc.x,
            ',',
            lc.y,
            's',
            '.8',
            ',',
            '.8',
            'r',
            '180'
        ].join());
        // close all open menus
        if (blnKeepMenusOpen !== true) {
            this.slate.nodes.closeAllMenus({
                exception: activeNode
            });
            this.slate.nodes.closeAllLineOptions();
        }
    }
    setStartDrag() {
        this.slate.options.allowDrag = false;
        // this.slate.stopEditing();
        this.connectors && this.connectors.reset();
        this.context && this.context.remove();
    }
    setEndDrag() {
        if (this.slate && this.slate.options.enabled) // could be null in case of the tempNode
        this.slate.options.allowDrag = true;
        this.slate.displayLocks();
    }
    serialize(lineWidthOverride) {
        const self = this;
        const jsonNode = {
        };
        Object.assign(jsonNode, {
            options: self.options
        });
        jsonNode.relationships = {
            associations: []
        } // , children: []
        ;
        self.relationships.associations.forEach((association)=>{
            jsonNode.relationships.associations.push(self._bindRel(association, lineWidthOverride));
        });
        return jsonNode;
    }
    _bindRel(obj, lineWidthOverride) {
        return {
            childId: obj.child.options.id,
            parentId: obj.parent.options.id,
            isStraightLine: obj.blnStraight,
            lineColor: obj.lineColor,
            lineEffect: obj.lineEffect,
            lineOpacity: obj.lineOpacity,
            lineWidth: lineWidthOverride || obj.lineWidth
        };
    }
    addRelationships(json, cb) {
        // add parents
        const self = this;
        const _lines = [];
        if (json.relationships) // add associations
        {
            if (json.relationships && json.relationships.associations && json.relationships.associations.forEach) json.relationships.associations.forEach((association)=>{
                const _pr = association;
                let _pn = null;
                self.slate.nodes.allNodes.forEach(($d70659fe9854f6b3$export$2e2bcd8739ae039)=>{
                    if ($d70659fe9854f6b3$export$2e2bcd8739ae039.options.id === _pr.parentId && self.options.id !== $d70659fe9854f6b3$export$2e2bcd8739ae039.options.id) _pn = $d70659fe9854f6b3$export$2e2bcd8739ae039;
                });
                if (_pn) {
                    const _conn = _pn.relationships.addAssociation(self, _pr);
                    _lines.push(_conn.line);
                }
            });
        }
        cb?.apply(self, [
            _lines
        ]);
    }
    toFront() {
        this.relationships?.associations?.forEach((assoc)=>{
            assoc.line.toFront();
        });
        this.vect.toFront();
        this.text.toFront();
        this.link.toFront();
        this.slate?.grid.toBack();
        this.slate?.canvas.bgToBack();
        this.slate.reorderNodes();
    }
    toBack() {
        this.link.toBack();
        this.text.toBack();
        this.vect.toBack();
        this.relationships?.associations?.forEach((assoc)=>{
            assoc.line.toBack();
        });
        this.slate?.grid.toBack();
        this.slate?.canvas.bgToBack();
        this.slate.reorderNodes();
    }
    hide() {
        this.vect.hide();
        this.text.hide();
        this.options.link.show && this.link.hide();
    }
    show() {
        this.vect.show();
        this.text.show();
        this.options.link.show && this.link.show();
    }
    applyFilters(filter) {
        const self = this;
        if (filter) {
            // presumes that the filter has been added to the slate
            if (!self.options.filters[filter.apply]) self.options.filters[filter.apply] = {
            };
            self.options.filters[filter.apply] = filter.id;
        }
        Object.keys(self.options?.filters).forEach((key)=>{
            if (self[key]) {
                if (self.options.filters[key]) self[key].attr('filter', `url(#${self.options.filters[key]})`);
                else self[key].attr('filter', '');
            }
        });
    }
    toggleFilters(blnHide) {
        const self = this;
        Object.keys(self.options?.filters).forEach((key)=>{
            if (self[key]) {
                if (self.options.filters[key]) {
                    if (blnHide) self[key].attr('filter', '');
                    else self[key].attr('filter', `url(#${self.options.filters[key]})`);
                }
            }
        });
    }
    applyBorder(pkg) {
        // first update the border prop if used
        if (pkg) this.options[pkg.prop] = pkg.val;
        // next define the full suite
        const vectOpts = {
            stroke: this.options.borderColor,
            'stroke-dasharray': this.options.borderStyle || null,
            'stroke-width': this.options.borderWidth != null ? this.options.borderWidth : 1,
            'stroke-opacity': this.options.borderOpacity != null ? this.options.borderOpacity : 1,
            'stroke-linecap': 'round'
        };
        if (this.vect) this.vect.attr(vectOpts);
        return vectOpts;
    }
    // returns an invisible path with the correct position of a path being dragged. MAKE SURE TO REMOVE IT AFTER YOU ARE DONE WITH IT or there will be a growing number of invisible paths rendering the slate unusable
    getTempPathWithCorrectPositionFor({ pathElement: pathElement , dx: dx , dy: dy , rotationAngle: rotationAngle  }) {
        const tempPath = this.slate.paper.path(pathElement.attr('path').toString()).attr({
            opacity: 0
        });
        const _transforms = [];
        const bb = tempPath.getBBox();
        if (dx != null && dy != null) {
            if (this.options.rotate.rotationAngle) {
                const newMoveVector = this.rotateMoveVector({
                    dx: dx,
                    dy: dy
                });
                _transforms.push(`T${newMoveVector.dx},${newMoveVector.dy}`);
            } else _transforms.push(`T${dx},${dy}`);
        }
        if (rotationAngle != null) _transforms.push(`r${rotationAngle}, ${bb.cx}, ${bb.cy}`);
        else if (this.options.rotate.rotationAngle) _transforms.push(`r${this.options.rotate.rotationAngle}, ${this.options.rotate.point.x}, ${this.options.rotate.point.y}`);
        tempPath.transform('');
        const transformPath = $d2703cad5fa90838$export$2e2bcd8739ae039(tempPath.attr('path').toString(), _transforms);
        tempPath.attr({
            path: transformPath
        });
        return tempPath;
    }
    hideOwnMenus() {
        this.link.hide();
        this.menu.hide();
    // this._lock && this._lock.hide();
    // this._openLock && this._openLock.hide();
    }
    spin(opts) {
        let ii = 0;
        const _aa = opts && opts.angle || 280;
        const _dur = opts && opts.duration || 5000;
        function _spinner(_angle) {
            ii++;
            const _ra = ii % 2 === 0 ? this.options.rotate.rotationAngle - _angle : this.options.rotate.rotationAngle + _angle;
            const _rotate = {
                rotate: this.options.rotate,
                rotationAngle: _ra
            };
            this.rotate.animateSet(_rotate, {
                duration: _dur,
                cb: ()=>{
                    _spinner(_aa);
                }
            });
        }
        _spinner(_aa);
    }
    move(pkg) {
        const _mPkg = {
            dur: pkg.dur || 500,
            moves: [
                {
                    id: this.options.id,
                    x: pkg.x,
                    y: pkg.y
                }, 
            ]
        };
        const _pkg = this.slate.nodes.nodeMovePackage(_mPkg);
        this.slate.nodes.moveNodes(_pkg, {
            animate: true,
            cb: ()=>{
                pkg.cb && pkg.cb();
            }
        });
    }
    zoom(zoomPercent, duration, cb) {
        /*
    var _startZoom = this.slate.options.viewPort.zoom.w;
    var _targetZoom = this.slate.options.viewPort.originalWidth * (100 / parseInt(zoomPercent));
    var _zoomDif = Math.abs(_targetZoom - _startZoom);
    */ // UNTIL PAN AND ZOOM WORKS CORRECTLY, THIS WILL
        // ALWAYS BE A SIMPLE PROXY TO ZOOMING THE SLATE
        this.slate.canvas.zoom({
            dur: duration,
            zoomPercent: zoomPercent,
            callbacks: {
                during (percentComplete, easing) {
                // additional calcs
                },
                after (zoomVal) {
                    cb && cb.apply(this, [
                        {
                            id: this.options.id,
                            operation: 'zoom',
                            zoomLevel: zoomVal
                        }, 
                    ]);
                }
            }
        });
    }
    position(location, cb, easing, dur) {
        const self = this;
        easing = easing || 'easeTo' // 'swingFromTo'
        ;
        dur = dur || 500;
        const _vpt = self.vect.getBBox();
        const zr = self.slate.options.viewPort.zoom.r;
        const d = $c09005a36c8880c7$export$2e2bcd8739ae039.getDimensions(self.slate.options.container);
        const cw = d.width;
        const ch = d.height;
        const nw = self.options.width * zr;
        const nh = self.options.height * zr;
        const pad = 10;
        // get upper left coords
        let _x = _vpt.x * zr;
        let _y = _vpt.y * zr;
        switch(location){
            case 'lowerright':
                _x = _x - (cw - nw) - pad;
                _y = _y - (ch - nh) - pad;
                break;
            case 'lowerleft':
                _x -= pad;
                _y = _y - (ch - nh) - pad;
                break;
            case 'upperright':
                _x = _x - (cw - nw) - pad;
                _y -= pad;
                break;
            case 'upperleft':
                _x -= pad;
                _y -= pad;
                break;
            default:
                // center
                _x -= cw / 2 - nw / 2;
                _y -= ch / 2 - nh / 2;
                break;
        }
        if (_x === self.slate.options.viewPort.left && _y === self.slate.options.viewPort.top) cb.apply();
        else self.slate.canvas.move({
            x: _x,
            y: _y,
            dur: dur,
            callbacks: {
                after () {
                    cb?.apply(self, [
                        {
                            id: self.options.id,
                            operation: 'position',
                            location: location,
                            easing: easing
                        }, 
                    ]);
                }
            },
            isAbsolute: true,
            easing: easing
        });
    }
    toggleImage(opts) {
        if (this.options.vectorPath && this.options.remoteImage) {
            if (opts.active) {
                const _svgAsImage = this.options.remoteImage;
                this.hidden = {
                    vectorPath: this.options.vectorPath
                };
                this.shapes.set({
                    shape: 'rect',
                    keepResizerOpen: opts.keepResizerOpen
                });
                this.images.set(_svgAsImage, this.options.width, this.options.height, opts.keepResizerOpen);
                this.text && this.text.hide();
            } else if (this.hidden) {
                this.images.set('', this.options.width, this.options.height);
                this.customShapes.set(this.hidden.vectorPath);
                if (opts.width && opts.height) this.resize.set(opts.width, opts.height);
                this.text && this.text.show();
                this.relationships.showOwn();
                setTimeout(()=>{
                    this.menu.show();
                }, 100);
                delete this.hidden;
            }
        }
    }
    disable() {
        this.options.allowMenu = false;
        this.options.allowDrag = false;
        this.hideOwnMenus();
        if (this.slate.options.showLocks && this.options.isLocked) this.showLock();
    // this.relationships.unwireHoverEvents();
    }
    enable() {
        this.options.allowMenu = true // _prevAllowMenu || true;
        ;
        this.options.allowDrag = true // _prevAllowDrag || true;
        ;
        this.hideLock();
    // this.relationships.wireHoverEvents();
    }
    showLock() {
        const self = this;
        const _vpt = self.vect.getBBox();
        const r = self.slate.paper;
        if (!self._lock && self.slate.options.showLocks) {
            self._lock = r.lockClosed().transform([
                't',
                _vpt.x2 - 10,
                ',',
                _vpt.y2 - 10,
                's',
                0.9,
                0.9
            ].join()).attr({
                fill: '#fff',
                stroke: '#000'
            });
            self._lock.mouseover((e)=>{
                self.hideLock();
            });
        }
        return self._lock;
    }
    mark() {
        const self = this;
        if (!self.marker) {
            const rect = self.vect.getBBox();
            const z = self.slate.options.viewPort.zoom.r;
            const padding = 10;
            const clr = $c09005a36c8880c7$export$2e2bcd8739ae039.whiteOrBlack(self.slate.options.containerStyle.backgroundColor);
            self.marker = self.slate.paper.rect(rect.x - padding, rect.y - padding, rect.width + padding * 2, rect.height + padding * 2).attr({
                'stroke-dasharray': '-',
                fill: clr,
                opacity: 0.5
            });
            self.marker.toBack();
            self.slate?.grid.toBack();
            self.slate?.canvas.bgToBack();
        }
    }
    unmark() {
        const self = this;
        self.marker?.remove();
        delete self.marker;
    }
    hideLock() {
        this.hideOpenLock();
        this._lock && this._lock.remove();
        this._lock = null;
        this.slate.unglow();
    }
    showOpenLock() {
        const self = this;
        const _vpt = this.vect.getBBox();
        const r = this.slate.paper;
        self._openLock = r.lockOpen().transform([
            't',
            _vpt.x2 - 10,
            ',',
            _vpt.y2 - 10,
            's',
            0.9,
            0.9
        ].join()).attr({
            fill: '#fff',
            stroke: '#000'
        });
        self._openLock.mouseover((e)=>{
            self._openLock.attr({
                'stroke-width': '2px',
                'stroke-color': '#000'
            });
            self._openLock.style.cursor = 'pointer';
        });
        self._openLock.mouseout(()=>{
            self.hideOpenLock();
            self.showLock();
        });
        self._openLock.mousedown(()=>{
            self.enable();
            self.options.isLocked = false;
            const pkg = {
                type: 'onNodeUnlocked',
                data: {
                    id: self.options.id
                }
            };
            self.context.broadcast(pkg);
        });
        return self._openLock;
    }
    hideOpenLock() {
        this._openLock && this._openLock.remove();
        this._openLock = null;
    }
    initLock() {
        if (this.vect && this.options.isLocked) this.showLock();
    }
    offset() {
        let _x = this.options.xPos - this.slate.options.viewPort.left;
        let _y = this.options.yPos - this.slate.options.viewPort.top;
        if (this.options.vectorPath === 'ellipse') {
            _x -= this.options.width / 2;
            _y -= this.options.height / 2;
        }
        return {
            x: _x,
            y: _y
        };
    }
    textCoords(opts = {
    }) {
        const _useX = opts.x || this.vect.ox || 0;
        const _useY = opts.y || this.vect.oy || 0;
        // these are the center defaults
        // start
        let _offsetX = this.options?.textOffset?.x || 0;
        // middle
        let _offsetY = this.options?.textOffset?.y || 0;
        const bbox = this.vect.getBBox();
        const _scale = 1;
        switch(this.options.textXAlign){
            case 'end':
                _offsetX = _offsetX * _scale + this.options.textOffset.width;
                break;
            case 'middle':
                _offsetX = _offsetX * _scale + this.options.textOffset.width / 2;
                break;
            default:
                break;
        }
        switch(this.options.textYAlign){
            case 'hanging':
                _offsetY = _offsetY * _scale - bbox.height / 2;
                break;
            case 'baseline':
                _offsetY = _offsetY * _scale + bbox.height / 2;
                break;
            default:
                break;
        }
        const tx = _useX + _offsetX;
        const ty = _useY + _offsetY;
        const _tc = {
            x: tx,
            y: ty
        };
        return _tc;
    }
    linkCoords() {
        let x = this.options.xPos - 20;
        let y = this.options.yPos + this.options.height / 2 - 22;
        if (this.vect.type !== 'rect') {
            y = this.options.yPos + this.options.height / 2 - 22;
            x = this.options.xPos - 20;
        }
        return {
            x: x,
            y: y
        };
    }
    _rotate(_opts) {
        const opts = {
            angle: 0,
            cb: null,
            dur: 0
        };
        Object.assign(opts, _opts);
        const ta = [
            'r',
            opts.angle
        ].join('');
        if (opts.dur === 0) {
            this.vect.transform(ta);
            this.text.transform(ta);
            if (this.options.link.show) this.link.transform(ta);
            opts.cb && opts.cb();
        } else {
            const lm = this.slate.paper.set();
            lm.push(this.vect);
            lm.push(this.text);
            if (this.options.link.show) lm.push(this.link);
            lm.animate({
                transform: ta
            }, opts.dur, '>', ()=>{
                opts.cb && opts.cb();
            });
        }
    }
}


class $0de94e735767a57c$export$2e2bcd8739ae039 {
    constructor(slate){
        this.slate = slate;
        this.invoker = null;
        this.pc = slate.collaboration || {
        };
        if (!$c09005a36c8880c7$export$2e2bcd8739ae039.localRecipients) $c09005a36c8880c7$export$2e2bcd8739ae039.localRecipients = [];
        this.wire();
    }
    exe(pkg) {
        const self = this;
        self.invoke(pkg);
        self.send(pkg);
    }
    wire() {
        const self = this;
        function resetMultiSelect() {
            self.slate.multiSelection?.end();
        }
        self.invoker = {
            onZoom (pkg) {
                if (self.slate.options.followMe) {
                    resetMultiSelect();
                    const zoomPercent = self.slate.options.viewPort.originalWidth / pkg.data.zoomLevel * 100;
                    self.slate.canvas.zoom({
                        dur: pkg.data.duration || 500,
                        zoomPercent: zoomPercent,
                        callbacks: {
                            during () {
                            // additional calcs
                            },
                            after () {
                            }
                        }
                    });
                }
            },
            onNodePositioned (pkg) {
                resetMultiSelect();
                const cn = self.slate.nodes.one(pkg.data.id);
                cn.position(pkg.data.location, ()=>{
                }, pkg.data.easing, pkg.data.duration || 500);
                self.closeNodeSpecifics(pkg);
            },
            onNodeLinkRemoved (pkg) {
                const cn = self.slate.nodes.one(pkg.data.id);
                cn.links?.unset(false);
                self.closeNodeSpecifics(pkg);
            },
            onNodeLinkAdded (pkg) {
                const cn = self.slate.nodes.one(pkg.data.id);
                cn.links?.set(pkg, false);
                self.closeNodeSpecifics(pkg);
            },
            onNodeUnlocked (pkg) {
                const cn = self.slate.nodes.one(pkg.data.id);
                cn.options.allowDrag = true;
                cn.options.isLocked = false;
                cn.hideLock();
                self.slate.birdsEye?.nodeChanged(pkg);
                self.closeNodeSpecifics(pkg);
            },
            onNodeLocked (pkg) {
                const cn = self.slate.nodes.one(pkg.data.id);
                cn.options.allowDrag = false;
                cn.options.isLocked = true;
                cn.showLock();
                self.slate.birdsEye?.nodeChanged(pkg);
                self.closeNodeSpecifics(pkg);
            },
            onNodeBehaviorChanged (pkg) {
                const cn = self.slate.nodes.one(pkg.data.id);
                pkg.data.behaviorChanges.forEach((b)=>{
                    if (typeof b.value === 'object') {
                        console.log('setting beh vals', b.name, b.value);
                        cn.options[b.name] = b.value.val;
                        Object.keys(b.value).forEach((k)=>{
                            if (k !== 'val') cn.options[k] = b.value[k];
                        });
                    } else cn.options[b.name] = b.value;
                });
                self.slate.birdsEye?.nodeChanged(pkg);
                self.closeNodeSpecifics(pkg);
            },
            onNodeToBack (pkg) {
                resetMultiSelect();
                const cn = self.slate.nodes.one(pkg.data.id);
                cn.toBack();
                self.slate.birdsEye?.nodeChanged(pkg);
            },
            onNodeToFront (pkg) {
                resetMultiSelect();
                const cn = self.slate.nodes.one(pkg.data.id);
                cn.toFront();
                self.slate.birdsEye?.nodeChanged(pkg);
            },
            onNodeShapeChanged (pkg) {
                const cn = self.slate.nodes.one(pkg.data.id);
                cn.shapes.set(pkg.data);
                self.slate.birdsEye?.nodeChanged(pkg);
                self.closeNodeSpecifics(pkg);
            },
            onNodeAdded (pkg) {
                resetMultiSelect();
                if (pkg.data.id) {
                    const cn = self.slate.nodes.one(pkg.data.id);
                    cn.connectors.createNode(pkg.data.skipCenter, pkg.data.options, pkg.data.targetXPos, pkg.data.targetYPos);
                } else if (pkg.data.multiSelectCopy) // this is a multiSelection copy
                self.slate.multiSelection.createCopiedNodes(pkg.data.nodeOptions, pkg.data.assocDetails);
                else {
                    // straight up node addition
                    const n = new $d70659fe9854f6b3$export$2e2bcd8739ae039(pkg.data.nodeOptions);
                    self.slate.nodes.add(n);
                }
            },
            onNodeImageChanged (pkg) {
                const cn = self.slate.nodes.one(pkg.data.id);
                cn.images.set(pkg.data.img, pkg.data.w, pkg.data.h);
                self.slate.birdsEye?.nodeChanged(pkg);
                self.closeNodeSpecifics(pkg);
            },
            onNodeDeleted (pkg) {
                resetMultiSelect();
                const cn = self.slate.nodes.one(pkg.data.id);
                cn.del();
                self.slate.birdsEye?.nodeDeleted(pkg);
            },
            onNodeResized (pkg) {
                resetMultiSelect();
                self.slate.toggleFilters(true, null, true);
                const cn = self.slate.nodes.one(pkg.data.id);
                cn.hideOwnMenus();
                const opts = {
                    associations: pkg.data.associations,
                    animate: true
                };
                Object.assign(cn.options, $i9J9X$lodashomit(pkg.data, [
                    'associations',
                    'textPosition'
                ]));
                cn.resize.animateSet(pkg.data, opts);
                self.slate.birdsEye?.nodeChanged(pkg);
                self.closeNodeSpecifics(pkg);
            },
            onNodeRotated (pkg) {
                resetMultiSelect();
                self.slate.toggleFilters(true, null, true);
                const cn = self.slate.nodes.one(pkg.data.id);
                // needs to be updated
                cn.options.textOffset = pkg.data.textOffset;
                cn.hideOwnMenus();
                const previousRotationAngle = cn.options.rotate.rotationAngle;
                const opts = {
                    associations: pkg.data.associations,
                    animate: true
                };
                Object.assign(cn.options, $i9J9X$lodashomit(pkg.data, 'associations'));
                cn.rotate.animateSet({
                    ...pkg.data,
                    rotationAngle: pkg.data.rotate.rotationAngle - previousRotationAngle
                }, opts);
                self.slate.birdsEye?.nodeChanged(pkg);
                self.closeNodeSpecifics(pkg);
            },
            onNodeColorChanged (pkg) {
                const cn = self.slate.nodes.one(pkg.data.id);
                cn.colorPicker.set(pkg.data);
                self.slate.birdsEye?.nodeChanged(pkg);
            },
            onNodeTextChanged (pkg) {
                const cn = self.slate.nodes.one(pkg.data.id);
                cn.editor.set(pkg.data.text, pkg.data.fontSize, pkg.data.fontFamily, pkg.data.fontColor, pkg.data.textOpacity, pkg.data.textXAlign, pkg.data.textYAlign);
                self.slate.birdsEye?.nodeChanged(pkg);
                self.slate.loadAllFonts();
            },
            addRelationship (pkg) {
                resetMultiSelect();
                self.slate.nodes.addRelationship(pkg.data);
                self.slate.birdsEye?.relationshipsChanged(pkg);
            },
            removeRelationship (pkg) {
                resetMultiSelect();
                self.slate.nodes.removeRelationship(pkg.data);
                self.slate.birdsEye?.relationshipsChanged(pkg);
            },
            onNodesMove (pkg) {
                resetMultiSelect();
                self.slate.toggleFilters(true, null, true);
                self.slate.nodes.moveNodes(pkg, {
                    animate: pkg.data.dur > 0
                });
                self.slate.birdsEye?.nodeChanged(pkg);
                self.closeNodeSpecifics(pkg);
            },
            onNodeEffectChanged (pkg) {
                const cn = self.slate.nodes.one(pkg.data.id);
                cn.applyFilters(pkg.data.filter);
            },
            onNodeBorderPropertiesChanged (pkg) {
                const cn = self.slate.nodes.one(pkg.data.id);
                cn.applyBorder(pkg.data);
            },
            onLinePropertiesChanged (pkg) {
                const upkg = pkg;
                self.slate.toggleFilters(true, null, true);
                if (!upkg.data.forEach) upkg.data = [
                    upkg.data
                ];
                upkg.data.forEach((p)=>{
                    const cn = self.slate.nodes.one(p.id);
                    Object.assign(cn.options, p.options);
                    cn.lineOptions.set(p);
                });
            },
            onFollowMeChanged (pkg) {
                self.slate.options.followMe = pkg.data?.followMe;
            },
            onCanvasMove (pkg) {
                if (self.slate.options.followMe) {
                    self.slate.toggleFilters(true, null, true);
                    const opts = {
                        x: pkg.data.left,
                        y: pkg.data.top,
                        dur: pkg.data.duration || 500,
                        callback: {
                            after () {
                                self.slate.birdsEye?.refresh(true);
                            }
                        },
                        isAbsolute: !pkg.isRelative
                    };
                    self.slate.canvas.move(opts);
                }
            },
            onSlateThemeChanged (pkg) {
                self.slate.options.themeId = pkg.data?.theme?._id;
                if (pkg.data?.theme) self.slate.applyTheme(pkg.data.theme, pkg.data.syncWithTheme);
            },
            onSlateLayoutStrategyChanged (pkg) {
                self.slate.options.layoutStrategy = pkg.data.layoutStrategy;
            },
            onSlateBackgroundEffectChanged (pkg) {
                self.slate.options.containerStyle.backgroundEffect = pkg.data.effect;
                self.slate.canvas.hideBg(1);
            // self.slate.png({ backgroundOnly: true, base64: true }, (base64) => {
            //   self.slate.canvas.internal.style.background = base64;
            //   self.slate.canvas._bg?.remove();
            // });
            },
            onSlateBackgroundImageChanged (pkg) {
                if (pkg.data.bg) {
                    self.slate.options.containerStyle.backgroundImage = pkg.data.bg.url;
                    self.slate.options.containerStyle.backgroundSize = pkg.data.bg.size;
                } else {
                    const c = self.slate.options.containerStyle.prevBackgroundColor || '#fff';
                    self.slate.options.containerStyle.backgroundColor = c;
                    self.slate.options.containerStyle.backgroundImage = null;
                    self.slate.options.containerStyle.backgroundEffect = null;
                }
                self.slate.canvas.hideBg(1);
            },
            onSlateBackgroundColorChanged (pkg) {
                self.slate.options.containerStyle.backgroundColor = pkg.data.color;
                self.slate.options.containerStyle.backgroundColorAsGradient = pkg.data.asGradient;
                self.slate.options.containerStyle.backgroundGradientType = pkg.data.gradientType;
                self.slate.options.containerStyle.backgroundGradientColors = pkg.data.gradientColors;
                self.slate.options.containerStyle.backgroundGradientStrategy = pkg.data.gradientStrategy;
                self.slate.options.containerStyle.backgroundImage = null;
                self.slate.options.containerStyle.backgroundEffect = null;
                self.slate.canvas.hideBg(1);
            },
            onLineColorChanged (pkg) {
                self.slate.options.defaultLineColor = pkg.data.color;
                self.slate.nodes.allNodes.forEach((n)=>{
                    n.options.lineColor = pkg.data.color;
                    n.relationships.associations.forEach((a)=>{
                        a.lineColor = pkg.data.color;
                    });
                    n.relationships.refreshOwnRelationships();
                });
            },
            onSlateNameChanged (pkg) {
                self.slate.options.name = pkg.data.name;
            },
            onSlateDescriptionChanged (pkg) {
                self.slate.options.description = pkg.data.description;
            },
            onSlateShowGridChanged (pkg) {
                self.slate.options.viewPort.showGrid = pkg.data.showGrid;
                if (pkg.data.showGrid) self.slate.grid.show();
                else self.slate.grid.destroy();
            },
            onSlateMindMapModeChanged (pkg) {
                self.slate.options.mindMapMode = pkg.data.mindMapMode;
            },
            onSlateAutoResizeNodesBasedOnTextChanged (pkg) {
                self.slate.options.autoResizeNodesBasedOnText = pkg.data.autoResizeNodesBasedOnText;
            },
            onSlateTagsAndTemplateMarkdownChanged (pkg) {
                self.slate.options.tags = pkg.data.tags;
                self.slate.options.templateMarkdown = pkg.data.templateMarkdown;
                self.slate.options.templatePrompt = pkg.data.templatePrompt;
            },
            onSlateTemplateChanged (pkg) {
                self.slate.options.isTemplate = pkg.data.isTemplate;
            },
            onSlateSnapToObjectsChanged (pkg) {
                self.slate.options.viewPort.snapToObjects = pkg.data.snapToObjects;
            },
            onSlateFollowMeChanged (pkg) {
                self.slate.options.followMe = pkg.data.followMe;
            },
            onSlateHuddleChanged (pkg) {
                if (pkg.data.huddleType != null) self.slate.options.huddleType = pkg.data.huddleType;
                if (pkg.data.huddleEnabled != null) self.slate.options.huddleEnabled = pkg.data.huddleEnabled;
            }
        } // this invoker
        ;
        if (self.pc.onCollaboration) self.pc.onCollaboration({
            type: 'init',
            slate: self.slate,
            cb (pkg) {
                self._process(pkg);
            }
        });
        if (self.pc.localizedOnly) $c09005a36c8880c7$export$2e2bcd8739ae039.localRecipients.push(self);
    }
    _process(pkg) {
        const self = this;
        if ($c09005a36c8880c7$export$2e2bcd8739ae039.localRecipients.length > 1) {
            let _time = 0;
            $c09005a36c8880c7$export$2e2bcd8739ae039.localRecipients.forEach((s)=>{
                _time += 10;
                ((rec, t)=>{
                    setTimeout(()=>{
                        rec.collab.invoke(pkg);
                    }, t);
                })($c09005a36c8880c7$export$2e2bcd8739ae039.localRecipients[s], _time);
            });
        } else if (self.invoker[pkg.type]) self.invoker[pkg.type](pkg);
        else if (self.pc.onCollaboration) self.pc.onCollaboration({
            type: 'custom',
            slate: self.slate,
            pkg: pkg
        });
    }
    invoke(pkg) {
        const self = this;
        let packages = pkg;
        if (!Array.isArray(packages)) packages = [
            packages
        ];
        for (let pkg1 of packages)if (self.invoker[pkg1.type]) self.invoker[pkg1.type](pkg1);
    }
    closeNodeSpecifics(pkg) {
        const self = this;
        const all = pkg.data.nodeOptions ? pkg.data.nodeOptions : [
            pkg.data
        ];
        all.forEach((n)=>{
            // close self node's marker if open
            const nx1 = self.slate.nodes.one(n.id);
            if (nx1) {
                nx1.menu?.hide();
                nx1.connectors?.remove();
                nx1.resize?.hide();
                nx1.rotate?.hide();
                nx1.relationships.associations.forEach((association)=>{
                    nx1.lineOptions?.hide(association.id);
                });
            } else console.error('Unable to find node with id', n.id, 'currentIds', self.slate.nodes.allNodes.map((nx)=>nx.options.id
            ));
        });
        // remove any context menus
        self.slate.removeContextMenus();
        self.slate.untooltip();
    }
    send(pkg) {
        const self = this;
        let packages = pkg;
        if (!Array.isArray(packages)) packages = [
            packages
        ];
        if (packages[0].type !== 'onMouseMoved') {
            if (self.slate.undoRedo && self.slate.options.showUndoRedo) self.slate.undoRedo.snap();
        }
        if (self.pc.allow) {
            if (self.slate.options?.onSlateChanged) self.slate.options.onSlateChanged.apply(self, [
                packages
            ]);
            if (self.pc.onCollaboration) self.pc.onCollaboration({
                type: 'process',
                slate: self.slate,
                pkg: packages
            });
        }
    }
}






function $ac8758a7f1503a19$export$2e2bcd8739ae039(p, options) {
    let lx = p.x - 5;
    let tx = p.x + options.width / 2;
    let ty = p.y + options.height / 2;
    if (options.vectorPath === 'ellipse') {
        lx = p.cx - 5;
        tx = p.cx;
        ty = p.cy;
    }
    return {
        lx: lx,
        tx: tx,
        ty: ty
    };
}





class $eb3767c9e63a8879$export$2e2bcd8739ae039 {
    constructor(slate, node){
        this.slate = slate;
        this.node = node;
    }
    setTextOffset() {
        if (this.node.options.allowDrag) {
            this.node.options.textBounds = this.node.vect.getBBox();
            this.node.options.textOffset = {
                x: this.node.options.textBounds.cx - this.node.options.textBounds.width / 2 - this.node.options.xPos,
                y: this.node.options.textBounds.cy - this.node.options.yPos,
                width: this.node.options.textBounds.width,
                height: this.node.options.textBounds.height
            };
        }
    }
    set(t, s, f, c, opacity, ta, tb, isCategory) {
        const tempShim = `§` // utils.guid().substring(3);
        ;
        if (!t && t !== '') t = this.node.options.text || tempShim;
        if (!s) s = this.node.options.fontSize || 12;
        if (opacity == null) opacity = this.node.options.textOpacity || 1;
        if (!f) f = this.node.options.fontFamily || 'Roboto';
        if (!c) c = this.node.options.foregroundColor || '#000';
        if (!ta) ta = this.node.options.textXAlign || 'middle';
        if (!tb) tb = this.node.options.textYAlign || 'middle';
        // ensure text is always legible if it is set to the same as background
        if (c === this.node.options.backgroundColor) c = $c09005a36c8880c7$export$2e2bcd8739ae039.whiteOrBlack(this.node.options.backgroundColor);
        this.node.options.text = t;
        this.node.options.fontSize = s;
        this.node.options.fontFamily = f;
        this.node.options.foregroundColor = c;
        this.node.options.textOpacity = opacity;
        this.node.options.textXAlign = ta;
        this.node.options.textYAlign = tb;
        let coords = null;
        this.setTextOffset();
        coords = this.node.textCoords();
        if (!this.node.text) this.node.text = this.slate.paper.text(this.node.options.xPos + coords.x, this.node.options.yPos + coords.y, t);
        coords = this.node.textCoords({
            x: this.node.options.xPos,
            y: this.node.options.yPos
        });
        this.node.text.attr(coords);
        this.node.text.attr({
            text: t
        });
        this.node.text.attr({
            'font-size': `${s}pt`
        });
        this.node.text.attr({
            'font-family': f
        });
        this.node.text.attr({
            fill: c
        });
        this.node.text.attr({
            'text-anchor': ta
        });
        this.node.text.attr({
            'text-baseline': tb
        });
        this.node.text.attr({
            'fill-opacity': opacity
        });
        this.node.text.attr({
            class: 'slatebox-text'
        });
        const noSelect = [
            '-webkit-user-select',
            '-moz-user-select',
            '-ms-user-select',
            'user-select', 
        ].map((sx)=>`${sx}: none;`
        ).join(' ');
        this.node.text.attr({
            style: noSelect
        });
        if (this.slate.options.autoResizeNodesBasedOnText) {
            const textDimens = $c09005a36c8880c7$export$2e2bcd8739ae039.getTextWidth(this.node.options.text, `${this.node.options.fontSize}pt ${this.node.options.fontFamily}`);
            // don't replace text if the shape is alpha, otherwise the intent here is to copy the text
            // console.log(
            //   'textDimens',
            //   this.node.options.text,
            //   `${this.node.options.fontSize}pt ${this.node.options.fontFamily}`,
            //   textDimens.width,
            //   textDimens.fontBoundingBoxAscent + textDimens.fontBoundingBoxDescent
            // )
            let nodebb = this.node.vect.getBBox();
            const widthScalar = (textDimens.width - 20) / nodebb.width;
            const heightScalar = (textDimens.fontBoundingBoxAscent + textDimens.fontBoundingBoxDescent - 20) / nodebb.height;
            const scaledVectPath = $db87f2586597736c$export$508faed300ccdfb.transformPath(this.node.options.vectorPath, `s${widthScalar}, ${heightScalar}`).toString();
            this.node.options.vectorPath = scaledVectPath;
            nodebb = this.node.vect.getBBox();
            this.node.options.width = nodebb.width;
            this.node.options.height = nodebb.height;
            this.node.vect.attr({
                path: scaledVectPath
            });
            this.node.relationships && this.node.relationships.refreshOwnRelationships();
        }
        if (tempShim === t) {
            this.node.options.text = '';
            this.node.text.attr({
                text: ''
            });
        } else setTimeout(()=>{
            this.node.text.attr({
                text: t
            });
        }, 10);
    }
}



function $c2b1507df4cf6560$export$2e2bcd8739ae039(pathNode, point) {
    const pathLength = pathNode.getTotalLength();
    let precision = 64 // increase this value for better performance at a risk of worse point approximation; in future this should be scaled according to number of path segments (there could be a better solution)
    ;
    let best;
    let bestLength;
    let bestDistance = Infinity;
    function distance2(p) {
        // squared distance between two points
        const dx = p.x - point.x;
        const dy = p.y - point.y;
        return dx * dx + dy * dy;
    }
    // linear scan for coarse approximation
    for(let scan, scanLength = 0, scanDistance; scanLength <= pathLength; scanLength += precision)if ((scanDistance = distance2(scan = pathNode.getPointAtLength(scanLength))) < bestDistance) best = scan, bestLength = scanLength, bestDistance = scanDistance;
    // binary search for precise estimate
    precision /= 2;
    while(precision > 0.5){
        let before;
        let after;
        let beforeLength;
        let afterLength;
        let beforeDistance;
        let afterDistance;
        if ((beforeLength = bestLength - precision) >= 0 && (beforeDistance = distance2(before = pathNode.getPointAtLength(beforeLength))) < bestDistance) best = before, bestLength = beforeLength, bestDistance = beforeDistance;
        else if ((afterLength = bestLength + precision) <= pathLength && (afterDistance = distance2(after = pathNode.getPointAtLength(afterLength))) < bestDistance) best = after, bestLength = afterLength, bestDistance = afterDistance;
        else precision /= 2;
    }
    return {
        bestPoint: best,
        bestLength: bestLength
    };
}


function $37c83d39eaec81ae$export$2e2bcd8739ae039(originPoint, endPoint) {
    const x1 = originPoint.x;
    const y1 = originPoint.y;
    const x2 = endPoint.x;
    const y2 = endPoint.y;
    const middlePointX = (x1 + x2) / 2;
    return [
        'M',
        x1.toFixed(2),
        y1.toFixed(2),
        'C',
        middlePointX.toFixed(2),
        y1.toFixed(2),
        middlePointX.toFixed(2),
        y2.toFixed(2),
        x2.toFixed(2),
        y2.toFixed(2), 
    ].join(' ');
}


function $74ab9006c48ae34d$export$2e2bcd8739ae039(opts = {
}) {
    const originBB = opts.parent ? opts.parent.vect.getBBox() : opts.parent.vect.getBBox();
    const endBB = opts.child ? opts.child.vect.getBBox() : opts.child.vect.getBBox();
    function inn(val) {
        return !Number.isNaN(parseFloat(val)) && Number.isFinite(val);
    }
    const pcx = inn(originBB.cx) && originBB.cx;
    const pcy = inn(originBB.cy) && originBB.cy;
    const ccx = inn(endBB.cx) && endBB.cx;
    const ccy = inn(endBB.cy) && endBB.cy;
    let relevantParentMiddlePoint;
    const px1 = originBB.x;
    const py1 = originBB.y;
    const px2 = originBB.x2;
    const py2 = originBB.y;
    const px3 = originBB.x2;
    const py3 = originBB.y2;
    const px4 = originBB.x;
    const py4 = originBB.y2;
    /*
    generic line equation
    y = ((y2-y1)/(x2-x1)) * (x-x1) + y1

    line 1: line passing through upper left corner and bottom right corner
    y = ((py3 - py1)/(px3 - px1)) * (x - px1) + py1

    line 2: line passing through bottom left corner and upper right corner
    y = ((py2 - py4)/(px2 - px4)) * (x - px4) + py4
   */ // NOTE: comments below apply to a Cartesian coordinate system; the svg coordinate system is slightly different with (0,0) in upper left corner of the plane
    // it means that regular above means below here
    if (ccy >= (py3 - py1) / (px3 - px1) * (ccx - px1) + py1) {
        // means that child center point is above line 1
        if (ccy >= (py2 - py4) / (px2 - px4) * (ccx - px4) + py4) // means that child center point is above line 2
        relevantParentMiddlePoint = {
            x: pcx,
            y: py3
        };
        else // means that child center point is either below line 2 or is on line 2
        relevantParentMiddlePoint = {
            x: px1,
            y: pcy
        };
    } else // means that child center point is below line 1
    if (ccy >= (py2 - py4) / (px2 - px4) * (ccx - px4) + py4) // means that child center point is above line 2
    relevantParentMiddlePoint = {
        x: px2,
        y: pcy
    };
    else // means that child center point is either below line 2 or is on line 2
    relevantParentMiddlePoint = {
        x: pcx,
        y: py1
    };
    let relevantChildMiddlePoint;
    const cx1 = endBB.x;
    const cy1 = endBB.y;
    const cx2 = endBB.x2;
    const cy2 = endBB.y;
    const cx3 = endBB.x2;
    const cy3 = endBB.y2;
    const cx4 = endBB.x;
    const cy4 = endBB.y2;
    /*
   generic line equation
   y = ((y2-y1)/(x2-x1)) * (x-x1) + y1

   line 1: line passing through upper left corner and bottom right corner
   y = ((cy3 - cy1)/(cx3 - cx1)) * (x - cx1) + cy1

   line 2: line passing through bottom left corner and upper right corner
   y = ((cy2 - cy4)/(cx2 - cx4)) * (x - cx4) + cy4
   */ // NOTE: comments below apply to a Cartesian coordinate system; the svg coordinate system is slightly different with (0,0) in upper left corner of the plane
    // it means that regular above means below here
    if (pcy >= (cy3 - cy1) / (cx3 - cx1) * (pcx - cx1) + cy1) {
        // means that child center point is above line 1
        if (pcy >= (cy2 - cy4) / (cx2 - cx4) * (pcx - cx4) + cy4) // means that child center point is above line 2
        relevantChildMiddlePoint = {
            x: ccx,
            y: cy3
        };
        else // means that child center point is either below line 2 or is on line 2
        relevantChildMiddlePoint = {
            x: cx1,
            y: ccy
        };
    } else // means that child center point is below line 1
    if (pcy >= (cy2 - cy4) / (cx2 - cx4) * (pcx - cx4) + cy4) // means that child center point is above line 2
    relevantChildMiddlePoint = {
        x: cx2,
        y: ccy
    };
    else // means that child center point is either below line 2 or is on line 2
    relevantChildMiddlePoint = {
        x: ccx,
        y: cy1
    };
    return {
        child: relevantChildMiddlePoint,
        parent: relevantParentMiddlePoint
    };
}


function $16aae51a7872bfb0$export$2e2bcd8739ae039({ relationships: relationships , nodes: nodes , dx: dx = 0 , dy: dy = 0 ,  }) {
    relationships.forEach((r)=>{
        const midPoints = $74ab9006c48ae34d$export$2e2bcd8739ae039(r);
        let tempOriginNode;
        let tempEndNode;
        let linePath;
        if (nodes.some((n)=>n.options.id === r.parent.options.id
        )) {
            tempOriginNode = r.parent.getTempPathWithCorrectPositionFor({
                pathElement: r.parent.vect,
                dx: dx,
                dy: dy
            });
            tempEndNode = r.child.getTempPathWithCorrectPositionFor({
                // this one is all about rotation
                pathElement: r.child.vect,
                dx: 0,
                dy: 0
            });
            const childPathContext = $c2b1507df4cf6560$export$2e2bcd8739ae039(tempEndNode || r.child.vect, midPoints.parent);
            const pointOnChildPath = childPathContext.bestPoint;
            const parentPathContext = $c2b1507df4cf6560$export$2e2bcd8739ae039(tempOriginNode || r.parent.vect, pointOnChildPath);
            const pointOnParentPath = parentPathContext.bestPoint;
            linePath = $37c83d39eaec81ae$export$2e2bcd8739ae039(pointOnParentPath, pointOnChildPath);
        } else {
            tempEndNode = r.child.getTempPathWithCorrectPositionFor({
                pathElement: r.child.vect,
                dx: dx,
                dy: dy
            });
            tempOriginNode = r.parent.getTempPathWithCorrectPositionFor({
                // this one is all about rotation
                pathElement: r.parent.vect,
                dx: 0,
                dy: 0
            });
            const childPathContext = $c2b1507df4cf6560$export$2e2bcd8739ae039(tempEndNode || r.child.vect, midPoints.parent);
            const pointOnChildPath = childPathContext.bestPoint;
            const parentPathContext = $c2b1507df4cf6560$export$2e2bcd8739ae039(tempOriginNode || r.parent.vect, pointOnChildPath);
            const pointOnParentPath = parentPathContext.bestPoint;
            linePath = $37c83d39eaec81ae$export$2e2bcd8739ae039(pointOnParentPath, pointOnChildPath);
        }
        const _attr = {
            stroke: r.lineColor,
            fill: 'none',
            'stroke-width': r.lineWidth,
            'fill-opacity': r.lineOpacity,
            opacity: r.lineOpacity,
            filter: r.lineEffect ? `url(#${r.lineEffect})` : ''
        };
        // stop connection re-draws when shift+alt drag until the move is up because the lines are hidden anyways
        if (!(r.isAlt && r.isShift) || r.isAlt && r.isShift && r.isUp) _attr.path = linePath;
        if (r.showChildArrow) Object.assign(_attr, {
            'arrow-end': 'classic'
        });
        else Object.assign(_attr, {
            'arrow-end': 'none'
        });
        if (r.showParentArrow) Object.assign(_attr, {
            'arrow-start': 'classic'
        });
        else Object.assign(_attr, {
            'arrow-start': 'none'
        });
        r.line.attr(_attr);
        if (tempOriginNode) tempOriginNode.remove();
        if (tempEndNode) tempEndNode.remove();
    });
    // always push the grid back
    if (nodes.length > 0) {
        nodes[0].slate?.grid?.toBack();
        nodes[0].slate?.canvas?.bgToBack();
    }
}






class $83a856cccf23a598$export$2e2bcd8739ae039 {
    constructor(slate, node){
        const self = this;
        self.slate = slate;
        self.node = node;
        self.PATH_COMPLEXITY_LIMIT = 100000;
        self.associations = [];
        self._isLastAlt = false;
        self._isLastShift = false;
        self.selectedNodes = [];
        self.relationshipsToTranslate = [];
        self.relationshipsToRefresh = [];
        self._dx = 0;
        self._dy = 0;
        self.collabSent = null;
        self.slate.draggingNode = false;
        self.ft = null;
        self.kdTree = null;
        self.gracefulClear = null;
        self.dragEvents = {
            move (dx, dy) {
                if (!self.slate.isShift) self.enactMove(dx, dy);
            },
            async up () {
                if (!self.slate.isShift) self.finishDrag(true);
            },
            dragger (x, y, e) {
                if (!self.slate.canvas.isDragging) {
                    self.slate.nodes.closeAllMenus();
                    if (self.slate.isShift) {
                        if (!self.slate.candidatesForSelection[self.node.options.id]) {
                            self.slate.candidatesForSelection[self.node.options.id] = true;
                            self.slate.multiSelection.add(self.node);
                        } else {
                            delete self.slate.candidatesForSelection[self.node.options.id];
                            self.slate.multiSelection.remove(self.node);
                        }
                        $c09005a36c8880c7$export$2e2bcd8739ae039.stopEvent(e);
                    } else {
                        self.slate.multiSelection.clear();
                        self.slate.candidatesForSelection = {
                        };
                        self.node.toggleImage({
                            active: true
                        });
                        // hide filters
                        self.slate.toggleFilters(true) //, self.node.options.id
                        ;
                        // self.slate.canvas._bg?.hide();
                        if (self.node.events?.onClick) self.node.events.onClick.apply(self, [
                            function() {
                                self._initDrag(self, e);
                            }, 
                        ]);
                        else self._initDrag(self, e);
                    }
                }
            }
        };
    }
    showMenu(e) {
        const self = this;
        self.slate.nodes.closeAllMenus({
            exception: self.node.options.id
        });
        self.slate.enable();
        if (self.node?.menu?.show && self.node.options.allowMenu && !self.node.menu.isOpen()) {
            if (self.node?.options.groupId) self.slate.multiSelection.showGroup(self.node?.options.groupId);
            self.node.menu.show();
        }
        $c09005a36c8880c7$export$2e2bcd8739ae039.stopEvent(e);
    }
    finishDrag(blnBroadcast) {
        const self = this;
        self.slate.draggingNode = false;
        self.selectedNodes.forEach((nd)=>{
            // the transformPath here converts the transient transforms that happened during the movement
            // to become permanent on the "attr" properties.
            $c09005a36c8880c7$export$2e2bcd8739ae039.transformPath(nd, `T${self._dx},${self._dy}`);
            nd.vect.currentDx = 0;
            nd.vect.currentDy = 0;
            nd.editor.setTextOffset();
        });
        $16aae51a7872bfb0$export$2e2bcd8739ae039({
            relationships: self.relationshipsToRefresh,
            nodes: self.selectedNodes,
            dx: 0,
            dy: 0
        });
        self.slate.nodes.saveRelationships(self.relationshipsToTranslate, {
            dx: self._dx,
            dy: self._dy
        });
        if (blnBroadcast) {
            self.send({
                nodes: self.selectedNodes,
                relationships: self.relationshipsToRefresh.concat(self.relationshipsToTranslate)
            });
            self.selectedNodes.forEach((n)=>{
                n.relationships.showAll(true);
            });
            if (self.foreignPoints?.length > 0) {
                self.kdTree.dispose();
                delete self.foreignPoints;
                clearTimeout(self.gracefulClear);
                self.gracefulClear = setTimeout(()=>{
                    self.node.gridLines.clear();
                }, 200);
            }
        }
        // console.log("here we go", self.selectedNodes);
        // self.slate.canvas._bg?.show();
        // finish drag
        self.slate.toggleFilters(false);
        self.showMenu();
    }
    enactMove(dx, dy, blnFinish) {
        const self = this;
        dx = Math.ceil(dx);
        dy = Math.ceil(dy);
        // adjust the dx and dy if snapping to grid
        // if (slate.options.viewPort.showGrid && slate.options.viewPort.snapToGrid) {
        //   let gridSize = slate.options.viewPort.gridSize || 10;
        //   dx = Math.round(dx / gridSize) * gridSize;
        //   dy = Math.round(dy / gridSize) * gridSize;
        // }
        const z = self.slate.options.viewPort.zoom.r;
        dx += dx / z - dx;
        dy += dy / z - dy;
        self.selectedNodes.forEach((nd, i)=>{
            nd.vect.currentDx = dx;
            nd.vect.currentDy = dy;
            nd.translateWith({
                dx: dx,
                dy: dy
            });
            // console.log("yPos ", i, node.options.yPos);
            // only snap and show guidelines for primary moving node, none of its children
            if (i === 0 && nd.options.id !== self.slate.tempNodeId) {
                // const nbb = node.vect.getBBox();
                const nearest = self.kdTree.knn([
                    nd.options.xPos,
                    nd.options.yPos
                ], 2) // , 1);
                ;
                nearest.forEach((n)=>{
                    ({ dx: dx , dy: dy  } = self.node.gridLines.draw(self.foreignPoints[n].id, dx, dy, self.foreignPoints[n].bbox));
                });
            }
        });
        self.slate.nodes.translateRelationships(self.relationshipsToTranslate, {
            dx: dx,
            dy: dy
        });
        $16aae51a7872bfb0$export$2e2bcd8739ae039({
            relationships: self.relationshipsToRefresh,
            nodes: self.selectedNodes,
            dx: dx,
            dy: dy
        });
        self._dx = dx;
        self._dy = dy;
        if (blnFinish) self.finishDrag(false);
    }
    _broadcast(pkg) {
        this.slate.collab?.send(pkg);
    }
    _hitTest(mp) {
        const self = this;
        let overNode = null;
        const off = $c09005a36c8880c7$export$2e2bcd8739ae039.positionedOffset(self.slate.options.container);
        self.slate.nodes.allNodes.forEach((nd)=>{
            if (nd.options.id !== self.slate.tempNodeId && nd.options.id !== self.node.options.id && nd.options.allowContext && nd.options.allowResize) {
                const _bb = nd.vect.getBBox();
                const _zr = self.slate.options.viewPort.zoom.r;
                const xp = self.slate.options.viewPort.left + mp.x - off.left;
                const yp = self.slate.options.viewPort.top + mp.y - off.top;
                const c = {
                    x: xp + (xp / _zr - xp),
                    y: yp + (yp / _zr - yp)
                };
                if (c.x > _bb.x && c.x < _bb.x + _bb.width && c.y > _bb.y && c.y < _bb.y + _bb.height) overNode = nd;
            }
        });
        return overNode;
    }
    _remove(associations, type, obj) {
        const _na = [];
        const self = this;
        associations.forEach((association)=>{
            if (association[type].options.id === obj.options.id) self.removeRelationship(association);
            else _na.push(association);
        });
        return _na;
    }
    _initDrag(vect, e) {
        const self = this;
        self.selectedNodes = [];
        self.relationshipsToRefresh = [];
        self.relationshipsToTranslate = [];
        self.collabSent = false;
        self.slate.draggingNode = true;
        self._dx = 0;
        self._dy = 0;
        self.slate.multiSelection?.end();
        if (self.slate.options.linking) self.slate.options.linking.onNode.apply(vect, [
            self
        ]);
        else if (self.node.options.allowDrag && !self.node.options.disableDrag) {
            self.selectedNodes = self.getSelectedNodes();
            const _associations = self.slate.nodes.getRelevantAssociationsWith(self.selectedNodes);
            self.relationshipsToTranslate = _associations.relationshipsToTranslate;
            self.relationshipsToRefresh = _associations.relationshipsToRefresh;
            self.selectedNodes.forEach((n)=>{
                n.setStartDrag();
                n.vect.ox = n.options.xPos;
                n.vect.oy = n.options.yPos;
            });
            const selectedIds = self.selectedNodes.map((n)=>n.options.id
            );
            self.foreignPoints = self.slate.nodes.allNodes.filter((n)=>selectedIds.indexOf(n.options.id) === -1
            ).map((n)=>({
                    id: n.options.id,
                    bbox: n.vect.getBBox(),
                    point: [
                        n.options.xPos,
                        n.options.yPos
                    ]
                })
            );
            self.kdTree = $i9J9X$statickdtree(self.foreignPoints.map((fp)=>fp.point
            ));
            self.conditionallyHideAll();
        } else $c09005a36c8880c7$export$2e2bcd8739ae039.stopEvent(e);
    }
    async initiateTempNode(e, _parent, _assocPkg) {
        const self = this;
        const mp = $c09005a36c8880c7$export$2e2bcd8739ae039.mousePos(e);
        const _slate = _parent.slate;
        const off = $c09005a36c8880c7$export$2e2bcd8739ae039.positionedOffset(_slate.options.container);
        const _zr = self.slate.options.viewPort.zoom.r;
        const xp = _slate.options.viewPort.left + mp.x - off.left;
        const yp = _slate.options.viewPort.top + mp.y - off.top;
        const _xPos = xp + (xp / _zr - xp);
        const _yPos = yp + (yp / _zr - yp);
        const _path = $c09005a36c8880c7$export$2e2bcd8739ae039._transformPath($2197852bc26081e6$export$2e2bcd8739ae039.icons.handle, `T${_xPos - 15}, ${_yPos - 15}`);
        const _tempNode = new $d70659fe9854f6b3$export$2e2bcd8739ae039({
            id: self.slate.tempNodeId,
            xPos: _xPos,
            yPos: _yPos,
            lineColor: '#990000',
            backgroundColor: '#ffffff',
            vectorPath: _path,
            width: 30,
            height: 30
        });
        _slate.nodes.add(_tempNode, true);
        const _tempRelationship = _parent.relationships.addAssociation(_tempNode, _assocPkg, true);
        _tempRelationship.hoveredOver = null;
        _tempRelationship.lastHoveredOver = null;
        // initiates the drag
        _tempNode.vect.start(e) // , off.x, off.y);
        ;
        _slate.options.allowDrag = false;
        _tempNode.vect.mousemove((ex)=>{
            // is there a current hit?
            if (_tempRelationship.hoveredOver === null) {
                _tempRelationship.hoveredOver = self._hitTest($c09005a36c8880c7$export$2e2bcd8739ae039.mousePos(ex));
                if (_tempRelationship.hoveredOver !== null) // yes, currently over a node -- scale it
                _tempRelationship.hoveredOver.vect.animate({
                    'stroke-width': 5
                }, 500, ()=>{
                    _tempRelationship.hoveredOver.vect.animate({
                        'stroke-width': self.node.options.borderWidth
                    }, 500, ()=>{
                        _tempRelationship.hoveredOver = null;
                    });
                });
            }
        });
        _tempNode.vect.mouseup((ex)=>{
            _parent.relationships.removeAssociation(_tempNode);
            _tempNode.slate.nodes.remove(_tempNode);
            const overNode = self._hitTest($c09005a36c8880c7$export$2e2bcd8739ae039.mousePos(ex));
            if (overNode !== null) {
                // overNode.vect.transform("s1,1,");
                // check if overNode has any parents
                const _relevantAssociations = overNode.relationships.associations.filter((association)=>overNode.options.id === association.child.options.id
                );
                overNode.options.parents = _relevantAssociations.map((a)=>a.parent.options.id
                );
                // check if the two nodes are already associated -- multiple associations between two nodes are currently not supported
                const relevantAssociation = _parent.relationships.associations.find((association)=>association.child.options.id === overNode.options.id && association.parent.options.id === _parent.options.id || association.parent.options.id === overNode.options.id && association.child.options.id === _parent.options.id
                );
                if (!relevantAssociation) {
                    _parent.relationships.addAssociation(overNode, _assocPkg);
                    const _pkgx = {
                        type: 'addRelationship',
                        data: {
                            type: 'association',
                            parent: _parent.options.id,
                            child: overNode.options.id
                        }
                    };
                    self.slate.birdsEye?.relationshipsChanged(_pkgx);
                    self._broadcast(_pkgx);
                }
            }
            if (self.slate.options.enabled) _parent.slate.options.allowDrag = true;
        });
    }
    _visibility(action) {
        if (this.node.options.id !== this.slate.tempNodeId) for(let i = this.associations.length; i < this.associations.length; i += 1)this.associations[i].line[action]();
    }
    removeAll() {
        const self = this;
        self.associations.forEach((association)=>{
            association.child.relationships.removeAssociation(self.node) // .parent);
            ;
            association.parent.relationships.removeAssociation(self.node);
            self.removeRelationship(association);
        });
        self.associations = [];
    }
    removeAssociation(_node) {
        this.associations = this._remove(this.associations, 'child', _node);
        this.associations = this._remove(this.associations, 'parent', _node);
        return this;
    }
    setKeys({ isShift: isShift , isAlt: isAlt  }) {
        this._isLastShift = isShift;
        this._isLastAlt = isAlt;
    }
    addAssociation(_node, assocPkg) {
        assocPkg = assocPkg || {
        };
        // make sure this doesn't already exist
        let _connection = this.associations.find((a)=>a.child.options.id === _node.options.id
        );
        if (!_connection) {
            const _copts = {
                id: $c09005a36c8880c7$export$2e2bcd8739ae039.guid(),
                parent: this.node,
                child: _node,
                lineColor: assocPkg.lineColor || this.node.options.lineColor,
                lineWidth: assocPkg.lineWidth || this.node.options.lineWidth,
                lineOpacity: assocPkg.lineOpacity != null ? assocPkg.lineOpacity : this.node.options.lineOpacity,
                lineEffect: assocPkg.lineEffect || this.node.options.lineEffect,
                blnStraight: assocPkg.isStraightLine || false,
                showParentArrow: assocPkg.showParentArrow || false,
                showChildArrow: assocPkg.showChildArrow || true
            };
            _connection = this.createNewRelationship(_copts);
            _connection.line.toBack();
            this.associations.push(_connection);
            _node.relationships.associations.push(_connection);
            this.wireLineEvents(_connection);
        }
        _node.slate.allLines.push(_connection) // helper for managing raw line attrs
        ;
        return _connection;
    }
    createNewRelationship(opts) {
        const { paper: paper  } = this.slate;
        const association = {
            parent: null,
            child: null,
            lineColor: '#fff',
            lineOpacity: 1,
            lineEffect: '',
            lineWidth: 20,
            blnStraight: false,
            showParentArrow: false,
            showChildArrow: true
        };
        Object.assign(association, opts);
        const _attr = {
            stroke: association.lineColor,
            class: 'association',
            fill: 'none',
            'stroke-width': association.lineWidth,
            'fill-opacity': association.lineOpacity,
            filter: association.lineEffect ? `url(#${association.lineEffect})` : '',
            opacity: association.lineOpacity
        };
        // these two generic points will be adjusted after the line is created
        const origPoint = {
            x: 1,
            y: 1
        };
        const endPoint = {
            x: 200,
            y: 200
        };
        if (!association.line) Object.assign(association, {
            line: paper.path($37c83d39eaec81ae$export$2e2bcd8739ae039(origPoint, endPoint)).attr(_attr)
        });
        if (association.child && association.parent) $16aae51a7872bfb0$export$2e2bcd8739ae039({
            relationships: [
                association
            ],
            nodes: [
                association.parent
            ]
        });
        return association;
    }
    removeRelationship(association) {
        const self = this;
        self.node.slate?.allLines.splice(self.slate?.allLines.findIndex((l)=>l.id === association.id
        ));
        association.line.remove();
    }
    wireLineEvents(c) {
        const self = this;
        if (self.node.options.allowMenu) {
            c.line.node.style.cursor = 'pointer';
            c.line.mousedown((e)=>{
                $c09005a36c8880c7$export$2e2bcd8739ae039.stopEvent(e);
                self.node.lineOptions.show(e, c);
            });
            self.slate?.grid.toBack();
            self.slate?.canvas.bgToBack();
        }
    }
    getSelectedNodes() {
        const self = this;
        self.selectedNodes = [];
        if (self.node.options.isLocked === false) {
            self.selectedNodes.push(self.node);
            this.syncAssociations(self.node, (c, a)=>{
                if (!self.selectedNodes.some((n)=>n.options.id === c.options.id
                ) && c.options.isLocked === false) self.selectedNodes.push(c);
            });
        }
        return self.selectedNodes;
    }
    syncAssociations(nd, cb) {
        const self = this;
        if (!self.slate.isCtrl || self.slate.isCtrl && self.slate.isShift) nd.relationships.associations.forEach((a)=>{
            if (a.child.options.id !== self.node.options.id && a.child.options.id !== nd.options.id) {
                if (cb) cb(a.child, a);
                if (self.slate.isCtrl && self.slate.isShift) self.syncAssociations(a.child, cb);
            }
        });
    }
    updateAssociationsWith(opts) {
        const conditionalSet = {
        };
        if (opts.conditional) {
            opts.conditional.forEach((setContext, i)=>{
                conditionalSet[i] = setContext;
            });
            delete opts.conditional;
        }
        this.associations.forEach((a)=>{
            Object.assign(a, opts);
            Object.keys(conditionalSet).forEach((sc)=>{
                const setContext = conditionalSet[sc];
                if (setContext.condition(a, setContext.data)) a[setContext.key] = setContext.getValue(a, setContext.data);
            });
        });
    }
    updateSingleAssociationWith(key, opts) {
        const association = this.associations.find(a, key);
        if (association) Object.assign(association, opts);
    }
    send(opts) {
        if (this.node.context && !this.node.context.isVisible() && this.node.options.allowDrag && !this.node.options.disableDrag) {
            const pkg = {
                type: 'onNodesMove'
            };
            if (opts.nodes && opts.relationships) pkg.data = this.slate.nodes.nodeMovePackage({
                nodes: opts.nodes,
                relationships: opts.relationships
            });
            else pkg.data = this.slate.nodes.nodeMovePackage();
            this.slate.collab?.send(pkg);
            this.slate.birdsEye?.nodeChanged(pkg);
            this.collabSent = true;
        }
    }
    conditionallyHideAll() {
        const self = this;
        if (self.node.options.id !== self.slate.tempNodeId) {
            const exceeds = self.node.options.vectorPath.length > self.PATH_COMPLEXITY_LIMIT;
            if (exceeds) self.hideAll(true);
            self.associations.forEach((a)=>{
                const cexceed = exceeds || a.child.options.vectorPath.length > self.PATH_COMPLEXITY_LIMIT;
                a.child.relationships.hideAll(cexceed);
            });
        }
    }
    hideAll(_blnOverride) {
        if (this.slate.isAlt && this.slate.isShift || _blnOverride) this._visibility('hide');
    }
    hideOwn() {
        this.associations.forEach((association)=>{
            association.line.hide();
        });
    }
    showOwn() {
        this.associations.forEach((association)=>{
            association.line.show();
        });
    }
    showAll(_blnOverride) {
        if (this._isLastAlt && this._isLastShift || _blnOverride) this._visibility('show');
    }
    refreshOwnRelationships() {
        $16aae51a7872bfb0$export$2e2bcd8739ae039({
            relationships: this.associations,
            nodes: [
                this.node
            ]
        });
    }
    wireDragEvents() {
        const self = this;
        function showText() {
            self.slate.events?.onTextPaneRequested?.apply(this, [
                self.node,
                ()=>{
                }
            ]);
        }
        if (!self.slate.isReadOnly() && (!self.slate.isCommentOnly() || self.slate.isCommentOnly() && self.node.options.isComment)) {
            self.node.vect.drag(self.dragEvents.move, self.dragEvents.dragger, self.dragEvents.up);
            self.node.text.mousedown((e)=>{
                self.node.vect.start(e);
            });
            self.node.vect.dblclick(()=>{
                showText();
            });
            self.node.text.dblclick(()=>{
                showText();
            });
        }
    }
}




class $153ebcbc4f900f73$export$2e2bcd8739ae039 {
    static getRotationAngle(origPoint, newPoint, centerPoint) {
        const vx = origPoint.x - centerPoint.x;
        const vy = origPoint.y - centerPoint.y;
        const ux = newPoint.x - centerPoint.x;
        const uy = newPoint.y - centerPoint.y;
        const magnitudeV = Math.sqrt(vx ** 2 + vy ** 2);
        const magnitudeU = Math.sqrt(ux ** 2 + uy ** 2);
        let angleDegrees;
        if (vx === 0 && vy === 0 || ux === 0 && uy === 0 || vx === ux && vy === uy) ;
        else {
            const cosine = (vx * ux + vy * uy) / (magnitudeV * magnitudeU);
            const angleRadians = Math.acos(cosine);
            angleDegrees = angleRadians * 180 / Math.PI // unsigned angle
            ;
            const detVxU = vx * uy - vy * ux // cross product of V and U (VxU)
            ;
            if (detVxU < 0) angleDegrees = -angleDegrees // add negative sign
            ;
        }
        return angleDegrees;
    }
    set(rotateAngle) {
        const self = this;
        const useRotationAngle = rotateAngle || self.rotationAngle;
        self.rotate.transform(`R${self.rotationAngle}, ${self.origCenter.x}, ${self.origCenter.y}`);
        const rotationContext = {
            rotate: {
                rotationAngle: (self.node.options.rotate.rotationAngle + useRotationAngle) % 360,
                point: self.origCenter
            }
        };
        const transformString = self.node.getTransformString(rotationContext);
        self.node.vect.transform(transformString);
        self.node.text.transform(transformString);
    }
    constructor(slate, node){
        const self = this;
        self.slate = slate;
        self.node = node;
        self.rotate = null;
        self.rotateTemp = null;
        self._dragAllowed = false;
        self._isResizing = false;
        self._initPosFix = false;
        self.origCenter = {
        } // during rotation raphael changes the center point of bbox for some reason
        ;
        self.rotationAngle = null;
        self.relationshipsToTranslate = [];
        self.relationshipsToRefresh = [];
        self.selectedNodes = [];
        self.rotateEvents = {
            start () {
                const s = this;
                self.selectedNodes = self.node.relationships.getSelectedNodes();
                const _associations = self.slate.nodes.getRelevantAssociationsWith(self.selectedNodes);
                self.relationshipsToTranslate = _associations.relationshipsToTranslate;
                self.relationshipsToRefresh = _associations.relationshipsToRefresh;
                self.slate.isBeingResized = true;
                self._initPosFix = false;
                self.rotateTemp.attr({
                    x: self.rotateTemp.attr('x') - 1000,
                    y: self.rotateTemp.attr('y') - 1000,
                    width: 10000,
                    height: 10000
                });
                self.rotate.ox = self.rotate.attr('x');
                self.rotate.oy = self.rotate.attr('y');
                self.node.relationships.updateAssociationsWith({
                    activeNode: self.node.options.id,
                    currentDx: 0,
                    currentDy: 0,
                    action: 'rotate'
                });
                self._isResizing = true;
                const tempPath = self.slate.paper.path(self.node.vect.attr('path'));
                const noRotationBB = tempPath.getBBox();
                if (!self.node.options.rotate?.point || Object.entries(self.node.options.rotate.point).length === 0) self.node.options.rotate.point = {
                    x: noRotationBB.cx,
                    y: noRotationBB.cy
                };
                tempPath.remove();
                self.slate.multiSelection?.end();
                s.ox = noRotationBB.x;
                s.oy = noRotationBB.y;
                self.origCenter = self.node.options.rotate.point;
                self.foreignPoints = self.slate.nodes.allNodes.filter((n)=>n.options.id !== self.node.options.id
                ).map((n)=>({
                        id: n.options.id,
                        bbox: n.vect.getBBox(),
                        point: [
                            n.options.xPos,
                            n.options.yPos
                        ]
                    })
                );
                self.kdTree = $i9J9X$statickdtree(self.foreignPoints.map((fp)=>fp.point
                ));
                self.node.setStartDrag();
                self.node.connectors.remove();
                self.node.resize.hide();
                self._dragAllowed = self.slate.options.allowDrag;
                self.slate.disable(false, true);
                self.slate.toggleFilters(true, self.node.options.id);
            },
            move (dx, dy) {
                const s = this;
                try {
                    // for snapping
                    const nearest = self.kdTree.knn([
                        node.options.xPos,
                        node.options.yPos
                    ], 5);
                    nearest.forEach((n)=>{
                        self.node.gridLines.draw(self.foreignPoints[n].id, dx, dy, self.foreignPoints[n].bbox, false, 200);
                    });
                    /*
          Rotation angle is obtained using vector properties. Further explanation can be found here: https://stackoverflow.com/questions/10507620/finding-the-angle-between-vectors
          Vectors are of form:
          v = <vx, vy>
          u = <ux, uy>
          Notation explanation:
          ||v|| - magnitude of vector v
          v . u - dot product of vectors u and v (commutative)
          v x u - cross product of vectors v and u (not commutative!); for 2D vectors it is essentially the determinant of a 2D matrix created by v and u
    
          cos(angle) = (v . u)/(||v|| * ||u||)
          angle = arccos((v . u)/(||v|| * ||u||))
          angle is unsigned, i.e. it assumes values 0 and PI radians
    
          If v x u < 0 then the angle needs a negative sign; otherwise the sign is already correct.
    
          If either vector is a 0 vector, i.e. v = <0, 0> or u = <0, 0> then the angle between v and u does not exist
          and the function will return an undefined angle.
    
          The returned angle is converted to degrees and is between -180 and 180.
          */ self.rotationAngle = $153ebcbc4f900f73$export$2e2bcd8739ae039.getRotationAngle({
                        x: s.ox,
                        y: s.oy
                    }, {
                        x: s.ox + dx,
                        y: s.oy + dy
                    }, self.origCenter);
                    if (self.rotationAngle) // const _ra = Math.abs(Math.ceil(self.node.vect.matrix.split().rotate));
                    // const _ra = Math.abs(Math.ceil(self.rotationAngle)); //
                    // if (!self.node.snappedAt && ([0, 45, 90, 135, 180, 225, 270].indexOf(_ra) > -1)) { //% 45 === 0 || _ra === 0 || (_ra + 1) % 270 === 0)) {
                    //   console.log("snapped ra is ", self.node.options.rotate.rotationAngle, self.rotationAngle, _ra, self.node.vect.matrix.split().rotate);
                    //   //self.rotationAngle = _ra;
                    //   //self.rotationAngle = Math.abs(Math.ceil(self.rotationAngle));
                    //   self.node.snappedAt = _ra; // self.rotationAngle;
                    //   _rta();
                    // } else if (self.rotationAngle >= self.node.snappedAt + 25 || self.rotationAngle <= self.node.snappedAt - 25) {
                    //   delete self.node.snappedAt;
                    // }
                    {
                        if (!self.node.snappedAt) self.set();
                    }
                } catch (err) {
                    finalize();
                }
            },
            up () {
                finalize();
                self.slate.toggleFilters(false, self.node.options.id);
            }
        };
        function finalize() {
            const _ran = self.node.snappedAt || self.rotationAngle;
            if (_ran) {
                const rotationContext = {
                    rotationAngle: (self.node.options.rotate.rotationAngle + _ran) % 360,
                    point: self.origCenter
                };
                Object.assign(self.node.options.rotate, rotationContext);
                const bb = self.node.vect.getBBox();
                self.node.options.width = bb.width;
                self.node.options.height = bb.height;
                self.rotateTemp.remove();
                self.node.relationships.updateAssociationsWith({
                    rotationAngle: self.node.options.rotate.rotationAngle
                });
                self.node.gridLines.clear();
                delete self.foreignPoints;
                delete self.kdTree;
                delete self.node.snappedAt;
            }
            self.slate.isBeingResized = false;
            self.node.menu.hide();
            self._isResizing = false;
            self.slate.enable(false, true);
            self.node.setEndDrag();
            self.node.relationships.refreshOwnRelationships();
            self.node.relationships.showOwn();
            self.rotate.remove();
            if (self.node.events?.onRotated?.apply) self.node.events?.onRotated?.apply(self, [
                _self.send
            ]);
            else self.send();
        }
    }
    show(x, y) {
        const self = this;
        if (self.node.options.allowResize) {
            self.rotateTemp?.remove();
            const r = self.slate.paper;
            self.rotate = r.path('M16.659,24c-5.078,0-9.213-3.987-9.475-9h2.975l-4.5-5l-4.5,5h3.025 c0.264,6.671,5.74,12,12.475,12c3.197,0,6.104-1.21,8.315-3.185l-2.122-2.122C21.188,23.127,19.027,24,16.659,24z M29.133,14c-0.265-6.669-5.74-12-12.475-12c-3.197,0-6.104,1.21-8.315,3.185   l2.122,2.122C12.129,5.873,14.29,5,16.659,5c5.077,0,9.213,3.987,9.475,9h-2.975l4.5,5l4.5-5H29.133z').attr({
                fill: '#fff',
                stroke: '#000',
                x: x - 5,
                y: y - 5
            });
            let rotatePathBB = self.rotate.getBBox();
            const rotatePathString = $c09005a36c8880c7$export$2e2bcd8739ae039._transformPath(self.rotate.attr('path'), `T${x - rotatePathBB.x - 15},${y - rotatePathBB.y - 15}`);
            self.rotate.attr({
                path: rotatePathString
            });
            rotatePathBB = self.rotate.getBBox();
            self.rotateTemp = r.rect(rotatePathBB.x, rotatePathBB.y, rotatePathBB.width, rotatePathBB.height).attr({
                fill: '#f00',
                opacity: 0.00000001
            }).toFront();
            self.rotate.mouseover((e)=>{
                self.rotate.attr({
                    cursor: 'alias'
                });
            });
            self.rotateTemp.mouseover((e)=>{
                self.rotateTemp.attr({
                    cursor: 'alias'
                });
            });
            self.rotateTemp.drag(self.rotateEvents.move, self.rotateEvents.start, self.rotateEvents.up);
        }
        return self.rotate;
    }
    hide() {
        this.rotate?.remove();
        this.rotateTemp?.remove();
    }
    send() {
        // broadcast change to birdsEye and collaborators
        const pkg = {
            type: 'onNodeRotated',
            data: {
                id: this.node.options.id,
                rotate: this.node.options.rotate,
                textOffset: this.node.options.textOffset,
                imageOrigWidth: this.node.options.imageOrigWidth,
                imageOrigHeight: this.node.options.imageOrigHeight,
                associations: this.node.relationships.associations.map((a)=>({
                        parentId: a.parent.options.id,
                        childId: a.child.options.id,
                        linePath: a.line.attr('path').toString()
                    })
                )
            }
        };
        this.slate.birdsEye?.nodeChanged(pkg);
        this.slate.collab?.send(pkg);
    }
    applyImageRotation(opts = {
    }) {
        const { r: r  } = this.slate.options.viewPort.zoom;
        this.node.vect.transform('');
        this.node.text.transform('');
        const boundingClientRect = opts.boundingClientRect || this.node.vect[0].getBoundingClientRect();
        // clone current node to get actual dimensions with no hidden transforms (transform("") doesn't affect bbox -- it still has dimensions as if transforms were still there)
        const tempPath = this.slate.paper.path(this.node.vect.attr('path'));
        const bb = tempPath.getBBox();
        const transformString = this.node.getTransformString(opts);
        this.node.vect.transform(transformString);
        this.node.text.transform(transformString);
        if (this.node.vect.pattern) {
            const img = this.node.vect.pattern.getElementsByTagName('image')[0];
            img.setAttribute('y', (boundingClientRect.height / r - bb.height) / 2 - 4);
            img.setAttribute('x', (boundingClientRect.width / r - bb.width) / 2 - 4);
        }
        tempPath.remove();
    }
    animateSet(data, opts) {
        const self = this;
        const transformString = `...R${data.rotationAngle},${data.rotate.point.x}, ${data.rotate.point.y}`;
        self.node.vect.animate({
            transform: transformString
        }, opts.duration || 500, opts.easing || '>', ()=>{
            const tstr = self.node.getTransformString();
            self.node.vect.transform(tstr);
            // self.node.text.transform(tstr);
            if (opts.cb) opts.cb();
        });
        self.node.text.animate({
            transform: transformString
        }, opts.duration || 500, opts.easing || '>', ()=>{
            const tstr = self.node.getTransformString();
            self.node.text.transform(tstr);
        });
        opts.associations.forEach((assoc)=>{
            const a = self.node.relationships.associations.find((ax)=>ax.parent.options.id === assoc.parentId && ax.child.options.id === assoc.childId
            );
            if (a) a.line.animate({
                path: assoc.linePath
            }, opts.duration || 500, opts.easing || '>', ()=>{
                a.line.attr({
                    path: assoc.linePath
                });
            });
        });
    }
}



class $481ed38b48fbf8a1$export$2e2bcd8739ae039 {
    constructor(slate, node){
        this.slate = slate;
        this.node = node;
        this._m = null;
        this._isOpen = false;
    }
    isOpen() {
        return this._isOpen;
    }
    show() {
        const self = this;
        const r = self.slate.paper;
        if (self._m) {
            $i9J9X$lodashinvoke(self._m, 'remove');
            self._m = null;
        }
        const bb = self.node.vect.getBBox();
        const _x = bb.x;
        const _y = bb.y;
        self._m = r.set();
        self._isOpen = true;
        // right, bottom, and settings connectors
        self.node.connectors.show(_x, _y, self._m, ()=>{
            if (self.slate.events?.onMenuRequested) self.slate.events?.onMenuRequested(self.node, ()=>{
            });
        });
    }
    hide(exceptionElemId) {
        if (this._m) {
            this._m.forEach((m)=>{
                if (m.id !== exceptionElemId) m.remove();
            });
            this._m.items = exceptionElemId ? null : this._m.items.filter((item)=>item.id !== exceptionElemId
            );
            this.node?.connectors?.iconBar?.remove();
            if (this.node?.connectors?.iconBar) this.node.connectors.iconBar = null;
        }
        this.node.rotate.hide();
        this._isOpen = false;
    }
}






class $d1ac19fab569a7ad$export$2e2bcd8739ae039 {
    constructor(slate, node){
        this.slate = slate;
        this.node = node;
        this.buttons = null;
        this.iconBar = null;
        this._lastUnpinned = {
            options: {
                xPos: null,
                width: null,
                yPos: null
            }
        };
    }
    _broadcast(skipCenter, options, targetXPos, targetYPos) {
        const self = this;
        const pkg = {
            type: 'onNodeAdded',
            data: {
                id: self.node.options.id,
                skipCenter: skipCenter,
                options: options,
                targetXPos: targetXPos,
                targetYPos: targetYPos
            }
        };
        this.slate.collab && this.slate.collab.send(pkg);
    }
    remove() {
        const self = this;
        if (self.buttons) Object.keys(self.buttons).forEach((btn)=>{
            self.buttons[btn].remove();
        });
        self.iconBar?.remove();
        self.iconBar = null;
        self.node.menu._isOpen = false;
    }
    removeSettingsButton() {
        this.buttons.setting.remove();
    }
    show(x, y, _m, onSettingsClicked) {
        const self = this;
        const r = self.slate.paper;
        const bb = self.node.vect.getBBox();
        const widthOffset = bb.width / 2;
        const btnAttr = {
            fill: '#fff',
            stroke: '#000'
        };
        function conditionallyShow(nodeType, deleteOverride) {
            switch(nodeType){
                case 'delete':
                    if (self.node.options.showDelete) self.buttons.trash = r.trash().transform([
                        't',
                        x + widthOffset - (deleteOverride || 80),
                        ',',
                        y - 58, 
                    ].join()).attr({
                        fill: '#fff',
                        stroke: '#f00'
                    });
                    else if (self.node.options.showAddAndDeleteConditionally && self.node.options.copiedFromId) {
                        const copiedTimestamps = self.slate.nodes.allNodes.filter((n)=>n.options.copiedFromId === self.node.options.copiedFromId
                        ).map((nx)=>nx.options.copiedAt
                        );
                        if (self.node.options.copiedAt >= Math.max(...copiedTimestamps)) self.buttons.trash = r.trash().transform([
                            't',
                            x + widthOffset - (deleteOverride || 80),
                            ',',
                            y - 58, 
                        ].join()).attr({
                            fill: '#fff',
                            stroke: '#f00'
                        });
                    }
                    break;
                case 'add':
                    {
                        const copies = self.slate.nodes.allNodes.filter((n)=>n.options.copiedFromId === self.node.options.id
                        ).length;
                        if (self.node.options.showAdd || copies === 0 && self.node.options.showAddAndDeleteConditionally && !self.node.options.copiedFromId) self.buttons.unPinned = r.plus().transform([
                            't',
                            x + widthOffset + 40,
                            ',',
                            y - 58
                        ].join()).attr(btnAttr);
                        else if (self.node.options.showAddAndDeleteConditionally && self.node.options.copiedFromId) {
                            const copiedTimestamps = self.slate.nodes.allNodes.filter((n)=>n.options.copiedFromId === self.node.options.copiedFromId
                            ).map((nx)=>nx.options.copiedAt
                            );
                            if (self.node.options.copiedAt >= Math.max(...copiedTimestamps)) self.buttons.unPinned = r.plus().transform([
                                't',
                                x + widthOffset + 40,
                                ',',
                                y - 58
                            ].join()).attr(btnAttr);
                        }
                        break;
                    }
                default:
                    break;
            }
        }
        self.buttons = {
        };
        if (self.slate.isCommentOnly() && self.node.options.isComment || !self.slate.isCommentOnly()) {
            if (self.node.options.showMenu) self.buttons.setting = r.setting().transform([
                't',
                x + widthOffset,
                ',',
                y - 58
            ].join()).attr(btnAttr);
            if (self.node.options.isComment && self.slate.canRemoveComments()) conditionallyShow('delete', 40);
        }
        if (!self.node.options.isLocked && !self.node.options.isComment && !self.slate.isCommentOnly()) {
            conditionallyShow('add');
            conditionallyShow('delete');
            if (self.node.options.showRelationshipConnector) self.buttons.handle = r.handle().transform([
                't',
                x + widthOffset - 40,
                ',',
                y - 58
            ].join()).attr(btnAttr);
        }
        [
            'mousedown'
        ].forEach((eventType)=>{
            if (self.buttons.setting) self.buttons.setting[eventType]((e)=>{
                self.slate.unglow();
                onSettingsClicked.apply(self);
                $c09005a36c8880c7$export$2e2bcd8739ae039.stopEvent(e);
                // self.remove();
                if (self.slate.multiSelection) self.slate.multiSelection.end();
                if (self.node.context) self.node.context.remove();
                if (self.node.links) self.node.links.unset();
            });
            if (self.buttons.unPinned) self.buttons.unPinned[eventType](function unp(e) {
                $c09005a36c8880c7$export$2e2bcd8739ae039.stopEvent(e);
                this.loop();
                self.slate.unglow();
                self.node.connectors?.addNode();
                self.node.menu?.hide();
                self.node.context?.remove();
            });
            if (self.buttons.trash) self.buttons.trash[eventType]((e)=>{
                const gid = self.node.options.groupId;
                $c09005a36c8880c7$export$2e2bcd8739ae039.stopEvent(e);
                self.node.del();
                self.slate.unglow();
                const delPkg = {
                    type: 'onNodeDeleted',
                    data: {
                        id: self.node.options.id,
                        isComment: self.node.options.isComment
                    }
                };
                self.slate.collab?.send(delPkg);
                self.slate.birdsEye?.nodeDeleted(delPkg);
                if (gid) // reselect the group after the node is deleted
                self.slate.multiSelection.showGroup(gid);
            });
            if (self.buttons.handle) self.buttons.handle[eventType]((e)=>{
                $c09005a36c8880c7$export$2e2bcd8739ae039.stopEvent(e);
                self.slate.unglow();
                self.node.relationships.initiateTempNode(e, self.node, true);
            });
        });
        if (Object.keys(self.buttons).length > 1) {
            const isComment = self.node.options.isComment;
            const barWidth = Object.keys(self.buttons).length * 40;
            // console.log('isComment barWidth', isComment, barWidth, widthOffset)
            if (!self.iconBar) self.iconBar = r.rect(x + widthOffset - (isComment ? 45 : 85), y - 63, barWidth, 43, 3).attr({
                stroke: '#000',
                fill: '#fff'
            }).toFront();
        }
        Object.keys(self.buttons).forEach((btn)=>{
            const button = self.buttons[btn];
            button.toFront();
            _m.push(button);
            button.mouseover(function mo() {
                self.slate.glow(this);
            });
            button.mouseout(()=>{
                self.slate.unglow();
            });
        });
        if (!self.node.options.isLocked && !self.node.options.isComment && !self.slate.isCommentOnly()) {
            if (self.node.options.showResize) {
                const rs = self.node.resize.show(x + bb.width, y + bb.height);
                _m.push(rs);
            }
            if (self.node.options.showRotate) {
                const rotate = self.node.rotate.show(x, y);
                _m.push(rotate);
            }
        }
        return self;
    }
    reset() {
        this._lastUnpinned = {
            options: {
                xPos: null,
                width: null,
                yPos: null
            }
        };
    }
    createNode(skipCenter, options, targetXPos, targetYPos, doBroadcast) {
        const self = this;
        const newNode = new $d70659fe9854f6b3$export$2e2bcd8739ae039(options);
        self.slate.nodes.add(newNode);
        $c09005a36c8880c7$export$2e2bcd8739ae039.transformPath(newNode, `T${targetXPos - newNode.options.xPos}, ${targetYPos - newNode.options.yPos}`);
        newNode.options.xPos = targetXPos;
        newNode.options.yPos = targetYPos;
        newNode.editor.set();
        // const coords = newNode.textCoords({
        //   x: newNode.options.xPos,
        //   y: newNode.options.yPos,
        // })
        // newNode.editor.setTextOffset()
        // newNode.text.attr(coords)
        self._lastUnpinned = newNode.options;
        if (self.slate.options.mindMapMode) self.node.relationships.addAssociation(newNode);
        self.slate.birdsEye?.refresh(false);
        if (doBroadcast) self._broadcast(skipCenter, options, targetXPos, targetYPos);
        // var _pkg = { type: "addRelationship", data: { type: 'association', parent: self.node.options.id, child: newNode.options.id} };
        // self.slate.collab && self.slate.collab.send(_pkg);
        // fire the editor if the menu can be shown
        if (doBroadcast && newNode.options.showMenu && skipCenter === undefined) newNode.position('center', ()=>{
            // fire event
            self.slate.events?.onTextPaneRequested?.apply(this, [
                newNode,
                (opts)=>{
                // ('changed', opts);
                }, 
            ]);
        });
        return newNode;
    }
    // eslint-disable-next-line consistent-return
    addNode(skipCenter) {
        const self = this;
        // add new node to the right of this one.
        // const _snap = self.slate.snapshot()
        const copies = self.slate.nodes.allNodes.filter((n)=>n.options.copiedFromId === self.node.options.copiedFromId && n.options.copiedAt >= self.node.options.copiedAt
        ).length;
        if (copies === 1) self.reset();
        const options = JSON.parse(JSON.stringify(self.node.options));
        // assign a new guid to this node and remove the old id from the snapshot
        // otherwise the snapshot contains the previous id, and the node contains
        // the new id -- and the broadcast of the snap for collaboration causes
        // the old id to be assigned to the new node, created duplicate nodes with the same id
        const newId = $c09005a36c8880c7$export$2e2bcd8739ae039.guid();
        // let snapNode = _snap.nodes.allNodes.find((n) => n.options.id === options.id)
        // console.log(
        //   'found snapNode',
        //   newId,
        //   options.id,
        //   _snap.nodes.allNodes,
        //   snapNode
        // )
        // snapNode.options.id = newId
        if (!self.node.options.width) {
            const bb = self.node.vect.getBBox();
            self.node.options.width = bb.width;
            self.node.options.height = bb.height;
        }
        options.id = newId;
        const targetXPos = (self._lastUnpinned.xPos || self.node.options.xPos) + (self._lastUnpinned.width || self.node.options.width || 220) + self.node.options.spaceBetweenNodesWhenAdding || 30;
        const targetYPos = self._lastUnpinned.yPos || self.node.options.yPos;
        // console.log(
        //   'targetXPos',
        //   targetXPos,
        //   self._lastUnpinned.width,
        //   self.node.options.width,
        //   self.node.options.spaceBetweenNodesWhenAdding
        // )
        // const textDimens = utils.getTextWidth(
        //   self.node.options.text,
        //   `${self.node.options.fontSize}pt ${self.node.options.fontFamily}`
        // )
        // // don't replace text if the shape is alpha, otherwise the intent here is to copy the text
        // console.log(
        //   'textDimens',
        //   self.node.options.text,
        //   `${self.node.options.fontSize}pt ${self.node.options.fontFamily}`,
        //   textDimens.width,
        //   textDimens.fontBoundingBoxAscent + textDimens.fontBoundingBoxDescent
        // )
        if (options.opacity === 1) options.text = '';
        options.copiedFromId = self.node.options.copiedFromId || self.node.options.id;
        options.copiedAt = new Date().valueOf();
        // use the next theme shape if this slate is set to sync the theme
        if (!self.slate.options.basedOnThemeId) return self.createNode(skipCenter, options, targetXPos, targetYPos, true);
        // adjust the node's shape and color prior to insertion
        self.slate.events.onThemeRequired({
            themeId: self.slate.options.basedOnThemeId
        }, (err, theme)=>{
            if (err) console.error('Unable to apply theme', err);
            else {
                const children = self.slate.findChildren([
                    options.id
                ]);
                let nextChild = children.length + 1;
                if (nextChild > Object.keys(theme.styles).length) nextChild = 1;
                const base = theme.styles[`child_${nextChild}`];
                // if (base && base.opacity === 0) {
                //   // scope the size to just the text if this is opacity-less
                //   base.width = textDimens.width
                //   base.height =
                //     textDimens.fontBoundingBoxAscent +
                //     textDimens.fontBoundingBoxDescent
                //   base.vectorPath = options.vectorPath
                // }
                // console.log(
                //   'modifying options',
                //   options.width,
                //   options.height,
                //   options.vectorPath,
                //   base.width,
                //   base.height
                // )
                if (base) Object.assign(options, $i9J9X$lodashomit(base, 'vectorPath'));
            }
            return self.createNode(skipCenter, options, targetXPos, targetYPos, true);
        });
    }
}








class $a7cd8c5030694da2$export$2e2bcd8739ae039 {
    constructor(slate, node){
        const self = this;
        self.slate = slate;
        self.node = node;
        self.resize = null;
        self.resizeTemp = null;
        self.origX = null;
        self.origY = null;
        self.lastDx = null;
        self.lastDy = null;
        self._minWidth = 5;
        self._minHeight = 5;
        self._dragAllowed = false;
        self._origWidth = null;
        self._origHeight = null;
        self._isResizing = false;
        self.origPath = null;
        self.origPoint = {
        };
        self.resizeEvents = {
            start () {
                const s = this;
                self.node.toggleImage({
                    active: true,
                    keepResizerOpen: true
                });
                self.origPath = self.node.options.vectorPath;
                self.origPoint = self.node.options.rotate.point;
                self.origX = self.resizeTemp.attr('x');
                self.origY = self.resizeTemp.attr('y');
                self.node.options.hasResized = true;
                // create a huge dragging area in order to prevent mouse from losing focus on the correct element
                self.resizeTemp.attr({
                    x: self.resizeTemp.attr('x') - 1000,
                    y: self.resizeTemp.attr('y') - 1000,
                    width: 10000,
                    height: 10000
                });
                self.slate.isBeingResized = true;
                self.node.relationships.updateAssociationsWith({
                    activeNode: self.node.options.id,
                    currentDx: 0,
                    currentDy: 0,
                    action: 'resize'
                });
                self.lastDx = 0;
                self.lastDy = 0;
                const bbr = self.resize.getBBox();
                self.resize.ox = bbr.x;
                self.resize.oy = bbr.y;
                self._isResizing = true;
                self.slate.multiSelection?.end();
                // the resize coords at the start
                s.ox = s.attr('x');
                s.oy = s.attr('y');
                self.node.setStartDrag();
                self.node.connectors.remove();
                self.node.rotate.hide();
                self._dragAllowed = self.slate.options.allowDrag;
                self.slate.disable(false, true);
                if (self.node.options.text !== ' ') {
                    self._minWidth = 10;
                    self._minHeight = 10;
                }
                self._origWidth = self.node.options.width;
                self._origHeight = self.node.options.height;
                self.foreignPoints = self.slate.nodes.allNodes.filter((n)=>n.options.id !== self.node.options.id
                ).map((n)=>({
                        id: n.options.id,
                        bbox: n.vect.getBBox(),
                        point: [
                            n.options.xPos,
                            n.options.yPos
                        ]
                    })
                );
                self.kdTree = $i9J9X$statickdtree(self.foreignPoints.map((fp)=>fp.point
                ));
                self.node.relationships.conditionallyHideAll();
                self.slate.toggleFilters(false);
            },
            move (dx, dy) {
                const s = this;
                try {
                    const _zr = self.slate.options.viewPort.zoom.r;
                    // for snapping
                    if (self.slate.options.viewPort.showGrid && self.slate.options.viewPort.snapToGrid) {
                        const gridSize = self.slate.options.viewPort.gridSize || 10;
                        dx = Math.round(dx / gridSize) * gridSize;
                        dy = Math.round(dy / gridSize) * gridSize;
                    }
                    dx += dx / _zr - dx;
                    dy += dy / _zr - dy;
                    const nearest = self.kdTree.knn([
                        node.options.xPos,
                        node.options.yPos
                    ], 5);
                    nearest.forEach((n)=>{
                        self.node.gridLines.draw(self.foreignPoints[n].id, dx, dy, self.foreignPoints[n].bbox, false, 200);
                    });
                    let transWidth = self._origWidth + dx * 2;
                    let transHeight = self._origHeight + dy * 2;
                    if (!self.slate.isCtrl && self.node.options.origVectWidth && self.node.options.origVectHeight) {
                        const max = Math.max(transWidth, transHeight);
                        // keep it proportional to the original dimensions unless ctrl is pressed while resizing
                        if (max === transWidth) // change width
                        transWidth = self.node.options.origVectWidth * transHeight / self.node.options.origVectHeight;
                        else // change height
                        transHeight = self.node.options.origVectHeight * transWidth / self.node.options.origVectWidth;
                    }
                    if (transWidth > self._minWidth) s.attr({
                        x: s.ox + dx
                    });
                    else // tx = 0;
                    s.attr({
                        x: s.ox
                    });
                    if (transHeight > self._minHeight) s.attr({
                        y: s.oy + dy
                    });
                    else // ty = 0;
                    s.attr({
                        y: s.oy
                    });
                    // if (transWidth > self._minWidth && transHeight > self._minHeight) {
                    const ts = `T${dx}, ${dy}`;
                    self.resize.transform(ts);
                    // }
                    self.node.events?.onResizing?.apply(self, [
                        transWidth,
                        transHeight
                    ]);
                    self.set(transWidth, transHeight, {
                        isMoving: true,
                        getRotationPoint: self.node.options.rotate.rotationAngle
                    });
                    self.node.images.imageSizeCorrection() // self is a potential performance choke point
                    ;
                    self.lastDx = dx * 2;
                    self.lastDy = dy * 2;
                } catch (err) {
                    finalize();
                }
            },
            async up () {
                self.slate.toggleFilters(false);
                finalize();
            }
        };
        function finalize() {
            // self.resizeTemp.attr({ x: self.origX + self.lastDx, y: self.origY + self.lastDy, width: self.resize.attr("width"), height: self.resize.attr("height") });
            // self.node.options.vectorPath = _optimizedContext.path;
            self.node.vect.attr({
                path: self.node.options.vectorPath
            });
            self.node.relationships.showAll(true);
            self.slate.isBeingResized = false;
            self._isResizing = false;
            self.slate.enable(false, true);
            self.resize.remove();
            self.resizeTemp.remove();
            self.node.setEndDrag();
            // self.node.relationships.wireHoverEvents();
            const _bbox = self.node.vect.getBBox();
            self.node.toggleImage({
                active: false,
                width: _bbox.width,
                height: _bbox.height
            });
            self.node.options.width = _bbox.width;
            self.node.options.height = _bbox.height;
            self.node.options.xPos = _bbox.x;
            self.node.options.yPos = _bbox.y;
            self.node.editor.setTextOffset();
            self.node.text.attr(self.node.textCoords({
                x: self.node.options.xPos,
                y: self.node.options.yPos
            }));
            self.node.gridLines.clear();
            delete self.foreignPoints;
            delete self.kdTree;
            if (self.node.events && self.node.events?.onResized) self.node.events.onResized.apply(self, [
                self.send
            ]);
            else self.send();
        }
    }
    show(x, y) {
        const self = this;
        if (self.node.options.allowResize) {
            self.resizeTemp?.remove();
            const r = self.slate.paper;
            const resizePath = $c09005a36c8880c7$export$2e2bcd8739ae039._transformPath($2197852bc26081e6$export$2e2bcd8739ae039.icons.resize, `t${x - 5},${y - 5} r95`);
            self.resize = r.path(resizePath).attr({
                fill: '#fff',
                stroke: '#000'
            });
            self.resizeTemp = r.rect(x - 6, y - 6, 20, 20).attr({
                fill: '#f00',
                opacity: 0.00000001
            }).toFront();
            self.resizeTemp.mouseover((e)=>{
                self.node.overMenuButton = true;
                self.resizeTemp.attr({
                    cursor: 'pointer'
                });
            });
            self.resizeTemp.mouseout((e)=>{
                self.node.overMenuButton = false;
            });
            self.resizeTemp.drag(self.resizeEvents.move, self.resizeEvents.start, self.resizeEvents.up);
            return self.resize;
        }
    }
    hide() {
        this.resizeTemp?.remove();
        this.resize?.remove();
    }
    send() {
        // broadcast change to birdsEye and collaborators
        const textAttrs = this.node.text.attrs;
        const pkg = {
            type: 'onNodeResized',
            data: {
                id: this.node.options.id,
                textPosition: {
                    x: textAttrs.x,
                    y: textAttrs.y
                },
                rotate: this.node.options.rotate,
                vectorPath: this.node.options.vectorPath,
                associations: this.node.relationships.associations.map((a)=>({
                        parentId: a.parent.options.id,
                        childId: a.child.options.id,
                        linePath: a.line.attr('path').toString()
                    })
                )
            }
        };
        const currentRotationPoint = $i9J9X$lodashclone(this.node.options.rotate.point);
        this.slate.birdsEye?.nodeChanged(pkg);
        this.node.options.rotate.point = currentRotationPoint;
        this.slate.collab?.send(pkg);
    }
    lazySend() {
        $i9J9X$lodashthrottle(this.send, 700);
    }
    animateSet(data, opts) {
        const self = this;
        self.node.text.animate(data.textPosition, opts.duration || 500, opts.easing || '>');
        self.node.vect.animate({
            path: data.vectorPath,
            transform: `R${data.rotate.rotationAngle}, ${data.rotate.point.x}, ${data.rotate.point.y}`
        }, opts.duration || 500, opts.easing || '>', ()=>{
            const { image: image , imageOrigHeight: imageOrigHeight , imageOrigWidth: imageOrigWidth  } = self.node.options;
            if (image && !!imageOrigHeight && !!imageOrigWidth) self.node.images.imageSizeCorrection();
        });
        opts.associations.forEach((assoc)=>{
            const a = self.node.relationships.associations.find((ax)=>ax.parent.options.id === assoc.parentId && ax.child.options.id === assoc.childId
            );
            if (opts.animate) {
                if (a) a.line.animate({
                    path: assoc.linePath
                }, opts.duration || 500, opts.easing || '>', ()=>{
                    a.line.attr({
                        path: assoc.linePath
                    });
                });
            } else if (a) a.line.attr({
                path: assoc.linePath
            });
        });
    }
    set(width, height, opts = {
    }) {
        // let latt, tatt;
        const self = this;
        let pathWithPotentialTransformations = self.node.vect.attr('path').toString();
        if (opts.getRotationPoint) self.origPoint = self.node.options.rotate.point;
        if (self.origPoint && Object.entries(self.origPoint).length > 0 && self.node.options.rotate.rotationAngle > 0) pathWithPotentialTransformations = $db87f2586597736c$export$508faed300ccdfb.transformPath(pathWithPotentialTransformations, `R${self.node.options.rotate.rotationAngle}, ${self.origPoint.x}, ${self.origPoint.y}`);
        self.node.vect.transform('');
        self.node.text.transform('');
        self.node.vect.attr({
            path: pathWithPotentialTransformations
        });
        self.node.text.attr({
            path: pathWithPotentialTransformations
        });
        const rotationBB = self.node.vect.getBBox();
        let widthScalar = 1;
        let heightScalar = 1;
        if (width > self._minWidth) {
            widthScalar = width / rotationBB.width;
            self.node.options.width = width;
        } else {
            widthScalar = self._minWidth / rotationBB.width;
            self.node.options.width = self._minWidth;
        }
        if (height > self._minHeight) {
            heightScalar = height / rotationBB.height;
            self.node.options.height = height;
        } else {
            heightScalar = self._minHeight / rotationBB.height;
            self.node.options.height = self._minHeight;
        }
        const scaleTransform = `s${widthScalar}, ${heightScalar}`;
        const scaledVectPath = $db87f2586597736c$export$508faed300ccdfb.transformPath(self.node.vect.attr('path').toString(), scaleTransform).toString();
        pathWithPotentialTransformations = scaledVectPath;
        self.node.vect.attr({
            path: scaledVectPath
        });
        if (self.origPoint && Object.entries(self.origPoint).length > 0 && self.node.options.rotate.rotationAngle > 0) pathWithPotentialTransformations = $db87f2586597736c$export$508faed300ccdfb.transformPath(pathWithPotentialTransformations, `R${-self.node.options.rotate.rotationAngle}, ${self.origPoint.x}, ${self.origPoint.y}`).toString();
        self.node.vect.attr({
            path: pathWithPotentialTransformations
        });
        self.node.options.vectorPath = pathWithPotentialTransformations;
        const noRotationBB = self.node.vect.getBBox();
        self.node.options.rotate.point = {
            x: noRotationBB.cx,
            y: noRotationBB.cy
        };
        self.node.setPosition({
            x: noRotationBB.x,
            y: noRotationBB.y
        }, true);
        self.node.rotate.applyImageRotation();
        const lc = self.node.linkCoords();
        self.node.link.transform([
            't',
            lc.x,
            ',',
            lc.y,
            's',
            '.8',
            ',',
            '.8',
            'r',
            '180'
        ].join());
        self.node.relationships.refreshOwnRelationships();
        self.node.editor.setTextOffset();
        self.node.text.attr(self.node.textCoords({
            x: self.node.options.xPos,
            y: self.node.options.yPos
        }));
    }
}



class $fcb214a7591c9017$export$2e2bcd8739ae039 {
    constructor(slate, node){
        this.slate = slate;
        this.node = node;
    }
    getTargetImageDimensions() {
        let transImageHeight;
        let transImageWidth;
        const origImageRatio = this.node.options.imageOrigWidth / this.node.options.imageOrigHeight;
        const noRotationPath = this.slate.paper.path(this.node.vect.attr('path'));
        const noRotationBB = noRotationPath.getBBox();
        const nodeRatio = noRotationBB.width / noRotationBB.height;
        if (origImageRatio < nodeRatio) {
            transImageWidth = noRotationBB.width;
            transImageHeight = noRotationBB.width / origImageRatio;
        } else if (origImageRatio > nodeRatio) {
            transImageHeight = noRotationBB.height;
            transImageWidth = noRotationBB.height * origImageRatio;
        } else {
            transImageWidth = noRotationBB.width;
            transImageHeight = noRotationBB.height;
        }
        noRotationPath.remove();
        return {
            width: transImageWidth,
            height: transImageHeight
        };
    }
    imageSizeCorrection() {
        if (this.node.vect.pattern) {
            const targetImageDimensions = this.getTargetImageDimensions();
            const img = this.node.vect.pattern.getElementsByTagName('image')[0];
            img.setAttribute('height', targetImageDimensions.height);
            img.setAttribute('width', targetImageDimensions.width);
        }
    }
    set(img, w, h, blnKeepResizerOpen) {
        this.node.vect.data({
            relativeFill: true
        });
        this.node.options.image = img;
        this.node.options.origImage = {
            w: w,
            h: h
        } // needed for image copying if done later
        ;
        this.node.options.imageOrigHeight = h // for scaling node to image size purposes; this value should never be changed
        ;
        this.node.options.imageOrigWidth = w;
        this.node.options['fill-opacity'] = 1;
        const sz = {
            fill: `url(${this.node.options.image})`,
            'stroke-width': this.node.options.borderWidth,
            stroke: '#000'
        };
        const targetImageDimensions = this.getTargetImageDimensions();
        this.node.vect.imageOrigHeight = targetImageDimensions.height;
        this.node.vect.imageOrigWidth = targetImageDimensions.width;
        this.node.vect.attr({
            'fill-opacity': 1
        }) // IMPORTANT: for some reason Raphael breaks when setting 'sz' object and this at the same time
        ;
        this.node.vect.attr(sz);
        const rotatedBB = this.node.vect.getBBox();
        this.node.options.width = rotatedBB.width;
        this.node.options.height = rotatedBB.height;
        this.node.relationships.refreshOwnRelationships();
        if (blnKeepResizerOpen) {
            this.node.setPosition({
                x: rotatedBB.x,
                y: rotatedBB.y
            }, true);
            this.node.menu?.hide();
            this.node.rotate?.hide();
        } else this.node.setPosition({
            x: rotatedBB.x,
            y: rotatedBB.y
        });
        this.node.connectors?.remove();
    }
}



class $ab50f45f60e457ee$export$2e2bcd8739ae039 {
    constructor(slate, node){
        this.slate = slate;
        this.node = node;
    }
    async set(pkg = {
        sendCollab: false
    }) {
        this.slate.unglow();
        let _path = '';
        switch(pkg.shape){
            case 'ellipse':
                _path = $c09005a36c8880c7$export$2e2bcd8739ae039._transformPath(`M${this.node.options.xPos + 75},${this.node.options.yPos + 50} m -75,0 a75,50 0 1,0 150,0 a 75,50 0 1,0 -150,0Z`);
                this.node.options.isEllipse = true;
                break;
            case 'rect':
                if (pkg.rx > 0) _path = $c09005a36c8880c7$export$2e2bcd8739ae039._transformPath(`M${this.node.options.xPos},${this.node.options.yPos} h130 a10,10 0 0 1 10,10 v80 a10,10 0 0 1 -10,10 h-130 a10,10 0 0 1 -10,-10 v-80 a10,10 0 0 1 10,-10 z`);
                else _path = $c09005a36c8880c7$export$2e2bcd8739ae039._transformPath(`M${this.node.options.xPos},${this.node.options.yPos} h150 v100 h-150 v-100 z`);
                this.node.options.isEllipse = false;
                break;
            default:
                _path = $c09005a36c8880c7$export$2e2bcd8739ae039._transformPath(pkg.shape, `T${this.node.options.xPos},${this.node.options.yPos}`);
                this.node.options.isEllipse = false;
                break;
        }
        this.node.options.vectorPath = _path;
        this.node.options.origVectWidth = pkg.width;
        this.node.options.origVectHeight = pkg.height;
        this.node.options.width = pkg.width;
        this.node.options.height = pkg.height;
        this.node.vect.attr({
            path: _path
        });
        this.node.editor.setTextOffset();
        this.node.text.attr(this.node.textCoords({
            x: this.node.options.xPos,
            y: this.node.options.yPos
        }));
        // apply image fill rotation
        if (this.node.vect.pattern) {
            this.node.images.imageSizeCorrection();
            this.node.rotate.applyImageRotation();
        }
        this.node.text.toFront();
        this.node.link.toFront();
        this.node.relationships.refreshOwnRelationships();
        if (pkg.keepResizerOpen) {
            this.node.menu?.hide();
            this.node.rotate?.hide();
        }
        // needed for tofront and toback ops of the context menu
        this.node.vect.data({
            id: this.node.options.id
        });
        this.node.context.create();
        if (pkg.sendCollab) {
            const _pkg = {
                type: 'onNodeShapeChanged',
                data: {
                    id: this.node.options.id,
                    shape: pkg.shape,
                    width: pkg.width,
                    height: pkg.height,
                    sendCollab: false,
                    rx: pkg.rx
                }
            };
            this.slate.collab?.send(_pkg);
            this.slate.birdsEye?.nodeChanged(_pkg);
        }
    }
}



class $60ff234bef37cf38$export$2e2bcd8739ae039 {
    constructor(slate, node){
        this.slate = slate;
        this.node = node;
    }
    set(path, width, height, sendCollab) {
        let upath = path;
        if (width && height) {
            // calculate the scale of the path
            const scale = Math.max(this.node.options.width, this.node.options.height) / Math.max(width, height);
            upath = $c09005a36c8880c7$export$2e2bcd8739ae039._transformPath(path, [
                's',
                scale,
                ',',
                scale
            ].join(''));
        }
        this.node.shapes.set({
            shape: upath.toString(),
            sendCollab: sendCollab != null ? sendCollab : true
        });
    }
}


class $4c688f6798a93fae$export$2e2bcd8739ae039 {
    constructor(slate, node){
        this.slate = slate;
        this.node = node;
    }
    set(cast) {
        this.node.options.image = '';
        this.node.options.backgroundColor = cast.color;
        if (cast.opacity != null) this.node.options.opacity = cast.opacity;
        this.node.vect.attr({
            fill: cast.color,
            'fill-opacity': this.node.options.opacity
        });
        if (cast.color === '' && this.node.options.text !== '') {
            this.node.vect.attr({
                stroke: this.node.options.borderColor || '#000'
            });
            this.node.options.borderWidth = 0;
        } else this.node.vect.attr({
            stroke: this.node.options.borderColor || '#000',
            'stroke-width': this.node.options.borderWidth
        });
        this.node.relationships.refreshOwnRelationships();
    }
}



class $f3109bf87f06806c$export$2e2bcd8739ae039 {
    constructor(slate, node){
        this.slate = slate;
        this.node = node;
        this._contextMenu = null;
        this._priorAllowDrag = true;
    }
    ctx(e) {
        this._priorAllowDrag = this.node.options.allowDrag;
        this.node.options.allowDrag = false;
        this.remove();
        this.buildContext(e);
        setTimeout(()=>{
            this.node.options.allowDrag = this._priorAllowDrag;
        }, 2);
        return $c09005a36c8880c7$export$2e2bcd8739ae039.stopEvent(e);
    }
    create() {
        if (this.node.text && this.node.text.node && this.node.options.allowContext && !this.node.slate.isAlt && !this.node.slate.isShift) {
            this.node.text.node.oncontextmenu = this.ctx;
            this.node.vect.node.oncontextmenu = this.ctx;
        }
    }
    buildContext(e) {
        this._contextMenu = document.createElement('div');
        this._contextMenu.setAttribute('id', `contextMenu_${this.node.options.id}`);
        this._contextMenu.setAttribute('class', 'sb_cm');
        document.body.appendChild(this._contextMenu);
        this.setContext(e);
    }
    menuItems() {
        const tmp = "<div style='padding:5px;' class='sbthis._contextMenuItem' rel='{func}'>{text}</div>";
        let inside = tmp.replace(/{func}/g, 'tofront').replace(/{text}/g, 'to front');
        inside += tmp.replace(/{func}/g, 'toback').replace(/{text}/g, 'to back');
        if (this._priorAllowDrag) inside += tmp.replace(/{func}/g, 'lock').replace(/{text}/g, 'lock');
        else inside += tmp.replace(/{func}/g, 'unlock').replace(/{text}/g, 'unlock');
        inside += tmp.replace(/{func}/g, 'close').replace(/{text}/g, 'close');
        return inside;
    }
    setContext(e) {
        const self = this;
        this._contextMenu.innerHTML = this.menuItems();
        const all = $c09005a36c8880c7$export$2e2bcd8739ae039.select('div.contextMenuItem');
        for(let s = all.length; s < all.length; s += 1){
            const elem = all[s];
            elem.onclick = ()=>{
                const act = this.getAttribute('rel');
                let _reorder = false;
                const pkg = {
                    type: '',
                    data: {
                        id: self.node.options.id
                    }
                };
                switch(act){
                    case 'tofront':
                        self.node.toFront();
                        _reorder = true;
                        pkg.type = 'onNodeToFront';
                        break;
                    case 'toback':
                        self.node.toBack();
                        _reorder = true;
                        pkg.type = 'onNodeToBack';
                        break;
                    case 'lock':
                        self.node.options.isLocked = true // self is not a part of the self.node.disable function on purpose
                        ;
                        self.node.disable();
                        pkg.type = 'onNodeLocked';
                        break;
                    case 'unlock':
                        self.node.options.isLocked = false // self is not a part of the self.node.enable function on purpose
                        ;
                        self.node.enable();
                        pkg.type = 'onNodeUnlocked';
                        break;
                    case 'close':
                    default:
                        break;
                }
                if (_reorder) {
                    let zIndex = 0;
                    for(let node = self.node.slate.paper.bottom; node != null; node = node.next)if (node.type === 'ellipse' || node.type === 'rect') {
                        zIndex += 1;
                        const _id = node.data('id');
                        // not all rects have an id (the menu box is a rect, but it has no options.id because it is not a node
                        // so you cannot always show self...
                        if (_id) {
                            const reorderedNode = self.node.slate.nodes.allNodes.find((n)=>n.options.id === _id
                            );
                            reorderedNode.sortorder = zIndex;
                        }
                    }
                    self.node.slate.nodes.allNodes.sort((a, b)=>a.sortorder < b.sortorder ? -1 : 1
                    );
                }
                if (pkg.type !== '') self.broadcast(pkg);
                this.remove();
            };
        }
        const mp = $c09005a36c8880c7$export$2e2bcd8739ae039.mousePos(e);
        const _x = mp.x;
        const _y = mp.y;
        this._contextMenu.style.left = `${_x}px`;
        this._contextMenu.style.top = `${_y}px`;
    }
    broadcast(pkg) {
        // broadcast
        if (this.node.slate.collab) this.node.slate.collab.send(pkg);
        if (this.node.slate.birdsEye) this.node.slate.birdsEye.nodeChanged(pkg);
    }
    remove() {
        this.node.slate?.removeContextMenus();
        this._contextMenu = null;
    }
    isVisible() {
        return this._contextMenu !== null;
    }
}





class $91c49a65b5f923ca$export$2e2bcd8739ae039 {
    constructor(slate, node){
        this.slate = slate;
        this.node = node;
        this.m = {
        };
    }
    broadcast(pkg) {
        pkg.data.id = this.node.options.id;
        this.slate.collab?.send(pkg);
    }
    set(pkg) {
        const a = this.node.relationships.associations[pkg.index];
        if (pkg.updateChild) a.child.options[pkg.prop] = pkg.val;
        else this.node.options[pkg.prop] = pkg.val;
        if (pkg.val === 'toggle') a[pkg.prop] = a[pkg.prop] ? (pkg.prop, false) : true;
        else a[pkg.prop] = pkg.val;
        $16aae51a7872bfb0$export$2e2bcd8739ae039({
            relationships: [
                a
            ],
            nodes: [
                this.node
            ]
        });
    }
    show(e, c) {
        const self = this;
        self.hideAll();
        self.slate.nodes.closeAllLineOptions(c.id);
        const a = self.node.relationships.associations.find((ax)=>ax.id === c.id
        );
        const r = self.slate.paper;
        const mp = $c09005a36c8880c7$export$2e2bcd8739ae039.mousePos(e);
        const off = $c09005a36c8880c7$export$2e2bcd8739ae039.positionedOffset(self.slate.options.container);
        const z = self.slate.options.viewPort.zoom.r;
        const opacity = '1.0';
        let x = (mp.x + self.slate.options.viewPort.left - off.left - 90) / z;
        let y = (mp.y + self.slate.options.viewPort.top - off.top - 30) / z;
        const bb = a.line.getBBox();
        x = bb.cx;
        y = bb.cy;
        self.m[c.id] = r.set();
        const transformToolbar = (xx, yy)=>[
                't',
                x + xx,
                ',',
                y + yy
            ].join()
        ;
        const toolbarAttr = {
            fill: '#fff',
            'fill-opacity': opacity,
            stroke: '#333',
            'stroke-width': 1,
            cursor: 'pointer'
        };
        const toolbar = [];
        const reassign = self.node.options.showRelationshipReassign ? r.handle().attr(toolbarAttr).transform(transformToolbar(15, 0)) : null;
        const props = self.node.options.showRelationshipProperties ? r.setting().attr(toolbarAttr).transform(transformToolbar(-15, 0)) : null;
        const del = self.node.options.showRelationshipDelete ? r.trash().transform(transformToolbar(-45, 0)).attr({
            fill: '#fff',
            stroke: '#f00'
        }) : null;
        if (reassign) toolbar.push(reassign);
        if (toolbar) toolbar.push(props);
        if (del) toolbar.push(del);
        const toolbarGlows = [];
        toolbar.forEach((toolbarElem)=>{
            toolbarElem.mouseover(function g() {
                toolbarGlows.push(this.glow());
                $c09005a36c8880c7$export$2e2bcd8739ae039.stopEvent(e);
            });
            toolbarElem.mouseout(()=>{
                toolbarGlows.forEach((t)=>{
                    t.remove();
                });
                $c09005a36c8880c7$export$2e2bcd8739ae039.stopEvent(e);
            });
        });
        if (props) props.mousedown((ex)=>{
            $c09005a36c8880c7$export$2e2bcd8739ae039.stopEvent(ex);
            toolbarGlows.forEach((t)=>{
                t.remove();
            });
            const assoc = self.node.relationships.associations.find((ax)=>ax.id === c.id
            );
            if (self.slate.events?.onLineMenuRequested) {
                self.hideAll();
                self.slate.events?.onLineMenuRequested(self.node, assoc, ()=>{
                // finished
                });
            }
        });
        function removeRelationship(ex) {
            toolbarGlows.forEach((t)=>{
                t.remove();
            });
            $c09005a36c8880c7$export$2e2bcd8739ae039.stopEvent(ex);
            if (self.slate.options.enabled) {
                const pkg = {
                    type: 'removeRelationship',
                    data: {
                        parent: c.parent.options.id,
                        child: c.child.options.id
                    }
                };
                self.slate.nodes.removeRelationship(pkg.data);
                self.slate.birdsEye?.relationshipsChanged(pkg);
                self.broadcast(pkg);
                self.hide(c.id);
            }
        }
        // reassign relationship
        if (reassign) reassign.mousedown(()=>{
            removeRelationship();
            self.node.relationships.initiateTempNode(e, c.parent, {
                showChildArrow: a.showChildArrow,
                showParentArrow: a.showParentArrow
            });
        });
        // remove relationship
        if (del) del.mousedown(()=>{
            removeRelationship();
        });
        toolbar.forEach((toolbarElem)=>{
            self.m[c.id].push(toolbarElem);
        });
        return self;
    }
    hide(id) {
        if (this.m[id]) {
            $i9J9X$lodashinvoke(this.m[id], 'remove');
            this.m[id] = null;
        }
    }
    hideAll() {
        const self = this;
        // self.slate.unglow();
        self.node.relationships.associations.map((r)=>r.id
        ).forEach((id)=>{
            self.hide(id);
        });
    }
}



class $ad25bb61235aed3a$export$2e2bcd8739ae039 {
    constructor(slate, node){
        this.slate = slate;
        this.node = node;
        this.guideWings = 20000;
        this.guideAttrs = {
            'stroke-dasharray': '--',
            stroke: '#000'
        };
        this.guideLines = {
            rightVerticals: {
            },
            leftVerticals: {
            },
            topHorizontals: {
            },
            bottomHorizontals: {
            }
        };
    }
    clear() {
        const self = this;
        [
            'rightVerticals',
            'leftVerticals',
            'topHorizontals',
            'bottomHorizontals', 
        ].forEach((p)=>{
            if (self.guideLines[p]) Object.keys(self.guideLines[p]).forEach((k)=>self.guideLines[p][k].remove()
            );
            self.guideLines[p] = {
            };
        });
    }
    draw(id, dx, dy, bb, translateNode = true, guideVisibleAt = 100, guideSnapAt = 20) {
        const self = this;
        const snapToObjects = self.slate.options.viewPort.snapToObjects != null ? self.slate.options.viewPort.snapToObjects : true;
        let pinnedY = false;
        let pinnedX = false;
        const nbb = self.node.vect.getBBox();
        self.guideAttrs.stroke = $c09005a36c8880c7$export$2e2bcd8739ae039.whiteOrBlack(self.slate.options.containerStyle.backgroundColor);
        // RIGHT VERTICAL LINE boundary
        if (nbb.x - bb.x2 < guideVisibleAt && nbb.x - bb.x2 >= 0 || bb.x2 - nbb.x2 < guideVisibleAt && bb.x2 - nbb.x2 >= 0) {
            if (!self.guideLines.rightVerticals[id]) self.guideLines.rightVerticals[id] = self.slate.paper.path(`M ${bb.x2} ${bb.y - self.guideWings} L ${bb.x2} ${bb.y2 + self.guideWings}`).attr(self.guideAttrs);
            pinnedX = nbb.x - bb.x2 < guideSnapAt && nbb.x - bb.x2 >= 0 || bb.x2 - nbb.x2 < guideSnapAt && bb.x2 - nbb.x2 >= 0;
            if (pinnedX && snapToObjects) {
                if (nbb.x - bb.x2 < guideSnapAt && nbb.x - bb.x2 >= 0) dx -= nbb.x - bb.x2;
                else dx += bb.x2 - nbb.x2;
            }
        } else {
            self.guideLines?.rightVerticals[id]?.remove();
            delete self.guideLines?.rightVerticals[id];
        }
        // LEFT VERTICAL LINE boundary
        if (!pinnedX && (bb.x - nbb.x2 < guideVisibleAt && bb.x - nbb.x2 >= 0 || nbb.x - bb.x < guideVisibleAt && nbb.x - bb.x >= 0)) {
            if (!self.guideLines.leftVerticals[id]) self.guideLines.leftVerticals[id] = self.slate.paper.path(`M ${bb.x} ${bb.y - self.guideWings} L ${bb.x} ${bb.y2 + self.guideWings}`).attr(self.guideAttrs);
            pinnedX = bb.x - nbb.x2 < guideSnapAt && bb.x - nbb.x2 >= 0 || nbb.x - bb.x < guideSnapAt && nbb.x - bb.x >= 0;
            if (pinnedX && snapToObjects) {
                if (bb.x - nbb.x2 < guideSnapAt && bb.x - nbb.x2 >= 0) dx += bb.x - nbb.x2;
                else dx -= nbb.x - bb.x;
            }
        } else {
            self.guideLines?.leftVerticals[id]?.remove();
            delete self.guideLines?.leftVerticals[id];
        }
        // TOP HORIZONTAL LINE boundary
        if (bb.y - nbb.y2 < guideVisibleAt && bb.y - nbb.y2 >= 0 || nbb.y - bb.y < guideVisibleAt && nbb.y - bb.y >= 0) {
            if (!self.guideLines.topHorizontals[id]) self.guideLines.topHorizontals[id] = self.slate.paper.path(`M ${bb.x - self.guideWings} ${bb.y} L ${bb.x2 + self.guideWings} ${bb.y}`).attr(self.guideAttrs);
            pinnedY = bb.y - nbb.y2 < guideSnapAt && bb.y - nbb.y2 >= 0 || nbb.y - bb.y < guideSnapAt && nbb.y - bb.y >= 0;
            if (pinnedY && snapToObjects) {
                if (bb.y - nbb.y2 < guideSnapAt && bb.y - nbb.y2 >= 0) // coming from top
                dy += bb.y - nbb.y2;
                else // coming from underneath
                dy -= nbb.y - bb.y;
            }
        } else {
            self.guideLines?.topHorizontals[id]?.remove();
            delete self.guideLines?.topHorizontals[id];
        }
        // BOTTOM HORIZONTAL LINE boundary
        if (!pinnedY && (nbb.y - bb.y2 < guideVisibleAt && nbb.y - bb.y2 >= 0 || bb.y2 - nbb.y2 < guideVisibleAt && bb.y2 - nbb.y2 >= 0)) {
            if (!self.guideLines.bottomHorizontals[id]) self.guideLines.bottomHorizontals[id] = self.slate.paper.path(`M ${bb.x - self.guideWings} ${bb.y2} L ${bb.x2 + self.guideWings} ${bb.y2}`).attr(self.guideAttrs);
            pinnedY = nbb.y - bb.y2 < guideSnapAt && nbb.y - bb.y2 >= 0 || bb.y2 - nbb.y2 < guideSnapAt && bb.y2 - nbb.y2 >= 0;
            if (pinnedY && snapToObjects) {
                if (nbb.y - bb.y2 < guideSnapAt && nbb.y - bb.y2 >= 0) dy -= nbb.y - bb.y2;
                else dy += bb.y2 - nbb.y2;
            }
        } else {
            self.guideLines?.bottomHorizontals[id]?.remove();
            delete self.guideLines?.bottomHorizontals[id];
        }
        if (translateNode && (pinnedX || pinnedY)) self.node.translateWith({
            dx: dx,
            dy: dy
        });
        return {
            dx: dx,
            dy: dy
        };
    }
}


class $9b4fe9d080edff94$export$2e2bcd8739ae039 {
    constructor(slate, node){
        this.slate = slate;
        this.node = node;
        this.node.link.click((e)=>{
            this.click();
        });
    }
    set(pkg, sendCollab) {
        // {
        //   type: 'url|currentSlate|externalSlate',
        //   data: 'https://xxx|id_of_node'
        // }
        this.node.options.link = pkg;
        if (sendCollab) {
            const cpkg = {
                type: 'onNodeLinkAdded',
                data: pkg
            };
            if (this.slate.collab) this.slate.collab.send(cpkg);
        }
    }
    unset(sendCollab) {
        this.node.options.link = null;
        if (sendCollab) {
            const cpkg = {
                type: 'onNodeLinkRemoved',
                data: pkg
            };
            if (this.slate.collab) this.slate.collab.send(cpkg);
        }
    }
    click() {
        //`url("https://api.miniature.io/?token=ozwPwKuD6CYUiE9K&url=miniature.io?url=${_self._.options.link.data}&size=200")`
        const self = this;
        switch(this.node.options.link.type){
            case 'url':
                window.open(self.node.options.link.data, 'sb_external');
                break;
            case 'externalSlate':
                break;
            case 'currentSlate':
                {
                    const n = self.slate.nodes.one(self.node.options.link.data);
                    console.log('pos ', n);
                    n.position('center', ()=>{
                    // done
                    }, 'swingTo', 500);
                    break;
                }
        }
    }
}


class $078ffda75962dda9$export$2e2bcd8739ae039 {
    constructor(slate){
        this.slate = slate;
        this.ensureBe = null;
        this.allNodes = [];
    }
    _refreshBe() {
        const self = this;
        window.clearTimeout(self.ensureBe);
        self.ensureBe = window.setTimeout(()=>{
            self.slate.birdsEye?.refresh(false);
        }, 10);
    }
    _getParentChild(obj) {
        let _parent;
        let _child;
        this.allNodes.forEach((node)=>{
            if (node.options.id === obj.parent) _parent = node;
            else if (node.options.id === obj.child) _child = node;
        });
        return {
            p: _parent,
            c: _child
        };
    }
    static remove(a, obj) {
        return a.filter((ax)=>ax.options.id !== obj.options.id
        );
    }
    copyNodePositions(source, useMainCanvas = false) {
        const self = this;
        source.forEach((src)=>{
            // if (src.options.id !== self.tempNodeId) {
            let cn = self.allNodes.find((n)=>n.options.id === src.options.id
            );
            if (!cn) {
                self.add(src);
                cn = self.allNodes.find((n)=>n.options.id === src.options.id
                );
            }
            cn.setPosition({
                x: src.options.xPos,
                y: src.options.yPos
            });
            const opts = {
            };
            if (useMainCanvas) {
                const tempPath = self.slate.paper.path(cn.vect.attr('path')) // Meteor.currentSlate.paper
                ;
                opts.boundingClientRect = tempPath[0].getBoundingClientRect();
                tempPath.remove();
            }
            cn.rotate.applyImageRotation(opts);
        // }
        });
        $i9J9X$lodashinvoke(self.allNodes.map((n)=>n.relationships
        ), 'refresh');
    }
    packageLayout() {
        const self = this;
        // package up all the unique associations and the width/height of every node
        let associations = self.allNodes.map((nx)=>nx.relationships.associations.map((a)=>{
                return {
                    parentId: a.parent.options.id,
                    childId: a.child.options.id,
                    lineWidth: a.lineWidth,
                    lineOpacity: a.lineOpacity,
                    showParentArrow: a.showParentArrow,
                    showChildArrow: a.showChildArrow
                };
            })
        ).flat();
        const nodes = {
        };
        self.allNodes.forEach((nx)=>{
            if (!nodes[nx.options.id]) nodes[nx.options.id] = {
                width: nx.options.width,
                height: nx.options.height,
                shape: nx.options.shapeHint || 'rectangle',
                color: nx.options.backgroundColor,
                textColor: nx.options.foregroundColor,
                text: nx.options.text,
                groupId: nx.options.groupId
            };
        });
        const subgraphs = {
        };
        self.allNodes.forEach((nx)=>{
            if (!subgraphs[nx.options.groupId]) subgraphs[nx.options.groupId] = [];
            subgraphs[nx.options.groupId].push(nx.options.id);
        });
        return {
            associations: associations,
            nodes: nodes,
            uniqueIds: Object.keys(nodes),
            subgraphs: subgraphs
        };
    }
    applyLayout(layout, cb) {
        const self = this;
        // console.log('received layout', layout)
        /*
    "exportNodes": {
      "010C580B": {
        "x": "279.5",
        "y": "322"
      },
      "ad79211ead0a": {
        "x": "183.5",
        "y": "186"
      },
      "c2134651593b": {
        "x": "376.5",
        "y": "186"
      },
      "0bad6428b74a": {
        "x": "87.5",
        "y": "50"
      },
      "2aab8002c94c": {
        "x": "280.5",
        "y": "50"
      }
    }
    */ const orient = self.slate.getOrientation(null, true) // - always pin to no zoom (1)
        ;
        const allMoves = [];
        self.allNodes.forEach((n, i)=>{
            if (layout.exportNodes[n.options.id]) {
                let { x: x , y: y  } = layout.exportNodes[n.options.id];
                x = parseFloat(x);
                y = parseFloat(y);
                // console.log(
                //   'target aquired',
                //   n.options.id,
                //   x,
                //   y,
                //   x * -2 + x,
                //   y * -2 + y,
                //   n.options.xPos,
                //   n.options.yPos
                // )
                allMoves.push({
                    id: n.options.id,
                    x: orient.left - x - n.options.xPos + orient.width,
                    y: orient.top - y - n.options.yPos + orient.height
                });
            }
        });
        let batchSize = 6;
        if (self.allNodes.length > 15) batchSize = 12;
        if (layout.allAtOnce || self.slate.nodes.allNodes.length > 25) batchSize = 1;
        const batches = $c09005a36c8880c7$export$2e2bcd8739ae039.chunk($i9J9X$lodashclonedeep(allMoves), Math.ceil(allMoves.length / batchSize));
        // console.log(
        //   'received layout2',
        //   batchSize,
        //   allMoves.length,
        //   self.allNodes.length,
        //   batches.length
        // )
        const sendMove = (batch)=>{
            let dur = 300;
            if (layout.allAtOnce) dur = 0;
            const pkg = self.slate.nodes.nodeMovePackage({
                dur: dur,
                moves: batch
            });
            self.slate.collab?.exe({
                type: 'onNodesMove',
                data: pkg
            });
            if (batches.length > 0) setTimeout(()=>{
                sendMove(batches.pop());
            }, 250);
            else {
                if (layout.skipCenter) self.slate.controller.centerOnNodes({
                    dur: 500
                });
                else self.slate.controller.scaleToFitAndCenter();
                // finally invoke toFront for all nodes
                self.slate.nodes.allNodes.forEach((n)=>n.toBack()
                );
                cb && cb();
            }
        };
        // kick it off
        sendMove(batches.pop());
    }
    getStickies(blnEmpty) {
        // stickies
        const stickies = slate.nodes.allNodes.filter((n)=>n?.options?.filters?.vect === 'postItNote' && n?.options?.disableDrag === false && n?.options?.text?.length > blnEmpty ? 10000 : 0
        ).map((n)=>({
                xPos: n.options.xPos,
                yPos: n.options.yPos,
                width: n.options.width,
                height: n.options.height,
                id: n.options.id
            })
        );
    }
    getProjectNameNode() {
        return this.slate.nodes.allNodes.find((n)=>n.options.text.match(/project name/gi)
        );
    }
    parseTemplateIntoCategories() {
        const categories = slate.nodes.allNodes.filter((n)=>n.options.isCategory
        ).map((nx)=>({
                xPos: nx.options.xPos,
                yPos: nx.options.yPos,
                width: nx.options.width,
                height: nx.options.height,
                categoryName: nx.options.categoryName
            })
        );
        // console.log(
        //   'rectnagles, categories',
        //   slate?.nodes?.allNodes?.length,
        //   rectangles,
        //   categories
        // )
        const matched = {
        };
        categories.forEach((categ)=>{
            if (!matched[categ.categoryName]) matched[categ.categoryName] = {
                top: categ.yPos,
                left: categ.xPos,
                bottom: categ.yPos + categ.height,
                right: categ.xPos + categ.width
            };
        });
        return matched;
    }
    addRange(_nodes) {
        const self = this;
        _nodes.forEach((node)=>{
            self.add(node);
        });
        return self;
    }
    removeRange(_nodes) {
        const self = this;
        _nodes.forEach((node)=>{
            self.allNodes = $078ffda75962dda9$export$2e2bcd8739ae039.remove(self.allNodes, node);
        });
        return self;
    }
    add(nodes, useMainCanvas) {
        const self = this;
        if (!Array.isArray(nodes)) nodes = [
            nodes
        ];
        nodes.forEach((node)=>{
            node.slate = self.slate // parent
            ;
            self.allNodes.push(node);
            self.addToCanvas(node, useMainCanvas);
        });
    }
    remove(nodes) {
        const self = this;
        if (!Array.isArray(nodes)) nodes = [
            nodes
        ];
        nodes.forEach((node)=>{
            self.allNodes = $078ffda75962dda9$export$2e2bcd8739ae039.remove(self.allNodes, node);
            node.slate = null;
            self.removeFromCanvas(node);
        });
    }
    nodeMovePackage(opts = {
    }) {
        // if exporting a move package with moves applied (e.g., you're
        // planning on manipulating the slate programmatically and this is
        // not an export bound for collaboration (at first)) -- then we need
        // to apply the final results to a copy of the slate because they are need
        // for the calculations below, and those calcs are mutable, so they
        // cannot be applied to the current slate.
        let _use = this.slate;
        let divCopy = null;
        if (opts && opts.moves) {
            divCopy = document.createElement('div');
            const _did = `copy_${$c09005a36c8880c7$export$2e2bcd8739ae039.guid()}`;
            divCopy.setAttribute('id', _did);
            divCopy.setAttribute('style', `width:1px;height:1px;display:none;`);
            document.body.appendChild(divCopy);
            _use = this.slate.copy({
                container: _did,
                moves: opts.moves
            });
        }
        const nds = opts?.nodes || _use.nodes.allNodes;
        const _ret = {
            dur: opts ? opts.dur : 300,
            easing: opts ? opts.easing : '>',
            textPositions: (()=>nds.map((node)=>({
                        id: node.options.id,
                        textPosition: {
                            x: node.text.attrs.x,
                            y: node.text.attrs.y,
                            transform: node.getTransformString()
                        }
                    })
                )
            )(),
            nodeOptions: nds.map((node)=>{
                return {
                    id: node.options.id,
                    vectorPath: node.options.vectorPath,
                    xPos: node.options.xPos,
                    yPos: node.options.yPos
                };
            }),
            associations: (()=>{
                const assoc = [];
                if (opts.relationships && opts.nodes) opts.relationships.forEach((a)=>{
                    assoc.push({
                        parentId: a.parent.options.id,
                        childId: a.child.options.id,
                        linePath: a.line.attr('path').toString(),
                        id: a.line.id
                    });
                });
                else _use.nodes.allNodes.forEach((node)=>{
                    node.relationships.associations.forEach((a)=>{
                        assoc.push({
                            parentId: a.parent.options.id,
                            childId: a.child.options.id,
                            linePath: a.line.attr('path').toString(),
                            id: a.line.id
                        });
                    });
                });
                return $i9J9X$lodashuniq(assoc, (a)=>a.id
                );
            })()
        };
        if (divCopy) document.body.removeChild(divCopy);
        return _ret;
    }
    moveNodes(pkg, options = {
    }) {
        this.closeAllLineOptions();
        this.closeAllMenus();
        // _node.hideOwnMenus();
        const allAssoc = [];
        this.allNodes.forEach((node)=>{
            node.relationships.associations.forEach((a)=>{
                allAssoc.push(a);
            });
        });
        const uniqAssoc = $i9J9X$lodashuniq(allAssoc, (a)=>a.id
        );
        const p = pkg.data || pkg;
        const d = p.dur || 300;
        const e = p.easing || '>';
        const { associations: associations , nodeOptions: nodeOptions , textPositions: textPositions  } = p;
        let cntr = 0;
        function _potentiallyFinalize() {
            cntr += 1;
            if (cntr === nodeOptions.length && options.cb) {
                options.cb();
                delete options.cb;
            }
        }
        nodeOptions.forEach((opts)=>{
            const nodeObject = this.allNodes.find((node)=>node.options.id === opts.id
            );
            if (nodeObject) {
                Object.assign(nodeObject.options, opts);
                const dps = $ac8758a7f1503a19$export$2e2bcd8739ae039({
                    x: opts.xPos,
                    y: opts.yPos
                }, nodeObject.options);
                const { lx: lx , ty: ty  } = dps;
                const currentTextPosition = textPositions.find((tp)=>tp.id === opts.id
                );
                if (options.animate) {
                    nodeObject.text.animate(currentTextPosition.textPosition, d, e);
                    nodeObject.link.animate({
                        x: lx,
                        y: ty
                    }, d, e);
                } else {
                    nodeObject.text.attr(currentTextPosition.textPosition);
                    nodeObject.link.attr({
                        x: lx,
                        y: ty
                    });
                }
                if (options.animate) {
                    if (nodeObject) nodeObject.vect.animate({
                        path: opts.vectorPath,
                        transform: nodeObject.getTransformString()
                    }, d, e, ()=>{
                        nodeObject.vect.attr({
                            path: opts.vectorPath
                        });
                        nodeObject.images.imageSizeCorrection();
                        _potentiallyFinalize();
                    });
                } else {
                    if (nodeObject) nodeObject.vect.attr({
                        path: opts.vectorPath
                    });
                    let rotationOptions = {
                    };
                    if (options.useMainCanvas) {
                        const tempPath = this.slate.paper.path(nodeObject.vect.attr('path')) // Meteor.currentSlate.paper.
                        ;
                        rotationOptions = {
                            boundingClientRect: tempPath[0].getBoundingClientRect()
                        };
                        tempPath.remove();
                    }
                    nodeObject.rotate.applyImageRotation(rotationOptions);
                    nodeObject.images.imageSizeCorrection();
                    _potentiallyFinalize();
                }
            }
        });
        associations.forEach((assoc)=>{
            const a = uniqAssoc.find((ax)=>ax.parent.options.id === assoc.parentId && ax.child.options.id === assoc.childId
            );
            if (options.animate) {
                if (a) a.line.animate({
                    path: assoc.linePath
                }, d, e, ()=>{
                    a.line.attr({
                        path: assoc.linePath
                    });
                    _potentiallyFinalize();
                });
            } else {
                if (a) a.line.attr({
                    path: assoc.linePath
                });
                _potentiallyFinalize();
            }
        });
        this.slate.birdsEye?.refresh(true);
    }
    getRelevantAssociationsWith(nodes) {
        const _relationshipsToTranslate = [];
        const _relationshipsToRefresh = [];
        nodes.forEach((node)=>{
            const otherSelectedNodes = nodes.filter((n)=>n.options.id !== node.options.id
            );
            node.relationships.associations.forEach((assoc)=>{
                if (otherSelectedNodes.map((n)=>n.relationships.associations
                ).some((associations)=>associations.find((a)=>a.id === assoc.id
                    )
                )) {
                    if (!_relationshipsToTranslate.some((r)=>r.id === assoc.id
                    )) _relationshipsToTranslate.push(assoc) // connections which move with both nodes
                    ;
                } else if (!_relationshipsToRefresh.some((r)=>r.id === assoc.id
                )) _relationshipsToRefresh.push(assoc) // connections which move on one end only
                ;
            });
        });
        return {
            relationshipsToRefresh: _relationshipsToRefresh,
            relationshipsToTranslate: _relationshipsToTranslate
        };
    }
    translateRelationships(relationships, { dx: dx , dy: dy  }) {
        relationships.forEach((r)=>{
            r.line.transform(`T${dx}, ${dy}`);
        });
    }
    saveRelationships(relationships, { dx: dx , dy: dy  }) {
        relationships.forEach((r)=>{
            const newLinePath = $c09005a36c8880c7$export$2e2bcd8739ae039._transformPath(r.line.attr('path').toString(), `T${dx},${dy}`).toString();
            r.line.attr({
                path: newLinePath
            });
            r.line.transform('');
        });
    }
    removeRelationship(rm) {
        const pc = this._getParentChild(rm);
        const _parent = pc.p;
        const _child = pc.c;
        if (_parent && _child) {
            // _parent.relationships.removeChild(_child);
            // _child.relationships.removeParent(_parent);
            _parent.relationships.removeAssociation(_child);
            _child.relationships.removeAssociation(_parent);
        }
    }
    refreshAllRelationships() {
        this.allNodes.forEach((node)=>{
            node.relationships.refreshOwnRelationships();
        });
    }
    addRelationship(add) {
        const pc = this._getParentChild(add);
        const _parent = pc.p;
        const _child = pc.c;
        if (_parent && _child) switch(add.type){
            case 'association':
                _parent.relationships.addAssociation(_child, add.options);
                break;
            default:
                break;
        }
    }
    closeAllLineOptions(exception) {
        this.allNodes.forEach((node)=>{
            node.relationships.associations.forEach((association)=>{
                if (association.id !== exception) node.lineOptions?.hide(association.id);
            });
        });
    }
    closeAllMenus({ exception: exception , nodes: nodes  } = {
    }) {
        (nodes || this.allNodes).forEach((node)=>{
            if (node.options.id !== exception) {
                node.menu.hide();
                node.lineOptions?.hideAll();
                node.resize?.hide();
                node.rotate?.hide();
            }
        });
    }
    closeAllConnectors() {
        this.allNodes.forEach((node)=>{
            node.connectors?.remove();
            node.resize?.hide();
            node.rotate?.hide();
        });
    }
    one(id) {
        let cn = null;
        this.allNodes.forEach((node)=>{
            if (node.options.id === id) cn = node;
        });
        return cn;
    }
    removeFromCanvas(_node) {
        [
            'vect',
            'text',
            'link'
        ].forEach((tt)=>{
            _node[tt].remove();
        });
        this._refreshBe();
    }
    addToCanvas(_node, useMainCanvas) {
        _node.slate = this.slate;
        let vect = null;
        let link = null;
        const vectOpt = {
            fill: _node.options.backgroundColor || '#fff',
            'fill-opacity': _node.options.opacity != null ? _node.options.opacity : 1
        };
        Object.assign(vectOpt, _node.applyBorder());
        const _x = _node.options.xPos;
        const _y = _node.options.yPos;
        const paperToUse = this.slate.paper;
        const percent = 1;
        const _width = _node.options.width;
        const _height = _node.options.height;
        const _transforms = [
            `T${_x * percent}, ${_y * percent}`,
            `s${_width / 150 * percent}, ${_height / 100 * percent}, ${_x}, ${_y}`, 
        ];
        _node.options.isEllipse = _node.options.isEllipse || _node.options.vectorPath === 'ellipse';
        switch(_node.options.vectorPath){
            case 'ellipse':
                _node.options.vectorPath = $d2703cad5fa90838$export$2e2bcd8739ae039('M150,50 a75,50 0 1,1 0,-1 z', _transforms);
                break;
            case 'rectangle':
                _node.options.vectorPath = $d2703cad5fa90838$export$2e2bcd8739ae039('M1,1 h150 v100 h-150 v-100 z', _transforms);
                break;
            case 'roundedrectangle':
                _node.options.vectorPath = $d2703cad5fa90838$export$2e2bcd8739ae039('M1,1 h130 a10,10 0 0 1 10,10 v80 a10,10 0 0 1 -10,10 h-130 a10,10 0 0 1 -10,-10 v-80 a10,10 0 0 1 10,-10 z', _transforms);
                break;
            default:
                break;
        }
        if (_node.options.vectorPath === 'M2,12 L22,12') vectOpt['stroke-dasharray'] = '2px';
        vect = paperToUse.path(_node.options.vectorPath).attr(vectOpt);
        vect.node.style.cursor = 'pointer';
        // need to set in case toback or tofront is called and the load order changes in the context plugin
        vect.node.setAttribute('rel', _node.options.id);
        vect.data({
            id: _node.options.id
        });
        _node.vect = vect;
        // _node.vect.ox = _x;
        // _node.vect.oy = _y;
        // get the text coords before the transform is applied
        // var tc = _node.textCoords();
        _node.vect.transform(_node.getTransformString());
        // update xPos, yPos in case it is different than actual
        const bbox = vect.getBBox();
        _node.options.xPos = bbox.x;
        _node.options.yPos = bbox.y;
        const lc = _node.linkCoords();
        // apply the text coords prior to transform
        // text = paperToUse.text(tc.x, tc.y, (_node.options.text || '')).attr({ "font-size": _node.options.fontSize + "pt", fill: _node.options.foregroundColor || "#000" });
        link = paperToUse.linkArrow().transform([
            't',
            lc.x,
            ',',
            lc.y,
            's',
            '.8',
            ',',
            '.8',
            'r',
            '180'
        ].join()).attr({
            cursor: 'pointer'
        });
        // create and set editor
        _node.editor = new $eb3767c9e63a8879$export$2e2bcd8739ae039(this.slate, _node);
        _node.editor.set() // creates and sets the text
        ;
        _node.text.transform(_node.getTransformString());
        // set link
        _node.link = link;
        _node.both = new _node.slate.paper.set();
        _node.both.push(_node.vect);
        _node.both.push(_node.text);
        // relationships
        _node.relationships = new $83a856cccf23a598$export$2e2bcd8739ae039(this.slate, _node);
        _node.relationships.wireDragEvents();
        // rotate
        _node.rotate = new $153ebcbc4f900f73$export$2e2bcd8739ae039(this.slate, _node);
        // connectors
        _node.connectors = new $d1ac19fab569a7ad$export$2e2bcd8739ae039(this.slate, _node);
        // menu
        _node.menu = new $481ed38b48fbf8a1$export$2e2bcd8739ae039(this.slate, _node);
        // resizer
        _node.resize = new $a7cd8c5030694da2$export$2e2bcd8739ae039(this.slate, _node);
        // images
        _node.images = new $fcb214a7591c9017$export$2e2bcd8739ae039(this.slate, _node);
        // context
        _node.context = new $f3109bf87f06806c$export$2e2bcd8739ae039(this.slate, _node);
        // lineOptions
        _node.lineOptions = new $91c49a65b5f923ca$export$2e2bcd8739ae039(this.slate, _node);
        // shapes
        _node.shapes = new $ab50f45f60e457ee$export$2e2bcd8739ae039(this.slate, _node);
        // customShapes
        _node.customShapes = new $60ff234bef37cf38$export$2e2bcd8739ae039(this.slate, _node);
        // colorPicker
        _node.colorPicker = new $4c688f6798a93fae$export$2e2bcd8739ae039(this.slate, _node);
        // gridLines
        _node.gridLines = new $ad25bb61235aed3a$export$2e2bcd8739ae039(this.slate, _node);
        //links
        _node.links = new $9b4fe9d080edff94$export$2e2bcd8739ae039(this.slate, _node);
        if (_node.options.image && !_node.options.imageOrigHeight) _node.options.imageOrigHeight = _node.options.height;
        if (_node.options.image && !_node.options.imageOrigWidth) _node.options.imageOrigWidth = _node.options.width;
        if (_node.options.image && _node.options.image !== '') _node.images.set(_node.options.image, _node.options.imageOrigWidth, _node.options.imageOrigHeight, useMainCanvas);
        if (!_node.options.link || !_node.options.link.show) _node.link.hide();
        // apply any node filters to vect and/or text
        _node.applyFilters();
        this._refreshBe();
        return vect;
    }
}








class $25c48b1549ac282f$export$2e2bcd8739ae039 {
    constructor(slate){
        const self = this;
        self.slate = slate;
        self.selRect = null // used during selection
        ;
        self.ox = null;
        self.oy = null;
        self._init = null;
        self.marker = null // stays after selection
        ;
        self.selectedNodes = [];
        self.relationshipsToTranslate = [];
        self.relationshipsToRefresh = [];
        self.origPos = null;
        self.resizer = null;
        self.minSize = 100;
        self._icons = [];
        self.iconBg = null;
        self.moveX = 0;
        self.moveY = 0;
        self.asIndiv = false;
        self.attrs = {
            create: {
                fill: '#fff',
                stroke: '#000'
            },
            mouseOut: {
                fill: '#fff',
                stroke: '#000'
            },
            mouseOver: {
                fill: '#ccc',
                cursor: 'pointer'
            }
        };
    }
    init() {
        const self = this;
        if (self.slate.options.isbirdsEye) return;
        function finalize() {
            // self.showConnections(self.relationshipsToTranslate.concat(self.relationshipsToRefresh));
            self.slate.options.allowDrag = true;
            self.slate.birdsEye?.refresh(true);
            self.selectedNodes.forEach((node)=>{
                $c09005a36c8880c7$export$2e2bcd8739ae039.transformPath(node, `T${self.moveX},${self.moveY}`);
                node.vect.currentDx = 0;
                node.vect.currentDy = 0;
            });
            $16aae51a7872bfb0$export$2e2bcd8739ae039({
                relationships: self.relationshipsToRefresh,
                nodes: self.selectedNodes,
                moveX: self.moveX,
                moveY: self.moveY
            });
            self.slate.nodes.saveRelationships(self.relationshipsToTranslate, {
                dx: self.moveX,
                dy: self.moveY
            });
            $25c48b1549ac282f$export$2e2bcd8739ae039.showConnections(self.relationshipsToTranslate.concat(self.relationshipsToRefresh));
            self.broadcastMove();
            self.showIcons();
            self.origPos = self.marker.getBBox();
            self.marker.toBack();
            self.slate?.grid.toBack();
            self.slate?.canvas.bgToBack();
        }
        const c = self.slate.options.container;
        if (self.slate.options.showMultiSelect) {
            self._init = document.createElement('div');
            self._init.setAttribute('class', 'slateMultiSelect');
            self._init.style.position = 'absolute';
            self._init.style.height = '30px';
            self._init.style.left = '10px';
            self._init.style.color = '#081272';
            self._init.style.fontSize = '11pt';
            self._init.style.fontFamily = 'trebuchet ms';
            self._init.style.top = '5px';
            self._init.style.display = 'block';
            self._init.style.padding = '5px';
            self._init.style.margin = '5px;';
            self._init.style.backgroundColor = '#fff';
            self._init.style.cursor = 'pointer';
            self._init.style['user-select'] = 'none';
            self._init.innerHTML = '[multi-select]';
            self._init.style.zIndex = '0';
            c.appendChild(self._init);
            self.markerEvents = {
                init () {
                    self.hideIcons();
                    $25c48b1549ac282f$export$2e2bcd8739ae039.hideConnections(self.relationshipsToTranslate.concat(self.relationshipsToRefresh));
                    self.moveX = 0;
                    self.moveY = 0;
                    self.slate.options.allowDrag = false;
                    self.marker.ox = self.marker.attr('x');
                    self.marker.oy = self.marker.attr('y');
                    self.selectedNodes.forEach((node)=>{
                        node.unmark();
                        const bb = node.vect.getBBox();
                        node.vect.ox = bb.x;
                        node.vect.oy = bb.y;
                    });
                },
                move (dx, dy) {
                    try {
                        const _zr = self.slate.options.viewPort.zoom.r;
                        dx += dx / _zr - dx;
                        dy += dy / _zr - dy;
                        self.moveX = dx;
                        self.moveY = dy;
                        const att = {
                            x: self.marker.ox + dx,
                            y: self.marker.oy + dy
                        };
                        self.marker.attr(att);
                        self.selectedNodes.forEach((node)=>{
                            node.vect.currentDx = dx;
                            node.vect.currentDy = dy;
                            node.translateWith({
                                dx: dx,
                                dy: dy
                            });
                        });
                        const _nx = self.origPos.x + self.origPos.width + dx - 5;
                        const _ny = self.origPos.y + self.origPos.height + dy - 5;
                        self.resizer.transform([
                            't',
                            _nx,
                            ',',
                            _ny,
                            ' r95 s1.5,1.5'
                        ].join(''));
                    } catch (err) {
                        finalize();
                    }
                },
                up (e) {
                    if (self.asIndiv) self.selectedNodes.forEach((node)=>{
                        node.mark();
                    });
                    finalize(e);
                }
            };
            self.resizeEvents = {
                init () {
                    self.hideIcons();
                    $25c48b1549ac282f$export$2e2bcd8739ae039.hideConnections(self.relationshipsToTranslate.concat(self.relationshipsToRefresh));
                    self.moveX = 0;
                    self.moveY = 0;
                    self.slate.options.allowDrag = false;
                    self.selectedNodes.forEach((node)=>{
                        node.unmark();
                        const bb = node.vect.getBBox();
                        node.vect.ox = bb.x;
                        node.vect.oy = bb.y;
                    });
                    self.marker.toBack();
                    self.slate?.grid.toBack();
                    self.slate?.canvas.bgToBack();
                },
                move (dx, dy) {
                    const _zr = self.slate.options.viewPort.zoom.r;
                    dx += dx / _zr - dx;
                    dy += dy / _zr - dy;
                    self.moveX = dx;
                    self.moveY = dy;
                    let _width = self.origPos.width + dx * 2;
                    let _height = self.origPos.height + dy * 2;
                    const _nx = self.origPos.x + self.origPos.width + dx - 5;
                    const _ny = self.origPos.y + self.origPos.height + dy - 5;
                    let rw = true;
                    let rh = true;
                    if (_width < self.minSize) {
                        _width = self.minSize;
                        rw = false;
                    }
                    if (_height < self.minSize) {
                        _height = self.minSize;
                        rh = false;
                    }
                    self.resizer.transform([
                        't',
                        _nx,
                        ',',
                        _ny,
                        ' r95 s1.5,1.5'
                    ].join(''));
                    const att = {
                        width: _width,
                        height: _height
                    };
                    if (rw) Object.assign(att, {
                        x: self.origPos.x - dx
                    });
                    if (rh) Object.assign(att, {
                        y: self.origPos.y - dy
                    });
                    self.marker.attr(att);
                },
                up () {
                    $25c48b1549ac282f$export$2e2bcd8739ae039.showConnections(self.relationshipsToTranslate.concat(self.relationshipsToRefresh));
                    self.selectedNodes.forEach((node)=>{
                        const transWidth = node.options.width + self.moveX;
                        const transHeight = node.options.height + self.moveY;
                        node.resize.set(transWidth, transHeight, {
                            isMoving: true,
                            getRotationPoint: node.options.rotate.rotationAngle
                        });
                        node.images.imageSizeCorrection();
                        if (self.asIndiv) node.mark();
                    });
                    $16aae51a7872bfb0$export$2e2bcd8739ae039({
                        relationships: self.relationshipsToRefresh.concat(self.relationshipsToTranslate),
                        nodes: self.selectedNodes,
                        dx: 0,
                        dy: 0
                    });
                    self.broadcastMove();
                    self.origPos = self.marker.getBBox();
                    const _nx = self.origPos.x + self.origPos.width;
                    const _ny = self.origPos.y + self.origPos.height;
                    self.resizer.transform([
                        't',
                        _nx - 5,
                        ',',
                        _ny - 5
                    ].join(''));
                    self.refreshMarker();
                    self.showIcons();
                    self.marker.toBack();
                    self.slate?.grid.toBack();
                    self.slate?.canvas.bgToBack();
                    self.slate.enable();
                }
            };
            $c09005a36c8880c7$export$2e2bcd8739ae039.addEvent(self._init, 'click', (e)=>{
                switch(self._init.innerHTML){
                    case '[multi-select]':
                        self.start();
                        break;
                    case 'selecting [click to stop]...':
                        self.end(false);
                        self.endSelection();
                        break;
                    default:
                        break;
                }
            });
        }
    }
    hide() {
        const self = this;
        if (self._init) self._init.style.display = 'none';
    }
    show() {
        const self = this;
        if (self._init) self._init.style.display = 'block';
    }
    add(node) {
        const self = this;
        self.asIndiv = true;
        if (!self.selectedNodes.find((n)=>n.options.id === node.options.id
        )) self.selectedNodes.push(node);
        self.hideIcons();
        self.prepSelectedNodes();
    }
    clear() {
        const self = this;
        self.asIndiv = false;
        self.selectedNodes.forEach((node)=>{
            node.unmark();
        });
        self.selectedNodes = [];
        self.hideIcons();
        self.prepSelectedNodes();
    }
    remove(node) {
        const self = this;
        node.unmark();
        self.selectedNodes = self.selectedNodes.filter((n)=>n.options.id !== node.options.id
        );
        self.asIndiv = self.selectedNodes.length > 0;
        self.hideIcons();
        self.prepSelectedNodes();
    }
    start() {
        const self = this;
        self.slate.disable() // options.allowDrag = false;
        ;
        if (self._init) self._init.innerHTML = 'selecting [click to stop]...';
        document.head.insertAdjacentHTML('beforeend', `<style id='svg-no-select-text'>.slatebox-text { -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; }</style>`);
        // document.head.insertAdjacentHTML("beforeend", `<style id='svg-no-select-text'>svg text { pointer-events: none; }</style>`);
        const c = self.slate.options.container;
        self.slate.onSelectionStart = (e)=>{
            if (self.slate.options.showMultiSelect) {
                self.end();
                const p = self.xy(e);
                self.selRect = self.slate.paper.rect(p.x, p.y, 10, 10).attr({
                    'stroke-dasharray': '-'
                });
                $c09005a36c8880c7$export$2e2bcd8739ae039.addEvent(self.slate.canvas.get(), 'mousemove', self._move.bind(self), null);
                $c09005a36c8880c7$export$2e2bcd8739ae039.addEvent(self.slate.canvas.get(), 'mouseup', self._mouseUp.bind(self), null, true);
                $c09005a36c8880c7$export$2e2bcd8739ae039.addEvent(self.slate.canvas.get(), 'mouseleave', self._select.bind(self), null, true);
                window.addEventListener('beforeunload', self._enableOnRefresh);
                self.ox = p.x;
                self.oy = p.y;
            }
        };
    }
    _enableOnRefresh() {
        const self = this;
        self.relationshipsToTranslate = [];
        self.relationshipsToRefresh = [];
        self.selectedNodes = [];
        self.slate.enable();
        self.broadcastMove() // broadcast an "empty" move to save the enabled state of the slate
        ;
    }
    createCopiedNodes(nodeOptions, assocDetails) {
        const self = this;
        nodeOptions.forEach((n)=>{
            const nn = new $0ce36565345e4082$export$6cc593952597f80d.node(n);
            self.slate.nodes.add(nn);
        });
        assocDetails.forEach((a)=>{
            const parentNode = self.slate.nodes.one(a.parentNodeId);
            const childNode = self.slate.nodes.one(a.childNodeId);
            const assocPkg = a.assocPkg;
            assocPkg.child = self.slate.nodes.one(a.assocPkg.childId);
            assocPkg.parent = self.slate.nodes.one(a.assocPkg.parentId);
            delete assocPkg.childId;
            delete assocPkg.parentId;
            parentNode.relationships.addAssociation(childNode, assocPkg);
        });
    }
    showIcons() {
        const self = this;
        if (self.marker !== null) {
            const groupIds = $i9J9X$lodashuniq(self.selectedNodes.map((n)=>n.options.groupId
            ));
            const isGrouped = groupIds.length === 1 && groupIds[0] !== null;
            const markerBB = self.marker.getBBox();
            const multiX = markerBB.x + markerBB.width + 45;
            // TODO: decide if you want to use a settings button here
            const showSettings = true;
            const heightSpacer = 50;
            self.iconBg?.remove();
            self.iconBg = self.slate.paper.rect(multiX - 10, markerBB.y + heightSpacer - 10, 50, heightSpacer * 4, 5).attr({
                ...self.attrs.create,
                opacity: 0.3
            }).toBack();
            const del = self.slate.paper.trash().attr({
                fill: '#fff',
                stroke: '#f00'
            }).transform([
                't',
                multiX,
                ',',
                markerBB.y + heightSpacer * 4,
                's',
                ',',
                '1.25',
                '1.25', 
            ].join());
            del.mouseover((e)=>{
                del.attr(self.attrs.mouseOver);
                $c09005a36c8880c7$export$2e2bcd8739ae039.stopEvent(e);
            });
            del.mouseout((e)=>{
                del.attr({
                    fill: '#fff',
                    stroke: '#f00'
                });
                $c09005a36c8880c7$export$2e2bcd8739ae039.stopEvent(e);
            });
            del.mousedown((e)=>{
                $c09005a36c8880c7$export$2e2bcd8739ae039.stopEvent(e);
                self.del();
            });
            const copy = self.slate.paper.copy().attr(self.attrs.create).transform([
                't',
                multiX,
                ',',
                markerBB.y + heightSpacer * 2,
                's',
                ',',
                '1.25',
                '1.25', 
            ].join());
            copy.mouseover((e)=>{
                copy.attr(self.attrs.mouseOver);
                $c09005a36c8880c7$export$2e2bcd8739ae039.stopEvent(e);
            });
            copy.mouseout((e)=>{
                copy.attr(self.attrs.mouseOut);
                $c09005a36c8880c7$export$2e2bcd8739ae039.stopEvent(e);
            });
            copy.mousedown((e)=>{
                $c09005a36c8880c7$export$2e2bcd8739ae039.stopEvent(e);
                const snap = self.slate.snapshot();
                const nGroupId = self.selectedNodes[0].options.groupId ? $c09005a36c8880c7$export$2e2bcd8739ae039.guid().replace(/-/gi, '').substring(0, 8).toUpperCase() : null;
                const orient = self.slate.getOrientation(self.selectedNodes);
                const pad = 75;
                const relationalMap = {
                };
                const nodeOptions = [];
                const assocDetails = [];
                self.selectedNodes.forEach((node)=>{
                    const c = $i9J9X$lodashclonedeep(node.options);
                    c.xPos += orient.width + pad;
                    c.groupId = nGroupId;
                    c.id = $c09005a36c8880c7$export$2e2bcd8739ae039.guid().replace(/-/gi, '').substring(0, 12);
                    relationalMap[node.options.id] = c.id;
                    c.vectorPath = $c09005a36c8880c7$export$2e2bcd8739ae039._transformPath(c.vectorPath, `T${orient.width + pad},0`);
                    nodeOptions.push(c);
                    const nn = new $0ce36565345e4082$export$6cc593952597f80d.node(c);
                    self.slate.nodes.add(nn);
                });
                // next add relationships
                const an = self.slate.nodes.allNodes;
                self.selectedNodes.forEach((node)=>{
                    const nn = an.find((n)=>n.options.id === relationalMap[node.options.id]
                    );
                    // with nn as "parent", add all its children
                    node.relationships.associations.filter((a)=>a.parent.options.id === node.options.id
                    ).forEach((a)=>{
                        const assocPkg = $i9J9X$lodashclonedeep(a);
                        delete assocPkg.line // ensure new line is created
                        ;
                        assocPkg.id = $c09005a36c8880c7$export$2e2bcd8739ae039.guid().replace(/-/gi, '').substring(0, 12);
                        assocPkg.activeNode = relationalMap[assocPkg.activeNode];
                        let childNode = an.find((n)=>n.options.id === relationalMap[a.child.options.id]
                        );
                        if (!childNode) childNode = an.find((n)=>n.options.id === a.child.options.id
                        );
                        const sendAssocPkg = $i9J9X$lodashomit(assocPkg, [
                            'child',
                            'parent'
                        ]);
                        sendAssocPkg.childId = assocPkg.child.options.id;
                        sendAssocPkg.parentId = assocPkg.parent.options.id;
                        assocDetails.push({
                            parentNodeId: nn.options.id,
                            childNodeId: childNode.options.id,
                            assocPkg: sendAssocPkg
                        });
                        nn.relationships.addAssociation(childNode, assocPkg);
                    });
                });
                // send collaboration info
                const pkg = {
                    type: 'onNodeAdded',
                    data: {
                        multiSelectCopy: true,
                        nodeOptions: nodeOptions,
                        assocDetails: assocDetails
                    }
                };
                self.slate.collab.send(pkg);
            });
            self._icons.push(copy);
            if (!isGrouped) {
                const group = self.slate.paper.plus().attr(self.attrs.create).transform([
                    't',
                    multiX,
                    ',',
                    markerBB.y + heightSpacer,
                    's',
                    ',',
                    '1.25',
                    '1.25', 
                ].join());
                group.mouseover((e)=>{
                    group.attr(self.attrs.mouseOver);
                    $c09005a36c8880c7$export$2e2bcd8739ae039.stopEvent(e);
                });
                group.mouseout((e)=>{
                    group.attr(self.attrs.mouseOut);
                    $c09005a36c8880c7$export$2e2bcd8739ae039.stopEvent(e);
                });
                group.mousedown((e)=>{
                    const groupId = $c09005a36c8880c7$export$2e2bcd8739ae039.guid().replace(/-/gi, '').substring(0, 8).toUpperCase();
                    self.selectedNodes.forEach((n)=>{
                        n.options.groupId = groupId;
                    });
                    $c09005a36c8880c7$export$2e2bcd8739ae039.stopEvent(e);
                    self.endSelection();
                    self.end();
                    self.showGroup(groupId);
                });
                self._icons.push(group);
            } else {
                const ungroup = self.slate.paper.minus().attr(self.attrs.create).transform([
                    't',
                    multiX,
                    ',',
                    markerBB.y + heightSpacer,
                    's',
                    ',',
                    '1.25',
                    '1.25', 
                ].join());
                ungroup.mouseover((e)=>{
                    ungroup.attr(self.attrs.mouseOver);
                    $c09005a36c8880c7$export$2e2bcd8739ae039.stopEvent(e);
                });
                ungroup.mouseout((e)=>{
                    ungroup.attr(self.attrs.mouseOut);
                    $c09005a36c8880c7$export$2e2bcd8739ae039.stopEvent(e);
                });
                ungroup.mousedown((e)=>{
                    self.selectedNodes.forEach((n)=>{
                        n.options.groupId = null;
                    });
                    $c09005a36c8880c7$export$2e2bcd8739ae039.stopEvent(e);
                    self.hideIcons();
                    self.showIcons();
                });
                self._icons.push(ungroup);
            }
            if (showSettings) {
                const settings = self.slate.paper.setting().attr(self.attrs.create).transform([
                    't',
                    multiX,
                    ',',
                    markerBB.y + heightSpacer * 3,
                    's',
                    ',',
                    '1.25',
                    '1.25', 
                ].join());
                settings.mouseover((e)=>{
                    settings.attr(self.attrs.mouseOver);
                    $c09005a36c8880c7$export$2e2bcd8739ae039.stopEvent(e);
                });
                settings.mouseout((e)=>{
                    settings.attr(self.attrs.mouseOut);
                    $c09005a36c8880c7$export$2e2bcd8739ae039.stopEvent(e);
                });
                settings.mousedown((e)=>{
                    $c09005a36c8880c7$export$2e2bcd8739ae039.stopEvent(e);
                    if (self.slate.events?.onMenuRequested) self.slate.events?.onMenuRequested(self.selectedNodes, ()=>{
                    });
                });
                self._icons.push(settings);
            }
            self._icons.push(del);
        }
    }
    hideIcons() {
        const self = this;
        self.iconBg?.remove();
        self._icons?.forEach((i)=>i.remove()
        );
    }
    isSelecting() {
        const self = this;
        return self.marker !== null;
    }
    del() {
        const self = this;
        self.slate.events.onConfirmRequested(`Confirm Deletion`, `Are you sure you want to remove these ${self.selectedNodes.length} node(s)?`, (blnConfirm)=>{
            if (blnConfirm) {
                self.selectedNodes.forEach((node)=>{
                    node.del();
                    self.slate.unglow();
                    const delPkg = {
                        type: 'onNodeDeleted',
                        data: {
                            id: node.options.id
                        }
                    };
                    self.slate.collab?.send(delPkg);
                    self.slate.birdsEye?.nodeDeleted(delPkg);
                });
                self.end();
            }
        });
    }
    end(hasMarker = true) {
        const self = this;
        if (self.marker !== null || !hasMarker) {
            self.marker?.remove();
            self.resizer?.remove();
            self.marker = null;
            self.slate.enable();
            // self.slate.keyboard && self.slate.keyboard.end();
            self.hideIcons();
            self.selectedNodes.forEach((n)=>{
                n.unmark();
            });
            window.removeEventListener('beforeunload', self._enableOnRefresh);
        }
        if (self._init) self._init.innerHTML = '[multi-select]';
    }
    endSelection() {
        const self = this;
        self.selRect?.remove();
        self.showIcons();
        self.slate.options.allowDrag = true;
        self.slate.onSelectionStart = null;
        $c09005a36c8880c7$export$2e2bcd8739ae039.removeEvent(self.slate.canvas.get(), 'mousemove', self._move.bind(self));
    }
    xy(e) {
        const self = this;
        const mp = $c09005a36c8880c7$export$2e2bcd8739ae039.mousePos(e);
        const off = $c09005a36c8880c7$export$2e2bcd8739ae039.positionedOffset(self.slate.options.container);
        const _x = mp.x + self.slate.options.viewPort.left - off.left;
        const _y = mp.y + self.slate.options.viewPort.top - off.top;
        const z = self.slate.options.viewPort.zoom.r;
        return {
            x: _x / z,
            y: _y / z
        };
    }
    _move(e) {
        const self = this;
        if (!self.slate.draggingNode) {
            const p = self.xy(e);
            const height = p.y - self.oy;
            const width = p.x - self.ox;
            if (height > 0) self.selRect.attr({
                height: height
            });
            else self.selRect.attr({
                y: p.y,
                height: self.oy - p.y
            });
            if (width > 0) self.selRect.attr({
                width: width
            });
            else self.selRect.attr({
                x: p.x,
                width: self.ox - p.x
            });
        }
    }
    showGroup(groupId) {
        const self = this;
        self.selectedNodes = self.slate.nodes.allNodes.filter((n)=>n.options.groupId === groupId
        );
        if (self.prepSelectedNodes()) {
            self.refreshMarker();
            self.showIcons();
        }
    }
    refreshMarker() {
        const self = this;
        self.marker?.remove();
        self.resizer?.remove();
        self.iconBg?.remove();
        self.selectedNodes.forEach((n)=>{
            n.unmark();
        });
        const z = self.slate.options.viewPort.zoom.r;
        const orient = self.slate.getOrientation(self.selectedNodes);
        let w = orient.width / z;
        let h = orient.height / z;
        if (w < self.minSize) w = self.minSize;
        if (h < self.minSize) h = self.minSize;
        self.marker = self.slate.paper.rect(orient.left / z, orient.top / z, w, h).attr({
            'stroke-dasharray': '-',
            fill: '#f8f8f8',
            opacity: 0.3
        });
        self.marker.toBack();
        self.slate?.grid.toBack();
        self.slate?.canvas.bgToBack();
        self.origPos = self.marker.getBBox();
        // self.resizer
        const _nx = self.origPos.x + self.origPos.width;
        const _ny = self.origPos.y + self.origPos.height;
        self.resizer = self.slate.paper.resize().transform([
            't',
            _nx - 5,
            ',',
            _ny - 5,
            'r95 s1.5,1.5'
        ].join()).attr({
            fill: '#fff',
            stroke: '#000'
        });
        self.resizer.toFront();
        self.resizer.mouseover((e)=>{
            self.resizer.attr(self.attrs.mouseOver);
            $c09005a36c8880c7$export$2e2bcd8739ae039.stopEvent(e);
        }) // self._resizeHover.bind(self));
        ;
        self.resizer.mouseout((e)=>{
            self.resizer.attr(self.attrs.mouseOut);
            $c09005a36c8880c7$export$2e2bcd8739ae039.stopEvent(e);
        }) // self._resizeHover.bind(self));
        ;
        // self.resizer.unmouseover(self._resizeHover.bind(self));
        self.marker.drag(self.markerEvents.move, self.markerEvents.init, self.markerEvents.up);
        self.resizer.drag(self.resizeEvents.move, self.resizeEvents.init, self.resizeEvents.up);
        if (self.asIndiv) self.selectedNodes.forEach((n)=>{
            n.mark();
        });
    }
    prepSelectedNodes() {
        const self = this;
        // select relevant connections
        if (self.selectedNodes.length > 1) {
            const _associations = self.slate.nodes.getRelevantAssociationsWith(self.selectedNodes);
            self.relationshipsToTranslate = _associations.relationshipsToTranslate;
            self.relationshipsToRefresh = _associations.relationshipsToRefresh;
            self.refreshMarker();
            self.endSelection();
            // unmark all and remove connectors
            self.slate.nodes.closeAllMenus({
                nodes: self.selectedNodes
            });
        } else if (self.selectedNodes.length === 1) {
            self.selectedNodes[0].menu.show();
            self.slate.enable();
            self.endSelection();
            self.end();
            return false;
        } else {
            self.slate.enable();
            self.endSelection();
            self.end();
            return true;
        }
        return false;
    }
    _mouseUp(e) {
        const self = this;
        if (self._init) self._init.innerHTML = '[multi-select]';
        this._select(e);
    }
    _select() {
        const self = this;
        const sr = self.selRect.getBBox();
        if (sr) {
            const withinBox = self.slate.nodes.allNodes.filter((n)=>{
                const inRange = n.options.xPos + n.options.width > sr.x && n.options.xPos < sr.x + sr.width && n.options.yPos + n.options.height > sr.y && n.options.yPos < sr.y + sr.height;
                return inRange && !n.options.isLocked;
            });
            // add any groupIds
            const groupIds = $i9J9X$lodashuniq(withinBox.map((n)=>n.options.groupId
            )).filter((g)=>!!g
            );
            const alreadySelectedIds = withinBox.map((n)=>n.options.id
            );
            self.selectedNodes = self.slate.nodes.allNodes.filter((n)=>alreadySelectedIds.includes(n.options.id) || groupIds.includes(n.options.groupId)
            );
            self.prepSelectedNodes();
        }
    }
    static hideConnections(connections) {
        connections.forEach((c)=>{
            c.line.hide();
        });
    }
    static showConnections(connections) {
        connections.forEach((c)=>{
            c.line.show();
        });
    }
    broadcastMove() {
        const self = this;
        const pkg = {
            type: 'onNodesMove',
            data: self.slate.nodes.nodeMovePackage({
                nodes: self.selectedNodes,
                relationships: self.relationshipsToTranslate.concat(self.relationshipsToRefresh)
            })
        };
        self.slate.collab?.send(pkg);
        self.slate.birdsEye?.nodeChanged(pkg);
    }
}





class $3982ee4e59d88559$export$2e2bcd8739ae039 {
    constructor(slate){
        this.slate = slate;
        this.be = null;
        this.corner = null;
        this.handle = null;
        this.orx = null;
        this.sp = null;
        this.options = {
            size: 200,
            onHandleMove: null
        };
        this.parentDimen = null;
        this.lastX = null;
        this.lastY = null;
        this.wpadding = null;
        this.hpadding = null;
    }
    setBe() {
        if (this.be) this.be.style.left = `${this.parentDimen.width - this.options.size}px`;
        if (this.be) this.be.style.top = '-2px';
    }
    _hideText() {
        this.corner.nodes.allNodes.forEach((node)=>{
            node.text.hide();
        });
    }
    _wireHandle() {
        const self = this;
        let start = {
        };
        const init = function hnd() {
            self.handle.ox = this.attr('x');
            self.handle.oy = this.attr('y');
            start = $c09005a36c8880c7$export$2e2bcd8739ae039.positionedOffset(self.slate.canvas.internal);
            self.slate.toggleFilters(true);
        };
        const move = function mv(x, y) {
            const _zr = self.corner.options.viewPort.originalWidth / self.sp;
            x += x / _zr - x;
            y += y / _zr - y;
            const _mx = self.handle.ox + x;
            const _my = self.handle.oy + y;
            self.handle.attr({
                x: _mx,
                y: _my
            });
            const bb = self.handle.getBBox();
            const _cx = bb.x * self.slate.options.viewPort.zoom.r;
            const _cy = bb.y * self.slate.options.viewPort.zoom.r;
            self.options.onHandleMove?.apply(self, [
                _cx,
                _cy
            ]);
            self.slate.canvas.move({
                x: _cx,
                y: _cy,
                dur: 0,
                isAbsolute: true
            });
            self.lastX = bb.x;
            self.lastY = bb.y;
        };
        const up = ()=>{
            self.refresh();
            const end = $c09005a36c8880c7$export$2e2bcd8739ae039.positionedOffset(self.slate.canvas.internal);
            self.slate.canvas.broadcast({
                x: start.left - end.left,
                y: start.top - end.top
            });
            self.slate.toggleFilters(false);
        };
        self.handle.drag(move, init, up);
    }
    show(_options) {
        const self = this;
        Object.assign(self.options, _options);
        const c = self.slate.options.container;
        self.parentDimen = $c09005a36c8880c7$export$2e2bcd8739ae039.getDimensions(c);
        self.be = document.createElement('div');
        self.be.setAttribute('id', `slatebirdsEye_${self.slate.options.id}`);
        self.be.setAttribute('class', 'slatebirdsEye');
        self.be.style.position = 'absolute';
        self.be.style.height = `${self.options.size}px`;
        self.be.style.width = `${self.options.size}px`;
        self.be.style.border = '2px inset #333';
        self.be.style.backgroundColor = '#fff';
        c.appendChild(self.be);
        self.setBe();
        self.corner = new $54b0c4bd9bb665f5$export$2e2bcd8739ae039({
            container: `slatebirdsEye_${self.slate.options.id}`,
            viewPort: {
                allowDrag: false
            },
            collaboration: {
                allow: false
            },
            showZoom: false,
            showUndoRedo: false,
            showMultiSelect: false,
            showbirdsEye: false,
            showLocks: false,
            imageFolder: '',
            isbirdsEye: true
        }, {
            onNodeDragged () {
                self.slate.nodes.copyNodePositions(self.corner.nodes.allNodes);
            }
        }).init();
        self.refresh();
        $c09005a36c8880c7$export$2e2bcd8739ae039.addEvent(window, 'resize', ()=>{
            const cx = self.slate.options.container;
            self.parentDimen = $c09005a36c8880c7$export$2e2bcd8739ae039.getDimensions(cx);
            self.setBe();
        });
    }
    enabled() {
        return this.corner !== null;
    }
    enable() {
        if (!this.corner) this.show();
        this.be.style.display = 'block';
    }
    disable() {
        this.be.style.display = 'none';
    }
    relationshipsChanged(pkg) {
        if (this.corner) switch(pkg.type){
            case 'removeRelationship':
                this.corner.nodes.removeRelationship(pkg.data);
                break;
            case 'addRelationship':
                var __pkg = JSON.parse(JSON.stringify(pkg));
                Object.assign(__pkg.data, {
                    options: {
                        lineWidth: 1
                    }
                });
                // data: { id: this.slate.options.id, relationships: rels} };
                this.corner.nodes.addRelationship(__pkg.data);
                break;
            default:
                break;
        }
    }
    nodeChanged(pkg) {
        if (this.corner) {
            if (pkg.type === 'onNodesMove') this.corner.nodes.moveNodes(pkg, {
                useMainCanvas: true
            });
            else {
                const _node = this.corner.nodes.one(pkg.data.id);
                if (_node) {
                    const useMainCanvas = true;
                    switch(pkg.type){
                        case 'onNodeShapeChanged':
                            _node.shapes.set(pkg.data);
                            break;
                        case 'onNodeTextChanged':
                            _node.editor.set(pkg.data.text, pkg.data.fontSize, pkg.data.fontFamily, pkg.data.fontColor, pkg.data.textXAlign, pkg.data.textYAlign);
                            break;
                        case 'onNodeColorChanged':
                            _node.colorPicker.set(pkg.data);
                            break;
                        case 'onNodeImageChanged':
                            _node.images.set(pkg.data.img, pkg.data.w, pkg.data.h, useMainCanvas);
                            this.refresh();
                            break;
                        case 'onNodeResized':
                            Object.assign(_node.options, pkg.data);
                            _node.vect.attr({
                                path: pkg.data.vectorPath
                            });
                            if (_node.vect.pattern) _node.images.imageSizeCorrection();
                            this.refresh();
                            break;
                        case 'onNodeRotated':
                            {
                                pkg.data.associations.forEach((association)=>{
                                    const currentAssociation = _node.relationships.associations.find((ass)=>ass.child.options.id === association.childId && ass.parent.options.id === association.parentId
                                    );
                                    if (currentAssociation) currentAssociation.line.attr({
                                        path: association.linePath
                                    });
                                });
                                Object.assign(_node.options, $i9J9X$lodashomit(pkg.data, 'associations'));
                                const tempPath = this.slate.paper.path(_node.vect.attr('path'));
                                tempPath.remove();
                                _node.rotate.applyImageRotation();
                                this.refresh();
                                break;
                            }
                        case 'onNodeToFront':
                            _node.vect.toFront();
                            break;
                        case 'onNodeToBack':
                            _node.vect.toBack();
                            break;
                        case 'onNodeLocked':
                            _node.options.allowDrag = false;
                            break;
                        case 'onNodeUnlocked':
                            _node.options.allowDrag = true;
                            break;
                        case 'changeLineColor':
                            _node.lineOptions.set(pkg.data);
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    }
    nodeDeleted(pkg) {
        if (this.corner) {
            const _node = this.corner.nodes.one(pkg.data.id);
            _node.del();
        }
    }
    nodeDetatched(pkg) {
        if (this.corner) {
            const _node = this.corner.nodes.one(pkg.data.id);
            _node.relationships.detatch();
        }
    }
    reload(json) {
        this.handle?.remove();
        this.corner.loadJSON(json);
        this.refresh(true);
    }
    refresh(blnNoAdditions) {
        if (this.corner) {
            const c = this.slate.options.container;
            this.parentDimen = $c09005a36c8880c7$export$2e2bcd8739ae039.getDimensions(c);
            this.handle?.remove();
            if (blnNoAdditions === true) {
                this.corner.canvas.move({
                    x: this.slate.options.viewPort.left,
                    y: this.slate.options.viewPort.top,
                    dur: 0,
                    isAbsolute: true
                });
                const useMainCanvas = true;
                this.corner.nodes.copyNodePositions(this.slate.nodes.allNodes, useMainCanvas);
            } else {
                const _export = this.slate.exportDifference(this.corner, 1) // line width override
                ;
                this.corner.loadJSON(_export, true, true, true, true);
            }
            this.orx = this.slate.getOrientation();
            if (this.slate.options.viewPort.left < this.orx.left) this.wpadding = this.slate.options.viewPort.left - this.orx.left;
            else this.wpadding = this.slate.options.viewPort.left - this.orx.left + (this.parentDimen.width - this.orx.width);
            this.hpadding = this.slate.options.viewPort.top - this.orx.top;
            const _pw = Math.max(Math.abs(this.wpadding), this.orx.width < this.parentDimen.width ? this.parentDimen.width - this.orx.width : 0);
            const _ph = Math.max(Math.abs(this.hpadding), this.orx.height < this.parentDimen.height ? this.parentDimen.height - this.orx.height : 0);
            const wp = (this.orx.width + _pw) / this.options.size * this.slate.options.viewPort.width;
            const hp = (this.orx.height + _ph) / this.options.size * this.slate.options.viewPort.height;
            this.sp = Math.max(wp, hp);
            const _r = Math.max(this.slate.options.viewPort.width, this.slate.options.viewPort.height) / this.sp;
            const l = (this.orx.left + (this.wpadding < 0 ? this.wpadding : 0)) * _r - 5;
            const t = (this.orx.top + (this.hpadding < 0 ? this.hpadding : 0)) * _r - 5;
            this.corner.zoom(0, 0, this.sp, this.sp, true);
            this.corner.options.viewPort.zoom.r = this.corner.options.viewPort.originalWidth / this.sp;
            // this.corner.zoom();
            this.corner.canvas.move({
                x: l,
                y: t,
                dur: 0,
                isAbsolute: true
            });
            this.corner.disable();
            const _ix = this.slate.options.viewPort.left / this.slate.options.viewPort.zoom.r;
            const _iy = this.slate.options.viewPort.top / this.slate.options.viewPort.zoom.r;
            const _w = this.parentDimen.width / this.slate.options.viewPort.zoom.r;
            const _h = this.parentDimen.height / this.slate.options.viewPort.zoom.r;
            this.handle = this.corner.paper.rect(_ix, _iy, _w, _h).attr({
                stroke: '#000',
                'stroke-width': 2,
                fill: '#FFEB3A',
                'fill-opacity': '.5'
            });
            this._hideText();
            this._wireHandle();
        }
    }
}




class $c585ab56cf987362$export$2e2bcd8739ae039 {
    constructor(slate){
        this.slate = slate;
        this.scale = 1;
        this.wheelEnd = null;
        this.xyOffset = null;
        if (slate.options.viewPort.useInertiaScrolling) this._init();
    }
    setScale(val) {
        this.scale = val;
    }
    _init() {
        const self = this;
        const wheelGestures = $i9J9X$WheelGestures({
            momentum: true
        });
        // find and observe the element the user can interact with
        wheelGestures.observe(self.slate.canvas.internal);
        // function scale() {
        //   window.requestAnimationFrame(() => {
        //     const style = { transform: `scale(${self.scale})` } //, "transform-origin": `${self.slate.options.viewPort.left}px ${self.slate.options.viewPort.top}px` };
        //     console.log("ws is now", self.xyOffset);
        //     self.slate.canvas.internal.style["transform-origin"] = `${self.slate.options.viewPort.left + self.xyOffset.x}px ${self.slate.options.viewPort.top + self.xyOffset.y}px`;
        //     self.slate.canvas.internal.style.transform = `scale(${self.slate.options.viewPort.zoom.r})`; // = style;
        //   })
        // }
        // add your event callback
        let start = {
        };
        wheelGestures.on('wheel', (e)=>{
            if (self.slate.options.allowDrag) {
                if (e.event.ctrlKey) ;
                else {
                    const deltaX = e.event.deltaX * 0.8 // .5 is the modifier to slow self down a bit
                    ;
                    const deltaY = e.event.deltaY * 0.8;
                    if (e.isStart) {
                        start = $c09005a36c8880c7$export$2e2bcd8739ae039.positionedOffset(self.slate.canvas.internal);
                        // hide filters during dragging
                        self.slate.toggleFilters(true);
                    }
                    self.slate.canvas.move({
                        x: deltaX,
                        y: deltaY,
                        dur: 0,
                        isAbsolute: false
                    });
                    if (e.isEnding) {
                        const end = $c09005a36c8880c7$export$2e2bcd8739ae039.positionedOffset(self.slate.canvas.internal);
                        self.slate.birdsEye?.refresh(true);
                        self.slate.canvas.broadcast({
                            x: start.left - end.left,
                            y: start.top - end.top
                        });
                        // show filters after dragging
                        self.slate.toggleFilters(false);
                    }
                }
            }
        });
    }
}



class $fb2518732a69f403$export$2e2bcd8739ae039 {
    constructor(slate){
        this.slate = slate;
    }
    static perform(pkg, node, op, cb) {
        const det = op.split('@');
        let dur = pkg.defaultDuration || 300;
        const param = det[1];
        switch(det[0]){
            case 'zoom':
                dur = det.length > 2 ? parseFloat(det[2], 10) : pkg.defaultDuration;
                node.zoom(param, dur, cb);
                break;
            case 'position':
                {
                    const ease = det.length > 2 ? det[2] : pkg.defaultEasing;
                    dur = det.length > 3 ? parseFloat(det[3], 10) : pkg.defaultDuration;
                    node.position(param, cb, ease, dur);
                    break;
                }
            default:
                break;
        }
    }
    scaleToFitNodes(_opts) {
        const opts = {
            nodes: null,
            dur: 0,
            cb: null
        };
        Object.assign(opts, _opts);
        const orient = this.slate.getOrientation(opts.nodes);
        const d = $c09005a36c8880c7$export$2e2bcd8739ae039.getDimensions(this.slate.options.container);
        const r = this.slate.options.viewPort.zoom.r || 1;
        const widthZoomPercent = parseInt(d.width / (orient.width / r) * 100, 10) // division by r converts it back from the scaled version
        ;
        const heightZoomPercent = parseInt(d.height / (orient.height / r) * 100, 10);
        // zoom canvas
        this.slate.canvas.zoom({
            dur: opts.dur,
            callbacks: {
                after () {
                    if (opts.cb) opts.cb();
                }
            },
            easing: 'easeFromTo',
            zoomPercent: Math.min(widthZoomPercent, heightZoomPercent)
        });
    }
    // useful for centering the canvas on a collection of nodes
    centerOnNodes(_opts) {
        const self = this;
        const opts = {
            nodes: null,
            dur: 500,
            cb: null
        };
        Object.assign(opts, _opts);
        const orient = self.slate.getOrientation(opts.nodes);
        const d = $c09005a36c8880c7$export$2e2bcd8739ae039.getDimensions(self.slate.options.container);
        const cw = d.width;
        const ch = d.height;
        const nw = orient.width;
        const nh = orient.height;
        // get upper left coords
        const x = orient.left - (cw / 2 - nw / 2);
        const y = orient.top - (ch / 2 - nh / 2);
        self.slate.canvas.move({
            x: x,
            y: y,
            isAbsolute: true,
            dur: opts.dur,
            easing: 'swingFromTo',
            callbacks: {
                after () {
                    setTimeout(()=>{
                        self.slate.birdseye?.refresh(true);
                    }, 100);
                    if (opts.cb) opts.cb();
                }
            }
        });
    }
    // useful for centering the canvas by comparing the viewport's previous width/height to its current width/height
    center(_opts) {
        const self = this;
        const opts = {
            previousWindowSize: {
            },
            dur: 500,
            cb: null
        };
        Object.assign(opts, _opts);
        const ws = $c09005a36c8880c7$export$2e2bcd8739ae039.windowSize();
        this.slate.canvas.move({
            x: (ws.width - opts.previousWindowSize.w) / 2 * -1,
            y: (ws.height - opts.previousWindowSize.h) / 2 * -1,
            duration: opts.dur,
            isAbsolute: false,
            easing: 'swingFromTo',
            callbacks: {
                after: ()=>{
                    self.slate.birdseye?.refresh(true);
                    if (opts.cb) opts.cb();
                }
            }
        });
        return ws;
    }
    // experimental
    bop(opts) {
        const dur = opts && opts.dur && opts.dur !== 0 ? opts.dur : 300;
        const locale = 'center';
        const ease = 'easeTo';
        const presentNodes = _.map(this.slate.nodes.allNodes, (a)=>({
                name: a.options.name,
                operations: [
                    `position@${locale}@${ease}@${dur}`
                ]
            })
        );
        this.slate.controller.present({
            nodes: presentNodes,
            // eslint-disable-next-line no-unused-vars
            nodeChanged: (node)=>{
            },
            // eslint-disable-next-line no-unused-vars
            opChanged: (op)=>{
            },
            complete: ()=>{
            },
            sync: {
                zoom: true,
                position: true
            }
        });
    }
    // expiremental
    shakeNodes() {
        const self = this;
        let s = 0;
        function move() {
            s += 1;
            const mPkg = {
                dur: 500,
                moves: [
                    {
                        id: '*',
                        x: s % 2 === 0 ? 20 : -20,
                        y: s % 2 === 0 ? -20 : -20
                    }, 
                ]
            };
            const pkg = self.slate.nodes.nodeMovePackage(mPkg);
            self.slate.nodes.moveNodes(pkg, {
                animate: true,
                cb: ()=>{
                    setTimeout(()=>{
                        move();
                    }, 4000);
                }
            });
        }
        move();
    }
    pulse(opts) {
        let cycles = 0;
        let dur = 10000 // slow
        ;
        let czp;
        let zp;
        function calc() {
            czp = this.slate.options.viewPort.zoom.r * 100;
            zp = {
                in: czp + 5,
                out: czp - 5
            } // nuance;
            ;
            if (opts) {
                switch(opts.speed){
                    case 'fast':
                        dur = 3000;
                        break;
                    default:
                        break;
                }
                switch(opts.subtlety){
                    case 'trump':
                        zp = {
                            in: czp + 60,
                            out: czp - 60
                        };
                        break;
                    default:
                        break;
                }
            }
        }
        function run(zpp, cb) {
            this.slate.canvas.zoom({
                dur: dur,
                callbacks: {
                    after () {
                        if (cb) cb();
                    }
                },
                easing: 'easeFromTo',
                zoomPercent: zpp
            });
        }
        function cycle() {
            run(zp.in, ()=>{
                run(zp.out, ()=>{
                    cycles += 1;
                    if (opts && opts.cycle && cycles >= opts.cycle) {
                        if (opts.cb) opts.cb();
                    } else cycle();
                });
            });
        }
        if (opts && opts.center) this.scaleToFitAndCenter(()=>{
            calc();
            cycle();
        });
        else {
            calc();
            cycle();
        }
    }
    scaleToFitAndCenter(cb, dur) {
        this.slate.controller.scaleToFitNodes({
            dur: dur != null ? dur : 0,
            cb: ()=>{
                this.centerOnNodes({
                    dur: 0
                });
                if (cb) cb();
            }
        });
    }
    present(pkg) {
        const self = this;
        let currentOperations = [];
        let n = null;
        function next() {
            if (currentOperations.length === 0) {
                if (pkg.nodes.length > 0) {
                    const node = pkg.nodes.shift();
                    n = this.slate.nodes.allNodes.find((nx)=>nx.options.name === node.name
                    );
                    currentOperations = node.operations;
                    if (pkg.nodeChanged) pkg.nodeChanged(node);
                }
            }
            if (currentOperations.length > 0) {
                const op = currentOperations.shift();
                if (pkg.opChanged) pkg.opChanged(op);
                $fb2518732a69f403$export$2e2bcd8739ae039.perform(pkg, n, op, (p)=>{
                    const sync = pkg.sync !== undefined ? pkg.sync[p.operation] : false;
                    switch(p.operation){
                        case 'zoom':
                            if (sync) this.slate.collab?.send({
                                type: 'onZoom',
                                data: {
                                    id: p.id,
                                    zoomLevel: p.zoomLevel
                                }
                            });
                            break;
                        case 'position':
                            if (sync) this.slate.collab?.send({
                                type: 'onNodePositioned',
                                data: {
                                    id: p.id,
                                    location: p.location,
                                    easing: p.easing
                                }
                            });
                            break;
                        default:
                            break;
                    }
                    next();
                });
            } else if (pkg.complete) pkg.complete();
        }
        next();
    }
}



class $02854dd3110a2ccc$export$2e2bcd8739ae039 {
    constructor(slate){
        const self = this;
        self.slate = slate;
        self.slider = null;
        self.sliderId = `sb-zoom-slider-${$c09005a36c8880c7$export$2e2bcd8739ae039.guid().substring(8)}`;
    }
    setValue(val) {
        if (this.slider) this.slider.setValue(val);
    }
    hide() {
    // this.slider.style.display = 'none'
    }
    show(_options) {
        const self = this;
        // console.log(
        //   'showing zoom',
        //   self.slate.isReadOnly(),
        //   self.slate.isCommentOnly()
        // )
        if (!self.slate.isReadOnly() && !self.slate.isCommentOnly()) {
            self.hide();
            const options = {
                height: 320,
                width: 28,
                offset: {
                    left: 39,
                    top: 85
                },
                slider: {
                    height: 300,
                    min: 6000,
                    max: 200000,
                    set: 5000
                }
            };
            Object.assign(options, _options);
            const c = self.slate.options.container;
            const scx = document.createElement('div');
            scx.setAttribute('id', `slateSlider_${self.slate.options.id}`);
            scx.style.position = 'absolute';
            scx.style.height = `${options.height}px`;
            scx.style.width = `${options.width}px`;
            scx.style.left = `${options.offset.left}px`;
            scx.style.top = `${options.offset.top}px`;
            scx.style.borderRadius = '7px';
            scx.style.border = '1px solid #ccc';
            scx.style.backgroundColor = '#fff';
            c.appendChild(scx);
            self.slider = document.createElement('input');
            self.slider.setAttribute('orient', 'vertical');
            self.slider.setAttribute('type', 'range');
            self.slider.setAttribute('min', '6000');
            self.slider.setAttribute('step', '50');
            self.slider.setAttribute('max', '200000');
            self.slider.setAttribute('value', self.slate.options.viewPort.zoom.w || 50000);
            self.slider.setAttribute('id', self.sliderId);
            self.slider.style['writing-mode'] = 'bt-lr';
            self.slider.style['-webkit-appearance'] = 'slider-vertical';
            self.slider.style.width = `20px`;
            self.slider.style.height = `${options.height - 5}px`;
            self.slider.style.padding = `0 5px`;
            self.slider.style.transform = `rotate(180deg)`;
            self.slider.addEventListener('input', (e)=>{
                const val = parseFloat(e.target.value);
                self.set(val);
                self.slate.birdsEye?.refresh(true);
            });
            self.slider.addEventListener('change', (e)=>{
                const val = parseFloat(e.target.value);
                self.set(val);
                self.slate.collab?.send({
                    type: 'onZoom',
                    data: {
                        zoomLevel: val
                    }
                });
            });
            scx.appendChild(self.slider);
        }
    }
    set(val) {
        const self = this;
        if (self.slider) self.slider.value = val;
        if (self.slate.canvas.resize(val) || !self.slate.canvas.completeInit) {
            self.slate.zoom(0, 0, val, val, false);
            const z = self.slate.options.viewPort.zoom;
            self.slate.options.viewPort.width = z.w;
            self.slate.options.viewPort.height = z.h;
            self.slate.options.viewPort.left = z.l;
            self.slate.options.viewPort.top = z.t;
        }
    }
}




class $7fa641e67751cfd7$export$2e2bcd8739ae039 {
    constructor(slate){
        this.slate = slate;
        this.stateSlate = null;
        this.actions = [];
        this.actionIndex = -1;
        this.toolbar = [];
    }
    setVisibility() {
        const self = this;
        self.toolbar[0].data({
            disabled: false
        });
        self.toolbar[1].data({
            disabled: false
        });
        if (!this.actions[this.actionIndex - 1]) {
            self.toolbar[0].attr({
                'fill-opacity': '0.3'
            });
            self.toolbar[0].data({
                disabled: true
            });
        } else self.toolbar[0].attr({
            'fill-opacity': '1.0'
        });
        if (!this.actions[this.actionIndex + 1]) {
            self.toolbar[1].attr({
                'fill-opacity': '0.3'
            });
            self.toolbar[1].data({
                disabled: true
            });
        } else self.toolbar[1].attr({
            'fill-opacity': '1.0'
        });
    }
    run() {
        const state = this.actions[this.actionIndex];
        this.slate.loadJSON(state);
        this.slate.birdsEye?.reload(state);
        const pkg = {
            type: 'onSaveRequested'
        };
        this.slate.collaboration?.onCollaboration({
            type: 'custom',
            slate: this.slate,
            pkg: pkg
        });
    }
    undo() {
        if (this.actions[this.actionIndex - 1]) {
            this.actionIndex -= 1;
            this.setVisibility();
            this.run();
        } else this.setVisibility();
    }
    redo() {
        if (this.actions[this.actionIndex + 1]) {
            this.actionIndex += 1;
            this.setVisibility();
            this.run();
        } else this.setVisibility();
    }
    hide() {
        if ($c09005a36c8880c7$export$2e2bcd8739ae039.el('slateUndoRedo') !== null) try {
            this.slate.options.container.removeChild($c09005a36c8880c7$export$2e2bcd8739ae039.el('slateUndoRedo'));
        } catch (err) {
        }
    }
    show(_options) {
        const self = this;
        self.hide();
        const options = {
            height: 80,
            width: 130,
            offset: {
                left: 10,
                top: 8
            }
        };
        Object.assign(options, _options);
        const c = self.slate.options.container;
        const scx = document.createElement('div');
        scx.setAttribute('id', 'slateUndoRedo');
        scx.style.position = 'absolute';
        scx.style.height = `${options.height}px`;
        scx.style.width = `${options.width}px`;
        scx.style.left = `${options.offset.left}px`;
        scx.style.top = `${options.offset.top}px`;
        c.appendChild(scx);
        const x = options.offset.left;
        const y = options.offset.top + 30;
        options.paper = $db87f2586597736c$export$508faed300ccdfb('slateUndoRedo', options.width, options.height);
        self.toolbar = [
            options.paper.undo().data({
                msg: 'Undo',
                width: 50,
                height: 22
            }).attr({
                fill: '#fff',
                cursor: 'pointer'
            }).attr({
                fill: '#333',
                stroke: '#fff'
            }).transform([
                't',
                x,
                ',',
                y,
                's',
                '1.5',
                '1.5'
            ].join()),
            options.paper.redo().data({
                msg: 'Redo',
                width: 50,
                height: 22
            }).attr({
                fill: '#fff',
                cursor: 'pointer'
            }).attr({
                fill: '#333',
                stroke: '#fff'
            }).transform([
                't',
                x + 50,
                ',',
                y,
                's',
                '-1.5',
                '1.5'
            ].join()), 
        ];
        self.toolbar.forEach((toolbarElem)=>{
            toolbarElem.mouseover(function m(e) {
                $c09005a36c8880c7$export$2e2bcd8739ae039.stopEvent(e);
                self.slate.multiSelection?.hide();
                // $(e.target).style.cursor = "pointer";
                if (!this.data('disabled')) {
                    self.slate.glow(this);
                    const text = this.data('msg');
                    self.slate.addtip(this.tooltip({
                        type: 'text',
                        msg: text
                    }, this.data('width'), this.data('height')));
                }
            });
            toolbarElem.mouseout(function m(e) {
                $c09005a36c8880c7$export$2e2bcd8739ae039.stopEvent(e);
                self.slate.multiSelection?.show();
                self.slate.unglow();
                this.untooltip();
            });
        });
        self.toolbar[0].mousedown(function m(e) {
            $c09005a36c8880c7$export$2e2bcd8739ae039.stopEvent(e);
            self.slate.unglow();
            if (!this.data('disabled')) self.undo();
        });
        self.toolbar[1].mousedown(function m(e) {
            $c09005a36c8880c7$export$2e2bcd8739ae039.stopEvent(e);
            self.slate.unglow();
            if (!this.data('disabled')) self.redo();
        });
        // set the buttons both to be disabled
        self.setVisibility();
        // register the initial state
        setTimeout(()=>{
            self.snap(true);
        }, 500);
    }
    snap(init) {
        const self = this;
        self.actionIndex += 1;
        if (self.actionIndex !== self.actions.length) // work has bene performed, so abandon the forked record
        self.actions.splice(self.actionIndex);
        const exp = self.slate.exportJSON();
        self.actions.push(exp);
        clearTimeout(self.saveSnapshot);
        self.saveSnapshot = setTimeout(async ()=>{
            if (self.slate.events.onTakeSnapshot) await self.slate.events.onTakeSnapshot({
                slateId: self.slate.options.id,
                snapshot: exp
            });
        }, 3000) // once the slate settles for 3 secs, take a snapshot
        ;
        if (!init) self.setVisibility();
    }
}



class $a2c9c2653ba5c19d$export$2e2bcd8739ae039 {
    constructor(slate){
        this.slate = slate;
        this._grid = null;
        if (this.slate.options.viewPort.showGrid) this.show();
    // produce the required grid patterns
    // <defs>
    //   <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
    //     <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" stroke-width="0.5"/>
    //   </pattern>
    //   <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
    //     <rect width="100" height="100" fill="url(#smallGrid)"/>
    //     <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" stroke-width="1"/>
    //   </pattern>
    // </defs>`;
    }
    setGrid() {
        const gbg = this.slate.options.containerStyle.backgroundColor;
        const gridColor = $c09005a36c8880c7$export$2e2bcd8739ae039.whiteOrBlack(gbg);
        if (!this.slate.options.viewPort.gridSize) this.slate.options.viewPort.gridSize = 50;
        const { gridSize: gridSize  } = this.slate.options.viewPort;
        this.slate.paper.def({
            tag: 'pattern',
            id: 'sbSmallGrid',
            height: gridSize,
            width: gridSize,
            patternUnits: 'userSpaceOnUse',
            inside: [
                {
                    type: 'path',
                    attrs: {
                        d: `M ${gridSize} 0 L 0 0 0 ${gridSize}`,
                        fill: 'none',
                        stroke: gridColor,
                        'stroke-width': '0.5'
                    }
                }, 
            ]
        });
        this.slate.paper.def({
            tag: 'pattern',
            id: 'sbGrid',
            height: gridSize * 10,
            width: gridSize * 10,
            patternUnits: 'userSpaceOnUse',
            inside: [
                {
                    type: 'rect',
                    attrs: {
                        width: gridSize * 10,
                        height: gridSize * 10,
                        fill: 'url(#sbSmallGrid)'
                    }
                },
                {
                    type: 'path',
                    attrs: {
                        d: `M ${gridSize * 10} 0 L 0 0 0 ${gridSize * 10}`,
                        fill: 'none',
                        stroke: gridColor,
                        'stroke-width': '0.5'
                    }
                }, 
            ]
        });
    }
    show() {
        const self = this;
        this.setGrid();
        self._grid = self.slate.paper.rect(0, 0, self.slate.options.viewPort.width, self.slate.options.viewPort.height).attr({
            fill: 'url(#sbGrid)'
        }).toBack();
        self.slate.canvas.bgToBack();
    }
    toBack() {
        this._grid?.toBack();
    }
    destroy() {
        this._grid?.remove();
    }
}




class $b07cb126db9b51fe$export$2e2bcd8739ae039 {
    constructor(slate){
        this.slate = slate;
        this.engaged = false;
    }
    engage() {
        const self = this;
        if (!self.engaged) {
            const comment = `M 14.4761 0 H 3.102 C 1.3888 0 0 1.3888 0 3.102 V 8.5307 c 0 1.7132 1.3888 3.102 3.102 3.102 H 9.8297 l 2.803 4.2412 l 0.9018 -4.2412 h 0.9418 c 1.7132 0 3.102 -1.3888 3.102 -3.102 V 3.102 C 17.5781 1.3888 16.1893 0 14.4761 0 z`;
            const svg = self.slate.canvas.internal.querySelector('svg');
            svg.addEventListener('mousedown', (e)=>{
                const mp = $c09005a36c8880c7$export$2e2bcd8739ae039.mousePos(e);
                const x = mp.x + self.slate.options.viewPort.left;
                const y = mp.y + self.slate.options.viewPort.top;
                const tpath = $c09005a36c8880c7$export$2e2bcd8739ae039._transformPath(comment, `T${x},${y}s2,2`);
                const pbox = $c09005a36c8880c7$export$2e2bcd8739ae039.getBBox({
                    path: tpath
                });
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
                    textOpacity: 1
                };
                const commentNode = new $d70659fe9854f6b3$export$2e2bcd8739ae039(commentNodeOpts);
                self.slate.nodes.add(commentNode);
            });
            self.engaged = true;
        }
    }
}



class $5e565b7ae57054c8$export$2e2bcd8739ae039 {
    constructor(slate){
        const self = this;
        if (!slate.options.isbirdsEye) {
            self.slate = slate;
            self.bindGlobalUp = self.keyUp.bind(self);
            self.bindGlobalDown = self.keyDown.bind(self);
            self.bindGlobal();
        }
    }
    bindGlobal() {
        const self = this;
        $c09005a36c8880c7$export$2e2bcd8739ae039.addEvent(document, 'keydown', self.bindGlobalDown);
        $c09005a36c8880c7$export$2e2bcd8739ae039.addEvent(document, 'keyup', self.bindGlobalUp);
    }
    unbindGlobal() {
        const self = this;
        $c09005a36c8880c7$export$2e2bcd8739ae039.removeEvent(document, 'keydown', self.bindGlobalDown);
        $c09005a36c8880c7$export$2e2bcd8739ae039.removeEvent(document, 'keyup', self.bindGlobalUp);
    }
    key(e, blnKeyDown) {
        const self = this;
        const node = self.slate.nodes.allNodes.find((n)=>n.menu.isOpen()
        );
        const key = $c09005a36c8880c7$export$2e2bcd8739ae039.getKey(e);
        switch(key){
            case 91:
            case 17:
                self.slate.isCtrl = blnKeyDown;
                break;
            case 16:
                self.slate.isShift = blnKeyDown;
                break;
            case 18:
                self.slate.isAlt = blnKeyDown;
                break;
            default:
                break;
        }
        if (node) switch(key){
            case 37:
            case 38:
            case 39:
            case 40:
                if (blnKeyDown) {
                    let span = 2;
                    if (self.slate.options.viewPort.zoom.r >= 1) span = 1;
                    else if (self.slate.options.viewPort.zoom.r <= 0.5) span = 5;
                    node.relationships._initDrag(self, e);
                    if (key === 37) // left
                    node.relationships.enactMove(-span, 0, true);
                    else if (key === 38) // up
                    node.relationships.enactMove(0, -span, true);
                    else if (key === 39) {
                        // right
                        if (self.slate.isCtrl) node.connectors.addNode(true);
                        else node.relationships.enactMove(span, 0, true);
                    } else if (key === 40) // down
                    node.relationships.enactMove(0, span, true);
                    node.relationships.showMenu();
                } else node.relationships.finishDrag(true);
                break;
            default:
                break;
        }
    }
    keyUp(e) {
        this.key(e, false);
    }
    keyDown(e) {
        this.key(e, true);
    }
}



class $c5e9b4e1c381e85f$export$2e2bcd8739ae039 {
    constructor(slate){
        this.slate = slate;
        this.exposeDefaults();
    }
    addDeps(deps) {
        const self = this;
        deps.forEach((d)=>{
            const depDef = {
                id: $c09005a36c8880c7$export$2e2bcd8739ae039.guid().substring(10),
                tag: d.type,
                ...d.attrs,
                inside: []
            };
            d.nested.forEach((n)=>{
                depDef.inside.push({
                    type: n.type,
                    attrs: n.attrs
                });
            });
            self.slate.paper.def(depDef);
        });
    }
    add(filter, isDefault) {
        const self = this;
        const filterDef = {
            id: filter.id || $c09005a36c8880c7$export$2e2bcd8739ae039.guid().substring(10),
            tag: 'filter',
            filterUnits: 'userSpaceOnUse',
            ...filter.attrs,
            inside: []
        };
        filter.filters.forEach((ff)=>{
            if (ff.nested) filterDef.inside.push({
                type: ff.type,
                nested: ff.nested
            });
            else filterDef.inside.push({
                type: ff.type,
                attrs: ff.attrs
            });
        });
        self.slate.paper.def(filterDef);
        if (!isDefault) {
            if (!self.slate.customFilters) self.slate.customFilters = [];
            self.slate.customFilters.push(filterDef);
        }
        return filter.id;
    }
    remove(id) {
        const self = this;
        self.slate?.filters.splice(self.slate?.filters.findIndex((f)=>f.id === id
        ));
        return true;
    }
    // <feGaussianBlur in="SourceAlpha" stdDeviation="3"/> <!-- stdDeviation is how much to blur -->
    // <feOffset dx="2" dy="2" result="offsetblur"/> <!-- how much to offset -->
    // <feComponentTransfer>
    //   <feFuncA type="linear" slope="0.5"/> <!-- slope is the opacity of the shadow -->
    // </feComponentTransfer>
    // <feMerge>
    //   <feMergeNode/> <!-- this contains the offset blurred image -->
    //   <feMergeNode in="SourceGraphic"/> <!-- this contains the element that the filter is applied to -->
    // </feMerge>
    exposeDefaults() {
        const self = this;
        self.availableFilters = {
            dropShadow: {
                levers: {
                    feDropShadow: {
                        stdDeviation: {
                            label: 'distance',
                            default: 1.5,
                            range: [
                                1,
                                10
                            ]
                        },
                        dx: {
                            label: 'x-displacement',
                            default: 5,
                            range: [
                                1,
                                50
                            ]
                        },
                        dy: {
                            label: 'y-displacement',
                            default: 5,
                            range: [
                                1,
                                50
                            ]
                        }
                    }
                },
                types: [
                    'vect',
                    'line',
                    'image',
                    'text'
                ],
                filters: [
                    {
                        type: 'feGaussianBlur',
                        attrs: {
                            stdDeviation: '3',
                            in: 'SourceAlpha'
                        }
                    },
                    {
                        type: 'feOffset',
                        attrs: {
                            dx: '5',
                            dy: '5',
                            result: 'offsetblur'
                        }
                    },
                    {
                        type: 'feComponentTransfer',
                        nested: [
                            {
                                type: 'feFuncA',
                                attrs: {
                                    type: 'linear',
                                    slope: '0.8'
                                }
                            }, 
                        ]
                    },
                    {
                        type: 'feMerge',
                        nested: [
                            {
                                type: 'feMergeNode',
                                attrs: {
                                }
                            },
                            {
                                type: 'feMergeNode',
                                attrs: {
                                    in: 'SourceGraphic'
                                }
                            }, 
                        ]
                    }, 
                ]
            },
            postItNote: {
                types: [
                    'vect',
                    'line',
                    'image',
                    'text'
                ],
                filters: [
                    {
                        type: 'feGaussianBlur',
                        attrs: {
                            stdDeviation: '2',
                            in: 'SourceAlpha'
                        }
                    },
                    {
                        type: 'feOffset',
                        attrs: {
                            dx: '0',
                            dy: '4',
                            result: 'offsetblur'
                        }
                    },
                    {
                        type: 'feComponentTransfer',
                        nested: [
                            {
                                type: 'feFuncA',
                                attrs: {
                                    type: 'linear',
                                    slope: '0.5'
                                }
                            }, 
                        ]
                    },
                    {
                        type: 'feMerge',
                        nested: [
                            {
                                type: 'feMergeNode',
                                attrs: {
                                }
                            },
                            {
                                type: 'feMergeNode',
                                attrs: {
                                    in: 'SourceGraphic'
                                }
                            }, 
                        ]
                    }, 
                ]
            },
            tattered: {
                levers: {
                    feDisplacementMap: {
                        scale: {
                            label: 'torn',
                            default: '10',
                            range: [
                                2,
                                50
                            ]
                        }
                    }
                },
                types: [
                    'vect',
                    'line',
                    'image',
                    'text'
                ],
                filters: [
                    {
                        type: 'feTurbulence',
                        attrs: {
                            type: 'turbulence',
                            baseFrequency: '.05 .05',
                            numOctaves: '05',
                            seed: '2',
                            stitchTiles: 'noStitch',
                            result: 'turbulence'
                        }
                    },
                    {
                        type: 'feDisplacementMap',
                        attrs: {
                            in: 'SourceGraphic',
                            in2: 'turbulence',
                            scale: '10',
                            xChannelSelector: 'R',
                            yChannelSelector: 'B',
                            result: 'displacementMap'
                        }
                    }, 
                ]
            },
            blur: {
                levers: {
                    feGaussianBlur: {
                        stdDeviation: {
                            label: 'displacement',
                            default: 2,
                            range: [
                                1,
                                10
                            ]
                        }
                    }
                },
                types: [
                    'vect',
                    'line',
                    'image',
                    'text'
                ],
                filters: [
                    {
                        type: 'feGaussianBlur',
                        attrs: {
                            stdDeviation: '2',
                            in: 'SourceGraphic',
                            edgeMode: 'none'
                        }
                    }, 
                ]
            },
            outline: {
                levers: {
                    feMorphology: {
                        radius: {
                            label: 'cutout',
                            default: '1',
                            range: [
                                1,
                                10
                            ]
                        }
                    }
                },
                types: [
                    'text',
                    'line'
                ],
                filters: [
                    {
                        type: 'feMorphology',
                        attrs: {
                            operator: 'dilate',
                            radius: '1',
                            in: 'SourceGraphic',
                            result: 'thickness'
                        }
                    },
                    {
                        type: 'feComposite',
                        attrs: {
                            operator: 'out',
                            in: 'thickness',
                            in2: 'SourceGraphic'
                        }
                    }, 
                ]
            },
            pixelate: {
                levers: {
                    feImage: {
                        width: {
                            label: 'width',
                            default: '8',
                            range: [
                                1,
                                30
                            ]
                        },
                        height: {
                            label: 'height',
                            default: '8',
                            range: [
                                1,
                                30
                            ]
                        }
                    }
                },
                types: [
                    'image'
                ],
                filters: [
                    // https://stackoverflow.com/questions/37451189/can-one-pixelate-images-with-an-svg-filter
                    {
                        type: 'feGaussianBlur',
                        attrs: {
                            stdDeviation: '2',
                            in: 'SourceGraphic',
                            result: 'smoothed'
                        }
                    },
                    {
                        type: 'feImage',
                        attrs: {
                            width: '8',
                            height: '8',
                            'xlink:href': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAIAAAACDbGyAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAWSURBVAgdY1ywgOEDAwKxgJhIgFQ+AP/vCNK2s+8LAAAAAElFTkSuQmCC',
                            result: 'displacement-map'
                        }
                    },
                    {
                        type: 'feTile',
                        attrs: {
                            in: 'displacement-map',
                            result: 'pixelate-map'
                        }
                    },
                    {
                        type: 'feDisplacementMap',
                        attrs: {
                            in: 'smoothed',
                            in2: 'pixelate-map',
                            xChannelSelector: 'R',
                            yChannelSelector: 'G',
                            scale: '30',
                            result: 'pre-final'
                        }
                    },
                    {
                        type: 'feComposite',
                        attrs: {
                            operator: 'in',
                            in2: 'SourceGraphic'
                        }
                    }, 
                ]
            },
            posterize: {
                levers: {
                },
                types: [
                    'image'
                ],
                filters: [
                    {
                        type: 'feComponentTransfer',
                        nested: {
                            feFuncR: {
                                type: 'discrete',
                                tableValues: '.25 .4 .5 .75 1'
                            },
                            feFuncG: {
                                type: 'discrete',
                                tableValues: '.25 .4 .5 .75 1'
                            },
                            feFuncB: {
                                type: 'discrete',
                                tableValues: '.25 .4 .5 .75 1'
                            }
                        }
                    }, 
                ]
            },
            pencil: {
                // https://heredragonsabound.blogspot.com/2020/02/creating-pencil-effect-in-svg.html
                levers: {
                },
                types: [
                    'vect',
                    'line',
                    'text',
                    'image'
                ],
                filters: [
                    {
                        type: 'feTurbulence',
                        attrs: {
                            type: 'fractalNoise',
                            baseFrequency: '0.03',
                            numOctaves: '3',
                            seed: '1',
                            result: 'f1'
                        }
                    },
                    {
                        type: 'feDisplacementMap',
                        attrs: {
                            xChannelSelector: 'R',
                            yChannelSelector: 'G',
                            scale: '5',
                            in: 'SourceGraphic',
                            in2: 'f1',
                            result: 'f4'
                        }
                    },
                    {
                        type: 'feTurbulence',
                        attrs: {
                            type: 'fractalNoise',
                            baseFrequency: '0.03',
                            numOctaves: '3',
                            seed: '10',
                            result: 'f2'
                        }
                    },
                    {
                        type: 'feDisplacementMap',
                        attrs: {
                            xChannelSelector: 'R',
                            yChannelSelector: 'G',
                            scale: '5',
                            in: 'SourceGraphic',
                            in2: 'f2',
                            result: 'f5'
                        }
                    },
                    {
                        type: 'feTurbulence',
                        attrs: {
                            type: 'fractalNoise',
                            baseFrequency: '1.2',
                            numOctaves: '2',
                            seed: '100',
                            result: 'f3'
                        }
                    },
                    {
                        type: 'feDisplacementMap',
                        attrs: {
                            xChannelSelector: 'R',
                            yChannelSelector: 'G',
                            scale: '3',
                            in: 'SourceGraphic',
                            in2: 'f3',
                            result: 'f6'
                        }
                    },
                    {
                        type: 'feBlend',
                        attrs: {
                            mode: 'multiply',
                            in2: 'f4',
                            in: 'f5',
                            result: 'out1'
                        }
                    },
                    {
                        type: 'feBlend',
                        attrs: {
                            mode: 'multiply',
                            in: 'out1',
                            in2: 'f6',
                            result: 'out2'
                        }
                    }, 
                ]
            }
        };
    }
} // <filter id="f1" x="0" y="0" width="200%" height="200%">
 //   <feOffset result="offOut" in="SourceGraphic" dx="20" dy="20" />
 //   <feBlend in="SourceGraphic" in2="offOut" mode="normal" />
 // </filter>
 // <feBlend>
 // <feColorMatrix>
 // <feComponentTransfer>
 // <feComposite>
 // <feConvolveMatrix>
 // <feDiffuseLighting>
 // <feDisplacementMap>
 // <feDropShadow>
 // <feFlood>
 // <feGaussianBlur>
 // <feImage>
 // <feMerge>
 // <feMorphology>
 // <feOffset>
 // <feSpecularLighting>
 // <feTile>
 // <feTurbulence></feTurbulence>
 // https://github.com/svgdotjs/svg.filter
 // <filter id="displacementFilter">
 //   <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="5" seed="2" result="turbulence"/>
 //   <feDisplacementMap in2="turbulence" in="SourceGraphic" scale="2"/>
 // </filter>




class $54b0c4bd9bb665f5$export$2e2bcd8739ae039 extends $dc3db6ac99a59a76$export$2e2bcd8739ae039 {
    constructor(_options, events, collaboration){
        super(_options);
        this.options = {
            id: _options.id || $c09005a36c8880c7$export$2e2bcd8739ae039.guid(),
            container: '',
            instance: '',
            name: '',
            description: '',
            basedOnThemeId: '',
            syncWithTheme: false,
            tags: [],
            templateMarkdown: '',
            containerStyle: {
                backgroundColor: 'transparent',
                backgroundImage: '',
                backgroundSize: '',
                backgroundEffect: '',
                backgroundColorAsGradient: null,
                backgroundGradientType: null,
                backgroundGradientColors: [],
                backgroundGradientStrategy: null
            },
            viewPort: {
                useInertiaScrolling: true,
                showGrid: false,
                snapToObjects: true,
                gridSize: 50,
                width: 50000,
                height: 50000,
                left: 5000,
                top: 5000
            },
            enabled: true,
            allowDrag: true,
            showbirdsEye: true,
            sizeOfbirdsEye: 200,
            showMultiSelect: true,
            showZoom: true,
            showUndoRedo: true,
            showStatus: true,
            showLocks: true,
            mindMapMode: true,
            isPublic: true,
            isUnlisted: false,
            autoEnableDefaultFilters: true,
            autoResizeNodesBasedOnText: false,
            followMe: false,
            useLayoutQuandrants: false,
            huddleType: 'disabled'
        };
        this.options = $i9J9X$deepmerge(this.options, _options);
        this.events = events || {
            onNodeDragged: null,
            onCanvasClicked: null,
            onImagesRequested: null,
            onRequestSave: null,
            isReadOnly: null
        };
        this.collaboration = collaboration || {
            allow: true,
            localizedOnly: false,
            userIdOverride: null,
            onCollaboration: null
        };
        // console.log("SLATE - share details are", this.options.shareId, this.options.userId, this.options.orgId);
        // ensure container is always an object
        if (!$c09005a36c8880c7$export$2e2bcd8739ae039.isElement(this.options.container)) this.options.container = $c09005a36c8880c7$export$2e2bcd8739ae039.el(this.options.container);
        this.constants = {
            statusPanelAtRest: 33,
            statusPanelExpanded: 200
        };
        this.glows = [];
        this.tips = [];
        this.tempNodeId = $c09005a36c8880c7$export$2e2bcd8739ae039.guid();
        this.allLines = [];
        this.candidatesForSelection = {
        };
    }
    init() {
        const self = this;
        // instantiate all the dependencies for the slate -- order here is importantish
        // (birdsEye, undoRedo, zoomSlider are used in canvas, and inertia uses canvas)
        self.nodes = new $078ffda75962dda9$export$2e2bcd8739ae039(self);
        self.collab = new $0de94e735767a57c$export$2e2bcd8739ae039(self);
        self.birdsEye = new $3982ee4e59d88559$export$2e2bcd8739ae039(self);
        self.zoomSlider = new $02854dd3110a2ccc$export$2e2bcd8739ae039(self);
        if (!self.isReadOnly() && !self.isCommentOnly()) {
            self.undoRedo = new $7fa641e67751cfd7$export$2e2bcd8739ae039(self);
            self.multiSelection = new $25c48b1549ac282f$export$2e2bcd8739ae039(self);
        }
        self.controller = new $fb2518732a69f403$export$2e2bcd8739ae039(self);
        self.filters = new $c5e9b4e1c381e85f$export$2e2bcd8739ae039(self);
        self.canvas = new $aeb71f7ee3eb2c2e$export$2e2bcd8739ae039(self);
        self.canvas.init();
        if (self.multiSelection) self.multiSelection.init();
        self.inertia = new $c585ab56cf987362$export$2e2bcd8739ae039(self);
        self.grid = new $a2c9c2653ba5c19d$export$2e2bcd8739ae039(self);
        self.comments = new $b07cb126db9b51fe$export$2e2bcd8739ae039(self);
        self.keyboard = new $5e565b7ae57054c8$export$2e2bcd8739ae039(self);
        self.autoLoadFilters();
        if (self.options.onInitCompleted) self.options.onInitCompleted.apply(self);
        return self;
    }
    url(opt) {
        return this.options.ajax.rootUrl + this.options.ajax.urlFlavor + opt;
    }
    glow(obj) {
        this.glows.push(obj.glow());
    }
    unglow() {
        this.glows.forEach((glow)=>{
            glow.remove();
        });
        this.glows = [];
    }
    addtip(tip) {
        if (tip) this.tips.push(tip);
    }
    untooltip() {
        this.tips.forEach((tip)=>{
            tip && tip.remove();
        });
    }
    toggleFilters(blnHide, nodeId, esc) {
        // hide filters during dragging
        if (this.nodes.allNodes.length > 20) {
            this.nodes.allNodes.forEach((n)=>{
                if (!nodeId || n.options.id === nodeId) n.toggleFilters(blnHide);
            });
            this.allLines.filter((l)=>l.lineEffect
            ).forEach((c)=>{
                if (blnHide) c.line.attr('filter', '');
                else c.line.attr('filter', `url(#${c.lineEffect})`);
            });
            if (blnHide) this.canvas.hideBg();
            if (esc) setTimeout(()=>{
                this.toggleFilters(!blnHide);
                this.canvas.hideBg(1);
            }, 500);
        }
    }
    removeContextMenus() {
        const _cm = $c09005a36c8880c7$export$2e2bcd8739ae039.select('div.sb_cm');
        _cm.forEach((elem)=>{
            document.body.removeChild(elem);
        });
    }
    remove() {
        this.nodes.allNodes.forEach((nn)=>{
            nn.del();
        });
        this.paper.remove();
    // delete self;
    }
    zoom(x, y, w, h, fit) {
        this.nodes.closeAllLineOptions();
        this.paper.setViewBox(x, y, w, h, fit);
    }
    png(ropts, cb) {
        const self = this;
        self.svg({
            useDataImageUrls: true,
            backgroundOnly: ropts?.backgroundOnly
        }, (opts)=>{
            function makeTransparent(ctx, alpha, cnvs) {
                // get the image data object
                const imageData = ctx.getImageData(0, 0, cnvs.width, cnvs.height);
                const data = imageData.data;
                // if it is a background defined of #f3f3f3 then it can be transparent here
                for(let ix = 3; ix < data.length; ix += 4){
                    const isBg = [
                        data[ix - 3],
                        data[ix - 2],
                        data[ix - 1]
                    ].every((v)=>v === 243
                    );
                    // console.log('isBg', alpha, isBg, data[ix - 3])
                    if ([
                        data[ix - 3],
                        data[ix - 2],
                        data[ix - 1]
                    ].every((v)=>v === 243
                    )) data[ix] = alpha;
                }
                // and put the imagedata back to the canvas
                ctx.putImageData(imageData, 0, 0);
            }
            if (self.events.onCreateImage) self.events.onCreateImage({
                svg: opts.svg,
                orient: opts.orient,
                type: 'png'
            }, (err, base64)=>{
                if (err) console.error('Unable to create png server side', svg, err);
                else if (ropts?.base64) cb(base64);
                else {
                    const img = new Image();
                    img.src = base64;
                    img.onload = ()=>{
                        const cnvs = document.createElement('canvas');
                        cnvs.width = img.naturalWidth;
                        cnvs.height = img.naturalHeight;
                        const ctx = cnvs.getContext('2d');
                        ctx.imageSmoothingEnabled = false;
                        ctx.drawImage(img, 0, 0);
                        if (ropts?.alpha != null) makeTransparent(ctx, ropts.alpha, cnvs);
                        const link = document.createElement('a');
                        link.setAttribute('download', `${(self.options.name || 'slate').replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${self.options.id}.png`);
                        cnvs.toBlob((blob)=>{
                            link.href = URL.createObjectURL(blob);
                            const event = new MouseEvent('click');
                            link.dispatchEvent(event);
                            cb && cb();
                        });
                    };
                }
            });
            else {
                const cnvs = document.createElement('canvas');
                cnvs.width = opts.orient.width;
                cnvs.height = opts.orient.height;
                const blb = new Blob([
                    opts.svg
                ], {
                    type: 'image/svg+xml;charset=utf8'
                });
                const url = URL.createObjectURL(blb);
                const ctx = cnvs.getContext('2d');
                const img = document.createElement('img');
                img.src = url;
                img.onload = ()=>{
                    ctx.drawImage(img, 0, 0);
                    if (ropts?.alpha != null) makeTransparent(ctx, ropts.alpha, cnvs);
                    const imgsrc = cnvs.toDataURL('image/png');
                    if (ropts?.base64) {
                        cb(imgsrc);
                        URL.revokeObjectURL(img.src);
                    } else {
                        const a = document.createElement('a');
                        a.download = `${(self.options.name || 'slate').replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${self.options.id}.png`;
                        a.href = imgsrc;
                        a.click();
                        URL.revokeObjectURL(img.src);
                        cb && cb();
                    }
                };
                img.onerror = (err)=>{
                    console.log('error loading image', err);
                };
            }
        });
    }
    copy(opts) {
        const self = this;
        if (!self.copySlate) self.copySlate = new $54b0c4bd9bb665f5$export$2e2bcd8739ae039({
            container: opts.container,
            containerStyle: this.options.containerStyle,
            defaultLineColor: this.options.defaultLineColor,
            viewPort: this.options.viewPort,
            name: this.options.name,
            description: this.options.description,
            showbirdsEye: false,
            showMultiSelect: false,
            showUndoRedo: false,
            showZoom: false
        }).init();
        const _json = JSON.parse(this.exportJSON());
        _json.nodes.forEach((nde)=>{
            const _mpkg = opts.moves ? opts.moves.find((m)=>m.id === nde.options.id || m.id === '*'
            ) : null;
            if (_mpkg) {
                nde.options.xPos += _mpkg.x;
                nde.options.yPos += _mpkg.y;
                const _transforms = [
                    `t${_mpkg.x}, ${_mpkg.y}`
                ];
                nde.options.vectorPath = $d2703cad5fa90838$export$2e2bcd8739ae039(nde.options.vectorPath, _transforms);
            }
        });
        self.copySlate.loadJSON(JSON.stringify(_json));
        self.copySlate.nodes.refreshAllRelationships();
        return self.copySlate;
    }
    svg(opts, cb) {
        const self = this;
        const nodesToOrient = opts?.nodes ? self.nodes.allNodes.filter((n)=>opts?.nodes.indexOf(n.options.id) > -1
        ) : null;
        const _orient = self.getOrientation(nodesToOrient, true);
        const _r = 1 // this.options.viewPort.zoom.r || 1;
        ;
        const _resizedSlate = JSON.parse(self.exportJSON());
        if (opts?.backgroundOnly) _resizedSlate.nodes = [];
        _resizedSlate.nodes.forEach((n)=>{
            const _ty = n.options.yPos * _r;
            const _tx = n.options.xPos * _r;
            const _width = n.options.width;
            const _height = n.options.height;
            n.options.yPos = _ty - _orient.top;
            n.options.xPos = _tx - _orient.left;
            n.options.width = _width * _r;
            n.options.height = _height * _r;
            if (n.options.rotate && n.options.rotate.point) {
                n.options.rotate.point.x = n.options.rotate.point.x * _r - _orient.left;
                n.options.rotate.point.y = n.options.rotate.point.y * _r - _orient.top;
            }
            const _updatedPath = $c09005a36c8880c7$export$2e2bcd8739ae039._transformPath(n.options.vectorPath, [
                'T',
                _orient.left / _r * -1,
                ',',
                _orient.top / _r * -1,
                's',
                ',',
                _r,
                ',',
                _r, 
            ].join(''));
            n.options.vectorPath = _updatedPath;
        });
        const _div = document.createElement('div');
        _div.setAttribute('id', 'tempSvgSlate');
        _div.style.width = `${_orient.width}px`;
        _div.style.height = `${_orient.height}px`;
        _div.style.visibility = 'hidden';
        document.body.appendChild(_div);
        const exportOptions = $i9J9X$deepmerge(_resizedSlate.options, {
            container: 'tempSvgSlate',
            containerStyle: {
                backgroundColor: _resizedSlate.options.containerStyle.backgroundColor,
                backgroundColorAsGradient: _resizedSlate.options.containerStyle.backgroundColorAsGradient,
                backgroundGradientType: _resizedSlate.options.containerStyle.backgroundGradientType,
                backgroundGradientColors: _resizedSlate.options.containerStyle.backgroundGradientColors,
                backgroundGradientStrategy: _resizedSlate.options.containerStyle.backgroundGradientStrategy
            },
            defaultLineColor: _resizedSlate.options.defaultLineColor,
            viewPort: {
                allowDrag: false,
                originalWidth: _orient.width,
                width: _orient.width,
                height: _orient.height,
                left: 0,
                top: 0,
                zoom: {
                    w: _orient.width * 1.5,
                    h: _orient.height * 1.5
                },
                showGrid: false
            },
            name: _resizedSlate.options.name,
            description: _resizedSlate.options.description,
            showbirdsEye: false,
            showMultiSelect: false,
            showUndoRedo: false,
            showZoom: false,
            showLocks: false,
            isEmbedding: true
        });
        // we don't yet load the nodes by default even though they're passed in on the options below...
        const _exportCanvas = new $54b0c4bd9bb665f5$export$2e2bcd8739ae039(exportOptions).init();
        // ...that's done in the loadJSON...which seems weird
        _exportCanvas.loadJSON(JSON.stringify({
            options: exportOptions,
            nodes: _resizedSlate.nodes
        }), false, true);
        // events don't serialize, so add them explicitly
        _exportCanvas.events = self.events;
        _exportCanvas.nodes.refreshAllRelationships();
        // add the bgColor (this is done on html styling in slatebox proper view)
        let bg = null;
        if (_resizedSlate.options.containerStyle.backgroundImage) {
            const img = document.createElement('img');
            img.setAttribute('src', _resizedSlate.options.containerStyle.backgroundImage);
            img.style.visibility = 'hidden';
            document.body.appendChild(img);
            let bw = img.naturalWidth;
            let bh = img.naturalHeight;
            if (self.options.containerStyle.backgroundSize === 'cover') {
                const ratio = self.canvas.internal.parentElement.offsetWidth / bw;
                bw *= ratio;
                bh *= ratio;
            }
            img.remove();
            const iw = Math.max(bw, _orient.width);
            const ih = Math.max(bh, _orient.height);
            bg = _exportCanvas.paper.image(_resizedSlate.options.containerStyle.backgroundImage, 0, 0, iw, ih);
        } else bg = _exportCanvas.paper.rect(0, 0, _orient.width, _orient.height).attr({
            fill: _resizedSlate.options.containerStyle.backgroundColor,
            stroke: 'none'
        });
        bg.toBack();
        // the timeout is critical to ensure that the SVG canvas settles
        // and the url-fill images appear.
        setTimeout(async ()=>{
            _exportCanvas.canvas.rawSVG((svg)=>{
                if (!opts) {
                    // presume download if no opts are sent
                    const svgBlob = new Blob([
                        svg
                    ], {
                        type: 'image/svg+xml;charset=utf-8'
                    });
                    const svgUrl = URL.createObjectURL(svgBlob);
                    const dl = document.createElement('a');
                    dl.href = svgUrl;
                    dl.download = `${(self.options.name || 'slate').replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${self?.shareId}.svg`;
                    dl.click();
                    cb && cb();
                } else cb && cb({
                    svg: svg,
                    orient: _orient
                });
                _div.remove();
            });
        }, 100);
    }
    autoLoadFilters() {
        const self = this;
        // if auto filter is on, then these filters become immediately availalbe in their default form
        if (self.options.autoEnableDefaultFilters && self.filters?.availableFilters) Object.keys(self.filters.availableFilters).forEach((type)=>{
            self.filters.add({
                id: type,
                filters: self.filters.availableFilters[type].filters
            }, true);
            if (self.filters.availableFilters[type].deps) self.filters.addDeps(self.filters.availableFilters[type].deps);
        });
    }
    loadJSON(_jsonSlate, blnPreserve, blnSkipZoom, useMainCanvas = false) {
        const self = this;
        if (blnPreserve === undefined) {
            self.paper && self.paper.clear();
            if (self.nodes) self.nodes.allNodes = [];
        }
        const loadedSlate = JSON.parse(_jsonSlate);
        Object.assign(self.options, loadedSlate.options);
        self.autoLoadFilters();
        // bgcolor set
        self.canvas?.refreshBackground();
        // grid
        if (self.options.viewPort.showGrid) self.grid?.show();
        else self.grid?.destroy();
        // zoom
        if (!blnSkipZoom) self.zoomSlider?.set(self.options.viewPort.zoom.w || 50000);
        // sort nodes by their last painted order to honor toBack/toFront
        loadedSlate.nodes.sort((n1, n2)=>{
            const i1 = loadedSlate.options.nodeOrder?.findIndex((n)=>n === n1.options.id
            );
            const i2 = loadedSlate.options.nodeOrder?.findIndex((n)=>n === n2.options.id
            );
            return i1 - i2;
        });
        const deferredRelationships = [];
        loadedSlate.nodes.forEach((n)=>{
            n.options.allowDrag = true // must default
            ;
            n.options.allowMenu = true;
            const _boundTo = new $d70659fe9854f6b3$export$2e2bcd8739ae039(n.options);
            self.nodes.add(_boundTo, useMainCanvas);
            deferredRelationships.push({
                bt: _boundTo,
                json: n
            });
        });
        deferredRelationships.forEach((relationship)=>{
            const _bounded = relationship;
            _bounded.bt.addRelationships(_bounded.json);
        });
        if (self.options.showLocks) self.displayLocks();
        // refreshes all relationships
        self.nodes.allNodes.forEach((_node)=>{
            _node.relationships.updateAssociationsWith({
                activeNode: _node.options.id,
                currentDx: 0,
                currentDy: 0
            });
        });
        self.nodes.refreshAllRelationships();
        // finally invoke toFront in order
        self.nodes.allNodes.forEach((n)=>n.toFront()
        );
        // always add style tag to the <defs> for font embedding
        self.paper.def({
            tag: 'style',
            type: 'text/css',
            id: `embeddedSBStyles_${self.options.id}`
        });
        self.paper.def({
            tag: 'path',
            id: `raphael-marker-classic`,
            'stroke-linecap': 'round',
            d: 'M5,0 0,2.5 5,5 3.5,3 3.5,2z'
        });
        self.loadAllFonts();
        if (!blnSkipZoom) self.controller.centerOnNodes({
            dur: 0
        });
    }
    loadAllFonts() {
        // load all fonts
        const fonts = $i9J9X$lodashuniq(this.nodes.allNodes.map((n)=>n.options.fontFamily
        )).join('|');
        if (document.getElementById('googleFonts')) document.getElementById('googleFonts').setAttribute('href', `https://fonts.googleapis.com/css?family=${fonts}`);
        else {
            const sc = document.createElement('link');
            sc.setAttribute('src', 'https://fonts.googleapis.com/css?family=${fonts}');
            sc.setAttribute('id', 'googleFonts');
            sc.setAttribute('rel', 'stylesheet');
            sc.setAttribute('type', 'text/css');
            document.head.appendChild(sc);
        }
    }
    displayLocks() {
        this.nodes.allNodes.forEach((nd)=>{
            nd.initLock();
        });
    }
    hideLocks() {
        this.nodes.allNodes.forEach((nd)=>{
            nd.hideLock();
        });
    }
    isReadOnly() {
        return !this.events.isReadOnly || this.events.isReadOnly && this.events.isReadOnly();
    }
    isCommentOnly() {
        return !this.events.isCommentOnly || this.events.isCommentOnly && this.events.isCommentOnly();
    }
    canRemoveComments() {
        return !this.events.canRemoveComments || this.events.canRemoveComments && this.events.canRemoveComments();
    }
    // the granularity is at the level of the node...
    exportDifference(compare, lineWidthOverride) {
        const _difOpts = {
            ...this.options
        };
        delete _difOpts.container;
        // birdsEye specific -- if this is not here, then locks
        // show up on the birdsEye
        _difOpts.showLocks = compare.options.showLocks;
        const jsonSlate = {
            options: JSON.parse(JSON.stringify(_difOpts)),
            nodes: []
        };
        const tnid = this.tempNodeId;
        this.nodes.allNodes.forEach((nd)=>{
            let _exists = false;
            const pn = nd;
            if (pn.options.id !== tnid) {
                compare.nodes.allNodes.forEach((nodeInner)=>{
                    if (nodeInner.options.id === pn.options.id) _exists = true;
                });
                if (!_exists) jsonSlate.nodes.push(pn.serialize(lineWidthOverride));
            }
        });
        return JSON.stringify(jsonSlate);
    }
    exportJSON() {
        const _cont = this.options.container;
        const _pcont = this.collaboration.panelContainer || null;
        const _callbacks = this.collaboration.callbacks || null;
        const _opts = this.options;
        delete _opts.container;
        const jsonSlate = {
            options: JSON.parse(JSON.stringify(_opts)),
            nodes: []
        };
        this.options.container = _cont;
        this.collaboration.panelContainer = _pcont;
        this.collaboration.callbacks = _callbacks;
        delete jsonSlate.options.ajax;
        delete jsonSlate.options.container;
        const tnid = this.tempNodeId;
        this.nodes.allNodes.forEach((nd)=>{
            if (nd.options.id !== tnid) jsonSlate.nodes.push(nd.serialize());
        });
        jsonSlate.shareId = this.shareId;
        return JSON.stringify(jsonSlate);
    }
    snapshot() {
        const _snap = JSON.parse(this.exportJSON());
        _snap.nodes.allNodes = _snap.nodes;
        return _snap;
    }
    getOrientation(nodesToOrient, alwaysOne) {
        let orient = 'landscape';
        let sWidth = this.options.viewPort.width;
        let sHeight = this.options.viewPort.height;
        const bb = [];
        bb.left = 99999;
        bb.right = 0;
        bb.top = 99999;
        bb.bottom = 0;
        const an = nodesToOrient || this.nodes.allNodes;
        if (an.length > 0) {
            for(let _px = 0; _px < an.length; _px += 1){
                const sbw = 10;
                const _bb = an[_px].vect.getBBox();
                const _r = alwaysOne ? 1 : this.options.viewPort.zoom.r || 1;
                const x = _bb.x * _r;
                const y = _bb.y * _r;
                const w = _bb.width * _r;
                const h = _bb.height * _r;
                bb.left = Math.abs(Math.min(bb.left, x - sbw));
                bb.right = Math.abs(Math.max(bb.right, x + w + sbw));
                bb.top = Math.abs(Math.min(bb.top, y - sbw));
                bb.bottom = Math.abs(Math.max(bb.bottom, y + h + sbw));
            }
            sWidth = bb.right - bb.left;
            sHeight = bb.bottom - bb.top;
            if (sHeight > sWidth) orient = 'portrait';
        }
        return {
            orientation: orient,
            height: sHeight,
            width: sWidth,
            left: bb.left,
            top: bb.top
        };
    }
    resize(_size, dur, pad) {
        let _p = pad || 0;
        if (_p < 6) _p = 6;
        _size -= _p * 2 || 0;
        const orx = this.getOrientation();
        const wp = orx.width / _size * this.options.viewPort.width;
        const hp = orx.height / _size * this.options.viewPort.height;
        const sp = Math.max(wp, hp);
        const _r = Math.max(this.options.viewPort.width, this.options.viewPort.height) / sp;
        const l = orx.left * _r - _p;
        const t = orx.top * _r - _p;
        this.zoom(0, 0, sp, sp, true);
        this.options.viewPort.zoom = {
            w: sp,
            h: sp,
            l: parseInt(l * -1, 10),
            t: parseInt(t * -1, 10),
            r: this.options.viewPort.originalWidth / sp
        };
        this.canvas.move({
            x: l,
            y: t,
            dur: dur,
            isAbsolute: true
        });
    }
    disable(exemptSlate, exemptNodes, full) {
        if (!exemptNodes) this.nodes.allNodes.forEach((nd)=>{
            nd.disable();
        });
        if (!exemptSlate) {
            this.options.enabled = false;
            this.options.allowDrag = false;
            if (full) {
                this.multiSelection?.hideIcons();
                this.undoRedo?.hide();
                this.birdsEye?.disable();
                this.zoomSlider?.hide();
            }
        }
    }
    enable(exemptSlate, exemptNodes) {
        if (!exemptNodes) this.nodes.allNodes.forEach((nd)=>{
            !nd.options.isLocked && nd.enable();
        });
        if (!exemptSlate) {
            this.options.enabled = true;
            this.options.allowDrag = true;
        }
    }
    reorderNodes() {
        // these ids will come out in the order that they are painted on the screen - toFront and toBack adjusts this, so we need
        // to always keep this hand so that when the slate is reloaded, it can order the nodes by these ids (which are going to be dif
        // from the saved JSON order of arrays)
        const ids = Array.from(this.canvas.internal.querySelector('svg').querySelectorAll('path')).map((a)=>a.getAttribute('rel')
        ).filter((r)=>!!r
        );
        // console.log("order of nodes", ids);
        this.options.nodeOrder = ids;
    }
    findChildren(nodeIds, allChildren = []) {
        const self = this;
        // get his node's children - then recursively call findChildren on that node
        const nodes = self.nodes.allNodes.filter((n)=>nodeIds.includes(n.options.id)
        );
        allChildren = allChildren.concat(nodes.map((n)=>n.options.id
        ));
        const children = [];
        nodes.forEach((n)=>{
            n.relationships.associations.filter((a)=>a.parent.options.id === n.options.id
            ).forEach((a)=>children.push(a.child.options.id)
            );
        });
        if (children.length) return self.findChildren(children, allChildren);
        return allChildren;
    }
    applyTheme(theme, syncWithTheme, revertTheme) {
        const self = this;
        if (!revertTheme) {
            self.options.basedOnThemeId = theme._id;
            self.options.syncWithTheme = syncWithTheme;
        } else {
            self.options.basedOnThemeId = null;
            self.options.syncWithTheme = null;
        }
        const nodeStyle = {
        };
        const currentNodesByColor = {
        };
        const totChildren = [];
        // first apply slate
        if (theme.containerStyle.backgroundImage) self.collab.invoke({
            type: 'onSlateBackgroundImageChanged',
            data: {
                bg: {
                    size: theme.containerStyle.backgroundSize,
                    url: theme.containerStyle.backgroundImage
                }
            }
        });
        else if (theme.containerStyle.backgroundEffect) self.collab.invoke({
            type: 'onSlateBackgroundEffectChanged',
            data: {
                effect: theme.containerStyle.backgroundEffect
            }
        });
        else self.collab.invoke({
            type: 'onSlateBackgroundColorChanged',
            data: {
                color: theme.containerStyle.backgroundColor,
                asGradient: theme.containerStyle.backgroundColorAsGradient,
                gradientType: theme.containerStyle.backgroundGradientType,
                gradientColors: theme.containerStyle.backgroundGradientColors,
                gradientStrategy: theme.containerStyle.backgroundGradientStrategy
            }
        });
        self.collab.invoke({
            type: 'onLineColorChanged',
            data: {
                color: theme.defaultLineColor
            }
        });
        function applyStyle(id) {
            const allKeys = Object.keys(theme.styles);
            const lastStyle = theme.styles[allKeys[allKeys.length - 1]];
            const styleBase = theme.styles[nodeStyle[id]] || lastStyle;
            // borders
            self.collab.invoke({
                type: 'onNodeBorderPropertiesChanged',
                data: {
                    id: id,
                    prop: 'borderWidth',
                    val: styleBase.borderWidth
                }
            });
            self.collab.invoke({
                type: 'onNodeBorderPropertiesChanged',
                data: {
                    id: id,
                    prop: 'borderColor',
                    val: styleBase.borderColor
                }
            });
            self.collab.invoke({
                type: 'onNodeBorderPropertiesChanged',
                data: {
                    id: id,
                    prop: 'borderOpacity',
                    val: styleBase.borderOpacity
                }
            });
            self.collab.invoke({
                type: 'onNodeBorderPropertiesChanged',
                data: {
                    id: id,
                    prop: 'borderStyle',
                    val: styleBase.borderStyle
                }
            });
            // shape
            if (styleBase.vectorPath && syncWithTheme) // const node = self.nodes.one(id);
            // const sendPath = utils._transformPath(styleBase.vectorPath, `T${node.options.xPos},${node.options.xPos}`);
            self.collab.invoke({
                type: 'onNodeShapeChanged',
                data: {
                    id: id,
                    shape: styleBase.vectorPath
                }
            });
            // text
            if (syncWithTheme) self.collab.invoke({
                type: 'onNodeTextChanged',
                data: {
                    id: id,
                    fontSize: styleBase.fontSize,
                    fontFamily: styleBase.fontFamily,
                    fontColor: styleBase.foregroundColor,
                    textOpacity: styleBase.textOpacity
                }
            });
            // effects
            self.collab.invoke({
                type: 'onNodeEffectChanged',
                data: {
                    id: id,
                    filter: {
                        apply: 'text',
                        id: styleBase.filters.text
                    }
                }
            });
            // background color
            self.collab.invoke({
                type: 'onNodeColorChanged',
                data: {
                    id: id,
                    opacity: styleBase.opacity,
                    color: styleBase.backgroundColor
                }
            });
            // effects
            self.collab.invoke({
                type: 'onNodeEffectChanged',
                data: {
                    id: id,
                    filter: {
                        apply: 'vect',
                        id: styleBase.filters.vect
                    }
                }
            });
            // lines
            const styleNode = self.nodes.one(id);
            // console.log("node is ", id, node);
            styleNode.relationships.associations.forEach((a, ind)=>{
                self.collab.invoke({
                    type: 'onLineColorChanged',
                    data: {
                        id: id,
                        color: styleBase.lineColor
                    }
                });
                self.collab.invoke({
                    type: 'onLinePropertiesChanged',
                    data: {
                        id: id,
                        prop: 'lineOpacity',
                        val: styleBase.lineOpacity,
                        associationId: a.id,
                        index: ind
                    }
                });
                self.collab.invoke({
                    type: 'onLinePropertiesChanged',
                    data: {
                        id: id,
                        prop: 'lineEffect',
                        val: styleBase.lineEffect,
                        associationId: a.id,
                        index: ind
                    }
                });
                self.collab.invoke({
                    type: 'onLinePropertiesChanged',
                    data: {
                        id: id,
                        prop: 'lineWidth',
                        val: styleBase.lineWidth,
                        associationId: a.id,
                        index: ind
                    }
                });
            });
        }
        self.nodes.allNodes.forEach((nd)=>{
            if (self.options.mindMapMode || syncWithTheme) {
                const children = self.findChildren([
                    nd.options.id
                ]);
                totChildren.push(children);
            } else {
                if (!currentNodesByColor[nd.options.backgroundColor]) currentNodesByColor[nd.options.backgroundColor] = [];
                currentNodesByColor[nd.options.backgroundColor].push(nd.options.id);
            }
        });
        if (self.options.mindMapMode || syncWithTheme) {
            totChildren.sort((a, b)=>a.length - b.length
            );
            totChildren.forEach((t)=>{
                t.forEach((n, ind)=>{
                    nodeStyle[n] = ind === 0 ? `parent` : `child_${ind}`;
                });
            });
        } else {
            const colorsByUsage = Object.keys(currentNodesByColor).sort((a, b)=>currentNodesByColor[b].length - currentNodesByColor[a].length
            );
            let styleIndex = -1;
            colorsByUsage.forEach((c, index)=>{
                if (Object.keys(theme.styles).length < index) styleIndex = -1;
                styleIndex += 1;
                currentNodesByColor[c].forEach((id)=>{
                    nodeStyle[id] = styleIndex === 0 ? `parent` : `child_${styleIndex}`;
                });
            });
        }
        Object.keys(nodeStyle).forEach((id)=>{
            applyStyle(id);
        });
    }
}





const $0ce36565345e4082$export$6cc593952597f80d = {
    slate: $54b0c4bd9bb665f5$export$2e2bcd8739ae039,
    node: $d70659fe9854f6b3$export$2e2bcd8739ae039,
    base: $dc3db6ac99a59a76$export$2e2bcd8739ae039,
    utils: $c09005a36c8880c7$export$2e2bcd8739ae039
};


export {$0ce36565345e4082$export$6cc593952597f80d as Slatebox};
//# sourceMappingURL=index.js.map
