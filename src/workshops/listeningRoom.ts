/** A continuous crossfade. Zero is the left sculpture, one is the right. */
export interface ListeningRoomModel {
  kind: 'listening-room'
  version: 1
  mix: number
  leftLabel: string
  rightLabel: string
}

export const listeningRoom: ListeningRoomModel = {
  kind: 'listening-room', version: 1, mix: 0.15,
  leftLabel: 'Copper rain', rightLabel: 'Glass chimes',
}

export function normalizeListeningRoom(raw: unknown): ListeningRoomModel | null {
  if (!raw || typeof raw !== 'object') return null
  const { kind, version, mix, leftLabel, rightLabel } = raw as Partial<ListeningRoomModel>
  const validLabel = (text: unknown): text is string =>
    typeof text === 'string' && text.trim().length > 0 && text.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(text)
  if (kind !== 'listening-room' || version !== 1 || typeof mix !== 'number' ||
      !Number.isFinite(mix) || mix < 0 || mix > 1 || !validLabel(leftLabel) || !validLabel(rightLabel)) return null
  return { kind, version, mix, leftLabel: leftLabel.trim(), rightLabel: rightLabel.trim() }
}

export function listeningRoomCaption({ mix, leftLabel, rightLabel }: ListeningRoomModel): string {
  if (mix < 0.32) return leftLabel === listeningRoom.leftLabel ? 'Rain ticks on the copper roof.' : 'You hear ' + leftLabel + '.'
  if (mix > 0.68) return rightLabel === listeningRoom.rightLabel ? 'Glass chimes ring, then fade.' : 'You hear ' + rightLabel + '.'
  return leftLabel === listeningRoom.leftLabel && rightLabel === listeningRoom.rightLabel
    ? 'Rain and glass chimes overlap.' : leftLabel + ' and ' + rightLabel + ' overlap.'
}
