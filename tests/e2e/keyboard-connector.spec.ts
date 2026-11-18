import {expect, test, type Page} from '@playwright/test'

async function openBoard(page: Page, permission = 'edit') {
  await page.goto('/test.html')
  await page.evaluate(async permission => {
    const {Slate} = await import('/src/index.ts')
    const host = document.createElement('div')
    host.style.cssText = 'width:650px;height:400px;position:fixed;top:0;left:0;background:white'
    const after = document.createElement('input')
    after.setAttribute('aria-label','After canvas')
    document.body.replaceChildren(host, after)
    const board = new Slate(host, { viewPort:{ originalWidth:650, originalHeight:400 }, showBirdsEye:false, showZoom:false, showMultiSelect:false,
      events: { isReadOnly:()=>permission === 'read', isCommentOnly:()=>permission === 'comment' } })
    ;(window as any).keyBoard = board
    const first = board.addNode({id:'root', x:145, y:165, width:100, height:65, text:'Source note',isLocked:permission === 'locked'})
    const second = board.addNode({id:'other',x:300,y:150,width:100,height:65,text:'Another note'})
    await Promise.all([first.ready,second.ready])
  },permission)
}
const labels = ['Add connected note above', 'Add connected note to the right', 'Add connected note below', 'Add connected note to the left']

test('selected connectors have labels, keyboard focus and a way back to the page', async ({page})=>{
  await openBoard(page)
  const source = page.getByRole('button',{name:'Source note'})
  await source.focus()
  await page.keyboard.press('Tab')
  const sibling = page.getByRole('button',{name:'Another note'})
  await expect(sibling).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(source).toBeFocused()
  await page.keyboard.press('Space')
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button',{name:labels[0]})).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(source).toBeFocused()
  await page.evaluate(()=>(window as any).keyBoard.zoom(0.7))
  for (const label of labels) {
    await page.keyboard.press('Tab')
    const control = page.getByRole('button',{name:label})
    await expect(control).toBeFocused()
    await expect(control).toHaveCSS('stroke','rgb(25, 43, 48)')
    await expect(control).toHaveCSS('vector-effect','non-scaling-stroke')
    await expect(control).toHaveCSS('outline-style','solid')
  }
  await page.keyboard.press('Tab')
  await expect(sibling).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('textbox',{name:'After canvas'})).toBeFocused()
  await source.focus()
  await page.keyboard.press('Tab')
  await page.keyboard.press('Escape')
  await expect(source).toBeFocused()
  await expect(page.getByRole('button',{name:/Add connected note/})).toHaveCount(0)
})

for (const [index, key] of ['Enter','Space'].entries()) {
  test(key+' creates exactly one focused blank child and F2 names it', async ({page})=>{
    await openBoard(page)
    const initial = await page.evaluate(()=>{
      const board=(window as any).keyBoard
      return board.canvas.node.getAttribute('viewBox')
    })
    if (key === 'Space') await page.evaluate(()=>(window as any).keyBoard.getNode('root').position(530, 150))
    await page.getByRole('button',{name:'Source note'}).focus()
    await page.keyboard.press('Space')
    for(let position=0;position<=index;position++) await page.keyboard.press('Tab')
    await expect(page.getByRole('button',{name:labels[index]})).toBeFocused()
    await page.keyboard.down(key)
    await page.keyboard.down(key) // repeat after creation must not create another note or start editing
    await page.keyboard.up(key)
    const child = page.getByRole('button',{name:'Unnamed node',exact:true})
    await expect(child).toBeFocused()
    const view = await page.evaluate(()=>(window as any).keyBoard.canvas.node.getAttribute('viewBox'))
    if (key === 'Space') expect(view).not.toEqual(initial)
    else expect(view).toEqual(initial)
    await expect(page.locator('.sb-inline-editor')).toHaveCount(0)
    await expect(child.locator('text').first()).toHaveText('')
    await page.keyboard.press('F2')
    const editor = page.locator('.sb-inline-editor')
    const bounds = await editor.boundingBox()
    const canvas = await page.locator('svg').first().boundingBox()
    expect(bounds).toBeTruthy()
    expect(bounds!.x).toBeGreaterThanOrEqual(canvas!.x)
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(canvas!.x + canvas!.width + 1)
    expect(bounds!.y).toBeGreaterThanOrEqual(canvas!.y)
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(canvas!.y + canvas!.height + 1)
    await editor.fill('Field recording')
    await editor.press('Enter')
    await expect(page.getByRole('button',{name:'Field recording',exact:true})).toBeVisible()
    await expect.poll(()=>page.evaluate(()=>{
      const board=(window as any).keyBoard
      const nodes=JSON.parse(board.exportJSON()).nodes
      const root=nodes.find((n:any)=>n.options.id==='root')
      const child=nodes.find((n:any)=>n.options.text==='Field recording')
      return [nodes.length, root.relationships.associations.map((edge:any)=>[edge.parentId,edge.childId===child?.options.id])]
    })).toEqual([3,[['root',true]]])
  })
}
for (const mode of ['read','comment','locked']) {
  test(mode+' notes do not offer keyboard connectors',async ({page})=>{
    await openBoard(page,mode)
    const node=page.getByRole('button',{name:'Source note'})
    await node.focus()
    await page.keyboard.press('Space')
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button',{name:/Add connected note/})).toHaveCount(0)
    await expect(page.locator('g[data-node-id]')).toHaveCount(2)
  })
}
