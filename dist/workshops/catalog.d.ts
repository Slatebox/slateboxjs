import type { Workshop } from './model';
import type { WorkshopBoardKind, WorkshopEditKindName } from './edits';
import type { RuleKindId } from './behaviour';
export declare const catalogVersion = "1.0";
export type CatalogGroup = 'plan' | 'decide' | 'meetings' | 'track' | 'map';
export declare const catalogGroups: {
    id: CatalogGroup | 'all';
    label: string;
}[];
/** One thing a board does, the edit that does it, and how to say it. */
export interface CatalogMove {
    edit: WorkshopEditKindName;
    words: string;
    say: string;
    rule?: RuleKindId;
}
export interface CatalogEntry {
    /** Stable: /new#add=<id>, exec, analytics. */
    id: string;
    group: CatalogGroup;
    name: string;
    /** One line under the name. */
    line: string;
    /** The job it does, in the words people search with. */
    synonyms: string[];
    build: {
        kind: WorkshopBoardKind;
        sample?: 'launch-plan' | 'pipeline' | 'budget';
    };
    /** What a person says to add it: the first is the Add button's message. */
    addSay: string[];
    /** The workshop_edits this board offers, joined to the engine's edit table (not copied): each has a move with a phrase. */
    edits: WorkshopEditKindName[];
    /** The rule kinds a person can give it by chat (behaviour.ts). */
    rules: RuleKindId[];
    /**
     * What a person can do with it, each with the phrase that does it ("Say it like this"). Slots the app
     * fills from the live board and checks against its parser: {card}, {lane}, {other} (another lane),
     * {busy} (a lane with cards), {ruled} (a lane with a limit rule).
     */
    moves: CatalogMove[];
    limits: string[];
    /** A looping picture of its signature drag; the caption is the rule's own sentence. */
    loop: {
        src: string;
        alt: string;
        caption: string;
        steps: string[];
    };
    multiPerSlate: false;
}
export declare const catalog: readonly CatalogEntry[];
export declare function catalogEntry(id: string): CatalogEntry | undefined;
/** The entries of a group (or all), in catalogue order. */
export declare function catalogList(group?: CatalogGroup | 'all'): CatalogEntry[];
/** A business board's sample, from slateboxjs/workshops/rules (sampleLaunchPlan, samplePipeline, sampleBudget): this chunk keeps no rules. */
export type CatalogSamples = Partial<Record<'launch-plan' | 'pipeline' | 'budget', () => Workshop>>;
/** The board an entry adds, as data, named after the topic when one is given. A business board needs its sample. */
export declare function catalogPreset(id: string, topic?: string, samples?: CatalogSamples): Workshop;
/**
 * "Add a retro", "Add a retro about the Q3 launch", "Add pros and cons for hiring": which entry, and
 * the topic. Null for anything else (a card called Retro, a workshop described in lanes).
 */
export declare function catalogAddRequest(message: string): {
    id: string;
    topic?: string;
} | null;
/**
 * The local answer to a question about the library: "what can I add?" (all), or a job ("something to
 * track deals") ranked by name and synonyms. Null when the message is not about adding (the chat
 * goes on as before).
 */
export declare function catalogMatch(message: string): {
    all: boolean;
    entries: string[];
} | null;
/** Whether an entry can be added to this slate, and if not, the honest sentence (the control is never disabled). */
export declare function catalogFits(id: string, slate: {
    hasBoard: boolean;
}): {
    ok: true;
} | {
    ok: false;
    reason: string;
};
