/**
 * The CSS a slate's containerStyle paints on its container: a color, a gradient (two or more
 * stops, linear at an angle or radial) or a picture (cover, contain or tiled, with the color laid
 * over it by `backgroundDim` so notes on it stay readable). One answer for the canvas
 * (Slate.applyContainerStyle) and any host that paints the same background around it.
 */
export interface ContainerBackground {
    image: string;
    size: string;
    repeat: string;
    position: string;
}
/** A CSS url() for any stored address: quoted, with the characters that could end it escaped. */
export declare function cssUrl(url: string): string;
export declare function containerBackground(cs: Record<string, any> | undefined | null): ContainerBackground;
