import { test, expect, type Page, type BrowserContext } from "@playwright/test";

// Live agent suggestions across two screens. The test stands in for the app's server: it holds
// the agent's suggestion records and sends every change to both pages at once (the app publishes
// them over DDP), and it is what Keep and Discard call. Two browser contexts are two people on one
// slate: Sam may edit and has Keep and Discard; Vi may only read and sees the same ghosts with no
// buttons. When Sam keeps a ghost, the "server" saves the note to both slates (the app's save and
// sync) and marks it kept; both screens then show the real note and no ghost.
//
// SHOTS=<dir> also writes the frames the build notes show.

type Item = { id: string; kind: string; state: string; nodeId?: string; node?: any; parentId?: string; association?: any };
type Action = { actionId: string; agentId: string; label: string; initial: string; colorIndex: number; origin: string; via: string; message: string; items: Item[] };

const v1 = (id: string, text: string, x: number, y: number) => ({
  options: { id, text, xPos: x, yPos: y, width: 170, height: 90, backgroundColor: "#fff7d6" },
  relationships: { associations: [] },
});

async function openSlate(context: BrowserContext, name: string, canAct: boolean): Promise<Page> {
  const page = await context.newPage();
  await page.setViewportSize({ width: 1000, height: 640 });
  await page.goto("/test.html");
  await page.waitForFunction(() => (window as any).Slatebox);
  await page.evaluate(async ({ name, canAct }) => {
    const w = window as any;
    const div = document.getElementById("app")!;
    div.style.width = "1000px";
    div.style.height = "640px";
    const slate = await new w.Slatebox.slate({ container: "app", id: "live-ghosts" }, {}).init();
    w.slate = slate;
    w.who = name;
    slate.v2.nodes.add({ id: "brief", text: "Checkout: card declines", x: 60, y: 120, width: 200, height: 100 });
    slate.v2.nodes.add({ id: "old", text: "Email the customer", x: 60, y: 360, width: 200, height: 90 });
    const { createAgentSuggestions, createAgentPresence } = await import("/src/core/AgentPresence.ts");
    w.calls = [];
    w.ghosts = createAgentSuggestions(slate, {
      canAct: () => canAct,
      onKeep: (ref: any) => { w.calls.push(["keep", ref]); w.sbKeep?.(ref); },
      onDiscard: (ref: any) => { w.calls.push(["discard", ref]); w.sbDiscard?.(ref); },
    });
    w.pointers = createAgentPresence(slate.v2, { reducedMotion: () => true });
  }, { name, canAct });
  return page;
}

