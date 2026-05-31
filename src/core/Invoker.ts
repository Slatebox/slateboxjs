export class Invoker {
  private slate: any

  constructor(slate: any) {
    this.slate = slate
  }

  /** Destroy the invoker, clearing all callback references */
  public destroy(): void {
    this.slate = null;
  }

  onZoom(pkg: any) {
    if (this.slate.options.followMe) {
      const zoomPercent = (this.slate.options.viewPort.originalWidth / pkg.data.zoomLevel) * 100
      // Implementation for zoom functionality
      console.log('Zoom to:', zoomPercent + '%')
    }
  }

  onNodePositioned(pkg: any) {
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

  onNodeLinkRemoved(pkg: any) {
    const node = this.slate.nodes.one(pkg.data.id)
    if (node?.links) {
      node.links.unset(false)
    }
  }

  onNodeLinkAdded(pkg: any) {
    const node = this.slate.nodes.one(pkg.data.id)
    if (node?.links) {
      node.links.set(pkg, false)
    }
  }

  onNodeUnlocked(pkg: any) {
    const node = this.slate.nodes.one(pkg.data.id)
    if (node) {
      node.unlock()
    }
  }

  onNodeLocked(pkg: any) {
    const node = this.slate.nodes.one(pkg.data.id)
    if (node) {
      node.lock()
    }
  }

  onNodeBehaviorChanged(pkg: any) {
    const node = this.slate.nodes.one(pkg.data.id)
    if (node) {
      pkg.data.behaviorChanges.forEach((b: any) => {
        if (typeof b.value === 'object') {
          node.options[b.name] = b.value.val
          Object.keys(b.value).forEach((k) => {
            if (k !== 'val') {
              node.options[k] = b.value[k]
            }
          })
        } else {
          node.options[b.name] = b.value
        }
      })
    }
  }

  onNodeToBack(pkg: any) {
    const node = this.slate.nodes.one(pkg.data.id)
    if (node) {
      node.toBack()
    }
  }

  onNodeToFront(pkg: any) {
    const node = this.slate.nodes.one(pkg.data.id)
    if (node) {
      node.toFront()
    }
  }

  onNodeShapeChanged(pkg: any) {
    const node = this.slate.nodes.one(pkg.data.id)
    if (node) {
      // Update shape properties
      Object.assign(node.options, pkg.data)
      // Recreate the node with new shape if needed
      // This is a simplified implementation
      console.log('Shape changed for node:', pkg.data.id)
    }
  }

  onNodeAdded(pkg: any) {
    if (pkg.data?.multiSelectCopy) {
      // Handle multi-selection copy
      console.log('Multi-select copy:', pkg.data)
    } else if (pkg.data.id) {
      // Add node with specific parent
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
      // Straight up node addition
      let nodesToCreate = pkg.data.nodeOptions
      if (!Array.isArray(nodesToCreate)) {
        nodesToCreate = [nodesToCreate]
      }
      nodesToCreate.forEach((nOpts: any) => {
        const exists = this.slate.nodes.one(nOpts.id)
        if (!exists) {
          this.slate.nodes.add(nOpts)
        }
      })
    }
  }

  onNodeImageChanged(pkg: any) {
    const node = this.slate.nodes.one(pkg.data.id)
    if (node) {
      // Implementation for image change
      console.log('Image changed for node:', pkg.data.id)
    }
  }

  onNodeDeleted(pkg: any) {
    this.slate.nodes.remove(pkg.data.id)
  }

  onNodeResized(pkg: any) {
    const node = this.slate.nodes.one(pkg.data.id)
    if (node) {
      Object.assign(node.options, pkg.data)
      node.setSize(pkg.data.width, pkg.data.height)
    }
  }

  onNodeRotated(pkg: any) {
    const node = this.slate.nodes.one(pkg.data.id)
    if (node) {
      // Update rotation
      node.options.textOffset = pkg.data.textOffset
      Object.assign(node.options, pkg.data)
      // Apply rotation - this would need SVG transformation
      console.log('Node rotated:', pkg.data.id)
    }
  }

  onNodeColorChanged(pkg: any) {
    const node = this.slate.nodes.one(pkg.data.id)
    if (node) {
      node.setColors(pkg.data.backgroundColor, pkg.data.borderColor)
    }
  }

  onNodeTextChanged(pkg: any) {
    const node = this.slate.nodes.one(pkg.data.id)
    if (node) {
      node.setText(pkg.data.text)
      // Update text properties
      node.options.fontSize = pkg.data.fontSize
      node.options.fontFamily = pkg.data.fontFamily
      node.options.fontColor = pkg.data.fontColor
      node.options.textOpacity = pkg.data.textOpacity
      node.options.textXAlign = pkg.data.textXAlign
      node.options.textYAlign = pkg.data.textYAlign
    }
  }

  onNodeAITextChanged(pkg: any) {
    const node = this.slate.nodes.one(pkg.data.id)
    if (node) {
      node.options.ai = { ...pkg.data.ai, ...node.options.ai }
    }
  }

  addRelationship(pkg: any) {
    this.slate.nodes.addRelationship(pkg.data)
  }

  removeRelationship(pkg: any) {
    this.slate.nodes.removeRelationship(pkg.data)
  }

  onNodesMove(pkg: any) {
    this.slate.nodes.moveNodes(pkg, { animate: pkg.data.dur > 0 })
  }

  onNodeEffectChanged(pkg: any) {
    const node = this.slate.nodes.one(pkg.data.id)
    if (node) {
      // Apply filters/effects
      console.log('Effect changed for node:', pkg.data.id)
    }
  }

  onNodeBorderPropertiesChanged(pkg: any) {
    const node = this.slate.nodes.one(pkg.data.id)
    if (node) {
      // Apply border properties
      node.options.borderColor = pkg.data.borderColor
      node.options.borderWidth = pkg.data.borderWidth
      node.setColors(undefined, pkg.data.borderColor)
    }
  }

  onLinePropertiesChanged(pkg: any) {
    const data = Array.isArray(pkg.data) ? pkg.data : [pkg.data]
    data.forEach((p: any) => {
      const node = this.slate.nodes.one(p.id)
      if (node) {
        Object.assign(node.options, p.options)
      }
    })
  }

  onFollowMeChanged(pkg: any) {
    this.slate.options.followMe = pkg.data?.followMe
  }

  onCanvasMove(pkg: any) {
    if (this.slate.options.followMe) {
      // Implement canvas movement
      console.log('Canvas move:', pkg.data)
    }
  }

  onSlateThemeChanged(pkg: any) {
    this.slate.options.themeId = pkg.data?.theme?._id
    if (pkg.data?.theme) {
      // Apply theme
      console.log('Theme changed:', pkg.data.theme)
    }
  }

  onSlateLayoutTypeChanged(pkg: any) {
    if (pkg.data.layoutType != null) {
      this.slate.options.layoutType = pkg.data.layoutType
    }
    if (pkg.data.disableAutoLayoutOfManuallyPositionedNodes != null) {
      this.slate.options.disableAutoLayoutOfManuallyPositionedNodes =
        pkg.data.disableAutoLayoutOfManuallyPositionedNodes
    }
  }

  onSlateBackgroundEffectChanged(pkg: any) {
    this.slate.options.containerStyle.backgroundEffect = pkg.data.effect
    // Apply background effect
    console.log('Background effect changed:', pkg.data.effect)
  }

  onSlateBackgroundImageChanged(pkg: any) {
    if (pkg.data.bg) {
      this.slate.options.containerStyle.backgroundImage = pkg.data.bg.url
      this.slate.options.containerStyle.backgroundSize = pkg.data.bg.size
    } else {
      const c = this.slate.options.containerStyle.prevBackgroundColor || '#fff'
      this.slate.options.containerStyle.backgroundColor = c
      this.slate.options.containerStyle.backgroundImage = null
      this.slate.options.containerStyle.backgroundEffect = null
    }
  }

  onSlateBackgroundColorChanged(pkg: any) {
    this.slate.options.containerStyle.backgroundColor = pkg.data.color
    this.slate.options.containerStyle.backgroundColorAsGradient = pkg.data.asGradient
    this.slate.options.containerStyle.backgroundGradientType = pkg.data.gradientType
    this.slate.options.containerStyle.backgroundGradientColors = pkg.data.gradientColors
    this.slate.options.containerStyle.backgroundGradientStrategy = pkg.data.gradientStrategy
    this.slate.options.containerStyle.backgroundImage = null
    this.slate.options.containerStyle.backgroundEffect = null
  }

  onLineColorChanged(pkg: any) {
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

  onSlateAISet(pkg: any) {
    this.slate.options.ai = {
      ...(this.slate.options.ai || {}),
      ...pkg.data,
    }
  }

  onSlateNameChanged(pkg: any) {
    this.slate.options.name = pkg.data.name
  }

  onSlateDescriptionChanged(pkg: any) {
    this.slate.options.description = pkg.data.description
  }

  onSlateShowGridChanged(pkg: any) {
    this.slate.options.viewPort.showGrid = pkg.data.showGrid
    if (pkg.data.showGrid) {
      // Show grid
      console.log('Show grid')
    } else {
      // Hide grid
      console.log('Hide grid')
    }
  }

  onSlateMindMapModeChanged(pkg: any) {
    this.slate.options.mindMapMode = pkg.data.mindMapMode
  }

  onSlateAutoResizeNodesBasedOnTextChanged(pkg: any) {
    this.slate.options.autoResizeNodesBasedOnText = pkg.data.autoResizeNodesBasedOnText
  }

  onSlateTagsAndTemplateMarkdownChanged(pkg: any) {
    this.slate.options.tags = pkg.data.tags
    this.slate.options.templateMarkdown = pkg.data.templateMarkdown
    this.slate.options.templatePrompt = pkg.data.templatePrompt
  }

  onSlateTemplateChanged(pkg: any) {
    this.slate.options.isTemplate = pkg.data.isTemplate
  }

  onSlateSnapToObjectsChanged(pkg: any) {
    this.slate.options.viewPort.snapToObjects = pkg.data.snapToObjects
  }

  onSlateFollowMeChanged(pkg: any) {
    this.slate.options.followMe = pkg.data.followMe
  }

  onSlateHuddleChanged(pkg: any) {
    if (pkg.data.huddleType != null) {
      this.slate.options.huddleType = pkg.data.huddleType
    }
    if (pkg.data.huddleEnabled != null) {
      this.slate.options.huddleEnabled = pkg.data.huddleEnabled
    }
  }
}