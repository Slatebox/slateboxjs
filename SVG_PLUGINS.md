# SVG.js Plugin Ecosystem Documentation

This document maps all SVG.js plugins used in SlateboxJS v2, their versions, locations, usage, and SVG.js 3+ compatibility status.

## Quick Reference Table

| Plugin | Version | SVG.js 3+ Support | Status | Issues |
|--------|---------|-------------------|--------|--------|
| @svgdotjs/svg.js | 3.2.4 | ✅ Native | Official Core | None |
| @svgdotjs/svg.draggable.js | 3.0.6 | ✅ Full | Official | None |
| @svgdotjs/svg.select.js | 4.0.2 | ✅ Full | Official | None |
| @svgdotjs/svg.panzoom.js | 2.1.2 | ✅ Full | Official | None |
| @svgdotjs/svg.resize.js | 2.0.5 | ⚠️ Partial | Unofficial | Works but not in official list |
| svg.connectable.js | local | ⚠️ Upgraded | Local Fork | Now compatible via local upgrade |

## Detailed Plugin Information

### 1. @svgdotjs/svg.js (Core Library)

**Version:** 3.2.4
**SVG.js 3+ Support:** ✅ Native (IS SVG.js 3)
**Official Status:** Official Core Library
**npm Package:** `@svgdotjs/svg.js`

**What it does:**
- Core SVG.js library providing all base SVG element creation and manipulation
- Foundation for all other plugins

**Where imported:**
```typescript
// src/index.ts
import { SVG } from "@svgdotjs/svg.js";

// src/core/Slate.ts
import { SVG, Svg } from "@svgdotjs/svg.js";

// src/core/Connector.ts
import { SVG } from "@svgdotjs/svg.js";
```

**Where used:**
- Slate: Creates root SVG canvas (`SVG().addTo(element)`)
- Node: Uses SVG element types (G, Rect, Circle, Ellipse, Text)
- Connector: Global SVG reference for plugin compatibility
- Globally exposed via `window.SVG` for legacy plugin compatibility

**Compatibility Notes:**
- Perfect compatibility - this IS SVG.js 3+
- No issues or workarounds needed

---

### 2. @svgdotjs/svg.draggable.js

**Version:** 3.0.6
**SVG.js 3+ Support:** ✅ Full Official Support
**Official Status:** Official Plugin
**npm Package:** `@svgdotjs/svg.draggable.js`

**What it does:**
- Adds drag-and-drop functionality to SVG elements
- Modern replacement for legacy `svg.draggy.js`
- Provides `.draggable()` method with events: `dragstart`, `dragmove`, `dragend`

**Where imported:**
```typescript
// src/index.ts (global import)
import "@svgdotjs/svg.draggable.js";

// src/core/Node.ts (type reference)
import "@svgdotjs/svg.draggable.js";
```

**Where used:**
```typescript
// Node.ts - makeDraggable()
(this.svgGroup as any).draggable();

// Event listeners
this.svgGroup.on('dragstart.node', (event) => { ... });
this.svgGroup.on('dragend.node', (event) => { ... });
this.svgGroup.on('dragmove.node', (event) => { ... });
```

**API Methods:**
- `element.draggable()` - Enable dragging
- `element.draggable(false)` - Disable dragging
- Events: `dragstart`, `dragmove`, `dragend`

**Compatibility Notes:**
- Perfect compatibility with SVG.js 3.2.4
- Actively maintained official plugin
- No known issues

**Migration from svg.draggy.js:**
- ✅ Fully migrated - no legacy svg.draggy.js used
- Modern event-based API instead of callback-based

---

### 3. @svgdotjs/svg.select.js

**Version:** 4.0.2
**SVG.js 3+ Support:** ✅ Full Official Support
**Official Status:** Official Plugin
**npm Package:** `@svgdotjs/svg.select.js`

**What it does:**
- Adds selection box and manipulation handles to elements
- Provides visual selection feedback
- Works with svg.resize.js for rotation handles

**Where imported:**
```typescript
// src/index.ts (global import)
import "@svgdotjs/svg.select.js";

// src/core/ResizeRotate.ts
import "@svgdotjs/svg.select.js";
```

**Where used:**
```typescript
// ResizeRotate.ts - enable()
if (typeof element.select === "function") {
  element.select({ rotationPoint: this.options.rotateEnabled });
}

// Disable selection
element.select(false);
```

**API Methods:**
- `element.select()` - Enable selection with default options
- `element.select({ rotationPoint: true })` - Enable with rotation handle
- `element.select(false)` - Disable selection
- Custom handle creators: `createHandle`, `updateHandle`

