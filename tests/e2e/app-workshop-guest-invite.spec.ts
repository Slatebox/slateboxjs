import { userId, getSlate, dismissWelcome, shareAs, removeTestGuest } from './workshop-guests.shared'
import { expect, test } from '@playwright/test'
import { encodeWorkshopFragment, type Workshop } from '../../src/workshops/model'

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
const model: Workshop = {
  version: 1, title: 'First light rehearsal',
  lanes: [
    { id: 'bench', label: 'Lens bench', station: { column: 0, row: 0, next: ['star'], outcome: 'Lens mounted.' } },
    { id: 'star', label: 'Bright star', station: { column: 1, row: 0, next: [], outcome: 'Star in focus.' } },
  ],
  cards: [{ id: 'lens', label: 'Lens', laneId: 'bench' }],
}

test('a first-time workshop visitor chooses whether to join an edit link and loses access when revoked', async ({ browser, browserName }) => {
  test.skip(!['localhost', '127.0.0.1', 'test.slatebox.com'].includes(origin.hostname), 'Creates disposable guest-owned slates on local or staging only')
  const ownerContext = await browser.newContext()
  const readerContext = await browser.newContext()
  const editorContext = await browser.newContext({
    viewport: { width: 390, height: 844 }, hasTouch: true, deviceScaleFactor: 2,
  })
  const owner = await ownerContext.newPage()
  const reader = await readerContext.newPage()
  const editor = await editorContext.newPage()
  let ownerId: string | null = null
  let editorId: string | null = null
  let slateId: string | null = null
  try {
    await owner.goto(new URL('/new/workshop' + encodeWorkshopFragment(model), origin).href)
    await owner.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
    await expect.poll(() => userId(owner)).toBeTruthy()
    ownerId = await userId(owner)
    await dismissWelcome(owner)
    await expect(owner.getByRole('button', { name: 'Lens → Bright star' })).toBeEnabled()
    expect(ownerId).toBeTruthy()
    const key = new URL(owner.url()).pathname.split('/').pop()!
    const original = await getSlate(owner, key)
    expect(original.userId).toBe(ownerId)
    slateId = original._id
    expect(original.options.isPrivate).toBe(true)
    expect(original.creative.model.workshop).toEqual(model)
    if (process.env.SLATEBOX_EXPECTED_APP_BUNDLE) {
      const hash = process.env.SLATEBOX_EXPECTED_APP_BUNDLE
      expect(hash).toMatch(/^[a-f0-9]{40}$/)
      const loaded = owner.locator(`script[src*="/${hash}.js"]`)
      await expect(loaded).toHaveCount(1)
      const bundle = await owner.request.get(new URL((await loaded.getAttribute('src'))!, origin).href)
      expect(bundle.ok()).toBe(true)
      expect(await bundle.text()).toContain('Join to edit')
    }

    const readLink = await shareAs(owner, 'read')
    await reader.goto(readLink.href)
    await dismissWelcome(reader)
    await expect(reader.getByRole('heading', { name: model.title })).toBeVisible()
    await expect(reader.getByRole('button', { name: 'Lens → Bright star' })).toBeDisabled()
    await expect(reader.getByRole('button', { name: 'Join to edit' })).toHaveCount(0)
    expect(await userId(reader)).toBeNull()
    expect((await getSlate(owner, key)).creative.model.workshop).toEqual(model)

    const editLink = await shareAs(owner, 'edit')
    await editor.goto(editLink.href)
    await dismissWelcome(editor)
    await expect(editor.getByRole('heading', { name: model.title })).toBeVisible()
    const join = editor.getByRole('button', { name: 'Join to edit', exact: true })
    await expect(join).toBeEnabled()
    expect(await userId(editor)).toBeNull()
    const move = editor.getByRole('button', { name: 'Lens → Bright star', exact: true })
    await expect(move).toBeDisabled()
    await join.tap()
    await expect.poll(() => userId(editor)).toBeTruthy()
    editorId = await userId(editor)
    await expect(move).toBeEnabled()
    expect(editorId).not.toBe(ownerId)
    expect(new URL(editor.url()).pathname).toBe(editLink.pathname)
    if (browserName === 'chromium') {
      // A trusted finger gesture on the scaled drawing uses displayed screen coordinates.
      const card = editor.locator('.workshop-drawing #choice-lens')
      await card.scrollIntoViewIfNeeded()
      const start = (await card.boundingBox())!
      const from = (await editor.locator('.workshop-drawing #heading-bench').boundingBox())!
      const to = (await editor.locator('.workshop-drawing #heading-star').boundingBox())!
      const x = start.x + start.width / 2, y = start.y + start.height / 2
      const device = await editorContext.newCDPSession(editor)
      try {
        await device.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] })
        for (const fraction of [0.1, 0.5, 1]) {
          await device.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{
            x: x + (to.x - from.x) * fraction, y: y + (to.y - from.y) * fraction,
          }] })
        }
        await device.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
      } finally {
        await device.detach()
      }
    } else {
      await move.tap()
    }

    const location = 'Lens · Bright star'
    await expect(owner.getByText(location, { exact: true })).toBeVisible()
    const expected = { ...model, cards: [{ ...model.cards[0], laneId: 'star' }] }
    await expect.poll(async () => (await getSlate(owner, key)).creative.model.workshop).toEqual(expected)
    const present = editor.getByRole('button', { name: 'Present', exact: true })
    const bounds = await present.boundingBox()
    expect(bounds).not.toBeNull()
    expect(bounds!.x).toBeGreaterThanOrEqual(0)
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(390)
    await present.tap()
    const presentation = editor.getByRole('region', { name: 'Decision presentation' })
    await expect(presentation.getByRole('heading', { name: 'Lens bench' })).toBeVisible()
    await presentation.getByRole('button', { name: 'Next station' }).tap()
    await expect(presentation.getByRole('heading', { name: 'Bright star' })).toBeVisible()
    await expect(presentation.getByRole('listitem')).toHaveText('Lens')
    await expect(presentation.getByRole('paragraph').filter({ hasText: /^Star in focus\.$/ })).toBeVisible()
    await presentation.getByRole('button', { name: 'Back to board' }).tap()
    await expect(presentation).toHaveCount(0)
    await expect(editor.getByText(location, { exact: true })).toBeVisible()
    await editor.reload()
    await dismissWelcome(editor)
    await expect(editor.getByText(location, { exact: true })).toBeVisible()
    expect(await userId(editor)).toBe(editorId)

    const downgraded = await shareAs(owner, 'read')
    expect(downgraded.href).toBe(editLink.href)
    await expect(editor.getByRole('button', { name: 'Edit an object' })).toHaveCount(0)
    await expect(editor.getByText(location, { exact: true })).toBeVisible()

    await owner.getByRole('button', { name: 'Share', exact: true }).click()
    const dialog = owner.getByRole('dialog', { name: /sharing settings/i })
    await dialog.getByRole('button', { name: /^Private/ }).click()
    await dialog.getByRole('button', { name: 'Save', exact: true }).click()
    await expect.poll(async () => (await getSlate(owner, key)).options.isPrivate).toBe(true)
    await expect(editor.getByRole('heading', { name: model.title })).toHaveCount(0)
    const accessKey = editLink.pathname.split('/').pop()!
    expect(await getSlate(editor, accessKey)).toBeFalsy()
    await editor.reload()
    await expect.poll(() => userId(editor)).toBe(editorId)
    await expect(editor.getByRole('heading', { name: model.title })).toHaveCount(0)
    await expect(editor.getByRole('button', { name: 'Join to edit' })).toHaveCount(0)
    expect(await getSlate(editor, accessKey)).toBeFalsy()
    expect((await getSlate(owner, key)).creative.model.workshop).toEqual(expected)

    const replacement = await shareAs(owner, 'edit')
    expect(replacement.href).not.toBe(editLink.href)
    await editor.goto(editLink.href)
    await expect.poll(() => userId(editor)).toBe(editorId)
    expect(await getSlate(editor, accessKey)).toBeFalsy()
    await expect(editor.getByRole('heading', { name: model.title })).toHaveCount(0)
    await editor.goto(replacement.href)
    await expect(editor.getByRole('button', { name: 'Edit an object' })).toBeVisible()
    await expect(editor.getByText(location, { exact: true })).toBeVisible()
  } finally {
    try {
      try {
        if (slateId && ownerId && await userId(owner) === ownerId) {
          // The board deletion also removes its link grants.
          await owner.evaluate(id => (window as any).Meteor.callAsync('slates.remove', { slateIds: [id] }), slateId)
        }
      } finally {
        await Promise.all([removeTestGuest(owner, ownerId), removeTestGuest(editor, editorId)])
      }
    } finally {
      await Promise.all([ownerContext.close(), readerContext.close(), editorContext.close()])
    }
  }
})
