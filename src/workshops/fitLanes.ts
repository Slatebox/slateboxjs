import { workshopLayout, type Workshop } from './model'

/** Use the same pixel font metrics as the SVG, including bold lane headings. */
function wrapWords(text: string, width: number, measure: CanvasRenderingContext2D) {
  const lines: string[] = []
  let line = ''
  for (const word of text.split(/\s+/u)) {
    const joined = line ? line + ' ' + word : word
    if (measure.measureText(joined).width <= width) {
      line = joined
      continue
    }
    if (line) lines.push(line)
    line = ''
    for (const letter of word) {
      if (line && measure.measureText(line + letter).width > width) {
        lines.push(line)
        line = ''
      }
      line += letter
    }
  }
  if (line) lines.push(line)
  return lines
}

export function fitLaneLayout(board: Workshop, viewport: number) {
  // Keep dense boards horizontally scrollable once a column would become unreadable.
  const pitch = Math.min(workshopLayout.pitch, Math.max(124, Math.floor(viewport / board.lanes.length)))
  const width = pitch - 16
  const measure = document.createElement('canvas').getContext('2d')!
  const labels = new Map<string, string[]>()
  function prepare(items: {id: string; label: string}[], prefix: string, font: string) {
    measure.font = font
    let longest = 1
    for (const item of items) {
      const lines = wrapWords(item.label, width - 25, measure)
      labels.set(prefix + item.id, lines)
      longest = Math.max(longest, lines.length)
    }
    return longest
  }
  const headingLines = prepare(board.lanes, 'heading-', 'bold 13px system-ui, sans-serif')
  const cardLines = prepare(board.cards, 'choice-', '14px system-ui, sans-serif')
  const height = Math.max(workshopLayout.height, 16 * cardLines + 14)
  return {labels, layout:{pitch, width, height, row:height + 12, top:16 * headingLines + 45}}
}
