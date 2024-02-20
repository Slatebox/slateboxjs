/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */

import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import omit from 'lodash.omit'
import cloneDeep from 'lodash.clonedeep'
import utils from '../helpers/utils'
import node from '../core/node'

export default class collab {
  constructor(slate) {
    this.slate = slate
    this.invoker = null
    this.constants = {
      mapName: 'collabPackages',
      lastMapDocName: 'last',
      ommittableUserData: ['websocketUrl', 'websocketParams'],
      onCollaborationUserCustomDataChanged:
        'onCollaborationUserCustomDataChanged',
    }
    if (!utils.localRecipients) {
      utils.localRecipients = []
    }
    this.xyMap = {}
    this.wire()
  }

  exe(pkg) {
    const self = this
    if (!Array.isArray(pkg)) {
      pkg = [pkg]
    }
    pkg.forEach((p) => {
      self.invoke(p)
      self.send(p)
    })
  }

  wire() {
    const self = this

    function resetMultiSelect() {
      self.slate.multiSelection?.end()
    }

    self.invoker = {
      onZoom(pkg) {
        if (self.slate.options.followMe) {
          resetMultiSelect()
          const zoomPercent =
            (self.slate.options.viewPort.originalWidth / pkg.data.zoomLevel) *
            100
          self.slate.canvas.zoom({
            dur: pkg.data.duration || 500,
            zoomPercent,
            callbacks: {
              during() {
                // additional calcs
              },
              after() {},
            },
          })
        }
      },

      onNodePositioned(pkg) {
        resetMultiSelect()
        const cn = self.slate.nodes.one(pkg.data.id)
        cn?.position(
          pkg.data.location,
          () => {},
          pkg.data.easing,
          pkg.data.duration || 500
        )
        self.closeNodeSpecifics(pkg)
      },

      onNodeLinkRemoved(pkg) {
        const cn = self.slate.nodes.one(pkg.data.id)
        cn?.links?.unset(false)
        self.closeNodeSpecifics(pkg)
      },

      onNodeLinkAdded(pkg) {
        const cn = self.slate.nodes.one(pkg.data.id)
        cn?.links?.set(pkg, false)
        self.closeNodeSpecifics(pkg)
      },

      onNodeUnlocked(pkg) {
        const cn = self.slate.nodes.one(pkg.data.id)
        if (cn) {
          cn.options.allowDrag = true
          cn.options.isLocked = false
          cn.hideLock()
          self.slate.birdsEye?.nodeChanged(pkg)
          self.closeNodeSpecifics(pkg)
        }
      },

      onNodeLocked(pkg) {
        const cn = self.slate.nodes.one(pkg.data.id)
        if (cn) {
          cn.options.allowDrag = false
          cn.options.isLocked = true
          cn?.showLock()
          self.slate.birdsEye?.nodeChanged(pkg)
          self.closeNodeSpecifics(pkg)
        }
      },

      onNodeBehaviorChanged(pkg) {
        const cn = self.slate.nodes.one(pkg.data.id)
        if (cn) {
          pkg.data.behaviorChanges.forEach((b) => {
            if (typeof b.value === 'object') {
              cn.options[b.name] = b.value.val
              Object.keys(b.value).forEach((k) => {
                if (k !== 'val') {
                  cn.options[k] = b.value[k]
                }
              })
            } else {
              cn.options[b.name] = b.value
            }
          })
          self.slate.birdsEye?.nodeChanged(pkg)
          self.closeNodeSpecifics(pkg)
        }
      },

      onNodeToBack(pkg) {
        resetMultiSelect()
        const cn = self.slate.nodes.one(pkg.data.id)
        cn?.toBack()
        self.slate.birdsEye?.nodeChanged(pkg)
      },

      onNodeToFront(pkg) {
        resetMultiSelect()
        const cn = self.slate.nodes.one(pkg.data.id)
        cn?.toFront()
        self.slate.birdsEye?.nodeChanged(pkg)
      },

      onNodeShapeChanged(pkg) {
        const cn = self.slate.nodes.one(pkg.data.id)
        cn?.shapes.set(pkg.data)
        self.slate.birdsEye?.nodeChanged(pkg)
        self.closeNodeSpecifics(pkg)
      },

      onNodeAdded(pkg) {
        resetMultiSelect()
        if (pkg.data.id) {
          const cn = self.slate.nodes.one(pkg.data.id)
          cn?.connectors.createNode(
            pkg.data.skipCenter,
            pkg.data.options,
            pkg.data.targetXPos,
            pkg.data.targetYPos
          )
        } else if (pkg.data.multiSelectCopy) {
          // this is a multiSelection copy
          self.slate.multiSelection.createCopiedNodes(
            pkg.data.nodeOptions,
            pkg.data.assocDetails
          )
        } else {
          // straight up node addition
          const n = new node(pkg.data.nodeOptions)
          self.slate.nodes.add(n)
        }
      },
      onNodeImageChanged(pkg) {
        const cn = self.slate.nodes.one(pkg.data.id)
        cn?.images.set(pkg.data.img, pkg.data.w, pkg.data.h)
        self.slate.birdsEye?.nodeChanged(pkg)
        self.closeNodeSpecifics(pkg)
      },

      onNodeDeleted(pkg) {
        resetMultiSelect()
        const cn = self.slate.nodes.one(pkg.data.id)
        cn?.del()
        self.slate.birdsEye?.nodeDeleted(pkg)
      },

      onNodeResized(pkg) {
        resetMultiSelect()
        self.slate.toggleFilters(true, null, true)
        const cn = self.slate.nodes.one(pkg.data.id)
        cn?.hideOwnMenus()
        const opts = {
          associations: pkg.data.associations,
          animate: true,
        }

        Object.assign(
          cn.options,
          omit(pkg.data, ['associations', 'textPosition'])
        )
        cn?.resize.animateSet(pkg.data, opts)
        self.slate.birdsEye?.nodeChanged(pkg)

        self.closeNodeSpecifics(pkg)
      },

      onNodeRotated(pkg) {
        resetMultiSelect()
        self.slate.toggleFilters(true, null, true)
        const cn = self.slate.nodes.one(pkg.data.id)
        if (cn) {
          // needs to be updated
          cn.options.textOffset = pkg.data.textOffset

          cn?.hideOwnMenus()
          const previousRotationAngle = cn.options.rotate.rotationAngle

          const opts = {
            associations: pkg.data.associations,
            animate: true,
          }

          Object.assign(cn.options, omit(pkg.data, 'associations'))
          cn?.rotate.animateSet(
            {
              ...pkg.data,
              rotationAngle:
                pkg.data.rotate.rotationAngle - previousRotationAngle,
            },
            opts
          )
          self.slate.birdsEye?.nodeChanged(pkg)

          self.closeNodeSpecifics(pkg)
        }
      },

      onNodeColorChanged(pkg) {
        const cn = self.slate.nodes.one(pkg.data.id)
        cn?.colorPicker.set(pkg.data)
        self.slate.birdsEye?.nodeChanged(pkg)
      },

      onNodeTextChanged(pkg) {
        const cn = self.slate.nodes.one(pkg.data.id)
        cn?.editor.set(
          pkg.data.text,
          pkg.data.fontSize,
          pkg.data.fontFamily,
          pkg.data.fontColor,
          pkg.data.textOpacity,
          pkg.data.textXAlign,
          pkg.data.textYAlign
        )
        self.slate.birdsEye?.nodeChanged(pkg)
        self.slate.loadAllFonts()
      },

      onNodeAITextChanged(pkg) {
        const cn = self.slate.nodes.one(pkg.data.id)
        if (cn) {
          cn.options.ai = { ...pkg.data.ai, ...cn.options.ai }
        }
      },

      addRelationship(pkg) {
        resetMultiSelect()
        self.slate.nodes.addRelationship(pkg.data)
        self.slate.birdsEye?.relationshipsChanged(pkg)
      },

      removeRelationship(pkg) {
        resetMultiSelect()
        self.slate.nodes.removeRelationship(pkg.data)
        self.slate.birdsEye?.relationshipsChanged(pkg)
      },

      onNodesMove(pkg) {
        resetMultiSelect()
        self.slate.toggleFilters(true, null, true)
        self.slate.nodes.moveNodes(pkg, { animate: pkg.data.dur > 0 })
        self.slate.birdsEye?.nodeChanged(pkg)

        self.closeNodeSpecifics(pkg)
      },

      onNodeEffectChanged(pkg) {
        const cn = self.slate.nodes.one(pkg.data.id)
        cn?.applyFilters(pkg.data.filter)
      },

      onNodeBorderPropertiesChanged(pkg) {
        const cn = self.slate.nodes.one(pkg.data.id)
        cn?.applyBorder(pkg.data)
      },

      onLinePropertiesChanged(pkg) {
        const upkg = pkg
        self.slate.toggleFilters(true, null, true)
        if (!upkg.data.forEach) upkg.data = [upkg.data]
        upkg.data.forEach((p) => {
          const cn = self.slate.nodes.one(p.id)
          Object.assign(cn?.options, p.options)
          cn?.lineOptions.set(p)
        })
      },

      onFollowMeChanged(pkg) {
        self.slate.options.followMe = pkg.data?.followMe
      },

      onCanvasMove(pkg) {
        if (self.slate.options.followMe) {
          self.slate.toggleFilters(true, null, true)
          const opts = {
            x: pkg.data.left,
            y: pkg.data.top,
            dur: pkg.data.duration || 500,
            callback: {
              after() {
                self.slate.birdsEye?.refresh(true)
              },
            },
            isAbsolute: !pkg.isRelative,
          }
          self.slate.canvas.move(opts)
        }
      },

      onSlateThemeChanged(pkg) {
        self.slate.options.themeId = pkg.data?.theme?._id
        if (pkg.data?.theme) {
          self.slate.applyTheme(pkg.data.theme, pkg.data.syncWithTheme)
        }
      },

      onSlateLayoutTypeChanged(pkg) {
        if (pkg.data.layoutType != null) {
          self.slate.options.layoutType = pkg.data.layoutType
        }
        if (pkg.data.disableAutoLayoutOfManuallyPositionedNodes != null) {
          self.slate.options.disableAutoLayoutOfManuallyPositionedNodes =
            pkg.data.disableAutoLayoutOfManuallyPositionedNodes
        }
      },

      onSlateBackgroundEffectChanged(pkg) {
        self.slate.options.containerStyle.backgroundEffect = pkg.data.effect
        self.slate.canvas.hideBg(1)
        // self.slate.png({ backgroundOnly: true, base64: true }, (base64) => {
        //   self.slate.canvas.internal.style.background = base64;
        //   self.slate.canvas._bg?.remove();
        // });
      },

      onSlateBackgroundImageChanged(pkg) {
        if (pkg.data.bg) {
          self.slate.options.containerStyle.backgroundImage = pkg.data.bg.url
          self.slate.options.containerStyle.backgroundSize = pkg.data.bg.size
        } else {
          const c =
            self.slate.options.containerStyle.prevBackgroundColor || '#fff'
          self.slate.options.containerStyle.backgroundColor = c
          self.slate.options.containerStyle.backgroundImage = null
          self.slate.options.containerStyle.backgroundEffect = null
        }
        self.slate.canvas.hideBg(1)
      },

      onSlateBackgroundColorChanged(pkg) {
        self.slate.options.containerStyle.backgroundColor = pkg.data.color
        self.slate.options.containerStyle.backgroundColorAsGradient =
          pkg.data.asGradient
        self.slate.options.containerStyle.backgroundGradientType =
          pkg.data.gradientType
        self.slate.options.containerStyle.backgroundGradientColors =
          pkg.data.gradientColors
        self.slate.options.containerStyle.backgroundGradientStrategy =
          pkg.data.gradientStrategy
        self.slate.options.containerStyle.backgroundImage = null
        self.slate.options.containerStyle.backgroundEffect = null
        self.slate.canvas.hideBg(1)
      },

      onLineColorChanged(pkg) {
        self.slate.options.defaultLineColor = pkg.data.color
        self.slate.nodes.allNodes.forEach((n) => {
          n.options.lineColor = pkg.data.color
          n.relationships.associations.forEach((a) => {
            a.lineColor = pkg.data.color
          })
          n.relationships.refreshOwnRelationships()
        })
      },

      onSlateAISet(pkg) {
        self.slate.options.ai = {
          ...(self.slate.options.ai || {}),
          ...pkg.data,
        }
      },

      onSlateNameChanged(pkg) {
        self.slate.options.name = pkg.data.name
      },

      onSlateDescriptionChanged(pkg) {
        self.slate.options.description = pkg.data.description
      },

      onSlateShowGridChanged(pkg) {
        self.slate.options.viewPort.showGrid = pkg.data.showGrid
        if (pkg.data.showGrid) {
          self.slate.grid.show()
        } else {
          self.slate.grid.destroy()
        }
      },

      onSlateMindMapModeChanged(pkg) {
        self.slate.options.mindMapMode = pkg.data.mindMapMode
      },

      onSlateAutoResizeNodesBasedOnTextChanged(pkg) {
        self.slate.options.autoResizeNodesBasedOnText =
          pkg.data.autoResizeNodesBasedOnText
      },

      onSlateTagsAndTemplateMarkdownChanged(pkg) {
        self.slate.options.tags = pkg.data.tags
        self.slate.options.templateMarkdown = pkg.data.templateMarkdown
        self.slate.options.templatePrompt = pkg.data.templatePrompt
      },

      onSlateTemplateChanged(pkg) {
        self.slate.options.isTemplate = pkg.data.isTemplate
      },

      onSlateSnapToObjectsChanged(pkg) {
        self.slate.options.viewPort.snapToObjects = pkg.data.snapToObjects
      },

      onSlateFollowMeChanged(pkg) {
        self.slate.options.followMe = pkg.data.followMe
      },

      onSlateHuddleChanged(pkg) {
        if (pkg.data.huddleType != null) {
          self.slate.options.huddleType = pkg.data.huddleType
        }
        if (pkg.data.huddleEnabled != null) {
          self.slate.options.huddleEnabled = pkg.data.huddleEnabled
        }
      },
    } // this invoker
  }

