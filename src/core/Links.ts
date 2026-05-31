/**
 * Links.ts - Node link management (URL, currentSlate, externalSlate)
 *
 * Following the isolated class pattern.
 */

import type { NodeLinkOptions } from "./Node";
import type { Node } from "./Node";

export class Links {
  private node: Node;
  private linkData: NodeLinkOptions | null = null;

  constructor(node: Node) {
    this.node = node;

    // Initialize from options if present
    if (node.options.link?.show) {
      this.linkData = { ...node.options.link };
    }
  }

  /**
   * Set a link on this node.
   *
   * @param linkOptions - Link configuration
   * @param sendCollab - If true, broadcast via collaboration
   */
  public set(linkOptions: NodeLinkOptions, sendCollab: boolean = true): void {
    this.linkData = {
      show: true,
      ...linkOptions,
    };

    // Update node options
    this.node.options.link = { ...this.linkData };

    console.log("LINKS_DEBUG: Set link on", this.node.id, this.linkData);

    // Broadcast via collab if needed
    if (sendCollab && this.node.slate?.collab?.isCollabConnected()) {
      this.node.slate.collab.send({
        type: "onNodeLinkAdded",
        data: {
          id: this.node.id,
          link: this.linkData,
        },
      });
    }
  }

  /**
   * Remove the link from this node.
   *
   * @param sendCollab - If true, broadcast via collaboration
   */
  public unset(sendCollab: boolean = true): void {
    this.linkData = null;
    this.node.options.link = undefined;

    console.log("LINKS_DEBUG: Removed link from", this.node.id);

    // Broadcast via collab if needed
    if (sendCollab && this.node.slate?.collab?.isCollabConnected()) {
      this.node.slate.collab.send({
        type: "onNodeLinkRemoved",
        data: { id: this.node.id },
      });
    }
  }

  /** Get current link data */
  public get(): NodeLinkOptions | null {
    return this.linkData;
  }

  /** Check if a link is set */
  public hasLink(): boolean {
    return this.linkData?.show === true;
  }

  /** Get link type */
  public getType(): string | undefined {
    return this.linkData?.type;
  }

  /** Navigate to the link (opens URL or fires slate event) */
  public navigate(): void {
    if (!this.linkData) return;

    switch (this.linkData.type) {
      case "url":
        if (this.linkData.data && typeof window !== "undefined") {
          window.open(this.linkData.data, "_blank");
        }
        break;
      case "currentSlate":
      case "externalSlate":
        // Delegate to app via events
        console.log(
          "LINKS_DEBUG: Navigate to slate",
          this.linkData.data
        );
        break;
    }
  }

  /** Destroy the links instance, unsetting any active link */
  public destroy(): void {
    if (this.linkData) {
      this.unset(false);
    }
    this.linkData = null;
    (this as any).node = null;
  }
}
