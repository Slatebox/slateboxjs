/**
 * A note's words laid out in lines (Miro-style autofit): words wrap between words at the note's
 * width; a word too wide for the line is never cut into letters when shrinking the text can fit it.
 *
 * - A word up to twice the line's width stays whole: the text shrinks to fit it (fitTextToNode).
 * - A longer token with break points (a URL or path: / . - _ ? & = #) breaks after them, as a
 *   browser would, without a space between its pieces.
 * - A longer plain word stays whole down to the shrink floor (0.3, the same floor fitTextToNode uses).
 * - Only a word too wide even at the floor (a long code or hash) is cut into letters, at the line's
 *   width, as before.
 *
 * When a word stays whole the lines are wrapped at the wider width the shrunk text will fill
 * (`width / scale`), so the shrunk text uses the note's whole width, and `scale` says by how much
 * the text will shrink, so the note can grow only as tall as the shrunk text needs.
 */
export const SHRINK_FLOOR = 0.3;
export const SOFT_FLOOR = 0.5;

const BREAK_AFTER = /(?<=[/.\-_?&=#])(?=.)/u;

type Token = { text: string; joined: boolean };

export interface WrappedText {
  text: string;
  lines: string[];
  /** How much the text must shrink for the widest line to fit (1 = not at all). */
  scale: number;
}

export function wrapWords(
  text: string,
  maxWidth: number,
  measure: (s: string) => number
): WrappedText {
  if (!text) return { text, lines: [], scale: 1 };
  const width = Math.max(1, maxWidth);
  const floorWidth = width / SHRINK_FLOOR;

  const cutIntoLetters = (word: string): string[] => {
    const chunks: string[] = [];
    let chunk = "";
    for (const ch of word) {
      if (chunk && measure(chunk + ch) > width) {
        chunks.push(chunk);
        chunk = ch;
      } else {
        chunk += ch;
      }
    }
    if (chunk) chunks.push(chunk);
    return chunks;
  };

  // Each paragraph's words as tokens: whole words, or a long token's pieces (joined: no space before).
  const paragraphs: Token[][] = String(text)
    .split("\n")
    .map((para) => {
      const tokens: Token[] = [];
      for (const word of para.split(/\s+/).filter(Boolean)) {
        const w = measure(word);
        if (w <= width / SOFT_FLOOR) {
          tokens.push({ text: word, joined: false });
          continue;
        }
        const pieces = word.split(BREAK_AFTER).filter(Boolean);
        const parts = pieces.length > 1 ? pieces : [word];
        parts.forEach((piece, i) => {
          const sub =
            measure(piece) <= floorWidth ? [piece] : cutIntoLetters(piece);
          sub.forEach((s, j) =>
            tokens.push({ text: s, joined: i > 0 || j > 0 })
          );
        });
      }
      return tokens;
    });

  const widest = Math.max(
    0,
    ...paragraphs.flat().map((t) => measure(t.text))
  );
  const wrapAt = Math.min(Math.max(width, widest), floorWidth);
  const scale = Math.max(SHRINK_FLOOR, Math.min(1, width / wrapAt));

  const lines: string[] = [];
  for (const tokens of paragraphs) {
    if (!tokens.length) {
      lines.push("");
      continue;
    }
    let line = "";
    for (const token of tokens) {
      const test = line
        ? token.joined
          ? line + token.text
          : `${line} ${token.text}`
        : token.text;
      if (line && measure(test) > wrapAt) {
        lines.push(line);
        line = token.text;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
  }
  return { text: lines.join("\n"), lines, scale };
}
