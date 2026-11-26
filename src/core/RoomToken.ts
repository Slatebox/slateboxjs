/**
 * RoomToken.ts - what the engine needs to know about the relay's room tokens.
 *
 * The host app hands the engine its relay credentials as `websocketParams`. A v2
 * credential is `{ token, exp }`: `token` is `base64url(JSON payload) + "." +
 * base64url(HMAC)`, signed by the app for one room, one role ('read' | 'write')
 * and an expiry (`exp`, unix seconds). The relay checks the signature; the engine
 * never can (it has no key) and never needs to. It only reads the payload to know
 * the role (a read role makes this screen read-only) and when to ask for a new one.
 *
 * A legacy credential is `{ bearer, timestamp }`: room-less and role-less. It is
 * sent only when no token is given.
 */

export type RelayRole = "read" | "write";

/** What a v2 token says about itself (unverified: read for the engine's own use only). */
export interface RoomTokenClaims {
  v: number;
  room?: string;
  role: RelayRole;
  /** Unix seconds. */
  exp?: number;
}

/** The relay closes a socket with these when its token is missing, wrong, expired or not enough. */
export const RELAY_AUTH_CLOSE_CODES: ReadonlySet<number> = new Set([4401, 4403]);

function base64UrlDecode(part: string): string | null {
  try {
    let b64 = part.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    const atobFn: ((s: string) => string) | undefined = (globalThis as any).atob;
    const binary = atobFn
      ? atobFn(b64)
      : (globalThis as any).Buffer?.from(b64, "base64").toString("binary");
    if (typeof binary !== "string") return null;
    // UTF-8 decode (room ids are ASCII today, but do not assume it).
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

/** The payload of a v2 room token, or null when it is not one. Does not verify the signature. */
export function readRoomToken(token: unknown): RoomTokenClaims | null {
  if (typeof token !== "string" || !token) return null;
  const dot = token.indexOf(".");
  if (dot <= 0) return null;
  const json = base64UrlDecode(token.slice(0, dot));
  if (!json) return null;
  try {
    const claims = JSON.parse(json);
    if (!claims || typeof claims !== "object" || claims.v !== 2) return null;
    return {
      v: 2,
      room: typeof claims.room === "string" ? claims.room : undefined,
      // Anything but an explicit write grant is read: the relay enforces the same.
      role: claims.role === "write" ? "write" : "read",
      exp: typeof claims.exp === "number" && Number.isFinite(claims.exp) ? claims.exp : undefined,
    };
  } catch {
    return null;
  }
}

/** The credentials in hand: what goes on the relay URL, the role it grants, and when it runs out. */
export interface RelayCredentials {
  /** Query-string params for the relay URL. */
  params: Record<string, string>;
  role: RelayRole;
  /** Unix seconds, or null when the credential does not expire (legacy). */
  exp: number | null;
  kind: "token" | "legacy" | "none";
}

/**
 * Turn the host's websocketParams into what is sent: the token alone when one is
 * given (never the legacy pair beside it), else the legacy pair as before.
 */
export function relayCredentials(wsParams: Record<string, any> | null | undefined): RelayCredentials {
  const given = wsParams && typeof wsParams === "object" ? wsParams : {};
  if (typeof given.token === "string" && given.token) {
    const claims = readRoomToken(given.token);
    const exp =
      typeof given.exp === "number" && Number.isFinite(given.exp)
        ? given.exp
        : claims?.exp ?? null;
    return {
      params: { token: given.token },
      // A token the engine cannot read is still sent (the relay decides), but grants
      // nothing here: the screen stays read-only until a readable write token arrives.
      role: claims?.role ?? "read",
      exp,
      kind: "token",
    };
  }
  const params: Record<string, string> = {};
  for (const [key, value] of Object.entries(given)) {
    if (key === "token" || key === "exp") continue;
    if (value === undefined || value === null) continue;
    params[key] = String(value);
  }
  return {
    params,
    // Legacy credentials carry no role: the relay lets them write, as before.
    role: "write",
    exp: null,
    kind: Object.keys(params).length ? "legacy" : "none",
  };
}

/**
 * Accept what a host's refresh returned: `{ websocketParams: {...} }` (the shape
 * onInitCollaboration returns) or the params themselves. Null when it gave nothing usable.
 */
export function refreshedParams(result: unknown): Record<string, any> | null {
  if (!result || typeof result !== "object") return null;
  const r: any = result;
  const params = r.websocketParams && typeof r.websocketParams === "object" ? r.websocketParams : r;
  if (typeof params.token === "string" && params.token) return params;
  if (typeof params.bearer === "string" && params.bearer) return params;
  return null;
}
