// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"alQLQ":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = false;
var HMR_ENV_HASH = "d6ea1d42532a7575";
module.bundle.HMR_BUNDLE_ID = "499e6408a9c9d557";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE, chrome, browser, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = "__parcel__error__overlay__";
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets /*: {|[string]: boolean|} */ , assetsToDispose /*: Array<[ParcelRequire, string]> */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ ;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf("http") === 0 ? location.hostname : "localhost");
}
function getPort() {
    return HMR_PORT || location.port;
}
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== "undefined") {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == "https:" && ![
        "localhost",
        "127.0.0.1",
        "0.0.0.0"
    ].includes(hostname) ? "wss" : "ws";
    var ws;
    try {
        ws = new WebSocket(protocol + "://" + hostname + (port ? ":" + port : "") + "/");
    } catch (err) {
        if (err.message) console.error(err.message);
        ws = {};
    }
    // Web extension context
    var extCtx = typeof browser === "undefined" ? typeof chrome === "undefined" ? null : chrome : browser;
    // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes("test.js");
    }
    // $FlowFixMe
    ws.onmessage = async function(event /*: {data: string, ...} */ ) {
        checkedAssets = {} /*: {|[string]: boolean|} */ ;
        assetsToAccept = [];
        assetsToDispose = [];
        var data /*: HMRMessage */  = JSON.parse(event.data);
        if (data.type === "update") {
            // Remove error overlay if there is one
            if (typeof document !== "undefined") removeErrorOverlay();
            let assets = data.assets.filter((asset)=>asset.envHash === HMR_ENV_HASH);
            // Handle HMR Update
            let handled = assets.every((asset)=>{
                return asset.type === "css" || asset.type === "js" && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear();
                // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
                if (typeof window !== "undefined" && typeof CustomEvent !== "undefined") window.dispatchEvent(new CustomEvent("parcelhmraccept"));
                await hmrApplyUpdates(assets);
                // Dispose all old assets.
                let processedAssets = {} /*: {|[string]: boolean|} */ ;
                for(let i = 0; i < assetsToDispose.length; i++){
                    let id = assetsToDispose[i][1];
                    if (!processedAssets[id]) {
                        hmrDispose(assetsToDispose[i][0], id);
                        processedAssets[id] = true;
                    }
                }
                // Run accept callbacks. This will also re-execute other disposed assets in topological order.
                processedAssets = {};
                for(let i = 0; i < assetsToAccept.length; i++){
                    let id = assetsToAccept[i][1];
                    if (!processedAssets[id]) {
                        hmrAccept(assetsToAccept[i][0], id);
                        processedAssets[id] = true;
                    }
                }
            } else fullReload();
        }
        if (data.type === "error") {
            // Log parcel errors to console
            for (let ansiDiagnostic of data.diagnostics.ansi){
                let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + "\n" + stack + "\n\n" + ansiDiagnostic.hints.join("\n"));
            }
            if (typeof document !== "undefined") {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html);
                // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    ws.onerror = function(e) {
        if (e.message) console.error(e.message);
    };
    ws.onclose = function() {
        console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
    };
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] \u2728 Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, "") : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          \u{1F6A8} ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + "</div>").join("")}
        </div>
        ${diagnostic.documentation ? `<div>\u{1F4DD} <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ""}
      </div>
    `;
    }
    errorHTML += "</div>";
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if ("reload" in location) location.reload();
    else if (extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var href = link.getAttribute("href");
    if (!href) return;
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute("href", // $FlowFixMe
    href.split("?")[0] + "?" + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href /*: string */  = links[i].getAttribute("href");
            var hostname = getHostname();
            var servedFromHMRServer = hostname === "localhost" ? new RegExp("^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):" + getPort()).test(href) : href.indexOf(hostname + ":" + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === "js") {
        if (typeof document !== "undefined") {
            let script = document.createElement("script");
            script.src = asset.url + "?t=" + Date.now();
            if (asset.outputFormat === "esmodule") script.type = "module";
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === "function") {
            // Worker scripts
            if (asset.outputFormat === "esmodule") return import(asset.url + "?t=" + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + "?t=" + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension fix
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3 && typeof ServiceWorkerGlobalScope != "undefined" && global instanceof ServiceWorkerGlobalScope) {
                        extCtx.runtime.reload();
                        return;
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle /*: ParcelRequire */ , asset /*:  HMRAsset */ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === "css") reloadCSS();
    else if (asset.type === "js") {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
            // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        } else if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        }
        // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id];
        // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
    // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (!cached || cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
}
function hmrDispose(bundle /*: ParcelRequire */ , id /*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle /*: ParcelRequire */ , id /*: string */ ) {
    // Execute the module.
    bundle(id);
    // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) {
            assetsToAlsoAccept.forEach(function(a) {
                hmrDispose(a[0], a[1]);
            });
            // $FlowFixMe[method-unbinding]
            assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
        }
    });
}

},{}],"g8NHk":[function(require,module,exports) {
/**
 * @module provider/websocket
 */ /* eslint-env browser */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "messageSync", ()=>messageSync);
parcelHelpers.export(exports, "messageQueryAwareness", ()=>messageQueryAwareness);
parcelHelpers.export(exports, "messageAwareness", ()=>messageAwareness);
parcelHelpers.export(exports, "messageAuth", ()=>messageAuth);
/**
 * Websocket Provider for Yjs. Creates a websocket connection to sync the shared document.
 * The document name is attached to the provided url. I.e. the following example
 * creates a websocket connection to http://localhost:1234/my-document-name
 *
 * @example
 *   import * as Y from 'yjs'
 *   import { WebsocketProvider } from 'y-websocket'
 *   const doc = new Y.Doc()
 *   const provider = new WebsocketProvider('http://localhost:1234', 'my-document-name', doc)
 *
 * @extends {Observable<string>}
 */ parcelHelpers.export(exports, "WebsocketProvider", ()=>WebsocketProvider);
var _yjs = require("yjs"); // eslint-disable-line
var _broadcastchannel = require("lib0/broadcastchannel");
var _time = require("lib0/time");
var _encoding = require("lib0/encoding");
var _decoding = require("lib0/decoding");
var _sync = require("y-protocols/sync");
var _auth = require("y-protocols/auth");
var _awareness = require("y-protocols/awareness");
var _observable = require("lib0/observable");
var _math = require("lib0/math");
var _url = require("lib0/url");
var _environment = require("lib0/environment");
var process = require("43b6cd2f9b5e450b");
const messageSync = 0;
const messageQueryAwareness = 3;
const messageAwareness = 1;
const messageAuth = 2;
/**
 *                       encoder,          decoder,          provider,          emitSynced, messageType
 * @type {Array<function(encoding.Encoder, decoding.Decoder, WebsocketProvider, boolean,    number):void>}
 */ const messageHandlers = [];
messageHandlers[messageSync] = (encoder, decoder, provider, emitSynced, _messageType)=>{
    _encoding.writeVarUint(encoder, messageSync);
    const syncMessageType = _sync.readSyncMessage(decoder, encoder, provider.doc, provider);
    if (emitSynced && syncMessageType === _sync.messageYjsSyncStep2 && !provider.synced) provider.synced = true;
};
messageHandlers[messageQueryAwareness] = (encoder, _decoder, provider, _emitSynced, _messageType)=>{
    _encoding.writeVarUint(encoder, messageAwareness);
    _encoding.writeVarUint8Array(encoder, _awareness.encodeAwarenessUpdate(provider.awareness, Array.from(provider.awareness.getStates().keys())));
};
messageHandlers[messageAwareness] = (_encoder, decoder, provider, _emitSynced, _messageType)=>{
    _awareness.applyAwarenessUpdate(provider.awareness, _decoding.readVarUint8Array(decoder), provider);
};
messageHandlers[messageAuth] = (_encoder, decoder, provider, _emitSynced, _messageType)=>{
    _auth.readAuthMessage(decoder, provider.doc, (_ydoc, reason)=>permissionDeniedHandler(provider, reason));
};
// @todo - this should depend on awareness.outdatedTime
const messageReconnectTimeout = 30000;
/**
 * @param {WebsocketProvider} provider
 * @param {string} reason
 */ const permissionDeniedHandler = (provider, reason)=>console.warn(`Permission denied to access ${provider.url}.\n${reason}`);
/**
 * @param {WebsocketProvider} provider
 * @param {Uint8Array} buf
 * @param {boolean} emitSynced
 * @return {encoding.Encoder}
 */ const readMessage = (provider, buf, emitSynced)=>{
    const decoder = _decoding.createDecoder(buf);
    const encoder = _encoding.createEncoder();
    const messageType = _decoding.readVarUint(decoder);
    const messageHandler = provider.messageHandlers[messageType];
    if (/** @type {any} */ messageHandler) messageHandler(encoder, decoder, provider, emitSynced, messageType);
    else console.error("Unable to compute message");
    return encoder;
};
/**
 * @param {WebsocketProvider} provider
 */ const setupWS = (provider)=>{
    if (provider.shouldConnect && provider.ws === null) {
        const websocket = new provider._WS(provider.url);
        websocket.binaryType = "arraybuffer";
        provider.ws = websocket;
        provider.wsconnecting = true;
        provider.wsconnected = false;
        provider.synced = false;
        websocket.onmessage = (event)=>{
            provider.wsLastMessageReceived = _time.getUnixTime();
            const encoder = readMessage(provider, new Uint8Array(event.data), true);
            if (_encoding.length(encoder) > 1) websocket.send(_encoding.toUint8Array(encoder));
        };
        websocket.onerror = (event)=>{
            provider.emit("connection-error", [
                event,
                provider
            ]);
        };
        websocket.onclose = (event)=>{
            provider.emit("connection-close", [
                event,
                provider
            ]);
            provider.ws = null;
            provider.wsconnecting = false;
            if (provider.wsconnected) {
                provider.wsconnected = false;
                provider.synced = false;
                // update awareness (all users except local left)
                _awareness.removeAwarenessStates(provider.awareness, Array.from(provider.awareness.getStates().keys()).filter((client)=>client !== provider.doc.clientID), provider);
                provider.emit("status", [
                    {
                        status: "disconnected"
                    }
                ]);
            } else provider.wsUnsuccessfulReconnects++;
            // Start with no reconnect timeout and increase timeout by
            // using exponential backoff starting with 100ms
            setTimeout(setupWS, _math.min(_math.pow(2, provider.wsUnsuccessfulReconnects) * 100, provider.maxBackoffTime), provider);
        };
        websocket.onopen = ()=>{
            provider.wsLastMessageReceived = _time.getUnixTime();
            provider.wsconnecting = false;
            provider.wsconnected = true;
            provider.wsUnsuccessfulReconnects = 0;
            provider.emit("status", [
                {
                    status: "connected"
                }
            ]);
            // always send sync step 1 when connected
            const encoder = _encoding.createEncoder();
            _encoding.writeVarUint(encoder, messageSync);
            _sync.writeSyncStep1(encoder, provider.doc);
            websocket.send(_encoding.toUint8Array(encoder));
            // broadcast local awareness state
            if (provider.awareness.getLocalState() !== null) {
                const encoderAwarenessState = _encoding.createEncoder();
                _encoding.writeVarUint(encoderAwarenessState, messageAwareness);
                _encoding.writeVarUint8Array(encoderAwarenessState, _awareness.encodeAwarenessUpdate(provider.awareness, [
                    provider.doc.clientID
                ]));
                websocket.send(_encoding.toUint8Array(encoderAwarenessState));
            }
        };
        provider.emit("status", [
            {
                status: "connecting"
            }
        ]);
    }
};
/**
 * @param {WebsocketProvider} provider
 * @param {ArrayBuffer} buf
 */ const broadcastMessage = (provider, buf)=>{
    const ws = provider.ws;
    if (provider.wsconnected && ws && ws.readyState === ws.OPEN) ws.send(buf);
    if (provider.bcconnected) _broadcastchannel.publish(provider.bcChannel, buf, provider);
};
class WebsocketProvider extends (0, _observable.Observable) {
    /**
   * @param {string} serverUrl
   * @param {string} roomname
   * @param {Y.Doc} doc
   * @param {object} opts
   * @param {boolean} [opts.connect]
   * @param {awarenessProtocol.Awareness} [opts.awareness]
   * @param {Object<string,string>} [opts.params]
   * @param {typeof WebSocket} [opts.WebSocketPolyfill] Optionall provide a WebSocket polyfill
   * @param {number} [opts.resyncInterval] Request server state every `resyncInterval` milliseconds
   * @param {number} [opts.maxBackoffTime] Maximum amount of time to wait before trying to reconnect (we try to reconnect using exponential backoff)
   * @param {boolean} [opts.disableBc] Disable cross-tab BroadcastChannel communication
   */ constructor(serverUrl, roomname, doc, { connect = true, awareness = new _awareness.Awareness(doc), params = {}, WebSocketPolyfill = WebSocket, resyncInterval = -1, maxBackoffTime = 2500, disableBc = false } = {}){
        super();
        // ensure that url is always ends with /
        while(serverUrl[serverUrl.length - 1] === "/")serverUrl = serverUrl.slice(0, serverUrl.length - 1);
        const encodedParams = _url.encodeQueryParams(params);
        this.maxBackoffTime = maxBackoffTime;
        this.bcChannel = serverUrl + "/" + roomname;
        this.url = serverUrl + "/" + roomname + (encodedParams.length === 0 ? "" : "?" + encodedParams);
        this.roomname = roomname;
        this.doc = doc;
        this._WS = WebSocketPolyfill;
        this.awareness = awareness;
        this.wsconnected = false;
        this.wsconnecting = false;
        this.bcconnected = false;
        this.disableBc = disableBc;
        this.wsUnsuccessfulReconnects = 0;
        this.messageHandlers = messageHandlers.slice();
        /**
     * @type {boolean}
     */ this._synced = false;
        /**
     * @type {WebSocket?}
     */ this.ws = null;
        this.wsLastMessageReceived = 0;
        /**
     * Whether to connect to other peers or not
     * @type {boolean}
     */ this.shouldConnect = connect;
        /**
     * @type {number}
     */ this._resyncInterval = 0;
        if (resyncInterval > 0) this._resyncInterval = /** @type {any} */ setInterval(()=>{
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                // resend sync step 1
                const encoder = _encoding.createEncoder();
                _encoding.writeVarUint(encoder, messageSync);
                _sync.writeSyncStep1(encoder, doc);
                this.ws.send(_encoding.toUint8Array(encoder));
            }
        }, resyncInterval);
        /**
     * @param {ArrayBuffer} data
     * @param {any} origin
     */ this._bcSubscriber = (data, origin)=>{
            if (origin !== this) {
                const encoder = readMessage(this, new Uint8Array(data), false);
                if (_encoding.length(encoder) > 1) _broadcastchannel.publish(this.bcChannel, _encoding.toUint8Array(encoder), this);
            }
        };
        /**
     * Listens to Yjs updates and sends them to remote peers (ws and broadcastchannel)
     * @param {Uint8Array} update
     * @param {any} origin
     */ this._updateHandler = (update, origin)=>{
            if (origin !== this) {
                const encoder = _encoding.createEncoder();
                _encoding.writeVarUint(encoder, messageSync);
                _sync.writeUpdate(encoder, update);
                broadcastMessage(this, _encoding.toUint8Array(encoder));
            }
        };
        this.doc.on("update", this._updateHandler);
        /**
     * @param {any} changed
     * @param {any} _origin
     */ this._awarenessUpdateHandler = ({ added, updated, removed }, _origin)=>{
            const changedClients = added.concat(updated).concat(removed);
            const encoder = _encoding.createEncoder();
            _encoding.writeVarUint(encoder, messageAwareness);
            _encoding.writeVarUint8Array(encoder, _awareness.encodeAwarenessUpdate(awareness, changedClients));
            broadcastMessage(this, _encoding.toUint8Array(encoder));
        };
        this._exitHandler = ()=>{
            _awareness.removeAwarenessStates(this.awareness, [
                doc.clientID
            ], "app closed");
        };
        if (_environment.isNode && typeof process !== "undefined") process.on("exit", this._exitHandler);
        awareness.on("update", this._awarenessUpdateHandler);
        this._checkInterval = /** @type {any} */ setInterval(()=>{
            if (this.wsconnected && messageReconnectTimeout < _time.getUnixTime() - this.wsLastMessageReceived) // no message received in a long time - not even your own awareness
            // updates (which are updated every 15 seconds)
            /** @type {WebSocket} */ this.ws.close();
        }, messageReconnectTimeout / 10);
        if (connect) this.connect();
    }
    /**
   * @type {boolean}
   */ get synced() {
        return this._synced;
    }
    set synced(state) {
        if (this._synced !== state) {
            this._synced = state;
            this.emit("synced", [
                state
            ]);
            this.emit("sync", [
                state
            ]);
        }
    }
    destroy() {
        if (this._resyncInterval !== 0) clearInterval(this._resyncInterval);
        clearInterval(this._checkInterval);
        this.disconnect();
        if (typeof process !== "undefined") process.off("exit", this._exitHandler);
        this.awareness.off("update", this._awarenessUpdateHandler);
        this.doc.off("update", this._updateHandler);
        super.destroy();
    }
    connectBc() {
        if (this.disableBc) return;
        if (!this.bcconnected) {
            _broadcastchannel.subscribe(this.bcChannel, this._bcSubscriber);
            this.bcconnected = true;
        }
        // send sync step1 to bc
        // write sync step 1
        const encoderSync = _encoding.createEncoder();
        _encoding.writeVarUint(encoderSync, messageSync);
        _sync.writeSyncStep1(encoderSync, this.doc);
        _broadcastchannel.publish(this.bcChannel, _encoding.toUint8Array(encoderSync), this);
        // broadcast local state
        const encoderState = _encoding.createEncoder();
        _encoding.writeVarUint(encoderState, messageSync);
        _sync.writeSyncStep2(encoderState, this.doc);
        _broadcastchannel.publish(this.bcChannel, _encoding.toUint8Array(encoderState), this);
        // write queryAwareness
        const encoderAwarenessQuery = _encoding.createEncoder();
        _encoding.writeVarUint(encoderAwarenessQuery, messageQueryAwareness);
        _broadcastchannel.publish(this.bcChannel, _encoding.toUint8Array(encoderAwarenessQuery), this);
        // broadcast local awareness state
        const encoderAwarenessState = _encoding.createEncoder();
        _encoding.writeVarUint(encoderAwarenessState, messageAwareness);
        _encoding.writeVarUint8Array(encoderAwarenessState, _awareness.encodeAwarenessUpdate(this.awareness, [
            this.doc.clientID
        ]));
        _broadcastchannel.publish(this.bcChannel, _encoding.toUint8Array(encoderAwarenessState), this);
    }
    disconnectBc() {
        // broadcast message with local awareness state set to null (indicating disconnect)
        const encoder = _encoding.createEncoder();
        _encoding.writeVarUint(encoder, messageAwareness);
        _encoding.writeVarUint8Array(encoder, _awareness.encodeAwarenessUpdate(this.awareness, [
            this.doc.clientID
        ], new Map()));
        broadcastMessage(this, _encoding.toUint8Array(encoder));
        if (this.bcconnected) {
            _broadcastchannel.unsubscribe(this.bcChannel, this._bcSubscriber);
            this.bcconnected = false;
        }
    }
    disconnect() {
        this.shouldConnect = false;
        this.disconnectBc();
        if (this.ws !== null) this.ws.close();
    }
    connect() {
        this.shouldConnect = true;
        if (!this.wsconnected && this.ws === null) {
            setupWS(this);
            this.connectBc();
        }
    }
}

},{"43b6cd2f9b5e450b":"d5jf4","yjs":"gj9M9","lib0/broadcastchannel":"gKGkU","lib0/time":"gZsVK","lib0/encoding":"9yVNx","lib0/decoding":"ftn2I","y-protocols/sync":"kgJVk","y-protocols/auth":"flacp","y-protocols/awareness":"57xPu","lib0/observable":"20Rfd","lib0/math":"jhXHz","lib0/url":"60si9","lib0/environment":"h8wYT","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"gKGkU":[function(require,module,exports) {
/* eslint-env browser */ /**
 * Helpers for cross-tab communication using broadcastchannel with LocalStorage fallback.
 *
 * ```js
 * // In browser window A:
 * broadcastchannel.subscribe('my events', data => console.log(data))
 * broadcastchannel.publish('my events', 'Hello world!') // => A: 'Hello world!' fires synchronously in same tab
 *
 * // In browser window B:
 * broadcastchannel.publish('my events', 'hello from tab B') // => A: 'hello from tab B'
 * ```
 *
 * @module broadcastchannel
 */ // @todo before next major: use Uint8Array instead as buffer object
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "subscribe", ()=>subscribe);
parcelHelpers.export(exports, "unsubscribe", ()=>unsubscribe);
parcelHelpers.export(exports, "publish", ()=>publish);
var _mapJs = require("./map.js");
var _setJs = require("./set.js");
var _bufferJs = require("./buffer.js");
var _storageJs = require("./storage.js");
/**
 * @typedef {Object} Channel
 * @property {Set<function(any, any):any>} Channel.subs
 * @property {any} Channel.bc
 */ /**
 * @type {Map<string, Channel>}
 */ const channels = new Map();
