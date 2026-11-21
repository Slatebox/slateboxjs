/**
 * The line tool: draw a new line from a note without making a note.
 *
 * Started on a note (the host's "Line" button, or slate.startLineFrom), a line
 * follows the pointer from the note's edge. A click or tap on another note
 * connects to it (pinned to that spot when near the note's edge, following the
 * note when on its middle, the same rule as dropping a line's end); a click or
 * tap on empty canvas leaves the far end free there. Escape, a click on the note
 * it started from, or starting the tool again cancels it. The line is made
 * through the note's relationships, so it is saved, shared and undoable like any
 * line, and is selected when made.
 */
import { anchorForDrop, anchorPoint, anchorToward, normalizedOn, type NoteBox } from "./LineEnds";

export type LineToolResult = { result: "connected" | "free" | "cancelled"; associationId?: string; nodeId?: string };

const boxOf = (node: any): NoteBox => {
  const o = node?.options || {};
  return { x: o.x || 0, y: o.y || 0, width: o.width || 1, height: o.height || 1, rotation: o.rotate?.rotationAngle || 0 };
};

/** The note under a screen point (seeing through handles and the preview), or null. */
function noteUnder(slate: any, clientX: number, clientY: number, except: string): any {
  const el = document.elementFromPoint(clientX, clientY) as Element | null;
  const id = el?.closest?.("[data-node-id]")?.getAttribute("data-node-id");
  if (id) return slate.nodes?.one?.(id) ?? null;
  for (const n of slate.nodes?.allNodes || []) {
    if (!n || n.id === except) continue;
    const r = (slate.element as Element | undefined)
      ?.querySelector?.(`[data-node-id="${CSS.escape(n.id)}"]`)
      ?.getBoundingClientRect?.();
    if (r && clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom) return n;
  }
  return null;
}

