import { expect, test, type Page } from '@playwright/test'
import { openGuestCanvas } from './app-host.shared'
import { removeTestGuest, userId } from './workshop-guests.shared'
import { conversation } from './app-native-workshop.shared'

/**
 * Keys after a control beside the canvas has been used, in the running Meteor app.
 *
 * The canvas acts on Delete, Backspace, the arrows and Escape only while the keyboard is on it
 * or nowhere on the page. The app hands the keyboard back after a control that has no use for
 * it (a swatch in the note pane, a choice from a list, the zoom slider, an arrange button), so
 * "select a note, restyle it, press Delete" deletes the note. A field a person types in, a
 * dialog and a menu while it is open keep the keyboard, and a key pressed there never reaches
 * a note.
 */

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
test.skip(!['localhost', '127.0.0.1'].includes(origin.hostname), 'Creates disposable guests and slates; local app only.')
// Room for the conversation beside the canvas and for five notes clear of the canvas's own controls.
test.use({ viewport: { width: 1360, height: 900 } })

const texts = (page: Page) => page.evaluate(() =>
  (window as any).slate.v2.nodes.allNodes.map((node: any) => node.options.text as string).sort())
const selected = (page: Page) => page.evaluate(() =>
  (window as any).slate.v2.getSelectedNodes().map((node: any) => node.options.text as string).sort())
const optionOf = (page: Page, text: string, name: string) => page.evaluate(([text, name]) =>
  (window as any).slate.v2.nodes.allNodes.find((node: any) => node.options.text === text)?.options[name], [text, name])
const noteNamed = (page: Page, text: string) => page.locator('#slateCanvas [data-node-id]').filter({ hasText: text })
const keyboardAt = (page: Page) => page.evaluate(() => {
  const at = document.activeElement
  return !at || at === document.body ? 'nowhere' : at.closest('#slateCanvas') ? 'canvas' : at.tagName.toLowerCase()
})
// The pane and the surface behind it that takes the press which closes it. (Found by its markup,
// not by role: while the pane slides away its tabs are no longer exposed, but that surface is still there.)
const pane = (page: Page) => page.locator('.MuiDrawer-root:has([aria-label="Node Properties"])')
/** The pane has gone, and a press on the canvas reaches the canvas again. */
const paneClosed = (page: Page) => expect(pane(page)).toBeHidden()

async function openSlate(page: Page) {
  await openGuestCanvas(page, origin.origin)
  const cookies = page.getByRole('button', { name: 'Accept cookies' })
  if (await cookies.isVisible()) await cookies.click()
  await expect.poll(() => userId(page)).toBeTruthy()
  await expect(noteNamed(page, 'Welcome!')).toBeVisible()
  return (await userId(page))!
}

/** Press a note with the mouse, as a person selecting it would. */
async function select(page: Page, text: string) {
  const box = (await noteNamed(page, text).boundingBox())!
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2)
  await expect.poll(() => selected(page)).toEqual([text])
}

/** Add a note by double-clicking empty canvas and naming it. */
async function addNote(page: Page, text: string, x: number, y: number) {
  await page.mouse.dblclick(x, y)
  await page.keyboard.type(text)
  await expect(page.locator('.sb-inline-editor')).toBeVisible()
  await page.keyboard.press('Enter')
  await expect(page.locator('.sb-inline-editor')).toHaveCount(0)
  await expect(noteNamed(page, text)).toBeVisible()
}

/** Open the note pane from the cog in the selected note's own toolbar. */
async function openPane(page: Page) {
  await page.locator('#slateCanvas .node-tool-cog').click()
  await expect(pane(page).getByRole('tab', { name: 'Color', exact: true })).toBeVisible()
  return pane(page)
}

/** Pick a colour the note does not have yet from the swatches of the pane's Color tab. */
async function pickSwatch(page: Page, text: string) {
  const before = await optionOf(page, text, 'backgroundColor')
  await pane(page).getByRole('tab', { name: 'Color', exact: true }).click()
  const panel = pane(page).getByRole('tabpanel')
  await expect(panel).toBeVisible()
  const at = await panel.evaluate(el => {
    const swatch = [...el.querySelectorAll('div')].find(item => {
      const box = item.getBoundingClientRect()
      return !item.children.length && box.width >= 24 && box.width <= 60 && box.height >= 24 && box.height <= 60 &&
        !['rgba(0, 0, 0, 0)', 'transparent'].includes(getComputedStyle(item).backgroundColor)
    })
    if (!swatch) return null
    const box = swatch.getBoundingClientRect()
    return { x: box.x + box.width / 2, y: box.y + box.height / 2 }
  })
  expect(at, 'the Color tab offers swatches').not.toBeNull()
  await page.mouse.click(at!.x, at!.y)
  await expect.poll(() => optionOf(page, text, 'backgroundColor'), 'the swatch restyled the note').not.toBe(before)
}

