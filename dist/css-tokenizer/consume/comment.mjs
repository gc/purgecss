var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/css-tokenizer/code-points/code-points.ts
var ASTERISK = 42;
var SOLIDUS = 47;

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
export {
  consumeComment
};
//# sourceMappingURL=comment.mjs.map
