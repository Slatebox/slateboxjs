import { expect, test } from '@playwright/test'
import { dismissWelcome, getSlate, removeTestGuest, userId } from './workshop-guests.shared'

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
    const chat = page.getByRole('complementary', {name:'Map conversation'})
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
    await page.getByRole('button',{name:'Progress → Preview ten rows'}).click()
    await expect(page.getByText('Progress · Preview ten rows',{exact:true})).toBeVisible()
    await review.click()
    await expect.poll(async () => (await saved()).cards[0].laneId).toEqual('next')
    await propose('Add Keep originals after Preview ten rows')
    await expect(page.getByRole('button',{name:'Progress → Keep originals'})).toBeVisible()
    await chat.getByRole('button',{name:'Discard',exact:true}).click()
    await expect(box).toBeFocused()
    expect((await saved()).lanes).toHaveLength(3)
    await propose('Rename Start a pilot to Run a pilot')
    await review.click()
    await expect(box).toBeFocused()
    await expect.poll(async () => (await saved()).lanes.at(-1).label).toEqual('Run a pilot')
    await page.getByRole('button',{name:'Undo last change'}).click()
    await expect.poll(async () => (await saved()).lanes.at(-1).label).toEqual('Start a pilot')
    await page.reload()
    await expect(chat.getByRole('log')).toContainText('Rename Start a pilot to Run a pilot')
    expect((await saved()).cards[0].laneId).toBe('next')
    await expect(page.getByRole('button',{name:'Present',exact:true})).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy()
  } finally {
    await removeTestGuest(page, owner)
  }
})
