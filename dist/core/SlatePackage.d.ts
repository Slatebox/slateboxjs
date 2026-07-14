/**
 * Shared package type used by Invoker, Collab, and SlateEvents.
 * Represents a message package sent/received via collaboration or external API.
 */
export interface SlatePackage {
    type: string;
    data: Record<string, any>;
    clientID?: number;
    timestamp?: number;
    /** v1 compat: identifies the emitting slate instance so hosts can ignore their own echoes */
    instanceId?: string;
}