  _process(pkg) {
    const self = this
    if (utils.localRecipients.length > 1) {
      let _time = 0
      utils.localRecipients.forEach((s) => {
        _time += 10
        ;((rec, t) => {
          setTimeout(() => {
            rec.collab.invoke(pkg)
          }, t)
        })(utils.localRecipients[s], _time)
      })
    } else if (self.invoker[pkg.type]) {
      self.invoker[pkg.type](pkg)
    }
    // else if (self.pc.onCollaboration) {
    //   self.pc.onCollaboration({ type: 'custom', slate: self.slate, pkg })
    // }
  }

  invoke(pkg) {
    const self = this
    let packages = pkg
    if (!Array.isArray(packages)) {
      packages = [packages]
    }
    for (let pkg of packages) {
      if (self.invoker[pkg.type]) {
        self.invoker[pkg.type](pkg)
      }
    }
  }

  closeNodeSpecifics(pkg) {
    const self = this
    const all = pkg.data.nodeOptions ? pkg.data.nodeOptions : [pkg.data]
    all.forEach((n) => {
      // close self node's marker if open
      const nx = self.slate.nodes.one(n.id)
      if (nx) {
        nx.menu?.hide()
        nx.connectors?.remove()
        nx.resize?.hide()
        nx.rotate?.hide()

        nx.relationships.associations.forEach((association) => {
          nx.lineOptions?.hide(association.id)
        })
      } else {
        console.error(
          'Unable to find node with id',
          n.id,
          'currentIds',
          self.slate.nodes.allNodes.map((nx) => nx.options.id)
        )
      }
    })

    // remove any context menus
    self.slate.removeContextMenus()
    self.slate.untooltip()
  }

