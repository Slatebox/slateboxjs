// slateboxjs/workshops/grid: the grid sheet, a page composer (snap-grid spec).
//
// A grid sheet is a page (Letter or A4, portrait or landscape) of equal cells, and a tray of tiles (headings, text,
// pictures, questions, answer lines, word banks, QR codes, comic panels, speech bubbles, terms, stickers) people drag
// into the cells, then print. Its first lane is the tray ("Tiles"); every other lane is a page ("Page 1" … up to 4).
// A tray tile marked as a stamp never leaves the tray: dropping it on a page makes a copy. A tile on a page always
// sits in a cell (its span is rows by columns of cells); a tile in the tray never has one. Tiles never overlap and
// never run past the page: that is built in. What else the sheet allows is data in its rulebook, read through this
// family: tileTypes (only these tiles), tileMax (at most so many of a kind per page or per sheet), tileNeeds (every
// page needs so many of a kind: said in the page's caption and at print, never blocking a drag) and tileSpan (how big a
// kind may be). One check decides a drag, an edit, a whole-board save and exec's check_move, in the same words.
import type { Behaviour, BehaviourRule, BehaviourVerdict } from './behaviour'
import type { GridTile, GridTileType, StationImage, Workshop, WorkshopCard, WorkshopNoteOffer } from './model'
import { nextWorkshopId, registerWorkshopRules, said, workshopEditKinds, workshopFreshOverride, workshopKeepsPicture, workshopOverrideMark, workshopRuleSchema } from './model'
import type { BusinessBoardRules, BusinessEditStep, BusinessEditTools, RuleFamily } from './kinds'
import type { WorkshopEdit, WorkshopEditField, WorkshopEditKind, WorkshopEditKindName, WorkshopRef } from './edits'
import {
  cellSizeProblem, fits, freeCells, inBounds, occupancy, pageName, readingOrder, reflow, spanOf, usedCells, type GridCell, type GridFields,
} from './gridGeometry'

export * from './gridGeometry'

type Board = Workshop
type Rule = BehaviourRule

export const GRID_TRAY = 'tray'
export const GRID_MAX_TILES = 120
export const GRID_MAX_STAMPS = 12
export const gridTileTypes: readonly GridTileType[] = ['heading', 'text', 'image', 'question', 'answer-lines', 'word-bank', 'diagram', 'qr', 'panel', 'speech', 'term', 'sticker']

// ---------------------------------------------------------------------------------------------
// Words.

const nouns: Record<GridTileType, [string, string]> = {
  heading: ['heading', 'headings'], text: ['text block', 'text blocks'], image: ['picture', 'pictures'], question: ['question', 'questions'],
  'answer-lines': ['set of answer lines', 'answer lines'], 'word-bank': ['word bank', 'word banks'], diagram: ['diagram', 'diagrams'],
  qr: ['QR code', 'QR codes'], panel: ['panel', 'panels'], speech: ['speech bubble', 'speech bubbles'], term: ['term', 'terms'], sticker: ['sticker', 'stickers'],
}
/** "a heading", "2 headings", "answer lines". */
export function tileWords(type: GridTileType, n: number): string {
  const [one, many] = nouns[type]
  if (n === 1) return type === 'answer-lines' ? 'a set of answer lines' : (/^[aeiou]/i.test(one) ? 'an ' : 'a ') + one
  return n + ' ' + many
}
const plural = (type: GridTileType) => nouns[type][1]
const capital = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)
const listed = (items: string[]) => items.length > 1 ? items.slice(0, -1).join(', ') + ' and ' + items.at(-1) : items[0] ?? ''
/** The name a tile of a kind takes when it is made without one: "Heading", "Word bank". */
export const tileName = (type: GridTileType) => capital(type === 'answer-lines' ? 'answer lines' : nouns[type][0])

/** The kind of tile these words name ("word banks", "pictures", "QR code"), or null. */
export function tileTypeOf(words: string): GridTileType | null {
  const text = String(words ?? '').toLowerCase().replace(/[^a-z ]+/g, ' ').replace(/\s+/g, ' ').trim()
  if (!text) return null
  for (const type of gridTileTypes) if (text === type.replace('-', ' ') || text === nouns[type][0].toLowerCase() || text === nouns[type][1].toLowerCase()) return type
  const table: [RegExp, GridTileType][] = [[/^(?:title|titles|headings?|headers?)$/, 'heading'], [/^(?:text|texts|paragraphs?|text boxes|text box|captions?|instructions?)$/, 'text'],
    [/^(?:pictures?|images?|photos?|illustrations?|drawings?)$/, 'image'], [/^questions?$/, 'question'], [/^(?:answer ?lines?|lines|writing lines|answer space)$/, 'answer-lines'],
    [/^(?:word ?banks?|word lists?|vocabulary boxes?)$/, 'word-bank'], [/^(?:diagrams?|charts?)$/, 'diagram'], [/^(?:qr ?codes?|qrs?|qr)$/, 'qr'],
    [/^(?:panels?|comic panels?|frames?)$/, 'panel'], [/^(?:speech ?bubbles?|bubbles?|speech)$/, 'speech'], [/^(?:terms?|words?|cards?|squares?)$/, 'term'], [/^stickers?$/, 'sticker']]
  return table.find(([pattern]) => pattern.test(text))?.[1] ?? null
}

/** The pages of a sheet (every lane but the tray). */
export const gridPages = (board: Pick<Board, 'lanes'>) => board.lanes.slice(1)
const pageLabel = (board: Board, laneId: string) => board.lanes.find(lane => lane.id === laneId)?.label ?? 'The page'
const at = (cell: { row: number; col: number }) => 'row ' + (cell.row + 1) + ', column ' + (cell.col + 1)
/** "2 by 2". */
const spanWords = (span: { rows: number; cols: number }) => span.rows + ' by ' + span.cols

/** How big a kind of tile is by default: a heading the full row, every other 1 by 1. */
export function defaultSpan(board: Pick<Board, 'grid'>, type: GridTileType): { rows: number; cols: number } {
  return type === 'heading' ? { rows: 1, cols: board.grid!.cells.cols } : { rows: 1, cols: 1 }
}

// ---------------------------------------------------------------------------------------------
// Reading what is stored.

const plain = (value: unknown, limit: number, what: string, lines = false) => {
  if (typeof value !== 'string') throw new Error(what)
  const text = (lines ? value.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, '') : value.replace(/[\u0000-\u001f\u007f]/g, ' '))
    .replace(/[ \t]+/g, ' ').replace(/ *\n */g, '\n').trim()
  if (text.length > limit) throw new Error(what)
  return text
}
const steps = (value: number, step: number) => Math.abs(Math.round(value / step) * step - value) < 1e-9

function readGrid(raw: unknown): GridFields {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('A grid sheet says its page and its cells.')
  const { page, cells } = raw as Record<string, Record<string, unknown>>
  if (!page || typeof page !== 'object' || !cells || typeof cells !== 'object') throw new Error('A grid sheet says its page and its cells.')
  if (page.size !== 'letter' && page.size !== 'a4') throw new Error('A page is Letter or A4.')
  if (page.orientation !== 'portrait' && page.orientation !== 'landscape') throw new Error('A page is portrait or landscape.')
  const margin = page.margin ?? 0.5
  if (typeof margin !== 'number' || margin < 0.25 || margin > 1 || !steps(margin, 0.125)) throw new Error('A page’s margins are ¼ inch to 1 inch, in eighths of an inch.')
  const whole = (n: unknown, top: number, what: string) => {
    if (typeof n !== 'number' || !Number.isInteger(n) || n < 1 || n > top) throw new Error(`A page has 1 to ${top} ${what}.`)
    return n
  }
  const gutter = cells.gutter ?? 0.125
  if (typeof gutter !== 'number' || gutter < 0 || gutter > 0.5 || !steps(gutter, 0.0625)) throw new Error('The gap between cells is up to ½ inch, in sixteenths of an inch.')
  return { page: { size: page.size, orientation: page.orientation, margin }, cells: { rows: whole(cells.rows, 12, 'rows'), cols: whole(cells.cols, 8, 'columns'), gutter } }
}

