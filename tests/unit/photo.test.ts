// Photo notes: what a photo value may hold, the note's size, and the add_nodes
// photo field (validate, apply, read). operations/photo.ts has no DOM.
import { describe, expect, it } from "vitest";
import {
  applyPlanToJSON,
  validatePlan,
  readNote,
  slateOperationPlanSchema,
  SLATE_OPERATION_TOOL,
  readPhotoValue,
  photoNoteSize,
  storePhoto,
  readPhoto,
  PHOTO_LIMITS,
  NOTE_READ_KEYS,
} from "../../src/operations";
import * as engine from "../../src/index";

const slate = () => ({ _id: "s1", shareId: "share", options: { name: "Demo" }, nodes: [] as any[] });
const plan = (...operations: any[]) => ({ message: "Added the photo.", operations });
const photo = { url: "https://files.example/2026/11/27/u_1_abc.jpg", width: 4032, height: 3024, alt: "The whiteboard after the retro" };

describe("readPhotoValue: what an operation may store", () => {
  it("keeps an https address, the app's own stored copy, the size and clean words", () => {
    expect(readPhotoValue(photo)).toEqual({ ok: true, photo });
    expect(readPhotoValue({ url: "/files/2026/11/27/u_1_abc.jpg", width: 10.4, height: 20 })).toEqual({ ok: true, photo: { url: "/files/2026/11/27/u_1_abc.jpg", width: 10, height: 20 } });
    expect(readPhotoValue({ url: "/sbimages/2026/11/27/u_1_abc.png", width: 1, height: 1 }).ok).toBe(true);
    expect(readPhotoValue({ ...photo, alt: "  two\nlines  " })).toMatchObject({ ok: true, photo: { alt: "two lines" } });
  });

  it.each([
    ["http://files.example/a.jpg"],
    ["javascript:alert(1)"],
    ["data:image/png;base64,AAAA"],
    ["/canvas/abc"],
    ["/files/../oauth/token"],
    ["/files/%2e%2e/secret"],
    ["//evil.example/a.jpg"],
    ["https://files.example/a b.jpg"],
    [`https://files.example/${"a".repeat(PHOTO_LIMITS.urlLength)}`],
  ])("refuses the address %s", (url) => {
    const read = readPhotoValue({ url, width: 10, height: 10 });
    expect(read.ok).toBe(false);
  });

  it("refuses a missing or impossible size, unknown fields and long words", () => {
    expect(readPhotoValue({ url: photo.url }).ok).toBe(false);
    expect(readPhotoValue({ url: photo.url, width: 0, height: 10 }).ok).toBe(false);
    expect(readPhotoValue({ url: photo.url, width: 10001, height: 10 }).ok).toBe(false);
    expect(readPhotoValue({ url: photo.url, width: "10", height: 10 }).ok).toBe(false);
    expect(readPhotoValue({ ...photo, exif: {} })).toEqual({ ok: false, message: "has fields it does not take: exif." });
    expect(readPhotoValue({ ...photo, alt: "x".repeat(PHOTO_LIMITS.altLength + 1) }).ok).toBe(false);
    expect(readPhotoValue(null).ok).toBe(false);
    expect(readPhotoValue([photo]).ok).toBe(false);
  });
});

describe("photoNoteSize: 320 on the longer side, proportions kept", () => {
  it("landscape, portrait, square and a thin strip", () => {
    expect(photoNoteSize(4032, 3024)).toEqual({ width: 320, height: 240 });
    expect(photoNoteSize(3024, 4032)).toEqual({ width: 240, height: 320 });
    expect(photoNoteSize(500, 500)).toEqual({ width: 320, height: 320 });
    expect(photoNoteSize(10000, 10)).toEqual({ width: 320, height: 20 });
  });
});

describe("add_nodes photo: one picture note, drawn as the whole note", () => {
  it("validates: count 1, no shape, preset, text or media, no connected copy", () => {
    expect(validatePlan(plan({ kind: "add_nodes", count: 1, photo, x: 10, y: 20 })).valid).toBe(true);
    const bad = validatePlan(plan({ kind: "add_nodes", count: 2, shape: "ellipse", text: "x", preset: "sticky", photo: { url: "ftp://x", width: 1, height: 1 } }));
    expect(bad.valid).toBe(false);
    const errors = bad.errors.join(" ");
    expect(errors).toMatch(/one photo note at a time/);
    expect(errors).toMatch(/photo note, so it takes no shape/);
    expect(errors).toMatch(/photo note, so it takes no text/);
    expect(errors).toMatch(/photo note, so it takes no preset/);
    expect(errors).toMatch(/photo url must be an https address/);
    const connected = validatePlan(plan({ kind: "add_nodes", count: 1, photo, placement: { relativeTo: "a", connect: true } }));
    expect(connected.errors.join(" ")).toMatch(/cannot copy and connect/);
  });

  it("stores the picture as the note's cropped image, 320 on its longer side", () => {
    const result = applyPlanToJSON(slate(), plan({ kind: "add_nodes", count: 1, photo, x: 10, y: 20, ids: ["p1"] }));
    const stored = result.slate.nodes[0].options;
    expect(stored).toMatchObject({
      id: "p1", xPos: 10, yPos: 20, width: 320, height: 240, text: "", shape: "rectangle", showTextTab: false,
      image: photo.url, imageFit: "cover", imageOrigWidth: 4032, imageOrigHeight: 3024, photo,
    });
    expect(result.report.created).toEqual(["p1"]);
  });

  it("reads back as the photo", () => {
    const result = applyPlanToJSON(slate(), plan({ kind: "add_nodes", count: 1, photo, ids: ["p1"] }));
    const read = readNote(result.slate.nodes[0] as any);
    expect(read.photo).toEqual(photo);
    expect(read.image).toBe(photo.url);
    expect(read.media).toBeNull();
    expect(NOTE_READ_KEYS).toContain("photo");
    // A note with a picture someone pasted on the web is not a photo note.
    expect(readPhoto({ image: "https://example.com/a.png" })).toBeNull();
    const options: Record<string, any> = {};
    storePhoto(options, { url: "/files/a.jpg", width: 2, height: 1 });
    expect(readPhoto(options)).toEqual({ url: "/files/a.jpg", width: 2, height: 1 });
  });

  it("is in the published plan schema, and not in a model's tool (photos come from a person's phone)", () => {
    const item = slateOperationPlanSchema().properties.operations.items;
    expect(item.properties.photo.required).toEqual(["url", "width", "height"]);
    expect(new RegExp(item.properties.photo.properties.url.pattern).test("/files/2026/a.jpg")).toBe(true);
    expect(new RegExp(item.properties.photo.properties.url.pattern).test("/canvas/a")).toBe(false);
    expect(SLATE_OPERATION_TOOL.parameters.properties.operations.items.properties.photo).toBeUndefined();
  });

  it("is exported from the engine's main entry as well as slateboxjs/operations", () => {
    expect(typeof (engine as any).readPhotoValue).toBe("function");
    expect(typeof (engine as any).photoNoteSize).toBe("function");
    expect(typeof (engine as any).readPhoto).toBe("function");
  });
});
