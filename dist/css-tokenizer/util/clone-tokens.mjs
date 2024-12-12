var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/css-tokenizer/util/clone-tokens.ts
var supportsStructuredClone = typeof globalThis !== "undefined" && "structuredClone" in globalThis;
function cloneTokens(tokens) {
  if (supportsStructuredClone) {
    return structuredClone(tokens);
  }
  return JSON.parse(JSON.stringify(tokens));
}
__name(cloneTokens, "cloneTokens");
export {
  cloneTokens
};
//# sourceMappingURL=clone-tokens.mjs.map
