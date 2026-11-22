import { expect, test } from '@playwright/test'
import { resumeArchivedDraft } from './workshop-archive.shared'
import { sendMapEdit } from './map-conversation.shared'
import { dismissWelcome, getSlate, removeTestGuest, userId } from './workshop-guests.shared'
import { exitWithEscape, expectLane, expectWholeSlate, nextView, openPresenter } from './app-presenter.shared'
import { nightTransfer } from '../../src/workshops/model'
import { cardIdNamed, closeConversation, conversation, dragCard, dragCardNamed, holdCardOver, isOffered, lane, laneIdNamed, selectLaneNamed, slateTitle, standing, workshopReady } from './app-native-workshop.shared'

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
    // Restated 2026-11-21: Present opens the presenter; the map's steps are its first viewpoints.
    // Restated 2026-11-22 (fix/present-ai): after the plan's overview of the whole slate.
    const player = await openPresenter(page)
    const narrative = player.locator('.sb-presentation-narrative')
    await nextView(page,player)
    await expectWholeSlate(player)
    for (let step=0; step<state.lanes.length; step++) {
      await nextView(page,player)
      if ((await narrative.textContent())?.startsWith('Depot')) break
    }
    const dispatcher = state.cards.find((x:{label:string})=>x.label==='Dispatcher')
    await expectLane(player,'Depot',depot.id,['rider',dispatcher.id])
    await expect(narrative).toContainText('Dispatch records the arrival.')
    await exitWithEscape(page,player)
    await resumeArchivedDraft(page,origin,'map')
    expect(page.url()).toBe(address)
    expect(await saved()).toEqual(state)
  } finally { await removeTestGuest(page,actor) }
})

test('a token held over a fuller station drops there: no station slides out from under the pointer', async ({ page }) => {
  test.skip(process.env.SLATEBOX_APP_EXTERNAL !== 'true' || !privateHost,'This journey resumes a real private archive.')
  let actor:string|null = null
  try {
    await resumeArchivedDraft(page,origin,'map')
    actor = await userId(page)
    await dismissWelcome(page)
    const key = new URL(page.url()).pathname.split('/').pop()!
    await workshopReady(page)
    await selectLaneNamed(page,'Market St lift')
    await sendMapEdit(page,'After Market St lift, add Depot. On arrival, Dispatch records the arrival.')
    await sendMapEdit(page,'Add token Dispatcher at Depot')
    // The board refuses drags while the kept proposal is still saving; a refused drag moves nothing, so try again.
    await expect(async()=>{
      await dragCardNamed(page,'Last rider','Market St lift')
      await expect(standing(page)).toContainText('Last rider · Market St lift',{timeout:2000})
    }).toPass({timeout:20000})
    const rider = await cardIdNamed(page,'Last rider'), depot = await laneIdNamed(page,'Depot')
    // A person carries the token over Depot and pauses before letting go.
    await holdCardOver(page,rider,depot)
    await page.waitForTimeout(1000)
    await page.mouse.up()
    await expect.poll(async()=> (await getSlate(page,key)).creative.model.workshop.cards.find((x:{id:string})=>x.id===rider).laneId).toBe(depot)
    await expect(standing(page)).toContainText('Last rider · Depot')
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
