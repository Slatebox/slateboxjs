import { test, expect } from "@playwright/test";

// §K of docs/drop-in-contract.md — THE drop-in proof.
//
// This spec replicates, as literally as possible, what the Meteor app at
// slatebox.com does with the library:
//  - createSlate.js: the exact options + events object shapes passed to
//    `new Slatebox.slate(opts, events).init()`, then the "Welcome!" node
//    via `new Slatebox.node(...)` + `slate.nodes.add(node)`
//  - QuickNodeActions.jsx: creating a shaped node from a transformed
//    vectorPath using Slatebox.utils._transformPath/getBBox, positioned via
//    getOrientation() and `slate.options.viewPort.zoom.r`
//  - Canvas.jsx: onSlateChanged-driven persistence via exportJSON
test.describe("slatebox.com drop-in (§K)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);
  });

  test("createSlate.js flow works verbatim", async ({ page }) => {
    const result = await page.evaluate(async () => {
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.width = "1200px";
      div.style.height = "800px";
      document.body.appendChild(div);

      const { Slatebox } = window as any;
      const fired: Record<string, number> = {};
      const track = (name: string) => (fired[name] = (fired[name] || 0) + 1);

      // ── events object: every callback Canvas.jsx registers ──
      const savedPackages: any[] = [];
      const events = {
        onSlateChanged: async (pkg: any, _collabUsers: any[]) => {
          track("onSlateChanged");
          savedPackages.push(pkg);
        },
        onCollaborationUsersChanged: () => track("onCollaborationUsersChanged"),
        onCollaborationUsersRemoved: () => track("onCollaborationUsersRemoved"),
        onCollaboration: () => track("onCollaboration"),
        onInitCollaboration: () => track("onInitCollaboration"),
        onConfirmRequested: (_t: string, _m: string, cb: Function) => {
          track("onConfirmRequested");
          cb(true);
        },
        onTakeSnapshot: () => track("onTakeSnapshot"),
        onTextPaneRequested: () => track("onTextPaneRequested"),
        onLineMenuRequested: () => track("onLineMenuRequested"),
        onGroupSelection: () => track("onGroupSelection"),
        onMenuRequested: () => track("onMenuRequested"),
        onBase64ImageRequested: () => track("onBase64ImageRequested"),
        onOptimizeSVG: () => track("onOptimizeSVG"),
        onCanvasClicked: () => track("onCanvasClicked"),
        isReadOnly: () => false,
        isCommentOnly: () => false,
        canRemoveComments: () => true,
      };

      // ── opts: createSlate.js verbatim (non-AI path, Meteor bits inlined) ──
      const bgColors = ["#ffffff", "#f0f0f0", "#e1e1e1", "#d2d2d2", "#c3c3c3"];
      const opts: any = {
        id: undefined, // new slate — library generates
        name: "New Slate",
        description: "",
        defaultLineColor: "#333",
        viewPort: {
          allowDrag: true,
          useInertiaScrolling: true,
          showGrid: false,
          snapToObjects: true,
        },
        showMultiSelect: true,
        showUndoRedo: true,
        showbirdsEye: true,
        showZoom: true,
        isSharing: true,
        imageFolder: "/images/",
        container: "slateCanvas",
        isEmbedded: undefined,
        enabled: true,
        containerStyle: {
          width: "auto",
          height: "auto",
          backgroundColor: bgColors[0],
          backgroundImage: null,
          backgroundSize: "cover",
          backgroundEffect: null,
          prevBackgroundColor: "transparent",
          backgroundColorAsGradient: true,
          backgroundGradientType: "radial",
          backgroundGradientColors: bgColors,
          backgroundGradientStrategy: "shades",
        },
        allowCollaboration: false, // no collab server in this test env
        huddleType: "audio",
        mindMapMode: true,
        autoResizeNodesBasedOnText: false,
        isPublic: false,
        isPrivate: true,
        isUnlisted: false,
      };

      const slate = await new Slatebox.slate(opts, events).init();
      slate.shareId = "e2e-share-id";

      // ── the "Welcome!" node, createSlate.js verbatim ──
      const gid = Slatebox.utils.guid(8);
      const defaultNodeOpts = {
        id: gid,
        name: gid,
        text: "Welcome!",
        xPos: 10000,
        yPos: 10000,
        height: 100,
        width: 175,
        vectorPath: "rectangle",
        backgroundColor: "#4051B5",
        opacity: 1,
        borderOpacity: 1,
        fontFamily: "Roboto",
        foregroundColor: "#fff",
        lineColor: "#333",
        lineWidth: 5,
      };
      const node = new Slatebox.node(defaultNodeOpts);
      slate.nodes.add(node);
      await new Promise((r) => setTimeout(r, 500));

      // ── QuickNodeActions.jsx flow: shaped node from transformed path ──
      const orient = slate.getOrientation();
      let xPos = orient.left + orient.width + 20;
      let yPos = orient.top + orient.height / 2;
      const z = slate.options.viewPort.zoom.r; // direct property read!
      xPos += xPos / z - xPos;
      yPos += yPos / z - yPos;

      const starPath =
        "M50,5 L61,39 L98,39 L68,60 L79,95 L50,73 L21,95 L32,60 L2,39 L39,39 Z";
      const tpath = Slatebox.utils._transformPath(starPath, "s1.5,1.5");
      const pbox = Slatebox.utils.getBBox({ path: tpath });
      const quickNode = new Slatebox.node({
        text: "quick",
        xPos: xPos + pbox.width / 2 + 20,
        yPos: yPos + pbox.height / 2 + 20,
        height: pbox.height,
        width: pbox.width,
        vectorPath: tpath,
        allowMenu: true,
        allowDrag: true,
        opacity: 1,
        borderOpacity: 1,
        textOpacity: 1,
        backgroundColor: "#e1e1e1",
        foregroundColor: Slatebox.utils.whiteOrBlack("#e1e1e1"),
      });
      slate.nodes.add(quickNode);
      await new Promise((r) => setTimeout(r, 500));

      // connect them like the app's mind-map flow
      node.relationships.addAssociation(quickNode);

      // ── Canvas.jsx persistence: what saveSlateLite would write ──
      const persisted = JSON.parse(slate.exportJSON());

      // Simulated Mongo doc reload (SnapSlate.jsx previews do exactly this)
      const div2 = document.createElement("div");
      div2.id = "snapCanvas";
      document.body.appendChild(div2);
      const snap = await new Slatebox.slate(
        { container: "snapCanvas", allowCollaboration: false },
        {}
      ).init();
      await snap.loadJSON(JSON.stringify(persisted));
      await new Promise((r) => setTimeout(r, 400));
      snap.controller.scaleToFitAndCenter();

      return {
        fired,
        savedTypes: savedPackages.map((p) => p.type),
        welcome: {
          text: node.v2.options.text,
          bg: node.v2.options.backgroundColor,
          fontColor: node.v2.options.fontColor,
          x: node.v2.options.x,
        },
        zoomR: z,
        starBBoxScaled:
          pbox.width > 100 && pbox.width < 200 && pbox.height > 100,
        persistedNodeCount: persisted.nodes.length,
        persistedUsesXPos: persisted.nodes.every(
          (n: any) => typeof n.options.xPos === "number"
        ),
        snapNodeCount: snap.nodes.allNodes.length,
        renderedSvgs: document.querySelectorAll("#slateCanvas svg").length,
      };
    });

    // Both app-created nodes made it through the full pipeline
    expect(result.persistedNodeCount).toBe(2);
    expect(result.snapNodeCount).toBe(2);
    expect(result.renderedSvgs).toBeGreaterThan(0);

    // Welcome node contract: v1 option names mapped correctly
    expect(result.welcome.text).toBe("Welcome!");
    expect(result.welcome.bg).toBe("#4051B5");
    expect(result.welcome.fontColor).toBe("#fff"); // foregroundColor mapped
    expect(result.welcome.x).toBe(10000); // xPos mapped

    // QuickNodeActions dependencies all functioned
    expect(result.zoomR).toBeGreaterThan(0); // viewPort.zoom.r live property
    expect(result.starBBoxScaled).toBe(true); // _transformPath + getBBox

    // Persistence writes v1 field names for Mongo compatibility
    expect(result.persistedUsesXPos).toBe(true);

    // The save-driving event fired for the adds (and nothing exploded in
    // any of the other 16 registered callbacks)
    expect(result.savedTypes).toContain("onNodeAdded");
    expect(result.fired.onSlateChanged).toBeGreaterThanOrEqual(2);
  });
});