test.describe("agent suggestions, live on two screens", () => {
  test("ghosts appear on both screens as the agent works; Keep and Discard on the ghost settle them for everyone", async ({ browser }) => {
    test.setTimeout(90_000);
    const shots = process.env.SHOTS || "";
    const sam = await browser.newContext();
    const vi = await browser.newContext();
    const editor = await openSlate(sam, "Sam", true);
    const viewer = await openSlate(vi, "Vi", false);
    const pages = [editor, viewer];

    // ---- the stand-in server --------------------------------------------------------------
    const action: Action = {
      actionId: "act-1", agentId: "ag-1", label: "Ada's agent", initial: "A", colorIndex: 0, origin: "visiting", via: "Claude",
      message: "Add retry ideas", items: [],
    };
    const now = Date.now();
    const pointer = (over: Record<string, any>) => ({
      agentKey: "run-1", agentId: "ag-1", label: "Ada's agent", initial: "A", colorIndex: 0, origin: "visiting", via: "Claude",
      targets: [], status: "live", updatedAt: Date.now(), expiresAt: now + 60_000, ...over,
    });
    const publish = async (presence?: Record<string, any>) => {
      const records = [structuredClone(action)];
      await Promise.all(pages.map((page) => page.evaluate(({ records, presence }) => {
        const w = window as any;
        w.ghosts.set(records);
        if (presence) w.pointers.set([presence]);
      }, { records, presence })));
    };
    // Keep saves the note to every slate (the app's save reaches every open canvas), then marks it kept.
    const keep = async (ref: { itemId: string }) => {
      const item = action.items.find((i) => i.id === ref.itemId)!;
      if (item.state !== "pending") return;
      await Promise.all(pages.map((page) => page.evaluate((node) => {
        const o = node.options;
        (window as any).slate.v2.nodes.add({ id: o.id, text: o.text, x: o.xPos, y: o.yPos, width: o.width, height: o.height });
      }, item.node)));
      item.state = "kept";
      await publish(pointer({ targets: [item.nodeId], say: "Kept: " + item.node.options.text, sayAt: Date.now() }));
    };
    const discard = async (ref: { itemId: string }) => {
      const item = action.items.find((i) => i.id === ref.itemId)!;
      item.state = "discarded";
      await publish();
    };
    const asked: string[] = [];
    await editor.exposeFunction("sbKeep", async (ref: any) => { asked.push("keep " + ref.itemId); await keep(ref); });
    await editor.exposeFunction("sbDiscard", async (ref: any) => { asked.push("discard " + ref.itemId); await discard(ref); });

    const ghostsOn = (page: Page) => page.evaluate(() => (window as any).ghosts.shown().map((s: any) => s.itemId));
    const notesOn = (page: Page) => page.evaluate(() => (window as any).slate.v2.nodes.allNodes.map((n: any) => n.id).sort());

    // ---- beat 1: the pointer goes to the empty spot, then the first ghost lands there --------
    await publish(pointer({ point: { x: 420, y: 160 }, say: "Placing 2 ideas", sayAt: Date.now() }));
    action.items.push({ id: "add:idea1", kind: "add", state: "pending", nodeId: "idea1", node: v1("idea1", "Retry the card after 24 hours", 340, 110) });
    await publish(pointer({ targets: ["ghost-idea1"], message: "Add retry ideas" }));
    for (const page of pages) {
      await expect.poll(() => ghostsOn(page)).toEqual(["add:idea1"]);
      await expect(page.locator('[data-agent-ghost="idea1"]')).toHaveCount(1);
      // The ghost is a native engine note named ghost-idea1, and the agent's pointer is on it.
      expect(await notesOn(page)).toEqual(["brief", "ghost-idea1", "old"]);
      const at = await page.evaluate(() => (window as any).pointers.shown()[0]);
      expect(at.x).toBeGreaterThan(340);
      expect(at.x).toBeLessThan(340 + 170);
    }

    // ---- beat 2: more ghosts, live: a second idea, a line to it, a removal ---------------------
    action.items.push(
      { id: "add:idea2", kind: "add", state: "pending", nodeId: "idea2", node: v1("idea2", "Offer another card", 580, 250) },
      { id: "link:brief->idea1", kind: "link", state: "pending", parentId: "brief", association: { id: "brief->idea1", parentId: "brief", childId: "idea1" } },
      { id: "remove:old", kind: "remove", state: "pending", nodeId: "old", node: v1("old", "Email the customer", 60, 360) },
    );
    await publish(pointer({ targets: ["ghost-idea2", "old"], message: "Add retry ideas" }));
    for (const page of pages) await expect.poll(() => ghostsOn(page)).toEqual(["add:idea1", "add:idea2", "link:brief->idea1", "remove:old"]);
    if (shots) {
      await editor.screenshot({ path: `${shots}/engine-ghosts-editor.png` });
      await viewer.screenshot({ path: `${shots}/engine-ghosts-viewer.png` });
    }

    // Only the editor has Keep and Discard; the viewer sees the same ghosts with none.
    await expect(editor.locator("[data-suggestion-button]")).toHaveCount(8);
    await expect(viewer.locator("[data-suggestion-button]")).toHaveCount(0);

    // ---- Keep, right on the ghost (a real click on its button) ---------------------------------
    await editor.locator('[data-suggestion="add:idea1"] [data-suggestion-button="keep"]').click();
    for (const page of pages) {
      await expect.poll(() => notesOn(page)).toEqual(["brief", "ghost-idea2", "idea1", "old"]);
      await expect.poll(() => ghostsOn(page)).toEqual(["add:idea2", "link:brief->idea1", "remove:old"]);
    }
    if (shots) await viewer.screenshot({ path: `${shots}/engine-kept-on-viewer.png` });

    // ---- Discard, right on the ghost -------------------------------------------------------------
    await editor.locator('[data-suggestion="add:idea2"] [data-suggestion-button="discard"]').click();
    for (const page of pages) {
      await expect.poll(() => notesOn(page)).toEqual(["brief", "idea1", "old"]);
      await expect.poll(() => ghostsOn(page)).toEqual(["link:brief->idea1", "remove:old"]);
    }
    expect(asked).toEqual(["keep add:idea1", "discard add:idea2"]);
    // The viewer's page asked for nothing: it has no buttons, and keep() without the right does nothing.
    await viewer.evaluate(() => (window as any).ghosts.keep({ actionId: "act-1", itemId: "remove:old" }));
    expect(await viewer.evaluate(() => (window as any).calls.length)).toBe(0);

    await sam.close();
    await vi.close();
  });
});
