var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/css-tokenizer/code-points/code-points.ts
var ASTERISK = 42;
var SOLIDUS = 47;

// src/css-tokenizer/checks/two-code-points-start-comment.ts
function checkIfTwoCodePointsStartAComment(reader) {
  return reader.source.codePointAt(reader.cursor) === SOLIDUS && reader.source.codePointAt(reader.cursor + 1) === ASTERISK;
}
__name(checkIfTwoCodePointsStartAComment, "checkIfTwoCodePointsStartAComment");
export {
  checkIfTwoCodePointsStartAComment
};
//# sourceMappingURL=two-code-points-start-comment.mjs.map
