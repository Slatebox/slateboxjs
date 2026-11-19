import React from 'react';
import { printFields, type FocusDarkroom } from './model';
interface Props {
    value: FocusDarkroom;
    onChange?: (next: FocusDarkroom) => void;
    readOnly?: boolean;
    onEditPrint?: (field: (typeof printFields)[number]) => void;
}
export declare function FocusDarkroomBoard({ value, onChange, readOnly, onEditPrint }: Props): React.JSX.Element;
export {};
