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
  isTokenWhitespace
};
//# sourceMappingURL=type-predicates.mjs.map
