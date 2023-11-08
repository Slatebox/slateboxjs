/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import omit from 'lodash.omit'
import utils from '../helpers/utils'
import node from '../core/node'

export default class collab {
  constructor(slate) {
    this.slate = slate
    this.invoker = null
    this.pc = slate.collaboration || {}
    if (!utils.localRecipients) {
      utils.localRecipients = []
    }
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
        cn.position(
          pkg.data.location,
          () => {},
          pkg.data.easing,
          pkg.data.duration || 500
        )
        self.closeNodeSpecifics(pkg)
      },

      onNodeLinkRemoved(pkg) {
        const cn = self.slate.nodes.one(pkg.data.id)
        cn.links?.unset(false)
        self.closeNodeSpecifics(pkg)
      },

      onNodeLinkAdded(pkg) {
        const cn = self.slate.nodes.one(pkg.data.id)
        cn.links?.set(pkg, false)
        self.closeNodeSpecifics(pkg)
      },

      onNodeUnlocked(pkg) {
        const cn = self.slate.nodes.one(pkg.data.id)
        cn.options.allowDrag = true
        cn.options.isLocked = false
        cn.hideLock()
        self.slate.birdsEye?.nodeChanged(pkg)
        self.closeNodeSpecifics(pkg)
      },

      onNodeLocked(pkg) {
        const cn = self.slate.nodes.one(pkg.data.id)
        cn.options.allowDrag = false
        cn.options.isLocked = true
        cn.showLock()
        self.slate.birdsEye?.nodeChanged(pkg)
        self.closeNodeSpecifics(pkg)
      },

      onNodeBehaviorChanged(pkg) {
        const cn = self.slate.nodes.one(pkg.data.id)
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
      },

      onNodeToBack(pkg) {
        resetMultiSelect()
        const cn = self.slate.nodes.one(pkg.data.id)
        cn.toBack()
        self.slate.birdsEye?.nodeChanged(pkg)
      },

      onNodeToFront(pkg) {
        resetMultiSelect()
        const cn = self.slate.nodes.one(pkg.data.id)
        cn.toFront()
        self.slate.birdsEye?.nodeChanged(pkg)
      },

      onNodeShapeChanged(pkg) {
        const cn = self.slate.nodes.one(pkg.data.id)
        cn.shapes.set(pkg.data)
        self.slate.birdsEye?.nodeChanged(pkg)
        self.closeNodeSpecifics(pkg)
      },

      onNodeAdded(pkg) {
        resetMultiSelect()
        if (pkg.data.id) {
          const cn = self.slate.nodes.one(pkg.data.id)
          cn.connectors.createNode(
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
        cn.images.set(pkg.data.img, pkg.data.w, pkg.data.h)
        self.slate.birdsEye?.nodeChanged(pkg)
        self.closeNodeSpecifics(pkg)
      },

      onNodeDeleted(pkg) {
        resetMultiSelect()
        const cn = self.slate.nodes.one(pkg.data.id)
        cn.del()
        self.slate.birdsEye?.nodeDeleted(pkg)
      },

      onNodeResized(pkg) {
        resetMultiSelect()
        self.slate.toggleFilters(true, null, true)
        const cn = self.slate.nodes.one(pkg.data.id)
        cn.hideOwnMenus()
        const opts = {
          associations: pkg.data.associations,
          animate: true,
        }

        Object.assign(
          cn.options,
          omit(pkg.data, ['associations', 'textPosition'])
        )
        cn.resize.animateSet(pkg.data, opts)
        self.slate.birdsEye?.nodeChanged(pkg)

        self.closeNodeSpecifics(pkg)
      },

      onNodeRotated(pkg) {
        resetMultiSelect()
        self.slate.toggleFilters(true, null, true)
        const cn = self.slate.nodes.one(pkg.data.id)
        // needs to be updated
        cn.options.textOffset = pkg.data.textOffset

        cn.hideOwnMenus()
        const previousRotationAngle = cn.options.rotate.rotationAngle

        const opts = {
          associations: pkg.data.associations,
          animate: true,
        }

        Object.assign(cn.options, omit(pkg.data, 'associations'))
        cn.rotate.animateSet(
          {
            ...pkg.data,
            rotationAngle:
              pkg.data.rotate.rotationAngle - previousRotationAngle,
          },
          opts
        )
        self.slate.birdsEye?.nodeChanged(pkg)

        self.closeNodeSpecifics(pkg)
      },

      onNodeColorChanged(pkg) {
        const cn = self.slate.nodes.one(pkg.data.id)
        cn.colorPicker.set(pkg.data)
        self.slate.birdsEye?.nodeChanged(pkg)
      },

      onNodeTextChanged(pkg) {
        const cn = self.slate.nodes.one(pkg.data.id)
        cn.editor.set(
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
        cn.applyFilters(pkg.data.filter)
      },

      onNodeBorderPropertiesChanged(pkg) {
        const cn = self.slate.nodes.one(pkg.data.id)
        cn.applyBorder(pkg.data)
      },

      onLinePropertiesChanged(pkg) {
        const upkg = pkg
        self.slate.toggleFilters(true, null, true)
        if (!upkg.data.forEach) upkg.data = [upkg.data]
        upkg.data.forEach((p) => {
          const cn = self.slate.nodes.one(p.id)
          Object.assign(cn.options, p.options)
          cn.lineOptions.set(p)
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

    if (self.pc.onCollaboration) {
      self.pc.onCollaboration({
        type: 'init',
        slate: self.slate,
        cb(pkg) {
          self._process(pkg)
        },
      })
    }
    if (self.pc.localizedOnly) {
      utils.localRecipients.push(self)
    }
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
    } else if (self.pc.onCollaboration) {
      self.pc.onCollaboration({ type: 'custom', slate: self.slate, pkg })
    }
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

  send(pkg) {
    const self = this
    let packages = pkg
    if (!Array.isArray(packages)) {
      packages = [packages]
    }
    if (packages[0].type !== 'onMouseMoved') {
      if (self.slate.undoRedo && self.slate.options.showUndoRedo) {
        self.slate.undoRedo.snap()
      }
    }
    if (self.pc.allow) {
      if (self.slate.options?.onSlateChanged) {
        self.slate.options.onSlateChanged.apply(self, [packages])
      }
      if (self.pc.onCollaboration) {
        self.pc.onCollaboration({
          type: 'process',
          slate: self.slate,
          pkg: packages,
        })
      }
    }
  }
}
