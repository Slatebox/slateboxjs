/**
 * Links.ts - Node link management (URL, currentSlate, externalSlate)
 *
 * Following the isolated class pattern.
 */
import type { NodeLinkOptions } from "./Node";
import type { Node } from "./Node";
export declare class Links {
    private node;
    private linkData;
    constructor(node: Node);
    /**
     * Set a link on this node.
     *
     * @param linkOptions - Link configuration
     * @param sendCollab - If true, broadcast via collaboration
     */
    set(linkOptions: NodeLinkOptions, sendCollab?: boolean): void;
    /**
     * Remove the link from this node.
     *
     * @param sendCollab - If true, broadcast via collaboration
     */
    unset(sendCollab?: boolean): void;
    /** Get current link data */
    get(): NodeLinkOptions | null;
    /** Check if a link is set */
    hasLink(): boolean;
    /** Get link type */
    getType(): string | undefined;
    /** Navigate to the link (opens URL or fires slate event) */
    navigate(): void;
    /** Destroy the links instance, unsetting any active link */
    destroy(): void;
}
