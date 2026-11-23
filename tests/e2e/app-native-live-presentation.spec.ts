import { expect, test, type Page } from '@playwright/test'
import { presentToEveryone } from './app-header.shared'
import { camera, expectDeckEnd, expectDeckStart, expectFramed, isLive, litNotes, narrative, nextView, stepCounter } from './app-presenter.shared'
import { dismissWelcome, getSlate, removeTestGuest, shareAs, userId } from './workshop-guests.shared'

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
const button = (page:Page, name:string) => page.getByRole('button',{name,exact:true})
const deck = (page:Page) => page.getByRole('dialog',{name:'Live presentation'})
const note = (page:Page,id:string) => page.locator('#slateCanvas [data-node-id="'+id+'"]').first()

// Restated 2026-11-21: live presenting uses the presenter. Its status, for the presenter and
// for a follower, says which viewpoint is shown; the camera frames that note.
// Restated 2026-11-22 (fix/present-ai): the plan starts on its overview of the whole slate (step 0),
// then segments of related notes, then the closing overview (the last step). A follower is on the
// presenter's step: the same status, narrative and notes.
// Restated 2026-11-23 (styled presentations): the six notes play as a styled deck on a live canvas
// (a title card first, the overview at step 1, the homecoming last). A follower composes the same
// deck over their own drawing: the same step, caption and lit notes; a phone frames the step for
// portrait, so its notes are compared lit, not framed.
async function expectSameView(owner:Page,reader:Page,step:number,total:number) {
  const lead=deck(owner), watching=deck(reader)
  await expect(lead.getByRole('status')).toContainText(step+' of '+total)
  await expect(watching.getByRole('status')).toContainText(step+' of '+total)
  const words=(await narrative(lead).textContent())!
  expect(words).not.toBe('')
  await expect(narrative(watching)).toHaveText(words)
  const lit=await litNotes(lead)
  expect(lit.length).toBeGreaterThan(0)
  if (await isLive(watching)) await expect.poll(async()=>(await litNotes(watching)).sort()).toEqual([...lit].sort())
  else await expectFramed(watching,lit)
  return lit
}

test('a read-only phone follows the presenter across native outage notes and returns to the saved board',async({browser})=>{
  test.skip(!['localhost','127.0.0.1','test.slatebox.com'].includes(origin.hostname),'Uses a disposable source on local or staging only.')
  const owner=await browser.newPage({reducedMotion:'reduce'})
  const reader=await browser.newPage({viewport:{width:390,height:844},hasTouch:true,reducedMotion:'reduce'})
  let ownerId:string|null=null
  try {
    await owner.goto(origin.origin+'/new/sign-in-outage')
    await owner.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
    await expect.poll(()=>userId(owner)).toBeTruthy()
    ownerId=await userId(owner)
    await dismissWelcome(owner)
    const shareId=new URL(owner.url()).pathname.split('/').pop()!
    const stored=()=>getSlate(owner,shareId)
    const original=await stored()
    expect(original.userId).toBe(ownerId)
    expect(original.options.isPrivate).toBe(true)
    expect(original.creative).toBeUndefined()
    const title='Send an outage update'
    await note(owner,'fallback').click()
    await owner.keyboard.press('F2')
    const editor=owner.locator('.sb-inline-editor')
    await editor.fill(title)
    await editor.press('Enter')
    const savedLabel=async()=>(await stored()).nodes.find((node:{options:{id:string}})=>node.options.id==='fallback').options.text
    await expect.poll(savedLabel).toBe(title)
    const invite=await shareAs(owner,'read')
    await reader.goto(invite.href)
    await dismissWelcome(reader)
    if(process.env.SLATEBOX_EXPECTED_APP_BUNDLE) {
      for(const page of [owner,reader]) await expect(page.locator('script[src*="/'+process.env.SLATEBOX_EXPECTED_APP_BUNDLE+'.js"]')).toHaveCount(1)
    }
    expect(await userId(reader)).toBeNull()
    await expect(note(reader,'fallback')).toHaveAttribute('aria-label',title)
    await expect(button(reader,'Presentation options')).toHaveCount(0)
    await presentToEveryone(owner)
    await expect(stepCounter(deck(owner))).toHaveText(/^0 \/ \d+$/,{timeout:30_000})
    const total=Number((await stepCounter(deck(owner)).textContent())!.split('/')[1])
    const noteIds=original.nodes.map((node:{options:{id:string}})=>node.options.id)
    // At least one segment of the six notes, then the closing overview.
    expect(total).toBeGreaterThanOrEqual(2)
    expect(total).toBeLessThanOrEqual(noteIds.length+3)
    await expectDeckStart(deck(owner))
    await nextView(owner,deck(owner))
    const follow=button(reader,'Follow presentation')
    await expect(follow).toBeInViewport()
    await expect(deck(reader)).toHaveCount(0)
    await follow.tap()
    const first=await expectSameView(owner,reader,1,total)
    await expect(deck(reader).getByRole('button',{name:'Next',exact:true})).toHaveCount(0)
    await expect(button(reader,'End presentation')).toHaveCount(0)
    await button(owner,'Next').click()
    const second=await expectSameView(owner,reader,2,total)
    expect(second).not.toEqual(first)
    await reader.keyboard.press('ArrowRight')
    await expectSameView(owner,reader,2,total)
    await reader.reload()
    await expectSameView(owner,reader,2,total)
    await button(owner,'Previous').click()
    expect(await expectSameView(owner,reader,1,total)).toEqual(first)
    await button(reader,'Leave presentation').tap()
    await expect(deck(reader)).toHaveCount(0)
    // The presenter goes on to the closing overview; every note was in some segment, the edited one too.
    const shown=new Set(first)
    for (let step=2; step<=total; step++) {
      await button(owner,'Next').click()
      await expect(deck(owner).getByRole('status')).toContainText(step+' of '+total)
      if (step<total) (await litNotes(deck(owner))).forEach(id=>shown.add(id))
    }
    expect([...shown].sort()).toEqual([...noteIds].sort())
    await expectDeckEnd(deck(owner))
    await expect(camera(deck(owner)).locator('[data-node-id="fallback"]').first()).toHaveAttribute('aria-label',title)
    await expect(follow).toBeInViewport()
    await expect(deck(reader)).toHaveCount(0)
    await follow.tap()
    await expect(deck(reader).getByRole('status')).toContainText(total+' of '+total)
    await expectDeckEnd(deck(reader))
    // Two real navigation actions must reach two distinct stops even when the
    // second action happens before the previous DDP update has painted.
    await button(owner,'Previous').click()
    await button(owner,'Previous').click()
    await expectSameView(owner,reader,total-2,total)
    await button(owner,'End presentation').click()
    await expect(deck(reader)).toHaveCount(0)
    await expect(follow).toHaveCount(0)
    await expect(button(owner,'Present')).toBeVisible()
    await expect(button(reader,'Present')).toBeVisible()
    await reader.reload()
    await expect(note(reader,'fallback')).toHaveAttribute('aria-label',title)
    expect(await userId(reader)).toBeNull()
    expect(await savedLabel()).toBe(title)
  } finally {
    try {await reader.close();await removeTestGuest(owner,ownerId)}
    finally {await owner.close()}
  }
})
