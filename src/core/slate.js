/* eslint-disable no-template-curly-in-string */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-expressions */
/* eslint-disable new-cap */
/* eslint-disable import/no-cycle */
import uniq from 'lodash.uniq';
import cloneDeep from 'lodash.clonedeep';
import merge from 'deepmerge';
import utils from '../helpers/utils';
import getTransformedPath from '../helpers/getTransformedPath';
import canvas from '../slate/canvas';
import collab from '../slate/collab';
import nodeController from '../slate/nodeController';
import multiSelection from '../slate/multiSelection';
import birdsEye from '../slate/birdsEye';
import inertia from '../slate/inertia';
import controller from '../slate/controller';
import zoomSlider from '../slate/zoomSlider';
import undoRedo from '../slate/undoRedo';
import grid from '../slate/grid';
import comments from '../slate/comments';
import keyboard from '../slate/keyboard';
import filters from '../slate/filters';

import base from './base';
import node from './node';

export default class slate extends base {
  constructor(_options, events) {
    super(_options);
    this.options = {
      id: _options.id || utils.guid(),
      container: '',
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
        backgroundColorAsGradient: null, // linear|radial
        backgroundGradientType: null,
        backgroundGradientColors: [],
        backgroundGradientStrategy: null, // shades|palette
      },
      viewPort: {
        useInertiaScrolling: true,
        showGrid: false,
        snapToObjects: true,
        gridSize: 50,
        width: 50000,
        height: 50000,
        left: 5000,
        top: 5000,
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
      basedOnTemplate: false,
      isTemplate: false,
      autoEnableDefaultFilters: true,
      autoResizeNodesBasedOnText: true,
      disableAutoLayoutOfManuallyPositionedNodes: true,
      followMe: false,
      useLayoutQuandrants: false,
      huddleType: 'disabled',
      allowCollaboration: true,
    };

    this.options = merge(this.options, _options);
    this.events = events || {
      onNodeDragged: null,
      onCanvasClicked: null,
      onImagesRequested: null,
      onRequestSave: null,
      onInitCollaboration: null,
      isReadOnly: null,
    };

    // console.log("SLATE - share details are", this.options.shareId, this.options.userId, this.options.orgId);

    // ensure container is always an object
    if (!utils.isElement(this.options.container)) {
      this.options.container = utils.el(this.options.container);
    }

    this.constants = {
      statusPanelAtRest: 33,
      statusPanelExpanded: 200,
    };

    this.glows = [];
    this.tips = [];
    this.tempNodeId = utils.guid();
    this.allLines = [];
    this.candidatesForSelection = {};
  }

  prep() {
    const self = this;
    // instantiate all the dependencies for the slate -- order here is importantish
    // (birdsEye, undoRedo, zoomSlider are used in canvas, and inertia uses canvas)
    self.nodes = new nodeController(self);
    self.collab = new collab(self);
    self.birdsEye = new birdsEye(self);
    self.zoomSlider = new zoomSlider(self);
    if (!self.isReadOnly() && !self.isCommentOnly()) {
      self.undoRedo = new undoRedo(self);
      self.multiSelection = new multiSelection(self);
    }
    self.controller = new controller(self);
    self.filters = new filters(self);
    self.canvas = new canvas(self);
    self.canvas.init();

    self.inertia = new inertia(self);
    self.grid = new grid(self);
    self.comments = new comments(self);
    self.keyboard = new keyboard(self);

    self.autoLoadFilters();

    if (self.options.onInitCompleted) {
      self.options.onInitCompleted.apply(self);
    }
  }

  initPlain() {
    const self = this;
    self.prep();
    return self;
  }

  async init() {
    const self = this;
    self.prep();
    if (self.multiSelection) {
      await self.multiSelection.init();
    }
    if (self.options.allowCollaboration ?? true) {
      setTimeout(async () => {
        await self.collab.init();
      }, 100);
    }
    return self;
  }

  url(opt) {
    return this.options.ajax.rootUrl + this.options.ajax.urlFlavor + opt;
  }

  glow(obj) {
    this.glows.push(obj.glow());
  }

