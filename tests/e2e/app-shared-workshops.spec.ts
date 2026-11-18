import {resumeArchivedDraft} from './workshop-archive.shared'
import { test as base, expect, firefox, type Page } from '@playwright/test'

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
const ownerState = process.env.SLATEBOX_EDITOR_A
const peerState = process.env.SLATEBOX_EDITOR_B
const test = base.extend<{ editors: { owner: Page; peer: Page; email: string } }>({
  editors: async ({ browser }, use) => {
    base.skip(process.env.SLATEBOX_APP_EXTERNAL !== 'true' || !['127.0.0.1', 'localhost', 'test.slatebox.com'].includes(origin.hostname),
      'Creates synthetic private workshops on an explicitly selected test app')
    base.skip(!ownerState || !peerState, 'Requires two dedicated team editor storage states')
    const ownerContext = await browser.newContext({ storageState: ownerState, permissions: ['clipboard-read', 'clipboard-write'] })
    const otherBrowser = process.env.SLATEBOX_PEER_BROWSER === 'firefox' ? await firefox.launch() : undefined
    const peerContext = await (otherBrowser || browser).newContext({ storageState: peerState })
    try {
      const [owner, peer] = await Promise.all([ownerContext.newPage(), peerContext.newPage()])
      async function actor(page: Page) {
        await resumeArchivedDraft(page, origin)
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
  const field = owner.getByLabel('Team member email')
  if (!await field.isVisible()) await owner.getByText('Team access', {exact:true}).click()
  await field.fill(email)
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
  await resumeArchivedDraft(owner, origin,'map')
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
type RaceWindow = Window & {
  workshopRace: Race
  Meteor: {
    callAsync: (...args: any[]) => Promise<any>
    disconnect(): void
    reconnect(): void
    status(): { connected: boolean }
  }
}

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
    await waitForRevisionIntent(page, 0)
  }))
  await Promise.all(pages.map(releaseIntent))
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
  await disconnect(peer)
  await waitAtDispatch(peer)
  await card(peer, contested[loser]).selectOption('evidence')
  await waitForRevisionIntent(peer, 1)
  await releaseIntent(peer)
  await card(owner, contested[winner]).selectOption('evidence')
  await revision(owner, 2)
  await revision(peer, 1)
  await reconnect(peer)
  await staleIntent(peer)
  for (const page of pages) {
    await revision(page, 2)
    await expect(card(page, contested[loser])).toHaveValue('proposed')
    await expect(card(page, contested[winner])).toHaveValue('evidence')
  }
  // The former loser can now take the slot freed by the online teammate.
  await card(peer, contested[loser]).selectOption('pilot')
  for (const page of pages) {
    await revision(page, 3)
    await page.reload({ waitUntil: 'domcontentloaded' })
    await revision(page, 3)
    await page.getByText('Move a card by name', { exact: true }).click()
    await expect(card(page, contested[winner])).toHaveValue('evidence')
    await expect(card(page, contested[loser])).toHaveValue('pilot')
    await expect(card(page, 'Rehearse the overnight restart')).toHaveValue('pilot')
    await expect(card(page, contested[winner]).locator('option[value="pilot"]')).toHaveCount(0)
  }
  console.log('Capacity race accepted', contested[winner], '; offline intent was stale; both reloaded revision 3')
})

const revision = (p: Page, value: number) =>
  expect(p.locator('[data-revision]')).toHaveAttribute('data-revision', String(value))
const waitForRevisionIntent = (p: Page, value: number) =>
  p.waitForFunction(n => (window as unknown as RaceWindow).workshopRace.revision === n, value)
const releaseIntent = (p: Page) => p.evaluate(() => (window as unknown as RaceWindow).workshopRace.release())
async function staleIntent(page: Page) {
  await page.waitForFunction(() => (window as unknown as RaceWindow).workshopRace.result === 'stale')
  await expect(page.getByRole('status')).toContainText('The workshop has changed')
}

async function disconnect(page: Page) {
  // Browser offline emulation alone can leave an established DDP socket open.
  // Close the real transport as well, retaining the tab's last room snapshot.
  await page.evaluate(() => (window as unknown as RaceWindow).Meteor.disconnect())
  await page.context().setOffline(true)
  await page.waitForFunction(() => !(window as unknown as RaceWindow).Meteor.status().connected)
}
async function reconnect(page: Page) {
  await page.context().setOffline(false)
  await page.evaluate(() => (window as unknown as RaceWindow).Meteor.reconnect())
  await page.waitForFunction(() => (window as unknown as RaceWindow).Meteor.status().connected)
}

test('competing exits converge, including a move queued while the teammate was offline', async ({ editors }) => {
  const { owner, peer, email } = editors
  await resumeArchivedDraft(owner, origin,'map')
  const room = await share(owner)
  await grant(owner, email, 'EDIT')
  await peer.goto(room, { waitUntil: 'domcontentloaded' })
  const pages = [owner, peer]
  const exits = ['East stairs', 'Market St lift']
  const move = (p: Page, name: string) => p.getByRole('button', { name: 'Last rider → ' + name, exact: true })
  await Promise.all(pages.map(async (p, i) => {
    await revision(p, 0)
    await waitAtDispatch(p)
    await move(p, exits[i]).click()
    await waitForRevisionIntent(p, 0)
  }))
  await Promise.all(pages.map(releaseIntent))
  const results = await Promise.all(pages.map(async p => {
    await p.waitForFunction(() => (window as unknown as RaceWindow).workshopRace.result)
    return p.evaluate(() => (window as unknown as RaceWindow).workshopRace.result)
  }))
  expect(results.slice().sort()).toEqual(['accepted', 'stale'])
  const exit = exits[results.indexOf('accepted')]
  const next = exit === 'East stairs' ? 'Last train' : 'Shuttle · Bay B'
  for (const p of pages) {
    await revision(p, 1)
    await expect(p.locator('.workshop-outcomes')).toContainText('Last rider · ' + exit)
    await expect(p.getByRole('button', { name:/^Last rider → / })).toHaveCount(1)
    await expect(move(p, next)).toBeVisible()
  }
  await disconnect(peer)
  await waitAtDispatch(peer)
  await move(peer, next).click()
  await waitForRevisionIntent(peer, 1)
  await releaseIntent(peer)
  await move(owner, next).click()
  await revision(owner, 2)
  await revision(peer, 1)
  await reconnect(peer)
  await staleIntent(peer)
  let finalRevision = 2
  if (next === 'Last train') {
    await revision(peer, 2)
    await move(peer, 'Market St lift').click()
    await revision(owner, 3)
    await move(owner, 'Shuttle · Bay B').click()
    finalRevision = 4
  }
  for (const p of pages) {
    await revision(p, finalRevision)
    await p.reload({ waitUntil: 'domcontentloaded' })
    await revision(p, finalRevision)
    await expect(p.locator('.workshop-outcomes')).toContainText('Last rider · Shuttle · Bay B')
    await expect(p.locator('.workshop-outcomes')).toContainText('The rider makes the connection')
    await expect(p.getByRole('button', { name:/^Last rider → / })).toHaveCount(0)
  }
  console.log('Route race accepted', exit, '; offline intent was stale; both reloaded terminal revision', finalRevision)
})
