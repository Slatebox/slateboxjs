import {describe, expect, it} from 'vitest'
import {canHangPanel, hangGalleryPanel, moonGallery, normalizeMoonGallery} from '../../src/workshops/moonGallery'

describe('gallery wall', () => {
  it('enforces authored dependencies when hanging or reopening', () => {
    expect(hangGalleryPanel(moonGallery, 'coast')).toBe(moonGallery)
    const middle = hangGalleryPanel(moonGallery, 'moon')
    expect(canHangPanel(middle, 'coast')).toBe(true)
    expect(normalizeMoonGallery(JSON.parse(JSON.stringify(hangGalleryPanel(middle, 'coast'))))?.hung)
      .toEqual(['dunes', 'moon', 'coast'])
    expect(normalizeMoonGallery({...moonGallery, hung: ['coast']})).toBeNull()
    expect(normalizeMoonGallery({...moonGallery, panels: moonGallery.panels.map(p => ({...p, after: 'coast'}))})).toBeNull()
  })
  it('uses the author’s rule independent of the object label or physical hook', () => {
    const model = normalizeMoonGallery({...moonGallery, panels: moonGallery.panels.map(p =>
      p.id === 'coast' ? {...p, label: 'Low tide', after: null} : p)})
    expect(model).not.toBeNull()
    expect(hangGalleryPanel(model!, 'coast').hung).toEqual(['dunes', 'coast'])
    expect(model!.hung).toEqual(['dunes'])
  })
})
