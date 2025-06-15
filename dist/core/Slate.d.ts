import { Svg } from '@svgdotjs/svg.js';
import { Node } from './Node';
import { NodesManager } from './NodesManager';
import { Invoker } from './Invoker';
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
}
export declare class Slate {
    element: HTMLElement;
    canvas: Svg;
    nodes: NodesManager;
    invoker: Invoker;
    options: SlateOptions;
    constructor(element: string | HTMLElement, options?: SlateOptions);
    private init;
    private makeResponsive;
    addNode(options?: any): Node;
    removeNode(id: string): boolean;
    getNode(id: string): Node | undefined;
    getAllNodes(): Node[];
}
