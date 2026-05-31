# SlateboxJS v1 Integration Research

## Overview
The app.slatebox.com application uses slateboxjs as its core diagramming library. This research documents all integration points that slateboxjs-v2 must support as a drop-in replacement.

---

## 1. INITIALIZATION & BASIC SETUP

### Slate Creation
```javascript
// createSlate.js - main initialization
const slate = await new Slatebox.slate(opts, events).init()
```

### Slate Options
```javascript
{
  id: string,                           // Important for collab init
  name: string,
  description: string,
  defaultLineColor: string,
  viewPort: {
    allowDrag: boolean,
    useInertiaScrolling: boolean,
    showGrid: boolean,
    snapToObjects: boolean,
  },
  showMultiSelect: boolean,
  showUndoRedo: boolean,
  showbirdsEye: boolean,
  showZoom: boolean,
  isSharing: boolean,
  imageFolder: string,                  // '/images/'
  container: string,                    // 'slateCanvas' - DOM element ID
  isEmbedded: boolean,
  enabled: boolean,
  containerStyle: {
    width: string,
    height: string,
    backgroundColor: string,
    backgroundImage: string | null,
    backgroundSize: string,
    backgroundEffect: string | null,
    prevBackgroundColor: string,
    backgroundColorAsGradient: boolean,
    backgroundGradientType: string,     // 'radial' or 'linear'
    backgroundGradientColors: string[],
    backgroundGradientStrategy: string, // 'shades'
  },
  allowCollaboration: boolean,
  huddleType: string,                   // 'audio'
  mindMapMode: boolean,
  autoResizeNodesBasedOnText: boolean,
  isPublic?: boolean,
  isPrivate?: boolean,
  isUnlisted?: boolean,
  layoutType?: {                        // For AI-generated slates
    val: string,                        // 'dot'
    overlap: string,                    // 'scalexy'
    rankdir: string,                    // 'TB'
  },
  createdViaAI?: boolean,
  eligibleForThemeCompilation?: boolean,
  basedOnTemplate?: string,
  themeId?: string,
}
```

### Events Handler
```javascript
const events = {
  onSlateChanged: async (pkg, collabUsers) => {},
  onCollaborationUsersChanged: (users) => {},
  onCollaborationUsersRemoved: (users) => {},
  onCollaboration: async (pkg) => {},
  onInitCollaboration: async (clientID) => {},
  onConfirmRequested: async (title, msg, cb) => {},
  onTakeSnapshot: async (opts) => {},
  onTextPaneRequested: (node, cb) => {},
  onLineMenuRequested: (node, association, cb) => {},
  // ... potentially more
}
```

---

## 2. NODE CREATION & MANAGEMENT

### Node Constructor
```javascript
new Slatebox.node({
  id: string,
  name: string,
  text: string,
  image: string,
  xPos: number,
  yPos: number,
  width: number,
  height: number,
  vectorPath: string,
  shapeHint: string,                  // 'rectangle', 'custom', etc.
  backgroundColor: string,
  fontFamily: string,
  fontSize: string,                   // e.g. '14pt'
  foregroundColor: string,
  lineColor: string,
  lineWidth: number,
  filters: {
    vect?: string,                    // 'postItNote', etc.
    text?: string,                    // 'embossed', etc.
  },
  animations: {
    vect?: string,
    text?: string,
  },
  opacity: number,                    // 0-1
  borderOpacity: number,
  borderColor: string,
  borderStyle: string,                // 'solid', 'dashed', 'dotted', 'combo'
  borderWidth: number,
  borderDisplayOnly: boolean,
  textOpacity: number,
  textXAlign: string,                 // 'start', 'middle', 'end'
  textYAlign: string,
  rotate: {
    rotationAngle: number,
    point: { x: number, y: number },
  },
  groupId: string,
  imageOrigWidth: number,
  imageOrigHeight: number,
  defaultShaped: boolean,
  pinUnderneath: boolean,
  disableDrag: boolean,
  humanTouch: boolean,
  iconFor: string,                    // For icon nodes associated with main node
  
  // Theme/Preset options
  showColorTab?: boolean,
  showTextTab?: boolean,
  showAITab?: boolean,
  showShapeTab?: boolean,
  showImageTab?: boolean,
  showEffectTab?: boolean,
  
  // For style references
  styleNodeId?: string,
}
```

