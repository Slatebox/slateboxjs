# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SlateboxJS v2 is a modern diagramming library built with TypeScript, SVG.js 3+, and Vite. It provides draggable nodes, pan/zoom functionality, resize/rotate capabilities, and node connections for creating interactive diagrams.

## Development Commands

### Build and Development
```bash
npm run build              # Build library (always run after code changes)
npm run build:types        # Generate TypeScript declarations
npm run dev                # Start Vite dev server (http://localhost:3000)
npm start                  # Alias for dev server
npm run preview            # Preview production build
```

### Testing
```bash
npm test                   # Run unit tests (Vitest)
npm run test:watch         # Run tests in watch mode
npm run test:e2e           # Run e2e tests (Playwright)
npm run test:e2e:ui        # Run e2e tests with UI
npm run test:all           # Run all tests
```

## Core Architecture

### Main Classes and Responsibilities

**Slate** (`src/core/Slate.ts`)
- Main container class that orchestrates the entire diagramming system
- Manages the root SVG canvas using SVG.js
- Handles global selection state and coordinates between nodes
- Initializes pan/zoom, coordinate display, and viewport management
- **Selection orchestrator**: Single source of truth for which nodes are selected and which have resize/rotate enabled
- **CRITICAL**: Slate controls resize/rotate enabling through `updateSelectionResizeRotate()` - nodes delegate to Slate, never manage directly

**Node** (`src/core/Node.ts`)
- Represents individual diagram nodes (shapes, text, SVG content)
- Uses SVG.js groups to bundle background shape, text/content, and interaction handles
- Supports three shape types: rectangle, circle, ellipse
- Can render either text content or custom SVG content (mutually exclusive)
- Delegates resize/rotate control to Slate via `slate.enableNodeResizeRotate()` and `slate.disableNodeResizeRotate()`
- Uses position-based click detection (pointerdown/pointerup) to distinguish clicks from drags

**NodesManager** (`src/core/NodesManager.ts`)
- Collection manager for all nodes in a slate
- Handles node lifecycle (add, remove, lookup)
- Provides iteration and filtering methods

**ResizeRotate** (`src/core/ResizeRotate.ts`)
- Encapsulates resize/rotate functionality using `@svgdotjs/svg.select.js` and `@svgdotjs/svg.resize.js`
- Isolated class pattern - owned by Node but managed by Slate
- Handles both text nodes and SVG content nodes differently during rotation

**PanZoom** (`src/core/PanZoom.ts`)
- Pan and zoom functionality using `@svgdotjs/svg.panzoom.js`
- **Trackpad-friendly**: Two-finger scroll = panning (natural direction), Ctrl+scroll = zooming, pinch = fine-grained zoom
- Custom wheel handling for better gesture control
- Works directly with root canvas (no complex viewport nesting)

**Connector** (`src/core/Connector.ts`)
- Node connection functionality using local upgraded `svg.connectable.js`
- Manages connections between nodes with lines/arrows
- Global line and marker containers stored on Slate

**Invoker** (`src/core/Invoker.ts`)
- External integration contract implementing all `onXXXX` methods
- Allows external tools to manipulate the slate/nodes programmatically
- Maps external commands to internal node/slate operations

### Critical Selection and Resize/Rotate Pattern

**NEVER implement individual node-level resize/rotate enabling.** The architecture follows a centralized orchestration pattern:

1. **Slate is the orchestrator**: Only `Slate.updateSelectionResizeRotate()` enables/disables resize/rotate
2. **Nodes delegate upward**: `node.enableResizeRotate()` calls `slate.enableNodeResizeRotate(this)` which calls `slate.selectNodes([node])`
3. **Single source of truth**: `Slate.selectedNodes` array determines what's selected
4. **Automatic management**: When selection changes (click, drag, multi-select), Slate automatically:
   - Disables ALL resize/rotate on ALL nodes
   - Enables resize/rotate only on selected node(s)
   - Enables connection handles only on single selected node

