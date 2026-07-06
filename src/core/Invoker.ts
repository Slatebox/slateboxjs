import type { Slate } from "./Slate";
import type { SlatePackage } from "./SlatePackage";
import { v1NodeToV2 } from "./compat";

export class Invoker {
  private slate: Slate

  constructor(slate: Slate) {
    this.slate = slate
  }

  /** Destroy the invoker, clearing all callback references */
  public destroy(): void {
    (this as any).slate = null;
  }

  onZoom(pkg: SlatePackage) {
    if (this.slate.options.followMe) {
      const level = pkg.data.zoomLevel
      if (typeof level === 'number' && level > 0) {
        // Apply directly through panZoom — Slate.zoom would re-broadcast
        this.slate.panZoom?.zoom(level)
      }
    }
  }

  onNodePositioned(pkg: SlatePackage) {
    const node = this.slate.nodes.one(pkg.data.id)
    if (node) {
      node.position(
        pkg.data.location.x,
        pkg.data.location.y,
        () => {},
        pkg.data.easing,
        pkg.data.duration || 500
      )
    }
  }

  onNodeLinkRemoved(pkg: SlatePackage) {
    const node = this.slate.nodes.one(pkg.data.id)
    if (node?.links) {
      node.links.unset(false)
    }
  }

  onNodeLinkAdded(pkg: SlatePackage) {
    const node = this.slate.nodes.one(pkg.data.id)
    if (node?.links) {
      node.links.set(pkg as any, false)
    }
  }

  onNodeUnlocked(pkg: SlatePackage) {
    const node = this.slate.nodes.one(pkg.data.id)
    if (node) {
      node.unlock()
    }
  }

  onNodeLocked(pkg: SlatePackage) {
    const node = this.slate.nodes.one(pkg.data.id)
    if (node) {
      node.lock()
    }
  }

  onNodeBehaviorChanged(pkg: SlatePackage) {
    const node = this.slate.nodes.one(pkg.data.id)
    if (node) {
      pkg.data.behaviorChanges.forEach((b: any) => {
        if (typeof b.value === 'object') {
          (node.options as any)[b.name] = b.value.val
          Object.keys(b.value).forEach((k) => {
            if (k !== 'val') {
              (node.options as any)[k] = b.value[k]
            }
          })
        } else {
          (node.options as any)[b.name] = b.value
        }
      })
    }
  }

  onNodeToBack(pkg: SlatePackage) {
    const node = this.slate.nodes.one(pkg.data.id)
    if (node) {
      node.toBack()
    }
  }

  onNodeToFront(pkg: SlatePackage) {
    const node = this.slate.nodes.one(pkg.data.id)
    if (node) {
      node.toFront()
    }
  }

  onNodeShapeChanged(pkg: SlatePackage) {
    const node = this.slate.nodes.one(pkg.data.id)
    if (!node) return
    const shape = (pkg.data as any).shape ?? (pkg.data as any).vectorPath
    // Carry any co-sent props (border, etc.), then re-render the shape.
    Object.assign(node.options, pkg.data)
    if (shape) {
      node.setShape(shape, (pkg.data as any).vectorPath)
    }
  }

  onNodeAdded(pkg: SlatePackage) {
    if (pkg.data?.multiSelectCopy) {
      // Handle multi-selection copy
      console.log('Multi-select copy:', pkg.data)
    } else if (pkg.data.id && pkg.data.options && !pkg.data.nodeOptions) {
      // Add node connected to a specific parent (data.id = PARENT id)
      const parentNode = this.slate.nodes.one(pkg.data.id)
      if (parentNode) {
        // Create connected node
        this.slate.nodes.add({
          ...pkg.data.options,
          x: pkg.data.targetXPos || 100,
          y: pkg.data.targetYPos || 100
        })
      }
    } else {
      // Straight up node addition — packages carry v1-shaped options
      // (xPos/yPos/foregroundColor/…); convert before creating
      let nodesToCreate = pkg.data.nodeOptions
      if (!Array.isArray(nodesToCreate)) {
        nodesToCreate = [nodesToCreate]
      }
      nodesToCreate.filter(Boolean).forEach((nOpts: any) => {
        const exists = this.slate.nodes.one(nOpts.id)
        if (!exists) {
          this.slate.nodes.add(v1NodeToV2(nOpts) as any)
        }
      })
    }
  }

