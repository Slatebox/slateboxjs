import {describe, expect, it} from 'vitest'
import {createInterviewWorkshop, createBudgetWorkshop, startupExperienceKind, planStartupMove, workshopBudgetResult,
  encodeWorkshopFragment, decodeWorkshopFragment, resolveWorkshopSignals, validateWorkshop} from '../../src/workshops/model'

describe('versioned startup workshops', () => {
  it('round-trips a quote selection, keeping the source and restricted placements intact', () => {
    const original=createInterviewWorkshop()
    const candidate=planStartupMove(original,'duplicate','prototype')!
    const saved=decodeWorkshopFragment(encodeWorkshopFragment(candidate))
    expect(saved.cards.find(c=>c.laneId==='prototype')?.id).toBe('duplicate')
    expect(resolveWorkshopSignals(saved).find(s=>s.present)?.label).toBe('Review matching clients')
    expect(original.cards[0].laneId).toBe('prototype')
    original.cards[0].allowedLaneIds=['prototype']
    expect(planStartupMove(original,'duplicate','prototype')).toBeNull()
  })
  it('shows the computed budget after reopening and renaming a destination',()=>{
    const original=createBudgetWorkshop()
    original.lanes[2].label='Newsletter pilot'
    const saved=decodeWorkshopFragment(encodeWorkshopFragment(planStartupMove(original,'fund-1','newsletter')!))
    expect(startupExperienceKind(saved)).toBe('experiment-budget')
    expect(workshopBudgetResult(saved,'newsletter')).toEqual({amount:200,description:'1 placement'})
    expect(workshopBudgetResult(saved,'reserve')?.amount).toBe(200)
    expect(workshopBudgetResult(original,'newsletter')?.amount).toBe(0)
  })
  it('leaves unmarked and extended lane layouts ordinary and rejects unknown versions',()=>{
    const board=createBudgetWorkshop()
    expect(startupExperienceKind({...board,experience:undefined})).toBeUndefined()
    expect(startupExperienceKind({...board,lanes:[...board.lanes,{id:'extra',label:'New lane'}]})).toBeUndefined()
    expect(()=>validateWorkshop({...board,experience:{kind:'experiment-budget',version:9}})).toThrow()
  })
})
