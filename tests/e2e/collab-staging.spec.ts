import { test, expect } from "@playwright/test";
import { createHmac } from "crypto";

// STAGING CHECK (docs/collab-migration.md): two slateboxjs v3 clients
// through the REAL collab.slatebox.com server code (bin/server.js) with its
// production HMAC auth path. The server must be running locally:
//
//   cd ~/Projects/node/collab.slatebox.com && \
//   API_KEYS='[{"name":"slatebox","publicKey":"pk-staging-test","secretKey":"sk-staging-secret"}]' \
//   PORT=1122 node bin/server.js
//
// Skips automatically when the server is not up, so the regular suite stays
// green without it.

const SERVER = "http://localhost:1122";
const WS_URL = "ws://localhost:1122";
const PUBLIC_KEY = "pk-staging-test";
const SECRET_KEY = "sk-staging-secret";

/** Replicates src/auth/createHmacAuthToken.js + the app's bearer packing. */
function makeAuthParams() {
  const timestamp = new Date().toISOString();
  const hash = createHmac("sha256", SECRET_KEY)
    .update(`${PUBLIC_KEY}:${timestamp}`)
    .digest("base64");
  const bearer = Buffer.from(`${PUBLIC_KEY}:${hash}`).toString("base64");
  return { bearer, timestamp };
}

async function serverUp(): Promise<boolean> {
  try {
    const res = await fetch(SERVER, { signal: AbortSignal.timeout(1500) });
    return (await res.text()).includes("Rocking");
  } catch {
    return false;
  }
}

