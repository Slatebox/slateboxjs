/**
 * NoteDefaults.ts - how a note is drawn when nothing says otherwise.
 *
 * The Node constructor starts from these, and anything that draws notes on a
 * host's behalf (a workshop's lanes and cards) starts from the same values, so
 * its notes sit beside an ordinary note as members of one family.
 */
export const DEFAULT_NOTE_STYLE = Object.freeze({
  fontSize: 14,
  fontFamily: "Arial, sans-serif",
  fontColor: "#000000",
  borderColor: "#cccccc",
  borderWidth: 1,
  backgroundColor: "#f0f0f0",
});

/**
 * The notes the toolbar makes (the app's QuickNodeActions): a text note has no
 * fill or border and at least 20 point text; a sticky note is the sticky shape
 * with the post-it effect and no border. An operation's own shape, size and
 * style win over a preset.
 */
export const NOTE_PRESETS = Object.freeze({
  text: Object.freeze({
    shape: "rectangle",
    width: 270,
    height: 40,
    style: Object.freeze({
      opacity: 0,
      borderOpacity: 0,
      textOpacity: 1,
      backgroundColor: "#ffffff",
      foregroundColor: "#000000",
      fontSize: 20,
    }),
  }),
  sticky: Object.freeze({
    shape: "stickynote",
    width: 108,
    height: 108,
    style: Object.freeze({ borderOpacity: 0, effect: "postItNote" }),
  }),
});

export type NotePreset = keyof typeof NOTE_PRESETS;
