# SlateboxJS

SlateboxJS 3 is the modern, MIT-licensed Slatebox diagramming engine. It is a ground-up TypeScript and SVG.js rewrite with draggable nodes, an infinite pan/zoom canvas, connectors, groups, collaboration, presentation, serialization, export, and a compatibility facade for applications built against SlateboxJS 2.x.

## ✨ Features

- **Modern Architecture**: Built with TypeScript, svg.js, and Vite
- **Self-Contained**: All plugins bundled (svg.connectable.js vendored in-tree — no external dependencies beyond npm) 
- **Draggable Nodes**: Full drag-and-drop support using svg.draggable.js
- **Pan & Zoom Canvas**: Mouse wheel zoom, drag to pan, with zoom controls
- **Resize & Rotate Nodes**: Interactive resize handles and rotation controls
- **Multiple Shapes**: Rectangle, circle, and ellipse node shapes
- **Responsive Design**: SVG-based with responsive viewbox support
- **External Integration**: Complete invoker contract for external tool integration
- **Node Management**: Comprehensive node creation, modification, and removal
- **Customizable**: Extensive styling and behavior options
- **Performance Optimized**: Uses modern web standards and efficient rendering

## 🚀 Quick Start

### Installation

```bash
npm install slateboxjs
```

### Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
    <title>SlateboxJS Demo</title>
    <link rel="stylesheet" href="node_modules/slateboxjs/dist/slateboxjs.css">
</head>
<body>
    <div id="slate-container" style="width: 100%; height: 100vh;"></div>
    
    <script type="module">
        import SlateboxJS from 'slateboxjs'
        import 'slateboxjs/style.css'
        
        // Create a new slate
        const slate = SlateboxJS('#slate-container', {
            viewPort: {
                originalWidth: 800,
                originalHeight: 600
            },
            panZoom: {
                enabled: true,
                minZoom: 0.1,
                maxZoom: 5
            }
        })
        
        // Add a draggable node
        const node = slate.addNode({
            id: 'node1',
            x: 100,
            y: 100,
            width: 120,
            height: 80,
            text: 'Hello World',
            backgroundColor: '#4ecdc4',
            shape: 'rectangle'
        })
        
        // Click to select — enables resize/rotate handles automatically
        // Shift+click to multi-select, drag on canvas to marquee-select
    </script>
</body>
</html>
```

### Migrating an existing SlateboxJS 2.x application

Version 3 retains the historical named `Slatebox` namespace as a migration layer. Existing code can keep its constructor and serialized-data shapes while the host moves to the modern engine:

```js
import { Slatebox } from 'slateboxjs'
import 'slateboxjs/style.css'

const slate = await new Slatebox.slate(options, events).init()
const node = new Slatebox.node({
  id: 'welcome',
  xPos: 100,
  yPos: 100,
  text: 'Welcome!',
})