function readTile(raw: unknown): GridTile {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Every tile says what kind it is.')
  const t = raw as Record<string, unknown>
  if (!gridTileTypes.includes(t.type as GridTileType)) throw new Error('Every tile says what kind it is: ' + listed(gridTileTypes.map(type => tileName(type).toLowerCase())) + '.')
  const tile: GridTile = { type: t.type as GridTileType }
  for (const key of Object.keys(t)) if (!['type', 'body', 'words', 'image', 'link', 'stamp'].includes(key)) throw new Error('A tile does not take ' + key + '.')
  if (t.body !== undefined) {
    const body = plain(t.body, 600, 'A tile holds up to 600 characters.', true)
    if (body) tile.body = body
  }
  if (t.words !== undefined) {
    if (tile.type !== 'word-bank') throw new Error('Only a word bank holds a list of words.')
    if (!Array.isArray(t.words) || t.words.length < 3 || t.words.length > 24) throw new Error('A word bank holds 3 to 24 words.')
    tile.words = t.words.map(word => {
      const read = plain(word, 40, 'A word in a word bank is up to 40 characters.')
      if (!read) throw new Error('A word bank holds 3 to 24 words.')
      return read
    })
  } else if (tile.type === 'word-bank') throw new Error('A word bank holds 3 to 24 words.')
  if (t.image !== undefined) {
    if (!['image', 'diagram', 'sticker', 'panel'].includes(tile.type)) throw new Error('Only a picture, a diagram, a sticker or a panel shows a picture.')
    const image = t.image as Record<string, unknown>
    if (!image || typeof image !== 'object' || Array.isArray(image)) throw new Error('A picture says what it shows.')
    const alt = plain(image.alt, 120, 'Say what the picture shows in up to 120 characters.')
    if (!alt) throw new Error('Say what the picture shows in up to 120 characters.')
    tile.image = { alt }
    if (image.src !== undefined && image.src !== '') {
      if (!workshopKeepsPicture(image.src)) throw new Error('A tile keeps a picture by its web address, or held in the page.')
      tile.image.src = image.src as string
    }
  }
  if (t.link !== undefined) {
    if (tile.type !== 'qr') throw new Error('Only a QR code links to a web address.')
    let url: URL | null = null
    try { url = typeof t.link === 'string' && t.link.length <= 2048 ? new URL(t.link) : null } catch { url = null }
    if (!url || (url.protocol !== 'https:' && url.protocol !== 'http:') || url.username || url.password) throw new Error('A QR code links to a web address.')
    tile.link = url.href
  }
  if (t.stamp !== undefined) {
    if (t.stamp !== true) throw new Error('A stamp is marked true.')
    tile.stamp = true
  }
  return tile
}

function readCell(raw: unknown): GridCell {
  const bad = () => new Error('A tile’s cell is a row and a column.')
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw bad()
  const c = raw as Record<string, unknown>
  for (const key of Object.keys(c)) if (!['row', 'col', 'rows', 'cols'].includes(key)) throw bad()
  const n = (v: unknown, low: number) => { if (typeof v !== 'number' || !Number.isInteger(v) || v < low || v > 12) throw bad(); return v }
  const cell: GridCell = { row: n(c.row, 0), col: n(c.col, 0) }
  if (c.rows !== undefined && n(c.rows, 1) > 1) cell.rows = c.rows as number
  if (c.cols !== undefined && n(c.cols, 1) > 1) cell.cols = c.cols as number
  return cell
}

/** The sheet's own rule over the whole board: null when it holds, else the sentence. */
export function validateGrid(board: Board): string | null {
  const grid = board.grid
  if (!grid) return 'A grid sheet says its page and its cells.'
  if (board.lanes[0].id !== GRID_TRAY) return 'A grid sheet’s first area is its tray.'
  const small = cellSizeProblem(grid)
  if (small) return small
  let stamps = 0
  for (const card of board.cards) {
    if (!card.tile) return 'Every tile says what kind it is.'
    const tray = card.laneId === GRID_TRAY
    if (card.tile.stamp) {
      stamps++
      if (!tray) return 'A stamp stays in the tray.'
    }
    if (tray && card.cell) return 'A tile in the tray has no cell.'
    if (!tray && !card.cell) return 'A tile on a page sits in a cell.'
    if (card.cell && !inBounds(grid, card.cell)) return pastEdge(grid, card)
  }
  if (stamps > GRID_MAX_STAMPS) return `A sheet holds up to ${GRID_MAX_STAMPS} stamps.`
  for (const page of gridPages(board)) {
    const held = new Map<string, WorkshopCard>()
    for (const card of readingOrder(board).filter(item => item.laneId === page.id)) {
      const { rows, cols } = spanOf(card.cell!)
      for (let r = card.cell!.row; r < card.cell!.row + rows; r++) for (let c = card.cell!.col; c < card.cell!.col + cols; c++) {
        const other = held.get(r + ':' + c)
        if (other) return `${said(card.label)} and ${said(other.label)} both sit on ${at({ row: r, col: c })} of ${page.label}.`
        held.set(r + ':' + c, card)
      }
    }
  }
  return null
}

/** “Map” runs past the page's edge: it's 2 columns wide from column 2 of 2. */
function pastEdge(grid: GridFields, card: WorkshopCard): string {
  const cell = card.cell!, { rows, cols } = spanOf(cell)
  const head = said(card.label) + ' runs past the page’s edge: '
  if (cell.col + cols > grid.cells.cols) {
    return cell.col >= grid.cells.cols ? head + `it sits in column ${cell.col + 1}, and the page has ${grid.cells.cols}.`
      : head + `it’s ${cols} ${cols === 1 ? 'column' : 'columns'} wide from column ${cell.col + 1} of ${grid.cells.cols}.`
  }
  return cell.row >= grid.cells.rows ? head + `it sits on row ${cell.row + 1}, and the page has ${grid.cells.rows}.`
    : head + `it’s ${rows} ${rows === 1 ? 'row' : 'rows'} tall from row ${cell.row + 1} of ${grid.cells.rows}.`
}

// ---------------------------------------------------------------------------------------------
// The rulebook's grid family.

const rulesOn = (board: Pick<Board, 'behaviour'>) => (board.behaviour?.rules ?? []).filter(rule => rule.on)
type TypesRule = Rule & { kind: 'tileTypes'; types: GridTileType[] }
type MaxRule = Rule & { kind: 'tileMax'; type: GridTileType; max: number; per: 'page' | 'sheet' }
type NeedsRule = Rule & { kind: 'tileNeeds'; type: GridTileType; atLeast: number; per: 'page' }
type SpanRule = Rule & { kind: 'tileSpan'; type: GridTileType; rows: number; cols: number }

export function gridRuleSentence(rule: Rule): string {
  const r = rule as unknown as Record<string, unknown> & { type: GridTileType }
  let text: string
  switch (rule.kind) {
    case 'tileTypes': text = 'This sheet uses ' + listed((r.types as GridTileType[]).map(plural)) + '.'; break
    case 'tileMax': text = (r.per === 'sheet' ? 'The sheet holds' : 'A page holds') + ' at most ' + (r.max as number) + ' ' + (r.max === 1 ? nouns[r.type][0] : plural(r.type)) + '.'; break
    case 'tileNeeds': text = 'Every page needs ' + tileWords(r.type, r.atLeast as number) + '.'; break
    case 'tileSpan': text = capital(plural(r.type)) + ' can span up to ' + (r.rows as number) + ' by ' + (r.cols as number) + ' cells.'; break
    default: text = 'This sheet has a rule it does not know.'
  }
  return rule.severity === 'warn' ? text.replace(/\.$/, ' (a warning only).') : text
}

