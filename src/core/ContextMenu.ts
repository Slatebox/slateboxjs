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
  label: string;
  act: () => void;
  danger?: boolean;
}

export class ContextMenu {
  private slate: any;
  private el: HTMLElement | null = null;
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

    const items: MenuItem[] = [
      { label: "Bring to front", act: () => this.forEachSelected((n) => n.toFront?.()) },
      { label: "Send to back", act: () => this.forEachSelected((n) => n.toBack?.()) },
      { label: "Duplicate", act: () => this.duplicateSelected() },
      { label: "Delete", act: () => this.deleteSelected(), danger: true },
    ];

    for (const it of items) {
      const row = document.createElement("div");
      row.textContent = it.label;
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
          it.act();
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

  private forEachSelected(fn: (n: any) => void): void {
    const sel: any[] = this.slate.getSelectedNodes?.() || [];
    for (const n of sel) fn(n);
  }

  /** Delete the selected nodes (removeNode broadcasts onNodeDeleted → persists). */
  private deleteSelected(): void {
    if (this.slate.isReadOnly?.() || this.slate.isCommentOnly?.()) return;
    const sel: any[] = [...(this.slate.getSelectedNodes?.() || [])];
    for (const n of sel) this.slate.removeNode?.(n.id);
    this.slate.clearSelection?.();
  }

  /** Duplicate the selected nodes offset (+20,+20); addNode broadcasts → persists. */
  private duplicateSelected(): void {
    if (this.slate.isReadOnly?.() || this.slate.isCommentOnly?.()) return;
    const sel: any[] = this.slate.getSelectedNodes?.() || [];
    const created: any[] = [];
    for (const n of sel) {
      let opts: any;
      try {
        opts = JSON.parse(JSON.stringify(n.options || {}));
      } catch (err) {
        opts = { ...(n.options || {}) };
      }
      opts.id = guid();
      opts.x = (opts.x || 0) + 20;
      opts.y = (opts.y || 0) + 20;
      delete opts.parentArrowForChildren;
      delete opts.noChildArrowForChildren;
      delete opts.associations;
      try {
        const node = this.slate.addNode?.(opts);
        if (node) created.push(node);
      } catch (err) {
        /* noop */
      }
    }
    if (created.length > 0) {
      setTimeout(() => this.slate.selectNodes?.(created, false), 100);
    }
  }
}