### Adding Nodes
```javascript
slate.nodes.add(node)
slate.nodes.add(node, true, () => {})  // With callback
slate.nodes.add(smallNode, true, () => {
  smallNode.toFront()
})
```

### Node Queries
```javascript
slate.nodes.allNodes                    // Array of all nodes
slate.nodes.one(nodeId)                 // Get single node by ID
slate.nodes.allNodes.find((n) => ...)   // Filter nodes
```

### Node Properties
```javascript
node.options.id
node.options.text
node.options.xPos
node.options.yPos
node.options.width
node.options.height
node.options.backgroundColor
node.options.opacity
node.options.fontSize
node.options.fontFamily
node.options.foregroundColor
node.options.vectorPath
node.options.borderColor
node.options.borderStyle
node.options.borderOpacity
node.options.lineColor
node.options.lineWidth
node.options.textOpacity
node.options.textXAlign
node.options.textYAlign
node.options.filters
node.options.animations
node.options.image
node.options.imageOrigWidth
node.options.imageOrigHeight

// Relationships
node.slate                              // Reference to parent slate
```

### Node Methods
```javascript
node.position('center')                 // Position node in center
node.toFront()                          // Bring to front
node.toBack()                           // Send to back

// Resize functionality (from ai.js)
node.resize.set(width, height)
node.resize.send()
```

---

## 3. COLLABORATION SYSTEM

### Collaboration Invocation
```javascript
// Local execution
slate.collab.invoke(packages)           // Apply changes locally
slate.collab.send(packages)             // Broadcast to other clients
slate.collab.exe(package)               // Execute package
```

### Package Types (Events)
All packages follow format: `{ type: string, data: object, instanceId?: string }`

#### Node-Related Events
- `'onNodeAdded'`
- `'onNodeDeleted'`
- `'onNodeTextChanged'` - data: { id, text, fontSize?, fontColor?, fontFamily?, textXAlign?, textYAlign? }
- `'onNodeColorChanged'` - data: { id, color, opacity? }
- `'onNodeImageChanged'` - data: { id, img, w?, h? }
- `'onNodeBorderPropertiesChanged'` - data: { val, prop }
- `'onNodeShapeChanged'` - data: { id, shape, width?, height? }
- `'onNodeEffectChanged'` - data: { filter: { apply: 'text'|'vect', id: string, isAnimation?: boolean } }
- `'onNodeBehaviorChanged'` - data: { ... }
- `'onNodeLocked'` - data: { id }
- `'onNodeUnlocked'` - data: { id }
- `'onNodeToFront'` - data: { id }
- `'onNodeToBack'` - data: { id }
- `'onNodesMove'` - data: { moves: [{ id, x, y }], dur?: number }, relationships?: [...] }
- `'onNodeAITextChanged'` - For AI content updates

#### Slate-Related Events
- `'onSlateNameChanged'` - Triggers search index rebuild
- `'onSlateDescriptionChanged'` - Triggers search index rebuild
- `'onSlateBackgroundColorChanged'`
- `'onSlateBackgroundImageChanged'`
- `'onSlateBackgroundEffectChanged'`
- `'onSlateThemeChanged'`
- `'onSlateLayoutTypeChanged'`
- `'onSlateMindMapModeChanged'`
- `'onSlateAutoResizeNodesBasedOnTextChanged'`
- `'onSlateShowGridChanged'`
- `'onSlateSnapToObjectsChanged'`
- `'onSlateFollowMeChanged'`
- `'onSlateHuddleChanged'`
- `'onSlateAISet'` - For AI context initialization
- `'onSlateTagsAndTemplateMarkdownChanged'`
- `'onSlateTemplateChanged'`

