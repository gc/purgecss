var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

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

// src/css-tokenizer/util/clone-tokens.ts
var supportsStructuredClone = typeof globalThis !== "undefined" && "structuredClone" in globalThis;
function cloneTokens(tokens) {
  if (supportsStructuredClone) {
    return structuredClone(tokens);
  }
  return JSON.parse(JSON.stringify(tokens));
}
__name(cloneTokens, "cloneTokens");

// src/css-tokenizer/stringify.ts
function stringify(...tokens) {
  let buffer = "";
  for (let i = 0; i < tokens.length; i++) {
    buffer = buffer + tokens[i][1];
  }
  return buffer;
}
__name(stringify, "stringify");

// src/css-tokenizer/code-points/code-points.ts
var APOSTROPHE = 39;
var ASTERISK = 42;
var BACKSPACE = 8;
var CARRIAGE_RETURN = 13;
var CHARACTER_TABULATION = 9;
var COLON = 58;
var COMMA = 44;
var COMMERCIAL_AT = 64;
var DELETE = 127;
var EXCLAMATION_MARK = 33;
var FORM_FEED = 12;
var FULL_STOP = 46;
var GREATER_THAN_SIGN = 62;
var HYPHEN_MINUS = 45;
var INFORMATION_SEPARATOR_ONE = 31;
var LATIN_CAPITAL_LETTER_E = 69;
var LATIN_SMALL_LETTER_E = 101;
var LEFT_CURLY_BRACKET = 123;
var LEFT_PARENTHESIS = 40;
var LEFT_SQUARE_BRACKET = 91;
var LESS_THAN_SIGN = 60;
var LINE_FEED = 10;
var LINE_TABULATION = 11;
var LOW_LINE = 95;
var MAXIMUM_ALLOWED_CODEPOINT = 1114111;
var NULL = 0;
var NUMBER_SIGN = 35;
var PERCENTAGE_SIGN = 37;
var PLUS_SIGN = 43;
var QUOTATION_MARK = 34;
var REPLACEMENT_CHARACTER = 65533;
var REVERSE_SOLIDUS = 92;
var RIGHT_CURLY_BRACKET = 125;
var RIGHT_PARENTHESIS = 41;
var RIGHT_SQUARE_BRACKET = 93;
var SEMICOLON = 59;
var SHIFT_OUT = 14;
var SOLIDUS = 47;
var SPACE = 32;
var LATIN_SMALL_LETTER_U = 117;
var LATIN_CAPITAL_LETTER_U = 85;
var LATIN_SMALL_LETTER_R = 114;
var LATIN_CAPITAL_LETTER_R = 82;
var LATIN_SMALL_LETTER_L = 108;
var LATIN_CAPITAL_LETTER_L = 76;
var QUESTION_MARK = 63;
var DIGIT_ZERO = 48;
var LATIN_CAPITAL_LETTER_F = 70;

// src/css-tokenizer/checks/four-code-points-would-start-cdo.ts
function checkIfFourCodePointsWouldStartCDO(reader) {
  return reader.source.codePointAt(reader.cursor) === LESS_THAN_SIGN && reader.source.codePointAt(reader.cursor + 1) === EXCLAMATION_MARK && reader.source.codePointAt(reader.cursor + 2) === HYPHEN_MINUS && reader.source.codePointAt(reader.cursor + 3) === HYPHEN_MINUS;
}
__name(checkIfFourCodePointsWouldStartCDO, "checkIfFourCodePointsWouldStartCDO");

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
function isNonPrintableCodePoint(search) {
  return search === LINE_TABULATION || search === DELETE || NULL <= search && search <= BACKSPACE || SHIFT_OUT <= search && search <= INFORMATION_SEPARATOR_ONE;
}
__name(isNonPrintableCodePoint, "isNonPrintableCodePoint");
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

// src/css-tokenizer/checks/two-code-points-start-comment.ts
function checkIfTwoCodePointsStartAComment(reader) {
  return reader.source.codePointAt(reader.cursor) === SOLIDUS && reader.source.codePointAt(reader.cursor + 1) === ASTERISK;
}
__name(checkIfTwoCodePointsStartAComment, "checkIfTwoCodePointsStartAComment");

// src/css-tokenizer/checks/three-code-points-would-start-cdc.ts
function checkIfThreeCodePointsWouldStartCDC(reader) {
  return reader.source.codePointAt(reader.cursor) === HYPHEN_MINUS && reader.source.codePointAt(reader.cursor + 1) === HYPHEN_MINUS && reader.source.codePointAt(reader.cursor + 2) === GREATER_THAN_SIGN;
}
__name(checkIfThreeCodePointsWouldStartCDC, "checkIfThreeCodePointsWouldStartCDC");

