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

  it('takes the number with a sign or k/M over a bare one, so a year in the words stays in the words', () => {
    expect(readNoteNumbers('2026 offsite $12k')).toEqual({ label: '2026 offsite', amount: 12000, currency: '$' })
    expect(readNoteNumbers('Q3 2026 launch 40k')).toEqual({ label: 'Q3 2026 launch', amount: 40000 })
    expect(readNoteNumbers('Laptops 2400')).toEqual({ label: 'Laptops', amount: 2400 })
  })

  it('reads part of a day as a whole one, and weeks as five working days each', () => {
    expect(readNoteNumbers('Fix bug 0.5d')).toEqual({ label: 'Fix bug', days: 1 })
    expect(readNoteNumbers('Research 1.5 days')).toEqual({ label: 'Research', days: 2 })
    expect(readNoteNumbers('Team of 4, 6 weeks')).toEqual({ label: 'Team of 4', days: 30 })
    expect(readNoteNumbers('Beta 2w')).toEqual({ label: 'Beta', days: 10 })
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
