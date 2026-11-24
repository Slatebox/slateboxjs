// MediaNote: the poster's play button and caption are plain SVG in the note's group (so
// every picture of the slate shows them); pressing play puts a sandboxed player over the
// poster; nothing plays on its own.
import { describe, expect, it, vi, beforeEach } from "vitest";
import { MediaNote, MEDIA_CLASSES, MEDIA_IFRAME_SANDBOX, fitText } from "../../src/core/MediaNote";

const YT = "dQw4w9WgXcQ";

function fakeNode(media: any = { provider: "youtube", id: YT, url: `https://www.youtube.com/watch?v=${YT}`, title: "Launch demo", author: "Slatebox" }) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  svg.appendChild(group);
  document.body.appendChild(svg);
  const announce = vi.fn();
  const node: any = {
    id: "v1",
    options: { width: 320, height: 180, media, image: "https://files.example/p.jpg" },
    svgGroup: { node: group },
    backgroundRect: { x: () => 0, y: () => 0 },
    slate: { announce },
  };
  return { node, group, announce };
}

describe("MediaNote", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("draws a play button and a caption with the title and the host, and names the note", () => {
    const { node, group } = fakeNode();
    const media = new MediaNote(node);
    media.render();
    const overlay = group.querySelector(`.${MEDIA_CLASSES.overlay}`)!;
    expect(overlay).toBeTruthy();
    const play = overlay.querySelector(`.${MEDIA_CLASSES.play}`)!;
    expect(play.getAttribute("role")).toBe("button");
    expect(play.getAttribute("tabindex")).toBe("0");
    expect(play.getAttribute("aria-label")).toBe("Play Video: Launch demo (YouTube)");
    const words = [...overlay.querySelectorAll("text")].map((t) => t.textContent);
    expect(words).toEqual(["Launch demo", "YouTube · Slatebox"]);
    expect(group.getAttribute("aria-label")).toBe("Video: Launch demo (YouTube)");
    // Nothing from the video host loads before play is pressed.
    expect(group.querySelector("iframe")).toBeNull();
    expect(media.isPlaying()).toBe(false);
  });

  it("plays in a sandboxed privacy-respecting player when play is pressed, and stops on close", () => {
    const { node, group, announce } = fakeNode();
    const media = new MediaNote(node);
    media.render();
    const play = group.querySelector(`.${MEDIA_CLASSES.play}`)!;
    play.dispatchEvent(new Event("pointerup", { bubbles: true }));
    const frame = group.querySelector(`.${MEDIA_CLASSES.player} iframe`) as HTMLIFrameElement;
    expect(frame).toBeTruthy();
    const src = new URL(frame.getAttribute("src")!);
    expect(src.origin).toBe("https://www.youtube-nocookie.com");
    expect(src.searchParams.get("autoplay")).toBe("1");
    expect(frame.getAttribute("sandbox")).toBe(MEDIA_IFRAME_SANDBOX);
    expect(frame.getAttribute("referrerpolicy")).toBe("strict-origin-when-cross-origin");
    expect(frame.getAttribute("title")).toBe("Video: Launch demo (YouTube)");
    const fo = group.querySelector(`.${MEDIA_CLASSES.player}`)!;
    expect([fo.getAttribute("width"), fo.getAttribute("height")]).toEqual(["320", "180"]);
    expect(group.querySelector(`.${MEDIA_CLASSES.overlay}`)!.getAttribute("display")).toBe("none");
    expect(announce).toHaveBeenCalledWith("Playing Video: Launch demo (YouTube)");
    expect(media.isPlaying()).toBe(true);

    const close = group.querySelector(`.${MEDIA_CLASSES.close}`)!;
    close.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    expect(group.querySelector("iframe")).toBeNull();
    expect(group.querySelector(`.${MEDIA_CLASSES.overlay}`)!.hasAttribute("display")).toBe(false);
    expect(media.isPlaying()).toBe(false);
  });

  it("keeps a press on the play button from starting a drag of the note", () => {
    const { node, group } = fakeNode();
    new MediaNote(node).render();
    const seen = vi.fn();
    group.addEventListener("pointerdown", seen);
    group.querySelector(`.${MEDIA_CLASSES.play}`)!.dispatchEvent(new Event("pointerdown", { bubbles: true }));
    expect(seen).not.toHaveBeenCalled();
  });

  it("follows a resize: the player and the play button take the new size", () => {
    const { node, group } = fakeNode();
    const media = new MediaNote(node);
    media.render();
    media.play();
    node.options.width = 640;
    node.options.height = 360;
    media.update();
    const fo = group.querySelector(`.${MEDIA_CLASSES.player}`)!;
    expect([fo.getAttribute("width"), fo.getAttribute("height")]).toEqual(["640", "360"]);
    expect(group.querySelectorAll(`.${MEDIA_CLASSES.overlay}`).length).toBe(1);
    const ring = group.querySelector(`.${MEDIA_CLASSES.play} circle`)!;
    expect(ring.getAttribute("cx")).toBe("320");
  });

  it("does nothing for a note without a video, or a video id that is not the provider's form", () => {
    const plain = fakeNode(null);
    const none = new MediaNote(plain.node);
    none.render();
    expect(none.hasMedia()).toBe(false);
    expect(none.play()).toBe(false);
    expect(plain.group.children.length).toBe(0);
    const forged = fakeNode({ provider: "youtube", id: "../../x", url: "https://www.youtube.com/watch?v=x" });
    const bad = new MediaNote(forged.node);
    expect(bad.play()).toBe(false);
    expect(forged.group.querySelector("iframe")).toBeNull();
  });

  it("does not play while disabled, and destroy takes everything away", () => {
    const { node, group } = fakeNode();
    const media = new MediaNote(node);
    media.render();
    media.disable();
    expect(media.play()).toBe(false);
    media.enable();
    expect(media.play()).toBe(true);
    media.destroy();
    expect(group.children.length).toBe(0);
  });

  it("on a still picture of the slate (mediaPlayback false) shows the poster's button but never plays", () => {
    const { node, group } = fakeNode();
    node.slate.options = { mediaPlayback: false };
    const media = new MediaNote(node);
    media.render();
    const play = group.querySelector(`.${MEDIA_CLASSES.play}`)!;
    expect(play).toBeTruthy();
    expect(play.getAttribute("role")).toBeNull();
    expect(play.getAttribute("tabindex")).toBeNull();
    expect(play.getAttribute("aria-hidden")).toBe("true");
    expect(play.getAttribute("pointer-events")).toBe("none");
    play.dispatchEvent(new Event("click", { bubbles: true }));
    expect(media.canPlay()).toBe(false);
    expect(media.play()).toBe(false);
    expect(group.querySelector("iframe")).toBeNull();
  });

  it("cuts a long title to the caption's width", () => {
    expect(fitText("short", 300, 12)).toBe("short");
    const cut = fitText("a".repeat(200), 100, 12);
    expect(cut.endsWith("…")).toBe(true);
    expect(cut.length).toBeLessThan(20);
  });
});
