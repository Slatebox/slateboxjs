import { startLineTool } from './LineTool';
import { BirdsEye } from './BirdsEye';
export declare const partsBuiltIn = true;
export declare const lineToolNow: () => {
    startLineTool: typeof startLineTool;
};
export declare const loadLineTool: () => Promise<{
    startLineTool: typeof startLineTool;
}>;
export declare const birdsEyeNow: () => {
    BirdsEye: typeof BirdsEye;
};
export declare const loadBirdsEye: () => Promise<{
    BirdsEye: typeof BirdsEye;
}>;
