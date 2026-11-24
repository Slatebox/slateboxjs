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
    /**
     * An empty spot on the slate (world units) the pointer goes to before its targets: where a
     * suggestion is about to land, say. Without targets it is where the pointer rests.
     */
    point?: {
        x: number;
        y: number;
    } | null;
    /** A short line said in a bubble over the pointer for AGENT_SAY_MS after sayAt. */
    say?: string | null;
    sayAt?: number | string | Date | null;
    /** Where the agent comes from: a visiting agent (its own MCP client), an invited one, or Slatebox's own. */
    origin?: 'visiting' | 'invited' | 'slatebox' | null;
    /** The client a visiting agent reported ("Claude"), cleaned by the host. */
    via?: string | null;
    /** An invited agent's icon: an https: or data:image URL the host proxied and size-capped. */
    iconUrl?: string | null;
    /** The first name of the person who invited it. */
    invitedBy?: string | null;
    /** The agent across its runs on this slate (stable per agent and slate, never a token id). */
    agentId?: string | null;
    /** Set by the host: what this agent suggested still waits on the slate for someone to keep or discard. */
    waiting?: boolean | null;
}
/** How long a pointer's bubble shows after the agent says something. */
export declare const AGENT_SAY_MS = 3000;
/** The origin line under an agent's name: "via Claude", "added by Ada", or nothing. */
export declare function agentOrigin(record: Pick<AgentPresenceRecord, 'origin' | 'via' | 'invitedBy'>): string;
/**
 * The name an agent is shown by: its label, then where it comes from ("Research · added by Ada",
 * "Ada's agent · via Claude"). A visiting agent whose label already names its client ("Ada's agent ·
 * Claude") keeps the label as it is.
 */
export declare function agentName(record: Pick<AgentPresenceRecord, 'label' | 'origin' | 'via' | 'invitedBy'>, max?: number): string;
/** An icon URL safe to draw: https:, or a data: image of a raster type. Anything else is null. */
export declare function safeIconUrl(url: unknown): string | null;
/** The bubble a record shows now, or null: its `say`, for AGENT_SAY_MS after sayAt. */
export declare function agentSaying(record: AgentPresenceRecord, now: number): string | null;
/** Agent colours. People's colours never use these; the shape, not only the colour, says "agent". */
export declare const AGENT_PALETTE: readonly string[];
export declare const AGENT_HOLD_MS = 6000;
export declare const AGENT_FADE_MS = 600;
export declare const AGENT_MAX_DRAWN = 6;
export declare function time(value: number | string | Date | null | undefined): number | null;
export declare const clip: (text: string, max: number) => string;
/** Text as it is drawn: one line of plain characters (the server cleans it; this keeps the canvas safe anyway). */
export declare const plainLine: (text: unknown) => string;
/** Whether a record points at suggestions: its targets are ghost notes (ghost-<id>, as the suggestions draw them). */
export declare const agentSuggests: (record: Pick<AgentPresenceRecord, "targets">) => boolean;
export declare const AGENT_SUGGESTING = "Suggesting\u2026";
export declare const AGENT_WAITING = "Waiting for you";
/**
 * The step a tag shows: what the agent is doing now. "Suggesting…" while its suggestion is still landing (`landing`: the
 * pointer is on its way to the ghosts, or they are not drawn yet) or while the live run that filed it goes on;
 * "Waiting for you" once what it suggested waits for Keep or Discard (`waiting`, set by the host); never "Done" before
 * either. Otherwise the plan's current step, or the save's message when there is no plan.
 */
export declare function agentStepText(record: AgentPresenceRecord, { landing }?: {
    landing?: boolean;
}): string | null;
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