// src/css-tokenizer/interfaces/token.ts
var TokenType = /* @__PURE__ */ ((TokenType2) => {
  TokenType2["Comment"] = "comment";
  TokenType2["AtKeyword"] = "at-keyword-token";
  TokenType2["BadString"] = "bad-string-token";
  TokenType2["BadURL"] = "bad-url-token";
  TokenType2["CDC"] = "CDC-token";
  TokenType2["CDO"] = "CDO-token";
  TokenType2["Colon"] = "colon-token";
  TokenType2["Comma"] = "comma-token";
  TokenType2["Delim"] = "delim-token";
  TokenType2["Dimension"] = "dimension-token";
  TokenType2["EOF"] = "EOF-token";
  TokenType2["Function"] = "function-token";
  TokenType2["Hash"] = "hash-token";
  TokenType2["Ident"] = "ident-token";
  TokenType2["Number"] = "number-token";
  TokenType2["Percentage"] = "percentage-token";
  TokenType2["Semicolon"] = "semicolon-token";
  TokenType2["String"] = "string-token";
  TokenType2["URL"] = "url-token";
  TokenType2["Whitespace"] = "whitespace-token";
  TokenType2["OpenParen"] = "(-token";
  TokenType2["CloseParen"] = ")-token";
  TokenType2["OpenSquare"] = "[-token";
  TokenType2["CloseSquare"] = "]-token";
  TokenType2["OpenCurly"] = "{-token";
  TokenType2["CloseCurly"] = "}-token";
  TokenType2["UnicodeRange"] = "unicode-range-token";
  return TokenType2;
})(TokenType || {});
var NumberType = /* @__PURE__ */ ((NumberType2) => {
  NumberType2["Integer"] = "integer";
  NumberType2["Number"] = "number";
  return NumberType2;
})(NumberType || {});
var HashType = /* @__PURE__ */ ((HashType2) => {
  HashType2["Unrestricted"] = "unrestricted";
  HashType2["ID"] = "id";
  return HashType2;
})(HashType || {});
function mirrorVariantType(type) {
  switch (type) {
    case "(-token" /* OpenParen */:
      return ")-token" /* CloseParen */;
    case ")-token" /* CloseParen */:
      return "(-token" /* OpenParen */;
    case "{-token" /* OpenCurly */:
      return "}-token" /* CloseCurly */;
    case "}-token" /* CloseCurly */:
      return "{-token" /* OpenCurly */;
    case "[-token" /* OpenSquare */:
      return "]-token" /* CloseSquare */;
    case "]-token" /* CloseSquare */:
      return "[-token" /* OpenSquare */;
    default:
      return null;
  }
}
__name(mirrorVariantType, "mirrorVariantType");
function mirrorVariant(token) {
  switch (token[0]) {
    case "(-token" /* OpenParen */:
      return [")-token" /* CloseParen */, ")", -1, -1, void 0];
    case ")-token" /* CloseParen */:
      return ["(-token" /* OpenParen */, "(", -1, -1, void 0];
    case "{-token" /* OpenCurly */:
      return ["}-token" /* CloseCurly */, "}", -1, -1, void 0];
    case "}-token" /* CloseCurly */:
      return ["{-token" /* OpenCurly */, "{", -1, -1, void 0];
    case "[-token" /* OpenSquare */:
      return ["]-token" /* CloseSquare */, "]", -1, -1, void 0];
    case "]-token" /* CloseSquare */:
      return ["[-token" /* OpenSquare */, "[", -1, -1, void 0];
    default:
      return null;
  }
}
__name(mirrorVariant, "mirrorVariant");

// src/css-tokenizer/consume/comment.ts
function consumeComment(ctx, reader) {
  reader.advanceCodePoint(2);
  while (true) {
    const codePoint = reader.readCodePoint();
    if (typeof codePoint === "undefined") {
      const token = [
        "comment" /* Comment */,
        reader.source.slice(reader.representationStart, reader.representationEnd + 1),
        reader.representationStart,
        reader.representationEnd,
        void 0
      ];
      ctx.onParseError(new ParseErrorWithToken(
        ParseErrorMessage.UnexpectedEOFInComment,
        reader.representationStart,
        reader.representationEnd,
        [
          "4.3.2. Consume comments",
          "Unexpected EOF"
        ],
        token
      ));
      return token;
    }
    if (codePoint !== ASTERISK) {
      continue;
    }
    if (typeof reader.source.codePointAt(reader.cursor) === "undefined") {
      continue;
    }
    if (reader.source.codePointAt(reader.cursor) === SOLIDUS) {
      reader.advanceCodePoint();
      break;
    }
  }
  return [
    "comment" /* Comment */,
    reader.source.slice(reader.representationStart, reader.representationEnd + 1),
    reader.representationStart,
    reader.representationEnd,
    void 0
  ];
}
__name(consumeComment, "consumeComment");

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

