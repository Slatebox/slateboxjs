import { expect, test, type Browser, type Page } from "@playwright/test";
import { randomUUID } from 'node:crypto'
import { dismissWelcome, getSlate, removeTestGuest, shareAs, userId } from "./workshop-guests.shared";

const app = process.env.SLATEBOX_APP_URL || "http://localhost:3000";
const homepage = process.env.SLATEBOX_MARKETING_URL;
const allowed = ["localhost", "127.0.0.1", "test.slatebox.com"].includes(new URL(app).hostname);

async function ready(page: Page, expectGuestWelcome = false) {
  await expect(page.locator("#slateCanvas g[data-node-id]").first()).toBeVisible({timeout:30_000});
  const welcome = page.getByRole("dialog", {name:/welcome/i});
  if (expectGuestWelcome) {
    await expect(welcome).toContainText("You have full access", {timeout:25_000});
    await welcome.getByRole("button", {name:"OK"}).click();
  } else if (await welcome.waitFor({state:"visible",timeout:1800}).then(()=>true,()=>false)) {
    await welcome.getByRole("button", {name:"OK"}).click();
  }
}

async function editNote(page: Page, id: string, text: string) {
  await page.locator('#slateCanvas g[data-node-id="' + id + '"]').click()
  await page.keyboard.press('F2')
  const input = page.locator('.sb-inline-editor[contenteditable="true"]')
  await input.fill(text)
  await input.press('Enter')
}

