import React from 'react';
import { type Workshop } from './model';
export * from './model';
export interface WorkshopBoardProps {
    value: Workshop;
    onChange: (value: Workshop) => void;
    readOnly?: boolean;
    /** Temporary model shown to a linked view while the pointer is held. */
    onPreview?: (value: Workshop | null) => void;
}
export declare function WorkshopBoard({ value, onChange, onPreview, readOnly }: WorkshopBoardProps): React.JSX.Element;
