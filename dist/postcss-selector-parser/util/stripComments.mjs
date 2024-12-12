var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/postcss-selector-parser/util/stripComments.js
function stripComments(str) {
  let s = "";
  let commentStart = str.indexOf("/*");
  let lastEnd = 0;
  while (commentStart >= 0) {
    s = s + str.slice(lastEnd, commentStart);
    let commentEnd = str.indexOf("*/", commentStart + 2);
    if (commentEnd < 0) {
      return s;
    }
    lastEnd = commentEnd + 2;
    commentStart = str.indexOf("/*", lastEnd);
  }
  s = s + str.slice(lastEnd);
  return s;
}
__name(stripComments, "stripComments");
export {
  stripComments as default
};
//# sourceMappingURL=stripComments.mjs.map