**CSS Classes Added:**
- `.svg_select_handle` - Generic handle class
- `.svg_select_handle_rot` - Rotation handle
- `.svg_select_handle_lt`, `_rt`, `_rb`, `_lb` - Corner handles
- `.svg_select_handle_t`, `_r`, `_b`, `_l` - Edge handles

**Compatibility Notes:**
- Perfect compatibility with SVG.js 3.2.4
- Version 4.0.2 is latest stable
- Works seamlessly with svg.resize.js
- No known issues

---

### 4. @svgdotjs/svg.resize.js

**Version:** 2.0.5
**SVG.js 3+ Support:** ⚠️ Works but not officially listed
**Official Status:** Unofficial but functional
**npm Package:** `@svgdotjs/svg.resize.js`

**What it does:**
- Adds resize functionality to selected elements
- Works in conjunction with svg.select.js
- Provides corner and edge resize handles
- Emits `resize` events with new dimensions

**Where imported:**
```typescript
// src/index.ts (global import)
import "@svgdotjs/svg.resize.js";

// src/core/ResizeRotate.ts
import "@svgdotjs/svg.resize.js";
```

**Where used:**
```typescript
// ResizeRotate.ts - enable()
if (this.options.resizeEnabled && typeof element.resize === "function") {
  element.resize({
    preserveAspectRatio: this.options.preserveAspectRatio,
    aroundCenter: this.options.aroundCenter,
    grid: this.options.grid ?? 1,
    degree: this.options.degree ?? 0.1,
  });
}

// Event handling
this.target.on("resize", (event) => {
  this.handleResize(event);
  this.options.onResize?.(event);
});
```

**API Methods:**
- `element.resize(options)` - Enable resize with options
- `element.resize(false)` - Disable resize

**Resize Options:**
- `preserveAspectRatio: boolean` - Lock aspect ratio
- `aroundCenter: boolean` - Resize from center point
- `grid: number` - Snap to grid size
- `degree: number` - Rotation snap increment

**Event Data:**
```typescript
event.detail = {
  box: { x, y, width, height },  // New dimensions
  angle: number                    // Rotation angle (if rotated)
}
```

**Compatibility Notes:**
- ⚠️ Works well but not in official SVG.js 3+ plugin list
- May be a community plugin or unofficial fork
- No issues encountered in practice
- Stable and reliable in current usage

**Known Behaviors:**
- Must be used with svg.select.js for handles
- Emits both resize and rotate events
- Updates element transform matrix automatically

---

### 5. @svgdotjs/svg.panzoom.js

**Version:** 2.1.2
**SVG.js 3+ Support:** ✅ Full Official Support
**Official Status:** Official Plugin
**npm Package:** `@svgdotjs/svg.panzoom.js`

**What it does:**
- Adds pan and zoom functionality to SVG canvas
- Modern replacement for standalone `svg-pan-zoom` library
- Works directly with root SVG element (no viewport nesting)
- Supports mouse, touch, and trackpad gestures

**Where imported:**
```typescript
// src/index.ts (global import)
import "@svgdotjs/svg.panzoom.js";

// src/core/PanZoom.ts
import "@svgdotjs/svg.panzoom.js";
```

**Where used:**
```typescript
// PanZoom.ts - init()
(this.slate.canvas as any).panZoom(this.options);

// Zoom methods
(this.slate.canvas as any).zoom(level);
(this.slate.canvas as any).zoom(level, point);

// Disable
(this.slate.canvas as any).panZoom(false);
```

**API Methods:**
- `svg.panZoom(options)` - Enable with options
- `svg.panZoom(false)` - Disable
- `svg.zoom()` - Get current zoom level
- `svg.zoom(level)` - Set zoom level
- `svg.zoom(level, point)` - Zoom to point

**Configuration Options:**
```typescript
{
  enabled: boolean,           // Enable/disable pan/zoom
  panning: boolean,           // Enable panning
  pinchZoom: boolean,         // Enable pinch zoom
  wheelZoom: boolean,         // Enable wheel zoom
  panButton: number,          // Mouse button for pan (0=left)
  oneFingerPan: boolean,      // Enable single-finger pan
  margins: object | false,    // Viewport margins
  zoomFactor: number,         // Zoom increment (default: 2)
  zoomMin: number,            // Minimum zoom (default: 0.1)
  zoomMax: number,            // Maximum zoom (default: 10)
  pinchSpeed: number,         // Pinch sensitivity
}
```

**Events:**
- `panning` - Fired during pan
- `zoom` - Fired during zoom

**Compatibility Notes:**
- Perfect compatibility with SVG.js 3.2.4
- Official SVG.js 3+ plugin
- Recommended replacement for standalone svg-pan-zoom