  onNodeImageChanged(pkg: SlatePackage) {
    const node = this.slate.nodes.one(pkg.data.id)
    if (!node?.images) return
    // App sends { img: <url>, w, h } (or clears with a falsy img).
    const url = (pkg.data as any).img ?? (pkg.data as any).image
    if (url) {
      node.images.set(url, (pkg.data as any).w, (pkg.data as any).h)
    } else {
      node.images.clear()
    }
  }

  onNodeDeleted(pkg: SlatePackage) {
    this.slate.nodes.remove(pkg.data.id)
  }

  onNodeResized(pkg: SlatePackage) {
    const node = this.slate.nodes.one(pkg.data.id)
    if (node) {
      Object.assign(node.options, pkg.data)
      node.setSize(pkg.data.width, pkg.data.height)
    }
  }

  onNodeRotated(pkg: SlatePackage) {
    const node = this.slate.nodes.one(pkg.data.id)
    if (node) {
      if (pkg.data.textOffset !== undefined) {
        node.options.textOffset = pkg.data.textOffset
      }
      const angle =
        pkg.data.rotate?.rotationAngle ?? pkg.data.rotationAngle
      if (typeof angle === 'number') {
        // Animate remotely-applied rotation (collab bug #5) so it glides in
        // this window like drag does, instead of snapping.
        node.setRotation(angle, 400)
      }
      if (pkg.data.width && pkg.data.height) {
        node.setSize(pkg.data.width, pkg.data.height)
      }
    }
  }

  onNodeColorChanged(pkg: SlatePackage) {
    const node = this.slate.nodes.one(pkg.data.id)
    if (node) {
      // v1 packages carry the background as `color`; accept both
      node.setColors(
        pkg.data.color ?? pkg.data.backgroundColor,
        pkg.data.borderColor
      )
      if (pkg.data.opacity !== undefined) {
        node.options.opacity = pkg.data.opacity
      }
    }
  }

  onNodeTextChanged(pkg: SlatePackage) {
    const node = this.slate.nodes.one(pkg.data.id)
    if (node) {
      node.setText(pkg.data.text)
      // Update text properties — only when present (a text-only package
      // must not wipe font settings with undefined)
      if (pkg.data.fontSize !== undefined) node.options.fontSize = pkg.data.fontSize
      if (pkg.data.fontFamily !== undefined) node.options.fontFamily = pkg.data.fontFamily
      if (pkg.data.fontColor !== undefined) node.options.fontColor = pkg.data.fontColor
      if (pkg.data.textOpacity !== undefined) node.options.textOpacity = pkg.data.textOpacity
      if (pkg.data.textXAlign !== undefined) node.options.textXAlign = pkg.data.textXAlign
      if (pkg.data.textYAlign !== undefined) node.options.textYAlign = pkg.data.textYAlign
    }
  }

  onNodeAITextChanged(pkg: SlatePackage) {
    const node = this.slate.nodes.one(pkg.data.id)
    if (node) {
      node.options.ai = { ...pkg.data.ai, ...node.options.ai }
    }
  }

  addRelationship(pkg: SlatePackage) {
    this.slate.nodes.addRelationship(pkg.data)
  }

  removeRelationship(pkg: SlatePackage) {
    this.slate.nodes.removeRelationship(pkg.data)
  }

  onNodesMove(pkg: SlatePackage) {
    // Remote moves glide by default (v1 semantics); moveNodes honors an
    // explicit dur:0 for instant placement
    this.slate.nodes.moveNodes(pkg)
  }