function gridContradiction(behaviour: Behaviour): string | null {
  const on = behaviour.rules.filter(rule => rule.on)
  const types = on.find(rule => rule.kind === 'tileTypes') as TypesRule | undefined
  for (const need of on.filter(rule => rule.kind === 'tileNeeds') as NeedsRule[]) {
    const cap = on.find(rule => rule.kind === 'tileMax' && (rule as MaxRule).type === need.type && (rule as MaxRule).per === 'page') as MaxRule | undefined
    if (cap && cap.max < need.atLeast) return `Every page needs ${tileWords(need.type, need.atLeast)}, but a page holds at most ${cap.max}.`
    if (types && !types.types.includes(need.type)) return `Every page needs ${tileWords(need.type, need.atLeast)}, but ${plural(need.type)} aren’t one of this sheet’s tiles.`
  }
  if (on.filter(rule => rule.kind === 'tileTypes').length > 1) return 'A sheet says its tiles once.'
  return null
}

function readGridRule(rule: Record<string, unknown>, base: Record<string, unknown>, board: Board): Rule {
  const known = (keys: string[]) => {
    const extra = Object.keys(rule).find(key => !['id', 'on', 'severity', 'set', 'kind', ...keys].includes(key))
    if (extra) throw new Error('A ' + String(rule.kind) + ' rule does not take ' + extra + '.')
  }
  const type = (value: unknown) => {
    if (!gridTileTypes.includes(value as GridTileType)) throw new Error('Name a kind of tile: ' + listed(gridTileTypes.map(item => tileName(item).toLowerCase())) + '.')
    return value as GridTileType
  }
  const whole = (value: unknown, low: number, high: number, what: string) => {
    if (typeof value !== 'number' || !Number.isInteger(value) || value < low || value > high) throw new Error(what)
    return value
  }
  switch (rule.kind) {
    case 'tileTypes': {
      known(['types'])
      if (!Array.isArray(rule.types) || !rule.types.length || rule.types.length > gridTileTypes.length) throw new Error('Say which tiles the sheet uses.')
      return { ...base, kind: 'tileTypes', types: [...new Set(rule.types.map(type))] } as unknown as Rule
    }
    case 'tileMax': {
      known(['type', 'max', 'per'])
      const per = rule.per ?? 'page'
      if (per !== 'page' && per !== 'sheet') throw new Error('A limit is per page or for the whole sheet.')
      return { ...base, kind: 'tileMax', type: type(rule.type), max: whole(rule.max, 1, 60, 'A page holds 1 to 60 tiles of a kind.'), per } as unknown as Rule
    }
    case 'tileNeeds': {
      known(['type', 'atLeast', 'per'])
      if ((rule.per ?? 'page') !== 'page') throw new Error('What a page needs is said per page.')
      return { ...base, kind: 'tileNeeds', type: type(rule.type), atLeast: whole(rule.atLeast ?? 1, 1, 12, 'A page needs 1 to 12 tiles of a kind.'), per: 'page' } as unknown as Rule
    }
    case 'tileSpan': {
      known(['type', 'rows', 'cols'])
      const grid = board.grid
      return { ...base, kind: 'tileSpan', type: type(rule.type), rows: whole(rule.rows, 1, grid?.cells.rows ?? 12, 'A tile spans 1 to as many rows as the page has.'),
        cols: whole(rule.cols, 1, grid?.cells.cols ?? 8, 'A tile spans 1 to as many columns as the page has.') } as unknown as Rule
    }
  }
  throw new Error('This board does not know the rule ' + String(rule.kind) + '.')
}

/** The tiles of a kind on a page (or, `sheet`, on every page). */
const count = (board: Board, type: GridTileType, pageId: string | null) => board.cards.filter(card => card.tile?.type === type && card.laneId !== GRID_TRAY && (pageId === null || card.laneId === pageId)).length

/** The tiles that came onto a page (new, moved there, of a new kind) or changed their span, by this change. */
function arrivals(before: Board, after: Board) {
  const was = new Map(before.cards.map(card => [card.id, card]))
  return after.cards.flatMap(card => {
    const old = was.get(card.id)
    const span = card.cell ? spanOf(card.cell) : null, oldSpan = old?.cell ? spanOf(old.cell) : null
    // A tile taken back to the tray has not arrived anywhere a rule counts; a new one in the tray has (its kind).
    const arrived = !old || (card.laneId !== GRID_TRAY && (old.laneId !== card.laneId || old.tile?.type !== card.tile?.type))
    const grew = Boolean(span && (!oldSpan || span.rows > oldSpan.rows || span.cols > oldSpan.cols))
    return arrived || grew ? [{ card, arrived, grew }] : []
  })
}

/** Whether `after` keeps the sheet's rules for every tile that arrived on a page (or a new tray tile, for its kind). */
export function checkGrid(before: Board, after: Board): BehaviourVerdict {
  const rules = rulesOn(before)
  const warnings: string[] = []
  if (!rules.length) return { ok: true, warnings }
  for (const { card, arrived, grew } of arrivals(before, after)) {
    const type = card.tile?.type
    if (!type) continue
    // A tile placed anyway (Move anyway) past a limit or the sheet's tiles is marked, never refused again for them.
    const anyway = workshopFreshOverride(before, card) || Boolean(card.override && before.cards.find(item => item.id === card.id)?.override)
    for (const rule of rules) {
      let sentence: string | null = null
      if (rule.kind === 'tileTypes' && arrived && !anyway && !(rule as TypesRule).types.includes(type)) sentence = capital(plural(type)) + ' aren’t one of this sheet’s tiles.'
      if (rule.kind === 'tileMax' && arrived && !anyway && card.laneId !== GRID_TRAY && (rule as MaxRule).type === type) {
        const { max, per } = rule as MaxRule
        const page = per === 'sheet' ? null : card.laneId
        if (count(after, type, page) > max && count(after, type, page) > count(before, type, page)) {
          sentence = (per === 'sheet' ? 'The sheet' : pageLabel(after, card.laneId)) + ' already has its ' + max + ' ' + (max === 1 ? nouns[type][0] : plural(type)) + '.'
        }
      }
      if (rule.kind === 'tileSpan' && (grew || arrived) && card.cell && (rule as SpanRule).type === type) {
        const span = spanOf(card.cell), limit = rule as SpanRule
        if (span.rows > limit.rows || span.cols > limit.cols) sentence = gridRuleSentence({ ...rule, severity: 'refuse' })
      }
      if (!sentence) continue
      if (rule.severity === 'warn') { if (!warnings.includes(sentence)) warnings.push(sentence); continue }
      return { refused: { sentence, ruleId: rule.id, set: rule.set, cardId: card.id, laneId: card.laneId } }
    }
  }
  return { ok: true, warnings }
}

/** Whether a refusal of checkGrid may be made anyway (Move anyway): a limit or the sheet's tiles, never a span. */
export function gridOverridable(board: Board, ruleId: string | null): boolean {
  const rule = (board.behaviour?.rules ?? []).find(item => item.id === ruleId)
  return Boolean(rule && (rule.kind === 'tileMax' || rule.kind === 'tileTypes'))
}

