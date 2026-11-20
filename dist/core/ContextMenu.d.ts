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
export declare class ContextMenu {
    private slate;
    private el;
    private targetNodes;
    private boundContext;
    private boundDismiss;
    private boundEsc;
    constructor(slate: any);
    /** Bind the global contextmenu handler. */
    enable(): void;
    /** Unbind + close. */
    disable(): void;
    private onContextMenu;
    private open;
    private close;
    private forEachTarget;
    /** Delete the target nodes (removeNode broadcasts onNodeDeleted → persists). */
    private deleteTargets;
    /** Duplicate these notes (offset +20,+20, connections between them kept) and select the copies. */
    duplicate(nodes: any[]): void;
    /** Duplicate the target nodes offset (+20,+20); addNode broadcasts → persists. */
    private duplicateTargets;
}
