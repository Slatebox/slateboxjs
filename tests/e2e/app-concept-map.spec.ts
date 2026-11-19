import { expect, test } from '@playwright/test'
import { resumeArchivedDraft } from './workshop-archive.shared'
import { sendMapEdit } from './map-conversation.shared'
import { dismissWelcome, getSlate, removeTestGuest, userId } from './workshop-guests.shared'
import { expectWorkshopSlide } from './workshop-slide.shared'
import { nightTransfer } from '../../src/workshops/model'
import { closeConversation, conversation, dragCard, dragCardNamed, isOffered, lane, selectLaneNamed, slateTitle, standing, workshopReady } from './app-native-workshop.shared'

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
    await workshopReady(page)
    await expect(lane(page,'lift')).toBeVisible()
    const chat = conversation(page)
    expect(await isOffered(page,'Last rider','East stairs')).toBe(true)
    await sendMapEdit(page,'Rename this map to Night shift route review')
    await expect(slateTitle(page)).toHaveText('Night shift route review')
    await selectLaneNamed(page,'Last train')
    await expect(chat.getByLabel('Selected object')).toContainText('Last train')
    await sendMapEdit(page,'Disconnect from East stairs')
    expect(await isOffered(page,'Last rider','East stairs')).toBe(false)
    await selectLaneNamed(page,'Market St lift')
    await expect(chat.getByLabel('Selected object')).toContainText('Market St lift')
    const destination = 'The lift gives the rider a step-free route.'
    await sendMapEdit(page,'On arrival, '+destination)
    await sendMapEdit(page,'After Market St lift, add Depot. On arrival, Dispatch records the arrival.')
    await sendMapEdit(page,'Add token Dispatcher at Depot')
    await dragCardNamed(page,'Last rider','Market St lift')
    await expect(standing(page)).toContainText(destination)
    await dragCardNamed(page,'Last rider','Depot')
    const saved = () => read().then(result=>result.creative.model.workshop)
    await expect.poll(async()=> (await saved()).cards[0].laneId).not.toBe('lift')
    const state = await saved(), depot = state.lanes.find((x:{label:string})=>x.label==='Depot')
    expect(state.cards[0].laneId).toBe(depot.id)
    expect(state.lanes[0].station.next).toEqual(['lift'])
    await page.reload()
    await dismissWelcome(page)
    await workshopReady(page)
    await expect(standing(page)).toContainText('Last rider · Depot')
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
    await workshopReady(page)
    expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    // The whole map is fitted to the phone's width: every station is inside the screen.
    await closeConversation(page)
    for (const station of ['platform','lift','stairs']) {
      const box = (await page.locator('#slateCanvas [data-node-id="column-'+station+'"]').boundingBox())!
      expect(box.x).toBeGreaterThanOrEqual(0)
      expect(box.x+box.width).toBeLessThanOrEqual(390)
    }
    await dragCard(page,'rider','lift')
    await expect(standing(page)).toContainText('Last rider · Market St lift')
    // The token sits inside the station it was dropped on.
    const token = (await page.locator('#slateCanvas [data-node-id="card-rider"]').boundingBox())!
    const zone = (await page.locator('#slateCanvas [data-node-id="column-lift"]').boundingBox())!
    expect(token.x).toBeGreaterThanOrEqual(zone.x)
    expect(token.x+token.width).toBeLessThanOrEqual(zone.x+zone.width+1)
    expect(token.y).toBeGreaterThan(zone.y)
    await page.reload()
    await dismissWelcome(page)
    await workshopReady(page)
    await expect(standing(page)).toContainText('Last rider · Market St lift')
  } finally { await removeTestGuest(page,actor) }
})