test('a note restyled in the note pane, from a list, with the zoom slider or an arrange button is removed by Delete', async ({ page }) => {
  let id: string | null = null
  try {
    id = await openSlate(page)
    await addNote(page, 'Alpha', 160, 240)
    await addNote(page, 'Beta', 160, 440)
    await addNote(page, 'Gamma', 160, 640)
    await addNote(page, 'Delta', 700, 560)
    expect(await texts(page)).toEqual(['Alpha', 'Beta', 'Delta', 'Gamma', 'Welcome!'])

    // A colour from the note pane, then Delete. The pane is still open when the key is pressed.
    await select(page, 'Welcome!')
    await openPane(page)
    await pickSwatch(page, 'Welcome!')
    expect(await selected(page)).toEqual(['Welcome!'])
    await expect.poll(() => keyboardAt(page), 'the swatch does not keep the keyboard').toBe('nowhere')
    await expect(pane(page).getByRole('tab', { name: 'Color', exact: true })).toBeVisible()
    await page.keyboard.press('Delete')
    await expect(noteNamed(page, 'Welcome!')).toHaveCount(0)
    expect(await texts(page)).toEqual(['Alpha', 'Beta', 'Delta', 'Gamma'])
    // The pane does not outlive its note.
    await paneClosed(page)

    // A size chosen from a list, then Backspace. The list has the keyboard while it is open.
    await select(page, 'Alpha')
    await openPane(page)
    const size = await optionOf(page, 'Alpha', 'fontSize')
    // The pane opens on the tab last used.
    await pane(page).getByRole('tab', { name: 'Text', exact: true }).click()
    await pane(page).locator('#font-size').click()
    const choice = page.getByRole('option', { name: size === 24 ? '28' : '24', exact: true })
    await expect(choice).toBeVisible()
    await page.keyboard.press('Delete')
    expect(await texts(page), 'Delete in the open list is the list\'s').toContain('Alpha')
    await choice.click()
    await expect(page.getByRole('listbox')).toHaveCount(0)
    await expect.poll(() => optionOf(page, 'Alpha', 'fontSize')).toBe(size === 24 ? 28 : 24)
    await expect.poll(() => keyboardAt(page), 'the closed list does not keep the keyboard').toBe('nowhere')
    await page.keyboard.press('Backspace')
    await expect(noteNamed(page, 'Alpha')).toHaveCount(0)
    expect(await texts(page)).toEqual(['Beta', 'Delta', 'Gamma'])
    await paneClosed(page)

    // The zoom slider, then Delete.
    await select(page, 'Beta')
    const zoom = () => page.evaluate(() => (window as any).slate.v2.getZoom() as number)
    const before = await zoom()
    const slider = (await page.locator('#slateCanvas .slatebox-zoom-slider input[type="range"]').boundingBox())!
    await page.mouse.click(slider.x + slider.width * 0.8, slider.y + slider.height / 2)
    await expect.poll(zoom, 'the slider zoomed the canvas').not.toBe(before)
    expect(await selected(page)).toEqual(['Beta'])
    await page.keyboard.press('Delete')
    await expect(noteNamed(page, 'Beta')).toHaveCount(0)
    expect(await texts(page)).toEqual(['Delta', 'Gamma'])
    await page.locator('#slateCanvas .slatebox-zoom-slider').getByRole('button', { name: 'fitToContent' }).click()

    // An arrange button of the selection's own toolbar, then Delete: both selected notes go.
    await select(page, 'Gamma')
    await page.keyboard.press('ControlOrMeta+a')
    await expect.poll(() => selected(page)).toEqual(['Delta', 'Gamma'])
    const left = () => page.evaluate(() => (window as any).slate.v2.getSelectedNodes().map((node: any) => Math.round(node.options.x)))
    expect(new Set(await left()).size).toBe(2)
    await page.getByRole('button', { name: 'arrange-align-left', exact: true }).click()
    await expect.poll(async () => new Set(await left()).size, 'the two notes were aligned').toBe(1)
    await page.keyboard.press('Delete')
    await expect.poll(() => texts(page)).toEqual([])
    await expect(page.locator('#slateCanvas [data-node-id]')).toHaveCount(0)
  } finally { await removeTestGuest(page, id) }
})

