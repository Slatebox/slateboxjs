import { test, expect, type Page, type FrameLocator } from '@playwright/test'
import { encodeWorkshopFragment, type Workshop } from '../../src/workshops/model'
import { dismissWelcome, getSlate, removeTestGuest, userId } from './workshop-guests.shared'
import { expectWorkshopSlide } from './workshop-slide.shared'
import { editObject } from './workshop-edit.shared'

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
const workshop: Workshop = {
  version: 1, title: 'Loan case rehearsal',
  lanes: [{ id: 'reserve', label: 'Reserve' }, { id: 'case', label: 'Display case', capacity: 1 }],
  cards: [{ id: 'shell', label: 'Shell carving', laneId: 'reserve' }, { id: 'coin', label: 'Copper coin', laneId: 'reserve' }],
}

async function prepareDecision(owner: Page) {
  await owner.getByText('Move a card by name', { exact: true }).click()
  await owner.getByLabel('Move Shell carving', { exact: true }).selectOption('case')
  await expect(owner.getByLabel('Move Copper coin').locator('option[value="case"]')).toHaveCount(0)
  await owner.getByRole('button', { name: 'Presentation order' }).click()
  await owner.getByRole('combobox', { name: 'Scene', exact: true }).selectOption('lane:case')
  await owner.getByRole('combobox', { name: 'Presentation position' }).selectOption('1')
  await owner.getByRole('button', { name: 'Save changes' }).click()
  await expect(owner.locator('.workshop-inspector')).toHaveCount(0)
}

async function verifyPublishedScenes(host: Page, player: Page | FrameLocator, shellLabel = 'Shell carving') {
  await host.bringToFront()
  const presentation = player.getByRole('region', { name: 'Decision presentation' })
  await expectWorkshopSlide(player, 'Display case', [shellLabel], ['lane-case', 'card-shell'])
  await expect(presentation.getByRole('button', { name: 'Back to board' })).toHaveCount(0)
  await expect(player.getByRole('button', { name: 'Edit an object' })).toHaveCount(0)
  await presentation.getByRole('button', { name: 'Next lane' }).click()
  await expectWorkshopSlide(player, 'Reserve', ['Copper coin'], ['lane-reserve', 'card-coin'])
  await presentation.getByRole('button', { name: 'Previous' }).click()
  await expectWorkshopSlide(player, 'Display case', [shellLabel], ['lane-case', 'card-shell'])
}

