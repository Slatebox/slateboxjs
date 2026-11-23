// slateboxjs/canvas: the canvas alone, for a page that draws slates and never authors them in the host's own
// UI (the site's replays, an embed, a published slate). It exports Slate and what reads a slate; the v1 facade,
// the whole-slate operations, the menus and the other authoring pieces stay in the main entry, and the parts of
// a slate that wait for a person (the line tool, live sync with collaborators) load when first used.
export { Slate } from './core/Slate'