**Custom Enhancements in SlateboxJS:**
- Custom wheel handling for trackpad-friendly gestures
- Two-finger scroll = panning (natural direction)
- Ctrl+scroll = zooming
- Pinch = fine-grained zoom (30% sensitivity)
- See `PanZoom.setupCustomWheelHandling()` for implementation

**Migration from svg-pan-zoom:**
- ✅ Fully migrated from standalone library
- Simpler architecture (no viewport nesting)
- Direct canvas manipulation via viewBox
- Better integration with SVG.js ecosystem

---

### 6. svg.connectable.js

**Version:** Local (file:../svg.connectable.js)
**SVG.js 3+ Support:** ⚠️ Recently upgraded for compatibility
**Official Status:** Local fork with SVG.js 3+ compatibility fixes
**npm Package:** Local directory reference

**What it does:**
- Connects SVG elements with lines/arrows
- Supports multiple connection types (straight, curved, orthogonal)
- Automatic path recalculation when elements move
- Customizable markers (arrows) and styling

**Where imported:**
```typescript
// src/index.ts (global import after SVG global setup)
// Expose SVG globally for svg.connectable.js compatibility
if (typeof window !== 'undefined') {
  (window as any).SVG = SVG;
}

import "svg.connectable.js";
```

**Where used:**
```typescript
// Connector.ts - connectTo()
const connectableObj = (this.node.svgGroup as any).connectable(
  {
    container: this.options.lineContainer,
    markers: this.options.markerContainer,
    type: this.options.type,                    // 'curved' | 'straight' | 'orthogonal'
    color: this.options.color,
    strokeWidth: this.options.strokeWidth,
    sourceAttach: this.options.sourceAttach,    // 'center' | 'perifery'
    targetAttach: this.options.targetAttach,    // 'center' | 'perifery'
    markerSource: this.options.markerSource,    // 'null' | 'default'
    markerTarget: this.options.markerTarget,    // 'null' | 'default'
    showHandles: this.options.showHandles,
    curveRadius: this.options.curveRadius,
  },
  targetNode.svgGroup
);
```

**API Methods:**
- `element.connectable(options, target)` - Create connection
- Returns connection object with `line` and `marker` properties

**Connection Options:**
```typescript
{
  container: SVGGroup,        // Container for line elements
  markers: SVGGroup,          // Container for marker elements
  type: string,               // 'straight' | 'curved' | 'orthogonal'
  color: string,              // Line color
  strokeWidth: number,        // Line width
  sourceAttach: string,       // 'center' | 'perifery'
  targetAttach: string,       // 'center' | 'perifery'
  markerSource: string,       // Arrow at source: 'null' | 'default'
  markerTarget: string,       // Arrow at target: 'null' | 'default'
  showHandles: boolean,       // Show drag handles
  curveRadius: number,        // Curve radius for curved lines
}
```

**Compatibility Status:**
- ⚠️ **Local upgraded version** - now compatible with SVG.js 3+
- Original plugin had SVG.js 2.x API usage
- Upgraded to work with SVG.js 3+ APIs
- Located at: `../svg.connectable.js` (relative to project)

**Known Issues (Resolved):**
- ❌ Original: Used deprecated SVG.js 2.x methods
- ✅ Fixed: Upgraded to SVG.js 3+ compatible APIs
- ✅ Now working: Successfully creates connections

**Global Setup Required:**
```typescript
// Must expose SVG globally before importing
if (typeof window !== 'undefined') {
  (window as any).SVG = SVG;
}
```

**Usage Pattern:**
```typescript
// Check availability before use
if (!(this.node.svgGroup as any).connectable) {
  console.warn('svg.connectable.js not available');
  return null;
}

// Create connection
const connection = sourceNode.svgGroup.connectable(options, targetNode.svgGroup);

// Connection object structure
{
  line: SVGElement,      // The connecting line
  marker: SVGElement,    // The arrow marker
  // ... other properties
}
```

---

## Plugin Loading Order

**Critical:** Plugins must be loaded in the correct order in `src/index.ts`:

```typescript
// 1. Core library first
import { SVG } from "@svgdotjs/svg.js";

// 2. Load all official plugins
import "@svgdotjs/svg.draggable.js";
import "@svgdotjs/svg.select.js";
import "@svgdotjs/svg.resize.js";
import "@svgdotjs/svg.panzoom.js";

// 3. Expose SVG globally for legacy compatibility
if (typeof window !== 'undefined') {
  (window as any).SVG = SVG;
}

// 4. Load legacy plugins last (after global setup)
import "svg.connectable.js";
```

