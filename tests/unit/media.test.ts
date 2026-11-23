// Media notes: which addresses are videos a note plays, the player address, and the
// add_nodes media field (validate, apply, read). operations/media.ts has no DOM.
import { describe, expect, it } from "vitest";
import {
  applyPlanToJSON,
  validatePlan,
  readNote,
  slateOperationPlanSchema,
  SLATE_OPERATION_TOOL,
  parseMediaUrl,
  isMediaUrl,
  mediaEmbedUrl,
  readMediaValue,
  parseStart,
  mediaLabel,
  MEDIA_FRAME_ORIGINS,
  MEDIA_NOTE_SIZE,
} from "../../src/operations";

const YT = "dQw4w9WgXcQ";
const LOOM = "0123456789abcdef0123456789abcdef";

describe("parseMediaUrl: approved hosts only, one canonical address each", () => {
  it.each([
    [`https://www.youtube.com/watch?v=${YT}`, "youtube", YT],
    [`https://youtube.com/watch?v=${YT}&list=PL123`, "youtube", YT],
    [`https://m.youtube.com/watch?v=${YT}`, "youtube", YT],
    [`https://youtu.be/${YT}`, "youtube", YT],
    [`https://www.youtube.com/shorts/${YT}`, "youtube", YT],
    [`https://www.youtube.com/embed/${YT}`, "youtube", YT],
    [`https://www.youtube.com/live/${YT}`, "youtube", YT],
    [`https://www.youtube-nocookie.com/embed/${YT}`, "youtube", YT],
    [`http://youtu.be/${YT}`, "youtube", YT],
    [`youtu.be/${YT}`, "youtube", YT],
    ["https://vimeo.com/76979871", "vimeo", "76979871"],
    ["https://vimeo.com/channels/staffpicks/76979871", "vimeo", "76979871"],
    ["https://player.vimeo.com/video/76979871", "vimeo", "76979871"],
    [`https://www.loom.com/share/${LOOM}`, "loom", LOOM],
    [`https://www.loom.com/share/quarterly-demo-${LOOM}`, "loom", LOOM],
    [`https://www.loom.com/embed/${LOOM}`, "loom", LOOM],
  ])("%s is a %s video", (url, provider, id) => {
    const media = parseMediaUrl(url);
    expect(media?.provider).toBe(provider);
    expect(media?.id).toBe(id);
    expect(media?.url.startsWith("https://")).toBe(true);
  });

  it.each([
    "https://example.com/watch?v=dQw4w9WgXcQ",
    "https://youtube.com.evil.example/watch?v=dQw4w9WgXcQ",
    "https://evil-youtube.com/watch?v=dQw4w9WgXcQ",
    "https://www.youtube.com/watch?v=short",
    "https://www.youtube.com/channel/UC123",
    "https://user:pass@www.youtube.com/watch?v=dQw4w9WgXcQ",
    "https://www.youtube.com:8443/watch?v=dQw4w9WgXcQ",
    "javascript:alert(1)//youtu.be/dQw4w9WgXcQ",
    "ftp://youtu.be/dQw4w9WgXcQ",
    "https://vimeo.com/about",
    "https://www.loom.com/share/not-a-loom-id",
    "https://127.0.0.1/watch?v=dQw4w9WgXcQ",
    "",
    "https://youtu.be/dQw4w9WgXcQ with words",
  ])("%s is not a video a note plays", (url) => {
    expect(parseMediaUrl(url)).toBeNull();
    expect(isMediaUrl(url)).toBe(false);
  });

  it("keeps a start time and Vimeo's private-link hash", () => {
    expect(parseMediaUrl(`https://youtu.be/${YT}?t=1m30s`)?.start).toBe(90);
    expect(parseMediaUrl(`https://www.youtube.com/watch?v=${YT}&t=42`)?.start).toBe(42);
    const unlisted = parseMediaUrl("https://vimeo.com/76979871/abc123def0");
    expect(unlisted).toMatchObject({ provider: "vimeo", id: "76979871", hash: "abc123def0", url: "https://vimeo.com/76979871/abc123def0" });
    expect(parseStart("1h2m3s")).toBe(3723);
    expect(parseStart("0")).toBeUndefined();
    expect(parseStart("soon")).toBeUndefined();
  });
});

describe("mediaEmbedUrl: privacy-respecting players, never playing on their own", () => {
  it("uses youtube-nocookie, Vimeo's do-not-track and Loom's embed", () => {
    const yt = mediaEmbedUrl({ provider: "youtube", id: YT, start: 90 })!;
    expect(yt.startsWith(`https://www.youtube-nocookie.com/embed/${YT}?`)).toBe(true);
    expect(new URL(yt).searchParams.get("autoplay")).toBe("0");
    expect(new URL(yt).searchParams.get("start")).toBe("90");
    const vimeo = mediaEmbedUrl({ provider: "vimeo", id: "76979871", hash: "abc123def0" })!;
    expect(vimeo).toContain("https://player.vimeo.com/video/76979871?");
    expect(new URL(vimeo).searchParams.get("dnt")).toBe("1");
    expect(new URL(vimeo).searchParams.get("h")).toBe("abc123def0");
    expect(mediaEmbedUrl({ provider: "loom", id: LOOM })).toContain(`https://www.loom.com/embed/${LOOM}?`);
    for (const url of [yt, vimeo, mediaEmbedUrl({ provider: "loom", id: LOOM })!]) {
      expect(MEDIA_FRAME_ORIGINS).toContain(new URL(url).origin);
    }
  });

  it("starts at once only after someone pressed play", () => {
    expect(new URL(mediaEmbedUrl({ provider: "youtube", id: YT }, { play: true })!).searchParams.get("autoplay")).toBe("1");
  });

  it("refuses a stored id that is not the provider's form", () => {
    expect(mediaEmbedUrl({ provider: "youtube", id: "../../evil" } as any)).toBeNull();
    expect(mediaEmbedUrl({ provider: "vimeo", id: "1/../x" } as any)).toBeNull();
    expect(mediaEmbedUrl({ provider: "other", id: "x" } as any)).toBeNull();
  });
});

