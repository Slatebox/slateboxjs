import type { Page } from "@playwright/test";

/** Return the newly created guest-owned slate URL to multi-session proofs. */
export async function bootstrapGuestSlate(page: Page, appUrl: string) {
  await openGuestCanvas(page, appUrl);
  return page.url();
}

/** Enter the production editor through blank-slate onboarding in a fresh guest session. */
export async function openGuestCanvas(page: Page, appUrl: string) {
  await page.goto(appUrl + "/start");
  await page.waitForURL(/\/canvas\//);
  await page.locator("#slateCanvas [data-node-id]").first().waitFor();
  const welcome = page.getByRole("dialog", { name: /welcome/i });
  if (await welcome.waitFor({state:"visible",timeout:2500}).then(()=>true,()=>false)) {
    await welcome.getByRole("button", {name:"OK"}).click();
    await welcome.waitFor({state:"hidden"});
  }
  await page.waitForFunction(() =>
    (window as any).__slateboxInstances?.some((s: any) =>
      s.element?.id === "slateCanvas" && s.nodes.allNodes.length > 0
    )
  );
}
