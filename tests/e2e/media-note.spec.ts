import { test, expect, type Page } from "@playwright/test";

// Media notes in a real browser: paste a video address and a video note appears (its
// poster, a play button, the title and host); pressing play puts the privacy-respecting
// player over it; a presenter (read-only) plays it with a click and the next step stops
// it; a picture of the slate (the one renderer every preview uses) shows the poster and
// play button and never the player. No request reaches the video host before play.

const YT = "dQw4w9WgXcQ";
const SHOTS = process.env.MEDIA_SHOTS_DIR;

// A small poster, as the app would serve it from its own image store.
const POSTER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#3b82f6"/><stop offset="1" stop-color="#9333ea"/></linearGradient></defs><rect width="480" height="360" fill="url(#g)"/><circle cx="360" cy="110" r="60" fill="#fbbf24"/><path d="M0 300 L160 170 L300 290 L380 230 L480 300 L480 360 L0 360 Z" fill="#0f172a" opacity=".55"/></svg>`,
  );

async function open(page: Page, { readOnly = false, host = false, still = false } = {}) {
  const videoHost: string[] = [];
  await page.route(/youtube-nocookie\.com|youtube\.com|ytimg\.com|vimeo\.com|loom\.com/, (route) => {
    videoHost.push(route.request().url());
    return route.fulfill({ status: 200, contentType: "text/html", body: "<html><body style='margin:0;background:#000;color:#fff;font:20px sans-serif'>player</body></html>" });
  });
  await page.goto("/test.html");
  await page.waitForFunction(() => (window as any).SlateboxJS);
  await page.evaluate(
    async ({ readOnly, host, poster, still }) => {
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText = "width:900px;height:600px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const events: any = { isReadOnly: () => (window as any).__readOnly === true };
      if (host) {
        // The app's way: it fetches the title and stores the poster, then makes the note.
        events.onMediaRequested = (request: any) => {
          (window as any).__requests = [...((window as any).__requests || []), { url: request.url, via: request.via }];
          const slate = (window as any).currentSlate;
          slate.addNode({
            id: "video1", x: request.x - 160, y: request.y - 90, width: 320, height: 180, text: "",
            shape: "rectangle", imageFit: "cover", image: poster, imageOrigWidth: 480, imageOrigHeight: 360,
            backgroundColor: "#111418", borderColor: "#111418",
            media: { ...request.media, title: "Launch demo: the canvas in two minutes", author: "Slatebox", poster },
          });
        };
      }
      (window as any).__readOnly = readOnly;
      (window as any).SlateboxJS("#slateCanvas", { events, viewPort: { originalWidth: 900, originalHeight: 600 }, ...(still ? { mediaPlayback: false } : {}) });
    },
    { readOnly, host, poster: POSTER, still },
  );
  return { videoHost };
}

async function pasteText(page: Page, text: string) {
  await page.evaluate((value) => {
    const event = new ClipboardEvent("paste", { bubbles: true, cancelable: true, clipboardData: new DataTransfer() });
    event.clipboardData!.setData("text/plain", value);
    document.body.dispatchEvent(event);
  }, text);
}

