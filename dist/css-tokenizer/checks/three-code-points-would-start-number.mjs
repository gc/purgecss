var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/css-tokenizer/code-points/code-points.ts
var FULL_STOP = 46;
var HYPHEN_MINUS = 45;
var PLUS_SIGN = 43;

// src/css-tokenizer/code-points/ranges.ts
function isDigitCodePoint(search) {
  return search >= 48 && search <= 57;
}
__name(isDigitCodePoint, "isDigitCodePoint");

// src/css-tokenizer/checks/three-code-points-would-start-number.ts
function checkIfThreeCodePointsWouldStartANumber(reader) {
  if (reader.source.codePointAt(reader.cursor) === PLUS_SIGN || reader.source.codePointAt(reader.cursor) === HYPHEN_MINUS) {
    if (isDigitCodePoint(reader.source.codePointAt(reader.cursor + 1) ?? -1)) {
      return true;
    }
    if (reader.source.codePointAt(reader.cursor + 1) === FULL_STOP) {
      return isDigitCodePoint(reader.source.codePointAt(reader.cursor + 2) ?? -1);
    }
    return false;
  } else if (reader.source.codePointAt(reader.cursor) === FULL_STOP) {
    return isDigitCodePoint(reader.source.codePointAt(reader.cursor + 1) ?? -1);
  }
  return isDigitCodePoint(reader.source.codePointAt(reader.cursor) ?? -1);
}
__name(checkIfThreeCodePointsWouldStartANumber, "checkIfThreeCodePointsWouldStartANumber");
export {
  checkIfThreeCodePointsWouldStartANumber
};
//# sourceMappingURL=three-code-points-would-start-number.mjs.map
