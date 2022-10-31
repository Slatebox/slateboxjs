/* eslint-disable new-cap */
/* eslint-disable no-underscore-dangle */
import utils from '../helpers/utils'
import node from '../core/node'
import omit from 'lodash.omit'
import { Raphael } from '../deps/raphael/raphael.svg'

export default class connectors {
  constructor(slate, node) {
    this.slate = slate
    this.node = node
    this.buttons = null
    this.iconBar = null
    this._lastUnpinned = { options: { xPos: null, width: null, yPos: null } }
  }

  _broadcast(skipCenter, options, targetXPos, targetYPos) {
    const self = this
    const pkg = {
      type: 'onNodeAdded',
      data: {
        id: self.node.options.id,
        skipCenter,
        options,
        targetXPos,
        targetYPos,
      },
    }
    this.slate.collab && this.slate.collab.send(pkg)
  }

  remove() {
    const self = this
    if (self.buttons) {
      Object.keys(self.buttons).forEach((btn) => {
        self.buttons[btn].remove()
      })
    }
    self.iconBar?.remove()
    self.node.menu._isOpen = false
  }

  removeSettingsButton() {
    this.buttons.setting.remove()
  }

  show(x, y, _m, onSettingsClicked) {
    const self = this
    const r = self.slate.paper
    const bb = self.node.vect.getBBox()

    const widthOffset = bb.width / 2
    const btnAttr = { fill: '#fff', stroke: '#000' }

    function conditionallyShow(nodeType) {
      switch (nodeType) {
        case 'delete': {
          if (self.node.options.showDelete) {
            self.buttons.trash = r
              .trash()
              .transform(['t', x + widthOffset - 80, ',', y - 58].join())
              .attr({ fill: '#fff', stroke: '#f00' })
          } else if (
            self.node.options.showAddAndDeleteConditionally &&
            self.node.options.copiedFromId
          ) {
            const copiedTimestamps = self.slate.nodes.allNodes
              .filter(
                (n) => n.options.copiedFromId === self.node.options.copiedFromId
              )
              .map((nx) => nx.options.copiedAt)
            if (self.node.options.copiedAt >= Math.max(...copiedTimestamps)) {
              self.buttons.trash = r
                .trash()
                .transform(['t', x + widthOffset - 80, ',', y - 58].join())
                .attr({ fill: '#fff', stroke: '#f00' })
            }
          }
          break
        }
        case 'add': {
          const copies = self.slate.nodes.allNodes.filter(
            (n) => n.options.copiedFromId === self.node.options.id
          ).length
          if (
            self.node.options.showAdd ||
            (copies === 0 &&
              self.node.options.showAddAndDeleteConditionally &&
              !self.node.options.copiedFromId)
          ) {
            self.buttons.unPinned = r
              .plus()
              .transform(['t', x + widthOffset + 40, ',', y - 58].join())
              .attr(btnAttr)
          } else if (
            self.node.options.showAddAndDeleteConditionally &&
            self.node.options.copiedFromId
          ) {
            const copiedTimestamps = self.slate.nodes.allNodes
              .filter(
                (n) => n.options.copiedFromId === self.node.options.copiedFromId
              )
              .map((nx) => nx.options.copiedAt)
            if (self.node.options.copiedAt >= Math.max(...copiedTimestamps)) {
              self.buttons.unPinned = r
                .plus()
                .transform(['t', x + widthOffset + 40, ',', y - 58].join())
                .attr(btnAttr)
            }
          }
          break
        }
        default: {
          break
        }
      }
    }

    self.buttons = {}
    if (
      (self.slate.isCommentOnly() && self.node.options.isComment) ||
      !self.slate.isCommentOnly()
    ) {
      if (self.node.options.showMenu) {
        self.buttons.setting = r
          .setting()
          .transform(['t', x + widthOffset, ',', y - 58].join())
          .attr(btnAttr)
      }
      if (self.node.options.isComment && self.slate.canRemoveComments()) {
        conditionallyShow('delete')
      }
    }

    if (
      !self.node.options.isLocked &&
      !self.node.options.isComment &&
      !self.slate.isCommentOnly()
    ) {
      conditionallyShow('add')
      conditionallyShow('delete')
      if (self.node.options.showRelationshipConnector) {
        self.buttons.handle = r
          .handle()
          .transform(['t', x + widthOffset - 40, ',', y - 58].join())
          .attr(btnAttr)
      }
    }

    ;['mousedown'].forEach((eventType) => {
      if (self.buttons.setting) {
        self.buttons.setting[eventType]((e) => {
          self.slate.unglow()
          onSettingsClicked.apply(self)
          utils.stopEvent(e)
          // self.remove();
          if (self.slate.multiSelection) self.slate.multiSelection.end()
          if (self.node.context) self.node.context.remove()
          if (self.node.links) self.node.links.unset()
        })
      }

      if (self.buttons.unPinned) {
        self.buttons.unPinned[eventType](function unp(e) {
          utils.stopEvent(e)
          this.loop()
          self.slate.unglow()
          self.node.connectors?.addNode()
          self.node.menu?.hide()
          self.node.context?.remove()
        })
      }

      if (self.buttons.trash) {
        self.buttons.trash[eventType]((e) => {
          const gid = self.node.options.groupId
          utils.stopEvent(e)
          self.node.del()
          self.slate.unglow()
          const delPkg = {
            type: 'onNodeDeleted',
            data: {
              id: self.node.options.id,
              isComment: self.node.options.isComment,
            },
          }
          self.slate.collab?.send(delPkg)
          self.slate.birdsEye?.nodeDeleted(delPkg)
          if (gid) {
            // reselect the group after the node is deleted
            self.slate.multiSelection.showGroup(gid)
          }
        })
      }

      if (self.buttons.handle) {
        self.buttons.handle[eventType]((e) => {
          utils.stopEvent(e)
          self.slate.unglow()
          self.node.relationships.initiateTempNode(e, self.node, true)
        })
      }
    })

    if (Object.keys(self.buttons).length > 1) {
      const barWidth = Object.keys(self.buttons).length * 40
      self.iconBar = r
        .rect(x + widthOffset - 85, y - 63, barWidth, 43, 3)
        .attr({ stroke: '#000', fill: '#fff' })
        .toFront()
    }

    Object.keys(self.buttons).forEach((btn) => {
      const button = self.buttons[btn]
      button.toFront()
      _m.push(button)
      button.mouseover(function mo() {
        self.slate.glow(this)
      })
      button.mouseout(() => {
        self.slate.unglow()
      })
    })

    if (
      !self.node.options.isLocked &&
      !self.node.options.isComment &&
      !self.slate.isCommentOnly()
    ) {
      if (self.node.options.showResize) {
        const rs = self.node.resize.show(x + bb.width, y + bb.height)
        _m.push(rs)
      }
      if (self.node.options.showRotate) {
        const rotate = self.node.rotate.show(x, y)
        _m.push(rotate)
      }
    }
    return self
  }