/** What a page still needs by its tileNeeds rules ("a heading"), as words; empty when it has all of it. */
export function gridNeeds(board: Board, pageId: string): string[] {
  return (rulesOn(board).filter(rule => rule.kind === 'tileNeeds') as NeedsRule[])
    .filter(rule => count(board, rule.type, pageId) < rule.atLeast).map(rule => tileWords(rule.type, rule.atLeast - count(board, rule.type, pageId)))
}

const gridKeys: Record<string, string> = { tileTypes: 'types', tileMax: 'type max per', tileNeeds: 'type atLeast per', tileSpan: 'type rows cols' }

export const gridFamily: RuleFamily = {
  keys: gridKeys,
  read: (rule, base, board) => readGridRule(rule, base, board),
  sentence: rule => gridRuleSentence(rule),
  contradiction: behaviour => gridContradiction(behaviour),
  check: checkGrid,
  builtIn: () => ['Tiles snap to free cells; none overlap.'],
}

// ---------------------------------------------------------------------------------------------
// What a sheet says.

/** "Letter · 4 × 2 · 6 of 8 cells · Needs a heading"; the tray: "7 stamps · drag one onto a page". */
export function gridCaption(board: Board, laneId: string): string {
  const grid = board.grid!
  if (laneId === GRID_TRAY) {
    const here = board.cards.filter(card => card.laneId === GRID_TRAY)
    const stamps = here.filter(card => card.tile?.stamp).length, loose = here.length - stamps
    const parts = [stamps ? stamps + (stamps === 1 ? ' stamp' : ' stamps') : '', loose ? loose + (loose === 1 ? ' tile' : ' tiles') : ''].filter(Boolean)
    return parts.length ? parts.join(' · ') + ' · drag onto a page' : 'Drag a tile here to take it off the page'
  }
  const needs = gridNeeds(board, laneId)
  return [pageName(grid.page.size), grid.cells.rows + ' × ' + grid.cells.cols, usedCells(board, laneId) + ' of ' + grid.cells.rows * grid.cells.cols + ' cells',
    ...(needs.length ? ['Needs ' + listed(needs)] : [])].join(' · ')
}

/** What a tile says on the page: a question's words under its name, a word bank's words, a picture its words when it has none. */
export function gridCardText(_board: Board, card: WorkshopCard): string {
  const tile = card.tile
  if (!tile) return card.label
  // A name its words already say ("What fraction is shaded?" over "What fraction is shaded? The circle …") is said once.
  const plain = (text: string) => text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()
  const named = (body: string | undefined) => body ? (plain(body).startsWith(plain(card.label)) ? body : card.label + '\n' + body) : card.label
  switch (tile.type) {
    case 'question': case 'speech': return named(tile.body)
    case 'text': return tile.body ?? card.label
    case 'word-bank': return plain(card.label) === plain((tile.words ?? []).join(' ')) ? (tile.words ?? []).join(' · ') : card.label + '\n' + (tile.words ?? []).join(' · ')
    case 'image': case 'diagram': return tile.image?.src ? '' : tile.image?.alt ?? card.label
    case 'answer-lines': return card.label
    default: return named(tile.body)
  }
}

/** The words a tile takes back to the canvas as a note: everything it says. */
export function gridNoteText(_board: Board, card: WorkshopCard): string {
  const tile = card.tile
  if (!tile) return card.label
  if (tile.type === 'word-bank') return card.label + '\n' + (tile.words ?? []).join(', ')
  if (tile.type === 'text' && tile.body) return tile.body
  if (tile.type === 'qr' && tile.link) return card.label + '\n' + tile.link
  return tile.body ? card.label + '\n' + tile.body : card.label
}

/**
 * The tile an ordinary note makes: a note with a picture an image tile that keeps it; one of two or more lines that
 * ends in a question mark a question (its first line the name, the rest its words); anything else text.
 */
export function gridFromNote(_board: Board, text: string, unnamed: string, note?: WorkshopNoteOffer) {
  const full = (note?.asNote?.text ?? text ?? '').replace(/\r\n?/g, '\n').trim()
  const lines = full.split('\n').map(line => line.trim()).filter(Boolean)
  const cut = (words: string, n: number) => words.length <= n ? words : words.slice(0, n - 1).replace(/\s+\S*$/, '') + '…'
  const picture = note?.asNote?.image?.src
  if (picture && workshopKeepsPicture(picture)) {
    const alt = cut(lines.join(' ') || 'Picture', 120)
    return { label: cut(lines.join(' ') || unnamed, 80), type: 'image' as const, image: { src: picture, alt } }
  }
  if (lines.length >= 2 && /\?\s*$/.test(full)) return { label: cut(lines[0], 80), type: 'question' as const, body: cut(lines.slice(1).join('\n'), 600) }
  const label = cut(lines.join(' ') || unnamed, 80)
  return { label, type: 'text' as const, ...(full && (full.length > 80 || lines.length > 1) && { body: cut(full, 600) }) }
}

/**
 * What would print badly, as sentences, before a print or a PDF: a page short of what its rules need, a picture frame
 * with no picture, a QR code with no web address. Empty when there is nothing to ask about.
 */
export function gridPrintProblems(board: Board, pageIds?: string[]): string[] {
  const pages = gridPages(board).filter(page => !pageIds || pageIds.includes(page.id))
  const out: string[] = []
  for (const page of pages) {
    const needs = gridNeeds(board, page.id)
    if (needs.length) out.push(page.label + ' needs ' + listed(needs) + '.')
    for (const card of readingOrder(board).filter(item => item.laneId === page.id)) {
      if ((card.tile?.type === 'image' || card.tile?.type === 'sticker') && !card.tile.image?.src) out.push(said(card.label) + ' on ' + page.label + ' has no picture yet: it prints as an empty frame.')
      if (card.tile?.type === 'qr' && !card.tile.link) out.push(said(card.label) + ' on ' + page.label + ' has no web address, so it prints no code.')
    }
  }
  return out
}

// ---------------------------------------------------------------------------------------------
// Edits.

