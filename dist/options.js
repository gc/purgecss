var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/options.ts
var defaultOptions = {
  css: [],
  content: [],
  defaultExtractor: /* @__PURE__ */ __name((content) => content.match(/[A-Za-z0-9_-]+/g) || [], "defaultExtractor"),
  extractors: [],
  fontFace: false,
  keyframes: false,
  rejected: false,
  rejectedCss: false,
  sourceMap: false,
  stdin: false,
  stdout: false,
  variables: false,
  safelist: {
    standard: [],
    deep: [],
    greedy: [],
    variables: [],
    keyframes: []
  },
  blocklist: [],
  skippedContentGlobs: [],
  dynamicAttributes: []
};
export {
  defaultOptions
};
//# sourceMappingURL=options.js.map
