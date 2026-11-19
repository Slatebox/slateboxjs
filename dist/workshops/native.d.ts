/**
 * native.ts - run a workshop as real notes on a live Slate.
 *
 * attachWorkshop draws a validated workshop model onto a Slate the host already
 * has (pan, zoom, minimap, selection, inline editing and all) and keeps the notes
 * in step with the model. The model stays the one saved source of truth: the notes
 * are its drawing, they are never written into the slate's own document, and the
 * workshop's rules decide where a card may be dropped.
 *
 * Plain JavaScript, no React. The only thing it asks of the engine is the drag
 * policy in core/DragPolicy.ts.
 */
import { type Workshop } from './model';
/** What a person changed. A move names the card and its new lane; a rename names the lane or card and its new label. */
export interface WorkshopChangeEvent {
    cardId?: string;
    laneId?: string;
    rename?: {
        laneId?: string;
        cardId?: string;
        label: string;
    };
}
/** A change the workshop's rules did not allow, with the reason as a sentence (empty when the card was dropped outside every lane). */
export interface WorkshopRefusalEvent {
    cardId?: string;
    laneId?: string | null;
    rename?: {
        laneId?: string;
        cardId?: string;
        label: string;
    };
    reason: string;
}
/**
 * Chooses the board a pointer position means while a card is held. Called once as
 * the drag begins with the board, the card and where on the card it was grabbed;
 * returns a function from a pointer position (in board coordinates: world units
 * from the artwork's origin) to the board that a drop there would produce. Return
 * null to leave the choice to the lane under the pointer.
 */
export type WorkshopCandidateChooser = (board: Workshop, cardId: string, grab: {
    x: number;
    y: number;
}) => ((point: {
    x: number;
    y: number;
}) => Workshop) | null;
export interface AttachWorkshopOptions {
    /** A move or rename was committed. `next` is validated; the host persists it. */
    onChange?: (next: Workshop, change: WorkshopChangeEvent) => void;
    /** A drop or rename was refused. */
    onRefuse?: (refusal: WorkshopRefusalEvent) => void;
    /** The board a held or keyboard-staged card would produce, or null when there is none. */
    onPreview?: (candidate: Workshop | null) => void;
    /** Draw the same artwork with nothing draggable or editable. */
    readOnly?: boolean;
    /** Top-left corner of the artwork in world units. Defaults to the right of what the slate already holds. */
    origin?: {
        x: number;
        y: number;
    };
    /** Replace how a pointer position picks among the legal boards (see dragologyCandidates). */
    chooseCandidate?: WorkshopCandidateChooser;
}
export interface AttachedWorkshop {
    /** Redraw from a new model, moving only what changed. A drag in progress is cancelled first. */
    update(next: Workshop): void;
    /** Show a proposed model without committing it; null restores the committed one. Cards cannot be moved while a proposal is shown. */
    preview(candidate: Workshop | null): void;
    /** Switch between playable and view-only. */
    setReadOnly(readOnly: boolean): void;
    /**
     * Show the refusal cue on a lane (outline, reason on its caption, announcement)
     * for a move the host itself had to turn down, such as a save that lost a race.
     */
    refuse(laneId: string, reason: string): void;
    /** Remove the workshop's notes and its policy. Every other note on the slate is left as it was. */
    destroy(): void;
    /** The committed model. */
    readonly value: Workshop;
    /** Where the artwork's top-left corner is, in world units. */
    readonly origin: {
        x: number;
        y: number;
    };
    /** Resolves once the artwork for the current model is on the slate. */
    whenDrawn(): Promise<void>;
}
/**
 * Draw `workshop` on `slate` as native notes and let people play it.
 *
 * @example
 * const board = attachWorkshop(slate, model, {
 *   onChange: (next, change) => save(next),
 *   onRefuse: ({ reason }) => toast(reason),
 * })
 * board.update(modelFromServer)
 * board.destroy()
 */
export declare function attachWorkshop(slate: any, workshop: Workshop, options?: AttachWorkshopOptions): AttachedWorkshop;
