/**
 * Menu.ts - Node context menu system
 *
 * Following the isolated class pattern:
 * - Tab-based menu (color, text, shape, image, effect, AI)
 * - Configurable via node show* options
 * - Delegates to Slate events for actual UI rendering
 */

export interface MenuOptions {
  enabled?: boolean;
}

import type { Node } from "./Node";
import type { Slate } from "./Slate";

export class Menu {
  private node: Node;
  private slate: Slate;
  private options: MenuOptions;
  private isOpen: boolean = false;

  constructor(node: Node, options: MenuOptions = {}) {
    this.node = node;
    this.slate = node.slate;
    this.options = {
      enabled: true,
      ...options,
    };
  }

  /**
   * Open the menu for this node.
   * Delegates to the slate's onMenuRequested event for actual UI rendering.
   */
  public open(): void {
    if (!this.options.enabled) return;
    if (this.node.options.allowMenu === false) return;

    // Collect which tabs should be visible based on node options
    const tabs = this.getVisibleTabs();

    // Delegate to app via slate events
    if (this.slate.options.events?.onMenuRequested) {
      this.isOpen = true;
      this.slate.options.events.onMenuRequested(this.node, (result: any) => {
        this.isOpen = false;
        console.log("MENU_DEBUG: Menu closed for", this.node.id);
      });
    } else {
      // No handler registered — don't leave isOpen stuck
      this.isOpen = false;
    }

    console.log(
      "MENU_DEBUG: Menu opened for",
      this.node.id,
      "tabs:",
      tabs
    );
  }

  /** Close the menu */
  public close(): void {
    this.isOpen = false;
  }

  /** Check if menu is currently open */
  public isMenuOpen(): boolean {
    return this.isOpen;
  }

  /** Get list of visible tabs based on node options */
  public getVisibleTabs(): string[] {
    const tabs: string[] = [];
    const opts = this.node.options;

    if (opts.showColorTab !== false) tabs.push("color");
    if (opts.showTextTab !== false) tabs.push("text");
    if (opts.showShapeTab !== false) tabs.push("shape");
    if (opts.showImageTab !== false) tabs.push("image");
    if (opts.showEffectTab !== false) tabs.push("effect");
    if (opts.showAITab !== false) tabs.push("ai");

    return tabs;
  }

  /** Enable/disable the menu */
  public enable(): void {
    this.options.enabled = true;
  }

  public disable(): void {
    this.options.enabled = false;
    this.close();
  }

  public isEnabled(): boolean {
    return this.options.enabled!;
  }

  /** Destroy the menu, closing it and clearing references */
  public destroy(): void {
    this.close();
    this.options.enabled = false;
    (this as any).node = null;
    (this as any).slate = null;
  }
}
