import { expect, test } from '@playwright/test'
import { dismissWelcome, getSlate, removeTestGuest, userId } from './workshop-guests.shared'
import { card, conversation, dragCardNamed, lane, laneOfCard, openConversation, workshopReady, workshopStatus } from './app-native-workshop.shared'

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')

test('a free creator previews a route, keeps a decision, follows up and undoes from the canvas', async ({ page }) => {
  test.skip(!['localhost','127.0.0.1','test.slatebox.com'].includes(origin.hostname), 'Uses a disposable private slate.')
  await page.setViewportSize({width:390,height:844})
  let owner: string | null = null
  try {
    await page.goto(new URL('/new/map', origin).href)
    await page.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
    await dismissWelcome(page)
    owner = await userId(page)
    expect(owner).toBeTruthy()
    const key = new URL(page.url()).pathname.split('/').pop()!
    const account = await page.evaluate(() => (window as any).Meteor.callAsync('workshops.account'))
    test.skip(account.canGenerate, 'Free direct authoring uses no model provider.')
    const saved = async () => (await getSlate(page, key)).creative.model.workshop
    const original = await saved()
    await workshopReady(page)
    const chat = conversation(page)
    const box = chat.getByRole('textbox', {name:'Direct map edits'})
    const propose = async (message: string) => { await box.fill(message); await box.press('Enter') }
    await expect(chat.getByRole('heading',{name:'Slatebox',exact:true})).toBeVisible()
    await expect(box).toBeInViewport()
    await expect(chat).toBeVisible()
    await expect(page.getByText('Open stop', {exact:true})).toHaveCount(0)
    await expect(page.getByRole('button',{name:'Add a branch'})).toHaveCount(0)
    await propose('Client CSV → Preview ten rows → Start a pilot')
    const review = chat.getByRole('button',{name:'Keep changes'})
    await expect(review).toBeEnabled()
    expect(await saved()).toEqual(original)
    // The proposal is drawn on the canvas: its three steps are notes there, and nothing is saved yet.
    await expect(lane(page,'next')).toContainText('Preview ten rows')
    await expect(page.locator('#slateCanvas [data-node-id^="lane-"]')).toHaveCount(3)
    // A proposal is looked at, not played: the token stays where the saved map has it until the proposal is kept.
    await dragCardNamed(page,'Progress','Preview ten rows')
    expect(await laneOfCard(page,(await saved()).cards[0].id)).toBe('Client CSV')
    expect(await saved()).toEqual(original)
    await review.click()
    await expect.poll(async () => (await saved()).lanes.map((l:any)=>l.label)).toEqual(['Client CSV','Preview ten rows','Start a pilot'])
    // Kept, the route plays on the canvas.
    await dragCardNamed(page,'Progress','Preview ten rows')
    await expect(page.getByText('Progress · Preview ten rows',{exact:true})).toBeVisible()
    await expect.poll(async () => (await saved()).cards[0].laneId).toEqual('next')
    await propose('Add Keep originals after Preview ten rows')
    await expect(page.locator('#slateCanvas [data-node-id^="lane-"]').filter({hasText:'Keep originals'})).toBeVisible()
    await chat.getByRole('button',{name:'Discard preview',exact:true}).click()
    await expect(page.locator('#slateCanvas [data-node-id^="lane-"]').filter({hasText:'Keep originals'})).toHaveCount(0)
    await expect(box).toBeFocused()
    expect((await saved()).lanes).toHaveLength(3)
    await propose('Rename Start a pilot to Run a pilot')
    await review.click()
    await expect(box).toBeFocused()
    await expect.poll(async () => (await saved()).lanes.at(-1).label).toEqual('Run a pilot')
    await workshopStatus(page).getByRole('button',{name:'Undo last change'}).click()
    await expect.poll(async () => (await saved()).lanes.at(-1).label).toEqual('Start a pilot')
    await page.reload()
    await workshopReady(page)
    // An authored map leaves a phone's screen to the canvas; the conversation and its history are one tap away.
    await openConversation(page)
    await expect(chat.getByRole('log')).toContainText('Rename Start a pilot to Run a pilot')
    await expect(card(page,(await saved()).cards[0].id)).toBeVisible()
    expect((await saved()).cards[0].laneId).toBe('next')
    await expect(page.getByRole('button',{name:'Present',exact:true})).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy()
  } finally {
    await removeTestGuest(page, owner)
  }
})
