var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/postcss-selector-parser/util/getProp.js
function getProp(obj, ...props) {
  while (props.length > 0) {
    const prop = props.shift();
    if (!obj[prop]) {
      return void 0;
    }
    obj = obj[prop];
  }
  return obj;
}
__name(getProp, "getProp");
export {
  getProp as default
};
//# sourceMappingURL=getProp.mjs.map