  onNodeEffectChanged(pkg: SlatePackage) {
    const node = this.slate.nodes.one(pkg.data.id)
    if (!node?.filters) return
    // App sends { filter: { apply: 'vect'|'text'|'image', id: <filterName|null> } }.
    const filter = (pkg.data as any).filter
    if (!filter) return
    const target = filter.apply === 'text' ? 'text' : 'vect'
    const optKey = target === 'text' ? 'text' : 'vect'
    const prev = node.options.filters?.[optKey]
    // Exclusive toggle: remove the previously-applied effect for this target.
    if (prev) node.filters.remove(prev)
    if (filter.id) {
      node.filters.apply(filter.id, target as 'vect' | 'text' | 'both')
    } else if (node.options.filters) {
      // Deselected → clear the stored id.
      node.options.filters[optKey] = undefined
    }
  }

  onNodeBorderPropertiesChanged(pkg: SlatePackage) {
    const node = this.slate.nodes.one(pkg.data.id)
    if (!node) return
    const { prop, val } = pkg.data as any
    if (prop !== undefined) {
      // Pane shape: one { prop, val } at a time (borderColor / borderWidth /
      // borderStyle / borderOpacity).
      ;(node.options as any)[prop] = val
    } else {
      // Legacy bulk shape.
      if (pkg.data.borderColor !== undefined) node.options.borderColor = pkg.data.borderColor
      if (pkg.data.borderWidth !== undefined) node.options.borderWidth = pkg.data.borderWidth
    }
    node.applyBorder()
  }

  onLinePropertiesChanged(pkg: SlatePackage) {
    const data = Array.isArray(pkg.data) ? pkg.data : [pkg.data]
    data.forEach((p: any) => {
      const node = this.slate.nodes.one(p.id)
      if (!node) return
      // Pane packages: { prop, val, associationId } — update the specific
      // association's line property AND re-render its connector. Applied for
      // both local edits and remote (collab) so line changes sync + persist.
      if (p.associationId && p.prop !== undefined && node.relationships) {
        node.relationships.applyLineProperty(p.associationId, p.prop, p.val)
      } else if (p.options) {
        // Fallback: bulk options merge (legacy shape)
        Object.assign(node.options, p.options)
      }
    })
  }

  onFollowMeChanged(pkg: SlatePackage) {
    this.slate.options.followMe = pkg.data?.followMe
  }

  onCanvasMove(pkg: SlatePackage) {
    if (this.slate.options.followMe) {
      const { left, top } = pkg.data || {}
      if (typeof left === 'number' && typeof top === 'number') {
        this.slate.pan({ x: left, y: top })
      }
    }
  }

  onSlateThemeChanged(pkg: SlatePackage) {
    const theme = pkg.data?.theme
    if (theme?._id) this.slate.options.themeId = theme._id
    if (theme) {
      // Apply the theme (container bg, line color, per-node parent/child styles).
      this.slate.applyTheme(theme, (pkg.data as any)?.syncWithTheme)
    }
  }

  onSlateLayoutTypeChanged(pkg: SlatePackage) {
    if (pkg.data.layoutType != null) {
      this.slate.options.layoutType = pkg.data.layoutType
    }
    if (pkg.data.disableAutoLayoutOfManuallyPositionedNodes != null) {
      this.slate.options.disableAutoLayoutOfManuallyPositionedNodes =
        pkg.data.disableAutoLayoutOfManuallyPositionedNodes
    }
  }

  onSlateBackgroundEffectChanged(pkg: SlatePackage) {
    this.slate.options.containerStyle!.backgroundEffect = pkg.data.effect
    // Apply background effect
    console.log('Background effect changed:', pkg.data.effect)
  }

