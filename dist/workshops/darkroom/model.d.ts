export declare const printFields: readonly ["firstPrint", "secondPrint", "thirdPrint"];
export type ReturnPath = 'start' | 'opener' | null;
export type FocusDarkroom = Record<(typeof printFields)[number], string> & {
    version: 1;
    route: ReturnPath;
};
export declare function normalizeFocusDarkroom(input: unknown): FocusDarkroom;
export declare function initialFocusDarkroom(query?: URLSearchParams): FocusDarkroom;
export declare function describeFocusDarkroom(value: FocusDarkroom): string;
