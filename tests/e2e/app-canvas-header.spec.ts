import { expect, test, type Browser, type Page } from '@playwright/test'
import { randomBytes } from 'node:crypto'
import { openGuestCanvas } from './app-host.shared'
import { dismissWelcome, getSlate, removeTestGuest, shareAs, userId } from './workshop-guests.shared'

// The canvas header: getting around on the left, people and this session on the right, you at the
// far right. Every control has a visible label or a name, and nothing lives in a "..." menu.
const origin = process.env.SLATEBOX_APP_URL || 'http://localhost:3000'
const local = ['localhost', '127.0.0.1'].includes(new URL(origin).hostname)
const header = (page: Page) => page.locator('.sb-board-toolbar')
const button = (page: Page, name: string | RegExp) => page.getByRole('button', { name, exact: typeof name === 'string' })
const slateMenuButton = (page: Page) => header(page).getByRole('button', { name: /slate menu$/ })
const key = (page: Page) => new URL(page.url()).pathname.split('/').pop()!

async function guestAt(browser: Browser, width: number, height = 900) {
  const page = await browser.newPage({ viewport: { width, height } })
  await openGuestCanvas(page, origin)
  await header(page).waitFor()
  return { page, id: await userId(page) }
}

async function noOverflow(page: Page) {
  const sizes = await page.evaluate(() => {
    const bar = document.querySelector('.sb-board-toolbar') as HTMLElement
    const title = document.querySelector('.sb-board-name') as HTMLElement
    return { scroll: bar.scrollWidth, client: bar.clientWidth, page: document.documentElement.scrollWidth,
      inner: innerWidth, title: title.getBoundingClientRect().width }
  })
  expect(sizes.scroll, 'the header does not scroll sideways').toBeLessThanOrEqual(sizes.client)
  expect(sizes.page, 'the page does not scroll sideways').toBeLessThanOrEqual(sizes.inner)
  return sizes
}

test.beforeEach(() => { test.skip(!local, 'Creates throwaway guests and accounts on a local app only.') })

test('a guest sees Save your work, the menu, their account menu and no "..." menu', async ({ browser }) => {
  const { page, id } = await guestAt(browser, 1440)
  try {
    await expect(button(page, 'Board menu')).toHaveCount(0)
    await expect(button(page, 'Board settings')).toHaveCount(0)
    await expect(header(page).getByRole('link', { name: 'My Slates', exact: true })).toBeVisible()
    // A guest has nothing to be notified of yet; their most important action is visible.
    await expect(header(page).getByRole('button', { name: /^Notifications/ })).toHaveCount(0)
    await expect(header(page).getByRole('button', { name: 'Save your work', exact: true })).toBeVisible()

    // The app's menu, from the ≡ beside the logo.
    const open = header(page).getByRole('button', { name: 'Open menu', exact: true })
    await open.click()
    const nav = page.getByRole('navigation', { name: 'Slatebox' })
    await expect(nav.getByRole('link', { name: 'Create slate', exact: true })).toHaveAttribute('href', '/new')
    await expect(nav.getByRole('link', { name: 'My Slates', exact: true })).toHaveAttribute('href', '/')
    await expect(nav.getByRole('link', { name: 'Theme library', exact: true })).toHaveAttribute('href', '/themes')
    await expect(nav.getByRole('button', { name: 'Help and support', exact: true })).toBeVisible()
    await expect(nav.getByRole('button', { name: 'Save your work', exact: true })).toBeVisible()
    // Nothing a guest cannot use: no team, no community, no profile.
    for (const name of ['Create Team', 'Create team', 'Community slates', 'Community Slates', 'Profile'])
      await expect(nav.getByRole('link', { name, exact: true })).toHaveCount(0)
    await page.keyboard.press('Escape')
    await expect(nav).toBeHidden()
    // From the keyboard: Enter opens it, Escape closes it and the keyboard is back on ≡.
    await open.focus()
    await page.keyboard.press('Enter')
    await expect(nav).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(nav).toBeHidden()
    await expect(open).toBeFocused()

    // The account menu: no sign out (it would abandon the guest's slates), no plans.
    await header(page).getByRole('button', { name: 'Account, Guest', exact: true }).click()
    const account = page.getByRole('menu', { name: 'Account' })
    await expect(account.getByRole('menuitem', { name: 'Save your work: create an account', exact: true })).toBeVisible()
    await expect(account.getByRole('menuitem', { name: 'Sign in', exact: true })).toBeVisible()
    for (const name of ['Sign out', 'Logout', 'Upgrade', 'Billing', 'Plans and pricing'])
      await expect(account.getByRole('menuitem', { name, exact: true })).toHaveCount(0)
    const dark = account.getByRole('menuitemcheckbox', { name: 'Dark mode', exact: true })
    const before = await dark.getAttribute('aria-checked')
    await dark.click()
    await expect(dark).toHaveAttribute('aria-checked', before === 'true' ? 'false' : 'true')
    await dark.click()
    await expect(dark).toHaveAttribute('aria-checked', before!)
    await page.keyboard.press('Escape')

    await header(page).getByRole('button', { name: 'Save your work', exact: true }).click()
    await expect(page.getByRole('dialog').filter({ hasText: /create an account|sign up|register/i }).first()).toBeVisible()
  } finally { await removeTestGuest(page, id); await page.close() }
})