// src/css-tokenizer/consume/numeric-token.ts
function consumeNumericToken(ctx, reader) {
  let signCharacter = void 0;
  {
    const peeked = reader.source.codePointAt(reader.cursor);
    if (peeked === HYPHEN_MINUS) {
      signCharacter = "-";
    } else if (peeked === PLUS_SIGN) {
      signCharacter = "+";
    }
  }
  const numberType = consumeNumber(ctx, reader);
  const numberValue = parseFloat(reader.source.slice(reader.representationStart, reader.representationEnd + 1));
  if (checkIfThreeCodePointsWouldStartAnIdentSequence(ctx, reader)) {
    const unit = consumeIdentSequence(ctx, reader);
    return [
      "dimension-token" /* Dimension */,
      reader.source.slice(reader.representationStart, reader.representationEnd + 1),
      reader.representationStart,
      reader.representationEnd,
      {
        value: numberValue,
        signCharacter,
        type: numberType,
        unit: String.fromCodePoint(...unit)
      }
    ];
  }
  if (reader.source.codePointAt(reader.cursor) === PERCENTAGE_SIGN) {
    reader.advanceCodePoint();
    return [
      "percentage-token" /* Percentage */,
      reader.source.slice(reader.representationStart, reader.representationEnd + 1),
      reader.representationStart,
      reader.representationEnd,
      {
        value: numberValue,
        signCharacter
      }
    ];
  }
  return [
    "number-token" /* Number */,
    reader.source.slice(reader.representationStart, reader.representationEnd + 1),
    reader.representationStart,
    reader.representationEnd,
    {
      value: numberValue,
      signCharacter,
      type: numberType
    }
  ];
}
__name(consumeNumericToken, "consumeNumericToken");

// src/css-tokenizer/consume/whitespace-token.ts
function consumeWhiteSpace(reader) {
  while (isWhitespace(reader.source.codePointAt(reader.cursor) ?? -1)) {
    reader.advanceCodePoint();
  }
  return [
    "whitespace-token" /* Whitespace */,
    reader.source.slice(reader.representationStart, reader.representationEnd + 1),
    reader.representationStart,
    reader.representationEnd,
    void 0
  ];
}
__name(consumeWhiteSpace, "consumeWhiteSpace");

// src/css-tokenizer/reader.ts
var Reader = class {
  constructor(source) {
    this.cursor = 0;
    this.source = "";
    this.representationStart = 0;
    this.representationEnd = -1;
    this.source = source;
  }
  static {
    __name(this, "Reader");
  }
  advanceCodePoint(n = 1) {
    this.cursor = this.cursor + n;
    this.representationEnd = this.cursor - 1;
  }
  readCodePoint() {
    const codePoint = this.source.codePointAt(this.cursor);
    if (typeof codePoint === "undefined") {
      return void 0;
    }
    this.cursor = this.cursor + 1;
    this.representationEnd = this.cursor - 1;
    return codePoint;
  }
  unreadCodePoint(n = 1) {
    this.cursor = this.cursor - n;
    this.representationEnd = this.cursor - 1;
    return;
  }
  resetRepresentation() {
    this.representationStart = this.cursor;
    this.representationEnd = -1;
  }
};

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

// src/css-tokenizer/checks/matches-url-ident.ts
function checkIfCodePointsMatchURLIdent(codePoints) {
  return codePoints.length === 3 && (codePoints[0] === LATIN_SMALL_LETTER_U || codePoints[0] === LATIN_CAPITAL_LETTER_U) && (codePoints[1] === LATIN_SMALL_LETTER_R || codePoints[1] === LATIN_CAPITAL_LETTER_R) && (codePoints[2] === LATIN_SMALL_LETTER_L || codePoints[2] === LATIN_CAPITAL_LETTER_L);
}
__name(checkIfCodePointsMatchURLIdent, "checkIfCodePointsMatchURLIdent");

// src/css-tokenizer/consume/bad-url.ts
function consumeBadURL(ctx, reader) {
  while (true) {
    const codePoint = reader.source.codePointAt(reader.cursor);
    if (typeof codePoint === "undefined") {
      return;
    }
    if (codePoint === RIGHT_PARENTHESIS) {
      reader.advanceCodePoint();
      return;
    }
    if (checkIfTwoCodePointsAreAValidEscape(reader)) {
      reader.advanceCodePoint();
      consumeEscapedCodePoint(ctx, reader);
      continue;
    }
    reader.advanceCodePoint();
    continue;
  }
}
__name(consumeBadURL, "consumeBadURL");

