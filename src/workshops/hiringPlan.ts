// Hiring plan with runway (dragology final.md §3.3, D3): "Can we afford the second AE in Q2, and when must
// we open the req to have them by then?" Each hire is a bar on its team's row: recruiting (its length,
// in days, snapped to weeks) and then cost from their first day, at their role band's monthly cost. The
// plan reads cash and the monthly burn without new hires once, and a funding round on the day it closes;
// its readout is "Runway with these hires". Cost is per role band, never per person: a hire carries no
// money field, so no salary is ever on a board every viewer receives.
import type { HiringBand, HiringFields, Workshop, WorkshopCard } from './model'
import { registerWorkshopRules, said } from './model'
import type { BusinessBoardRules, BusinessEditTools } from './kinds'
import type { WorkshopEdit } from './edits'
import { amountOf, money, nextCardId, ownField } from './numbers'
import { dateName, nextMonday } from './calendar'
import { extendWorkshopEdits, scheduleLaunch } from './schedule'
import { runwayMonths, runwayWords } from './runway'
import { timeFamily } from './timeRules'
import { landPlanNote, planDrags, planEdit, planFixed, planWords, presetRules, readClock } from './launchPlan'

export { runwayMonths, runwayWords, runwayCap } from './runway'

/** The rule kinds a hiring plan takes: its line is runway; hires snap, a slip pushes or stops, a signed offer locks. */
const hiringFamily = timeFamily({ deadline: 'at floor', snap: 'unit', cascade: 'onConflict', locked: 'cards' })

const whole = (about: string, min: number, max: number) => ({ type: 'integer' as const, min, max, about })
extendWorkshopEdits({
  kinds: [
    { kind: 'set_band_cost', summary: 'Hiring plan: what a role band costs a month, loaded. Cost is per band, never per person.', intent: false,
      fields: { band: { type: 'text', max: 40, about: 'The band, by id or name.' }, monthly: whole('Whole currency units a month.', 1, 1e7) }, boards: ['hiring-plan'], refusals: {} },
    { kind: 'set_funding', summary: 'Hiring plan: the day the funding round closes, in days from the plan’s first day.', intent: false,
      fields: { day: whole('Days from the first day.', 0, 728) }, boards: ['hiring-plan'], refusals: {} },
  ],
  boards: { set_task: ['hiring-plan'], link_tasks: ['hiring-plan'], unlink_tasks: ['hiring-plan'] },
  fields: { add_card: { band: { type: 'text', max: 40, optional: true, about: 'Hiring plan: the role band (by id or name). Left out, the team’s first band.' } } },
})

/** A hire's first day, as an offset: when recruiting ends and cost starts. */
export const hireStarts = (board: Workshop, cardId: string) => scheduleLaunch(board).get(cardId)!.to

/** The lag that makes a hire start on `day` (or as near after as the snap allows), with what it waits on as it is. */
export function hireLagFor(board: Workshop, cardId: string, day: number): number {
  const card = board.cards.find(item => item.id === cardId)!
  const t = scheduleLaunch(board).get(cardId)!
  const ready = t.start - (card.lag ?? 0)
  const lag = Math.max(0, day - (card.duration ?? 7) - ready)
  return Math.ceil(lag / 7) * 7
}

/** The band a name picks: by id, then by its name (whole words, any case). */
export function bandOf(plan: HiringFields, name: string): HiringBand | undefined {
  const text = name.trim().toLowerCase()
  return plan.bands.find(band => band.id === name) ?? plan.bands.find(band => band.label.toLowerCase() === text) ??
    plan.bands.find(band => new RegExp('\\b' + band.label.toLowerCase().replace(/[^a-z0-9 ]/g, '') + '\\b').test(text))
}

const noMoney = ['salary', 'pay', 'wage', 'cost', 'amount', 'monthly', 'comp', 'compensation']

export function validateHiringPlan(board: Workshop): string | null {
  if (board.lanes.length > 4) return 'A hiring plan has 2 to 4 teams.'
  if (board.cards.length < 1 || board.cards.length > 16) return 'A hiring plan has 1 to 16 hires.'
  if (!board.clock) return 'A hiring plan starts on a date.'
  for (const card of board.cards) {
    if (!board.hiring!.bands.some(band => band.id === card.band)) return said(card.label) + ' needs a role band on this plan.'
    if ((card.dependsOn?.length ?? 0) > 3) return 'A hire waits on up to 3 others.'
  }
  if (board.hiring!.bands.some(band => !board.lanes.some(lane => lane.id === band.lane))) return 'Each role band belongs to a team on the plan.'
  try { scheduleLaunch(board) } catch (error) { return (error as Error).message }
  for (const card of board.cards) {
    if ((card.lag ?? 0) < 0 && !card.override) return 'A hire waits 0 days or more.'
    if (scheduleLaunch(board).get(card.id)!.start < 0) return said(card.label) + ' starts recruiting on the plan’s first day or later.'
  }
  return null
}