This prevents conflicts between multiple active resize/rotate controllers.

### Content Type Duality

Nodes support two mutually exclusive content types:

**Text Content** (default):
- `this.textElement` exists and contains Text element
- `this.nestedSvg` is undefined
- Text is centered within background shape
- Methods like `centerText()` are active

**SVG Content** (when `options.svgContent` provided):
- `this.nestedSvg` exists and contains nested SVG
- `this.textElement` is undefined
- Background is transparent (`backgroundColor: "none"`)
- SVG scales using `viewBox` and `preserveAspectRatio`
- Text methods do early return

**Always guard methods that assume one or the other:**
```typescript
if (!this.textElement) return; // Skip for SVG content
if (this.nestedSvg) { /* handle SVG */ }
```

## Plugin Ecosystem

### Official SVG.js 3+ Plugins (Use These)
- `@svgdotjs/svg.js` - Core library (v3.2.4)
- `@svgdotjs/svg.draggable.js` - Drag functionality
- `@svgdotjs/svg.panzoom.js` - Pan/zoom (replaces standalone svg-pan-zoom)
- `@svgdotjs/svg.select.js` - Selection handles
- `@svgdotjs/svg.resize.js` - Resize functionality (works well)

### Local/Legacy Plugins
- `svg.connectable.js` - **Local upgraded version** at `file:../svg.connectable.js`, now compatible with SVG.js 3+

### Plugin Loading Pattern
In `src/index.ts`, plugins are loaded in specific order, and SVG is exposed globally for legacy compatibility:
```typescript
import { SVG } from '@svgdotjs/svg.js'
import '@svgdotjs/svg.draggable.js'
import '@svgdotjs/svg.select.js'
import '@svgdotjs/svg.resize.js'
import '@svgdotjs/svg.panzoom.js'

if (typeof window !== 'undefined') {
  (window as any).SVG = SVG;
}

import 'svg.connectable.js'
```

## Development Principles

### 1. Always Use SVG.js Native Methods
Never implement custom SVG manipulations. Use built-in transforms like `size()`, `move()`, `rotate()`, `scale()`. Leverage SVG standards like `viewBox` and `preserveAspectRatio` for scaling.

**Example:**
```typescript
// ✅ Do: Use native SVG standards
nested.viewbox(bb.x, bb.y, bb.width, bb.height);
nested.node.setAttribute('preserveAspectRatio', 'xMidYMid meet');

// ❌ Don't: Custom transform calculations
content.transform({ scale: scale, translate: [offsetX, offsetY] });
```

### 2. Store Element References
Store references to SVG elements as class properties instead of searching the DOM repeatedly:
```typescript
this.nestedSvg = this.svgGroup.nested().size(w, h);
this.textElement = this.svgGroup.text(text!);
```

### 3. Defensive Programming
Always guard against undefined elements since nodes can have either text OR SVG content:
```typescript
private centerText() {
  if (!this.textElement) return; // Skip for SVG content nodes
  // ... rest of method
}
```

### 4. Consistent Debug Logging
Use filterable debug strings with consistent prefixes:
- Format: `COMPONENT_ACTION_DEBUG: description`
- Examples: `NODE_DEBUG`, `SELECTION_DEBUG`, `CONNECTOR_DEBUG`, `PANZOOM_DEBUG`, `VIEWPORT_DEBUG`

```typescript
console.log("NODE_DEBUG: finishCreate started for", this.id);
console.log("SELECTION_DEBUG: Node selected", this.id);
```

### 5. Isolated Class Pattern
For new features, create isolated classes following the ResizeRotate/Connector pattern:
- Constructor takes `node` and `options`
- Has `enable()`, `disable()`, `isEnabled()`, `updateOptions()` methods
- Integrates into Node class with delegation methods
- Exported in `src/index.ts` and added to window globals

## Pan/Zoom Architecture

Uses `@svgdotjs/svg.panzoom.js` which works directly with the root canvas - no complex viewport nesting needed.

