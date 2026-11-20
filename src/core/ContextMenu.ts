/**
 * ContextMenu.ts — right-click context menu for nodes (Miro parity).
 *
 * Surfaces node actions that already exist and broadcast (so they persist + sync
 * to collab): bring-to-front / send-to-back / duplicate / delete. Rendered as a
 * small positioned HTML overlay so it can carry text labels cleanly.
 *
 * Isolated-class pattern: constructor takes the slate; enable()/disable() bind
 * and unbind the global contextmenu listener.
 */

import { guid } from "../utils";

interface MenuItem {
  label?: string;
  act?: () => void;
  danger?: boolean;
  divider?: boolean;
}

export class ContextMenu {
  private slate: any;
  private el: HTMLElement | null = null;
  // Nodes the menu acts on — snapshotted at open() so a selection change between
  // opening the menu and clicking an item (e.g. the right-click's own pointerup
  // collapsing a multi-selection) can't make the action a no-op.
  private targetNodes: any[] = [];
  private boundContext: ((e: MouseEvent) => void) | null = null;
  private boundDismiss: ((e: Event) => void) | null = null;
  private boundEsc: ((e: KeyboardEvent) => void) | null = null;

  constructor(slate: any) {
    this.slate = slate;
  }

  /** Bind the global contextmenu handler. */
  public enable(): void {
    if (this.boundContext) return;
    this.boundContext = (e: MouseEvent) => this.onContextMenu(e);
    document.addEventListener("contextmenu", this.boundContext, true);
  }

  /** Unbind + close. */
  public disable(): void {
    if (this.boundContext) {
      document.removeEventListener("contextmenu", this.boundContext, true);
      this.boundContext = null;
    }
    this.close();
  }

  // ─── Private ─────────────────────────────────────────────────────

  private onContextMenu(e: MouseEvent): void {
    const target = e.target as Element | null;
    // Inside a note's open text editor the menu belongs to the text (the browser's
    // own cut/copy/paste), not to the note. Touch browsers also raise it for a tap
    // on selected text.
    if (target?.closest?.(".sb-inline-editor")) {
      this.close();
      return;
    }
    const group = target?.closest?.("[data-node-id]") as Element | null;
    const id = group?.getAttribute?.("data-node-id");
    if (!id) {
      // Not over a node — leave the native menu / other handlers alone.
      this.close();
      return;
    }
    const node = this.slate.nodes?.one?.(id);
    if (!node) return;
    e.preventDefault();

    // Every item here (z-order, duplicate, delete) changes a note the engine
    // persists. A governed note belongs to its host, so it gets no menu.
    if (this.slate.governanceOf?.(node)) {
      this.close();
      this.slate.selectNodes?.([node], false);
      return;
    }

    // Right-clicking a node selects it (unless it's already part of the
    // selection, so a multi-selection stays intact for the action).
    const selected: any[] = this.slate.getSelectedNodes?.() || [];
    if (!selected.includes(node)) {
      this.slate.selectNodes?.([node], false);
    }
    this.open(e.clientX, e.clientY);
  }