/** "Runway with these hires: 15.2 months". */
export const runwayHeader = (board: Workshop) => 'Runway with these hires: ' + runwayWords(runwayMonths(board))

/**
 * The library's hiring plan: a year from the next Monday, three teams, five hires in role bands, cash and
 * burn, and a round that closes in week 30. Its rules: hires snap to weeks and a slip pushes what waits on it.
 */
export function hiringPlanSample(today?: string): Workshop {
  return {
    version: 1, kind: 'hiring-plan', title: 'Hiring plan', clock: { origin: nextMonday(today) },
    hiring: { cash: 1200000, burn: 95000, currency: '$', weeks: 52, funding: { day: 210, amount: 1000000 }, bands: [
      { id: 'senior-eng', label: 'Senior eng', monthly: 15000, lane: 'engineering' },
      { id: 'designer', label: 'Designer', monthly: 12000, lane: 'product' },
      { id: 'ae', label: 'AE', monthly: 11000, lane: 'sales' },
    ] },
    lanes: [{ id: 'engineering', label: 'Engineering' }, { id: 'product', label: 'Product' }, { id: 'sales', label: 'Sales' }],
    cards: [
      { id: 'eng-1', label: 'Senior eng', laneId: 'engineering', band: 'senior-eng', duration: 56 },
      { id: 'eng-2', label: 'Senior eng #2', laneId: 'engineering', band: 'senior-eng', duration: 56, lag: 14, dependsOn: ['eng-1'] },
      { id: 'designer', label: 'Designer', laneId: 'product', band: 'designer', duration: 42, lag: 56 },
      { id: 'ae-1', label: 'AE', laneId: 'sales', band: 'ae', duration: 42, lag: 14 },
      { id: 'ae-2', label: 'AE #2', laneId: 'sales', band: 'ae', duration: 42, lag: 126 },
    ],
    behaviour: presetRules([{ kind: 'snap', unit: 'week' }, { kind: 'cascade', onConflict: 'push' }]),
  }
}

const startSaid = (board: Workshop, card: WorkshopCard) => said(card.label) + ' now starts ' + dateName(board.clock!.origin, hireStarts(board, card.id)) + ', after ' + Math.round(card.duration! / 7) + ' weeks of recruiting. ' + runwayHeader(board) + '.'