test('the slate menu on the title renames in place, opens settings, copies and deletes', async ({ browser }) => {
  const { page, id } = await guestAt(browser, 1440)
  try {
    const shareId = key(page)
    await slateMenuButton(page).click()
    const menu = page.getByRole('menu', { name: 'Slate' })
    for (const name of ['Rename', 'Slate settings', 'Theme and colors', 'Version history', 'Copy link', 'Export', 'Embed', 'Make a copy', 'Delete slate…'])
      await expect(menu.getByRole('menuitem', { name, exact: true })).toBeVisible()

    // Rename edits the name where it is. Escape keeps the old name; Enter saves.
    await menu.getByRole('menuitem', { name: 'Rename', exact: true }).click()
    const field = header(page).getByRole('textbox', { name: 'Slate name', exact: true })
    await expect(field).toBeFocused()
    await field.fill('Not this')
    await field.press('Escape')
    await expect(page.locator('.sb-board-name strong')).not.toHaveText('Not this')
    await slateMenuButton(page).click()
    await page.getByRole('menu', { name: 'Slate' }).getByRole('menuitem', { name: 'Rename', exact: true }).click()
    await field.fill('Header proof')
    await field.press('Enter')
    await expect(page.locator('.sb-board-name strong')).toHaveText('Header proof')
    await expect.poll(async () => (await getSlate(page, shareId))?.options.name).toBe('Header proof')

    // Slate settings opens the settings with the name field.
    await slateMenuButton(page).click()
    await page.getByRole('menuitem', { name: 'Slate settings', exact: true }).click()
    await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue('Header proof')
    await page.keyboard.press('Escape')

    // Make a copy opens the copy.
    await slateMenuButton(page).click()
    await page.getByRole('menuitem', { name: 'Make a copy', exact: true }).click()
    await expect.poll(() => key(page)).not.toBe(shareId)
    await expect(page.locator('.sb-board-name strong')).toHaveText('Header proof (copy)')
    const copyId = key(page)
    expect((await getSlate(page, copyId))?.userId).toBe(id)

    // Delete slate… asks first, then removes the slate and leaves it.
    await slateMenuButton(page).click()
    await page.getByRole('menuitem', { name: 'Delete slate…', exact: true }).click()
    const confirm = page.getByRole('dialog').filter({ hasText: 'Header proof (copy)' })
    await expect(confirm).toBeVisible()
    await confirm.getByRole('button', { name: /^(Delete|Yes|OK|Confirm)/ }).first().click()
    await expect(page).not.toHaveURL(new RegExp(copyId))
    await expect.poll(() => getSlate(page, copyId)).toBeFalsy()
  } finally { await removeTestGuest(page, id); await page.close() }
})

test('Ask Slatebox is one toggle in the header that opens and closes the panel of the same name', async ({ browser }) => {
  const { page, id } = await guestAt(browser, 1440)
  try {
    const panel = page.getByRole('complementary', { name: 'Ask Slatebox' })
    const ask = page.getByRole('button', { name: 'Ask Slatebox', exact: true })
    await expect(ask).toHaveCount(1)
    await expect(panel).toBeVisible()
    await expect(panel.getByRole('heading', { name: 'Ask Slatebox' })).toBeVisible()
    await expect(ask).toHaveAttribute('aria-pressed', 'true')
    await ask.click()
    await expect(panel).toHaveCount(0)
    await expect(ask).toHaveAttribute('aria-pressed', 'false')
    await expect(ask).toHaveCount(1)
    await ask.click()
    await expect(panel).toBeVisible()
    await panel.getByRole('button', { name: 'Close conversation', exact: true }).click()
    await expect(panel).toHaveCount(0)
    await expect(ask).toHaveAttribute('aria-pressed', 'false')
    // The old second AI window is gone.
    await expect(page.getByText(/Open AI chat|Close AI chat/)).toHaveCount(0)
  } finally { await removeTestGuest(page, id); await page.close() }
})

