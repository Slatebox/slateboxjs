import type * as LineToolModule from './LineTool';
import type * as BirdsEyeModule from './BirdsEye';
export interface SlateParts {
    lineTool?: Pick<typeof LineToolModule, 'startLineTool'>;
    birdsEye?: Pick<typeof BirdsEyeModule, 'BirdsEye'>;
}
/** Whether the parts are part of the bundle from the start: never here (slatePartsEager.ts says yes, as a constant the build folds). */
export declare const partsBuiltIn: boolean;
/** Hand the parts over at once (mainParts.ts does, for a host that loads the source). */
export declare function provideSlateParts(given: SlateParts): void;
/** The line tool, when it is here already. */
export declare const lineToolNow: () => Pick<typeof LineToolModule, "startLineTool"> | null;
/** The line tool, fetched the first time a slate draws a line. */
export declare const loadLineTool: () => Promise<typeof LineToolModule>;
/** The bird's-eye view, when it is here already. */
export declare const birdsEyeNow: () => Pick<typeof BirdsEyeModule, "BirdsEye"> | null;
/** The bird's-eye view, fetched the first time a slate asks for it. */
export declare const loadBirdsEye: () => Promise<typeof BirdsEyeModule>;
