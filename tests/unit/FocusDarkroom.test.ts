import { describe, expect, it } from 'vitest'
import { initialFocusDarkroom, normalizeFocusDarkroom, describeFocusDarkroom } from '../../src/workshops/darkroom/model'

describe('Focus Darkroom model', () => {
  it('imports an authored print and wire and round-trips through JSON', () => {
    const value = initialFocusDarkroom(new URLSearchParams('secondPrint=Night+%26+day&route=start'))
    expect(value.kind).toBe('focus-darkroom')
    expect(normalizeFocusDarkroom({...value, kind: undefined}).kind).toBe('focus-darkroom')
    expect(value.secondPrint).toBe('Night & day')
    expect(value.route).toBe('start')
    expect(normalizeFocusDarkroom(JSON.parse(JSON.stringify(value)))).toEqual(value)
    expect(describeFocusDarkroom(value)).toContain('Night & day')
  })
  it('rejects invalid persisted data while opening malformed public links with valid defaults', () => {
    const value = initialFocusDarkroom()
    for (const field of [{route: 'first'}, {kind: 'gallery'}, {version: 2}, {thirdPrint: ' '}, {firstPrint: 'x'.repeat(49)}]) {
      expect(() => normalizeFocusDarkroom({...value, ...field})).toThrow()
    }
    expect(initialFocusDarkroom(new URLSearchParams('route=first&thirdPrint=%20'))).toEqual(value)
  })
})
