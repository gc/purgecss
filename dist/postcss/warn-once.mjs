var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/postcss/warn-once.js
var printed = {};
function warnOnce(message) {
  if (printed[message])
    return;
  printed[message] = true;
  if (typeof console !== "undefined" && console.warn) {
    console.warn(message);
  }
}
__name(warnOnce, "warnOnce");
export {
  warnOnce
};
//# sourceMappingURL=warn-once.mjs.map
