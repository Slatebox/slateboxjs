import { startAgentMap } from './map-conversation.shared'
import { dragCardNamed, workshopReady } from './app-native-workshop.shared'
// Restated (exec): the package's per-action `branch`, `share`, `unshare` and `read` commands and
// its map tools became scripts run by `slatebox exec` and the MCP `exec` tool. A script finds the
// station by its label, as the commands did. Same branch, same stale refusal, same replay, same
// assertions. New, deliberately: sharing and revoking are held for the person and saved when the
// run is confirmed.
import { randomUUID } from 'node:crypto'
import { expect, test } from '@playwright/test'
import { cliConfirmed, cliExec, cliResult, installedTools, lit, mcpExec } from './agent-exec.shared'
import { register, retire, type Actor } from './agent-principals.shared'
import { dismissWelcome, getSlate } from './workshop-guests.shared'

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
const installation = process.env.SLATEBOX_AGENT_TOOLS_DIR
test.use({actionTimeout:15000,trace:'off',video:'off',screenshot:'off'})

test('an invited teammate follows an agent-authored branch and presents its saved outcome',async({browser})=>{
  test.skip(!installation || !['localhost','127.0.0.1','test.slatebox.com'].includes(origin.hostname),'Requires a disposable app or staging; creates two registered principals.')
  const {Client,StdioClientTransport,cli,server}=installedTools(installation!)
  const owner:Actor={page:await browser.newPage(),id:null,email:'branch-owner-'+randomUUID()+'@qa.slatebox.invalid'}
  const peer:Actor={page:await browser.newPage({viewport:{width:390,height:844}}),id:null,email:'branch-reviewer-'+randomUUID()+'@qa.slatebox.invalid'}
  let mcp:InstanceType<typeof Client>|undefined
  let withdraw:(()=>Promise<void>)|undefined
  try {
    const board=await register(owner,'/new/map')
    await register(peer,'/new/map')
    expect(owner.id).not.toBe(peer.id)
    expect(await getSlate(peer.page,board)).toBeFalsy()
    const manager=await owner.page.evaluate(async ()=>(await (window as any).Meteor.callAsync('apiTokens.create',{
      name:'Native map authoring proof', scopes:['slates:read','slates:write','slates:share']
    })).token)
    const env={PATH:process.env.PATH!,SLATEBOX_BASE_URL:origin.origin,SLATEBOX_API_TOKEN:manager}
    mcp=new Client({name:'map-authoring-verification',version:'1'})
    await mcp.connect(new StdioClientTransport({command:process.execPath,args:[server],env,stderr:'ignore'}))
    const read=`return (await slatebox.slates.get({ shareId: ${lit(board)} })).workshop`
    // One map edit, its station found by label; expectedRevision is the read's unless given.
    const mapEdit=(kind:string,station:string,fields:object,{mode='save',revision}:{mode?:string,revision?:number}={})=>`const { workshop } = await slatebox.slates.get({ shareId: ${lit(board)} })
const station = workshop.lanes.find((lane) => lane.label === ${lit(station)})
return slatebox.slates.applyOperations({ shareId: ${lit(board)}, mode: ${lit(mode)}, plan: { message: "Map edit", operations: [{ kind: ${lit(kind)}, ${kind==='add_map_branch'?'fromStationId':'stationId'}: station.id, ...${lit(fields)}, expectedRevision: ${revision===undefined?'workshop.revision':String(revision)} }] } })`
    const native=async()=>(await getSlate(owner.page,board)).creative
    await startAgentMap(owner.page,origin,board)
    const original=await native()
    const label='Ask the account owner'
    const firstOutcome='The account owner confirms the buyer approved the charge.'
    const finalOutcome='Support can refund the charge once the buyer confirms.'
    const branchFields={label,outcome:firstOutcome}
    const preview=await cliResult(cli,env,mapEdit('add_map_branch','Next step',branchFields,{mode:'preview'}))
    const baseline=preview.workshop.revision
    expect(baseline).toBe(original.revision)
    expect(preview.report.addedBranches).toHaveLength(1)
    expect(preview.workshop.lanes.at(-1).outcome).toBe(firstOutcome)
    expect((await native()).model).toEqual(original.model)
    const invitation=(await cliConfirmed(cli,env,`return slatebox.slates.issueInvite({ shareId: ${lit(board)}, role: "edit" })`,['widens_access'],{key:randomUUID()})).result
    const revokeKey=randomUUID()
    withdraw=async()=>{
      const result=(await cliConfirmed(cli,env,`return slatebox.slates.revokeInvite({ shareId: ${lit(board)}, inviteId: ${lit(invitation.inviteId)} })`,['removes'],{key:revokeKey})).result
      expect(result.revoked).toBe(true)
    }
    const link=new URL(invitation.url)
    expect(link.origin).toBe(origin.origin)
    await peer.page.goto(link.href)
    await dismissWelcome(peer.page)
    const hash=process.env.SLATEBOX_EXPECTED_APP_BUNDLE
    if(hash)await expect(peer.page.locator('script[src*="/'+hash+'.js"]')).toHaveCount(1)
    await workshopReady(peer.page)
    await dragCardNamed(peer.page,'Token','Next step')
    await expect.poll(async()=>(await native()).revision).toBe(baseline+1)
    // The peer's change invalidates the original review; no partial station or edge is saved.
    const stale=await cliExec(cli,env,mapEdit('add_map_branch','Next step',branchFields,{revision:baseline}),{key:randomUUID()})
    expect(stale.exit).toBe(7)
    expect(stale.run.error!.status).toBe(409)
    expect((await native()).model.workshop.lanes).toEqual(original.model.workshop.lanes)
    const fresh=await cliResult(cli,env,mapEdit('add_map_branch','Next step',branchFields,{mode:'preview'})), key=randomUUID()
    const apply=mapEdit('add_map_branch','Next step',branchFields,{revision:fresh.workshop.revision})
    const saved=await cliResult(cli,env,apply,{key})
    const branch=saved.report.addedBranches[0]
    expect(saved.report.addedBranches).toEqual(fresh.report.addedBranches)
    expect(saved.workshop.lanes.find((lane:{id:string})=>lane.id===branch.fromStationId).next).toContain(branch.stationId)
    // The same run key replays the saved branch from MCP (calls[0] is the script's read).
    const replay=await mcpExec(mcp,apply,{idempotencyKey:key})
    expect(replay.status).toBe('completed')
    expect(replay.calls[1].replayed).toBe(true)
    expect(replay.result).toEqual(saved)
    const outcome=await mcpExec(mcp,mapEdit('update_map_outcome',label,{outcome:finalOutcome},{mode:'preview'}))
    expect(outcome.status).toBe('completed')
    expect((await native()).model.workshop.lanes.at(-1).station.outcome).toBe(firstOutcome)
    const updated=await mcpExec(mcp,mapEdit('update_map_outcome',label,{outcome:finalOutcome},{revision:outcome.result.workshop.revision}),{idempotencyKey:randomUUID()})
    expect(updated.result?.report.updatedOutcomes).toEqual([{stationId:branch.stationId}])
    await expect(peer.page.locator('[data-creative-revision]')).toHaveAttribute('data-creative-revision',String(updated.result.workshop.revision))
    await dragCardNamed(peer.page,'Token',label)
    await expect.poll(async()=>(await native()).model.workshop.cards[0].laneId).toBe(branch.stationId)
    await peer.page.reload()
    await dismissWelcome(peer.page)
    await peer.page.getByRole('button',{name:'Present',exact:true}).click()
    const deck=peer.page.getByRole('region',{name:'Decision presentation'})
    for(const name of ['Start','Next step']){
      await expect(deck.getByRole('heading',{name,exact:true})).toBeVisible()
      await deck.getByRole('button',{name:'Next station'}).click()
    }
    await expect(deck.getByRole('heading',{name:label,exact:true})).toBeVisible()
    await expect(deck.getByText(finalOutcome,{exact:true}).last()).toBeVisible()
    await expect(deck.getByRole('listitem')).toHaveText('Token')
    const latest=await cliResult(cli,env,read)
    expect(latest.cards[0].laneId).toBe(branch.stationId)
    expect(latest.lanes.filter((lane:{id:string})=>lane.id===branch.stationId)).toHaveLength(1)
    expect(latest.lanes.at(-1).outcome).toBe(finalOutcome)
    await withdraw()
    withdraw=undefined
  }finally{
    try{if(withdraw)await withdraw()}
    finally {
      try{if(mcp)await mcp.close();await Promise.all([retire(peer),retire(owner)])}
      finally{await Promise.all([peer.page.close(),owner.page.close()])}
    }
  }
})
