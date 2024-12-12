var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/css-tokenizer/code-points/code-points.ts
var CARRIAGE_RETURN = 13;
var CHARACTER_TABULATION = 9;
var FORM_FEED = 12;
var HYPHEN_MINUS = 45;
var LINE_FEED = 10;
var LOW_LINE = 95;
var MAXIMUM_ALLOWED_CODEPOINT = 1114111;
var NULL = 0;
var REPLACEMENT_CHARACTER = 65533;
var REVERSE_SOLIDUS = 92;
var SPACE = 32;

// src/css-tokenizer/code-points/ranges.ts
function isDigitCodePoint(search) {
  return search >= 48 && search <= 57;
}
__name(isDigitCodePoint, "isDigitCodePoint");
function isUppercaseLetterCodePoint(search) {
  return search >= 65 && search <= 90;
}
__name(isUppercaseLetterCodePoint, "isUppercaseLetterCodePoint");
function isLowercaseLetterCodePoint(search) {
  return search >= 97 && search <= 122;
}
__name(isLowercaseLetterCodePoint, "isLowercaseLetterCodePoint");
function isHexDigitCodePoint(search) {
  return search >= 48 && search <= 57 || // 0 .. 9
  search >= 97 && search <= 102 || // a .. f
  search >= 65 && search <= 70;
}
__name(isHexDigitCodePoint, "isHexDigitCodePoint");
function isLetterCodePoint(search) {
  return isLowercaseLetterCodePoint(search) || isUppercaseLetterCodePoint(search);
}
__name(isLetterCodePoint, "isLetterCodePoint");
function isIdentStartCodePoint(search) {
  return isLetterCodePoint(search) || isNonASCII_IdentCodePoint(search) || search === LOW_LINE;
}
__name(isIdentStartCodePoint, "isIdentStartCodePoint");
function isIdentCodePoint(search) {
  return isIdentStartCodePoint(search) || isDigitCodePoint(search) || search === HYPHEN_MINUS;
}
__name(isIdentCodePoint, "isIdentCodePoint");
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
function isWhitespace(search) {
  return search === SPACE || search === LINE_FEED || search === CHARACTER_TABULATION || search === CARRIAGE_RETURN || search === FORM_FEED;
}
__name(isWhitespace, "isWhitespace");
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

// src/css-tokenizer/interfaces/error.ts
var ParseError = class extends Error {
  static {
    __name(this, "ParseError");
  }
  constructor(message, sourceStart, sourceEnd, parserState) {
    super(message);
    this.name = "ParseError";
    this.sourceStart = sourceStart;
    this.sourceEnd = sourceEnd;
    this.parserState = parserState;
  }
};
var ParseErrorMessage = {
  UnexpectedNewLineInString: "Unexpected newline while consuming a string token.",
  UnexpectedEOFInString: "Unexpected EOF while consuming a string token.",
  UnexpectedEOFInComment: "Unexpected EOF while consuming a comment.",
  UnexpectedEOFInURL: "Unexpected EOF while consuming a url token.",
  UnexpectedEOFInEscapedCodePoint: "Unexpected EOF while consuming an escaped code point.",
  UnexpectedCharacterInURL: "Unexpected character while consuming a url token.",
  InvalidEscapeSequenceInURL: "Invalid escape sequence while consuming a url token.",
  InvalidEscapeSequenceAfterBackslash: 'Invalid escape sequence after "\\"'
};

// src/css-tokenizer/consume/escaped-code-point.ts
function consumeEscapedCodePoint(ctx, reader) {
  const codePoint = reader.readCodePoint();
  if (typeof codePoint === "undefined") {
    ctx.onParseError(new ParseError(
      ParseErrorMessage.UnexpectedEOFInEscapedCodePoint,
      reader.representationStart,
      reader.representationEnd,
      [
        "4.3.7. Consume an escaped code point",
        "Unexpected EOF"
      ]
    ));
    return REPLACEMENT_CHARACTER;
  }
  if (isHexDigitCodePoint(codePoint)) {
    const hexSequence = [codePoint];
    let nextCodePoint;
    while (typeof (nextCodePoint = reader.source.codePointAt(reader.cursor)) !== "undefined" && isHexDigitCodePoint(nextCodePoint) && hexSequence.length < 6) {
      hexSequence.push(nextCodePoint);
      reader.advanceCodePoint();
    }
    if (isWhitespace(reader.source.codePointAt(reader.cursor) ?? -1)) {
      if (reader.source.codePointAt(reader.cursor) === CARRIAGE_RETURN && reader.source.codePointAt(reader.cursor + 1) === LINE_FEED) {
        reader.advanceCodePoint();
      }
      reader.advanceCodePoint();
    }
    const codePointLiteral = parseInt(String.fromCodePoint(...hexSequence), 16);
    if (codePointLiteral === 0 || isSurrogate(codePointLiteral)) {
      return REPLACEMENT_CHARACTER;
    }
    if (codePointLiteral > MAXIMUM_ALLOWED_CODEPOINT) {
      return REPLACEMENT_CHARACTER;
    }
    return codePointLiteral;
  }
  if (codePoint === 0 || isSurrogate(codePoint)) {
    return REPLACEMENT_CHARACTER;
  }
  return codePoint;
}
__name(consumeEscapedCodePoint, "consumeEscapedCodePoint");

// src/css-tokenizer/consume/ident-sequence.ts
function consumeIdentSequence(ctx, reader) {
  const result = [];
  while (true) {
    const codePoint = reader.source.codePointAt(reader.cursor) ?? -1;
    if (codePoint === NULL || isSurrogate(codePoint)) {
      result.push(REPLACEMENT_CHARACTER);
      reader.advanceCodePoint(1 + +(codePoint > 65535));
      continue;
    }
    if (isIdentCodePoint(codePoint)) {
      result.push(codePoint);
      reader.advanceCodePoint(1 + +(codePoint > 65535));
      continue;
    }
    if (checkIfTwoCodePointsAreAValidEscape(reader)) {
      reader.advanceCodePoint();
      result.push(consumeEscapedCodePoint(ctx, reader));
      continue;
    }
    return result;
  }
}
__name(consumeIdentSequence, "consumeIdentSequence");

// src/css-tokenizer/consume/hash-token.ts
function consumeHashToken(ctx, reader) {
  reader.advanceCodePoint();
  const codePoint = reader.source.codePointAt(reader.cursor);
  if (typeof codePoint !== "undefined" && (isIdentCodePoint(codePoint) || checkIfTwoCodePointsAreAValidEscape(reader))) {
    let hashType = "unrestricted" /* Unrestricted */;
    if (checkIfThreeCodePointsWouldStartAnIdentSequence(ctx, reader)) {
      hashType = "id" /* ID */;
    }
    const identSequence = consumeIdentSequence(ctx, reader);
    return [
      "hash-token" /* Hash */,
      reader.source.slice(reader.representationStart, reader.representationEnd + 1),
      reader.representationStart,
      reader.representationEnd,
      {
        value: String.fromCodePoint(...identSequence),
        type: hashType
      }
    ];
  }
  return [
    "delim-token" /* Delim */,
    "#",
    reader.representationStart,
    reader.representationEnd,
    {
      value: "#"
    }
  ];
}
__name(consumeHashToken, "consumeHashToken");
export {
  consumeHashToken
};
//# sourceMappingURL=hash-token.mjs.map