test('Present holds presenting to everyone; someone else\'s presentation puts Follow in its place; the people list invites', async ({ browser }) => {
  const { page: owner, id } = await guestAt(browser, 1440)
  const reader = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  try {
    await button(owner, 'Presentation options').click()
    const options = owner.getByRole('menu', { name: 'Present' })
    await expect(options.getByRole('menuitem', { name: 'Present on this screen', exact: true })).toBeVisible()
    await expect(options.getByRole('menuitem', { name: /^Present to everyone here/ })).toBeVisible()
    await expect(options.getByRole('menuitem', { name: 'Edit or publish presentation', exact: true })).toBeVisible()
    await owner.keyboard.press('Escape')
    await expect(button(owner, 'Present notes together')).toHaveCount(0)

    const invite = await shareAs(owner, 'read')
    await reader.goto(invite.href)
    await reader.locator('#slateCanvas [data-node-id]').first().waitFor()
    await dismissWelcome(reader)
    await expect(button(reader, 'Present')).toBeVisible()
    await expect(button(reader, 'Follow presentation')).toHaveCount(0)

    // Who is here, and a way to invite more.
    const people = header(owner).getByRole('button', { name: /^People on this slate/ })
    await expect(people).toBeVisible()
    await people.click()
    const here = owner.getByRole('dialog', { name: 'On this slate' })
    await expect(here.getByRole('listitem')).toHaveCount(2)
    await expect(here.getByRole('listitem').first()).toContainText('You')
    await here.getByRole('button', { name: 'Invite people', exact: true }).click()
    const share = owner.getByRole('dialog', { name: 'Share this slate' })
    await expect(share).toBeVisible()
    await share.getByRole('button', { name: 'Done', exact: true }).click()

    await button(owner, 'Presentation options').click()
    await owner.getByRole('menuitem', { name: /^Present to everyone here/ }).click()
    await expect(owner.getByRole('dialog', { name: 'Live presentation' })).toBeVisible()
    const follow = button(reader, 'Follow presentation')
    await expect(follow).toBeVisible()
    await expect(button(reader, 'Present')).toHaveCount(0)
    await button(owner, 'End presentation').click()
    await expect(follow).toHaveCount(0)
    await expect(button(reader, 'Present')).toBeVisible()
    await expect(button(owner, 'Present')).toBeVisible()
  } finally { await reader.close(); await removeTestGuest(owner, id); await owner.close() }
})

test('desktop widths keep one row with no overflow; the logo leaves below 1180', async ({ browser }) => {
  const { page, id } = await guestAt(browser, 1440)
  try {
    for (const width of [1440, 1280, 1180, 1024, 1000]) {
      await page.setViewportSize({ width, height: 800 })
      await expect(header(page).getByRole('button', { name: 'Ask Slatebox', exact: true })).toBeVisible()
      const sizes = await noOverflow(page)
      expect(sizes.title, 'the title keeps room at ' + width).toBeGreaterThanOrEqual(120)
      const logo = header(page).getByRole('link', { name: 'My Slates', exact: true })
      if (width >= 1180) await expect(logo).toBeVisible()
      else await expect(logo).toBeHidden()
      await expect(page.locator('.sb-canvas-bar')).toBeHidden()
    }
  } finally { await removeTestGuest(page, id); await page.close() }
})

