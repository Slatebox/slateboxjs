import { expect, test, type Browser, type Page } from '@playwright/test'
import { randomBytes } from 'node:crypto'
import { register, retire, type Actor } from './agent-principals.shared'

// Mermaid on every slate, in the app: the slate menu's Mermaid item opens a dialog that shows the
// slate as Mermaid (copy, download .mmd and .md, other formats) and draws pasted or opened
// Mermaid as real notes and lines, on this slate or a new one. At a desktop width and a phone's.
const origin = process.env.SLATEBOX_APP_URL || 'http://localhost:3000'
const local = ['localhost', '127.0.0.1'].includes(new URL(origin).hostname)
// MERMAID_SHOTS=<folder> keeps a picture of each dialog state for a person to look at.
const shot = (page: Page, name: string) =>
  process.env.MERMAID_SHOTS ? page.screenshot({ path: `${process.env.MERMAID_SHOTS}/${name}.png` }) : Promise.resolve()

const engineIds = (page: Page) => page.evaluate(() => {
  const s = (window as any).__slateboxInstances?.find((x: any) => x.element?.id === 'slateCanvas')
  return (s?.nodes.allNodes ?? []).map((n: any) => n.options.id as string)
})
const engineText = (page: Page, id: string) => page.evaluate((id) => {
  const s = (window as any).__slateboxInstances?.find((x: any) => x.element?.id === 'slateCanvas')
  return s?.nodes.allNodes.find((n: any) => n.options.id === id)?.options.text ?? null
}, id)

async function person(browser: Browser, width: number): Promise<Actor & { key: string }> {
  const context = await browser.newContext({ viewport: { width, height: 900 }, acceptDownloads: true })
  await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin })
  const page = await context.newPage()
  const actor: Actor = { page, email: `mermaid-${randomBytes(5).toString('hex')}@example.test`, id: null }
  const key = await register(actor, '/start')
  await page.goto(new URL('/canvas/' + key, origin).href)
  await page.waitForFunction(() => (window as any).__slateboxInstances?.some((s: any) => s.element?.id === 'slateCanvas' && s.nodes.allNodes.length > 0))
  const ok = page.getByRole('dialog', { name: /welcome/i }).getByRole('button', { name: 'OK', exact: true })
  if (await ok.waitFor({ timeout: 2500 }).then(() => true, () => false)) await ok.click()
  return { ...actor, key }
}

async function openMermaid(page: Page) {
  await page.locator('.sb-board-toolbar').getByRole('button', { name: /slate menu$/ }).click()
  const item = page.getByRole('menuitem', { name: /^Mermaid/ })
  await expect(item).toBeVisible()
  await shot(page, `menu-${page.viewportSize()!.width}`)
  await item.click()
  const dialog = page.getByRole('dialog', { name: 'Mermaid' })
  await expect(dialog).toBeVisible()
  return dialog
}

async function noSidewaysScroll(page: Page) {
  const sizes = await page.evaluate(() => ({ page: document.documentElement.scrollWidth, inner: innerWidth }))
  expect(sizes.page, 'the page does not scroll sideways').toBeLessThanOrEqual(sizes.inner)
}

test.beforeEach(() => { test.skip(!local, 'Creates throwaway accounts on a local app only.') })