// src/css-tokenizer/consume/url-token.ts
function consumeUrlToken(ctx, reader) {
  while (isWhitespace(reader.source.codePointAt(reader.cursor) ?? -1)) {
    reader.advanceCodePoint();
  }
  let string = "";
  while (true) {
    if (typeof reader.source.codePointAt(reader.cursor) === "undefined") {
      const token = [
        "url-token" /* URL */,
        reader.source.slice(reader.representationStart, reader.representationEnd + 1),
        reader.representationStart,
        reader.representationEnd,
        {
          value: string
        }
      ];
      ctx.onParseError(new ParseErrorWithToken(
        ParseErrorMessage.UnexpectedEOFInURL,
        reader.representationStart,
        reader.representationEnd,
        [
          "4.3.6. Consume a url token",
          "Unexpected EOF"
        ],
        token
      ));
      return token;
    }
    if (reader.source.codePointAt(reader.cursor) === RIGHT_PARENTHESIS) {
      reader.advanceCodePoint();
      return [
        "url-token" /* URL */,
        reader.source.slice(reader.representationStart, reader.representationEnd + 1),
        reader.representationStart,
        reader.representationEnd,
        {
          value: string
        }
      ];
    }
    if (isWhitespace(reader.source.codePointAt(reader.cursor) ?? -1)) {
      reader.advanceCodePoint();
      while (isWhitespace(reader.source.codePointAt(reader.cursor) ?? -1)) {
        reader.advanceCodePoint();
      }
      if (typeof reader.source.codePointAt(reader.cursor) === "undefined") {
        const token = [
          "url-token" /* URL */,
          reader.source.slice(reader.representationStart, reader.representationEnd + 1),
          reader.representationStart,
          reader.representationEnd,
          {
            value: string
          }
        ];
        ctx.onParseError(new ParseErrorWithToken(
          ParseErrorMessage.UnexpectedEOFInURL,
          reader.representationStart,
          reader.representationEnd,
          [
            "4.3.6. Consume a url token",
            "Consume as much whitespace as possible",
            "Unexpected EOF"
          ],
          token
        ));
        return token;
      }
      if (reader.source.codePointAt(reader.cursor) === RIGHT_PARENTHESIS) {
        reader.advanceCodePoint();
        return [
          "url-token" /* URL */,
          reader.source.slice(reader.representationStart, reader.representationEnd + 1),
          reader.representationStart,
          reader.representationEnd,
          {
            value: string
          }
        ];
      }
      consumeBadURL(ctx, reader);
      return [
        "bad-url-token" /* BadURL */,
        reader.source.slice(reader.representationStart, reader.representationEnd + 1),
        reader.representationStart,
        reader.representationEnd,
        void 0
      ];
    }
    const codePoint = reader.source.codePointAt(reader.cursor);
    if (codePoint === QUOTATION_MARK || codePoint === APOSTROPHE || codePoint === LEFT_PARENTHESIS || isNonPrintableCodePoint(codePoint ?? -1)) {
      consumeBadURL(ctx, reader);
      const token = [
        "bad-url-token" /* BadURL */,
        reader.source.slice(reader.representationStart, reader.representationEnd + 1),
        reader.representationStart,
        reader.representationEnd,
        void 0
      ];
      ctx.onParseError(new ParseErrorWithToken(
        ParseErrorMessage.UnexpectedCharacterInURL,
        reader.representationStart,
        reader.representationEnd,
        [
          "4.3.6. Consume a url token",
          `Unexpected U+0022 QUOTATION MARK ("), U+0027 APOSTROPHE ('), U+0028 LEFT PARENTHESIS (() or non-printable code point`
        ],
        token
      ));
      return token;
    }
    if (codePoint === REVERSE_SOLIDUS) {
      if (checkIfTwoCodePointsAreAValidEscape(reader)) {
        reader.advanceCodePoint();
        string = string + String.fromCodePoint(consumeEscapedCodePoint(ctx, reader));
        continue;
      }
      consumeBadURL(ctx, reader);
      const token = [
        "bad-url-token" /* BadURL */,
        reader.source.slice(reader.representationStart, reader.representationEnd + 1),
        reader.representationStart,
        reader.representationEnd,
        void 0
      ];
      ctx.onParseError(new ParseErrorWithToken(
        ParseErrorMessage.InvalidEscapeSequenceInURL,
        reader.representationStart,
        reader.representationEnd,
        [
          "4.3.6. Consume a url token",
          "U+005C REVERSE SOLIDUS (\\)",
          "The input stream does not start with a valid escape sequence"
        ],
        token
      ));
      return token;
    }
    if (reader.source.codePointAt(reader.cursor) === NULL || isSurrogate(reader.source.codePointAt(reader.cursor) ?? -1)) {
      string = string + String.fromCodePoint(REPLACEMENT_CHARACTER);
      reader.advanceCodePoint();
      continue;
    }
    string = string + reader.source[reader.cursor];
    reader.advanceCodePoint();
  }
}
__name(consumeUrlToken, "consumeUrlToken");

