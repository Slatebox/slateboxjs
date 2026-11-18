import { expect, test, type Page } from "@playwright/test";

const app = process.env.SLATEBOX_APP_URL || "http://localhost:3000";
const homepage = process.env.SLATEBOX_MARKETING_URL;
const allowed = ["localhost", "127.0.0.1", "test.slatebox.com"].includes(new URL(app).hostname);

async function ready(page: Page) {
  await expect(page.locator("#slateCanvas g[data-node-id]").first()).toBeVisible({timeout:30_000});
  const welcome = page.getByRole("dialog", {name:/welcome/i});
  if (await welcome.waitFor({state:"visible",timeout:1800}).then(()=>true,()=>false)) {
    await welcome.getByRole("button", {name:"OK"}).click();
  }
  const cookies = page.getByRole("button",{name:"Accept cookies"});
  if (await cookies.isVisible()) await cookies.click();
}

test("create, share an editable invitation, present a teammate's note, and reopen the same slate", async ({browser}) => {
  test.skip(!allowed,"writes require a staging or local app");
  const ownerContext = await browser.newContext({viewport:{width:1400,height:960},reducedMotion:"reduce"});
  const peerContext = await browser.newContext({viewport:{width:1400,height:960},reducedMotion:"reduce"});
  const owner = await ownerContext.newPage();
  const peer = await peerContext.newPage();
  const share = owner.getByRole("dialog",{name:/sharing settings/i});
  let shared = false;
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
    // Use a separate registered guest identity, exactly as /new provisions it.
    await peer.goto(app+"/new",{waitUntil:"domcontentloaded"});
    await ready(peer);
    const userId = (p:Page)=>p.evaluate(()=>(window as any).Meteor.userId());
    const ownerId = await userId(owner);
    const peerId = await userId(peer);
    expect(ownerId).toBeTruthy();expect(peerId).toBeTruthy();expect(peerId).not.toBe(ownerId);

    await owner.getByRole("button",{name:"Share",exact:true}).click();
    await share.getByRole("button",{name:/Unlisted/}).click();
    shared = true;
    const unlisted = share.getByRole("region").filter({hasText:"Share the unlisted link"});
    const level = unlisted.getByRole("combobox");
    await expect(level).toHaveText("read");
    await level.click();
    await owner.getByRole("option",{name:"edit",exact:true}).click();
    await expect(level).toHaveText("edit");
    const invite = new URL(await unlisted.getByText(/^https?:\/\//).innerText());
    expect(invite.origin).toBe(new URL(app).origin);
    expect(invite.pathname).toMatch(/^\/canvas\/[a-zA-Z0-9]{8}$/);
    expect(invite.href).not.toBe(original);
    await share.getByRole("button",{name:"Save"}).click();
    await peer.goto(invite.href,{waitUntil:"domcontentloaded"});
    await ready(peer);
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
        await share.getByRole("button",{name:"Save"}).click();
      }
    } finally {
      await Promise.all([peerContext.close(),ownerContext.close()]);
    }
  }
});
