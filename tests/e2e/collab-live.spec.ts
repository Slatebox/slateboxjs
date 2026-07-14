import { test, expect } from "@playwright/test";

// §I of docs/drop-in-contract.md: live two-client collaboration through a
// real y-websocket relay (tests/collab-server-standalone.cjs, started by
// playwright.config.ts). Two facade slates join the same room; a package
// sent by A must be applied on B via the Invoker, and presence must flow.
test.describe("live collab through the relay (§I)", () => {
  test("send() on client A applies on client B; presence propagates", async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const result = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const room = "live-room-" + Math.random().toString(36).slice(2);

      const mkSlate = async (containerId: string, userName: string) => {
        const div = document.createElement("div");
        div.id = containerId;
        div.style.width = "600px";
        div.style.height = "400px";
        document.body.appendChild(div);

        const received: any[] = [];
        const users: any[][] = [];
        const s = await new sb.slate(
          {
            container: containerId,
            id: room, // same slate id → same collab room
            allowCollaboration: true,
          },
          {
            // v1 contract: awaited, returns connection details + identity
            onInitCollaboration: async (_clientID: string) => ({
              websocketUrl: "ws://localhost:1234",
              websocketParams: { bearer: "test-bearer", timestamp: "1" },
              userName,
              color: "#12ab34",
            }),
            onCollaboration: (pkg: any) => received.push(pkg),
            onCollaborationUsersChanged: (u: any[]) => users.push(u),
          }
        ).init();
        return { s, received, users };
      };

      const a = await mkSlate("collabA", "UserA");
      const b = await mkSlate("collabB", "UserB");

      // Wait for both providers to connect (auto-init fires 100ms post-init)
      const waitFor = async (cond: () => boolean, ms: number) => {
        const start = Date.now();
        while (!cond() && Date.now() - start < ms) {
          await new Promise((r) => setTimeout(r, 100));
        }
        return cond();
      };

      const bothConnected = await waitFor(
        () =>
          a.s.v2.collab.isCollabConnected() &&
          b.s.v2.collab.isCollabConnected(),
        15000
      );

      // Create the same node on both sides (as the app does via its own
      // Collaboration relay for onNodeAdded), then push a text change A→B
      a.s.nodes.add(new sb.node({ id: "shared1", xPos: 50, yPos: 50, text: "init" }));
      b.s.nodes.add(new sb.node({ id: "shared1", xPos: 50, yPos: 50, text: "init" }));
      await new Promise((r) => setTimeout(r, 400));

      a.s.collab.send({
        type: "onNodeTextChanged",
        data: { id: "shared1", text: "hello from A" },
      });

      const textArrived = await waitFor(
        () => b.s.nodes.one("shared1")?.v2.options.text === "hello from A",
        10000
      );

      // Presence: B should eventually see 2 users incl. UserA
      const presenceArrived = await waitFor(
        () =>
          b.s.v2.collab
            .getCollabUsers()
            .some((u: any) => u.name === "UserA" || u.userName === "UserA"),
        10000
      );

      return {
        bothConnected,
        textArrived,
        bText: b.s.nodes.one("shared1")?.v2.options.text,
        bReceivedTypes: b.received.map((p: any) => p.type),
        presenceArrived,
        usersCallbackFired: b.users.length > 0,
      };
    });

    expect(result.bothConnected).toBe(true);
    expect(result.textArrived).toBe(true);
    expect(result.bText).toBe("hello from A");
    expect(result.bReceivedTypes).toContain("onNodeTextChanged");
    expect(result.presenceArrived).toBe(true);
    expect(result.usersCallbackFired).toBe(true);
  });
});