#### Relationship/Connection Events
- `'addRelationship'` - data: { type: 'association', parent: id, child: id, options?: { lineColor, lineWidth, lineEffect, lineOpacity } }

#### Other Events
- `'onMouseMoved'` - For cursor position tracking
- `'onCanvasMove'`
- `'onCollaborationUserCustomDataChanged'`
- `'onTakeSnapshot'`

### Collab Methods
```javascript
slate.collab.updateUserData({...})
slate.collab.exe(package)
slate.collab.invoke(packages)           // Array of packages
slate.collab.send(packages)
```

---

## 4. SERIALIZATION & PERSISTENCE

### Export/Import
```javascript
// Export to JSON
const json = slate.exportJSON()
const parsed = JSON.parse(json)

// Import from JSON
slate.loadJSON(JSON.stringify(slateData))
```

### Exported Structure
```javascript
{
  options: {
    id: string,
    name: string,
    description: string,
    // ... all options passed in
    searchName: string,                 // Generated from name (edge n-grams)
    searchDescription: string,          // Generated from description
    searchText: string,                 // Generated from all node text
    userId: string,
    orgId: string,
    shareId: string,
  },
  nodes: [
    {
      options: {
        id: string,
        text: string,
        xPos: number,
        yPos: number,
        width: number,
        height: number,
        // ... all node options
      }
    }
  ]
}
```

### Save/Load Integration
```javascript
// saveSlateLite.js
const exportedSlate = JSON.parse(slate.exportJSON())
// Add search indices
exportedSlate.options.searchName = createEdgeNGrams(name)
exportedSlate.options.searchDescription = createEdgeNGrams(description)
exportedSlate.options.searchText = createEdgeNGrams(nodes.map(n => n.options.text).join(' '))
// Persist
await Meteor.callAsync(CONSTANTS.methods.slates.update, { slate: exportedSlate })
```

---

## 5. KEYBOARD & INPUT

### Keyboard Methods
```javascript
slate.keyboard.bindGlobal()             // Enable global keyboard shortcuts
slate.keyboard.unbindGlobal()           // Disable global keyboard shortcuts
```

---

## 6. VIEWPORT & RENDERING

### Viewport Access
```javascript
slate.options.viewPort                  // Access viewport settings
slate.options.viewPort.top
slate.options.viewPort.left
```

### Rendering Methods
```javascript
// Screenshot/Export
slate.png({ base64: true }, (base64) => {
  // Handle base64 image
})

slate.svg((svgContent) => {
  // Handle SVG
})

// Presentation mode
slate.extractPresentationLayout({...})
```

### Canvas Scaling
```javascript
slate.scaleProportionateToSlateFit({ path: vectorPath })
// Returns: { cx, cy, adjustedVectorPath, width, height }
```

### Layout Operations
```javascript
slate.nodes.packageLayout()             // Get layout info for all nodes
slate.nodes.applyLayout({...})          // Apply layout to nodes
slate.nodes.nodeMovePackage({           // Create move package
  dur: 500,
  moves: [{ id, x, y }],
})
slate.removeLayoutOverlaps(true)        // Remove overlapping nodes
```

---

## 7. UTILITY FUNCTIONS

### Slatebox.utils.*
```javascript
Slatebox.utils.guid(length)             // Generate GUID
Slatebox.utils.whiteOrBlack(bgColor)    // Determine contrasting text color
Slatebox.utils.getTextWidth(text, fontStr)  // Get text dimensions
  // Returns: { width, height }
Slatebox.utils.getBBox({ path: vectorPath })  // Get bounding box
  // Returns: { x, y, width, height }
Slatebox.utils._transformPath(path, transformStr)  // Transform vector path
  // Transform string: "T{x},{y} s{scaleX},{scaleY}"
Slatebox.utils.createMultiLineText(text, lineCount)  // Wrap text to lines
Slatebox.utils.randomInt(min, max)     // Random integer
Slatebox.utils.obtainProportionateWidthAndHeightForResizing(...)
  // Complex sizing calculation for custom shapes
Slatebox.utils.buildNodeStyleFromTheme({ theme, childNumber })
  // Build node style from theme
```

