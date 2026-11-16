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
        // The styled cursor renders an arrow pointer polygon in #curB
        const dom = document
          .querySelector("#curB")
          ?.querySelectorAll("polygon");
        const pointer = dom
          ? Array.from(dom).some((p) =>
              (p.getAttribute("points") || "").includes("17")
            )
          : false;
        return hasCursor && pointer;
      }, 8000);

      const bUsers = b.v2.collab.getCollabUsers();
      const aFromB = bUsers.find((u: any) => u.cursor);
      const bCursorEls = b.v2.collab.cursorElements?.size ?? -1;

      // Styled label: white rounded-rect background + name in the user's color
      const curB = document.querySelector("#curB");
      const labelRect = curB
        ? Array.from(curB.querySelectorAll("rect")).find(
            (r) =>
              r.getAttribute("rx") === "6" &&
              (r.getAttribute("fill") || "").toLowerCase().includes("fff")
          )
        : null;
      const nameText = curB
        ? Array.from(curB.querySelectorAll("text")).find(
            (t) => t.textContent === "Alice"
          )
        : null;
      const styled = {
        hasWhiteRoundedLabel: !!labelRect,
        nameInUserColor:
          (nameText?.getAttribute("fill") || "").toLowerCase() === "#12ab34",
      };

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
        styled,
      };
    });

    expect(result.connected).toBe(true);
    expect(result.rendered).toBe(true);
    expect(result.remoteName).toBe("Alice");
    expect(result.remoteCursor).toEqual({ x: 220, y: 140 });
    expect(result.bCursorEls).toBe(1);
    expect(result.aRendersSelf).toBe(false);
    // Styled presence cursor (not a bare triangle + plain text)
    expect(result.styled.hasWhiteRoundedLabel).toBe(true);
    expect(result.styled.nameInUserColor).toBe(true);
  });

  // F1 (Nov 16): ghost-cursor class. Nameless peers must render the arrow
  // WITHOUT an "Anonymous" label, and cursors must not outlive the peer —
  // reconcile sweep every 4s + wipe on WS drop (no reliance on change events).
  test("nameless peer renders arrow only — no 'Anonymous' label", async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const result = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const room = "ghost-room-" + Math.random().toString(36).slice(2);
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
              color: "#cc2233",
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

      const anon = await mkSlate("gA", ""); // nameless peer
      const watcher = await mkSlate("gB", "Watcher");
      const connected = await waitFor(
        () =>
          anon.v2.collab.isCollabConnected() &&
          watcher.v2.collab.isCollabConnected(),
        15000
      );
      anon.v2.collab.updateCursor(150, 90);
      const rendered = await waitFor(
        () => watcher.v2.collab.getCollabUsers().some((u: any) => u.cursor),
        8000
      );
      // let sweep + render settle
      await new Promise((r) => setTimeout(r, 500));

      const els = document.querySelectorAll(
        "#gB polygon, #gB text, #gB rect",
      );
      const anonymousLabel = Array.from(els).some(
        (el) => el.textContent === "Anonymous",
      );
      const arrowRendered = Array.from(
        document.querySelectorAll("#gB polygon"),
      ).some((p) =>
        (p.getAttribute("points") || "").includes("17"),
      );
      const anyTextLabels = document.querySelectorAll("#gB text").length;

      return {
        connected,
        rendered,
        anonymousLabel,
        arrowRendered,
        anyTextLabels,
        users: watcher.v2.collab.getCollabUsers(),
      };
    });

    expect(result.connected).toBe(true);
    expect(result.rendered).toBe(true);
    expect(result.arrowRendered).toBe(true); // arrow still shown
    expect(result.anonymousLabel).toBe(false); // the bug is gone
    expect(result.anyTextLabels).toBe(0); // no label chrome at all
    expect(result.users[0]?.userName).toBe(""); // no "Anonymous" string in API
  });

  test("cursor is removed when the peer vanishes (sweep/reconcile, not change-event-dependent)", async ({
    page,
  }) => {
    test.setTimeout(90_000);
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const result = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const room = "leave-room-" + Math.random().toString(36).slice(2);
      const mkSlate = async (containerId: string, userName: string) => {
        const div = document.createElement("div");
        div.id = containerId;
        div.style.width = "600px";
        div.style.height = "400px";
        document.body.appendChild(div);
        return await new sb.slate(
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
      };
      const waitFor = async (cond: () => boolean, ms: number) => {
        const start = Date.now();
        while (!cond() && Date.now() - start < ms) {
          await new Promise((r) => setTimeout(r, 100));
        }
        return cond();
      };

      const a = await mkSlate("lvA", "Alice");
      const b = await mkSlate("lvB", "Bob");
      // Deterministic guard: shorten the 45s ghost-TTL for the test only
      // (prod default stays 45s; the bug is UNBOUNDED persistence).
      (b.v2.collab as any).options.cursorStaleMs = 4000;
      await waitFor(
        () =>
          a.v2.collab.isCollabConnected() && b.v2.collab.isCollabConnected(),
        15000
      );
      a.v2.collab.updateCursor(200, 120);
      const rendered = await waitFor(
        () => b.v2.collab.cursorElements?.size === 1,
        8000
      );

      // Let the cursor sit through a full sweep cycle before killing A: the
      // bug class is a cursor that STAYS after the peer is gone, so the
      // guard must start from a fully-settled render, not a mid-flight one.
      await new Promise((r) => setTimeout(r, 4500));

      // Hard-kill A's collab (no graceful awareness goodbye guaranteed to
      // reach B as a change event): cursor must disappear via sweep/reconcile.
      a.v2.collab.destroy();
      const cleaned = await waitFor(
        () => (b.v2.collab.cursorElements?.size ?? 0) === 0,
        15000,
      );
      const domGhost = !!document
        .querySelector("#lvB")
        ?.querySelectorAll("polygon")
        .length;
      const ghostStates = Array.from(
        (b.v2.collab as any).awareness?.getStates()?.entries() || [],
      ).map(([id, st]: any) => ({ id, cur: !!st.cursor, name: st.user?.name }));
      return { rendered, cleaned, domGhost, ghostStates, wsStatus: (b.v2.collab as any).provider?.wsStatus };

    });

    console.log("VANISH-DIAG " + JSON.stringify(result));
    expect(result).toMatchObject({ rendered: true, cleaned: true, domGhost: false });
  });
});