const cardField = (about: string) => ({ type: 'ref' as const, of: 'card' as const, about })
const pageField = (about: string, optional = false) => ({ type: 'ref' as const, of: 'lane' as const, about, ...(optional && { optional }) })
const text = (max: number, about: string, optional = true) => ({ type: 'text' as const, max, about, ...(optional && { optional }) })
const whole = (min: number, max: number, about: string, optional = true) => ({ type: 'integer' as const, min, max, about, ...(optional && { optional }) })
const gridOnly = ['grid' as const]
const typeChoice = (optional: boolean) => ({ type: 'choice' as const, values: [...gridTileTypes], about: 'The kind of tile: ' + gridTileTypes.join(', ') + '.', ...(optional && { optional }) })
function extend(more: { kinds: WorkshopEditKind[]; boards: Partial<Record<WorkshopEditKindName, 'grid'[]>>; fields: Partial<Record<WorkshopEditKindName, Record<string, WorkshopEditField>>>;
  rules: { kinds: string[]; keys: Record<string, unknown> } }) {
  const entryOf = (kind: string) => workshopEditKinds.find(item => item.kind === kind)!
  for (const entry of more.kinds) if (!workshopEditKinds.some(item => item.kind === entry.kind)) workshopEditKinds.push(entry)
  for (const [kind, boards] of Object.entries(more.boards)) for (const board of boards!) {
    const entry = entryOf(kind)
    if (!entry.boards.includes(board)) { entry.boards.push(board); delete entry.refusals[board] }
  }
  for (const [kind, fields] of Object.entries(more.fields)) Object.assign(entryOf(kind).fields, fields)
  workshopRuleSchema.kinds.push(...more.rules.kinds.filter(kind => !workshopRuleSchema.kinds.includes(kind)))
  Object.assign(workshopRuleSchema.keys, more.rules.keys)
}
const tileFields = {
  label: text(80, 'What the tile is called (a heading’s words, a question’s name). Left out, its kind: “Heading”.'),
  body: text(600, 'Its words: a text block’s text, a question’s question, how many answer lines. Line breaks are kept.'),
  words: { type: 'words' as const, min: 3, max: 24, each: 40, optional: true, about: 'A word bank’s words, 3 to 24.' },
  image: { type: 'image' as const, optional: true, about: 'A picture it shows (src and alt). Left out, an image tile is an empty frame that prints its words.' },
  alt: text(120, 'What the picture shows, for an empty frame.'),
  link: text(2048, 'A QR code’s web address (http or https).'),
}
extend({
  kinds: [
    { kind: 'set_page', summary: 'Grid sheet: set the page’s size (letter or a4), orientation and margin (inches, ¼ to 1). Tiles that no longer fit go to the first free cell, or back to the tray.', intent: false,
      fields: { size: { type: 'choice', values: ['letter', 'a4'], optional: true, about: 'letter or a4.' }, orientation: { type: 'choice', values: ['portrait', 'landscape'], optional: true, about: 'portrait or landscape.' },
        margin: { type: 'number', min: 0.25, max: 1, optional: true, about: 'Inches, in eighths: 0.25 to 1.' } }, boards: gridOnly, refusals: {} },
    { kind: 'set_grid', summary: 'Grid sheet: set how many rows (1 to 12) and columns (1 to 8) of cells a page has, and the gap between them (inches, 0 to ½). Tiles that no longer fit move to the first free cell, or back to the tray.', intent: false,
      fields: { rows: whole(1, 12, 'Rows of cells.'), cols: whole(1, 8, 'Columns of cells.'), gutter: { type: 'number', min: 0, max: 0.5, optional: true, about: 'The gap between cells, inches in sixteenths.' } }, boards: gridOnly, refusals: {} },
    { kind: 'add_tile', summary: 'Grid sheet: add a tile: a stamp to the tray (each drop makes a copy), or a tile on a page at a row and column (1-based). Left without a page, the first free cell of page 1, else the tray.', intent: false,
      fields: { type: typeChoice(false), ...tileFields, stamp: { type: 'flag', optional: true, about: 'True for a stamp that stays in the tray.' },
        page: pageField('The page it goes on.', true), row: whole(1, 12, 'Its row, from 1.'), col: whole(1, 8, 'Its column, from 1.'), rows: whole(1, 12, 'Rows it spans.'), cols: whole(1, 8, 'Columns it spans.') }, boards: gridOnly, refusals: {} },
    { kind: 'place_tile', summary: 'Grid sheet: put a tile in a cell of a page (row and column from 1), spanning rows by columns. A stamp is copied there and stays in the tray.', intent: true,
      fields: { card: cardField('The tile, or a stamp in the tray.'), page: pageField('The page, or the tray to take it off the page.'), row: whole(1, 12, 'Its row, from 1.', false), col: whole(1, 8, 'Its column, from 1.', false),
        rows: whole(1, 12, 'Rows it spans.'), cols: whole(1, 8, 'Columns it spans.'),
        override: { type: 'flag', optional: true, about: 'True to place it anyway when a limit or the sheet’s tiles refuse it, once the person agreed. Never past a page’s edge or over another tile.' } }, boards: gridOnly, refusals: {} },
    { kind: 'set_tile', summary: 'Grid sheet: change what a tile holds: its words, word bank, picture (null takes it away), QR address (null takes it away) or kind.', intent: false,
      fields: { card: cardField('The tile.'), ...(({ label: _, ...rest }) => rest)(tileFields), image: { type: 'image', optional: true, about: 'A picture (src and alt), or null to take it away.' },
        link: { type: 'text', max: 2048, min: 0, optional: true, about: 'A QR code’s web address; empty takes it away.' }, type: typeChoice(true) }, boards: gridOnly, refusals: {} },
    { kind: 'add_page', summary: 'Grid sheet: add a page (up to 4), empty or a copy of another (copyOf) with new tiles; shuffle reorders a copy’s terms (a different bingo card per player).', intent: false,
      fields: { copyOf: pageField('The page to copy.', true), shuffle: { type: 'flag', optional: true, about: 'True to shuffle the copied terms among their cells.' }, label: text(80, 'Its name. Left out, “Page N”.') }, boards: gridOnly, refusals: {} },
  ],
  boards: { add_rule: gridOnly, set_rule: gridOnly, remove_rule: gridOnly },
  fields: {
    set_rule: { types: { type: 'words', min: 1, max: 12, each: 20, optional: true, about: 'Grid sheet: the kinds of tile the sheet uses.' },
      per: { type: 'choice', values: ['page', 'sheet'], optional: true, about: 'Grid sheet: a limit per page or for the whole sheet.' },
      atLeast: whole(1, 12, 'Grid sheet: how many of a kind every page needs.'), rows: whole(1, 12, 'Grid sheet: rows a kind may span.'), cols: whole(1, 8, 'Grid sheet: columns a kind may span.') },
    add_card: { type: typeChoice(true), body: tileFields.body, image: { type: 'image', optional: true, about: 'Grid sheet: the picture a note brought.' }, row: whole(1, 12, 'Grid sheet: its row, from 1.'), col: whole(1, 8, 'Grid sheet: its column, from 1.') },
  },
  rules: { kinds: ['tileTypes', 'tileMax', 'tileNeeds', 'tileSpan'],
    keys: { types: { type: 'array', items: { enum: [...gridTileTypes] }, minItems: 1, maxItems: gridTileTypes.length }, type: { enum: [...gridTileTypes] },
      atLeast: { type: 'integer', minimum: 1, maximum: 12 }, per: { enum: ['page', 'sheet'] }, rows: { type: 'integer', minimum: 1, maximum: 12 }, cols: { type: 'integer', minimum: 1, maximum: 8 } } },
})

const newId = (board: Board) => nextWorkshopId(board, 'tile')

/** A seeded shuffle: the same page id shuffles the same way on every screen. */
function shuffled<T>(items: T[], seed: string): T[] {
  let h = 2166136261
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
  const next = () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296 }
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(next() * (i + 1)); [out[i], out[j]] = [out[j], out[i]] }
  // Never the order it was in, when it can be helped: a copy that is the same card is no new card.
  if (out.length > 1 && out.every((item, i) => item === items[i])) out.push(out.shift()!)
  return out
}
const isFree = (card: WorkshopCard) => /^free(?: space)?!?$/i.test(card.label.trim())

/** The tile a tile edit's fields make (the words read as the model reads them). */
function tileOf(edit: { type: GridTileType; body?: string; words?: string[]; image?: StationImage | { src?: string; alt: string }; alt?: string; link?: string; stamp?: boolean }): GridTile {
  const image = edit.image ? { alt: edit.image.alt || edit.alt || '', ...(edit.image.src && { src: edit.image.src }) } : edit.alt && ['image', 'diagram', 'sticker', 'panel'].includes(edit.type) ? { alt: edit.alt } : undefined
  return { type: edit.type, ...(edit.body && { body: edit.body }), ...(edit.words && { words: edit.words }), ...(image && { image }), ...(edit.link && { link: edit.link }), ...(edit.stamp && { stamp: true as const }) }
}

