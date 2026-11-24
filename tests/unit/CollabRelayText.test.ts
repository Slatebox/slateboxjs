import { describe, it, expect, vi, afterEach } from "vitest";
import { Collab, relayTextGuard } from "../../src/core/Collab";

// The relay refuses a connection with one text frame ("Unauthenticated") and never syncs
// that socket. y-websocket reads every frame as a Yjs message, so before this guard the
// page logged "Unexpected end of array" from the collaboration library for each one, and
// the provider kept waiting on a socket that would never sync.

/** A WebSocket stand-in whose onmessage is an accessor on its prototype, as in browsers. */
class FakeSocket {
  private handler: ((event: any) => void) | null = null;
  set onmessage(fn: ((event: any) => void) | null) {
    this.handler = fn;
  }
  get onmessage() {
    return this.handler;
  }
  deliver(data: any) {
    this.handler?.({ data });
  }
}

describe("the relay's words never reach Yjs", () => {
  const original = (globalThis as any).WebSocket;
  afterEach(() => {
    (globalThis as any).WebSocket = original;
  });

  it("hands Yjs only binary frames; text goes to the relay handler", () => {
    (globalThis as any).WebSocket = FakeSocket;
    const texts: string[] = [];
    const Guard = relayTextGuard((text) => texts.push(text));
    const socket = new Guard();
    const binary: any[] = [];
    socket.onmessage = (event: any) => binary.push(event.data);
    socket.deliver("Unauthenticated");
    const frame = new Uint8Array([0, 0, 1, 0]).buffer;
    socket.deliver(frame);
    expect(texts).toEqual(["Unauthenticated"]);
    expect(binary).toEqual([frame]);
    socket.onmessage = null;
    expect(() => socket.deliver("Unauthenticated")).not.toThrow();
  });

  it("is absent where there is no WebSocket (the provider's own default is used)", () => {
    (globalThis as any).WebSocket = undefined;
    expect(relayTextGuard(() => {})).toBeNull();
  });

  it("a refusal is said once, stops the provider, and anything else is ignored", () => {
    const collab = new Collab({ options: { id: "slate-1", events: {} } } as any);
    const disconnect = vi.fn();
    Object.assign(collab, { provider: { disconnect } });
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    (collab as any).relayRefused("hello");
    expect(disconnect).not.toHaveBeenCalled();
    (collab as any).relayRefused("Unauthenticated");
    (collab as any).relayRefused("Unauthenticated");
    expect(disconnect).toHaveBeenCalledTimes(2);
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0][0])).toMatch(/refused this connection/);
    warn.mockRestore();
  });
});
