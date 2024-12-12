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
var TAG = "tag";
var SELECTOR = "selector";
var PSEUDO = "pseudo";
var NESTING = "nesting";
var ID = "id";
var COMMENT = "comment";
var COMBINATOR = "combinator";
var CLASS = "class";
var ATTRIBUTE = "attribute";
var UNIVERSAL = "universal";

// src/postcss-selector-parser/selectors/container.js
var Container = class extends Node {
  static {
    __name(this, "Container");
  }
  constructor(opts) {
    super(opts);
    if (!this.nodes) {
      this.nodes = [];
    }
  }
  append(selector) {
    selector.parent = this;
    this.nodes.push(selector);
    return this;
  }
  prepend(selector) {
    selector.parent = this;
    this.nodes.unshift(selector);
    for (let id in this.indexes) {
      this.indexes[id]++;
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
    for (let id in this.indexes) {
      index = this.indexes[id];
      if (index >= child) {
        this.indexes[id] = index - 1;
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
    for (let id in this.indexes) {
      index = this.indexes[id];
      if (oldIndex < index) {
        this.indexes[id] = index + 1;
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
    for (let id in this.indexes) {
      index = this.indexes[id];
      if (index >= oldIndex) {
        this.indexes[id] = index + 1;
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
    let id = this.lastEach;
    this.indexes[id] = 0;
    if (!this.length) {
      return void 0;
    }
    let index, result;
    while (this.indexes[id] < this.length) {
      index = this.indexes[id];
      result = callback(this.at(index), index);
      if (result === false) {
        break;
      }
      this.indexes[id] += 1;
    }
    delete this.indexes[id];
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
    return this.walk((selector) => {
      if (selector.type === ATTRIBUTE) {
        return callback.call(this, selector);
      }
    });
  }
  walkClasses(callback) {
    return this.walk((selector) => {
      if (selector.type === CLASS) {
        return callback.call(this, selector);
      }
    });
  }
  walkCombinators(callback) {
    return this.walk((selector) => {
      if (selector.type === COMBINATOR) {
        return callback.call(this, selector);
      }
    });
  }
  walkComments(callback) {
    return this.walk((selector) => {
      if (selector.type === COMMENT) {
        return callback.call(this, selector);
      }
    });
  }
  walkIds(callback) {
    return this.walk((selector) => {
      if (selector.type === ID) {
        return callback.call(this, selector);
      }
    });
  }
  walkNesting(callback) {
    return this.walk((selector) => {
      if (selector.type === NESTING) {
        return callback.call(this, selector);
      }
    });
  }
  walkPseudos(callback) {
    return this.walk((selector) => {
      if (selector.type === PSEUDO) {
        return callback.call(this, selector);
      }
    });
  }
  walkTags(callback) {
    return this.walk((selector) => {
      if (selector.type === TAG) {
        return callback.call(this, selector);
      }
    });
  }
  walkUniversals(callback) {
    return this.walk((selector) => {
      if (selector.type === UNIVERSAL) {
        return callback.call(this, selector);
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

// src/postcss-selector-parser/selectors/selector.js
var Selector = class extends Container {
  static {
    __name(this, "Selector");
  }
  constructor(opts) {
    super(opts);
    this.type = SELECTOR;
  }
};
export {
  Selector as default
};
//# sourceMappingURL=selector.mjs.map