slate.nodes.add(node)
const persisted = slate.exportJSON()
```

The facade maps the 2.x runtime namespace, constructors, event packages, `xPos`/`yPos` serialization, node relationships, collaboration calls, and commonly used utilities onto version 3. New integrations should prefer the typed `SlateboxJS`, `Slate`, and `Node` APIs. See [`docs/drop-in-contract.md`](docs/drop-in-contract.md) for the audited compatibility surface and [`docs/meteor-swap.md`](docs/meteor-swap.md) for the host migration procedure.

## 📖 API Reference

### Slate Class

The main class for creating and managing the drawing canvas.

```typescript
const slate = new Slate(element, options)
```

#### Constructor Parameters

- `element`: `string | HTMLElement` - The DOM element or selector where the slate will be created
- `options`: `SlateOptions` - Configuration options for the slate

#### Slate Methods

**Node Management:**
- `addNode(options)` - Add a new node to the slate
- `removeNode(id)` - Remove a node by ID
- `getNode(id)` - Get a node by ID
- `getAllNodes()` - Get all nodes in the slate

**Pan/Zoom Controls:**
- `enablePanZoom()` - Enable pan and zoom functionality
- `disablePanZoom()` - Disable pan and zoom
- `enablePan()` - Enable panning only
- `disablePan()` - Disable panning
- `enableZoom()` - Enable zooming only
- `disableZoom()` - Disable zooming
- `pan(point)` - Pan to a specific point
- `panBy(delta)` - Pan by a relative amount
- `zoom(level)` - Zoom to a specific level
- `zoomBy(factor)` - Zoom by a relative factor
- `zoomIn()` - Zoom in one step
- `zoomOut()` - Zoom out one step
- `zoomAtPoint(level, point)` - Zoom to a specific level at a point
- `resetPanZoom()` - Reset both pan and zoom
- `resetZoom()` - Reset zoom only
- `resetPan()` - Reset pan only
- `fitToContent()` - Fit content to visible area
- `centerContent()` - Center content in view
- `getZoom()` - Get current zoom level
- `getPan()` - Get current pan position
- `resizePanZoom()` - Refresh pan/zoom after resize

### Node Class

Represents a draggable node on the slate.

#### Node Properties

```typescript
interface NodeOptions {
  id: string
  x?: number              // X position (default: 50)
  y?: number              // Y position (default: 50)
  width?: number          // Width (default: 100)
  height?: number         // Height (default: 60)
  text?: string           // Display text (default: 'Node')
  fontSize?: number       // Font size (default: 14)
  fontFamily?: string     // Font family (default: 'Arial, sans-serif')
  fontColor?: string      // Text color (default: '#000000')
  backgroundColor?: string // Background color (default: '#f0f0f0')
  borderColor?: string    // Border color (default: '#cccccc')
  borderWidth?: number    // Border width (default: 1)
  allowDrag?: boolean     // Enable dragging (default: true)
  isLocked?: boolean      // Lock the node (default: false)
  shape?: 'rectangle' | 'circle' | 'ellipse' // Node shape
  resizeRotate?: {        // Resize/rotate options
    resizeEnabled?: boolean
    rotateEnabled?: boolean
    preserveAspectRatio?: boolean
    aroundCenter?: boolean
    grid?: number
    degree?: number
  }
}
```

#### Node Methods

**Basic Operations:**
- `position(x, y, callback?, easing?, duration?)` - Move the node
- `setText(text)` - Update node text
- `setSize(width, height)` - Update node dimensions
- `setColors(backgroundColor?, borderColor?)` - Update node colors
- `lock()` - Lock the node (disable dragging)
- `unlock()` - Unlock the node (enable dragging)
- `toFront()` - Bring node to front
- `toBack()` - Send node to back
- `remove()` - Remove the node

**Resize/Rotate Operations:**
- `enableResizeRotate()` - Enable both resize and rotate
- `disableResizeRotate()` - Disable both resize and rotate
- `enableResize()` - Enable resize only
- `disableResize()` - Disable resize
- `enableRotate()` - Enable rotate only
- `disableRotate()` - Disable rotate
- `isResizeRotateEnabled()` - Check if resize/rotate is enabled
- `setRotation(angle)` - Set rotation angle
- `getRotation()` - Get current rotation angle

### Pan/Zoom Options

```typescript
interface PanZoomOptions {
  enabled?: boolean              // Enable/disable pan/zoom (default: true)
  panEnabled?: boolean           // Enable panning (default: true)
  zoomEnabled?: boolean          // Enable zooming (default: true)
  controlIconsEnabled?: boolean  // Show zoom slider controls (default: true)
  zoomControls?: boolean         // Zoom control buttons (default: false)
  dblClickZoomEnabled?: boolean  // Double-click to zoom (default: true)
  mouseWheelZoomEnabled?: boolean // Mouse wheel zoom (default: true)
  zoomScaleSensitivity?: number  // Zoom sensitivity (default: 0.2)
  minZoom?: number              // Minimum zoom level (default: 0.1)
  maxZoom?: number              // Maximum zoom level (default: 10)
  fit?: boolean                 // Fit to content initially (default: false)
  center?: boolean              // Center content initially (default: false)
  onPan?: (event) => void       // Pan event callback
  onZoom?: (event) => void      // Zoom event callback
}
```

### Connection Options

```typescript
interface ConnectorOptions {
  enabled?: boolean              // Enable connections (default: true)
  lineColor?: string             // Default line color
  lineWidth?: number             // Default line width
  showParentArrow?: boolean      // Show arrow at parent end
  showChildArrow?: boolean       // Show arrow at child end
}

