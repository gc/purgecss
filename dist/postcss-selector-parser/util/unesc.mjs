var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/postcss-selector-parser/util/unesc.js
function gobbleHex(str) {
  const lower = str.toLowerCase();
  let hex = "";
  let spaceTerminated = false;
  for (let i = 0; i < 6 && lower[i] !== void 0; i++) {
    const code = lower.charCodeAt(i);
    const valid = code >= 97 && code <= 102 || code >= 48 && code <= 57;
    spaceTerminated = code === 32;
    if (!valid) {
      break;
    }
    hex += lower[i];
  }
  if (hex.length === 0) {
    return void 0;
  }
  const codePoint = parseInt(hex, 16);
  const isSurrogate = codePoint >= 55296 && codePoint <= 57343;
  if (isSurrogate || codePoint === 0 || codePoint > 1114111) {
    return ["\uFFFD", hex.length + (spaceTerminated ? 1 : 0)];
  }
  return [
    String.fromCodePoint(codePoint),
    hex.length + (spaceTerminated ? 1 : 0)
  ];
}
__name(gobbleHex, "gobbleHex");
var CONTAINS_ESCAPE = /\\/;
function unesc(str) {
  let needToProcess = CONTAINS_ESCAPE.test(str);
  if (!needToProcess) {
    return str;
  }
  let ret = "";
  for (let i = 0; i < str.length; i++) {
    if (str[i] === "\\") {
      const gobbled = gobbleHex(str.slice(i + 1, i + 7));
      if (gobbled !== void 0) {
        ret += gobbled[0];
        i += gobbled[1];
        continue;
      }
      if (str[i + 1] === "\\") {
        ret += "\\";
        i++;
        continue;
      }
      if (str.length === i + 1) {
        ret += str[i];
      }
      continue;
    }
    ret += str[i];
  }
  return ret;
}
__name(unesc, "unesc");
export {
  unesc as default
};
//# sourceMappingURL=unesc.mjs.map
