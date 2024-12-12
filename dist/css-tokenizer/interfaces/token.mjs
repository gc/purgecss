var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

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
export {
  HashType,
  NumberType,
  TokenType,
  mirrorVariant,
  mirrorVariantType
};
//# sourceMappingURL=token.mjs.map
