import { describe, it, expect, beforeEach } from "vitest";
import { SVG } from "@svgdotjs/svg.js";
import {
  applyAnimation,
  removeAnimations,
  animationHostOf,
  removeWithAnimationHost,
  installAnimationStyles,
  ANIMATION_HOST_ATTR,
} from "../../src/core/Animations";

// A path shape is a nested <svg> stretched to the note. Its animation plays on a
// plain <g> wrapped around it (WebKit ignores transforms on a nested <svg>, and
// animating the outline inside it squashes turning shapes on a stretched note).
describe("node animation host", () => {
  let root: any;
  let group: any;
  let shape: any;
  let text: any;

  beforeEach(() => {
    document.body.innerHTML = '<div id="c"></div>';
    root = SVG().addTo("#c").size(400, 300);
    group = root.group();
    shape = group.nested().size(120, 80);
    shape.path("M0 0L10 0L10 10Z");
    text = group.element("text");
  });

  it("plays a path shape's animation on a <g> around its nested <svg>, keeping the class on the shape", () => {
    expect(applyAnimation(shape, "rotate")).toBe(true);
    const host = animationHostOf(shape)!;
    expect(host).toBeTruthy();
    expect(host.tagName.toLowerCase()).toBe("g");
    expect(host.getAttribute(ANIMATION_HOST_ATTR)).toBe("1");
    expect(host.classList.contains("sb-animation-rotate")).toBe(true);
    expect(shape.node.classList.contains("sb-animation-rotate")).toBe(true);
    // The host sits where the shape was: behind the text.
    expect(host.parentNode).toBe(group.node);
    expect(host.nextElementSibling).toBe(text.node);
  });

  it("switches the animation off on the nested <svg> itself and never unclips it", () => {
    applyAnimation(shape, "powerSmash");
    const css = root.node.querySelector("#sb-node-animation-styles")!.textContent!;
    expect(css).toContain("svg.sb-animation-powerSmash{animation:none}");
    expect(css).not.toContain("overflow:visible");
  });

  it("reuses one host when the animation changes, and unwraps on removal", () => {
    applyAnimation(shape, "rotate");
    const host = animationHostOf(shape);
    applyAnimation(shape, "pulse");
    // removeAnimations (inside applyAnimation) unwraps, so a fresh host restarts the animation.
    const again = animationHostOf(shape)!;
    expect(again.classList.contains("sb-animation-pulse")).toBe(true);
    expect(again.classList.contains("sb-animation-rotate")).toBe(false);
    expect(root.node.querySelectorAll(`[${ANIMATION_HOST_ATTR}]`).length).toBe(1);
    void host;
    removeAnimations(shape);
    expect(animationHostOf(shape)).toBeNull();
    expect(shape.node.parentNode).toBe(group.node);
    expect(shape.node.nextElementSibling).toBe(text.node);
    expect(root.node.querySelectorAll(`[${ANIMATION_HOST_ATTR}]`).length).toBe(0);
  });

  it("animates text and plain elements directly (no host)", () => {
    applyAnimation(text, "mystery");
    expect(animationHostOf(text)).toBeNull();
    expect(text.node.classList.contains("sb-animation-mystery")).toBe(true);
  });

  it("removes the host with the shape when a note is reshaped", () => {
    applyAnimation(shape, "rotate");
    removeWithAnimationHost(shape);
    expect(root.node.querySelectorAll(`[${ANIMATION_HOST_ATTR}]`).length).toBe(0);
    expect(group.node.contains(shape.node)).toBe(false);
  });

  it("installs the styles once", () => {
    installAnimationStyles(shape);
    installAnimationStyles(shape);
    expect(root.node.querySelectorAll("#sb-node-animation-styles").length).toBe(1);
  });
});
