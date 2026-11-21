import type { NodeJSON } from '../core/Serialization';
import type { PartPlace, Workshop, WorkshopEdit, WorkshopNoteStyle } from '../workshops/model';
/**
 * The edits that turn `before` into `after` on a launch plan, pipeline or budget: what a canvas
 * change carries (change.edits) so a server applies it with applyWorkshopEdits to the board as it
 * stands there, and two people changing different tasks or deals both keep their change.
 */
export declare function workshopEditsBetween(before: Workshop, after: Workshop): WorkshopEdit[];
/** "Forecast $205k of $250k". */
export declare function pipelineGauge(board: Workshop): string;
/** "$1.2M · balanced": always true, and that is the point. */
export declare function budgetHeader(board: Workshop): string;
/** The tasks `cardId` may be dropped on to wait on them: not itself, not what it waits on, nothing that waits on it. */
export declare function launchLinkTargets(board: Workshop, cardId: string): string[];
/** The parts as slate notes at `origin`: handles are see-through and borderless, the rest drawn in the host's note style. */
export declare function partNotes(parts: PartPlace[], board: Workshop, origin: {
    x: number;
    y: number;
}, style: WorkshopNoteStyle): NodeJSON[];
/** What a screen reader calls a grip: launch day, a task's length, or the divider after a team. */
export declare function handleLabel(model: Workshop, part: string): string | null;
