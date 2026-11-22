import type { Slate } from "./Slate";
import type { SlatePackage } from "./SlatePackage";
export declare class Invoker {
    private slate;
    constructor(slate: Slate);
    /** Destroy the invoker, clearing all callback references */
    destroy(): void;
    onZoom(pkg: SlatePackage): void;
    onNodePositioned(pkg: SlatePackage): void;
    onNodeLinkRemoved(pkg: SlatePackage): void;
    onNodeLinkAdded(pkg: SlatePackage): void;
    onNodeUnlocked(pkg: SlatePackage): void;
    onNodeLocked(pkg: SlatePackage): void;
    /**
     * A note's plain data, set by chat and exec (operations keys templateCategory and
     * hiddenControls): only these keys ride on the package; null removes one.
     */
    onNodeOptionsChanged(pkg: SlatePackage): void;
    onNodeToBack(pkg: SlatePackage): void;
    onNodeToFront(pkg: SlatePackage): void;
    /**
     * A package from the room carries the list order the change left
     * (Collab.send adds it); the order is applied as a whole, so a replay cannot
     * lift a note above notes added later. A host's own request to move one
     * note carries no order.
     */
    private reorder;
    onNodeShapeChanged(pkg: SlatePackage): void;
    onNodeAdded(pkg: SlatePackage): void;
    onNodeImageChanged(pkg: SlatePackage): void;
    onNodeDeleted(pkg: SlatePackage): void;
    onNodeResized(pkg: SlatePackage): void;
    onNodeRotated(pkg: SlatePackage): void;
    onNodeColorChanged(pkg: SlatePackage): void;
    onNodeTextChanged(pkg: SlatePackage): void;
    onNodeAITextChanged(pkg: SlatePackage): void;
    addRelationship(pkg: SlatePackage): void;
    removeRelationship(pkg: SlatePackage): void;
    onNodesMove(pkg: SlatePackage): void;
    onNodeEffectChanged(pkg: SlatePackage): void;
    onNodeBorderPropertiesChanged(pkg: SlatePackage): void;
    onLinePropertiesChanged(pkg: SlatePackage): void;
    onFollowMeChanged(pkg: SlatePackage): void;
    onCanvasMove(pkg: SlatePackage): void;
    onSlateThemeChanged(pkg: SlatePackage): void;
    onSlateLayoutTypeChanged(pkg: SlatePackage): void;
    onSlateBackgroundEffectChanged(pkg: SlatePackage): void;
    onSlateBackgroundImageChanged(pkg: SlatePackage): void;
    onSlateBackgroundColorChanged(pkg: SlatePackage): void;
    onLineColorChanged(pkg: SlatePackage): void;
    onSlateAISet(pkg: SlatePackage): void;
    onSlateNameChanged(pkg: SlatePackage): void;
    onSlateDescriptionChanged(pkg: SlatePackage): void;
    /** Apply an authoritative full-document baseline (undo/redo collaboration). */
    onSlateReplaced(pkg: SlatePackage): Promise<void>;
    onSlateShowGridChanged(pkg: SlatePackage): void;
    onSlateMindMapModeChanged(pkg: SlatePackage): void;
    onSlateAutoResizeNodesBasedOnTextChanged(pkg: SlatePackage): void;
    onSlateTagsAndTemplateMarkdownChanged(pkg: SlatePackage): void;
    onSlateTemplateChanged(pkg: SlatePackage): void;
    onSlateSnapToObjectsChanged(pkg: SlatePackage): void;
    onSlateSnapToGridChanged(pkg: SlatePackage): void;
    onSlateFollowMeChanged(pkg: SlatePackage): void;
    onSlateHuddleChanged(pkg: SlatePackage): void;
}
