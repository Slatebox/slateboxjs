import { expect, test } from '@playwright/test'
import { resumeArchivedDraft } from './workshop-archive.shared'
import { sendMapEdit } from './map-conversation.shared'
import { dismissWelcome, getSlate, removeTestGuest, userId } from './workshop-guests.shared'
import { expectWorkshopSlide } from './workshop-slide.shared'
import { nightTransfer } from '../../src/workshops/model'

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
const privateHost = ['localhost','127.0.0.1','test.slatebox.com'].includes(origin.hostname)

test('author a branching concept map, follow a consequence, present and reopen the private model', async ({ page }) => {
  test.skip(process.env.SLATEBOX_APP_EXTERNAL !== 'true')
  await page.goto(new URL('/workshops?view=saved&format=map', origin).href)
  await expect(page.getByRole('heading',{name:'Saved workshops'})).toBeVisible()
  await expect(page.getByRole('link',{name:'Sign in'})).toHaveAttribute('href','/login')
  if (!privateHost) return // Opening the saved draft now creates an owned canvas.
  let actor:string|null = null
  try {
    await resumeArchivedDraft(page,origin,'map')
    actor = await userId(page)
    expect(actor).toBeTruthy()
    await dismissWelcome(page)
    const address = page.url(), key = new URL(address).pathname.split('/').pop()!
    const read = () => getSlate(page,key)
    const before = await read()
    expect(before.userId).toBe(actor)
    expect(before.options.isPrivate).toBe(true)
    expect(before.creative.model.workshop).toMatchObject(nightTransfer)
    const native = page.locator('[data-native-workshop-map]')
    await expect(native.locator('[data-node-id="lane-lift"]')).toBeVisible()
    const chat = page.getByRole('complementary',{name:'Map conversation'})
    await sendMapEdit(page,'Rename this map to Night shift route review')
    await expect(page.getByRole('heading',{name:'Night shift route review'})).toBeVisible()
    await page.getByRole('button',{name:'Edit Last train',exact:true}).click()
    await expect(chat.getByLabel('Selected object')).toContainText('Last train')
    await sendMapEdit(page,'Disconnect from East stairs')
    await expect(page.getByRole('button',{name:'Last rider → East stairs'})).toHaveCount(0)
    await page.getByRole('button',{name:'Edit Market St lift',exact:true}).click()
    const destination = 'The lift gives the rider a step-free route.'
    await sendMapEdit(page,'On arrival, '+destination)
    await sendMapEdit(page,'After Market St lift, add Depot. On arrival, Dispatch records the arrival.')
    await sendMapEdit(page,'Add token Dispatcher at Depot')
    await page.getByRole('button',{name:'Last rider → Market St lift'}).click()
    await expect(page.locator('.workshop-outcomes')).toContainText(destination)
    await page.getByRole('button',{name:'Last rider → Depot'}).click()
    const saved = () => read().then(result=>result.creative.model.workshop)
    await expect.poll(async()=> (await saved()).cards[0].laneId).not.toBe('lift')
    const state = await saved(), depot = state.lanes.find((x:{label:string})=>x.label==='Depot')
    expect(state.cards[0].laneId).toBe(depot.id)
    expect(state.lanes[0].station.next).toEqual(['lift'])
    await page.reload()
    await dismissWelcome(page)
    await expect(page.locator('.workshop-outcomes')).toContainText('Last rider · Depot')
    await page.getByRole('button',{name:'Present',exact:true}).click()
    const player = page.getByRole('region',{name:'Decision presentation'})
    for (let step=1; step<state.lanes.length && !(await player.getByRole('heading',{name:'Depot',exact:true}).isVisible()); step++) {
      await player.getByRole('button',{name:'Next station'}).click()
    }
    const dispatcher = state.cards.find((x:{label:string})=>x.label==='Dispatcher')
    await expectWorkshopSlide(page,'Depot',['Last rider','Dispatcher'],['lane-'+depot.id,'card-rider','card-'+dispatcher.id])
    await expect(player.getByText('Dispatch records the arrival.',{exact:true}).last()).toBeVisible()
    await player.getByRole('button',{name:'Back to board'}).click()
    await resumeArchivedDraft(page,origin,'map')
    expect(page.url()).toBe(address)
    expect(await saved()).toEqual(state)
  } finally { await removeTestGuest(page,actor) }
})

test('a phone shows the native starter map and keeps pointer moves aligned', async ({ page }) => {
  test.skip(!privateHost,'This journey resumes a real private archive.')
  await page.setViewportSize({width:390,height:760})
  let actor:string|null = null
  try {
    await resumeArchivedDraft(page,origin,'map')
    actor = await userId(page)
    await dismissWelcome(page)
    const art = page.locator('[data-native-workshop-map]')
    await expect(art.locator('svg').first()).toBeVisible()
    expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    const card = (await page.getByRole('button',{name:'Select Last rider'}).boundingBox())!
    const from = (await page.getByRole('button',{name:'Edit Last train'}).boundingBox())!
    const dest = (await page.getByRole('button',{name:'Edit Market St lift'}).boundingBox())!
    await page.mouse.move(card.x+20,card.y+12)
    await page.mouse.down()
    await page.mouse.move(card.x+20+dest.x-from.x,card.y+12+dest.y-from.y,{steps:18})
    await page.mouse.up()
    await expect(page.locator('.workshop-outcomes')).toContainText('Last rider · Market St lift')
    await page.reload()
    await dismissWelcome(page)
    await expect(page.locator('.workshop-outcomes')).toContainText('Last rider · Market St lift')
  } finally { await removeTestGuest(page,actor) }
})
