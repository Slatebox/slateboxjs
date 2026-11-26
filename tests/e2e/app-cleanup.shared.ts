import type { Browser, BrowserContext, Page, TestType } from "@playwright/test";
import { appendFileSync } from "node:fs";

/**
 * Disposable accounts never outlive the test that made them, on a local app or on staging
 * (test.slatebox.com, which has no job that removes old guests).
 *
 * Call `deleteDisposableAccounts(test)` once at the top of a spec. Every page the spec opens,
 * through the `page` fixture or `browser.newContext()` / `browser.newPage()`, deletes its
 * signed-in account (`users.delete`) before it closes, and again after each test. Only a
 * disposable account is ever deleted: a guest (`isAnonymous`) or an address on the reserved
 * `.invalid` top-level domain that specs sign up with. A fresh Playwright context never carries a
 * real person's login, and the guard makes sure of it.
 */
export function deleteDisposableAccounts(test: TestType<any, any>) {
  test.beforeEach(async ({ browser }: { browser: Browser }) => patchBrowser(browser));
  test.afterEach(async ({ page, context }: { page: Page; context: BrowserContext }, testInfo) => {
    // Deleting the account signs the page out: keep what a failed test saw first.
    if (testInfo.status !== testInfo.expectedStatus)
      for (const [i, open] of [...context.pages(), ...[...opened].flatMap((other) => other.pages())].entries())
        await open.screenshot({ path: testInfo.outputPath(`before-cleanup-${i}.png`) }).catch(() => null);
    for (const open of context.pages()) await deleteAccountOn(open);
    await deleteAccountOn(page);
    for (const other of opened) {
      for (const open of other.pages()) await deleteAccountOn(open);
      opened.delete(other);
    }
  });
}

const cleaned = new WeakSet<Page>();
// Every context a spec opened, so the accounts in one a failed test never closed are deleted too.
const opened = new Set<BrowserContext>();

/** Delete the disposable account signed in on `page`, if there is one. Never throws. */
export async function deleteAccountOn(page: Page) {
  if (page.isClosed() || cleaned.has(page)) return;
  cleaned.add(page);
  const result = await page.evaluate(async () => {
    const meteor = (window as any).Meteor;
    if (!meteor?.userId?.()) return null;
    const id: string = meteor.userId();
    // The account's own fields (isAnonymous, emails) arrive with the 'me' publication.
    const me = await new Promise<{ stop(): void } | null>((resolve) => {
      const handle = meteor.subscribe("me", { onReady: () => resolve(handle), onStop: () => resolve(null) });
      setTimeout(() => resolve(handle), 5000);
    });
    const user = meteor.user?.();
    me?.stop();
    if (!user) return { id, deleted: false, kept: "no account (already deleted)" };
    const address: string = user?.emails?.[0]?.address || "";
    if (user?.isAnonymous !== true && !/\.invalid$/i.test(address)) return { id, deleted: false, kept: "not disposable" };
    const deleted = await meteor.callAsync("users.delete").then(() => true, () => false);
    return { id, deleted };
  }).catch(() => null);
  // SLATEBOX_CLEANUP_LOG=<file> records every account removed, for a later check that none is left.
  if (result && process.env.SLATEBOX_CLEANUP_LOG) appendFileSync(process.env.SLATEBOX_CLEANUP_LOG, JSON.stringify(result) + "\n");
}

function patchBrowser(browser: Browser) {
  const marked = browser as Browser & { __disposable?: true };
  if (marked.__disposable) return;
  marked.__disposable = true;
  const newContext = browser.newContext.bind(browser);
  browser.newContext = async (...args: Parameters<Browser["newContext"]>) => patchContext(await newContext(...args));
  const newPage = browser.newPage.bind(browser);
  browser.newPage = async (...args: Parameters<Browser["newPage"]>) => {
    const page = await newPage(...args);
    patchContext(page.context());
    return patchPage(page);
  };
}

function patchContext(context: BrowserContext) {
  const marked = context as BrowserContext & { __disposable?: true };
  if (marked.__disposable) return context;
  marked.__disposable = true;
  opened.add(context);
  context.on("close", () => opened.delete(context));
  const close = context.close.bind(context);
  context.close = async (...args: Parameters<BrowserContext["close"]>) => {
    for (const page of context.pages()) await deleteAccountOn(page);
    return close(...args);
  };
  const newPage = context.newPage.bind(context);
  context.newPage = async () => patchPage(await newPage());
  return context;
}

function patchPage(page: Page) {
  const marked = page as Page & { __disposable?: true };
  if (marked.__disposable) return page;
  marked.__disposable = true;
  const close = page.close.bind(page);
  page.close = async (...args: Parameters<Page["close"]>) => {
    await deleteAccountOn(page);
    return close(...args);
  };
  return page;
}

/** Hosts a spec that makes disposable accounts may run against: a local app, or staging. */
export const disposableHost = (origin: string) =>
  ["localhost", "127.0.0.1", "test.slatebox.com"].includes(new URL(origin).hostname);
