/**
 * NoteDefaults.ts - how a note is drawn when nothing says otherwise.
 *
 * The Node constructor starts from these, and anything that draws notes on a
 * host's behalf (a workshop's lanes and cards) starts from the same values, so
 * its notes sit beside an ordinary note as members of one family.
 */
export declare const DEFAULT_NOTE_STYLE: Readonly<{
    fontSize: 14;
    fontFamily: "Arial, sans-serif";
    fontColor: "#000000";
    borderColor: "#cccccc";
    borderWidth: 1;
    backgroundColor: "#f0f0f0";
}>;
/**
 * The notes the toolbar makes (the app's QuickNodeActions): a text note has no
 * fill or border and at least 20 point text; a sticky note is the default note
 * (a 160 x 68 rounded rectangle) in sticky yellow (the palette's Lemon) with dark
 * text, no border and the post-it shadow. An operation's own shape, size and
 * style win over a preset. (The older square "stickynote" shape stays registered
 * for slates that use it.) The sticky colours match the app's STICKY_NOTE
 * (noteStyle.mjs, the palette's Lemon); the app's sticky-note test checks the two agree.
 */
export declare const NOTE_PRESETS: Readonly<{
    text: Readonly<{
        shape: "rectangle";
        width: 270;
        height: 40;
        style: Readonly<{
            opacity: 0;
            borderOpacity: 0;
            textOpacity: 1;
            backgroundColor: "#ffffff";
            foregroundColor: "#000000";
            fontSize: 20;
        }>;
    }>;
    sticky: Readonly<{
        shape: "roundedrectangle";
        width: 160;
        height: 68;
        style: Readonly<{
            borderOpacity: 0;
            borderWidth: 0;
            effect: "postItNote";
            backgroundColor: "#fdeea6";
            foregroundColor: "#1b1f1d";
        }>;
    }>;
}>;
export type NotePreset = keyof typeof NOTE_PRESETS;