// Create a connection between two nodes
slate.nodes.one('node1')?.connector?.connectTo(
  slate.nodes.one('node2'),
  { lineColor: '#ff6b6b', lineWidth: 3 }
)
```

### Theme System

```typescript
interface ThemeOptions {
  themeId?: string
  // Theme defines node type styles, colors, fonts
}

// Apply a theme
slate.applyTheme({ /* theme object */ })
```

### Serialization

```typescript
// Export to JSON
const json = slate.exportJSON()

// Import from JSON
await slate.loadJSON(json)

// Snapshot for undo/redo
const snap = slate.snapshot()
```

### Invoker Contract

SlateboxJS 3 implements the complete host-integration invoker contract. All audited `onXXXX` methods used by the Slatebox application are supported:

```javascript
// External tools can invoke these methods
slate.invoker.onNodeAdded({ data: { nodeOptions: {...} } })
slate.invoker.onNodePositioned({ data: { id: 'node1', location: { x: 200, y: 150 } } })
slate.invoker.onNodeDeleted({ data: { id: 'node1' } })
slate.invoker.onNodeResized({ data: { id: 'node1', width: 200, height: 100 } })
slate.invoker.onNodeRotated({ data: { id: 'node1', rotate: { rotationAngle: 45 } } })
// ... and many more
```

## 🎨 Examples

### Creating Nodes with Pan/Zoom

```javascript
// Create slate with pan/zoom
const slate = SlateboxJS('#canvas', {
  panZoom: {
    enabled: true,
    controlIconsEnabled: true,
    minZoom: 0.1,
    maxZoom: 10
  }
})

// Add resizable/rotatable node
const node = slate.addNode({
  id: 'interactive-node',
  x: 200,
  y: 200,
  width: 150,
  height: 100,
  text: 'Resize & Rotate Me!',
  backgroundColor: '#ff6b6b',
  resizeRotate: {
    resizeEnabled: true,
    rotateEnabled: true,
    preserveAspectRatio: false,
    grid: 10 // Snap to 10px grid
  }
})

// Enable interactions
node.enableResizeRotate()
```

### Advanced Canvas Controls

```javascript
// Pan to specific location
slate.pan({ x: 100, y: 100 })

// Zoom to specific level at point
slate.zoomAtPoint(2.0, { x: 400, y: 300 })

// Animate pan with easing
slate.getAllNodes().forEach((node, index) => {
  setTimeout(() => {
    node.position(index * 100, 200, undefined, 'ease-out', 500)
  }, index * 100)
})

// Listen for pan/zoom events
slate.panZoom.options.onZoom = (zoom) => {
  console.log('Current zoom level:', zoom)
}

slate.panZoom.options.onPan = (pan) => {
  console.log('Current pan position:', pan)
}
```

### Keyboard Shortcuts

```javascript
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey || e.metaKey) {
    switch(e.key) {
      case '+':
        e.preventDefault()
        slate.zoomIn()
        break
      case '-':
        e.preventDefault()
        slate.zoomOut()
        break
      case '0':
        e.preventDefault()
        slate.resetZoom()
        break
    }
  }
})
```

## 🧪 Testing

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run a single test file
npx vitest run tests/unit/Node.test.ts

# Run end-to-end tests
npm run test:e2e

# Run all tests (unit + e2e)
npm run test:all
```

## 🛠️ Development

### Building from Source

