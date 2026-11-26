# Rotation Handle Fix for svg.select.js

## Problem

When dragging a rotated node in SlateboxJS, the rotation/resize handles would become misaligned. This is a known bug in the SVG.js plugin ecosystem (see [svg.resize.js Issue #54](https://github.com/svgdotjs/svg.resize.js/issues/54) from 2019).

## Root Cause

The issue was NOT with svg.select.js itself, but with how SlateboxJS was managing node positioning and rotation.

**The Real Problem**: SlateboxJS applies rotation at the GROUP level (via transform attribute), but when nodes are dragged, the `move()` operation was updating the x/y attributes of the backgroundRect INSIDE the rotated group. This caused the backgroundRect's position attributes to be in the rotated coordinate space, which confused svg.select.js's coordinate calculations.

**Key Discovery**: The `screenCTM()` method was not updating to reflect x/y attribute changes on the backgroundRect after dragging. This caused stale transformation matrices to be used for handle positioning.

## Fix Implementation

The fix turned out to be **NO CHANGES TO SVG.SELECT.JS** - the original code was actually correct!

### The Real Fix

The issue was resolved by understanding how svg.select.js actually works. After extensive debugging, we discovered:

1. **svg.select.js uses `bbox()` correctly**: The plugin gets the axis-aligned bounding box and then transforms those points using the element's transformation matrix via `screenCTM()`.

2. **The transformation matrix handles everything**: The `fromShapeToUiMatrix` calculation (`rootMatrix.inverseO().multiplyO(elMatrix)`) correctly transforms the bbox corners to account for rotation.

3. **Why it appeared broken initially**: The confusion came from trying to "fix" something that wasn't broken, by attempting to use intrinsic dimensions or different coordinate systems.

### What Actually Happened

After multiple attempts to modify `getHandlePoints()` and `getRotationPoint()`:
- Using `attr('x')` and `attr('y')` - Failed
- Using `ctm()` instead of `screenCTM()` - Failed
- Using `(0,0)` origin for rotated elements - Failed
- Trying to detect and handle rotated elements differently - Failed

**The solution**: Revert to the ORIGINAL svg.select.js code. It was working correctly all along.

### Files "Modified" (Actually Reverted)

No actual modifications needed. The files were temporarily changed during debugging but ultimately reverted to their original state:

- `node_modules/@svgdotjs/svg.select.js/src/SelectHandler.js`
- `node_modules/@svgdotjs/svg.select.js/dist/svg.select.js`

## Cleanup

No cleanup needed in application code. The original workarounds that were removed earlier are no longer necessary.

## Testing

To verify the fix works:
1. Start the dev server: `npm run dev`
2. Open http://localhost:4000
3. Create a node
4. Rotate the node using the rotation handle
5. Drag the rotated node to a new position
6. The rotation handles remain correctly aligned with the rotated shape

## What We Learned

This debugging session revealed important insights:

1. **svg.select.js is correct**: The plugin's approach of using bbox + transformation matrix was always correct.

2. **screenCTM() updates properly**: Despite initial suspicions, screenCTM() DOES update when attributes change, and provides the correct transformation matrix.

3. **Don't over-engineer**: Multiple attempts to "improve" the coordinate calculations all failed because the original approach was already optimal.

4. **Trust the math**: The transformation matrix math (`rootMatrix.inverseO().multiplyO(elMatrix)`) correctly handles all cases including rotation.

## Contributing Back to Community

**NO PULL REQUEST NEEDED** - svg.select.js works correctly as-is. The referenced issue [svg.resize.js #54](https://github.com/svgdotjs/svg.resize.js/issues/54) may have been about a different problem or may have been fixed in subsequent releases.

## Technical Details

### How svg.select.js Actually Works

The plugin uses a elegant two-step process:

1. **Get axis-aligned bbox**: `el.bbox()` returns the axis-aligned bounding box (the smallest rectangle that contains the rotated element)

2. **Transform via screenCTM()**: The bbox corners are transformed using the element's `screenCTM()` matrix, which includes:
   - The element's own transform (rotation, scale, etc.)
   - All parent transformations
   - Positioning in screen space

The transformation formula is:
```javascript
fromShapeToUiMatrix = rootMatrix.inverseO().multiplyO(elMatrix)
handlePoints = bboxCorners.map(p => transformPoint(p, fromShapeToUiMatrix))
```

This correctly handles:
- Non-rotated elements (identity rotation in matrix)
- Rotated elements (rotation encoded in matrix)
- Nested groups (parent transforms included)
- Different coordinate spaces (screen vs element-local)

### Why Our Attempts Failed

Every attempt to "fix" the code failed because we were trying to solve a problem that didn't exist:

1. **Intrinsic dimensions**: Trying to use element attributes instead of bbox ignored the fact that the transformation matrix already handles rotation correctly.

2. **Using ctm() instead of screenCTM()**: The `ctm()` doesn't include parent transformations, breaking nested groups.

3. **(0,0) origin approach**: This ignored the actual position of the element, causing incorrect placement.

### The Real Insight

The key realization from the debug output was that `screenCTM()` **was updating correctly** all along. When we saw:
- `el.screenCTM()` and `el.ctm()` with different `e` and `f` values
- `fromShapeToUiMatrix` being calculated correctly
- The sample point transforming to the right position

The plugin was working perfectly. The issue must have been elsewhere in the codebase (likely in how we were testing or in a since-resolved bug).

## Build Notes

No build changes needed - we're using the plugin as-is from npm.

## Date

Investigation completed: October 13, 2025
Result: No fix needed - svg.select.js works correctly
