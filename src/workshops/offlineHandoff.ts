export interface OfflineHandoffModel {
  kind: 'offline-handoff'
  version: 1
  stage: 'queued' | 'review' | 'resolved'
  choice: 'field' | 'desk' | null
  fieldNote: string
  deskNote: string
  fallback: string
}

export const offlineHandoff: OfflineHandoffModel = {
  kind: 'offline-handoff', version: 1, stage: 'queued', choice: null,
  fieldNote: 'Visitor badge rejected at Gate B.', deskNote: 'Visitor access ready at Gate B.',
  fallback: 'Use the staffed lane after 17:00.',
}

export function normalizeOfflineHandoff(raw: unknown): OfflineHandoffModel | null {
  if (!raw || typeof raw !== 'object') return null
  const {kind, version, stage, choice, fieldNote, deskNote, fallback} = raw as Partial<OfflineHandoffModel>
  const text = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0 &&
    value.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(value)
  if (kind !== 'offline-handoff' || version !== 1 ||
    (stage !== 'queued' && stage !== 'review' && stage !== 'resolved') ||
    (stage === 'resolved' ? choice !== 'field' && choice !== 'desk' : choice !== null) ||
    choice === undefined || !text(fieldNote) || !text(deskNote) || !text(fallback)) return null
  return {kind, version, stage, choice, fieldNote:fieldNote.trim(), deskNote:deskNote.trim(), fallback:fallback.trim()}
}

export function reviewHandoff(value: OfflineHandoffModel): OfflineHandoffModel {
  return {...value, stage:'review', choice:null}
}

export function resolveHandoff(value: OfflineHandoffModel, choice: 'field' | 'desk'): OfflineHandoffModel {
  return value.stage === 'review' ? {...value, stage:'resolved', choice} : value
}

export function handoffSummary(value: OfflineHandoffModel): string {
  if (value.stage === 'resolved') return (value.choice === 'field' ? value.fieldNote : value.deskNote) + ' ' + value.fallback
  return value.stage === 'queued' ? 'One edit waiting to sync.' : 'Which result should the crew use?'
}
