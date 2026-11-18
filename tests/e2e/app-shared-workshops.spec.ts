import { test as base, expect, type Page } from '@playwright/test'

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
const ownerState = process.env.SLATEBOX_EDITOR_A
const peerState = process.env.SLATEBOX_EDITOR_B
const test = base.extend<{ editors: { owner: Page; peer: Page; email: string } }>({
  editors: async ({ browser }, use) => {
    base.skip(process.env.SLATEBOX_APP_EXTERNAL !== 'true' || !['127.0.0.1', 'localhost', 'test.slatebox.com'].includes(origin.hostname),
      'Creates synthetic private workshops on an explicitly selected test app')
    base.skip(!ownerState || !peerState, 'Requires two dedicated team editor storage states')
    const ownerContext = await browser.newContext({ storageState: ownerState, permissions: ['clipboard-read', 'clipboard-write'] })
    const peerContext = await browser.newContext({ storageState: peerState })
    try {
      const [owner, peer] = await Promise.all([ownerContext.newPage(), peerContext.newPage()])
      async function actor(page: Page) {
        await page.goto(new URL('/workshops', origin).href)
        await page.waitForFunction(() => (window as any).Meteor?.user()?.emails?.[0]?.address)
        return page.evaluate(() => {
          const user = (window as any).Meteor.user()
          return { id: user._id, email: user.emails[0].address }
        })
      }
      const [a, b] = await Promise.all([actor(owner), actor(peer)])
      expect(a.id === b.id, 'The two editors must be independent accounts').toBe(false)
      await use({ owner, peer, email: b.email })
    } finally {
      await Promise.all([ownerContext.close(), peerContext.close()])
    }
  },
})

async function grant(owner: Page, email: string, level: string) {
  await owner.getByLabel('Team member email').fill(email)
  await owner.getByLabel('Access level').selectOption(level)
  await owner.getByRole('button', { name: 'Save access' }).click()
  await expect(owner.getByRole('status')).toHaveText('Team access updated.')
}

async function share(owner: Page) {
  await owner.getByRole('button', { name: 'Share live workshop' }).click()
  await expect(owner).toHaveURL(/\/workshops\?room=[a-f0-9]{10}$/)
  await owner.getByRole('button', { name: 'Copy workshop link' }).click()
  await expect(owner.getByRole('status')).toHaveText('Workshop link copied.')
  const url = await owner.evaluate(() => navigator.clipboard.readText())
  expect(url).toBe(owner.url())
  return url
}

test('share a branching map, follow its outcome together and return from a live readout', async ({ editors }) => {
  const { owner, peer, email } = editors
  await owner.getByRole('link', { name: 'Build a concept map' }).click()
  await owner.getByRole('button', { name: 'Run concept map' }).click()
  const room = await share(owner)
  await grant(owner, email, 'READ')
  await peer.goto(room)
  await expect(peer.getByText('Live workshop · View only')).toBeVisible()
  await expect(peer.locator('.workshop-readonly')).toContainText('Last rider')
  await grant(owner, email, 'EDIT')
  await expect(peer.getByText('Live workshop · Can edit')).toBeVisible()
  await peer.getByRole('button', { name: 'Last rider → Market St lift' }).click()
  for (const page of [peer, owner]) {
    await expect(page.locator('.workshop-outcomes')).toContainText('Last rider · Market St lift')
    await expect(page.locator('.workshop-outcomes')).toContainText('The lift opens on Market Street.')
    await expect(page.getByRole('button', { name: 'Last rider → East stairs' })).toHaveCount(0)
    await expect(page.locator('[data-revision]')).toHaveAttribute('data-revision', '1')
  }
  await peer.reload()
  await expect(peer.locator('.workshop-outcomes')).toContainText('Last rider · Market St lift')
  await peer.getByRole('button', { name: 'Present workshop' }).click()
  const readout = peer.getByRole('region', { name: 'Decision presentation' })
  await expect(readout.locator('svg [data-node-id="lane-platform"]').first()).toBeAttached()
  await owner.getByRole('button', { name: 'Last rider → Shuttle · Bay B' }).click()
  for (let i = 0; i < 3; i++) await readout.getByRole('button', { name: 'Next station' }).click()
  await expect(readout.getByRole('heading', { name: 'Shuttle · Bay B' })).toBeVisible()
  await expect(readout.getByRole('listitem')).toHaveText(['Last rider'])
  await readout.getByRole('button', { name: 'Back to board' }).click()
  await expect(peer).toHaveURL(room)
  await expect(peer.locator('.workshop-outcomes')).toContainText('The rider makes the connection.')
  await expect(peer.locator('[data-revision]')).toHaveAttribute('data-revision', '2')
})

