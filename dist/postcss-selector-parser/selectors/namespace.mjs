var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/cssesc/index.js
var object = {};
var hasOwnProperty = object.hasOwnProperty;
var merge = /* @__PURE__ */ __name((options, defaults) => {
  if (!options) {
    return defaults;
  }
  const result = {};
  for (const key in defaults) {
    result[key] = hasOwnProperty.call(options, key) ? options[key] : defaults[key];
  }
  return result;
}, "merge");
var regexAnySingleEscape = /<%= anySingleEscape %>/;
var regexSingleEscape = /<%= singleEscapes %>/;
var regexExcessiveSpaces = /(^|\\+)?(\\[A-F0-9]{1,6})\x20(?![a-fA-F0-9\x20])/g;
var cssesc = /* @__PURE__ */ __name(/* @__NO_SIDE_EFFECTS__ */ (string, options) => {
  options = merge(options, cssesc.options);
  if (options.quotes != "single" && options.quotes != "double") {
    options.quotes = "single";
  }
  const quote = options.quotes == "double" ? '"' : "'";
  const isIdentifier = options.isIdentifier;
  const firstChar = string.charAt(0);
  let output = "";
  let counter = 0;
  const length = string.length;
  while (counter < length) {
    const character = string.charAt(counter++);
    let codePoint = character.charCodeAt();
    let value;
    if (codePoint < 32 || codePoint > 126) {
      if (codePoint >= 55296 && codePoint <= 56319 && counter < length) {
        const extra = string.charCodeAt(counter++);
        if ((extra & 64512) == 56320) {
          codePoint = ((codePoint & 1023) << 10) + (extra & 1023) + 65536;
        } else {
          counter--;
        }
      }
      value = "\\" + codePoint.toString(16).toUpperCase() + " ";
    } else {
      if (options.escapeEverything) {
        if (regexAnySingleEscape.test(character)) {
          value = "\\" + character;
        } else {
          value = "\\" + codePoint.toString(16).toUpperCase() + " ";
        }
      } else if (/[\t\n\f\r\x0B]/.test(character)) {
        value = "\\" + codePoint.toString(16).toUpperCase() + " ";
      } else if (character == "\\" || !isIdentifier && (character == '"' && quote == character || character == "'" && quote == character) || isIdentifier && regexSingleEscape.test(character)) {
        value = "\\" + character;
      } else {
        value = character;
      }
    }
    output += value;
  }
  if (isIdentifier) {
    if (/^-[-\d]/.test(output)) {
      output = "\\-" + output.slice(1);
    } else if (/\d/.test(firstChar)) {
      output = "\\3" + firstChar + " " + output.slice(1);
    }
  }
  output = output.replace(regexExcessiveSpaces, ($0, $1, $2) => {
    if ($1 && $1.length % 2) {
      return $0;
    }
    return ($1 || "") + $2;
  });
  if (!isIdentifier && options.wrap) {
    return quote + output + quote;
  }
  return output;
}, "cssesc");
cssesc.options = {
  "escapeEverything": false,
  "isIdentifier": false,
  "quotes": "single",
  "wrap": false
};
var cssesc_default = cssesc;

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

// src/postcss-selector-parser/selectors/namespace.js
var Namespace = class extends Node {
  static {
    __name(this, "Namespace");
  }
  get namespace() {
    return this._namespace;
  }
  set namespace(namespace) {
    if (namespace === true || namespace === "*" || namespace === "&") {
      this._namespace = namespace;
      if (this.raws) {
        delete this.raws.namespace;
      }
      return;
    }
    const escaped = cssesc_default(namespace, { isIdentifier: true });
    this._namespace = namespace;
    if (escaped !== namespace) {
      ensureObject(this, "raws");
      this.raws.namespace = escaped;
    } else if (this.raws) {
      delete this.raws.namespace;
    }
  }
  get ns() {
    return this._namespace;
  }
  set ns(namespace) {
    this.namespace = namespace;
  }
  get namespaceString() {
    if (this.namespace) {
      const ns = this.stringifyProperty("namespace");
      if (ns === true) {
        return "";
      } else {
        return ns;
      }
    } else {
      return "";
    }
  }
  qualifiedName(value) {
    if (this.namespace) {
      return `${this.namespaceString}|${value}`;
    } else {
      return value;
    }
  }
  valueToString() {
    return this.qualifiedName(super.valueToString());
  }
};
export {
  Namespace as default
};
//# sourceMappingURL=namespace.mjs.map
