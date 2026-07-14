import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createComment,
  removeComment,
  getComments,
} from "../../src/core/Comments";

describe("Comments", () => {
  let mockSlate: any;

  beforeEach(() => {
    mockSlate = {
      addNode: vi.fn((opts) => ({
        id: "comment1",
        options: { ...opts },
      })),
      removeNode: vi.fn().mockReturnValue(true),
      nodes: {
        allNodes: [],
        one: vi.fn(),
      },
    };
  });

  describe("createComment", () => {
    it("should create a comment node with default styling", () => {
      const comment = createComment(mockSlate, { text: "Test comment" });

      expect(mockSlate.addNode).toHaveBeenCalledWith(
        expect.objectContaining({
          text: "Test comment",
          isComment: true,
          backgroundColor: "#fffde7",
          borderColor: "#ffd54f",
          showDelete: true,
          showAdd: false,
        })
      );
      expect(comment).toBeDefined();
    });

    it("should use custom position", () => {
      createComment(mockSlate, { text: "Note", x: 200, y: 300 });

      expect(mockSlate.addNode).toHaveBeenCalledWith(
        expect.objectContaining({ x: 200, y: 300 })
      );
    });

    it("should store author and timestamp", () => {
      const ts = Date.now();
      const comment = createComment(mockSlate, {
        text: "Note",
        author: "Alice",
        timestamp: ts,
      });

      expect(comment.options.commentAuthor).toBe("Alice");
      expect(comment.options.commentTimestamp).toBe(ts);
      // Metadata must be passed INTO addNode (not set afterward), so it's carried
      // by the onNodeAdded broadcast + the save — else it's lost on reload.
      expect(mockSlate.addNode).toHaveBeenCalledWith(
        expect.objectContaining({ commentAuthor: "Alice", commentTimestamp: ts })
      );
    });

    it("should default timestamp to now", () => {
      const before = Date.now();
      const comment = createComment(mockSlate, { text: "Note" });
      const after = Date.now();

      expect(comment.options.commentTimestamp).toBeGreaterThanOrEqual(before);
      expect(comment.options.commentTimestamp).toBeLessThanOrEqual(after);
    });
  });

  describe("removeComment", () => {
    it("should remove a comment node", () => {
      const commentNode = {
        id: "c1",
        options: { isComment: true },
      };
      mockSlate.nodes.one.mockReturnValue(commentNode);

      const result = removeComment(mockSlate, "c1");
      expect(result).toBe(true);
      expect(mockSlate.removeNode).toHaveBeenCalledWith("c1");
    });

    it("should return false for non-comment node", () => {
      mockSlate.nodes.one.mockReturnValue({
        id: "n1",
        options: { isComment: false },
      });

      expect(removeComment(mockSlate, "n1")).toBe(false);
    });

    it("should return false for non-existent node", () => {
      mockSlate.nodes.one.mockReturnValue(null);
      expect(removeComment(mockSlate, "nope")).toBe(false);
    });
  });

  describe("getComments", () => {
    it("should return only comment nodes", () => {
      mockSlate.nodes.allNodes = [
        { id: "n1", options: { isComment: false } },
        { id: "c1", options: { isComment: true } },
        { id: "n2", options: {} },
        { id: "c2", options: { isComment: true } },
      ];

      const comments = getComments(mockSlate);
      expect(comments).toHaveLength(2);
      expect(comments[0].id).toBe("c1");
      expect(comments[1].id).toBe("c2");
    });

    it("should return empty array when no comments", () => {
      mockSlate.nodes.allNodes = [
        { id: "n1", options: {} },
      ];

      expect(getComments(mockSlate)).toHaveLength(0);
    });
  });
});
