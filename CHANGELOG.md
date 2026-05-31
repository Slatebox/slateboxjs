# Changelog

## [2.0.0] — 2025-05-31

### Added
- Complete diagramming library with 26 core modules
- Draggable nodes with multiple shapes (rectangle, circle, ellipse)
- Pan/zoom canvas with trackpad support (`@svgdotjs/svg.panzoom.js`)
- Resize/rotate handles (`@svgdotjs/svg.select.js`, `@svgdotjs/svg.resize.js`)
- Node connections/lines with arrows (svg.connectable.js)
- Multi-selection (Shift+click, drag-select)
- Keyboard shortcuts (Ctrl+Z undo, Ctrl+Y redo, Delete, etc.)
- Grid overlay with snap-to-grid
- Inline text editing
- Undo/redo via JSON snapshots
- JSON serialization/deserialization for save/load
- SVG/PNG/PDF export
- BirdsEye minimap overview
- Theming system
- Presentation mode
- Real-time collaboration (yjs/y-websocket)
- Context menu, comments, filtering, images, links
- Font loader for custom fonts
- Layout algorithms
- v1 API compatibility shim
- Built with TypeScript, SVG.js 3+, Vite 5

### Fixed
- UndoRedo async restore race condition — `restore()` now properly awaits
  deserialization and keeps `isRestoring` flag active for the full duration
- Connection handle cleanup on node selection changes
- ResizeRotate event listener cleanup
- Various null-safety guards across core modules

### Changed
- All source modules committed to git repository
- Comprehensive unit test coverage (840+ tests)
- Full e2e test suite (56 tests across 10 spec files)
- Updated README with complete API documentation
- Continuous Integration via GitHub Actions
- .gitignore covers build/test artifacts, OS files, environment config