type Race = { revision?: number; result?: string; release: () => void }
type RaceWindow = Window & { workshopRace: Race; Meteor: { callAsync: (...args: any[]) => Promise<any> } }

// Hold each actual UI move just before DDP dispatch so both users act on the same
// revision, independent of browser scheduling or the distance to the test host.
async function waitAtDispatch(page: Page) {
  await page.evaluate(() => {
    const host = window as unknown as RaceWindow
    const meteor = host.Meteor
    const invoke = meteor.callAsync
    let release!: () => void
    const gate = new Promise<void>(resolve => { release = resolve })
    const race = host.workshopRace = { release } as Race
    meteor.callAsync = async function (method, ...args) {
      if (method !== 'workshops.move') return invoke.call(this, method, ...args)
      meteor.callAsync = invoke
      race.revision = args[1]
      await gate
      try {
        const revision = await invoke.call(this, method, ...args)
        race.result = 'accepted'
        return revision
      } catch (error: any) {
        race.result = error.error
        throw error
      }
    }
  })
}

test('two team members contest the last funded slot and rejoin the same board', async ({ editors }) => {
  const { owner, peer, email } = editors
  await owner.getByRole('button', { name: 'Start workshop' }).click()
  const room = await share(owner)
  await grant(owner, email, 'EDIT')
  await peer.goto(room)
  const pages = [owner, peer]
  const contested = ['Test bearing sensors on line four', 'Stage a spare drive at the north mill']
  const card = (page: Page, name: string) => page.getByRole('combobox', { name: 'Move ' + name, exact: true })
  await Promise.all(pages.map(async (page, i) => {
    await page.getByText('Move a card by name', { exact: true }).click()
    await expect(card(page, contested[i])).toHaveValue('proposed')
    await expect(card(page, 'Rehearse the overnight restart')).toHaveValue('pilot')
    await waitAtDispatch(page)
    await card(page, contested[i]).selectOption('pilot')
    await page.waitForFunction(() => (window as unknown as RaceWindow).workshopRace.revision === 0)
  }))
  await Promise.all(pages.map(page => page.evaluate(() => (window as unknown as RaceWindow).workshopRace.release())))
  const results = await Promise.all(pages.map(async page => {
    await page.waitForFunction(() => (window as unknown as RaceWindow).workshopRace.result)
    return page.evaluate(() => (window as unknown as RaceWindow).workshopRace.result)
  }))
  expect(results.slice().sort()).toEqual(['accepted', 'stale'])
  const winner = results.indexOf('accepted')
  const loser = 1 - winner
  await expect(pages[loser].getByRole('status')).toContainText('The workshop has changed')
  await peer.reload()
  await peer.getByText('Move a card by name', { exact: true }).click()
  for (const page of pages) {
    await expect(page.locator('[data-revision]')).toHaveAttribute('data-revision', '1')
    await expect(card(page, contested[winner])).toHaveValue('pilot')
    await expect(card(page, contested[loser])).toHaveValue('proposed')
    await expect(card(page, contested[loser]).locator('option[value="pilot"]')).toHaveCount(0)
    await expect(card(page, 'Rehearse the overnight restart')).toHaveValue('pilot')
  }
  await card(pages[loser], contested[loser]).selectOption('evidence')
  await expect(card(pages[winner], contested[loser])).toHaveValue('evidence')
  await expect(pages[winner].locator('[data-revision]')).toHaveAttribute('data-revision', '2')
})
