export declare const GHOST_PREFIX = "ghost-";
export declare const ghostIdOf: (nodeId: string) => string;
export type SuggestionKind = 'add' | 'update' | 'remove' | 'link' | 'unlink';
export type SuggestionState = 'pending' | 'kept' | 'discarded' | 'applied' | 'undone' | 'refused';
export interface SuggestionItem {
    id: string;
    kind: SuggestionKind;
    state: SuggestionState;
    nodeId?: string | null;
    /** add: the note as it would be stored (v1 JSON: { options, relationships }); remove: the note as it was. */
    node?: {
        options: Record<string, any>;
        relationships?: any;
    } | null;
    /** update: the note's fields the agent changes, and what they were. */
    changes?: Record<string, any> | null;
    previous?: Record<string, any> | null;
    /** link / unlink: the note that holds the line, and the line. */
    parentId?: string | null;
    association?: {
        id: string;
        parentId?: string;
        childId?: string;
        [key: string]: any;
    } | null;
}
export interface SuggestionAction {
    actionId: string;
    agentId?: string | null;
    label: string;
    initial?: string;
    colorIndex: number;
    origin?: 'visiting' | 'invited' | 'slatebox' | null;
    via?: string | null;
    invitedBy?: string | null;
    message?: string | null;
    items: SuggestionItem[];
}
export interface SuggestionRef {
    actionId: string;
    itemId: string;
}
export interface AgentSuggestionsOptions {
    /** Whether this person may Keep and Discard (an editor). Without it the ghosts show with no buttons. */
    canAct?: () => boolean;
    onKeep?: (ref: SuggestionRef) => void;
    onDiscard?: (ref: SuggestionRef) => void;
    /** Keep all / Discard all on an action's frame: the host saves (or drops) its waiting items at once. */
    onKeepAll?: (actionId: string) => void;
    onDiscardAll?: (actionId: string) => void;
    /** Turns a stored (v1) note's options into the engine's: pass compat.v1NodeToV2 (the default maps position, size and words). */
    toNode?: (v1: Record<string, any>) => Record<string, any>;
}
export interface ShownSuggestion {
    actionId: string;
    itemId: string;
    kind: SuggestionKind;
    nodeId: string | null;
    ghostId: string | null;
    label: string;
    box: {
        x: number;
        y: number;
        w: number;
        h: number;
    } | null;
    /** Whether Keep and Discard are drawn on it (a new note's show under the pointer or with focus). */
    controls: boolean;
    /** Its action's frame: the box around the action's new notes (null when it adds none). */
    frame: {
        x: number;
        y: number;
        w: number;
        h: number;
    } | null;
}
/** One action's group as drawn: its frame, its one tag, and its Keep all / Discard all (world boxes). */
export interface ShownGroup {
    actionId: string;
    frame: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    tag: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    all: {
        x: number;
        y: number;
        w: number;
        h: number;
    } | null;
    words: string;
}
export interface AgentSuggestions {
    set(actions: SuggestionAction[]): void;
    shown(): ShownSuggestion[];
    /** Each action's frame, tag and Keep all / Discard all, as drawn. */
    groups(): ShownGroup[];
    /** Keep or Discard one suggestion, as its buttons do (for keyboard hosts and tests). */
    keep(ref: SuggestionRef): void;
    discard(ref: SuggestionRef): void;
    /** Keep all / Discard all of one action, as its frame's buttons do. */
    keepAll(actionId: string): void;
    discardAll(actionId: string): void;
    destroy(): void;
}
/** The suggestions still waiting, in order, each with its action. */
export declare function pendingItems(actions: SuggestionAction[]): {
    action: SuggestionAction;
    item: SuggestionItem;
}[];
/** What an action's waiting items are, in a few words: "3 notes, 2 lines". */
export declare function groupWords(items: SuggestionItem[]): string;
export declare function createAgentSuggestions(host: any, options?: AgentSuggestionsOptions): AgentSuggestions;
