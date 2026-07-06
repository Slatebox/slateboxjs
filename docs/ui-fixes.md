# UI-usability iteration (2026-07-05, /loop)

Refocus on the slatebox UI as a human user; Miro as reference. Fix every broken
surface one at a time, root-cause, verify LIVE (:3000) with Playwright, persist +
two-window parity, e2e where possible. Library fixes in slateboxjs-v2; app pane
edits in the slatebox repo (approved, uncommitted/user-gated).

## Fixed
- U1 [app: LineProperties.jsx]: line-property toggles "didn't stick". Root cause:
  the pane's ToggleButtons kept LOCAL state but after onChange re-rendered the
  pane the highlight lagged the model (clicking ORTHOGONAL / Start ABSOLUTE
  updated the association + persisted on reopen, but the button didn't highlight
  immediately → felt like it didn't save). Fix: a useEffect syncs lineType /
  sourceLock / targetLock from the association's actual values on every relevant
  change. Verified live: ORTHOGONAL and ABSOLUTE now highlight immediately AND
  persist on reopen.

- U3 DONE [lib, pending commit]: the arrow now connects AT THE DROP POINT. The vendored
  onEndpointChange passed the target's CENTER as the drop point; now it captures the handle's
  release position (world coords) in attachHandleToTarget and passes THAT. Connector.pinDropAnchor
  converts the world drop point → a normalized [0,1] anchor on the node and stores it as source/
  targetAnchor (persists + renders there) on reattach (non-rotated nodes). Verified live: dropping
  the target endpoint on C's top-center → targetAnchor {0.50,0.06}, arrow endpoint at C's top edge.
  e2e connector-drop-point.

- U2 DONE [lib 9b2da5d+]: line cog + endpoint-lock toggles DRIFTED when a connected node moved
  (they're positioned at the connector geometry once; a move re-solves the line but the affordances
  stayed). Fix: applyPositionAndRotation clears the active line affordances on any node move (Miro
  hides connector UI during moves; re-click for fresh placement). Verified live: locks 2/cog 1 →
  0/0 after a move. e2e line-affordances-nodrift.
- U4 CHECKED: reload persistence WORKS via the real pane path (onChange→save); library
  serialize/deserialize round-trips lineType + sourceAnchor + arrows perfectly (loadJSON restores
  connectableType='orthogonal'). Earlier "revert" was a test artifact (direct applyLineProperty
  bypasses the save/broadcast). Not a bug.

- U5 DONE [lib, pending commit]: NODE SHAPE change didn't re-render. onNodeShapeChanged was a stub
  ("simplified implementation") that set options.shape (to the picker's raw path) but never re-drew
  → node stayed a rect. Fixes: (a) resolveShapePath now treats a raw path in `shape` as a path (was
  vectorPath-only); (b) new Node.setShape(shape, vectorPath?) removes the old shape, re-renders (named
  or raw path) behind the text, re-centers, re-binds resize/rotate; (c) Invoker.onNodeShapeChanged
  calls setShape. Verified live: picking a shape re-renders (rect → path in nested SVG); node COLOR
  swatch also verified working (blue→red). e2e node-setshape.

- U6 DONE [lib, pending commit]: NODE EFFECTS tab was empty AND inert. Two bugs: (a)
  slate.filters.availableFilters returned an array of {id}, but the app reads Object.keys(...) +
  [name].types → no effects rendered (and the v2 Slate had NO .filters at all — the facade getter
  wasn't on node.slate's path); (b) Invoker.onNodeEffectChanged was a stub. Fixes: FilterDef.types
  + getAvailableFilters() (object keyed by name w/ types); Slate.get filters() returns it (node.slate
  path); facade getter uses the same; Invoker.onNodeEffectChanged applies/removes via node.filters
  (exclusive toggle: removes prev, clears id on deselect). Verified live: EFFECTS shows dropShadow/
  blur/outline; clicking dropShadow sets DOM filter drop-shadow(...) + options.filters.vect. e2e
  node-effects.
- U7 DONE [lib, pending commit]: NODE IMAGE tab was a stub (onNodeImageChanged console.log only).
  Now applies via node.images.set(url,w,h) from the app's { img, w, h } pkg (clears on falsy img).
  Verified live: setting a data-URI image → node fill becomes url(#SvgjsPattern...) + options.image
  set; clearing restores the solid color. e2e node-image.

- U8 DONE [lib, pending commit]: SLATE BACKGROUND color/gradient/image changed options but never
  painted the container (onSlateBackgroundColorChanged / onSlateBackgroundImageChanged didn't call
  applyContainerStyle). Fix: both call applyContainerStyle(); the image handler also clears
  backgroundColorAsGradient (else the gradient branch wins in applyContainerStyle and the image never
  shows). Verified live: canvas bg → solid #ff8800, linear-gradient, then image url. e2e
  slate-background. DEFERRED: slate background EFFECT (texture) needs filters w/ types:['slate'] +
  onSlateBackgroundEffectChanged apply — SlateEffects list is empty until then. onSlateThemeChanged
  still a stub (theme apply to nodes) — larger, separate.

## Backlog (from user, this loop)
- U3b (was U3, done): the END OF THE ARROW should ALWAYS connect exactly at the DROP POINT on a
  node (dropping an endpoint should pin the connection there, not snap to the
  nearest edge midpoint).
- U4: RELOAD persistence — confirm lineType + anchors survive a page reload (and
  whether a guest slate persists at all).
- (ongoing) click every control in node pane / line pane / toolbars / cogs /
  anchors; verify state saves + survives reload + syncs two-window. Miro parity.

App files touched: imports/ui/components/line/LineProperties.jsx.