/* c8 ignore start */ class LocalStoragePolyfill {
    /**
   * @param {string} room
   */ constructor(room){
        this.room = room;
        /**
     * @type {null|function({data:ArrayBuffer}):void}
     */ this.onmessage = null;
        /**
     * @param {any} e
     */ this._onChange = (e)=>e.key === room && this.onmessage !== null && this.onmessage({
                data: _bufferJs.fromBase64(e.newValue || "")
            });
        _storageJs.onChange(this._onChange);
    }
    /**
   * @param {ArrayBuffer} buf
   */ postMessage(buf) {
        _storageJs.varStorage.setItem(this.room, _bufferJs.toBase64(_bufferJs.createUint8ArrayFromArrayBuffer(buf)));
    }
    close() {
        _storageJs.offChange(this._onChange);
    }
}
/* c8 ignore stop */ // Use BroadcastChannel or Polyfill
/* c8 ignore next */ const BC = typeof BroadcastChannel === "undefined" ? LocalStoragePolyfill : BroadcastChannel;
/**
 * @param {string} room
 * @return {Channel}
 */ const getChannel = (room)=>_mapJs.setIfUndefined(channels, room, ()=>{
        const subs = _setJs.create();
        const bc = new BC(room);
        /**
     * @param {{data:ArrayBuffer}} e
     */ /* c8 ignore next */ bc.onmessage = (e)=>subs.forEach((sub)=>sub(e.data, "broadcastchannel"));
        return {
            bc,
            subs
        };
    });
