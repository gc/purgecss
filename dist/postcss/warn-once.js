var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/postcss/warn-once.js
var require_warn_once = __commonJS({
  "src/postcss/warn-once.js"(exports, module) {
    var printed = {};
    module.exports = /* @__PURE__ */ __name(function warnOnce(message) {
      if (printed[message]) return;
      printed[message] = true;
      if (typeof console !== "undefined" && console.warn) {
        console.warn(message);
      }
    }, "warnOnce");
  }
});
export default require_warn_once();
//# sourceMappingURL=warn-once.js.map