  reset() {
    this._lastUnpinned = { options: { xPos: null, width: null, yPos: null } }
  }

  createNode(skipCenter, options, targetXPos, targetYPos, doBroadcast) {
    const self = this
    const newNode = new node(options)
    self.slate.nodes.add(newNode)

    utils.transformPath(
      newNode,
      `T${targetXPos - newNode.options.xPos}, ${
        targetYPos - newNode.options.yPos
      }`
    )
    newNode.options.xPos = targetXPos
    newNode.options.yPos = targetYPos
    newNode.editor.set()
    // const coords = newNode.textCoords({
    //   x: newNode.options.xPos,
    //   y: newNode.options.yPos,
    // })
    // newNode.editor.setTextOffset()
    // newNode.text.attr(coords)
    self._lastUnpinned = newNode.options

    if (self.slate.options.mindMapMode) {
      self.node.relationships.addAssociation(newNode)
    }

    self.slate.birdsEye?.refresh(false)

    if (doBroadcast) {
      self._broadcast(skipCenter, options, targetXPos, targetYPos)
    }

    // var _pkg = { type: "addRelationship", data: { type: 'association', parent: self.node.options.id, child: newNode.options.id} };
    // self.slate.collab && self.slate.collab.send(_pkg);

    // fire the editor if the menu can be shown
    if (doBroadcast && newNode.options.showMenu && skipCenter === undefined) {
      newNode.position('center', () => {
        // fire event
        self.slate.events?.onTextPaneRequested?.apply(this, [
          newNode,
          (opts) => {
            // ('changed', opts);
          },
        ])
      })
    }

    return newNode
  }

