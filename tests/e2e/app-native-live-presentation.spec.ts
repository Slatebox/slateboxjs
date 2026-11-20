import { expect, test, type Page } from '@playwright/test'
import { presentToEveryone } from './app-header.shared'
import { dismissWelcome, getSlate, removeTestGuest, shareAs, userId } from './workshop-guests.shared'

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
const button = (page:Page, name:string) => page.getByRole('button',{name,exact:true})
const deck = (page:Page) => page.getByRole('dialog',{name:'Live presentation'})
const note = (page:Page,id:string) => page.locator('#slateCanvas [data-node-id="'+id+'"]').first()

async function expectNativeView(page:Page,id:string,label:string,index:number) {
  const player=deck(page)
  await expect(player.locator('footer [aria-live]')).toContainText(index+' of 6')
  await expect(player.locator('footer [aria-live]')).toContainText(label)
  const art=player.locator('.sb-playback-surface')
  await expect(art.locator('g[data-node-id]')).toHaveCount(6)
  const current=art.locator('g[data-node-id="'+id+'"]')
  await expect(current).toHaveAttribute('aria-label',label)
  // All six notes stay in the SVG throughout playback. Project the native
  // 192 × 76 note's center through its actual transform to verify camera motion.
  await expect.poll(()=>current.evaluate(group=>{
    const graphic=group as SVGGraphicsElement
    const point=new DOMPoint(96,38).matrixTransform(graphic.getScreenCTM()!)
    const rect=group.closest('.sb-playback-surface')!.getBoundingClientRect()
    return Math.max(Math.abs(point.x-rect.x-rect.width/2),Math.abs(point.y-rect.y-rect.height/2))
  })).toBeLessThan(3)
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
    await expectNativeView(owner,'newcomer','New customer',1)
    const follow=button(reader,'Follow presentation')
    await expect(follow).toBeInViewport()
    await expect(deck(reader)).toHaveCount(0)
    await follow.tap()
    await expectNativeView(reader,'newcomer','New customer',1)
    await expect(deck(reader).getByRole('button',{name:'Next',exact:true})).toHaveCount(0)
    await expect(button(reader,'End presentation')).toHaveCount(0)
    await button(owner,'Next').click()
    await expectNativeView(reader,'signin','Sign in\nUnavailable',2)
    await reader.keyboard.press('ArrowRight')
    await expectNativeView(reader,'signin','Sign in\nUnavailable',2)
    await reader.reload()
    await expectNativeView(reader,'signin','Sign in\nUnavailable',2)
    await button(owner,'Previous').click()
    await expectNativeView(reader,'newcomer','New customer',1)
    await button(reader,'Leave presentation').tap()
    await expect(deck(reader)).toHaveCount(0)
    await button(owner,'Next').click()
    await expectNativeView(owner,'signin','Sign in\nUnavailable',2)
    await button(owner,'Next').click()
    await expectNativeView(owner,'fallback',title,3)
    await expect(follow).toBeInViewport()
    await expect(deck(reader)).toHaveCount(0)
    await follow.tap()
    await expectNativeView(reader,'fallback',title,3)
    // Two real navigation actions must reach two distinct stops even when the
    // second action happens before the previous DDP update has painted.
    await button(owner,'Previous').click()
    await button(owner,'Previous').click()
    await expectNativeView(reader,'newcomer','New customer',1)
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
