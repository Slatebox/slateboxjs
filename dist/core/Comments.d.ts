/**
 * Comments.ts - Comment node type support
 *
 * Comments are special nodes with isComment=true.
 * Provides creation/deletion and integration with collab events.
 */
export interface CommentOptions {
    text: string;
    x?: number;
    y?: number;
    author?: string;
    timestamp?: number;
}
/**
 * Create a comment node on the slate.
 */
export declare function createComment(slate: any, options: CommentOptions): any;
/**
 * Remove a comment node from the slate.
 */
export declare function removeComment(slate: any, nodeId: string): boolean;
/**
 * Get all comment nodes on the slate.
 */
export declare function getComments(slate: any): any[];
