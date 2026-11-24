/** True for a raw path that sits further from its origin than its own size. */
export declare function isDisplacedPath(path: unknown): boolean;
/** The path moved to its own origin when it is displaced; anything else as it is. */
export declare function normalizeVectorPath<T>(path: T): T;
/** Normalise the raw paths a note's options carry (`vectorPath`, and `shape` when it holds a path). */
export declare function normalizeShapeOptions<O extends {
    vectorPath?: string;
    shape?: string;
}>(options: O): O;