/** Why a span may not go at a cell, in a person's words; null when it may. */
function placeRefusal(board: Board, pageId: string, cell: GridCell, cardId: string | undefined, type: GridTileType): string | null {
  const grid = board.grid!
  const problem = fits(board, pageId, cell, cardId)
  if (!problem) return null
  const { rows, cols } = spanOf(cell)
  if (problem.reason === 'taken') {
    const by = board.cards.find(item => item.id === problem.by)
    return rows * cols > 1 ? `That spot needs ${spanWords({ rows, cols })} free cells, and ${said(by?.label ?? 'a tile')} is in the way.` : `That cell holds ${said(by?.label ?? 'a tile')}.`
  }
  const what = (rows * cols > 1 ? 'A ' + spanWords({ rows, cols }) + ' ' : 'A ') + nouns[type][0]
  if (cell.row + rows > grid.cells.rows) return `${what} needs ${rows} free ${rows === 1 ? 'row' : 'rows'} here; row ${grid.cells.rows} is the last.`
  return `${what} needs ${cols} free ${cols === 1 ? 'column' : 'columns'} here; column ${grid.cells.cols} is the last.`
}

/** A sheet's tray never moves; its pages are the lanes after it. */
function gridFixed(before: Board, after: Board): string | null {
  if (after.lanes[0]?.id !== GRID_TRAY) return 'A grid sheet keeps its tray first. Add a page, or remove one, instead.'
  return null
}

