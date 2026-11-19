import { execFile } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { promisify } from 'node:util'
import { expect, test } from '@playwright/test'
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
  const tools = createRequire(resolve(toolsDir!,'package.json'))
  const manifest = tools('./package.json')
  const {Client} = tools('@modelcontextprotocol/sdk/client/index.js')
  const {StdioClientTransport} = tools('@modelcontextprotocol/sdk/client/stdio.js')
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
    expect((await httpIssue(ordinary,'edit',randomUUID())).status()).toBe(401)
    await shareScope.check()
    const manager=await issueToken('Owner-controlled invitation')
    await expect(shareScope).not.toBeChecked()
    const env={PATH:process.env.PATH!,SLATEBOX_BASE_URL:origin.origin,SLATEBOX_API_TOKEN:manager}
    const cli=async (...args:string[])=>JSON.parse((await promisify(execFile)(process.execPath,[resolve(toolsDir!,manifest.bin.slatebox),...args],{env})).stdout)
    const issueKey=randomUUID()
    const invitation=await cli('share',shareId,'--role','edit','--idempotency-key',issueKey)
    expect(invitation.shareId).toBe(shareId)
    expect(invitation.role).toBe('edit')
    expect(/^[a-f0-9]{32}$/.test(invitation.inviteId)).toBe(true)
    const link=new URL(invitation.url)
    expect(link.origin).toBe(origin.origin)
    expect(link.pathname.startsWith('/canvas/') && !link.pathname.includes(shareId)).toBe(true)
    const httpReplay=await httpIssue(manager,'edit',issueKey)
    expect(httpReplay.status()).toBe(200)
    expect((await httpReplay.json()).url === invitation.url).toBe(true)
    await peer.page.goto(link.href)
    await dismissWelcome(peer.page)
    if (expectedBundle) await expect(peer.page.locator('script[src*="/'+expectedBundle+'.js"]')).toHaveCount(1)
    await peer.page.getByRole('button',{name:'Refund → Finance',exact:true}).click()
    const savedLane=async()=>(await getSlate(ownerPage,shareId)).creative.model.workshop.cards[0].laneId
    await expect.poll(savedLane).toBe('finance')
    await peer.page.reload()
    const back=peer.page.getByRole('button',{name:'Refund → Support',exact:true})
    await expect(back).toBeEnabled()
    mcp=new Client({name:'native-invite-acceptance',version:'1'})
    await mcp.connect(new StdioClientTransport({command:process.execPath,args:[resolve(toolsDir!,manifest.bin['slatebox-mcp'])],env,stderr:'ignore'}))
    const downgraded=await mcp.callTool({name:'create_slate_invite',arguments:{share_id:shareId,role:'read',idempotency_key:randomUUID()}})
    expect(downgraded.isError).toBeFalsy()
    expect(downgraded.structuredContent.url === link.href && downgraded.structuredContent.inviteId === invitation.inviteId).toBe(true)
    await expect(back).toBeDisabled()
    await peer.page.reload()
    await expect(back).toBeDisabled()
    await expect(peer.page.getByRole('button',{name:'Join to edit'})).toHaveCount(0)
    const revokeKey=randomUUID()
    const revoked=await mcp.callTool({name:'revoke_slate_invite',arguments:{share_id:shareId,invite_id:invitation.inviteId,idempotency_key:revokeKey}})
    expect(revoked.structuredContent?.revoked).toBe(true)
    await expect(peer.page.getByRole('heading',{name:map.title})).toHaveCount(0)
    const replay=await cli('unshare',shareId,'--invite-id',invitation.inviteId,'--idempotency-key',revokeKey)
    expect(replay.revoked).toBe(true)
    expect((await httpIssue(manager,'edit',issueKey)).status()).toBe(409)
    await peer.page.goto(link.href)
    await expect.poll(()=>userId(peer.page)).toBe(peer.id)
    await expect.poll(async()=>Boolean(await getSlate(peer.page,link.pathname.split('/').pop()!))).toBe(false)
    await expect(peer.page.getByRole('heading',{name:map.title})).toHaveCount(0)
    await ownerPage.goto(new URL('/canvas/'+shareId,origin).href)
    await expect(ownerPage.getByRole('button',{name:'Refund → Support',exact:true})).toBeEnabled()
    expect(await savedLane()).toBe('finance')
  } finally {
    try {
      if(mcp) await mcp.close()
      await Promise.all([retire(owner),retire(peer)])
    } finally {await Promise.all([owner.page.close(),peer.page.close()])}
  }
})
