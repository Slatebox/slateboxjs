import {expect, test} from '@playwright/test'
import {dismissWelcome, getSlate, removeTestGuest, shareAs, userId} from './workshop-guests.shared'
import {card, conversation, dragCardNamed, standing, workshopReady} from './app-native-workshop.shared'

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')

test('the team’s brief becomes a private map with real playable choices that survive a read invitation', async ({browser}) => {
  test.skip(!['localhost','127.0.0.1','test.slatebox.com'].includes(origin.hostname),'Disposable local or staging source only.')
  const owner = await browser.newPage()
  const reader = await browser.newPage({viewport:{width:390,height:844}})
  const brief = 'Which materials should our night shift keep if the lighting rig fails during installation?'
  let id:string|null = null
  try {
    let entry = new URL('/new/map#' + new URLSearchParams({brief}), origin)
    const marketing = process.env.SLATEBOX_MARKETING_URL
    if (marketing) {
      await owner.goto(new URL('/use-cases/creative-handoffs/', marketing).href)
      await owner.getByRole('textbox',{name:'What handoff do you want to map?'}).fill(brief)
      // Capture the real top-level destination, including its browser-only
      // fragment, with no requests to production app or third-party services.
      await owner.route('https://app.slatebox.com/**', route => route.fulfill({contentType:'text/html',body:''}))
      await owner.getByRole('button',{name:'Open my private slate'}).click()
      await owner.waitForURL('https://app.slatebox.com/new/map#**')
      const handoff = new URL(owner.url())
      expect(new URLSearchParams(handoff.hash.slice(1)).get('brief')).toBe(brief)
      entry = new URL(handoff.pathname + handoff.search + handoff.hash, origin)
    }
    await owner.goto(entry.href)
    await owner.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
    id = await userId(owner)
    await dismissWelcome(owner)
    if (process.env.SLATEBOX_EXPECTED_APP_BUNDLE) await expect(owner.locator('script[src*="/' + process.env.SLATEBOX_EXPECTED_APP_BUNDLE + '.js"]')).toHaveCount(1)
    const key = new URL(owner.url()).pathname.split('/').pop()!
    const board = await getSlate(owner,key)
    expect(board.options.isPrivate).toBe(true)
    expect(board.userId).toBe(id)
    expect(board.creative.model.workshop.lanes[0].station.outcome).toBe(brief)
    await workshopReady(owner)
    await expect(standing(owner)).toContainText(brief)
    const chat = conversation(owner)
    await expect(chat.getByRole('log')).toContainText(brief)
    const input = chat.getByRole('textbox',{name:'Direct map edits'})
    await input.fill('Borrow work lights or bring battery lanterns')
    await input.press('Enter')
    // The proposal's two destinations are drawn on the canvas before anything is kept.
    await expect(owner.locator('#slateCanvas [data-node-id^="lane-"]').filter({hasText:'bring battery lanterns'})).toBeVisible()
    await expect(owner.locator('#slateCanvas [data-node-id^="lane-"]').filter({hasText:'Borrow work lights'})).toBeVisible()
    await chat.getByRole('button',{name:'Keep changes'}).click()
    const snapshot = () => getSlate(owner,key).then(s=>s.creative.model.workshop)
    await expect.poll(async()=>(await snapshot()).lanes.map((l:any)=>l.label).slice(1)).toEqual(['Borrow work lights','bring battery lanterns'])
    const invite = await shareAs(owner,'read')
    await reader.goto(invite.href)
    await dismissWelcome(reader)
    await workshopReady(reader)
    await expect(standing(reader)).toContainText(brief)
    await reader.getByRole('button',{name:'Present',exact:true}).click()
    const slides = reader.getByRole('region',{name:'Decision presentation'})
    await expect(slides).toContainText(brief)
    await slides.getByRole('button',{name:'Next station'}).click()
    await expect(slides.getByRole('heading',{name:'Borrow work lights',exact:true})).toBeVisible()
    await slides.getByRole('button',{name:'Back to board'}).click()
    expect(await userId(reader)).toBeNull()
    expect((await getSlate(reader,invite.pathname.split('/').pop()!)).creative.model.workshop).toEqual(await snapshot())
    await dragCardNamed(owner,'Team','bring battery lanterns')
    await expect.poll(async()=>{const map=await snapshot();return map.lanes.find((l:any)=>l.id===map.cards[0].laneId).label}).toBe('bring battery lanterns')
    await owner.reload()
    await workshopReady(owner)
    await expect(chat.getByRole('log')).toContainText(brief)
    await expect(standing(owner)).toContainText('Team · bring battery lanterns')
    await expect.poll(async()=>(await snapshot()).lanes[0].station.outcome).toEqual(brief)
  } finally {
    await reader.close()
    try {await removeTestGuest(owner,id)} finally {await owner.close()}
  }
})

test('the pilot budget shortcut opens a private playable allocation board', async ({page}) => {
  test.skip(!['localhost','127.0.0.1','test.slatebox.com'].includes(origin.hostname),'Disposable local or staging source only.')
  let id:string|null = null
  try {
    await page.goto(new URL('/new/pilot-budget',origin).href)
    await page.waitForURL(/\/canvas\/[a-f0-9]{10}$/)
    id = await userId(page)
    await dismissWelcome(page)
    const key = new URL(page.url()).pathname.split('/').pop()!
    const board = await getSlate(page,key)
    expect(board.options.isPrivate).toBe(true)
    expect(board.creative.model.workshop.experience.kind).toBe('experiment-budget')
    await workshopReady(page)
    await expect(card(page,'fund-1')).toBeVisible()
    await expect(card(page,'fund-1')).toHaveAttribute('aria-label','Second $200, in Unallocated')
  } finally { await removeTestGuest(page,id) }
})
