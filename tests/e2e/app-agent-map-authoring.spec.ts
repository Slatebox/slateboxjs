import { startAgentMap } from './map-conversation.shared'
import { execFile } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { promisify } from 'node:util'
import { expect, test } from '@playwright/test'
import { register, retire, type Actor } from './agent-principals.shared'
import { dismissWelcome, getSlate } from './workshop-guests.shared'

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
const installation = process.env.SLATEBOX_AGENT_TOOLS_DIR
test.use({actionTimeout:15000,trace:'off',video:'off',screenshot:'off'})

test('an invited teammate follows an agent-authored branch and presents its saved outcome',async({browser})=>{
  test.skip(!installation || !['localhost','127.0.0.1','test.slatebox.com'].includes(origin.hostname),'Requires a disposable app or staging; creates two registered principals.')
  const tools=createRequire(resolve(installation!,'package.json'))
  const manifest=tools('./package.json')
  const {Client}=tools('@modelcontextprotocol/sdk/client/index.js')
  const {StdioClientTransport}=tools('@modelcontextprotocol/sdk/client/stdio.js')
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
    const command=(...args:string[])=>promisify(execFile)(process.execPath,[resolve(installation!,manifest.bin.slatebox),...args],{env})
    const cli=async(...args:string[])=>JSON.parse((await command(...args)).stdout)
    mcp=new Client({name:'map-authoring-verification',version:'1'})
    await mcp.connect(new StdioClientTransport({command:process.execPath,args:[resolve(installation!,manifest.bin['slatebox-mcp'])],env,stderr:'ignore'}))
    const native=async()=>(await getSlate(owner.page,board)).creative
    await startAgentMap(owner.page,origin,board)
    const original=await native()
    const label='Ask the account owner'
    const firstOutcome='The account owner confirms the buyer approved the charge.'
    const finalOutcome='Support can refund the charge once the buyer confirms.'
    const args=['branch',board,'Next step',label,'--outcome',firstOutcome]
    const preview=await cli(...args)
    const baseline=preview.workshop.revision
    expect(baseline).toBe(original.revision)
    expect(preview.report.addedBranches).toHaveLength(1)
    expect(preview.workshop.lanes.at(-1).outcome).toBe(firstOutcome)
    expect((await native()).model).toEqual(original.model)
    const invitation=await cli('share',board,'--role','edit','--idempotency-key',randomUUID())
    const revokeKey=randomUUID()
    withdraw=async()=>{
      const result=await cli('unshare',board,'--invite-id',invitation.inviteId,'--idempotency-key',revokeKey)
      expect(result.revoked).toBe(true)
    }
    const link=new URL(invitation.url)
    expect(link.origin).toBe(origin.origin)
    await peer.page.goto(link.href)
    await dismissWelcome(peer.page)
    const hash=process.env.SLATEBOX_EXPECTED_APP_BUNDLE
    if(hash)await expect(peer.page.locator('script[src*="/'+hash+'.js"]')).toHaveCount(1)
    await peer.page.getByRole('button',{name:'Token → Next step',exact:true}).click()
    await expect.poll(async()=>(await native()).revision).toBe(baseline+1)
    // The peer's change invalidates the original review; no partial station or edge is saved.
    let conflict=false
    try{await command(...args,'--apply','--revision',String(baseline),'--idempotency-key',randomUUID())}
    catch(error){conflict=/HTTP 409/.test((error as {stderr:string}).stderr)}
    expect(conflict).toBe(true)
    expect((await native()).model.workshop.lanes).toEqual(original.model.workshop.lanes)
    const fresh=await cli(...args), key=randomUUID()
    const saved=await cli(...args,'--apply','--revision',String(fresh.workshop.revision),'--idempotency-key',key)
    const branch=saved.report.addedBranches[0]
    expect(saved.report.addedBranches).toEqual(fresh.report.addedBranches)
    expect(saved.workshop.lanes.find((lane:{id:string})=>lane.id===branch.fromStationId).next).toContain(branch.stationId)
    const replay=await mcp.callTool({name:'add_map_branch',arguments:{
      share_id:board,from_station:'Next step',label,outcome:firstOutcome,expected_revision:fresh.workshop.revision,dry_run:false,idempotency_key:key
    }})
    expect(replay.isError).toBeFalsy()
    expect(replay.structuredContent).toEqual(saved)
    const update={share_id:board,station:label,outcome:finalOutcome}
    const outcome=await mcp.callTool({name:'update_map_outcome',arguments:update})
    expect(outcome.isError).toBeFalsy()
    expect((await native()).model.workshop.lanes.at(-1).station.outcome).toBe(firstOutcome)
    const updated=await mcp.callTool({name:'update_map_outcome',arguments:{
      ...update,dry_run:false,expected_revision:outcome.structuredContent.workshop.revision,idempotency_key:randomUUID()
    }})
    expect(updated.structuredContent?.report.updatedOutcomes).toEqual([{stationId:branch.stationId}])
    await expect(peer.page.locator('[data-creative-revision]')).toHaveAttribute('data-creative-revision',String(updated.structuredContent.workshop.revision))
    await peer.page.getByRole('button',{name:'Token → '+label,exact:true}).click()
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
    const latest=(await cli('read',board)).summary.workshop
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
