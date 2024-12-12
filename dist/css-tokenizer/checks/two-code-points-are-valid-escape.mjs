var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/css-tokenizer/code-points/code-points.ts
var CARRIAGE_RETURN = 13;
var FORM_FEED = 12;
var LINE_FEED = 10;
var REVERSE_SOLIDUS = 92;

// src/css-tokenizer/code-points/ranges.ts
function isNewLine(search) {
  return search === LINE_FEED || search === CARRIAGE_RETURN || search === FORM_FEED;
}
__name(isNewLine, "isNewLine");

// src/css-tokenizer/checks/two-code-points-are-valid-escape.ts
function checkIfTwoCodePointsAreAValidEscape(reader) {
  return (
    // If the first code point is not U+005C REVERSE SOLIDUS (\), return false.
    reader.source.codePointAt(reader.cursor) === REVERSE_SOLIDUS && // Otherwise, if the second code point is a newline, return false.
    !isNewLine(reader.source.codePointAt(reader.cursor + 1) ?? -1)
  );
}
__name(checkIfTwoCodePointsAreAValidEscape, "checkIfTwoCodePointsAreAValidEscape");
export {
  checkIfTwoCodePointsAreAValidEscape
};
//# sourceMappingURL=two-code-points-are-valid-escape.mjs.map