test('typing in the Share dialog or in the conversation box never deletes the selected note', async ({ page }) => {
  let id: string | null = null
  try {
    id = await openSlate(page)
    await select(page, 'Welcome!')

    // The Share dialog: its list of permissions, its link field and its buttons keep the keyboard.
    await page.getByRole('button', { name: 'Share', exact: true }).click()
    const dialog = page.getByRole('dialog', { name: 'Share this slate' })
    await expect(dialog).toBeVisible()
    const unlisted = dialog.getByRole('button', { name: /^Unlisted/ })
    if (await unlisted.getAttribute('aria-expanded') !== 'true') await unlisted.click()
    const region = dialog.getByRole('region', { name: /Unlisted/ })
    await region.getByRole('combobox', { name: 'Link permission' }).click()
    await expect(page.getByRole('option', { name: 'read', exact: true })).toBeVisible()
    await page.keyboard.press('Delete')
    await page.keyboard.press('Backspace')
    await page.getByRole('option', { name: 'read', exact: true }).click()
    const commit = region.getByRole('button', { name: /^(Create link|Apply access)$/ })
    if (await commit.count()) await commit.click()
    const link = region.getByRole('textbox', { name: 'Invitation link' })
    await expect(link).toBeVisible()
    await link.click()
    await page.keyboard.press('End')
    await page.keyboard.press('Backspace')
    await page.keyboard.press('Delete')
    await page.keyboard.type('x')
    // A button of the dialog pressed with the mouse keeps the keyboard in the dialog too.
    await unlisted.click()
    await expect.poll(() => keyboardAt(page)).not.toBe('nowhere')
    await page.keyboard.press('Delete')
    await page.keyboard.press('Backspace')
    expect(await texts(page)).toEqual(['Welcome!'])
    expect(await selected(page)).toEqual(['Welcome!'])
    await dialog.getByRole('button', { name: 'Done', exact: true }).click()
    await expect(dialog).toHaveCount(0)

    // The conversation box: Backspace and Delete edit the message.
    const box = conversation(page).getByRole('textbox', { name: 'Message Slatebox' })
    await box.click()
    await page.keyboard.type('Intake then Review')
    await page.keyboard.press('Backspace')
    await page.keyboard.press('Home')
    await page.keyboard.press('Delete')
    await expect(box).toHaveValue('ntake then Revie')
    // A starter fills the box and leaves the keyboard in it.
    await conversation(page).getByRole('button', { name: 'Build a workshop', exact: true }).click()
    await expect(box).toBeFocused()
    await page.keyboard.press('Backspace')
    await page.keyboard.press('Delete')

    await page.waitForTimeout(800)
    await expect(noteNamed(page, 'Welcome!')).toHaveCount(1)
    expect(await texts(page)).toEqual(['Welcome!'])
    expect(await selected(page)).toEqual(['Welcome!'])
  } finally { await removeTestGuest(page, id) }
})

test('Escape in an open menu or with the note pane open closes that, and only the next Escape clears the selection', async ({ page }) => {
  let id: string | null = null
  try {
    id = await openSlate(page)
    await select(page, 'Welcome!')

    // A menu opened with the mouse: Escape closes it and the note stays selected.
    await page.getByRole('button', { name: 'Board menu', exact: true }).click()
    const item = page.getByRole('menuitem', { name: 'Version history', exact: true })
    await expect(item).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(item).toBeHidden()
    expect(await selected(page), 'one press closed the menu and did nothing else').toEqual(['Welcome!'])
    // The menu gives the keyboard back, so the next Escape is the canvas's: it clears the selection.
    await expect.poll(() => keyboardAt(page)).toBe('nowhere')
    await page.keyboard.press('Escape')
    await expect.poll(() => selected(page)).toEqual([])
    expect(await texts(page)).toEqual(['Welcome!'])

    // The note pane after a swatch: Escape closes the pane and the note stays selected.
    await select(page, 'Welcome!')
    await openPane(page)
    await pickSwatch(page, 'Welcome!')
    await expect.poll(() => keyboardAt(page)).toBe('nowhere')
    await page.keyboard.press('Escape')
    await paneClosed(page)
    expect(await selected(page), 'one press closed the pane and did nothing else').toEqual(['Welcome!'])
    await page.keyboard.press('Escape')
    await expect.poll(() => selected(page)).toEqual([])
    expect(await texts(page)).toEqual(['Welcome!'])
  } finally { await removeTestGuest(page, id) }
})
