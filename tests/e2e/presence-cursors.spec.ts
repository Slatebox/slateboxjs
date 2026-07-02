import { test, expect } from "@playwright/test";

// Regression guard for collaborator presence cursors (commit 3b44d20).
// Collab has updateCursor()/renderCursor() but they were never wired: no
// pointer tracking, no render-on-awareness. This verifies, through the real
// y-websocket relay, that A's cursor is broadcast and rendered on B.
test.describe("presence cursors (§I)", () => {
  test("remote cursor is broadcast via awareness and rendered on the peer", async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const result = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const room = "cursor-room-" + Math.random().toString(36).slice(2);

      const mkSlate = async (containerId: string, userName: string) => {
        const div = document.createElement("div");
        div.id = containerId;
        div.style.width = "600px";
        div.style.height = "400px";
        document.body.appendChild(div);
        const s = await new sb.slate(
          { container: containerId, id: room, allowCollaboration: true },
          {
            onInitCollaboration: async () => ({
              websocketUrl: "ws://localhost:1234",
              websocketParams: { bearer: "test-bearer", timestamp: "1" },
              userName,
              color: "#12ab34",
            }),
          }
        ).init();
        return s;
      };

      const waitFor = async (cond: () => boolean, ms: number) => {
        const start = Date.now();
        while (!cond() && Date.now() - start < ms) {
          await new Promise((r) => setTimeout(r, 100));
        }
        return cond();
      };

      const a = await mkSlate("curA", "Alice");
      const b = await mkSlate("curB", "Bob");

      const connected = await waitFor(
        () =>
          a.v2.collab.isCollabConnected() && b.v2.collab.isCollabConnected(),
        15000
      );

      // A broadcasts a cursor position (world coords)
      a.v2.collab.updateCursor(220, 140);

      // B should, via awareness, learn of A's cursor and render it
      const rendered = await waitFor(() => {
        const users = b.v2.collab.getCollabUsers();
        const hasCursor = users.some((u: any) => u.cursor);
        const dom = document
          .querySelector("#curB")
          ?.querySelectorAll("polygon");
        const triangle = dom
          ? Array.from(dom).some((p) =>
              (p.getAttribute("points") || "").includes("0,15")
            )
          : false;
        return hasCursor && triangle;
      }, 8000);

      const bUsers = b.v2.collab.getCollabUsers();
      const aFromB = bUsers.find((u: any) => u.cursor);
      const bCursorEls = b.v2.collab.cursorElements?.size ?? -1;

      // A should NOT render its own cursor (self is skipped)
      const aRendersSelf = a.v2.collab
        .getCollabUsers()
        .some((u: any) => u.userName === "Alice");

      return {
        connected,
        rendered,
        remoteName: aFromB?.userName,
        remoteCursor: aFromB?.cursor
          ? { x: Math.round(aFromB.cursor.x), y: Math.round(aFromB.cursor.y) }
          : null,
        bCursorEls,
        aRendersSelf,
      };
    });

    expect(result.connected).toBe(true);
    expect(result.rendered).toBe(true);
    expect(result.remoteName).toBe("Alice");
    expect(result.remoteCursor).toEqual({ x: 220, y: 140 });
    expect(result.bCursorEls).toBe(1);
    expect(result.aRendersSelf).toBe(false);
  });
});
