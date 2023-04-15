/* eslint-disable new-cap */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import uniq from 'lodash.uniq'
import invoke from 'lodash.invoke'
import cloneDeep from 'lodash.clonedeep'
import getTransformedPath from '../helpers/getTransformedPath'
import getDepCoords from '../helpers/getDepCoords'

import utils from '../helpers/utils'
import editor from '../node/editor'
import relationships from '../node/relationships'
import rotate from '../node/rotate'
import menu from '../node/menu'
import connectors from '../node/connectors'

import resize from '../node/resize'
import images from '../node/images'
import shapes from '../node/shapes'
import customShapes from '../node/customShapes'
import colorPicker from '../node/colorPicker'
import context from '../node/context'
import lineOptions from '../node/lineOptions'
import gridLines from '../node/gridLines'
import links from '../node/links'

export default class nodeController {
  constructor(slate) {
    this.slate = slate
    this.ensureBe = null
    this.allNodes = []
  }

  _refreshBe() {
    const self = this
    window.clearTimeout(self.ensureBe)
    self.ensureBe = window.setTimeout(() => {
      self.slate.birdsEye?.refresh(false)
    }, 10)
  }

  _getParentChild(obj) {
    let _parent
    let _child
    this.allNodes.forEach((node) => {
      if (node.options.id === obj.parent) {
        _parent = node
      } else if (node.options.id === obj.child) {
        _child = node
      }
    })
    return { p: _parent, c: _child }
  }

  static remove(a, obj) {
    return a.filter((ax) => ax.options.id !== obj.options.id)
  }

  copyNodePositions(source, useMainCanvas = false) {
    const self = this
    source.forEach((src) => {
      // if (src.options.id !== self.tempNodeId) {
      let cn = self.allNodes.find((n) => n.options.id === src.options.id)
      if (!cn) {
        self.add(src)
        cn = self.allNodes.find((n) => n.options.id === src.options.id)
      }
      cn.setPosition({ x: src.options.xPos, y: src.options.yPos })

      const opts = {}
      if (useMainCanvas) {
        const tempPath = self.slate.paper.path(cn.vect.attr('path')) // Meteor.currentSlate.paper
        opts.boundingClientRect = tempPath[0].getBoundingClientRect()
        tempPath.remove()
      }
      cn.rotate.applyImageRotation(opts)
      // }
    })
    invoke(
      self.allNodes.map((n) => n.relationships),
      'refresh'
    )
  }

  packageLayout() {
    const self = this
    // package up all the unique associations and the width/height of every node
    let associations = self.allNodes
      .map((nx) =>
        nx.relationships.associations.map((a) => {
          return {
            parentId: a.parent.options.id,
            childId: a.child.options.id,
            lineWidth: a.lineWidth,
            lineOpacity: a.lineOpacity,
            showParentArrow: a.showParentArrow,
            showChildArrow: a.showChildArrow,
          }
        })
      )
      .flat()

    const nodes = {}
    self.allNodes.forEach((nx) => {
      if (!nodes[nx.options.id]) {
        nodes[nx.options.id] = {
          width: nx.options.width,
          height: nx.options.height,
          shape: nx.options.shapeHint || 'rectangle',
          color: nx.options.backgroundColor,
          textColor: nx.options.foregroundColor,
          text: nx.options.text,
          groupId: nx.options.groupId,
        }
      }
    })

    const subgraphs = {}
    self.allNodes.forEach((nx) => {
      if (!subgraphs[nx.options.groupId]) {
        subgraphs[nx.options.groupId] = []
      }
      subgraphs[nx.options.groupId].push(nx.options.id)
    })

    return { associations, nodes, uniqueIds: Object.keys(nodes), subgraphs }
  }

