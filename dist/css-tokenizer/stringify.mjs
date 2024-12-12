var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/css-tokenizer/stringify.ts
function stringify(...tokens) {
  let buffer = "";
  for (let i = 0; i < tokens.length; i++) {
    buffer = buffer + tokens[i][1];
  }
  return buffer;
}
__name(stringify, "stringify");
export {
  stringify
};
//# sourceMappingURL=stringify.mjs.map
