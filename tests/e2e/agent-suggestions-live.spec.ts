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
    const { createAgentPresence } = await import("/src/core/AgentPresence.ts");
    const { createAgentSuggestions } = await import("/src/core/AgentSuggestions.ts");
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

    // One answer is one group: a frame round its new notes, one tag, one Keep all / Discard all.
    for (const page of pages) {
      await expect(page.locator("[data-suggestion-frame]")).toHaveCount(1);
      await expect(page.locator("[data-suggestion-tag]")).toHaveCount(2); // the group's, and the removal's on its real note
      await expect(page.locator("[data-suggestion-group] > [data-suggestion-tag]").first()).toContainText("Ada's agent · via Claude · 2 notes");
    }
    // Only the editor has buttons: Keep all / Discard all, the removal's Remove / Discard, and each
    // ghost's own Keep / Discard (shown under the pointer); the line has none. The viewer has none.
    await expect(editor.locator('[data-suggestion-button="keep-all"]')).toBeVisible();
    await expect(editor.locator('[data-suggestion-button="discard-all"]')).toBeVisible();
    await expect(editor.locator('[data-suggestion="link:brief->idea1"] [data-suggestion-button]')).toHaveCount(0);
    await expect(editor.locator('[data-suggestion="add:idea1"] [data-suggestion-button="keep"]')).toBeHidden();
    await expect(viewer.locator("[data-suggestion-button]")).toHaveCount(0);
    // No label covers another.
    const groups = await editor.evaluate(() => (window as any).ghosts.groups());
    expect(groups).toHaveLength(1);
    const hit = (a: any, b: any) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
    expect(hit(groups[0].tag, groups[0].all)).toBe(false);
    // The agent's own tag keeps off the group's tag and its Keep all / Discard all, wherever it points.
    const labels = (page: Page) => page.evaluate(() => {
      const box = (el: Element) => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height } };
      return {
        agent: [...document.querySelectorAll("[data-agent-tag]")].map(box),
        groups: [...document.querySelectorAll("[data-suggestion-tag], [data-suggestion-all]")].map(box),
      };
    });
    for (const page of pages) {
      await expect.poll(async () => {
        const { agent, groups: drawn } = await labels(page);
        return agent.length === 1 && drawn.length >= 2 && !drawn.some((g) => hit(agent[0], g));
      }).toBe(true);
    }

    // ---- Keep, right on the ghost: the pointer over it shows its own buttons (a real click) -----
    await editor.locator('[data-suggestion-hit="add:idea1"]').hover();
    await expect(editor.locator('[data-suggestion="add:idea1"] [data-suggestion-button="keep"]')).toBeVisible();
    if (shots) await editor.screenshot({ path: `${shots}/engine-ghost-hover.png` });
    await editor.locator('[data-suggestion="add:idea1"] [data-suggestion-button="keep"]').click();
    for (const page of pages) {
      await expect.poll(() => notesOn(page)).toEqual(["brief", "ghost-idea2", "idea1", "old"]);
      await expect.poll(() => ghostsOn(page)).toEqual(["add:idea2", "link:brief->idea1", "remove:old"]);
    }
    if (shots) await viewer.screenshot({ path: `${shots}/engine-kept-on-viewer.png` });

    // ---- Discard, right on the ghost (by keyboard: focus shows its buttons) ----------------------
    await editor.locator('[data-suggestion-hit="add:idea2"]').focus();
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

