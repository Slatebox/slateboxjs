# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SlateboxJS v3 is a modern diagramming library built with TypeScript (ES2020), SVG.js 3+, and Vite. It provides draggable nodes, pan/zoom functionality, resize/rotate capabilities, node connections, and a rich feature set (collaboration, presentation, themes, comments, export, etc.).

## Development Commands

### Build and Development
```bash
npm run build              # vite build + tsc declarations (always run after code changes)
npm run build:types        # tsc --declaration --emitDeclarationOnly --outDir dist
npm run dev                # Start Vite dev server (http://localhost:5173, opens browser)
npm run preview            # vite preview (production build preview)
npm run serve              # alias for vite preview
```

### Testing
```bash
npm test                   # vitest run (unit tests, jsdom)
npm run test:watch         # vitest (watch mode)
npm run test:e2e           # npx playwright test --project=chromium
npm run test:e2e:ui        # npx playwright test --ui
npm run test:e2e:all       # npx playwright test (all browsers)
npm run test:all           # vitest run + npx playwright test --project=chromium
```

### Run single test
```bash
npx vitest run tests/unit/Node.test.ts
npx playwright test tests/e2e/connectors.spec.ts --project=chromium
```

## Architecture

### Entry Point
- `src/index.ts` — Plugin loading order (SVG → draggable → select → resize → panzoom → connectable), global window exports, factory function `SlateboxJS()`

### Core System (src/core/)
30+ modules in `src/core/`. Key categories:

**Container & Lifecycle:**
- `Slate.ts` — Main orchestrator: SVG canvas, selection coordination, delegates resize/rotate
- `Node.ts` — Individual diagram node (shape + text or SVG content, drag, resize, rotate)
- `NodesManager.ts` — Collection CRUD for all nodes on a slate
- `Invoker.ts` — External integration API (all `onXXXX` methods)

**Interactions:**
- `PanZoom.ts` — Pan/zoom via `@svgdotjs/svg.panzoom.js`; trackpad-friendly (two-finger pan, Ctrl+scroll zoom, pinch)
- `ResizeRotate.ts` — Resize/rotate via `@svgdotjs/svg.select.js` + `@svgdotjs/svg.resize.js`; isolated class owned by Node, managed by Slate
- `Connector.ts` — Node connections via local `svg.connectable.js`; lines/arrows in global containers
- `MultiSelection.ts` — Multi-select with shift-click or drag-select rectangle
- `Keyboard.ts` — Keyboard shortcut bindings

**UI Features:**
- `Grid.ts` — Snap-to-grid and grid rendering
- `Menu.ts` — Context menu
- `ZoomSlider.ts` — Zoom level control UI
- `BirdsEye.ts` — Mini-map / overview panel
- `Editor.ts` — Inline text editing
- `UndoRedo.ts` — Undo/redo stack

**Content & Data:**
- `Serialization.ts` — JSON save/load (`SlateJSON`, `NodeJSON`)
- `ShapeRegistry.ts` — Shape type definitions and registration
- `Relationship.ts` / `Relationships.ts` — Node relationship/association management
- `Layout.ts` — Layout algorithms
- `Filters.ts` — SVG filter management (drop-shadow, blur, etc.)
- `Links.ts` — URL/click-through link handling on nodes
- `Images.ts` — Image node support
- `FontLoader.ts` — External font loading for text nodes
- `Comments.ts` — Annotation/comment system
- `Presentation.ts` — Step-by-step presentation mode

**Collaboration & Export:**
- `Collab.ts` — Real-time collaboration (yjs/y-websocket optional peers)
- `Export.ts` — SVG/PNG/PDF export helpers

**Compatibility:**
- `compat.ts` — v1 API compatibility shim
- `utils.ts` — Utility functions (guid, color contrast, text measurement, bbox, etc.)

### Critical Selection and Resize/Rotate Pattern

**NEVER implement individual node-level resize/rotate enabling.** Architecture follows centralized orchestration:

