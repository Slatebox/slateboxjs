import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as Y from "yjs";
import { Collab } from "../../src/core/Collab";
import { Slate } from "../../src/core/Slate";
import { readRoomToken, relayCredentials, refreshedParams } from "../../src/core/RoomToken";

// The relay used to take one room-less, role-less, never-expiring credential that any visitor
// could get. It now takes a room token: signed by the app for one room, one role and 15 minutes.
// The engine sends it, asks the host for a new one when it is about to run out or is refused,
// and, holding a read role, never makes or sends a change.

function b64url(text: string): string {
  return Buffer.from(text, "utf8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function token(claims: Record<string, any>): string {
  return b64url(JSON.stringify({ v: 2, pk: "pk", room: "slate-1", n: "x", ...claims })) + ".c2ln";
}

const nowSec = () => Math.floor(Date.now() / 1000);

/** A stand-in for y-websocket's provider: records its params, connects and closes on demand. */
class FakeProvider {
  static last: FakeProvider | null = null;
  handlers = new Map<string, ((...args: any[]) => void)[]>();
  awareness = { setLocalStateField: vi.fn(), on: vi.fn(), getStates: () => new Map() };
  synced = false;
  params: Record<string, string>;
  connect = vi.fn();
  disconnect = vi.fn();
  destroy = vi.fn();
  constructor(_url: string, public room: string, public doc: any, opts: any) {
    this.params = opts.params;
    FakeProvider.last = this;
  }
  on(name: string, fn: (...args: any[]) => void) {
    this.handlers.set(name, [...(this.handlers.get(name) || []), fn]);
  }
  emit(name: string, ...args: any[]) {
    for (const fn of this.handlers.get(name) || []) fn(...args);
  }
}

function mockSlate(events: Record<string, any> = {}): any {
  return {
    options: { id: "slate-1", events },
    canvas: null,
    emitSlateChange: vi.fn(),
  };
}

async function connect(slate: any): Promise<{ collab: Collab; provider: FakeProvider }> {
  const collab = new Collab(slate, { Y, WebsocketProvider: FakeProvider });
  (collab as any).setupCursorTracking = vi.fn();
  await collab.init({ roomName: "slate-1" });
  return { collab, provider: FakeProvider.last! };
}

/** Let the renewal's promise chain run to the end. */
async function settle(): Promise<void> {
  for (let i = 0; i < 10; i++) await Promise.resolve();
}

beforeEach(() => {
  vi.spyOn(console, "log").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
  FakeProvider.last = null;
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("room token claims", () => {
  it("reads a v2 token's role and expiry, and nothing else as one", () => {
    expect(readRoomToken(token({ role: "write", exp: 123 }))).toEqual({ v: 2, room: "slate-1", role: "write", exp: 123 });
    expect(readRoomToken(token({ role: "admin" }))?.role).toBe("read");
    expect(readRoomToken("bm90IGpzb24.c2ln")).toBeNull();
    expect(readRoomToken(b64url(JSON.stringify({ v: 1, role: "write" })) + ".x")).toBeNull();
    expect(readRoomToken("")).toBeNull();
    expect(readRoomToken(undefined)).toBeNull();
  });

  it("sends the token alone when there is one, else the legacy pair", () => {
    const t = token({ role: "write", exp: 99 });
    expect(relayCredentials({ token: t, exp: 100, bearer: "b", timestamp: "ts" })).toEqual({
      params: { token: t }, role: "write", exp: 100, kind: "token",
    });
    expect(relayCredentials({ bearer: "b", timestamp: "ts" })).toEqual({
      params: { bearer: "b", timestamp: "ts" }, role: "write", exp: null, kind: "legacy",
    });
    expect(relayCredentials(undefined).kind).toBe("none");
  });

  it("an unreadable token grants nothing on this screen (it is still sent)", () => {
    const creds = relayCredentials({ token: "garbage" });
    expect(creds.params).toEqual({ token: "garbage" });
    expect(creds.role).toBe("read");
  });

  it("takes a refresh's answer in either shape", () => {
    expect(refreshedParams({ websocketParams: { token: "t", exp: 1 } })).toEqual({ token: "t", exp: 1 });
    expect(refreshedParams({ token: "t" })).toEqual({ token: "t" });
    expect(refreshedParams({ websocketParams: {} })).toBeNull();
    expect(refreshedParams(null)).toBeNull();
  });
});

describe("connecting with a room token", () => {
  it("puts only the token on the relay URL", async () => {
    const t = token({ role: "write", exp: nowSec() + 900 });
    const { collab, provider } = await connect(
      mockSlate({ onInitCollaboration: async () => ({ websocketParams: { token: t, exp: nowSec() + 900, bearer: "b", timestamp: "ts" } }) }),
    );
    expect(provider.params).toEqual({ token: t });
    expect(collab.getRole()).toBe("write");
    collab.destroy();
  });

  it("falls back to the legacy pair from an app that sends no token", async () => {
    const { collab, provider } = await connect(
      mockSlate({ onInitCollaboration: async () => ({ websocketParams: { bearer: "b", timestamp: "ts" } }) }),
    );
    expect(provider.params).toEqual({ bearer: "b", timestamp: "ts" });
    expect(collab.getRole()).toBe("write");
    collab.destroy();
  });
});

describe("a read role", () => {
  it("writes nothing to the room, so no update is ever sent, and still hands the host the package", async () => {
    const slate = mockSlate({
      onInitCollaboration: async () => ({ websocketParams: { token: token({ role: "read", exp: nowSec() + 900 }) } }),
    });
    const { collab, provider } = await connect(slate);
    expect(collab.isReadOnlyRole()).toBe(true);
    const updates: Uint8Array[] = [];
    provider.doc.on("update", (u: Uint8Array) => updates.push(u));
    collab.send({ type: "onNodeAdded", data: { id: "n1", options: { id: "n1" } } } as any);
    collab.send({ type: "onNodeDeleted", data: { id: "n1" } } as any);
    // Even a direct write (a path that does not go through send) changes nothing.
    (collab as any).collabMap.set("k", { type: "x" });
    (collab as any).collabMap.delete("k");
    expect(updates).toEqual([]);
    expect(provider.doc.getMap("collabPackages").size).toBe(0);
    expect(slate.emitSlateChange).toHaveBeenCalledTimes(2);
    collab.destroy();
  });

  it("still applies what writers put in the room", async () => {
    const { collab, provider } = await connect(
      mockSlate({ onInitCollaboration: async () => ({ websocketParams: { token: token({ role: "read", exp: nowSec() + 900 }) } }) }),
    );
    const map = provider.doc.getMap("collabPackages");
    expect((collab as any).collabMap.get("a")).toBeUndefined();
    const remote = new Y.Doc();
    remote.getMap("collabPackages").set("a", { type: "onNoop", data: {} });
    Y.applyUpdate(provider.doc, Y.encodeStateAsUpdate(remote), provider);
    expect(map.get("a")).toEqual({ type: "onNoop", data: {} });
    expect((collab as any).collabMap.get("a")).toEqual({ type: "onNoop", data: {} });
    collab.destroy();
  });

  it("makes the slate read-only, so every edit guard holds", () => {
    const isReadOnly = Slate.prototype.isReadOnly;
    expect(isReadOnly.call({ options: { events: {} }, collab: { isReadOnlyRole: () => true } } as any)).toBe(true);
    expect(isReadOnly.call({ options: { events: {} }, collab: { isReadOnlyRole: () => false } } as any)).toBe(false);
    expect(isReadOnly.call({ options: { events: { isReadOnly: () => true } }, collab: { isReadOnlyRole: () => false } } as any)).toBe(true);
    expect(isReadOnly.call({ options: { events: {} } } as any)).toBe(false);
  });

  it("writes again once a renewal grants write", async () => {
    vi.useFakeTimers();
    const refresh = vi.fn(async () => ({ websocketParams: { token: token({ role: "write", exp: nowSec() + 900 }) } }));
    const { collab, provider } = await connect(
      mockSlate({
        onInitCollaboration: async () => ({
          websocketParams: { token: token({ role: "read", exp: nowSec() + 900 }) },
          refreshWebsocketParams: refresh,
        }),
      }),
    );
    await vi.advanceTimersByTimeAsync(13 * 60 * 1000 + 1000);
    expect(refresh).toHaveBeenCalledWith("expiring");
    expect(collab.getRole()).toBe("write");
    // The relay set the old socket's role when it opened: a new socket is opened.
    expect(provider.disconnect).toHaveBeenCalled();
    expect(provider.connect).toHaveBeenCalled();
    collab.send({ type: "onNodeAdded", data: { id: "n1", options: { id: "n1" } } } as any);
    expect(provider.doc.getMap("collabPackages").size).toBe(1);
    collab.destroy();
  });
});

describe("renewing the token", () => {
  it("renews a little before it runs out, for the next reconnect, leaving the live socket alone", async () => {
    vi.useFakeTimers();
    const first = token({ role: "write", exp: nowSec() + 900 });
    const second = token({ role: "write", exp: nowSec() + 1800 });
    const refresh = vi.fn(async () => ({ websocketParams: { token: second, exp: nowSec() + 900 } }));
    const { collab, provider } = await connect(
      mockSlate({ onInitCollaboration: async () => ({ websocketParams: { token: first, exp: nowSec() + 900 }, refreshWebsocketParams: refresh }) }),
    );
    await vi.advanceTimersByTimeAsync(12 * 60 * 1000);
    expect(refresh).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(60 * 1000 + 1000);
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(provider.params).toEqual({ token: second });
    expect(provider.disconnect).not.toHaveBeenCalled();
    collab.destroy();
  });

  it("when the relay ends the session after a planned renewal, the provider's retry sends the renewed token", async () => {
    vi.useFakeTimers();
    const first = token({ role: "write", exp: nowSec() + 900 });
    const second = token({ role: "write", exp: nowSec() + 1800 });
    const refresh = vi.fn(async () => ({ websocketParams: { token: second, exp: nowSec() + 1800 } }));
    const { collab, provider } = await connect(
      mockSlate({ onInitCollaboration: async () => ({ websocketParams: { token: first, exp: nowSec() + 900 }, refreshWebsocketParams: refresh }) }),
    );
    await vi.advanceTimersByTimeAsync(13 * 60 * 1000 + 1000);
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(provider.params).toEqual({ token: second });
    // The relay closes the socket the first token opened, at its exp + skew.
    await vi.advanceTimersByTimeAsync(3 * 60 * 1000);
    provider.emit("connection-close", { code: 4401 }, provider);
    await settle();
    // No second ask and no forced disconnect: y-websocket's retry reconnects with `second`.
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(provider.disconnect).not.toHaveBeenCalled();
    expect(provider.params).toEqual({ token: second });
    // A refusal of the renewed token itself goes back to the host.
    provider.emit("connection-close", { code: 4401 }, provider);
    await settle();
    expect(refresh).toHaveBeenCalledTimes(2);
    expect(refresh).toHaveBeenLastCalledWith("expired");
    collab.destroy();
  });

  it("on a 4401 close: stops the provider's retry, asks the host, reconnects with the new token", async () => {
    const fresh = token({ role: "write", exp: nowSec() + 900 });
    const refresh = vi.fn(async () => ({ websocketParams: { token: fresh } }));
    const { collab, provider } = await connect(
      mockSlate({
        onInitCollaboration: async () => ({ websocketParams: { token: token({ role: "write", exp: nowSec() + 900 }) } }),
        onRefreshCollaboration: refresh,
      }),
    );
    provider.emit("connection-close", { code: 4401 }, provider);
    await settle();
    expect(refresh).toHaveBeenCalledWith("expired");
    expect(provider.disconnect).toHaveBeenCalledTimes(1);
    expect(provider.params).toEqual({ token: fresh });
    expect(provider.connect).toHaveBeenCalledTimes(1);
    collab.destroy();
  });

  it("renews before reconnecting after a plain drop when the token is about to run out", async () => {
    const refresh = vi.fn(async () => ({ token: token({ role: "write", exp: nowSec() + 900 }) }));
    const { collab, provider } = await connect(
      mockSlate({
        onInitCollaboration: async () => ({ websocketParams: { token: token({ role: "write", exp: nowSec() + 30 }) }, refreshWebsocketParams: refresh }),
      }),
    );
    provider.emit("connection-close", { code: 1006 }, provider);
    await settle();
    expect(refresh).toHaveBeenCalledWith("expiring");
    expect(provider.connect).toHaveBeenCalledTimes(1);
    collab.destroy();
  });

  it("leaves a plain drop to the provider when the token has time left", async () => {
    const refresh = vi.fn();
    const { collab, provider } = await connect(
      mockSlate({
        onInitCollaboration: async () => ({ websocketParams: { token: token({ role: "write", exp: nowSec() + 900 }) }, refreshWebsocketParams: refresh }),
      }),
    );
    provider.emit("connection-close", { code: 1006 }, provider);
    await settle();
    expect(refresh).not.toHaveBeenCalled();
    expect(provider.disconnect).not.toHaveBeenCalled();
    collab.destroy();
  });

  it("leaves the room when the host says access ended", async () => {
    const refresh = vi.fn(async () => null);
    const { collab, provider } = await connect(
      mockSlate({
        onInitCollaboration: async () => ({ websocketParams: { token: token({ role: "write", exp: nowSec() + 900 }) }, refreshWebsocketParams: refresh }),
      }),
    );
    provider.emit("connection-close", { code: 4403 }, provider);
    await settle();
    expect(refresh).toHaveBeenCalledWith("refused");
    expect(provider.connect).not.toHaveBeenCalled();
    // Further closes are not renewed again.
    provider.emit("connection-close", { code: 4401 }, provider);
    await settle();
    expect(refresh).toHaveBeenCalledTimes(1);
    collab.destroy();
  });

  it("stops after a few refusals in a row (no sync in between)", async () => {
    const refresh = vi.fn(async () => ({ token: token({ role: "write", exp: nowSec() + 900 }) }));
    const { collab, provider } = await connect(
      mockSlate({
        onInitCollaboration: async () => ({ websocketParams: { token: token({ role: "write", exp: nowSec() + 900 }) }, refreshWebsocketParams: refresh }),
      }),
    );
    for (let i = 0; i < 5; i++) {
      provider.emit("connection-close", { code: 4401 }, provider);
      await settle();
    }
    expect(refresh).toHaveBeenCalledTimes(3);
    expect(provider.connect).toHaveBeenCalledTimes(3);
    collab.destroy();
  });

  it("a sync resets the count of refusals", async () => {
    const refresh = vi.fn(async () => ({ token: token({ role: "write", exp: nowSec() + 900 }) }));
    const { collab, provider } = await connect(
      mockSlate({
        onInitCollaboration: async () => ({ websocketParams: { token: token({ role: "write", exp: nowSec() + 900 }) }, refreshWebsocketParams: refresh }),
      }),
    );
    for (let i = 0; i < 5; i++) {
      provider.emit("connection-close", { code: 4401 }, provider);
      await settle();
      provider.emit("sync", true);
    }
    expect(refresh).toHaveBeenCalledTimes(5);
    collab.destroy();
  });

  it("a legacy relay's text refusal is renewed when the host can, instead of giving up", async () => {
    const refresh = vi.fn(async () => ({ token: token({ role: "write", exp: nowSec() + 900 }) }));
    const { collab, provider } = await connect(
      mockSlate({
        onInitCollaboration: async () => ({ websocketParams: { token: token({ role: "write", exp: nowSec() + 900 }) }, refreshWebsocketParams: refresh }),
      }),
    );
    (collab as any).relayRefused("Unauthenticated");
    await settle();
    expect(refresh).toHaveBeenCalledWith("refused");
    expect(provider.connect).toHaveBeenCalledTimes(1);
    collab.destroy();
  });

  it("does not ask the host when the screen itself leaves", async () => {
    const refresh = vi.fn();
    const { collab, provider } = await connect(
      mockSlate({
        onInitCollaboration: async () => ({ websocketParams: { token: token({ role: "write", exp: nowSec() + 10 }) }, refreshWebsocketParams: refresh }),
      }),
    );
    provider.disconnect.mockImplementation(() => provider.emit("connection-close", null, provider));
    collab.disconnect();
    await settle();
    expect(refresh).not.toHaveBeenCalled();
  });
});
