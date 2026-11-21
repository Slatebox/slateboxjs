import { randomBytes, randomUUID } from 'node:crypto'
import { expect, test, type Page } from '@playwright/test'
import { openGuestCanvas } from './app-host.shared'
import { removeTestGuest, userId, dismissWelcome, getSlate, shareAs } from './workshop-guests.shared'

/**
 * The Custom Behavior dialog (More > Note behaviour…) is retired (owner, 2026-11-21). What it set
 * that something still reads is plain note data that chat and exec set through the operations
 * contract, like everything else: `category` (a template's category) and `hiddenControls` (the
 * style-bar controls a note leaves off). Keeping a note in place is Lock (More > Locked, `locked`).
 */

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
const shots = process.env.BEHAVIOR_SHOTS
test.skip(!['localhost', '127.0.0.1'].includes(origin.hostname), 'Creates disposable guests and slates; local app only.')

const engine = (page: Page) => page.evaluate(() => Boolean((window as any).slate?.v2))
const opt = (page: Page, text: string, name: string) => page.evaluate(([text, name]) =>
  (window as any).slate.v2.getAllNodes().find((n: any) => n.options.text === text)?.options[name], [text, name])
const noteNamed = (page: Page, text: string) => page.locator('#slateCanvas [data-node-id]').filter({ hasText: text }).first()
const bar = (page: Page) => page.getByRole('toolbar', { name: 'Note', exact: true })

async function openSlate(page: Page) {
  await openGuestCanvas(page, origin.origin)
  const cookies = page.getByRole('button', { name: 'Accept cookies' })
  if (await cookies.isVisible()) await cookies.click()
  await expect.poll(() => userId(page)).toBeTruthy()
  await expect.poll(() => engine(page)).toBe(true)
  await expect(noteNamed(page, 'Welcome!')).toBeVisible()
  // Ask Slatebox opens beside (or, on a phone, under) a new slate; close it for room.
  const close = page.getByRole('button', { name: 'Close conversation' })
  if (await close.isVisible().catch(() => false)) await close.click()
  await expect(close).toHaveCount(0)
  return (await userId(page))!
}

async function select(page: Page, text: string) {
  const box = (await noteNamed(page, text).boundingBox())!
  const at = { x: box.x + box.width / 2, y: box.y + box.height / 2 }
  // A phone is touched; a desktop is clicked.
  if ((page.viewportSize()?.width ?? 1440) < 600) await page.touchscreen.tap(at.x, at.y)
  else await page.mouse.click(at.x, at.y)
  await expect.poll(() => page.evaluate(() => (window as any).slate.v2.getSelectedNodes().map((n: any) => n.options.text))).toEqual([text])
  await expect(bar(page)).toBeVisible()
}

for (const width of [1440, 390]) {
  test(`${width}: More has no Note behaviour… row, even for the slate's author; Locked keeps a note in place`, async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 900 }, hasTouch: width === 390 })
    const page = await context.newPage()
    let id: string | null = null
    try {
      id = await openSlate(page)
      // The guest made this slate: the author the old row was offered to.
      expect(await page.evaluate(() => (window as any).slate?.options?.basedOnTemplate ?? null)).toBeNull()
      await select(page, 'Welcome!')
      await bar(page).getByRole('button', { name: 'More', exact: true }).click()
      const locked = page.getByRole('switch', { name: 'Locked' })
      await expect(locked).toBeVisible()
      await page.waitForTimeout(400)
      if (shots) await page.screenshot({ path: `${shots}/more-${width}.png` })
      await expect(page.getByRole('button', { name: /Note behaviour/ })).toHaveCount(0)
      await expect(page.getByText(/Note behaviour|Custom Behavior/)).toHaveCount(0)
      await expect(page.locator('[aria-labelledby="node-custom-behavior-dialog"]')).toHaveCount(0)
      // Lock is the one way to keep a note in place: a locked note does not move when dragged.
      await locked.click()
      await expect.poll(() => opt(page, 'Welcome!', 'isLocked')).toBe(true)
      await page.keyboard.press('Escape')
      const before = [await opt(page, 'Welcome!', 'x'), await opt(page, 'Welcome!', 'y')]
      const box = (await noteNamed(page, 'Welcome!').boundingBox())!
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
      await page.mouse.down()
      await page.mouse.move(box.x + box.width / 2 + 60, box.y + box.height / 2 + 40, { steps: 8 })
      await page.mouse.up()
      await page.waitForTimeout(300)
      expect([await opt(page, 'Welcome!', 'x'), await opt(page, 'Welcome!', 'y')]).toEqual(before)
    } finally { await removeTestGuest(page, id); await context.close() }
  })
}

