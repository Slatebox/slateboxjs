export interface GalleryPanel {
  id: string
  label: string
  artwork: 'dunes' | 'moon' | 'coast'
  after: string | null
}

export interface MoonGalleryModel {
  kind: 'moon-gallery'
  version: 1
  panels: GalleryPanel[]
  hung: string[]
}

export const moonGallery: MoonGalleryModel = {
  kind: 'moon-gallery', version: 1,
  panels: [
    {id: 'dunes', label: 'Dunes', artwork: 'dunes', after: null},
    {id: 'moon', label: 'Moon', artwork: 'moon', after: 'dunes'},
    {id: 'coast', label: 'Coast', artwork: 'coast', after: 'moon'},
  ],
  hung: ['dunes'],
}

/** Panel order is the physical order of the hooks on the wall. */
export function normalizeMoonGallery(input: unknown): MoonGalleryModel | null {
  if (!input || typeof input !== 'object') return null
  const value = input as Partial<MoonGalleryModel>
  if (value.kind !== 'moon-gallery' || value.version !== 1 ||
      !Array.isArray(value.panels) || value.panels.length !== 3 || !Array.isArray(value.hung)) return null
  const panels: GalleryPanel[] = []
  for (const panel of value.panels) {
    if (!panel || typeof panel.id !== 'string' || !/^[a-z][\w-]{0,31}$/.test(panel.id) ||
      typeof panel.label !== 'string' || !panel.label.trim() || panel.label.trim().length > 48 ||
      !['dunes','moon','coast'].includes(panel.artwork) ||
      !(panel.after === null || typeof panel.after === 'string')) return null
    panels.push({id: panel.id, label: panel.label.trim(), artwork: panel.artwork, after: panel.after})
  }
  const known = new Map(panels.map(panel => [panel.id, panel]))
  const hung = [...new Set(value.hung)]
  if (known.size !== panels.length || hung.length !== value.hung.length || hung.some(id => !known.has(id))) return null
  for (const panel of panels) {
    const seen = new Set([panel.id])
    let next = panel.after
    while (next !== null) {
      if (seen.has(next) || !known.has(next)) return null
      if (hung.includes(panel.id) && !hung.includes(next)) return null
      seen.add(next)
      next = known.get(next)!.after
    }
  }
  return {kind: 'moon-gallery', version: 1, panels, hung}
}

export function canHangPanel(model: MoonGalleryModel, id: string): boolean {
  const panel = model.panels.find(item => item.id === id)
  return !!panel && !model.hung.includes(id) && (panel.after === null || model.hung.includes(panel.after))
}

export function hangGalleryPanel(model: MoonGalleryModel, id: string): MoonGalleryModel {
  return canHangPanel(model, id) ? {...model, hung: [...model.hung, id]} : model
}
