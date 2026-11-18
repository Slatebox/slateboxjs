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

export function fitLaneLayout(board: Workshop, viewport: number, mapCanvas = false) {
  // Keep dense boards horizontally scrollable once a column would become unreadable.
  const columns = mapCanvas ? Math.max(...board.lanes.map(lane => lane.station!.column)) + 1 : board.lanes.length
  const gaps = mapCanvas ? (columns - 1) * 28 : 0
  const pitch = Math.min(mapCanvas ? 202 : workshopLayout.pitch, Math.max(mapCanvas ? 145 : 124, Math.floor((viewport - gaps) / columns)))
  const width = pitch - 16
  const measure = document.createElement('canvas').getContext('2d')!
  const labels = new Map<string, string[]>()
  function prepare(items: {id: string; label: string}[], prefix: string, font: string) {
    measure.font = font
    let longest = 1
    for (const item of items) {
      const inset = mapCanvas && prefix === 'choice-' ? 49 : 25
      const lines = wrapWords(item.label, width - inset, measure)
      labels.set(prefix + item.id, lines)
      longest = Math.max(longest, lines.length)
    }
    return longest
  }
  const headingLines = prepare(board.lanes, 'heading-', mapCanvas ? 'bold 15px system-ui, sans-serif' : 'bold 13px system-ui, sans-serif')
  const cardLines = prepare(board.cards, 'choice-', '14px system-ui, sans-serif')
  if (mapCanvas) {
    const height = 16 * cardLines + 22
    return {labels, layout:{pitch, width, height, row:height + 6, top:16 * headingLines + 32}}
  }
  const height = Math.max(workshopLayout.height, 16 * cardLines + 14)
  return {labels, layout:{pitch, width, height, row:height + 12, top:16 * headingLines + 45}}
}