async function verifyInvitation(browser: Browser, recipient: "existing" | "signed-out") {
  test.skip(!allowed,"writes require a staging or local app");
  const ownerContext = await browser.newContext({viewport:{width:1400,height:960},reducedMotion:"reduce"});
  const peerContext = await browser.newContext({viewport:{width:1400,height:960},reducedMotion:"reduce"});
  const owner = await ownerContext.newPage();
  const peer = await peerContext.newPage();
  for (const page of [owner, peer]) {
    const notice = page.getByRole("button", {name: "Accept cookies"});
    await page.addLocatorHandler(notice, () => notice.click());
  }
  const share = owner.getByRole("dialog",{name:'Share this slate'});
  let shared = false;
  let ownerId: string | null = null;
  let peerId: string | null = null;
  let invite: URL | undefined;
  try {
    if (homepage) {
      // Exercise the actual public anchor. Replace only the app origin on a
      // staging run, before a request can create data on production.
      await owner.goto(homepage,{waitUntil:"domcontentloaded"});
      const cta = owner.getByRole("link",{name:/start a free slate/i});
      const href = new URL((await cta.getAttribute("href"))!,homepage);
      expect(href.pathname).toBe("/new");
      expect([new URL(app).origin,"https://app.slatebox.com"]).toContain(href.origin);
      if (href.origin !== new URL(app).origin) {
        await owner.route(href.href, route=>route.fulfill({status:302,headers:{location:new URL("/new",app).href}}),{times:1});
      }
      await cta.click();
    } else {
      await owner.goto(app+"/new",{waitUntil:"domcontentloaded"});
    }
    await ready(owner);
    const original = owner.url();
    expect(original).toMatch(/\/canvas\/[a-f0-9]{10}$/);
    ownerId = await userId(owner);
    expect(ownerId).toBeTruthy();
    if (recipient === "existing") {
      await peer.goto(app+"/new",{waitUntil:"domcontentloaded"});
      await ready(peer);
      peerId = await userId(peer);
      expect(peerId).toBeTruthy();
      expect(peerId).not.toBe(ownerId);
    }

    await owner.getByRole("button",{name:"Share",exact:true}).click();
    await share.getByRole("button",{name:/Unlisted/}).click();
    shared = true;
    const unlisted = share.getByRole("region",{name:/Unlisted/});
    const level = unlisted.getByRole("combobox");
    await expect(level).toHaveText("read");
    await level.click();
    await owner.getByRole("option",{name:"edit",exact:true}).click();
    await expect(level).toHaveText("edit");
    await unlisted.getByRole("button", {name:"Create link", exact:true}).click();
    invite = new URL(await unlisted.getByRole("textbox", {name:"Invitation link"}).inputValue());
    expect(invite.origin).toBe(new URL(app).origin);
    expect(invite.pathname).toMatch(/^\/canvas\/[a-zA-Z0-9]{8}$/);
    expect(invite.href).not.toBe(original);
    await share.getByRole("button",{name:"Done"}).click();
    await peer.goto(invite.href,{waitUntil:"domcontentloaded"});
    await ready(peer, recipient === "signed-out");
    if (recipient === "signed-out") {
      expect(await userId(peer)).toBeNull();
      expect(await peer.evaluate(()=>localStorage.getItem("Meteor.loginToken"))).toBeNull();
    }
    await expect(peer.getByRole("button",{name:"Share",exact:true})).toHaveCount(0);
    const note = "Carry the spare lens to the observatory";
    await peer.getByRole("button",{name:"Slatebox - quickly add a node"}).hover();
    await peer.getByRole("button",{name:"Add Text",exact:true}).click();
    await peer.locator("#txtNode").fill(note);
    const editedNode = (p:Page)=>p.locator("#slateCanvas g[data-node-id]").filter({hasText:note});
    await expect(editedNode(peer)).toHaveCount(1);
    await peer.keyboard.press("Escape");
    await expect(editedNode(owner)).toHaveCount(1,{timeout:25_000});
    const id = await editedNode(peer).getAttribute("data-node-id");
    expect(await editedNode(owner).getAttribute("data-node-id")).toBe(id);
    await peer.getByRole("button",{name:"Present",exact:true}).click();
    const presentation = peer.getByRole("dialog",{name:"Board presentation"});
    await expect(presentation.locator(".sb-playback-surface g[data-node-id]").filter({hasText:note})).toHaveCount(1);
    const step = presentation.locator("footer [aria-live]");
    await expect(step).toContainText("1 of 2");
    await presentation.getByRole("button",{name:"Next",exact:true}).click();
    await expect(step).toContainText("2 of 2");
    await presentation.getByRole("button",{name:"Previous",exact:true}).click();
    await expect(step).toContainText("1 of 2");
    await presentation.getByRole("button",{name:"Exit presentation"}).click();
    await expect(presentation).toHaveCount(0);
    // A live Yjs room can also restore a node after reload. Verify the same
    // owner-scoped document that the editor fetches from Meteor has the edit.
    await expect.poll(()=>owner.evaluate(async ({shareId,nodeId})=>{
      const saved = await (window as any).Meteor.callAsync('slates.get',{shareId});
      const node = saved?.slateBase?.nodes?.find((n:any)=>(n.options?.id ?? n.id)===nodeId);
      return node?.options?.text ?? node?.text ?? null;
    },{shareId:new URL(original).pathname.split('/').pop(),nodeId:id}),{timeout:25_000}).toBe(note);
    // Check the same persisted node via both the creator URL and the invite.
    await Promise.all([peer.reload({waitUntil:"domcontentloaded"}),owner.reload({waitUntil:"domcontentloaded"})]);
    if (recipient === "signed-out") {
      await ready(peer, true);
      expect(await userId(peer)).toBeNull();
    }
    for (const page of [peer,owner]) {
      await expect(editedNode(page)).toHaveAttribute("data-node-id",id!,{timeout:25_000});
    }
    expect(peer.url()).toBe(invite.href);
    expect(owner.url()).toBe(original);
  } finally {
    // Remove the temporary EDIT link even if the downstream assertions fail.
    try {
      if (shared) {
        if (!await share.isVisible()) await owner.getByRole("button",{name:"Share",exact:true}).click();
        await share.getByRole("button",{name:/^Private/}).click();
        await expect(share.getByRole("button",{name:/^Private/})).toHaveAttribute("aria-expanded","true");
        await share.getByRole("button",{name:"Make private"}).click();
        await share.getByRole("button",{name:"Done"}).click();
        if (invite && recipient === "signed-out") {
          const shareId = invite.pathname.split("/").pop();
          await expect.poll(()=>peer.evaluate(async id=>
            (await (window as any).Meteor.callAsync("slates.get",{shareId:id}))?.accessLevel ?? null, shareId
          )).toBeNull();
          await peer.reload({waitUntil:"domcontentloaded"});
          await expect(peer.getByText("This slate is not accessible.", {exact:true})).toBeVisible();
        }
      }
    } finally {
      try {
        await Promise.all(([[owner,ownerId], [peer,peerId]] as const).map(async ([page,id]) => {
          if (id) {
            await page.goto(new URL("/plans",app).href);
            await expect.poll(() => userId(page)).toBe(id);
            await removeTestGuest(page,id);
          }
        }));
      } finally {
        await Promise.all([peerContext.close(),ownerContext.close()]);
      }
    }
  }
}

