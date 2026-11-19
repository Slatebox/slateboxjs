import {expect,test} from '@playwright/test'

const origin=process.env.SLATEBOX_APP_URL || 'http://localhost:3000'
const writable=['localhost','127.0.0.1','test.slatebox.com'].includes(new URL(origin).hostname)

for(const width of [1360,390]) test('a '+width+'px native drawing gains a route and keeps its actual notes, edges and conversation',async({browser})=>{
  test.skip(!writable,'Creates an isolated guest and private board')
  const context=await browser.newContext({viewport:{width,height:844}})
  const page=await context.newPage()
  let uid='',key=''
  try {
    await page.goto(origin+'/new')
    await page.waitForURL(/\/canvas\/[a-zA-Z0-9]+$/)
    key=page.url().split('/').pop()!
    const read=()=>page.evaluate(async id=>(await (window as any).Meteor.callAsync('slates.get',{shareId:id})).slateBase,key)
    const chat=page.getByRole('complementary',{name:'Conversation with Slatebox'})
    await expect(chat).toBeVisible({timeout:20000})
    uid=await page.evaluate(()=>(window as any).Meteor.userId())
    await expect.poll(async()=>(await read())?.userId).toBe(uid)
    const original=await read()
    expect(original.options.isPrivate).toBe(true)
    const welcome=page.getByRole('dialog',{name:/welcome/i}).getByRole('button',{name:'OK',exact:true})
    if(await welcome.isVisible()) await welcome.click()
    const cookies=page.getByRole('button',{name:'Accept cookies'})
    if(await cookies.isVisible()) await cookies.click()
    const request='Intake → Review → Notify'
    await chat.getByRole('textbox').fill(request)
    await chat.getByRole('button',{name:'Preview changes'}).click()
    const keep=chat.getByRole('button',{name:'Keep changes'})
    await expect(keep).toBeVisible()
    expect((await read()).nodes).toEqual(original.nodes)
    await keep.click()
    await expect(chat.getByLabel('Kept conversation')).toContainText(request,{timeout:20000})
    const drawing=await read()
    const nodes=drawing.nodes.filter((n:any)=>n.options.id.startsWith('chat-'))
    expect(nodes.map((n:any)=>n.options.text)).toEqual(['Intake','Review','Notify'])
    expect(nodes[0].relationships.associations[0].childId).toBe(nodes[1].options.id)
    expect(nodes[1].relationships.associations[0].childId).toBe(nodes[2].options.id)
    await chat.getByRole('button',{name:'Add interactive behavior'}).click()
    await chat.getByRole('button',{name:'Preview changes'}).click()
    await expect(keep).toBeVisible()
    await keep.click()
    const viewDrawing=page.getByRole('button',{name:'View drawing'})
    await expect(viewDrawing).toBeVisible({timeout:20000})
    const dual=await read()
    expect(dual.nodes).toEqual(drawing.nodes)
    expect(dual.creative.model.workshop.lanes.map((lane:any)=>lane.label)).toEqual(['Intake','Review','Notify'])
    await viewDrawing.click()
    await expect(page.locator('#slateCanvas [data-node-id="'+nodes[0].options.id+'"]')).toBeVisible()
    const reopen=page.getByRole('button',{name:'Ask Slatebox'})
    if(await reopen.isVisible()) await reopen.click()
    await expect(chat.getByLabel('Kept conversation')).toContainText('Added a playable route')
  } finally {
    if(uid && key) {
      const clean=await context.newPage()
      await clean.goto(origin+'/plans')
      await clean.waitForFunction(user=>(window as any).Meteor?.userId()===user,uid)
      await clean.evaluate(()=>(window as any).Meteor.subscribe('me'))
      await clean.waitForFunction(()=>(window as any).Meteor.user()?.isAnonymous===true)
      expect(await clean.evaluate(async({uid,key})=>{
        const m=(window as any).Meteor
        const owner=m.user(),board=(await m.callAsync('slates.get',{shareId:key})).slateBase
        if(owner._id!==uid || !owner.isAnonymous || owner.orgId || board?.userId!==uid || !board.options.isPrivate) throw Error('Disposable fixture ownership mismatch')
        return m.callAsync('users.delete')
      },{uid,key})).toBe(true)
    }
    await context.close()
  }
})
