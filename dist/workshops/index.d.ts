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
    /** Temporary model shown to a linked view while the pointer is held. */
    onPreview?: (value: Workshop | null) => void;
}
export declare function WorkshopBoard({ value, onChange, onPreview, onUndo, canUndo, readOnly }: WorkshopBoardProps): React.JSX.Element;
