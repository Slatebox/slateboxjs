# SlateboxJS v2

A modern, ground-up rewrite of a diagramming library built with svg.js and Vite. SlateboxJS v2 provides a powerful, flexible platform for creating interactive diagrams with draggable nodes and extensive customization options.

## ✨ Features

- **Modern Architecture**: Built with TypeScript, svg.js, and Vite
- **Draggable Nodes**: Full drag-and-drop support using svg.draggable.js
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
</head>
<body>
    <div id="slate-container"></div>
    
    <script type="module">
        import SlateboxJS from 'slateboxjs-v2'
        
        // Create a new slate
        const slate = SlateboxJS('#slate-container', {
            viewPort: {
                originalWidth: 800,
                originalHeight: 600
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

- `addNode(options)` - Add a new node to the slate
- `removeNode(id)` - Remove a node by ID
- `getNode(id)` - Get a node by ID
- `getAllNodes()` - Get all nodes in the slate

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
}
```

#### Node Methods

- `position(x, y, callback?, easing?, duration?)` - Move the node
- `setText(text)` - Update node text
- `setSize(width, height)` - Update node dimensions
- `setColors(backgroundColor?, borderColor?)` - Update node colors
- `lock()` - Lock the node (disable dragging)
- `unlock()` - Unlock the node (enable dragging)
- `toFront()` - Bring node to front
- `toBack()` - Send node to back
- `remove()` - Remove the node

### Invoker Contract

SlateboxJS v2 implements a complete invoker contract for external tool integration. All `onXXXX` methods from the original requirements are supported:

```javascript
// External tools can invoke these methods
slate.invoker.onNodeAdded({ data: { nodeOptions: {...} } })
slate.invoker.onNodePositioned({ data: { id: 'node1', location: { x: 200, y: 150 } } })
slate.invoker.onNodeDeleted({ data: { id: 'node1' } })
// ... and many more
```

## 🎨 Examples

### Creating Different Node Shapes

```javascript
// Rectangle node
slate.addNode({
  id: 'rect1',
  shape: 'rectangle',
  text: 'Rectangle',
  backgroundColor: '#ff6b6b'
})

// Circle node
slate.addNode({
  id: 'circle1',
  shape: 'circle',
  text: 'Circle',
  backgroundColor: '#4ecdc4'
})

// Ellipse node
slate.addNode({
  id: 'ellipse1',
  shape: 'ellipse',
  text: 'Ellipse',
  backgroundColor: '#45b7d1'
})
```

### Dynamic Node Management

```javascript
// Add nodes programmatically
const nodes = []
for (let i = 0; i < 5; i++) {
  const node = slate.addNode({
    id: `node_${i}`,
    x: i * 150 + 50,
    y: 100,
    text: `Node ${i + 1}`,
    backgroundColor: `hsl(${i * 60}, 70%, 70%)`
  })
  nodes.push(node)
}

// Lock all nodes
nodes.forEach(node => node.lock())

// Clear all nodes
slate.nodes.clear()
```

### Using the Invoker Contract

```javascript
// External tool integration
const externalToolData = {
  data: {
    nodeOptions: {
      id: 'external_node',
      x: 200,
      y: 200,
      text: 'From External Tool',
      backgroundColor: '#96ceb4'
    }
  }
}

slate.invoker.onNodeAdded(externalToolData)
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
│   │   └── Invoker.ts        # External integration contract
│   └── index.ts              # Main entry point
├── dist/                     # Built library files
├── index.html                # Demo page
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
  // ... more options
}
```

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
- Inspired by the original SlateboxJS library
- Uses [Vite](https://vitejs.dev/) for modern build tooling

## 📞 Support

For questions, issues, or contributions, please visit our [GitHub repository](https://github.com/your-username/slateboxjs-v2).

---

**SlateboxJS v2** - Creating the future of web-based diagramming tools.
