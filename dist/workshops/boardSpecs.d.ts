import React from 'react';
import { type DragSpec, type DragSpecBuilder } from 'dragology';
import type { Workshop } from './model';
import type { PartPlace } from './native';
/**
 * The elements Dragology measures: every card and handle at its place, and each drop target
 * (another task's bar) as a box named `target-<card>`.
 */
export declare function partsGeometry(parts: PartPlace[], targets?: string[]): React.ReactSVGElement;
/**
 * A function from a pointer position (board coordinates) to the board a drop there makes, for
 * dragging the element `draggedId` grabbed at `grab`. Null when Dragology cannot place the element.
 */
export declare function headlessDrag(start: Workshop, draggedId: string, grab: {
    x: number;
    y: number;
}, render: (state: Workshop) => ReturnType<typeof partsGeometry>, spec: (d: DragSpecBuilder<Workshop>, state: Workshop) => DragSpec<Workshop>): ((point: {
    x: number;
    y: number;
}) => Workshop) | null;
/** Whether a point is inside a part's box, grown by `pad`. */
export declare const inside: (part: {
    x: number;
    y: number;
    width: number;
    height: number;
} | undefined, point: {
    x: number;
    y: number;
}, pad?: number) => boolean;
/**
 * Dragology's choice, except that a card let go inside the column of a stage or team it may go to
 * goes there even when the pointer is far from the slot it would take (a tall lane's foot).
 */
export declare function orColumnUnder(choose: ((point: {
    x: number;
    y: number;
}) => Workshop) | null, board: Workshop, cardId: string, parts: PartPlace[], legal: Workshop[]): ((point: {
    x: number;
    y: number;
}) => Workshop) | null;
