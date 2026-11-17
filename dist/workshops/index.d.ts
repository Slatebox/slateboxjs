import React from 'react';
import { type Workshop } from './model';
export * from './model';
export interface WorkshopBoardProps {
    value: Workshop;
    onChange: (value: Workshop) => void;
}
export declare function WorkshopBoard({ value, onChange }: WorkshopBoardProps): React.JSX.Element;