// src/css-tokenizer/consume/ident-like-token.ts
function consumeIdentLikeToken(ctx, reader) {
  const codePoints = consumeIdentSequence(ctx, reader);
  if (reader.source.codePointAt(reader.cursor) !== LEFT_PARENTHESIS) {
    return [
      "ident-token" /* Ident */,
      reader.source.slice(reader.representationStart, reader.representationEnd + 1),
      reader.representationStart,
      reader.representationEnd,
      {
        value: String.fromCodePoint(...codePoints)
      }
    ];
  }
  if (checkIfCodePointsMatchURLIdent(codePoints)) {
    reader.advanceCodePoint();
    let read = 0;
    while (true) {
      const firstIsWhitespace = isWhitespace(reader.source.codePointAt(reader.cursor) ?? -1);
      const secondIsWhitespace = isWhitespace(reader.source.codePointAt(reader.cursor + 1) ?? -1);
      if (firstIsWhitespace && secondIsWhitespace) {
        read = read + 1;
        reader.advanceCodePoint(1);
        continue;
      }
      const firstNonWhitespace = firstIsWhitespace ? reader.source.codePointAt(reader.cursor + 1) : reader.source.codePointAt(reader.cursor);
      if (firstNonWhitespace === QUOTATION_MARK || firstNonWhitespace === APOSTROPHE) {
        if (read > 0) {
          reader.unreadCodePoint(read);
        }
        return [
          "function-token" /* Function */,
          reader.source.slice(reader.representationStart, reader.representationEnd + 1),
          reader.representationStart,
          reader.representationEnd,
          {
            value: String.fromCodePoint(...codePoints)
          }
        ];
      }
      break;
    }
    return consumeUrlToken(ctx, reader);
  }
  reader.advanceCodePoint();
  return [
    "function-token" /* Function */,
    reader.source.slice(reader.representationStart, reader.representationEnd + 1),
    reader.representationStart,
    reader.representationEnd,
    {
      value: String.fromCodePoint(...codePoints)
    }
  ];
}
__name(consumeIdentLikeToken, "consumeIdentLikeToken");

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