test('phone and tablet: one header row, Ask Slatebox and a labelled Huddle switch in the bottom bar', async ({ browser }) => {
  const { page, id } = await guestAt(browser, 390, 844)
  try {
    for (const width of [820, 390, 360]) {
      await page.setViewportSize({ width, height: 844 })
      const bar = page.getByRole('region', { name: 'Slate tools' })
      await expect(bar.getByRole('switch', { name: 'Huddle' })).toBeVisible()
      await expect(bar.getByRole('button', { name: 'Ask Slatebox', exact: true })).toBeVisible()
      await expect(header(page).getByRole('switch', { name: 'Huddle' })).toHaveCount(0)
      await expect(header(page).getByRole('button', { name: 'Present', exact: true })).toBeVisible()
      await expect(header(page).getByRole('button', { name: 'Share', exact: true })).toBeVisible()
      await expect(header(page).locator('.sb-board-name')).toContainText('Private')
      await noOverflow(page)
      // Nothing from the header is drawn over the canvas.
      const below = await page.evaluate(() => {
        const bottom = (document.querySelector('.sb-board-toolbar') as HTMLElement).getBoundingClientRect().bottom
        return [...document.querySelectorAll('.sb-board-toolbar *')].filter(el => {
          const r = el.getBoundingClientRect(); return r.height > 0 && r.top >= bottom
        }).length
      })
      expect(below).toBe(0)
    }
    // The Present sheet holds only presenting.
    await header(page).getByRole('button', { name: 'Present', exact: true }).click()
    const sheet = page.getByRole('menu', { name: 'Present' })
    await expect(sheet.getByRole('menuitem', { name: 'Present on this screen', exact: true })).toBeVisible()
    await expect(sheet.getByRole('switch', { name: 'Huddle' })).toHaveCount(0)
    // The sheet keeps the keyboard after a tap: the arrows move through its items.
    await page.waitForTimeout(400)
    await page.keyboard.press('ArrowDown')
    await expect(sheet.getByRole('menuitem').filter({ has: page.locator(':focus') }).or(sheet.locator('[role=menuitem]:focus'))).toHaveCount(1)
    await page.keyboard.press('Escape')
    // The ≡ menu.
    await header(page).getByRole('button', { name: /^Open menu/ }).click()
    await expect(page.getByRole('navigation', { name: 'Slatebox' }).getByRole('link', { name: 'Create slate', exact: true })).toBeVisible()
  } finally { await removeTestGuest(page, id); await page.close() }
})

test('a signed-in person has the bell and an account menu with Profile, Dark mode and Sign out, and the team items in the menu', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(origin + '/login')
  await page.waitForFunction(() => (window as any).Accounts && (window as any).Meteor.status().connected)
  const email = 'header-proof-' + randomBytes(10).toString('hex') + '@slatebox.invalid'
  await page.evaluate(async credentials => {
    await new Promise<void>((resolve, reject) => (window as any).Accounts.createUser(credentials, (error: Error) => error ? reject(error) : resolve()))
  }, { email, password: randomBytes(20).toString('hex') })
  await page.goto(origin + '/new')
  await page.waitForURL(/\/canvas\//)
  await page.locator('#slateCanvas [data-node-id]').first().waitFor()
  const bell = header(page).getByRole('button', { name: /^Notifications/ })
  await expect(bell).toBeVisible()
  await expect(header(page).getByRole('button', { name: 'Save your work', exact: true })).toHaveCount(0)
  await bell.click()
  const notes = page.getByRole('dialog', { name: 'Notifications' })
  await expect(notes).toBeVisible()
  expect((await notes.boundingBox())!.width).toBeLessThanOrEqual(380)
  await page.keyboard.press('Escape')

  await header(page).getByRole('button', { name: /^Account, / }).click()
  const account = page.getByRole('menu', { name: 'Account' })
  await expect(account.getByRole('menuitem', { name: 'Profile', exact: true })).toBeVisible()
  await expect(account.getByRole('menuitemcheckbox', { name: 'Dark mode', exact: true })).toBeVisible()
  await expect(account.getByRole('menuitem', { name: 'Sign out', exact: true })).toBeVisible()
  for (const name of ['Upgrade', 'Billing', 'Plans and pricing', 'Logout'])
    await expect(account.getByRole('menuitem', { name, exact: true })).toHaveCount(0)
  await page.keyboard.press('Escape')

  await header(page).getByRole('button', { name: 'Open menu', exact: true }).click()
  const nav = page.getByRole('navigation', { name: 'Slatebox' })
  await expect(nav.getByRole('link', { name: 'Community slates', exact: true })).toBeVisible()
  await expect(nav.getByRole('link', { name: 'Create team', exact: true })).toBeVisible()
  await expect(nav.getByRole('link', { name: 'Profile', exact: true })).toHaveCount(0)
  await nav.getByRole('link', { name: 'My Slates', exact: true }).click()
  await expect(page).toHaveURL(new RegExp(new URL(origin).host + '/$'))
  // Off the canvas the same bell and account menu are in the app bar.
  await expect(page.getByRole('button', { name: /^Notifications/ })).toBeVisible()
  await expect(page.getByRole('button', { name: /^Account, / })).toBeVisible()
})
