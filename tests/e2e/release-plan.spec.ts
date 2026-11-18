import { expect, test } from '@playwright/test'

test('Friday previews the prerequisite and budget before committing, then reopens as a native slate', async ({page}) => {
  await page.goto('/tests/fixtures/release-plan.html')
  const capacity = page.getByLabel('Friday release capacity')
  const dependency = page.getByRole('region', {name:'Feature dependencies'})
  const intent = page.getByLabel('Last move intent')
  const guard = page.locator('#choice-guardrails')
  const origin = await guard.boundingBox()
  const target = await page.locator('#choice-billing').boundingBox()
  async function dragFriday() {
    const ticket = await page.locator('#choice-invite').boundingBox()
    await page.mouse.move(ticket!.x + 30, ticket!.y + 20); await page.mouse.down()
    // Guardrails and its dependent occupy the first two rows of Friday's candidate state.
    await page.mouse.move(target!.x + 30, target!.y + 88 + 20, {steps:20})
    await expect(capacity).toHaveText('8 / 8 points')
    await expect(dependency).toContainText('Permission checks · Friday release')
    await expect.poll(async () => (await guard.boundingBox())!.x).toBeCloseTo(target!.x, 0)
    await expect(intent).toBeEmpty()
  }
  await dragFriday(); await page.keyboard.press('Escape'); await page.mouse.up()
  await expect(capacity).toHaveText('3 / 8 points')
  await expect(dependency).toContainText('Permission checks · Next week')
  await expect.poll(async () => (await guard.boundingBox())!.x).toBeCloseTo(origin!.x, 0)
  await dragFriday(); await page.mouse.up()
  await expect(intent).toHaveText('invite to friday')
  await page.getByRole('button', {name:'Undo move'}).click()
  await expect(capacity).toHaveText('3 / 8 points')

  await page.getByLabel('Feature', {exact:true}).selectOption('invite')
  await page.getByRole('button',{name:'Preview Friday release'}).press('Enter')
  await expect(capacity).toHaveText('8 / 8 points')
  await page.getByRole('button',{name:'Cancel preview'}).press('Enter')
  await expect(capacity).toHaveText('3 / 8 points')
  await page.getByRole('button',{name:'Preview Friday release'}).press('Enter')
  await page.getByRole('button',{name:'Apply move'}).press('Enter')
  await expect(intent).toHaveText('invite to friday')
  await page.reload()
  await expect(capacity).toHaveText('8 / 8 points')
  await page.getByRole('button',{name:'Open presentation artwork'}).click()
  await expect(page.locator('#slate [data-node-id="card-invite"]')).toContainText('Team invitations')
  await expect(page.locator('#slate [data-node-id="lane-friday"]')).toContainText('8 / 8 points')
})

test('a 24-feature plan previews a two-card dependency move within one second of reaching the target', async ({page}) => {
  const lanes = Array.from({length:5}, (_, i) => ({id:'w' + i, label:'Week ' + (i + 1), capacity:24}))
  const cards = Array.from({length:24}, (_, i) => ({
    id:'f' + i, label:'Feature ' + i, points:1, laneId:'w' + (i % 5),
    ...(i === 23 ? {dependsOn:['f1']} : {}),
  }))
  await page.addInitScript(model => sessionStorage.setItem('plan', JSON.stringify(model)),
    {version:1, kind:'release-plan', title:'Portfolio release', lanes, cards})
  await page.goto('/tests/fixtures/release-plan.html')
  const source = await page.locator('#choice-f23').boundingBox()
  const lane = await page.locator('#choice-f0').boundingBox()
  const x = lane!.x + 25, y = lane!.y + 6 * 88 + 20
  await page.mouse.move(source!.x + 25, source!.y + 20)
  await page.mouse.down()
  // Register before the target event and stop at the painted readout.
  await page.evaluate(() => {
    const signal = document.querySelector('output[aria-label="Week 1 capacity"]')!
    const result = new Promise<number>(resolve => {
      const start = performance.now()
      const observe = new MutationObserver(() => {
        if (signal.textContent !== '7 / 24 points') return
        observe.disconnect()
        requestAnimationFrame(() => resolve(performance.now() - start))
      })
      observe.observe(signal, {subtree:true, childList:true, characterData:true})
    })
    Object.assign(window, {releasePreviewTime:result})
  })
  await page.mouse.move(x, y, {steps:3})
  await expect(page.getByLabel('Week 1 capacity')).toHaveText('7 / 24 points')
  const elapsed = await page.evaluate(() => (window as unknown as {releasePreviewTime:Promise<number>}).releasePreviewTime)
  expect(elapsed).toBeLessThan(1000)
  await page.mouse.up()
  await expect(page.getByLabel('Last move intent')).toHaveText('f23 to w0')
})
