import { test, expect, type Page } from "@playwright/test";
import { openGuestCanvas } from "./app-host.shared";

const fixtures = [
  { id: "rect", shape: "rectangle" },
  { id: "round", shape: "roundedrectangle" },
  { id: "circle", shape: "circle" },
  { id: "ellipse", shape: "ellipse" },
  { id: "diamond", shape: "diamond" },
  { id: "custom", vectorPath: "M0 0L80 0L100 40L60 80L0 60Z" },
  { id: "art", svgContent: '<svg viewBox="0 0 160 100" preserveAspectRatio="none"><rect width="160" height="100" fill="teal"/><text x="20" y="60">Delivery</text></svg>' },
  { id: "image", image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='30'%3E%3Crect width='40' height='30' fill='teal'/%3E%3C/svg%3E" },
];

async function readGeometry(page: Page, id: string) {
  return page.evaluate(key => {
    const slate = (window as any).__slateboxInstances.find((s: any) => s.element.id === "slateCanvas");
    const node = slate.nodes.one(key);
    const main = slate.canvas.node as SVGSVGElement;
    const group = node.svgGroup.node as SVGGElement;
    const paint = (node.nestedSvg?.node.querySelector("rect") || node.contentPath?.node || node.backgroundRect.node) as SVGGraphicsElement;
    const label = group.querySelector("text")!;
    const matrix = paint.getScreenCTM()!;
    const b = paint.getBBox();
    const point = (x: number, y: number) => new DOMPoint(x,y).matrixTransform(matrix);
    const box = [point(b.x,b.y),point(b.x+b.width,b.y),point(b.x+b.width,b.y+b.height),point(b.x,b.y+b.height)];
    const center = point(b.x+b.width/2,b.y+b.height/2);
    const world = center.matrixTransform(main.getScreenCTM()!.inverse());
    const rendered = (el: SVGGraphicsElement) => {
      // WebKit can return a nonempty SVG client rect under display:none.
      for (let parent: Element | null = el; parent; parent = parent.parentElement) {
        const style = getComputedStyle(parent);
        if (style.display === "none" || style.visibility === "hidden") return false;
      }
      return el.getBoundingClientRect().width > 0;
    };
    const visible = (selector: string) => Array.from(main.querySelectorAll<SVGGraphicsElement>(selector)).filter(rendered);
    const outlines = visible("polygon.svg_select_shape") as SVGPolygonElement[];
    const paintedOutlines = outlines.filter(el => {
      const style = getComputedStyle(el);
      return style.stroke !== "none" && Number(style.strokeOpacity) > 0 && parseFloat(style.strokeWidth) > 0;
    });
    const outlinePoints = outlines.flatMap(el => Array.from(el.points).map(p => p.matrixTransform(el.getScreenCTM()!)));
    const distance = (a: DOMPoint, c: DOMPoint) => Math.hypot(a.x-c.x,a.y-c.y);
    const cornerError = Math.max(...box.map(p => Math.min(...outlinePoints.map(q => distance(p,q)))));
    const gaps = ["top","right","bottom","left"].map((direction,i) => {
      const plug = node.connectionHandles[direction]?.node;
      const c = plug && rendered(plug) ? plug.getBoundingClientRect() : null;
      if (!c) return null;
      const a = box[i], d = box[(i+1)%4];
      return Math.hypot(c.x+c.width/2-(a.x+d.x)/2,c.y+c.height/2-(a.y+d.y)/2);
    });
    const angle = (el: SVGGraphicsElement) => { const m = el.getScreenCTM()!; return Math.atan2(m.b,m.a)*180/Math.PI; };
    return { x:center.x,y:center.y,width:distance(box[0],box[1]),height:distance(box[1],box[2]),
      angle:angle(paint),textAngle:angle(label),cornerError, outlines:outlines.length, paintedOutlines:paintedOutlines.length,gaps,
      worldX:world.x, worldY:world.y, topLeft:{x:box[0].x,y:box[0].y},
      imageFill:node.contentPath?.attr("fill"), shape:paint.tagName };
  }, id);
}

async function waitForPlugs(page: Page, id: string) {
  // Hovering a different node can reveal that node's plugs too. Wait for
  // all four plugs belonging to the selected node after gesture finalization.
  await expect.poll(async () => (await readGeometry(page,id)).gaps.filter(gap=>gap !== null).length).toBe(4);
}

async function grip(page: Page, selector: string) {
  const handle = page.locator("#slateCanvas > svg " + selector).filter({visible:true}).first();
  await expect(handle).toBeVisible();
  return handle.evaluate(el => {
    const poly = el as SVGPolylineElement;
    const box = el.getBoundingClientRect();
    const point = poly.points?.numberOfItems === 3
      ? poly.points.getItem(1).matrixTransform(poly.getScreenCTM()!)
      : {x:box.x+box.width/2,y:box.y+box.height/2};
    const hit = document.elementFromPoint(point.x,point.y);
    if (!el.contains(hit) && !hit?.contains(el)) throw new Error("Handle intercepted by " + hit?.outerHTML.slice(0,180));
    return {x:point.x,y:point.y};
  });
}

test("editor resize and live rotation keep artwork, labels, plugs and a single outline together", async ({page}) => {
  const origin = process.env.SLATEBOX_APP_URL || "http://localhost:3000";
  await openGuestCanvas(page,origin);
  const saved = new Map<string, Awaited<ReturnType<typeof readGeometry>>>();
  for (const f of fixtures) await test.step(f.id, async () => {
    const id = "geometry-" + f.id;
    await page.evaluate(async ({f,id}) => {
      const slate = (window as any).__slateboxInstances.find((s:any)=>s.element.id==="slateCanvas");
      slate.clearSelection();
      const x = 24000 + slate.nodes.allNodes.length * 1400;
      const canvas = slate.canvas.node.getBoundingClientRect();
      slate.canvas.viewbox(x-canvas.width/2+80, 12000-canvas.height/2+50, canvas.width, canvas.height);
      const node = slate.addNode({...f,id,x,y:12000,width:160,height:f.shape==="circle"?160:100,text:"Delivery"});
      await node.ready;
      slate.selectNodes([node]);
    }, {id,f});
    await waitForPlugs(page,id);
    await expect.poll(async ()=>(await readGeometry(page,id)).paintedOutlines).toBe(1);
    const before = await readGeometry(page,id);
    expect(before.outlines).toBe(1);
    expect(before.cornerError).toBeLessThan(3);
    if (f.image) expect(before.imageFill).toContain("url(");
    for (const gap of before.gaps) expect(gap).toBeGreaterThan(2);
    let prior = before;
    for (const change of [32,24,-19]) {
      const rb = await grip(page,".svg_select_handle_rb");
      await page.mouse.move(rb.x,rb.y);
      await page.mouse.down();
      await page.mouse.move(rb.x+change,rb.y+change*.65,{steps:8});
      const held = await readGeometry(page,id);
      expect(Math.abs(held.width-prior.width)).toBeGreaterThan(9);
      expect([held.outlines,held.paintedOutlines]).toEqual([1,1]);
      expect(held.cornerError).toBeLessThan(3);
      await page.mouse.up();
      await expect.poll(async () => Math.abs((await readGeometry(page,id)).width-prior.width)).toBeGreaterThan(9);
      await waitForPlugs(page,id);
      const result = await readGeometry(page,id);
      expect([result.outlines,result.paintedOutlines]).toEqual([1,1]);
      expect(result.cornerError).toBeLessThan(3);
      for (const [i,gap] of result.gaps.entries()) {
        expect(gap).not.toBeNull();
        expect(Math.abs(gap!-before.gaps[i]!)).toBeLessThan(3);
      }
      prior = result;
    }

    const rot = await grip(page,".svg_select_handle_rot circle");
    const radius = Math.hypot(rot.x-prior.x,rot.y-prior.y);
    const start = Math.atan2(rot.y-prior.y,rot.x-prior.x);
    await page.mouse.move(rot.x,rot.y);
    await page.mouse.down();
    for (const turn of [25,50]) {
      const target = start + turn*Math.PI/180;
      await page.mouse.move(prior.x+Math.cos(target)*radius,prior.y+Math.sin(target)*radius,{steps:8});
      await expect.poll(async () => Math.abs((await readGeometry(page,id)).angle-turn)).toBeLessThan(5);
      const moving = await readGeometry(page,id);
      expect(Math.abs(moving.angle-moving.textAngle)).toBeLessThan(1);
      expect([moving.outlines,moving.paintedOutlines]).toEqual([1,1]);
      expect(moving.cornerError).toBeLessThan(3);
    }
    await page.mouse.up();
    await waitForPlugs(page,id);
    const final = await readGeometry(page,id);
    expect(Math.abs(final.angle-50)).toBeLessThan(5);
    expect(Math.abs(final.angle-final.textAngle)).toBeLessThan(1);
    expect([final.outlines,final.paintedOutlines]).toEqual([1,1]);
    expect(final.cornerError).toBeLessThan(3);
    for (const [i,gap] of final.gaps.entries()) {
      expect(gap).not.toBeNull();
      expect(Math.abs(gap!-before.gaps[i]!)).toBeLessThan(3);
    }
    // Move the same bottom-right grip in its own rotated coordinate space.
    // The opposite corner stays fixed while the actual painted artwork grows.
    const rb = await grip(page, ".svg_select_handle_rb");
    const angle = final.angle*Math.PI/180;
    const dx = 34*Math.cos(angle)-22*Math.sin(angle);
    const dy = 34*Math.sin(angle)+22*Math.cos(angle);
    await page.mouse.move(rb.x,rb.y);
    await page.mouse.down();
    await page.mouse.move(rb.x+dx,rb.y+dy,{steps:10});
    const held = await readGeometry(page,id);
    expect(held.width-final.width).toBeGreaterThan(12);
    expect(Math.abs(held.angle-final.angle)).toBeLessThan(1);
    expect([held.outlines,held.paintedOutlines]).toEqual([1,1]);
    expect(held.cornerError).toBeLessThan(3);
    await page.mouse.up();
    await waitForPlugs(page,id);
    const resized = await readGeometry(page,id);
    expect(resized.width - final.width).toBeGreaterThan(12);
    expect(resized.height - final.height).toBeGreaterThan(8);
    expect(Math.abs(resized.angle-final.angle)).toBeLessThan(1);
    expect(Math.abs(resized.angle-resized.textAngle)).toBeLessThan(1);
    expect(Math.hypot(resized.topLeft.x-final.topLeft.x,resized.topLeft.y-final.topLeft.y)).toBeLessThan(3);
    expect([resized.outlines,resized.paintedOutlines]).toEqual([1,1]);
    expect(resized.cornerError).toBeLessThan(3);
    for (const [i,gap] of resized.gaps.entries()) {
      expect(gap).not.toBeNull();
      expect(Math.abs(gap!-before.gaps[i]!)).toBeLessThan(3);
    }
    saved.set(id,resized);
  });

  // Wait for the app's debounced save through the same authorized read that
  // opens this guest's own board. Reload from the server only after it lands.
  const persistedGeometry = (fromServer: boolean) => page.evaluate(async server => {
    const win = window as any;
    const slate = win.__slateboxInstances.find((s:any)=>s.element.id==="slateCanvas");
    const board = server
      ? (await win.Meteor.callAsync("slates.get",{shareId:location.pathname.split("/").pop()})).slateBase
      : JSON.parse(slate.exportJSON());
    return (board?.nodes || [])
      .map((n:any)=>n.options)
      .filter((n:any)=>n.id.startsWith("geometry-"))
      .map((n:any)=>[n.id,n.xPos,n.yPos,n.width,n.height,n.rotate?.rotationAngle])
      .sort(([a]:string[],[b]:string[])=>a.localeCompare(b));
  },fromServer);
  const expected = await persistedGeometry(false);
  expect(expected).toHaveLength(fixtures.length);
  await expect.poll(()=>persistedGeometry(true),{timeout:20000}).toEqual(expected);
  await page.reload();
  for (const [id, prior] of saved) await test.step("reload " + id, async () => {
    await page.locator('#slateCanvas [data-node-id="' + id + '"]').waitFor({state:"attached"});
    await page.evaluate(async key=>{
      const slate = (window as any).__slateboxInstances.find((s:any)=>s.element.id==="slateCanvas");
      const node = slate.nodes.one(key);
      await node.ready;
      await new Promise(requestAnimationFrame);
      const viewport = slate.canvas.node.getBoundingClientRect();
      slate.canvas.viewbox(node.options.x-viewport.width/2+80,node.options.y-viewport.height/2+50,viewport.width,viewport.height);
      slate.selectNodes([node]);
    },id);
    await waitForPlugs(page,id);
    await expect.poll(async ()=>(await readGeometry(page,id)).paintedOutlines).toBe(1);
    // A reopened collaboration room can replay the guest's rotations, which
    // the host deliberately animates. Compare the final rendered frame with
    // the saved one. Held-pointer and mouseup checks above run immediately.
    await expect(async () => {
      const current = await readGeometry(page,id);
      expect([current.outlines,current.paintedOutlines]).toEqual([1,1]);
      expect(current.cornerError,id + " selection corners").toBeLessThan(3);
      for (const key of ["angle","textAngle","width","height","worldX","worldY"] as const) {
        expect(Math.abs(current[key]-prior[key]),id+" "+key).toBeLessThan(1);
      }
      for (const [i,gap] of current.gaps.entries()) {
        expect(gap).not.toBeNull();
        expect(Math.abs(gap!-prior.gaps[i]!)).toBeLessThan(3);
      }
      if (id === "geometry-image") expect(current.imageFill).toContain("url(");
    }).toPass({timeout:5000});
  });
});
