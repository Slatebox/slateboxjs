let initialized = false
let Raphael

function initRaphael(customDoc, customWin) {
  if (!initialized) {
    // Use provided document/window or fallback to global
    const g = {
      doc: customDoc || (typeof document !== 'undefined' ? document : null),
      win: customWin || (typeof window !== 'undefined' ? window : null),
    }

    if (!g.doc || !g.win) {
      throw new Error(
        'Document and Window must be available to initialize Raphael'
      )
    }

    // Prevent the immediate execution of Raphael.core
    const ogRaphael = require('./raphael.core.js')
    Raphael = ogRaphael(g)
    initialized = true
  }
  return Raphael
}

export { initRaphael }
