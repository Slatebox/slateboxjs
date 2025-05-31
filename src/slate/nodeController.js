/* eslint-disable new-cap */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import uniq from 'lodash.uniq';
import invoke from 'lodash.invoke';
import cloneDeep from 'lodash.clonedeep';
import getTransformedPath from '../helpers/getTransformedPath';
import refreshRelationships from '../helpers/refreshRelationships';
import getDepCoords from '../helpers/getDepCoords';
import { fabric } from 'fabric';

import utils from '../helpers/utils';
import editor from '../node/editor';
import relationships from '../node/relationships';
import rotate from '../node/rotate';
import menu from '../node/menu';
import connectors from '../node/connectors';

import resize from '../node/resize';
import images from '../node/images';
import shapes from '../node/shapes';
import customShapes from '../node/customShapes';
import colorPicker from '../node/colorPicker';
import context from '../node/context';
import lineOptions from '../node/lineOptions';
import gridLines from '../node/gridLines';
import links from '../node/links';

export default class nodeController {
  constructor(slate) {
    this.slate = slate;
    this.ensureBe = null;
    this.allNodes = [];
  }

  _refreshBe() {
    const self = this;
    window.clearTimeout(self.ensureBe);
    self.ensureBe = window.setTimeout(() => {
      self.slate.birdsEye?.refresh(false);
    }, 10);
  }

  _getParentChild(obj) {
    let _parent;
    let _child;
    this.allNodes.forEach((node) => {
      if (node.options.id === obj.parent) {
        _parent = node;
      } else if (node.options.id === obj.child) {
        _child = node;
      }
    });
    return { p: _parent, c: _child };
  }

  static remove(a, obj) {
    return a.filter((ax) => ax.options.id !== obj.options.id);
  }

  copyNodePositions(source, useMainCanvas = false) {
    const self = this;
    source.forEach((src) => {
      // if (src.options.id !== self.tempNodeId) {
      let cn = self.allNodes.find((n) => n.options.id === src.options.id);
      if (!cn) {
        self.add(src);
        cn = self.allNodes.find((n) => n.options.id === src.options.id);
      }
      cn.setPosition({ x: src.options.xPos, y: src.options.yPos });

      const opts = {};
      if (useMainCanvas) {
        const tempPath = self.slate.paper.path(cn.vect.attr('path')); // Meteor.currentSlate.paper
        opts.boundingClientRect = tempPath[0].getBoundingClientRect();
        tempPath.remove();
      }
      cn.rotate.applyImageRotation(opts);
      // }
    });
    invoke(
      self.allNodes.map((n) => n.relationships),
      'refresh'
    );
  }

  packageLayout() {
    const self = this;
    const knownGraphVizShapes = [
      'rect',
      'rectangle',
      'circle',
      'star',
      'trapezium',
      'triangle',
      'pentagon',
      'parallelogram',
      'octagon',
      'hexagon',
      'rarrow',
      'larrow',
    ];
    const eligibleNodes = self.slate.options
      .disableAutoLayoutOfManuallyPositionedNodes
      ? self.allNodes.filter((nn) => !nn.options.humanTouch)
      : self.allNodes;
    // package up all the unique associations and the width/height of every node
    let associations = eligibleNodes
      .map((nx) =>
        nx.relationships.associations.map((a) => {
          return {
            parentId: a.parent.options.id,
            childId: a.child.options.id,
            lineWidth: a.lineWidth,
            lineType: a.lineType,
            lineCurveType: a.lineCurveType,
            lineCurviness: a.lineCurviness,
            lineOpacity: a.lineOpacity,
            showParentArrow: a.showParentArrow,
            showChildArrow: a.showChildArrow,
          };
        })
      )
      .flat();

    const nodes = {};
    eligibleNodes.forEach((nx) => {
      if (!nodes[nx.options.id]) {
        nodes[nx.options.id] = {
          width: +nx.options.width,
          height: +nx.options.height,
          shape:
            knownGraphVizShapes.includes(nx.options.shapeHint) || 'polygon',
          color: nx.options.backgroundColor,
          textColor: nx.options.foregroundColor,
          text: nx.options.text,
          groupId: nx.options.groupId,
        };
      }
    });

    const subgraphs = {};
    eligibleNodes.forEach((nx) => {
      if (!subgraphs[nx.options.groupId]) {
        subgraphs[nx.options.groupId] = [];
      }
      subgraphs[nx.options.groupId].push(nx.options.id);
    });

    return {
      layoutType: self.slate.options.layoutType,
      associations,
      nodes,
      uniqueIds: Object.keys(nodes),
      subgraphs,
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
    */

    const orient = self.slate.getOrientation(null, true); // - always pin to no zoom (1)
    const allMoves = [];
    self.allNodes.forEach((n, i) => {
      if (layout.exportNodes?.[n.options.id]) {
        let { x, y } = layout.exportNodes[n.options.id];
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
          y: orient.top - y - n.options.yPos + orient.height,
        });
      }
    });
    let batchSize = 6;
    if (self.allNodes.length > 15) {
      batchSize = 12;
    }
    if (layout.allAtOnce || self.slate.nodes.allNodes.length > 12) {
      batchSize = 1;
    }
    const batches = utils.chunk(
      cloneDeep(allMoves),
      Math.ceil(allMoves.length / batchSize)
    );