// src/css-tokenizer/tokenizer.ts
function tokenize(input, options) {
  const t = tokenizer(input, options);
  const tokens = [];
  while (!t.endOfFile()) {
    tokens.push(t.nextToken());
  }
  tokens.push(t.nextToken());
  return tokens;
}
__name(tokenize, "tokenize");
function tokenizer(input, options) {
  const css = input.css.valueOf();
  const unicodeRangesAllowed = input.unicodeRangesAllowed ?? false;
  const reader = new Reader(css);
  const ctx = {
    onParseError: options?.onParseError ?? noop
  };
  function endOfFile() {
    return typeof reader.source.codePointAt(reader.cursor) === "undefined";
  }
  __name(endOfFile, "endOfFile");
  function nextToken() {
    reader.resetRepresentation();
    const peeked = reader.source.codePointAt(reader.cursor);
    if (typeof peeked === "undefined") {
      return ["EOF-token" /* EOF */, "", -1, -1, void 0];
    }
    if (peeked === SOLIDUS && checkIfTwoCodePointsStartAComment(reader)) {
      return consumeComment(ctx, reader);
    }
    if (unicodeRangesAllowed && (peeked === LATIN_SMALL_LETTER_U || peeked === LATIN_CAPITAL_LETTER_U) && checkIfThreeCodePointsWouldStartAUnicodeRange(reader)) {
      return consumeUnicodeRangeToken(ctx, reader);
    }
    if (isIdentStartCodePoint(peeked)) {
      return consumeIdentLikeToken(ctx, reader);
    }
    if (isDigitCodePoint(peeked)) {
      return consumeNumericToken(ctx, reader);
    }
    switch (peeked) {
      case COMMA:
        reader.advanceCodePoint();
        return ["comma-token" /* Comma */, ",", reader.representationStart, reader.representationEnd, void 0];
      case COLON:
        reader.advanceCodePoint();
        return ["colon-token" /* Colon */, ":", reader.representationStart, reader.representationEnd, void 0];
      case SEMICOLON:
        reader.advanceCodePoint();
        return ["semicolon-token" /* Semicolon */, ";", reader.representationStart, reader.representationEnd, void 0];
      case LEFT_PARENTHESIS:
        reader.advanceCodePoint();
        return ["(-token" /* OpenParen */, "(", reader.representationStart, reader.representationEnd, void 0];
      case RIGHT_PARENTHESIS:
        reader.advanceCodePoint();
        return [")-token" /* CloseParen */, ")", reader.representationStart, reader.representationEnd, void 0];
      case LEFT_SQUARE_BRACKET:
        reader.advanceCodePoint();
        return ["[-token" /* OpenSquare */, "[", reader.representationStart, reader.representationEnd, void 0];
      case RIGHT_SQUARE_BRACKET:
        reader.advanceCodePoint();
        return ["]-token" /* CloseSquare */, "]", reader.representationStart, reader.representationEnd, void 0];
      case LEFT_CURLY_BRACKET:
        reader.advanceCodePoint();
        return ["{-token" /* OpenCurly */, "{", reader.representationStart, reader.representationEnd, void 0];
      case RIGHT_CURLY_BRACKET:
        reader.advanceCodePoint();
        return ["}-token" /* CloseCurly */, "}", reader.representationStart, reader.representationEnd, void 0];
      case APOSTROPHE:
      case QUOTATION_MARK:
        return consumeStringToken(ctx, reader);
      case NUMBER_SIGN:
        return consumeHashToken(ctx, reader);
      case PLUS_SIGN:
      case FULL_STOP:
        if (checkIfThreeCodePointsWouldStartANumber(reader)) {
          return consumeNumericToken(ctx, reader);
        }
        reader.advanceCodePoint();
        return ["delim-token" /* Delim */, reader.source[reader.representationStart], reader.representationStart, reader.representationEnd, {
          value: reader.source[reader.representationStart]
        }];
      case LINE_FEED:
      case CARRIAGE_RETURN:
      case FORM_FEED:
      case CHARACTER_TABULATION:
      case SPACE:
        return consumeWhiteSpace(reader);
      case HYPHEN_MINUS:
        if (checkIfThreeCodePointsWouldStartANumber(reader)) {
          return consumeNumericToken(ctx, reader);
        }
        if (checkIfThreeCodePointsWouldStartCDC(reader)) {
          reader.advanceCodePoint(3);
          return ["CDC-token" /* CDC */, "-->", reader.representationStart, reader.representationEnd, void 0];
        }
        if (checkIfThreeCodePointsWouldStartAnIdentSequence(ctx, reader)) {
          return consumeIdentLikeToken(ctx, reader);
        }
        reader.advanceCodePoint();
        return ["delim-token" /* Delim */, "-", reader.representationStart, reader.representationEnd, {
          value: "-"
        }];
      case LESS_THAN_SIGN:
        if (checkIfFourCodePointsWouldStartCDO(reader)) {
          reader.advanceCodePoint(4);
          return ["CDO-token" /* CDO */, "<!--", reader.representationStart, reader.representationEnd, void 0];
        }
        reader.advanceCodePoint();
        return ["delim-token" /* Delim */, "<", reader.representationStart, reader.representationEnd, {
          value: "<"
        }];
      case COMMERCIAL_AT:
        reader.advanceCodePoint();
        if (checkIfThreeCodePointsWouldStartAnIdentSequence(ctx, reader)) {
          const identSequence = consumeIdentSequence(ctx, reader);
          return ["at-keyword-token" /* AtKeyword */, reader.source.slice(reader.representationStart, reader.representationEnd + 1), reader.representationStart, reader.representationEnd, {
            value: String.fromCodePoint(...identSequence)
          }];
        }
        return ["delim-token" /* Delim */, "@", reader.representationStart, reader.representationEnd, {
          value: "@"
        }];
      case REVERSE_SOLIDUS: {
        if (checkIfTwoCodePointsAreAValidEscape(reader)) {
          return consumeIdentLikeToken(ctx, reader);
        }
        reader.advanceCodePoint();
        const token = ["delim-token" /* Delim */, "\\", reader.representationStart, reader.representationEnd, {
          value: "\\"
        }];
        ctx.onParseError(new ParseErrorWithToken(
          ParseErrorMessage.InvalidEscapeSequenceAfterBackslash,
          reader.representationStart,
          reader.representationEnd,
          [
            "4.3.1. Consume a token",
            "U+005C REVERSE SOLIDUS (\\)",
            "The input stream does not start with a valid escape sequence"
          ],
          token
        ));
        return token;
      }
    }
    reader.advanceCodePoint();
    return ["delim-token" /* Delim */, reader.source[reader.representationStart], reader.representationStart, reader.representationEnd, {
      value: reader.source[reader.representationStart]
    }];
  }
  __name(nextToken, "nextToken");
  return {
    nextToken,
    endOfFile
  };
}
__name(tokenizer, "tokenizer");
function noop() {
}
__name(noop, "noop");

