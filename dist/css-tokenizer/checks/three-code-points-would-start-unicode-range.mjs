var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/css-tokenizer/code-points/code-points.ts
var PLUS_SIGN = 43;
var LATIN_SMALL_LETTER_U = 117;
var LATIN_CAPITAL_LETTER_U = 85;
var QUESTION_MARK = 63;

// src/css-tokenizer/code-points/ranges.ts
function isHexDigitCodePoint(search) {
  return search >= 48 && search <= 57 || // 0 .. 9
  search >= 97 && search <= 102 || // a .. f
  search >= 65 && search <= 70;
}
__name(isHexDigitCodePoint, "isHexDigitCodePoint");

// src/css-tokenizer/checks/three-code-points-would-start-unicode-range.ts
function checkIfThreeCodePointsWouldStartAUnicodeRange(reader) {
  if (
    // The first code point is either U+0055 LATIN CAPITAL LETTER U (U) or U+0075 LATIN SMALL LETTER U (u)
    (reader.source.codePointAt(reader.cursor) === LATIN_SMALL_LETTER_U || reader.source.codePointAt(reader.cursor) === LATIN_CAPITAL_LETTER_U) && // The second code point is U+002B PLUS SIGN (+).
    reader.source.codePointAt(reader.cursor + 1) === PLUS_SIGN && // The third code point is either U+003F QUESTION MARK (?) or a hex digit
    (reader.source.codePointAt(reader.cursor + 2) === QUESTION_MARK || isHexDigitCodePoint(reader.source.codePointAt(reader.cursor + 2) ?? -1))
  ) {
    return true;
  }
  return false;
}
__name(checkIfThreeCodePointsWouldStartAUnicodeRange, "checkIfThreeCodePointsWouldStartAUnicodeRange");
export {
  checkIfThreeCodePointsWouldStartAUnicodeRange
};
//# sourceMappingURL=three-code-points-would-start-unicode-range.mjs.map