  onSlateBackgroundImageChanged(pkg: SlatePackage) {
    if (pkg.data.bg) {
      this.slate.options.containerStyle!.backgroundImage = pkg.data.bg.url
      this.slate.options.containerStyle!.backgroundSize = pkg.data.bg.size
      // An image supersedes any gradient (which otherwise wins in applyContainerStyle).
      this.slate.options.containerStyle!.backgroundColorAsGradient = false
    } else {
      const c = this.slate.options.containerStyle?.prevBackgroundColor || '#fff'
      this.slate.options.containerStyle!.backgroundColor = c
      this.slate.options.containerStyle!.backgroundImage = undefined
      this.slate.options.containerStyle!.backgroundEffect = undefined
    }
    // Push the option change onto the container element (was a no-op before).
    this.slate.applyContainerStyle()
  }

  onSlateBackgroundColorChanged(pkg: SlatePackage) {
    const cs = this.slate.options.containerStyle!;
    cs.backgroundColor = pkg.data.color
    cs.backgroundColorAsGradient = pkg.data.asGradient
    cs.backgroundGradientType = pkg.data.gradientType
    cs.backgroundGradientColors = pkg.data.gradientColors
    cs.backgroundGradientStrategy = pkg.data.gradientStrategy
    cs.backgroundImage = undefined
    cs.backgroundEffect = undefined
    // Actually paint the container (previously only options were updated).
    this.slate.applyContainerStyle()
  }

  onLineColorChanged(pkg: SlatePackage) {
    this.slate.options.defaultLineColor = pkg.data.color
    this.slate.nodes.allNodes.forEach((node: any) => {
      node.options.lineColor = pkg.data.color
      if (node.relationships?.associations) {
        node.relationships.associations.forEach((a: any) => {
          a.lineColor = pkg.data.color
        })
        node.relationships.refreshOwnRelationships()
      }
    })
  }

  onSlateAISet(pkg: SlatePackage) {
    this.slate.options.ai = {
      ...(this.slate.options.ai || {}),
      ...pkg.data,
    }
  }

  onSlateNameChanged(pkg: SlatePackage) {
    this.slate.options.name = pkg.data.name
  }

  onSlateDescriptionChanged(pkg: SlatePackage) {
    this.slate.options.description = pkg.data.description
  }

  onSlateShowGridChanged(pkg: SlatePackage) {
    this.slate.options.viewPort!.showGrid = pkg.data.showGrid
    if (pkg.data.showGrid) {
      // Show grid
      console.log('Show grid')
    } else {
      // Hide grid
      console.log('Hide grid')
    }
  }

  onSlateMindMapModeChanged(pkg: SlatePackage) {
    this.slate.options.mindMapMode = pkg.data.mindMapMode
  }

  onSlateAutoResizeNodesBasedOnTextChanged(pkg: SlatePackage) {
    this.slate.options.autoResizeNodesBasedOnText = pkg.data.autoResizeNodesBasedOnText
  }

  onSlateTagsAndTemplateMarkdownChanged(pkg: SlatePackage) {
    this.slate.options.tags = pkg.data.tags
    this.slate.options.templateMarkdown = pkg.data.templateMarkdown
    this.slate.options.templatePrompt = pkg.data.templatePrompt
  }

  onSlateTemplateChanged(pkg: SlatePackage) {
    this.slate.options.isTemplate = pkg.data.isTemplate
  }

  onSlateSnapToObjectsChanged(pkg: SlatePackage) {
    this.slate.options.viewPort!.snapToObjects = pkg.data.snapToObjects
  }

  onSlateFollowMeChanged(pkg: SlatePackage) {
    this.slate.options.followMe = pkg.data.followMe
  }

  onSlateHuddleChanged(pkg: SlatePackage) {
    if (pkg.data.huddleType != null) {
      this.slate.options.huddleType = pkg.data.huddleType
    }
    if (pkg.data.huddleEnabled != null) {
      this.slate.options.huddleEnabled = pkg.data.huddleEnabled
    }
  }
}