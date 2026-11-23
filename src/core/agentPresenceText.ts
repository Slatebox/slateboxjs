// What an agent on the canvas says, and when it is shown: its step, its checklist, its colour and
// which records are on screen now. Small and DOM-free, so the canvas entry and any page (the
// app's roster chip) can use it; the drawing itself (createAgentPresence) is the separate
// slateboxjs/presence entry, loaded when the first agent arrives.

export type AgentStepStatus = 'todo' | 'doing' | 'done' | 'skipped' | 'stopped'

export interface AgentPresenceRecord {
  /** Stable per token and slate; never a token id. */
  agentKey: string
  /** "Ada's agent" or "Ada's agent · Client name". */
  label: string
  initial: string
  colorIndex: number
  /** Note ids, or card-<id> / lane-<id> for a workshop (b2:card-<id> for a board scoped b2, see workshopNodeIds.of). */
  targets: string[]
  plan?: { steps: { text: string; status: AgentStepStatus }[]; current: number } | null
  /** What the run is doing when it sent no plan (the save's message). */
  message?: string | null
  status: 'live' | 'done' | 'stopped'
  updatedAt: number | string | Date
  endedAt?: number | string | Date | null
  expiresAt: number | string | Date
}

/** Agent colours. People's colours never use these; the shape, not only the colour, says "agent". */
export const AGENT_PALETTE: readonly string[] = Object.freeze(['#6d28d9', '#0f766e', '#a16207', '#be185d', '#1d4ed8', '#4d7c0f'])

export const AGENT_HOLD_MS = 6000
export const AGENT_FADE_MS = 600
export const AGENT_MAX_DRAWN = 6

const GLYPH: Record<AgentStepStatus, string> = { todo: '○', doing: '◌', done: '✓', skipped: '–', stopped: '■' }

export const time = (value: number | string | Date | null | undefined): number | null => {
  if (value === null || value === undefined) return null
  const ms = value instanceof Date ? value.getTime() : typeof value === 'number' ? value : Date.parse(value)
  return Number.isFinite(ms) ? ms : null
}

export const clip = (text: string, max: number) => (text.length > max ? text.slice(0, max - 1).trimEnd() + '…' : text)
/** Text as it is drawn: one line of plain characters (the server cleans it; this keeps the canvas safe anyway). */
export const plainLine = (text: unknown) => String(text ?? '').replace(/[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u180e\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/g, '').replace(/\s+/g, ' ').trim()

/** The step a tag shows: the plan's current step, or the save's message when there is no plan. */
export function agentStepText(record: AgentPresenceRecord): string | null {
  const steps = record.plan?.steps ?? []
  if (steps.length) {
    const doing = steps.findIndex(step => step.status === 'doing')
    const stopped = steps.findIndex(step => step.status === 'stopped')
    if (stopped >= 0) return 'Stopped: ' + plainLine(steps[stopped].text)
    if (steps.every(item => item.status === 'done' || item.status === 'skipped')) return 'Done'
    const index = doing >= 0 ? doing : Math.min(Math.max(record.plan!.current ?? 0, 0), steps.length - 1)
    return plainLine(steps[index].text)
  }
  const message = plainLine(record.message ?? '')
  return message || null
}

/** The checklist lines a record shows, each with its glyph. */
export function agentChecklist(record: AgentPresenceRecord): string[] {
  return (record.plan?.steps ?? []).map(step => GLYPH[step.status] + ' ' + (step.status === 'stopped' ? 'Stopped: ' : '') + plainLine(step.text))
}

/**
 * Which records are drawn at `now`, and how: a live record until it expires (a run that went
 * silent), an ended one for holdMs and then fading for fadeMs. At most `max`, newest first.
 */
export function visibleAgents(records: AgentPresenceRecord[], now: number, { holdMs = AGENT_HOLD_MS, fadeMs = AGENT_FADE_MS, max = AGENT_MAX_DRAWN } = {}) {
  const out: { record: AgentPresenceRecord; opacity: number; until: number }[] = []
  for (const record of records) {
    if (!record || typeof record.agentKey !== 'string') continue
    const expires = time(record.expiresAt)
    const ended = time(record.endedAt)
    if (record.status === 'live' && ended === null) {
      if (expires === null || now >= expires) continue
      out.push({ record, opacity: 1, until: expires })
      continue
    }
    const end = ended ?? time(record.updatedAt) ?? now
    const fadeAt = end + holdMs
    if (now >= fadeAt + fadeMs) continue
    out.push({ record, opacity: now <= fadeAt ? 1 : 1 - (now - fadeAt) / fadeMs, until: fadeAt + fadeMs })
  }
  out.sort((a, b) => (time(b.record.updatedAt) ?? 0) - (time(a.record.updatedAt) ?? 0))
  return out.slice(0, max)
}

