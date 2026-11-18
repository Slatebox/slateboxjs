import React from 'react';
import { type OfflineHandoffModel } from './offlineHandoff';
export declare function OfflineHandoffBoard({ value, onChange, readOnly }: {
    value: OfflineHandoffModel;
    onChange?: (next: OfflineHandoffModel) => void;
    readOnly?: boolean;
}): React.JSX.Element;
