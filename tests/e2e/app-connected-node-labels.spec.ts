import {expect, test} from '@playwright/test'
import {openGuestCanvas} from './app-host.shared'
import {removeTestGuest} from './workshop-guests.shared'

let guestId: string | null = null

test.afterEach(async ({page}) => {
  await removeTestGuest(page, guestId)
  guestId = null
})

test('new connected nodes start blank and keep authored labels and edges through save and reopen', async ({page}) => {
  const origin = process.env.SLATEBOX_APP_URL || 'http://localhost:3000'
  await openGuestCanvas(page, origin)
  guestId = await page.evaluate(() => (window as any).Meteor.userId())
  expect(guestId).toBeTruthy()
  const parentId = 'label-proof-root'
  await page.evaluate(async id => {
    const board = (window as any).__slateboxInstances.find((s:any) => s.element.id === 'slateCanvas')
    const box = board.canvas.node.getBoundingClientRect()
    const x = 18000, y = 24000
    board.canvas.viewbox(x-box.width/2, y-box.height/2, box.width, box.height)
    const node = board.addNode({id,x,y,width:110,height:66,text:'Original observation',shape:'rectangle'})
    await node.ready
    board.selectNodes([node])
  }, parentId)
  const children: string[] = []
  for (const gesture of ['click', 'drag', 'keyboard']) {
    const direction = gesture === 'click' ? 'right' : 'left'
    await page.evaluate(id => {
      const board = (window as any).__slateboxInstances.find((s:any) => s.element.id === 'slateCanvas')
      board.clearSelection()
      board.selectNodes([board.nodes.one(id)])
    }, parentId)
    if (gesture === 'keyboard') {
      const source = page.locator('#slateCanvas').getByRole('button', {name:'Original observation', exact:true})
      await source.focus()
      await page.keyboard.press('Space')
      await page.keyboard.press('Tab')
      await expect(page.getByRole('button',{name:'Add connected note above',exact:true})).toBeFocused()
      await page.keyboard.press('Enter')
    } else {
      const {x,y} = await page.evaluate(({id, side}) => {
        const board = (window as any).__slateboxInstances.find((s:any) => s.element.id === 'slateCanvas')
        const handle = board.nodes.one(id).connectionHandles[side].node
        const rect = handle.getBoundingClientRect()
        const x = rect.x + rect.width / 2, y = rect.y + rect.height / 2
        if (document.elementFromPoint(x,y) !== handle) throw new Error('Source connector is obscured')
        return {x,y}
      }, {id:parentId,side:direction})
      if (gesture === 'click') await page.mouse.click(x,y)
      else {
        await page.mouse.move(x,y)
        await page.mouse.down()
        await page.mouse.move(x-165,y+85,{steps:14})
        await page.mouse.up()
      }
    }
    const outbound = () => page.evaluate(id => {
      const board = (window as any).__slateboxInstances.find((s:any) => s.element.id === 'slateCanvas')
      return board.nodes.one(id).relationships.getAssociations().map((edge:any) => edge.childId) as string[]
    }, parentId)
    await expect.poll(outbound).toHaveLength(children.length+1)
    const child = (await outbound()).find(id => !children.includes(id))!
    expect(child).toBeTruthy()
    children.push(child)
    const node = page.locator('#slateCanvas [data-node-id="' + child + '"]').first()
    await expect(node).toHaveAccessibleName('Unnamed node')
    await expect(node.locator('text').first()).toHaveText('')
    const exportedLabel = () => page.evaluate(id => {
      const board = (window as any).__slateboxInstances.find((s:any) => s.element.id === 'slateCanvas')
      return JSON.parse(board.exportJSON()).nodes.find((n:any) => n.options.id === id)?.options.text
    }, child)
    expect(await exportedLabel()).toBe('')
    if (gesture === 'keyboard') {
      await expect(node).toBeFocused()
    } else {
      await page.evaluate(id => {
        const board = (window as any).__slateboxInstances.find((s:any) => s.element.id === 'slateCanvas')
        board.selectNodes([board.nodes.one(id)])
      }, child)
    }
    await page.keyboard.press('F2')
    const editor = page.locator('#slateCanvas .sb-inline-editor')
    await editor.fill('Named with ' + gesture)
    await editor.press('Enter')
    await expect.poll(exportedLabel).toBe('Named with ' + gesture)
  }
  const expected = ['Named with click', 'Named with drag', 'Named with keyboard']
  await expect.poll(() => page.evaluate(async ids => {
    const response = await (window as any).Meteor.callAsync('slates.get',{shareId:location.pathname.split('/').pop()})
    return ids.map(id => response.slateBase?.nodes?.find((n:any) => n.options.id === id)?.options.text)
  }, children), {timeout:25000}).toEqual(expected)
  await page.reload()
  await page.locator('#slateCanvas').getByRole('button', {name:'Original observation', exact:true}).waitFor()
  for (const [index,id] of children.entries()) {
    const node = page.locator('#slateCanvas [data-node-id="' + id + '"]').first()
    await expect(node).toHaveAttribute('aria-label', expected[index])
    // SVG wraps each line in its own tspan; textContent omits the visual line break.
    const lines = node.locator('text').first().locator('tspan')
    await expect.poll(async () => (await lines.allTextContents()).join(' ')).toBe(expected[index])
  }
  const endpoints = await page.evaluate(id => {
    const board = (window as any).__slateboxInstances.find((s:any) => s.element.id === 'slateCanvas')
    return board.nodes.one(id).relationships.getAssociations().map((e:any) => [e.parentId,e.childId]).sort()
  }, parentId)
  expect(endpoints).toEqual(children.map(id=>[parentId,id]).sort())
})
