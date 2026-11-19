import {test, expect} from '@playwright/test'
import {createBudgetWorkshop, createInterviewWorkshop, decodeWorkshopFragment, planStartupMove} from '../../src/workshops/model'
import {dismissWelcome, getSlate, removeTestGuest, shareAs, userId} from './workshop-guests.shared'
import {sendLaneEdit} from './workshop-conversation.shared'

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
      await peer.getByRole('button',{name:'Join to edit',exact:true}).click()
      await expect.poll(()=>userId(peer)).toBeTruthy()
      peerId=await userId(peer)
      expect(peerId).not.toBe(ownerId)
      const choice='[data-card="'+example.card+'"]'
      await peer.locator(choice).press('Enter')
      if(example.kind==='experiment-budget') await peer.locator('[data-drop="newsletter"]').press('Enter')
      await expect.poll(async()=>(await stored()).creative.model.workshop.cards.find((c:{id:string})=>c.id===example.card)?.laneId).toBe(example.lane)
      const decision=example.kind==='customer-interviews'?'Keep original record':'1 placement'
      const target='[data-drop="'+example.lane+'"]'
      await expect(owner.locator(target)).toContainText(decision)
      await sendLaneEdit(owner,'Rename card @'+example.card+' to First customer pilot')
      await expect(peer.locator(choice)).toContainText('First customer pilot')
      await peer.reload()
      await dismissWelcome(peer)
      await expect(peer.locator(target)).toContainText(decision)
      await peer.getByRole('button',{name:'Present',exact:true}).click()
      const slides=peer.getByRole('region',{name:'Decision presentation'})
      if(example.kind==='experiment-budget') {
        await slides.getByRole('button',{name:'Next lane'}).click()
        await expect(slides).toContainText('$200 · 1 placement')
      } else await expect(slides).toContainText('Imani will test whether Bea can keep the existing client')
      await expect(slides.getByRole('listitem')).toContainText('First customer pilot')
      await slides.getByRole('button',{name:'Back to board'}).click()
      await shareAs(owner,'read')
      await expect(peer.locator(choice)).toBeDisabled()
      await expect(peer.locator(target)).toContainText(decision)
    } finally {
      try {await Promise.all([removeTestGuest(owner,ownerId),removeTestGuest(peer,peerId)])}
      finally {await Promise.all([ownerContext.close(),peerContext.close()])}
    }
  })
}
