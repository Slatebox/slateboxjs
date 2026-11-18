import { describe, expect, it } from 'vitest'
import { listeningRoom, listeningRoomCaption, normalizeListeningRoom } from '../../src/workshops/model'

describe('listening room documents', () => {
  it('retains continuous mixes, accepts edited material names, and omits transient UI state', () => {
    const room = { ...listeningRoom, mix: 0.5342, leftLabel: ' Shells ', rightLabel: 'Bells' }
    expect(normalizeListeningRoom({ ...room, playing: true })).toEqual({ ...room, leftLabel: 'Shells' })
    expect(listeningRoomCaption(normalizeListeningRoom(room)!)).toBe('Shells and Bells overlap.')
    expect(normalizeListeningRoom(JSON.parse(JSON.stringify(listeningRoom)))).toEqual(listeningRoom)
  })
  it('rejects incompatible, out-of-bounds, nonfinite or unsafe fields', () => {
    for (const patch of [{ kind:'other' }, { version:2 }, { mix:-0.01 }, { mix:1.01 }, { mix:NaN },
      { leftLabel:' ' }, { rightLabel:'<bell>' }, { leftLabel:'a'.repeat(81) }]) {
      expect(normalizeListeningRoom({ ...listeningRoom, ...patch })).toBeNull()
    }
  })
})
