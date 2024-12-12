var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/css-tokenizer/code-points/code-points.ts
var FULL_STOP = 46;
var HYPHEN_MINUS = 45;
var LATIN_CAPITAL_LETTER_E = 69;
var LATIN_SMALL_LETTER_E = 101;
var PLUS_SIGN = 43;

// src/css-tokenizer/code-points/ranges.ts
function isDigitCodePoint(search) {
  return search >= 48 && search <= 57;
}
__name(isDigitCodePoint, "isDigitCodePoint");

// src/css-tokenizer/consume/number.ts
function consumeNumber(ctx, reader) {
  let type = "integer" /* Integer */;
  if (reader.source.codePointAt(reader.cursor) === PLUS_SIGN || reader.source.codePointAt(reader.cursor) === HYPHEN_MINUS) {
    reader.advanceCodePoint();
  }
  while (isDigitCodePoint(reader.source.codePointAt(reader.cursor) ?? -1)) {
    reader.advanceCodePoint();
  }
  if (reader.source.codePointAt(reader.cursor) === FULL_STOP && isDigitCodePoint(reader.source.codePointAt(reader.cursor + 1) ?? -1)) {
    reader.advanceCodePoint(2);
    type = "number" /* Number */;
    while (isDigitCodePoint(reader.source.codePointAt(reader.cursor) ?? -1)) {
      reader.advanceCodePoint();
    }
  }
  if (reader.source.codePointAt(reader.cursor) === LATIN_SMALL_LETTER_E || reader.source.codePointAt(reader.cursor) === LATIN_CAPITAL_LETTER_E) {
    if (isDigitCodePoint(reader.source.codePointAt(reader.cursor + 1) ?? -1)) {
      reader.advanceCodePoint(2);
    } else if ((reader.source.codePointAt(reader.cursor + 1) === HYPHEN_MINUS || reader.source.codePointAt(reader.cursor + 1) === PLUS_SIGN) && isDigitCodePoint(reader.source.codePointAt(reader.cursor + 2) ?? -1)) {
      reader.advanceCodePoint(3);
    } else {
      return type;
    }
    type = "number" /* Number */;
    while (isDigitCodePoint(reader.source.codePointAt(reader.cursor) ?? -1)) {
      reader.advanceCodePoint();
    }
  }
  return type;
}
__name(consumeNumber, "consumeNumber");
export {
  consumeNumber
};
//# sourceMappingURL=number.mjs.map
