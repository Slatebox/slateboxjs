import type { Workshop } from './model';
import type { WorkshopEdit } from './edits';
/**
 * The rule edits that turn `before`'s rulebook into `after`'s, so a whole-board save that changes the
 * rules is made again by the reducer, with the audit line of whoever saves it: adds, then changes,
 * then removals. Null when the change is not one the edits can make (a rule whose kind or lanes
 * changed under the same id). Lanes are named by id.
 */
export declare function behaviourEditsBetween(before: Workshop, after: Workshop): WorkshopEdit[] | null;
/**
 * An earlier board put back (Undo): its rules as they were, under a newer revision than either
 * board's, so a drop made under the undone rules is checked again. A rule edit is one undo step.
 */
export declare function restoreWorkshop(current: Workshop, earlier: Workshop): Workshop;