  cursor(obj) {
    const self = this;
    const c = self.options.container;
    const ele = self.canvas.internal;
    if (!self.cursors) {
      self.offsetsForCursor = {
        container: utils.positionedOffset(c),
        canvas: utils.positionedOffset(ele),
      };
      self.cursorTimeouts = {};
      self.cursors = {};
      // create observer
      const observer = new MutationObserver(() => {
        self.offsetsForCursor.canvas = utils.positionedOffset(ele);
      });
      observer.observe(ele, {
        attributes: true,
        childList: false,
        subtree: false,
      });
    }
    if (!self.cursors[obj.clientID]) {
      const pos = document.createElement('div');
      pos.setAttribute('class', 'slateCursor');
      pos.style.position = 'absolute';
      pos.style.padding = '0px';
      pos.style.margin = '0px;';
      pos.style.display = 'block';
      pos.style['user-select'] = 'none';
      pos.style.zIndex = '0';

      const flex = document.createElement('div');
      flex.style.display = 'flex';
      flex.style.padding = 0;
      flex.style.margin = 0;

      const dot = document.createElement('div');
      dot.innerHTML = `
        <svg width="30px" height="30px" viewBox="-2.4 -2.4 28.80 28.80" role="img" xmlns="http://www.w3.org/2000/svg" stroke="${obj.color}" stroke-width="2.4" stroke-linecap="square" stroke-linejoin="miter" fill="${obj.color}" color="${obj.color}" transform="matrix(1, 0, 0, 1, 0, 0)"><g><polygon points="7 20 7 4 19 16 12 16 7 21"></polygon> </g></svg>`;
      // dot.style.backgroundColor = obj.color || '#000'

      flex.appendChild(dot);

      const txt = document.createElement('div');
      txt.style.fontSize = '11pt';
      txt.style.height = '25px';
      txt.style.whiteSpace = 'nowrap';
      txt.style.backgroundColor = '#fff';
      txt.style.color = '#000';
      txt.style.padding = '1px 7px 1px 7px';
      txt.style.border = `1px solid black`;
      txt.style.borderRadius = '5px';
      txt.style.fontFamily = 'trebuchet ms';
      txt.innerHTML = `${obj.userName || 'Guest'}`;

      flex.appendChild(txt);

      pos.appendChild(flex);

      self.cursors[obj.clientID] = pos;
      c.appendChild(pos);
    }

    const multiplier = self.options.viewPort.zoom.r / obj.currentZoom;

    const top =
      obj.y * multiplier +
        obj.top * multiplier -
        Math.abs(self.offsetsForCursor.canvas?.top || 0) -
        self.offsetsForCursor.container?.top || 0;
    const left =
      obj.x * multiplier +
        obj.left * multiplier -
        Math.abs(self.offsetsForCursor.canvas?.left || 0) -
        self.offsetsForCursor.container?.left || 0;

    self.cursors[obj.clientID].style.top = `${top}px`;
    self.cursors[obj.clientID].style.left = `${left}px`;

    // expire after 10 of no activity
    clearTimeout(self.cursorTimeouts[obj.clientID]);
    self.cursorTimeouts[obj.clientID] = setTimeout(() => {
      c.removeChild(self.cursors[obj.clientID]);
      delete self.cursors[obj.clientID];
    }, 2000 * 1);
  }

  unglow() {
    this.glows.forEach((glow) => {
      glow.remove();
    });
    this.glows = [];
  }

  addtip(tip) {
    if (tip) this.tips.push(tip);
  }

  untooltip() {
    this.tips.forEach((tip) => {
      tip && tip.remove();
    });
  }

  toggleFilters(blnHide, nodeId, esc) {
    // hide filters during dragging
    if (!utils.isSafari() && !utils.isMobile()) {
      if (this.nodes.allNodes.length > 20) {
        this.nodes.allNodes.forEach((n) => {
          if (!nodeId || n.options.id === nodeId) {
            n.toggleFilters(blnHide);
          }
        });
        this.allLines
          .filter((l) => l.lineEffect)
          .forEach((c) => {
            if (blnHide) {
              c.line.attr('filter', '');
            } else {
              c.line.attr('filter', `url(#${c.lineEffect})`);
            }
          });
        if (blnHide) {
          this.canvas.hideBg();
        }
        if (esc) {
          setTimeout(() => {
            this.toggleFilters(!blnHide);
            this.canvas.hideBg(1);
          }, 500);
        }
      }
    }
  }

  removeContextMenus() {
    const _cm = utils.select('div.sb_cm');
    _cm.forEach((elem) => {
      document.body.removeChild(elem);
    });
  }

