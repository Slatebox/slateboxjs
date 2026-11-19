export { OfflineHandoffBoard } from './OfflineHandoffBoard';
export { ListeningRoomBoard, type ListeningRoomBoardProps } from './ListeningRoomBoard';
import React from 'react';
import { type Workshop } from './model';
export { dragologyCandidates } from './dragologyCandidates';
import { type WorkshopMove } from './ReleasePlan';
export { ReleasePlanReadout, type WorkshopMove } from './ReleasePlan';
export * from './model';
export interface WorkshopBoardProps {
    value: Workshop;
    onChange: (value: Workshop, move?: WorkshopMove) => void;
    /** A shared host owns its revision-checked undo. Private controlled boards use local history. */
    onUndo?: () => void;
    canUndo?: boolean;
    readOnly?: boolean;
    /** Compact station map for conversation-led editors. Each playable exit remains a keyboard button. */
    mapCanvas?: boolean;
    /** Fit ordinary lane boards to the host while retaining legible notes and pointer targets. */
    fitLanes?: boolean;
    /** Hide the built-in readout when the host supplies its own accessible outcome display. */
    showPlacementOutcomes?: boolean;
    /** Hide the optional move-by-name selector when the host supplies equivalent keyboard movement. */
    showMoveControls?: boolean;
    /** Temporary model shown to a linked view while the pointer is held. */
    onPreview?: (value: Workshop | null) => void;
    /** Select a card with a stationary pointer or Enter/Space. Takes precedence over double-tap editing. */
    onSelectCard?: (cardId: string) => void;
    /** Open the host's object editor when an author double-clicks a card. */
    onEditCard?: (cardId: string) => void;
    /** Open the host's station editor from a map header by touch, click or keyboard. */
    onEditStation?: (stationId: string) => void;
    /** Open the ordinary lane editor from its heading. */
    onEditLane?: (laneId: string, anchorElement: SVGGElement) => void;
    /** Offer a place to author a new card in each ordinary lane with room. */
    onAddCard?: (laneId: string, anchorElement: SVGGElement) => void;
}
export declare function WorkshopBoard({ value, onChange, onPreview, onSelectCard, onEditCard, onEditStation, onEditLane, onAddCard, onUndo, canUndo, readOnly, fitLanes, mapCanvas, showPlacementOutcomes, showMoveControls }: WorkshopBoardProps): React.JSX.Element;
export { MoonGalleryBoard, type MoonGalleryBoardProps } from './MoonGalleryBoard';
export { FocusDarkroomBoard } from './darkroom/FocusDarkroomBoard';
export { StartupWorkshopBoard } from './StartupWorkshopBoard';
