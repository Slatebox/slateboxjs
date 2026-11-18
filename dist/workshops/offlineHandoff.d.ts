export interface OfflineHandoffModel {
    kind: 'offline-handoff';
    version: 1;
    stage: 'queued' | 'review' | 'resolved';
    choice: 'field' | 'desk' | null;
    fieldNote: string;
    deskNote: string;
    fallback: string;
}
export declare const offlineHandoff: OfflineHandoffModel;
export declare function normalizeOfflineHandoff(raw: unknown): OfflineHandoffModel | null;
export declare function reviewHandoff(value: OfflineHandoffModel): OfflineHandoffModel;
export declare function resolveHandoff(value: OfflineHandoffModel, choice: 'field' | 'desk'): OfflineHandoffModel;
export declare function handoffSummary(value: OfflineHandoffModel): string;