  private open(x: number, y: number): void {
    this.close();

    const menu = document.createElement("div");
    menu.className = "sb-context-menu";
    menu.style.cssText =
      "position:fixed;z-index:100000;background:#fff;border:1px solid #e3e5ea;" +
      "border-radius:8px;box-shadow:0 6px 24px rgba(0,0,0,0.18);padding:4px 0;" +
      "min-width:180px;font:13px/1.4 system-ui,-apple-system,sans-serif;color:#222;" +
      "user-select:none;";
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;

    // Snapshot the selection now (see field comment).
    this.targetNodes = [...(this.slate.getSelectedNodes?.() || [])].filter(
      (n: any) => !this.slate.governanceOf?.(n)
    );
    const selCount = this.targetNodes.length;
    const items: MenuItem[] = [
      { label: "Bring to front", act: () => this.forEachTarget((n) => n.toFront?.()) },
      { label: "Send to back", act: () => this.forEachTarget((n) => n.toBack?.()) },
      { label: "Duplicate", act: () => this.duplicateTargets() },
      { label: "Delete", act: () => this.deleteTargets(), danger: true },
    ];
    // Alignment tools only make sense for a multi-selection (Miro-style).
    if (selCount >= 2) {
      items.push(
        { divider: true },
        { label: "Align left", act: () => this.slate.alignNodes?.("left", this.targetNodes) },
        { label: "Align center", act: () => this.slate.alignNodes?.("centerH", this.targetNodes) },
        { label: "Align right", act: () => this.slate.alignNodes?.("right", this.targetNodes) },
        { label: "Align top", act: () => this.slate.alignNodes?.("top", this.targetNodes) },
        { label: "Align middle", act: () => this.slate.alignNodes?.("middle", this.targetNodes) },
        { label: "Align bottom", act: () => this.slate.alignNodes?.("bottom", this.targetNodes) }
      );
    }
    if (selCount >= 3) {
      items.push(
        { label: "Distribute horizontally", act: () => this.slate.distributeNodes?.("horizontal", this.targetNodes) },
        { label: "Distribute vertically", act: () => this.slate.distributeNodes?.("vertical", this.targetNodes) }
      );
    }

    for (const it of items) {
      if (it.divider) {
        const hr = document.createElement("div");
        hr.style.cssText = "height:1px;background:#e3e5ea;margin:4px 0;";
        menu.appendChild(hr);
        continue;
      }
      const row = document.createElement("div");
      row.textContent = it.label || "";
      row.style.cssText =
        "padding:7px 16px;cursor:pointer;white-space:nowrap;" +
        (it.danger ? "color:#d32f2f;" : "");
      row.addEventListener("mouseenter", () => {
        row.style.background = it.danger ? "#fdecea" : "#f2f4f7";
      });
      row.addEventListener("mouseleave", () => {
        row.style.background = "";
      });
      row.addEventListener("click", (ev) => {
        ev.stopPropagation();
        try {
          it.act?.();
        } catch (err) {
          /* noop */
        }
        this.close();
      });
      menu.appendChild(row);
    }

    document.body.appendChild(menu);
    this.el = menu;

    // Keep the menu on screen.
    const r = menu.getBoundingClientRect();
    if (r.right > window.innerWidth) {
      menu.style.left = `${Math.max(4, window.innerWidth - r.width - 8)}px`;
    }
    if (r.bottom > window.innerHeight) {
      menu.style.top = `${Math.max(4, window.innerHeight - r.height - 8)}px`;
    }

    // Dismiss on outside pointerdown or Escape (defer so the opening click
    // doesn't immediately close it).
    this.boundDismiss = (ev: Event) => {
      if (this.el && !this.el.contains(ev.target as Node)) this.close();
    };
    this.boundEsc = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") this.close();
    };
    setTimeout(() => {
      if (this.boundDismiss) {
        document.addEventListener("pointerdown", this.boundDismiss, true);
      }
      if (this.boundEsc) {
        document.addEventListener("keydown", this.boundEsc, true);
      }
    }, 0);
  }

  private close(): void {
    if (this.el) {
      this.el.remove();
      this.el = null;
    }
    if (this.boundDismiss) {
      document.removeEventListener("pointerdown", this.boundDismiss, true);
      this.boundDismiss = null;
    }
    if (this.boundEsc) {
      document.removeEventListener("keydown", this.boundEsc, true);
      this.boundEsc = null;
    }
  }

  private forEachTarget(fn: (n: any) => void): void {
    for (const n of this.targetNodes) fn(n);
  }

  /** Delete the target nodes (removeNode broadcasts onNodeDeleted → persists). */
  private deleteTargets(): void {
    if (this.slate.isReadOnly?.() || this.slate.isCommentOnly?.()) return;
    for (const n of [...this.targetNodes]) this.slate.removeNode?.(n.id);
    this.slate.clearSelection?.();
  }

  /** Duplicate these notes (offset +20,+20, connections between them kept) and select the copies. */
  public duplicate(nodes: any[]): void {
    this.targetNodes = [...nodes];
    this.duplicateTargets();
  }

  /** Duplicate the target nodes offset (+20,+20); addNode broadcasts → persists. */
  private duplicateTargets(): void {
    if (this.slate.isReadOnly?.() || this.slate.isCommentOnly?.()) return;
    const created: any[] = [];
    const srcToCopy = new Map<string, any>();
    const idSet = new Set(this.targetNodes.map((n: any) => n.id));
    for (const n of this.targetNodes) {
      let opts: any;
      try {
        opts = JSON.parse(JSON.stringify(n.options || {}));
      } catch (err) {
        opts = { ...(n.options || {}) };
      }
      const srcId = opts.id;
      opts.id = guid();
      opts.x = (opts.x || 0) + 20;
      opts.y = (opts.y || 0) + 20;
      delete opts.parentArrowForChildren;
      delete opts.noChildArrowForChildren;
      delete opts.associations;
      try {
        const node = this.slate.addNode?.(opts);
        if (node) {
          created.push(node);
          if (srcId) srcToCopy.set(srcId, node);
        }
      } catch (err) {
        /* noop */
      }
    }
    // Internal connectors (both endpoints duplicated) → recreate between copies
    // so a right-click "Duplicate" of a connected group keeps its edges (Miro).
    const edges: any[] = [];
    for (const n of this.targetNodes) {
      const am = n.relationships?.assocMap;
      if (!am) continue;
      for (const as of am.values()) {
        if (idSet.has((as as any).childId)) {
          let data: any = {};
          try {
            data = JSON.parse(JSON.stringify(as));
          } catch (e) {
            data = { ...(as as any) };
          }
          // Strip id fields referencing the ORIGINAL nodes so the recreated edge
          // derives parent/child/id from the COPIES (else reload adds a phantom edge).
          delete data.id;
          delete data.childId;
          delete data.parentId;
          edges.push({
            parentSrcId: n.id,
            childSrcId: (as as any).childId,
            data,
          });
        }
      }
    }
    if (created.length > 0) {
      const finish = () => {
        this.slate.selectNodes?.(created, false);
        for (const edge of edges) {
          const p = srcToCopy.get(edge.parentSrcId);
          const c = srcToCopy.get(edge.childSrcId);
          if (p && c) {
            try {
              p.relationships?.addAssociation?.(c, edge.data);
            } catch (e) {
              /* noop */
            }
          }
        }
      };
      const pending = created.map((n: any) => n?.ready).filter(Boolean);
      if (pending.length) {
        Promise.all(pending).then(finish).catch(finish);
      } else {
        setTimeout(finish, 120);
      }
    }
  }
}
