// A board's appearance, as data on the board (Workshop.appearance): saved, synced and undone with the board, carried
// into library snapshots and forks, and drawn by the one drawing every surface uses (the live canvas, the still
// renderer, a preview). A small vocabulary, the same for every kind of board: how strong the columns' borders, headers
// and fills are, grid lines, compact cards and a color for a column (or a 2 by 2's quadrant) from one palette. The
// set_appearance edit (edits.ts) is the one way to change it: chat, exec, the AI turn and the board's own chips.

/** The palette a column takes a color from: soft fills that keep dark words readable (the cards' own named colors). */
export const appearancePalette: Record<string, string> = {
  red: '#f4b6b6', orange: '#f9cf9f', yellow: '#fbe79b', green: '#bfe3b4', blue: '#b9d4f1', purple: '#d7c3ee', pink: '#f6c1dc',
  teal: '#b2e0dc', brown: '#dcc3a8', gray: '#e0e0e0',
}
/** A 2 by 2's quadrants, by the key its parts are named with (column-q-do-now), and what they are called. */
export const appearanceQuadrants: Record<string, string> = { 'q-do-now': 'Do now', 'q-plan': 'Plan it', 'q-later': 'Later', 'q-skip': 'Skip' }

export interface WorkshopAppearance {
  /** The columns' outlines (normal when left out). */
  borders?: 'subtle' | 'strong'
  /** The column headers: subtle is quieter, strong is bold with a deeper fill. */
  headers?: 'subtle' | 'strong'
  headerSize?: 'large'
  /** The columns' fills: soft is paler, strong deeper. */
  fill?: 'soft' | 'strong'
  /** Grid lines: dark lines between the columns (a 2 by 2's quadrant lines). */
  lines?: true
  density?: 'compact'
  /** A column's color from the palette, by lane id (on a 2 by 2, also a quadrant's key, q-do-now). */
  colors?: Record<string, string>
}

const levels: Record<string, string[]> = { borders: ['subtle', 'strong'], headers: ['subtle', 'strong'], headerSize: ['large'], fill: ['soft', 'strong'], density: ['compact'] }

/** A board's appearance, checked. A color for a column that is gone is dropped; anything unknown is left out. */
export function readAppearance(input: unknown, keys: string[]): WorkshopAppearance | undefined {
  // Null (a stored document or an agent's JSON) is no look, as left out is.
  if (input === null || input === undefined) return undefined
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('A board’s appearance is an object.')
  const raw = input as Record<string, unknown>
  const out: Record<string, unknown> = {}
  for (const [key, values] of Object.entries(levels)) {
    if (raw[key] === undefined) continue
    if (!values.includes(raw[key] as string)) throw new Error(`A board’s ${key} is ${values.join(' or ')}.`)
    out[key] = raw[key]
  }
  if (raw.lines !== undefined && typeof raw.lines !== 'boolean') throw new Error('A board’s lines are on or off.')
  if (raw.lines) out.lines = true
  if (raw.colors !== undefined) {
    if (!raw.colors || typeof raw.colors !== 'object' || Array.isArray(raw.colors)) throw new Error('A board’s colors are by column.')
    const colors: Record<string, string> = {}
    for (const [key, name] of Object.entries(raw.colors as Record<string, unknown>)) {
      if (!keys.includes(key)) continue
      if (typeof name !== 'string' || !appearancePalette[name]) throw new Error('Use a color such as ' + Object.keys(appearancePalette).slice(0, 4).join(', ') + '.')
      colors[key] = name
    }
    if (Object.keys(colors).length) out.colors = colors
  }
  return Object.keys(out).length ? out as WorkshopAppearance : undefined
}

/** The keys a board's colors may name: its lanes, and on a 2 by 2 its quadrants. */
export function appearanceKeys(board: { lanes: { id: string }[]; kind?: string; nest?: { layout?: string } }): string[] {
  return [...board.lanes.map(lane => lane.id), ...(board.kind === 'nest' && board.nest?.layout === 'matrix' ? Object.keys(appearanceQuadrants) : [])]
}

const hex6 = (color?: string): color is string => typeof color === 'string' && /^#[0-9a-f]{6}$/i.test(color)
/** Blend a #rrggbb color toward white (amount > 0) or black (amount < 0); anything else is kept. */
export function blend(color: string | undefined, amount: number): string | undefined {
  if (!hex6(color)) return color
  const to = amount > 0 ? 255 : 0, a = Math.abs(amount)
  const channel = (i: number) => Math.round(parseInt(color.slice(i, i + 2), 16) * (1 - a) + to * a).toString(16).padStart(2, '0')
  return '#' + channel(1) + channel(3) + channel(5)
}