---

## 8. AI INTEGRATION PATTERNS

### AI Node Creation
The app heavily uses AI to create nodes. Pattern:
```javascript
const nodeToCreate = {
  id: string,
  description: string,
  xPos?: number,
  yPos?: number,
  width?: number,
  height?: number,
  fontFamily?: string,
  fontSize?: string,
  foregroundColor?: string,
  color?: string,
  image?: string,
  imageOrigWidth?: number,
  imageOrigHeight?: number,
  filter?: string,                      // 'embossed', etc.
  animation?: string,
  rotationAngle?: number,
  opacity?: number,
  borderWidth?: number,
  borderStyle?: string,
  borderOpacity?: number,
  transparent?: boolean,
  defaultShaped?: boolean,
  nouns: string[],                      // Vector paths for icons
  backgroundNoun?: string,              // Large background vector
  isCategory?: boolean,
  isUpdate?: boolean,
  groupId?: string,
  parentCategoryIds?: string[],         // For template positioning
  textLines?: number,
  styleNodeId?: string,                 // Reference to style node
}

// Creation via collaboration
slate.collab.exe(pkg)  // Package executed asynchronously
```

### AI Conversation Nodes
```javascript
await createAIConversationNode(
  nodeToCreate,
  currentAIContext,
  slate,
  defaultLineColor,
  mainNodeId,
  isParent,
  themes,
  templates,
  collaboratorInstanceId
)
```

### AI Context
```javascript
{
  aid: string,                          // AI assist ID
  prompt: string,
  palette: string[],                    // Color palette
  titleFont: string,
  textFont: string,
  isEmbedded: boolean,
  isConversation: boolean,
  categories?: object,                  // Bounding boxes for positioning
  templateCategories?: object,
}
```

---

## 9. THEMING & STYLING

### Theme Support
```javascript
const theme = themes.find(t => t._id === slate.options.themeId)
const themeOpts = Slatebox.utils.buildNodeStyleFromTheme({ theme, childNumber })
// themeOpts contains: { backgroundColor, fontFamily, fontSize, foregroundColor, lineColor, lineWidth }
```

### Preset System
```javascript
const defaultPreset = await Meteor.callAsync(
  CONSTANTS.methods.organizationSettings.getByQuery,
  { type: 'preset', intentionId: 'default' }
)

// Preset structure
{
  value: {
    background: {
      colorValue: string,
      backgroundImage?: string,
      backgroundSize?: string,
      backgroundEffect?: string,
      activeType: 'color' | 'gradient',
      gradientConfig?: {
        baseColorValue: string,
        baseColorKey?: string,
        gradientColors: string[],
        gradientType: string,
        gradientStrategy: string,
      }
    },
    categoryStyles: [{
      backgroundColor: string,
      foregroundColor: string,
    }],
    categoryFont: string,
    categoryFontSize: number,
  }
}
```

---

## 10. FILTERS & EFFECTS

### Available Filters
```javascript
slate.filters.availableFilters // Object of filter definitions
// Structure: { filterId: { display: string, types: string[] } }
// Types include: 'text', 'vect'

slate.filters.availableAnimations // Similar structure for animations
```

### Filter/Animation Application
```javascript
// On node
node.options.filters.text = 'embossed'
node.options.filters.vect = 'postItNote'
node.options.animations.text = 'fadeIn'
```

---

## 11. COMMENTS SYSTEM

### Comment Nodes
```javascript
// Special node property
node.options.isComment = true
```

### Comment Storage
```javascript
await Meteor.callAsync(CONSTANTS.methods.comments.remove, {
  nodeId: nodeId,
  slateId: slateId,
  orgId: orgId,
})
```

---

## 12. UI COMPONENT INTEGRATION

### Node Drawer (Editor)
Opens when user clicks a node, allows editing:
- Text, font, size, alignment
- Colors (background, foreground, border)
- Effects and animations
- Shape and image
- AI properties

### Line Drawer
Opens for editing connections/relationships between nodes

