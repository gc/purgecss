var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/css-tokenizer/code-points/code-points.ts
var CARRIAGE_RETURN = 13;
var CHARACTER_TABULATION = 9;
var FORM_FEED = 12;
var LINE_FEED = 10;
var SPACE = 32;

// src/css-tokenizer/code-points/ranges.ts
function isWhitespace(search) {
  return search === SPACE || search === LINE_FEED || search === CHARACTER_TABULATION || search === CARRIAGE_RETURN || search === FORM_FEED;
}
__name(isWhitespace, "isWhitespace");

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
export {
  consumeWhiteSpace
};
//# sourceMappingURL=whitespace-token.mjs.map