/** The look of one drawn part that an appearance changes. */
export interface AppearanceLook { fill?: string; line?: string; lineWidth?: number; fontSize?: number; weight?: 'bold'; height?: number }

/**
 * One part's look under a board's appearance, by the part's name (column-, lane-, caption-, card-, unscoped). The same
 * for a board of columns (workshopToSlate) and every kit's parts (partNotes), so every kind of board takes it alike.
 */
export function appearanceLook(appearance: WorkshopAppearance | undefined, name: string, look: AppearanceLook): AppearanceLook {
  const m = appearance && /^(column|lane|caption|card)-(.+)$/.exec(name)
  if (!m) return look
  const a = appearance!, [, part, key] = m, out = { ...look }
  const color = a.colors?.[key] && appearancePalette[a.colors[key]]
  if (part === 'column') {
    if (color) { out.fill = blend(color, a.fill === 'soft' ? 0.75 : a.fill === 'strong' ? 0.3 : 0.55); out.line = blend(color, -0.25) }
    else if (a.fill) out.fill = blend(out.fill, a.fill === 'soft' ? 0.5 : -0.1)
    if (a.borders === 'strong') { out.lineWidth = 3; out.line = blend(out.line ?? out.fill, -0.45) }
    if (a.borders === 'subtle') { out.lineWidth = 1; out.line = blend(out.line, 0.6) }
    if (a.lines) { out.lineWidth = Math.max(2, out.lineWidth ?? 1); out.line = '#4b5a55' }
  } else if (part === 'lane' || (part === 'caption' && /^q-|^axis-/.test(key))) {
    if (color && part === 'lane') out.fill = color
    if (a.headers === 'strong') {
      out.weight = 'bold'
      if (part === 'lane') { out.fill = blend(out.fill, -0.12); out.lineWidth = 2; out.line = blend(out.fill, -0.4) }
    }
    if (a.headers === 'subtle' && part === 'lane') { out.fill = blend(out.fill, 0.5); out.lineWidth = 0 }
    if (a.headerSize && out.fontSize) out.fontSize = Math.min(36, Math.round(out.fontSize * 1.3))
  } else if (part === 'card' && a.density && out.height) {
    out.height = Math.max(28, Math.round(out.height * 0.72))
    if (out.fontSize) out.fontSize = Math.max(11, out.fontSize - 2)
  }
  return out
}

/** The set_appearance edit's fields (edits.ts): emphasis sets borders, headers and fills together; the rest each set one. */
export interface AppearanceEdit {
  emphasis?: 'subtle' | 'normal' | 'strong'
  borders?: 'subtle' | 'normal' | 'strong'
  headers?: 'subtle' | 'normal' | 'strong'
  headerSize?: 'normal' | 'large'
  fill?: 'soft' | 'normal' | 'strong'
  lines?: boolean
  density?: 'normal' | 'compact'
  color?: string
}

const words: Record<string, Record<string, string>> = {
  borders: { strong: 'stronger column borders', subtle: 'lighter column borders', normal: 'standard column borders' },
  headers: { strong: 'bolder headers', subtle: 'quieter headers', normal: 'standard headers' },
  headerSize: { large: 'bigger headers', normal: 'standard-size headers' },
  fill: { strong: 'deeper column colors', soft: 'a softer background', normal: 'standard column colors' },
  lines: { true: 'grid lines', false: 'no grid lines' },
  density: { compact: 'compact cards', normal: 'roomy cards' },
}

/**
 * The board with an appearance edit made, and what to tell the person. `part` is the column (or quadrant) a color is for:
 * its key and what it is called. Nothing else on the board changes.
 */
