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

## Backlog (from user, this loop)
- U2: endpoint locks DRIFT (on-canvas padlock position / stale state as nodes move).
- U3b (was U3, done): the END OF THE ARROW should ALWAYS connect exactly at the DROP POINT on a
  node (dropping an endpoint should pin the connection there, not snap to the
  nearest edge midpoint).
- U4: RELOAD persistence — confirm lineType + anchors survive a page reload (and
  whether a guest slate persists at all).
- (ongoing) click every control in node pane / line pane / toolbars / cogs /
  anchors; verify state saves + survives reload + syncs two-window. Miro parity.

App files touched: imports/ui/components/line/LineProperties.jsx.
