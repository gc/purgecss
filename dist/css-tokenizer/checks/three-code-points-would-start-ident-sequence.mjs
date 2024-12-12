var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/css-tokenizer/code-points/code-points.ts
var CARRIAGE_RETURN = 13;
var FORM_FEED = 12;
var HYPHEN_MINUS = 45;
var LINE_FEED = 10;
var LOW_LINE = 95;
var REVERSE_SOLIDUS = 92;

// src/css-tokenizer/code-points/ranges.ts
function isUppercaseLetterCodePoint(search) {
  return search >= 65 && search <= 90;
}
__name(isUppercaseLetterCodePoint, "isUppercaseLetterCodePoint");
function isLowercaseLetterCodePoint(search) {
  return search >= 97 && search <= 122;
}
__name(isLowercaseLetterCodePoint, "isLowercaseLetterCodePoint");
function isLetterCodePoint(search) {
  return isLowercaseLetterCodePoint(search) || isUppercaseLetterCodePoint(search);
}
__name(isLetterCodePoint, "isLetterCodePoint");
function isIdentStartCodePoint(search) {
  return isLetterCodePoint(search) || isNonASCII_IdentCodePoint(search) || search === LOW_LINE;
}
__name(isIdentStartCodePoint, "isIdentStartCodePoint");
function isNonASCII_IdentCodePoint(search) {
  if (search === 183 || search === 8204 || search === 8205 || search === 8255 || search === 8256 || search === 8204) {
    return true;
  }
  if (192 <= search && search <= 214 || 216 <= search && search <= 246 || 248 <= search && search <= 893 || 895 <= search && search <= 8191 || 8304 <= search && search <= 8591 || 11264 <= search && search <= 12271 || 12289 <= search && search <= 55295 || 63744 <= search && search <= 64975 || 65008 <= search && search <= 65533) {
    return true;
  }
  if (search === 0) {
    return true;
  } else if (isSurrogate(search)) {
    return true;
  }
  return search >= 65536;
}
__name(isNonASCII_IdentCodePoint, "isNonASCII_IdentCodePoint");
function isNewLine(search) {
  return search === LINE_FEED || search === CARRIAGE_RETURN || search === FORM_FEED;
}
__name(isNewLine, "isNewLine");
function isSurrogate(search) {
  return search >= 55296 && search <= 57343;
}
__name(isSurrogate, "isSurrogate");

// src/css-tokenizer/checks/two-code-points-are-valid-escape.ts
function checkIfTwoCodePointsAreAValidEscape(reader) {
  return (
    // If the first code point is not U+005C REVERSE SOLIDUS (\), return false.
    reader.source.codePointAt(reader.cursor) === REVERSE_SOLIDUS && // Otherwise, if the second code point is a newline, return false.
    !isNewLine(reader.source.codePointAt(reader.cursor + 1) ?? -1)
  );
}
__name(checkIfTwoCodePointsAreAValidEscape, "checkIfTwoCodePointsAreAValidEscape");

// src/css-tokenizer/checks/three-code-points-would-start-ident-sequence.ts
function checkIfThreeCodePointsWouldStartAnIdentSequence(ctx, reader) {
  if (reader.source.codePointAt(reader.cursor) === HYPHEN_MINUS) {
    if (reader.source.codePointAt(reader.cursor + 1) === HYPHEN_MINUS) {
      return true;
    }
    if (isIdentStartCodePoint(reader.source.codePointAt(reader.cursor + 1) ?? -1)) {
      return true;
    }
    if (reader.source.codePointAt(reader.cursor + 1) === REVERSE_SOLIDUS && !isNewLine(reader.source.codePointAt(reader.cursor + 2) ?? -1)) {
      return true;
    }
    return false;
  }
  if (isIdentStartCodePoint(reader.source.codePointAt(reader.cursor) ?? -1)) {
    return true;
  }
  return checkIfTwoCodePointsAreAValidEscape(reader);
}
__name(checkIfThreeCodePointsWouldStartAnIdentSequence, "checkIfThreeCodePointsWouldStartAnIdentSequence");
export {
  checkIfThreeCodePointsWouldStartAnIdentSequence
};
//# sourceMappingURL=three-code-points-would-start-ident-sequence.mjs.map
