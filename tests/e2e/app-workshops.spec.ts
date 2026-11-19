import {resumeArchivedDraft} from './workshop-archive.shared'
import { expectWorkshopSlide } from './workshop-slide.shared'
import {laneChat,sendLaneEdit,expectRejectedLaneEdit} from './workshop-conversation.shared'
import {dismissWelcome,getSlate,userId,removeTestGuest} from './workshop-guests.shared'
import { test, expect, type Page } from '@playwright/test'
import {laneOfCard, slateTitle, workshopReady} from './app-native-workshop.shared'

const origin = process.env.SLATEBOX_APP_URL || 'http://localhost:3000'

async function openSavedDirectory(page:Page) {
  await page.goto(new URL('/workshops?view=saved',origin).href)
  await page.waitForFunction(()=> (window as any).Meteor?.status()?.connected && !(window as any).Meteor.loggingIn())
  await expect(page.getByRole('heading',{name:'Saved workshops'})).toBeVisible({timeout:45000})
}

test('review a workshop, move a card, present and open a private editable slate', async ({ page, browser }) => {
  test.skip(process.env.SLATEBOX_APP_EXTERNAL !== 'true', 'Set the deployed app URL for the live contract')
  // This proof creates one guest-owned test slate. Production gets the read-only journey.
  const save = new URL(origin).hostname === 'test.slatebox.com' || new URL(origin).hostname === 'localhost' || new URL(origin).hostname === '127.0.0.1'
  if (!save) {
    await openSavedDirectory(page)
    return
  }
  let ownerId:string|null=null
  try {
    await resumeArchivedDraft(page, origin, 'lanes')
    await dismissWelcome(page)
    ownerId=await userId(page)
    expect(ownerId).toBeTruthy()
    const key=new URL(page.url()).pathname.split('/').pop()!
    await expect(laneChat(page).getByRole('textbox')).toBeVisible()
    await expect(page.getByRole('button',{name:'Edit an object'})).toHaveCount(0)
    await sendLaneEdit(page,'Rename board to Review the winter shutdown pilots')
    await sendLaneEdit(page,'Move @sensors to @pilot')
    await expectRejectedLaneEdit(page,'Move @spares to @pilot')
    await sendLaneEdit(page,'Move @spares to @evidence')
    await page.reload()
    await workshopReady(page)
    await expect(slateTitle(page)).toHaveText('Review the winter shutdown pilots')
    // The saved moves are drawn on the canvas after the reload.
    expect(await laneOfCard(page,'sensors')).toBe('Fund this quarter')
    expect(await laneOfCard(page,'spares')).toBe('Gather evidence')
    await page.getByRole('button', { name: 'Present', exact: true }).click()
    await expectWorkshopSlide(page, 'Proposed trials', [], ['lane-proposed'])
    await expect(page.getByText('No cards in this lane.')).toBeVisible()
    const pilotCards = ['Test bearing sensors on line four', 'Rehearse the overnight restart']
    const pilotNodes = ['lane-pilot', 'card-sensors', 'card-training']
    await page.getByRole('button', { name: 'Next lane' }).click()
    await expectWorkshopSlide(page, 'Fund this quarter', pilotCards, pilotNodes)
    const viewport = page.viewportSize()!
    await page.setViewportSize({ width: 390, height: 760 })
    await expectWorkshopSlide(page, 'Fund this quarter', pilotCards, pilotNodes)
    for (let pass = 0; pass < 3; pass++) {
      await page.keyboard.press('ArrowRight')
      await expectWorkshopSlide(page, 'Gather evidence', ['Stage a spare drive at the north mill', 'Measure cooling losses at shift change'],
        ['lane-evidence', 'card-spares', 'card-cooling'])
      await page.keyboard.press('ArrowLeft')
      await expectWorkshopSlide(page, 'Fund this quarter', pilotCards, pilotNodes)
    }
    await page.setViewportSize(viewport)
    await expectWorkshopSlide(page, 'Fund this quarter', pilotCards, pilotNodes)
    await page.getByRole('button', { name: 'Back to board' }).click()
    const doc=await getSlate(page,key)
    expect(doc.userId).toBe(ownerId)
    expect(doc.options.isPrivate).toBe(true)
    const shareId=key

    const visitor = await browser.newContext()
    try {
      const guest = await visitor.newPage()
      await openSavedDirectory(guest)
      expect(await guest.evaluate(() => [(window as any).Meteor.userId(), localStorage.getItem('meteor_token')])).toEqual([null, null])
      const denials = await guest.evaluate(async id => {
        const meteor = (window as any).Meteor
        const code = async (name: string, arg: string) => {
          try { await meteor.callAsync(name, arg); return 'allowed' }
          catch (err: any) { return err.error }
        }
        const canvas = await meteor.callAsync('slates.get', { shareId: id })
        return [await code('workshops.restore', id!), await code('workshops.draft', 'Review our winter shutdown pilots'), Boolean(canvas?.slateBase)]
      }, shareId)
      expect(denials).toEqual(['unavailable', 'plan-required', false])
    } finally {
      await visitor.close()
    }
  } finally {
    if(ownerId) {
      await page.goto(origin+'/plans')
      await page.waitForFunction(id=>(window as any).Meteor?.userId()===id,ownerId)
      await removeTestGuest(page,ownerId)
    }
  }
})