for (const width of [1440, 390]) {
  test(`at ${width}: the slate as Mermaid, copied, downloaded and in another format`, async ({ browser }) => {
    const actor = await person(browser, width)
    const { page } = actor
    try {
      // The Mermaid code is not part of the page until the dialog is opened.
      const eager = await page.evaluate(async () => {
        // The app's own scripts (third-party ones are not the app's bundle).
        const sources = [...document.querySelectorAll('script[src]')].map((s) => (s as HTMLScriptElement).src)
          .filter((src) => new URL(src).origin === location.origin)
        const texts = await Promise.all(sources.map((src) => fetch(src).then((r) => r.text())))
        return { scripts: texts.length, bytes: texts.reduce((n, t) => n + t.length, 0), mermaid: texts.some((text) => text.includes('mermaid_unsupported')) }
      })
      expect(eager.scripts).toBeGreaterThan(0)
      expect(eager.mermaid, 'the main bundle carries no Mermaid code').toBe(false)

      const dialog = await openMermaid(page)
      const text = dialog.getByTestId('mermaid-text')
      // The starter slate is a mind map that is one tree: Automatic writes it as a mindmap.
      await expect(text).toContainText(/^mindmap\n/)
      await expect(dialog.getByText(/^A mind map: \d+ notes?, \d+ lines?/)).toBeVisible()
      const choose = async (name: string) => {
        await dialog.getByRole('combobox', { name: 'Format' }).click()
        await page.getByRole('option', { name, exact: true }).click()
      }
      await choose('Flowchart')
      await expect(text).toContainText(/flowchart (LR|RL|TD|BT)\n/)
      await expect(dialog.getByText(/^A flowchart: \d+ notes?, \d+ lines?/)).toBeVisible()
      await shot(page, `export-${width}`)
      const mermaid = (await text.textContent())!
      const ids = await engineIds(page)
      expect(ids.length).toBeGreaterThan(0)
      for (const id of ids) expect(mermaid, `note ${id} is written`).toContain(`${id}`)
      if (width < 600) {
        const box = await dialog.boundingBox()
        expect(box!.width, 'full screen on a phone').toBeGreaterThanOrEqual(width - 1)
      }
      await noSidewaysScroll(page)

      await dialog.getByRole('button', { name: 'Copy Mermaid', exact: true }).click()
      await expect(dialog.getByRole('status').filter({ hasText: 'Mermaid copied.' })).toBeVisible()
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(mermaid)
      await dialog.getByRole('button', { name: 'Copy as Markdown', exact: true }).click()
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('```mermaid\n' + mermaid + '\n```\n')

      const [mmd] = await Promise.all([page.waitForEvent('download'), dialog.getByRole('button', { name: 'Download .mmd' }).click()])
      expect(mmd.suggestedFilename()).toMatch(/\.mmd$/)
      const { readFile } = await import('node:fs/promises')
      expect(await readFile((await mmd.path())!, 'utf8')).toBe(mermaid + '\n')
      const [md] = await Promise.all([page.waitForEvent('download'), dialog.getByRole('button', { name: 'Download .md' }).click()])
      expect(md.suggestedFilename()).toMatch(/\.md$/)
      expect(await readFile((await md.path())!, 'utf8')).toBe('```mermaid\n' + mermaid + '\n```\n')

      await choose('Mind map')
      await expect(text).toContainText(/^mindmap\n/)
      await dialog.getByRole('button', { name: 'Close', exact: true }).click()
      await expect(dialog).toBeHidden()

      // A private slate has no public Mermaid address.
      const hidden = await page.request.get(new URL(`/slates/${actor.key}.mmd`, origin).href)
      expect(hidden.status()).toBe(404)
      expect(await hidden.text()).toBe('Not found. Only a public slate has a Mermaid address.\n')
    } finally {
      await retire(actor)
      await page.context().close()
    }
  })

  test(`at ${width}: pasted Mermaid is drawn as notes on this slate, kept after a reload, or as a new slate`, async ({ browser }) => {
    const actor = await person(browser, width)
    const { page } = actor
    try {
      const before = await engineIds(page)
      let dialog = await openMermaid(page)
      await dialog.getByRole('tab', { name: 'Import' }).click()
      const box = dialog.getByRole('textbox', { name: 'Mermaid to import' })
      await box.fill('sequenceDiagram\n  Alice->>Bob: Hi')
      await expect(dialog.getByText(/This is a sequence diagram, which it can't draw as notes yet, so nothing was added\./)).toBeVisible()
      await expect(dialog.getByRole('button', { name: 'Add to this slate' })).toBeDisabled()
      await box.fill('flowchart LR\n  m1["Idea #quot;one#quot;"] --> m2(["Plan"])\n  m2 -.->|"maybe"| m3{"Ship?"}\n  subgraph mteam["Team"]\n    m3\n  end')
      await expect(dialog.getByText('Ready: a flowchart of 3 notes and 2 lines, in 1 frame.')).toBeVisible()
      await shot(page, `import-${width}`)
      await noSidewaysScroll(page)
      await dialog.getByRole('button', { name: 'Add to this slate' }).click()
      await expect(dialog).toBeHidden()
      // Drawn here by the same run every open canvas replays.
      await expect.poll(() => engineIds(page), { timeout: 15000 }).toEqual(expect.arrayContaining([...before, 'mteam', 'm1', 'm2', 'm3']))
      expect(await engineText(page, 'm1')).toBe('Idea "one"')
      expect(await engineText(page, 'mteam')).toBe('Team')
      const line = await page.evaluate(() => {
        const s = (window as any).__slateboxInstances?.find((x: any) => x.element?.id === 'slateCanvas')
        const m2 = s.nodes.allNodes.find((n: any) => n.options.id === 'm2')
        const a = m2.relationships.associations.find((x: any) => x.child?.options?.id === 'm3' || x.childId === 'm3')
        return a && { label: a.label, lineDash: a.lineDash }
      })
      expect(line).toEqual({ label: 'maybe', lineDash: 'dotted' })
      await page.waitForTimeout(800)
      await shot(page, `imported-${width}`)

      // Saved on the server: a fresh load draws them.
      await page.reload()
      await page.waitForFunction(() => (window as any).__slateboxInstances?.some((s: any) => s.element?.id === 'slateCanvas' && s.nodes.allNodes.length > 0))
      await expect.poll(() => engineIds(page), { timeout: 15000 }).toEqual(expect.arrayContaining(['mteam', 'm1', 'm2', 'm3']))

      // And as a new slate of one's own.
      dialog = await openMermaid(page)
      await dialog.getByRole('tab', { name: 'Import' }).click()
      await dialog.getByRole('textbox', { name: 'Mermaid to import' }).fill('mindmap\n  root((Launch))\n    Marketing\n    Engineering')
      await expect(dialog.getByText('Ready: a mind map of 3 notes and 2 lines.')).toBeVisible()
      await dialog.getByRole('button', { name: 'Open as a new slate' }).click()
      await page.waitForURL((url) => /\/canvas\/[A-Za-z0-9]+$/.test(url.pathname) && !url.pathname.endsWith(actor.key))
      await expect.poll(async () => (await page.evaluate(() => {
        const s = (window as any).__slateboxInstances?.find((x: any) => x.element?.id === 'slateCanvas')
        return (s?.nodes.allNodes ?? []).map((n: any) => n.options.text).sort()
      })), { timeout: 15000 }).toEqual(['Engineering', 'Launch', 'Marketing'])
      await noSidewaysScroll(page)
    } finally {
      await retire(actor)
      await page.context().close()
    }
  })
}

test('an agent reads and draws Mermaid over the API, the open canvas draws it live, and a public slate has a .mmd address', async ({ browser }) => {
  const actor = await person(browser, 1440)
  const { page, key } = actor
  try {
    const token = await page.evaluate(async () =>
      (await (window as any).Meteor.callAsync('apiTokens.create', { name: 'Mermaid probe', scopes: ['slates:read', 'slates:write'] })).token)
    const auth = { authorization: `Bearer ${token}` }
    const read = await page.request.get(new URL(`/api/v1/slates/${key}/mermaid?format=flowchart`, origin).href, { headers: auth })
    expect(read.status()).toBe(200)
    const body = await read.json()
    expect(body.format).toBe('flowchart')
    expect(body.publicUrl).toBeNull()
    expect(body.markdown).toBe('```mermaid\n' + body.mermaid + '\n```\n')

    const drawn = await page.request.post(new URL('/api/v1/slates/mermaid', origin).href, {
      headers: { ...auth, 'idempotency-key': `mermaid-${randomBytes(4).toString('hex')}` },
      data: { shareId: key, mermaid: 'flowchart TD\n  ag1["From an agent"] --> ag2["Drawn live"]' },
    })
    expect(drawn.status()).toBe(201)
    expect((await drawn.json()).created).toEqual(['ag1', 'ag2'])
    // This canvas was open the whole time: the import's run draws it here without a reload.
    await expect.poll(() => engineIds(page), { timeout: 15000 }).toEqual(expect.arrayContaining(['ag1', 'ag2']))
    expect(await engineText(page, 'ag2')).toBe('Drawn live')

    // A bigger diagram is saved once and replayed here as several runs, in order: a later run's
    // lines join notes an earlier run made.
    const chain = ['flowchart LR', ...Array.from({ length: 40 }, (_, k) => `  ch${k} --> ch${k + 1}`)].join('\n')
    const big = await page.request.post(new URL('/api/v1/slates/mermaid', origin).href, { headers: auth, data: { shareId: key, mermaid: chain } })
    expect(big.status()).toBe(201)
    const lineCount = () => page.evaluate(() => {
      const s = (window as any).__slateboxInstances.find((x: any) => x.element?.id === 'slateCanvas')
      return s.nodes.allNodes.filter((n: any) => /^ch\d+$/.test(n.options.id))
        .reduce((sum: number, n: any) => sum + n.relationships.associations.filter((a: any) => a.parent?.options?.id === n.options.id).length, 0)
    })
    await expect.poll(async () => (await engineIds(page)).filter((id) => /^ch\d+$/.test(id)).length, { timeout: 20000 }).toBe(41)
    await expect.poll(lineCount, { timeout: 20000 }).toBe(40)

    const refused = await page.request.post(new URL('/api/v1/slates/mermaid', origin).href, {
      headers: auth, data: { shareId: key, mermaid: 'classDiagram\n  A <|-- B' },
    })
    expect(refused.status()).toBe(422)
    expect((await refused.json()).error.code).toBe('mermaid_unsupported')

    // Public: anyone reads the Mermaid at a plain-text address.
    const slateId = await page.evaluate(() => (window as any).__slateboxInstances.find((s: any) => s.element?.id === 'slateCanvas').options.id)
    await page.evaluate(async (slateId) => (window as any).Meteor.callAsync('slateAccess.configureLink', { slateId, type: 'public', permission: 'READ' }), slateId)
    const anyone = await browser.newContext()
    try {
      const mmd = await anyone.request.get(new URL(`/slates/${key}.mmd`, origin).href)
      expect(mmd.status()).toBe(200)
      expect(mmd.headers()['content-type']).toBe('text/plain; charset=utf-8')
      expect(mmd.headers()['x-content-type-options']).toBe('nosniff')
      const text = await mmd.text()
      expect(text).toContain('ag1["From an agent"]')
      const md = await anyone.request.get(new URL(`/slates/${key}.md`, origin).href)
      expect(await md.text()).toBe('```mermaid\n' + text.replace(/\n$/, '') + '\n```\n')
      const api = await anyone.request.get(new URL(`/api/v1/slates/${key}/mermaid`, origin).href)
      expect(new URL((await api.json()).publicUrl).pathname).toBe(`/slates/${key}.mmd`)
    } finally {
      await anyone.close()
    }
  } finally {
    await retire(actor)
    await page.context().close()
  }
})
