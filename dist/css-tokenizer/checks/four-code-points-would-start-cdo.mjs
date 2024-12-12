var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/css-tokenizer/code-points/code-points.ts
var EXCLAMATION_MARK = 33;
var HYPHEN_MINUS = 45;
var LESS_THAN_SIGN = 60;

// src/css-tokenizer/checks/four-code-points-would-start-cdo.ts
function checkIfFourCodePointsWouldStartCDO(reader) {
  return reader.source.codePointAt(reader.cursor) === LESS_THAN_SIGN && reader.source.codePointAt(reader.cursor + 1) === EXCLAMATION_MARK && reader.source.codePointAt(reader.cursor + 2) === HYPHEN_MINUS && reader.source.codePointAt(reader.cursor + 3) === HYPHEN_MINUS;
}
__name(checkIfFourCodePointsWouldStartCDO, "checkIfFourCodePointsWouldStartCDO");
export {
  checkIfFourCodePointsWouldStartCDO
};
//# sourceMappingURL=four-code-points-would-start-cdo.mjs.map