test('chat and exec set what the dialog kept: a category and hidden controls reach both browsers, the bar and a reload', async ({ browser, request }) => {
  const owner = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const peerContext = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true })
  const peer = await peerContext.newPage()
  owner.setDefaultTimeout(15_000)
  peer.setDefaultTimeout(15_000)

  const entry = new URL('/new', origin)
  entry.hash = new URLSearchParams({ brief: 'Retired behaviour ' + randomUUID() }).toString()
  await owner.goto(entry.href)
  await owner.waitForURL(/\/canvas\/[a-zA-Z0-9]{10}$/)
  await owner.waitForFunction(() => Boolean((window as any).Meteor?.userId()))
  await owner.goto(new URL('/profile', origin).href)
  const claim = owner.getByTestId('guest-account-claim')
  if (!await claim.waitFor({ timeout: 3000 }).then(() => true, () => false)) {
    await owner.getByRole('main').getByRole('button', { name: 'Save My Slatebox', exact: true }).click()
  }
  await claim.getByLabel('Email address').fill('retired-behaviour-' + randomUUID() + '@qa.slatebox.invalid')
  await claim.locator('input[type=password]').fill(randomBytes(24).toString('hex'))
  await claim.getByRole('button', { name: 'Save my Slatebox' }).click()
  await owner.waitForFunction(() => (window as any).Meteor?.user()?.isAnonymous === false)
  const issued = await owner.evaluate(() => (window as any).Meteor.callAsync('apiTokens.create', { name: 'Retired behaviour proof', scopes: ['slates:read', 'slates:write'] }))
  const headers = { Authorization: 'Bearer ' + issued.token }
  try {
    const created = await request.post(new URL('/api/v1/slates', origin).href, {
      headers: { ...headers, 'Idempotency-Key': randomUUID() },
      data: { kind: 'diagram', brief: 'Costs -> Rent' },
    })
    expect(created.status()).toBe(201)
    const { shareId, url, diagram } = await created.json()
    const costs = diagram.nodes.find((n: any) => n.text === 'Costs').id as string
    const endpoint = new URL('/api/v1/slates/' + shareId + '/operations', origin).href
    const revision = async () => (await (await request.get(new URL('/api/v1/slates/' + shareId, origin).href, { headers })).json()).revision
    const save = async (operations: object[], userMessage: string) =>
      request.post(endpoint, { headers, data: { userMessage, expectedRevision: await revision(), plan: { message: 'Done.', operations } } })

    await owner.goto(url)
    await dismissWelcome(owner)
    await owner.waitForFunction(() => Boolean((window as any).slate?.exportJSON))
    const invitation = await shareAs(owner, 'edit')
    await peer.goto(invitation.href)
    await dismissWelcome(peer)
    await peer.waitForFunction(() => Boolean((window as any).slate?.exportJSON))

    const live = (page: Page, id: string) => page.evaluate((id) => {
      const o = JSON.parse((window as any).slate.exportJSON()).nodes.find((n: any) => n.options.id === id)?.options ?? {}
      return { isCategory: o.isCategory === true, categoryName: o.categoryName ?? null, showColorTab: o.showColorTab !== false, showShapeTab: o.showShapeTab !== false }
    }, id)
    const both = async (id: string, want: Record<string, unknown>) => {
      for (const page of [owner, peer]) await expect.poll(() => live(page, id), { timeout: 15_000 }).toEqual(want)
    }

    // "Make Costs a category, and keep people from recolouring or reshaping it."
    const made = await save([{ kind: 'update_nodes', target: { ids: [costs] }, changes: { category: 'Costs', hiddenControls: ['color', 'shape'] } }],
      'make Costs a category and stop people recolouring or reshaping it')
    expect(made.status(), await made.text()).toBe(201)
    const set = { isCategory: true, categoryName: 'Costs', showColorTab: false, showShapeTab: false }
    await both(costs, set)
    const stored = (await getSlate(owner, shareId)).nodes.find((n: any) => n.options.id === costs).options
    expect([stored.isCategory, stored.categoryName, stored.showColorTab, stored.showShapeTab]).toEqual([true, 'Costs', false, false])

    // The bar leaves those controls off that note, on both screens; Rent keeps them.
    for (const page of [owner, peer]) {
      await select(page, 'Costs')
      await expect(bar(page).getByRole('button', { name: 'More', exact: true })).toBeVisible()
      await expect(bar(page).getByRole('button', { name: 'Fill colour' })).toHaveCount(0)
      await expect(bar(page).getByRole('button', { name: 'Shape' })).toHaveCount(0)
      if (shots) await page.screenshot({ path: `${shots}/hidden-controls-${page === owner ? 1440 : 390}.png` })
      await select(page, 'Rent')
      await expect(bar(page).getByRole('button', { name: 'Fill colour' })).toBeVisible()
    }

    // A read says so, and both screens agree after a reload.
    const read = await (await request.get(new URL('/api/v1/slates/' + shareId, origin).href, { headers })).json()
    const readCosts = JSON.stringify(read)
    expect(readCosts).toContain('"category":"Costs"')
    for (const page of [owner, peer]) {
      await page.reload()
      await page.waitForFunction(() => Boolean((window as any).slate?.exportJSON))
      await expect.poll(() => live(page, costs), { timeout: 15_000 }).toEqual(set)
    }

    // "Costs is an ordinary note again; let people restyle it."
    const cleared = await save([{ kind: 'update_nodes', target: { ids: [costs] }, changes: { category: null, hiddenControls: [] } }], 'make Costs an ordinary note again')
    expect(cleared.status(), await cleared.text()).toBe(201)
    const plain = { isCategory: false, categoryName: null, showColorTab: true, showShapeTab: true }
    await both(costs, plain)
    await select(owner, 'Costs')
    await expect(bar(owner).getByRole('button', { name: 'Fill colour' })).toBeVisible()
  } finally {
    await owner.evaluate((id) => (window as any).Meteor.callAsync('apiTokens.revoke', id), issued.id).catch(() => undefined)
    await peerContext.close()
  }
})
