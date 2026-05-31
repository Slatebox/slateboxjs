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
export function createComment(
  slate: any,
  options: CommentOptions
): any {
  const node = slate.addNode({
    text: options.text,
    x: options.x || 100,
    y: options.y || 100,
    width: 150,
    height: 80,
    backgroundColor: "#fffde7",
    borderColor: "#ffd54f",
    borderWidth: 1,
    fontColor: "#333",
    fontSize: 12,
    isComment: true,
    showDelete: true,
    showAdd: false,
    showResize: true,
    showRotate: false,
    showMenu: false,
    allowResize: true,
  });

  if (node) {
    // Store metadata
    node.options.commentAuthor = options.author;
    node.options.commentTimestamp = options.timestamp || Date.now();
  }

  return node;
}

/**
 * Remove a comment node from the slate.
 */
export function removeComment(
  slate: any,
  nodeId: string
): boolean {
  const node = slate.nodes.one(nodeId);
  if (!node || !node.options.isComment) {
    return false;
  }
  return slate.removeNode(nodeId);
}

/**
 * Get all comment nodes on the slate.
 */
export function getComments(slate: any): any[] {
  return slate.nodes.allNodes.filter(
    (n: any) => n.options.isComment === true
  );
}
