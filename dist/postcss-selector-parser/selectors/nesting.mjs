var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/postcss-selector-parser/util/ensureObject.js
function ensureObject(obj, ...props) {
  while (props.length > 0) {
    const prop = props.shift();
    if (!obj[prop]) {
      obj[prop] = {};
    }
    obj = obj[prop];
  }
}
__name(ensureObject, "ensureObject");

// src/postcss-selector-parser/selectors/node.js
var cloneNode = /* @__PURE__ */ __name(function(obj, parent) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  let cloned = new obj.constructor();
  for (let i in obj) {
    if (!obj.hasOwnProperty(i)) {
      continue;
    }
    let value = obj[i];
    let type = typeof value;
    if (i === "parent" && type === "object") {
      if (parent) {
        cloned[i] = parent;
      }
    } else if (value instanceof Array) {
      cloned[i] = value.map((j) => cloneNode(j, cloned));
    } else {
      cloned[i] = cloneNode(value, cloned);
    }
  }
  return cloned;
}, "cloneNode");
var Node = class {
  static {
    __name(this, "Node");
  }
  constructor(opts = {}) {
    Object.assign(this, opts);
    this.spaces = this.spaces || {};
    this.spaces.before = this.spaces.before || "";
    this.spaces.after = this.spaces.after || "";
  }
  remove() {
    if (this.parent) {
      this.parent.removeChild(this);
    }
    this.parent = void 0;
    return this;
  }
  replaceWith() {
    if (this.parent) {
      for (let index in arguments) {
        this.parent.insertBefore(this, arguments[index]);
      }
      this.remove();
    }
    return this;
  }
  next() {
    return this.parent.at(this.parent.index(this) + 1);
  }
  prev() {
    return this.parent.at(this.parent.index(this) - 1);
  }
  clone(overrides = {}) {
    let cloned = cloneNode(this);
    for (let name in overrides) {
      cloned[name] = overrides[name];
    }
    return cloned;
  }
  /**
   * Some non-standard syntax doesn't follow normal escaping rules for css.
   * This allows non standard syntax to be appended to an existing property
   * by specifying the escaped value. By specifying the escaped value,
   * illegal characters are allowed to be directly inserted into css output.
   * @param {string} name the property to set
   * @param {any} value the unescaped value of the property
   * @param {string} valueEscaped optional. the escaped value of the property.
   */
  appendToPropertyAndEscape(name, value, valueEscaped) {
    if (!this.raws) {
      this.raws = {};
    }
    let originalValue = this[name];
    let originalEscaped = this.raws[name];
    this[name] = originalValue + value;
    if (originalEscaped || valueEscaped !== value) {
      this.raws[name] = (originalEscaped || originalValue) + valueEscaped;
    } else {
      delete this.raws[name];
    }
  }
  /**
   * Some non-standard syntax doesn't follow normal escaping rules for css.
   * This allows the escaped value to be specified directly, allowing illegal
   * characters to be directly inserted into css output.
   * @param {string} name the property to set
   * @param {any} value the unescaped value of the property
   * @param {string} valueEscaped the escaped value of the property.
   */
  setPropertyAndEscape(name, value, valueEscaped) {
    if (!this.raws) {
      this.raws = {};
    }
    this[name] = value;
    this.raws[name] = valueEscaped;
  }
  /**
   * When you want a value to passed through to CSS directly. This method
   * deletes the corresponding raw value causing the stringifier to fallback
   * to the unescaped value.
   * @param {string} name the property to set.
   * @param {any} value The value that is both escaped and unescaped.
   */
  setPropertyWithoutEscape(name, value) {
    this[name] = value;
    if (this.raws) {
      delete this.raws[name];
    }
  }
  /**
   *
   * @param {number} line The number (starting with 1)
   * @param {number} column The column number (starting with 1)
   */
  isAtPosition(line, column) {
    if (this.source && this.source.start && this.source.end) {
      if (this.source.start.line > line) {
        return false;
      }
      if (this.source.end.line < line) {
        return false;
      }
      if (this.source.start.line === line && this.source.start.column > column) {
        return false;
      }
      if (this.source.end.line === line && this.source.end.column < column) {
        return false;
      }
      return true;
    }
    return void 0;
  }
  stringifyProperty(name) {
    return this.raws && this.raws[name] || this[name];
  }
  get rawSpaceBefore() {
    let rawSpace = this.raws && this.raws.spaces && this.raws.spaces.before;
    if (rawSpace === void 0) {
      rawSpace = this.spaces && this.spaces.before;
    }
    return rawSpace || "";
  }
  set rawSpaceBefore(raw) {
    ensureObject(this, "raws", "spaces");
    this.raws.spaces.before = raw;
  }
  get rawSpaceAfter() {
    let rawSpace = this.raws && this.raws.spaces && this.raws.spaces.after;
    if (rawSpace === void 0) {
      rawSpace = this.spaces.after;
    }
    return rawSpace || "";
  }
  set rawSpaceAfter(raw) {
    ensureObject(this, "raws", "spaces");
    this.raws.spaces.after = raw;
  }
  valueToString() {
    return String(this.stringifyProperty("value"));
  }
  toString() {
    return [
      this.rawSpaceBefore,
      this.valueToString(),
      this.rawSpaceAfter
    ].join("");
  }
};

// src/postcss-selector-parser/selectors/types.js
var NESTING = "nesting";

// src/postcss-selector-parser/selectors/nesting.js
var Nesting = class extends Node {
  static {
    __name(this, "Nesting");
  }
  constructor(opts) {
    super(opts);
    this.type = NESTING;
    this.value = "&";
  }
};
export {
  Nesting as default
};
//# sourceMappingURL=nesting.mjs.map
