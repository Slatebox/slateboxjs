export * from './offlineHandoff';
export * from './listeningRoom';
export { releaseLoad, releasePlan } from './release';
import type { SlateJSON } from '../core/Serialization';
export interface StationImage {
    src: string;
    alt: string;
}
export interface WorkshopLane {
    id: string;
    label: string;
    capacity?: number;
    station?: {
        column: number;
        row: number;
        next: string[];
        outcome: string;
        image?: StationImage;
    };
}
export interface WorkshopCard {
    id: string;
    label: string;
    laneId: string;
    allowedLaneIds?: string[];
    points?: number;
    dependsOn?: string[];
}
export interface WorkshopSignal {
    id: string;
    label: string;
    cardId: string;
    laneId: string;
    whenPresent: string;
    whenAbsent: string;
}
export interface ResolvedWorkshopSignal extends WorkshopSignal {
    present: boolean;
    text: string;
}
export interface Workshop {
    experience?: StartupExperience;
    version: 1;
    kind?: 'release-plan';
    title: string;
    lanes: WorkshopLane[];
    /** Lane IDs in playback order. Boards without an authored order present their lanes in layout order. */
    presentationOrder?: string[];
    signals?: WorkshopSignal[];
    cards: WorkshopCard[];
}
/** Resolve the original lanes for playback without changing their board positions or rules. */
export declare function workshopPresentationLanes({ lanes, presentationOrder }: Pick<Workshop, 'lanes' | 'presentationOrder'>): WorkshopLane[];
/** Resolve authored outcomes against this exact committed or transient candidate board. */
export declare function resolveWorkshopSignals(board: Workshop): ResolvedWorkshopSignal[];
export interface WorkshopPresentationScene {
    lane: WorkshopLane;
    cards: WorkshopCard[];
    signals: ResolvedWorkshopSignal[];
    /** Native node IDs for this viewpoint in the artwork produced by workshopToSlate. */
    nodeIds: string[];
}
/** Describe each authored viewpoint from the committed state, including empty lanes. */
export declare function workshopPresentationScenes(board: Workshop): WorkshopPresentationScene[];
export declare const maxWorkshopCards = 24;
export declare function validateWorkshop(input: unknown): Workshop;
/** Build the fragment for /new/workshop from portable workshop data. */
export declare function encodeWorkshopFragment(value: Workshop): string;
/** Read location.hash before creating a slate. Only the validated model is imported. */
export declare function decodeWorkshopFragment(fragment: string): Workshop;
export declare function availableLanes(board: Workshop, card: WorkshopCard): WorkshopLane[];
export declare function moveWorkshopCard(board: Workshop, cardId: string, laneId: string): Workshop;
/**
 * The board a move would produce, for every kind of workshop: `board` itself when the
 * card is already in that lane, or null when the move is unavailable.
 *
 * This is the one question each board asks before a drag, a preview or a commit.
 * Release plans answer with planReleaseMove (which may bring dependent features
 * along), a startup experience with planStartupMove (an interview dropped on the
 * occupied prototype swaps with it), and everything else with the lane rules:
 * capacity, allowedLaneIds and, on a map, the stations reachable from here.
 */
export declare function workshopCandidate(board: Workshop, cardId: string, laneId: string): Workshop | null;
/** Every lane the card may be dropped in, including the one it is in. */
export declare function workshopDestinations(board: Workshop, cardId: string): WorkshopLane[];
/** Why workshopCandidate refuses this move, as a sentence for the person moving the card. Null when the move is available. */
export declare function workshopRefusal(board: Workshop, cardId: string, laneId: string): string | null;
/** The second line under a lane's name: how full it is, or what its cards add up to. */
export declare function workshopLaneCaption(board: Workshop, laneId: string): string;
export declare const workshopLayout: {
    pitch: number;
    width: number;
    row: number;
    height: number;
    top: number;
};
export declare const laneColors: string[];
export declare function workshopPositions(board: Workshop, layout?: {
    pitch: number;
    width: number;
    row: number;
    height: number;
    top: number;
}, stationGap?: number): {
    points: {
        x: number;
        y: number;
    }[];
    width: number;
    height: number;
};
/** Start with two empty, editable lanes. IDs have no special meaning to the renderer. */
export declare function createLaneWorkshop(): Workshop;
export declare function addWorkshopLane(input: Workshop, lane: Pick<WorkshopLane, 'label' | 'capacity'>): Workshop;
export declare function addWorkshopCard(input: Workshop, laneId: string, card: Pick<WorkshopCard, 'label' | 'allowedLaneIds'>): Workshop;
/** A fresh editable map, with enough structure to move a token or add a second path. */
export declare function createWorkshopMap(): Workshop;
/** Append a destination without moving any existing stations or relaxing token restrictions. */
export declare function addWorkshopBranch(board: Workshop, fromStationId: string, branch: {
    label: string;
    outcome: string;
    image?: StationImage;
}): Workshop;
export declare const nightTransfer: Workshop;
export interface WorkshopArtworkOptions {
    /**
     * Draw for a live slate instead of a presentation: rounded notes in the canvas's
     * own type, a `caption-<lane>` line under each lane name, and a `column-<lane>`
     * shape behind each lane. Lane and card notes keep their `lane-<id>` and
     * `card-<id>` names.
     */
    native?: boolean;
    /** Where the artwork's top-left corner goes, in the slate's world units. */
    origin?: {
        x: number;
        y: number;
    };
    /**
     * Draw each lane column at least this many cards tall. A board keeps its shape
     * (and its drop zones) while a held card previews a board with shorter lanes.
     */
    rows?: number;
}
/** The names of the notes workshopToSlate draws for a lane or a card. */
export declare const workshopNodeIds: {
    lane: (id: string) => string;
    card: (id: string) => string;
    image: (id: string) => string;
    caption: (id: string) => string;
    column: (id: string) => string;
};
/**
 * Draw a workshop as slate notes. With no options this is the presentation artwork
 * the app and its snapshots already consume; `{ native: true }` is the artwork
 * attachWorkshop keeps on a live slate.
 */
export declare function workshopToSlate(input: Workshop, options?: WorkshopArtworkOptions): SlateJSON;
export declare const industrialWorkshop: Workshop;
export * from './moonGallery';
export * from './darkroom/model';
export { attachWorkshop, type AttachWorkshopOptions, type AttachedWorkshop, type WorkshopCandidateChooser, type WorkshopChangeEvent, type WorkshopRefusalEvent } from './native';
export type StartupExperience = {
    version: 1;
    kind: 'customer-interviews' | 'experiment-budget';
};
export declare const interviews: {
    id: string;
    who: string;
    quote: string;
    action: string;
    signal: string;
}[];
export declare const channels: {
    id: string;
    label: string;
    unit: string;
    single: string;
    per: number;
    rate: string;
}[];
export declare function createInterviewWorkshop(): Workshop;
export declare function createBudgetWorkshop(): Workshop;
/** Boards outside the versioned layouts stay editable with the ordinary lane renderer. */
export declare function startupExperienceKind(board: Workshop): "customer-interviews" | "experiment-budget" | undefined;
export declare function planStartupMove(board: Workshop, cardId: string, destination: string): Workshop | null;
export declare function workshopBudgetResult(board: Workshop, laneId: string): {
    amount: number;
    description: string;
} | null;