test("create, share an editable invitation, present a teammate's note, and reopen the same slate", async ({browser}) => {
  await verifyInvitation(browser, "existing");
});

test("a signed-out recipient opens the edit link directly, saves and reopens a note, then loses access on revocation", async ({browser}) => {
  await verifyInvitation(browser, "signed-out");
});

test('a registered native editor finds their saved note in Recently joined until its invitation is retired', async ({browser}) => {
  test.skip(!allowed, 'Creates isolated accounts only on local or staging deployments')
  const contexts = await Promise.all(Array.from({length:3}, () => browser.newContext({viewport:{width:1360,height:940}})))
  const [owner, editor, observer] = await Promise.all(contexts.map(context => context.newPage()))
  const ids = new Map<Page, string>()
  const email = 'recent-native-' + randomUUID() + '@slatebox.invalid'
  const recent = (page:Page) => page.getByRole('region', {name:'Recently joined'}).getByRole('link')
  const library = async (page:Page) => {
    await page.goto(app+'/')
    await expect.poll(() => userId(page)).toBe(ids.get(page))
    // An empty section is meaningful only once the user's history has arrived.
    await page.evaluate(async () => {
      const meteor = (window as any).Meteor
      const sub = await new Promise<{stop():void}>((resolve,reject) => {
        const h = meteor.subscribe('joinedSlates.index', {onReady:()=>resolve(h), onStop:(e:Error)=>e && reject(e)})
      })
      sub.stop()
    })
    await dismissWelcome(page)
  }

  let boardId: string | undefined
  try {
    for (const page of [owner, editor, observer]) {
      page.setDefaultTimeout(15_000)
      const consent = page.getByRole('button',{name:'Accept cookies'})
      await page.addLocatorHandler(consent,()=>consent.click())
      await page.goto(app+'/new')
      await expect.poll(()=>userId(page)).toBeTruthy()
      ids.set(page, (await userId(page))!)
      await ready(page)
    }
    expect(new Set(ids.values()).size).toBe(3)
    const original = owner.url()
    const key = new URL(original).pathname.split('/').pop()!
    const initial = await getSlate(owner,key)
    boardId = initial._id
    const node = initial.nodes[0].options.id
    const title = initial.options.name || 'Untitled slate'
    const release = process.env.SLATEBOX_EXPECTED_APP_BUNDLE
    if (release) {
      const tag = owner.locator('script[src*="/'+release+'.js"]')
      await expect(tag).toHaveCount(1)
      const asset = await owner.request.get(new URL((await tag.getAttribute('src'))!,app).href)
      expect(asset.ok()).toBe(true)
      expect(await asset.text()).toContain('Recently joined')
    }
    await editor.goto(app+'/profile')
    const registration = editor.getByRole('dialog',{name:'Save your work'})
    // A fresh guest profile opens registration automatically after the login resumes.
    await expect(registration).toBeVisible()
    await registration.getByLabel('Email address').fill(email)
    await registration.getByLabel(/^Password/i).fill(randomUUID())
    await registration.getByRole('button',{name:'Save my Slatebox'}).click()
    await expect.poll(()=>editor.evaluate(()=>(window as any).Meteor.user()?.emails?.[0]?.address)).toBe(email)
    const invite = await shareAs(owner,'edit')
    await observer.goto(invite.href)
    await ready(observer)
    const viewport = observer.locator('#slateCanvas svg[viewBox]').first()
    const viewBox = await viewport.getAttribute('viewBox')
    await viewport.hover({position:{x:220,y:180}})
    await observer.mouse.wheel(0,120)
    await expect(viewport).not.toHaveAttribute('viewBox',viewBox!)
    await editNote(owner,node,'Listen for the signal')
    await expect(observer.locator('#slateCanvas g[data-node-id="'+node+'"]')).toContainText('Listen for the signal')
    await expect.poll(async ()=>(await getSlate(owner,key)).nodes.find((n:any)=>n.options.id===node)?.options.text).toBe('Listen for the signal')
    await library(observer)
    await expect(recent(observer)).toHaveCount(0)
    await library(owner)
    await expect(recent(owner)).toHaveCount(0)
    await owner.goto(original)
    await ready(owner)
    await editor.goto(invite.href)
    await ready(editor)
    const note = 'Record the fourth bell'
    await editNote(editor,node,note)
    await expect.poll(async ()=>(await getSlate(owner,key)).nodes.find((n:any)=>n.options.id===node)?.options.text).toBe(note)
    await library(editor)
    const link = recent(editor).filter({hasText:title})
    await expect(link).toHaveAttribute('href',invite.pathname)
    await link.click()
    await expect(editor.locator('#slateCanvas g[data-node-id="'+node+'"]')).toContainText(note)
    const read = await shareAs(owner,'read')
    expect(read.href).toBe(invite.href)
    await library(editor)
    await link.click()
    await expect(editor.locator('#slateCanvas g[data-node-id="'+node+'"]')).toContainText(note)
    await expect(editor.getByRole('button',{name:'Slatebox - quickly add a node'})).toHaveCount(0)
    await library(editor)
    await expect(link).toHaveAttribute('href',read.pathname)
    await owner.getByRole('button',{name:'Share',exact:true}).click()
    const sharing = owner.getByRole('dialog',{name:'Share this slate'})
    await sharing.getByRole('button',{name:/^Private/}).click()
    await sharing.getByRole('button',{name:'Make private',exact:true}).click()
    await sharing.getByRole('button',{name:'Done',exact:true}).click()
    await expect(link).toHaveCount(0)
    const replacement = await shareAs(owner,'edit')
    expect(replacement.pathname).not.toBe(invite.pathname)
    await library(editor)
    await expect(recent(editor)).toHaveCount(0)
    await editor.goto(invite.href)
    await expect(editor.getByText('This slate is not accessible.',{exact:true})).toBeVisible()
    await editor.goto(replacement.href)
    await ready(editor)
    await editNote(editor,node,'Record the fifth bell')
    await expect.poll(async ()=>(await getSlate(owner,key)).nodes.find((n:any)=>n.options.id===node)?.options.text).toBe('Record the fifth bell')
    await library(editor)
    await expect(link).toHaveAttribute('href',replacement.pathname)
  } finally {
    try {
      if (boardId && await userId(owner)===ids.get(owner)) {
        await owner.evaluate(id=>(window as any).Meteor.callAsync('slates.remove',{slateIds:[id]}),boardId)
      }
    } finally {
      try {
        await Promise.all([...ids].map(async ([page,id])=>{
          await page.goto(app+'/plans')
          await expect.poll(()=>userId(page)).toBe(id)
          if (page!==editor) return removeTestGuest(page,id)
          await expect.poll(()=>page.evaluate(()=>{const u=(window as any).Meteor.user();return Boolean(u?.isAnonymous || u?.emails?.length)})).toBe(true)
          expect(await page.evaluate(async ({id,email})=>{
            const m=(window as any).Meteor
            if(m.userId()!==id || !(m.user()?.isAnonymous || m.user()?.emails?.[0]?.address===email)) return false
            return m.callAsync('users.delete')
          },{id,email})).toBe(true)
        }))
      } finally { await Promise.all(contexts.map(context=>context.close())) }
    }
  }
})

