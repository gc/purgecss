var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/css-tokenizer/code-points/code-points.ts
var HYPHEN_MINUS = 45;
var QUESTION_MARK = 63;
var DIGIT_ZERO = 48;
var LATIN_CAPITAL_LETTER_F = 70;

// src/css-tokenizer/code-points/ranges.ts
function isHexDigitCodePoint(search) {
  return search >= 48 && search <= 57 || // 0 .. 9
  search >= 97 && search <= 102 || // a .. f
  search >= 65 && search <= 70;
}
__name(isHexDigitCodePoint, "isHexDigitCodePoint");

// src/css-tokenizer/consume/unicode-range-token.ts
function consumeUnicodeRangeToken(ctx, reader) {
  reader.advanceCodePoint(2);
  const firstSegment = [];
  const secondSegment = [];
  let codePoint;
  while (typeof (codePoint = reader.source.codePointAt(reader.cursor)) !== "undefined" && firstSegment.length < 6 && isHexDigitCodePoint(codePoint)) {
    firstSegment.push(codePoint);
    reader.advanceCodePoint();
  }
  while (typeof (codePoint = reader.source.codePointAt(reader.cursor)) !== "undefined" && firstSegment.length < 6 && codePoint === QUESTION_MARK) {
    if (secondSegment.length === 0) {
      secondSegment.push(...firstSegment);
    }
    firstSegment.push(DIGIT_ZERO);
    secondSegment.push(LATIN_CAPITAL_LETTER_F);
    reader.advanceCodePoint();
  }
  if (!secondSegment.length) {
    if (reader.source.codePointAt(reader.cursor) === HYPHEN_MINUS && isHexDigitCodePoint(reader.source.codePointAt(reader.cursor + 1) ?? -1)) {
      reader.advanceCodePoint();
      while (typeof (codePoint = reader.source.codePointAt(reader.cursor)) !== "undefined" && secondSegment.length < 6 && isHexDigitCodePoint(codePoint)) {
        secondSegment.push(codePoint);
        reader.advanceCodePoint();
      }
    }
  }
  if (!secondSegment.length) {
    const startOfRange2 = parseInt(String.fromCodePoint(...firstSegment), 16);
    return [
      "unicode-range-token" /* UnicodeRange */,
      reader.source.slice(reader.representationStart, reader.representationEnd + 1),
      reader.representationStart,
      reader.representationEnd,
      {
        startOfRange: startOfRange2,
        endOfRange: startOfRange2
      }
    ];
  }
  const startOfRange = parseInt(String.fromCodePoint(...firstSegment), 16);
  const endOfRange = parseInt(String.fromCodePoint(...secondSegment), 16);
  return [
    "unicode-range-token" /* UnicodeRange */,
    reader.source.slice(reader.representationStart, reader.representationEnd + 1),
    reader.representationStart,
    reader.representationEnd,
    {
      startOfRange,
      endOfRange
    }
  ];
}
__name(consumeUnicodeRangeToken, "consumeUnicodeRangeToken");
export {
  consumeUnicodeRangeToken
};
//# sourceMappingURL=unicode-range-token.mjs.map
