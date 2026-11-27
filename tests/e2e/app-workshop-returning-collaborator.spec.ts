import { randomUUID } from 'node:crypto'
import { expect, test, type Page } from '@playwright/test'
import { encodeWorkshopFragment, type Workshop } from '../../src/workshops/model'
import { dismissWelcome, getSlate, removeTestGuest, shareAs, userId } from './workshop-guests.shared'
import { conversation, dragCardNamed, editable, slateTitle, standingLine, workshopReady } from './app-native-workshop.shared'

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
const workshop: Workshop = {
  version: 1, title: 'Harbor recording session',
  lanes: [
    { id: 'dock', label: 'On the dock', station: { row: 0, column: 0, next: ['boat'], outcome: 'Listen for the harbor bell.' } },
    { id: 'boat', label: 'On the boat', station: { row: 0, column: 1, next: ['dock'], outcome: 'Sample the water.' } },
  ],
  cards: [{ id: 'mic', label: 'Hydrophone', laneId: 'dock' }],
}
const library = (page: Page) => page.goto(new URL('/', origin).href)
const joined = (page: Page) => page.getByRole('region', { name: 'Recently joined' })

async function startWorkshop(page: Page, model: Workshop) {
  await page.goto(new URL('/new/workshop' + encodeWorkshopFragment(model), origin).href)
  await page.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
  await dismissWelcome(page)
  await workshopReady(page)
  await expect(slateTitle(page)).toHaveText(model.title)
  const key = new URL(page.url()).pathname.split('/').pop()!
  const board = await getSlate(page, key)
  expect(board.userId).toBe(await userId(page))
  return { key, id: board._id as string, owner: board.userId as string }
}