export function withAppearance<T extends { appearance?: WorkshopAppearance }>(board: T, edit: AppearanceEdit, part?: { key: string; label: string }):
  { board: T; said: string; changed: boolean } {
  const next: Record<string, unknown> = { ...board.appearance, colors: { ...board.appearance?.colors } }
  const asked: Record<string, string | boolean | undefined> = { ...edit }
  if (edit.emphasis) {
    asked.borders ??= edit.emphasis
    asked.headers ??= edit.emphasis
    asked.fill ??= edit.emphasis === 'subtle' ? 'soft' : edit.emphasis
  }
  const told: string[] = []
  for (const key of Object.keys(words)) {
    const value = asked[key]
    if (value === undefined) continue
    told.push(words[key][String(value)])
    if (value === 'normal' || value === false) delete next[key]
    else next[key] = value
  }
  const colors = next.colors as Record<string, string>
  if (edit.color !== undefined && part) {
    if (edit.color === 'none') { delete colors[part.key]; told.push(part.label + ' in its own color') }
    else { colors[part.key] = edit.color; told.push(part.label + ' in ' + edit.color) }
  }
  if (!Object.keys(colors).length) delete next.colors
  const was = JSON.stringify(board.appearance ?? {})
  const appearance = Object.keys(next).length ? next as WorkshopAppearance : undefined
  const changed = JSON.stringify(appearance ?? {}) !== was
  const made = { ...board, appearance } as T
  if (!appearance) delete made.appearance
  const list = told.length < 2 ? told.join('') : told.slice(0, -1).join(', ') + ' and ' + told.at(-1)
  return { board: made, changed, said: changed ? 'The board now has ' + list + '.' : 'The board already has ' + list + '.' }
}

/** The set_appearance edits that make `before`'s look `after`'s (a whole save of a business board said as its edits). */
export function appearanceEditsBetween(before: { appearance?: WorkshopAppearance }, after: { appearance?: WorkshopAppearance }): (AppearanceEdit & { kind: 'set_appearance'; lane?: { id: string } })[] {
  const a = before.appearance ?? {}, b = after.appearance ?? {}
  const fields: Record<string, unknown> = {}
  for (const key of ['borders', 'headers', 'headerSize', 'fill', 'density'] as const) if (a[key] !== b[key]) fields[key] = b[key] ?? 'normal'
  if (Boolean(a.lines) !== Boolean(b.lines)) fields.lines = Boolean(b.lines)
  const edits: (AppearanceEdit & { kind: 'set_appearance'; lane?: { id: string } })[] = Object.keys(fields).length ? [{ kind: 'set_appearance', ...fields }] : []
  for (const key of new Set([...Object.keys(a.colors ?? {}), ...Object.keys(b.colors ?? {})])) {
    if (a.colors?.[key] !== b.colors?.[key]) edits.push({ kind: 'set_appearance', lane: { id: key }, color: b.colors?.[key] ?? 'none' })
  }
  return edits
}

/**
 * What the board's chips say of its look (ruleControls.ts lays them out): Look, Cards and Lines for the rail, and for each
 * column (or a 2 by 2's quadrant) its swatch, each with the set_appearance edit a press makes and what that press makes.
 */
export function appearanceChips(board: { appearance?: WorkshopAppearance; lanes: { id: string; label: string }[]; nest?: { layout?: string } }, keys: string[]) {
  const look = board.appearance ?? {}, strong = look.borders === 'strong' && look.headers === 'strong'
  const chip = (id: string, label: string, on: boolean, makes: string, edit: AppearanceEdit) => ({ id: 'look:' + id, label, on, said: makes + '. ' + label + ' now.', edit: { kind: 'set_appearance', ...edit } })
  const names = Object.keys(appearancePalette)
  return {
    rail: [
      chip('emphasis', strong ? 'Look: strong' : 'Look: standard', strong, strong ? 'Standard columns' : 'Stronger columns', { emphasis: strong ? 'normal' : 'strong' }),
      chip('density', look.density ? 'Cards: compact' : 'Cards: roomy', !!look.density, look.density ? 'Roomy cards' : 'Compact cards', { density: look.density ? 'normal' : 'compact' }),
      chip('lines', look.lines ? 'Lines: on' : 'Lines: off', !!look.lines, look.lines ? 'No grid lines' : 'Grid lines', { lines: !look.lines }),
    ],
    swatches: keys.flatMap(key => {
      const label = board.lanes.find(lane => lane.id === key)?.label ?? appearanceQuadrants[key], now = look.colors?.[key], next = names[names.indexOf(now!) + 1]
      return label && (board.nest?.layout !== 'matrix' || appearanceQuadrants[key]) ? [{ key, now: now ?? null, swatch: now ? appearancePalette[now] : '#ffffff', sentence: label + ': ' + (now ?? 'own color'),
        said: label + ' in ' + (next ?? 'its own color') + '. Now ' + (now ?? 'its own color') + '.', edit: { kind: 'set_appearance', lane: { id: key }, color: next ?? 'none' } }] : []
    }),
  }
}
