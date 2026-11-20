export type AgentStepStatus = 'todo' | 'doing' | 'done' | 'skipped' | 'stopped';
export interface AgentPresenceRecord {
    /** Stable per token and slate; never a token id. */
    agentKey: string;
    /** "Ada's agent" or "Ada's agent · Client name". */
    label: string;
    initial: string;
    colorIndex: number;
    /** Note ids, or card-<id> / lane-<id> for a workshop. */
    targets: string[];
    plan?: {
        steps: {
            text: string;
            status: AgentStepStatus;
        }[];
        current: number;
    } | null;
    /** What the run is doing when it sent no plan (the save's message). */
    message?: string | null;
    status: 'live' | 'done' | 'stopped';
    updatedAt: number | string | Date;
    endedAt?: number | string | Date | null;
    expiresAt: number | string | Date;
}
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
    }[];
    destroy(): void;
}
/** Agent colours. People's colours never use these; the shape, not only the colour, says "agent". */
export declare const AGENT_PALETTE: readonly string[];
export declare const AGENT_GLIDE_MS = 400;
export declare const AGENT_VISIT_MS = 250;
export declare const AGENT_MAX_VISITS = 5;
export declare const AGENT_HOLD_MS = 6000;
export declare const AGENT_FADE_MS = 600;
export declare const AGENT_MAX_DRAWN = 6;
/** The step a tag shows: the plan's current step, or the save's message when there is no plan. */
export declare function agentStepText(record: AgentPresenceRecord): string | null;
/** The checklist lines a record shows, each with its glyph. */
export declare function agentChecklist(record: AgentPresenceRecord): string[];
/**
 * Which records are drawn at `now`, and how: a live record until it expires (a run that went
 * silent), an ended one for holdMs and then fading for fadeMs. At most `max`, newest first.
 */
export declare function visibleAgents(records: AgentPresenceRecord[], now: number, { holdMs, fadeMs, max }?: {
    holdMs?: number | undefined;
    fadeMs?: number | undefined;
    max?: number | undefined;
}): {
    record: AgentPresenceRecord;
    opacity: number;
    until: number;
}[];
export declare function createAgentPresence(slate: any, options?: AgentPresenceOptions): AgentPresence;
