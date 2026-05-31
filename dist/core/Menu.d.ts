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
export declare class Menu {
    private node;
    private slate;
    private options;
    private isOpen;
    constructor(node: any, options?: MenuOptions);
    /**
     * Open the menu for this node.
     * Delegates to the slate's onMenuRequested event for actual UI rendering.
     */
    open(): void;
    /** Close the menu */
    close(): void;
    /** Check if menu is currently open */
    isMenuOpen(): boolean;
    /** Get list of visible tabs based on node options */
    getVisibleTabs(): string[];
    /** Enable/disable the menu */
    enable(): void;
    disable(): void;
    isEnabled(): boolean;
}
