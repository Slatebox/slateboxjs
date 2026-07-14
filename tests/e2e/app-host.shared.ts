import type { Page } from "@playwright/test";

async function visible(page: Page, name: string, timeout = 2_000) {
  const locator = page.getByText(name, { exact: true }).first();
  return locator
    .waitFor({ state: "visible", timeout })
    .then(() => locator)
    .catch(() => null);
}

/** Create a guest slate through whichever onboarding flow the app exposes. */
export async function bootstrapGuestSlate(page: Page, appUrl: string) {
  await page.goto(appUrl);
  await page.waitForLoadState("domcontentloaded");

  // Current Meteor 3.5 onboarding: usage → profession → example prompt.
  const personal = await visible(page, "Personal Use", 30_000);
  if (personal) {
    await personal.click();
    const profession = await visible(page, "Consultant", 10_000);
    if (!profession) throw new Error("Guest onboarding did not show professions");
    await profession.click();
    const prompt = await visible(page, "Infographic for market analysis", 10_000);
    if (!prompt) throw new Error("Guest onboarding did not show example prompts");
    await prompt.click();
  } else {
    // Backward-compatible path retained so the gate remains useful across a
    // staged app rollout.
    const start = page.getByRole("button", { name: /Start now/ });
    if (await start.isVisible().catch(() => false)) await start.click();
    const ok = page.getByRole("button", { name: "OK" });
    if (await ok.isVisible().catch(() => false)) await ok.click();
    const create = page.getByRole("button", { name: "New", exact: true });
    await create.click({ timeout: 30_000 });
  }

  await page.waitForSelector("#slateCanvas [data-node-id]", {
    timeout: 60_000,
  });
  await page.waitForFunction(() => !!(window as any).slate, undefined, {
    timeout: 30_000,
  });
  return page.url();
}
