import {expect,it} from 'vitest'
import {handoffSummary, normalizeOfflineHandoff, offlineHandoff, resolveHandoff, reviewHandoff} from '../../src/workshops/model'

it('reopens the two original proposals after either decision and preserves authored notes', () => {
  const authored = {...offlineHandoff, fieldNote:'Meter stalled.', deskNote:'Meter ready.', fallback:'Use line two.'}
  const proposed = reviewHandoff(authored)
  expect(resolveHandoff(authored,'field')).toBe(authored)
  for (const choice of ['field','desk'] as const) {
    const resolved = resolveHandoff(proposed,choice)
    expect(handoffSummary(resolved)).toBe((choice === 'field' ? 'Meter stalled.' : 'Meter ready.')+' Use line two.')
    expect(reviewHandoff(resolved)).toEqual(proposed)
    expect(normalizeOfflineHandoff(JSON.parse(JSON.stringify(resolved)))).toEqual(resolved)
  }
})
it('rejects impossible branches, invalid texts and unrecognized model versions', () => {
  for (const patch of [{stage:'drop'}, {stage:'resolved',choice:null}, {choice:'field'}, {stage:'resolved',choice:'both'},
    {fieldNote:' '}, {deskNote:'<path>'}, {fallback:'a'.repeat(241)}, {version:2}]) {
    expect(normalizeOfflineHandoff({...offlineHandoff,...patch})).toBeNull()
  }
})