### Slate Drawer
Opens for editing slate-level properties:
- Background, theme
- Layout, grid, snap settings
- Sharing, privacy

---

## 13. CANVAS INTERACTIONS

### Event Handlers Expected
```javascript
// Events object passed to slate init:
{
  onSlateChanged: (pkg, collabUsers) => {},      // Any slate change
  onCollaborationUsersChanged: (users) => {},    // Collaborators joined
  onCollaborationUsersRemoved: (users) => {},    // Collaborators left
  onCollaboration: (pkg) => {},                  // Internal collab events
  onInitCollaboration: (clientID) => {},         // Init collab connection
  onConfirmRequested: (title, msg, cb) => {},    // Confirm dialog
  onTakeSnapshot: (opts) => {},                  // Save snapshot
  onTextPaneRequested: (node, cb) => {},         // Edit node
  onLineMenuRequested: (node, assoc, cb) => {}, // Edit connection
}
```

---

## 14. CRITICAL OPERATIONS

### Move Nodes
```javascript
const pkg = slate.nodes.nodeMovePackage({
  dur: 500,
  moves: [{
    id: nodeId,
    x: moveX,
    y: moveY,
  }],
})
slate.collab.exe({ type: 'onNodesMove', data: pkg })
```

### Delete Node
```javascript
slate.collab.exe({
  type: 'onNodeDeleted',
  data: { id: nodeId, isComment?: boolean },
})
```

### Add Relationship
```javascript
slate.collab.exe({
  type: 'addRelationship',
  data: {
    type: 'association',
    parent: parentNodeId,
    child: childNodeId,
    options: {
      lineOpacity: 0,
      lineEffect: 'postItNote',
      lineWidth: 5,
      lineColor: defaultLineColor,
    },
  },
})
```

---

## 15. IMPORTANT PROPERTIES & ATTRIBUTES

### Required Properties
- Slate must maintain `options.id` for collab system
- Slate must support `shareId` property
- Nodes must maintain unique `options.id`
- All coordinates use xPos, yPos (not x, y)

### Read-Only Properties (Observed)
- `slate.options.eligibleForThemeCompilation` - triggers theme auto-save
- `slate.options.isTemplate`, `isEmbedded` - triggers image capture
- `slate.options.urlName` - for presentation links
- `slate.options.staticImage`, `staticFrameImage` - presentation thumbnails

### Computed Properties
- `slate.options.searchName`, `searchDescription`, `searchText` - for full-text search

---

## 16. RAPHAEL-SPECIFIC CONCERNS

No direct Raphael calls found in app integration layer. SlateboxJS v1 appears to handle all SVG/Raphael interactions internally. V2 should not require any Raphael compatibility.

---

## 17. KNOWN INTEGRATION PATTERNS

### Asynchronous Initialization
```javascript
const slate = await new Slatebox.slate(opts, events).init()
```

### Deferred Relationships
When creating nodes asynchronously, relationships are created after node addition to ensure nodes exist.

### Pause for Async Operations
```javascript
await utils.pause(1000)  // Before creating relationships
```

### Multi-Node Selection
The app supports selecting multiple nodes and applying operations to all.

### Read-Only / Comment-Only Access
The slate respects `accessLevel` settings and disables certain operations.

---

## 18. POTENTIAL MISSING FEATURES IN RESEARCH

- Exact keyboard shortcut bindings
- Complete filter/effect implementation details
- Presentation mode specifics
- Huddle/collaboration audio details
- Drag/drop file upload handling
- Copy/paste functionality
- Undo/Redo implementation
- Birds Eye view specifics

These should be investigated in v1 source code or through additional testing.

---

## CRITICAL COMPATIBILITY REQUIREMENTS

1. **Must support** all event handler types in Canvas.jsx
2. **Must maintain** exact API for slate and node creation
3. **Must serialize** identically for JSON import/export
4. **Must support** collaboration packages exactly as documented
5. **Must provide** all Slatebox.utils functions
6. **Must maintain** backward compatibility with eventhandlers
7. **Should preserve** internal state for themes/presets
8. **Should handle** AI node creation patterns

---

