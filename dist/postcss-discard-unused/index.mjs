var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/postcss-selector-parser/util/unesc.js
function gobbleHex(str2) {
  const lower = str2.toLowerCase();
  let hex2 = "";
  let spaceTerminated = false;
  for (let i = 0; i < 6 && lower[i] !== void 0; i++) {
    const code = lower.charCodeAt(i);
    const valid = code >= 97 && code <= 102 || code >= 48 && code <= 57;
    spaceTerminated = code === 32;
    if (!valid) {
      break;
    }
    hex2 += lower[i];
  }
  if (hex2.length === 0) {
    return void 0;
  }
  const codePoint = parseInt(hex2, 16);
  const isSurrogate = codePoint >= 55296 && codePoint <= 57343;
  if (isSurrogate || codePoint === 0 || codePoint > 1114111) {
    return ["\uFFFD", hex2.length + (spaceTerminated ? 1 : 0)];
  }
  return [
    String.fromCodePoint(codePoint),
    hex2.length + (spaceTerminated ? 1 : 0)
  ];
}
function unesc(str2) {
  let needToProcess = CONTAINS_ESCAPE.test(str2);
  if (!needToProcess) {
    return str2;
  }
  let ret = "";
  for (let i = 0; i < str2.length; i++) {
    if (str2[i] === "\\") {
      const gobbled = gobbleHex(str2.slice(i + 1, i + 7));
      if (gobbled !== void 0) {
        ret += gobbled[0];
        i += gobbled[1];
        continue;
      }
      if (str2[i + 1] === "\\") {
        ret += "\\";
        i++;
        continue;
      }
      if (str2.length === i + 1) {
        ret += str2[i];
      }
      continue;
    }
    ret += str2[i];
  }
  return ret;
}
var CONTAINS_ESCAPE;
var init_unesc = __esm({
  "src/postcss-selector-parser/util/unesc.js"() {
    "use strict";
    __name(gobbleHex, "gobbleHex");
    CONTAINS_ESCAPE = /\\/;
    __name(unesc, "unesc");
  }
});

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
var init_getProp = __esm({
  "src/postcss-selector-parser/util/getProp.js"() {
    "use strict";
    __name(getProp, "getProp");
  }
});

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
var init_ensureObject = __esm({
  "src/postcss-selector-parser/util/ensureObject.js"() {
    "use strict";
    __name(ensureObject, "ensureObject");
  }
});

// src/postcss-selector-parser/util/stripComments.js
var init_stripComments = __esm({
  "src/postcss-selector-parser/util/stripComments.js"() {
    "use strict";
  }
});

// src/postcss-selector-parser/util/index.js
var init_util = __esm({
  "src/postcss-selector-parser/util/index.js"() {
    "use strict";
    init_unesc();
    init_getProp();
    init_ensureObject();
    init_stripComments();
  }
});

