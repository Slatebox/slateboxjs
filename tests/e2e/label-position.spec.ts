import { expect, test, type Page } from "@playwright/test";

// A line's label sits in the middle of the drawn line unless the line says where (labelPosition,
// 0.05 near its start to 0.95 near its end). Two lines between the same two notes run along one
// path; placed apart, their labels stop covering each other. Kept through a save and a load.

async function openBoard(page: Page) {
  await page.goto("/test.html");
  await page.waitForFunction(() => (window as any).Slatebox);
  await page.evaluate(async () => {
    const w = window as any;
    const sb = w.Slatebox;
    const div = document.createElement("div");
    div.id = "board";
    div.style.cssText = "position:fixed;left:0;top:0;width:1000px;height:700px;background:white";
    document.body.replaceChildren(div);
    const s = await new sb.slate({ container: "board", allowCollaboration: false, showbirdsEye: false, contextToolbar: "host" }, {}).init();
    s.nodes.add(new sb.node({ id: "a", xPos: 100, yPos: 300, width: 150, height: 80, text: "Client" }));
    s.nodes.add(new sb.node({ id: "b", xPos: 700, yPos: 300, width: 150, height: 80, text: "Server" }));
    await Promise.all(s.v2.getAllNodes().map((n: any) => n.ready));
    s.v2.getNode("a").relationships.addAssociation(s.v2.getNode("b"), { id: "a->b", label: "request" });
    s.v2.getNode("b").relationships.addAssociation(s.v2.getNode("a"), { id: "b->a", label: "response" });
    await new Promise((r) => setTimeout(r, 300));
    w.s = s;
  });
}

// Each label's centre, left to right.
const labels = (page: Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll("#board text")]
      .filter((t) => ["request", "response"].includes(t.textContent || ""))
      .map((t) => {
        const r = t.getBoundingClientRect();
        return { text: t.textContent, x: r.x + r.width / 2, left: r.left, right: r.right };
      })
      .sort((p, q) => p.x - q.x),
  );
const place = (page: Page, id: string, owner: string, val: number) =>
  page.evaluate(
    ({ id, owner, val }) => {
      const s = (window as any).s;
      const pkg = { type: "onLinePropertiesChanged", data: { id: owner, associationId: id, prop: "labelPosition", val } };
      s.collab.invoke([pkg]);
      s.collab.send([pkg]);
    },
    { id, owner, val },
  );

test("labelPosition moves a label along its line, so two lines' labels keep apart", async ({ page }) => {
  await openBoard(page);
  const [first, second] = await labels(page);
  // Unset: both in the middle of one path, on top of each other.
  expect(first.right).toBeGreaterThan(second.left);
  await place(page, "a->b", "a", 0.3);
  await place(page, "b->a", "b", 0.3);
  const [left, right] = await labels(page);
  // Each sits nearer the note its line starts from, and they no longer overlap.
  expect(left.text).toBe("request");
  expect(right.text).toBe("response");
  expect(left.right).toBeLessThan(right.left);
  // Kept through a save and a load.
  const json = await page.evaluate(() => (window as any).s.exportJSON());
  const lines = JSON.parse(json).nodes.flatMap((n: any) => n.relationships.associations);
  expect(lines.find((l: any) => l.id === "a->b").labelPosition).toBe(0.3);
  await page.evaluate(async (json) => {
    await (window as any).s.loadJSON(json);
    await new Promise((r) => setTimeout(r, 300));
  }, json);
  const [again, other] = await labels(page);
  expect(again.text).toBe("request");
  expect(again.right).toBeLessThan(other.left);
});