  // eslint-disable-next-line consistent-return
  addNode(skipCenter) {
    const self = this
    // add new node to the right of this one.
    // const _snap = self.slate.snapshot()

    const copies = self.slate.nodes.allNodes.filter(
      (n) =>
        n.options.copiedFromId === self.node.options.copiedFromId &&
        n.options.copiedAt >= self.node.options.copiedAt
    ).length
    if (copies === 1) {
      self.reset()
    }

    const options = JSON.parse(JSON.stringify(self.node.options))
    // assign a new guid to this node and remove the old id from the snapshot
    // otherwise the snapshot contains the previous id, and the node contains
    // the new id -- and the broadcast of the snap for collaboration causes
    // the old id to be assigned to the new node, created duplicate nodes with the same id
    const newId = utils.guid()
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
      const bb = self.node.vect.getBBox()
      self.node.options.width = bb.width
      self.node.options.height = bb.height
    }

    options.id = newId
    const targetXPos =
      (self._lastUnpinned.xPos || self.node.options.xPos) +
        (self._lastUnpinned.width || self.node.options.width || 220) +
        self.node.options.spaceBetweenNodesWhenAdding || 30
    const targetYPos = self._lastUnpinned.yPos || self.node.options.yPos

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
    if (options.opacity === 1) {
      options.text = ''
      //   options.width = self.node.options.width + textDimens.width
      //   options.height =
      //     self.node.options.height +
      //     textDimens.fontBoundingBoxAscent +
      //     textDimens.fontBoundingBoxDescent
      // } else {
      //   options.width = textDimens.width
      //   options.height =
      //     textDimens.fontBoundingBoxAscent + textDimens.fontBoundingBoxDescent
      //   const nodebb = self.node.vect.getBBox()
      //   const widthScalar = (options.width - 20) / nodebb.width
      //   const heightScalar = (options.height - 20) / nodebb.height
      //   const scaledVectPath = Raphael.transformPath(
      //     self.node.options.vectorPath,
      //     `s${widthScalar}, ${heightScalar}`
      //   ).toString()
      //   options.vectorPath = scaledVectPath
    }

    options.copiedFromId =
      self.node.options.copiedFromId || self.node.options.id
    options.copiedAt = new Date().valueOf()

    // use the next theme shape if this slate is set to sync the theme
    if (!self.slate.options.basedOnThemeId) {
      return self.createNode(skipCenter, options, targetXPos, targetYPos, true)
    }
    // adjust the node's shape and color prior to insertion
    self.slate.events.onThemeRequired(
      { themeId: self.slate.options.basedOnThemeId },
      (err, theme) => {
        if (err) {
          console.error('Unable to apply theme', err)
        } else {
          const children = self.slate.findChildren([options.id])
          let nextChild = children.length + 1
          if (nextChild > Object.keys(theme.styles).length) {
            nextChild = 1
          }
          const base = theme.styles[`child_${nextChild}`]
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
          if (base) {
            Object.assign(options, omit(base, 'vectorPath'))
          }
        }
        return self.createNode(
          skipCenter,
          options,
          targetXPos,
          targetYPos,
          true
        )
      }
    )
  }
}
