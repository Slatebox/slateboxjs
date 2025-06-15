# SlateboxJS v2

A modern, ground-up rewrite of a diagramming library built with svg.js and Vite. SlateboxJS v2 provides a powerful, flexible platform for creating interactive diagrams with draggable nodes, pan/zoom functionality, and advanced node manipulation capabilities.

## ✨ Features

- **Modern Architecture**: Built with TypeScript, svg.js, and Vite
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
npm install slateboxjs-v2
```

### Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
    <title>SlateboxJS Demo</title>
    <link rel="stylesheet" href="node_modules/slateboxjs-v2/dist/slateboxjs.css">
</head>
<body>
    <div id="slate-container"></div>
    
    <script type="module">
        import SlateboxJS from 'slateboxjs-v2'
        
        // Create a new slate with pan/zoom enabled
        const slate = SlateboxJS('#slate-container', {
            viewPort: {
                originalWidth: 800,
                originalHeight: 600
            },
            panZoom: {
                enabled: true,
                controlIconsEnabled: true,
                zoomScaleSensitivity: 0.1,
                minZoom: 0.1,
                maxZoom: 5
            }
        })
        
        // Add a draggable, resizable node
        const node = slate.addNode({
            id: 'node1',
            x: 100,
            y: 100,
            width: 120,
            height: 80,
            text: 'Hello World',
            backgroundColor: '#4ecdc4',
            shape: 'rectangle',
            resizeRotate: {
                resizeEnabled: true,
                rotateEnabled: true
            }
        })
        
        // Enable resize/rotate for this node
        node.enableResizeRotate()
    </script>
</body>
</html>
```

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
  controlIconsEnabled?: boolean  // Show zoom controls (default: true)
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

### Invoker Contract

SlateboxJS v2 implements a complete invoker contract for external tool integration. All `onXXXX` methods from the original requirements are supported:

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

## 🛠️ Development

### Building from Source

```bash
# Clone the repository
git clone [repository-url]
cd slateboxjs-v2

# Install dependencies
npm install

# Build the library
npm run build

# Start development server
npm run dev
```

### Project Structure

```
slateboxjs-v2/
├── src/
│   ├── core/
│   │   ├── Slate.ts          # Main slate class
│   │   ├── Node.ts           # Node class
│   │   ├── NodesManager.ts   # Node collection management
│   │   ├── Invoker.ts        # External integration contract
│   │   ├── PanZoom.ts        # Pan/zoom functionality
│   │   └── ResizeRotate.ts   # Resize/rotate functionality
│   ├── styles/
│   │   └── slateboxjs.css    # Core styles for UI components
│   └── index.ts              # Main entry point
├── dist/                     # Built library files
├── index.html                # Basic demo
├── advanced-demo.html        # Advanced demo with all features
├── example.html              # Simple usage example
├── package.json
├── tsconfig.json
├── vite.config.ts
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
  panZoom?: PanZoomOptions     // Pan/zoom configuration
  // ... more options
}
```

## 🎯 Interactive Features

### Mouse/Touch Controls

- **Pan**: Click and drag on empty canvas area
- **Zoom**: Mouse wheel up/down, pinch on touch devices
- **Node Drag**: Click and drag any unlocked node
- **Node Resize**: Enable resize, then drag corner handles
- **Node Rotate**: Enable rotate, then drag rotation handle
- **Double-click**: Quick zoom (if enabled)

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
- Pan/zoom powered by [svg-pan-zoom](https://github.com/bumbu/svg-pan-zoom)
- Resize/rotate using [@svgdotjs/svg.select.js](https://github.com/svgdotjs/svg.select.js) and [@svgdotjs/svg.resize.js](https://github.com/svgdotjs/svg.resize.js)
- Inspired by the original SlateboxJS library
- Uses [Vite](https://vitejs.dev/) for modern build tooling

## 📞 Support

For questions, issues, or contributions, please visit our [GitHub repository](https://github.com/your-username/slateboxjs-v2).

---

**SlateboxJS v2** - Creating the future of web-based diagramming tools with advanced interaction capabilities.
