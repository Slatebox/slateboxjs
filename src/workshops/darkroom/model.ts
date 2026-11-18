export const printFields = ['firstPrint', 'secondPrint', 'thirdPrint'] as const
export type ReturnPath = 'start' | 'opener' | null
export type FocusDarkroom = Record<(typeof printFields)[number], string> & {
  kind: 'focus-darkroom'
  version: 1
  route: ReturnPath
}

const defaults: FocusDarkroom = {
  kind: 'focus-darkroom', version: 1, firstPrint: 'Fern', secondPrint: 'Silk moth', thirdPrint: 'Sea fan', route: null,
}

export function normalizeFocusDarkroom(input: unknown): FocusDarkroom {
  if (!input || typeof input !== 'object') throw new Error('Expected a darkroom.')
  const raw = input as Record<string, unknown>
  if (raw.kind !== undefined && raw.kind !== 'focus-darkroom') throw new Error('Expected a darkroom.')
  if (raw.version !== 1) throw new Error('Unknown darkroom version.')
  if (raw.route !== null && raw.route !== 'start' && raw.route !== 'opener') throw new Error('Unknown return path.')
  const result: FocusDarkroom = { ...defaults, route: raw.route }
  for (const field of printFields) {
    const name = raw[field]
    if (typeof name !== 'string' || !name.trim() || name.trim().length > 48)
      throw new Error('Give each print a name of up to 48 characters.')
    result[field] = name.trim()
  }
  return result
}

export function initialFocusDarkroom(query = new URLSearchParams()): FocusDarkroom {
  const result = { ...defaults }
  for (const field of printFields) {
    const value = query.get(field)?.trim()
    if (value && value.length <= 48) result[field] = value
  }
  const route = query.get('route')
  if (route === 'start' || route === 'opener') result.route = route
  return result
}

export function describeFocusDarkroom(value: FocusDarkroom): string {
  const path = value.route === 'start' ? 'Every viewer returns to the first print.'
    : value.route === 'opener' ? 'Each viewer returns to the print that opened it.'
    : 'No wire attached. The viewer uses its native return path.'
  return [value.firstPrint, value.secondPrint, value.thirdPrint].join(' · ') + '. ' + path
}