function gridEdit(input: Board, edit: WorkshopEdit, t: BusinessEditTools): BusinessEditStep | null {
  const board = input
  const grid = board.grid!
  const pages = gridPages(board)
  const cap = (more: number, sentence?: string) => {
    if (board.cards.length + more > GRID_MAX_TILES) t.refuse(sentence ?? `A grid sheet holds up to ${GRID_MAX_TILES} tiles. Remove one first.`)
  }
  const page = (ref: WorkshopRef) => {
    const lane = t.lane(ref)
    return lane
  }
  /** A tile at a cell of a page (or in the tray), with the rules' say in it, marked when placed anyway. */
  const land = (next: Board, cardId: string, override: boolean | undefined, sentence: string, laneId: string, from?: WorkshopCard) => {
    if (override) {
      const verdict = board.behaviour ? checkGrid(board, next) : null
      if (verdict && 'refused' in verdict) {
        if (!gridOverridable(board, verdict.refused.ruleId)) t.refuse(verdict.refused.sentence, { laneId, cardId })
        const card = next.cards.find(item => item.id === cardId)!
        // A stamp's copy came from the tray, where the stamp is.
        const was = board.cards.find(item => item.id === cardId) ?? from
        const mark = workshopOverrideMark(was ?? card, verdict.refused.sentence, t.who ?? { by: 'an agent', at: new Date().toISOString() })
        next = { ...next, cards: next.cards.map(item => item.id === cardId ? { ...item, override: mark } : item) }
        return t.done(t.settle(next, laneId, cardId), sentence.replace(/\.$/, ' anyway. ') + verdict.refused.sentence, { laneId, cardId })
      }
    }
    return t.done(t.settle(next, laneId, cardId), sentence, { laneId, cardId })
  }
  /** A new tile on a page or in the tray: at the cell asked (1-based), else the first free cell for its span, else the tray. */
  const addTile = (fields: GridTile, label: string, to: { laneId: string; row?: number; col?: number; rows?: number; cols?: number }) => {
    cap(1)
    if (fields.stamp && board.cards.filter(card => card.tile?.stamp).length >= GRID_MAX_STAMPS) t.refuse(`A sheet holds up to ${GRID_MAX_STAMPS} stamps.`)
    const id = newId(board)
    const span = { ...defaultSpan(board, fields.type), ...(to.rows && { rows: to.rows }), ...(to.cols && { cols: to.cols }) }
    let laneId = fields.stamp ? GRID_TRAY : to.laneId
    let cell: GridCell | undefined
    if (laneId !== GRID_TRAY) {
      if (to.row !== undefined || to.col !== undefined) {
        cell = { row: (to.row ?? 1) - 1, col: (to.col ?? 1) - 1, ...(span.rows > 1 && { rows: span.rows }), ...(span.cols > 1 && { cols: span.cols }) }
        const no = placeRefusal(board, laneId, cell, undefined, fields.type)
        if (no) t.refuse(no, { laneId })
      } else {
        // The span shrinks to what the page has room for, as a reflow does.
        const tries = [span, { rows: 1, cols: span.cols }, { rows: 1, cols: 1 }]
        for (const want of tries) {
          const free = freeCells(board, laneId, want)[0]
          if (free) { cell = { ...free, ...(want.rows > 1 && { rows: want.rows }), ...(want.cols > 1 && { cols: want.cols }) }; break }
        }
        if (!cell) laneId = GRID_TRAY
      }
    }
    const card: WorkshopCard = { id, label, laneId, tile: fields, ...(cell && { cell }) }
    const where = cell ? pageLabel(board, laneId) + ', ' + at(cell) : fields.stamp ? 'the tray, as a stamp' : to.laneId === GRID_TRAY ? 'the tray' : 'the tray: ' + pageLabel(board, to.laneId) + ' has no free cell'
    return t.done(t.settle({ ...board, cards: [...board.cards, card] }, laneId, id), 'Added ' + said(label) + ' to ' + where + '.', { laneId, cardId: id })
  }

  switch (edit.kind) {
    case 'add_card': {
      const lane = t.lane(edit.lane)
      const type = edit.type ?? 'text'
      const fields = tileOf({ type, body: edit.body, image: edit.image })
      return addTile(fields, (edit.label?.trim() || tileName(type)).slice(0, 80), { laneId: lane.id, row: edit.row, col: edit.col })
    }
    case 'add_tile': {
      if (edit.type === 'word-bank' && !edit.words?.length) t.refuse('Say the words that go in the bank: 3 to 24 of them.')
      const fields = tileOf(edit)
      const lane = edit.page !== undefined ? page(edit.page) : pages[0]
      return addTile(fields, (edit.label?.trim() || tileName(edit.type)).slice(0, 80), { laneId: lane.id, row: edit.row, col: edit.col, rows: edit.rows, cols: edit.cols })
    }
    case 'place_tile': {
      const card = t.card(edit.card)
      const lane = page(edit.page)
      const type = card.tile!.type
      if (lane.id === GRID_TRAY) {
        if (card.tile?.stamp || card.laneId === GRID_TRAY) return t.done(board, said(card.label) + ' is in the tray already.', { laneId: GRID_TRAY, cardId: card.id })
        const { cell: _, override: __, ...loose } = card
        const next = { ...board, cards: [...board.cards.filter(item => item.id !== card.id), { ...loose, laneId: GRID_TRAY }] }
        return t.done(t.settle(next, GRID_TRAY, card.id), 'Put ' + said(card.label) + ' back in the tray.', { laneId: GRID_TRAY, cardId: card.id })
      }
      const was = card.laneId === lane.id && card.cell ? spanOf(card.cell) : defaultSpan(board, type)
      const span = { rows: edit.rows ?? was.rows, cols: edit.cols ?? was.cols }
      const cell: GridCell = { row: edit.row - 1, col: edit.col - 1, ...(span.rows > 1 && { rows: span.rows }), ...(span.cols > 1 && { cols: span.cols }) }
      const copy = Boolean(card.tile?.stamp)
      const no = placeRefusal(board, lane.id, cell, copy ? undefined : card.id, type)
      if (no) t.refuse(no, { laneId: lane.id, cardId: card.id })
      const spanSaid = span.rows * span.cols > 1 ? ', spanning ' + spanWords(span) : ''
      if (copy) {
        cap(1)
        const id = newId(board)
        const { stamp: _, ...tile } = card.tile!
        const made: WorkshopCard = { id, label: card.label, laneId: lane.id, tile, cell, ...(card.look && { look: card.look }) }
        return land({ ...board, cards: [...board.cards, made] }, id, edit.override, 'Put a copy of ' + said(card.label) + ' on ' + lane.label + ', ' + at(cell) + spanSaid + '.', lane.id, card)
      }
      if (card.laneId === lane.id && card.cell && JSON.stringify(card.cell) === JSON.stringify(cell)) return t.done(board, said(card.label) + ' is there already.', { laneId: lane.id, cardId: card.id })
      const moved = { ...card, laneId: lane.id, cell }
      return land({ ...board, cards: board.cards.map(item => item.id === card.id ? moved : item) }, card.id, edit.override, 'Put ' + said(card.label) + ' on ' + lane.label + ', ' + at(cell) + spanSaid + '.', lane.id)
    }
    case 'move_card': {
      const card = t.card(edit.card)
      const lane = t.lane(edit.lane)
      if (lane.id === GRID_TRAY) return gridEdit(input, { kind: 'place_tile', card: { id: card.id }, page: { id: GRID_TRAY }, row: 1, col: 1 }, t)
      if (card.laneId === lane.id) return t.done(board, said(card.label) + ' is on ' + lane.label + ' already.', { laneId: lane.id, cardId: card.id })
      return t.refuse('Say where on the page: row and column.', { laneId: lane.id, cardId: card.id })
    }
    case 'set_tile': {
      const card = t.card(edit.card)
      const tile: GridTile = { ...card.tile! }
      if (edit.type !== undefined) tile.type = edit.type
      if (edit.body !== undefined) { if (edit.body.trim()) tile.body = edit.body; else delete tile.body }
      if (edit.words !== undefined) tile.words = edit.words
      if (tile.type !== 'word-bank') delete tile.words
      if (edit.image === null) delete tile.image
      else if (edit.image !== undefined) tile.image = { alt: edit.image.alt, ...(edit.image.src && { src: edit.image.src }) }
      else if (edit.alt !== undefined) tile.image = { ...tile.image, alt: edit.alt }
      if (edit.link === null || edit.link === '') delete tile.link
      else if (edit.link !== undefined) tile.link = edit.link
      if (tile.type === 'word-bank' && !tile.words) t.refuse('Say the words that go in the bank: 3 to 24 of them.', { cardId: card.id })
      const next = { ...board, cards: board.cards.map(item => item.id === card.id ? { ...item, tile } : item) }
      return t.done(t.settle(next, card.laneId, card.id), 'Changed ' + said(card.label) + '.', { laneId: card.laneId, cardId: card.id })
    }
    case 'set_page': case 'set_grid': {
      const fields: GridFields = edit.kind === 'set_page'
        ? { ...grid, page: { size: edit.size ?? grid.page.size, orientation: edit.orientation ?? grid.page.orientation, margin: edit.margin ?? grid.page.margin } }
        : { ...grid, cells: { rows: edit.rows ?? grid.cells.rows, cols: edit.cols ?? grid.cells.cols, gutter: edit.gutter ?? grid.cells.gutter } }
      const small = cellSizeProblem(fields)
      if (small) t.refuse(small)
      const made = reflow({ ...board, grid: fields }, GRID_TRAY)
      const head = edit.kind === 'set_page'
        ? 'Made it ' + pageName(fields.page.size) + ' ' + fields.page.orientation + (edit.margin !== undefined ? ', with ' + marginWords(fields.page.margin) + ' margins' : '') + '.'
        : edit.rows !== undefined && edit.cols !== undefined ? `Made it ${fields.cells.rows} ${fields.cells.rows === 1 ? 'row' : 'rows'} by ${fields.cells.cols} ${fields.cells.cols === 1 ? 'column' : 'columns'}.`
          : edit.cols !== undefined ? `Made it ${fields.cells.cols} ${fields.cells.cols === 1 ? 'column' : 'columns'}.`
            : edit.rows !== undefined ? `Made it ${fields.cells.rows} ${fields.cells.rows === 1 ? 'row' : 'rows'}.`
              : fields.cells.gutter ? `Cells are ${marginWords(fields.cells.gutter)} apart now.` : 'Cells touch now: no gaps.'
      const sent = made.sent.map(item => ` ${said(item.label)} went back to the tray: no ${spanWords(item.span)} room left.`).join('')
      return t.done(t.settle(made.board), head + sent)
    }
    case 'add_page': {
      if (board.lanes.length >= 5) t.refuse('A grid sheet holds up to 4 pages. Remove one first.')
      let n = 1
      while (board.lanes.some(lane => lane.id === 'page-' + n)) n++
      const id = 'page-' + n
      const label = (edit.label?.trim() || 'Page ' + (pages.length + 1)).slice(0, 80)
      const source = edit.copyOf !== undefined ? page(edit.copyOf) : null
      if (source?.id === GRID_TRAY) t.refuse('Copy a page, not the tray.')
      let cards = board.cards
      const lanes = [...board.lanes, { id, label }]
      if (source) {
        const placed = readingOrder(board).filter(card => card.laneId === source.id)
        if (board.cards.length + placed.length > GRID_MAX_TILES) {
          t.refuse(`${label} would need ${placed.length} more tiles; a sheet holds ${GRID_MAX_TILES}.`)
        }
        let scratch: Board = { ...board, lanes }
        const copies = placed.map(card => {
          const copyId = newId(scratch)
          const { override: _, noteId: __, ...rest } = card
          const made = { ...rest, id: copyId, laneId: id }
          scratch = { ...scratch, cards: [...scratch.cards, made] }
          return made
        })
        if (edit.shuffle) {
          const terms = copies.filter(card => card.tile?.type === 'term' && !isFree(card))
          const order = shuffled(terms.map(card => ({ label: card.label, tile: card.tile, look: card.look })), id)
          terms.forEach((card, i) => { card.label = order[i].label; card.tile = order[i].tile; if (order[i].look) card.look = order[i].look; else delete card.look })
        }
        cards = [...board.cards, ...copies]
      }
      const next = { ...board, lanes, cards, ...(board.presentationOrder && { presentationOrder: [...board.presentationOrder, id] }) }
      const what = source ? 'a copy of ' + source.label + (edit.shuffle ? ', its terms shuffled' : '') : 'an empty page'
      return t.done(t.settle(next, id), 'Added ' + said(label) + ': ' + what + '.', { laneId: id })
    }
    case 'remove_lane': {
      const lane = t.lane(edit.lane)
      if (lane.id === GRID_TRAY) t.refuse('The tray stays: it holds the tiles people add.', { laneId: lane.id })
      if (lane.id === board.lanes[1].id) t.refuse(lane.label + ' stays: a sheet has at least one page.', { laneId: lane.id })
      const gone = board.cards.filter(card => card.laneId === lane.id).length
      const next = { ...board, lanes: board.lanes.filter(item => item.id !== lane.id), cards: board.cards.filter(card => card.laneId !== lane.id),
        ...(board.presentationOrder && { presentationOrder: board.presentationOrder.filter(item => item !== lane.id) }) }
      return t.done(t.settle(next), 'Removed ' + said(lane.label) + (gone ? ' and its ' + gone + (gone === 1 ? ' tile' : ' tiles') : '') + '.')
    }
    case 'remove_card': {
      const card = t.card(edit.card)
      const next = { ...board, cards: board.cards.filter(item => item.id !== card.id) }
      return t.done(t.settle(next, card.laneId), 'Removed the tile ' + said(card.label) + '.', { laneId: card.laneId, cardId: card.id })
    }
    case 'set_lane_capacity':
      return t.refuse('A page holds as many tiles as it has cells: change the grid instead.', { code: 'not_on_this_board' })
  }
  return null
}

const marginWords = (inches: number) => ({ 0.25: 'quarter-inch', 0.5: 'half-inch', 0.75: 'three-quarter-inch', 1: 'one-inch', 0.125: 'eighth-inch', 0.0625: 'sixteenth-inch' } as Record<number, string>)[inches] ?? inches + '-inch'

