// Restated (exec): the package's per-action `read`, `order`, `outcome`, `share` and `unshare`
// commands and its map tools became scripts run by `slatebox exec` and the MCP `exec` tool; a
// script names scenes by label or id, as the commands did. Same order, same stale refusal, same
// replay, same presentation. New, deliberately: sharing and revoking are held for the person and
// saved when the run is confirmed.
import { startAgentMap } from './map-conversation.shared'
import { presentToEveryone } from './app-header.shared'
import { randomUUID } from 'node:crypto'
import { expect, firefox, test } from '@playwright/test'
import { cliConfirmed, cliExec, cliResult, installedTools, lit, mcpExec } from './agent-exec.shared'
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
  const {Client,StdioClientTransport,cli,server} = installedTools(installation!)
  let mcp:InstanceType<typeof Client>|undefined
  let withdraw:(()=>Promise<unknown>)|undefined
  try {
    const board = await register(owner,'/new/map')
    const token = await owner.page.evaluate(async () => (await (window as any).Meteor.callAsync('apiTokens.create',{
      name:'Workshop presentation order fixture',scopes:['slates:read','slates:write','slates:share']
    })).token)
    const env = {PATH:process.env.PATH!,SLATEBOX_BASE_URL:origin.origin,SLATEBOX_API_TOKEN:token}
    mcp = new Client({name:'map-presentation-test',version:'1'})
    await mcp.connect(new StdioClientTransport({command:process.execPath,args:[server],env,stderr:'ignore'}))
    const read = async () => cliResult(cli,env,`return (await slatebox.slates.get({ shareId: ${lit(board)} })).workshop`)
    // One map edit on scenes named by label or id; expectedRevision is the read's unless given.
    const mapEdit = (operation:string,{mode='save',revision}:{mode?:string,revision?:number}={}) => `const { workshop } = await slatebox.slates.get({ shareId: ${lit(board)} })
const scene = (name) => workshop.lanes.find((lane) => lane.label === name || lane.id === name).id
return slatebox.slates.applyOperations({ shareId: ${lit(board)}, mode: ${lit(mode)}, plan: { message: "Map edit", operations: [{ ${operation}, expectedRevision: ${revision===undefined?'workshop.revision':String(revision)} }] } })`
    const ordering = (names:string[]) => `kind: "set_presentation_order", laneIds: ${lit(names)}.map(scene)`

    const order = ['next','start']
    await startAgentMap(owner.page,origin,board)
    const initial = await read()
    const preview = () => cliResult(cli,env,mapEdit(ordering(['Next step','Start']),{mode:'preview'}))
    const before = await preview()
    expect(before.report.presentationOrder).toEqual(order)
    expect(await read()).toEqual(initial)

    // An ordinary canvas edit after preview must invalidate the prepared save.
    await dragCardNamed(owner.page,'Token','Next step')
    await expect.poll(async () => (await getSlate(owner.page,board)).creative.revision).toBe(initial.revision+1)
    const apply = (rev:number) => mapEdit(ordering(order),{revision:rev})
    const stale = await cliExec(cli,env,apply(initial.revision),{key:randomUUID()})
    expect(stale.exit).toBe(7)
    expect(stale.run.error!.status).toBe(409)
    const fresh = await preview(), key = randomUUID()
    const saved = await cliResult(cli,env,apply(fresh.workshop.revision),{key})
    expect(saved.report.presentationOrder).toEqual(order)
    // The same run key replays the saved order from MCP (calls[0] is the script's read).
    const replay = await mcpExec(mcp,apply(fresh.workshop.revision),{idempotencyKey:key})
    expect(replay.calls[1].replayed).toBe(true)
    expect(replay.result).toEqual(saved)
    const invite = (await cliConfirmed(cli,env,`return slatebox.slates.issueInvite({ shareId: ${lit(board)}, role: "read" })`,['widens_access'],{key:randomUUID()})).result
    const revokeKey = randomUUID()
    withdraw = () => cliConfirmed(cli,env,`return slatebox.slates.revokeInvite({ shareId: ${lit(board)}, inviteId: ${lit(invite.inviteId)} })`,['removes'],{key:revokeKey})
    expect(new URL(invite.url).origin).toBe(origin.origin)
    await reader.goto(invite.url)
    await dismissWelcome(reader)
    const hash = process.env.SLATEBOX_EXPECTED_APP_BUNDLE
    if (hash) await expect(reader.locator('script[src*="/'+hash+'.js"]')).toHaveCount(1)
    await expect(reader.getByRole('button',{name:'Edit an object'})).toHaveCount(0)
    const tokenId = initial.cards[0].id
    const deck = reader.getByRole('region',{name:'Decision presentation'})
    await presentToEveryone(owner.page)
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
    const outcomeEdit = `kind: "update_map_outcome", stationId: scene("Next step"), outcome: ${lit(outcome)}`
    const edit = await cliResult(cli,env,mapEdit(outcomeEdit,{mode:'preview'}))
    await cliResult(cli,env,mapEdit(outcomeEdit,{revision:edit.workshop.revision}),{key:randomUUID()})
    await reader.reload()
    await dismissWelcome(reader)
    await reader.getByRole('button',{name:'Present',exact:true}).click()
    await expectWorkshopSlide(reader,'Next step',['Token'],['lane-next','card-'+tokenId])
    await expect(deck.getByText(outcome,{exact:true}).last()).toBeVisible()
    const actual = await read()
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
