import { expect, test } from "@playwright/test";
import { openGuestCanvas } from "./app-host.shared";
import { dismissWelcome, getSlate, removeTestGuest, userId } from "./workshop-guests.shared";
import { conversation, messageBox, slateTitle, standing, starter, workshopReady } from "./app-native-workshop.shared";

const appUrl = process.env.SLATEBOX_APP_URL || "http://localhost:3000";

test("map entry, gallery and dashboard New open their respective editors", async ({ page }) => {
  await page.goto(appUrl + "/templates");
  await expect(page.getByRole("link", {name:"Create slate",exact:true})).toHaveAttribute("href","/new");
  if (!["localhost", "127.0.0.1", "test.slatebox.com"].includes(new URL(appUrl).hostname)) return;
  await page.goto(appUrl + "/workshops?format=map&example=customer-import");
  await page.waitForURL(/\/canvas\/[a-f0-9]{10}$/);
  const ownerId = await userId(page);
  try {
    await dismissWelcome(page);
    await workshopReady(page);
    await expect(slateTitle(page)).toHaveText("First customer import");
    await expect(page.locator('#slateCanvas [data-node-id="card-batch"]')).toBeVisible();
    const source = await getSlate(page, new URL(page.url()).pathname.split("/").pop()!);
    expect(source.userId).toBe(ownerId);
    expect(source.options).toMatchObject({isPrivate:true,isUnlisted:false,isPublic:false});
    expect(source.creative.model.workshop.lanes.map((lane: {id:string}) => lane.id)).toEqual(["file","import","review","complete"]);
    expect(source.creative.model.workshop.cards[0]).toMatchObject({id:"batch",laneId:"file"});
    await openGuestCanvas(page, appUrl);
    const canvas = page.url();
    expect(new URL(canvas).search).toBe("");
    await page.getByRole("button", { name: "Open menu", exact: true }).click();
    await expect(page.getByRole("navigation", { name: "Slatebox" }).getByRole("link", { name: "Create slate" })).toHaveAttribute("href", "/new");
    await page.keyboard.press("Escape");
    await page.locator(".sb-board-toolbar").getByRole("link", { name: "My slates" }).click();
    await page.getByRole("button", { name: "New", exact: true }).click();
    await expect(page).toHaveURL(/\/canvas\/[a-f0-9]{10}$/);
    const second = page.url();
    expect(second).not.toBe(canvas);
    const node = page.locator("#slateCanvas [data-node-id]").first();
    await expect(node).toBeVisible();
    await page.reload();
    await expect(node).toBeVisible();
    expect(page.url()).toBe(second);
    await page.goBack();
    await expect(page.getByRole("button", { name: "New", exact: true })).toBeVisible();
    await page.goto(appUrl + "/templates");
    await page.getByRole("main").getByRole("link", { name: "Create slate" }).click();
    await expect(page).toHaveURL(/\/canvas\/[a-f0-9]{10}$/);
    await expect(page.locator("#slateCanvas [data-node-id]").first()).toBeVisible();
    await page.goto(canvas);
    await expect(node).toBeVisible();
  } finally {
    await removeTestGuest(page, ownerId);
  }
});

test("legacy workshop links open a private slate and preserve native browser history", async ({ page }) => {
  test.skip(!["localhost", "127.0.0.1", "test.slatebox.com"].includes(new URL(appUrl).hostname));
  await page.goto(appUrl + "/workshops?format=map");
  await page.waitForURL(/\/canvas\/[a-f0-9]{10}$/);
  const actor = await userId(page);
  const mapUrl = page.url();
  try {
    await dismissWelcome(page);
    // A map opens on the slate's canvas with the slate's own conversation, taking map edits.
    await workshopReady(page);
    await expect(messageBox(page)).toBeVisible();
    await expect(starter(page, "First upload → Preview 10 rows → Import clients")).toBeVisible();
    const map = await getSlate(page, new URL(mapUrl).pathname.split("/").pop()!);
    expect(map.userId).toBe(actor);
    expect(map.options).toMatchObject({isPrivate:true,isPublic:false,isUnlisted:false});
    expect(map.creative.model.workshop.title).toBe("Untitled map");
    await page.goto(appUrl + "/workshops");
    await page.waitForURL(/\/canvas\/[a-f0-9]{10}$/);
    const lanesUrl = page.url();
    expect(lanesUrl).not.toBe(mapUrl);
    await workshopReady(page);
    await expect(messageBox(page)).toBeVisible();
    await expect(starter(page, "Add a lane called Later")).toBeVisible();
    const lanes = await getSlate(page, new URL(lanesUrl).pathname.split("/").pop()!);
    expect(lanes.userId).toBe(actor);
    expect(lanes.options).toMatchObject({isPrivate:true,isPublic:false,isUnlisted:false});
    expect(lanes.creative.model.workshop.cards).toEqual([]);
    await page.reload();
    await workshopReady(page);
    await expect(slateTitle(page)).toHaveText("Untitled workshop");
    await page.goBack();
    await expect(page).toHaveURL(mapUrl);
    await expect(messageBox(page)).toBeVisible();
    await expect(starter(page, "First upload → Preview 10 rows → Import clients")).toBeVisible();
    await expect(page.locator('#slateCanvas [data-node-id="lane-start"]')).toBeVisible();
    await page.goForward();
    await expect(page).toHaveURL(lanesUrl);
    await expect(messageBox(page)).toBeVisible();
    await expect(starter(page, "Add a lane called Later")).toBeVisible();
    await expect(page.locator('#slateCanvas [data-node-id="lane-start"]')).toHaveCount(0);
    await expect.poll(() => userId(page)).toBe(actor);
  } finally {
    if (actor) {
      await page.goto(appUrl + "/profile");
      await page.waitForFunction(id => (window as any).Meteor?.userId() === id, actor);
      await removeTestGuest(page, actor);
    }
  }
});