  async init() {
    const self = this

    if (self.slate.options.isbirdsEye) {
      // not allowed
      return
    }

    // go get the server url here
    if (self.collabPackage) {
      console.error('Unable to collaborate - collabPackage already created')
      return
    }

    // ALL yjs depenencies are nested under the collabPackage
    const mainYDoc = new Y.Doc()
    self.collabPackage = {
      provider: null,
      users: [],
      /*
      return {
        websocketUrl: collaboratorDetails.wsUrl,
        websocketParams: collaboratorDetails.wsParams,
        color: collaboratorDetails.color,
        userName: getUserName(Meteor.userId()),
        x: 0,
        y: 0,
      }
      */
      userBaseData: await self.slate.events.onInitCollaboration(
        mainYDoc.clientID
      ),
      doc: mainYDoc,
      map: null,
    }

    if (!self.collabPackage.userBaseData) {
      console.error(
        'Unable to collaborate - no self.collabPackage retrieved from the onInitCollaboration event'
      )
    }

    // attach clientID to the package for downstream reference
    self.collabPackage.userBaseData.clientID = self.collabPackage.doc.clientID

    self.collabPackage.provider = new WebsocketProvider(
      self.collabPackage.userBaseData.websocketUrl,
      self.slate.options.id,
      self.collabPackage.doc,
      {
        connect: true,
        params: self.collabPackage.userBaseData.websocketParams,
      }
    )

    self.collabPackage.map = self.collabPackage.doc.getMap(
      self.constants.mapName
    )

    self.collabPackage.doc.on('updateV2', (update, origin, doc, tr) => {
      const pkgs = doc
        .getMap(self.constants.mapName)
        .get(self.constants.lastMapDocName)
      pkgs?.forEach((p) => {
        if (p.type === self.constants.onCollaborationUserCustomDataChanged) {
          // for both local and remote - call this function so users are updated
          self.slate.events.onCollaborationUsersChanged?.(
            self.collabPackage.users
          )
        } else {
          if (p.data.clientID !== self.collabPackage.doc.clientID) {
            self.slate.collab.invoke(p)
            // the onCollaboration event is fired for OTHERS
            self.slate.events?.onCollaboration?.apply(self, [
              p,
              self.collabPackage.users,
            ])
          } else if (p.data.clientID === self.collabPackage.doc.clientID) {
            // the onSlateChanged is fired for the initiator only
            self.slate.events?.onSlateChanged?.apply(self, [
              p,
              self.collabPackage.users,
            ])
          }
        }
      })
    })

    self.collabPackage.provider.awareness.on(
      'update',
      ({ added, updated, removed }) => {
        const awarenessStates = Array.from(
          self.collabPackage.provider.awareness.getStates().values()
        )

        self.collabPackage.users = awarenessStates
          .filter((ux) => !!ux.user)
          .map((u) => u.user)

        if (added.length > 0) {
          const users = self.collabPackage.users.filter((u) => {
            return added.includes(u.clientID)
          })
          self.slate.events.onCollaborationUsersAdded?.(users)
        }
        if (removed.length > 0) {
          const users = self.collabPackage.users.filter((u) => {
            return removed.includes(u.clientID)
          })
          self.slate.events.onCollaborationUsersRemoved?.(users)

          self.collabPackage.users = self.collabPackage.users.filter((u) => {
            return !removed.includes(u.clientID)
          })
        }
        if (added.length > 0 || removed.length > 0) {
          self.slate.events.onCollaborationUsersChanged?.(
            self.collabPackage.users
          )
        }
      }
    )

    // monitors for cursor locations - the change event runs when the mouse moves, but the upate event
    // resolves when it settles (so no real-time view)
    self.collabPackage.provider.awareness.on(
      'change',
      ({ added, updated, removed }) => {
        const awarenessStates = Array.from(
          self.collabPackage.provider.awareness.getStates().values()
        )
        awarenessStates.forEach((u) => {
          if (
            updated.includes(u.user?.clientID) &&
            u.user?.clientID !== self.collabPackage?.doc?.clientID
          ) {
            self.slate.cursor(u.user)
          }
        })
      }
    )

    // this sends the cursor locations to the other clients
    if (!self.collabPackage.userBaseData.suppressCursor) {
      self.collabPackage.provider.awareness.setLocalStateField('user', {
        ...omit(
          self.collabPackage.userBaseData,
          self.constants.ommittableUserData
        ),
      })
    }

    // this auto destroys the connection so others immediately know the client is gone
    window.addEventListener('beforeunload', () => {
      self.destroy()
    })
  }