/** The grid sheet's part of the one gate (see kinds.ts). */
export const gridRules: BusinessBoardRules = {
  kind: 'grid',
  cards: [GRID_MAX_TILES, `A grid sheet holds up to ${GRID_MAX_TILES} tiles.`],
  rulebook: gridFamily,
  drags: board => JSON.stringify([board.grid, rulesOn(board)]),
  fixed: gridFixed,
  readCard(raw, card) {
    card.tile = readTile(raw.tile)
    if (raw.cell !== undefined) card.cell = readCell(raw.cell)
  },
  readBoard(raw, board) {
    board.grid = readGrid(raw.grid)
  },
  validate: validateGrid,
  planMove(board, cardId, laneId) {
    const card = board.cards.find(item => item.id === cardId)
    if (!card || !board.lanes.some(lane => lane.id === laneId)) return null
    if (card.laneId === laneId) return board
    if (laneId !== GRID_TRAY || card.tile?.stamp) return null
    const { cell: _, ...loose } = card
    return { ...board, cards: [...board.cards.filter(item => item.id !== cardId), { ...loose, laneId }] }
  },
  refusal(board, cardId, laneId) {
    const card = board.cards.find(item => item.id === cardId)
    if (!card || card.laneId === laneId) return null
    return laneId === GRID_TRAY ? null : 'Say where on the page: row and column.'
  },
  caption: gridCaption,
  cardText: gridCardText,
  noteText: gridNoteText,
  fromNote: gridFromNote,
  newCard: () => 'tile',
  renamed: (_board, _cardId, words) => ({ label: words.replace(/\s+/g, ' ').trim().slice(0, 80), edits: [] }),
  edit: gridEdit,
}
registerWorkshopRules(gridRules)

// ---------------------------------------------------------------------------------------------
// Samples: the boards the library's printable page adds.

const preset = (rules: Array<Record<string, unknown>>): Behaviour => ({ version: 1, rev: 0,
  rules: rules.map((rule, i) => ({ id: 'rule-' + (i + 1), on: true, severity: 'refuse', set: { by: 'Slatebox', at: '2026-11-25T00:00:00.000Z', via: 'preset' }, ...rule }) as never) })
type TileSpec = [label: string, tile: GridTile, cell?: GridCell]
/** A sheet from its page, its stamps and page 1's tiles. */
export function gridSheet(title: string, grid: GridFields, stamps: TileSpec[], placed: TileSpec[], rules: Array<Record<string, unknown>>, more: { pages?: TileSpec[][] } = {}): Board {
  let n = 0
  const id = () => 'tile-' + (++n)
  const pageCards = (list: TileSpec[], laneId: string) => list.map(([label, tile, cell]) => ({ id: id(), label, laneId, tile, cell: cell! }))
  return {
    version: 1, kind: 'grid', title, grid,
    lanes: [{ id: GRID_TRAY, label: 'Tiles' }, { id: 'page-1', label: 'Page 1' }, ...(more.pages ?? []).map((_, i) => ({ id: 'page-' + (i + 2), label: 'Page ' + (i + 2) }))],
    cards: [...stamps.map(([label, tile]) => ({ id: id(), label, laneId: GRID_TRAY, tile: { ...tile, stamp: true as const } })), ...pageCards(placed, 'page-1'),
      ...(more.pages ?? []).flatMap((list, i) => pageCards(list, 'page-' + (i + 2)))],
    behaviour: preset(rules),
  }
}
const letter = (rows: number, cols: number, gutter = 0.125): GridFields => ({ page: { size: 'letter', orientation: 'portrait', margin: 0.5 }, cells: { rows, cols, gutter } })

/** A worksheet: a heading, questions with answer lines and a word bank, on a Letter page of 6 by 2 cells. */
export function worksheetSample(): Board {
  return gridSheet('Fractions practice', letter(6, 2), [
    ['Heading', { type: 'heading', body: 'Name: ______  Date: ______' }], ['Question', { type: 'question', body: 'What is 1/2 + 1/4?' }],
    ['Answer lines', { type: 'answer-lines', body: '3' }], ['Word bank', { type: 'word-bank', words: ['numerator', 'denominator', 'equivalent'] }],
  ], [
    ['Fractions practice', { type: 'heading', body: 'Name: ______  Date: ______' }, { row: 0, col: 0, cols: 2 }],
    ['Adding fractions', { type: 'question', body: 'What is 1/2 + 1/4?' }, { row: 1, col: 0 }], ['Show your work', { type: 'answer-lines', body: '3' }, { row: 1, col: 1 }],
    ['Shade the bar', { type: 'question', body: 'Shade 3/8 of a bar split into 8 equal parts.' }, { row: 2, col: 0 }], ['Your answer', { type: 'answer-lines', body: '2' }, { row: 2, col: 1 }],
    ['Compare', { type: 'question', body: 'Which is larger, 2/3 or 3/5? Explain how you know.' }, { row: 3, col: 0 }],
    ['Words to use', { type: 'word-bank', words: ['numerator', 'denominator', 'equivalent', 'whole'] }, { row: 5, col: 0, cols: 2 }],
  ], [{ kind: 'tileMax', type: 'heading', max: 1, per: 'page' }, { kind: 'tileNeeds', type: 'heading', atLeast: 1, per: 'page' }, { kind: 'tileMax', type: 'question', max: 6, per: 'page' }])
}

const animals = ['Lion', 'Tiger', 'Zebra', 'Giraffe', 'Panda', 'Koala', 'Otter', 'Eagle', 'Shark', 'Whale', 'Camel', 'Rhino', 'Hippo', 'Moose', 'Bison',
  'Llama', 'Gecko', 'Parrot', 'Penguin', 'Dolphin', 'Fox', 'Wolf', 'Bear', 'Owl']
/** Bingo: a title across the top and 5 by 5 squares of animals, Free in the middle; duplicate it shuffled for each player. */
export function bingoSample(): Board {
  const terms: TileSpec[] = []
  let i = 0
  for (let row = 1; row <= 5; row++) for (let col = 0; col < 5; col++) {
    terms.push(row === 3 && col === 2 ? ['Free', { type: 'term' }, { row, col }] : [animals[i++], { type: 'term' }, { row, col }])
  }
  return gridSheet('Animal bingo', letter(6, 5), [['Title', { type: 'heading' }], ['Animal', { type: 'term' }]],
    [['Animal bingo', { type: 'heading' }, { row: 0, col: 0, cols: 5 }], ...terms],
    [{ kind: 'tileMax', type: 'heading', max: 1, per: 'page' }, { kind: 'tileNeeds', type: 'heading', atLeast: 1, per: 'page' }, { kind: 'tileTypes', types: ['heading', 'term'] }])
}

/** Flashcards: eight terms with what they mean, on a Letter page of 4 by 2 cards with a wide gap to cut along. */
export function flashcardSample(): Board {
  const cards: [string, string][] = [['Photosynthesis', 'How plants make food from light'], ['Mitosis', 'A cell splitting into two'], ['Evaporation', 'Liquid turning into gas'],
    ['Gravity', 'The pull between masses'], ['Habitat', 'Where a living thing lives'], ['Predator', 'An animal that hunts others'], ['Erosion', 'Land worn away by wind or water'], ['Fossil', 'Remains kept in rock']]
  return gridSheet('Science flashcards', letter(4, 2, 0.25), [['Term', { type: 'term', body: 'What it means' }], ['Picture', { type: 'image', image: { alt: 'A picture of the term' } }]],
    cards.map(([label, body], i) => [label, { type: 'term', body }, { row: Math.floor(i / 2), col: i % 2 }]),
    [{ kind: 'tileTypes', types: ['term', 'image'] }])
}

export const gridSamples = { worksheet: worksheetSample, bingo: bingoSample, flashcards: flashcardSample }