test("an existing workshop draft becomes one private native board and the old bookmark reopens it", async ({page}) => {
  test.skip(!["localhost", "127.0.0.1", "test.slatebox.com"].includes(new URL(appUrl).hostname));
  const route = appUrl + "/workshops?format=map";
  await page.goto(appUrl + "/templates");
  await page.evaluate(() => {
    const draft = {version:1,title:"Parcel return options",lanes:[
      {id:"door",label:"Dispatch",station:{column:0,row:0,next:["desk"],outcome:"Check the parcel."}},
      {id:"desk",label:"Returns desk",station:{column:1,row:0,next:[],outcome:"Review the parcel."}}
    ],cards:[{id:"parcel",label:"Parcel",laneId:"desk"}]};
    sessionStorage.setItem("slatebox.map.v1.guest", JSON.stringify({draft,stage:"review"}));
  });
  await page.goto(route);
  await page.waitForURL(/\/canvas\/[a-f0-9]{10}$/);
  const key = new URL(page.url()).pathname.split("/").pop()!;
  const owner = await userId(page);
  try {
    await dismissWelcome(page);
    await workshopReady(page);
    await expect(standing(page)).toContainText("Parcel · Returns desk");
    const first = await getSlate(page,key);
    expect(first.userId).toBe(owner);
    expect(first.options.isPrivate).toBe(true);
    await page.goto(route);
    await expect(page).toHaveURL(new URL("/canvas/"+key,appUrl).href);
    await workshopReady(page);
    await expect(slateTitle(page)).toHaveText("Parcel return options");
    expect((await getSlate(page,key)).creative.model.workshop).toEqual(first.creative.model.workshop);
  } finally {
    await removeTestGuest(page,owner);
  }
});

test("a collaboration visitor owns a private, connected incident timeline on first open", async ({ page }) => {
  test.skip(!["localhost", "127.0.0.1", "test.slatebox.com"].includes(new URL(appUrl).hostname));
  await page.goto(appUrl + "/templates");
  expect(await page.evaluate(() => localStorage.getItem("meteor_token"))).toBeNull();
  await page.goto(appUrl + "/new/incident-timeline");
  await page.waitForURL(/\/canvas\/[\w-]+$/);
  const key = new URL(page.url()).pathname.split("/").pop()!;
  try {
    const question = page.locator("#slateCanvas").getByRole("button", { name: "Who owns the retry limit?", exact: true });
    await expect(question).toBeVisible();
    const timeline = await page.evaluate(async shareId => {
      const meteor = (window as any).Meteor;
      const { slateBase } = await meteor.callAsync("slates.get", { shareId });
      return {
        owned: slateBase.userId === meteor.userId(),
        private: slateBase.options.isPrivate,
        public: slateBase.options.isPublic,
        unlisted: slateBase.options.isUnlisted,
        nodes: slateBase.nodes.map((node: any) => node.options.id).sort(),
        edges: slateBase.nodes.flatMap((node: any) => node.relationships.associations.map(
          (edge: any) => edge.parentId + " → " + edge.childId
        )).sort(),
      };
    }, key);
    expect(timeline).toEqual({
      owned: true, private: true, public: false, unlisted: false,
      nodes: ["handoff", "recovery", "retries", "trace"],
      edges: ["recovery → handoff", "retries → recovery", "trace → retries"],
    });
    await page.reload();
    await expect(question).toBeVisible();
  } finally {
    await page.evaluate(async shareId => {
      const meteor = (window as any).Meteor;
      const row = (await meteor.callAsync("slates.get", { shareId }))?.slateBase;
      if (meteor.user()?.isAnonymous && row && row.userId === meteor.userId()) {
        await meteor.callAsync("slates.remove", { slateIds: [row._id] });
        meteor.call("users.delete");
      }
    }, key);
  }
});

test("explicit template creation links preserve the selected preview and encoded copy title", async ({ page }) => {
  const topic = "Lighting & sound / evening rehearsal?";
  for (const [entry, key, value, expected] of [
    ["/canvas/new", "template", "proConScaffold", "pro-con-analysis"],
    ["/start", "templateId", "tplprocon001", "tplprocon001"],
    ["/new", "template", "Pro/Con Analysis", "pro-con-analysis"],
  ]) {
    await page.goto(appUrl + entry + "?" + new URLSearchParams({ [key]: value, topic }));
    await expect(page.getByRole("heading", { name: "Pro/Con Analysis", exact: true })).toBeVisible();
    expect(new URL(page.url()).pathname).toBe("/templates/" + expected);
    expect(new URL(page.url()).searchParams.get("topic")).toBe(topic);
    await expect(page.getByText("Your copy will be named “" + topic + "”.")).toBeVisible();
    await expect(page.getByRole("img", { name: "Canvas preview of Pro/Con Analysis" }).locator("[data-node-id]").first()).toBeVisible();
    await expect(page.getByRole("button", { name: "Use this template" })).toBeEnabled();
    expect(await userId(page)).toBeNull();
  }
  await page.goto(appUrl + "/canvas/new?template=slatebox-missing-entry-template-807fa");
  await expect(page.getByRole("heading", { name: "Template unavailable" })).toBeVisible();
  await expect(page.getByRole("link", { name: "All templates" })).toHaveAttribute("href", "/templates");
  expect(await userId(page)).toBeNull();
});