  remove() {
    this.nodes.allNodes.forEach((nn) => {
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
    self.svg(
      {
        ...ropts,
        isPNG: true,
        useDataImageUrls: true,
        backgroundOnly: ropts?.backgroundOnly,
      },
      (opts) => {
        function guessBackgroundColor(ctx, cnvs, tolerance = 10) {
          const width = cnvs.width;
          const height = cnvs.height;
          const samples = [];
          // Determine a sampling step; adjust the density as needed.
          const step = Math.max(
            1,
            Math.floor(width / 50),
            Math.floor(height / 50)
          );

          // Sample pixels along the top and bottom edges.
          for (let x = 0; x < width; x += step) {
            const topPixel = ctx.getImageData(x, 0, 1, 1).data;
            const bottomPixel = ctx.getImageData(x, height - 1, 1, 1).data;
            samples.push([topPixel[0], topPixel[1], topPixel[2]]);
            samples.push([bottomPixel[0], bottomPixel[1], bottomPixel[2]]);
          }

          // Sample pixels along the left and right edges (excluding the already-sampled corners).
          for (let y = step; y < height - step; y += step) {
            const leftPixel = ctx.getImageData(0, y, 1, 1).data;
            const rightPixel = ctx.getImageData(width - 1, y, 1, 1).data;
            samples.push([leftPixel[0], leftPixel[1], leftPixel[2]]);
            samples.push([rightPixel[0], rightPixel[1], rightPixel[2]]);
          }

          // Group similar colors based on the given tolerance.
          const groups = [];
          samples.forEach((color) => {
            let foundGroup = false;
            for (const group of groups) {
              const [r, g, b] = group.color;
              if (
                Math.abs(color[0] - r) <= tolerance &&
                Math.abs(color[1] - g) <= tolerance &&
                Math.abs(color[2] - b) <= tolerance
              ) {
                group.sum[0] += color[0];
                group.sum[1] += color[1];
                group.sum[2] += color[2];
                group.count++;
                foundGroup = true;
                break;
              }
            }
            if (!foundGroup) {
              groups.push({
                color: color.slice(),
                sum: color.slice(),
                count: 1,
              });
            }
          });

          // Find the group with the highest count (common background candidate).
          let bestGroup = groups[0];
          groups.forEach((group) => {
            if (group.count > bestGroup.count) {
              bestGroup = group;
            }
          });

          // Average the colors in the best group.
          const avgR = Math.floor(bestGroup.sum[0] / bestGroup.count);
          const avgG = Math.floor(bestGroup.sum[1] / bestGroup.count);
          const avgB = Math.floor(bestGroup.sum[2] / bestGroup.count);

          return [avgR, avgG, avgB];
        }

        function makeTransparent(ctx, targetAlpha, cnvs) {
          // Instead of assuming (0,0) is representative of the background color,
          // sample multiple pixels along the canvas border.
          const tolerance = 10; // Adjust tolerance as needed.
          const [bgR, bgG, bgB] = guessBackgroundColor(ctx, cnvs, tolerance);

          // Get the full image data.
          const imageData = ctx.getImageData(0, 0, cnvs.width, cnvs.height);
          const data = imageData.data;

          // Loop through every pixel (each pixel has 4 values: r, g, b, a)
          for (let i = 0; i < data.length; i += 4) {
            const pixelR = data[i],
              pixelG = data[i + 1],
              pixelB = data[i + 2];

            // If this pixel is close to the estimated background color, update its alpha.
            if (
              Math.abs(pixelR - bgR) <= tolerance &&
              Math.abs(pixelG - bgG) <= tolerance &&
              Math.abs(pixelB - bgB) <= tolerance
            ) {
              data[i + 3] = targetAlpha;
            }
          }

          // Write back the modified image data to the canvas.
          ctx.putImageData(imageData, 0, 0);
        }

        if (self.events.onCreateImage) {
          self.events.onCreateImage(
            { svg: opts.svg, orient: opts.orient, type: 'png' },
            (err, base64) => {
              if (err) {
                console.error('Unable to create png server side', svg, err);
              } else if (ropts?.base64) {
                cb(base64);
              } else {
                const img = new Image();
                img.src = base64;
                img.onload = () => {
                  const cnvs = document.createElement('canvas');
                  cnvs.width = img.naturalWidth;
                  cnvs.height = img.naturalHeight;
                  const ctx = cnvs.getContext('2d');
                  ctx.imageSmoothingEnabled = false;
                  ctx.drawImage(img, 0, 0);

                  if (ropts?.alpha != null) {
                    makeTransparent(ctx, ropts.alpha, cnvs);
                  }
                  cnvs.toBlob((blob) => {
                    if (cb && opts?.asBinary) {
                      cb(blob);
                    } else {
                      const link = document.createElement('a');
                      link.setAttribute(
                        'download',
                        `${(self.options.name || 'slate')
                          .replace(/[^a-z0-9]/gi, '_')
                          .toLowerCase()}_${self.options.id}.png`
                      );
                      link.href = URL.createObjectURL(blob);
                      const event = new MouseEvent('click');
                      link.dispatchEvent(event);
                      cb && cb();
                    }
                  });
                };
              }
            }
          );
        } else {
          const cnvs = document.createElement('canvas');
          cnvs.width = opts.orient.width;
          cnvs.height = opts.orient.height;
          const blb = new Blob([opts.svg], {
            type: 'image/svg+xml;charset=utf8',
          });
          const url = URL.createObjectURL(blb);
          const ctx = cnvs.getContext('2d');
          const img = document.createElement('img');
          img.src = url;
          img.onload = () => {
            ctx.drawImage(img, 0, 0);
            if (ropts?.alpha != null) {
              makeTransparent(ctx, ropts.alpha, cnvs);
            }
            if (ropts?.asBinary) {
              cnvs.toBlob((blob) => {
                cb(blob);
              });
            } else {
              const imgsrc = cnvs.toDataURL('image/png');
              if (ropts?.base64) {
                cb(imgsrc);
                URL.revokeObjectURL(img.src);
              } else {
                const a = document.createElement('a');
                a.download = `${(self.options.name || 'slate')
                  .replace(/[^a-z0-9]/gi, '_')
                  .toLowerCase()}_${self.options.id}.png`;
                a.href = imgsrc;
                a.click();
                URL.revokeObjectURL(img.src);
                cb && cb();
              }
            }
          };
          img.onerror = (err) => {
            console.log('error loading image', err);
          };
        }
      }
    );
  }

  async pngSync(ropts) {
    const self = this;
    return new Promise((resolve, reject) => {
      self.png(ropts, (base64) => {
        resolve(base64);
      });
    });
  }

  copy(opts) {
    const self = this;
    if (!self.copySlate) {
      self.copySlate = new slate({
        container: opts.container,
        containerStyle: this.options.containerStyle,
        defaultLineColor: this.options.defaultLineColor,
        viewPort: this.options.viewPort,
        name: this.options.name,
        description: this.options.description,
        allowCollaboration: false,
        showbirdsEye: false,
        showMultiSelect: false,
        showUndoRedo: false,
        showZoom: false,
      }).initPlain();
    }

    const _json = JSON.parse(this.exportJSON());
    _json.nodes.forEach((nde) => {
      const _mpkg = opts.moves
        ? opts.moves.find((m) => m.id === nde.options.id || m.id === '*')
        : null;
      if (_mpkg) {
        nde.options.xPos += _mpkg.x;
        nde.options.yPos += _mpkg.y;
        const _transforms = [`t${_mpkg.x}, ${_mpkg.y}`];
        nde.options.vectorPath = getTransformedPath(
          nde.options.vectorPath,
          _transforms
        );
      }
    });

    self.copySlate.loadJSON(JSON.stringify(_json));
    self.copySlate.nodes.refreshAllRelationships();

    return self.copySlate;
  }

  svg(opts, cb) {
    const self = this;

    const nodesToOrient = opts?.nodes
      ? self.nodes.allNodes.filter(
          (n) => opts?.nodes.indexOf(n.options.id) > -1
        )
      : null;
    const _orient = self.getOrientation(nodesToOrient, true);
    const _r = 1; // this.options.viewPort.zoom.r || 1;
    const _resizedSlate = JSON.parse(
      self.exportJSON(
        opts?.backgroundOnly ? [] : opts?.nodes ? opts.nodes : null
      )
    );
    _resizedSlate.nodes.forEach((n) => {
      const origNode = self.nodes.allNodes.find(
        (node) => node.options.id === n.options.id
      );
      if (opts.isPNG) {
        // no animations in PNG
        n.options.animations = { text: null, vect: null };
      }
      const bbox = origNode.vect.getBBox();
      const _ty = bbox.top * _r;
      const _tx = bbox.left * _r;
      const _width = bbox.width;
      const _height = bbox.height;
      n.options.yPos = _ty - _orient.top;
      n.options.xPos = _tx - _orient.left;
      n.options.width = _width * _r;
      n.options.height = _height * _r;
      let vp = n.options.vectorPath;
      const _updatedPath = utils._transformPath(
        vp,
        [
          'T',
          (_orient.left / _r) * -1,
          ',',
          (_orient.top / _r) * -1,
          's',
          ',',
          _r,
          ',',
          _r,
        ].join('')
      );
      n.options.vectorPath = _updatedPath;
      // recenter the rotation point to the center of the node
      if (n.options.rotate?.rotationAngle) {
        n.options.rotate.point = {
          x: n.options.xPos + n.options.width / 2, // _orient.width
          y: n.options.yPos + n.options.height / 2, // _orient.height
        };
      }
    });

    const _div = document.createElement('div');
    _div.setAttribute('id', 'tempSvgSlate');
    _div.style.width = `${_orient.width}px`;
    _div.style.height = `${_orient.height}px`;
    _div.style.visibility = 'hidden';

    document.body.appendChild(_div);

    const exportOptions = merge(_resizedSlate.options, {
      container: 'tempSvgSlate',
      containerStyle: {
        backgroundColor: opts.noBackground
          ? 'transparent'
          : _resizedSlate.options.containerStyle.backgroundColor,
        backgroundColorAsGradient: opts.noBackground
          ? null
          : _resizedSlate.options.containerStyle.backgroundColorAsGradient,
        backgroundGradientType: opts.noBackground
          ? null
          : _resizedSlate.options.containerStyle.backgroundGradientType,
        backgroundGradientColors: opts.noBackground
          ? null
          : _resizedSlate.options.containerStyle.backgroundGradientColors,
        backgroundGradientStrategy: opts.noBackground
          ? null
          : _resizedSlate.options.containerStyle.backgroundGradientStrategy,
      },
      defaultLineColor: _resizedSlate.options.defaultLineColor,
      viewPort: {
        allowDrag: false,
        originalWidth: _orient.width,
        width: _orient.width,
        height: _orient.height,
        left: 0,
        top: 0,
        zoom: { w: _orient.width * 1.5, h: _orient.height * 1.5 },
        showGrid: false,
      },
      name: _resizedSlate.options.name,
      description: _resizedSlate.options.description,
      showbirdsEye: false,
      showMultiSelect: false,
      showUndoRedo: false,
      showZoom: false,
      showLocks: false,
      isEmbedding: true,
      allowCollaboration: false,
    });

    async function execute() {
      // we don't yet load the nodes by default even though they're passed in on the options below...
      const _exportCanvas = await new slate(exportOptions).init();
      // ...that's done in the loadJSON...which seems weird
      _exportCanvas.loadJSON(
        JSON.stringify({ options: exportOptions, nodes: _resizedSlate.nodes }),
        false,
        true
      );
      // events don't serialize, so add them explicitly
      _exportCanvas.events = self.events;
      _exportCanvas.nodes.refreshAllRelationships();

      // add the bgColor (this is done on html styling in slatebox proper view)
      let bg = null;
      if (_resizedSlate.options.containerStyle.backgroundImage) {
        const img = document.createElement('img');
        img.setAttribute(
          'src',
          _resizedSlate.options.containerStyle.backgroundImage
        );
        img.style.visibility = 'hidden';
        document.body.appendChild(img);
        let bw = img.naturalWidth;
        let bh = img.naturalHeight;
        if (self.options.containerStyle.backgroundSize === 'cover') {
          const ratio = self.canvas.internal.parentElement.offsetWidth / bw;
          bw *= ratio;
          bh *= ratio;
        } else {
          // TODO: handle repeat by calcing how many paper.images should be added to an array of [bg] and then simulate the repeat effect
          // need to see if _orient.width > bw and if so, add another horizontally, and if _orient.height > bh, then add another by the multiple vertically as well
        }
        img.remove();
        const iw = Math.max(bw, _orient.width);
        const ih = Math.max(bh, _orient.height);
        bg = _exportCanvas.paper.image(
          _resizedSlate.options.containerStyle.backgroundImage,
          0,
          0,
          iw,
          ih
        );
      } else {
        bg = _exportCanvas.paper
          .rect(0, 0, _orient.width, _orient.height)
          .attr({
            fill: _resizedSlate.options.containerStyle.backgroundColor,
          });
      }
      bg?.toBack();

      // finally go through and apply animations
      requestAnimationFrame(() => {
        _exportCanvas.nodes.allNodes.forEach((n) => {
          if (n.options.animations.text) {
            n.applyFilters({
              id: n.options.animations.text,
              apply: 'text',
              isAnimation: true,
              deferAnimations: opts.deferAnimations,
            });
          }
          if (n.options.animations.vect) {
            const isInfinite =
              self.filters.availableAnimations[n.options.animations.vect]
                .isInfinite;
            n.applyFilters({
              id: n.options.animations.vect,
              apply: 'vect',
              isAnimation: true,
              deferAnimations: isInfinite ? false : opts.deferAnimations,
            });
          }
        });

        // if (opts.drawBorder) {
        //   const orient = _exportCanvas.getOrientation();
        //   // Create inner fill rectangle first
        //   const innerRect = _exportCanvas.paper.rect(
        //     0,
        //     0,
        //     orient.width,
        //     orient.height
        //   );
        //   setTimeout(() => {
        //     innerRect
        //       .attr({
        //         fill: '#fff',
        //         'fill-opacity': opts.internalWhiteOpacity || 0.1,
        //         stroke: '#000',
        //         'stroke-width': 10,
        //       })
        //       .toBack();
        //   }, 100);
        // }
        // the timeout is critical to ensure that the SVG canvas settles
        // and the url-fill images appear.
        setTimeout(async () => {
          // pass skipOptimize to rawSVG to avoid double optimization
          _exportCanvas.canvas.rawSVG(
            { skipOptimize: opts.skipOptimize ?? true }, // default to skipOptimize unless explicitly set to false
            (svg) => {
              // presume download if no cb is sent
              const svgBlob = new Blob([svg], {
                type: 'image/svg+xml;charset=utf-8',
              });
              if (!cb) {
                const svgUrl = URL.createObjectURL(svgBlob);
                const dl = document.createElement('a');
                dl.href = svgUrl;
                dl.download = `${(self.options.name || 'slate')
                  .replace(/[^a-z0-9]/gi, '_')
                  .toLowerCase()}_${self?.shareId}.svg`;
                dl.click();
              } else if (opts?.asBinary && !opts.isPNG) {
                cb(svgBlob);
              } else {
                cb({ svg, orient: _orient });
              }
              _div.remove();
            }
          );
        }, 200);
      });
    }
    execute();
  }

  autoLoadFilters() {
    const self = this;
    // if auto filter is on, then these filters become immediately availalbe in their default form
    if (self.filters.availableAnimations) {
      Object.keys(self.filters.availableAnimations).forEach((a) => {
        self.paper.def({
          tag: 'style',
          type: 'text/css',
          id: `animation_${self.options.id}_${a}`,
          inside: [self.filters.availableAnimations[a].css],
        });
      });
      // const allCss = Object.values(self.filters.availableAnimations)
      //   .map((a) => a.css)
      //   .join(' ');
      // // always add style tag to the <defs> for font embedding
      // self.paper.def({
      //   tag: 'style',
      //   type: 'text/css',
      //   id: `${self.options.isEmbedding ? 'embedded_' : ''}animationStyles_${self.options.id}`,
      //   inside: [allCss],
      // });
    }
    self.paper.def({
      tag: 'style',
      type: 'text/css',
      id: `sb-txt-wrap`,
      inside: [
        `.sb-txt-wrap { transform-box: fill-box; transform-origin: top; }`,
      ],
    });
    if (
      self.options.autoEnableDefaultFilters &&
      self.filters?.availableFilters
    ) {
      Object.keys(self.filters.availableFilters).forEach((type) => {
        self.filters.add(
          {
            id: self.options.isEmbedding ? `embedded_${type}` : type,
            filters: self.filters.availableFilters[type].filters,
            attrs: self.filters.availableFilters[type].attrs,
          },
          true
        );
        if (self.filters.availableFilters[type].deps) {
          self.filters.addDeps(self.filters.availableFilters[type].deps);
        }
      });
    }
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
    if (self.options.viewPort.showGrid) {
      self.grid?.show();
    } else {
      self.grid?.destroy();
    }

    // zoom
    if (!blnSkipZoom) {
      self.zoomSlider?.set(self.options.viewPort.zoom.w || 50000);
    }

    // sort nodes by their last painted order to honor toBack/toFront
    loadedSlate.nodes.sort((n1, n2) => {
      const i1 = loadedSlate.options.nodeOrder?.findIndex(
        (n) => n === n1.options.id
      );
      const i2 = loadedSlate.options.nodeOrder?.findIndex(
        (n) => n === n2.options.id
      );
      return i1 - i2;
    });

    const deferredRelationships = [];
    loadedSlate.nodes.forEach((n) => {
      n.options.allowDrag = true; // must default
      n.options.allowMenu = true;
      const _boundTo = new node(n.options);
      self.nodes.add(_boundTo, useMainCanvas);
      deferredRelationships.push({ bt: _boundTo, json: n });
    });

    deferredRelationships.forEach((relationship) => {
      const _bounded = relationship;
      _bounded.bt.addRelationships(_bounded.json);
    });

    if (self.options.showLocks) {
      self.displayLocks();
    }

    // refreshes all relationships
    self.nodes.allNodes.forEach((_node) => {
      _node.relationships.updateAssociationsWith({
        activeNode: _node.options.id,
        currentDx: 0,
        currentDy: 0,
      });
    });
    self.nodes.refreshAllRelationships();

    // finally invoke toFront in order
    self.nodes.allNodes.forEach((n) => n.toFront());

    // always add style tag to the <defs> for font embedding
    self.paper.def({
      tag: 'style',
      type: 'text/css',
      id: `embeddedSBStyles_${self.options.id}`,
    });

    self.paper.def({
      tag: 'path',
      id: `raphael-marker-classic`,
      'stroke-linecap': 'round',
      d: 'M5,0 0,2.5 5,5 3.5,3 3.5,2z',
    });

    self.loadAllFonts();
    if (!blnSkipZoom) {
      self.controller.centerOnNodes({ dur: 0 });
    }
  }

  loadAllFonts() {
    // load all fonts
    const fonts = uniq(
      this.nodes.allNodes.map((n) => n.options.fontFamily)
    ).join('|');
    if (document.getElementById('googleFonts')) {
      document
        .getElementById('googleFonts')
        .setAttribute(
          'href',
          `https://fonts.googleapis.com/css?family=${fonts}`
        );
    } else {
      const sc = document.createElement('link');
      sc.setAttribute(
        'src',
        'https://fonts.googleapis.com/css?family=${fonts}'
      );
      sc.setAttribute('id', 'googleFonts');
      sc.setAttribute('rel', 'stylesheet');
      sc.setAttribute('type', 'text/css');
      document.head.appendChild(sc);
    }
  }

  displayLocks() {
    this.nodes.allNodes.forEach((nd) => {
      nd.initLock();
    });
  }

  hideLocks() {
    this.nodes.allNodes.forEach((nd) => {
      nd.hideLock();
    });
  }

  isReadOnly() {
    return (
      !this.events.isReadOnly ||
      (this.events.isReadOnly && this.events.isReadOnly())
    );
  }

  isCommentOnly() {
    return (
      !this.events.isCommentOnly ||
      (this.events.isCommentOnly && this.events.isCommentOnly())
    );
  }

  canRemoveComments() {
    return (
      !this.events.canRemoveComments ||
      (this.events.canRemoveComments && this.events.canRemoveComments())
    );
  }

  // the granularity is at the level of the node...
  exportDifference(compare, lineWidthOverride) {
    const _difOpts = { ...this.options };
    delete _difOpts.container;

    // birdsEye specific -- if this is not here, then locks
    // show up on the birdsEye
    _difOpts.showLocks = compare.options.showLocks;

    const jsonSlate = {
      options: JSON.parse(JSON.stringify(_difOpts)),
      nodes: [],
    };
    const tnid = this.tempNodeId;
    this.nodes.allNodes.forEach((nd) => {
      let _exists = false;
      const pn = nd;
      if (pn.options.id !== tnid) {
        compare.nodes.allNodes.forEach((nodeInner) => {
          if (nodeInner.options.id === pn.options.id) {
            _exists = true;
          }
        });
        if (!_exists) {
          jsonSlate.nodes.push(pn.serialize(lineWidthOverride));
        }
      }
    });

    return JSON.stringify(jsonSlate);
  }

  exportJSON(nodes) {
    const _cont = this.options.container;
    const _opts = this.options;
    delete _opts.container;

    const jsonSlate = { options: JSON.parse(JSON.stringify(_opts)), nodes: [] };
    this.options.container = _cont;

    delete jsonSlate.options.ajax;
    delete jsonSlate.options.container;

    const tnid = this.tempNodeId;
    this.nodes.allNodes.forEach((nd) => {
      if (nd.options.id !== tnid && (!nodes || nodes.includes(nd.options.id))) {
        jsonSlate.nodes.push(nd.serialize());
      }
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
      for (let _px = 0; _px < an.length; _px += 1) {
        const sbw = 10;
        const _bb = an[_px].vect.getBBox();

        if (_bb) {
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
      }

      sWidth = bb.right - bb.left;
      sHeight = bb.bottom - bb.top;

      if (sHeight > sWidth) {
        orient = 'portrait';
      }
    }
    return {
      orientation: orient,
      height: sHeight,
      width: sWidth,
      left: bb.left,
      top: bb.top,
    };
  }

  resize(_size, dur, pad) {
    let _p = pad || 0;
    if (_p < 6) _p = 6;
    _size -= _p * 2 || 0;
    const orx = this.getOrientation();
    const wp = (orx.width / _size) * this.options.viewPort.width;
    const hp = (orx.height / _size) * this.options.viewPort.height;
    const sp = Math.max(wp, hp);

    const _r =
      Math.max(this.options.viewPort.width, this.options.viewPort.height) / sp;
    const l = orx.left * _r - _p;
    const t = orx.top * _r - _p;

    this.zoom(0, 0, sp, sp, true);
    this.options.viewPort.zoom = {
      w: sp,
      h: sp,
      l: parseInt(l * -1, 10),
      t: parseInt(t * -1, 10),
      r: this.options.viewPort.originalWidth / sp,
    };
    this.canvas.move({ x: l, y: t, dur, isAbsolute: true });
  }

  disable(exemptSlate, exemptNodes, full) {
    if (!exemptNodes) {
      this.nodes.allNodes.forEach((nd) => {
        nd.disable();
      });
    }

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
    if (!exemptNodes) {
      this.nodes.allNodes.forEach((nd) => {
        !nd.options.isLocked && nd.enable();
      });
    }
    if (!exemptSlate) {
      this.options.enabled = true;
      this.options.allowDrag = true;
    }
  }

  reorderNodes() {
    // these ids will come out in the order that they are painted on the screen - toFront and toBack adjusts this, so we need
    // to always keep this hand so that when the slate is reloaded, it can order the nodes by these ids (which are going to be dif
    // from the saved JSON order of arrays)
    const ids = Array.from(
      this.canvas.internal.querySelector('svg').querySelectorAll('path')
    )
      .map((a) => a.getAttribute('rel')?.replace(/^nodrag_|^nodrag_text-/, '')) // ensure the nodrag convention prefixes are removed
      .filter((r) => !!r);
    // console.log("order of nodes", ids);
    this.options.nodeOrder = ids;
  }

  findChildren(nodeIds, allChildren = []) {
    const self = this;
    // get his node's children - then recursively call findChildren on that node
    const nodes = self.nodes.allNodes.filter((n) =>
      nodeIds.includes(n.options.id)
    );
    allChildren = allChildren.concat(nodes.map((n) => n.options.id));
    const children = [];
    nodes.forEach((n) => {
      n.relationships.associations
        .filter((a) => a.parent.options.id === n.options.id)
        .forEach((a) => children.push(a.child.options.id));
    });
    if (children.length) {
      return self.findChildren(children, allChildren);
    }
    return allChildren;
  }

  applyTheme(theme, syncWithTheme, revertTheme) {
    const self = this;
    if (!revertTheme) {
      self.options.basedOnThemeId = theme.themeId || theme._id;
      self.options.syncWithTheme = syncWithTheme;
    } else {
      self.options.basedOnThemeId = null;
      self.options.syncWithTheme = null;
    }
    const nodeStyle = {};
    const currentNodesByColor = {};
    const totChildren = [];

    // first apply slate
    if (theme.containerStyle.backgroundImage) {
      self.collab.invoke({
        type: 'onSlateBackgroundImageChanged',
        data: {
          bg: {
            size: theme.containerStyle.backgroundSize,
            url: theme.containerStyle.backgroundImage,
          },
        },
      });
    } else if (theme.containerStyle.backgroundEffect) {
      self.collab.invoke({
        type: 'onSlateBackgroundEffectChanged',
        data: { effect: theme.containerStyle.backgroundEffect },
      });
    } else {
      self.collab.invoke({
        type: 'onSlateBackgroundColorChanged',
        data: {
          color: theme.containerStyle.backgroundColor,
          asGradient: theme.containerStyle.backgroundColorAsGradient,
          gradientType: theme.containerStyle.backgroundGradientType,
          gradientColors: theme.containerStyle.backgroundGradientColors,
          gradientStrategy: theme.containerStyle.backgroundGradientStrategy,
        },
      });
    }
    self.collab.invoke({
      type: 'onLineColorChanged',
      data: { color: theme.defaultLineColor },
    });

    function applyStyle(id) {
      const allKeys = Object.keys(theme.styles);
      const lastStyle = theme.styles[allKeys[allKeys.length - 1]];
      const styleBase = theme.styles[nodeStyle[id]] || lastStyle;

      // borders
      self.collab.invoke({
        type: 'onNodeBorderPropertiesChanged',
        data: { id, prop: 'borderWidth', val: styleBase.borderWidth },
      });
      self.collab.invoke({
        type: 'onNodeBorderPropertiesChanged',
        data: { id, prop: 'borderColor', val: styleBase.borderColor },
      });
      self.collab.invoke({
        type: 'onNodeBorderPropertiesChanged',
        data: { id, prop: 'borderOpacity', val: styleBase.borderOpacity },
      });
      self.collab.invoke({
        type: 'onNodeBorderPropertiesChanged',
        data: { id, prop: 'borderStyle', val: styleBase.borderStyle },
      });

      // shape
      if (styleBase.vectorPath && syncWithTheme) {
        // const node = self.nodes.one(id);
        // const sendPath = utils._transformPath(styleBase.vectorPath, `T${node.options.xPos},${node.options.xPos}`);
        self.collab.invoke({
          type: 'onNodeShapeChanged',
          data: { id, hint: styleBase.hint, shape: styleBase.vectorPath },
        });
      }

      // text
      if (syncWithTheme) {
        self.collab.invoke({
          type: 'onNodeTextChanged',
          data: {
            id,
            fontSize: styleBase.fontSize,
            fontFamily: styleBase.fontFamily,
            fontColor: styleBase.foregroundColor,
            textOpacity: styleBase.textOpacity,
          },
        });
      }

      // effects
      self.collab.invoke({
        type: 'onNodeEffectChanged',
        data: { id, filter: { apply: 'text', id: styleBase.filters.text } },
      });

      // background color
      self.collab.invoke({
        type: 'onNodeColorChanged',
        data: {
          id,
          opacity: styleBase.opacity,
          color: styleBase.backgroundColor,
        },
      });

      // effects
      self.collab.invoke({
        type: 'onNodeEffectChanged',
        data: { id, filter: { apply: 'vect', id: styleBase.filters.vect } },
      });

      // lines
      const styleNode = self.nodes.one(id);

      // console.log("node is ", id, node);
      styleNode.relationships.associations.forEach((a, ind) => {
        self.collab.invoke({
          type: 'onLineColorChanged',
          data: { id, color: styleBase.lineColor },
        });
        self.collab.invoke({
          type: 'onLinePropertiesChanged',
          data: {
            id,
            prop: 'lineOpacity',
            val: a.lineOpacity === 0 ? 0 : styleBase.lineOpacity,
            associationId: a.id,
            index: ind,
          },
        });
        self.collab.invoke({
          type: 'onLinePropertiesChanged',
          data: [
            {
              id,
              prop: 'lineEffect',
              val: styleBase.lineEffect,
              associationId: a.id,
              index: ind,
            },
            {
              id,
              prop: 'lineWidth',
              val: styleBase.lineWidth,
              associationId: a.id,
              index: ind,
            },
            {
              id,
              prop: 'lineType',
              val: styleBase.lineType,
              associationId: a.id,
              index: ind,
            },
            {
              id,
              prop: 'lineCurveType',
              val: styleBase.lineCurveType,
              associationId: a.id,
              index: ind,
            },
            {
              id,
              prop: 'lineCurviness',
              val: styleBase.lineCurviness,
              associationId: a.id,
              index: ind,
            },
          ],
        });
      });
    }

    self.nodes.allNodes.forEach((nd) => {
      if (self.options.mindMapMode || syncWithTheme) {
        const children = self.findChildren([nd.options.id]);
        totChildren.push(children);
      } else {
        if (!currentNodesByColor[nd.options.backgroundColor]) {
          currentNodesByColor[nd.options.backgroundColor] = [];
        }
        currentNodesByColor[nd.options.backgroundColor].push(nd.options.id);
      }
    });

    if (self.options.mindMapMode || syncWithTheme) {
      totChildren.sort((a, b) => a.length - b.length);
      totChildren.forEach((t) => {
        t.forEach((n, ind) => {
          nodeStyle[n] = ind === 0 ? `parent` : `child_${ind}`;
        });
      });
    } else {
      const colorsByUsage = Object.keys(currentNodesByColor).sort(
        (a, b) => currentNodesByColor[b].length - currentNodesByColor[a].length
      );
      let styleIndex = -1;
      colorsByUsage.forEach((c, index) => {
        if (Object.keys(theme.styles).length < index) {
          styleIndex = -1;
        }
        styleIndex += 1;
        currentNodesByColor[c].forEach((id) => {
          nodeStyle[id] = styleIndex === 0 ? `parent` : `child_${styleIndex}`;
        });
      });
    }

    Object.keys(nodeStyle).forEach((id) => {
      applyStyle(id);
    });
  }
}