describe("readMediaValue: what an operation may store", () => {
  it("reads the url and keeps a clean title, author and https poster", () => {
    const read = readMediaValue({ url: `https://youtu.be/${YT}`, title: "  Launch\u0000 demo \n", author: "Slatebox", poster: "https://files.example/p.jpg", posterWidth: 480, posterHeight: 360 });
    expect(read).toEqual({ ok: true, media: { provider: "youtube", id: YT, url: `https://www.youtube.com/watch?v=${YT}`, title: "Launch demo", author: "Slatebox", poster: "https://files.example/p.jpg", posterWidth: 480, posterHeight: 360 } });
  });
  it.each([
    [{ url: "https://example.com/v.mp4" }, /YouTube, Vimeo or Loom/],
    [{ url: `https://youtu.be/${YT}`, poster: "http://files.example/p.jpg" }, /poster must be an https/],
    [{ url: `https://youtu.be/${YT}`, poster: "javascript:alert(1)" }, /poster must be an https/],
    [{ url: `https://youtu.be/${YT}`, provider: "vimeo" }, /provider does not match/],
    [{ url: `https://youtu.be/${YT}`, embed: "<iframe>" }, /does not take: embed/],
    [{ url: `https://youtu.be/${YT}`, start: -3 }, /start must be/],
    ["https://youtu.be/x", /must be an object/],
  ])("refuses %j", (value, message) => {
    const read = readMediaValue(value);
    expect(read.ok).toBe(false);
    expect((read as any).message).toMatch(message);
  });
  it("names the video for a screen reader", () => {
    expect(mediaLabel({ provider: "youtube", title: "Demo" })).toBe("Video: Demo (YouTube)");
    expect(mediaLabel({ provider: "loom" })).toBe("Loom video");
  });
});

const slate = () => ({ _id: "s1", shareId: "share", options: { name: "Demo" }, nodes: [] as any[] });
const plan = (...operations: any[]) => ({ message: "Added the video.", operations });

describe("add_nodes media: one video note, drawn as its poster", () => {
  const media = { url: `https://youtu.be/${YT}?t=5`, title: "Demo", poster: "https://files.example/p.jpg", posterWidth: 480, posterHeight: 360 };

  it("validates: count 1, no shape, preset or text, no connected copy", () => {
    expect(validatePlan(plan({ kind: "add_nodes", count: 1, media, x: 10, y: 20 })).valid).toBe(true);
    const bad = validatePlan(plan({ kind: "add_nodes", count: 2, shape: "ellipse", text: "x", media: { url: "https://example.com" } }));
    expect(bad.valid).toBe(false);
    expect(bad.errors.join(" ")).toMatch(/one media note at a time/);
    expect(bad.errors.join(" ")).toMatch(/takes no shape/);
    expect(bad.errors.join(" ")).toMatch(/takes no text/);
    expect(bad.errors.join(" ")).toMatch(/YouTube, Vimeo or Loom/);
  });

  it("stores the video and its poster as the note's cropped picture, 16:9", () => {
    const result = applyPlanToJSON(slate(), plan({ kind: "add_nodes", count: 1, media, x: 10, y: 20, ids: ["v1"] }));
    const stored = result.slate.nodes[0].options;
    expect(stored).toMatchObject({
      id: "v1", xPos: 10, yPos: 20, width: MEDIA_NOTE_SIZE.width, height: MEDIA_NOTE_SIZE.height, text: "",
      shape: "rectangle", image: media.poster, imageFit: "cover", imageOrigWidth: 480, imageOrigHeight: 360,
      media: { provider: "youtube", id: YT, url: `https://www.youtube.com/watch?v=${YT}`, start: 5, title: "Demo", poster: media.poster },
    });
    expect(result.report.created).toEqual(["v1"]);
  });

  it("reads back as the video, never the player", () => {
    const result = applyPlanToJSON(slate(), plan({ kind: "add_nodes", count: 1, media, ids: ["v1"] }));
    const read = readNote(result.slate.nodes[0] as any);
    expect(read.media).toEqual({ provider: "youtube", url: `https://www.youtube.com/watch?v=${YT}`, title: "Demo", start: 5, poster: media.poster });
    expect(read.image).toBe(media.poster);
  });

  it("is in the published plan schema, and not in a model's tool (models ask the host's add-media action)", () => {
    const item = slateOperationPlanSchema().properties.operations.items;
    expect(item.properties.media.required).toEqual(["url"]);
    expect(SLATE_OPERATION_TOOL.parameters.properties.operations.items.properties.media).toBeUndefined();
  });
});
