# FabricJS Refactor Progress

## Completed Work

### Phase 0: Setup & Dependencies ✅
- Added FabricJS dependency to package.json
- Removed RaphaelJS imports from key files

### Phase 1: Core Canvas Initialization ✅
- **Updated `src/slate/canvas.js`:**
  - Replaced Raphael imports with FabricJS
  - Modified canvas initialization to create HTML canvas element and FabricJS Canvas instance
  - Updated clear() method to use FabricJS canvas.clear()
  - Set up basic FabricJS canvas configuration (selection disabled, proper stacking)

- **Updated `src/core/slate.js`:**
  - Modified zoom() method to use FabricJS setZoom() and setViewportTransform() instead of Raphael's setViewBox()
  - Updated remove() method to properly dispose of FabricJS canvas instead of Raphael's paper.remove()
  - Maintained zoom information storage for compatibility

### Phase 2: Basic Node Rendering ✅
- **Updated `src/slate/nodeController.js`:**
  - Added FabricJS import
  - Created `createFabricObjectFromNode()` helper method that:
    - Handles basic shapes (ellipse, rectangle, roundedrectangle)
    - Supports custom SVG paths using fabric.Path
    - Adds Raphael-compatible methods (attr, getBBox, remove, hide, show, toFront, toBack, animate, transform, data)
    - Sets proper FabricJS properties (selectable: false, cursor styles, node ID storage)
  
  - Updated `addToCanvas()` method to:
    - Use FabricJS objects instead of Raphael paths
    - Create FabricJS-compatible link objects (simplified as triangles for now)
    - Add objects to FabricJS canvas
    - Maintain compatibility with existing node structure
    - Replace Raphael "set" concept with array-based compatibility layer

- **Updated `src/node/editor.js`:**
  - Replaced Raphael text creation with FabricJS Text objects
  - Added comprehensive Raphael-compatible methods to text objects
  - Maintained text styling and positioning logic
  - Added proper canvas integration

## Key Compatibility Features Implemented

1. **Raphael-like API Methods:** All FabricJS objects now have `.attr()`, `.getBBox()`, `.remove()`, `.hide()`, `.show()`, `.toFront()`, `.toBack()`, `.animate()`, `.transform()`, and `.data()` methods that mirror Raphael's API.

2. **Attribute Mapping:** Proper mapping between Raphael attributes and FabricJS properties:
   - `fill` → `fill`
   - `stroke` → `stroke`
   - `stroke-width` → `strokeWidth`
   - `x`/`y` → `left`/`top`
   - Text attributes properly mapped to FabricJS text properties

3. **Event System Compatibility:** Node IDs and drag flags stored on FabricJS objects for compatibility with existing event handling.

## Current Status
- ✅ Basic node shapes rendering with FabricJS
- ✅ Text rendering with FabricJS
- ✅ Canvas operations (zoom, clear, remove)
- ✅ Comprehensive Raphael API compatibility layer

## Next Steps (Remaining Phases)

### Phase 3: Path and SVG String Rendering
- [ ] **Handle `node.options.svgString` rendering**
  - Replace `applySVGGroupBorders` and `applySVGGroupColors` for FabricJS groups
  - Use `fabric.loadSVGFromString()` for SVG parsing
  - Update SVG group manipulation logic

### Phase 4: Text Rendering & Editing
- [ ] **Update text editing capabilities**
  - Consider using `fabric.IText` for editable text
  - Ensure text styling and alignment work correctly
  - Test text resizing and auto-fit functionality

### Phase 5: Interactions (Drag, Resize, Rotate)
- [ ] **Update drag functionality**
  - Leverage FabricJS's built-in object dragging
  - Update collaboration events for dragging
  - Ensure relationship lines update during drag

- [ ] **Update resize functionality (`src/node/resize.js`)**
  - Replace Raphael-based resizing UI with FabricJS controls
  - Update resize.set method
  - Handle proportional resizing

- [ ] **Update rotation functionality (`src/node/rotate.js`)**
  - Replace Raphael-based rotation UI
  - Use FabricJS object angle property
  - Update rotate.set method

### Phase 6: Relationships (Lines/Connectors)
- [ ] **Update `src/node/relationships.js`**
  - Re-implement line drawing using `fabric.Path` or `fabric.Line`
  - Update `refreshRelationships` for FabricJS line objects
  - Ensure proper line anchoring to nodes

- [ ] **Update helper functions:**
  - `src/helpers/refreshRelationships.js`
  - `src/helpers/closestPoint.js` (if it relies on Raphael path objects)

### Phase 7: Advanced Features
- [ ] **Connectors (`src/node/connectors.js`)**
- [ ] **Menu (`src/node/menu.js`)**
- [ ] **Animations** - Map Raphael animations to FabricJS
- [ ] **Filters (`src/slate/filters.js`)** - Replace with FabricJS filter system
- [ ] **Bird's Eye (`src/slate/birdsEye.js`)**
- [ ] **Grid (`src/slate/grid.js`)**
- [ ] **Multi-Selection (`src/slate/multiSelection.js`)**
- [ ] **Undo/Redo (`src/slate/undoRedo.js`)**
- [ ] **Image Handling (`src/node/images.js`)**

### Phase 8: Helper Functions & Utilities
- [ ] **Update `src/helpers/utils.js`**
  - Replace `utils._transformPath` with FabricJS equivalent
  - Update `getBBox` if Raphael-specific
  - Review all helper functions for Raphael dependencies

### Phase 9: Collaboration & API Contract
- [ ] **Update `src/slate/collab.js`**
  - Modify data serialization/deserialization for FabricJS objects
  - Maintain existing data structures for collaboration events
  - Test all collaboration scenarios

### Phase 10: Testing & Cleanup
- [ ] **Comprehensive testing**
- [ ] **Performance optimization**
- [ ] **Remove `src/deps/raphael/` directory**
- [ ] **Update documentation**

## Known Issues to Address

1. **Transform String Parsing:** The `transform()` method currently just stores the transform string. Need to implement proper Raphael transform string parsing and application.

2. **Path Animation:** Complex path animations are not yet implemented.

3. **Link Arrow:** Currently using a simple triangle - need to implement proper link arrow shape.

4. **SVG String Support:** Need to implement `fabric.loadSVGFromString` integration.

5. **Filter System:** Need to replace Raphael's filter system with FabricJS filters.

## Dependencies Added
- `fabric@^6.4.3` - Added to package.json

## Files Modified
- `package.json` - Added FabricJS dependency
- `src/slate/canvas.js` - Core canvas refactoring
- `src/core/slate.js` - Zoom and canvas management
- `src/slate/nodeController.js` - Node creation and rendering
- `src/node/editor.js` - Text object creation