// A phone: no hover, so a tap on a ghost shows its own Keep and Discard and another tap hides them. The host keeps
// publishing (every change to any suggestion reaches every page) while the finger is down and after: that must neither
// replace the ghost under the finger nor hide what the tap showed. Run on chromium and webkit (touch).
test.describe("agent suggestions on a touch screen", () => {
  test.use({ hasTouch: true, viewport: { width: 390, height: 760 } });

  test("a tap shows a ghost's own Keep and Discard, through the host publishing again; another tap hides them", async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);
    await page.evaluate(async () => {
      const w = window as any;
      const div = document.getElementById("app")!;
      div.style.width = "390px";
      div.style.height = "700px";
      const slate = await new w.Slatebox.slate({ container: "app", id: "touch-ghosts" }, {}).init();
      w.slate = slate;
      slate.v2.nodes.add({ id: "brief", text: "Checkout", x: 20, y: 20, width: 160, height: 80 });
      const { createAgentPresence } = await import("/src/core/AgentPresence.ts");
      const { createAgentSuggestions } = await import("/src/core/AgentSuggestions.ts");
      // Notes big enough on a phone's zoomed-out view that a finger can tap a ghost beside its own buttons.
      const node = (id: string, text: string, x: number, y: number) => ({ options: { id, text, xPos: x, yPos: y, width: 420, height: 260 }, relationships: { associations: [] } });
      w.action = {
        actionId: "act-1", agentId: "ag-1", label: "Exa", initial: "E", colorIndex: 3, origin: "invited", invitedBy: "Ada", items: [
          { id: "add:a", kind: "add", state: "pending", nodeId: "a", node: node("a", "Retry later", 20, 200) },
          { id: "add:b", kind: "add", state: "pending", nodeId: "b", node: node("b", "Other card", 20, 560) },
          { id: "link:ab", kind: "link", state: "pending", parentId: "a", association: { id: "ab", parentId: "a", childId: "b" } },
        ],
      };
      w.kept = [];
      w.ghosts = createAgentSuggestions(slate, { canAct: () => true, onKeep: (ref: any) => w.kept.push(ref.itemId) });
      w.ghosts.set([structuredClone(w.action)]);
      w.pointers = createAgentPresence(slate.v2, { reducedMotion: () => true });
      w.pointers.set([{ agentKey: "run-1", agentId: "ag-1", label: "Exa", initial: "E", colorIndex: 3, origin: "invited", invitedBy: "Ada",
        targets: ["ghost-a", "ghost-b"], status: "live", step: "Done", updatedAt: Date.now(), expiresAt: Date.now() + 60_000 }]);
      // The host publishing the same records again and again, as a busy slate's subscription does.
      w.republish = setInterval(() => w.ghosts.set([structuredClone(w.action)]), 30);
    });
    const shown = () => page.evaluate(() => [...document.querySelectorAll("[data-suggestion-controls]")]
      .filter((el) => (el as SVGGElement).style.display !== "none").map((el) => el.getAttribute("data-suggestion-controls")));
    const hitA = page.locator('[data-suggestion-hit="add:a"]');
    await expect(hitA).toHaveCount(1);
    expect(await shown()).toEqual([]);
    await hitA.tap();
    await expect.poll(shown).toEqual(["add:a"]);
    await expect(page.locator('[data-suggestion-controls="add:a"] [data-suggestion-button="keep"]')).toBeVisible();
    // Still shown after many more publishes: wait for a fixed number of them, not for time.
    await page.evaluate(() => new Promise<void>((resolve) => {
      const w = window as any;
      let left = 10;
      const set = w.ghosts.set;
      w.ghosts.set = (next: any) => { set(next); if (--left === 0) { w.ghosts.set = set; resolve(); } };
    }));
    expect(await shown()).toEqual(["add:a"]);
    // Another tap on it hides them (on its top left: its buttons sit at its bottom right); a tap on the other ghost shows its own.
    await hitA.tap({ position: { x: 12, y: 12 } });
    await expect.poll(shown).toEqual([]);
    await page.locator('[data-suggestion-hit="add:b"]').tap({ position: { x: 12, y: 12 } });
    await expect.poll(shown).toEqual(["add:b"]);
    // Its Keep works by touch too.
    await page.locator('[data-suggestion-controls="add:b"] [data-suggestion-button="keep"]').tap();
    await expect.poll(() => page.evaluate(() => (window as any).kept)).toEqual(["add:b"]);
    await page.evaluate(() => clearInterval((window as any).republish));
  });

  test("a tap on a ghost smaller than its buttons shows them and presses none of them (the click after the tap lands on them)", async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);
    await page.evaluate(async () => {
      const w = window as any;
      const div = document.getElementById("app")!;
      div.style.width = "390px";
      div.style.height = "700px";
      const slate = await new w.Slatebox.slate({ container: "app", id: "small-ghost" }, {}).init();
      const { createAgentSuggestions } = await import("/src/core/AgentSuggestions.ts");
      w.calls = [];
      const ghosts = createAgentSuggestions(slate, { canAct: () => true, onKeep: (ref: any) => w.calls.push("keep " + ref.itemId), onDiscard: (ref: any) => w.calls.push("discard " + ref.itemId) });
      // A phone's zoomed-out view: the ghost is smaller on screen than its Keep and Discard.
      ghosts.set([{ actionId: "act-1", label: "Exa", colorIndex: 3, items: [
        { id: "add:a", kind: "add", state: "pending", nodeId: "a", node: { options: { id: "a", text: "Idea", xPos: 40, yPos: 200, width: 150, height: 80 } } },
      ] }]);
    });
    const hit = page.locator('[data-suggestion-hit="add:a"]');
    // The buttons, once shown, cover the ghost's middle: that is where the browser's click for the tap lands.
    // Only once the slate's fitted view is on (the ghost drawn zoomed out, the buttons at screen size): poll until it is.
    const covers = () => page.evaluate(() => {
      const hitBox = document.querySelector('[data-suggestion-hit="add:a"]')!.getBoundingClientRect();
      const row = document.querySelector('[data-suggestion-controls="add:a"]') as SVGGElement;
      row.style.display = ""; row.style.visibility = "";
      const r = row.getBoundingClientRect();
      row.style.display = "none"; row.style.visibility = "hidden";
      return r.width > hitBox.width;
    });
    await expect.poll(covers).toBe(true);
    await hit.tap();
    await expect(page.locator('[data-suggestion-controls="add:a"] [data-suggestion-button="discard"]')).toBeVisible();
    // The tap's focus is on the ghost it tapped, never on the Discard (or Keep) that appeared under the finger.
    const focused = () => page.evaluate(() => {
      const el = document.activeElement;
      return el?.closest("[data-suggestion-button]")?.getAttribute("data-suggestion-button") ?? el?.getAttribute("data-suggestion-hit") ?? el?.tagName ?? null;
    });
    await expect.poll(focused).toBe("add:a");
    // The tap's click is done once a second tap's events have come and gone; nothing was kept or discarded.
    await page.locator("#app").tap({ position: { x: 380, y: 20 } });
    expect(await page.evaluate(() => (window as any).calls)).toEqual([]);
  });

  test("an action card (a change outside Slatebox) shows Approve and Decline on a tap and by keyboard; its frame has no Keep all", async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);
    await page.evaluate(async () => {
      const w = window as any;
      const div = document.getElementById("app")!;
      div.style.width = "390px";
      div.style.height = "700px";
      const slate = await new w.Slatebox.slate({ container: "app", id: "card-ghost" }, {}).init();
      const { createAgentSuggestions } = await import("/src/core/AgentSuggestions.ts");
      w.calls = [];
      w.ghosts = createAgentSuggestions(slate, { canAct: () => true, onKeep: (ref: any) => w.calls.push("keep " + ref.itemId), onDiscard: (ref: any) => w.calls.push("discard " + ref.itemId), onTryAgain: (ref: any) => w.calls.push("again " + ref.itemId) });
      w.card = (state: string) => [{ actionId: "act-1", label: "Linear", colorIndex: 2, origin: "invited", invitedBy: "Ada", items: [
        { id: "add:card", kind: "add", state: "pending", nodeId: "card", card: { id: "oCard1234", state },
          node: { options: { id: "card", text: "Create Linear issue: Retry fails on 502", xPos: 20, yPos: 200, width: 420, height: 260 } } },
      ] }];
      w.ghosts.set(w.card("waiting"));
    });
    const hit = page.locator('[data-suggestion-hit="add:card"]');
    await expect(hit).toHaveCount(1);
    await expect(page.locator("[data-suggestion-all]")).toHaveCount(0);
    await hit.tap({ position: { x: 12, y: 12 } });
    const approve = page.locator('[data-suggestion-controls="add:card"] [data-suggestion-button="keep"]');
    const decline = page.locator('[data-suggestion-controls="add:card"] [data-suggestion-button="discard"]');
    await expect(approve).toBeVisible();
    await expect(approve).toHaveText("Approve");
    await expect(approve).toHaveAttribute("aria-label", "Approve the suggestion from Linear, added by Ada: “Create Linear issue: Retry fails on 502”");
    await expect(decline).toHaveText("Decline");
    await approve.tap();
    await expect.poll(() => page.evaluate(() => (window as any).calls)).toEqual(["keep add:card"]);
    // By keyboard: Enter on Decline declines it.
    await decline.focus();
    await page.keyboard.press("Enter");
    await expect.poll(() => page.evaluate(() => (window as any).calls)).toEqual(["keep add:card", "discard add:card"]);
    // Maybe made already: Try again anyway, by a tap of its own.
    await page.evaluate(() => (window as any).ghosts.set((window as any).card("unclear")));
    const again = page.locator('[data-suggestion-controls="add:card"] [data-suggestion-button="keep"]');
    await expect(again).toHaveCount(1);
    // Its buttons may still show from before (the same ghost kept the focus): a tap would hide them then.
    if (!(await again.isVisible())) await hit.tap({ position: { x: 12, y: 12 } });
    await expect(again).toBeVisible();
    await expect(again).toHaveText("Try again anyway");
    await again.tap();
    await expect.poll(() => page.evaluate(() => (window as any).calls.at(-1))).toBe("again add:card");
  });
});

