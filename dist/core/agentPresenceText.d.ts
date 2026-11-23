export type AgentStepStatus = 'todo' | 'doing' | 'done' | 'skipped' | 'stopped';
export interface AgentPresenceRecord {
    /** Stable per token and slate; never a token id. */
    agentKey: string;
    /** "Ada's agent" or "Ada's agent · Client name". */
    label: string;
    initial: string;
    colorIndex: number;
    /** Note ids, or card-<id> / lane-<id> for a workshop (b2:card-<id> for a board scoped b2, see workshopNodeIds.of). */
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
/** Agent colours. People's colours never use these; the shape, not only the colour, says "agent". */
export declare const AGENT_PALETTE: readonly string[];
export declare const AGENT_HOLD_MS = 6000;
export declare const AGENT_FADE_MS = 600;
export declare const AGENT_MAX_DRAWN = 6;
export declare const time: (value: number | string | Date | null | undefined) => number | null;
export declare const clip: (text: string, max: number) => string;
/** Text as it is drawn: one line of plain characters (the server cleans it; this keeps the canvas safe anyway). */
export declare const plainLine: (text: unknown) => string;
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
