import { expect, test } from "@playwright/test";
import { openGuestCanvas } from "./app-host.shared";

const origin = process.env.SLATEBOX_APP_URL || "http://localhost:3000";

test.use({ viewport: { width: 1280, height: 720 } });

test("quick add opens under the pointer after the cookie notice is dismissed", async ({ page }) => {
  test.skip(!["localhost", "127.0.0.1", "test.slatebox.com"].includes(new URL(origin).hostname), "Creates a guest-owned test slate");
  await openGuestCanvas(page, origin);
  const accept = page.getByRole("button", { name: "Accept cookies" });
  const trigger = page.getByRole("button", { name: "Slatebox - quickly add a node" });
  await expect(accept).toBeVisible();

  // Click where the notice covers the launcher, so the pointer starts inside
  // the newly exposed button. Moving away first would mask the Firefox bug.
  const consent = (await accept.boundingBox())!;
  const x = consent.x + consent.width / 2;
  const y = consent.y + consent.height / 2;
  await accept.click();
  await expect(accept).toBeHidden();
  expect(await trigger.evaluate((button, point) => button.contains(document.elementFromPoint(point.x, point.y)), { x, y })).toBe(true);

  await trigger.hover();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  const addText = page.getByRole("button", { name: "Add Text", exact: true });
  await expect(addText).toBeVisible();
  await addText.click();
  const editor = page.locator("#txtNode");
  await expect(editor).toBeVisible();
  await editor.fill("Pointer note");
  await page.keyboard.press("Escape");
  await expect(page.locator("#slateCanvas")).toContainText("Pointer note");
});