// While an agent works, its own tag never covers a group's tag or its Keep all / Discard all at full strength: measured on
// every frame (requestAnimationFrame) while the pointer glides across them, at 50, 100 and 200%. Where the tag has to pass
// over them it is faint (at most 0.35) and lets clicks through. Its words say what it is doing: "Suggesting…" on its way to
// its ghosts, "Waiting for you" once its group waits, never "Done" while it does.
test.describe("an agent's tag and a suggestion group's labels", () => {
  test("never overlap at full strength on any frame, at 50, 100 and 200%; the tag says Suggesting…, then Waiting for you", async ({ page }) => {
    await page.setViewportSize({ width: 1000, height: 640 });
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);
    await page.evaluate(async () => {
      const w = window as any;
      const div = document.getElementById("app")!;
      div.style.width = "1000px";
      div.style.height = "640px";
      const slate = await new w.Slatebox.slate({ container: "app", id: "labels-frames" }, {}).init();
      w.slate = slate;
      slate.v2.nodes.add({ id: "brief", text: "Launch plan", x: 40, y: 40, width: 180, height: 80 });
      const { createAgentPresence } = await import("/src/core/AgentPresence.ts");
      const { createAgentSuggestions } = await import("/src/core/AgentSuggestions.ts");
      const node = (id: string, text: string, x: number, y: number) => ({ options: { id, text, xPos: x, yPos: y, width: 170, height: 90 }, relationships: { associations: [] } });
      w.ghosts = createAgentSuggestions(slate, { canAct: () => true });
      w.ghosts.set([{ actionId: "act-1", agentId: "ag-1", label: "Exa", initial: "E", colorIndex: 3, origin: "invited", invitedBy: "Ada", items: [
        { id: "add:a", kind: "add", state: "pending", nodeId: "a", node: node("a", "Sign up", 300, 260) },
        { id: "add:b", kind: "add", state: "pending", nodeId: "b", node: node("b", "Activate", 520, 260) },
        { id: "add:c", kind: "add", state: "pending", nodeId: "c", node: node("c", "Retain", 410, 400) },
      ] }]);
      // A real glide (not reduced motion), as on a person's screen.
      w.pointers = createAgentPresence(slate.v2, { reducedMotion: () => false });
      w.record = { agentKey: "run-1", agentId: "ag-1", label: "Exa", initial: "E", colorIndex: 3, origin: "invited", invitedBy: "Ada",
        targets: [], status: "live", updatedAt: Date.now(), expiresAt: Date.now() + 600_000 };
      // Every frame: the agent's tag against every group label, and the tag's opacity as painted (its own and every parent's).
      const st = w.frames = { frames: 0, overlapFull: 0, overlapDim: 0, worst: null as any, words: new Set<string>() };
      const strength = (el: Element) => { let op = 1; for (let n: Element | null = el; n; n = n.parentElement) op *= Number(getComputedStyle(n).opacity); return op };
      const tick = () => {
        st.frames++;
        const tag = document.querySelector("[data-agent-tag]");
        if (tag) {
          st.words.add(tag.textContent || "");
          const a = tag.getBoundingClientRect();
          const over = [...document.querySelectorAll("[data-suggestion-tag], [data-suggestion-all]")].some((el) => {
            const b = el.getBoundingClientRect();
            return b.width > 0 && a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
          });
          if (over) {
            const op = strength(tag);
            if (op > 0.35) { st.overlapFull++; st.worst ??= { op, a: [a.x, a.y, a.width, a.height].map(Math.round) } } else st.overlapDim++;
          }
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    // The record goes to an empty spot in world units; its pointer glides there from where it is.
    const goTo = (x: number, y: number) => page.evaluate(({ x, y }) => {
      const w = window as any;
      w.record = { ...w.record, point: { x, y }, updatedAt: Date.now() };
      w.pointers.set([w.record]);
    }, { x, y });
    const settle = () => page.evaluate(() => new Promise<void>((resolve) => {
      let last = "", same = 0;
      const tick = () => {
        const tag = document.querySelector("[data-agent]");
        const now = tag ? tag.getAttribute("transform") || "" : "";
        same = now === last ? same + 1 : 0; last = now;
        if (same >= 10) return resolve();
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }));
    let dimmedSomewhere = 0;
    for (const level of [1, 0.5, 2]) {
      await page.evaluate((level) => (window as any).slate.v2.zoom(level), level);
      // The group's tag row in world units, read from the screen: the glide crosses it from left to right and back, the
      // tag (40px right of and 30px under the pointer) level with it.
      const row = await page.evaluate(() => {
        const svg = (window as any).slate.v2.canvas.node as SVGSVGElement;
        const m = svg.getScreenCTM()!.inverse();
        const r = document.querySelector("[data-suggestion-tag]")!.getBoundingClientRect();
        const a = new DOMPoint(r.left, r.top).matrixTransform(m), b = new DOMPoint(r.right, r.bottom).matrixTransform(m);
        const k = (b.x - a.x) / r.width;
        return { left: a.x - 260 * k, right: b.x + 200 * k, y: a.y - 36 * k };
      });
      await page.evaluate(() => { const st = (window as any).frames; (window as any).before = st.overlapDim; });
      for (const x of [row.left, row.right, row.left, row.right]) { await goTo(x, row.y); await settle(); }
      dimmedSomewhere += await page.evaluate(() => (window as any).frames.overlapDim - (window as any).before);
      const st = await page.evaluate(() => { const s = (window as any).frames; return { frames: s.frames, overlapFull: s.overlapFull, worst: s.worst } });
      expect(st.overlapFull, `zoom ${level * 100}%: ${JSON.stringify(st)}`).toBe(0);
    }
    // The glide did pass over the labels (so the check above saw something): faint every time it did.
    expect(dimmedSomewhere).toBeGreaterThan(0);
    // While faint over Keep all, the tag takes no clicks: Keep all under it stays reachable.
    expect(await page.evaluate(() => [...document.querySelectorAll("[data-agent][data-agent-dimmed] [data-agent-tag]")].every((el) => el.getAttribute("pointer-events") === "none"))).toBe(true);

    // Its words: on its way to its ghosts "Suggesting…"; arrived with its group waiting, "Waiting for you"; never "Done".
    await page.evaluate(() => (window as any).slate.v2.zoom(1));
    await page.evaluate(() => {
      const w = window as any;
      w.frames.words.clear();
      const steps = ["Ask Exa", "Read what it found", "Place suggestions"].map((text) => ({ text, status: "done" }));
      // The run ended (all its steps done) as its suggestion was filed: the pointer still has to get to the ghosts.
      w.record = { ...w.record, point: { x: 380, y: 250 }, targets: ["ghost-a", "ghost-b", "ghost-c"], plan: { steps, current: 2 }, status: "done",
        endedAt: Date.now(), updatedAt: Date.now(), expiresAt: Date.now() + 60_000, waiting: true };
      w.pointers.set([w.record]);
    });
    await expect.poll(() => page.evaluate(() => document.querySelector("[data-agent-tag]")?.textContent || "")).toContain("Waiting for you");
    const words = await page.evaluate(() => [...(window as any).frames.words].join(" | "));
    expect(words).toContain("Suggesting…");
    expect(words).not.toContain("Done");
    // Kept: nothing waits any more, so now it is done.
    await page.evaluate(() => { const w = window as any; w.record = { ...w.record, waiting: false, targets: [], updatedAt: Date.now() }; w.pointers.set([w.record]); });
    await expect.poll(() => page.evaluate(() => document.querySelector("[data-agent-tag]")?.textContent || "")).toContain("Done");
  });
});
