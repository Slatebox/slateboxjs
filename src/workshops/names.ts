// Finding the lanes, cards, stations and tokens of a workshop by what someone called them: an
// id, `@id`, the whole name, a name as people write it (“the Now lane”, “Customer calls” for
// “Customer calls · $50 per call”), a place in the row (“the first lane”), or “this” for the
// selection. One finder for the edit reducer, the sentence readers and every agent surface,
// so a name picks the same thing wherever it is written.

/**
 * A name in curly quotes, as every reply and refusal writes it. Curly quotes inside the name
 * become straight ones, so a name cannot close its quotes early and pass its own words off as
 * the sentence's (a label is anyone's text, and these sentences reach agents too).
 */
export const said = (text: string) => '“' + text.replace(/[“”]/g, '"') + '”'
/** “A”, “A and B”, “A, B and C”. */
export const listed = (names: string[]) => names.length < 2 ? names.join('') : names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1]
const escaped = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
/** The text without the quotes around it. */
export const unquoted = (text: string) => text.trim().replace(/^["'“‘](.+)["'”’]$/, '$1').trim()
// A sentence ends in a full stop; the name it gives something does not. Quotes keep one that is meant.
const stopless = (text: string) => text.trim().replace(/([^.…])[.!]$/, '$1')
/** The name a person gave something: without the sentence's full stop or the quotes around it. */
export const named = (text: string) => unquoted(stopless(text))

const numberWords = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
  'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty']
/** A number written as digits or a word (“two”, “a”, “a single”). */
export const countWord = (text: string) => /^\d+$/.test(text) ? Number(text) : /^an?$|^a single$/i.test(text) ? 1 : numberWords.indexOf(text.toLowerCase())

/** Words that point at the selection instead of naming something. */
export const pointing = /^(?:this|it|that|here|there|this one|that one|(?:this|that|the selected|the current) (?:lane|column|card|feature|step|station|stop|token|one))$/i

// The ways a person may refer to one lane or card: its name, with or without “the”, the word
// “lane” or “card”, or quotes around it.
function spellings(reference: string, noun: string) {
  const seen = new Set<string>()
  const add = (text: string) => { const name = unquoted(text); if (name) seen.add(name) }
  add(reference)
  add(stopless(reference))
  for (const text of [...seen]) add(text.replace(/^(?:the|my|our)\s+/i, ''))
  for (const text of [...seen]) add(text.replace(new RegExp('^(?:' + noun + ')\\s+(?:(?:called|named)\\s+)?', 'i'), ''))
  for (const text of [...seen]) add(text.replace(new RegExp('\\s+(?:' + noun + ')$', 'i'), ''))
  return [...seen]
}

const wordEdge = '[^\\p{L}\\p{N}]'
// From the most exact reading to the loosest. The first reading that picks anything decides.
const readings: ((label: string, name: string) => boolean)[] = [
  (label, name) => label === name,
  // “Customer calls” for “Customer calls · $50 per call”.
  (label, name) => label.startsWith(name + ' · '),
  (label, name) => name.length > 1 && new RegExp('^' + escaped(name) + '(?:$|' + wordEdge + ')', 'u').test(label),
  (label, name) => name.length > 2 && new RegExp('(?:^|' + wordEdge + ')' + escaped(name) + '(?:$|' + wordEdge + ')', 'u').test(label),
]

const ordinals = ['first', 'second', 'third', 'fourth', 'fifth']
// “the first lane”, “lane 2”, “the last step”: a place in the row, for things that have one.
function placed<T>(items: T[], reference: string, noun: string): T | null {
  const found = new RegExp('^(?:the\\s+)?(?:(' + ordinals.join('|') + '|last)\\s+(?:' + noun + ')|(?:' + noun + ')\\s+(\\d|one|two|three|four|five))$', 'i').exec(unquoted(stopless(reference)))
  if (!found) return null
  const word = (found[1] ?? found[2]).toLowerCase()
  const index = word === 'last' ? items.length - 1 : found[1] ? ordinals.indexOf(word) : countWord(word) - 1
  return items[index] ?? null
}

interface Named { id: string; label: string }
interface LookUp<T> { item?: T; rank?: number; several?: T[]; pointing?: boolean }

function lookUp<T extends Named>(items: T[], reference: string, noun: string, selectedId: string | undefined, ordered: boolean): LookUp<T> {
  const names = spellings(reference, noun)
  if (names.some(name => pointing.test(name))) {
    const selected = selectedId && items.find(item => item.id === selectedId)
    return selected ? { item: selected, rank: 0 } : { pointing: true }
  }
  for (const name of names) {
    if (!name.startsWith('@')) continue
    const item = items.find(item => item.id === name.slice(1))
    if (item) return { item, rank: 0 }
  }
  for (const [rank, reading] of readings.entries()) {
    for (const name of names) {
      const matches = items.filter(item => reading(item.label.toLowerCase(), name.toLowerCase()))
      if (matches.length === 1) return { item: matches[0], rank }
      if (matches.length > 1) return { several: matches }
    }
  }
  // Nothing is called that. In a row of lanes or steps it may be a place: “the first lane”.
  const item = ordered ? placed(items, reference, noun) : null
  return item ? { item, rank: readings.length } : {}
}

/** Why a reference picked nothing, or more than one thing. */
export class WorkshopReferenceError extends Error {
  /** `unknown`: nothing has that name; `ambiguous`: several things do; `no-selection`: “this” with nothing selected. */
  constructor(message: string, readonly reason: 'unknown' | 'ambiguous' | 'no-selection', readonly candidates: string[] = []) {
    super(message)
  }
}

export interface WorkshopFinder<T> {
  /** The one item a reference names. Throws a WorkshopReferenceError, whose message is a sentence for the person, when it names none or several. */
  find(reference: string): T
  /** The same, or null. */
  attempt(reference: string): T | null
  /** How exactly the reference names something: 0 for its whole name, more for a looser reading, Infinity for nothing. */
  rank(reference: string): number
}

/**
 * Look items up by what a person called them. `noun` is a pattern of the words for them
 * (“lanes?|columns?”), `what` the word the replies use (“lane”). `ordered` items can also be
 * named by their place in the row.
 */
export function workshopFinder<T extends Named>(items: T[], noun: string, what: string, selectedId?: string, ordered = false): WorkshopFinder<T> {
  const attempt = (reference: string) => lookUp(items, reference, noun, selectedId, ordered).item ?? null
  const rank = (reference: string) => lookUp(items, reference, noun, selectedId, ordered).rank ?? Infinity
  const find = (reference: string) => {
    const found = lookUp(items, reference, noun, selectedId, ordered)
    if (found.item) return found.item
    const allNames = spellings(reference, noun)
    const name = allNames[allNames.length - 1]
    if (found.pointing) throw new WorkshopReferenceError('Select a ' + what + ' on the canvas first, or use its name.', 'no-selection')
    if (found.several) {
      const labels = [...new Set(found.several.map(item => item.label))]
      throw new WorkshopReferenceError(labels.length === 1
        ? found.several.length + ' ' + what + 's are called ' + said(labels[0]) + '. Select the one you mean on the canvas and say “this ' + what + '”.'
        : 'More than one ' + what + ' matches ' + said(name) + ': ' + listed(labels.slice(0, 6).map(said)) + '. Use the whole name.', 'ambiguous', found.several.map(item => item.id))
    }
    const labels = items.map(item => item.label)
    throw new WorkshopReferenceError('There is no ' + what + ' called ' + said(name) + ' here.' + (labels.length && labels.length <= 6
      ? ' The ' + what + 's are ' + listed(labels.map(said)) + '.' : labels.length ? '' : ' There are no ' + what + 's yet.'), 'unknown', items.map(item => item.id))
  }
  return { find, attempt, rank }
}
