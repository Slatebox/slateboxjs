import type { WorkshopCandidateChooser } from './native';
/**
 * Let Dragology choose the board a pointer position means on a native slate.
 *
 * Nothing is rendered. Dragology's drag engine is a function of a spec, a starting
 * board and a pointer position: `dragSpecToBehavior(spec, context)` builds it, and
 * each call with `{ pointer }` returns the board a drop there would produce. The
 * spec is workshopDragSpec, the one the SVG board gives Dragology's renderer; the
 * geometry it measures (where a card sits in each candidate board, where each
 * lane's drop target is) comes from the same renderBoard function, which the
 * native artwork is laid out to match.
 *
 * Pass it to attachWorkshop as `chooseCandidate`. It needs React to be installed,
 * because Dragology imports it and describes geometry as React elements, but no
 * React tree is ever mounted.
 */
export declare const dragologyCandidates: WorkshopCandidateChooser;