export function startLineTool(slate: any, node: any): Promise<LineToolResult> {
  slate._lineTool?.cancel?.();
  const canvas: any = slate.canvas;
  if (
    !canvas ||
    !node?.relationships ||
    slate.isReadOnly?.() ||
    slate.isCommentOnly?.() ||
    node.options?.isLocked ||
    slate.capabilitiesOf?.(node)?.canConnect === false
  ) {
    return Promise.resolve({ result: "cancelled" });
  }
  const container: any = slate.markersContainer || canvas;
  const preview = container
    .path("M 0 0")
    .fill("none")
    .stroke({ color: "#1f6feb", width: 2.5, dasharray: "7,5", linecap: "round" })
    .addClass("line-tool-preview")
    .attr("pointer-events", "none");
  const tip = container.group().addClass("line-tool-tip").attr("pointer-events", "none");
  tip.circle(20).center(0, 0).fill("#ffffff").attr("fill-opacity", 0.9);
  tip.polygon("0,-8 8,0 0,8 -8,0").fill("#ffffff").stroke({ color: "#1f6feb", width: 2.5, linejoin: "round" });
  tip.hide();
  try {
    slate.markersContainer?.front?.();
  } catch (e) {
    /* noop */
  }
  const element: HTMLElement | null = slate.element ?? canvas.node?.parentElement ?? null;
  element?.setAttribute?.("data-line-tool", "on");

  let hovered: any = null;
  const highlight = (target: any) => {
    if (hovered === target) return;
    try {
      hovered?.backgroundRect?.attr?.({ "stroke-dasharray": null });
    } catch (e) {
      /* noop */
    }
    hovered = target;
    try {
      target?.backgroundRect?.attr?.({ "stroke-dasharray": "8,4" });
    } catch (e) {
      /* noop */
    }
  };

  return new Promise<LineToolResult>((resolve) => {
    let done = false;
    // The rest of the press that ended the tool (its mousedown, pointerup, mouseup and click)
    // does not also select, pan or deselect: it is held back until that press's click, or
    // shortly after its pointerup when no click comes (a touch may send none).
    const swallowed = ["mousedown", "mouseup", "click", "pointerup", "touchstart", "touchend"];
    let swallowing = false;
    let disarmTimer: any = null;
    const disarm = () => {
      swallowing = false;
      if (disarmTimer) clearTimeout(disarmTimer);
      disarmTimer = null;
      swallowed.forEach((type) => window.removeEventListener(type, swallow, true));
    };
    const finish = (result: LineToolResult) => {
      if (done) return;
      done = true;
      highlight(null);
      window.removeEventListener("pointermove", move, true);
      window.removeEventListener("pointerdown", down, true);
      window.removeEventListener("keydown", key, true);
      try {
        preview.remove();
        tip.remove();
      } catch (e) {
        /* noop */
      }
      element?.removeAttribute?.("data-line-tool");
      if (slate._lineTool === tool) slate._lineTool = null;
      if (!swallowing) disarm();
      resolve(result);
      try {
        if (result.associationId && result.nodeId) slate.selectLine?.(result.nodeId, result.associationId);
        slate.options?.events?.onLineToolChanged?.(false);
      } catch (e) {
        console.warn("LINE_TOOL: after drawing", e);
      }
    };
    // On this slate's drawing (its svg), wherever the host put it.
    const svg: Element | null = canvas.root?.()?.node ?? canvas.node ?? null;
    // (By nodeType, not instanceof Node: a page may have the engine's own Node class as window.Node.)
    const inCanvas = (e: Event) => {
      const target = e.target as any;
      if (!target || typeof target.nodeType !== "number") return false;
      return !!svg?.contains(target) || !!element?.contains(target);
    };
    const swallow = (e: Event) => {
      if (!swallowing) return;
      if (inCanvas(e)) {
        e.preventDefault();
        e.stopPropagation();
        (e as any).stopImmediatePropagation?.();
      }
      if (e.type === "click") disarm();
      else if (e.type === "pointerup" || e.type === "mouseup" || e.type === "touchend") {
        if (disarmTimer) clearTimeout(disarmTimer);
        disarmTimer = setTimeout(disarm, 350);
      }
    };
    const move = (e: PointerEvent) => {
      if (!inCanvas(e)) return;
      const w = canvas.point(e.clientX, e.clientY);
      const target = noteUnder(slate, e.clientX, e.clientY, node.id);
      const over = target && target.id !== node.id && slate.capabilitiesOf?.(target)?.canConnect !== false ? target : null;
      highlight(over);
      const from = anchorPoint(boxOf(node), anchorToward(boxOf(node), w));
      preview.plot(`M ${from.x} ${from.y} L ${w.x} ${w.y}`);
      if (over) tip.hide();
      else tip.show().attr("transform", `translate(${w.x},${w.y})`);
    };
    const down = (e: PointerEvent) => {
      try {
        press(e);
      } catch (error) {
        console.warn("LINE_TOOL: press failed", error);
        finish({ result: "cancelled" });
      }
    };
    const press = (e: PointerEvent) => {
      if (!inCanvas(e) || (e.button !== undefined && e.button !== 0 && e.pointerType === "mouse")) return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      swallowing = true;
      swallowed.forEach((type) => window.addEventListener(type, swallow, true));
      const w = canvas.point(e.clientX, e.clientY);
      const target = noteUnder(slate, e.clientX, e.clientY, node.id);
      if (target && target.id === node.id) return finish({ result: "cancelled" });
      if (target) {
        if (slate.capabilitiesOf?.(target)?.canConnect === false) return;
        const n = normalizedOn(boxOf(target), w);
        const anchor = anchorForDrop(n.x, n.y);
        const assoc = node.relationships.addAssociation(target, anchor ? { targetAnchor: anchor } : undefined);
        const made = node.relationships.hasAssociationId?.(assoc?.id);
        return finish(made ? { result: "connected", associationId: assoc.id, nodeId: node.id } : { result: "cancelled" });
      }
      const assoc = node.relationships.addFloatingAssociation({ x: Math.round(w.x), y: Math.round(w.y) });
      finish({ result: "free", associationId: assoc.id, nodeId: node.id });
    };
    const key = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      e.stopPropagation();
      finish({ result: "cancelled" });
    };
    const tool = { nodeId: node.id, cancel: () => finish({ result: "cancelled" }) };
    slate._lineTool = tool;
    window.addEventListener("pointermove", move, true);
    window.addEventListener("pointerdown", down, true);
    window.addEventListener("keydown", key, true);
    slate.options?.events?.onLineToolChanged?.(true);
  });
}
