/** A continuous crossfade. Zero is the left sculpture, one is the right. */
export interface ListeningRoomModel {
    kind: 'listening-room';
    version: 1;
    mix: number;
    leftLabel: string;
    rightLabel: string;
}
export declare const listeningRoom: ListeningRoomModel;
export declare function normalizeListeningRoom(raw: unknown): ListeningRoomModel | null;
export declare function listeningRoomCaption({ mix, leftLabel, rightLabel }: ListeningRoomModel): string;
