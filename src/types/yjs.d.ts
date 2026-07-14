/**
 * Minimal type stubs for yjs and y-websocket (optional peer dependencies).
 * These are used by Collab.ts to avoid `any` type assertions on dynamically-imported modules.
 */

declare module "yjs" {
  export class Doc {
    clientID: number;
    getMap<T = any>(name: string): YMap<T>;
    destroy(): void;
  }

  export class YMap<T = any> {
    get(key: string): T | undefined;
    set(key: string, value: T): void;
    observe(handler: (event: YMapEvent<T>) => void): void;
    unobserve(handler: (event: YMapEvent<T>) => void): void;
  }

  export interface YMapEvent<T = any> {
    transaction: { local: boolean };
    changes: {
      keys: Map<string, {
        action: "add" | "update" | "delete";
        oldValue: T | undefined;
      }>;
    };
  }
}

declare module "y-websocket" {
  export class WebsocketProvider {
    awareness: Awareness;
    constructor(url: string, room: string, doc: any, opts?: Record<string, unknown>);
    on(event: "status", handler: (event: { status: "connected" | "connecting" | "disconnected" }) => void): void;
    disconnect(): void;
    destroy(): void;
  }

  export interface Awareness {
    setLocalStateField(field: string, value: unknown): void;
    on(event: "change", handler: () => void): void;
    getStates(): Map<number, Record<string, unknown>>;
  }
}
