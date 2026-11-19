import React from 'react';
import type { fitLaneLayout } from './fitLanes';
import { type Workshop } from './model';
export declare function NativeMapSurface({ board, fitted, width, height, children }: {
    board: Workshop;
    fitted?: ReturnType<typeof fitLaneLayout>;
    width: number;
    height: number;
    children: React.ReactNode;
}): React.JSX.Element;
