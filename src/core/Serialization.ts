/**
 * Serialization.ts - Full serialize/deserialize for SlateboxJS v2
 *
 * Produces and consumes JSON matching the v1 format:
 * {
 *   "options": { SlateOptions },
 *   "nodes": [
 *     {
 *       "options": { NodeOptions with xPos/yPos },
 *       "relationships": {
 *         "associations": [ Association ]
 *       }
 *     }
 *   ],
 *   "shareId": "string"
 * }
 */

import type { NodeOptions } from "./Node";
import type { SlateOptions } from "./Slate";
import {
  v1NodeToV2,
  v2NodeToV1,
  v1AssociationToV2,
  v2AssociationToV1,
  type V2Association,
} from "./compat";

// ─── JSON type definitions ───────────────────────────────────────────

export interface SlateJSON {
  options: Record<string, any>;
  nodes: NodeJSON[];
  shareId: string;
}

export interface NodeJSON {
  options: Record<string, any>;
  relationships: {
    associations: Record<string, any>[];
  };
}

// ─── Serialization ───────────────────────────────────────────────────

/**
 * Serialize an entire Slate instance to the v1-compatible JSON format.
 *
 * @param slate - The Slate instance to serialize
 * @param nodes - Optional subset of nodes to include (defaults to all)
 * @param asPresentation - If true, includes presentation ordering metadata
 */
export function serialize(
  slate: any,
  nodes?: any[],
  asPresentation?: boolean
): SlateJSON {
  const targetNodes = nodes || slate.nodes.allNodes;

  const serializedNodes: NodeJSON[] = targetNodes.map((node: any) =>
    serializeNode(node)
  );

  // If asPresentation, add ordering index to each node
  if (asPresentation) {
    serializedNodes.forEach((n, idx) => {
      n.options._presentationIndex = idx;
    });
  }

  return {
    options: serializeSlateOptions(slate.options),
    nodes: serializedNodes,
    shareId: slate.options.shareId || "",
  };
}

/**
 * Deserialize JSON into an existing Slate instance.
 * Clears existing nodes and replaces with deserialized content.
 *
 * @param json - The v1-compatible JSON to load
 * @param slate - The Slate instance to load into
 * @param preserve - If true, don't clear existing nodes (merge mode)
 * @param skipZoom - If true, don't adjust zoom/pan after load
 */
export async function deserialize(
  json: SlateJSON | string,
  slate: any,
  preserve: boolean = false,
  skipZoom: boolean = false
): Promise<void> {
  const data: SlateJSON =
    typeof json === "string" ? JSON.parse(json) : json;

  // Loading is not a user action: suppress onSlateChanged emission for the
  // duration (v1's loadJSON never fired change packages per node)
  slate.beginRemoteApply?.();
  try {
    await deserializeInner(data, slate, preserve, skipZoom);
  } finally {
    slate.endRemoteApply?.();
  }
}