**Viewport access** is simple:
```typescript
public getViewport(): any {
  return this.canvas; // SVG.js panzoom works with root canvas
}
```

**Custom wheel handling** provides trackpad-friendly gestures:
- Two-finger scroll: Panning in natural direction
- Ctrl+scroll: Zooming
- Pinch: Fine-grained zoom (30% sensitivity)

## Testing

Tests use Vitest (unit) and Playwright (e2e):
- Unit tests: `tests/unit/*.test.ts`
- E2e tests: `tests/e2e/*.spec.ts`
- Setup: `tests/setup.ts` (jsdom configuration)

Run single test file:
```bash
npx vitest run tests/unit/Node.test.ts
```

## File Structure

```
src/
├── core/
│   ├── Slate.ts          # Main orchestrator, selection manager
│   ├── Node.ts           # Node class with content type handling
│   ├── NodesManager.ts   # Node collection management
│   ├── Invoker.ts        # External integration API
│   ├── PanZoom.ts        # Pan/zoom with trackpad gestures
│   ├── ResizeRotate.ts   # Resize/rotate isolation class
│   └── Connector.ts      # Connection functionality
├── styles/
│   └── slateboxjs.css    # Core UI styles
└── index.ts              # Main entry, plugin loading, exports
```

## Common Patterns

### Adding New Functionality
1. Create isolated class (e.g., `MyFeature.ts`) following ResizeRotate pattern
2. Add to Node: `public myFeature!: MyFeature;`
3. Initialize in `Node.finishCreate()`: `this.myFeature = new MyFeature(this, this.options.myFeature);`
4. Add delegation methods to Node: `public enableMyFeature() { this.myFeature.enable(); }`
5. Export in `src/index.ts`: `export { MyFeature } from './core/MyFeature'`
6. Add to window globals in `src/index.ts`

### Handling SVG Content vs Text
```typescript
// Check content type
const hasSvg = !!this.options.svgContent;

// Guard text-specific methods
if (!this.textElement) return;

// Handle rotation differently
if (this.textElement?.rotate) {
  this.textElement.rotate(angle, bbox.cx, bbox.cy);
} else if (this.nestedSvg?.rotate) {
  this.nestedSvg.rotate(angle, bbox.cx, bbox.cy);
}
```

### Plugin Compatibility Checks
```typescript
if (!(this.element as any).pluginMethod) {
  console.warn('PLUGIN_DEBUG: Plugin not available - may need compatibility update');
  return null;
}

try {
  const result = (this.element as any).pluginMethod(options);
  if (!result) {
    console.error('PLUGIN_DEBUG: Plugin method failed');
    return null;
  }
  return result;
} catch (error) {
  console.error('PLUGIN_DEBUG: Compatibility issue:', error);
  return null;
}
```

## Key Implementation Details

### Async Node Creation
Nodes use `createAsync()` to wait for viewport readiness:
```typescript
private async createAsync() {
  const viewport = await this.slate.getViewportAsync();
  this.svgGroup = viewport.group();
  this.finishCreate();
}
```

### SVG Content Scaling
For SVG content nodes, use native viewBox instead of transforms:
```typescript
const content = this.nestedSvg.children()[0];
const bb = content.bbox();
this.nestedSvg.viewbox(bb.x, bb.y, bb.width, bb.height);
this.nestedSvg.node.setAttribute('preserveAspectRatio', 'xMidYMid meet');
```

### Connection Handles
Single-selected nodes show connection handles (top/right/bottom/left) for creating connected nodes:
- Managed by Slate through `updateSelectionResizeRotate()`
- Only shown for single selection
- Preview shown on hover
- Creates new node + connection on click

## Cursor Rules Integration

This project includes detailed cursor rules in `.cursor/rules/`:
- `slateboxjs-svg-development.mdc` - Core development guidelines
- `slateboxjs-development-workflow.mdc` - Build and workflow patterns

These rules provide deeper technical details on the patterns described above.
