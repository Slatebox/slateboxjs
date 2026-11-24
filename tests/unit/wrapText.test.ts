import { describe, it, expect } from "vitest";
import { wrapWords, SHRINK_FLOOR } from "../../src/core/wrapText";

// 10px per character: easy widths to reason about.
const measure = (s: string) => s.length * 10;

describe("wrapWords (a note's words in lines, Miro-style autofit)", () => {
  it("wraps between words and does not shrink text that fits", () => {
    const r = wrapWords("one two three four", 100, measure);
    expect(r.lines).toEqual(["one two", "three four"]);
    expect(r.scale).toBe(1);
  });

  it("never cuts a word that fits once the text shrinks (the brand kit's 'Categor / y 1')", () => {
    const r = wrapWords("Category 1", 60, measure);
    expect(r.lines.some((l) => l.includes("Category"))).toBe(true);
    expect(r.lines.join(" ")).toBe("Category 1");
    expect(r.scale).toBeCloseTo(60 / 80);
  });

  it("wraps at the width the shrunk text fills, so the other words share the long word's line width", () => {
    const r = wrapWords("Internationalization is a long word", 100, measure);
    // 20 letters (200px) wide: the lines wrap at 200px, the text drawn at half size.
    expect(r.lines).toEqual(["Internationalization", "is a long word"]);
    expect(r.scale).toBeCloseTo(0.5);
    for (const line of r.lines) expect(measure(line) * r.scale).toBeLessThanOrEqual(100);
  });

  it("keeps a long plain word whole down to the shrink floor", () => {
    const word = "a".repeat(30); // 300px in a 100px line: needs 0.33
    const r = wrapWords(word, 100, measure);
    expect(r.lines).toEqual([word]);
    expect(r.scale).toBeGreaterThanOrEqual(SHRINK_FLOOR);
  });

  it("breaks a long URL after its slashes and dots, not between letters, without adding spaces", () => {
    const url = "https://www.example.com/some/really/long/path";
    const r = wrapWords(url, 100, measure);
    expect(r.lines.length).toBeGreaterThan(1);
    expect(r.lines.join("")).toBe(url);
    for (const line of r.lines) expect(/[/.]$/.test(line) || url.endsWith(line)).toBe(true);
  });

  it("cuts only a word too long even at the floor, at the line's width", () => {
    const code = "x".repeat(50); // 500px: more than 100 / 0.3
    const r = wrapWords(code, 100, measure);
    expect(r.lines.join("")).toBe(code);
    for (const line of r.lines) expect(measure(line)).toBeLessThanOrEqual(100);
    expect(r.scale).toBe(1);
  });

  it("keeps blank lines and paragraphs", () => {
    expect(wrapWords("a\n\nb", 100, measure).lines).toEqual(["a", "", "b"]);
    expect(wrapWords("", 100, measure)).toEqual({ text: "", lines: [], scale: 1 });
  });
});