1. **Slate is the orchestrator**: Only `Slate.updateSelectionResizeRotate()` enables/disables resize/rotate
2. **Nodes delegate upward**: `node.enableResizeRotate()` → `slate.enableNodeResizeRotate(this)` → `slate.selectNodes([node])`
3. **Single source of truth**: `Slate.selectedNodes` array determines what's selected
4. **Automatic management** on selection change: disables ALL resize/rotate on ALL nodes, enables only on selected, shows connection handles only on single selection

### Content Type Duality

Nodes support two mutually exclusive content types:
- **Text Content** (default): `this.textElement` exists, `this.nestedSvg` undefined, text centered in shape
- **SVG Content** (when `options.svgContent`): `this.nestedSvg` exists, `this.textElement` undefined, background transparent, SVG scales via `viewBox`/`preserveAspectRatio`

**Always guard methods that assume one or the other:**
```typescript
if (!this.textElement) return; // Skip for SVG content
if (this.nestedSvg) { /* handle SVG */ }
```

### Plugin Ecosystem

**Official SVG.js 3+ Plugins (bundled):**
- `@svgdotjs/svg.js` v3.2.4
- `@svgdotjs/svg.draggable.js` v3.0.6
- `@svgdotjs/svg.panzoom.js` v2.1.2
- `@svgdotjs/svg.select.js` v4.0.2
- `@svgdotjs/svg.resize.js` v2.0.5

**Local/Legacy:**
- `svg.connectable.js` — local upgraded version at `file:../svg.connectable.js`

**Plugin loading order in `src/index.ts`:**
```typescript
import { SVG } from '@svgdotjs/svg.js'
import '@svgdotjs/svg.draggable.js'
import '@svgdotjs/svg.panzoom.js'
import '@svgdotjs/svg.select.js'
import '@svgdotjs/svg.resize.js'
import 'svg.connectable.js'
// Global window exposes: SVG, SlateboxJS, Slate, Node, PanZoom, ResizeRotate, BirdsEye, Connector, etc.
```

## Conventions

### 1. Always Use SVG.js Native Methods
Never custom SVG manipulations. Use `size()`, `move()`, `rotate()`, `scale()`, `viewBox`, `preserveAspectRatio`.
```typescript
// ✅
nested.viewbox(bb.x, bb.y, bb.width, bb.height);
nested.node.setAttribute('preserveAspectRatio', 'xMidYMid meet');
// ❌ Not: content.transform({ scale, translate: [...] })
```

### 2. Store Element References
Save SVG element references as class properties, don't re-query the DOM.

### 3. Defensive Programming
Always guard methods that assume text OR SVG content since content types are mutually exclusive.

### 4. Consistent Debug Logging
Format: `COMPONENT_ACTION_DEBUG: description`
Prefixes: `NODE_DEBUG`, `SELECTION_DEBUG`, `CONNECTOR_DEBUG`, `PANZOOM_DEBUG`, `VIEWPORT_DEBUG`

### 5. Isolated Class Pattern
New features create isolated classes (constructor takes `node` + `options`, has `enable()`/`disable()`/`isEnabled()`/`updateOptions()`), add to Node as property, export in `src/index.ts`, add to window globals.

### 6. Async Node Creation
Nodes use `createAsync()` awaiting viewport readiness:
```typescript
const viewport = await this.slate.getViewportAsync();
this.svgGroup = viewport.group();
this.finishCreate();
```

### 7. Vite Config Notes
- `dedupe: ['@svgdotjs/svg.js']` to ensure all plugins share the same SVG instance
- `preserveSymlinks: false` so linked packages use consumer's deps
- Alias forces `@svgdotjs/svg.js` to local node_modules path
- External peer deps: `yjs`, `y-websocket`

## Notes

- Dev server port: 5173 (not 3000)
- node >= 18.0.0 required
- Unit tests: Vitest + jsdom in `tests/unit/`; e2e: Playwright in `tests/e2e/`
- `.env` contains `DEEPSEEK_API_KEY` (for Reasonix config, not the library)
- CSS is built into `dist/slateboxjs.css` via `cssCodeSplit: false`
- Source maps enabled in build
