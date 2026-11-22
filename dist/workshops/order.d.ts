/** Whether a stored order key is one this module could have made. */
export declare const isOrderKey: (key: unknown) => key is string;
/** A key after `a` and before `b` (either may be missing: the first or the last place). */
export declare function orderBetween(a?: string | null, b?: string | null): string;
/** Sort siblings by their key, then by id (two keys made at once are equal; the id settles it). A card without a key comes first. */
export declare const byOrder: <T extends {
    id: string;
    order?: string;
}>(a: T, b: T) => 0 | 1 | -1;
/** `count` keys in order, for cards laid down together (a sample, a paste). */
export declare function orderKeys(count: number): string[];
