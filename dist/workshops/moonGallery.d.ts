export interface GalleryPanel {
    id: string;
    label: string;
    artwork: 'dunes' | 'moon' | 'coast';
    after: string | null;
}
export interface MoonGalleryModel {
    kind: 'moon-gallery';
    version: 1;
    panels: GalleryPanel[];
    hung: string[];
}
export declare const moonGallery: MoonGalleryModel;
/** Panel order is the physical order of the hooks on the wall. */
export declare function normalizeMoonGallery(input: unknown): MoonGalleryModel | null;
export declare function canHangPanel(model: MoonGalleryModel, id: string): boolean;
export declare function hangGalleryPanel(model: MoonGalleryModel, id: string): MoonGalleryModel;
