import React from 'react';
import { type MoonGalleryModel } from './moonGallery';
export interface MoonGalleryBoardProps {
    value: MoonGalleryModel;
    onChange: (next: MoonGalleryModel) => void;
    readOnly?: boolean;
    /** Let a facilitator reserve certain pieces for another participant. */
    enabledIds?: readonly string[];
    onPreview?: (candidate: MoonGalleryModel | null) => void;
}
export declare function MoonGalleryBoard({ value, onChange, onPreview, readOnly, enabledIds }: MoonGalleryBoardProps): React.JSX.Element;