test('a joined editor returns from My Slates across devices as the live title and sharing permissions change', async ({ browser }) => {
  test.skip(!['localhost', '127.0.0.1', 'test.slatebox.com'].includes(origin.hostname), 'Creates disposable accounts on local or staging only')
  const contexts = await Promise.all([
    browser.newContext(), browser.newContext(), browser.newContext(),
    // A touch tablet (iPad mini): the returning editor moves a card, and a touch phone views slates only.
    browser.newContext({ viewport: { width: 744, height: 1133 }, hasTouch: true }),
  ])
  const [owner, editor, observer, returning] = await Promise.all(contexts.map(context => context.newPage()))
  const email = 'joined-workshop-' + randomUUID() + '@slatebox.invalid'
  const password = randomUUID()
  let ownerId: string | null = null
  let observerId: string | null = null
  let editorId: string | null = null
  try {
    const source = await startWorkshop(owner, workshop)
    ownerId = source.owner
    if (process.env.SLATEBOX_EXPECTED_APP_BUNDLE) {
      const hash = process.env.SLATEBOX_EXPECTED_APP_BUNDLE
      expect(hash).toMatch(/^[a-f0-9]{40}$/)
      const script = owner.locator(`script[src*="/${hash}.js"]`)
      await expect(script).toHaveCount(1)
      const deployed = await owner.request.get(new URL((await script.getAttribute('src'))!, origin).href)
      expect(deployed.ok()).toBeTruthy()
      expect(await deployed.text()).toContain('Recently joined')
    }
    // An existing guest who only reads the link can check their own populated library.
    const observerTitle = 'Observer soundcheck'
    observerId = (await startWorkshop(observer, { ...workshop, title: observerTitle })).owner
    const read = await shareAs(owner, 'read')
    await observer.goto(read.href)
    await dismissWelcome(observer)
    await workshopReady(observer)
    await expect(slateTitle(observer)).toHaveText(workshop.title)
    await library(observer)
    await expect(observer.getByRole('button', { name: observerTitle, exact: true })).toBeVisible()
    await expect(observer.getByRole('link', { name: workshop.title, exact: true })).toHaveCount(0)

    const invite = await shareAs(owner, 'edit')
    await editor.goto(invite.href)
    const join = editor.getByRole('button', { name: 'Join to edit' })
    await expect(join).toBeVisible()
    await expect(editor.getByRole('dialog', { name: /welcome/i })).toHaveCount(0)
    expect(await userId(editor)).toBeNull()
    const cookies = editor.locator('[data-cookie-notice] button')
    if (await cookies.isVisible()) await cookies.click()
    await join.click()
    await expect.poll(() => userId(editor)).toBeTruthy()
    editorId = await userId(editor)
    await editable(editor)
    await dragCardNamed(editor, 'Hydrophone', 'On the boat')
    await expect.poll(async () => (await getSlate(owner, source.key)).creative.model.workshop.cards[0].laneId).toBe('boat')
    await library(editor)
    const firstVisit = joined(editor).getByRole('link', { name: workshop.title, exact: true })
    await expect(firstVisit).toHaveAttribute('href', invite.pathname)
    await firstVisit.click()
    await expect(editor).toHaveURL(invite.href)
    await expect(editor.getByText(standingLine('Hydrophone', workshop.lanes.find(lane => lane.id === 'boat')!), { exact: true })).toBeVisible()

    await editor.goto(new URL('/profile', origin).href)
    await editor.getByRole('button', { name: 'Save My Slatebox' }).click()
    const account = editor.getByRole('dialog', { name: 'Save your work' })
    await account.getByLabel('Email address').fill(email)
    await account.getByLabel(/^Password/i).fill(password)
    await account.getByRole('button', { name: 'Save my Slatebox' }).click()
    await expect.poll(() => editor.evaluate(() => (window as any).Meteor.user()?.emails?.[0]?.address)).toBe(email)

    const renamed = 'Evening harbor recording'
    const chat=conversation(owner)
    await chat.getByRole('textbox').fill('Rename map to '+renamed)
    await chat.getByRole('button',{name:'Preview changes',exact:true}).click()
    await chat.getByRole('button',{name:'Keep changes'}).click()
    await returning.goto(new URL('/login', origin).href)
    await returning.getByLabel('Email address').fill(email)
    await returning.getByLabel(/^Password/i).fill(password)
    await returning.getByRole('button', { name: 'Sign in', exact: true }).click()
    await expect.poll(() => userId(returning)).toBe(editorId)
    await library(returning)
    const reentry = joined(returning).getByRole('link', { name: renamed, exact: true })
    await expect(reentry).toHaveAttribute('href', invite.pathname)
    await expect(joined(returning).getByRole('link', { name: workshop.title, exact: true })).toHaveCount(0)
    const downgraded = await shareAs(owner, 'read')
    expect(downgraded.pathname).toBe(invite.pathname)
    const bounds = await reentry.boundingBox()
    expect(bounds).not.toBeNull()
    expect(bounds!.x).toBeGreaterThanOrEqual(0)
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(744)
    expect(bounds!.y).toBeGreaterThanOrEqual(0)
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(1133)
    await reentry.tap()
    await expect(returning).toHaveURL(invite.href)
    await dismissWelcome(returning)
    await workshopReady(returning)
    await expect(slateTitle(returning)).toHaveText(renamed)
    await expect(returning.getByText(standingLine('Hydrophone', workshop.lanes.find(lane => lane.id === 'boat')!), { exact: true })).toBeVisible()
    // A reader has no conversation, open or one tap away.
    await expect(conversation(returning)).toHaveCount(0)
    await expect(returning.getByRole('button',{name:'Ask Slatebox'})).toHaveCount(0)

    await library(returning)
    await expect(reentry).toBeVisible()
    await owner.getByRole('button', { name: 'Share', exact: true }).click()
    const sharing = owner.getByRole('dialog', { name: 'Share this slate' })
    await sharing.getByRole('button', { name: /^Private/ }).click()
    await sharing.getByRole('button', { name: 'Make private', exact: true }).click()
    await sharing.getByRole('button', { name: 'Done', exact: true }).click()
    await expect.poll(async () => (await getSlate(owner, source.key)).options.isPrivate).toBe(true)
    await expect(reentry).toHaveCount(0)
    const oldKey = invite.pathname.split('/').pop()!
    expect(await getSlate(returning, oldKey)).toBeFalsy()

    const replacement = await shareAs(owner, 'edit')
    expect(replacement.pathname).not.toBe(invite.pathname)
    await returning.reload()
    await expect.poll(() => userId(returning)).toBe(editorId)
    // My slates says it has none for them now. (Restated for app 4b3958f4: the empty list is a status, no longer an alert.)
    await expect(returning.getByRole('status').filter({ hasText: /slate/i }).first()).toBeVisible()
    await expect(reentry).toHaveCount(0)
    expect(await getSlate(returning, oldKey)).toBeFalsy()
    await returning.goto(replacement.href)
    await dismissWelcome(returning)
    await workshopReady(returning)
    await editable(returning)
    await dragCardNamed(returning, 'Hydrophone', 'On the dock')
    await expect.poll(async () => (await getSlate(owner, source.key)).creative.model.workshop.cards[0].laneId).toBe('dock')
    await library(returning)
    await expect(reentry).toHaveAttribute('href', replacement.pathname)
    // The library is already open when the owner removes this specific synthetic board.
    await owner.evaluate(id => (window as any).Meteor.callAsync('slates.remove', { slateIds: [id] }), source.id)
    await expect(reentry).toHaveCount(0)
    expect(await getSlate(returning, replacement.pathname.split('/').pop()!)).toBeFalsy()
  } finally {
    try {
      if (editorId) {
        const removed = await editor.evaluate(async ({ id, email }) => {
          const m = (window as any).Meteor
          const me = m.user()
          if (me?._id !== id || !(me.isAnonymous || me.emails?.[0]?.address === email)) return false
          return m.callAsync('users.delete')
        }, { id: editorId, email })
        expect(removed).toBe(true)
      }
    } finally {
      try { await Promise.all([removeTestGuest(owner, ownerId), removeTestGuest(observer, observerId)]) }
      finally { await Promise.all(contexts.map(context => context.close())) }
    }
  }
})