async function deserializeInner(
  data: SlateJSON,
  slate: any,
  preserve: boolean,
  skipZoom: boolean
): Promise<void> {
  // Apply slate options (merge with existing)
  if (data.options) {
    const slateOpts = deserializeSlateOptions(data.options);
    Object.assign(slate.options, slateOpts);

    // Apply shareId
    if (data.shareId) {
      slate.options.shareId = data.shareId;
    }

    // Re-apply background now that containerStyle may have changed
    slate.applyContainerStyle?.();
  }

  // Clear existing nodes unless preserving
  if (!preserve) {
    slate.nodes.clear();
  }

  // First pass: create all nodes (without relationships)
  const nodeMap = new Map<string, any>();

  if (Array.isArray(data.nodes)) {
    for (const nodeJson of data.nodes) {
      const nodeOpts = deserializeNodeOptions(nodeJson.options);

      // Check if node already exists (in merge mode)
      const existing = slate.nodes.one(nodeOpts.id);
      if (existing) {
        // Update existing node options
        Object.assign(existing.options, nodeOpts);
        if (nodeOpts.x !== undefined && nodeOpts.y !== undefined) {
          existing.position(nodeOpts.x, nodeOpts.y);
        }
        nodeMap.set(nodeOpts.id!, existing);
      } else {
        const node = slate.addNode(nodeOpts);
        if (node) {
          nodeMap.set(node.id, node);
        }
      }
    }

    // Wait for all nodes to finish async creation (SVG elements, connectors, etc.)
    const readyPromises: Promise<void>[] = [];
    for (const node of nodeMap.values()) {
      if (node.ready) {
        readyPromises.push(node.ready);
      }
    }
    if (readyPromises.length > 0) {
      await Promise.all(readyPromises);
    }

    // Second pass: create relationships (deferred binding — nodes are now fully initialized)
    for (const nodeJson of data.nodes) {
      const nodeId = nodeJson.options.id || nodeJson.options.xPos !== undefined
        ? v1NodeToV2(nodeJson.options).id
        : nodeJson.options.id;

      if (!nodeId) continue;

      const parentNode = nodeMap.get(nodeId as string) || slate.nodes.one(nodeId as string);
      if (!parentNode) continue;

      const associations = nodeJson.relationships?.associations;
      if (!Array.isArray(associations) || associations.length === 0) continue;

      for (const assocData of associations) {
        const assoc = v1AssociationToV2(assocData);

        // Free-floating endpoint (L1b): no child node — render at the point.
        if ((assoc as any).targetPoint && parentNode?.relationships) {
          parentNode.relationships.addFloatingAssociation(
            (assoc as any).targetPoint,
            assoc
          );
          continue;
        }

        const childNode =
          nodeMap.get(assoc.childId) || slate.nodes.one(assoc.childId);

        if (childNode && parentNode) {
          // Store relationship data on the node for the Relationships system
          if (parentNode.relationships) {
            parentNode.relationships.addAssociation(childNode, assoc);
          } else {
            // Fallback: use basic connector
            try {
              if (!parentNode.connector.isEnabled()) {
                parentNode.connector.enable();
              }
              parentNode.connector.connectTo(childNode, {
                lineColor: assoc.lineColor,
                lineWidth: assoc.lineWidth,
              });
            } catch (e) {
              console.warn(
                "SERIALIZATION_DEBUG: Failed to create connection",
                assoc.parentId,
                "->",
                assoc.childId,
                e
              );
            }
          }
        }
      }
    }
  }

  // Adjust zoom/pan to fit content unless skipped.
  //
  // A single fixed-delay fit is unreliable: on a full page load the host may
  // call loadJSON before #slateCanvas has been laid out, so the container is
  // 0-sized and fit() computes a garbage viewBox that never self-corrects
  // (the "node loads but the view never frames it" bug). Instead, poll until
  // the container has real pixel dimensions AND nodes exist, then fit — and
  // fit once more on the next frame to settle after any final container
  // resize. This runs only during initial load, so it won't fight later user
  // panning.
  if (!skipZoom && slate.panZoom) {
    const contentCenterX = () => {
      const ns = slate.nodes?.allNodes ?? [];
      if (!ns.length) return null;
      let minX = Infinity,
        maxX = -Infinity;
      for (const n of ns) {
        const x = n.options.x ?? 0;
        const w = n.options.width ?? 100;
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x + w);
      }
      return (minX + maxX) / 2;
    };
    const attemptFit = (tries: number) => {
      if ((slate as any)._destroyed) return;
      const rect = slate.element?.getBoundingClientRect?.();
      const sized = !!rect && rect.width > 1 && rect.height > 1;
      const ccx = contentCenterX();
      if (sized && ccx !== null) {
        try {
          slate.fitToContent();
        } catch (e) {
          /* noop */
        }
        // Verify the fit actually framed the content — fit() no-ops if pan/zoom
        // isn't enabled yet or ran on a transient state, so confirm the viewBox
        // now centers on the content before we stop retrying.
        const vb = slate.canvas?.viewbox?.();
        const framed =
          vb && Math.abs(vb.x + vb.width / 2 - ccx) < vb.width / 2;
        if (framed) {
          if (typeof requestAnimationFrame !== "undefined") {
            requestAnimationFrame(() => {
              try {
                slate.fitToContent();
              } catch (e) {
                /* noop */
              }
            });
          }
          return;
        }
      }
      if (tries < 60) setTimeout(() => attemptFit(tries + 1), 50);
    };
    attemptFit(0);
  }
}

