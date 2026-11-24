import { AGENT_FADE_MS, AGENT_HOLD_MS, AGENT_MAX_DRAWN, AGENT_PALETTE, AGENT_SAY_MS, agentChecklist, agentName, agentOrigin, agentSaying, agentStepText, safeIconUrl, visibleAgents, type AgentPresenceRecord, type AgentStepStatus } from './agentPresenceText';
export { AGENT_FADE_MS, AGENT_HOLD_MS, AGENT_MAX_DRAWN, AGENT_PALETTE, AGENT_SAY_MS, agentChecklist, agentName, agentOrigin, agentSaying, agentStepText, safeIconUrl, visibleAgents, type AgentPresenceRecord, type AgentStepStatus, };
export { createAgentSuggestions, ghostIdOf, GHOST_PREFIX, pendingItems, type AgentSuggestions, type AgentSuggestionsOptions, type SuggestionAction, type SuggestionItem, type SuggestionRef, } from './AgentSuggestions';
export interface AgentPresenceOptions {
    now?: () => number;
    /** Jump instead of glide (defaults to the person's reduced-motion setting). */
    reducedMotion?: () => boolean;
    /** How long the final checklist stays after a run ends, then how long it fades. */
    holdMs?: number;
    fadeMs?: number;
    /** At most this many agents are drawn: the most recently active. */
    maxAgents?: number;
    /** Called when a tag is tapped, with whether its list is now open. */
    onToggle?: (agentKey: string, open: boolean) => void;
    /**
     * Screen pixels at each edge of the canvas that the host covers with something of its own (a call strip over
     * the bottom of the canvas, say). Pointers, tags and checklists are kept out of them, as out of the edge itself.
     */
    insets?: () => {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    } | null | undefined;
    /**
     * An agent working out of view gets a marker at the edge of the view ("Research is working →"); pressing it
     * brings the view to the agent. By default the canvas's own camera pans there, keeping the zoom.
     */
    goTo?: (point: {
        x: number;
        y: number;
    }, agentKey: string) => void;
}
export interface AgentPresence {
    set(records: AgentPresenceRecord[]): void;
    /** Open or close an agent's full checklist (the tag does this when tapped). */
    expand(agentKey: string, open?: boolean): void;
    /** What is drawn now, for hosts and tests. */
    shown(): {
        agentKey: string;
        label: string;
        step: string | null;
        x: number;
        y: number;
        opacity: number;
        compact: boolean;
        lines: string[];
        side: {
            right: boolean;
            down: boolean;
        };
        offscreen: boolean;
    }[];
    destroy(): void;
}
export declare const AGENT_GLIDE_MS = 400;
/** One beat of a choreographed run: the pointer's leg to each spot when it visits several in turn. */
export declare const AGENT_BEAT_MS = 450;
export declare const AGENT_VISIT_MS = 450;
export declare const AGENT_MAX_VISITS = 5;
interface Box {
    x: number;
    y: number;
    w: number;
    h: number;
}
/**
 * Which side of its pointer an agent's tag (and open checklist) goes: right and down unless that
 * leaves the view or covers words. Tried in order: right-down, left-down, right-up, left-up; the
 * first that stays in view and covers no target note wins, else the one that covers least (a
 * target note's words count three times another note's, and anything off screen counts most).
 * `at` is the pointer, `size` the tag block in screen pixels, `scale` screen pixels per world unit.
 */
export declare function agentTagSide(at: {
    x: number;
    y: number;
}, size: {
    w: number;
    h: number;
}, scale: number, view: Box | null, targets: Box[], others?: Box[], words?: Box[]): {
    right: boolean;
    down: boolean;
};
/** The world box the tag block takes on one side of its pointer. */
export declare function agentTagBox(at: {
    x: number;
    y: number;
}, size: {
    w: number;
    h: number;
}, scale: number, side: {
    right: boolean;
    down: boolean;
}): Box;
/**
 * Where the tag block is drawn on one side: as agentTagBox, slid back inside the view where it would leave it (as
 * draw() does for a pointer on screen), so a side is judged by where its words would really be.
 */
export declare function agentTagPlaced(at: {
    x: number;
    y: number;
}, size: {
    w: number;
    h: number;
}, scale: number, side: {
    right: boolean;
    down: boolean;
}, view: Box | null): Box;
/**
 * Where on a target note the pointer goes, and which way its tag points from there: inside one
 * of the note's corners, with the tag outward from that corner. Lower right first; the first
 * corner whose tag stays in view and off the note (and, where it can, off other notes) wins,
 * else the one that covers least.
 */
export declare function agentAnchor(note: Box, size: {
    w: number;
    h: number;
}, scale: number, view: Box | null, others?: Box[], words?: Box[]): {
    x: number;
    y: number;
    side: {
        right: boolean;
        down: boolean;
    };
};
export declare function createAgentPresence(slate: any, options?: AgentPresenceOptions): AgentPresence;
