import { randomUUID } from 'node:crypto'
import { expect, test, type Page } from '@playwright/test'
import { encodeWorkshopFragment, type Workshop } from '../../src/workshops/model'
import { editObject } from './workshop-edit.shared'
import { dismissWelcome, getSlate, removeTestGuest, shareAs, userId } from './workshop-guests.shared'

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
  await expect(page.getByRole('heading', { name: model.title })).toBeVisible()
  const key = new URL(page.url()).pathname.split('/').pop()!
  const board = await getSlate(page, key)
  expect(board.userId).toBe(await userId(page))
  return { key, id: board._id as string, owner: board.userId as string }
}

test('a joined editor returns from My Slates across devices as the live title and sharing permissions change', async ({ browser }) => {
  test.skip(!['localhost', '127.0.0.1', 'test.slatebox.com'].includes(origin.hostname), 'Creates disposable accounts on local or staging only')
  const contexts = await Promise.all(Array.from({ length: 4 }, () => browser.newContext()))
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
    await expect(observer.getByRole('heading', { name: workshop.title })).toBeVisible()
    await library(observer)
    await expect(observer.getByRole('button', { name: observerTitle, exact: true })).toBeVisible()
    await expect(observer.getByRole('link', { name: workshop.title, exact: true })).toHaveCount(0)

    const invite = await shareAs(owner, 'edit')
    await editor.goto(invite.href)
    const join = editor.getByRole('button', { name: 'Join to edit' })
    await expect(join).toBeVisible()
    await expect(editor.getByRole('dialog', { name: /welcome/i })).toHaveCount(0)
    expect(await userId(editor)).toBeNull()
    const cookies = editor.getByRole('button', { name: 'Accept cookies' })
    if (await cookies.isVisible()) await cookies.click()
    await join.click()
    await expect.poll(() => userId(editor)).toBeTruthy()
    editorId = await userId(editor)
    await editor.getByRole('button', { name: 'Hydrophone → On the boat' }).click()
    await expect.poll(async () => (await getSlate(owner, source.key)).creative.model.workshop.cards[0].laneId).toBe('boat')
    await library(editor)
    const firstVisit = joined(editor).getByRole('link', { name: workshop.title, exact: true })
    await expect(firstVisit).toHaveAttribute('href', invite.pathname)
    await firstVisit.click()
    await expect(editor).toHaveURL(invite.href)
    await expect(editor.getByText('Hydrophone · On the boat', { exact: true })).toBeVisible()

    await editor.goto(new URL('/profile', origin).href)
    await editor.getByRole('button', { name: 'Save My Slatebox' }).click()
    const account = editor.getByRole('dialog', { name: 'Save your work' })
    await account.getByLabel('Email address').fill(email)
    await account.getByLabel(/^Password/i).fill(password)
    await account.getByRole('button', { name: 'Save my Slatebox' }).click()
    await expect.poll(() => editor.evaluate(() => (window as any).Meteor.user()?.emails?.[0]?.address)).toBe(email)

    const renamed = 'Evening harbor recording'
    await editObject(owner, 'title', () => owner.getByLabel('Board title').fill(renamed))
    await returning.goto(new URL('/login', origin).href)
    await returning.getByLabel('Email Address').fill(email)
    await returning.getByLabel(/^Password/i).fill(password)
    await returning.getByRole('button', { name: /^Sign In\s*→/ }).click()
    await expect.poll(() => userId(returning)).toBe(editorId)
    await library(returning)
    const reentry = joined(returning).getByRole('link', { name: renamed, exact: true })
    await expect(reentry).toHaveAttribute('href', invite.pathname)
    await expect(joined(returning).getByRole('link', { name: workshop.title, exact: true })).toHaveCount(0)
    const downgraded = await shareAs(owner, 'read')
    expect(downgraded.pathname).toBe(invite.pathname)
    await reentry.click()
    await expect(returning).toHaveURL(invite.href)
    await dismissWelcome(returning)
    await expect(returning.getByRole('heading', { name: renamed })).toBeVisible()
    await expect(returning.getByText('Hydrophone · On the boat', { exact: true })).toBeVisible()
    await expect(returning.getByRole('button', { name: 'Edit an object' })).toHaveCount(0)

    await library(returning)
    await expect(reentry).toBeVisible()
    await owner.getByRole('button', { name: 'Share', exact: true }).click()
    const sharing = owner.getByRole('dialog', { name: /sharing settings/i })
    await sharing.getByRole('button', { name: /^Private/ }).click()
    await sharing.getByRole('button', { name: 'Save', exact: true }).click()
    await expect.poll(async () => (await getSlate(owner, source.key)).options.isPrivate).toBe(true)
    await expect(reentry).toHaveCount(0)
    const oldKey = invite.pathname.split('/').pop()!
    expect(await getSlate(returning, oldKey)).toBeFalsy()

    const replacement = await shareAs(owner, 'edit')
    expect(replacement.pathname).not.toBe(invite.pathname)
    await returning.reload()
    await expect.poll(() => userId(returning)).toBe(editorId)
    await expect(returning.getByRole('alert').filter({ hasText: /slate/i }).first()).toBeVisible()
    await expect(reentry).toHaveCount(0)
    expect(await getSlate(returning, oldKey)).toBeFalsy()
    await returning.goto(replacement.href)
    await dismissWelcome(returning)
    await returning.getByRole('button', { name: 'Hydrophone → On the dock' }).click()
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
