var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/css-tokenizer/code-points/code-points.ts
var CARRIAGE_RETURN = 13;
var CHARACTER_TABULATION = 9;
var FORM_FEED = 12;
var LINE_FEED = 10;
var MAXIMUM_ALLOWED_CODEPOINT = 1114111;
var NULL = 0;
var REPLACEMENT_CHARACTER = 65533;
var REVERSE_SOLIDUS = 92;
var SPACE = 32;

// src/css-tokenizer/code-points/ranges.ts
function isHexDigitCodePoint(search) {
  return search >= 48 && search <= 57 || // 0 .. 9
  search >= 97 && search <= 102 || // a .. f
  search >= 65 && search <= 70;
}
__name(isHexDigitCodePoint, "isHexDigitCodePoint");
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
var ParseErrorWithToken = class extends ParseError {
  static {
    __name(this, "ParseErrorWithToken");
  }
  constructor(message, sourceStart, sourceEnd, parserState, token) {
    super(message, sourceStart, sourceEnd, parserState);
    this.token = token;
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

// src/css-tokenizer/consume/string-token.ts
function consumeStringToken(ctx, reader) {
  let result = "";
  const first = reader.readCodePoint();
  while (true) {
    const next = reader.readCodePoint();
    if (typeof next === "undefined") {
      const token = ["string-token" /* String */, reader.source.slice(reader.representationStart, reader.representationEnd + 1), reader.representationStart, reader.representationEnd, { value: result }];
      ctx.onParseError(new ParseErrorWithToken(
        ParseErrorMessage.UnexpectedEOFInString,
        reader.representationStart,
        reader.representationEnd,
        [
          "4.3.5. Consume a string token",
          "Unexpected EOF"
        ],
        token
      ));
      return token;
    }
    if (isNewLine(next)) {
      reader.unreadCodePoint();
      const token = ["bad-string-token" /* BadString */, reader.source.slice(reader.representationStart, reader.representationEnd + 1), reader.representationStart, reader.representationEnd, void 0];
      ctx.onParseError(new ParseErrorWithToken(
        ParseErrorMessage.UnexpectedNewLineInString,
        reader.representationStart,
        reader.source.codePointAt(reader.cursor) === CARRIAGE_RETURN && reader.source.codePointAt(reader.cursor + 1) === LINE_FEED ? (
          // CR LF
          reader.representationEnd + 2
        ) : (
          // LF
          reader.representationEnd + 1
        ),
        [
          "4.3.5. Consume a string token",
          "Unexpected newline"
        ],
        token
      ));
      return token;
    }
    if (next === first) {
      return ["string-token" /* String */, reader.source.slice(reader.representationStart, reader.representationEnd + 1), reader.representationStart, reader.representationEnd, { value: result }];
    }
    if (next === REVERSE_SOLIDUS) {
      if (typeof reader.source.codePointAt(reader.cursor) === "undefined") {
        continue;
      }
      if (isNewLine(reader.source.codePointAt(reader.cursor) ?? -1)) {
        if (reader.source.codePointAt(reader.cursor) === CARRIAGE_RETURN && reader.source.codePointAt(reader.cursor + 1) === LINE_FEED) {
          reader.advanceCodePoint();
        }
        reader.advanceCodePoint();
        continue;
      }
      result = result + String.fromCodePoint(consumeEscapedCodePoint(ctx, reader));
      continue;
    }
    if (next === NULL || isSurrogate(next)) {
      result = result + String.fromCodePoint(REPLACEMENT_CHARACTER);
      continue;
    }
    result = result + String.fromCodePoint(next);
  }
}
__name(consumeStringToken, "consumeStringToken");
export {
  consumeStringToken
};
//# sourceMappingURL=string-token.mjs.map