  applyLayout(layout, cb) {
    const self = this
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

    const orient = self.slate.getOrientation(null, true) // - always pin to no zoom (1)
    const allMoves = []
    self.allNodes.forEach((n, i) => {
      if (layout.exportNodes[n.options.id]) {
        let { x, y } = layout.exportNodes[n.options.id]
        x = parseFloat(x)
        y = parseFloat(y)
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
        })
      }
    })
    let batchSize = 6
    if (self.allNodes.length > 15) {
      batchSize = 12
    }
    if (layout.allAtOnce || self.slate.nodes.allNodes.length > 25) {
      batchSize = 1
    }
    const batches = utils.chunk(
      cloneDeep(allMoves),
      Math.ceil(allMoves.length / batchSize)
    )

    // console.log(
    //   'received layout2',
    //   batchSize,
    //   allMoves.length,
    //   self.allNodes.length,
    //   batches.length
    // )

    const sendMove = (batch) => {
      let dur = 300
      if (layout.allAtOnce) {
        dur = 0
      }
      const pkg = self.slate.nodes.nodeMovePackage({
        dur,
        moves: batch,
      })
      self.slate.collab?.exe({
        type: 'onNodesMove',
        data: pkg,
      })
      if (batches.length > 0) {
        setTimeout(() => {
          sendMove(batches.pop())
        }, 250)
      } else {
        //if (layout.skipCenter) {
        self.slate.controller.centerOnNodes({ dur: 500 })
        // } else {
        //   self.slate.controller.scaleToFitAndCenter()
        // }
        // finally invoke toFront for all nodes
        self.slate.nodes.allNodes.forEach((n) => n.toBack())
        cb && cb()
      }
    }
    // kick it off
    sendMove(batches.pop())
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
      }))
  }

  getProjectNameNode() {
    return this.slate.nodes.allNodes.find((n) =>
      n.options.text.match(/project name/gi)
    )
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
      }))

    // console.log(
    //   'rectnagles, categories',
    //   slate?.nodes?.allNodes?.length,
    //   rectangles,
    //   categories
    // )

    const matched = {}

    categories.forEach((categ) => {
      if (!matched[categ.categoryName]) {
        matched[categ.categoryName] = {
          top: categ.yPos,
          left: categ.xPos,
          bottom: categ.yPos + categ.height,
          right: categ.xPos + categ.width,
        }
      }
    })

    return matched
  }

  addRange(_nodes) {
    const self = this
    _nodes.forEach((node) => {
      self.add(node)
    })
    return self
  }

  removeRange(_nodes) {
    const self = this
    _nodes.forEach((node) => {
      self.allNodes = nodeController.remove(self.allNodes, node)
    })
    return self
  }

  add(nodes, useMainCanvas) {
    const self = this
    if (!Array.isArray(nodes)) {
      nodes = [nodes]
    }
    nodes.forEach((node) => {
      node.slate = self.slate // parent
      self.allNodes.push(node)
      self.addToCanvas(node, useMainCanvas)
    })
  }

  remove(nodes) {
    const self = this
    if (!Array.isArray(nodes)) {
      nodes = [nodes]
    }
    nodes.forEach((node) => {
      self.allNodes = nodeController.remove(self.allNodes, node)
      node.slate = null
      self.removeFromCanvas(node)
    })
  }

  nodeMovePackage(opts = {}) {
    // if exporting a move package with moves applied (e.g., you're
    // planning on manipulating the slate programmatically and this is
    // not an export bound for collaboration (at first)) -- then we need
    // to apply the final results to a copy of the slate because they are need
    // for the calculations below, and those calcs are mutable, so they
    // cannot be applied to the current slate.

    let _use = this.slate
    let divCopy = null
    if (opts && opts.moves) {
      divCopy = document.createElement('div')
      const _did = `copy_${utils.guid()}`
      divCopy.setAttribute('id', _did)
      divCopy.setAttribute('style', `width:1px;height:1px;display:none;`)
      document.body.appendChild(divCopy)
      _use = this.slate.copy({ container: _did, moves: opts.moves })
    }

    const nds = opts?.nodes || _use.nodes.allNodes
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
        }
      }),
      associations: (() => {
        const assoc = []
        if (opts.relationships && opts.nodes) {
          opts.relationships.forEach((a) => {
            assoc.push({
              parentId: a.parent.options.id,
              childId: a.child.options.id,
              linePath: a.line.attr('path').toString(),
              id: a.line.id,
            })
          })
        } else {
          _use.nodes.allNodes.forEach((node) => {
            node.relationships.associations.forEach((a) => {
              assoc.push({
                parentId: a.parent.options.id,
                childId: a.child.options.id,
                linePath: a.line.attr('path').toString(),
                id: a.line.id,
              })
            })
          })
        }
        return uniq(assoc, (a) => a.id)
      })(),
    }

    if (divCopy) {
      document.body.removeChild(divCopy)
    }

    return _ret
  }

  moveNodes(pkg, options = {}) {
    this.closeAllLineOptions()
    this.closeAllMenus()
    // _node.hideOwnMenus();
    const allAssoc = []
    this.allNodes.forEach((node) => {
      node.relationships.associations.forEach((a) => {
        allAssoc.push(a)
      })
    })
    const uniqAssoc = uniq(allAssoc, (a) => a.id)

    const p = pkg.data || pkg
    const d = p.dur || 300
    const e = p.easing || '>'

    const { associations, nodeOptions, textPositions } = p

    let cntr = 0
    function _potentiallyFinalize() {
      cntr += 1
      if (cntr === nodeOptions.length && options.cb) {
        options.cb()
        delete options.cb
      }
    }

    nodeOptions.forEach((opts) => {
      const nodeObject = this.allNodes.find(
        (node) => node.options.id === opts.id
      )
      if (nodeObject) {
        Object.assign(nodeObject.options, opts)

        const dps = getDepCoords(
          { x: opts.xPos, y: opts.yPos },
          nodeObject.options
        )
        const { lx, ty } = dps

        const currentTextPosition = textPositions.find(
          (tp) => tp.id === opts.id
        )
        if (options.animate) {
          nodeObject.text.animate(currentTextPosition.textPosition, d, e)
          nodeObject.link.animate({ x: lx, y: ty }, d, e)
        } else {
          nodeObject.text.attr(currentTextPosition.textPosition)
          nodeObject.link.attr({ x: lx, y: ty })
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
                nodeObject.vect.attr({ path: opts.vectorPath })
                nodeObject.images.imageSizeCorrection()
                _potentiallyFinalize()
              }
            )
          }
        } else {
          if (nodeObject) nodeObject.vect.attr({ path: opts.vectorPath })
          let rotationOptions = {}
          if (options.useMainCanvas) {
            const tempPath = this.slate.paper.path(nodeObject.vect.attr('path')) // Meteor.currentSlate.paper.
            rotationOptions = {
              boundingClientRect: tempPath[0].getBoundingClientRect(),
            }
            tempPath.remove()
          }
          nodeObject.rotate.applyImageRotation(rotationOptions)
          nodeObject.images.imageSizeCorrection()
          _potentiallyFinalize()
        }
      }
    })

    associations.forEach((assoc) => {
      const a = uniqAssoc.find(
        (ax) =>
          ax.parent.options.id === assoc.parentId &&
          ax.child.options.id === assoc.childId
      )
      if (options.animate) {
        if (a) {
          a.line.animate({ path: assoc.linePath }, d, e, () => {
            a.line.attr({ path: assoc.linePath })
            _potentiallyFinalize()
          })
        }
      } else {
        if (a) {
          a.line.attr({ path: assoc.linePath })
        }
        _potentiallyFinalize()
      }
    })
    this.slate.birdsEye?.refresh(true)
  }

  getRelevantAssociationsWith(nodes) {
    const _relationshipsToTranslate = []
    const _relationshipsToRefresh = []
    nodes.forEach((node) => {
      const otherSelectedNodes = nodes.filter(
        (n) => n.options.id !== node.options.id
      )
      node.relationships.associations.forEach((assoc) => {
        if (
          otherSelectedNodes
            .map((n) => n.relationships.associations)
            .some((associations) => associations.find((a) => a.id === assoc.id))
        ) {
          if (!_relationshipsToTranslate.some((r) => r.id === assoc.id)) {
            _relationshipsToTranslate.push(assoc) // connections which move with both nodes
          }
        } else if (!_relationshipsToRefresh.some((r) => r.id === assoc.id)) {
          _relationshipsToRefresh.push(assoc) // connections which move on one end only
        }
      })
    })

    return {
      relationshipsToRefresh: _relationshipsToRefresh,
      relationshipsToTranslate: _relationshipsToTranslate,
    }
  }

  translateRelationships(relationships, { dx, dy }) {
    relationships.forEach((r) => {
      r.line.transform(`T${dx}, ${dy}`)
    })
  }

  saveRelationships(relationships, { dx, dy }) {
    relationships.forEach((r) => {
      const newLinePath = utils
        ._transformPath(r.line.attr('path').toString(), `T${dx},${dy}`)
        .toString()
      r.line.attr({ path: newLinePath })
      r.line.transform('')
    })
  }

  removeRelationship(rm) {
    const pc = this._getParentChild(rm)
    const _parent = pc.p
    const _child = pc.c
    if (_parent && _child) {
      // _parent.relationships.removeChild(_child);
      // _child.relationships.removeParent(_parent);
      _parent.relationships.removeAssociation(_child)
      _child.relationships.removeAssociation(_parent)
    }
  }

  refreshAllRelationships() {
    this.allNodes.forEach((node) => {
      node.relationships.refreshOwnRelationships()
    })
  }

  addRelationship(add) {
    const pc = this._getParentChild(add)
    const _parent = pc.p
    const _child = pc.c
    if (_parent && _child) {
      switch (add.type) {
        case 'association':
          _parent.relationships.addAssociation(_child, add.options)
          break
        default:
          break
      }
    }
  }

  closeAllLineOptions(exception) {
    this.allNodes.forEach((node) => {
      node.relationships.associations.forEach((association) => {
        if (association.id !== exception) {
          node.lineOptions?.hide(association.id)
        }
      })
    })
  }

  closeAllMenus({ exception, nodes } = {}) {
    ;(nodes || this.allNodes).forEach((node) => {
      if (node.options.id !== exception) {
        node.menu.hide()
        node.lineOptions?.hideAll()
        node.resize?.hide()
        node.rotate?.hide()
      }
    })
  }

  closeAllConnectors() {
    this.allNodes.forEach((node) => {
      node.connectors?.remove()
      node.resize?.hide()
      node.rotate?.hide()
    })
  }

  one(id) {
    let cn = null
    this.allNodes.forEach((node) => {
      if (node.options.id === id) {
        cn = node
      }
    })
    return cn
  }

  removeFromCanvas(_node) {
    ;['vect', 'text', 'link'].forEach((tt) => {
      _node[tt].remove()
    })
    this._refreshBe()
  }

  addToCanvas(_node, useMainCanvas) {
    _node.slate = this.slate

    let vect = null
    let link = null
    const vectOpt = {
      fill: _node.options.backgroundColor || '#fff',
      'fill-opacity': _node.options.opacity != null ? _node.options.opacity : 1,
    }
    Object.assign(vectOpt, _node.applyBorder())
    const _x = _node.options.xPos
    const _y = _node.options.yPos
    const paperToUse = this.slate.paper
    const percent = 1

    const _width = _node.options.width
    const _height = _node.options.height

    const _transforms = [
      `T${_x * percent}, ${_y * percent}`,
      `s${(_width / 150) * percent}, ${
        (_height / 100) * percent
      }, ${_x}, ${_y}`,
    ]
    _node.options.isEllipse =
      _node.options.isEllipse || _node.options.vectorPath === 'ellipse'
    switch (_node.options.vectorPath) {
      case 'ellipse':
        _node.options.vectorPath = getTransformedPath(
          'M150,50 a75,50 0 1,1 0,-1 z',
          _transforms
        )
        break
      case 'rectangle':
        _node.options.vectorPath = getTransformedPath(
          'M1,1 h150 v100 h-150 v-100 z',
          _transforms
        )
        break
      case 'roundedrectangle':
        _node.options.vectorPath = getTransformedPath(
          'M1,1 h130 a10,10 0 0 1 10,10 v80 a10,10 0 0 1 -10,10 h-130 a10,10 0 0 1 -10,-10 v-80 a10,10 0 0 1 10,-10 z',
          _transforms
        )
        break
      default:
        // _node.options.vectorPath = getTransformedPath(
        //   _node.options.vectorPath,
        //   _transforms
        // )
        break
    }

    if (_node.options.vectorPath === 'M2,12 L22,12') {
      vectOpt['stroke-dasharray'] = '2px'
    }

    vect = paperToUse.path(_node.options.vectorPath).attr(vectOpt)
    vect.node.style.cursor = 'pointer'

    // need to set in case toback or tofront is called and the load order changes in the context plugin
    vect.node.setAttribute('rel', _node.options.id)
    vect.data({ id: _node.options.id })
    _node.vect = vect
    // _node.vect.ox = _x;
    // _node.vect.oy = _y;

    // get the text coords before the transform is applied
    // var tc = _node.textCoords();
    _node.vect.transform(_node.getTransformString())

    // update xPos, yPos in case it is different than actual
    const bbox = vect.getBBox()
    _node.options.xPos = bbox.x
    _node.options.yPos = bbox.y

    const lc = _node.linkCoords()

    // apply the text coords prior to transform
    // text = paperToUse.text(tc.x, tc.y, (_node.options.text || '')).attr({ "font-size": _node.options.fontSize + "pt", fill: _node.options.foregroundColor || "#000" });
    link = paperToUse
      .linkArrow()
      .transform(
        ['t', lc.x, ',', lc.y, 's', '.8', ',', '.8', 'r', '180'].join()
      )
      .attr({ cursor: 'pointer' })

    // create and set editor
    _node.editor = new editor(this.slate, _node)
    _node.editor.set() // creates and sets the text
    _node.text.transform(_node.getTransformString())

    // set link
    _node.link = link

    _node.both = new _node.slate.paper.set()
    _node.both.push(_node.vect)
    _node.both.push(_node.text)

    // relationships
    _node.relationships = new relationships(this.slate, _node)
    _node.relationships.wireDragEvents()

    // rotate
    _node.rotate = new rotate(this.slate, _node)

    // connectors
    _node.connectors = new connectors(this.slate, _node)

    // menu
    _node.menu = new menu(this.slate, _node)

    // resizer
    _node.resize = new resize(this.slate, _node)

    // images
    _node.images = new images(this.slate, _node)

    // context
    _node.context = new context(this.slate, _node)

    // lineOptions
    _node.lineOptions = new lineOptions(this.slate, _node)

    // shapes
    _node.shapes = new shapes(this.slate, _node)

    // customShapes
    _node.customShapes = new customShapes(this.slate, _node)

    // colorPicker
    _node.colorPicker = new colorPicker(this.slate, _node)

    // gridLines
    _node.gridLines = new gridLines(this.slate, _node)

    //links
    _node.links = new links(this.slate, _node)

    if (_node.options.image && !_node.options.imageOrigHeight) {
      _node.options.imageOrigHeight = _node.options.height
    }

    if (_node.options.image && !_node.options.imageOrigWidth) {
      _node.options.imageOrigWidth = _node.options.width
    }

    if (_node.options.image && _node.options.image !== '') {
      _node.images.set(
        _node.options.image,
        _node.options.imageOrigWidth,
        _node.options.imageOrigHeight,
        useMainCanvas
      )
    }

    if (!_node.options.link || !_node.options.link.show) {
      _node.link.hide()
    }

    // apply any node filters to vect and/or text
    _node.applyFilters()

    this._refreshBe()

    return vect
  }
}