**Why this order matters:**
1. Core SVG.js must be loaded before any plugins
2. Plugins extend SVG.js prototype methods
3. Global SVG exposure needed for legacy plugins
4. svg.connectable.js requires global SVG reference

---

## Compatibility Summary

### ✅ Fully Compatible (Official SVG.js 3+ Plugins)
- @svgdotjs/svg.js (3.2.4) - Core library
- @svgdotjs/svg.draggable.js (3.0.6) - Drag functionality
- @svgdotjs/svg.select.js (4.0.2) - Selection handles
- @svgdotjs/svg.panzoom.js (2.1.2) - Pan/zoom

### ⚠️ Working but Unofficial
- @svgdotjs/svg.resize.js (2.0.5) - Resize functionality
  - Works perfectly in practice
  - Not listed in official SVG.js 3+ plugins
  - May be community-maintained

### ⚠️ Upgraded Local Version
- svg.connectable.js (local) - Node connections
  - Originally incompatible with SVG.js 3+
  - Now using upgraded local version
  - Requires global SVG exposure
  - Location: `file:../svg.connectable.js`

---

## Deprecated/Not Used

### ❌ svg.draggy.js
- **Status:** Deprecated, not used
- **Replaced by:** @svgdotjs/svg.draggable.js
- **Reason:** Legacy plugin for SVG.js 2.x

### ❌ svg-pan-zoom (standalone)
- **Status:** Not used
- **Replaced by:** @svgdotjs/svg.panzoom.js
- **Reason:** Creates complex viewport nesting, not integrated with SVG.js

---

## Plugin Usage Patterns

### Checking Plugin Availability
```typescript
// Always check before using plugins
if (!(element as any).pluginMethod) {
  console.warn('Plugin not available - compatibility issue');
  return null;
}

try {
  const result = (element as any).pluginMethod(options);
  if (!result) {
    console.error('Plugin method failed');
    return null;
  }
  return result;
} catch (error) {
  console.error('Plugin compatibility error:', error);
  return null;
}
```

### Graceful Degradation
```typescript
// Connector.ts example
public enable() {
  if (!(this.node.svgGroup as any).connectable) {
    console.warn('svg.connectable.js not available - limited functionality');
    // Don't throw - allow partial functionality
  }

  this.isActive = true;
}
```

---

## Upgrading Plugins

### Steps to upgrade a plugin to SVG.js 3+:

1. **Check official SVG.js 3+ plugin list:**
   - Visit: https://github.com/svgdotjs/svg.js#plugins
   - Use official plugins when available

2. **For unofficial/legacy plugins:**
   - Create local fork
   - Update deprecated API calls:
     - `element.attr()` - May need adjustment
     - `element.transform()` - Use new syntax
     - `element.bbox()` - Check return format
   - Test thoroughly with SVG.js 3.2.4

3. **Test compatibility:**
   ```bash
   npm run build
   npm run dev
   # Test all plugin functionality in browser
   ```

4. **Document compatibility:**
   - Update this file
   - Add notes to CLAUDE.md
   - Update cursor rules if needed

---

## Resources

### Official SVG.js Documentation
- Main: https://svgjs.dev/
- Plugins: https://github.com/svgdotjs/svg.js#plugins
- API: https://svgjs.dev/docs/3.0/

### Plugin Repositories
- svg.draggable.js: https://github.com/svgdotjs/svg.draggable.js
- svg.select.js: https://github.com/svgdotjs/svg.select.js
- svg.panzoom.js: https://github.com/svgdotjs/svg.panzoom.js
- svg.resize.js: https://github.com/svgdotjs/svg.resize.js
- svg.connectable.js: Local fork (../svg.connectable.js)

### Migration Guides
- SVG.js 2.x to 3.x: https://svgjs.dev/docs/3.0/migration-from-2.x/

---

## Troubleshooting

### Plugin not loading
1. Check import order in `src/index.ts`
2. Verify plugin is listed in `package.json` dependencies
3. Run `npm install` to ensure plugins are installed
4. Check browser console for errors

### Plugin method not available
1. Ensure plugin is imported globally in `src/index.ts`
2. Check if plugin requires SVG global exposure
3. Verify element type supports the plugin
4. Use compatibility checks before calling methods

### Compatibility errors
1. Check plugin version vs SVG.js version
2. Look for deprecated API usage in console
3. Consider using official alternative
4. Create local fork with fixes if needed

### svg.connectable.js specific issues
1. Ensure SVG is exposed globally before import
2. Check that local path `../svg.connectable.js` is correct
3. Verify upgraded version is being used
4. Check console for "SVG.js is not loaded" errors