/** The hiring plan's part of the one gate (see kinds.ts). */
export const hiringPlanRules: BusinessBoardRules = {
  kind: 'hiring-plan',
  cards: [16, 'A hiring plan holds up to 16 hires.'],
  rulebook: hiringFamily,
  drags: planDrags,
  fixed: planFixed,
  words: { ...planWords, startLag: hireLagFor, band: (board, name) => bandOf(board.hiring!, name) },
  readCard(raw, card, read) {
    if (noMoney.some(key => raw[key] !== undefined)) throw new Error('Cost is per role band, never per person. Say what the band costs instead.')
    card.duration = amountOf(raw.duration, 7, 140, 'Recruiting takes 1 to 20 weeks.')
    // A hire moved anyway may start recruiting before what it waits on is hired: a lag below 0.
    if (raw.lag !== undefined && raw.lag !== 0) card.lag = amountOf(raw.lag, raw.override !== undefined ? -728 : 0, 728, 'That is further out than the plan runs.')
    if (typeof raw.band !== 'string') throw new Error('Each hire is in a role band.')
    card.band = read.id(raw.band)
    if (raw.dependsOn !== undefined) {
      if (!Array.isArray(raw.dependsOn)) throw new Error('A hire waits on a list of hires.')
      const ids = raw.dependsOn.map(read.id)
      if (new Set(ids).size !== ids.length) throw new Error('Duplicate dependency.')
      if (ids.length) card.dependsOn = ids
    }
  },
  readBoard(raw, board, read) {
    const plan = ownField(raw, 'hiring', 'A hiring plan needs its cash, burn and role bands.')
    if (!Array.isArray(plan.bands) || plan.bands.length < 1 || plan.bands.length > 8) throw new Error('A hiring plan has 1 to 8 role bands.')
    const bands = plan.bands.map(item => {
      const band = item as Record<string, unknown>
      if (typeof band.label !== 'string' || !band.label.trim() || band.label.length > 40 || /[<>\u0000-\u001f]/.test(band.label)) throw new Error('Name each role band in plain words.')
      return { id: read.id(band.id), label: band.label.trim(), monthly: amountOf(band.monthly, 1, 1e7, 'A band costs 1 to 10,000,000 a month.'), lane: read.id(band.lane) }
    })
    if (new Set(bands.map(band => band.id)).size !== bands.length) throw new Error('Duplicate role band.')
    const currency = typeof plan.currency === 'string' && /^[$€£¥]$/.test(plan.currency) ? plan.currency : '$'
    board.hiring = { cash: amountOf(plan.cash, 0, 1e10, 'Cash is 0 to 10 billion.'), burn: amountOf(plan.burn, 0, 1e9, 'Burn is 0 to a billion a month.'),
      currency, weeks: amountOf(plan.weeks ?? 52, 13, 104, 'A hiring plan runs 13 to 104 weeks.'), bands }
    if (plan.funding !== undefined) {
      const round = plan.funding as Record<string, unknown> | null
      board.hiring.funding = { day: amountOf(round?.day, 0, 728, 'A round closes within two years.'), amount: amountOf(round?.amount, 1, 1e10, 'A round raises 1 to 10 billion.') }
    }
    readClock(raw, board)
  },
  validate: validateHiringPlan,
  planMove(board, cardId, laneId) {
    const card = board.cards.find(item => item.id === cardId)
    if (!card || !board.lanes.some(lane => lane.id === laneId)) return null
    return card.laneId === laneId ? board : { ...board, cards: board.cards.map(item => item === card ? { ...card, laneId } : item) }
  },
  caption(board, laneId) {
    const hires = board.cards.filter(card => card.laneId === laneId)
    return hires.length + (hires.length === 1 ? ' hire' : ' hires')
  },
  cardText: (board, card) => card.label + ' · ' + dateName(board.clock!.origin, hireStarts(board, card.id)).replace(/^\w+ /, ''),
  noteText: (_board, card) => card.label,
  fromNote(_board, text, unnamed) {
    const label = text.replace(/\s+/g, ' ').trim() || unnamed
    return { label: label.slice(0, 80), duration: 42 }
  },
  newCard: () => 'hire',
  landNote: landPlanNote,
  renamed: (_board, _cardId, text) => ({ label: text.replace(/\s+/g, ' ').trim(), edits: [] }),
  edit(board: Workshop, edit: WorkshopEdit, t: BusinessEditTools) {
    const plan = board.hiring!
    switch (edit.kind) {
      case 'add_card': {
        const target = t.lane(edit.lane)
        const label = edit.label?.trim() || 'New hire'
        const band = edit.band ? bandOf(plan, edit.band) : plan.bands.find(item => item.lane === target.id) ?? bandOf(plan, label)
        if (!band) t.refuse('Say which role band, such as ' + plan.bands.map(item => said(item.label)).join(' or ') + '.', { laneId: target.id })
        const card: WorkshopCard = { id: nextCardId(board), label, laneId: target.id, band: band!.id, duration: edit.duration ?? 42 }
        if (edit.lag) card.lag = edit.lag
        const waits = [...new Set((edit.waitsOn ?? []).map(ref => t.card(ref).id))]
        if (waits.length) card.dependsOn = waits
        const next = t.settle({ ...board, cards: [...board.cards, card] }, target.id)
        return t.done(next, 'Added ' + said(label) + ' to ' + said(target.label) + '. ' + runwayHeader(next) + '.', { laneId: target.id, cardId: card.id })
      }
      case 'set_band_cost': {
        const band = bandOf(plan, edit.band)
        if (!band) t.refuse('There is no role band ' + said(edit.band) + '. The bands are ' + plan.bands.map(item => said(item.label)).join(', ') + '.', { code: 'unknown_reference' })
        const next = t.settle({ ...board, hiring: { ...plan, bands: plan.bands.map(item => item === band ? { ...item, monthly: edit.monthly } : item) } })
        return t.done(next, said(band!.label) + ' now costs ' + money(edit.monthly, plan.currency) + ' a month. ' + runwayHeader(next) + '.')
      }
      case 'set_funding': {
        if (!plan.funding) t.refuse('This plan has no funding round.')
        const next = t.settle({ ...board, hiring: { ...plan, funding: { ...plan.funding!, day: edit.day } } })
        return t.done(next, 'The round now closes ' + dateName(board.clock!.origin, edit.day) + '. ' + runwayHeader(next) + '.')
      }
    }
    return planEdit(board, edit, t, (card, next) => startSaid(next, card))
  },
}
registerWorkshopRules(hiringPlanRules)
