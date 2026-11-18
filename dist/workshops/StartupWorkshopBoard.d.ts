import React from 'react';
import { type Workshop } from './model';
type Props = {
    value: Workshop;
    readOnly?: boolean;
    onChange?: (value: Workshop) => unknown;
};
export declare function StartupWorkshopBoard({ value, readOnly, onChange }: Props): React.JSX.Element | null;
export {};
