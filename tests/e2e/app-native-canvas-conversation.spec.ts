import {expect,test,type Locator} from '@playwright/test'
import {dismissWelcome, removeTestGuest, shareAs, userId} from './workshop-guests.shared'
import {conversation, lane, messageBox, note, openConversation, starter, workshopReady} from './app-native-workshop.shared'

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
    // The route is added to the same slate. Its canvas now shows the drawing and, beside it, the playable route.
    // Keeping reloads the page. A read that lands in the middle of that reload is asked again.
    await expect.poll(async()=>Boolean((await read().catch(()=>null))?.creative),{timeout:20000}).toBe(true)
    await workshopReady(page)
    await expect(page.getByRole('button',{name:/View drawing|Open workshop|Play interactive route/})).toHaveCount(0)
    expect(new URL(page.url()).search).toBe('')
    const dual=await read()
    expect(dual.nodes).toEqual(drawing.nodes)
    expect(dual.creative.model.workshop.lanes.map((lane:any)=>lane.label)).toEqual(['Intake','Review','Notify'])
    for(const kept of nodes) { await expect(note(page,kept.options.id)).toBeVisible(); await expect(note(page,kept.options.id)).toContainText(kept.options.text) }
    const edge=(id:string)=>page.evaluate(key=>{const o=(window as any).slate.v2.nodes.one(key).options;return {left:o.x as number,right:(o.x as number)+(o.width as number)}},id)
    const drawingRight=Math.max(...await Promise.all(dual.nodes.map(async(n:any)=>(await edge(n.options.id)).right)))
    for(const station of dual.creative.model.workshop.lanes) expect((await edge('column-'+station.id)).left).toBeGreaterThan(drawingRight)
    await expect(lane(page,dual.creative.model.workshop.lanes[0].id)).toContainText('Intake')
    // One conversation: what was kept while the slate was only a drawing is still in it.
    await openConversation(page)
    await expect(chat.getByRole('log')).toContainText(request)
    await expect(chat.getByRole('log')).toContainText('Added a playable route')
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

test('a drawing converted to a workshop shows both on one canvas and leaves its guest invitation reachable',async({browser})=>{
  test.skip(!writable,'Uses disposable guests on a local or staging deployment')
  const context=await browser.newContext()
  const owner=await context.newPage()
  let ownerId:string|null=null
  const reachable=async(control:Locator)=>{
    await expect(control).toBeInViewport()
    await expect.poll(()=>control.evaluate(el=>{
      const r=el.getBoundingClientRect()
      return el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2))
    })).toBe(true)
  }
  try {
    await owner.goto(origin+'/new')
    await owner.waitForURL(/\/canvas\/[a-zA-Z0-9]+$/)
    await expect.poll(()=>userId(owner)).toBeTruthy()
    ownerId=await userId(owner)
    await dismissWelcome(owner)
    const chat=owner.getByRole('complementary',{name:'Conversation with Slatebox'})
    await chat.getByRole('textbox').fill('Make a workshop with Pitches, Record on Friday and Archive, limit Record on Friday to one card')
    await chat.getByRole('button',{name:'Preview changes'}).click()
    await chat.getByRole('button',{name:'Keep changes'}).click()
    await workshopReady(owner)
    await expect(owner.getByRole('button',{name:/View drawing|Open workshop/})).toHaveCount(0)
    const drawn=await owner.evaluate(()=>JSON.parse((window as any).slate.exportJSON()).nodes.map((n:any)=>n.options.id as string))
    expect(drawn.length).toBeGreaterThan(0)
    const invite=await shareAs(owner,'edit')
    for(const width of [320,390,1360]){
      const phone=width<500
      const peerContext=await browser.newContext({viewport:{width,height:844},hasTouch:phone})
      const peer=await peerContext.newPage()
      let peerId:string|null=null
      try {
        await peer.goto(invite.href)
        const stamp=process.env.SLATEBOX_EXPECTED_APP_BUNDLE
        if(stamp) await expect(peer.locator('script[src*="/'+stamp+'.js"]')).toHaveCount(1)
        await dismissWelcome(peer)
        await workshopReady(peer)
        const join=peer.getByRole('button',{name:'Join to edit',exact:true})
        await reachable(join)
        // The drawing and the workshop are on the one canvas; there is no switch between them.
        await expect(peer.getByRole('button',{name:/View drawing|Open workshop/})).toHaveCount(0)
        for(const id of drawn) await expect(note(peer,id)).toBeVisible()
        await expect(peer.locator('#slateCanvas [data-node-id^="lane-"]')).toHaveCount(3)
        // Join is reached with the keyboard alone: Tab from the top of the page arrives at it.
        await peer.evaluate(()=>{(document.activeElement as HTMLElement|null)?.blur?.();window.scrollTo(0,0)})
        let tabs=0
        while(tabs<80 && !await join.evaluate(button=>button===document.activeElement)) { await peer.keyboard.press('Tab'); tabs++ }
        await expect(join).toBeFocused()
        expect(tabs).toBeGreaterThan(0)
        expect(await userId(peer)).toBeNull()
        if(phone) await join.tap()
        else await peer.keyboard.press('Enter')
        await expect.poll(()=>userId(peer)).toBeTruthy()
        peerId=await userId(peer)
        expect(peerId).not.toBe(ownerId)
        // Joined, the peer has the slate's conversation: beside a wide canvas, one tap away on a phone.
        const ask=peer.getByRole('button',{name:'Ask Slatebox',exact:true})
        if(phone) { await reachable(ask); await ask.tap() }
        await expect(messageBox(peer)).toBeVisible()
        await expect(starter(peer,/^Let .+ hold two cards$/)).toBeVisible()
        await expect(peer).toHaveURL(invite.href)
        await expect(peer.locator('#slateCanvas [data-node-id^="lane-"]')).toHaveCount(3)
        for(const id of drawn) await expect(note(peer,id)).toBeVisible()
        await expect(join).toHaveCount(0)
        expect(await userId(peer)).toBe(peerId)
      } finally {
        try{await removeTestGuest(peer,peerId)}
        finally{await peerContext.close()}
      }
    }
  } finally {
    try{await removeTestGuest(owner,ownerId)}
    finally{await context.close()}
  }
})