// src/css-tokenizer/util/mutations.ts
function mutateIdent(ident, newValue) {
  const codePoints = [];
  for (const codePoint of newValue) {
    codePoints.push(codePoint.codePointAt(0));
  }
  const result = String.fromCodePoint(...ensureThatValueRoundTripsAsIdent(codePoints));
  ident[1] = result;
  ident[4].value = newValue;
}
__name(mutateIdent, "mutateIdent");
function mutateUnit(ident, newUnit) {
  const codePoints = [];
  for (const codePoint of newUnit) {
    codePoints.push(codePoint.codePointAt(0));
  }
  const escapedCodePoints = ensureThatValueRoundTripsAsIdent(codePoints);
  if (escapedCodePoints[0] === 101) {
    insertEscapedCodePoint(escapedCodePoints, 0, escapedCodePoints[0]);
  }
  const result = String.fromCodePoint(...escapedCodePoints);
  const signCharacter = ident[4].signCharacter === "+" ? ident[4].signCharacter : "";
  const numericValue = ident[4].value.toString();
  ident[1] = `${signCharacter}${numericValue}${result}`;
  ident[4].unit = newUnit;
}
__name(mutateUnit, "mutateUnit");
function ensureThatValueRoundTripsAsIdent(codePoints) {
  let remainderStartIndex = 0;
  if (codePoints[0] === HYPHEN_MINUS && codePoints[1] === HYPHEN_MINUS) {
    remainderStartIndex = 2;
  } else if (codePoints[0] === HYPHEN_MINUS && codePoints[1]) {
    remainderStartIndex = 2;
    if (!isIdentStartCodePoint(codePoints[1])) {
      remainderStartIndex += insertEscapedCodePoint(codePoints, 1, codePoints[1]);
    }
  } else if (isIdentStartCodePoint(codePoints[0])) {
    remainderStartIndex = 1;
  } else {
    remainderStartIndex = 1;
    remainderStartIndex += insertEscapedCodePoint(codePoints, 0, codePoints[0]);
  }
  for (let i = remainderStartIndex; i < codePoints.length; i++) {
    if (isIdentCodePoint(codePoints[i])) {
      continue;
    }
    i += insertEscapedCodePoint(codePoints, i, codePoints[i]);
  }
  return codePoints;
}
__name(ensureThatValueRoundTripsAsIdent, "ensureThatValueRoundTripsAsIdent");
function insertEscapedCodePoint(codePoints, index, codePoint) {
  const hexRepresentation = codePoint.toString(16);
  const codePointsForHexRepresentation = [];
  for (const x of hexRepresentation) {
    codePointsForHexRepresentation.push(x.codePointAt(0));
  }
  const next = codePoints[index + 1];
  if (index === codePoints.length - 1 || next && isHexDigitCodePoint(next)) {
    codePoints.splice(
      index,
      1,
      92,
      ...codePointsForHexRepresentation,
      32
      // ` ` space
    );
    return 1 + codePointsForHexRepresentation.length;
  }
  codePoints.splice(
    index,
    1,
    92,
    ...codePointsForHexRepresentation
  );
  return codePointsForHexRepresentation.length;
}
__name(insertEscapedCodePoint, "insertEscapedCodePoint");