// ─── Node serialization ──────────────────────────────────────────────

/** Serialize a single Node to the v1-compatible JSON format */
export function serializeNode(node: any): NodeJSON {
  const opts = v2NodeToV1(node.options);

  // Ensure position is current
  if (node.svgGroup) {
    try {
      const bbox = node.svgGroup.bbox();
      opts.xPos = node.options.x ?? bbox.x;
      opts.yPos = node.options.y ?? bbox.y;
    } catch (e) {
      opts.xPos = node.options.x ?? 0;
      opts.yPos = node.options.y ?? 0;
    }
  }

  // Serialize rotation
  if (node.getRotation) {
    const rotation = node.getRotation();
    if (rotation !== 0) {
      opts.rotate = { rotationAngle: rotation };
    }
  }

  // Serialize relationships
  const associations: Record<string, any>[] = [];

  if (node.relationships && typeof node.relationships.serialize === "function") {
    const relData = node.relationships.serialize();
    if (relData?.associations) {
      associations.push(
        ...relData.associations.map((a: any) => v2AssociationToV1(a))
      );
    }
  } else if (node.connector) {
    // Fallback: serialize from connector
    const connections = node.connector.getConnections();
    for (const conn of connections) {
      // Only serialize outgoing connections (source is this node)
      if (conn.source === node || conn.source?.id === node.id) {
        associations.push({
          childId: conn.target?.id || conn.target,
          parentId: node.id,
          isStraightLine: false,
          lineColor: conn.lineColor || "#000",
          lineEffect: "",
          lineOpacity: 1,
          lineType: "bezier",
          lineCurviness: 0.1,
          lineCurveType: "cubic",
          lineWidth: conn.lineWidth || 6,
        });
      }
    }
  }

  return {
    options: opts,
    relationships: {
      associations,
    },
  };
}

/** Convert JSON node options to v2 NodeOptions */
export function deserializeNodeOptions(
  jsonOpts: Record<string, any>
): Partial<NodeOptions> {
  return v1NodeToV2(jsonOpts);
}

// ─── Slate options serialization ─────────────────────────────────────

/** Serialize SlateOptions for JSON output */
function serializeSlateOptions(options: SlateOptions): Record<string, any> {
  // Deep clone to avoid modifying the original
  const out: Record<string, any> = {};

  // Copy all serializable properties
  const keys = [
    "id", "name", "description", "container", "instance", "shareId",
    "enabled", "allowDrag", "followMe", "mindMapMode",
    "autoResizeNodesBasedOnText", "useLayoutQuadrants",
    "autoEnableDefaultFilters",
    "showbirdsEye", "sizeOfbirdsEye", "showMultiSelect",
    "showZoom", "showUndoRedo", "showStatus", "showLocks",
    "isPublic", "isUnlisted", "isPrivate", "isTemplate",
    "basedOnTemplate", "basedOnThemeId", "syncWithTheme",
    "allowCollaboration", "eligibleForThemeCompilation",
    "defaultLineColor", "themeId",
    "layoutType", "disableAutoLayoutOfManuallyPositionedNodes",
    "nodeOrder",
    "huddleType", "huddleEnabled",
    "tags", "templateMarkdown", "templatePrompt", "ai",
  ];

  for (const key of keys) {
    if ((options as any)[key] !== undefined) {
      out[key] = (options as any)[key];
    }
  }

  // Serialize nested objects
  if (options.viewPort) {
    out.viewPort = { ...options.viewPort };
  }
  if (options.containerStyle) {
    out.containerStyle = { ...options.containerStyle };
  }

  return out;
}

/** Deserialize JSON slate options to SlateOptions */
function deserializeSlateOptions(
  jsonOpts: Record<string, any>
): Partial<SlateOptions> {
  // v1 → v2 mapping is mostly 1:1 for slate options
  return jsonOpts as Partial<SlateOptions>;
}

// ─── Snapshot helper ─────────────────────────────────────────────────

/**
 * Take a snapshot of the current slate state.
 * Used by undo/redo system.
 */
export function snapshot(slate: any): SlateJSON {
  return serialize(slate);
}
