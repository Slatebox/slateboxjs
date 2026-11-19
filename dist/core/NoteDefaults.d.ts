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
}>;