// src/css-tokenizer/util/type-predicates.ts
var tokenTypes = Object.values(TokenType);
function isToken(x) {
  if (!Array.isArray(x)) {
    return false;
  }
  if (x.length < 4) {
    return false;
  }
  if (!tokenTypes.includes(x[0])) {
    return false;
  }
  if (typeof x[1] !== "string") {
    return false;
  }
  if (typeof x[2] !== "number") {
    return false;
  }
  if (typeof x[3] !== "number") {
    return false;
  }
  return true;
}
__name(isToken, "isToken");
function isTokenNumeric(x) {
  if (!x) return false;
  switch (x[0]) {
    case "dimension-token" /* Dimension */:
    case "number-token" /* Number */:
    case "percentage-token" /* Percentage */:
      return true;
    default:
      return false;
  }
}
__name(isTokenNumeric, "isTokenNumeric");
function isTokenWhiteSpaceOrComment(x) {
  if (!x) return false;
  switch (x[0]) {
    case "whitespace-token" /* Whitespace */:
    case "comment" /* Comment */:
      return true;
    default:
      return false;
  }
}
__name(isTokenWhiteSpaceOrComment, "isTokenWhiteSpaceOrComment");
function isTokenAtKeyword(x) {
  return !!x && x[0] === "at-keyword-token" /* AtKeyword */;
}
__name(isTokenAtKeyword, "isTokenAtKeyword");
function isTokenBadString(x) {
  return !!x && x[0] === "bad-string-token" /* BadString */;
}
__name(isTokenBadString, "isTokenBadString");
function isTokenBadURL(x) {
  return !!x && x[0] === "bad-url-token" /* BadURL */;
}
__name(isTokenBadURL, "isTokenBadURL");
function isTokenCDC(x) {
  return !!x && x[0] === "CDC-token" /* CDC */;
}
__name(isTokenCDC, "isTokenCDC");
function isTokenCDO(x) {
  return !!x && x[0] === "CDO-token" /* CDO */;
}
__name(isTokenCDO, "isTokenCDO");
function isTokenColon(x) {
  return !!x && x[0] === "colon-token" /* Colon */;
}
__name(isTokenColon, "isTokenColon");
function isTokenComma(x) {
  return !!x && x[0] === "comma-token" /* Comma */;
}
__name(isTokenComma, "isTokenComma");
function isTokenComment(x) {
  return !!x && x[0] === "comment" /* Comment */;
}
__name(isTokenComment, "isTokenComment");
function isTokenDelim(x) {
  return !!x && x[0] === "delim-token" /* Delim */;
}
__name(isTokenDelim, "isTokenDelim");
function isTokenDimension(x) {
  return !!x && x[0] === "dimension-token" /* Dimension */;
}
__name(isTokenDimension, "isTokenDimension");
function isTokenEOF(x) {
  return !!x && x[0] === "EOF-token" /* EOF */;
}
__name(isTokenEOF, "isTokenEOF");
function isTokenFunction(x) {
  return !!x && x[0] === "function-token" /* Function */;
}
__name(isTokenFunction, "isTokenFunction");
function isTokenHash(x) {
  return !!x && x[0] === "hash-token" /* Hash */;
}
__name(isTokenHash, "isTokenHash");
function isTokenIdent(x) {
  return !!x && x[0] === "ident-token" /* Ident */;
}
__name(isTokenIdent, "isTokenIdent");
function isTokenNumber(x) {
  return !!x && x[0] === "number-token" /* Number */;
}
__name(isTokenNumber, "isTokenNumber");
function isTokenPercentage(x) {
  return !!x && x[0] === "percentage-token" /* Percentage */;
}
__name(isTokenPercentage, "isTokenPercentage");
function isTokenSemicolon(x) {
  return !!x && x[0] === "semicolon-token" /* Semicolon */;
}
__name(isTokenSemicolon, "isTokenSemicolon");
function isTokenString(x) {
  return !!x && x[0] === "string-token" /* String */;
}
__name(isTokenString, "isTokenString");
function isTokenURL(x) {
  return !!x && x[0] === "url-token" /* URL */;
}
__name(isTokenURL, "isTokenURL");
function isTokenWhitespace(x) {
  return !!x && x[0] === "whitespace-token" /* Whitespace */;
}
__name(isTokenWhitespace, "isTokenWhitespace");
function isTokenOpenParen(x) {
  return !!x && x[0] === "(-token" /* OpenParen */;
}
__name(isTokenOpenParen, "isTokenOpenParen");
function isTokenCloseParen(x) {
  return !!x && x[0] === ")-token" /* CloseParen */;
}
__name(isTokenCloseParen, "isTokenCloseParen");
function isTokenOpenSquare(x) {
  return !!x && x[0] === "[-token" /* OpenSquare */;
}
__name(isTokenOpenSquare, "isTokenOpenSquare");
function isTokenCloseSquare(x) {
  return !!x && x[0] === "]-token" /* CloseSquare */;
}
__name(isTokenCloseSquare, "isTokenCloseSquare");
function isTokenOpenCurly(x) {
  return !!x && x[0] === "{-token" /* OpenCurly */;
}
__name(isTokenOpenCurly, "isTokenOpenCurly");
function isTokenCloseCurly(x) {
  return !!x && x[0] === "}-token" /* CloseCurly */;
}
__name(isTokenCloseCurly, "isTokenCloseCurly");
function isTokenUnicodeRange(x) {
  return !!x && x[0] === "unicode-range-token" /* UnicodeRange */;
}
__name(isTokenUnicodeRange, "isTokenUnicodeRange");
export {
  HashType,
  NumberType,
  ParseError,
  ParseErrorMessage,
  ParseErrorWithToken,
  TokenType,
  cloneTokens,
  isToken,
  isTokenAtKeyword,
  isTokenBadString,
  isTokenBadURL,
  isTokenCDC,
  isTokenCDO,
  isTokenCloseCurly,
  isTokenCloseParen,
  isTokenCloseSquare,
  isTokenColon,
  isTokenComma,
  isTokenComment,
  isTokenDelim,
  isTokenDimension,
  isTokenEOF,
  isTokenFunction,
  isTokenHash,
  isTokenIdent,
  isTokenNumber,
  isTokenNumeric,
  isTokenOpenCurly,
  isTokenOpenParen,
  isTokenOpenSquare,
  isTokenPercentage,
  isTokenSemicolon,
  isTokenString,
  isTokenURL,
  isTokenUnicodeRange,
  isTokenWhiteSpaceOrComment,
  isTokenWhitespace,
  mirrorVariant,
  mirrorVariantType,
  mutateIdent,
  mutateUnit,
  stringify,
  tokenize,
  tokenizer
};
//# sourceMappingURL=index.mjs.map
