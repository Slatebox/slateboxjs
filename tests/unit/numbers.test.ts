import { describe, expect, it } from 'vitest'
import { days, money, readNoteNumbers } from '../../src/workshops/numbers'

describe('the numbers written on a note', () => {
  it('reads days in either form and keeps the words', () => {
    expect(readNoteNumbers('Copy 3d')).toEqual({ label: 'Copy', days: 3 })
    expect(readNoteNumbers('Write the docs 12 days')).toEqual({ label: 'Write the docs', days: 12 })
    expect(readNoteNumbers('Copy · 1 day')).toEqual({ label: 'Copy', days: 1 })
  })

  it('reads amounts with a sign, with k or M, or large plain numbers', () => {
    expect(readNoteNumbers('Contractor $45k')).toEqual({ label: 'Contractor', amount: 45000, currency: '$' })
    expect(readNoteNumbers('Acme €1.2M')).toEqual({ label: 'Acme', amount: 1200000, currency: '€' })
    expect(readNoteNumbers('Northwind 40k')).toEqual({ label: 'Northwind', amount: 40000 })
    expect(readNoteNumbers('Panel 120000')).toEqual({ label: 'Panel', amount: 120000 })
    expect(readNoteNumbers('Globex · $60k')).toEqual({ label: 'Globex', amount: 60000, currency: '$' })
  })

  it('leaves words alone that carry no number it can read', () => {
    expect(readNoteNumbers('Call 3 customers')).toEqual({ label: 'Call 3 customers' })
    expect(readNoteNumbers('  Plain   words ')).toEqual({ label: 'Plain words' })
  })

  it('writes money short, the way captions and sentences say it', () => {
    expect(money(45000)).toBe('$45k')
    expect(money(320000)).toBe('$320k')
    expect(money(1200000)).toBe('$1.2M')
    expect(money(1250, '€')).toBe('€1.3k')
    expect(money(900)).toBe('$900')
    expect(money(-30000)).toBe('-$30k')
    expect(days(1)).toBe('1 day')
    expect(days(3)).toBe('3 days')
  })

  it('reads back what a card writes when it goes back to the canvas', () => {
    for (const [text, read] of [['Copy · 3 days', { label: 'Copy', days: 3 }], ['Contractor · $45k', { label: 'Contractor', amount: 45000, currency: '$' }]] as const) {
      expect(readNoteNumbers(text)).toEqual(read)
    }
  })
})
