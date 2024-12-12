var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/css-tokenizer/code-points/code-points.ts
var GREATER_THAN_SIGN = 62;
var HYPHEN_MINUS = 45;

// src/css-tokenizer/checks/three-code-points-would-start-cdc.ts
function checkIfThreeCodePointsWouldStartCDC(reader) {
  return reader.source.codePointAt(reader.cursor) === HYPHEN_MINUS && reader.source.codePointAt(reader.cursor + 1) === HYPHEN_MINUS && reader.source.codePointAt(reader.cursor + 2) === GREATER_THAN_SIGN;
}
__name(checkIfThreeCodePointsWouldStartCDC, "checkIfThreeCodePointsWouldStartCDC");
export {
  checkIfThreeCodePointsWouldStartCDC
};
//# sourceMappingURL=three-code-points-would-start-cdc.mjs.map
