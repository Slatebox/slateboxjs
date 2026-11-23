// slateboxjs/boards/still: one renderer for a slate's boards anywhere it is shown read-only (the
// app's cards, the library gallery, the marketing site), with the same kits attachWorkshop uses
// (library spec §7.2).
//
// FOUNDATION stub: the entry point and its signatures. GALLERY moves drawBoard and drawSlateBoards
// here from the app (boardRender.js) and implements renderStill.
export interface StillOptions { frame?: { x: number; y: number; width: number; height: number }; width?: number }

/** Draw every board of `slate` on an engine instance. */
export function drawSlateBoards(_engine: unknown, _slate: unknown, _options: Record<string, unknown> = {}): never {
  throw new Error('slateboxjs/boards/still is not built yet.')
}

/** Render a read-only still of a slate's JSON into `host`, fitted to its frame. */
export function renderStill(_host: unknown, _slateJson: unknown, _options: StillOptions = {}): never {
  throw new Error('slateboxjs/boards/still is not built yet.')
}