// src/postcss-selector-parser/selectors/node.js
var cloneNode, Node;
var init_node = __esm({
  "src/postcss-selector-parser/selectors/node.js"() {
    "use strict";
    init_util();
    cloneNode = /* @__PURE__ */ __name(function(obj, parent) {
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
    Node = class {
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
  }
});

// src/postcss-selector-parser/selectors/types.js
var TAG, STRING, SELECTOR, ROOT, PSEUDO, NESTING, ID, COMMENT, COMBINATOR, CLASS, ATTRIBUTE, UNIVERSAL;
var init_types = __esm({
  "src/postcss-selector-parser/selectors/types.js"() {
    "use strict";
    TAG = "tag";
    STRING = "string";
    SELECTOR = "selector";
    ROOT = "root";
    PSEUDO = "pseudo";
    NESTING = "nesting";
    ID = "id";
    COMMENT = "comment";
    COMBINATOR = "combinator";
    CLASS = "class";
    ATTRIBUTE = "attribute";
    UNIVERSAL = "universal";
  }
});

// src/postcss-selector-parser/selectors/container.js
var Container;
var init_container = __esm({
  "src/postcss-selector-parser/selectors/container.js"() {
    "use strict";
    init_node();
    init_types();
    Container = class extends Node {
      static {
        __name(this, "Container");
      }
      constructor(opts) {
        super(opts);
        if (!this.nodes) {
          this.nodes = [];
        }
      }
      append(selector2) {
        selector2.parent = this;
        this.nodes.push(selector2);
        return this;
      }
      prepend(selector2) {
        selector2.parent = this;
        this.nodes.unshift(selector2);
        for (let id2 in this.indexes) {
          this.indexes[id2]++;
        }
        return this;
      }
      at(index) {
        return this.nodes[index];
      }
      index(child) {
        if (typeof child === "number") {
          return child;
        }
        return this.nodes.indexOf(child);
      }
      get first() {
        return this.at(0);
      }
      get last() {
        return this.at(this.length - 1);
      }
      get length() {
        return this.nodes.length;
      }
      removeChild(child) {
        child = this.index(child);
        this.at(child).parent = void 0;
        this.nodes.splice(child, 1);
        let index;
        for (let id2 in this.indexes) {
          index = this.indexes[id2];
          if (index >= child) {
            this.indexes[id2] = index - 1;
          }
        }
        return this;
      }
      removeAll() {
        for (let node of this.nodes) {
          node.parent = void 0;
        }
        this.nodes = [];
        return this;
      }
      empty() {
        return this.removeAll();
      }
      insertAfter(oldNode, newNode) {
        newNode.parent = this;
        let oldIndex = this.index(oldNode);
        this.nodes.splice(oldIndex + 1, 0, newNode);
        newNode.parent = this;
        let index;
        for (let id2 in this.indexes) {
          index = this.indexes[id2];
          if (oldIndex < index) {
            this.indexes[id2] = index + 1;
          }
        }
        return this;
      }
      insertBefore(oldNode, newNode) {
        newNode.parent = this;
        let oldIndex = this.index(oldNode);
        this.nodes.splice(oldIndex, 0, newNode);
        newNode.parent = this;
        let index;
        for (let id2 in this.indexes) {
          index = this.indexes[id2];
          if (index >= oldIndex) {
            this.indexes[id2] = index + 1;
          }
        }
        return this;
      }
      _findChildAtPosition(line, col) {
        let found = void 0;
        this.each((node) => {
          if (node.atPosition) {
            let foundChild = node.atPosition(line, col);
            if (foundChild) {
              found = foundChild;
              return false;
            }
          } else if (node.isAtPosition(line, col)) {
            found = node;
            return false;
          }
        });
        return found;
      }
      /**
       * Return the most specific node at the line and column number given.
       * The source location is based on the original parsed location, locations aren't
       * updated as selector nodes are mutated.
       * 
       * Note that this location is relative to the location of the first character
       * of the selector, and not the location of the selector in the overall document
       * when used in conjunction with postcss.
       *
       * If not found, returns undefined.
       * @param {number} line The line number of the node to find. (1-based index)
       * @param {number} col  The column number of the node to find. (1-based index)
       */
      atPosition(line, col) {
        if (this.isAtPosition(line, col)) {
          return this._findChildAtPosition(line, col) || this;
        } else {
          return void 0;
        }
      }
      _inferEndPosition() {
        if (this.last && this.last.source && this.last.source.end) {
          this.source = this.source || {};
          this.source.end = this.source.end || {};
          Object.assign(this.source.end, this.last.source.end);
        }
      }
      each(callback) {
        if (!this.lastEach) {
          this.lastEach = 0;
        }
        if (!this.indexes) {
          this.indexes = {};
        }
        this.lastEach++;
        let id2 = this.lastEach;
        this.indexes[id2] = 0;
        if (!this.length) {
          return void 0;
        }
        let index, result;
        while (this.indexes[id2] < this.length) {
          index = this.indexes[id2];
          result = callback(this.at(index), index);
          if (result === false) {
            break;
          }
          this.indexes[id2] += 1;
        }
        delete this.indexes[id2];
        if (result === false) {
          return false;
        }
      }
      walk(callback) {
        return this.each((node, i) => {
          let result = callback(node, i);
          if (result !== false && node.length) {
            result = node.walk(callback);
          }
          if (result === false) {
            return false;
          }
        });
      }
      walkAttributes(callback) {
        return this.walk((selector2) => {
          if (selector2.type === ATTRIBUTE) {
            return callback.call(this, selector2);
          }
        });
      }
      walkClasses(callback) {
        return this.walk((selector2) => {
          if (selector2.type === CLASS) {
            return callback.call(this, selector2);
          }
        });
      }
      walkCombinators(callback) {
        return this.walk((selector2) => {
          if (selector2.type === COMBINATOR) {
            return callback.call(this, selector2);
          }
        });
      }
      walkComments(callback) {
        return this.walk((selector2) => {
          if (selector2.type === COMMENT) {
            return callback.call(this, selector2);
          }
        });
      }
      walkIds(callback) {
        return this.walk((selector2) => {
          if (selector2.type === ID) {
            return callback.call(this, selector2);
          }
        });
      }
      walkNesting(callback) {
        return this.walk((selector2) => {
          if (selector2.type === NESTING) {
            return callback.call(this, selector2);
          }
        });
      }
      walkPseudos(callback) {
        return this.walk((selector2) => {
          if (selector2.type === PSEUDO) {
            return callback.call(this, selector2);
          }
        });
      }
      walkTags(callback) {
        return this.walk((selector2) => {
          if (selector2.type === TAG) {
            return callback.call(this, selector2);
          }
        });
      }
      walkUniversals(callback) {
        return this.walk((selector2) => {
          if (selector2.type === UNIVERSAL) {
            return callback.call(this, selector2);
          }
        });
      }
      split(callback) {
        let current = [];
        return this.reduce((memo, node, index) => {
          let split = callback.call(this, node);
          current.push(node);
          if (split) {
            memo.push(current);
            current = [];
          } else if (index === this.length - 1) {
            memo.push(current);
          }
          return memo;
        }, []);
      }
      map(callback) {
        return this.nodes.map(callback);
      }
      reduce(callback, memo) {
        return this.nodes.reduce(callback, memo);
      }
      every(callback) {
        return this.nodes.every(callback);
      }
      some(callback) {
        return this.nodes.some(callback);
      }
      filter(callback) {
        return this.nodes.filter(callback);
      }
      sort(callback) {
        return this.nodes.sort(callback);
      }
      toString() {
        return this.map(String).join("");
      }
    };
  }
});

// src/postcss-selector-parser/selectors/root.js
var Root;
var init_root = __esm({
  "src/postcss-selector-parser/selectors/root.js"() {
    "use strict";
    init_container();
    init_types();
    Root = class extends Container {
      static {
        __name(this, "Root");
      }
      constructor(opts) {
        super(opts);
        this.type = ROOT;
      }
      toString() {
        let str2 = this.reduce((memo, selector2) => {
          memo.push(String(selector2));
          return memo;
        }, []).join(",");
        return this.trailingComma ? str2 + "," : str2;
      }
      error(message, options) {
        if (this._error) {
          return this._error(message, options);
        } else {
          return new Error(message);
        }
      }
      set errorGenerator(handler) {
        this._error = handler;
      }
    };
  }
});

// src/postcss-selector-parser/selectors/selector.js
var Selector;
var init_selector = __esm({
  "src/postcss-selector-parser/selectors/selector.js"() {
    "use strict";
    init_container();
    init_types();
    Selector = class extends Container {
      static {
        __name(this, "Selector");
      }
      constructor(opts) {
        super(opts);
        this.type = SELECTOR;
      }
    };
  }
});

// src/cssesc/index.js
var object, hasOwnProperty, merge, regexAnySingleEscape, regexSingleEscape, regexExcessiveSpaces, cssesc, cssesc_default;
var init_cssesc = __esm({
  "src/cssesc/index.js"() {
    "use strict";
    object = {};
    hasOwnProperty = object.hasOwnProperty;
    merge = /* @__PURE__ */ __name((options, defaults) => {
      if (!options) {
        return defaults;
      }
      const result = {};
      for (const key in defaults) {
        result[key] = hasOwnProperty.call(options, key) ? options[key] : defaults[key];
      }
      return result;
    }, "merge");
    regexAnySingleEscape = /<%= anySingleEscape %>/;
    regexSingleEscape = /<%= singleEscapes %>/;
    regexExcessiveSpaces = /(^|\\+)?(\\[A-F0-9]{1,6})\x20(?![a-fA-F0-9\x20])/g;
    cssesc = /* @__PURE__ */ __name(/* @__NO_SIDE_EFFECTS__ */ (string2, options) => {
      options = merge(options, cssesc.options);
      if (options.quotes != "single" && options.quotes != "double") {
        options.quotes = "single";
      }
      const quote = options.quotes == "double" ? '"' : "'";
      const isIdentifier2 = options.isIdentifier;
      const firstChar = string2.charAt(0);
      let output = "";
      let counter = 0;
      const length = string2.length;
      while (counter < length) {
        const character = string2.charAt(counter++);
        let codePoint = character.charCodeAt();
        let value;
        if (codePoint < 32 || codePoint > 126) {
          if (codePoint >= 55296 && codePoint <= 56319 && counter < length) {
            const extra = string2.charCodeAt(counter++);
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
          } else if (character == "\\" || !isIdentifier2 && (character == '"' && quote == character || character == "'" && quote == character) || isIdentifier2 && regexSingleEscape.test(character)) {
            value = "\\" + character;
          } else {
            value = character;
          }
        }
        output += value;
      }
      if (isIdentifier2) {
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
      if (!isIdentifier2 && options.wrap) {
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
    cssesc_default = cssesc;
  }
});

// src/postcss-selector-parser/selectors/className.js
var ClassName;
var init_className = __esm({
  "src/postcss-selector-parser/selectors/className.js"() {
    "use strict";
    init_cssesc();
    init_util();
    init_node();
    init_types();
    ClassName = class extends Node {
      static {
        __name(this, "ClassName");
      }
      constructor(opts) {
        super(opts);
        this.type = CLASS;
        this._constructed = true;
      }
      set value(v) {
        if (this._constructed) {
          const escaped = cssesc_default(v, { isIdentifier: true });
          if (escaped !== v) {
            ensureObject(this, "raws");
            this.raws.value = escaped;
          } else if (this.raws) {
            delete this.raws.value;
          }
        }
        this._value = v;
      }
      get value() {
        return this._value;
      }
      valueToString() {
        return "." + super.valueToString();
      }
    };
  }
});

// src/postcss-selector-parser/selectors/comment.js
var Comment;
var init_comment = __esm({
  "src/postcss-selector-parser/selectors/comment.js"() {
    "use strict";
    init_node();
    init_types();
    Comment = class extends Node {
      static {
        __name(this, "Comment");
      }
      constructor(opts) {
        super(opts);
        this.type = COMMENT;
      }
    };
  }
});

// src/postcss-selector-parser/selectors/id.js
var ID2;
var init_id = __esm({
  "src/postcss-selector-parser/selectors/id.js"() {
    "use strict";
    init_node();
    init_types();
    ID2 = class extends Node {
      static {
        __name(this, "ID");
      }
      constructor(opts) {
        super(opts);
        this.type = ID;
      }
      valueToString() {
        return "#" + super.valueToString();
      }
    };
  }
});

// src/postcss-selector-parser/selectors/namespace.js
var Namespace;
var init_namespace = __esm({
  "src/postcss-selector-parser/selectors/namespace.js"() {
    "use strict";
    init_cssesc();
    init_util();
    init_node();
    Namespace = class extends Node {
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
  }
});

// src/postcss-selector-parser/selectors/tag.js
var Tag;
var init_tag = __esm({
  "src/postcss-selector-parser/selectors/tag.js"() {
    "use strict";
    init_namespace();
    init_types();
    Tag = class extends Namespace {
      static {
        __name(this, "Tag");
      }
      constructor(opts) {
        super(opts);
        this.type = TAG;
      }
    };
  }
});

// src/postcss-selector-parser/selectors/string.js
var String2;
var init_string = __esm({
  "src/postcss-selector-parser/selectors/string.js"() {
    "use strict";
    init_node();
    init_types();
    String2 = class extends Node {
      static {
        __name(this, "String");
      }
      constructor(opts) {
        super(opts);
        this.type = STRING;
      }
    };
  }
});

// src/postcss-selector-parser/selectors/pseudo.js
var Pseudo;
var init_pseudo = __esm({
  "src/postcss-selector-parser/selectors/pseudo.js"() {
    "use strict";
    init_container();
    init_types();
    Pseudo = class extends Container {
      static {
        __name(this, "Pseudo");
      }
      constructor(opts) {
        super(opts);
        this.type = PSEUDO;
      }
      toString() {
        let params = this.length ? "(" + this.map(String).join(",") + ")" : "";
        return [
          this.rawSpaceBefore,
          this.stringifyProperty("value"),
          params,
          this.rawSpaceAfter
        ].join("");
      }
    };
  }
});

// src/postcss-selector-parser/selectors/attribute.js
function unescapeValue(value) {
  let deprecatedUsage = false;
  let quoteMark = null;
  let unescaped = value;
  const m = unescaped.match(WRAPPED_IN_QUOTES);
  if (m) {
    quoteMark = m[1];
    unescaped = m[2];
  }
  unescaped = unesc(unescaped);
  if (unescaped !== value) {
    deprecatedUsage = true;
  }
  return {
    deprecatedUsage,
    unescaped,
    quoteMark
  };
}
function handleDeprecatedContructorOpts(opts) {
  if (opts.quoteMark !== void 0) {
    return opts;
  }
  if (opts.value === void 0) {
    return opts;
  }
  warnOfDeprecatedConstructor();
  const { quoteMark, unescaped } = unescapeValue(opts.value);
  if (!opts.raws) {
    opts.raws = {};
  }
  if (opts.raws.value === void 0) {
    opts.raws.value = opts.value;
  }
  opts.value = unescaped;
  opts.quoteMark = quoteMark;
  return opts;
}
function defaultAttrConcat(attrValue, attrSpaces) {
  return `${attrSpaces.before}${attrValue}${attrSpaces.after}`;
}
var WRAPPED_IN_QUOTES, Attribute, CSSESC_QUOTE_OPTIONS;
var init_attribute = __esm({
  "src/postcss-selector-parser/selectors/attribute.js"() {
    "use strict";
    init_cssesc();
    init_unesc();
    init_namespace();
    init_types();
    WRAPPED_IN_QUOTES = /^('|")([^]*)\1$/;
    __name(unescapeValue, "unescapeValue");
    __name(handleDeprecatedContructorOpts, "handleDeprecatedContructorOpts");
    Attribute = class _Attribute extends Namespace {
      static {
        __name(this, "Attribute");
      }
      static NO_QUOTE = null;
      static SINGLE_QUOTE = "'";
      static DOUBLE_QUOTE = '"';
      constructor(opts = {}) {
        super(handleDeprecatedContructorOpts(opts));
        this.type = ATTRIBUTE;
        this.raws = this.raws || {};
        this._constructed = true;
      }
      /**
       * Returns the Attribute's value quoted such that it would be legal to use
       * in the value of a css file. The original value's quotation setting
       * used for stringification is left unchanged. See `setValue(value, options)`
       * if you want to control the quote settings of a new value for the attribute.
       *
       * You can also change the quotation used for the current value by setting quoteMark.
       *
       * Options:
       *   * quoteMark {'"' | "'" | null} - Use this value to quote the value. If this
       *     option is not set, the original value for quoteMark will be used. If
       *     indeterminate, a double quote is used. The legal values are:
       *     * `null` - the value will be unquoted and characters will be escaped as necessary.
       *     * `'` - the value will be quoted with a single quote and single quotes are escaped.
       *     * `"` - the value will be quoted with a double quote and double quotes are escaped.
       *   * preferCurrentQuoteMark {boolean} - if true, prefer the source quote mark
       *     over the quoteMark option value.
       *   * smart {boolean} - if true, will select a quote mark based on the value
       *     and the other options specified here. See the `smartQuoteMark()`
       *     method.
       **/
      getQuotedValue(options = {}) {
        const quoteMark = this._determineQuoteMark(options);
        const cssescopts = CSSESC_QUOTE_OPTIONS[quoteMark];
        const escaped = cssesc_default(this._value, cssescopts);
        return escaped;
      }
      _determineQuoteMark(options) {
        return options.smart ? this.smartQuoteMark(options) : this.preferredQuoteMark(options);
      }
      /**
       * Set the unescaped value with the specified quotation options. The value
       * provided must not include any wrapping quote marks -- those quotes will
       * be interpreted as part of the value and escaped accordingly.
       */
      setValue(value, options = {}) {
        this._value = value;
        this._quoteMark = this._determineQuoteMark(options);
        this._syncRawValue();
      }
      /**
       * Intelligently select a quoteMark value based on the value's contents. If
       * the value is a legal CSS ident, it will not be quoted. Otherwise a quote
       * mark will be picked that minimizes the number of escapes.
       *
       * If there's no clear winner, the quote mark from these options is used,
       * then the source quote mark (this is inverted if `preferCurrentQuoteMark` is
       * true). If the quoteMark is unspecified, a double quote is used.
       *
       * @param options This takes the quoteMark and preferCurrentQuoteMark options
       * from the quoteValue method.
       */
      smartQuoteMark(options) {
        const v = this.value;
        const numSingleQuotes = v.replace(/[^']/g, "").length;
        const numDoubleQuotes = v.replace(/[^"]/g, "").length;
        if (numSingleQuotes + numDoubleQuotes === 0) {
          const escaped = cssesc_default(v, { isIdentifier: true });
          if (escaped === v) {
            return _Attribute.NO_QUOTE;
          } else {
            const pref = this.preferredQuoteMark(options);
            if (pref === _Attribute.NO_QUOTE) {
              const quote = this.quoteMark || options.quoteMark || _Attribute.DOUBLE_QUOTE;
              const opts = CSSESC_QUOTE_OPTIONS[quote];
              const quoteValue = cssesc_default(v, opts);
              if (quoteValue.length < escaped.length) {
                return quote;
              }
            }
            return pref;
          }
        } else if (numDoubleQuotes === numSingleQuotes) {
          return this.preferredQuoteMark(options);
        } else if (numDoubleQuotes < numSingleQuotes) {
          return _Attribute.DOUBLE_QUOTE;
        } else {
          return _Attribute.SINGLE_QUOTE;
        }
      }
      /**
       * Selects the preferred quote mark based on the options and the current quote mark value.
       * If you want the quote mark to depend on the attribute value, call `smartQuoteMark(opts)`
       * instead.
       */
      preferredQuoteMark(options) {
        let quoteMark = options.preferCurrentQuoteMark ? this.quoteMark : options.quoteMark;
        if (quoteMark === void 0) {
          quoteMark = options.preferCurrentQuoteMark ? options.quoteMark : this.quoteMark;
        }
        if (quoteMark === void 0) {
          quoteMark = _Attribute.DOUBLE_QUOTE;
        }
        return quoteMark;
      }
      get quoted() {
        const qm = this.quoteMark;
        return qm === "'" || qm === '"';
      }
      set quoted(value) {
        warnOfDeprecatedQuotedAssignment();
      }
      /**
       * returns a single (`'`) or double (`"`) quote character if the value is quoted.
       * returns `null` if the value is not quoted.
       * returns `undefined` if the quotation state is unknown (this can happen when
       * the attribute is constructed without specifying a quote mark.)
       */
      get quoteMark() {
        return this._quoteMark;
      }
      /**
       * Set the quote mark to be used by this attribute's value.
       * If the quote mark changes, the raw (escaped) value at `attr.raws.value` of the attribute
       * value is updated accordingly.
       *
       * @param {"'" | '"' | null} quoteMark The quote mark or `null` if the value should be unquoted.
       */
      set quoteMark(quoteMark) {
        if (!this._constructed) {
          this._quoteMark = quoteMark;
          return;
        }
        if (this._quoteMark !== quoteMark) {
          this._quoteMark = quoteMark;
          this._syncRawValue();
        }
      }
      _syncRawValue() {
        const rawValue = cssesc_default(this._value, CSSESC_QUOTE_OPTIONS[this.quoteMark]);
        if (rawValue === this._value) {
          if (this.raws) {
            delete this.raws.value;
          }
        } else {
          this.raws.value = rawValue;
        }
      }
      get qualifiedAttribute() {
        return this.qualifiedName(this.raws.attribute || this.attribute);
      }
      get insensitiveFlag() {
        return this.insensitive ? "i" : "";
      }
      get value() {
        return this._value;
      }
      get insensitive() {
        return this._insensitive;
      }
      /**
       * Set the case insensitive flag.
       * If the case insensitive flag changes, the raw (escaped) value at `attr.raws.insensitiveFlag`
       * of the attribute is updated accordingly.
       *
       * @param {true | false} insensitive true if the attribute should match case-insensitively.
       */
      set insensitive(insensitive) {
        if (!insensitive) {
          this._insensitive = false;
          if (this.raws && (this.raws.insensitiveFlag === "I" || this.raws.insensitiveFlag === "i")) {
            this.raws.insensitiveFlag = void 0;
          }
        }
        this._insensitive = insensitive;
      }
      /**
       * Before 3.0, the value had to be set to an escaped value including any wrapped
       * quote marks. In 3.0, the semantics of `Attribute.value` changed so that the value
       * is unescaped during parsing and any quote marks are removed.
       *
       * Because the ambiguity of this semantic change, if you set `attr.value = newValue`,
       * a deprecation warning is raised when the new value contains any characters that would
       * require escaping (including if it contains wrapped quotes).
       *
       * Instead, you should call `attr.setValue(newValue, opts)` and pass options that describe
       * how the new value is quoted.
       */
      set value(v) {
        if (this._constructed) {
          const {
            deprecatedUsage,
            unescaped,
            quoteMark
          } = unescapeValue(v);
          if (deprecatedUsage) {
            warnOfDeprecatedValueAssignment();
          }
          if (unescaped === this._value && quoteMark === this._quoteMark) {
            return;
          }
          this._value = unescaped;
          this._quoteMark = quoteMark;
          this._syncRawValue();
        } else {
          this._value = v;
        }
      }
      get attribute() {
        return this._attribute;
      }
      set attribute(name) {
        this._handleEscapes("attribute", name);
        this._attribute = name;
      }
      _handleEscapes(prop, value) {
        if (this._constructed) {
          const escaped = cssesc_default(value, { isIdentifier: true });
          if (escaped !== value) {
            this.raws[prop] = escaped;
          } else {
            delete this.raws[prop];
          }
        }
      }
      _spacesFor(name) {
        const attrSpaces = { before: "", after: "" };
        const spaces = this.spaces[name] || {};
        const rawSpaces = this.raws.spaces && this.raws.spaces[name] || {};
        return Object.assign(attrSpaces, spaces, rawSpaces);
      }
      _stringFor(name, spaceName = name, concat = defaultAttrConcat) {
        const attrSpaces = this._spacesFor(spaceName);
        return concat(this.stringifyProperty(name), attrSpaces);
      }
      /**
       * returns the offset of the attribute part specified relative to the
       * start of the node of the output string.
       *
       * * "ns" - alias for "namespace"
       * * "namespace" - the namespace if it exists.
       * * "attribute" - the attribute name
       * * "attributeNS" - the start of the attribute or its namespace
       * * "operator" - the match operator of the attribute
       * * "value" - The value (string or identifier)
       * * "insensitive" - the case insensitivity flag;
       * @param part One of the possible values inside an attribute.
       * @returns -1 if the name is invalid or the value doesn't exist in this attribute.
       */
      offsetOf(name) {
        let count = 1;
        const attributeSpaces = this._spacesFor("attribute");
        count += attributeSpaces.before.length;
        if (name === "namespace" || name === "ns") {
          return this.namespace ? count : -1;
        }
        if (name === "attributeNS") {
          return count;
        }
        count += this.namespaceString.length;
        if (this.namespace) {
          count += 1;
        }
        if (name === "attribute") {
          return count;
        }
        count += this.stringifyProperty("attribute").length;
        count += attributeSpaces.after.length;
        const operatorSpaces = this._spacesFor("operator");
        count += operatorSpaces.before.length;
        const operator = this.stringifyProperty("operator");
        if (name === "operator") {
          return operator ? count : -1;
        }
        count += operator.length;
        count += operatorSpaces.after.length;
        const valueSpaces = this._spacesFor("value");
        count += valueSpaces.before.length;
        const value = this.stringifyProperty("value");
        if (name === "value") {
          return value ? count : -1;
        }
        count += value.length;
        count += valueSpaces.after.length;
        const insensitiveSpaces = this._spacesFor("insensitive");
        count += insensitiveSpaces.before.length;
        if (name === "insensitive") {
          return this.insensitive ? count : -1;
        }
        return -1;
      }
      toString() {
        const selector2 = [
          this.rawSpaceBefore,
          "["
        ];
        selector2.push(this._stringFor("qualifiedAttribute", "attribute"));
        if (this.operator && (this.value || this.value === "")) {
          selector2.push(this._stringFor("operator"));
          selector2.push(this._stringFor("value"));
          selector2.push(this._stringFor("insensitiveFlag", "insensitive", (attrValue, attrSpaces) => {
            if (attrValue.length > 0 && !this.quoted && attrSpaces.before.length === 0 && !(this.spaces.value && this.spaces.value.after)) {
              attrSpaces.before = " ";
            }
            return defaultAttrConcat(attrValue, attrSpaces);
          }));
        }
        selector2.push("]");
        selector2.push(this.rawSpaceAfter);
        return selector2.join("");
      }
    };
    CSSESC_QUOTE_OPTIONS = {
      "'": { quotes: "single", wrap: true },
      '"': { quotes: "double", wrap: true },
      [null]: { isIdentifier: true }
    };
    __name(defaultAttrConcat, "defaultAttrConcat");
  }
});

// src/postcss-selector-parser/selectors/universal.js
var Universal;
var init_universal = __esm({
  "src/postcss-selector-parser/selectors/universal.js"() {
    "use strict";
    init_namespace();
    init_types();
    Universal = class extends Namespace {
      static {
        __name(this, "Universal");
      }
      constructor(opts) {
        super(opts);
        this.type = UNIVERSAL;
        this.value = "*";
      }
    };
  }
});

// src/postcss-selector-parser/selectors/combinator.js
var Combinator;
var init_combinator = __esm({
  "src/postcss-selector-parser/selectors/combinator.js"() {
    "use strict";
    init_node();
    init_types();
    Combinator = class extends Node {
      static {
        __name(this, "Combinator");
      }
      constructor(opts) {
        super(opts);
        this.type = COMBINATOR;
      }
    };
  }
});

// src/postcss-selector-parser/selectors/nesting.js
var Nesting;
var init_nesting = __esm({
  "src/postcss-selector-parser/selectors/nesting.js"() {
    "use strict";
    init_node();
    init_types();
    Nesting = class extends Node {
      static {
        __name(this, "Nesting");
      }
      constructor(opts) {
        super(opts);
        this.type = NESTING;
        this.value = "&";
      }
    };
  }
});

// src/postcss-selector-parser/sortAscending.js
function sortAscending(list) {
  return list.sort((a, b) => a - b);
}
var init_sortAscending = __esm({
  "src/postcss-selector-parser/sortAscending.js"() {
    "use strict";
    __name(sortAscending, "sortAscending");
  }
});

// src/postcss-selector-parser/tokenTypes.js
var ampersand, asterisk, comma, colon, semicolon, openParenthesis, closeParenthesis, openSquare, closeSquare, dollar, tilde, caret, plus, equals, pipe, greaterThan, space, singleQuote, doubleQuote, slash, bang, backslash, cr, feed, newline, tab, str, comment, word, combinator;
var init_tokenTypes = __esm({
  "src/postcss-selector-parser/tokenTypes.js"() {
    "use strict";
    ampersand = 38;
    asterisk = 42;
    comma = 44;
    colon = 58;
    semicolon = 59;
    openParenthesis = 40;
    closeParenthesis = 41;
    openSquare = 91;
    closeSquare = 93;
    dollar = 36;
    tilde = 126;
    caret = 94;
    plus = 43;
    equals = 61;
    pipe = 124;
    greaterThan = 62;
    space = 32;
    singleQuote = 39;
    doubleQuote = 34;
    slash = 47;
    bang = 33;
    backslash = 92;
    cr = 13;
    feed = 12;
    newline = 10;
    tab = 9;
    str = singleQuote;
    comment = -1;
    word = -2;
    combinator = -3;
  }
});

// src/postcss-selector-parser/tokenize.js
function consumeWord(css, start) {
  let next = start;
  let code;
  do {
    code = css.charCodeAt(next);
    if (wordDelimiters[code]) {
      return next - 1;
    } else if (code === backslash) {
      next = consumeEscape(css, next) + 1;
    } else {
      next++;
    }
  } while (next < css.length);
  return next - 1;
}
function consumeEscape(css, start) {
  let next = start;
  let code = css.charCodeAt(next + 1);
  if (unescapable[code]) {
  } else if (hex[code]) {
    let hexDigits = 0;
    do {
      next++;
      hexDigits++;
      code = css.charCodeAt(next + 1);
    } while (hex[code] && hexDigits < 6);
    if (hexDigits < 6 && code === space) {
      next++;
    }
  } else {
    next++;
  }
  return next;
}
function tokenize(input) {
  const tokens = [];
  let css = input.css.valueOf();
  let { length } = css;
  let offset = -1;
  let line = 1;
  let start = 0;
  let end = 0;
  let code, content, endColumn, endLine, escaped, escapePos, last, lines, next, nextLine, nextOffset, quote, tokenType;
  function unclosed(what, fix) {
    if (input.safe) {
      css += fix;
      next = css.length - 1;
    } else {
      throw input.error("Unclosed " + what, line, start - offset, start);
    }
  }
  __name(unclosed, "unclosed");
  while (start < length) {
    code = css.charCodeAt(start);
    if (code === newline) {
      offset = start;
      line += 1;
    }
    switch (code) {
      case space:
      case tab:
      case newline:
      case cr:
      case feed:
        next = start;
        do {
          next += 1;
          code = css.charCodeAt(next);
          if (code === newline) {
            offset = next;
            line += 1;
          }
        } while (code === space || code === newline || code === tab || code === cr || code === feed);
        tokenType = space;
        endLine = line;
        endColumn = next - offset - 1;
        end = next;
        break;
      case plus:
      case greaterThan:
      case tilde:
      case pipe:
        next = start;
        do {
          next += 1;
          code = css.charCodeAt(next);
        } while (code === plus || code === greaterThan || code === tilde || code === pipe);
        tokenType = combinator;
        endLine = line;
        endColumn = start - offset;
        end = next;
        break;
      // Consume these characters as single tokens.
      case asterisk:
      case ampersand:
      case bang:
      case comma:
      case equals:
      case dollar:
      case caret:
      case openSquare:
      case closeSquare:
      case colon:
      case semicolon:
      case openParenthesis:
      case closeParenthesis:
        next = start;
        tokenType = code;
        endLine = line;
        endColumn = start - offset;
        end = next + 1;
        break;
      case singleQuote:
      case doubleQuote:
        quote = code === singleQuote ? "'" : '"';
        next = start;
        do {
          escaped = false;
          next = css.indexOf(quote, next + 1);
          if (next === -1) {
            unclosed("quote", quote);
          }
          escapePos = next;
          while (css.charCodeAt(escapePos - 1) === backslash) {
            escapePos -= 1;
            escaped = !escaped;
          }
        } while (escaped);
        tokenType = str;
        endLine = line;
        endColumn = start - offset;
        end = next + 1;
        break;
      default:
        if (code === slash && css.charCodeAt(start + 1) === asterisk) {
          next = css.indexOf("*/", start + 2) + 1;
          if (next === 0) {
            unclosed("comment", "*/");
          }
          content = css.slice(start, next + 1);
          lines = content.split("\n");
          last = lines.length - 1;
          if (last > 0) {
            nextLine = line + last;
            nextOffset = next - lines[last].length;
          } else {
            nextLine = line;
            nextOffset = offset;
          }
          tokenType = comment;
          line = nextLine;
          endLine = nextLine;
          endColumn = next - nextOffset;
        } else if (code === slash) {
          next = start;
          tokenType = code;
          endLine = line;
          endColumn = start - offset;
          end = next + 1;
        } else {
          next = consumeWord(css, start);
          tokenType = word;
          endLine = line;
          endColumn = next - offset;
        }
        end = next + 1;
        break;
    }
    tokens.push([
      tokenType,
      // [0] Token type
      line,
      // [1] Starting line
      start - offset,
      // [2] Starting column
      endLine,
      // [3] Ending line
      endColumn,
      // [4] Ending column
      start,
      // [5] Start position / Source index
      end
      // [6] End position
    ]);
    if (nextOffset) {
      offset = nextOffset;
      nextOffset = null;
    }
    start = end;
  }
  return tokens;
}
var unescapable, wordDelimiters, hex, hexChars, FIELDS;
var init_tokenize = __esm({
  "src/postcss-selector-parser/tokenize.js"() {
    "use strict";
    init_tokenTypes();
    unescapable = {
      [tab]: true,
      [newline]: true,
      [cr]: true,
      [feed]: true
    };
    wordDelimiters = {
      [space]: true,
      [tab]: true,
      [newline]: true,
      [cr]: true,
      [feed]: true,
      [ampersand]: true,
      [asterisk]: true,
      [bang]: true,
      [comma]: true,
      [colon]: true,
      [semicolon]: true,
      [openParenthesis]: true,
      [closeParenthesis]: true,
      [openSquare]: true,
      [closeSquare]: true,
      [singleQuote]: true,
      [doubleQuote]: true,
      [plus]: true,
      [pipe]: true,
      [tilde]: true,
      [greaterThan]: true,
      [equals]: true,
      [dollar]: true,
      [caret]: true,
      [slash]: true
    };
    hex = {};
    hexChars = "0123456789abcdefABCDEF";
    for (let i = 0; i < hexChars.length; i++) {
      hex[hexChars.charCodeAt(i)] = true;
    }
    __name(consumeWord, "consumeWord");
    __name(consumeEscape, "consumeEscape");
    FIELDS = {
      TYPE: 0,
      START_LINE: 1,
      START_COL: 2,
      END_LINE: 3,
      END_COL: 4,
      START_POS: 5,
      END_POS: 6
    };
    __name(tokenize, "tokenize");
  }
});

// src/postcss-selector-parser/parser.js
function tokenStart(token) {
  return {
    line: token[FIELDS.START_LINE],
    column: token[FIELDS.START_COL]
  };
}
function tokenEnd(token) {
  return {
    line: token[FIELDS.END_LINE],
    column: token[FIELDS.END_COL]
  };
}
function getSource(startLine, startColumn, endLine, endColumn) {
  return {
    start: {
      line: startLine,
      column: startColumn
    },
    end: {
      line: endLine,
      column: endColumn
    }
  };
}
function getTokenSource(token) {
  return getSource(
    token[FIELDS.START_LINE],
    token[FIELDS.START_COL],
    token[FIELDS.END_LINE],
    token[FIELDS.END_COL]
  );
}
function getTokenSourceSpan(startToken, endToken) {
  if (!startToken) {
    return void 0;
  }
  return getSource(
    startToken[FIELDS.START_LINE],
    startToken[FIELDS.START_COL],
    endToken[FIELDS.END_LINE],
    endToken[FIELDS.END_COL]
  );
}
function unescapeProp(node, prop) {
  let value = node[prop];
  if (typeof value !== "string") {
    return;
  }
  if (value.indexOf("\\") !== -1) {
    ensureObject(node, "raws");
    node[prop] = unesc(value);
    if (node.raws[prop] === void 0) {
      node.raws[prop] = value;
    }
  }
  return node;
}
function indexesOf(array, item) {
  let i = -1;
  const indexes = [];
  while ((i = array.indexOf(item, i + 1)) !== -1) {
    indexes.push(i);
  }
  return indexes;
}
function uniqs() {
  const list = Array.prototype.concat.apply([], arguments);
  return list.filter((item, i) => i === list.indexOf(item));
}
var WHITESPACE_TOKENS, WHITESPACE_EQUIV_TOKENS, Parser;
var init_parser = __esm({
  "src/postcss-selector-parser/parser.js"() {
    "use strict";
    init_root();
    init_selector();
    init_className();
    init_comment();
    init_id();
    init_tag();
    init_string();
    init_pseudo();
    init_attribute();
    init_universal();
    init_combinator();
    init_nesting();
    init_sortAscending();
    init_tokenize();
    init_tokenTypes();
    init_types();
    init_util();
    WHITESPACE_TOKENS = {
      [space]: true,
      [cr]: true,
      [feed]: true,
      [newline]: true,
      [tab]: true
    };
    WHITESPACE_EQUIV_TOKENS = {
      ...WHITESPACE_TOKENS,
      [comment]: true
    };
    __name(tokenStart, "tokenStart");
    __name(tokenEnd, "tokenEnd");
    __name(getSource, "getSource");
    __name(getTokenSource, "getTokenSource");
    __name(getTokenSourceSpan, "getTokenSourceSpan");
    __name(unescapeProp, "unescapeProp");
    __name(indexesOf, "indexesOf");
    __name(uniqs, "uniqs");
    Parser = class {
      static {
        __name(this, "Parser");
      }
      constructor(rule2, options = {}) {
        this.rule = rule2;
        this.options = Object.assign({ lossy: false, safe: false }, options);
        this.position = 0;
        this.css = typeof this.rule === "string" ? this.rule : this.rule.selector;
        this.tokens = tokenize({
          css: this.css,
          error: this._errorGenerator(),
          safe: this.options.safe
        });
        let rootSource = getTokenSourceSpan(this.tokens[0], this.tokens[this.tokens.length - 1]);
        this.root = new Root({ source: rootSource });
        this.root.errorGenerator = this._errorGenerator();
        const selector2 = new Selector({
          source: { start: { line: 1, column: 1 } },
          sourceIndex: 0
        });
        this.root.append(selector2);
        this.current = selector2;
        this.loop();
      }
      _errorGenerator() {
        return (message, errorOptions) => {
          if (typeof this.rule === "string") {
            return new Error(message);
          }
          return this.rule.error(message, errorOptions);
        };
      }
      attribute() {
        const attr = [];
        const startingToken = this.currToken;
        this.position++;
        while (this.position < this.tokens.length && this.currToken[FIELDS.TYPE] !== closeSquare) {
          attr.push(this.currToken);
          this.position++;
        }
        if (this.currToken[FIELDS.TYPE] !== closeSquare) {
          return this.expected("closing square bracket", this.currToken[FIELDS.START_POS]);
        }
        const len = attr.length;
        const node = {
          source: getSource(
            startingToken[1],
            startingToken[2],
            this.currToken[3],
            this.currToken[4]
          ),
          sourceIndex: startingToken[FIELDS.START_POS]
        };
        if (len === 1 && !~[word].indexOf(attr[0][FIELDS.TYPE])) {
          return this.expected("attribute", attr[0][FIELDS.START_POS]);
        }
        let pos = 0;
        let spaceBefore = "";
        let commentBefore = "";
        let lastAdded = null;
        let spaceAfterMeaningfulToken = false;
        while (pos < len) {
          const token = attr[pos];
          const content = this.content(token);
          const next = attr[pos + 1];
          switch (token[FIELDS.TYPE]) {
            case space:
              spaceAfterMeaningfulToken = true;
              if (this.options.lossy) {
                break;
              }
              if (lastAdded) {
                ensureObject(node, "spaces", lastAdded);
                const prevContent = node.spaces[lastAdded].after || "";
                node.spaces[lastAdded].after = prevContent + content;
                const existingComment = getProp(node, "raws", "spaces", lastAdded, "after") || null;
                if (existingComment) {
                  node.raws.spaces[lastAdded].after = existingComment + content;
                }
              } else {
                spaceBefore = spaceBefore + content;
                commentBefore = commentBefore + content;
              }
              break;
            case asterisk:
              if (next[FIELDS.TYPE] === equals) {
                node.operator = content;
                lastAdded = "operator";
              } else if ((!node.namespace || lastAdded === "namespace" && !spaceAfterMeaningfulToken) && next) {
                if (spaceBefore) {
                  ensureObject(node, "spaces", "attribute");
                  node.spaces.attribute.before = spaceBefore;
                  spaceBefore = "";
                }
                if (commentBefore) {
                  ensureObject(node, "raws", "spaces", "attribute");
                  node.raws.spaces.attribute.before = spaceBefore;
                  commentBefore = "";
                }
                node.namespace = (node.namespace || "") + content;
                const rawValue = getProp(node, "raws", "namespace") || null;
                if (rawValue) {
                  node.raws.namespace += content;
                }
                lastAdded = "namespace";
              }
              spaceAfterMeaningfulToken = false;
              break;
            case dollar:
              if (lastAdded === "value") {
                let oldRawValue = getProp(node, "raws", "value");
                node.value += "$";
                if (oldRawValue) {
                  node.raws.value = oldRawValue + "$";
                }
                break;
              }
            // Falls through
            case caret:
              if (next[FIELDS.TYPE] === equals) {
                node.operator = content;
                lastAdded = "operator";
              }
              spaceAfterMeaningfulToken = false;
              break;
            case combinator:
              if (content === "~" && next[FIELDS.TYPE] === equals) {
                node.operator = content;
                lastAdded = "operator";
              }
              if (content !== "|") {
                spaceAfterMeaningfulToken = false;
                break;
              }
              if (next[FIELDS.TYPE] === equals) {
                node.operator = content;
                lastAdded = "operator";
              } else if (!node.namespace && !node.attribute) {
                node.namespace = true;
              }
              spaceAfterMeaningfulToken = false;
              break;
            case word:
              if (next && this.content(next) === "|" && (attr[pos + 2] && attr[pos + 2][FIELDS.TYPE] !== equals) && // this look-ahead probably fails with comment nodes involved.
              !node.operator && !node.namespace) {
                node.namespace = content;
                lastAdded = "namespace";
              } else if (!node.attribute || lastAdded === "attribute" && !spaceAfterMeaningfulToken) {
                if (spaceBefore) {
                  ensureObject(node, "spaces", "attribute");
                  node.spaces.attribute.before = spaceBefore;
                  spaceBefore = "";
                }
                if (commentBefore) {
                  ensureObject(node, "raws", "spaces", "attribute");
                  node.raws.spaces.attribute.before = commentBefore;
                  commentBefore = "";
                }
                node.attribute = (node.attribute || "") + content;
                const rawValue = getProp(node, "raws", "attribute") || null;
                if (rawValue) {
                  node.raws.attribute += content;
                }
                lastAdded = "attribute";
              } else if (!node.value && node.value !== "" || lastAdded === "value" && !(spaceAfterMeaningfulToken || node.quoteMark)) {
                let unescaped2 = unesc(content);
                let oldRawValue = getProp(node, "raws", "value") || "";
                let oldValue = node.value || "";
                node.value = oldValue + unescaped2;
                node.quoteMark = null;
                if (unescaped2 !== content || oldRawValue) {
                  ensureObject(node, "raws");
                  node.raws.value = (oldRawValue || oldValue) + content;
                }
                lastAdded = "value";
              } else {
                let insensitive = content === "i" || content === "I";
                if ((node.value || node.value === "") && (node.quoteMark || spaceAfterMeaningfulToken)) {
                  node.insensitive = insensitive;
                  if (!insensitive || content === "I") {
                    ensureObject(node, "raws");
                    node.raws.insensitiveFlag = content;
                  }
                  lastAdded = "insensitive";
                  if (spaceBefore) {
                    ensureObject(node, "spaces", "insensitive");
                    node.spaces.insensitive.before = spaceBefore;
                    spaceBefore = "";
                  }
                  if (commentBefore) {
                    ensureObject(node, "raws", "spaces", "insensitive");
                    node.raws.spaces.insensitive.before = commentBefore;
                    commentBefore = "";
                  }
                } else if (node.value || node.value === "") {
                  lastAdded = "value";
                  node.value += content;
                  if (node.raws.value) {
                    node.raws.value += content;
                  }
                }
              }
              spaceAfterMeaningfulToken = false;
              break;
            case str:
              if (!node.attribute || !node.operator) {
                return this.error(`Expected an attribute followed by an operator preceding the string.`, {
                  index: token[FIELDS.START_POS]
                });
              }
              let { unescaped, quoteMark } = unescapeValue(content);
              node.value = unescaped;
              node.quoteMark = quoteMark;
              lastAdded = "value";
              ensureObject(node, "raws");
              node.raws.value = content;
              spaceAfterMeaningfulToken = false;
              break;
            case equals:
              if (!node.attribute) {
                return this.expected("attribute", token[FIELDS.START_POS], content);
              }
              if (node.value) {
                return this.error('Unexpected "=" found; an operator was already defined.', { index: token[FIELDS.START_POS] });
              }
              node.operator = node.operator ? node.operator + content : content;
              lastAdded = "operator";
              spaceAfterMeaningfulToken = false;
              break;
            case comment:
              if (lastAdded) {
                if (spaceAfterMeaningfulToken || next && next[FIELDS.TYPE] === space || lastAdded === "insensitive") {
                  const lastComment = getProp(node, "spaces", lastAdded, "after") || "";
                  const rawLastComment = getProp(node, "raws", "spaces", lastAdded, "after") || lastComment;
                  ensureObject(node, "raws", "spaces", lastAdded);
                  node.raws.spaces[lastAdded].after = rawLastComment + content;
                } else {
                  const lastValue = node[lastAdded] || "";
                  const rawLastValue = getProp(node, "raws", lastAdded) || lastValue;
                  ensureObject(node, "raws");
                  node.raws[lastAdded] = rawLastValue + content;
                }
              } else {
                commentBefore = commentBefore + content;
              }
              break;
            default:
              return this.error(`Unexpected "${content}" found.`, { index: token[FIELDS.START_POS] });
          }
          pos++;
        }
        unescapeProp(node, "attribute");
        unescapeProp(node, "namespace");
        this.newNode(new Attribute(node));
        this.position++;
      }
      /**
       * return a node containing meaningless garbage up to (but not including) the specified token position.
       * if the token position is negative, all remaining tokens are consumed.
       *
       * This returns an array containing a single string node if all whitespace,
       * otherwise an array of comment nodes with space before and after.
       *
       * These tokens are not added to the current selector, the caller can add them or use them to amend
       * a previous node's space metadata.
       *
       * In lossy mode, this returns only comments.
       */
      parseWhitespaceEquivalentTokens(stopPosition) {
        if (stopPosition < 0) {
          stopPosition = this.tokens.length;
        }
        let startPosition = this.position;
        let nodes = [];
        let space2 = "";
        let lastComment = void 0;
        do {
          if (WHITESPACE_TOKENS[this.currToken[FIELDS.TYPE]]) {
            if (!this.options.lossy) {
              space2 += this.content();
            }
          } else if (this.currToken[FIELDS.TYPE] === comment) {
            let spaces = {};
            if (space2) {
              spaces.before = space2;
              space2 = "";
            }
            lastComment = new Comment({
              value: this.content(),
              source: getTokenSource(this.currToken),
              sourceIndex: this.currToken[FIELDS.START_POS],
              spaces
            });
            nodes.push(lastComment);
          }
        } while (++this.position < stopPosition);
        if (space2) {
          if (lastComment) {
            lastComment.spaces.after = space2;
          } else if (!this.options.lossy) {
            let firstToken = this.tokens[startPosition];
            let lastToken = this.tokens[this.position - 1];
            nodes.push(new String2({
              value: "",
              source: getSource(
                firstToken[FIELDS.START_LINE],
                firstToken[FIELDS.START_COL],
                lastToken[FIELDS.END_LINE],
                lastToken[FIELDS.END_COL]
              ),
              sourceIndex: firstToken[FIELDS.START_POS],
              spaces: { before: space2, after: "" }
            }));
          }
        }
        return nodes;
      }
      /**
       *
       * @param {*} nodes
       */
      convertWhitespaceNodesToSpace(nodes, requiredSpace = false) {
        let space2 = "";
        let rawSpace = "";
        nodes.forEach((n) => {
          let spaceBefore = this.lossySpace(n.spaces.before, requiredSpace);
          let rawSpaceBefore = this.lossySpace(n.rawSpaceBefore, requiredSpace);
          space2 += spaceBefore + this.lossySpace(n.spaces.after, requiredSpace && spaceBefore.length === 0);
          rawSpace += spaceBefore + n.value + this.lossySpace(n.rawSpaceAfter, requiredSpace && rawSpaceBefore.length === 0);
        });
        if (rawSpace === space2) {
          rawSpace = void 0;
        }
        let result = { space: space2, rawSpace };
        return result;
      }
      isNamedCombinator(position = this.position) {
        return this.tokens[position + 0] && this.tokens[position + 0][FIELDS.TYPE] === slash && this.tokens[position + 1] && this.tokens[position + 1][FIELDS.TYPE] === word && this.tokens[position + 2] && this.tokens[position + 2][FIELDS.TYPE] === slash;
      }
      namedCombinator() {
        if (this.isNamedCombinator()) {
          let nameRaw = this.content(this.tokens[this.position + 1]);
          let name = unesc(nameRaw).toLowerCase();
          let raws = {};
          if (name !== nameRaw) {
            raws.value = `/${nameRaw}/`;
          }
          let node = new Combinator({
            value: `/${name}/`,
            source: getSource(
              this.currToken[FIELDS.START_LINE],
              this.currToken[FIELDS.START_COL],
              this.tokens[this.position + 2][FIELDS.END_LINE],
              this.tokens[this.position + 2][FIELDS.END_COL]
            ),
            sourceIndex: this.currToken[FIELDS.START_POS],
            raws
          });
          this.position = this.position + 3;
          return node;
        } else {
          this.unexpected();
        }
      }
      combinator() {
        if (this.content() === "|") {
          return this.namespace();
        }
        let nextSigTokenPos = this.locateNextMeaningfulToken(this.position);
        if (nextSigTokenPos < 0 || this.tokens[nextSigTokenPos][FIELDS.TYPE] === comma || this.tokens[nextSigTokenPos][FIELDS.TYPE] === closeParenthesis) {
          let nodes = this.parseWhitespaceEquivalentTokens(nextSigTokenPos);
          if (nodes.length > 0) {
            let last = this.current.last;
            if (last) {
              let { space: space2, rawSpace } = this.convertWhitespaceNodesToSpace(nodes);
              if (rawSpace !== void 0) {
                last.rawSpaceAfter += rawSpace;
              }
              last.spaces.after += space2;
            } else {
              nodes.forEach((n) => this.newNode(n));
            }
          }
          return;
        }
        let firstToken = this.currToken;
        let spaceOrDescendantSelectorNodes = void 0;
        if (nextSigTokenPos > this.position) {
          spaceOrDescendantSelectorNodes = this.parseWhitespaceEquivalentTokens(nextSigTokenPos);
        }
        let node;
        if (this.isNamedCombinator()) {
          node = this.namedCombinator();
        } else if (this.currToken[FIELDS.TYPE] === combinator) {
          node = new Combinator({
            value: this.content(),
            source: getTokenSource(this.currToken),
            sourceIndex: this.currToken[FIELDS.START_POS]
          });
          this.position++;
        } else if (WHITESPACE_TOKENS[this.currToken[FIELDS.TYPE]]) {
        } else if (!spaceOrDescendantSelectorNodes) {
          this.unexpected();
        }
        if (node) {
          if (spaceOrDescendantSelectorNodes) {
            let { space: space2, rawSpace } = this.convertWhitespaceNodesToSpace(spaceOrDescendantSelectorNodes);
            node.spaces.before = space2;
            node.rawSpaceBefore = rawSpace;
          }
        } else {
          let { space: space2, rawSpace } = this.convertWhitespaceNodesToSpace(spaceOrDescendantSelectorNodes, true);
          if (!rawSpace) {
            rawSpace = space2;
          }
          let spaces = {};
          let raws = { spaces: {} };
          if (space2.endsWith(" ") && rawSpace.endsWith(" ")) {
            spaces.before = space2.slice(0, space2.length - 1);
            raws.spaces.before = rawSpace.slice(0, rawSpace.length - 1);
          } else if (space2.startsWith(" ") && rawSpace.startsWith(" ")) {
            spaces.after = space2.slice(1);
            raws.spaces.after = rawSpace.slice(1);
          } else {
            raws.value = rawSpace;
          }
          node = new Combinator({
            value: " ",
            source: getTokenSourceSpan(firstToken, this.tokens[this.position - 1]),
            sourceIndex: firstToken[FIELDS.START_POS],
            spaces,
            raws
          });
        }
        if (this.currToken && this.currToken[FIELDS.TYPE] === space) {
          node.spaces.after = this.optionalSpace(this.content());
          this.position++;
        }
        return this.newNode(node);
      }
      comma() {
        if (this.position === this.tokens.length - 1) {
          this.root.trailingComma = true;
          this.position++;
          return;
        }
        this.current._inferEndPosition();
        const selector2 = new Selector({
          source: {
            start: tokenStart(this.tokens[this.position + 1])
          },
          sourceIndex: this.tokens[this.position + 1][FIELDS.START_POS]
        });
        this.current.parent.append(selector2);
        this.current = selector2;
        this.position++;
      }
      comment() {
        const current = this.currToken;
        this.newNode(new Comment({
          value: this.content(),
          source: getTokenSource(current),
          sourceIndex: current[FIELDS.START_POS]
        }));
        this.position++;
      }
      error(message, opts) {
        throw this.root.error(message, opts);
      }
      missingBackslash() {
        return this.error("Expected a backslash preceding the semicolon.", {
          index: this.currToken[FIELDS.START_POS]
        });
      }
      missingParenthesis() {
        return this.expected("opening parenthesis", this.currToken[FIELDS.START_POS]);
      }
      missingSquareBracket() {
        return this.expected("opening square bracket", this.currToken[FIELDS.START_POS]);
      }
      unexpected() {
        return this.error(`Unexpected '${this.content()}'. Escaping special characters with \\ may help.`, this.currToken[FIELDS.START_POS]);
      }
      unexpectedPipe() {
        return this.error(`Unexpected '|'.`, this.currToken[FIELDS.START_POS]);
      }
      namespace() {
        const before = this.prevToken && this.content(this.prevToken) || true;
        if (this.nextToken[FIELDS.TYPE] === word) {
          this.position++;
          return this.word(before);
        } else if (this.nextToken[FIELDS.TYPE] === asterisk) {
          this.position++;
          return this.universal(before);
        }
        this.unexpectedPipe();
      }
      nesting() {
        if (this.nextToken) {
          let nextContent = this.content(this.nextToken);
          if (nextContent === "|") {
            this.position++;
            return;
          }
        }
        const current = this.currToken;
        this.newNode(new Nesting({
          value: this.content(),
          source: getTokenSource(current),
          sourceIndex: current[FIELDS.START_POS]
        }));
        this.position++;
      }
      parentheses() {
        let last = this.current.last;
        let unbalanced = 1;
        this.position++;
        if (last && last.type === PSEUDO) {
          const selector2 = new Selector({
            source: { start: tokenStart(this.tokens[this.position]) },
            sourceIndex: this.tokens[this.position][FIELDS.START_POS]
          });
          const cache = this.current;
          last.append(selector2);
          this.current = selector2;
          while (this.position < this.tokens.length && unbalanced) {
            if (this.currToken[FIELDS.TYPE] === openParenthesis) {
              unbalanced++;
            }
            if (this.currToken[FIELDS.TYPE] === closeParenthesis) {
              unbalanced--;
            }
            if (unbalanced) {
              this.parse();
            } else {
              this.current.source.end = tokenEnd(this.currToken);
              this.current.parent.source.end = tokenEnd(this.currToken);
              this.position++;
            }
          }
          this.current = cache;
        } else {
          let parenStart = this.currToken;
          let parenValue = "(";
          let parenEnd;
          while (this.position < this.tokens.length && unbalanced) {
            if (this.currToken[FIELDS.TYPE] === openParenthesis) {
              unbalanced++;
            }
            if (this.currToken[FIELDS.TYPE] === closeParenthesis) {
              unbalanced--;
            }
            parenEnd = this.currToken;
            parenValue += this.parseParenthesisToken(this.currToken);
            this.position++;
          }
          if (last) {
            last.appendToPropertyAndEscape("value", parenValue, parenValue);
          } else {
            this.newNode(new String2({
              value: parenValue,
              source: getSource(
                parenStart[FIELDS.START_LINE],
                parenStart[FIELDS.START_COL],
                parenEnd[FIELDS.END_LINE],
                parenEnd[FIELDS.END_COL]
              ),
              sourceIndex: parenStart[FIELDS.START_POS]
            }));
          }
        }
        if (unbalanced) {
          return this.expected("closing parenthesis", this.currToken[FIELDS.START_POS]);
        }
      }
      pseudo() {
        let pseudoStr = "";
        let startingToken = this.currToken;
        while (this.currToken && this.currToken[FIELDS.TYPE] === colon) {
          pseudoStr += this.content();
          this.position++;
        }
        if (!this.currToken) {
          return this.expected(["pseudo-class", "pseudo-element"], this.position - 1);
        }
        if (this.currToken[FIELDS.TYPE] === word) {
          this.splitWord(false, (first, length) => {
            pseudoStr += first;
            this.newNode(new Pseudo({
              value: pseudoStr,
              source: getTokenSourceSpan(startingToken, this.currToken),
              sourceIndex: startingToken[FIELDS.START_POS]
            }));
            if (length > 1 && this.nextToken && this.nextToken[FIELDS.TYPE] === openParenthesis) {
              this.error("Misplaced parenthesis.", {
                index: this.nextToken[FIELDS.START_POS]
              });
            }
          });
        } else {
          return this.expected(["pseudo-class", "pseudo-element"], this.currToken[FIELDS.START_POS]);
        }
      }
      space() {
        const content = this.content();
        if (this.position === 0 || this.prevToken[FIELDS.TYPE] === comma || this.prevToken[FIELDS.TYPE] === openParenthesis || this.current.nodes.every((node) => node.type === "comment")) {
          this.spaces = this.optionalSpace(content);
          this.position++;
        } else if (this.position === this.tokens.length - 1 || this.nextToken[FIELDS.TYPE] === comma || this.nextToken[FIELDS.TYPE] === closeParenthesis) {
          this.current.last.spaces.after = this.optionalSpace(content);
          this.position++;
        } else {
          this.combinator();
        }
      }
      string() {
        const current = this.currToken;
        this.newNode(new String2({
          value: this.content(),
          source: getTokenSource(current),
          sourceIndex: current[FIELDS.START_POS]
        }));
        this.position++;
      }
      universal(namespace) {
        const nextToken = this.nextToken;
        if (nextToken && this.content(nextToken) === "|") {
          this.position++;
          return this.namespace();
        }
        const current = this.currToken;
        this.newNode(new Universal({
          value: this.content(),
          source: getTokenSource(current),
          sourceIndex: current[FIELDS.START_POS]
        }), namespace);
        this.position++;
      }
      splitWord(namespace, firstCallback) {
        let nextToken = this.nextToken;
        let word2 = this.content();
        while (nextToken && ~[dollar, caret, equals, word].indexOf(nextToken[FIELDS.TYPE])) {
          this.position++;
          let current = this.content();
          word2 += current;
          if (current.lastIndexOf("\\") === current.length - 1) {
            let next = this.nextToken;
            if (next && next[FIELDS.TYPE] === space) {
              word2 += this.requiredSpace(this.content(next));
              this.position++;
            }
          }
          nextToken = this.nextToken;
        }
        const hasClass = indexesOf(word2, ".").filter((i) => {
          const escapedDot = word2[i - 1] === "\\";
          const isKeyframesPercent = /^\d+\.\d+%$/.test(word2);
          return !escapedDot && !isKeyframesPercent;
        });
        let hasId = indexesOf(word2, "#").filter((i) => word2[i - 1] !== "\\");
        const interpolations = indexesOf(word2, "#{");
        if (interpolations.length) {
          hasId = hasId.filter((hashIndex) => !~interpolations.indexOf(hashIndex));
        }
        let indices = sortAscending(uniqs([0, ...hasClass, ...hasId]));
        indices.forEach((ind, i) => {
          const index = indices[i + 1] || word2.length;
          const value = word2.slice(ind, index);
          if (i === 0 && firstCallback) {
            return firstCallback.call(this, value, indices.length);
          }
          let node;
          const current = this.currToken;
          const sourceIndex = current[FIELDS.START_POS] + indices[i];
          const source = getSource(
            current[1],
            current[2] + ind,
            current[3],
            current[2] + (index - 1)
          );
          if (~hasClass.indexOf(ind)) {
            let classNameOpts = {
              value: value.slice(1),
              source,
              sourceIndex
            };
            node = new ClassName(unescapeProp(classNameOpts, "value"));
          } else if (~hasId.indexOf(ind)) {
            let idOpts = {
              value: value.slice(1),
              source,
              sourceIndex
            };
            node = new ID2(unescapeProp(idOpts, "value"));
          } else {
            let tagOpts = {
              value,
              source,
              sourceIndex
            };
            unescapeProp(tagOpts, "value");
            node = new Tag(tagOpts);
          }
          this.newNode(node, namespace);
          namespace = null;
        });
        this.position++;
      }
      word(namespace) {
        const nextToken = this.nextToken;
        if (nextToken && this.content(nextToken) === "|") {
          this.position++;
          return this.namespace();
        }
        return this.splitWord(namespace);
      }
      loop() {
        while (this.position < this.tokens.length) {
          this.parse(true);
        }
        this.current._inferEndPosition();
        return this.root;
      }
      parse(throwOnParenthesis) {
        switch (this.currToken[FIELDS.TYPE]) {
          case space:
            this.space();
            break;
          case comment:
            this.comment();
            break;
          case openParenthesis:
            this.parentheses();
            break;
          case closeParenthesis:
            if (throwOnParenthesis) {
              this.missingParenthesis();
            }
            break;
          case openSquare:
            this.attribute();
            break;
          case dollar:
          case caret:
          case equals:
          case word:
            this.word();
            break;
          case colon:
            this.pseudo();
            break;
          case comma:
            this.comma();
            break;
          case asterisk:
            this.universal();
            break;
          case ampersand:
            this.nesting();
            break;
          case slash:
          case combinator:
            this.combinator();
            break;
          case str:
            this.string();
            break;
          // These cases throw; no break needed.
          case closeSquare:
            this.missingSquareBracket();
          case semicolon:
            this.missingBackslash();
          default:
            this.unexpected();
        }
      }
      /**
       * Helpers
       */
      expected(description, index, found) {
        if (Array.isArray(description)) {
          const last = description.pop();
          description = `${description.join(", ")} or ${last}`;
        }
        const an = /^[aeiou]/.test(description[0]) ? "an" : "a";
        if (!found) {
          return this.error(
            `Expected ${an} ${description}.`,
            { index }
          );
        }
        return this.error(
          `Expected ${an} ${description}, found "${found}" instead.`,
          { index }
        );
      }
      requiredSpace(space2) {
        return this.options.lossy ? " " : space2;
      }
      optionalSpace(space2) {
        return this.options.lossy ? "" : space2;
      }
      lossySpace(space2, required) {
        if (this.options.lossy) {
          return required ? " " : "";
        } else {
          return space2;
        }
      }
      parseParenthesisToken(token) {
        const content = this.content(token);
        if (token[FIELDS.TYPE] === space) {
          return this.requiredSpace(content);
        } else {
          return content;
        }
      }
      newNode(node, namespace) {
        if (namespace) {
          if (/^ +$/.test(namespace)) {
            if (!this.options.lossy) {
              this.spaces = (this.spaces || "") + namespace;
            }
            namespace = true;
          }
          node.namespace = namespace;
          unescapeProp(node, "namespace");
        }
        if (this.spaces) {
          node.spaces.before = this.spaces;
          this.spaces = "";
        }
        return this.current.append(node);
      }
      content(token = this.currToken) {
        return this.css.slice(token[FIELDS.START_POS], token[FIELDS.END_POS]);
      }
      get currToken() {
        return this.tokens[this.position];
      }
      get nextToken() {
        return this.tokens[this.position + 1];
      }
      get prevToken() {
        return this.tokens[this.position - 1];
      }
      /**
       * returns the index of the next non-whitespace, non-comment token.
       * returns -1 if no meaningful token is found.
       */
      locateNextMeaningfulToken(startPosition = this.position + 1) {
        let searchPosition = startPosition;
        while (searchPosition < this.tokens.length) {
          if (WHITESPACE_EQUIV_TOKENS[this.tokens[searchPosition][FIELDS.TYPE]]) {
            searchPosition++;
            continue;
          } else {
            return searchPosition;
          }
        }
        return -1;
      }
    };
  }
});

// src/postcss-selector-parser/processor.js
var Processor;
var init_processor = __esm({
  "src/postcss-selector-parser/processor.js"() {
    "use strict";
    init_parser();
    Processor = class {
      static {
        __name(this, "Processor");
      }
      constructor(func, options) {
        this.func = func || /* @__PURE__ */ __name(function noop() {
        }, "noop");
        this.funcRes = null;
        this.options = options;
      }
      _shouldUpdateSelector(rule2, options = {}) {
        let merged = Object.assign({}, this.options, options);
        if (merged.updateSelector === false) {
          return false;
        } else {
          return typeof rule2 !== "string";
        }
      }
      _isLossy(options = {}) {
        let merged = Object.assign({}, this.options, options);
        if (merged.lossless === false) {
          return true;
        } else {
          return false;
        }
      }
      _root(rule2, options = {}) {
        let parser2 = new Parser(rule2, this._parseOptions(options));
        return parser2.root;
      }
      _parseOptions(options) {
        return {
          lossy: this._isLossy(options)
        };
      }
      _run(rule2, options = {}) {
        return new Promise((resolve, reject) => {
          try {
            let root2 = this._root(rule2, options);
            Promise.resolve(this.func(root2)).then((transform) => {
              let string2 = void 0;
              if (this._shouldUpdateSelector(rule2, options)) {
                string2 = root2.toString();
                rule2.selector = string2;
              }
              return { transform, root: root2, string: string2 };
            }).then(resolve, reject);
          } catch (e) {
            reject(e);
            return;
          }
        });
      }
      _runSync(rule2, options = {}) {
        let root2 = this._root(rule2, options);
        let transform = this.func(root2);
        if (transform && typeof transform.then === "function") {
          throw new Error("Selector processor returned a promise to a synchronous call.");
        }
        let string2 = void 0;
        if (options.updateSelector && typeof rule2 !== "string") {
          string2 = root2.toString();
          rule2.selector = string2;
        }
        return { transform, root: root2, string: string2 };
      }
      /**
       * Process rule into a selector AST.
       *
       * @param rule {postcss.Rule | string} The css selector to be processed
       * @param options The options for processing
       * @returns {Promise<parser.Root>} The AST of the selector after processing it.
       */
      ast(rule2, options) {
        return this._run(rule2, options).then((result) => result.root);
      }
      /**
       * Process rule into a selector AST synchronously.
       *
       * @param rule {postcss.Rule | string} The css selector to be processed
       * @param options The options for processing
       * @returns {parser.Root} The AST of the selector after processing it.
       */
      astSync(rule2, options) {
        return this._runSync(rule2, options).root;
      }
      /**
       * Process a selector into a transformed value asynchronously
       *
       * @param rule {postcss.Rule | string} The css selector to be processed
       * @param options The options for processing
       * @returns {Promise<any>} The value returned by the processor.
       */
      transform(rule2, options) {
        return this._run(rule2, options).then((result) => result.transform);
      }
      /**
       * Process a selector into a transformed value synchronously.
       *
       * @param rule {postcss.Rule | string} The css selector to be processed
       * @param options The options for processing
       * @returns {any} The value returned by the processor.
       */
      transformSync(rule2, options) {
        return this._runSync(rule2, options).transform;
      }
      /**
       * Process a selector into a new selector string asynchronously.
       *
       * @param rule {postcss.Rule | string} The css selector to be processed
       * @param options The options for processing
       * @returns {string} the selector after processing.
       */
      process(rule2, options) {
        return this._run(rule2, options).then((result) => result.string || result.root.toString());
      }
      /**
       * Process a selector into a new selector string synchronously.
       *
       * @param rule {postcss.Rule | string} The css selector to be processed
       * @param options The options for processing
       * @returns {string} the selector after processing.
       */
      processSync(rule2, options) {
        let result = this._runSync(rule2, options);
        return result.string || result.root.toString();
      }
    };
  }
});

// src/postcss-selector-parser/selectors/constructors.js
var attribute, className, combinator2, comment2, id, nesting, pseudo, root, selector, string, tag, universal;
var init_constructors = __esm({
  "src/postcss-selector-parser/selectors/constructors.js"() {
    "use strict";
    init_attribute();
    init_className();
    init_combinator();
    init_comment();
    init_id();
    init_nesting();
    init_pseudo();
    init_root();
    init_selector();
    init_string();
    init_tag();
    init_universal();
    attribute = /* @__PURE__ */ __name((opts) => new Attribute(opts), "attribute");
    className = /* @__PURE__ */ __name((opts) => new ClassName(opts), "className");
    combinator2 = /* @__PURE__ */ __name((opts) => new Combinator(opts), "combinator");
    comment2 = /* @__PURE__ */ __name((opts) => new Comment(opts), "comment");
    id = /* @__PURE__ */ __name((opts) => new ID2(opts), "id");
    nesting = /* @__PURE__ */ __name((opts) => new Nesting(opts), "nesting");
    pseudo = /* @__PURE__ */ __name((opts) => new Pseudo(opts), "pseudo");
    root = /* @__PURE__ */ __name((opts) => new Root(opts), "root");
    selector = /* @__PURE__ */ __name((opts) => new Selector(opts), "selector");
    string = /* @__PURE__ */ __name((opts) => new String2(opts), "string");
    tag = /* @__PURE__ */ __name((opts) => new Tag(opts), "tag");
    universal = /* @__PURE__ */ __name((opts) => new Universal(opts), "universal");
  }
});

// src/postcss-selector-parser/selectors/guards.js
function isNode(node) {
  return typeof node === "object" && IS_TYPE[node.type];
}
function isNodeType(type, node) {
  return isNode(node) && node.type === type;
}
function isPseudoElement(node) {
  return isPseudo(node) && node.value && (node.value.startsWith("::") || node.value.toLowerCase() === ":before" || node.value.toLowerCase() === ":after" || node.value.toLowerCase() === ":first-letter" || node.value.toLowerCase() === ":first-line");
}
function isPseudoClass(node) {
  return isPseudo(node) && !isPseudoElement(node);
}
function isContainer(node) {
  return !!(isNode(node) && node.walk);
}
function isNamespace(node) {
  return isAttribute(node) || isTag(node);
}
var IS_TYPE, isAttribute, isClassName, isCombinator, isComment, isIdentifier, isNesting, isPseudo, isRoot, isSelector, isString, isTag, isUniversal;
var init_guards = __esm({
  "src/postcss-selector-parser/selectors/guards.js"() {
    "use strict";
    init_types();
    IS_TYPE = {
      [ATTRIBUTE]: true,
      [CLASS]: true,
      [COMBINATOR]: true,
      [COMMENT]: true,
      [ID]: true,
      [NESTING]: true,
      [PSEUDO]: true,
      [ROOT]: true,
      [SELECTOR]: true,
      [STRING]: true,
      [TAG]: true,
      [UNIVERSAL]: true
    };
    __name(isNode, "isNode");
    __name(isNodeType, "isNodeType");
    isAttribute = isNodeType.bind(null, ATTRIBUTE);
    isClassName = isNodeType.bind(null, CLASS);
    isCombinator = isNodeType.bind(null, COMBINATOR);
    isComment = isNodeType.bind(null, COMMENT);
    isIdentifier = isNodeType.bind(null, ID);
    isNesting = isNodeType.bind(null, NESTING);
    isPseudo = isNodeType.bind(null, PSEUDO);
    isRoot = isNodeType.bind(null, ROOT);
    isSelector = isNodeType.bind(null, SELECTOR);
    isString = isNodeType.bind(null, STRING);
    isTag = isNodeType.bind(null, TAG);
    isUniversal = isNodeType.bind(null, UNIVERSAL);
    __name(isPseudoElement, "isPseudoElement");
    __name(isPseudoClass, "isPseudoClass");
    __name(isContainer, "isContainer");
    __name(isNamespace, "isNamespace");
  }
});

// src/postcss-selector-parser/selectors/index.js
var selectors_exports = {};
__export(selectors_exports, {
  ATTRIBUTE: () => ATTRIBUTE,
  CLASS: () => CLASS,
  COMBINATOR: () => COMBINATOR,
  COMMENT: () => COMMENT,
  ID: () => ID,
  NESTING: () => NESTING,
  PSEUDO: () => PSEUDO,
  ROOT: () => ROOT,
  SELECTOR: () => SELECTOR,
  STRING: () => STRING,
  TAG: () => TAG,
  UNIVERSAL: () => UNIVERSAL,
  attribute: () => attribute,
  className: () => className,
  combinator: () => combinator2,
  comment: () => comment2,
  id: () => id,
  isAttribute: () => isAttribute,
  isClassName: () => isClassName,
  isCombinator: () => isCombinator,
  isComment: () => isComment,
  isContainer: () => isContainer,
  isIdentifier: () => isIdentifier,
  isNamespace: () => isNamespace,
  isNesting: () => isNesting,
  isNode: () => isNode,
  isPseudo: () => isPseudo,
  isPseudoClass: () => isPseudoClass,
  isPseudoElement: () => isPseudoElement,
  isRoot: () => isRoot,
  isSelector: () => isSelector,
  isString: () => isString,
  isTag: () => isTag,
  isUniversal: () => isUniversal,
  nesting: () => nesting,
  pseudo: () => pseudo,
  root: () => root,
  selector: () => selector,
  string: () => string,
  tag: () => tag,
  universal: () => universal
});
var init_selectors = __esm({
  "src/postcss-selector-parser/selectors/index.js"() {
    "use strict";
    init_types();
    init_constructors();
    init_guards();
  }
});

// src/postcss-selector-parser/index.js
var postcss_selector_parser_exports = {};
__export(postcss_selector_parser_exports, {
  default: () => postcss_selector_parser_default
});
var parser, postcss_selector_parser_default;
var init_postcss_selector_parser = __esm({
  "src/postcss-selector-parser/index.js"() {
    "use strict";
    init_processor();
    init_selectors();
    parser = /* @__PURE__ */ __name((processor) => new Processor(processor), "parser");
    Object.assign(parser, selectors_exports);
    postcss_selector_parser_default = parser;
  }
});

// src/postcss-discard-unused/index.js
var selectorParser = (init_postcss_selector_parser(), __toCommonJS(postcss_selector_parser_exports));
var atrule = "atrule";
var decl = "decl";
var rule = "rule";
function splitValues({ value }, comma2, space2) {
  let result = [];
  for (const val of comma2(value)) {
    result = result.concat(space2(val));
  }
  return result;
}
__name(splitValues, "splitValues");
function filterAtRule({ atRules, values }) {
  const uniqueValues = new Set(values);
  atRules.forEach((node) => {
    const hasAtRule = uniqueValues.has(node.params);
    if (!hasAtRule) {
      node.remove();
    }
  });
}
__name(filterAtRule, "filterAtRule");
function filterNamespace({ atRules, rules }) {
  const uniqueRules = new Set(rules);
  for (const atRule of atRules) {
    const { 0: param, length: len } = atRule.params.split(" ").filter(Boolean);
    if (len === 1) {
      return;
    }
    const hasRule = uniqueRules.has(param) || uniqueRules.has("*");
    if (!hasRule) {
      atRule.remove();
    }
  }
}
__name(filterNamespace, "filterNamespace");
function hasFont(fontFamily, cache, comma2) {
  return comma2(fontFamily).some((font) => cache.some((c) => c.includes(font)));
}
__name(hasFont, "hasFont");
function filterFont({ atRules, values }, comma2) {
  values = [...new Set(values)];
  for (const r of atRules) {
    if (r.nodes !== void 0) {
      const families = (
        /** @type {import('postcss').Declaration[]} */
        r.nodes.filter(
          (node) => node.type === "decl" && node.prop === "font-family"
        )
      );
      if (families.length === 0) {
        r.remove();
      }
      for (const family of families) {
        if (!hasFont(family.value.toLowerCase(), values, comma2)) {
          r.remove();
        }
      }
    }
  }
}
__name(filterFont, "filterFont");
function pluginCreator(opts) {
  const { fontFace, counterStyle, keyframes, namespace } = Object.assign(
    {},
    {
      fontFace: true,
      counterStyle: true,
      keyframes: true,
      namespace: true
    },
    opts
  );
  return {
    postcssPlugin: "postcss-discard-unused",
    prepare() {
      const counterStyleCache = { atRules: [], values: [] };
      const keyframesCache = { atRules: [], values: [] };
      const namespaceCache = { atRules: [], rules: [] };
      const fontCache = { atRules: [], values: [] };
      return {
        OnceExit(css, { list }) {
          const { comma: comma2, space: space2 } = list;
          css.walk((node) => {
            const { type } = node;
            if (type === rule && namespace && node.selector.includes("|")) {
              if (node.selector.includes("[")) {
                selectorParser((ast) => {
                  ast.walkAttributes(({ namespace: ns }) => {
                    namespaceCache.rules = namespaceCache.rules.concat(ns);
                  });
                }).process(node.selector);
              } else {
                namespaceCache.rules = namespaceCache.rules.concat(
                  node.selector.split("|")[0]
                );
              }
              return;
            }
            if (type === decl) {
              const { prop } = node;
              if (counterStyle && /list-style|system/.test(prop)) {
                counterStyleCache.values = counterStyleCache.values.concat(
                  splitValues(node, comma2, space2)
                );
              }
              if (fontFace && node.parent !== void 0 && node.parent.type === rule && /font(|-family)/.test(prop)) {
                fontCache.values = fontCache.values.concat(
                  comma2(node.value.toLowerCase())
                );
              }
              if (keyframes && /animation/.test(prop)) {
                keyframesCache.values = keyframesCache.values.concat(
                  splitValues(node, comma2, space2)
                );
              }
              return;
            }
            if (type === atrule) {
              const { name } = node;
              if (counterStyle && /counter-style/.test(name)) {
                counterStyleCache.atRules.push(node);
              }
              if (fontFace && name === "font-face" && node.nodes) {
                fontCache.atRules.push(node);
              }
              if (keyframes && /keyframes/.test(name)) {
                keyframesCache.atRules.push(node);
              }
              if (namespace && name === "namespace") {
                namespaceCache.atRules.push(node);
              }
              return;
            }
          });
          counterStyle && filterAtRule(counterStyleCache);
          fontFace && filterFont(fontCache, comma2);
          keyframes && filterAtRule(keyframesCache);
          namespace && filterNamespace(namespaceCache);
        }
      };
    }
  };
}
__name(pluginCreator, "pluginCreator");
pluginCreator.postcss = true;
module.exports = pluginCreator;
//# sourceMappingURL=index.mjs.map