test('a signed-out whiteboard contributor can choose to keep the original invitation on this browser', async ({browser}) => {
  test.skip(!allowed, 'Uses temporary accounts on staging or a local installation')
  const [ownerContext, peerContext] = await Promise.all([browser.newContext(), browser.newContext()])
  const owner = await ownerContext.newPage()
  let peer = await peerContext.newPage()
  let ownerId: string | null = null
  let peerId: string | null = null
  let boardId: string | undefined
  try {
    for (const page of [owner, peer]) {
      const consent = page.getByRole('button', {name:'Accept cookies'})
      await page.addLocatorHandler(consent, () => consent.click())
    }
    await owner.goto(app + '/new')
    await ready(owner)
    ownerId = await userId(owner)
    expect(ownerId).toBeTruthy()
    const key = new URL(owner.url()).pathname.split('/').pop()!
    const board = await getSlate(owner, key)
    boardId = board._id
    const node = board.nodes[0].options.id
    const invitation = await shareAs(owner, 'edit')
    await peer.goto(invitation.href)
    await ready(peer, true)
    const keep = peer.getByRole('button', {name:'Keep in My Slates', exact:true})
    const note = 'Set the cue light beside the sound desk'
    expect(await userId(peer)).toBeNull()
    await editNote(owner, node, 'The cue light is in storage')
    await expect(peer.locator('#slateCanvas g[data-node-id="' + node + '"]')).toHaveAccessibleName('The cue light is in storage')
    await expect(keep).toHaveCount(0)
    await editNote(peer, node, note)
    await expect.poll(async () => (await getSlate(owner,key)).nodes.find((n:any) => n.options.id === node)?.options.text).toBe(note)
    await expect(keep).toBeVisible()
    expect(await userId(peer)).toBeNull()
    expect(await peer.evaluate(() => localStorage.getItem('Meteor.loginToken'))).toBeNull()
    await peer.reload()
    await ready(peer, true)
    await expect(keep).toBeVisible()
    expect(await userId(peer)).toBeNull()
    await keep.click()
    await expect.poll(() => userId(peer)).toBeTruthy()
    peerId = await userId(peer)
    expect(peerId).not.toBe(ownerId)
    expect(peer.url()).toBe(invitation.href)
    await expect(peer.getByRole('link', {name:'Open My Slates'})).toHaveAttribute('href', '/')
    await expect(peer.getByRole('dialog', {name:'Save your work'})).toHaveCount(0)

    // Start at the library in a new tab without reusing the invitation URL.
    await peer.close()
    peer = await peerContext.newPage()
    await peer.goto(app + '/')
    const history = peer.getByRole('region', {name:'Recently joined'}).getByRole('link')
    await expect(history).toHaveAttribute('href', invitation.pathname)
    expect(await userId(peer)).toBe(peerId)
    await history.click()
    await expect(peer.locator('#slateCanvas g[data-node-id="' + node + '"]')).toHaveAccessibleName(note)
    await peer.goto(app + '/')
    await expect(history).toHaveAttribute('href', invitation.pathname)
    await owner.getByRole('button', {name:'Share', exact:true}).click()
    const sharing = owner.getByRole('dialog', {name:'Share this slate'})
    await sharing.getByRole('button', {name:/^Private/}).click()
    await sharing.getByRole('button', {name:'Make private',exact:true}).click()
    await expect(history).toHaveCount(0)
  } finally {
    try {
      if (boardId && ownerId && await userId(owner) === ownerId) {
        await owner.evaluate(id => (window as any).Meteor.callAsync('slates.remove', {slateIds:[id]}), boardId)
      }
    } finally {
      try {
        await Promise.all(([[owner,ownerId],[peer,peerId]] as const).map(async ([page,id]) => {
          if (!id) return
          await page.goto(app + '/plans')
          await expect.poll(() => userId(page)).toBe(id)
          await removeTestGuest(page,id)
        }))
      } finally { await Promise.all([ownerContext.close(), peerContext.close()]) }
    }
  }
})