test.describe("media notes", () => {
  test("paste a YouTube address: a video note with its poster, play button and caption; play puts the player over it", async ({ page }) => {
    const { videoHost } = await open(page, { host: true });
    await pasteText(page, `https://www.youtube.com/watch?v=${YT}&t=30`);
    const note = page.locator('#slateCanvas [data-node-id="video1"]');
    await expect(note).toHaveAttribute("data-media-note", "youtube");
    await expect(note).toHaveAttribute("aria-label", "Video: Launch demo: the canvas in two minutes (YouTube)");
    const play = note.locator(".media-note-play");
    await expect(play).toHaveAttribute("aria-label", /^Play Video: Launch demo/);
    // The poster fills the note, cropped (an image pattern), and nothing from the host has loaded.
    const patternImage = await page.evaluate(() => {
      const rect = document.querySelector('#slateCanvas [data-node-id="video1"] rect, #slateCanvas [data-node-id="video1"] path');
      const fill = rect?.getAttribute("fill") || "";
      const id = /url\(#?([^)]+)\)/.exec(fill)?.[1]?.replace(/^#/, "");
      const pattern = id ? document.getElementById(id) : null;
      const image = pattern?.querySelector("image");
      return image ? { href: image.getAttribute("href") || image.getAttribute("xlink:href"), fit: image.getAttribute("preserveAspectRatio") } : null;
    });
    expect(patternImage?.href?.startsWith("data:image/svg+xml")).toBe(true);
    expect(patternImage?.fit).toBe("xMidYMid slice");
    await expect(note.locator(".media-note-overlay text").first()).toHaveText(/^Launch demo/);
    await expect(note.locator("iframe")).toHaveCount(0);
    expect(videoHost).toEqual([]);
    expect(await page.evaluate(() => (window as any).__requests)).toEqual([{ url: `https://www.youtube.com/watch?v=${YT}&t=30`, via: "paste" }]);
    if (SHOTS) await page.locator("#slateCanvas").screenshot({ path: `${SHOTS}/engine-1-video-note-poster.png` });

    // Press play.
    await play.click();
    const frame = note.locator(".media-note-player iframe");
    await expect(frame).toHaveCount(1);
    const src = new URL((await frame.getAttribute("src"))!);
    expect(src.origin).toBe("https://www.youtube-nocookie.com");
    expect(src.pathname).toBe(`/embed/${YT}`);
    expect(src.searchParams.get("autoplay")).toBe("1");
    expect(src.searchParams.get("start")).toBe("30");
    expect(await frame.getAttribute("sandbox")).toContain("allow-scripts");
    await expect(note.locator(".media-note-overlay")).toHaveAttribute("display", "none");
    await expect.poll(() => videoHost.length).toBeGreaterThan(0);
    if (SHOTS) await page.locator("#slateCanvas").screenshot({ path: `${SHOTS}/engine-2-video-note-playing.png` });

    // A picture of the slate (thumbnails, share images, exports) shows the poster and play button, never the player.
    const svg = await page.evaluate(() => (window as any).currentSlate.exportSVG?.() ?? (window as any).Export.exportSVG((window as any).currentSlate));
    expect(svg).toContain("media-note-overlay");
    expect(svg).toContain("media-note-play");
    expect(svg).not.toContain("media-note-player");
    expect(svg).not.toContain("<iframe");

    // Escape stops it; the poster is back.
    await page.keyboard.press("Escape");
    await expect(note.locator("iframe")).toHaveCount(0);
    await expect(note.locator(".media-note-overlay")).not.toHaveAttribute("display", "none");
  });

  test("without a host the slate makes a poster-less video note; Enter on the selected note plays it", async ({ page }) => {
    const { videoHost } = await open(page);
    await pasteText(page, "https://vimeo.com/76979871");
    const note = page.locator('#slateCanvas [data-media-note="vimeo"]');
    await expect(note).toHaveCount(1);
    await expect(note.locator(".media-note-overlay text").first()).toHaveText("Vimeo video");
    expect(videoHost).toEqual([]);
    // It is selected after the paste; Enter plays it (no text editor opens).
    await page.keyboard.press("Enter");
    const frame = note.locator(".media-note-player iframe");
    await expect(frame).toHaveCount(1);
    expect(new URL((await frame.getAttribute("src"))!).origin).toBe("https://player.vimeo.com");
    await expect(page.locator("#slateCanvas foreignObject textarea, #slateCanvas [contenteditable=true]")).toHaveCount(0);
    // The close button stops it.
    await note.locator(".media-note-close").click();
    await expect(note.locator("iframe")).toHaveCount(0);
  });

  test("a sentence that mentions a video, or a non-video address, stays text: no note", async ({ page }) => {
    await open(page);
    await pasteText(page, `watch https://youtu.be/${YT} later`);
    await pasteText(page, "https://example.com/video.mp4");
    await expect(page.locator("#slateCanvas [data-media-note]")).toHaveCount(0);
  });

  test("a presenter plays a video note inline with a click, and the next step stops it", async ({ page }) => {
    const { videoHost } = await open(page, { readOnly: true });
    await page.evaluate((poster) => {
      const slate = (window as any).currentSlate;
      slate.addNode({ id: "intro", x: 40, y: 40, width: 200, height: 100, text: "Intro" });
      slate.addNode({
        id: "video1", x: 300, y: 200, width: 320, height: 180, text: "", shape: "rectangle", imageFit: "cover",
        image: poster, imageOrigWidth: 480, imageOrigHeight: 360, backgroundColor: "#111418",
        media: { provider: "loom", id: "0123456789abcdef0123456789abcdef", url: "https://www.loom.com/share/0123456789abcdef0123456789abcdef", title: "Walkthrough", poster },
      });
    }, POSTER);
    const note = page.locator('#slateCanvas [data-node-id="video1"]');
    await expect(note.locator(".media-note-play")).toHaveCount(1);
    // Read-only, a paste never adds a note.
    await pasteText(page, `https://youtu.be/${YT}`);
    await expect(page.locator("#slateCanvas [data-media-note]")).toHaveCount(1);
    await page.evaluate(() => {
      const slate = (window as any).currentSlate;
      slate.presentation.setStepOrder(["intro", "video1"]);
      slate.presentation.start(0);
      slate.presentation.next(0);
    });
    await page.waitForTimeout(200);
    // A click anywhere on the note (not only the button) plays it for a presenter.
    const box = (await note.locator(".media-note-overlay rect").first().boundingBox())!;
    await page.mouse.click(box.x + 20, box.y + 6);
    const frame = note.locator(".media-note-player iframe");
    await expect(frame).toHaveCount(1);
    expect(new URL((await frame.getAttribute("src"))!).origin).toBe("https://www.loom.com");
    await expect.poll(() => videoHost.some((url) => url.includes("loom.com/embed/"))).toBe(true);
    if (SHOTS) await page.locator("#slateCanvas").screenshot({ path: `${SHOTS}/engine-3-presenter-playing-inline.png` });
    await page.evaluate(() => (window as any).currentSlate.presentation.previous(0));
    await expect(note.locator("iframe")).toHaveCount(0);
  });

  test("a still picture of the slate (a card, a gallery tile) shows the poster and play button and never plays", async ({ page }) => {
    const { videoHost } = await open(page, { still: true });
    await page.evaluate((poster) => {
      (window as any).currentSlate.addNode({
        id: "video1", x: 120, y: 120, width: 320, height: 180, text: "", shape: "rectangle", imageFit: "cover",
        image: poster, imageOrigWidth: 480, imageOrigHeight: 360, backgroundColor: "#111418",
        media: { provider: "youtube", id: "dQw4w9WgXcQ", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", title: "Launch demo", poster },
      });
    }, POSTER);
    const note = page.locator('#slateCanvas [data-node-id="video1"]');
    const play = note.locator(".media-note-play");
    await expect(play).toHaveCount(1);
    await expect(play).toHaveAttribute("aria-hidden", "true");
    const box = (await play.boundingBox())!;
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.dblclick(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(300);
    await expect(note.locator("iframe")).toHaveCount(0);
    expect(videoHost).toEqual([]);
    if (SHOTS) await page.locator("#slateCanvas").screenshot({ path: `${SHOTS}/engine-4-still-picture-poster-only.png` });
  });
});