test('publish a workshop decision, keep the audience snapshot stable across edits, then withdraw both players', async ({ browser }) => {
  test.skip(!['localhost','127.0.0.1','test.slatebox.com'].includes(origin.hostname) ||
    process.env.SLATEBOX_TEST_WORKSHOP_PUBLICATION !== 'true', 'Opt in to publishing and withdrawing a synthetic link-only workshop on local or staging.')
  const authorContext = await browser.newContext({ permissions:['clipboard-read','clipboard-write'] })
  const audienceContext = await browser.newContext({ reducedMotion:'reduce', viewport:{width:1100,height:800} })
  const owner = await authorContext.newPage()
  const viewer = await audienceContext.newPage()
  const article = await audienceContext.newPage()
  let ownerId: string | null = null
  let slateId: string | null = null
  let shareId: string | null = null
  try {
    await owner.goto(new URL('/new/workshop' + encodeWorkshopFragment(workshop), origin).href)
    await owner.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
    await expect.poll(() => userId(owner)).toBeTruthy()
    ownerId = await userId(owner)
    await dismissWelcome(owner)
    const key = new URL(owner.url()).pathname.split('/').pop()!
    const original = await getSlate(owner, key)
    expect(original.userId).toBe(ownerId)
    expect(original.options.isPrivate).toBe(true)
    slateId = original._id
    shareId = key
    if (process.env.SLATEBOX_EXPECTED_APP_BUNDLE) {
      await expect(owner.locator('script[src*="/' + process.env.SLATEBOX_EXPECTED_APP_BUNDLE + '.js"]')).toHaveCount(1)
    }
    const publishedUrl = new URL('/present/' + key, origin).href
    const unavailable = (page: Page | FrameLocator) => page.getByRole('heading', { name: 'Presentation unavailable' })
    await viewer.goto(publishedUrl)
    await expect(unavailable(viewer)).toBeVisible()

    await owner.bringToFront()
    await prepareDecision(owner)
    await owner.getByRole('button', { name:'Publish presentation', exact:true }).click()
    const dialog = owner.getByRole('dialog', { name:'Publish presentation', exact:true })
    await expect(dialog.getByRole('radio', {name:'Anyone with the link'})).toBeChecked()
    await dialog.getByRole('button', {name:'Publish', exact:true}).click()
    await owner.getByRole('button', {name:'Copy link',exact:true}).click()
    expect(await owner.evaluate(() => navigator.clipboard.readText())).toBe(publishedUrl)
    await owner.getByRole('button', {name:'Copy embed code',exact:true}).click()
    const snippet = await owner.evaluate(() => navigator.clipboard.readText())
    await article.setContent('<!doctype html><main><h1>Exhibit handbook</h1>' + snippet + '</main>')
    const embed = article.frameLocator('iframe')
    await expect(article.locator('iframe')).toHaveAttribute('src', publishedUrl)

    await viewer.reload()
    await verifyPublishedScenes(viewer, viewer)
    await verifyPublishedScenes(article, embed)
    expect(await userId(viewer)).toBeNull()
    expect(await getSlate(viewer, key)).toBeFalsy()

    await owner.bringToFront()
    await dialog.getByRole('button', {name:'Close',exact:true}).click()
    const privateLabel = 'Revised private carving'
    await editObject(owner, 'card:shell', () => owner.getByRole('textbox', {name:'Name',exact:true}).fill(privateLabel))
    await expect(owner.locator('#choice-shell')).toContainText(privateLabel)
    await viewer.reload()
    await verifyPublishedScenes(viewer, viewer)
    await article.setContent('<!doctype html><main>' + snippet + '</main>')
    await verifyPublishedScenes(article, embed)

    await owner.bringToFront()
    await owner.getByRole('button', {name:'Publish presentation',exact:true}).click()
    await expect(dialog.getByText('The slate has changed since this version was published.')).toBeVisible()
    await dialog.getByRole('button', {name:'Republish',exact:true}).click()
    await expect(dialog.getByRole('status')).toContainText('Presentation published')
    await expect(dialog.getByRole('link', {name:'Open published presentation'})).toHaveAttribute('href', publishedUrl)
    await viewer.reload()
    await verifyPublishedScenes(viewer, viewer, privateLabel)
    await article.setContent('<!doctype html><main>' + snippet + '</main>')
    await verifyPublishedScenes(article, embed, privateLabel)

    await owner.bringToFront()
    await dialog.getByRole('button', {name:'Withdraw presentation',exact:true}).click()
    await expect(dialog.getByRole('status')).toContainText('Presentation withdrawn')
    await viewer.reload()
    await expect(unavailable(viewer)).toBeVisible()
    await article.setContent('<!doctype html><main>' + snippet + '</main>')
    await expect(unavailable(embed)).toBeVisible()
    await owner.reload()
    await dismissWelcome(owner)
    await expect(owner.getByRole('button', {name:'Edit an object'})).toBeVisible()
    await expect(owner.locator('#choice-shell')).toContainText(privateLabel)
    const saved = await getSlate(owner, key)
    expect(saved.options.isPrivate).toBe(true)
    expect(saved.creative.model.workshop.presentationOrder).toEqual(['case','reserve'])
    expect(saved.creative.model.workshop.cards.find((c: {id: string}) => c.id === 'shell')).toMatchObject({label:privateLabel,laneId:'case'})
    expect(await getSlate(viewer, key)).toBeFalsy()
  } finally {
    try {
      if (ownerId && slateId && await userId(owner) === ownerId) {
        if (shareId) {
          await owner.evaluate(async key => {
            const meteor = (window as any).Meteor
            const active = await meteor.callAsync('presentations.workshopStatus', key)
            if (active) await meteor.callAsync('presentations.unpublish', {
              presentationId: 'workshop-presentation-' + key, generation: active.generation
            })
          }, shareId)
        }
        await owner.evaluate(id => (window as any).Meteor.callAsync('slates.remove', { slateIds:[id] }), slateId)
      }
    } finally {
      try { await removeTestGuest(owner, ownerId) }
      finally { await Promise.all([authorContext.close(), audienceContext.close()]) }
    }
  }
})
