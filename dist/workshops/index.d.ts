export { OfflineHandoffBoard } from './OfflineHandoffBoard';
export { ListeningRoomBoard, type ListeningRoomBoardProps } from './ListeningRoomBoard';
import React from 'react';
import { type Workshop } from './model';
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
    /** Fit ordinary lane boards to the host while retaining legible notes and pointer targets. */
    fitLanes?: boolean;
    /** Hide the built-in readout when the host supplies its own accessible outcome display. */
    showPlacementOutcomes?: boolean;
    /** Temporary model shown to a linked view while the pointer is held. */
    onPreview?: (value: Workshop | null) => void;
}
export declare function WorkshopBoard({ value, onChange, onPreview, onUndo, canUndo, readOnly, fitLanes, showPlacementOutcomes }: WorkshopBoardProps): React.JSX.Element;
export { MoonGalleryBoard, type MoonGalleryBoardProps } from './MoonGalleryBoard';
export { FocusDarkroomBoard } from './darkroom/FocusDarkroomBoard';
