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
export declare const RELAY_AUTH_CLOSE_CODES: ReadonlySet<number>;
/** The payload of a v2 room token, or null when it is not one. Does not verify the signature. */
export declare function readRoomToken(token: unknown): RoomTokenClaims | null;
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
export declare function relayCredentials(wsParams: Record<string, any> | null | undefined): RelayCredentials;
/**
 * Accept what a host's refresh returned: `{ websocketParams: {...} }` (the shape
 * onInitCollaboration returns) or the params themselves. Null when it gave nothing usable.
 */
export declare function refreshedParams(result: unknown): Record<string, any> | null;
