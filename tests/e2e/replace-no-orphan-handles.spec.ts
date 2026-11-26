import { test, expect } from "@playwright/test";

// A whole-slate replace leaves nothing of the slate it replaced (owner, 2026-11-25: "Revert to
// original" left blue dots behind). Each line draws its end handles, the marks on them and its
// arrowheads in the slate's shared markers layer, outside every note; replacing the notes took the
// notes' groups and the lines' paths away but left those, one more set of orphan dots per replace
// (wear a style, switch, revert, undo, redo, a replace from the room). After every replace the
// canvas holds exactly what the slate's lines draw: two ends per line, no group for a note that is
// gone, no plug or outline round empty canvas.
test.describe("a whole-slate replace leaves no orphan line ends", () => {
  test("replace, replace again, undo, redo and a room replace each leave two ends per line", async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText = "width:900px;height:600px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      const v2 = s.v2;
      const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
      const note = (id: string, x: number, y: number, extra: object = {}, associations: object[] = []) => ({
        options: { id, text: id, xPos: x, yPos: y, width: 140, height: 70, backgroundColor: "#ffffff", ...extra },
        relationships: { associations },
      });
      const doc = (nodes: object[]) => JSON.stringify({ options: { ...JSON.parse(v2.exportJSON()).options }, nodes });
      // What the canvas draws against what the slate holds.
      const count = () => {
        const json = JSON.parse(v2.exportJSON());
        const ids = new Set(json.nodes.map((n: any) => String(n.options.id)));
        const lines = json.nodes.reduce((sum: number, n: any) => sum + (n.relationships?.associations?.length || 0), 0);
        const root = document.getElementById("slateCanvas")!;
        return {
          lines,
          ends: root.querySelectorAll(".connector-handle").length,
          marks: root.querySelectorAll(".connector-handle-glyph").length,
          plugs: root.querySelectorAll(".connection-handle").length,
          // Arrowheads: every <marker> in the canvas's defs, and those a drawn line points at.
          markers: root.querySelectorAll("marker").length,
          arrowheads: [...root.querySelectorAll("path[marker-start], path[marker-end]")].reduce(
            (sum, p) => sum + (p.getAttribute("marker-start") ? 1 : 0) + (p.getAttribute("marker-end") ? 1 : 0), 0),
          strayGroups: [...root.querySelectorAll("[data-node-id]")].map((g) => g.getAttribute("data-node-id")).filter((id) => !ids.has(id!)),
          selected: v2.getSelectedNodes().length,
        };
      };
      const replace = async (snapshot: string) => {
        await v2.ownStep(() => v2.invoker.onSlateReplaced({ type: "onSlateReplaced", data: { snapshot } }));
        await wait(350);
      };

      // The slate as its author made it: a root with two lines, a third note with a line on.
      await replace(doc([
        note("root", 80, 200, {}, [{ parentId: "root", childId: "a" }, { parentId: "root", childId: "b" }]),
        note("a", 380, 80), note("b", 380, 320, {}, [{ parentId: "b", childId: "c" }]), note("c", 660, 320),
      ]));
      v2.undoRedo.forceSnapshot();
      const original = count();
      // A note selected with its plugs out, and a line's ends shown, as someone working would leave them.
      const a = v2.nodes.one("a");
      v2.selectNode?.(a);
      await wait(150);

      // A style worn: notes restyled and moved, one of the slate's notes' lines to a style's ticket.
      await replace(doc([
        note("root", 40, 120, { fontFamily: "Georgia", backgroundColor: "#0b1f3a", fontColor: "#ffffff" }, [{ parentId: "root", childId: "a" }, { parentId: "root", childId: "b" }]),
        note("a", 420, 40), note("b", 420, 400, {}, [{ parentId: "b", childId: "c" }]), note("c", 720, 420),
        note("sb-style-1-ticket", 200, 480, { styleRole: "decor" }, []),
      ]));
      const worn = count();
      // Switched to another style: the notes move again, the art is another.
      await replace(doc([
        note("root", 120, 260, {}, [{ parentId: "root", childId: "a" }, { parentId: "root", childId: "b" }]),
        note("a", 300, 60), note("b", 520, 300, {}, [{ parentId: "b", childId: "c" }]), note("c", 760, 140),
        note("sb-style-2-burst", 600, 480, { styleRole: "decor" }, []),
      ]));
      const switched = count();
      const undone = v2.undoRedo.undo();
      await wait(450);
      const afterUndo = count();
      const redone = v2.undoRedo.redo();
      await wait(450);
      const afterRedo = count();
      // The room sends a replace (a collaborator's revert): applied as a remote package.
      await v2.invoker.onSlateReplaced({ type: "onSlateReplaced", data: { snapshot: doc([
        note("root", 80, 200, {}, [{ parentId: "root", childId: "a" }]), note("a", 380, 80),
      ]) } });
      await wait(350);
      const fromRoom = count();
      return { original, worn, switched, undone, afterUndo, redone, afterRedo, fromRoom };
    });

    expect(res.undone).toBe(true);
    expect(res.redone).toBe(true);
    for (const [label, c] of Object.entries(res).filter(([, v]) => typeof v === "object") as [string, any][]) {
      expect(c.ends, `${label}: two end handles per line`).toBe(c.lines * 2);
      expect(c.marks, `${label}: two end marks per line`).toBe(c.lines * 2);
      expect(c.strayGroups, `${label}: no group for a note that is gone`).toEqual([]);
      // Each line's arrowhead (one, at its target, by default) and no other: a replace takes the
      // lines it replaces' <marker>s out of the defs (review, 2026-11-25: +1 per line per replace).
      expect(c.arrowheads, `${label}: one arrowhead per line`).toBe(c.lines);
      expect(c.markers, `${label}: a <marker> for every arrowhead drawn, none left over`).toBe(c.arrowheads);
    }
    // Constant across the replaces of the same three lines (worn, switched, undo, redo).
    for (const label of ["worn", "switched", "afterUndo", "afterRedo"]) expect((res as any)[label].markers, `${label}: markers as at first`).toBe(res.original.markers);
    expect(res.fromRoom.markers).toBe(1);
    expect(res.original.lines).toBe(3);
    expect(res.fromRoom.lines).toBe(1);
    // The selected note went with the slate it was on: nothing selected, no plugs round empty canvas.
    expect(res.worn.selected).toBe(0);
    expect(res.worn.plugs).toBe(0);
  });
});
