import { Svg } from '@svgdotjs/svg.js';
import { Node } from './Node';
import { NodesManager } from './NodesManager';
import { Invoker } from './Invoker';
import { PanZoom, PanZoomOptions } from './PanZoom';
export interface SlateOptions {
    name?: string;
    description?: string;
    followMe?: boolean;
    mindMapMode?: boolean;
    autoResizeNodesBasedOnText?: boolean;
    viewPort?: {
        originalWidth?: number;
        originalHeight?: number;
        showGrid?: boolean;
        snapToObjects?: boolean;
    };
    containerStyle?: {
        backgroundColor?: string;
        backgroundColorAsGradient?: boolean;
        backgroundGradientType?: string;
        backgroundGradientColors?: string[];
        backgroundGradientStrategy?: string;
        backgroundImage?: string;
        backgroundSize?: string;
        backgroundEffect?: string;
        prevBackgroundColor?: string;
    };
    defaultLineColor?: string;
    themeId?: string;
    layoutType?: string;
    disableAutoLayoutOfManuallyPositionedNodes?: boolean;
    huddleType?: string;
    huddleEnabled?: boolean;
    tags?: string[];
    templateMarkdown?: string;
    templatePrompt?: string;
    isTemplate?: boolean;
    ai?: any;
    panZoom?: PanZoomOptions;
}
export declare class Slate {
    element: HTMLElement;
    canvas: Svg;
    nodes: NodesManager;
    invoker: Invoker;
    panZoom: PanZoom;
    options: SlateOptions;
    constructor(element: string | HTMLElement, options?: SlateOptions);
    private init;
    private makeResponsive;
    addNode(options?: any): Node;
    removeNode(id: string): boolean;
    getNode(id: string): Node | undefined;
    getAllNodes(): Node[];
    enablePanZoom(): void;
    disablePanZoom(): void;
    enablePan(): void;
    disablePan(): void;
    enableZoom(): void;
    disableZoom(): void;
    pan(point: {
        x: number;
        y: number;
    }): void;
    panBy(delta: {
        x: number;
        y: number;
    }): void;
    zoom(level: number): void;
    zoomBy(factor: number): void;
    zoomIn(): void;
    zoomOut(): void;
    zoomAtPoint(level: number, point: {
        x: number;
        y: number;
    }): void;
    resetPanZoom(): void;
    resetZoom(): void;
    resetPan(): void;
    fitToContent(): void;
    centerContent(): void;
    getZoom(): number;
    getPan(): {
        x: number;
        y: number;
    };
    resizePanZoom(): void;
}