```bash
# Clone the repository
git clone [repository-url]
cd slateboxjs

# Install dependencies
npm install

# Build the library (ESM + CJS + types + CSS)
npm run build

# Development server with hot reload
npm run dev

# TypeScript type checking
npx tsc --noEmit

# Run all unit tests
npm test
```

### Build Output

| Artifact | Format | Path |
|---|---|---|
| ESM bundle | ES Module | `dist/slateboxjs.mjs` |
| CJS bundle | CommonJS | `dist/slateboxjs.js` |
| TypeScript types | `.d.ts` | `dist/index.d.ts` |
| Styles | CSS | `dist/slateboxjs.css` |

### Project Structure

```
slateboxjs/
├── src/
│   ├── core/
│   │   ├── Slate.ts              # Main slate orchestrator
│   │   ├── Node.ts               # Node class (shape + text or SVG content)
│   │   ├── NodesManager.ts       # Node collection CRUD
│   │   ├── Invoker.ts            # External integration contract
│   │   ├── PanZoom.ts            # Pan/zoom functionality
│   │   ├── ResizeRotate.ts       # Resize/rotate handles
│   │   ├── Connector.ts          # Node connections/lines
│   │   ├── MultiSelection.ts     # Shift-click + drag-select
│   │   ├── Keyboard.ts           # Keyboard shortcuts
│   │   ├── BirdsEye.ts           # Mini-map overview
│   │   ├── Grid.ts               # Snap-to-grid and grid rendering
│   │   ├── Editor.ts             # Inline text editing
│   │   ├── UndoRedo.ts           # Snapshot-based undo/redo
│   │   ├── Serialization.ts      # JSON save/load
│   │   ├── Export.ts             # SVG/PNG/PDF export
│   │   ├── Theme.ts              # Theming system
│   │   ├── ShapeRegistry.ts      # Shape type definitions
│   │   ├── Relationship.ts       # Node relationship management
│   │   ├── Relationships.ts      # Association collection
│   │   ├── Collab.ts             # Real-time collaboration
│   │   ├── Comments.ts           # Annotation/comment system
│   │   ├── Filters.ts            # SVG filters (drop-shadow, blur)
│   │   ├── FontLoader.ts         # External font loading
│   │   ├── Images.ts             # Image node support
│   │   ├── Layout.ts             # Layout algorithms
│   │   ├── Links.ts              # URL/click-through links
│   │   ├── Menu.ts               # Context menu
│   │   ├── Presentation.ts       # Step-by-step presentation
│   │   ├── ZoomSlider.ts         # Zoom level slider UI
│   │   └── compat.ts             # v1 API compatibility shim
│   ├── styles/
│   │   └── slateboxjs.css        # Core styles
│   └── index.ts                  # Main entry point
├── tests/
│   ├── unit/                     # 22 files, 840+ unit tests
│   └── e2e/                      # 10 spec files, 56 e2e tests
├── dist/                         # Built library files
├── index.html                    # Basic demo
├── advanced-demo.html            # Advanced feature demo
├── example.html                  # Simple usage example
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── playwright.config.ts
└── README.md
```

## 🔧 Configuration

### Slate Options

```typescript
interface SlateOptions {
  name?: string
  description?: string
  followMe?: boolean
  mindMapMode?: boolean
  autoResizeNodesBasedOnText?: boolean
  viewPort?: {
    originalWidth?: number
    originalHeight?: number
    showGrid?: boolean
    snapToObjects?: boolean
  }
  containerStyle?: {
    backgroundColor?: string
    backgroundImage?: string
    // ... more style options
  }
  panZoom?: PanZoomOptions
  connector?: ConnectorOptions
  keyboard?: { enabled?: boolean }
  grid?: { enabled?: boolean; size?: number }
  birdsEye?: { enabled?: boolean }
  multiSelection?: { enabled?: boolean }
  undoRedo?: { enabled?: boolean; maxHistory?: number }
  collab?: { enabled?: boolean; roomName?: string }
  events?: {
    onNodeClick?: (node) => void
    onNodeDblClick?: (node) => void
    onSelectionChanged?: (nodes) => void
    onTakeSnapshot?: (action) => void
    // ... more event hooks
  }
}
```