const subscribe = (room, f)=>{
    getChannel(room).subs.add(f);
    return f;
};
const unsubscribe = (room, f)=>{
    const channel = getChannel(room);
    const unsubscribed = channel.subs.delete(f);
    if (unsubscribed && channel.subs.size === 0) {
        channel.bc.close();
        channels.delete(room);
    }
    return unsubscribed;
};
const publish = (room, data, origin = null)=>{
    const c = getChannel(room);
    c.bc.postMessage(data);
    c.subs.forEach((sub)=>sub(data, origin));
};

},{"./map.js":"eE1vX","./set.js":"iWXeP","./buffer.js":"3bzhu","./storage.js":"9FcRV","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"kgJVk":[function(require,module,exports) {
/**
 * @module sync-protocol
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "messageYjsSyncStep1", ()=>messageYjsSyncStep1);
parcelHelpers.export(exports, "messageYjsSyncStep2", ()=>messageYjsSyncStep2);
parcelHelpers.export(exports, "messageYjsUpdate", ()=>messageYjsUpdate);
parcelHelpers.export(exports, "writeSyncStep1", ()=>writeSyncStep1);
parcelHelpers.export(exports, "writeSyncStep2", ()=>writeSyncStep2);
parcelHelpers.export(exports, "readSyncStep1", ()=>readSyncStep1);
parcelHelpers.export(exports, "readSyncStep2", ()=>readSyncStep2);
parcelHelpers.export(exports, "writeUpdate", ()=>writeUpdate);
parcelHelpers.export(exports, "readUpdate", ()=>readUpdate);
parcelHelpers.export(exports, "readSyncMessage", ()=>readSyncMessage);
var _encoding = require("lib0/encoding");
var _decoding = require("lib0/decoding");
var _yjs = require("yjs");
const messageYjsSyncStep1 = 0;
const messageYjsSyncStep2 = 1;
const messageYjsUpdate = 2;
const writeSyncStep1 = (encoder, doc)=>{
    _encoding.writeVarUint(encoder, messageYjsSyncStep1);
    const sv = _yjs.encodeStateVector(doc);
    _encoding.writeVarUint8Array(encoder, sv);
};
const writeSyncStep2 = (encoder, doc, encodedStateVector)=>{
    _encoding.writeVarUint(encoder, messageYjsSyncStep2);
    _encoding.writeVarUint8Array(encoder, _yjs.encodeStateAsUpdate(doc, encodedStateVector));
};
const readSyncStep1 = (decoder, encoder, doc)=>writeSyncStep2(encoder, doc, _decoding.readVarUint8Array(decoder));
const readSyncStep2 = (decoder, doc, transactionOrigin)=>{
    try {
        _yjs.applyUpdate(doc, _decoding.readVarUint8Array(decoder), transactionOrigin);
    } catch (error) {
        // This catches errors that are thrown by event handlers
        console.error("Caught error while handling a Yjs update", error);
    }
};
const writeUpdate = (encoder, update)=>{
    _encoding.writeVarUint(encoder, messageYjsUpdate);
    _encoding.writeVarUint8Array(encoder, update);
};
const readUpdate = readSyncStep2;
const readSyncMessage = (decoder, encoder, doc, transactionOrigin)=>{
    const messageType = _decoding.readVarUint(decoder);
    switch(messageType){
        case messageYjsSyncStep1:
            readSyncStep1(decoder, encoder, doc);
            break;
        case messageYjsSyncStep2:
            readSyncStep2(decoder, doc, transactionOrigin);
            break;
        case messageYjsUpdate:
            readUpdate(decoder, doc, transactionOrigin);
            break;
        default:
            throw new Error("Unknown message type");
    }
    return messageType;
};

},{"lib0/encoding":"9yVNx","lib0/decoding":"ftn2I","yjs":"gj9M9","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"flacp":[function(require,module,exports) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "messagePermissionDenied", ()=>messagePermissionDenied);
parcelHelpers.export(exports, "writePermissionDenied", ()=>writePermissionDenied);
parcelHelpers.export(exports, "readAuthMessage", ()=>readAuthMessage);
var _yjs = require("yjs"); // eslint-disable-line
var _encoding = require("lib0/encoding");
var _decoding = require("lib0/decoding");
const messagePermissionDenied = 0;
const writePermissionDenied = (encoder, reason)=>{
    _encoding.writeVarUint(encoder, messagePermissionDenied);
    _encoding.writeVarString(encoder, reason);
};
const readAuthMessage = (decoder, y, permissionDeniedHandler)=>{
    switch(_decoding.readVarUint(decoder)){
        case messagePermissionDenied:
            permissionDeniedHandler(y, _decoding.readVarString(decoder));
    }
};

},{"yjs":"gj9M9","lib0/encoding":"9yVNx","lib0/decoding":"ftn2I","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"57xPu":[function(require,module,exports) {
/**
 * @module awareness-protocol
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "outdatedTimeout", ()=>outdatedTimeout);
/**
 * @typedef {Object} MetaClientState
 * @property {number} MetaClientState.clock
 * @property {number} MetaClientState.lastUpdated unix timestamp
 */ /**
 * The Awareness class implements a simple shared state protocol that can be used for non-persistent data like awareness information
 * (cursor, username, status, ..). Each client can update its own local state and listen to state changes of
 * remote clients. Every client may set a state of a remote peer to `null` to mark the client as offline.
 *
 * Each client is identified by a unique client id (something we borrow from `doc.clientID`). A client can override
 * its own state by propagating a message with an increasing timestamp (`clock`). If such a message is received, it is
 * applied if the known state of that client is older than the new state (`clock < newClock`). If a client thinks that
 * a remote client is offline, it may propagate a message with
 * `{ clock: currentClientClock, state: null, client: remoteClient }`. If such a
 * message is received, and the known clock of that client equals the received clock, it will override the state with `null`.
 *
 * Before a client disconnects, it should propagate a `null` state with an updated clock.
 *
 * Awareness states must be updated every 30 seconds. Otherwise the Awareness instance will delete the client state.
 *
 * @extends {Observable<string>}
 */ parcelHelpers.export(exports, "Awareness", ()=>Awareness);
parcelHelpers.export(exports, "removeAwarenessStates", ()=>removeAwarenessStates);
parcelHelpers.export(exports, "encodeAwarenessUpdate", ()=>encodeAwarenessUpdate);
parcelHelpers.export(exports, "modifyAwarenessUpdate", ()=>modifyAwarenessUpdate);
parcelHelpers.export(exports, "applyAwarenessUpdate", ()=>applyAwarenessUpdate);
var _encoding = require("lib0/encoding");
var _decoding = require("lib0/decoding");
var _time = require("lib0/time");
var _math = require("lib0/math");
var _observable = require("lib0/observable");
var _function = require("lib0/function");
var _yjs = require("yjs"); // eslint-disable-line
const outdatedTimeout = 30000;
class Awareness extends (0, _observable.Observable) {
    /**
   * @param {Y.Doc} doc
   */ constructor(doc){
        super();
        this.doc = doc;
        /**
     * @type {number}
     */ this.clientID = doc.clientID;
        /**
     * Maps from client id to client state
     * @type {Map<number, Object<string, any>>}
     */ this.states = new Map();
        /**
     * @type {Map<number, MetaClientState>}
     */ this.meta = new Map();
        this._checkInterval = /** @type {any} */ setInterval(()=>{
            const now = _time.getUnixTime();
            if (this.getLocalState() !== null && outdatedTimeout / 2 <= now - /** @type {{lastUpdated:number}} */ this.meta.get(this.clientID).lastUpdated) // renew local clock
            this.setLocalState(this.getLocalState());
            /**
       * @type {Array<number>}
       */ const remove = [];
            this.meta.forEach((meta, clientid)=>{
                if (clientid !== this.clientID && outdatedTimeout <= now - meta.lastUpdated && this.states.has(clientid)) remove.push(clientid);
            });
            if (remove.length > 0) removeAwarenessStates(this, remove, "timeout");
        }, _math.floor(outdatedTimeout / 10));
        doc.on("destroy", ()=>{
            this.destroy();
        });
        this.setLocalState({});
    }
    destroy() {
        this.emit("destroy", [
            this
        ]);
        this.setLocalState(null);
        super.destroy();
        clearInterval(this._checkInterval);
    }
    /**
   * @return {Object<string,any>|null}
   */ getLocalState() {
        return this.states.get(this.clientID) || null;
    }
    /**
   * @param {Object<string,any>|null} state
   */ setLocalState(state) {
        const clientID = this.clientID;
        const currLocalMeta = this.meta.get(clientID);
        const clock = currLocalMeta === undefined ? 0 : currLocalMeta.clock + 1;
        const prevState = this.states.get(clientID);
        if (state === null) this.states.delete(clientID);
        else this.states.set(clientID, state);
        this.meta.set(clientID, {
            clock,
            lastUpdated: _time.getUnixTime()
        });
        const added = [];
        const updated = [];
        const filteredUpdated = [];
        const removed = [];
        if (state === null) removed.push(clientID);
        else if (prevState == null) {
            if (state != null) added.push(clientID);
        } else {
            updated.push(clientID);
            if (!_function.equalityDeep(prevState, state)) filteredUpdated.push(clientID);
        }
        if (added.length > 0 || filteredUpdated.length > 0 || removed.length > 0) this.emit("change", [
            {
                added,
                updated: filteredUpdated,
                removed
            },
            "local"
        ]);
        this.emit("update", [
            {
                added,
                updated,
                removed
            },
            "local"
        ]);
    }
    /**
   * @param {string} field
   * @param {any} value
   */ setLocalStateField(field, value) {
        const state = this.getLocalState();
        if (state !== null) this.setLocalState({
            ...state,
            [field]: value
        });
    }
    /**
   * @return {Map<number,Object<string,any>>}
   */ getStates() {
        return this.states;
    }
}
const removeAwarenessStates = (awareness, clients, origin)=>{
    const removed = [];
    for(let i = 0; i < clients.length; i++){
        const clientID = clients[i];
        if (awareness.states.has(clientID)) {
            awareness.states.delete(clientID);
            if (clientID === awareness.clientID) {
                const curMeta = /** @type {MetaClientState} */ awareness.meta.get(clientID);
                awareness.meta.set(clientID, {
                    clock: curMeta.clock + 1,
                    lastUpdated: _time.getUnixTime()
                });
            }
            removed.push(clientID);
        }
    }
    if (removed.length > 0) {
        awareness.emit("change", [
            {
                added: [],
                updated: [],
                removed
            },
            origin
        ]);
        awareness.emit("update", [
            {
                added: [],
                updated: [],
                removed
            },
            origin
        ]);
    }
};
const encodeAwarenessUpdate = (awareness, clients, states = awareness.states)=>{
    const len = clients.length;
    const encoder = _encoding.createEncoder();
    _encoding.writeVarUint(encoder, len);
    for(let i = 0; i < len; i++){
        const clientID = clients[i];
        const state = states.get(clientID) || null;
        const clock = /** @type {MetaClientState} */ awareness.meta.get(clientID).clock;
        _encoding.writeVarUint(encoder, clientID);
        _encoding.writeVarUint(encoder, clock);
        _encoding.writeVarString(encoder, JSON.stringify(state));
    }
    return _encoding.toUint8Array(encoder);
};
const modifyAwarenessUpdate = (update, modify)=>{
    const decoder = _decoding.createDecoder(update);
    const encoder = _encoding.createEncoder();
    const len = _decoding.readVarUint(decoder);
    _encoding.writeVarUint(encoder, len);
    for(let i = 0; i < len; i++){
        const clientID = _decoding.readVarUint(decoder);
        const clock = _decoding.readVarUint(decoder);
        const state = JSON.parse(_decoding.readVarString(decoder));
        const modifiedState = modify(state);
        _encoding.writeVarUint(encoder, clientID);
        _encoding.writeVarUint(encoder, clock);
        _encoding.writeVarString(encoder, JSON.stringify(modifiedState));
    }
    return _encoding.toUint8Array(encoder);
};
const applyAwarenessUpdate = (awareness, update, origin)=>{
    const decoder = _decoding.createDecoder(update);
    const timestamp = _time.getUnixTime();
    const added = [];
    const updated = [];
    const filteredUpdated = [];
    const removed = [];
    const len = _decoding.readVarUint(decoder);
    for(let i = 0; i < len; i++){
        const clientID = _decoding.readVarUint(decoder);
        let clock = _decoding.readVarUint(decoder);
        const state = JSON.parse(_decoding.readVarString(decoder));
        const clientMeta = awareness.meta.get(clientID);
        const prevState = awareness.states.get(clientID);
        const currClock = clientMeta === undefined ? 0 : clientMeta.clock;
        if (currClock < clock || currClock === clock && state === null && awareness.states.has(clientID)) {
            if (state === null) {
                // never let a remote client remove this local state
                if (clientID === awareness.clientID && awareness.getLocalState() != null) // remote client removed the local state. Do not remote state. Broadcast a message indicating
                // that this client still exists by increasing the clock
                clock++;
                else awareness.states.delete(clientID);
            } else awareness.states.set(clientID, state);
            awareness.meta.set(clientID, {
                clock,
                lastUpdated: timestamp
            });
            if (clientMeta === undefined && state !== null) added.push(clientID);
            else if (clientMeta !== undefined && state === null) removed.push(clientID);
            else if (state !== null) {
                if (!_function.equalityDeep(state, prevState)) filteredUpdated.push(clientID);
                updated.push(clientID);
            }
        }
    }
    if (added.length > 0 || filteredUpdated.length > 0 || removed.length > 0) awareness.emit("change", [
        {
            added,
            updated: filteredUpdated,
            removed
        },
        origin
    ]);
    if (added.length > 0 || updated.length > 0 || removed.length > 0) awareness.emit("update", [
        {
            added,
            updated,
            removed
        },
        origin
    ]);
};

},{"lib0/encoding":"9yVNx","lib0/decoding":"ftn2I","lib0/time":"gZsVK","lib0/math":"jhXHz","lib0/observable":"20Rfd","lib0/function":"1O0Qj","yjs":"gj9M9","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}],"60si9":[function(require,module,exports) {
/**
 * Utility module to work with urls.
 *
 * @module url
 */ var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
parcelHelpers.export(exports, "decodeQueryParams", ()=>decodeQueryParams);
parcelHelpers.export(exports, "encodeQueryParams", ()=>encodeQueryParams);
var _objectJs = require("./object.js");
const decodeQueryParams = (url)=>{
    /**
   * @type {Object<string,string>}
   */ const query = {};
    const urlQuerySplit = url.split("?");
    const pairs = urlQuerySplit[urlQuerySplit.length - 1].split("&");
    for(let i = 0; i < pairs.length; i++){
        const item = pairs[i];
        if (item.length > 0) {
            const pair = item.split("=");
            query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || "");
        }
    }
    return query;
};
const encodeQueryParams = (params)=>_objectJs.map(params, (val, key)=>`${encodeURIComponent(key)}=${encodeURIComponent(val)}`).join("&");

},{"./object.js":"4uXcx","@parcel/transformer-js/src/esmodule-helpers.js":"gkKU3"}]},["alQLQ"], null, "parcelRequire561b")

//# sourceMappingURL=y-websocket.a9c9d557.js.map
