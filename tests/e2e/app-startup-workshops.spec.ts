import {test, expect} from '@playwright/test'
import {createBudgetWorkshop, createInterviewWorkshop, decodeWorkshopFragment, planStartupMove} from '../../src/workshops/model'
import {dismissWelcome, getSlate, removeTestGuest, shareAs, userId} from './workshop-guests.shared'
import {sendLaneEdit} from './workshop-conversation.shared'
import {caption, card, dragCard, isOffered, joinToEdit, keyboardMove, placementOutcomes, workshopReady} from './app-native-workshop.shared'

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
const examples = [
  {kind:'customer-interviews', initial:createInterviewWorkshop, mode:'interview-brief', card:'duplicate', lane:'prototype'},
  {kind:'experiment-budget', initial:createBudgetWorkshop, mode:'pilot-budget', card:'fund-1', lane:'newsletter'},
] as const

for (const example of examples) {
  test(example.kind+' keeps its native experience through shared edits, reopening and presentation', async ({browser})=>{
    test.skip(!['localhost','127.0.0.1','test.slatebox.com'].includes(origin.hostname),'Disposable local or staging guests only')
    const ownerContext=await browser.newContext()
    const peerContext=await browser.newContext({viewport:{width:390,height:844}})
    const owner=await ownerContext.newPage()
    const peer=await peerContext.newPage()
    let ownerId:string|null=null
    let peerId:string|null=null
    try {
      const demo=new URL('/assets/product/workshop-demo.html?mode='+example.mode,
        process.env.SLATEBOX_STARTUP_MARKETING_URL || 'https://slatebox.com')
      await owner.goto(demo.href)
      const entry=owner.getByRole('link',{name:/Open this.*in Slatebox/})
      const href=async()=>new URL((await entry.getAttribute('href'))!)
      const initial=example.initial()
      expect(decodeWorkshopFragment((await href()).hash)).toEqual(initial)
      let incoming
      if(example.kind==='customer-interviews') {
        await owner.locator('[data-card="undo"]').press('Enter')
        incoming=planStartupMove(initial,'undo','prototype')!
      } else {
        await owner.locator('[data-card="fund-2"]').press('Enter')
        await owner.locator('[data-drop="pilot"]').press('Enter')
        incoming=planStartupMove(initial,'fund-2','pilot')!
      }
      await expect.poll(async()=>decodeWorkshopFragment((await href()).hash)).toEqual(incoming)
      const handoff=await href()
      expect(handoff.origin).toBe('https://app.slatebox.com')
      expect(handoff.pathname).toBe('/new/workshop')
      // Run the public handoff on the selected disposable app, preserving its full fragment.
      await owner.goto(new URL(handoff.pathname+handoff.hash,origin).href)
      await owner.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
      await expect.poll(()=>userId(owner)).toBeTruthy()
      ownerId=await userId(owner)
      await dismissWelcome(owner)
      const key=new URL(owner.url()).pathname.split('/').pop()!
      const stored=()=>getSlate(owner,key)
      const source=await stored()
      expect(source.options.isPrivate).toBe(true)
      expect(source.creative.model.workshop).toEqual(incoming)
      const expectedHash=process.env.SLATEBOX_EXPECTED_APP_BUNDLE
      if(expectedHash) await expect(owner.locator('script[src*="/'+expectedHash+'.js"]')).toHaveCount(1)
      const edit=await shareAs(owner,'edit')
      await peer.goto(edit.href)
      await dismissWelcome(peer)
      await workshopReady(peer)
      await joinToEdit(peer)
      await expect.poll(()=>userId(peer)).toBeTruthy()
      peerId=await userId(peer)
      expect(peerId).not.toBe(ownerId)
      // The peer is on a phone: the lanes are one to a row, and the card is moved from the keyboard,
      // which is how a person who cannot drag plays the same rules.
      const laneLabel=(await stored()).creative.model.workshop.lanes.find((l:{id:string})=>l.id===example.lane).label
      expect(await keyboardMove(peer,example.card,laneLabel)).toBe(true)
      await expect.poll(async()=>(await stored()).creative.model.workshop.cards.find((c:{id:string})=>c.id===example.card)?.laneId).toBe(example.lane)
      // What the move decided is on the canvas for both people: the budget on the lane's own line,
      // the interview's test as its placement outcome.
      const decided=async(page:typeof owner)=>example.kind==='customer-interviews'
        ? expect(placementOutcomes(page)).toContainText('Imani will test whether Bea can keep the existing client and skip its duplicate.')
        : expect(caption(page,example.lane)).toContainText('$200 · 1 placement')
      await workshopReady(owner)
      await decided(owner)
      await sendLaneEdit(owner,'Rename card @'+example.card+' to First customer pilot')
      await expect(card(peer,example.card)).toContainText('First customer pilot')
      await peer.reload()
      await dismissWelcome(peer)
      await workshopReady(peer)
      await decided(peer)
      await peer.getByRole('button',{name:'Present',exact:true}).click()
      const slides=peer.getByRole('region',{name:'Decision presentation'})
      if(example.kind==='experiment-budget') {
        await slides.getByRole('button',{name:'Next lane'}).click()
        await expect(slides).toContainText('$200 · 1 placement')
      } else await expect(slides).toContainText('Imani will test whether Bea can keep the existing client')
      await expect(slides.getByRole('listitem')).toContainText('First customer pilot')
      await slides.getByRole('button',{name:'Back to board'}).click()
      await shareAs(owner,'read')
      // A reader is offered no way to take the card back, and still sees what was decided.
      const home=(await stored()).creative.model.workshop.lanes[0]
      // The owner, who may edit, is offered the way back by the same canvas (once the Share dialog
      // has left the screen); the reader is not.
      await expect(owner.getByRole('dialog',{name:'Share this slate'})).toHaveCount(0)
      await expect.poll(()=>isOffered(owner,'First customer pilot',home.label)).toBe(true)
      await expect.poll(()=>isOffered(peer,'First customer pilot',home.label)).toBe(false)
      expect(await keyboardMove(peer,example.card,home.label)).toBe(false)
      await decided(peer)
    } finally {
      try {await Promise.all([removeTestGuest(owner,ownerId),removeTestGuest(peer,peerId)])}
      finally {await Promise.all([ownerContext.close(),peerContext.close()])}
    }
  })
}