## 🎯 Interactive Features

### Mouse/Touch Controls

- **Pan**: Click and drag on empty canvas area, two-finger drag on trackpad
- **Zoom**: Mouse wheel, Ctrl+scroll on trackpad, pinch on touch devices
- **Node Drag**: Click and drag any unlocked node
- **Node Resize**: Select node, then drag corner handles
- **Node Rotate**: Select node, then drag green rotation handle
- **Multi-Select**: Shift+click nodes or click-drag on empty canvas
- **Double-click**: Quick zoom (if enabled)
- **Undo/Redo**: Ctrl+Z / Ctrl+Y
- **Delete**: Delete or Backspace key on selected nodes
- **Copy**: Ctrl+C on selected nodes (if multi-selection enabled)
### Visual Feedback

- **Hover Effects**: Nodes and controls highlight on hover
- **Selection Indicators**: Blue dashed border around selected nodes
- **Resize Handles**: Blue corner and edge handles for resizing
- **Rotation Handle**: Green circular handle for rotation
- **Zoom Controls**: Top-right corner zoom in/out buttons
- **Grid Snapping**: Optional snap-to-grid during resize/move

## 🚀 Performance

- **Optimized Rendering**: Uses SVG hardware acceleration
- **Efficient Updates**: Only re-renders changed elements
- **Memory Management**: Proper cleanup on node removal
- **Large Diagrams**: Pan/zoom enables handling of large content
- **Smooth Animations**: CSS transitions and requestAnimationFrame

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built on top of [svg.js](https://svgjs.dev/) and its ecosystem
- Pan/zoom powered by [@svgdotjs/svg.panzoom.js](https://github.com/svgdotjs/svg.panzoom.js)
- Resize/rotate using [@svgdotjs/svg.select.js](https://github.com/svgdotjs/svg.select.js) and [@svgdotjs/svg.resize.js](https://github.com/svgdotjs/svg.resize.js)
- Inspired by the original SlateboxJS library
- Uses [Vite](https://vitejs.dev/) for modern build tooling

## 🔗 Collaboration Setup (Collab.ts)

SlateboxJS 3 supports real-time collaboration via [Yjs](https://yjs.dev/) and [y-websocket](https://github.com/yjs/y-websocket). The `Collab` module requires these peer dependencies:

```bash
npm install yjs y-websocket
```

### Starting a local collab server

The production collab server (`collab.slatebox.com`) uses HMAC/MongoDB authentication. For local development and testing, enable dev mode:

1. **Edit `../collab.slatebox.com/bin/server.js`** — add the following check:
   ```js
   const devMode = process.env.COLLAB_DEV_MODE === "1";
   // In the upgrade handler, before authenticate:
   if (devMode) {
     wss.handleUpgrade(request, socket, head, (ws) => {
       wss.emit("connection", ws, request);
     });
     return;
   }
   ```

2. **Start the dev server:**
   ```bash
   cd ../collab.slatebox.com
   COLLAB_DEV_MODE=1 PORT=1234 npm start
   ```

3. **Connect from your application:**
   ```ts
   import { SlateboxJS } from 'slateboxjs';
   const slate = SlateboxJS('#container');
   await slate.collab.init({
     wsUrl: 'ws://localhost:1234',
     roomName: 'my-room',
     userName: 'Alice'
   });
   // isConnected will update via WebSocket status event
   ```

### Running collab e2e tests

```bash
# Terminal 1: start the test server
COLLAB_DEV_MODE=1 PORT=1234 node ../collab.slatebox.com/bin/server.js

# Terminal 2: run collab tests
npx playwright test tests/e2e/collab.spec.ts --project=chromium
```

## 📞 Support

For questions, issues, or contributions, please visit the [SlateboxJS repository](https://github.com/Slatebox/slateboxjs-v2).

---

**SlateboxJS 3** — the modern diagramming engine for Slatebox and embeddable web applications.
