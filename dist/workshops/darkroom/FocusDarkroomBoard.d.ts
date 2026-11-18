import React from 'react';
import { type FocusDarkroom } from './model';
interface Props {
    value: FocusDarkroom;
    onChange?: (next: FocusDarkroom) => void;
    readOnly?: boolean;
}
export declare function FocusDarkroomBoard({ value, onChange, readOnly }: Props): React.JSX.Element;
export {};
