import { G, Rect, Text, Circle, Ellipse } from '@svgdotjs/svg.js';
import '@svgdotjs/svg.draggable.js';
export interface NodeOptions {
    id: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    fontColor?: string;
    textOpacity?: number;
    textXAlign?: 'left' | 'center' | 'right';
    textYAlign?: 'top' | 'middle' | 'bottom';
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    allowDrag?: boolean;
    isLocked?: boolean;
    shape?: 'rectangle' | 'circle' | 'ellipse';
    rotate?: {
        rotationAngle?: number;
    };
    textOffset?: {
        x?: number;
        y?: number;
    };
}
export declare class Node {
    id: string;
    options: NodeOptions;
    svgGroup: G;
    backgroundRect: Rect | Circle | Ellipse;
    textElement: Text;
    private slate;
    constructor(options: NodeOptions, slate: any);
    private generateId;
    private create;
    private createBackground;
    private createText;
    private centerText;
    private makeDraggable;
    position(x: number, y: number, callback?: () => void, easing?: any, duration?: number): void;
    toFront(): void;
    toBack(): void;
    remove(): void;
    hide(): void;
    show(): void;
    setText(text: string): void;
    setSize(width: number, height: number): void;
    setColors(backgroundColor?: string, borderColor?: string): void;
    lock(): void;
    unlock(): void;
}
