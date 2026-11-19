import { startAgentMap } from './map-conversation.shared'
import { execFile } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { promisify } from 'node:util'
import { expect, firefox, test } from '@playwright/test'
import { register, retire, type Actor } from './agent-principals.shared'
import { dismissWelcome, getSlate } from './workshop-guests.shared'
import { expectWorkshopSlide } from './workshop-slide.shared'
import { dragCardNamed } from './app-native-workshop.shared'

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
const installation = process.env.SLATEBOX_AGENT_TOOLS_DIR
test.use({trace:'off',video:'off',screenshot:'off'})
test('an agent orders the scenes that an invited reader actually presents', async ({ browser }) => {
  test.skip(!installation || !['localhost','127.0.0.1','test.slatebox.com'].includes(origin.hostname),'Requires a disposable local/staging owner.')
  const readerBrowser = await firefox.launch()
  const reader = await readerBrowser.newPage({viewport:{width:390,height:844}})
  const owner:Actor = {page:await browser.newPage(),id:null,email:'scene-owner-'+randomUUID()+'@qa.slatebox.invalid'}
  const tools = createRequire(resolve(installation!,'package.json'))
  const manifest = tools('./package.json')
  const {Client} = tools('@modelcontextprotocol/sdk/client/index.js')
  const {StdioClientTransport} = tools('@modelcontextprotocol/sdk/client/stdio.js')
  let mcp:InstanceType<typeof Client>|undefined
  let withdraw:(()=>Promise<unknown>)|undefined
  try {
    const board = await register(owner,'/new/map')
    const token = await owner.page.evaluate(async () => (await (window as any).Meteor.callAsync('apiTokens.create',{
      name:'Workshop presentation order fixture',scopes:['slates:read','slates:write','slates:share']
    })).token)
    const env = {PATH:process.env.PATH!,SLATEBOX_BASE_URL:origin.origin,SLATEBOX_API_TOKEN:token}
    const cli = async (...args:string[]) => JSON.parse((await promisify(execFile)(process.execPath,[
      resolve(installation!,manifest.bin.slatebox),...args
    ],{env})).stdout)
    mcp = new Client({name:'map-presentation-test',version:'1'})
    await mcp.connect(new StdioClientTransport({command:process.execPath,args:[resolve(installation!,manifest.bin['slatebox-mcp'])],env,stderr:'ignore'}))

    const order = ['next','start']
    await startAgentMap(owner.page,origin,board)
    const initial = (await cli('read',board)).summary.workshop
    const preview = () => cli('order',board,'Next step','Start')
    const before = await preview()
    expect(before.report.presentationOrder).toEqual(order)
    expect((await cli('read',board)).summary.workshop).toEqual(initial)

    // An ordinary canvas edit after preview must invalidate the prepared save.
    await dragCardNamed(owner.page,'Token','Next step')
    await expect.poll(async () => (await getSlate(owner.page,board)).creative.revision).toBe(initial.revision+1)
    const apply = (rev:number,key:string) => cli('order',board,...order,'--apply','--revision',String(rev),'--idempotency-key',key)
    let stale = false
    try { await apply(initial.revision,randomUUID()) }
    catch(error){ stale=/HTTP 409/.test((error as {stderr:string}).stderr) }
    expect(stale).toBe(true)
    const fresh = await preview(), key = randomUUID()
    const saved = await apply(fresh.workshop.revision,key)
    expect(saved.report.presentationOrder).toEqual(order)
    const replay = await mcp.callTool({name:'set_presentation_order',arguments:{
      share_id:board,scenes:order,expected_revision:fresh.workshop.revision,dry_run:false,idempotency_key:key
    }})
    expect(replay.structuredContent).toEqual(saved)
    const invite = await cli('share',board,'--role','read','--idempotency-key',randomUUID())
    const revokeKey = randomUUID()
    withdraw = () => cli('unshare',board,'--invite-id',invite.inviteId,'--idempotency-key',revokeKey)
    expect(new URL(invite.url).origin).toBe(origin.origin)
    await reader.goto(invite.url)
    await dismissWelcome(reader)
    const hash = process.env.SLATEBOX_EXPECTED_APP_BUNDLE
    if (hash) await expect(reader.locator('script[src*="/'+hash+'.js"]')).toHaveCount(1)
    await expect(reader.getByRole('button',{name:'Edit an object'})).toHaveCount(0)
    const tokenId = initial.cards[0].id
    const deck = reader.getByRole('region',{name:'Decision presentation'})
    await owner.page.getByRole('button',{name:'Present together',exact:true}).click()
    await reader.getByRole('button',{name:'Follow presentation',exact:true}).click()
    await expectWorkshopSlide(reader,'Next step',['Token'],['lane-next','card-'+tokenId])
    await expect(reader.getByRole('button',{name:'Next station'})).toHaveCount(0)
    await owner.page.getByRole('button',{name:'Next station'}).click()
    await expectWorkshopSlide(reader,'Start',[],['lane-start'])
    await reader.reload()
    await reader.waitForFunction(()=> (window as any).Meteor?.status()?.connected)
    await reader.locator('[data-creative-revision]').waitFor({state:'attached'})
    await expectWorkshopSlide(reader,'Start',[],['lane-start'])
    await owner.page.getByRole('button',{name:'Previous',exact:true}).click()
    await expectWorkshopSlide(reader,'Next step',['Token'],['lane-next','card-'+tokenId])
    await owner.page.getByRole('button',{name:'End presentation',exact:true}).click()
    await expect(deck).toHaveCount(0)
    await reader.getByRole('button',{name:'Present',exact:true}).click()
    await expectWorkshopSlide(reader,'Next step',['Token'],['lane-next','card-'+tokenId])
    await deck.getByRole('button',{name:'Next station'}).click()
    await expectWorkshopSlide(reader,'Start',[],['lane-start'])
    await deck.getByRole('button',{name:/previous/i}).click()
    await expectWorkshopSlide(reader,'Next step',['Token'],['lane-next','card-'+tokenId])
    await deck.getByRole('button',{name:'Back to board'}).click()
    const outcome = 'The account owner has confirmed the payment.'
    const edit = await cli('outcome',board,'Next step',outcome)
    await cli('outcome',board,'Next step',outcome,'--apply','--revision',String(edit.workshop.revision),'--idempotency-key',randomUUID())
    await reader.reload()
    await dismissWelcome(reader)
    await reader.getByRole('button',{name:'Present',exact:true}).click()
    await expectWorkshopSlide(reader,'Next step',['Token'],['lane-next','card-'+tokenId])
    await expect(deck.getByText(outcome,{exact:true}).last()).toBeVisible()
    const actual = (await cli('read',board)).summary.workshop
    expect(actual.presentationOrder).toEqual(order)
    expect(actual.lanes.map((x:{id:string})=>x.id)).toEqual(initial.lanes.map((x:{id:string})=>x.id))
    expect(await reader.evaluate(()=>(window as any).Meteor.userId())).toBeNull()
  } finally {
    try { if(withdraw)await withdraw() }
    finally {
      try { if(mcp)await mcp.close(); await retire(owner) }
      finally { await owner.page.close(); await readerBrowser.close() }
    }
  }
})