  destroy() {
    const self = this
    self.collabPackage?.provider?.awareness?.destroy()
    self.collabPackage?.provider?.destroy()
  }

  updateUserData(pkg) {
    const self = this
    if (self.collabPackage) {
      // this will cause the onUsersChanged to fire
      // and also change the baseData so that this is not overridden
      // by any other setLocaLStateField calls
      self.collabPackage.userBaseData = {
        ...self.collabPackage.userBaseData,
        ...pkg,
      }
      self.collabPackage.provider.awareness?.setLocalStateField('user', {
        ...omit(
          self.collabPackage.userBaseData,
          self.constants.ommittableUserData
        ),
        ...pkg,
      })
      // will broadcast that the users have changed
      self.send({
        type: self.constants.onCollaborationUserCustomDataChanged,
        data: {},
      })
    }
  }

  send(pkg) {
    const self = this
    let packages = pkg
    if (!Array.isArray(packages)) {
      packages = [packages]
    }
    if (packages[0].type === 'onMouseMoved') {
      if (
        self.collabPackage?.userBaseData &&
        !self.collabPackage.userBaseData.suppressCursor
      ) {
        // broadcast the mouse cursors
        self.collabPackage?.provider.awareness?.setLocalStateField('user', {
          ...omit(
            self.collabPackage.userBaseData,
            self.constants.ommittableUserData
          ),
          ...packages[0].data,
        })
      }
    } else {
      if (self.slate.undoRedo && self.slate.options.showUndoRedo) {
        self.slate.undoRedo.snap()
      }

      // these will only exist if allowCollaboration: true on the slate
      if (self.collabPackage?.doc && self.collabPackage?.map) {
        packages.forEach(
          (p) => (p.data.clientID = self.collabPackage.doc.clientID)
        )
        self.collabPackage.map.set(self.constants.lastMapDocName, packages)
      }
    }
  }
}
