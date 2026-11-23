// MediaInput: a video address pasted on the page (outside any field) or dropped on the
// canvas becomes a media note; the host makes it when it stores posters.
import { describe, expect, it, vi, beforeEach } from "vitest";
import { MediaInput, videoAddressIn } from "../../src/core/MediaInput";

const URL_YT = "https://youtu.be/dQw4w9WgXcQ";

function fakeSlate(extra: Record<string, any> = {}) {
  const element = document.createElement("div");
  document.body.appendChild(element);
  const added: any[] = [];
  const slate: any = {
    element,
    options: { enabled: true, events: {} },
    isReadOnly: () => false,
    isCommentOnly: () => false,
    nodes: { allNodes: [] },
    clientToWorld: ({ x, y }: any) => ({ x: x * 2, y: y * 2 }),
    addNode: vi.fn((options: any) => {
      added.push(options);
      return { id: options.id, options };
    }),
    selectNodes: vi.fn(),
    ...extra,
  };
  return { slate, element, added };
}

function paste(target: EventTarget, text: string) {
  const event = new Event("paste", { bubbles: true, cancelable: true }) as any;
  event.clipboardData = { getData: (type: string) => (type === "text/plain" ? text : "") };
  target.dispatchEvent(event);
  return event as Event;
}

describe("videoAddressIn", () => {
  it("takes one address on its own, never a sentence that mentions one", () => {
    expect(videoAddressIn(` ${URL_YT}\n`)).toBe(URL_YT);
    expect(videoAddressIn(`# comment\r\n${URL_YT}`)).toBe(URL_YT);
    expect(videoAddressIn(`watch ${URL_YT}`)).toBeNull();
    expect(videoAddressIn(`${URL_YT}\nhttps://vimeo.com/1`)).toBeNull();
    expect(videoAddressIn("https://example.com")).toBeNull();
  });
});

describe("MediaInput", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("makes a poster-less media note in the middle of the view when no host handles it", () => {
    const { slate, added } = fakeSlate();
    const input = new MediaInput(slate);
    input.enable();
    const event = paste(document.body, URL_YT);
    expect(event.defaultPrevented).toBe(true);
    expect(added).toHaveLength(1);
    expect(added[0]).toMatchObject({ width: 320, height: 180, text: "", imageFit: "cover", media: { provider: "youtube", id: "dQw4w9WgXcQ" } });
    expect(added[0].image).toBeUndefined();
    expect(slate.selectNodes).toHaveBeenCalled();
    input.destroy();
  });

  it("hands the request to the host (it fetches the title and stores the poster)", () => {
    const onMediaRequested = vi.fn();
    const { slate, added, element } = fakeSlate();
    slate.options.events.onMediaRequested = onMediaRequested;
    const input = new MediaInput(slate);
    input.enable();
    const drop = new Event("drop", { bubbles: true, cancelable: true }) as any;
    drop.clientX = 10;
    drop.clientY = 20;
    drop.dataTransfer = { getData: (type: string) => (type === "text/uri-list" ? URL_YT : ""), types: ["text/uri-list"] };
    element.dispatchEvent(drop);
    expect(drop.defaultPrevented).toBe(true);
    expect(onMediaRequested).toHaveBeenCalledWith(expect.objectContaining({ url: URL_YT, x: 20, y: 40, via: "drop", media: expect.objectContaining({ provider: "youtube" }) }));
    expect(added).toHaveLength(0);
    input.destroy();
  });

  it("leaves pastes into fields, other text, read-only viewers and an open note editor alone", () => {
    const { slate, added } = fakeSlate();
    const input = new MediaInput(slate);
    input.enable();
    const field = document.createElement("input");
    document.body.appendChild(field);
    expect(paste(field, URL_YT).defaultPrevented).toBe(false);
    expect(paste(document.body, "just words").defaultPrevented).toBe(false);
    slate.nodes.allNodes = [{ editor: { isInlineEditing: () => true } }];
    expect(paste(document.body, URL_YT).defaultPrevented).toBe(false);
    slate.nodes.allNodes = [];
    slate.isReadOnly = () => true;
    expect(paste(document.body, URL_YT).defaultPrevented).toBe(false);
    expect(added).toHaveLength(0);
    input.disable();
    slate.isReadOnly = () => false;
    expect(paste(document.body, URL_YT).defaultPrevented).toBe(false);
  });
});
