import React from 'react';
import { type Workshop } from './model';
export declare function ReleasePlanReadout({ value, preview }: {
    value: Workshop;
    preview?: Workshop | null;
}): React.JSX.Element;
export interface WorkshopMove {
    cardId: string;
    laneId: string;
}
export declare function ReleaseMoveControls({ value, preview, stage, apply, cancel }: {
    value: Workshop;
    preview: WorkshopMove | null;
    stage: (candidate: Workshop, move: WorkshopMove) => void;
    apply: () => void;
    cancel: () => void;
}): React.JSX.Element;
