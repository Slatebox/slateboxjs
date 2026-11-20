// Restated (exec): the package's per-action CLI commands and MCP tools became `slatebox exec` and
// the MCP `exec` tool, each running a script against the typed client. Same invitation, same
// downgrade and retirement, same assertions on what the peer sees. New, deliberately: sharing and
// revoking are held for the person (widens_access, removes) and saved when the run is confirmed;
// keys inside a script are derived from the run's key, so the HTTP replays send the derived key.
import { dragCardNamed, isOffered, workshopReady } from './app-native-workshop.shared'
import { randomUUID } from 'node:crypto'
import { expect, test } from '@playwright/test'
import { cliConfirmed, cliExec, derivedKey, installedTools, lit, mcpConfirmed } from './agent-exec.shared'
import { register, retire, type Actor } from './agent-principals.shared'
import { encodeWorkshopFragment } from '../../src/workshops/model'
import { dismissWelcome, getSlate, userId } from './workshop-guests.shared'

const origin = new URL(process.env.SLATEBOX_APP_URL || 'http://localhost:3000')
const toolsDir = process.env.SLATEBOX_AGENT_TOOLS_DIR
const map = {
  version: 1 as const, title: 'Who reviews the first customer refund?',
  lanes: [
    {id:'support',label:'Support',station:{column:0,row:0,next:['finance'],outcome:'Review the customer request.'}},
    {id:'finance',label:'Finance',station:{column:1,row:0,next:['support'],outcome:'Confirm the refund.'}},
  ],
  cards:[{id:'request',label:'Refund',laneId:'support'}],
}

test.use({actionTimeout:15000,trace:'off',screenshot:'off',video:'off'})