    // console.log(
    //   'received layout2',
    //   batchSize,
    //   allMoves.length,
    //   self.allNodes.length,
    //   batches.length
    // )

    const sendMove = (batch) => {
      let dur = 300;
      if (layout.allAtOnce) {
        dur = 0;
      }
      const pkg = self.slate.nodes.nodeMovePackage({
        dur,
        moves: batch,
      });
      self.slate.collab?.exe({
        type: 'onNodesMove',
        data: pkg,
      });
      if (batches.length > 0) {
        setTimeout(() => {
          sendMove(batches.pop());
        }, 250);
      } else {
        if (layout.skipCenter) {
          self.slate.controller.centerOnNodes({ dur: 500 });
        } else {
          self.slate.controller.scaleToFitAndCenter();
        }
        // finally invoke toFront for all nodes
        self.slate.nodes.allNodes.forEach((n) => n.toBack());
        cb && cb();
      }
    };
    // kick it off
    sendMove(batches.pop());
  }

  getStickies(blnEmpty) {
    // stickies
    const stickies = slate.nodes.allNodes
      .filter((n) =>
        n?.options?.filters?.vect === 'postItNote' &&
        n?.options?.disableDrag === false &&
        n?.options?.text?.length > blnEmpty
          ? 10000
          : 0
      )
      .map((n) => ({
        xPos: n.options.xPos,
        yPos: n.options.yPos,
        width: n.options.width,
        height: n.options.height,
        id: n.options.id,
      }));
  }

  getProjectNameNode() {
    return this.slate.nodes.allNodes.find((n) =>
      n.options.text.match(/project name/gi)
    );
  }

  parseTemplateIntoCategories() {
    const categories = slate.nodes.allNodes
      .filter((n) => n.options.isCategory && n.options.categoryName?.length)
      .map((nx) => ({
        xPos: nx.options.xPos,
        yPos: nx.options.yPos,
        width: nx.options.width,
        height: nx.options.height,
        categoryName: nx.options.categoryName,
      }));

    // console.log(
    //   'rectnagles, categories',
    //   slate?.nodes?.allNodes?.length,
    //   rectangles,
    //   categories
    // )

    const matched = {};

    categories.forEach((categ) => {
      if (!matched[categ.categoryName]) {
        matched[categ.categoryName] = {
          top: categ.yPos,
          left: categ.xPos,
          bottom: categ.yPos + categ.height,
          right: categ.xPos + categ.width,
        };
      }
    });

    return matched;
  }

  addRange(_nodes, cb) {
    const self = this;
    _nodes.forEach((node) => {
      self.add(node);
    });
    cb?.();
    return self;
  }

  removeRange(_nodes) {
    const self = this;
    _nodes.forEach((node) => {
      self.allNodes = nodeController.remove(self.allNodes, node);
    });
    return self;
  }

  add(nodes, useMainCanvas, cb) {
    const self = this;
    if (!Array.isArray(nodes)) {
      nodes = [nodes];
    }
    nodes.forEach((node) => {
      node.slate = self.slate; // parent
      self.allNodes.push(node);
      self.addToCanvas(node, useMainCanvas);
    });
    cb?.();
  }

  remove(nodes) {
    const self = this;
    if (!Array.isArray(nodes)) {
      nodes = [nodes];
    }
    nodes.forEach((node) => {
      self.allNodes = nodeController.remove(self.allNodes, node);
      node.slate = null;
      self.removeFromCanvas(node);
    });
  }

  nodeMovePackage(opts = {}) {
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
      const _did = `copy_${utils.guid()}`;
      divCopy.setAttribute('id', _did);
      divCopy.setAttribute('style', `width:1px;height:1px;display:none;`);
      document.body.appendChild(divCopy);
      _use = this.slate.copy({ container: _did, moves: opts.moves });
    }

    const nds = opts?.nodes || _use.nodes.allNodes;
    const _ret = {
      dur: opts ? opts.dur : 300,
      easing: opts ? opts.easing : '>',
      textPositions: (() =>
        nds.map((node) => ({
          id: node.options.id,
          textPosition: {
            x: node.text.attrs.x,
            y: node.text.attrs.y,
            transform: node.getTransformString(),
          },
        })))(),
      nodeOptions: nds.map((node) => {
        return {
          id: node.options.id,
          vectorPath: node.options.vectorPath,
          xPos: node.options.xPos,
          yPos: node.options.yPos,
        };
      }),
      associations: (() => {
        const assoc = [];
        if (opts.relationships && opts.nodes) {
          opts.relationships.forEach((a) => {
            assoc.push({
              parentId: a.parent.options.id,
              childId: a.child.options.id,
              linePath: a.line.attr('path').toString(),
              id: a.line.id,
            });
          });
        } else {
          _use.nodes.allNodes.forEach((node) => {
            node.relationships.associations.forEach((a) => {
              assoc.push({
                parentId: a.parent.options.id,
                childId: a.child.options.id,
                linePath: a.line.attr('path').toString(),
                id: a.line.id,
              });
            });
          });
        }
        return uniq(assoc, (a) => a.id);
      })(),
    };

    if (divCopy) {
      document.body.removeChild(divCopy);
    }

    return _ret;
  }

  moveNodes(pkg, options = {}) {
    this.closeAllLineOptions();
    this.closeAllMenus();
    // _node.hideOwnMenus();
    const allAssoc = [];
    this.allNodes.forEach((node) => {
      node.relationships.associations.forEach((a) => {
        allAssoc.push(a);
      });
    });
    const uniqAssoc = uniq(allAssoc, (a) => a.id);

    const p = pkg.data || pkg;
    const d = p.dur || 300;
    const e = p.easing || '>';

    const { associations, nodeOptions, textPositions } = p;

    let cntr = 0;
    function _potentiallyFinalize(isAssoc) {
      cntr += 1;
      if (
        associations.length === nodeOptions.length &&
        cntr === nodeOptions.length &&
        options.cb
      ) {
        options.cb();
        delete options.cb;
      }
    }

    nodeOptions.forEach((opts) => {
      const nodeObject = this.allNodes.find(
        (node) => node.options.id === opts.id
      );
      if (nodeObject) {
        Object.assign(nodeObject.options, opts);

        const dps = getDepCoords(
          { x: opts.xPos, y: opts.yPos },
          nodeObject.options
        );
        const { lx, ty } = dps;

        if (nodeObject.options.rotate.rotationAngle) {
          // special handling for rotated nodes
          nodeObject.text.hide();
          if (nodeObject.options.link?.show) {
            nodeObject.link.hide();
          }
          setTimeout(
            () => {
              nodeObject.text.attr(
                nodeObject.textCoords({
                  x: nodeObject.options.xPos,
                  y: nodeObject.options.yPos,
                })
              );
              const transformString = nodeObject.getTransformString();
              nodeObject.text.transform(transformString);
              nodeObject.text.show();
              nodeObject.link.attr({ x: lx, y: ty });
              if (nodeObject.options.link?.show) {
                nodeObject.link.show();
              }
            },
            options.animate ? d : 0
          );
        } else {
          const currentTextPosition = textPositions.find(
            (tp) => tp.id === opts.id
          );
          if (options.animate) {
            nodeObject.text.animate(currentTextPosition.textPosition, d, e);
            nodeObject.link.animate({ x: lx, y: ty }, d, e);
          } else {
            nodeObject.text.attr(currentTextPosition.textPosition);
            nodeObject.link.attr({ x: lx, y: ty });
          }
        }

        if (this.slate.options.debugMode && !this.slate.options.isbirdsEye) {
          nodeObject.debugPosition();
        }

        if (options.animate) {
          if (nodeObject) {
            nodeObject.vect.animate(
              {
                path: opts.vectorPath,
                transform: nodeObject.getTransformString(),
              },
              d,
              e,
              () => {
                nodeObject.vect.attr({ path: opts.vectorPath });
                nodeObject.images.imageSizeCorrection();
                _potentiallyFinalize();
              }
            );
          }
        } else {
          if (nodeObject) nodeObject.vect.attr({ path: opts.vectorPath });
          let rotationOptions = {};
          if (options.useMainCanvas) {
            const tempPath = this.slate.paper.path(
              nodeObject.vect.attr('path')
            ); // Meteor.currentSlate.paper.
            rotationOptions = {
              boundingClientRect: tempPath[0].getBoundingClientRect(),
            };
            tempPath.remove();
          }
          nodeObject.rotate.applyImageRotation(rotationOptions);
          nodeObject.images.imageSizeCorrection();
          _potentiallyFinalize();
        }
      }
    });

    // this is important only when collaboration is active
    const ensureRefreshed = () => {
      const currentCollaborators = this.slate.collab.currentCollaborators();
      if (currentCollaborators.length > 1) {
        nodeOptions.forEach((opts) => {
          const nodeObject = this.allNodes.find(
            (node) => node.options.id === opts.id
          );
          nodeObject.relationships.refreshOwnRelationships();
        });
      }
    };

    associations.forEach((assoc, aCnt) => {
      const a = uniqAssoc.find(
        (ax) =>
          ax.parent.options.id === assoc.parentId &&
          ax.child.options.id === assoc.childId
      );
      if (a) {
        if (options.animate) {
          a.line.animate({ path: assoc.linePath }, d, e, () => {
            a.line.attr({ path: assoc.linePath });
            if (aCnt + 1 === associations.length) {
              ensureRefreshed();
            }
          });
        } else {
          a.line.attr({ path: assoc.linePath });
          if (aCnt + 1 === associations.length) {
            ensureRefreshed();
          }
        }
      }
    });
    this.slate.birdsEye?.refresh(true);
  }

  getRelevantAssociationsWith(nodes) {
    const _relationshipsToTranslate = [];
    const _relationshipsToRefresh = [];
    nodes.forEach((node) => {
      const otherSelectedNodes = nodes.filter(
        (n) => n.options.id !== node.options.id
      );
      node.relationships.associations.forEach((assoc) => {
        if (
          otherSelectedNodes
            .map((n) => n.relationships.associations)
            .some((associations) => associations.find((a) => a.id === assoc.id))
        ) {
          if (!_relationshipsToTranslate.some((r) => r.id === assoc.id)) {
            _relationshipsToTranslate.push(assoc); // connections which move with both nodes
          }
        } else if (!_relationshipsToRefresh.some((r) => r.id === assoc.id)) {
          _relationshipsToRefresh.push(assoc); // connections which move on one end only
        }
      });
    });

    return {
      relationshipsToRefresh: _relationshipsToRefresh,
      relationshipsToTranslate: _relationshipsToTranslate,
    };
  }

  translateRelationships(relationships, { dx, dy }) {
    relationships.forEach((r) => {
      r.line.transform(`T${dx}, ${dy}`);
    });
  }

  saveRelationships(relationships, { dx, dy }) {
    relationships.forEach((r) => {
      const newLinePath = utils
        ._transformPath(r.line.attr('path').toString(), `T${dx},${dy}`)
        .toString();
      r.line.attr({ path: newLinePath });
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
    this.allNodes.forEach((node) => {
      node.relationships.refreshOwnRelationships();
    });
  }

  addRelationship(add) {
    const pc = this._getParentChild(add);
    const _parent = pc.p;
    const _child = pc.c;
    if (_parent && _child) {
      switch (add.type) {
        case 'association':
          _parent.relationships.addAssociation(_child, add.options);
          break;
        default:
          break;
      }
    }
  }

  closeAllLineOptions(exception) {
    this.allNodes.forEach((node) => {
      node.relationships.associations.forEach((association) => {
        if (association.id !== exception) {
          node.lineOptions?.hide(association.id);
        }
      });
    });
  }

  closeAllMenus({ exception, nodes } = {}) {
    (nodes || this.allNodes).forEach((node) => {
      if (node.options.id !== exception) {
        node.menu.hide();
        node.lineOptions?.hideAll();
        node.resize?.hide();
        node.rotate?.hide();
      }
    });
  }

  closeAllConnectors() {
    this.allNodes.forEach((node) => {
      node.connectors?.remove();
      node.resize?.hide();
      node.rotate?.hide();
    });
  }

  one(id) {
    let cn = null;
    this.allNodes.forEach((node) => {
      if (node.options.id === id) {
        cn = node;
      }
    });
    return cn;
  }

  removeFromCanvas(_node) {
    ['vect', 'text', 'link'].forEach((tt) => {
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
      'fill-opacity': _node.options.opacity != null ? _node.options.opacity : 1,
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
      `s${(_width / 150) * percent}, ${
        (_height / 100) * percent
      }, ${_x}, ${_y}`,
    ];

    _node.options.isEllipse =
      _node.options.isEllipse || _node.options.vectorPath === 'ellipse';
    let potentiallyResize = false;
    switch (_node.options.vectorPath) {
      case 'ellipse':
        _node.options.vectorPath = getTransformedPath(
          'M150,50 a75,50 0 1,1 0,-1 z',
          _transforms
        );
        break;
      case 'rectangle':
        _node.options.vectorPath = getTransformedPath(
          'M1,1 h150 v100 h-150 v-100 z',
          _transforms
        );
        break;
      case 'roundedrectangle':
        _node.options.vectorPath = getTransformedPath(
          'M1,1 h130 a10,10 0 0 1 10,10 v80 a10,10 0 0 1 -10,10 h-130 a10,10 0 0 1 -10,-10 v-80 a10,10 0 0 1 10,-10 z',
          _transforms
        );
        break;
      default:
        potentiallyResize = !!_node.options.defaultShaped;
        // _node.options.vectorPath = getTransformedPath(
        //   _node.options.vectorPath,
        //   _transforms
        // )
        break;
    }

    if (_node.options.vectorPath === 'M2,12 L22,12') {
      vectOpt['stroke-dasharray'] = '2px';
    }

    // Create FabricJS object instead of Raphael path
    vect = this.createFabricObjectFromNode(_node, vectOpt);
    
    if (vect) {
      // Add to canvas
      this.slate.paper.add(vect);
      
      // Set cursor style through FabricJS
      vect.set('hoverCursor', 'pointer');
      vect.set('moveCursor', 'pointer');

      // Store node ID and disable flag for reference
      const relRider = _node.options.disableDrag ? 'nodrag_' : '';
      vect.set('rel', `${relRider}${_node.options.id}`);
      vect.data({ id: _node.options.id });
      _node.vect = vect;
    }

    // update xPos, yPos in case it is different than actual
    const bbox = vect.getBBox();
    _node.options.xPos = bbox.x;
    _node.options.yPos = bbox.y;

    if (!_node.options.origVectWidth && _node.options.shapeHint === 'custom') {
      _node.options.origVectWidth = bbox.width;
    }

    if (!_node.options.origVectHeight && _node.options.shapeHint === 'custom') {
      _node.options.origVectHeight = bbox.height;
    }

    const lc = _node.linkCoords();

    // Create link using FabricJS - simplified link arrow for now
    // TODO: Implement proper linkArrow shape in FabricJS
    link = new fabric.Triangle({
      left: lc.x,
      top: lc.y,
      width: 10,
      height: 10,
      fill: '#666',
      scaleX: 0.8,
      scaleY: 0.8,
      angle: 180,
      selectable: false,
      hoverCursor: 'pointer',
      moveCursor: 'pointer'
    });
    
    // Add link to canvas
    this.slate.paper.add(link);
    
    // Add Raphael-like methods to link
    link.attr = function(attrs) {
      if (attrs) {
        Object.keys(attrs).forEach(key => {
          switch(key) {
            case 'cursor':
              this.set('hoverCursor', attrs[key]);
              this.set('moveCursor', attrs[key]);
              break;
            case 'x':
              this.set('left', attrs[key]);
              break;
            case 'y':
              this.set('top', attrs[key]);
              break;
            default:
              this.set(key, attrs[key]);
              break;
          }
        });
        this.canvas?.requestRenderAll();
        return this;
      } else {
        return {
          x: this.left,
          y: this.top,
          cursor: this.hoverCursor
        };
      }
    };
    
    link.animate = function(attrs, duration, easing, callback) {
      Object.keys(attrs).forEach(key => {
        let targetKey = key;
        if (key === 'x') targetKey = 'left';
        if (key === 'y') targetKey = 'top';
        
        this.animate(targetKey, attrs[key], {
          duration: duration,
          onChange: () => this.canvas?.requestRenderAll(),
          onComplete: callback,
          easing: fabric.util.ease.easeOutQuad
        });
      });
    };
    
    link.transform = function(transformString) {
      // Basic transform parsing for compatibility
      // TODO: Implement full Raphael transform string parsing
      return this;
    };
    
    link.hide = function() {
      this.set('visible', false);
      this.canvas?.requestRenderAll();
    };
    
    link.show = function() {
      this.set('visible', true);
      this.canvas?.requestRenderAll();
    };
    
    link.toFront = function() {
      if (this.canvas) {
        this.canvas.bringToFront(this);
      }
    };
    
    link.toBack = function() {
      if (this.canvas) {
        this.canvas.sendToBack(this);
      }
    };
    
    link.remove = function() {
      if (this.canvas) {
        this.canvas.remove(this);
      }
    };

    // create and set editor
    _node.editor = new editor(this.slate, _node);
    _node.editor.set(); // creates and sets the text
    
    // Apply transform to text if needed
    if (_node.text) {
      _node.text.transform(_node.getTransformString());
    }

    // set link
    _node.link = link;

    // FabricJS doesn't use sets like Raphael, so we'll skip the 'both' set
    // _node.both is used in some places, so we'll create a simple array for compatibility
    _node.both = [_node.vect, _node.text];
    _node.both.push = function(obj) {
      Array.prototype.push.call(this, obj);
    };

    // relationships
    _node.relationships = new relationships(this.slate, _node);
    _node.relationships.wireDragEvents();

    // rotate
    _node.rotate = new rotate(this.slate, _node);

    // connectors
    _node.connectors = new connectors(this.slate, _node);

    // menu
    _node.menu = new menu(this.slate, _node);

    // resizer
    _node.resize = new resize(this.slate, _node);

    // images
    _node.images = new images(this.slate, _node);

    // context
    _node.context = new context(this.slate, _node);

    // lineOptions
    _node.lineOptions = new lineOptions(this.slate, _node);

    // shapes
    _node.shapes = new shapes(this.slate, _node);

    // customShapes
    _node.customShapes = new customShapes(this.slate, _node);

    // colorPicker
    _node.colorPicker = new colorPicker(this.slate, _node);

    // gridLines
    _node.gridLines = new gridLines(this.slate, _node);

    //links
    _node.links = new links(this.slate, _node);

    if (_node.options.image && !_node.options.imageOrigHeight) {
      _node.options.imageOrigHeight = _node.options.height;
    }

    if (_node.options.image && !_node.options.imageOrigWidth) {
      _node.options.imageOrigWidth = _node.options.width;
    }

    if (_node.options.image && _node.options.image !== '') {
      _node.images.set(
        _node.options.image,
        _node.options.imageOrigWidth,
        _node.options.imageOrigHeight,
        useMainCanvas
      );
    }

    if (!_node.options.link || !_node.options.link.show) {
      _node.link.hide();
    }

    if (_node.options.rotate.rotationAngle) {
      requestAnimationFrame(() => {
        _node.rotate.set();
        // requestAnimationFrame(() => {
        //   const qpkg = {
        //     dur: 0,
        //     moves: [
        //       {
        //         id: _node.options.id,
        //         x: 1,
        //         y: 1,
        //       },
        //     ],
        //   };
        //   const pkg = self.slate.nodes.nodeMovePackage(qpkg);
        //   _node.slate.nodes.moveNodes(pkg, {
        //     animate: false,
        //     cb: () => {
        //       console.log('moved to adjust');
        //     },
        //   });
        // });

        // console.log('rotating again', _node.options.rotate.rotationAngle);
        requestAnimationFrame(() => {
          utils.transformPath(_node, `T1,1`);
        });
        // requestAnimationFrame(() => {
        //   // ensures set is correct
        //   console.log('rotating again', _node.options.rotate.rotationAngle);
        //   _node.rotate.set();
        // });
      });
    } else if (potentiallyResize) {
      _node.resize.set(_width, _height);
    }

    let filtersApplied = false;
    // apply any node filters to vect and/or text
    if (_node.options.animations.vect) {
      _node.applyFilters({
        apply: 'vect',
        id: _node.options.animations.vect,
        isAnimation: true,
      });
      filtersApplied = true;
    }
    if (_node.options.animations.text) {
      _node.applyFilters({
        apply: 'text',
        id: _node.options.animations.text,
        isAnimation: true,
      });
      filtersApplied = true;
    }
    if (!filtersApplied) {
      _node.applyFilters();
    }
    _node.toFront();

    this._refreshBe();

    return vect;
  }

  /**
   * Helper method to create FabricJS objects from node options
   */
  createFabricObjectFromNode(_node, vectOpt) {
    const _x = _node.options.xPos;
    const _y = _node.options.yPos;
    const _width = _node.options.width;
    const _height = _node.options.height;
    
    let fabricObject = null;
    
    // Handle basic shapes first
    switch (_node.options.vectorPath) {
      case 'ellipse': {
        fabricObject = new fabric.Ellipse({
          left: _x,
          top: _y,
          rx: _width / 2,
          ry: _height / 2,
          fill: vectOpt.fill,
          opacity: vectOpt['fill-opacity'],
          stroke: vectOpt.stroke,
          strokeWidth: vectOpt['stroke-width'] || 0,
          originX: 'left',
          originY: 'top'
        });
        break;
      }
      case 'rectangle': {
        fabricObject = new fabric.Rect({
          left: _x,
          top: _y,
          width: _width,
          height: _height,
          fill: vectOpt.fill,
          opacity: vectOpt['fill-opacity'],
          stroke: vectOpt.stroke,
          strokeWidth: vectOpt['stroke-width'] || 0,
          originX: 'left',
          originY: 'top'
        });
        break;
      }
      case 'roundedrectangle': {
        fabricObject = new fabric.Rect({
          left: _x,
          top: _y,
          width: _width,
          height: _height,
          rx: 10,
          ry: 10,
          fill: vectOpt.fill,
          opacity: vectOpt['fill-opacity'],
          stroke: vectOpt.stroke,
          strokeWidth: vectOpt['stroke-width'] || 0,
          originX: 'left',
          originY: 'top'
        });
        break;
      }
      default: {
        // Handle custom paths
        if (_node.options.vectorPath && _node.options.vectorPath.includes('M')) {
          fabricObject = new fabric.Path(_node.options.vectorPath, {
            left: _x,
            top: _y,
            fill: vectOpt.fill,
            opacity: vectOpt['fill-opacity'],
            stroke: vectOpt.stroke,
            strokeWidth: vectOpt['stroke-width'] || 0,
            originX: 'left',
            originY: 'top'
          });
        } else {
          // Fallback to rectangle for unknown shapes
          fabricObject = new fabric.Rect({
            left: _x,
            top: _y,
            width: _width,
            height: _height,
            fill: vectOpt.fill,
            opacity: vectOpt['fill-opacity'],
            stroke: vectOpt.stroke,
            strokeWidth: vectOpt['stroke-width'] || 0,
            originX: 'left',
            originY: 'top'
          });
        }
        break;
      }
    }
    
    if (fabricObject) {
      // Store node ID for reference
      fabricObject.set('nodeId', _node.options.id);
      fabricObject.set('selectable', false);
      fabricObject.set('hoverCursor', 'pointer');
      fabricObject.set('moveCursor', 'pointer');
      
      // Add Raphael-like methods for compatibility
      fabricObject.attr = function(attrs) {
        if (attrs) {
          Object.keys(attrs).forEach(key => {
            switch(key) {
              case 'fill':
                this.set('fill', attrs[key]);
                break;
              case 'stroke':
                this.set('stroke', attrs[key]);
                break;
              case 'stroke-width':
                this.set('strokeWidth', attrs[key]);
                break;
              case 'path':
                if (this.type === 'path') {
                  this.set('path', attrs[key]);
                }
                break;
              default:
                this.set(key, attrs[key]);
                break;
            }
          });
          this.canvas?.requestRenderAll();
          return this;
        } else {
          // Return current attributes in Raphael format
          return {
            fill: this.fill,
            stroke: this.stroke,
            'stroke-width': this.strokeWidth,
            x: this.left,
            y: this.top,
            path: this.path || this.getPath?.()
          };
        }
      };
      
      fabricObject.getBBox = function() {
        const bounds = this.getBoundingRect();
        return {
          x: bounds.left,
          y: bounds.top,
          x2: bounds.left + bounds.width,
          y2: bounds.top + bounds.height,
          width: bounds.width,
          height: bounds.height,
          cx: bounds.left + bounds.width / 2,
          cy: bounds.top + bounds.height / 2
        };
      };
      
      fabricObject.remove = function() {
        if (this.canvas) {
          this.canvas.remove(this);
        }
      };
      
      fabricObject.hide = function() {
        this.set('visible', false);
        this.canvas?.requestRenderAll();
      };
      
      fabricObject.show = function() {
        this.set('visible', true);
        this.canvas?.requestRenderAll();
      };
      
      fabricObject.toFront = function() {
        if (this.canvas) {
          this.canvas.bringToFront(this);
        }
      };
      
      fabricObject.toBack = function() {
        if (this.canvas) {
          this.canvas.sendToBack(this);
        }
      };
      
      fabricObject.animate = function(attrs, duration, easing, callback) {
        // Basic animation implementation
        Object.keys(attrs).forEach(key => {
          switch(key) {
            case 'path':
              // Path animation is complex, skip for now
              break;
            default:
              this.animate(key, attrs[key], {
                duration: duration,
                onChange: () => this.canvas?.requestRenderAll(),
                onComplete: callback,
                easing: fabric.util.ease.easeOutQuad
              });
              break;
          }
        });
      };
      
      fabricObject.transform = function(transformString) {
        // Store transform for later application
        this._pendingTransform = transformString;
        return this;
      };
      
      // Add data method for storing arbitrary data
      fabricObject.data = function(key, value) {
        if (arguments.length === 0) {
          return this._nodeData || {};
        } else if (arguments.length === 1 && typeof key === 'object') {
          this._nodeData = { ...this._nodeData, ...key };
        } else if (arguments.length === 1) {
          return this._nodeData?.[key];
        } else {
          this._nodeData = this._nodeData || {};
          this._nodeData[key] = value;
        }
        return this;
      };
    }
    
    return fabricObject;
  }
}
