import type { Page } from "@playwright/test";

/** Return the newly created guest-owned slate URL to multi-session proofs. */
export async function bootstrapGuestSlate(page: Page, appUrl: string) {
  await openGuestCanvas(page, appUrl);
  return page.url();
}

/**
 * Enter the production editor through blank-slate onboarding in a fresh guest session. A new slate
 * starts empty (the app's welcome invites the first note), so the proof's first note, "Welcome!" by
 * default, is made here: the way the welcome's "Add a note" makes one, in the middle of the view,
 * saved and shared. `firstNote: null` leaves the slate empty.
 */
export async function openGuestCanvas(page: Page, appUrl: string, { firstNote = "Welcome!" as string | null } = {}) {
  await page.goto(appUrl + "/start");
  await page.waitForURL(/\/canvas\//);
  await canvasReady(page);
  const welcome = page.getByRole("dialog", { name: /welcome/i });
  if (await welcome.waitFor({state:"visible",timeout:2500}).then(()=>true,()=>false)) {
    await welcome.getByRole("button", {name:"OK"}).click();
    await welcome.waitFor({state:"hidden"});
  }
  if (firstNote) await seedFirstNote(page, firstNote);
}

/** The slate's engine is on the page (its notes, if it has any, are being drawn). */
export async function canvasReady(page: Page) {
  await page.waitForFunction(() =>
    (window as any).__slateboxInstances?.some((s: any) => s.element?.id === "slateCanvas") &&
      Boolean((window as any).slate?.v2?.canvas)
  );
}

/**
 * A new slate's first note, made as the welcome's "Add a note" makes it: in the middle of what the
 * canvas shows, in the default note look, named `text`. Waits until it is drawn and stored, so a
 * second page or a reload has it. Does nothing on a slate that already holds a note.
 */
export async function seedFirstNote(page: Page, text = "Welcome!") {
  await canvasReady(page);
  const added = await page.evaluate((text) => {
    const v2 = (window as any).slate.v2;
    if (v2.getAllNodes().length) return false;
    const box = document.getElementById("slateCanvas")!.getBoundingClientRect();
    const at = v2.canvas.point(box.left + box.width / 2, box.top + box.height / 2);
    const width = 160, height = 68;
    v2.addNode({ x: Math.round(at.x - width / 2), y: Math.round(at.y - height / 2), width, height, text,
      shape: "roundedrectangle", backgroundColor: "#40709a", fontColor: "#ffffff", fontFamily: "Manrope", fontSize: 18, borderWidth: 0 });
    return true;
  }, text);
  // A slate that already holds notes keeps them as they are (its first note may say anything by now).
  if (!added) return;
  await page.locator("#slateCanvas [data-node-id]").filter({ hasText: text }).first().waitFor();
  const shareId = new URL(page.url()).pathname.split("/").pop();
  for (let tries = 0; tries < 60; tries++) {
    const stored = await page.evaluate(async ([shareId, text]) => {
      const found = await (window as any).Meteor.callAsync("slates.get", { shareId }).catch(() => null);
      return Boolean(found?.slateBase?.nodes?.some((n: any) => n.options?.text === text));
    }, [shareId, text] as const);
    if (stored) return;
    await page.waitForTimeout(250);
  }
  throw new Error(`The first note "${text}" was not saved.`);
}