test('an owner issues a native editor invitation and can downgrade and retire it across the CLI, MCP and HTTP', async ({browser}) => {
  test.skip(!toolsDir || !['localhost','127.0.0.1','test.slatebox.com'].includes(origin.hostname), 'Requires a clean installed package and an isolated or staging app.')
  const {Client,StdioClientTransport,cli,server} = installedTools(toolsDir!)
  const owner:Actor = {page:await browser.newPage(),email:'invite-owner-'+randomUUID()+'@qa.slatebox.invalid',id:null}
  const peer:Actor = {page:await browser.newPage({viewport:{width:390,height:844}}),email:'invite-reviewer-'+randomUUID()+'@qa.slatebox.invalid',id:null}
  let mcp:InstanceType<typeof Client>|undefined
  try {
    const shareId = await register(owner,'/new/workshop'+encodeWorkshopFragment(map))
    await register(peer,'/new/map')
    expect(peer.id).not.toBe(owner.id)
    expect(await getSlate(peer.page,shareId)).toBeFalsy()
    await owner.page.goto(new URL('/profile',origin).href)
    await owner.page.getByRole('tab',{name:'Developer'}).click()
    const expectedBundle = process.env.SLATEBOX_EXPECTED_APP_BUNDLE
    if (expectedBundle) await expect(owner.page.locator('script[src*="/'+expectedBundle+'.js"]')).toHaveCount(1)
    const ownerPage=owner.page
    const shareScope=ownerPage.getByRole('checkbox',{name:'Manage invitation links on slates I own'})
    await expect(ownerPage.getByRole('checkbox',{name:'Read slates'})).toBeChecked()
    await expect(ownerPage.getByRole('checkbox',{name:'Create and edit slates'})).toBeChecked()
    await expect(shareScope).not.toBeChecked()
    async function issueToken(name:string) {
      const input=ownerPage.getByRole('status').getByRole('textbox')
      const previous=await input.count() ? await input.inputValue() : ''
      await ownerPage.getByLabel('Token name').fill(name)
      await ownerPage.getByRole('button',{name:'Create token',exact:true}).click()
      await expect.poll(async()=> await input.count() && (await input.inputValue()) !== previous).toBe(true)
      return input.inputValue()
    }
    const ordinary=await issueToken('Ordinary editing')
    const endpoint = new URL('/api/v1/slates/'+shareId+'/invite',origin).href
    const httpIssue = (token:string,role:string,key:string) => ownerPage.request.post(endpoint,{
      headers:{Authorization:'Bearer '+token,'Idempotency-Key':key},data:{role}
    })
    // A missing scope is 403 insufficient_scope since the action registry (app P02); it was 401.
    expect((await httpIssue(ordinary,'edit',randomUUID())).status()).toBe(403)
    await shareScope.check()
    const manager=await issueToken('Owner-controlled invitation')
    await expect(shareScope).not.toBeChecked()
    // The token's id: the key a script's call saved under is derived from it.
    const managerId=(await ownerPage.evaluate(()=>(window as any).Meteor.callAsync('apiTokens.list',{}))).tokens
      .find((token:{name:string})=>token.name==='Owner-controlled invitation')._id
    const env={PATH:process.env.PATH!,SLATEBOX_BASE_URL:origin.origin,SLATEBOX_API_TOKEN:manager}
    const issueKey=randomUUID()
    const share=(role:string)=>`return slatebox.slates.issueInvite({ shareId: ${lit(shareId)}, role: ${lit(role)} })`
    const invitation=(await cliConfirmed(cli,env,share('edit'),['widens_access'],{key:issueKey})).result
    expect(invitation.shareId).toBe(shareId)
    expect(invitation.role).toBe('edit')
    expect(/^[a-f0-9]{32}$/.test(invitation.inviteId)).toBe(true)
    const link=new URL(invitation.url)
    expect(link.origin).toBe(origin.origin)
    expect(link.pathname.startsWith('/canvas/') && !link.pathname.includes(shareId)).toBe(true)
    const httpReplay=await httpIssue(manager,'edit',derivedKey(managerId,issueKey,1))
    expect(httpReplay.status()).toBe(200)
    expect((await httpReplay.json()).url === invitation.url).toBe(true)
    await peer.page.goto(link.href)
    await dismissWelcome(peer.page)
    if (expectedBundle) await expect(peer.page.locator('script[src*="/'+expectedBundle+'.js"]')).toHaveCount(1)
    await workshopReady(peer.page)
    await dragCardNamed(peer.page,'Refund','Finance')
    const savedLane=async()=>(await getSlate(ownerPage,shareId)).creative.model.workshop.cards[0].laneId
    await expect.poll(savedLane).toBe('finance')
    await peer.page.reload()
    await workshopReady(peer.page)
    // Whether the canvas offers the peer the way back: an editor can pick the card up, a reader cannot.
    const back=()=>isOffered(peer.page,'Refund','Support')
    expect(await back()).toBe(true)
    mcp=new Client({name:'native-invite-acceptance',version:'1'})
    await mcp.connect(new StdioClientTransport({command:process.execPath,args:[server],env,stderr:'ignore'}))
    const downgraded=(await mcpConfirmed(mcp,share('read'),['widens_access'],{idempotencyKey:randomUUID()})).result
    expect(downgraded.url === link.href && downgraded.inviteId === invitation.inviteId).toBe(true)
    await expect.poll(back).toBe(false)
    await peer.page.reload()
    await workshopReady(peer.page)
    expect(await back()).toBe(false)
    await expect(peer.page.getByRole('button',{name:'Join to edit'})).toHaveCount(0)
    const revokeKey=randomUUID()
    const unshare=`return slatebox.slates.revokeInvite({ shareId: ${lit(shareId)}, inviteId: ${lit(invitation.inviteId)} })`
    const revoked=(await mcpConfirmed(mcp,unshare,['removes'],{idempotencyKey:revokeKey})).result
    expect(revoked?.revoked).toBe(true)
    // With the invitation revoked the peer is taken off the slate at once: no workshop, no name, no canvas.
    await expect(peer.page.locator('#slateCanvas [data-node-id^="lane-"], #slateCanvas [data-node-id^="card-"]')).toHaveCount(0)
    await expect(peer.page.locator('.sb-board-name strong').filter({hasText:map.title})).toHaveCount(0)
    await expect(peer.page.locator('#slateCanvas')).toHaveCount(0)
    await expect(peer.page.getByRole('dialog').filter({hasText:'This slate is not accessible.'})).toBeVisible()
    // The same run key replays the saved revocation from the CLI: nothing is held or saved again.
    const replay=await cliExec(cli,env,unshare,{key:revokeKey})
    expect(replay.exit).toBe(0)
    expect(replay.run.result.revoked).toBe(true)
    expect(replay.run.calls[0].replayed).toBe(true)
    expect((await httpIssue(manager,'edit',derivedKey(managerId,issueKey,1))).status()).toBe(409)
    await peer.page.goto(link.href)
    await expect.poll(()=>userId(peer.page)).toBe(peer.id)
    await expect.poll(async()=>Boolean(await getSlate(peer.page,link.pathname.split('/').pop()!))).toBe(false)
    await expect(peer.page.locator('#slateCanvas [data-node-id^="lane-"], #slateCanvas [data-node-id^="card-"]')).toHaveCount(0)
    await ownerPage.goto(new URL('/canvas/'+shareId,origin).href)
    await workshopReady(ownerPage)
    expect(await isOffered(ownerPage,'Refund','Support')).toBe(true)
    expect(await savedLane()).toBe('finance')
  } finally {
    try {
      if(mcp) await mcp.close()
      await Promise.all([retire(owner),retire(peer)])
    } finally {await Promise.all([owner.page.close(),peer.page.close()])}
  }
})