test.describe("collab staging vs production server (§I)", () => {
  test("HMAC-authenticated two-client sync through bin/server.js", async ({
    page,
  }) => {
    test.skip(!(await serverUp()), "collab.slatebox.com server not running");
    test.setTimeout(60_000);

    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const auth = makeAuthParams();
    const result = await page.evaluate(
      async ({ wsUrl, bearer, timestamp }) => {
        const sb = (window as any).Slatebox;
        const room = "staging-" + Math.random().toString(36).slice(2);

        const mk = async (cid: string, userName: string) => {
          const div = document.createElement("div");
          div.id = cid;
          div.style.cssText = "width:400px;height:300px";
          document.body.appendChild(div);
          const received: any[] = [];
          const s = await new sb.slate(
            { container: cid, id: room, allowCollaboration: true },
            {
              onInitCollaboration: async () => ({
                websocketUrl: wsUrl,
                websocketParams: { bearer, timestamp },
                userName,
                color: "#3399ff",
              }),
              onCollaboration: (pkg: any) => received.push(pkg),
            }
          ).init();
          return { s, received };
        };

        const a = await mk("stgA", "StagingA");
        const b = await mk("stgB", "StagingB");

        const waitFor = async (cond: () => boolean, ms: number) => {
          const start = Date.now();
          while (!cond() && Date.now() - start < ms) {
            await new Promise((r) => setTimeout(r, 150));
          }
          return cond();
        };

        const connected = await waitFor(
          () =>
            a.s.v2.collab.isCollabConnected() &&
            b.s.v2.collab.isCollabConnected(),
          20000
        );
        if (!connected) return { connected: false } as any;

        // Same node both sides, then a burst of packages A→B (GC/growth probe)
        a.s.nodes.add(new sb.node({ id: "stg1", xPos: 10, yPos: 10, text: "0" }));
        b.s.nodes.add(new sb.node({ id: "stg1", xPos: 10, yPos: 10, text: "0" }));
        await new Promise((r) => setTimeout(r, 400));

        for (let i = 1; i <= 20; i++) {
          a.s.collab.send({
            type: "onNodeTextChanged",
            data: { id: "stg1", text: `v${i}` },
          });
        }

        const synced = await waitFor(
          () => b.s.nodes.one("stg1")?.v2.options.text === "v20",
          15000
        );

        // Growth probe: the shared map size after the burst
        const mapSize = (a.s.v2.collab as any).collabMap?.size ?? -1;

        // Presence through the real server
        const presence = await waitFor(
          () =>
            b.s.v2.collab
              .getCollabUsers()
              .some((u: any) => u.userName === "StagingA"),
          10000
        );

        return {
          connected: true,
          synced,
          bText: b.s.nodes.one("stg1")?.v2.options.text,
          received: b.received.filter(
            (p: any) => p.type === "onNodeTextChanged"
          ).length,
          mapSize,
          presence,
        };
      },
      { wsUrl: WS_URL, bearer: auth.bearer, timestamp: auth.timestamp }
    );

    expect(result.connected).toBe(true);
    expect(result.synced).toBe(true);
    expect(result.bText).toBe("v20");
    expect(result.received).toBeGreaterThanOrEqual(20);
    expect(result.presence).toBe(true);
    // Growth semantics documented in docs/collab-migration.md: v3 appends
    // unique keys, so the burst should be visible in the map
    expect(result.mapSize).toBeGreaterThanOrEqual(20);
  });

  test("invalid bearer cannot exchange document state", async ({
    browser,
  }) => {
    test.skip(!(await serverUp()), "collab.slatebox.com server not running");
    test.setTimeout(60_000);

    // KNOWN SERVER QUIRK (pre-existing, see docs/collab-migration.md):
    // bin/server.js sends "Unauthenticated" on a failed HMAC check but never
    // ws.close()es, so the socket stays open and clients report a
    // "connected" status. The security invariant that DOES hold — and what
    // this test asserts — is that no yjs document state flows either way.
    //
    // The two clients live in SEPARATE browser contexts so y-websocket's
    // same-origin BroadcastChannel shortcut cannot deliver state locally —
    // the server is the only possible path.
    const room = "authprobe-" + Math.random().toString(36).slice(2);
    const auth = makeAuthParams();

    const mkClient = async (params: Record<string, string>, name: string) => {
      const ctx = await browser.newContext();
      const p = await ctx.newPage();
      await p.goto("/test.html");
      await p.waitForFunction(() => (window as any).Slatebox);
      await p.evaluate(
        async ({ wsUrl, prms, userName, roomId }: any) => {
          const sb = (window as any).Slatebox;
          const div = document.createElement("div");
          div.id = "stg";
          document.body.appendChild(div);
          const s = await new sb.slate(
            { container: "stg", id: roomId, allowCollaboration: true },
            {
              onInitCollaboration: async () => ({
                websocketUrl: wsUrl,
                websocketParams: prms,
                userName,
                color: "#f00",
              }),
            }
          ).init();
          (window as any).__slate = s;
        },
        { wsUrl: WS_URL, prms: params, userName: name, roomId: room }
      );
      return { ctx, p };
    };

    const legit = await mkClient(auth, "Legit");
    const mallory = await mkClient(
      {
        bearer: Buffer.from("pk-staging-test:WRONGHASH").toString("base64"),
        timestamp: new Date().toISOString(),
      },
      "Mallory"
    );

    // Legit publishes state into the room
    await legit.p.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const s = (window as any).__slate;
      s.nodes.add(new sb.node({ id: "secret1", xPos: 5, yPos: 5, text: "s" }));
      await new Promise((r) => setTimeout(r, 500));
      s.collab.send({
        type: "onNodeTextChanged",
        data: { id: "secret1", text: "classified" },
      });
    });
    await mallory.p.waitForTimeout(4000);

    const malloryState = await mallory.p.evaluate(() => {
      const s = (window as any).__slate;
      return {
        mapSize: (s.v2.collab as any).collabMap?.size ?? -1,
        users: s.v2.collab.getCollabUsers().length,
      };
    });

    await legit.ctx.close();
    await mallory.ctx.close();

    expect(malloryState.mapSize).toBe(0);
    expect(malloryState.users).toBe(0);
  });
});
