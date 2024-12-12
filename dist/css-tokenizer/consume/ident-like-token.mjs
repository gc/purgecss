var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/css-tokenizer/code-points/code-points.ts
var APOSTROPHE = 39;
var BACKSPACE = 8;
var CARRIAGE_RETURN = 13;
var CHARACTER_TABULATION = 9;
var DELETE = 127;
var FORM_FEED = 12;
var HYPHEN_MINUS = 45;
var INFORMATION_SEPARATOR_ONE = 31;
var LEFT_PARENTHESIS = 40;
var LINE_FEED = 10;
var LINE_TABULATION = 11;
var LOW_LINE = 95;
var MAXIMUM_ALLOWED_CODEPOINT = 1114111;
var NULL = 0;
var QUOTATION_MARK = 34;
var REPLACEMENT_CHARACTER = 65533;
var REVERSE_SOLIDUS = 92;
var RIGHT_PARENTHESIS = 41;
var SHIFT_OUT = 14;
var SPACE = 32;
var LATIN_SMALL_LETTER_U = 117;
var LATIN_CAPITAL_LETTER_U = 85;
var LATIN_SMALL_LETTER_R = 114;
var LATIN_CAPITAL_LETTER_R = 82;
var LATIN_SMALL_LETTER_L = 108;
var LATIN_CAPITAL_LETTER_L = 76;

// src/css-tokenizer/checks/matches-url-ident.ts
function checkIfCodePointsMatchURLIdent(codePoints) {
  return codePoints.length === 3 && (codePoints[0] === LATIN_SMALL_LETTER_U || codePoints[0] === LATIN_CAPITAL_LETTER_U) && (codePoints[1] === LATIN_SMALL_LETTER_R || codePoints[1] === LATIN_CAPITAL_LETTER_R) && (codePoints[2] === LATIN_SMALL_LETTER_L || codePoints[2] === LATIN_CAPITAL_LETTER_L);
}
__name(checkIfCodePointsMatchURLIdent, "checkIfCodePointsMatchURLIdent");

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
export {
  consumeIdentLikeToken
};
//# sourceMappingURL=ident-like-token.mjs.map
