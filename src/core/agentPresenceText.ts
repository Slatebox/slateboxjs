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
  /**
   * An empty spot on the slate (world units) the pointer goes to before its targets: where a
   * suggestion is about to land, say. Without targets it is where the pointer rests.
   */
  point?: { x: number; y: number } | null
  /** A short line said in a bubble over the pointer for AGENT_SAY_MS after sayAt. */
  say?: string | null
  sayAt?: number | string | Date | null
  /** Where the agent comes from: a visiting agent (its own MCP client), an invited one, or Slatebox's own. */
  origin?: 'visiting' | 'invited' | 'slatebox' | null
  /** The client a visiting agent reported ("Claude"), cleaned by the host. */
  via?: string | null
  /** An invited agent's icon: an https: or data:image URL the host proxied and size-capped. */
  iconUrl?: string | null
  /** The first name of the person who invited it. */
  invitedBy?: string | null
  /** The agent across its runs on this slate (stable per agent and slate, never a token id). */
  agentId?: string | null
  /** Set by the host: what this agent suggested still waits on the slate for someone to keep or discard. */
  waiting?: boolean | null
}

/** How long a pointer's bubble shows after the agent says something. */
export const AGENT_SAY_MS = 3000

/** The origin line under an agent's name: "via Claude", "added by Ada", or nothing. */
export function agentOrigin(record: Pick<AgentPresenceRecord, 'origin' | 'via' | 'invitedBy'>): string {
  if (record.origin === 'invited' && record.invitedBy) return 'added by ' + plainLine(record.invitedBy)
  if (record.origin === 'visiting' && record.via) return 'via ' + plainLine(record.via)
  return ''
}

/**
 * The name an agent is shown by: its label, then where it comes from ("Research · added by Ada",
 * "Ada's agent · via Claude"). A visiting agent whose label already names its client ("Ada's agent ·
 * Claude") keeps the label as it is.
 */
export function agentName(record: Pick<AgentPresenceRecord, 'label' | 'origin' | 'via' | 'invitedBy'>, max = 56): string {
  const label = plainLine(record.label)
  const origin = agentOrigin(record)
  const named = record.origin === 'visiting' && record.via && label.endsWith('· ' + plainLine(record.via))
  return clip(origin && !named && !label.includes(origin) ? label + ' · ' + origin : label, max)
}

/** An icon URL safe to draw: https:, or a data: image of a raster type. Anything else is null. */
export function safeIconUrl(url: unknown): string | null {
  if (typeof url !== 'string' || url.length > 200_000) return null
  if (/^data:image\/(png|jpeg|gif|webp);base64,[A-Za-z0-9+/=]+$/.test(url)) return url
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' ? parsed.href : null
  } catch {
    return null
  }
}

/** The bubble a record shows now, or null: its `say`, for AGENT_SAY_MS after sayAt. */
export function agentSaying(record: AgentPresenceRecord, now: number): string | null {
  const said = plainLine(record.say ?? '')
  const at = time(record.sayAt ?? null)
  if (!said || at === null || now < at || now >= at + AGENT_SAY_MS) return null
  return said
}

/** Agent colours. People's colours never use these; the shape, not only the colour, says "agent". */
export const AGENT_PALETTE: readonly string[] = Object.freeze(['#6d28d9', '#0f766e', '#a16207', '#be185d', '#1d4ed8', '#4d7c0f'])

export const AGENT_HOLD_MS = 6000
export const AGENT_FADE_MS = 600
export const AGENT_MAX_DRAWN = 6

const GLYPH: Record<AgentStepStatus, string> = { todo: '○', doing: '◌', done: '✓', skipped: '–', stopped: '■' }

export function time(value: number | string | Date | null | undefined): number | null {
  if (value === null || value === undefined) return null
  const ms = value instanceof Date ? value.getTime() : typeof value === 'number' ? value : Date.parse(value)
  return Number.isFinite(ms) ? ms : null
}

export const clip = (text: string, max: number) => (text.length > max ? text.slice(0, max - 1).trimEnd() + '…' : text)
/** Text as it is drawn: one line of plain characters (the server cleans it; this keeps the canvas safe anyway). */
export const plainLine = (text: unknown) => String(text ?? '').replace(/[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u180e\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/g, '').replace(/\s+/g, ' ').trim()

/** Whether a record points at suggestions: its targets are ghost notes (ghost-<id>, as the suggestions draw them). */
export const agentSuggests = (record: Pick<AgentPresenceRecord, 'targets'>) => (record.targets ?? []).some(id => typeof id === 'string' && id.startsWith('ghost-'))

export const AGENT_SUGGESTING = 'Suggesting…'
export const AGENT_WAITING = 'Waiting for you'

/**
 * The step a tag shows: what the agent is doing now. "Suggesting…" while its suggestion is still landing (`landing`: the
 * pointer is on its way to the ghosts, or they are not drawn yet) or while the live run that filed it goes on;
 * "Waiting for you" once what it suggested waits for Keep or Discard (`waiting`, set by the host); never "Done" before
 * either. Otherwise the plan's current step, or the save's message when there is no plan.
 */
export function agentStepText(record: AgentPresenceRecord, { landing = false }: { landing?: boolean } = {}): string | null {
  const steps = record.plan?.steps ?? []
  const stopped = steps.findIndex(step => step.status === 'stopped')
  if (stopped >= 0) return 'Stopped: ' + plainLine(steps[stopped].text)
  if (landing) return AGENT_SUGGESTING
  if (record.waiting) return AGENT_WAITING
  if (record.status === 'live' && time(record.endedAt ?? null) === null && agentSuggests(record)) return AGENT_SUGGESTING
  if (steps.length) {
    const doing = steps.findIndex(step => step.status === 'doing')
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

