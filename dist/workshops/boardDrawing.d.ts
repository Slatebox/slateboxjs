import React from 'react';
import { type fitLaneLayout } from './fitLanes';
import { type DraggableProps, type DragSpec, type DragSpecBuilder } from 'dragology';
import { type Workshop, type WorkshopCard, type WorkshopLane } from './model';
/**
 * The Dragology spec for dragging one card: among the boards its lanes allow, the
 * pointer picks the closest. On an ordinary lane board each lane is a drop target
 * and anywhere else means "stay" (a full or forbidden lane is not an invitation to
 * a neighbouring one); on a map or a release plan the card goes to the nearest
 * board it may reach.
 *
 * The SVG board hands this to Dragology's renderer with the lane rules it has
 * always used (availableLanes and moveWorkshopCard). A native slate evaluates the
 * same spec at its own pointer positions with workshopCandidate as the rule, so an
 * experience's own moves (an interview swapped into the prototype) are offered too
 * (see dragologyCandidates).
 */
export declare function workshopDragSpec(d: DragSpecBuilder<Workshop>, state: Workshop, card: WorkshopCard, lanes?: WorkshopLane[], candidate?: (board: Workshop, cardId: string, laneId: string) => Workshop | null): DragSpec<Workshop>;
export declare function renderBoard({ state, d, draggedId, isTracking }: DraggableProps<Workshop>, readOnly: boolean, fitted?: ReturnType<typeof fitLaneLayout>, editHeaders?: boolean, addCards?: boolean, actionId?: string, mapCanvas?: boolean, selectCards?: boolean): React.JSX.Element;
