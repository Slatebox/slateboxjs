// slateboxjs/canvas: the canvas alone, for a page that draws slates and never authors them in the host's own
// UI (the site's replays, an embed, a published slate). It exports Slate and what reads a slate; the v1 facade,
// the whole-slate operations, the menus and the other authoring pieces stay in the main entry, and the parts of
// a slate that wait for a person (the line tool, live sync with collaborators) load when first used.
// The SVG.js plugins a slate draws and moves with, registered as the main entry registers them (src/index.ts): the
// connectable plugin draws its lines, and the rest serve panning, dragging, selection and resizing. The stylesheet is
// the main entry's (slateboxjs/style.css); a page loads it on its own.
import '@svgdotjs/svg.draggable.js'
import '@svgdotjs/svg.panzoom.js'
import '@svgdotjs/svg.select.js'
import '@svgdotjs/svg.resize.js'
import './vendor/svg-connectable/svg.connectable.js'

export { Slate } from './core/Slate'
// Agents on the canvas: what they say and when they show (the drawing is slateboxjs/presence, loaded when the first agent arrives).
export { AGENT_PALETTE, agentStepText, agentChecklist, visibleAgents, type AgentPresenceRecord, type AgentStepStatus } from './core/agentPresenceText'
