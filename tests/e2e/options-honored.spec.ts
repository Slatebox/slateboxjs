import { test, expect } from "@playwright/test";

// §B of docs/drop-in-contract.md: v1 slate options passed by the Meteor app
// must produce their behaviors — UI toggles, background styling, grid.
test.describe("v1 options honored (§B)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);
  });

  test("show* flags create their UI affordances", async ({ page }) => {
    const result = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.width = "900px";
      div.style.height = "700px";
      document.body.appendChild(div);

      const s = await new sb.slate(
        {
          container: "slateCanvas",
          showZoom: true,
          showbirdsEye: true,
          sizeOfbirdsEye: 180,
          showUndoRedo: true,
          showMultiSelect: true,
          allowCollaboration: false,
          viewPort: { showGrid: true, snapToObjects: true },
        },
        {}
      ).init();
      s.nodes.add(new sb.node({ id: "opt1", xPos: 100, yPos: 100, text: "x" }));
      // birdsEye enables on a 200ms timer; grid renders with the canvas
      await new Promise((r) => setTimeout(r, 800));

      return {
        zoomSlider: !!document.querySelector(
          "[class*=zoom], [id*=zoom], input[type=range]"
        ),
        birdsEyeEnabled: (s.v2 as any).birdsEye?.isEnabled?.() ?? false,
        undoRedoEnabled: !!(s.v2 as any).undoRedo,
        multiSelectEnabled: !!(s.v2 as any).multiSelection,
        gridVisible: (s.v2 as any).grid?.isShown?.() ?? false,
      };
    });

    expect(result.zoomSlider).toBe(true);
    expect(result.birdsEyeEnabled).toBe(true);
    expect(result.undoRedoEnabled).toBe(true);
    expect(result.multiSelectEnabled).toBe(true);
    expect(result.gridVisible).toBe(true);
  });

  test("show* flags off → no UI affordances", async ({ page }) => {
    const result = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvasOff";
      document.body.appendChild(div);

      const s = await new sb.slate(
        {
          container: "slateCanvasOff",
          showZoom: false,
          showbirdsEye: false,
          allowCollaboration: false,
          viewPort: { showGrid: false },
        },
        {}
      ).init();
      await new Promise((r) => setTimeout(r, 500));

      return {
        birdsEyeEnabled: (s.v2 as any).birdsEye?.isEnabled?.() ?? false,
        gridEnabled: (s.v2 as any).grid?.isShown?.() ?? false,
      };
    });

    expect(result.birdsEyeEnabled).toBe(false);
    expect(result.gridEnabled).toBe(false);
  });

  test("containerStyle renders background color and gradient", async ({
    page,
  }) => {
    const result = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;

      const solid = document.createElement("div");
      solid.id = "bgSolid";
      document.body.appendChild(solid);
      await new sb.slate(
        {
          container: "bgSolid",
          allowCollaboration: false,
          containerStyle: { backgroundColor: "#123456" },
        },
        {}
      ).init();

      const grad = document.createElement("div");
      grad.id = "bgGrad";
      document.body.appendChild(grad);
      await new sb.slate(
        {
          container: "bgGrad",
          allowCollaboration: false,
          containerStyle: {
            backgroundColor: "#ffffff",
            backgroundColorAsGradient: true,
            backgroundGradientType: "radial",
            backgroundGradientColors: ["#ffffff", "#e1e1e1", "#c3c3c3"],
            backgroundGradientStrategy: "shades",
          },
        },
        {}
      ).init();

      return {
        solidBg: getComputedStyle(solid).backgroundColor,
        gradBgImage: getComputedStyle(grad).backgroundImage,
      };
    });

    expect(result.solidBg).toBe("rgb(18, 52, 86)"); // #123456
    expect(result.gradBgImage).toContain("radial-gradient");
  });

  test("loadJSON re-applies the persisted containerStyle", async ({ page }) => {
    const result = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "bgReload";
      document.body.appendChild(div);

      const s = await new sb.slate(
        {
          container: "bgReload",
          allowCollaboration: false,
          containerStyle: { backgroundColor: "#ffffff" },
        },
        {}
      ).init();

      const doc = JSON.parse(s.exportJSON());
      doc.options.containerStyle = { backgroundColor: "#ab34cd" };
      await s.loadJSON(JSON.stringify(doc));
      await new Promise((r) => setTimeout(r, 200));

      return { bg: getComputedStyle(div).backgroundColor };
    });

    expect(result.bg).toBe("rgb(171, 52, 205)"); // #ab34cd
  });
});
