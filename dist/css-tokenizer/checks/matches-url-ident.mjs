var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/css-tokenizer/code-points/code-points.ts
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
export {
  checkIfCodePointsMatchURLIdent
};
//# sourceMappingURL=matches-url-ident.mjs.map
