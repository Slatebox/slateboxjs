import {expect, test} from '@playwright/test'
import {dismissWelcome, getSlate, removeTestGuest, shareAs, userId} from './workshop-guests.shared'

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')

test('the team’s brief becomes a private map with real playable choices that survive a read invitation', async ({browser}) => {
  test.skip(!['localhost','127.0.0.1','test.slatebox.com'].includes(origin.hostname),'Disposable local or staging source only.')
  const owner = await browser.newPage()
  const reader = await browser.newPage({viewport:{width:390,height:844}})
  const brief = 'Which materials should our night shift keep if the lighting rig fails during installation?'
  let id:string|null = null
  try {
    await owner.goto(new URL('/new/map#' + new URLSearchParams({brief}), origin).href)
    await owner.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
    id = await userId(owner)
    await dismissWelcome(owner)
    const key = new URL(owner.url()).pathname.split('/').pop()!
    const board = await getSlate(owner,key)
    expect(board.options.isPrivate).toBe(true)
    expect(board.userId).toBe(id)
    expect(board.creative.model.workshop.lanes[0].station.outcome).toBe(brief)
    await expect(owner.locator('.map-stage')).toContainText(brief)
    const chat = owner.getByRole('complementary',{name:'Map conversation'})
    await expect(chat.getByRole('log')).toContainText(brief)
    const input = chat.getByRole('textbox',{name:'Direct map edits'})
    await input.fill('Borrow work lights or bring battery lanterns')
    await input.press('Enter')
    await expect(owner.getByRole('button',{name:'Team → bring battery lanterns'})).toBeVisible()
    await chat.getByRole('button',{name:'Keep changes'}).click()
    const snapshot = () => getSlate(owner,key).then(s=>s.creative.model.workshop)
    await expect.poll(async()=>(await snapshot()).lanes.map((l:any)=>l.label).slice(1)).toEqual(['Borrow work lights','bring battery lanterns'])
    const invite = await shareAs(owner,'read')
    await reader.goto(invite.href)
    await dismissWelcome(reader)
    await expect(reader.locator('.map-stage')).toContainText(brief)
    expect(await userId(reader)).toBeNull()
    expect((await getSlate(reader,invite.pathname.split('/').pop()!)).creative.model.workshop).toEqual(await snapshot())
    await owner.getByRole('button',{name:'Team → bring battery lanterns'}).click()
    await owner.reload()
    await expect(chat.getByRole('log')).toContainText(brief)
    await expect(owner.locator('.map-stage')).toContainText('Team · bring battery lanterns')
    await expect.poll(async()=>(await snapshot()).lanes[0].station.outcome).toEqual(brief)
  } finally {
    await reader.close()
    try {await removeTestGuest(owner,id)} finally {await owner.close()}
  }
})
