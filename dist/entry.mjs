var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/postcss/css-syntax-error.js
var CssSyntaxError = class _CssSyntaxError extends Error {
  static {
    __name(this, "CssSyntaxError");
  }
  constructor(message, line, column, source, file, plugin2) {
    super(message);
    this.name = "CssSyntaxError";
    this.reason = message;
    if (file) {
      this.file = file;
    }
    if (source) {
      this.source = source;
    }
    if (plugin2) {
      this.plugin = plugin2;
    }
    if (typeof line !== "undefined" && typeof column !== "undefined") {
      if (typeof line === "number") {
        this.line = line;
        this.column = column;
      } else {
        this.line = line.line;
        this.column = line.column;
        this.endLine = column.line;
        this.endColumn = column.column;
      }
    }
    this.setMessage();
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, _CssSyntaxError);
    }
  }
  setMessage() {
    this.message = this.plugin ? this.plugin + ": " : "";
    this.message += this.file ? this.file : "<css input>";
    if (typeof this.line !== "undefined") {
      this.message += ":" + this.line + ":" + this.column;
    }
    this.message += ": " + this.reason;
  }
  showSourceCode() {
    return "";
  }
  toString() {
    let code = this.showSourceCode();
    if (code) {
      code = "\n\n" + code + "\n";
    }
    return this.name + ": " + this.message + code;
  }
};

// src/postcss/stringifier.js
var DEFAULT_RAW = {
  after: "\n",
  beforeClose: "\n",
  beforeComment: "\n",
  beforeDecl: "\n",
  beforeOpen: " ",
  beforeRule: "\n",
  colon: ": ",
  commentLeft: " ",
  commentRight: " ",
  emptyBody: "",
  indent: "    ",
  semicolon: false
};
function capitalize(str2) {
  return str2[0].toUpperCase() + str2.slice(1);
}
__name(capitalize, "capitalize");
var Stringifier = class {
  static {
    __name(this, "Stringifier");
  }
  constructor(builder) {
    this.builder = builder;
  }
  atrule(node, semicolon2) {
    let name = "@" + node.name;
    const params = node.params ? this.rawValue(node, "params") : "";
    if (typeof node.raws.afterName !== "undefined") {
      name += node.raws.afterName;
    } else if (params) {
      name += " ";
    }
    if (node.nodes) {
      this.block(node, name + params);
    } else {
      const end = (node.raws.between || "") + (semicolon2 ? ";" : "");
      this.builder(name + params + end, node);
    }
  }
  beforeAfter(node, detect) {
    let value;
    if (node.type === "decl") {
      value = this.raw(node, null, "beforeDecl");
    } else if (node.type === "comment") {
      value = this.raw(node, null, "beforeComment");
    } else if (detect === "before") {
      value = this.raw(node, null, "beforeRule");
    } else {
      value = this.raw(node, null, "beforeClose");
    }
    let buf = node.parent;
    let depth = 0;
    while (buf && buf.type !== "root") {
      depth += 1;
      buf = buf.parent;
    }
    if (value.includes("\n")) {
      const indent = this.raw(node, null, "indent");
      if (indent.length) {
        for (let step = 0; step < depth; step++)
          value += indent;
      }
    }
    return value;
  }
  block(node, start) {
    const between = this.raw(node, "between", "beforeOpen");
    this.builder(start + between + "{", node, "start");
    let after;
    if (node.nodes && node.nodes.length) {
      this.body(node);
      after = this.raw(node, "after");
    } else {
      after = this.raw(node, "after", "emptyBody");
    }
    if (after)
      this.builder(after);
    this.builder("}", node, "end");
  }
  body(node) {
    let last = node.nodes.length - 1;
    while (last > 0) {
      if (node.nodes[last].type !== "comment")
        break;
      last -= 1;
    }
    const semicolon2 = this.raw(node, "semicolon");
    for (let i = 0; i < node.nodes.length; i++) {
      const child = node.nodes[i];
      const before = this.raw(child, "before");
      if (before)
        this.builder(before);
      this.stringify(child, last !== i || semicolon2);
    }
  }
  comment(node) {
    const left = this.raw(node, "left", "commentLeft");
    const right = this.raw(node, "right", "commentRight");
    this.builder("/*" + left + node.text + right + "*/", node);
  }
  decl(node, semicolon2) {
    const between = this.raw(node, "between", "colon");
    let string2 = node.prop + between + this.rawValue(node, "value");
    if (node.important) {
      string2 += node.raws.important || " !important";
    }
    if (semicolon2)
      string2 += ";";
    this.builder(string2, node);
  }
  document(node) {
    this.body(node);
  }
  raw(node, own, detect) {
    let value;
    if (!detect)
      detect = own;
    if (own) {
      value = node.raws[own];
      if (typeof value !== "undefined")
        return value;
    }
    const parent = node.parent;
    if (detect === "before") {
      if (!parent || parent.type === "root" && parent.first === node) {
        return "";
      }
      if (parent && parent.type === "document") {
        return "";
      }
    }
    if (!parent)
      return DEFAULT_RAW[detect];
    const root2 = node.root();
    if (!root2.rawCache)
      root2.rawCache = {};
    if (typeof root2.rawCache[detect] !== "undefined") {
      return root2.rawCache[detect];
    }
    if (detect === "before" || detect === "after") {
      return this.beforeAfter(node, detect);
    } else {
      const method = "raw" + capitalize(detect);
      if (this[method]) {
        value = this[method](root2, node);
      } else {
        root2.walk((i) => {
          value = i.raws[own];
          if (typeof value !== "undefined")
            return false;
        });
      }
    }
    if (typeof value === "undefined")
      value = DEFAULT_RAW[detect];
    root2.rawCache[detect] = value;
    return value;
  }
  rawBeforeClose(root2) {
    let value;
    root2.walk((i) => {
      if (i.nodes && i.nodes.length > 0) {
        if (typeof i.raws.after !== "undefined") {
          value = i.raws.after;
          if (value.includes("\n")) {
            value = value.replace(/[^\n]+$/, "");
          }
          return false;
        }
      }
    });
    if (value)
      value = value.replace(/\S/g, "");
    return value;
  }
  rawBeforeComment(root2, node) {
    let value;
    root2.walkComments((i) => {
      if (typeof i.raws.before !== "undefined") {
        value = i.raws.before;
        if (value.includes("\n")) {
          value = value.replace(/[^\n]+$/, "");
        }
        return false;
      }
    });
    if (typeof value === "undefined") {
      value = this.raw(node, null, "beforeDecl");
    } else if (value) {
      value = value.replace(/\S/g, "");
    }
    return value;
  }
  rawBeforeDecl(root2, node) {
    let value;
    root2.walkDecls((i) => {
      if (typeof i.raws.before !== "undefined") {
        value = i.raws.before;
        if (value.includes("\n")) {
          value = value.replace(/[^\n]+$/, "");
        }
        return false;
      }
    });
    if (typeof value === "undefined") {
      value = this.raw(node, null, "beforeRule");
    } else if (value) {
      value = value.replace(/\S/g, "");
    }
    return value;
  }
  rawBeforeOpen(root2) {
    let value;
    root2.walk((i) => {
      if (i.type !== "decl") {
        value = i.raws.between;
        if (typeof value !== "undefined")
          return false;
      }
    });
    return value;
  }
  rawBeforeRule(root2) {
    let value;
    root2.walk((i) => {
      if (i.nodes && (i.parent !== root2 || root2.first !== i)) {
        if (typeof i.raws.before !== "undefined") {
          value = i.raws.before;
          if (value.includes("\n")) {
            value = value.replace(/[^\n]+$/, "");
          }
          return false;
        }
      }
    });
    if (value)
      value = value.replace(/\S/g, "");
    return value;
  }
  rawColon(root2) {
    let value;
    root2.walkDecls((i) => {
      if (typeof i.raws.between !== "undefined") {
        value = i.raws.between.replace(/[^\s:]/g, "");
        return false;
      }
    });
    return value;
  }
  rawEmptyBody(root2) {
    let value;
    root2.walk((i) => {
      if (i.nodes && i.nodes.length === 0) {
        value = i.raws.after;
        if (typeof value !== "undefined")
          return false;
      }
    });
    return value;
  }
  rawIndent(root2) {
    if (root2.raws.indent)
      return root2.raws.indent;
    let value;
    root2.walk((i) => {
      const p = i.parent;
      if (p && p !== root2 && p.parent && p.parent === root2) {
        if (typeof i.raws.before !== "undefined") {
          const parts = i.raws.before.split("\n");
          value = parts[parts.length - 1];
          value = value.replace(/\S/g, "");
          return false;
        }
      }
    });
    return value;
  }
  rawSemicolon(root2) {
    let value;
    root2.walk((i) => {
      if (i.nodes && i.nodes.length && i.last.type === "decl") {
        value = i.raws.semicolon;
        if (typeof value !== "undefined")
          return false;
      }
    });
    return value;
  }
  rawValue(node, prop) {
    const value = node[prop];
    const raw = node.raws[prop];
    if (raw && raw.value === value) {
      return raw.raw;
    }
    return value;
  }
  root(node) {
    this.body(node);
    if (node.raws.after)
      this.builder(node.raws.after);
  }
  rule(node) {
    this.block(node, this.rawValue(node, "selector"));
    if (node.raws.ownSemicolon) {
      this.builder(node.raws.ownSemicolon, node, "end");
    }
  }
  stringify(node, semicolon2) {
    if (!this[node.type]) {
      throw new Error("Unknown AST node type " + node.type + ". Maybe you need to change PostCSS stringifier.");
    }
    this[node.type](node, semicolon2);
  }
};

// src/postcss/stringify.js
function stringify(node, builder) {
  const str2 = new Stringifier(builder);
  str2.stringify(node);
}
__name(stringify, "stringify");

// src/postcss/symbols.js
var isClean = Symbol("isClean");
var my = Symbol("my");

// src/postcss/node.js
function cloneNode(obj, parent) {
  const cloned = new obj.constructor();
  for (const i in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, i)) {
      continue;
    }
    if (i === "proxyCache")
      continue;
    let value = obj[i];
    const type = typeof value;
    if (i === "parent" && type === "object") {
      if (parent)
        cloned[i] = parent;
    } else if (i === "source") {
      cloned[i] = value;
    } else if (Array.isArray(value)) {
      cloned[i] = value.map((j) => cloneNode(j, cloned));
    } else {
      if (type === "object" && value !== null)
        value = cloneNode(value);
      cloned[i] = value;
    }
  }
  return cloned;
}
__name(cloneNode, "cloneNode");
function sourceOffset(inputCSS, position) {
  if (position && typeof position.offset !== "undefined") {
    return position.offset;
  }
  let column = 1;
  let line = 1;
  let offset = 0;
  for (let i = 0; i < inputCSS.length; i++) {
    if (line === position.line && column === position.column) {
      offset = i;
      break;
    }
    if (inputCSS[i] === "\n") {
      column = 1;
      line += 1;
    } else {
      column += 1;
    }
  }
  return offset;
}
__name(sourceOffset, "sourceOffset");
var Node = class {
  static {
    __name(this, "Node");
  }
  constructor(defaults = {}) {
    this.raws = {};
    this[isClean] = false;
    this[my] = true;
    for (const name in defaults) {
      if (name === "nodes") {
        this.nodes = [];
        for (const node of defaults[name]) {
          if (typeof node.clone === "function") {
            this.append(node.clone());
          } else {
            this.append(node);
          }
        }
      } else {
        this[name] = defaults[name];
      }
    }
  }
  addToError(error) {
    error.postcssNode = this;
    if (error.stack && this.source && /\n\s{4}at /.test(error.stack)) {
      const s = this.source;
      error.stack = error.stack.replace(/\n\s{4}at /, `$&${s.input.from}:${s.start.line}:${s.start.column}$&`);
    }
    return error;
  }
  after(add) {
    this.parent.insertAfter(this, add);
    return this;
  }
  assign(overrides = {}) {
    for (const name in overrides) {
      this[name] = overrides[name];
    }
    return this;
  }
  before(add) {
    this.parent.insertBefore(this, add);
    return this;
  }
  cleanRaws(keepBetween) {
    delete this.raws.before;
    delete this.raws.after;
    if (!keepBetween)
      delete this.raws.between;
  }
  clone(overrides = {}) {
    const cloned = cloneNode(this);
    for (const name in overrides) {
      cloned[name] = overrides[name];
    }
    return cloned;
  }
  cloneAfter(overrides = {}) {
    const cloned = this.clone(overrides);
    this.parent.insertAfter(this, cloned);
    return cloned;
  }
  cloneBefore(overrides = {}) {
    const cloned = this.clone(overrides);
    this.parent.insertBefore(this, cloned);
    return cloned;
  }
  error(message, opts = {}) {
    if (this.source) {
      const { end, start } = this.rangeBy(opts);
      return this.source.input.error(message, { column: start.column, line: start.line }, { column: end.column, line: end.line }, opts);
    }
    return new CssSyntaxError(message);
  }
  getProxyProcessor() {
    return {
      get(node, prop) {
        if (prop === "proxyOf") {
          return node;
        } else if (prop === "root") {
          return () => node.root().toProxy();
        } else {
          return node[prop];
        }
      },
      set(node, prop, value) {
        if (node[prop] === value)
          return true;
        node[prop] = value;
        if (prop === "prop" || prop === "value" || prop === "name" || prop === "params" || prop === "important" || /* c8 ignore next */
        prop === "text") {
          node.markDirty();
        }
        return true;
      }
    };
  }
  /* c8 ignore next 3 */
  markClean() {
    this[isClean] = true;
  }
  markDirty() {
    if (this[isClean]) {
      this[isClean] = false;
      let next = this;
      while (next = next.parent) {
        next[isClean] = false;
      }
    }
  }
  next() {
    if (!this.parent)
      return void 0;
    const index = this.parent.index(this);
    return this.parent.nodes[index + 1];
  }
  positionBy(opts) {
    let pos = this.source.start;
    if (opts.index) {
      pos = this.positionInside(opts.index);
    } else if (opts.word) {
      const stringRepresentation = this.source.input.css.slice(sourceOffset(this.source.input.css, this.source.start), sourceOffset(this.source.input.css, this.source.end));
      const index = stringRepresentation.indexOf(opts.word);
      if (index !== -1)
        pos = this.positionInside(index);
    }
    return pos;
  }
  positionInside(index) {
    let column = this.source.start.column;
    let line = this.source.start.line;
    const offset = sourceOffset(this.source.input.css, this.source.start);
    const end = offset + index;
    for (let i = offset; i < end; i++) {
      if (this.source.input.css[i] === "\n") {
        column = 1;
        line += 1;
      } else {
        column += 1;
      }
    }
    return { column, line };
  }
  prev() {
    if (!this.parent)
      return void 0;
    const index = this.parent.index(this);
    return this.parent.nodes[index - 1];
  }
  rangeBy(opts) {
    let start = {
      column: this.source.start.column,
      line: this.source.start.line
    };
    let end = this.source.end ? {
      column: this.source.end.column + 1,
      line: this.source.end.line
    } : {
      column: start.column + 1,
      line: start.line
    };
    if (opts.word) {
      const stringRepresentation = this.source.input.css.slice(sourceOffset(this.source.input.css, this.source.start), sourceOffset(this.source.input.css, this.source.end));
      const index = stringRepresentation.indexOf(opts.word);
      if (index !== -1) {
        start = this.positionInside(index);
        end = this.positionInside(index + opts.word.length);
      }
    } else {
      if (opts.start) {
        start = {
          column: opts.start.column,
          line: opts.start.line
        };
      } else if (opts.index) {
        start = this.positionInside(opts.index);
      }
      if (opts.end) {
        end = {
          column: opts.end.column,
          line: opts.end.line
        };
      } else if (typeof opts.endIndex === "number") {
        end = this.positionInside(opts.endIndex);
      } else if (opts.index) {
        end = this.positionInside(opts.index + 1);
      }
    }
    if (end.line < start.line || end.line === start.line && end.column <= start.column) {
      end = { column: start.column + 1, line: start.line };
    }
    return { end, start };
  }
  raw(prop, defaultType) {
    const str2 = new Stringifier();
    return str2.raw(this, prop, defaultType);
  }
  remove() {
    if (this.parent) {
      this.parent.removeChild(this);
    }
    this.parent = void 0;
    return this;
  }
  replaceWith(...nodes) {
    if (this.parent) {
      let bookmark = this;
      let foundSelf = false;
      for (const node of nodes) {
        if (node === this) {
          foundSelf = true;
        } else if (foundSelf) {
          this.parent.insertAfter(bookmark, node);
          bookmark = node;
        } else {
          this.parent.insertBefore(bookmark, node);
        }
      }
      if (!foundSelf) {
        this.remove();
      }
    }
    return this;
  }
  root() {
    let result = this;
    while (result.parent && result.parent.type !== "document") {
      result = result.parent;
    }
    return result;
  }
  toJSON(_, inputs) {
    const fixed = {};
    const emitInputs = inputs == null;
    inputs = inputs || /* @__PURE__ */ new Map();
    let inputsNextIndex = 0;
    for (const name in this) {
      if (!Object.prototype.hasOwnProperty.call(this, name)) {
        continue;
      }
      if (name === "parent" || name === "proxyCache")
        continue;
      const value = this[name];
      if (Array.isArray(value)) {
        fixed[name] = value.map((i) => {
          if (typeof i === "object" && i.toJSON) {
            return i.toJSON(null, inputs);
          } else {
            return i;
          }
        });
      } else if (typeof value === "object" && value.toJSON) {
        fixed[name] = value.toJSON(null, inputs);
      } else if (name === "source") {
        let inputId = inputs.get(value.input);
        if (inputId == null) {
          inputId = inputsNextIndex;
          inputs.set(value.input, inputsNextIndex);
          inputsNextIndex++;
        }
        fixed[name] = {
          end: value.end,
          inputId,
          start: value.start
        };
      } else {
        fixed[name] = value;
      }
    }
    if (emitInputs) {
      fixed.inputs = [...inputs.keys()].map((input) => input.toJSON());
    }
    return fixed;
  }
  toProxy() {
    if (!this.proxyCache) {
      this.proxyCache = new Proxy(this, this.getProxyProcessor());
    }
    return this.proxyCache;
  }
  toString(stringifier = stringify) {
    if (stringifier.stringify)
      stringifier = stringifier.stringify;
    let result = "";
    stringifier(this, (i) => {
      result += i;
    });
    return result;
  }
  warn(result, text, opts) {
    const data = { node: this };
    for (const i in opts)
      data[i] = opts[i];
    return result.warn(text, data);
  }
  get proxyOf() {
    return this;
  }
};

// src/postcss/comment.js
var Comment = class extends Node {
  static {
    __name(this, "Comment");
  }
  constructor(defaults) {
    super(defaults);
    this.type = "comment";
  }
};

// src/postcss/declaration.js
var Declaration = class extends Node {
  static {
    __name(this, "Declaration");
  }
  constructor(defaults) {
    if (defaults && typeof defaults.value !== "undefined" && typeof defaults.value !== "string") {
      defaults = { ...defaults, value: String(defaults.value) };
    }
    super(defaults);
    this.type = "decl";
  }
  get variable() {
    return this.prop.startsWith("--") || this.prop[0] === "$";
  }
};

// src/postcss/container.js
var AtRule;
var parse;
var Root;
var Rule;
function cleanSource(nodes) {
  return nodes.map((i) => {
    if (i.nodes)
      i.nodes = cleanSource(i.nodes);
    delete i.source;
    return i;
  });
}
__name(cleanSource, "cleanSource");
function markTreeDirty(node) {
  node[isClean] = false;
  if (node.proxyOf.nodes) {
    for (const i of node.proxyOf.nodes) {
      markTreeDirty(i);
    }
  }
}
__name(markTreeDirty, "markTreeDirty");
var Container = class _Container extends Node {
  static {
    __name(this, "Container");
  }
  append(...children) {
    for (const child of children) {
      const nodes = this.normalize(child, this.last);
      for (const node of nodes)
        this.proxyOf.nodes.push(node);
    }
    this.markDirty();
    return this;
  }
  cleanRaws(keepBetween) {
    super.cleanRaws(keepBetween);
    if (this.nodes) {
      for (const node of this.nodes)
        node.cleanRaws(keepBetween);
    }
  }
  each(callback) {
    if (!this.proxyOf.nodes)
      return void 0;
    const iterator = this.getIterator();
    let index, result;
    while (this.indexes[iterator] < this.proxyOf.nodes.length) {
      index = this.indexes[iterator];
      result = callback(this.proxyOf.nodes[index], index);
      if (result === false)
        break;
      this.indexes[iterator] += 1;
    }
    delete this.indexes[iterator];
    return result;
  }
  every(condition) {
    return this.nodes.every(condition);
  }
  getIterator() {
    if (!this.lastEach)
      this.lastEach = 0;
    if (!this.indexes)
      this.indexes = {};
    this.lastEach += 1;
    const iterator = this.lastEach;
    this.indexes[iterator] = 0;
    return iterator;
  }
  getProxyProcessor() {
    return {
      get(node, prop) {
        if (prop === "proxyOf") {
          return node;
        } else if (!node[prop]) {
          return node[prop];
        } else if (prop === "each" || typeof prop === "string" && prop.startsWith("walk")) {
          return (...args) => {
            return node[prop](...args.map((i) => {
              if (typeof i === "function") {
                return (child, index) => i(child.toProxy(), index);
              } else {
                return i;
              }
            }));
          };
        } else if (prop === "every" || prop === "some") {
          return (cb) => {
            return node[prop]((child, ...other) => cb(child.toProxy(), ...other));
          };
        } else if (prop === "root") {
          return () => node.root().toProxy();
        } else if (prop === "nodes") {
          return node.nodes.map((i) => i.toProxy());
        } else if (prop === "first" || prop === "last") {
          return node[prop].toProxy();
        } else {
          return node[prop];
        }
      },
      set(node, prop, value) {
        if (node[prop] === value)
          return true;
        node[prop] = value;
        if (prop === "name" || prop === "params" || prop === "selector") {
          node.markDirty();
        }
        return true;
      }
    };
  }
  index(child) {
    if (typeof child === "number")
      return child;
    if (child.proxyOf)
      child = child.proxyOf;
    return this.proxyOf.nodes.indexOf(child);
  }
  insertAfter(exist, add) {
    let existIndex = this.index(exist);
    const nodes = this.normalize(add, this.proxyOf.nodes[existIndex]).reverse();
    existIndex = this.index(exist);
    for (const node of nodes)
      this.proxyOf.nodes.splice(existIndex + 1, 0, node);
    let index;
    for (const id2 in this.indexes) {
      index = this.indexes[id2];
      if (existIndex < index) {
        this.indexes[id2] = index + nodes.length;
      }
    }
    this.markDirty();
    return this;
  }
  insertBefore(exist, add) {
    let existIndex = this.index(exist);
    const type = existIndex === 0 ? "prepend" : false;
    const nodes = this.normalize(add, this.proxyOf.nodes[existIndex], type).reverse();
    existIndex = this.index(exist);
    for (const node of nodes)
      this.proxyOf.nodes.splice(existIndex, 0, node);
    let index;
    for (const id2 in this.indexes) {
      index = this.indexes[id2];
      if (existIndex <= index) {
        this.indexes[id2] = index + nodes.length;
      }
    }
    this.markDirty();
    return this;
  }
  normalize(nodes, sample) {
    if (typeof nodes === "string") {
      nodes = cleanSource(parse(nodes).nodes);
    } else if (typeof nodes === "undefined") {
      nodes = [];
    } else if (Array.isArray(nodes)) {
      nodes = nodes.slice(0);
      for (const i of nodes) {
        if (i.parent)
          i.parent.removeChild(i, "ignore");
      }
    } else if (nodes.type === "root" && this.type !== "document") {
      nodes = nodes.nodes.slice(0);
      for (const i of nodes) {
        if (i.parent)
          i.parent.removeChild(i, "ignore");
      }
    } else if (nodes.type) {
      nodes = [nodes];
    } else if (nodes.prop) {
      if (typeof nodes.value === "undefined") {
        throw new Error("Value field is missed in node creation");
      } else if (typeof nodes.value !== "string") {
        nodes.value = String(nodes.value);
      }
      nodes = [new Declaration(nodes)];
    } else if (nodes.selector || nodes.selectors) {
      nodes = [new Rule(nodes)];
    } else if (nodes.name) {
      nodes = [new AtRule(nodes)];
    } else if (nodes.text) {
      nodes = [new Comment(nodes)];
    } else {
      throw new Error("Unknown node type in node creation");
    }
    const processed = nodes.map((i) => {
      if (!i[my])
        _Container.rebuild(i);
      i = i.proxyOf;
      if (i.parent)
        i.parent.removeChild(i);
      if (i[isClean])
        markTreeDirty(i);
      if (!i.raws)
        i.raws = {};
      if (typeof i.raws.before === "undefined") {
        if (sample && typeof sample.raws.before !== "undefined") {
          i.raws.before = sample.raws.before.replace(/\S/g, "");
        }
      }
      i.parent = this.proxyOf;
      return i;
    });
    return processed;
  }
  prepend(...children) {
    children = children.reverse();
    for (const child of children) {
      const nodes = this.normalize(child, this.first, "prepend").reverse();
      for (const node of nodes)
        this.proxyOf.nodes.unshift(node);
      for (const id2 in this.indexes) {
        this.indexes[id2] = this.indexes[id2] + nodes.length;
      }
    }
    this.markDirty();
    return this;
  }
  push(child) {
    child.parent = this;
    this.proxyOf.nodes.push(child);
    return this;
  }
  removeAll() {
    for (const node of this.proxyOf.nodes)
      node.parent = void 0;
    this.proxyOf.nodes = [];
    this.markDirty();
    return this;
  }
  removeChild(child) {
    child = this.index(child);
    this.proxyOf.nodes[child].parent = void 0;
    this.proxyOf.nodes.splice(child, 1);
    let index;
    for (const id2 in this.indexes) {
      index = this.indexes[id2];
      if (index >= child) {
        this.indexes[id2] = index - 1;
      }
    }
    this.markDirty();
    return this;
  }
  replaceValues(pattern, opts, callback) {
    if (!callback) {
      callback = opts;
      opts = {};
    }
    this.walkDecls((decl) => {
      if (opts.props && !opts.props.includes(decl.prop))
        return;
      if (opts.fast && !decl.value.includes(opts.fast))
        return;
      decl.value = decl.value.replace(pattern, callback);
    });
    this.markDirty();
    return this;
  }
  some(condition) {
    return this.nodes.some(condition);
  }
  walk(callback) {
    return this.each((child, i) => {
      let result;
      try {
        result = callback(child, i);
      } catch (e) {
        throw child.addToError(e);
      }
      if (result !== false && child.walk) {
        result = child.walk(callback);
      }
      return result;
    });
  }
  walkAtRules(name, callback) {
    if (!callback) {
      callback = name;
      return this.walk((child, i) => {
        if (child.type === "atrule") {
          return callback(child, i);
        }
      });
    }
    if (name instanceof RegExp) {
      return this.walk((child, i) => {
        if (child.type === "atrule" && name.test(child.name)) {
          return callback(child, i);
        }
      });
    }
    return this.walk((child, i) => {
      if (child.type === "atrule" && child.name === name) {
        return callback(child, i);
      }
    });
  }
  walkComments(callback) {
    return this.walk((child, i) => {
      if (child.type === "comment") {
        return callback(child, i);
      }
    });
  }
  walkDecls(prop, callback) {
    if (!callback) {
      callback = prop;
      return this.walk((child, i) => {
        if (child.type === "decl") {
          return callback(child, i);
        }
      });
    }
    if (prop instanceof RegExp) {
      return this.walk((child, i) => {
        if (child.type === "decl" && prop.test(child.prop)) {
          return callback(child, i);
        }
      });
    }
    return this.walk((child, i) => {
      if (child.type === "decl" && child.prop === prop) {
        return callback(child, i);
      }
    });
  }
  walkRules(selector2, callback) {
    if (!callback) {
      callback = selector2;
      return this.walk((child, i) => {
        if (child.type === "rule") {
          return callback(child, i);
        }
      });
    }
    if (selector2 instanceof RegExp) {
      return this.walk((child, i) => {
        if (child.type === "rule" && selector2.test(child.selector)) {
          return callback(child, i);
        }
      });
    }
    return this.walk((child, i) => {
      if (child.type === "rule" && child.selector === selector2) {
        return callback(child, i);
      }
    });
  }
  get first() {
    if (!this.proxyOf.nodes)
      return void 0;
    return this.proxyOf.nodes[0];
  }
  get last() {
    if (!this.proxyOf.nodes)
      return void 0;
    return this.proxyOf.nodes[this.proxyOf.nodes.length - 1];
  }
};
Container.registerParse = (dependant) => {
  parse = dependant;
};
Container.registerRule = (dependant) => {
  Rule = dependant;
};
Container.registerAtRule = (dependant) => {
  AtRule = dependant;
};
Container.registerRoot = (dependant) => {
  Root = dependant;
};
Container.rebuild = (node) => {
  if (node.type === "atrule") {
    Object.setPrototypeOf(node, AtRule.prototype);
  } else if (node.type === "rule") {
    Object.setPrototypeOf(node, Rule.prototype);
  } else if (node.type === "decl") {
    Object.setPrototypeOf(node, Declaration.prototype);
  } else if (node.type === "comment") {
    Object.setPrototypeOf(node, Comment.prototype);
  } else if (node.type === "root") {
    Object.setPrototypeOf(node, Root.prototype);
  }
  node[my] = true;
  if (node.nodes) {
    node.nodes.forEach((child) => {
      Container.rebuild(child);
    });
  }
};

// src/postcss/at-rule.js
var AtRule2 = class extends Container {
  static {
    __name(this, "AtRule");
  }
  constructor(defaults) {
    super(defaults);
    this.type = "atrule";
  }
  append(...children) {
    if (!this.proxyOf.nodes)
      this.nodes = [];
    return super.append(...children);
  }
  prepend(...children) {
    if (!this.proxyOf.nodes)
      this.nodes = [];
    return super.prepend(...children);
  }
};
Container.registerAtRule(AtRule2);

// src/postcss/root.js
var LazyResult;
var Processor;
var Root2 = class extends Container {
  static {
    __name(this, "Root");
  }
  constructor(defaults) {
    super(defaults);
    this.type = "root";
    if (!this.nodes)
      this.nodes = [];
  }
  normalize(child, sample, type) {
    const nodes = super.normalize(child);
    if (sample) {
      if (type === "prepend") {
        if (this.nodes.length > 1) {
          sample.raws.before = this.nodes[1].raws.before;
        } else {
          delete sample.raws.before;
        }
      } else if (this.first !== sample) {
        for (const node of nodes) {
          node.raws.before = sample.raws.before;
        }
      }
    }
    return nodes;
  }
  removeChild(child, ignore) {
    const index = this.index(child);
    if (!ignore && index === 0 && this.nodes.length > 1) {
      this.nodes[1].raws.before = this.nodes[index].raws.before;
    }
    return super.removeChild(child);
  }
  toResult(opts = {}) {
    const lazy = new LazyResult(new Processor(), this, opts);
    return lazy.stringify();
  }
  static registerLazyResult = /* @__PURE__ */ __name((dependant) => {
    LazyResult = dependant;
  }, "registerLazyResult");
  static registerProcessor = /* @__PURE__ */ __name((dependant) => {
    Processor = dependant;
  }, "registerProcessor");
};
Container.registerRoot(Root2);

// src/postcss/list.js
var list = {
  comma(string2) {
    return list.split(string2, [","], true);
  },
  space(string2) {
    const spaces = [" ", "\n", "	"];
    return list.split(string2, spaces);
  },
  split(string2, separators, last) {
    const array = [];
    let current = "";
    let split = false;
    let func = 0;
    let inQuote = false;
    let prevQuote = "";
    let escape = false;
    for (const letter of string2) {
      if (escape) {
        escape = false;
      } else if (letter === "\\") {
        escape = true;
      } else if (inQuote) {
        if (letter === prevQuote) {
          inQuote = false;
        }
      } else if (letter === '"' || letter === "'") {
        inQuote = true;
        prevQuote = letter;
      } else if (letter === "(") {
        func += 1;
      } else if (letter === ")") {
        if (func > 0)
          func -= 1;
      } else if (func === 0) {
        if (separators.includes(letter))
          split = true;
      }
      if (split) {
        if (current !== "")
          array.push(current.trim());
        current = "";
        split = false;
      } else {
        current += letter;
      }
    }
    if (last || current !== "")
      array.push(current.trim());
    return array;
  }
};

// src/postcss/rule.js
var Rule2 = class extends Container {
  static {
    __name(this, "Rule");
  }
  constructor(defaults) {
    super(defaults);
    this.type = "rule";
    if (!this.nodes)
      this.nodes = [];
  }
  get selectors() {
    return list.comma(this.selector);
  }
  set selectors(values) {
    const match = this.selector ? this.selector.match(/,\s*/) : null;
    const sep = match ? match[0] : "," + this.raw("between", "beforeOpen");
    this.selector = values.join(sep);
  }
};
Container.registerRule(Rule2);

// src/postcss/input.js
var fromOffsetCache = Symbol("fromOffsetCache");
var Input = class {
  static {
    __name(this, "Input");
  }
  constructor(css, opts = {}) {
    if (css === null || typeof css === "undefined" || typeof css === "object" && !css.toString) {
      throw new Error(`PostCSS received ${css} instead of CSS string`);
    }
    this.css = css.toString();
    if (this.css[0] === "\uFEFF" || this.css[0] === "\uFFFE") {
      this.hasBOM = true;
      this.css = this.css.slice(1);
    } else {
      this.hasBOM = false;
    }
    if (this.map)
      this.map.file = this.from;
  }
  error(message, line, column, opts = {}) {
    let endColumn, endLine, result;
    if (line && typeof line === "object") {
      const start = line;
      const end = column;
      if (typeof start.offset === "number") {
        const pos = this.fromOffset(start.offset);
        line = pos.line;
        column = pos.col;
      } else {
        line = start.line;
        column = start.column;
      }
      if (typeof end.offset === "number") {
        const pos = this.fromOffset(end.offset);
        endLine = pos.line;
        endColumn = pos.col;
      } else {
        endLine = end.line;
        endColumn = end.column;
      }
    } else if (!column) {
      const pos = this.fromOffset(line);
      line = pos.line;
      column = pos.col;
    }
    const origin = this.origin(line, column, endLine, endColumn);
    if (origin) {
      result = new CssSyntaxError(message, origin.endLine === void 0 ? origin.line : { column: origin.column, line: origin.line }, origin.endLine === void 0 ? origin.column : { column: origin.endColumn, line: origin.endLine }, origin.source, origin.file, opts.plugin);
    } else {
      result = new CssSyntaxError(message, endLine === void 0 ? line : { column, line }, endLine === void 0 ? column : { column: endColumn, line: endLine }, this.css, this.file, opts.plugin);
    }
    result.input = { column, endColumn, endLine, line, source: this.css };
    if (this.file) {
      result.input.file = this.file;
    }
    return result;
  }
  fromOffset(offset) {
    let lastLine, lineToIndex;
    if (!this[fromOffsetCache]) {
      const lines = this.css.split("\n");
      lineToIndex = new Array(lines.length);
      let prevIndex = 0;
      for (let i = 0, l = lines.length; i < l; i++) {
        lineToIndex[i] = prevIndex;
        prevIndex += lines[i].length + 1;
      }
      this[fromOffsetCache] = lineToIndex;
    } else {
      lineToIndex = this[fromOffsetCache];
    }
    lastLine = lineToIndex[lineToIndex.length - 1];
    let min = 0;
    if (offset >= lastLine) {
      min = lineToIndex.length - 1;
    } else {
      let max = lineToIndex.length - 2;
      let mid;
      while (min < max) {
        mid = min + (max - min >> 1);
        if (offset < lineToIndex[mid]) {
          max = mid - 1;
        } else if (offset >= lineToIndex[mid + 1]) {
          min = mid + 1;
        } else {
          min = mid;
          break;
        }
      }
    }
    return {
      col: offset - lineToIndex[min] + 1,
      line: min + 1
    };
  }
  origin(line, column, endLine, endColumn) {
    if (!this.map)
      return false;
    const consumer = this.map.consumer();
    const from = consumer.originalPositionFor({ column, line });
    if (!from.source)
      return false;
    let to;
    if (typeof endLine === "number") {
      to = consumer.originalPositionFor({ column: endColumn, line: endLine });
    }
    let fromUrl;
    fromUrl = new URL(from.source, this.map.consumer().sourceRoot || pathToFileURL(this.map.mapFile));
    const result = {
      column: from.column,
      endColumn: to && to.column,
      endLine: to && to.line,
      line: from.line,
      url: fromUrl.toString()
    };
    const source = consumer.sourceContentFor(from.source);
    if (source)
      result.source = source;
    return result;
  }
  toJSON() {
    const json = {};
    for (const name of ["hasBOM", "css", "file", "id"]) {
      if (this[name] != null) {
        json[name] = this[name];
      }
    }
    if (this.map) {
      json.map = { ...this.map };
      if (json.map.consumerCache) {
        json.map.consumerCache = void 0;
      }
    }
    return json;
  }
  get from() {
    return this.file || this.id;
  }
};

// src/postcss/tokenize.js
var SINGLE_QUOTE = "'".charCodeAt(0);
var DOUBLE_QUOTE = '"'.charCodeAt(0);
var BACKSLASH = "\\".charCodeAt(0);
var SLASH = "/".charCodeAt(0);
var NEWLINE = "\n".charCodeAt(0);
var SPACE = " ".charCodeAt(0);
var FEED = "\f".charCodeAt(0);
var TAB = "	".charCodeAt(0);
var CR = "\r".charCodeAt(0);
var OPEN_SQUARE = "[".charCodeAt(0);
var CLOSE_SQUARE = "]".charCodeAt(0);
var OPEN_PARENTHESES = "(".charCodeAt(0);
var CLOSE_PARENTHESES = ")".charCodeAt(0);
var OPEN_CURLY = "{".charCodeAt(0);
var CLOSE_CURLY = "}".charCodeAt(0);
var SEMICOLON = ";".charCodeAt(0);
var ASTERISK = "*".charCodeAt(0);
var COLON = ":".charCodeAt(0);
var AT = "@".charCodeAt(0);
var RE_AT_END = /[\t\n\f\r "#'()/;[\\\]{}]/g;
var RE_WORD_END = /[\t\n\f\r !"#'():;@[\\\]{}]|\/(?=\*)/g;
var RE_BAD_BRACKET = /.[\r\n"'(/\\]/;
var RE_HEX_ESCAPE = /[\da-f]/i;
function tokenizer(input, options = {}) {
  const css = input.css.valueOf();
  const ignore = options.ignoreErrors;
  let code, content, escape, next, quote;
  let currentToken, escaped, escapePos, n, prev;
  const length = css.length;
  let pos = 0;
  const buffer = [];
  const returned = [];
  function position() {
    return pos;
  }
  __name(position, "position");
  function unclosed(what) {
    throw input.error("Unclosed " + what, pos);
  }
  __name(unclosed, "unclosed");
  function endOfFile() {
    return returned.length === 0 && pos >= length;
  }
  __name(endOfFile, "endOfFile");
  function nextToken(opts) {
    if (returned.length)
      return returned.pop();
    if (pos >= length)
      return;
    const ignoreUnclosed = opts ? opts.ignoreUnclosed : false;
    code = css.charCodeAt(pos);
    switch (code) {
      case NEWLINE:
      case SPACE:
      case TAB:
      case CR:
      case FEED: {
        next = pos;
        do {
          next += 1;
          code = css.charCodeAt(next);
        } while (code === SPACE || code === NEWLINE || code === TAB || code === CR || code === FEED);
        currentToken = ["space", css.slice(pos, next)];
        pos = next - 1;
        break;
      }
      case OPEN_SQUARE:
      case CLOSE_SQUARE:
      case OPEN_CURLY:
      case CLOSE_CURLY:
      case COLON:
      case SEMICOLON:
      case CLOSE_PARENTHESES: {
        const controlChar = String.fromCharCode(code);
        currentToken = [controlChar, controlChar, pos];
        break;
      }
      case OPEN_PARENTHESES: {
        prev = buffer.length ? buffer.pop()[1] : "";
        n = css.charCodeAt(pos + 1);
        if (prev === "url" && n !== SINGLE_QUOTE && n !== DOUBLE_QUOTE && n !== SPACE && n !== NEWLINE && n !== TAB && n !== FEED && n !== CR) {
          next = pos;
          do {
            escaped = false;
            next = css.indexOf(")", next + 1);
            if (next === -1) {
              if (ignore || ignoreUnclosed) {
                next = pos;
                break;
              } else {
                unclosed("bracket");
              }
            }
            escapePos = next;
            while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
              escapePos -= 1;
              escaped = !escaped;
            }
          } while (escaped);
          currentToken = ["brackets", css.slice(pos, next + 1), pos, next];
          pos = next;
        } else {
          next = css.indexOf(")", pos + 1);
          content = css.slice(pos, next + 1);
          if (next === -1 || RE_BAD_BRACKET.test(content)) {
            currentToken = ["(", "(", pos];
          } else {
            currentToken = ["brackets", content, pos, next];
            pos = next;
          }
        }
        break;
      }
      case SINGLE_QUOTE:
      case DOUBLE_QUOTE: {
        quote = code === SINGLE_QUOTE ? "'" : '"';
        next = pos;
        do {
          escaped = false;
          next = css.indexOf(quote, next + 1);
          if (next === -1) {
            if (ignore || ignoreUnclosed) {
              next = pos + 1;
              break;
            } else {
              unclosed("string");
            }
          }
          escapePos = next;
          while (css.charCodeAt(escapePos - 1) === BACKSLASH) {
            escapePos -= 1;
            escaped = !escaped;
          }
        } while (escaped);
        currentToken = ["string", css.slice(pos, next + 1), pos, next];
        pos = next;
        break;
      }
      case AT: {
        RE_AT_END.lastIndex = pos + 1;
        RE_AT_END.test(css);
        if (RE_AT_END.lastIndex === 0) {
          next = css.length - 1;
        } else {
          next = RE_AT_END.lastIndex - 2;
        }
        currentToken = ["at-word", css.slice(pos, next + 1), pos, next];
        pos = next;
        break;
      }
      case BACKSLASH: {
        next = pos;
        escape = true;
        while (css.charCodeAt(next + 1) === BACKSLASH) {
          next += 1;
          escape = !escape;
        }
        code = css.charCodeAt(next + 1);
        if (escape && code !== SLASH && code !== SPACE && code !== NEWLINE && code !== TAB && code !== CR && code !== FEED) {
          next += 1;
          if (RE_HEX_ESCAPE.test(css.charAt(next))) {
            while (RE_HEX_ESCAPE.test(css.charAt(next + 1))) {
              next += 1;
            }
            if (css.charCodeAt(next + 1) === SPACE) {
              next += 1;
            }
          }
        }
        currentToken = ["word", css.slice(pos, next + 1), pos, next];
        pos = next;
        break;
      }
      default: {
        if (code === SLASH && css.charCodeAt(pos + 1) === ASTERISK) {
          next = css.indexOf("*/", pos + 2) + 1;
          if (next === 0) {
            if (ignore || ignoreUnclosed) {
              next = css.length;
            } else {
              unclosed("comment");
            }
          }
          currentToken = ["comment", css.slice(pos, next + 1), pos, next];
          pos = next;
        } else {
          RE_WORD_END.lastIndex = pos + 1;
          RE_WORD_END.test(css);
          if (RE_WORD_END.lastIndex === 0) {
            next = css.length - 1;
          } else {
            next = RE_WORD_END.lastIndex - 2;
          }
          currentToken = ["word", css.slice(pos, next + 1), pos, next];
          buffer.push(currentToken);
          pos = next;
        }
        break;
      }
    }
    pos++;
    return currentToken;
  }
  __name(nextToken, "nextToken");
  function back(token) {
    returned.push(token);
  }
  __name(back, "back");
  return {
    back,
    endOfFile,
    nextToken,
    position
  };
}
__name(tokenizer, "tokenizer");

// src/postcss/parser.js
var SAFE_COMMENT_NEIGHBOR = {
  empty: true,
  space: true
};
function findLastWithPosition(tokens) {
  for (let i = tokens.length - 1; i >= 0; i--) {
    const token = tokens[i];
    const pos = token[3] || token[2];
    if (pos)
      return pos;
  }
}
__name(findLastWithPosition, "findLastWithPosition");
var Parser = class {
  static {
    __name(this, "Parser");
  }
  constructor(input) {
    this.input = input;
    this.root = new Root2();
    this.current = this.root;
    this.spaces = "";
    this.semicolon = false;
    this.createTokenizer();
    this.root.source = { input, start: { column: 1, line: 1, offset: 0 } };
  }
  atrule(token) {
    const node = new AtRule2();
    node.name = token[1].slice(1);
    if (node.name === "") {
      this.unnamedAtrule(node, token);
    }
    this.init(node, token[2]);
    let type;
    let prev;
    let shift;
    let last = false;
    let open = false;
    const params = [];
    const brackets = [];
    while (!this.tokenizer.endOfFile()) {
      token = this.tokenizer.nextToken();
      type = token[0];
      if (type === "(" || type === "[") {
        brackets.push(type === "(" ? ")" : "]");
      } else if (type === "{" && brackets.length > 0) {
        brackets.push("}");
      } else if (type === brackets[brackets.length - 1]) {
        brackets.pop();
      }
      if (brackets.length === 0) {
        if (type === ";") {
          node.source.end = this.getPosition(token[2]);
          node.source.end.offset++;
          this.semicolon = true;
          break;
        } else if (type === "{") {
          open = true;
          break;
        } else if (type === "}") {
          if (params.length > 0) {
            shift = params.length - 1;
            prev = params[shift];
            while (prev && prev[0] === "space") {
              prev = params[--shift];
            }
            if (prev) {
              node.source.end = this.getPosition(prev[3] || prev[2]);
              node.source.end.offset++;
            }
          }
          this.end(token);
          break;
        } else {
          params.push(token);
        }
      } else {
        params.push(token);
      }
      if (this.tokenizer.endOfFile()) {
        last = true;
        break;
      }
    }
    node.raws.between = this.spacesAndCommentsFromEnd(params);
    if (params.length) {
      node.raws.afterName = this.spacesAndCommentsFromStart(params);
      this.raw(node, "params", params);
      if (last) {
        token = params[params.length - 1];
        node.source.end = this.getPosition(token[3] || token[2]);
        node.source.end.offset++;
        this.spaces = node.raws.between;
        node.raws.between = "";
      }
    } else {
      node.raws.afterName = "";
      node.params = "";
    }
    if (open) {
      node.nodes = [];
      this.current = node;
    }
  }
  checkMissedSemicolon(tokens) {
    const colon2 = this.colon(tokens);
    if (colon2 === false)
      return;
    let founded = 0;
    let token;
    for (let j = colon2 - 1; j >= 0; j--) {
      token = tokens[j];
      if (token[0] !== "space") {
        founded += 1;
        if (founded === 2)
          break;
      }
    }
    throw this.input.error("Missed semicolon", token[0] === "word" ? token[3] + 1 : token[2]);
  }
  colon(tokens) {
    let brackets = 0;
    let prev, token, type;
    for (const [i, element] of tokens.entries()) {
      token = element;
      type = token[0];
      if (type === "(") {
        brackets += 1;
      }
      if (type === ")") {
        brackets -= 1;
      }
      if (brackets === 0 && type === ":") {
        if (!prev) {
          this.doubleColon(token);
        } else if (prev[0] === "word" && prev[1] === "progid") {
          continue;
        } else {
          return i;
        }
      }
      prev = token;
    }
    return false;
  }
  comment(token) {
    const node = new Comment();
    this.init(node, token[2]);
    node.source.end = this.getPosition(token[3] || token[2]);
    node.source.end.offset++;
    const text = token[1].slice(2, -2);
    if (/^\s*$/.test(text)) {
      node.text = "";
      node.raws.left = text;
      node.raws.right = "";
    } else {
      const match = text.match(/^(\s*)([^]*\S)(\s*)$/);
      node.text = match[2];
      node.raws.left = match[1];
      node.raws.right = match[3];
    }
  }
  createTokenizer() {
    this.tokenizer = tokenizer(this.input);
  }
  decl(tokens, customProperty) {
    const node = new Declaration();
    this.init(node, tokens[0][2]);
    const last = tokens[tokens.length - 1];
    if (last[0] === ";") {
      this.semicolon = true;
      tokens.pop();
    }
    node.source.end = this.getPosition(last[3] || last[2] || findLastWithPosition(tokens));
    node.source.end.offset++;
    while (tokens[0][0] !== "word") {
      if (tokens.length === 1)
        this.unknownWord(tokens);
      node.raws.before += tokens.shift()[1];
    }
    node.source.start = this.getPosition(tokens[0][2]);
    node.prop = "";
    while (tokens.length) {
      const type = tokens[0][0];
      if (type === ":" || type === "space" || type === "comment") {
        break;
      }
      node.prop += tokens.shift()[1];
    }
    node.raws.between = "";
    let token;
    while (tokens.length) {
      token = tokens.shift();
      if (token[0] === ":") {
        node.raws.between += token[1];
        break;
      } else {
        if (token[0] === "word" && /\w/.test(token[1])) {
          this.unknownWord([token]);
        }
        node.raws.between += token[1];
      }
    }
    if (node.prop[0] === "_" || node.prop[0] === "*") {
      node.raws.before += node.prop[0];
      node.prop = node.prop.slice(1);
    }
    let firstSpaces = [];
    let next;
    while (tokens.length) {
      next = tokens[0][0];
      if (next !== "space" && next !== "comment")
        break;
      firstSpaces.push(tokens.shift());
    }
    this.precheckMissedSemicolon(tokens);
    for (let i = tokens.length - 1; i >= 0; i--) {
      token = tokens[i];
      if (token[1].toLowerCase() === "!important") {
        node.important = true;
        let string2 = this.stringFrom(tokens, i);
        string2 = this.spacesFromEnd(tokens) + string2;
        if (string2 !== " !important")
          node.raws.important = string2;
        break;
      } else if (token[1].toLowerCase() === "important") {
        const cache = tokens.slice(0);
        let str2 = "";
        for (let j = i; j > 0; j--) {
          const type = cache[j][0];
          if (str2.trim().startsWith("!") && type !== "space") {
            break;
          }
          str2 = cache.pop()[1] + str2;
        }
        if (str2.trim().startsWith("!")) {
          node.important = true;
          node.raws.important = str2;
          tokens = cache;
        }
      }
      if (token[0] !== "space" && token[0] !== "comment") {
        break;
      }
    }
    const hasWord = tokens.some((i) => i[0] !== "space" && i[0] !== "comment");
    if (hasWord) {
      node.raws.between += firstSpaces.map((i) => i[1]).join("");
      firstSpaces = [];
    }
    this.raw(node, "value", firstSpaces.concat(tokens), customProperty);
    if (node.value.includes(":") && !customProperty) {
      this.checkMissedSemicolon(tokens);
    }
  }
  doubleColon(token) {
    throw this.input.error("Double colon", { offset: token[2] }, { offset: token[2] + token[1].length });
  }
  emptyRule(token) {
    const node = new Rule2();
    this.init(node, token[2]);
    node.selector = "";
    node.raws.between = "";
    this.current = node;
  }
  end(token) {
    if (this.current.nodes && this.current.nodes.length) {
      this.current.raws.semicolon = this.semicolon;
    }
    this.semicolon = false;
    this.current.raws.after = (this.current.raws.after || "") + this.spaces;
    this.spaces = "";
    if (this.current.parent) {
      this.current.source.end = this.getPosition(token[2]);
      this.current.source.end.offset++;
      this.current = this.current.parent;
    } else {
      this.unexpectedClose(token);
    }
  }
  endFile() {
    if (this.current.parent)
      this.unclosedBlock();
    if (this.current.nodes && this.current.nodes.length) {
      this.current.raws.semicolon = this.semicolon;
    }
    this.current.raws.after = (this.current.raws.after || "") + this.spaces;
    this.root.source.end = this.getPosition(this.tokenizer.position());
  }
  freeSemicolon(token) {
    this.spaces += token[1];
    if (this.current.nodes) {
      const prev = this.current.nodes[this.current.nodes.length - 1];
      if (prev && prev.type === "rule" && !prev.raws.ownSemicolon) {
        prev.raws.ownSemicolon = this.spaces;
        this.spaces = "";
      }
    }
  }
  // Helpers
  getPosition(offset) {
    const pos = this.input.fromOffset(offset);
    return {
      column: pos.col,
      line: pos.line,
      offset
    };
  }
  init(node, offset) {
    this.current.push(node);
    node.source = {
      input: this.input,
      start: this.getPosition(offset)
    };
    node.raws.before = this.spaces;
    this.spaces = "";
    if (node.type !== "comment")
      this.semicolon = false;
  }
  other(start) {
    let end = false;
    let type = null;
    let colon2 = false;
    let bracket = null;
    const brackets = [];
    const customProperty = start[1].startsWith("--");
    const tokens = [];
    let token = start;
    while (token) {
      type = token[0];
      tokens.push(token);
      if (type === "(" || type === "[") {
        if (!bracket)
          bracket = token;
        brackets.push(type === "(" ? ")" : "]");
      } else if (customProperty && colon2 && type === "{") {
        if (!bracket)
          bracket = token;
        brackets.push("}");
      } else if (brackets.length === 0) {
        if (type === ";") {
          if (colon2) {
            this.decl(tokens, customProperty);
            return;
          } else {
            break;
          }
        } else if (type === "{") {
          this.rule(tokens);
          return;
        } else if (type === "}") {
          this.tokenizer.back(tokens.pop());
          end = true;
          break;
        } else if (type === ":") {
          colon2 = true;
        }
      } else if (type === brackets[brackets.length - 1]) {
        brackets.pop();
        if (brackets.length === 0)
          bracket = null;
      }
      token = this.tokenizer.nextToken();
    }
    if (this.tokenizer.endOfFile())
      end = true;
    if (brackets.length > 0)
      this.unclosedBracket(bracket);
    if (end && colon2) {
      if (!customProperty) {
        while (tokens.length) {
          token = tokens[tokens.length - 1][0];
          if (token !== "space" && token !== "comment")
            break;
          this.tokenizer.back(tokens.pop());
        }
      }
      this.decl(tokens, customProperty);
    } else {
      this.unknownWord(tokens);
    }
  }
  parse() {
    let token;
    while (!this.tokenizer.endOfFile()) {
      token = this.tokenizer.nextToken();
      switch (token[0]) {
        case "space":
          this.spaces += token[1];
          break;
        case ";":
          this.freeSemicolon(token);
          break;
        case "}":
          this.end(token);
          break;
        case "comment":
          this.comment(token);
          break;
        case "at-word":
          this.atrule(token);
          break;
        case "{":
          this.emptyRule(token);
          break;
        default:
          this.other(token);
          break;
      }
    }
    this.endFile();
  }
  precheckMissedSemicolon() {
  }
  raw(node, prop, tokens, customProperty) {
    let token, type;
    const length = tokens.length;
    let value = "";
    let clean = true;
    let next, prev;
    for (let i = 0; i < length; i += 1) {
      token = tokens[i];
      type = token[0];
      if (type === "space" && i === length - 1 && !customProperty) {
        clean = false;
      } else if (type === "comment") {
        prev = tokens[i - 1] ? tokens[i - 1][0] : "empty";
        next = tokens[i + 1] ? tokens[i + 1][0] : "empty";
        if (!SAFE_COMMENT_NEIGHBOR[prev] && !SAFE_COMMENT_NEIGHBOR[next]) {
          if (value.slice(-1) === ",") {
            clean = false;
          } else {
            value += token[1];
          }
        } else {
          clean = false;
        }
      } else {
        value += token[1];
      }
    }
    if (!clean) {
      const raw = tokens.reduce((all, i) => all + i[1], "");
      node.raws[prop] = { raw, value };
    }
    node[prop] = value;
  }
  rule(tokens) {
    tokens.pop();
    const node = new Rule2();
    this.init(node, tokens[0][2]);
    node.raws.between = this.spacesAndCommentsFromEnd(tokens);
    this.raw(node, "selector", tokens);
    this.current = node;
  }
  spacesAndCommentsFromEnd(tokens) {
    let lastTokenType;
    let spaces = "";
    while (tokens.length) {
      lastTokenType = tokens[tokens.length - 1][0];
      if (lastTokenType !== "space" && lastTokenType !== "comment")
        break;
      spaces = tokens.pop()[1] + spaces;
    }
    return spaces;
  }
  // Errors
  spacesAndCommentsFromStart(tokens) {
    let next;
    let spaces = "";
    while (tokens.length) {
      next = tokens[0][0];
      if (next !== "space" && next !== "comment")
        break;
      spaces += tokens.shift()[1];
    }
    return spaces;
  }
  spacesFromEnd(tokens) {
    let lastTokenType;
    let spaces = "";
    while (tokens.length) {
      lastTokenType = tokens[tokens.length - 1][0];
      if (lastTokenType !== "space")
        break;
      spaces = tokens.pop()[1] + spaces;
    }
    return spaces;
  }
  stringFrom(tokens, from) {
    let result = "";
    for (let i = from; i < tokens.length; i++) {
      result += tokens[i][1];
    }
    tokens.splice(from, tokens.length - from);
    return result;
  }
  unclosedBlock() {
    const pos = this.current.source.start;
    throw this.input.error("Unclosed block", pos.line, pos.column);
  }
  unclosedBracket(bracket) {
    throw this.input.error("Unclosed bracket", { offset: bracket[2] }, { offset: bracket[2] + 1 });
  }
  unexpectedClose(token) {
    throw this.input.error("Unexpected }", { offset: token[2] }, { offset: token[2] + 1 });
  }
  unknownWord(tokens) {
    throw this.input.error("Unknown word", { offset: tokens[0][2] }, { offset: tokens[0][2] + tokens[0][1].length });
  }
  unnamedAtrule(node, token) {
    throw this.input.error("At-rule without name", { offset: token[2] }, { offset: token[2] + token[1].length });
  }
};

// src/postcss/parse.js
function parse2(css, opts) {
  const input = new Input(css, opts);
  const parser2 = new Parser(input);
  try {
    parser2.parse();
  } catch (e) {
    if (process.env.NODE_ENV !== "production") {
      if (e.name === "CssSyntaxError" && opts && opts.from) {
        if (/\.scss$/i.test(opts.from)) {
          e.message += "\nYou tried to parse SCSS with the standard CSS parser; try again with the postcss-scss parser";
        } else if (/\.sass/i.test(opts.from)) {
          e.message += "\nYou tried to parse Sass with the standard CSS parser; try again with the postcss-sass parser";
        } else if (/\.less$/i.test(opts.from)) {
          e.message += "\nYou tried to parse Less with the standard CSS parser; try again with the postcss-less parser";
        }
      }
    }
    throw e;
  }
  return parser2.root;
}
__name(parse2, "parse");
Container.registerParse(parse2);

// src/postcss/document.js
var LazyResult2;
var Processor2;
var Document = class extends Container {
  static {
    __name(this, "Document");
  }
  constructor(defaults) {
    super({ type: "document", ...defaults });
    if (!this.nodes) {
      this.nodes = [];
    }
  }
  toResult(opts = {}) {
    const lazy = new LazyResult2(new Processor2(), this, opts);
    return lazy.stringify();
  }
};
Document.registerLazyResult = (dependant) => {
  LazyResult2 = dependant;
};
Document.registerProcessor = (dependant) => {
  Processor2 = dependant;
};

// src/postcss/fromJSON.js
function fromJSON(json, inputs) {
  if (Array.isArray(json))
    return json.map((n) => fromJSON(n));
  const { inputs: ownInputs, ...defaults } = json;
  if (ownInputs) {
    inputs = [];
    for (const input of ownInputs) {
      const inputHydrated = { ...input, __proto__: Input.prototype };
      if (inputHydrated.map) {
        inputHydrated.map = {
          ...inputHydrated.map
        };
      }
      inputs.push(inputHydrated);
    }
  }
  if (defaults.nodes) {
    defaults.nodes = json.nodes.map((n) => fromJSON(n, inputs));
  }
  if (defaults.source) {
    const { inputId, ...source } = defaults.source;
    defaults.source = source;
    if (inputId != null) {
      defaults.source.input = inputs[inputId];
    }
  }
  if (defaults.type === "root") {
    return new Root2(defaults);
  } else if (defaults.type === "decl") {
    return new Declaration(defaults);
  } else if (defaults.type === "rule") {
    return new Rule2(defaults);
  } else if (defaults.type === "comment") {
    return new Comment(defaults);
  } else if (defaults.type === "atrule") {
    return new AtRule2(defaults);
  } else {
    throw new Error("Unknown node type: " + json.type);
  }
}
__name(fromJSON, "fromJSON");

// src/postcss/map-generator.js
var MapGenerator = class {
  static {
    __name(this, "MapGenerator");
  }
  constructor(stringify3, root2, opts, cssString) {
    this.stringify = stringify3;
    this.mapOpts = opts.map || {};
    this.root = root2;
    this.opts = opts;
    this.css = cssString;
    this.originalCSS = cssString;
    this.usesFileUrls = !this.mapOpts.from && this.mapOpts.absolute;
    this.memoizedFileURLs = /* @__PURE__ */ new Map();
    this.memoizedPaths = /* @__PURE__ */ new Map();
    this.memoizedURLs = /* @__PURE__ */ new Map();
  }
  addAnnotation() {
    let content;
    if (this.isInline()) {
      content = "data:application/json;base64," + this.toBase64(this.map.toString());
    } else if (typeof this.mapOpts.annotation === "string") {
      content = this.mapOpts.annotation;
    } else if (typeof this.mapOpts.annotation === "function") {
      content = this.mapOpts.annotation(this.opts.to, this.root);
    } else {
      content = this.outputFile() + ".map";
    }
    let eol = "\n";
    if (this.css.includes("\r\n"))
      eol = "\r\n";
    this.css += eol + "/*# sourceMappingURL=" + content + " */";
  }
  applyPrevMaps() {
  }
  clearAnnotation() {
    if (this.mapOpts.annotation === false)
      return;
    if (this.root) {
      let node;
      for (let i = this.root.nodes.length - 1; i >= 0; i--) {
        node = this.root.nodes[i];
        if (node.type !== "comment")
          continue;
        if (node.text.startsWith("# sourceMappingURL=")) {
          this.root.removeChild(i);
        }
      }
    } else if (this.css) {
      this.css = this.css.replace(/\n*\/\*#[\S\s]*?\*\/$/gm, "");
    }
  }
  generate() {
    this.clearAnnotation();
    let result = "";
    this.stringify(this.root, (i) => {
      result += i;
    });
    return [result];
  }
  generateMap() {
    if (this.root) {
      this.generateString();
    } else if (this.previous().length === 1) {
      const prev = this.previous()[0].consumer();
      prev.file = this.outputFile();
      this.map = SourceMapGenerator.fromSourceMap(prev, {
        ignoreInvalidMapping: true
      });
    } else {
      this.map = new SourceMapGenerator({
        file: this.outputFile(),
        ignoreInvalidMapping: true
      });
      this.map.addMapping({
        generated: { column: 0, line: 1 },
        original: { column: 0, line: 1 },
        source: this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>"
      });
    }
    if (this.isSourcesContent())
      this.setSourcesContent();
    if (this.root && this.previous().length > 0)
      this.applyPrevMaps();
    if (this.isAnnotation())
      this.addAnnotation();
    if (this.isInline()) {
      return [this.css];
    } else {
      return [this.css, this.map];
    }
  }
  generateString() {
    this.css = "";
    this.map = new SourceMapGenerator({
      file: this.outputFile(),
      ignoreInvalidMapping: true
    });
    let line = 1;
    let column = 1;
    const noSource = "<no source>";
    const mapping = {
      generated: { column: 0, line: 0 },
      original: { column: 0, line: 0 },
      source: ""
    };
    let last, lines;
    this.stringify(this.root, (str2, node, type) => {
      this.css += str2;
      if (node && type !== "end") {
        mapping.generated.line = line;
        mapping.generated.column = column - 1;
        if (node.source && node.source.start) {
          mapping.source = this.sourcePath(node);
          mapping.original.line = node.source.start.line;
          mapping.original.column = node.source.start.column - 1;
          this.map.addMapping(mapping);
        } else {
          mapping.source = noSource;
          mapping.original.line = 1;
          mapping.original.column = 0;
          this.map.addMapping(mapping);
        }
      }
      lines = str2.match(/\n/g);
      if (lines) {
        line += lines.length;
        last = str2.lastIndexOf("\n");
        column = str2.length - last;
      } else {
        column += str2.length;
      }
      if (node && type !== "start") {
        const p = node.parent || { raws: {} };
        const childless = node.type === "decl" || node.type === "atrule" && !node.nodes;
        if (!childless || node !== p.last || p.raws.semicolon) {
          if (node.source && node.source.end) {
            mapping.source = this.sourcePath(node);
            mapping.original.line = node.source.end.line;
            mapping.original.column = node.source.end.column - 1;
            mapping.generated.line = line;
            mapping.generated.column = column - 2;
            this.map.addMapping(mapping);
          } else {
            mapping.source = noSource;
            mapping.original.line = 1;
            mapping.original.column = 0;
            mapping.generated.line = line;
            mapping.generated.column = column - 1;
            this.map.addMapping(mapping);
          }
        }
      }
    });
  }
  isAnnotation() {
    if (this.isInline()) {
      return true;
    }
    if (typeof this.mapOpts.annotation !== "undefined") {
      return this.mapOpts.annotation;
    }
    if (this.previous().length) {
      return this.previous().some((i) => i.annotation);
    }
    return true;
  }
  isInline() {
    if (typeof this.mapOpts.inline !== "undefined") {
      return this.mapOpts.inline;
    }
    const annotation = this.mapOpts.annotation;
    if (typeof annotation !== "undefined" && annotation !== true) {
      return false;
    }
    if (this.previous().length) {
      return this.previous().some((i) => i.inline);
    }
    return true;
  }
  isMap() {
    if (typeof this.opts.map !== "undefined") {
      return !!this.opts.map;
    }
    return this.previous().length > 0;
  }
  isSourcesContent() {
    if (typeof this.mapOpts.sourcesContent !== "undefined") {
      return this.mapOpts.sourcesContent;
    }
    if (this.previous().length) {
      return this.previous().some((i) => i.withContent());
    }
    return true;
  }
  outputFile() {
    if (this.opts.to) {
      return this.path(this.opts.to);
    } else if (this.opts.from) {
      return this.path(this.opts.from);
    } else {
      return "to.css";
    }
  }
  path(file) {
    return file;
  }
  previous() {
    if (!this.previousMaps) {
      this.previousMaps = [];
      if (this.root) {
        this.root.walk((node) => {
          if (node.source && node.source.input.map) {
            const map = node.source.input.map;
            if (!this.previousMaps.includes(map)) {
              this.previousMaps.push(map);
            }
          }
        });
      } else {
        const input = new Input(this.originalCSS, this.opts);
        if (input.map)
          this.previousMaps.push(input.map);
      }
    }
    return this.previousMaps;
  }
  setSourcesContent() {
    throw new Error(`setSourcesContent isnt implemented`);
  }
  sourcePath(node) {
    if (this.mapOpts.from) {
      return this.toUrl(this.mapOpts.from);
    } else if (this.usesFileUrls) {
      return this.toFileUrl(node.source.input.from);
    } else {
      return this.toUrl(this.path(node.source.input.from));
    }
  }
  toBase64(str2) {
    if (Buffer) {
      return Buffer.from(str2).toString("base64");
    } else {
      return window.btoa(unescape(encodeURIComponent(str2)));
    }
  }
  toFileUrl(path) {
    const cached = this.memoizedFileURLs.get(path);
    if (cached)
      return cached;
    throw new Error("`map.absolute` option is not available in this PostCSS build");
  }
  toUrl(path) {
    const cached = this.memoizedURLs.get(path);
    if (cached)
      return cached;
    path = path.replace(/\\/g, "/");
    const url = encodeURI(path).replace(/[#?]/g, encodeURIComponent);
    this.memoizedURLs.set(path, url);
    return url;
  }
};

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

// src/postcss/warning.js
var Warning = class {
  static {
    __name(this, "Warning");
  }
  constructor(text, opts = {}) {
    this.type = "warning";
    this.text = text;
    if (opts.node && opts.node.source) {
      const range = opts.node.rangeBy(opts);
      this.line = range.start.line;
      this.column = range.start.column;
      this.endLine = range.end.line;
      this.endColumn = range.end.column;
    }
    for (const opt in opts)
      this[opt] = opts[opt];
  }
  toString() {
    if (this.node) {
      return this.node.error(this.text, {
        index: this.index,
        plugin: this.plugin,
        word: this.word
      }).message;
    }
    if (this.plugin) {
      return this.plugin + ": " + this.text;
    }
    return this.text;
  }
};

// src/postcss/result.js
var Result = class {
  static {
    __name(this, "Result");
  }
  constructor(processor, root2, opts) {
    this.processor = processor;
    this.messages = [];
    this.root = root2;
    this.opts = opts;
    this.css = void 0;
    this.map = void 0;
  }
  toString() {
    return this.css;
  }
  warn(text, opts = {}) {
    if (!opts.plugin) {
      if (this.lastPlugin && this.lastPlugin.postcssPlugin) {
        opts.plugin = this.lastPlugin.postcssPlugin;
      }
    }
    const warning = new Warning(text, opts);
    this.messages.push(warning);
    return warning;
  }
  warnings() {
    return this.messages.filter((i) => i.type === "warning");
  }
  get content() {
    return this.css;
  }
};

// src/postcss/no-work-result.js
var NoWorkResult = class {
  static {
    __name(this, "NoWorkResult");
  }
  constructor(processor, css, opts) {
    css = css.toString();
    this.stringified = false;
    this._processor = processor;
    this._css = css;
    this._opts = opts;
    this._map = void 0;
    let root2;
    const str2 = stringify;
    this.result = new Result(this._processor, root2, this._opts);
    this.result.css = css;
    const self = this;
    Object.defineProperty(this.result, "root", {
      get() {
        return self.root;
      }
    });
    const map = new MapGenerator(str2, root2, this._opts, css);
    if (map.isMap()) {
      const [generatedCSS, generatedMap] = map.generate();
      if (generatedCSS) {
        this.result.css = generatedCSS;
      }
      if (generatedMap) {
        this.result.map = generatedMap;
      }
    } else {
      map.clearAnnotation();
      this.result.css = map.css;
    }
  }
  async() {
    if (this.error)
      return Promise.reject(this.error);
    return Promise.resolve(this.result);
  }
  catch(onRejected) {
    return this.async().catch(onRejected);
  }
  finally(onFinally) {
    return this.async().then(onFinally, onFinally);
  }
  sync() {
    if (this.error)
      throw this.error;
    return this.result;
  }
  then(onFulfilled, onRejected) {
    if (process.env.NODE_ENV !== "production") {
      if (!("from" in this._opts)) {
        warnOnce("Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning.");
      }
    }
    return this.async().then(onFulfilled, onRejected);
  }
  toString() {
    return this._css;
  }
  warnings() {
    return [];
  }
  get content() {
    return this.result.css;
  }
  get css() {
    return this.result.css;
  }
  get map() {
    return this.result.map;
  }
  get messages() {
    return [];
  }
  get opts() {
    return this.result.opts;
  }
  get processor() {
    return this.result.processor;
  }
  get root() {
    if (this._root) {
      return this._root;
    }
    let root2;
    const parser2 = parse2;
    try {
      root2 = parser2(this._css, this._opts);
    } catch (error) {
      this.error = error;
    }
    if (this.error) {
      throw this.error;
    } else {
      this._root = root2;
      return root2;
    }
  }
  get [Symbol.toStringTag]() {
    return "NoWorkResult";
  }
};

// src/postcss/lazy-result.js
var TYPE_TO_CLASS_NAME = {
  atrule: "AtRule",
  comment: "Comment",
  decl: "Declaration",
  document: "Document",
  root: "Root",
  rule: "Rule"
};
var PLUGIN_PROPS = {
  AtRule: true,
  AtRuleExit: true,
  Comment: true,
  CommentExit: true,
  Declaration: true,
  DeclarationExit: true,
  Document: true,
  DocumentExit: true,
  Once: true,
  OnceExit: true,
  postcssPlugin: true,
  prepare: true,
  Root: true,
  RootExit: true,
  Rule: true,
  RuleExit: true
};
var NOT_VISITORS = {
  Once: true,
  postcssPlugin: true,
  prepare: true
};
var CHILDREN = 0;
function isPromise(obj) {
  return typeof obj === "object" && typeof obj.then === "function";
}
__name(isPromise, "isPromise");
function getEvents(node) {
  let key = false;
  const type = TYPE_TO_CLASS_NAME[node.type];
  if (node.type === "decl") {
    key = node.prop.toLowerCase();
  } else if (node.type === "atrule") {
    key = node.name.toLowerCase();
  }
  if (key && node.append) {
    return [
      type,
      type + "-" + key,
      CHILDREN,
      type + "Exit",
      type + "Exit-" + key
    ];
  } else if (key) {
    return [type, type + "-" + key, type + "Exit", type + "Exit-" + key];
  } else if (node.append) {
    return [type, CHILDREN, type + "Exit"];
  } else {
    return [type, type + "Exit"];
  }
}
__name(getEvents, "getEvents");
function toStack(node) {
  let events;
  if (node.type === "document") {
    events = ["Document", CHILDREN, "DocumentExit"];
  } else if (node.type === "root") {
    events = ["Root", CHILDREN, "RootExit"];
  } else {
    events = getEvents(node);
  }
  return {
    eventIndex: 0,
    events,
    iterator: 0,
    node,
    visitorIndex: 0,
    visitors: []
  };
}
__name(toStack, "toStack");
function cleanMarks(node) {
  node[isClean] = false;
  if (node.nodes)
    node.nodes.forEach((i) => cleanMarks(i));
  return node;
}
__name(cleanMarks, "cleanMarks");
var postcss = {};
var LazyResult3 = class _LazyResult {
  static {
    __name(this, "LazyResult");
  }
  constructor(processor, css, opts) {
    this.stringified = false;
    this.processed = false;
    let root2;
    if (typeof css === "object" && css !== null && (css.type === "root" || css.type === "document")) {
      root2 = cleanMarks(css);
    } else if (css instanceof _LazyResult || css instanceof Result) {
      root2 = cleanMarks(css.root);
      if (css.map) {
        if (typeof opts.map === "undefined")
          opts.map = {};
        if (!opts.map.inline)
          opts.map.inline = false;
        opts.map.prev = css.map;
      }
    } else {
      let parser2 = parse2;
      if (opts.syntax)
        parser2 = opts.syntax.parse;
      if (opts.parser)
        parser2 = opts.parser;
      if (parser2.parse)
        parser2 = parser2.parse;
      try {
        root2 = parser2(css, opts);
      } catch (error) {
        this.processed = true;
        this.error = error;
      }
      if (root2 && !root2[my]) {
        Container.rebuild(root2);
      }
    }
    this.result = new Result(processor, root2, opts);
    this.helpers = { ...postcss, postcss, result: this.result };
    this.plugins = this.processor.plugins.map((plugin2) => {
      if (typeof plugin2 === "object" && plugin2.prepare) {
        return { ...plugin2, ...plugin2.prepare(this.result) };
      } else {
        return plugin2;
      }
    });
  }
  async() {
    if (this.error)
      return Promise.reject(this.error);
    if (this.processed)
      return Promise.resolve(this.result);
    if (!this.processing) {
      this.processing = this.runAsync();
    }
    return this.processing;
  }
  catch(onRejected) {
    return this.async().catch(onRejected);
  }
  finally(onFinally) {
    return this.async().then(onFinally, onFinally);
  }
  getAsyncError() {
    throw new Error("Use process(css).then(cb) to work with async plugins");
  }
  handleError(error, node) {
    const plugin2 = this.result.lastPlugin;
    try {
      if (node)
        node.addToError(error);
      this.error = error;
      if (error.name === "CssSyntaxError" && !error.plugin) {
        error.plugin = plugin2.postcssPlugin;
        error.setMessage();
      } else if (plugin2.postcssVersion) {
        if (process.env.NODE_ENV !== "production") {
          const pluginName = plugin2.postcssPlugin;
          const pluginVer = plugin2.postcssVersion;
          const runtimeVer = this.result.processor.version;
          const a = pluginVer.split(".");
          const b = runtimeVer.split(".");
          if (a[0] !== b[0] || Number.parseInt(a[1]) > Number.parseInt(b[1])) {
            console.error("Unknown error from PostCSS plugin. Your current PostCSS version is " + runtimeVer + ", but " + pluginName + " uses " + pluginVer + ". Perhaps this is the source of the error below.");
          }
        }
      }
    } catch (err) {
      if (console && console.error)
        console.error(err);
    }
    return error;
  }
  prepareVisitors() {
    this.listeners = {};
    const add = /* @__PURE__ */ __name((plugin2, type, cb) => {
      if (!this.listeners[type])
        this.listeners[type] = [];
      this.listeners[type].push([plugin2, cb]);
    }, "add");
    for (const plugin2 of this.plugins) {
      if (typeof plugin2 === "object") {
        for (const event in plugin2) {
          if (!PLUGIN_PROPS[event] && /^[A-Z]/.test(event)) {
            throw new Error(`Unknown event ${event} in ${plugin2.postcssPlugin}. Try to update PostCSS (${this.processor.version} now).`);
          }
          if (!NOT_VISITORS[event]) {
            if (typeof plugin2[event] === "object") {
              for (const filter in plugin2[event]) {
                if (filter === "*") {
                  add(plugin2, event, plugin2[event][filter]);
                } else {
                  add(plugin2, event + "-" + filter.toLowerCase(), plugin2[event][filter]);
                }
              }
            } else if (typeof plugin2[event] === "function") {
              add(plugin2, event, plugin2[event]);
            }
          }
        }
      }
    }
    this.hasListener = Object.keys(this.listeners).length > 0;
  }
  async runAsync() {
    this.plugin = 0;
    for (let i = 0; i < this.plugins.length; i++) {
      const plugin2 = this.plugins[i];
      const promise = this.runOnRoot(plugin2);
      if (isPromise(promise)) {
        try {
          await promise;
        } catch (error) {
          throw this.handleError(error);
        }
      }
    }
    this.prepareVisitors();
    if (this.hasListener) {
      const root2 = this.result.root;
      while (!root2[isClean]) {
        root2[isClean] = true;
        const stack = [toStack(root2)];
        while (stack.length > 0) {
          const promise = this.visitTick(stack);
          if (isPromise(promise)) {
            try {
              await promise;
            } catch (e) {
              const node = stack[stack.length - 1].node;
              throw this.handleError(e, node);
            }
          }
        }
      }
      if (this.listeners.OnceExit) {
        for (const [plugin2, visitor] of this.listeners.OnceExit) {
          this.result.lastPlugin = plugin2;
          try {
            if (root2.type === "document") {
              const roots = root2.nodes.map((subRoot) => visitor(subRoot, this.helpers));
              await Promise.all(roots);
            } else {
              await visitor(root2, this.helpers);
            }
          } catch (e) {
            throw this.handleError(e);
          }
        }
      }
    }
    this.processed = true;
    return this.stringify();
  }
  runOnRoot(plugin2) {
    this.result.lastPlugin = plugin2;
    try {
      if (typeof plugin2 === "object" && plugin2.Once) {
        if (this.result.root.type === "document") {
          const roots = this.result.root.nodes.map((root2) => plugin2.Once(root2, this.helpers));
          if (isPromise(roots[0])) {
            return Promise.all(roots);
          }
          return roots;
        }
        return plugin2.Once(this.result.root, this.helpers);
      } else if (typeof plugin2 === "function") {
        return plugin2(this.result.root, this.result);
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }
  stringify() {
    if (this.error)
      throw this.error;
    if (this.stringified)
      return this.result;
    this.stringified = true;
    this.sync();
    const opts = this.result.opts;
    let str2 = stringify;
    if (opts.syntax)
      str2 = opts.syntax.stringify;
    if (opts.stringifier)
      str2 = opts.stringifier;
    if (str2.stringify)
      str2 = str2.stringify;
    const map = new MapGenerator(str2, this.result.root, this.result.opts);
    const data = map.generate();
    this.result.css = data[0];
    this.result.map = data[1];
    return this.result;
  }
  sync() {
    if (this.error)
      throw this.error;
    if (this.processed)
      return this.result;
    this.processed = true;
    if (this.processing) {
      throw this.getAsyncError();
    }
    for (const plugin2 of this.plugins) {
      const promise = this.runOnRoot(plugin2);
      if (isPromise(promise)) {
        throw this.getAsyncError();
      }
    }
    this.prepareVisitors();
    if (this.hasListener) {
      const root2 = this.result.root;
      while (!root2[isClean]) {
        root2[isClean] = true;
        this.walkSync(root2);
      }
      if (this.listeners.OnceExit) {
        if (root2.type === "document") {
          for (const subRoot of root2.nodes) {
            this.visitSync(this.listeners.OnceExit, subRoot);
          }
        } else {
          this.visitSync(this.listeners.OnceExit, root2);
        }
      }
    }
    return this.result;
  }
  then(onFulfilled, onRejected) {
    if (process.env.NODE_ENV !== "production") {
      if (!("from" in this.opts)) {
        warnOnce("Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning.");
      }
    }
    return this.async().then(onFulfilled, onRejected);
  }
  toString() {
    return this.css;
  }
  visitSync(visitors, node) {
    for (const [plugin2, visitor] of visitors) {
      this.result.lastPlugin = plugin2;
      let promise;
      try {
        promise = visitor(node, this.helpers);
      } catch (e) {
        throw this.handleError(e, node.proxyOf);
      }
      if (node.type !== "root" && node.type !== "document" && !node.parent) {
        return true;
      }
      if (isPromise(promise)) {
        throw this.getAsyncError();
      }
    }
  }
  visitTick(stack) {
    const visit = stack[stack.length - 1];
    const { node, visitors } = visit;
    if (node.type !== "root" && node.type !== "document" && !node.parent) {
      stack.pop();
      return;
    }
    if (visitors.length > 0 && visit.visitorIndex < visitors.length) {
      const [plugin2, visitor] = visitors[visit.visitorIndex];
      visit.visitorIndex += 1;
      if (visit.visitorIndex === visitors.length) {
        visit.visitors = [];
        visit.visitorIndex = 0;
      }
      this.result.lastPlugin = plugin2;
      try {
        return visitor(node.toProxy(), this.helpers);
      } catch (e) {
        throw this.handleError(e, node);
      }
    }
    if (visit.iterator !== 0) {
      const iterator = visit.iterator;
      let child;
      while (child = node.nodes[node.indexes[iterator]]) {
        node.indexes[iterator] += 1;
        if (!child[isClean]) {
          child[isClean] = true;
          stack.push(toStack(child));
          return;
        }
      }
      visit.iterator = 0;
      delete node.indexes[iterator];
    }
    const events = visit.events;
    while (visit.eventIndex < events.length) {
      const event = events[visit.eventIndex];
      visit.eventIndex += 1;
      if (event === CHILDREN) {
        if (node.nodes && node.nodes.length) {
          node[isClean] = true;
          visit.iterator = node.getIterator();
        }
        return;
      } else if (this.listeners[event]) {
        visit.visitors = this.listeners[event];
        return;
      }
    }
    stack.pop();
  }
  walkSync(node) {
    node[isClean] = true;
    const events = getEvents(node);
    for (const event of events) {
      if (event === CHILDREN) {
        if (node.nodes) {
          node.each((child) => {
            if (!child[isClean])
              this.walkSync(child);
          });
        }
      } else {
        const visitors = this.listeners[event];
        if (visitors) {
          if (this.visitSync(visitors, node.toProxy()))
            return;
        }
      }
    }
  }
  warnings() {
    return this.sync().warnings();
  }
  get content() {
    return this.stringify().content;
  }
  get css() {
    return this.stringify().css;
  }
  get map() {
    return this.stringify().map;
  }
  get messages() {
    return this.sync().messages;
  }
  get opts() {
    return this.result.opts;
  }
  get processor() {
    return this.result.processor;
  }
  get root() {
    return this.sync().root;
  }
  get [Symbol.toStringTag]() {
    return "LazyResult";
  }
};
LazyResult3.registerPostcss = (dependant) => {
  postcss = dependant;
};
Root2.registerLazyResult(LazyResult3);
Document.registerLazyResult(LazyResult3);

// src/postcss/processor.js
var Processor3 = class {
  static {
    __name(this, "Processor");
  }
  constructor(plugins = []) {
    this.version = "8.4.49";
    this.plugins = this.normalize(plugins);
  }
  normalize(plugins) {
    let normalized = [];
    for (let i of plugins) {
      if (i.postcss === true) {
        i = i();
      } else if (i.postcss) {
        i = i.postcss;
      }
      if (typeof i === "object" && Array.isArray(i.plugins)) {
        normalized = normalized.concat(i.plugins);
      } else if (typeof i === "object" && i.postcssPlugin) {
        normalized.push(i);
      } else if (typeof i === "function") {
        normalized.push(i);
      } else if (typeof i === "object" && (i.parse || i.stringify)) {
        if (process.env.NODE_ENV !== "production") {
          throw new Error("PostCSS syntaxes cannot be used as plugins. Instead, please use one of the syntax/parser/stringifier options as outlined in your PostCSS runner documentation.");
        }
      } else {
        throw new Error(i + " is not a PostCSS plugin");
      }
    }
    return normalized;
  }
  process(css, opts = {}) {
    if (!this.plugins.length && !opts.parser && !opts.stringifier && !opts.syntax) {
      return new NoWorkResult(this, css, opts);
    } else {
      return new LazyResult3(this, css, opts);
    }
  }
  use(plugin2) {
    this.plugins = this.plugins.concat(this.normalize([plugin2]));
    return this;
  }
};
Root2.registerProcessor(Processor3);
Document.registerProcessor(Processor3);

// src/postcss/postcss.js
LazyResult3.registerPostcss(postcss2);
function postcss2(...plugins) {
  if (plugins.length === 1 && Array.isArray(plugins[0])) {
    plugins = plugins[0];
  }
  return new Processor3(plugins);
}
__name(postcss2, "postcss");
postcss2.plugin = /* @__PURE__ */ __name(function plugin(name, initializer) {
  let warningPrinted = false;
  function creator2(...args) {
    const transformer = initializer(...args);
    transformer.postcssPlugin = name;
    transformer.postcssVersion = new Processor3().version;
    return transformer;
  }
  __name(creator2, "creator");
  let cache;
  Object.defineProperty(creator2, "postcss", {
    get() {
      if (!cache)
        cache = creator2();
      return cache;
    }
  });
  creator2.process = (css, processOpts, pluginOpts) => postcss2([creator2(pluginOpts)]).process(css, processOpts);
  return creator2;
}, "plugin");
postcss2.stringify = stringify;
postcss2.parse = parse2;
postcss2.fromJSON = fromJSON;
postcss2.list = list;
postcss2.comment = (defaults) => new Comment(defaults);
postcss2.atRule = (defaults) => new AtRule2(defaults);
postcss2.decl = (defaults) => new Declaration(defaults);
postcss2.rule = (defaults) => new Rule2(defaults);
postcss2.root = (defaults) => new Root2(defaults);
postcss2.document = (defaults) => new Document(defaults);
postcss2.CssSyntaxError = CssSyntaxError;
postcss2.Declaration = Declaration;
postcss2.Container = Container;
postcss2.Processor = Processor3;
postcss2.Document = Document;
postcss2.Comment = Comment;
postcss2.Warning = Warning;
postcss2.AtRule = AtRule2;
postcss2.Result = Result;
postcss2.Input = Input;
postcss2.Rule = Rule2;
postcss2.Root = Root2;
postcss2.Node = Node;
var postcss_default = postcss2;

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
  const isSurrogate2 = codePoint >= 55296 && codePoint <= 57343;
  if (isSurrogate2 || codePoint === 0 || codePoint > 1114111) {
    return ["\uFFFD", hex2.length + (spaceTerminated ? 1 : 0)];
  }
  return [
    String.fromCodePoint(codePoint),
    hex2.length + (spaceTerminated ? 1 : 0)
  ];
}
__name(gobbleHex, "gobbleHex");
var CONTAINS_ESCAPE = /\\/;
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
__name(unesc, "unesc");

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
var cloneNode2 = /* @__PURE__ */ __name(function(obj, parent) {
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
      cloned[i] = value.map((j) => cloneNode2(j, cloned));
    } else {
      cloned[i] = cloneNode2(value, cloned);
    }
  }
  return cloned;
}, "cloneNode");
var Node2 = class {
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
    let cloned = cloneNode2(this);
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
var STRING = "string";
var SELECTOR = "selector";
var ROOT = "root";
var PSEUDO = "pseudo";
var NESTING = "nesting";
var ID = "id";
var COMMENT = "comment";
var COMBINATOR = "combinator";
var CLASS = "class";
var ATTRIBUTE = "attribute";
var UNIVERSAL = "universal";

// src/postcss-selector-parser/selectors/container.js
var Container2 = class extends Node2 {
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

// src/postcss-selector-parser/selectors/root.js
var Root3 = class extends Container2 {
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

// src/postcss-selector-parser/selectors/selector.js
var Selector = class extends Container2 {
  static {
    __name(this, "Selector");
  }
  constructor(opts) {
    super(opts);
    this.type = SELECTOR;
  }
};

// src/cssesc/index.js
var object = {};
var hasOwnProperty = object.hasOwnProperty;
var merge = /* @__PURE__ */ __name(function merge2(options, defaults) {
  if (!options) {
    return defaults;
  }
  var result = {};
  for (var key in defaults) {
    result[key] = hasOwnProperty.call(options, key) ? options[key] : defaults[key];
  }
  return result;
}, "merge");
var regexAnySingleEscape = /[ -,\.\/:-@\[-\^`\{-~]/;
var regexSingleEscape = /[ -,\.\/:-@\[\]\^`\{-~]/;
var regexExcessiveSpaces = /(^|\\+)?(\\[A-F0-9]{1,6})\x20(?![a-fA-F0-9\x20])/g;
var cssesc = /* @__PURE__ */ __name(function cssesc2(string2, options) {
  options = merge(options, cssesc2.options);
  if (options.quotes != "single" && options.quotes != "double") {
    options.quotes = "single";
  }
  var quote = options.quotes == "double" ? '"' : "'";
  var isIdentifier2 = options.isIdentifier;
  var firstChar = string2.charAt(0);
  var output = "";
  var counter = 0;
  var length = string2.length;
  while (counter < length) {
    var character = string2.charAt(counter++);
    var codePoint = character.charCodeAt();
    var value = void 0;
    if (codePoint < 32 || codePoint > 126) {
      if (codePoint >= 55296 && codePoint <= 56319 && counter < length) {
        var extra = string2.charCodeAt(counter++);
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
cssesc.version = "3.0.0";
var cssesc_default = cssesc;

// src/postcss-selector-parser/selectors/className.js
var ClassName = class extends Node2 {
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

// src/postcss-selector-parser/selectors/comment.js
var Comment2 = class extends Node2 {
  static {
    __name(this, "Comment");
  }
  constructor(opts) {
    super(opts);
    this.type = COMMENT;
  }
};

// src/postcss-selector-parser/selectors/id.js
var ID2 = class extends Node2 {
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

// src/postcss-selector-parser/selectors/namespace.js
var Namespace = class extends Node2 {
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

// src/postcss-selector-parser/selectors/tag.js
var Tag = class extends Namespace {
  static {
    __name(this, "Tag");
  }
  constructor(opts) {
    super(opts);
    this.type = TAG;
  }
};

// src/postcss-selector-parser/selectors/string.js
var String2 = class extends Node2 {
  static {
    __name(this, "String");
  }
  constructor(opts) {
    super(opts);
    this.type = STRING;
  }
};

// src/postcss-selector-parser/selectors/pseudo.js
var Pseudo = class extends Container2 {
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

// src/postcss-selector-parser/selectors/attribute.js
var WRAPPED_IN_QUOTES = /^('|")([^]*)\1$/;
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
__name(unescapeValue, "unescapeValue");
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
__name(handleDeprecatedContructorOpts, "handleDeprecatedContructorOpts");
var Attribute = class _Attribute extends Namespace {
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
      const { deprecatedUsage, unescaped, quoteMark } = unescapeValue(v);
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
var CSSESC_QUOTE_OPTIONS = {
  "'": { quotes: "single", wrap: true },
  '"': { quotes: "double", wrap: true },
  [null]: { isIdentifier: true }
};
function defaultAttrConcat(attrValue, attrSpaces) {
  return `${attrSpaces.before}${attrValue}${attrSpaces.after}`;
}
__name(defaultAttrConcat, "defaultAttrConcat");

// src/postcss-selector-parser/selectors/universal.js
var Universal = class extends Namespace {
  static {
    __name(this, "Universal");
  }
  constructor(opts) {
    super(opts);
    this.type = UNIVERSAL;
    this.value = "*";
  }
};

// src/postcss-selector-parser/selectors/combinator.js
var Combinator = class extends Node2 {
  static {
    __name(this, "Combinator");
  }
  constructor(opts) {
    super(opts);
    this.type = COMBINATOR;
  }
};

// src/postcss-selector-parser/selectors/nesting.js
var Nesting = class extends Node2 {
  static {
    __name(this, "Nesting");
  }
  constructor(opts) {
    super(opts);
    this.type = NESTING;
    this.value = "&";
  }
};

// src/postcss-selector-parser/sortAscending.js
function sortAscending(list2) {
  return list2.sort((a, b) => a - b);
}
__name(sortAscending, "sortAscending");

// src/postcss-selector-parser/tokenTypes.js
var ampersand = 38;
var asterisk = 42;
var comma = 44;
var colon = 58;
var semicolon = 59;
var openParenthesis = 40;
var closeParenthesis = 41;
var openSquare = 91;
var closeSquare = 93;
var dollar = 36;
var tilde = 126;
var caret = 94;
var plus = 43;
var equals = 61;
var pipe = 124;
var greaterThan = 62;
var space = 32;
var singleQuote = 39;
var doubleQuote = 34;
var slash = 47;
var bang = 33;
var backslash = 92;
var cr = 13;
var feed = 12;
var newline = 10;
var tab = 9;
var str = singleQuote;
var comment = -1;
var word = -2;
var combinator = -3;

// src/postcss-selector-parser/tokenize.js
var unescapable = {
  [tab]: true,
  [newline]: true,
  [cr]: true,
  [feed]: true
};
var wordDelimiters = {
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
var hex = {};
var hexChars = "0123456789abcdefABCDEF";
for (let i = 0; i < hexChars.length; i++) {
  hex[hexChars.charCodeAt(i)] = true;
}
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
__name(consumeWord, "consumeWord");
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
__name(consumeEscape, "consumeEscape");
var FIELDS = {
  TYPE: 0,
  START_LINE: 1,
  START_COL: 2,
  END_LINE: 3,
  END_COL: 4,
  START_POS: 5,
  END_POS: 6
};
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
__name(tokenize, "tokenize");

// src/postcss-selector-parser/parser.js
var WHITESPACE_TOKENS = {
  [space]: true,
  [cr]: true,
  [feed]: true,
  [newline]: true,
  [tab]: true
};
var WHITESPACE_EQUIV_TOKENS = {
  ...WHITESPACE_TOKENS,
  [comment]: true
};
function tokenStart(token) {
  return {
    line: token[FIELDS.START_LINE],
    column: token[FIELDS.START_COL]
  };
}
__name(tokenStart, "tokenStart");
function tokenEnd(token) {
  return {
    line: token[FIELDS.END_LINE],
    column: token[FIELDS.END_COL]
  };
}
__name(tokenEnd, "tokenEnd");
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
__name(getSource, "getSource");
function getTokenSource(token) {
  return getSource(token[FIELDS.START_LINE], token[FIELDS.START_COL], token[FIELDS.END_LINE], token[FIELDS.END_COL]);
}
__name(getTokenSource, "getTokenSource");
function getTokenSourceSpan(startToken, endToken) {
  if (!startToken) {
    return void 0;
  }
  return getSource(startToken[FIELDS.START_LINE], startToken[FIELDS.START_COL], endToken[FIELDS.END_LINE], endToken[FIELDS.END_COL]);
}
__name(getTokenSourceSpan, "getTokenSourceSpan");
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
__name(unescapeProp, "unescapeProp");
function indexesOf(array, item) {
  let i = -1;
  const indexes = [];
  while ((i = array.indexOf(item, i + 1)) !== -1) {
    indexes.push(i);
  }
  return indexes;
}
__name(indexesOf, "indexesOf");
function uniqs() {
  const list2 = Array.prototype.concat.apply([], arguments);
  return list2.filter((item, i) => i === list2.indexOf(item));
}
__name(uniqs, "uniqs");
var Parser2 = class {
  static {
    __name(this, "Parser");
  }
  constructor(rule, options = {}) {
    this.rule = rule;
    this.options = Object.assign({ lossy: false, safe: false }, options);
    this.position = 0;
    this.css = typeof this.rule === "string" ? this.rule : this.rule.selector;
    this.tokens = tokenize({
      css: this.css,
      error: this._errorGenerator(),
      safe: this.options.safe
    });
    let rootSource = getTokenSourceSpan(this.tokens[0], this.tokens[this.tokens.length - 1]);
    this.root = new Root3({ source: rootSource });
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
      source: getSource(startingToken[1], startingToken[2], this.currToken[3], this.currToken[4]),
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
        lastComment = new Comment2({
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
          source: getSource(firstToken[FIELDS.START_LINE], firstToken[FIELDS.START_COL], lastToken[FIELDS.END_LINE], lastToken[FIELDS.END_COL]),
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
        source: getSource(this.currToken[FIELDS.START_LINE], this.currToken[FIELDS.START_COL], this.tokens[this.position + 2][FIELDS.END_LINE], this.tokens[this.position + 2][FIELDS.END_COL]),
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
    this.newNode(new Comment2({
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
          source: getSource(parenStart[FIELDS.START_LINE], parenStart[FIELDS.START_COL], parenEnd[FIELDS.END_LINE], parenEnd[FIELDS.END_COL]),
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
      const source = getSource(current[1], current[2] + ind, current[3], current[2] + (index - 1));
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
      return this.error(`Expected ${an} ${description}.`, { index });
    }
    return this.error(`Expected ${an} ${description}, found "${found}" instead.`, { index });
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

// src/postcss-selector-parser/processor.js
var Processor4 = class {
  static {
    __name(this, "Processor");
  }
  constructor(func, options) {
    this.func = func || /* @__PURE__ */ __name(function noop2() {
    }, "noop");
    this.funcRes = null;
    this.options = options;
  }
  _shouldUpdateSelector(rule, options = {}) {
    let merged = Object.assign({}, this.options, options);
    if (merged.updateSelector === false) {
      return false;
    } else {
      return typeof rule !== "string";
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
  _root(rule, options = {}) {
    let parser2 = new Parser2(rule, this._parseOptions(options));
    return parser2.root;
  }
  _parseOptions(options) {
    return {
      lossy: this._isLossy(options)
    };
  }
  _run(rule, options = {}) {
    return new Promise((resolve, reject) => {
      try {
        let root2 = this._root(rule, options);
        Promise.resolve(this.func(root2)).then((transform) => {
          let string2 = void 0;
          if (this._shouldUpdateSelector(rule, options)) {
            string2 = root2.toString();
            rule.selector = string2;
          }
          return { transform, root: root2, string: string2 };
        }).then(resolve, reject);
      } catch (e) {
        reject(e);
        return;
      }
    });
  }
  _runSync(rule, options = {}) {
    let root2 = this._root(rule, options);
    let transform = this.func(root2);
    if (transform && typeof transform.then === "function") {
      throw new Error("Selector processor returned a promise to a synchronous call.");
    }
    let string2 = void 0;
    if (options.updateSelector && typeof rule !== "string") {
      string2 = root2.toString();
      rule.selector = string2;
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
  ast(rule, options) {
    return this._run(rule, options).then((result) => result.root);
  }
  /**
   * Process rule into a selector AST synchronously.
   *
   * @param rule {postcss.Rule | string} The css selector to be processed
   * @param options The options for processing
   * @returns {parser.Root} The AST of the selector after processing it.
   */
  astSync(rule, options) {
    return this._runSync(rule, options).root;
  }
  /**
   * Process a selector into a transformed value asynchronously
   *
   * @param rule {postcss.Rule | string} The css selector to be processed
   * @param options The options for processing
   * @returns {Promise<any>} The value returned by the processor.
   */
  transform(rule, options) {
    return this._run(rule, options).then((result) => result.transform);
  }
  /**
   * Process a selector into a transformed value synchronously.
   *
   * @param rule {postcss.Rule | string} The css selector to be processed
   * @param options The options for processing
   * @returns {any} The value returned by the processor.
   */
  transformSync(rule, options) {
    return this._runSync(rule, options).transform;
  }
  /**
   * Process a selector into a new selector string asynchronously.
   *
   * @param rule {postcss.Rule | string} The css selector to be processed
   * @param options The options for processing
   * @returns {string} the selector after processing.
   */
  process(rule, options) {
    return this._run(rule, options).then((result) => result.string || result.root.toString());
  }
  /**
   * Process a selector into a new selector string synchronously.
   *
   * @param rule {postcss.Rule | string} The css selector to be processed
   * @param options The options for processing
   * @returns {string} the selector after processing.
   */
  processSync(rule, options) {
    let result = this._runSync(rule, options);
    return result.string || result.root.toString();
  }
};

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

// src/postcss-selector-parser/selectors/constructors.js
var attribute = /* @__PURE__ */ __name((opts) => new Attribute(opts), "attribute");
var className = /* @__PURE__ */ __name((opts) => new ClassName(opts), "className");
var combinator2 = /* @__PURE__ */ __name((opts) => new Combinator(opts), "combinator");
var comment2 = /* @__PURE__ */ __name((opts) => new Comment2(opts), "comment");
var id = /* @__PURE__ */ __name((opts) => new ID2(opts), "id");
var nesting = /* @__PURE__ */ __name((opts) => new Nesting(opts), "nesting");
var pseudo = /* @__PURE__ */ __name((opts) => new Pseudo(opts), "pseudo");
var root = /* @__PURE__ */ __name((opts) => new Root3(opts), "root");
var selector = /* @__PURE__ */ __name((opts) => new Selector(opts), "selector");
var string = /* @__PURE__ */ __name((opts) => new String2(opts), "string");
var tag = /* @__PURE__ */ __name((opts) => new Tag(opts), "tag");
var universal = /* @__PURE__ */ __name((opts) => new Universal(opts), "universal");

// src/postcss-selector-parser/selectors/guards.js
var IS_TYPE = {
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
function isNode(node) {
  return typeof node === "object" && IS_TYPE[node.type];
}
__name(isNode, "isNode");
function isNodeType(type, node) {
  return isNode(node) && node.type === type;
}
__name(isNodeType, "isNodeType");
var isAttribute = isNodeType.bind(null, ATTRIBUTE);
var isClassName = isNodeType.bind(null, CLASS);
var isCombinator = isNodeType.bind(null, COMBINATOR);
var isComment = isNodeType.bind(null, COMMENT);
var isIdentifier = isNodeType.bind(null, ID);
var isNesting = isNodeType.bind(null, NESTING);
var isPseudo = isNodeType.bind(null, PSEUDO);
var isRoot = isNodeType.bind(null, ROOT);
var isSelector = isNodeType.bind(null, SELECTOR);
var isString = isNodeType.bind(null, STRING);
var isTag = isNodeType.bind(null, TAG);
var isUniversal = isNodeType.bind(null, UNIVERSAL);
function isPseudoElement(node) {
  return isPseudo(node) && node.value && (node.value.startsWith("::") || node.value.toLowerCase() === ":before" || node.value.toLowerCase() === ":after" || node.value.toLowerCase() === ":first-letter" || node.value.toLowerCase() === ":first-line");
}
__name(isPseudoElement, "isPseudoElement");
function isPseudoClass(node) {
  return isPseudo(node) && !isPseudoElement(node);
}
__name(isPseudoClass, "isPseudoClass");
function isContainer(node) {
  return !!(isNode(node) && node.walk);
}
__name(isContainer, "isContainer");
function isNamespace(node) {
  return isAttribute(node) || isTag(node);
}
__name(isNamespace, "isNamespace");

// src/postcss-selector-parser/index.js
var parser = /* @__PURE__ */ __name((processor) => new Processor4(processor), "parser");
Object.assign(parser, selectors_exports);
var postcss_selector_parser_default = parser;

// src/ExtractorResultSets.ts
function mergeSets(into, from) {
  if (from) {
    from.forEach(into.add, into);
  }
}
__name(mergeSets, "mergeSets");
var ExtractorResultSets = class _ExtractorResultSets {
  constructor(er) {
    this.undetermined = /* @__PURE__ */ new Set();
    this.attrNames = /* @__PURE__ */ new Set();
    this.attrValues = /* @__PURE__ */ new Set();
    this.classes = /* @__PURE__ */ new Set();
    this.ids = /* @__PURE__ */ new Set();
    this.tags = /* @__PURE__ */ new Set();
    this.merge(er);
  }
  static {
    __name(this, "ExtractorResultSets");
  }
  merge(that) {
    if (Array.isArray(that)) {
      mergeSets(this.undetermined, that);
    } else if (that instanceof _ExtractorResultSets) {
      mergeSets(this.undetermined, that.undetermined);
      mergeSets(this.attrNames, that.attrNames);
      mergeSets(this.attrValues, that.attrValues);
      mergeSets(this.classes, that.classes);
      mergeSets(this.ids, that.ids);
      mergeSets(this.tags, that.tags);
    } else {
      mergeSets(this.undetermined, that.undetermined);
      if (that.attributes) {
        mergeSets(this.attrNames, that.attributes.names);
        mergeSets(this.attrValues, that.attributes.values);
      }
      mergeSets(this.classes, that.classes);
      mergeSets(this.ids, that.ids);
      mergeSets(this.tags, that.tags);
    }
    return this;
  }
  hasAttrName(name) {
    return this.attrNames.has(name) || this.undetermined.has(name);
  }
  someAttrValue(predicate) {
    for (const val of this.attrValues) {
      if (predicate(val)) return true;
    }
    for (const val of this.undetermined) {
      if (predicate(val)) return true;
    }
    return false;
  }
  hasAttrPrefix(prefix) {
    return this.someAttrValue((value) => value.startsWith(prefix));
  }
  hasAttrSuffix(suffix) {
    return this.someAttrValue((value) => value.endsWith(suffix));
  }
  hasAttrSubstr(substr) {
    const wordSubstr = substr.trim().split(" ");
    return wordSubstr.every(
      (word2) => this.someAttrValue((value) => value.includes(word2))
    );
  }
  hasAttrValue(value) {
    return this.attrValues.has(value) || this.undetermined.has(value);
  }
  hasClass(name) {
    return this.classes.has(name) || this.undetermined.has(name);
  }
  hasId(id2) {
    return this.ids.has(id2) || this.undetermined.has(id2);
  }
  hasTag(tag2) {
    return this.tags.has(tag2) || this.undetermined.has(tag2);
  }
};
var ExtractorResultSets_default = ExtractorResultSets;

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

// src/VariablesStructure.ts
var VariableNode = class {
  constructor(declaration) {
    this.nodes = [];
    this.isUsed = false;
    this.value = declaration;
  }
  static {
    __name(this, "VariableNode");
  }
};
var VariablesStructure = class {
  constructor() {
    this.nodes = /* @__PURE__ */ new Map();
    this.usedVariables = /* @__PURE__ */ new Set();
    this.safelist = [];
  }
  static {
    __name(this, "VariablesStructure");
  }
  addVariable(declaration) {
    const { prop } = declaration;
    if (!this.nodes.has(prop)) {
      const node = new VariableNode(declaration);
      this.nodes.set(prop, [node]);
    } else {
      const node = new VariableNode(declaration);
      const variableNodes = this.nodes.get(prop) || [];
      this.nodes.set(prop, [...variableNodes, node]);
    }
  }
  addVariableUsage(declaration, matchedVariables) {
    const { prop } = declaration;
    const nodes = this.nodes.get(prop);
    for (const variableMatch of matchedVariables) {
      const variableName = variableMatch[1];
      if (this.nodes.has(variableName)) {
        const usedVariableNodes = this.nodes.get(variableName);
        nodes?.forEach((node) => {
          usedVariableNodes?.forEach(
            (usedVariableNode) => node.nodes.push(usedVariableNode)
          );
        });
      }
    }
  }
  addVariableUsageInProperties(matchedVariables) {
    for (const variableMatch of matchedVariables) {
      const variableName = variableMatch[1];
      this.usedVariables.add(variableName);
    }
  }
  setAsUsed(variableName) {
    const nodes = this.nodes.get(variableName);
    if (nodes) {
      const queue = [...nodes];
      while (queue.length !== 0) {
        const currentNode = queue.pop();
        if (currentNode && !currentNode.isUsed) {
          currentNode.isUsed = true;
          queue.push(...currentNode.nodes);
        }
      }
    }
  }
  removeUnused() {
    for (const used of this.usedVariables) {
      const usedNodes = this.nodes.get(used);
      if (usedNodes) {
        for (const usedNode of usedNodes) {
          const usedVariablesMatchesInDeclaration = usedNode.value.value.matchAll(/var\((.+?)[,)]/g);
          for (const usage of usedVariablesMatchesInDeclaration) {
            if (!this.usedVariables.has(usage[1])) {
              this.usedVariables.add(usage[1]);
            }
          }
        }
      }
    }
    for (const used of this.usedVariables) {
      this.setAsUsed(used);
    }
    for (const [name, declarations] of this.nodes) {
      for (const declaration of declarations) {
        if (!declaration.isUsed && !this.isVariablesSafelisted(name)) {
          declaration.value.remove();
        }
      }
    }
  }
  isVariablesSafelisted(variable) {
    return this.safelist.some((safelistItem) => {
      return typeof safelistItem === "string" ? safelistItem === variable : safelistItem.test(variable);
    });
  }
};

// src/index.ts
var CSS_SAFELIST = ["*", ":root", ":after", ":before"];
var IGNORE_ANNOTATION_CURRENT = "purgecss ignore current";
var IGNORE_ANNOTATION_NEXT = "purgecss ignore";
var IGNORE_ANNOTATION_START = "purgecss start ignore";
var IGNORE_ANNOTATION_END = "purgecss end ignore";
// @__NO_SIDE_EFFECTS__
function standardizeSafelist(userDefinedSafelist = []) {
  if (Array.isArray(userDefinedSafelist)) {
    return {
      ...defaultOptions.safelist,
      standard: userDefinedSafelist
    };
  }
  return {
    ...defaultOptions.safelist,
    ...userDefinedSafelist
  };
}
__name(standardizeSafelist, "standardizeSafelist");
// @__NO_SIDE_EFFECTS__
async function extractSelectors(content, extractor) {
  return new ExtractorResultSets_default(await extractor(content));
}
__name(extractSelectors, "extractSelectors");
// @__NO_SIDE_EFFECTS__
function isIgnoreAnnotation(node, type) {
  switch (type) {
    case "next":
      return node.text.includes(IGNORE_ANNOTATION_NEXT);
    case "start":
      return node.text.includes(IGNORE_ANNOTATION_START);
    case "end":
      return node.text.includes(IGNORE_ANNOTATION_END);
  }
}
__name(isIgnoreAnnotation, "isIgnoreAnnotation");
// @__NO_SIDE_EFFECTS__
function isRuleEmpty(node) {
  if (/* @__PURE__ */ isPostCSSRule(node) && !node.selector || node?.nodes && !node.nodes.length || /* @__PURE__ */ isPostCSSAtRule(node) && (!node.nodes && !node.params || !node.params && node.nodes && !node.nodes.length)) {
    return true;
  }
  return false;
}
__name(isRuleEmpty, "isRuleEmpty");
// @__NO_SIDE_EFFECTS__
function hasIgnoreAnnotation(rule) {
  let found = false;
  rule.walkComments((node) => {
    if (node && node.type === "comment" && node.text.includes(IGNORE_ANNOTATION_CURRENT)) {
      found = true;
      node.remove();
    }
  });
  return found;
}
__name(hasIgnoreAnnotation, "hasIgnoreAnnotation");
// @__NO_SIDE_EFFECTS__
function mergeExtractorSelectors(...extractors) {
  const result = new ExtractorResultSets_default([]);
  extractors.forEach(result.merge, result);
  return result;
}
__name(mergeExtractorSelectors, "mergeExtractorSelectors");
// @__NO_SIDE_EFFECTS__
function stripQuotes(str2) {
  return str2.replace(/(^["'])|(["']$)/g, "");
}
__name(stripQuotes, "stripQuotes");
// @__NO_SIDE_EFFECTS__
function isAttributeFound(attributeNode, selectors) {
  if (!selectors.hasAttrName(attributeNode.attribute)) {
    return false;
  }
  if (typeof attributeNode.value === "undefined") {
    return true;
  }
  switch (attributeNode.operator) {
    case "$=":
      return selectors.hasAttrSuffix(attributeNode.value);
    case "~=":
    case "*=":
      return selectors.hasAttrSubstr(attributeNode.value);
    case "=":
      return selectors.hasAttrValue(attributeNode.value);
    case "|=":
    case "^=":
      return selectors.hasAttrPrefix(attributeNode.value);
    default:
      return true;
  }
}
__name(isAttributeFound, "isAttributeFound");
// @__NO_SIDE_EFFECTS__
function isClassFound(classNode, selectors) {
  return selectors.hasClass(classNode.value);
}
__name(isClassFound, "isClassFound");
// @__NO_SIDE_EFFECTS__
function isIdentifierFound(identifierNode, selectors) {
  return selectors.hasId(identifierNode.value);
}
__name(isIdentifierFound, "isIdentifierFound");
// @__NO_SIDE_EFFECTS__
function isTagFound(tagNode, selectors) {
  return selectors.hasTag(tagNode.value);
}
__name(isTagFound, "isTagFound");
// @__NO_SIDE_EFFECTS__
function isInPseudoClass(selector2) {
  return selector2.parent && selector2.parent.type === "pseudo" && selector2.parent.value.startsWith(":") || false;
}
__name(isInPseudoClass, "isInPseudoClass");
// @__NO_SIDE_EFFECTS__
function isInPseudoClassWhereOrIs(selector2) {
  return selector2.parent && selector2.parent.type === "pseudo" && (selector2.parent.value === ":where" || selector2.parent.value === ":is") || false;
}
__name(isInPseudoClassWhereOrIs, "isInPseudoClassWhereOrIs");
// @__NO_SIDE_EFFECTS__
function isPseudoClassAtRootLevel(selector2) {
  let result = false;
  if (selector2.type === "selector" && selector2.parent?.type === "root" && selector2.nodes.length === 1) {
    selector2.walk((node) => {
      if (node.type === "pseudo" && (node.value === ":where" || node.value === ":is" || node.value === ":has" || node.value === ":not")) {
        result = true;
      }
    });
  }
  return result;
}
__name(isPseudoClassAtRootLevel, "isPseudoClassAtRootLevel");
// @__NO_SIDE_EFFECTS__
function isPostCSSAtRule(node) {
  return node?.type === "atrule";
}
__name(isPostCSSAtRule, "isPostCSSAtRule");
// @__NO_SIDE_EFFECTS__
function isPostCSSRule(node) {
  return node?.type === "rule";
}
__name(isPostCSSRule, "isPostCSSRule");
// @__NO_SIDE_EFFECTS__
function isPostCSSComment(node) {
  return node?.type === "comment";
}
__name(isPostCSSComment, "isPostCSSComment");
var PurgeCSS = class {
  constructor() {
    this.ignore = false;
    this.atRules = {
      fontFace: [],
      keyframes: []
    };
    this.usedAnimations = /* @__PURE__ */ new Set();
    this.usedFontFaces = /* @__PURE__ */ new Set();
    this.selectorsRemoved = /* @__PURE__ */ new Set();
    this.removedNodes = [];
    this.variablesStructure = new VariablesStructure();
    this.options = defaultOptions;
  }
  static {
    __name(this, "PurgeCSS");
  }
  collectDeclarationsData(declaration) {
    const { prop, value } = declaration;
    if (this.options.variables) {
      const usedVariablesMatchesInDeclaration = value.matchAll(/var\((.+?)[,)]/g);
      if (prop.startsWith("--")) {
        this.variablesStructure.addVariable(declaration);
        this.variablesStructure.addVariableUsage(
          declaration,
          usedVariablesMatchesInDeclaration
        );
      } else {
        this.variablesStructure.addVariableUsageInProperties(
          usedVariablesMatchesInDeclaration
        );
      }
    }
    if (this.options.keyframes) {
      if (prop === "animation" || prop === "animation-name") {
        for (const word2 of value.split(/[\s,]+/)) {
          this.usedAnimations.add(word2);
        }
        return;
      }
    }
    if (this.options.fontFace) {
      if (prop === "font-family") {
        for (const fontName of value.split(",")) {
          const cleanedFontFace = /* @__PURE__ */ stripQuotes(fontName.trim());
          this.usedFontFaces.add(cleanedFontFace);
        }
      }
      return;
    }
  }
  /**
   * Get the extractor corresponding to the extension file
   * @param filename - Name of the file
   * @param extractors - Array of extractors definition
   */
  getFileExtractor(filename, extractors) {
    const extractorObj = extractors.find(
      (extractor) => extractor.extensions.find((ext) => filename.endsWith(ext))
    );
    return typeof extractorObj === "undefined" ? this.options.defaultExtractor : extractorObj.extractor;
  }
  /**
   * Extract the selectors present in the passed string using a PurgeCSS extractor
   *
   * @param content - Array of content
   * @param extractors - Array of extractors
   */
  async extractSelectorsFromString(content, extractors) {
    const selectors = new ExtractorResultSets_default([]);
    for (const { raw, extension } of content) {
      const extractor = this.getFileExtractor(`.${extension}`, extractors);
      const extractedSelectors = await /* @__PURE__ */ extractSelectors(raw, extractor);
      selectors.merge(extractedSelectors);
    }
    return selectors;
  }
  /**
   * Evaluate at-rule and register it for future reference
   * @param node - node of postcss AST
   */
  evaluateAtRule(node) {
    if (this.options.keyframes && node.name.endsWith("keyframes")) {
      this.atRules.keyframes.push(node);
      return;
    }
    if (this.options.fontFace && node.name === "font-face" && node.nodes) {
      for (const childNode of node.nodes) {
        if (childNode.type === "decl" && childNode.prop === "font-family") {
          this.atRules.fontFace.push({
            name: /* @__PURE__ */ stripQuotes(childNode.value),
            node
          });
        }
      }
    }
  }
  /**
   * Evaluate css selector and decide if it should be removed or not
   *
   * @param node - node of postcss AST
   * @param selectors - selectors used in content files
   */
  evaluateRule(node, selectors) {
    if (this.ignore) {
      return;
    }
    const annotation = node.prev();
    if (/* @__PURE__ */ isPostCSSComment(annotation) && /* @__PURE__ */ isIgnoreAnnotation(annotation, "next")) {
      annotation.remove();
      return;
    }
    if (node.parent && /* @__PURE__ */ isPostCSSAtRule(node.parent) && node.parent.name.endsWith("keyframes")) {
      return;
    }
    if (!/* @__PURE__ */ isPostCSSRule(node)) {
      return;
    }
    if (/* @__PURE__ */ hasIgnoreAnnotation(node)) {
      return;
    }
    const selectorsRemovedFromRule = [];
    node.selector = postcss_selector_parser_default((selectorsParsed) => {
      selectorsParsed.walk((selector2) => {
        if (selector2.type !== "selector") {
          return;
        }
        const keepSelector = this.shouldKeepSelector(selector2, selectors);
        if (!keepSelector) {
          if (this.options.rejected) {
            this.selectorsRemoved.add(selector2.toString());
          }
          if (this.options.rejectedCss) {
            selectorsRemovedFromRule.push(selector2.toString());
          }
          selector2.remove();
        }
      });
      selectorsParsed.walk((selector2) => {
        if (selector2.type !== "selector") {
          return;
        }
        if (selector2.toString() && /(:where)|(:is)/.test(selector2.toString())) {
          selector2.walk((node2) => {
            if (node2.type !== "pseudo") return;
            if (node2.value !== ":where" && node2.value !== ":is") return;
            if (node2.nodes.length === 0) {
              selector2.remove();
            }
          });
        }
      });
    }).processSync(node.selector);
    if (node.selector && typeof node.nodes !== "undefined") {
      for (const childNode of node.nodes) {
        if (childNode.type !== "decl") continue;
        this.collectDeclarationsData(childNode);
      }
    }
    const parent = node.parent;
    if (!node.selector) {
      node.remove();
    }
    if (/* @__PURE__ */ isRuleEmpty(parent)) parent?.remove();
    if (this.options.rejectedCss) {
      if (selectorsRemovedFromRule.length > 0) {
        const clone = node.clone();
        const parentClone = parent?.clone().removeAll().append(clone);
        clone.selectors = selectorsRemovedFromRule;
        const nodeToPreserve = parentClone ? parentClone : clone;
        this.removedNodes.push(nodeToPreserve);
      }
    }
  }
  /**
   * Get the purged version of the css based on the files
   *
   * @param cssOptions - css options, files or raw strings
   * @param selectors - set of extracted css selectors
   */
  async getPurgedCSS(cssOptions, selectors) {
    const sources = [];
    const processedOptions = [];
    for (const option of cssOptions) {
      if (typeof option === "string") {
        throw new Error("PurgeCSS: string options are not supported");
      } else {
        processedOptions.push(option);
      }
    }
    for (const option of processedOptions) {
      const cssContent = typeof option === "string" ? this.options.stdin ? option : null : option.raw;
      const isFromFile = typeof option === "string" && !this.options.stdin;
      const root2 = postcss_default.parse(cssContent, {
        from: isFromFile ? option : void 0
      });
      this.walkThroughCSS(root2, selectors);
      if (this.options.fontFace) this.removeUnusedFontFaces();
      if (this.options.keyframes) this.removeUnusedKeyframes();
      if (this.options.variables) this.removeUnusedCSSVariables();
      const postCSSResult = root2.toResult({
        map: this.options.sourceMap,
        to: typeof this.options.sourceMap === "object" ? this.options.sourceMap.to : void 0
      });
      const result = {
        css: postCSSResult.toString(),
        file: typeof option === "string" ? option : option.name
      };
      if (this.options.sourceMap) {
        result.sourceMap = postCSSResult.map?.toString();
      }
      if (this.options.rejected) {
        result.rejected = Array.from(this.selectorsRemoved);
        this.selectorsRemoved.clear();
      }
      if (this.options.rejectedCss) {
        result.rejectedCss = postcss_default.root({ nodes: this.removedNodes }).toString();
      }
      sources.push(result);
    }
    return sources;
  }
  /**
   * Check if the keyframe is safelisted with the option safelist keyframes
   *
   * @param keyframesName - name of the keyframe animation
   */
  isKeyframesSafelisted(keyframesName) {
    return this.options.safelist.keyframes.some((safelistItem) => {
      return typeof safelistItem === "string" ? safelistItem === keyframesName : safelistItem.test(keyframesName);
    });
  }
  /**
   * Check if the selector is blocklisted with the option blocklist
   *
   * @param selector - css selector
   */
  isSelectorBlocklisted(selector2) {
    return this.options.blocklist.some((blocklistItem) => {
      return typeof blocklistItem === "string" ? blocklistItem === selector2 : blocklistItem.test(selector2);
    });
  }
  /**
   * Check if the selector is safelisted with the option safelist standard
   *
   * @param selector - css selector
   */
  isSelectorSafelisted(selector2) {
    const isSafelisted = this.options.safelist.standard.some((safelistItem) => {
      return typeof safelistItem === "string" ? safelistItem === selector2 : safelistItem.test(selector2);
    });
    const isPseudoElement2 = /^::.*/.test(selector2);
    return CSS_SAFELIST.includes(selector2) || isPseudoElement2 || isSafelisted;
  }
  /**
   * Check if the selector is safelisted with the option safelist deep
   *
   * @param selector - selector
   */
  isSelectorSafelistedDeep(selector2) {
    return this.options.safelist.deep.some(
      (safelistItem) => safelistItem.test(selector2)
    );
  }
  /**
   * Check if the selector is safelisted with the option safelist greedy
   *
   * @param selector - selector
   */
  isSelectorSafelistedGreedy(selector2) {
    return this.options.safelist.greedy.some(
      (safelistItem) => safelistItem.test(selector2)
    );
  }
  /**
   * Remove unused CSS
   *
   * @param userOptions - PurgeCSS options or path to the configuration file
   * @returns an array of object containing the filename and the associated CSS
   *
   * @example Using a configuration file named purgecss.config.js
   * ```ts
   * const purgeCSSResults = await new PurgeCSS().purge()
   * ```
   *
   * @example Using a custom path to the configuration file
   * ```ts
   * const purgeCSSResults = await new PurgeCSS().purge('./purgecss.config.js')
   * ```
   *
   * @example Using the PurgeCSS options
   * ```ts
   * const purgeCSSResults = await new PurgeCSS().purge({
   *    content: ['index.html', '**\/*.js', '**\/*.html', '**\/*.vue'],
   *    css: ['css/app.css']
   * })
   * ```
   */
  async purge(userOptions) {
    this.options = typeof userOptions !== "object" ? await setOptions(userOptions) : {
      ...defaultOptions,
      ...userOptions,
      safelist: /* @__PURE__ */ standardizeSafelist(userOptions.safelist)
    };
    const { content, css, extractors, safelist } = this.options;
    if (this.options.variables) {
      this.variablesStructure.safelist = safelist.variables || [];
    }
    const rawFormatContents = content.filter(
      (o) => typeof o === "object"
    );
    const cssRawSelectors = await this.extractSelectorsFromString(
      rawFormatContents,
      extractors
    );
    return this.getPurgedCSS(
      css,
      /* @__PURE__ */ mergeExtractorSelectors({}, cssRawSelectors)
    );
  }
  /**
   * Remove unused CSS variables
   */
  removeUnusedCSSVariables() {
    this.variablesStructure.removeUnused();
  }
  /**
   * Remove unused font-faces
   */
  removeUnusedFontFaces() {
    for (const { name, node } of this.atRules.fontFace) {
      if (!this.usedFontFaces.has(name)) {
        node.remove();
      }
    }
  }
  /**
   * Remove unused keyframes
   */
  removeUnusedKeyframes() {
    for (const node of this.atRules.keyframes) {
      if (!this.usedAnimations.has(node.params) && !this.isKeyframesSafelisted(node.params)) {
        node.remove();
      }
    }
  }
  /**
   * Transform a selector node into a string
   */
  getSelectorValue(selector2) {
    return selector2.type === "attribute" && selector2.attribute || selector2.value;
  }
  /**
   * Determine if the selector should be kept, based on the selectors found in the files
   *
   * @param selector - set of css selectors found in the content files or string
   * @param selectorsFromExtractor - selectors in the css rule
   *
   * @returns true if the selector should be kept in the processed CSS
   */
  shouldKeepSelector(selector2, selectorsFromExtractor) {
    if (/* @__PURE__ */ isInPseudoClass(selector2) && !/* @__PURE__ */ isInPseudoClassWhereOrIs(selector2)) {
      return true;
    }
    if (/* @__PURE__ */ isPseudoClassAtRootLevel(selector2)) {
      return true;
    }
    if (this.options.safelist.greedy.length > 0) {
      const selectorParts = selector2.nodes.map(this.getSelectorValue);
      if (selectorParts.some(
        (selectorPart) => selectorPart && this.isSelectorSafelistedGreedy(selectorPart)
      )) {
        return true;
      }
    }
    let isPresent = false;
    for (const selectorNode of selector2.nodes) {
      const selectorValue = this.getSelectorValue(selectorNode);
      if (selectorValue && this.isSelectorSafelistedDeep(selectorValue)) {
        return true;
      }
      if (selectorValue && (CSS_SAFELIST.includes(selectorValue) || this.isSelectorSafelisted(selectorValue))) {
        isPresent = true;
        continue;
      }
      if (selectorValue && this.isSelectorBlocklisted(selectorValue)) {
        return false;
      }
      switch (selectorNode.type) {
        case "attribute":
          isPresent = [
            ...this.options.dynamicAttributes,
            "value",
            "checked",
            "selected",
            "open"
          ].includes(selectorNode.attribute) ? true : /* @__PURE__ */ isAttributeFound(selectorNode, selectorsFromExtractor);
          break;
        case "class":
          isPresent = /* @__PURE__ */ isClassFound(selectorNode, selectorsFromExtractor);
          break;
        case "id":
          isPresent = /* @__PURE__ */ isIdentifierFound(selectorNode, selectorsFromExtractor);
          break;
        case "tag":
          isPresent = /* @__PURE__ */ isTagFound(selectorNode, selectorsFromExtractor);
          break;
        default:
          continue;
      }
      if (!isPresent) {
        return false;
      }
    }
    return isPresent;
  }
  /**
   * Walk through the CSS AST and remove unused CSS
   *
   * @param root - root node of the postcss AST
   * @param selectors - selectors used in content files
   */
  walkThroughCSS(root2, selectors) {
    root2.walk((node) => {
      if (node.type === "rule") {
        return this.evaluateRule(node, selectors);
      }
      if (node.type === "atrule") {
        return this.evaluateAtRule(node);
      }
      if (node.type === "comment") {
        if (/* @__PURE__ */ isIgnoreAnnotation(node, "start")) {
          this.ignore = true;
          node.remove();
        } else if (/* @__PURE__ */ isIgnoreAnnotation(node, "end")) {
          this.ignore = false;
          node.remove();
        }
      }
    });
  }
};

// src/postcss.ts
var PLUGIN_NAME = "postcss-purgecss";
async function purgeCSS(opts, root2, { result }) {
  const purgeCSS2 = new PurgeCSS();
  let configFileOptions;
  const options = {
    ...defaultOptions,
    ...configFileOptions,
    ...opts,
    safelist: standardizeSafelist(
      opts?.safelist || configFileOptions?.safelist
    )
  };
  if (opts && typeof opts.contentFunction === "function") {
    options.content = opts.contentFunction(
      // @ts-ignore
      root2.source && root2.source.input.file || ""
    );
  }
  purgeCSS2.options = options;
  if (options.variables) {
    purgeCSS2.variablesStructure.safelist = options.safelist.variables || [];
  }
  const { content, extractors } = options;
  const rawFormatContents = content.filter(
    (o) => typeof o === "object"
  );
  const cssRawSelectors = await purgeCSS2.extractSelectorsFromString(
    rawFormatContents,
    extractors
  );
  const selectors = mergeExtractorSelectors({}, cssRawSelectors);
  purgeCSS2.walkThroughCSS(root2, selectors);
  if (purgeCSS2.options.fontFace) purgeCSS2.removeUnusedFontFaces();
  if (purgeCSS2.options.keyframes) purgeCSS2.removeUnusedKeyframes();
  if (purgeCSS2.options.variables) purgeCSS2.removeUnusedCSSVariables();
  if (purgeCSS2.options.rejected && purgeCSS2.selectorsRemoved.size > 0) {
    result.messages.push({
      type: "purgecss",
      plugin: "postcss-purgecss",
      text: `purging ${purgeCSS2.selectorsRemoved.size} selectors:
          ${Array.from(purgeCSS2.selectorsRemoved).map((selector2) => selector2.trim()).join("\n  ")}`
    });
    purgeCSS2.selectorsRemoved.clear();
  }
}
__name(purgeCSS, "purgeCSS");
var purgeCSSPlugin = /* @__PURE__ */ __name((opts) => {
  if (typeof opts === "undefined")
    throw new Error("PurgeCSS plugin does not have the correct options");
  return {
    postcssPlugin: PLUGIN_NAME,
    OnceExit(root2, helpers) {
      return purgeCSS(opts, root2, helpers);
    }
  };
}, "purgeCSSPlugin");
purgeCSSPlugin.postcss = true;

// src/css-tokenizer/interfaces/error.ts
var ParseError = class extends Error {
  static {
    __name(this, "ParseError");
  }
  constructor(message, sourceStart, sourceEnd, parserState) {
    super(message);
    this.name = "ParseError";
    this.sourceStart = sourceStart;
    this.sourceEnd = sourceEnd;
    this.parserState = parserState;
  }
};
var ParseErrorWithToken = class extends ParseError {
  static {
    __name(this, "ParseErrorWithToken");
  }
  constructor(message, sourceStart, sourceEnd, parserState, token) {
    super(message, sourceStart, sourceEnd, parserState);
    this.token = token;
  }
};
var ParseErrorMessage = {
  UnexpectedNewLineInString: "Unexpected newline while consuming a string token.",
  UnexpectedEOFInString: "Unexpected EOF while consuming a string token.",
  UnexpectedEOFInComment: "Unexpected EOF while consuming a comment.",
  UnexpectedEOFInURL: "Unexpected EOF while consuming a url token.",
  UnexpectedEOFInEscapedCodePoint: "Unexpected EOF while consuming an escaped code point.",
  UnexpectedCharacterInURL: "Unexpected character while consuming a url token.",
  InvalidEscapeSequenceInURL: "Invalid escape sequence while consuming a url token.",
  InvalidEscapeSequenceAfterBackslash: 'Invalid escape sequence after "\\"'
};

// src/css-tokenizer/util/clone-tokens.ts
var supportsStructuredClone = typeof globalThis !== "undefined" && "structuredClone" in globalThis;

// src/css-tokenizer/code-points/code-points.ts
var APOSTROPHE = 39;
var ASTERISK2 = 42;
var BACKSPACE = 8;
var CARRIAGE_RETURN = 13;
var CHARACTER_TABULATION = 9;
var COLON2 = 58;
var COMMA = 44;
var COMMERCIAL_AT = 64;
var DELETE = 127;
var EXCLAMATION_MARK = 33;
var FORM_FEED = 12;
var FULL_STOP = 46;
var GREATER_THAN_SIGN = 62;
var HYPHEN_MINUS = 45;
var INFORMATION_SEPARATOR_ONE = 31;
var LATIN_CAPITAL_LETTER_E = 69;
var LATIN_SMALL_LETTER_E = 101;
var LEFT_CURLY_BRACKET = 123;
var LEFT_PARENTHESIS = 40;
var LEFT_SQUARE_BRACKET = 91;
var LESS_THAN_SIGN = 60;
var LINE_FEED = 10;
var LINE_TABULATION = 11;
var LOW_LINE = 95;
var MAXIMUM_ALLOWED_CODEPOINT = 1114111;
var NULL = 0;
var NUMBER_SIGN = 35;
var PERCENTAGE_SIGN = 37;
var PLUS_SIGN = 43;
var QUOTATION_MARK = 34;
var REPLACEMENT_CHARACTER = 65533;
var REVERSE_SOLIDUS = 92;
var RIGHT_CURLY_BRACKET = 125;
var RIGHT_PARENTHESIS = 41;
var RIGHT_SQUARE_BRACKET = 93;
var SEMICOLON2 = 59;
var SHIFT_OUT = 14;
var SOLIDUS = 47;
var SPACE2 = 32;
var LATIN_SMALL_LETTER_U = 117;
var LATIN_CAPITAL_LETTER_U = 85;
var LATIN_SMALL_LETTER_R = 114;
var LATIN_CAPITAL_LETTER_R = 82;
var LATIN_SMALL_LETTER_L = 108;
var LATIN_CAPITAL_LETTER_L = 76;
var QUESTION_MARK = 63;
var DIGIT_ZERO = 48;
var LATIN_CAPITAL_LETTER_F = 70;

// src/css-tokenizer/checks/four-code-points-would-start-cdo.ts
function checkIfFourCodePointsWouldStartCDO(reader) {
  return reader.source.codePointAt(reader.cursor) === LESS_THAN_SIGN && reader.source.codePointAt(reader.cursor + 1) === EXCLAMATION_MARK && reader.source.codePointAt(reader.cursor + 2) === HYPHEN_MINUS && reader.source.codePointAt(reader.cursor + 3) === HYPHEN_MINUS;
}
__name(checkIfFourCodePointsWouldStartCDO, "checkIfFourCodePointsWouldStartCDO");

// src/css-tokenizer/code-points/ranges.ts
function isDigitCodePoint(search) {
  return search >= 48 && search <= 57;
}
__name(isDigitCodePoint, "isDigitCodePoint");
function isUppercaseLetterCodePoint(search) {
  return search >= 65 && search <= 90;
}
__name(isUppercaseLetterCodePoint, "isUppercaseLetterCodePoint");
function isLowercaseLetterCodePoint(search) {
  return search >= 97 && search <= 122;
}
__name(isLowercaseLetterCodePoint, "isLowercaseLetterCodePoint");
function isHexDigitCodePoint(search) {
  return search >= 48 && search <= 57 || // 0 .. 9
  search >= 97 && search <= 102 || // a .. f
  search >= 65 && search <= 70;
}
__name(isHexDigitCodePoint, "isHexDigitCodePoint");
function isLetterCodePoint(search) {
  return isLowercaseLetterCodePoint(search) || isUppercaseLetterCodePoint(search);
}
__name(isLetterCodePoint, "isLetterCodePoint");
function isIdentStartCodePoint(search) {
  return isLetterCodePoint(search) || isNonASCII_IdentCodePoint(search) || search === LOW_LINE;
}
__name(isIdentStartCodePoint, "isIdentStartCodePoint");
function isIdentCodePoint(search) {
  return isIdentStartCodePoint(search) || isDigitCodePoint(search) || search === HYPHEN_MINUS;
}
__name(isIdentCodePoint, "isIdentCodePoint");
function isNonASCII_IdentCodePoint(search) {
  if (search === 183 || search === 8204 || search === 8205 || search === 8255 || search === 8256 || search === 8204) {
    return true;
  }
  if (192 <= search && search <= 214 || 216 <= search && search <= 246 || 248 <= search && search <= 893 || 895 <= search && search <= 8191 || 8304 <= search && search <= 8591 || 11264 <= search && search <= 12271 || 12289 <= search && search <= 55295 || 63744 <= search && search <= 64975 || 65008 <= search && search <= 65533) {
    return true;
  }
  if (search === 0) {
    return true;
  } else if (isSurrogate(search)) {
    return true;
  }
  return search >= 65536;
}
__name(isNonASCII_IdentCodePoint, "isNonASCII_IdentCodePoint");
function isNonPrintableCodePoint(search) {
  return search === LINE_TABULATION || search === DELETE || NULL <= search && search <= BACKSPACE || SHIFT_OUT <= search && search <= INFORMATION_SEPARATOR_ONE;
}
__name(isNonPrintableCodePoint, "isNonPrintableCodePoint");
function isNewLine(search) {
  return search === LINE_FEED || search === CARRIAGE_RETURN || search === FORM_FEED;
}
__name(isNewLine, "isNewLine");
function isWhitespace(search) {
  return search === SPACE2 || search === LINE_FEED || search === CHARACTER_TABULATION || search === CARRIAGE_RETURN || search === FORM_FEED;
}
__name(isWhitespace, "isWhitespace");
function isSurrogate(search) {
  return search >= 55296 && search <= 57343;
}
__name(isSurrogate, "isSurrogate");

// src/css-tokenizer/checks/two-code-points-are-valid-escape.ts
function checkIfTwoCodePointsAreAValidEscape(reader) {
  return (
    // If the first code point is not U+005C REVERSE SOLIDUS (\), return false.
    reader.source.codePointAt(reader.cursor) === REVERSE_SOLIDUS && // Otherwise, if the second code point is a newline, return false.
    !isNewLine(reader.source.codePointAt(reader.cursor + 1) ?? -1)
  );
}
__name(checkIfTwoCodePointsAreAValidEscape, "checkIfTwoCodePointsAreAValidEscape");

// src/css-tokenizer/checks/three-code-points-would-start-ident-sequence.ts
function checkIfThreeCodePointsWouldStartAnIdentSequence(ctx, reader) {
  if (reader.source.codePointAt(reader.cursor) === HYPHEN_MINUS) {
    if (reader.source.codePointAt(reader.cursor + 1) === HYPHEN_MINUS) {
      return true;
    }
    if (isIdentStartCodePoint(reader.source.codePointAt(reader.cursor + 1) ?? -1)) {
      return true;
    }
    if (reader.source.codePointAt(reader.cursor + 1) === REVERSE_SOLIDUS && !isNewLine(reader.source.codePointAt(reader.cursor + 2) ?? -1)) {
      return true;
    }
    return false;
  }
  if (isIdentStartCodePoint(reader.source.codePointAt(reader.cursor) ?? -1)) {
    return true;
  }
  return checkIfTwoCodePointsAreAValidEscape(reader);
}
__name(checkIfThreeCodePointsWouldStartAnIdentSequence, "checkIfThreeCodePointsWouldStartAnIdentSequence");

// src/css-tokenizer/checks/three-code-points-would-start-number.ts
function checkIfThreeCodePointsWouldStartANumber(reader) {
  if (reader.source.codePointAt(reader.cursor) === PLUS_SIGN || reader.source.codePointAt(reader.cursor) === HYPHEN_MINUS) {
    if (isDigitCodePoint(reader.source.codePointAt(reader.cursor + 1) ?? -1)) {
      return true;
    }
    if (reader.source.codePointAt(reader.cursor + 1) === FULL_STOP) {
      return isDigitCodePoint(reader.source.codePointAt(reader.cursor + 2) ?? -1);
    }
    return false;
  } else if (reader.source.codePointAt(reader.cursor) === FULL_STOP) {
    return isDigitCodePoint(reader.source.codePointAt(reader.cursor + 1) ?? -1);
  }
  return isDigitCodePoint(reader.source.codePointAt(reader.cursor) ?? -1);
}
__name(checkIfThreeCodePointsWouldStartANumber, "checkIfThreeCodePointsWouldStartANumber");

// src/css-tokenizer/checks/two-code-points-start-comment.ts
function checkIfTwoCodePointsStartAComment(reader) {
  return reader.source.codePointAt(reader.cursor) === SOLIDUS && reader.source.codePointAt(reader.cursor + 1) === ASTERISK2;
}
__name(checkIfTwoCodePointsStartAComment, "checkIfTwoCodePointsStartAComment");

// src/css-tokenizer/checks/three-code-points-would-start-cdc.ts
function checkIfThreeCodePointsWouldStartCDC(reader) {
  return reader.source.codePointAt(reader.cursor) === HYPHEN_MINUS && reader.source.codePointAt(reader.cursor + 1) === HYPHEN_MINUS && reader.source.codePointAt(reader.cursor + 2) === GREATER_THAN_SIGN;
}
__name(checkIfThreeCodePointsWouldStartCDC, "checkIfThreeCodePointsWouldStartCDC");

// src/css-tokenizer/interfaces/token.ts
var TokenType = /* @__PURE__ */ ((TokenType2) => {
  TokenType2["Comment"] = "comment";
  TokenType2["AtKeyword"] = "at-keyword-token";
  TokenType2["BadString"] = "bad-string-token";
  TokenType2["BadURL"] = "bad-url-token";
  TokenType2["CDC"] = "CDC-token";
  TokenType2["CDO"] = "CDO-token";
  TokenType2["Colon"] = "colon-token";
  TokenType2["Comma"] = "comma-token";
  TokenType2["Delim"] = "delim-token";
  TokenType2["Dimension"] = "dimension-token";
  TokenType2["EOF"] = "EOF-token";
  TokenType2["Function"] = "function-token";
  TokenType2["Hash"] = "hash-token";
  TokenType2["Ident"] = "ident-token";
  TokenType2["Number"] = "number-token";
  TokenType2["Percentage"] = "percentage-token";
  TokenType2["Semicolon"] = "semicolon-token";
  TokenType2["String"] = "string-token";
  TokenType2["URL"] = "url-token";
  TokenType2["Whitespace"] = "whitespace-token";
  TokenType2["OpenParen"] = "(-token";
  TokenType2["CloseParen"] = ")-token";
  TokenType2["OpenSquare"] = "[-token";
  TokenType2["CloseSquare"] = "]-token";
  TokenType2["OpenCurly"] = "{-token";
  TokenType2["CloseCurly"] = "}-token";
  TokenType2["UnicodeRange"] = "unicode-range-token";
  return TokenType2;
})(TokenType || {});

// src/css-tokenizer/consume/comment.ts
function consumeComment(ctx, reader) {
  reader.advanceCodePoint(2);
  while (true) {
    const codePoint = reader.readCodePoint();
    if (typeof codePoint === "undefined") {
      const token = [
        "comment" /* Comment */,
        reader.source.slice(reader.representationStart, reader.representationEnd + 1),
        reader.representationStart,
        reader.representationEnd,
        void 0
      ];
      ctx.onParseError(new ParseErrorWithToken(
        ParseErrorMessage.UnexpectedEOFInComment,
        reader.representationStart,
        reader.representationEnd,
        [
          "4.3.2. Consume comments",
          "Unexpected EOF"
        ],
        token
      ));
      return token;
    }
    if (codePoint !== ASTERISK2) {
      continue;
    }
    if (typeof reader.source.codePointAt(reader.cursor) === "undefined") {
      continue;
    }
    if (reader.source.codePointAt(reader.cursor) === SOLIDUS) {
      reader.advanceCodePoint();
      break;
    }
  }
  return [
    "comment" /* Comment */,
    reader.source.slice(reader.representationStart, reader.representationEnd + 1),
    reader.representationStart,
    reader.representationEnd,
    void 0
  ];
}
__name(consumeComment, "consumeComment");

// src/css-tokenizer/consume/escaped-code-point.ts
function consumeEscapedCodePoint(ctx, reader) {
  const codePoint = reader.readCodePoint();
  if (typeof codePoint === "undefined") {
    ctx.onParseError(new ParseError(
      ParseErrorMessage.UnexpectedEOFInEscapedCodePoint,
      reader.representationStart,
      reader.representationEnd,
      [
        "4.3.7. Consume an escaped code point",
        "Unexpected EOF"
      ]
    ));
    return REPLACEMENT_CHARACTER;
  }
  if (isHexDigitCodePoint(codePoint)) {
    const hexSequence = [codePoint];
    let nextCodePoint;
    while (typeof (nextCodePoint = reader.source.codePointAt(reader.cursor)) !== "undefined" && isHexDigitCodePoint(nextCodePoint) && hexSequence.length < 6) {
      hexSequence.push(nextCodePoint);
      reader.advanceCodePoint();
    }
    if (isWhitespace(reader.source.codePointAt(reader.cursor) ?? -1)) {
      if (reader.source.codePointAt(reader.cursor) === CARRIAGE_RETURN && reader.source.codePointAt(reader.cursor + 1) === LINE_FEED) {
        reader.advanceCodePoint();
      }
      reader.advanceCodePoint();
    }
    const codePointLiteral = parseInt(String.fromCodePoint(...hexSequence), 16);
    if (codePointLiteral === 0 || isSurrogate(codePointLiteral)) {
      return REPLACEMENT_CHARACTER;
    }
    if (codePointLiteral > MAXIMUM_ALLOWED_CODEPOINT) {
      return REPLACEMENT_CHARACTER;
    }
    return codePointLiteral;
  }
  if (codePoint === 0 || isSurrogate(codePoint)) {
    return REPLACEMENT_CHARACTER;
  }
  return codePoint;
}
__name(consumeEscapedCodePoint, "consumeEscapedCodePoint");

// src/css-tokenizer/consume/ident-sequence.ts
function consumeIdentSequence(ctx, reader) {
  const result = [];
  while (true) {
    const codePoint = reader.source.codePointAt(reader.cursor) ?? -1;
    if (codePoint === NULL || isSurrogate(codePoint)) {
      result.push(REPLACEMENT_CHARACTER);
      reader.advanceCodePoint(1 + +(codePoint > 65535));
      continue;
    }
    if (isIdentCodePoint(codePoint)) {
      result.push(codePoint);
      reader.advanceCodePoint(1 + +(codePoint > 65535));
      continue;
    }
    if (checkIfTwoCodePointsAreAValidEscape(reader)) {
      reader.advanceCodePoint();
      result.push(consumeEscapedCodePoint(ctx, reader));
      continue;
    }
    return result;
  }
}
__name(consumeIdentSequence, "consumeIdentSequence");

// src/css-tokenizer/consume/hash-token.ts
function consumeHashToken(ctx, reader) {
  reader.advanceCodePoint();
  const codePoint = reader.source.codePointAt(reader.cursor);
  if (typeof codePoint !== "undefined" && (isIdentCodePoint(codePoint) || checkIfTwoCodePointsAreAValidEscape(reader))) {
    let hashType = "unrestricted" /* Unrestricted */;
    if (checkIfThreeCodePointsWouldStartAnIdentSequence(ctx, reader)) {
      hashType = "id" /* ID */;
    }
    const identSequence = consumeIdentSequence(ctx, reader);
    return [
      "hash-token" /* Hash */,
      reader.source.slice(reader.representationStart, reader.representationEnd + 1),
      reader.representationStart,
      reader.representationEnd,
      {
        value: String.fromCodePoint(...identSequence),
        type: hashType
      }
    ];
  }
  return [
    "delim-token" /* Delim */,
    "#",
    reader.representationStart,
    reader.representationEnd,
    {
      value: "#"
    }
  ];
}
__name(consumeHashToken, "consumeHashToken");

// src/css-tokenizer/consume/number.ts
function consumeNumber(ctx, reader) {
  let type = "integer" /* Integer */;
  if (reader.source.codePointAt(reader.cursor) === PLUS_SIGN || reader.source.codePointAt(reader.cursor) === HYPHEN_MINUS) {
    reader.advanceCodePoint();
  }
  while (isDigitCodePoint(reader.source.codePointAt(reader.cursor) ?? -1)) {
    reader.advanceCodePoint();
  }
  if (reader.source.codePointAt(reader.cursor) === FULL_STOP && isDigitCodePoint(reader.source.codePointAt(reader.cursor + 1) ?? -1)) {
    reader.advanceCodePoint(2);
    type = "number" /* Number */;
    while (isDigitCodePoint(reader.source.codePointAt(reader.cursor) ?? -1)) {
      reader.advanceCodePoint();
    }
  }
  if (reader.source.codePointAt(reader.cursor) === LATIN_SMALL_LETTER_E || reader.source.codePointAt(reader.cursor) === LATIN_CAPITAL_LETTER_E) {
    if (isDigitCodePoint(reader.source.codePointAt(reader.cursor + 1) ?? -1)) {
      reader.advanceCodePoint(2);
    } else if ((reader.source.codePointAt(reader.cursor + 1) === HYPHEN_MINUS || reader.source.codePointAt(reader.cursor + 1) === PLUS_SIGN) && isDigitCodePoint(reader.source.codePointAt(reader.cursor + 2) ?? -1)) {
      reader.advanceCodePoint(3);
    } else {
      return type;
    }
    type = "number" /* Number */;
    while (isDigitCodePoint(reader.source.codePointAt(reader.cursor) ?? -1)) {
      reader.advanceCodePoint();
    }
  }
  return type;
}
__name(consumeNumber, "consumeNumber");

// src/css-tokenizer/consume/numeric-token.ts
function consumeNumericToken(ctx, reader) {
  let signCharacter = void 0;
  {
    const peeked = reader.source.codePointAt(reader.cursor);
    if (peeked === HYPHEN_MINUS) {
      signCharacter = "-";
    } else if (peeked === PLUS_SIGN) {
      signCharacter = "+";
    }
  }
  const numberType = consumeNumber(ctx, reader);
  const numberValue = parseFloat(reader.source.slice(reader.representationStart, reader.representationEnd + 1));
  if (checkIfThreeCodePointsWouldStartAnIdentSequence(ctx, reader)) {
    const unit = consumeIdentSequence(ctx, reader);
    return [
      "dimension-token" /* Dimension */,
      reader.source.slice(reader.representationStart, reader.representationEnd + 1),
      reader.representationStart,
      reader.representationEnd,
      {
        value: numberValue,
        signCharacter,
        type: numberType,
        unit: String.fromCodePoint(...unit)
      }
    ];
  }
  if (reader.source.codePointAt(reader.cursor) === PERCENTAGE_SIGN) {
    reader.advanceCodePoint();
    return [
      "percentage-token" /* Percentage */,
      reader.source.slice(reader.representationStart, reader.representationEnd + 1),
      reader.representationStart,
      reader.representationEnd,
      {
        value: numberValue,
        signCharacter
      }
    ];
  }
  return [
    "number-token" /* Number */,
    reader.source.slice(reader.representationStart, reader.representationEnd + 1),
    reader.representationStart,
    reader.representationEnd,
    {
      value: numberValue,
      signCharacter,
      type: numberType
    }
  ];
}
__name(consumeNumericToken, "consumeNumericToken");

// src/css-tokenizer/consume/whitespace-token.ts
function consumeWhiteSpace(reader) {
  while (isWhitespace(reader.source.codePointAt(reader.cursor) ?? -1)) {
    reader.advanceCodePoint();
  }
  return [
    "whitespace-token" /* Whitespace */,
    reader.source.slice(reader.representationStart, reader.representationEnd + 1),
    reader.representationStart,
    reader.representationEnd,
    void 0
  ];
}
__name(consumeWhiteSpace, "consumeWhiteSpace");

// src/css-tokenizer/reader.ts
var Reader = class {
  constructor(source) {
    this.cursor = 0;
    this.source = "";
    this.representationStart = 0;
    this.representationEnd = -1;
    this.source = source;
  }
  static {
    __name(this, "Reader");
  }
  advanceCodePoint(n = 1) {
    this.cursor = this.cursor + n;
    this.representationEnd = this.cursor - 1;
  }
  readCodePoint() {
    const codePoint = this.source.codePointAt(this.cursor);
    if (typeof codePoint === "undefined") {
      return void 0;
    }
    this.cursor = this.cursor + 1;
    this.representationEnd = this.cursor - 1;
    return codePoint;
  }
  unreadCodePoint(n = 1) {
    this.cursor = this.cursor - n;
    this.representationEnd = this.cursor - 1;
    return;
  }
  resetRepresentation() {
    this.representationStart = this.cursor;
    this.representationEnd = -1;
  }
};

// src/css-tokenizer/consume/string-token.ts
function consumeStringToken(ctx, reader) {
  let result = "";
  const first = reader.readCodePoint();
  while (true) {
    const next = reader.readCodePoint();
    if (typeof next === "undefined") {
      const token = ["string-token" /* String */, reader.source.slice(reader.representationStart, reader.representationEnd + 1), reader.representationStart, reader.representationEnd, { value: result }];
      ctx.onParseError(new ParseErrorWithToken(
        ParseErrorMessage.UnexpectedEOFInString,
        reader.representationStart,
        reader.representationEnd,
        [
          "4.3.5. Consume a string token",
          "Unexpected EOF"
        ],
        token
      ));
      return token;
    }
    if (isNewLine(next)) {
      reader.unreadCodePoint();
      const token = ["bad-string-token" /* BadString */, reader.source.slice(reader.representationStart, reader.representationEnd + 1), reader.representationStart, reader.representationEnd, void 0];
      ctx.onParseError(new ParseErrorWithToken(
        ParseErrorMessage.UnexpectedNewLineInString,
        reader.representationStart,
        reader.source.codePointAt(reader.cursor) === CARRIAGE_RETURN && reader.source.codePointAt(reader.cursor + 1) === LINE_FEED ? (
          // CR LF
          reader.representationEnd + 2
        ) : (
          // LF
          reader.representationEnd + 1
        ),
        [
          "4.3.5. Consume a string token",
          "Unexpected newline"
        ],
        token
      ));
      return token;
    }
    if (next === first) {
      return ["string-token" /* String */, reader.source.slice(reader.representationStart, reader.representationEnd + 1), reader.representationStart, reader.representationEnd, { value: result }];
    }
    if (next === REVERSE_SOLIDUS) {
      if (typeof reader.source.codePointAt(reader.cursor) === "undefined") {
        continue;
      }
      if (isNewLine(reader.source.codePointAt(reader.cursor) ?? -1)) {
        if (reader.source.codePointAt(reader.cursor) === CARRIAGE_RETURN && reader.source.codePointAt(reader.cursor + 1) === LINE_FEED) {
          reader.advanceCodePoint();
        }
        reader.advanceCodePoint();
        continue;
      }
      result = result + String.fromCodePoint(consumeEscapedCodePoint(ctx, reader));
      continue;
    }
    if (next === NULL || isSurrogate(next)) {
      result = result + String.fromCodePoint(REPLACEMENT_CHARACTER);
      continue;
    }
    result = result + String.fromCodePoint(next);
  }
}
__name(consumeStringToken, "consumeStringToken");

// src/css-tokenizer/checks/matches-url-ident.ts
function checkIfCodePointsMatchURLIdent(codePoints) {
  return codePoints.length === 3 && (codePoints[0] === LATIN_SMALL_LETTER_U || codePoints[0] === LATIN_CAPITAL_LETTER_U) && (codePoints[1] === LATIN_SMALL_LETTER_R || codePoints[1] === LATIN_CAPITAL_LETTER_R) && (codePoints[2] === LATIN_SMALL_LETTER_L || codePoints[2] === LATIN_CAPITAL_LETTER_L);
}
__name(checkIfCodePointsMatchURLIdent, "checkIfCodePointsMatchURLIdent");

// src/css-tokenizer/consume/bad-url.ts
function consumeBadURL(ctx, reader) {
  while (true) {
    const codePoint = reader.source.codePointAt(reader.cursor);
    if (typeof codePoint === "undefined") {
      return;
    }
    if (codePoint === RIGHT_PARENTHESIS) {
      reader.advanceCodePoint();
      return;
    }
    if (checkIfTwoCodePointsAreAValidEscape(reader)) {
      reader.advanceCodePoint();
      consumeEscapedCodePoint(ctx, reader);
      continue;
    }
    reader.advanceCodePoint();
    continue;
  }
}
__name(consumeBadURL, "consumeBadURL");

// src/css-tokenizer/consume/url-token.ts
function consumeUrlToken(ctx, reader) {
  while (isWhitespace(reader.source.codePointAt(reader.cursor) ?? -1)) {
    reader.advanceCodePoint();
  }
  let string2 = "";
  while (true) {
    if (typeof reader.source.codePointAt(reader.cursor) === "undefined") {
      const token = [
        "url-token" /* URL */,
        reader.source.slice(reader.representationStart, reader.representationEnd + 1),
        reader.representationStart,
        reader.representationEnd,
        {
          value: string2
        }
      ];
      ctx.onParseError(new ParseErrorWithToken(
        ParseErrorMessage.UnexpectedEOFInURL,
        reader.representationStart,
        reader.representationEnd,
        [
          "4.3.6. Consume a url token",
          "Unexpected EOF"
        ],
        token
      ));
      return token;
    }
    if (reader.source.codePointAt(reader.cursor) === RIGHT_PARENTHESIS) {
      reader.advanceCodePoint();
      return [
        "url-token" /* URL */,
        reader.source.slice(reader.representationStart, reader.representationEnd + 1),
        reader.representationStart,
        reader.representationEnd,
        {
          value: string2
        }
      ];
    }
    if (isWhitespace(reader.source.codePointAt(reader.cursor) ?? -1)) {
      reader.advanceCodePoint();
      while (isWhitespace(reader.source.codePointAt(reader.cursor) ?? -1)) {
        reader.advanceCodePoint();
      }
      if (typeof reader.source.codePointAt(reader.cursor) === "undefined") {
        const token = [
          "url-token" /* URL */,
          reader.source.slice(reader.representationStart, reader.representationEnd + 1),
          reader.representationStart,
          reader.representationEnd,
          {
            value: string2
          }
        ];
        ctx.onParseError(new ParseErrorWithToken(
          ParseErrorMessage.UnexpectedEOFInURL,
          reader.representationStart,
          reader.representationEnd,
          [
            "4.3.6. Consume a url token",
            "Consume as much whitespace as possible",
            "Unexpected EOF"
          ],
          token
        ));
        return token;
      }
      if (reader.source.codePointAt(reader.cursor) === RIGHT_PARENTHESIS) {
        reader.advanceCodePoint();
        return [
          "url-token" /* URL */,
          reader.source.slice(reader.representationStart, reader.representationEnd + 1),
          reader.representationStart,
          reader.representationEnd,
          {
            value: string2
          }
        ];
      }
      consumeBadURL(ctx, reader);
      return [
        "bad-url-token" /* BadURL */,
        reader.source.slice(reader.representationStart, reader.representationEnd + 1),
        reader.representationStart,
        reader.representationEnd,
        void 0
      ];
    }
    const codePoint = reader.source.codePointAt(reader.cursor);
    if (codePoint === QUOTATION_MARK || codePoint === APOSTROPHE || codePoint === LEFT_PARENTHESIS || isNonPrintableCodePoint(codePoint ?? -1)) {
      consumeBadURL(ctx, reader);
      const token = [
        "bad-url-token" /* BadURL */,
        reader.source.slice(reader.representationStart, reader.representationEnd + 1),
        reader.representationStart,
        reader.representationEnd,
        void 0
      ];
      ctx.onParseError(new ParseErrorWithToken(
        ParseErrorMessage.UnexpectedCharacterInURL,
        reader.representationStart,
        reader.representationEnd,
        [
          "4.3.6. Consume a url token",
          `Unexpected U+0022 QUOTATION MARK ("), U+0027 APOSTROPHE ('), U+0028 LEFT PARENTHESIS (() or non-printable code point`
        ],
        token
      ));
      return token;
    }
    if (codePoint === REVERSE_SOLIDUS) {
      if (checkIfTwoCodePointsAreAValidEscape(reader)) {
        reader.advanceCodePoint();
        string2 = string2 + String.fromCodePoint(consumeEscapedCodePoint(ctx, reader));
        continue;
      }
      consumeBadURL(ctx, reader);
      const token = [
        "bad-url-token" /* BadURL */,
        reader.source.slice(reader.representationStart, reader.representationEnd + 1),
        reader.representationStart,
        reader.representationEnd,
        void 0
      ];
      ctx.onParseError(new ParseErrorWithToken(
        ParseErrorMessage.InvalidEscapeSequenceInURL,
        reader.representationStart,
        reader.representationEnd,
        [
          "4.3.6. Consume a url token",
          "U+005C REVERSE SOLIDUS (\\)",
          "The input stream does not start with a valid escape sequence"
        ],
        token
      ));
      return token;
    }
    if (reader.source.codePointAt(reader.cursor) === NULL || isSurrogate(reader.source.codePointAt(reader.cursor) ?? -1)) {
      string2 = string2 + String.fromCodePoint(REPLACEMENT_CHARACTER);
      reader.advanceCodePoint();
      continue;
    }
    string2 = string2 + reader.source[reader.cursor];
    reader.advanceCodePoint();
  }
}
__name(consumeUrlToken, "consumeUrlToken");

// src/css-tokenizer/consume/ident-like-token.ts
function consumeIdentLikeToken(ctx, reader) {
  const codePoints = consumeIdentSequence(ctx, reader);
  if (reader.source.codePointAt(reader.cursor) !== LEFT_PARENTHESIS) {
    return [
      "ident-token" /* Ident */,
      reader.source.slice(reader.representationStart, reader.representationEnd + 1),
      reader.representationStart,
      reader.representationEnd,
      {
        value: String.fromCodePoint(...codePoints)
      }
    ];
  }
  if (checkIfCodePointsMatchURLIdent(codePoints)) {
    reader.advanceCodePoint();
    let read = 0;
    while (true) {
      const firstIsWhitespace = isWhitespace(reader.source.codePointAt(reader.cursor) ?? -1);
      const secondIsWhitespace = isWhitespace(reader.source.codePointAt(reader.cursor + 1) ?? -1);
      if (firstIsWhitespace && secondIsWhitespace) {
        read = read + 1;
        reader.advanceCodePoint(1);
        continue;
      }
      const firstNonWhitespace = firstIsWhitespace ? reader.source.codePointAt(reader.cursor + 1) : reader.source.codePointAt(reader.cursor);
      if (firstNonWhitespace === QUOTATION_MARK || firstNonWhitespace === APOSTROPHE) {
        if (read > 0) {
          reader.unreadCodePoint(read);
        }
        return [
          "function-token" /* Function */,
          reader.source.slice(reader.representationStart, reader.representationEnd + 1),
          reader.representationStart,
          reader.representationEnd,
          {
            value: String.fromCodePoint(...codePoints)
          }
        ];
      }
      break;
    }
    return consumeUrlToken(ctx, reader);
  }
  reader.advanceCodePoint();
  return [
    "function-token" /* Function */,
    reader.source.slice(reader.representationStart, reader.representationEnd + 1),
    reader.representationStart,
    reader.representationEnd,
    {
      value: String.fromCodePoint(...codePoints)
    }
  ];
}
__name(consumeIdentLikeToken, "consumeIdentLikeToken");

// src/css-tokenizer/checks/three-code-points-would-start-unicode-range.ts
function checkIfThreeCodePointsWouldStartAUnicodeRange(reader) {
  if (
    // The first code point is either U+0055 LATIN CAPITAL LETTER U (U) or U+0075 LATIN SMALL LETTER U (u)
    (reader.source.codePointAt(reader.cursor) === LATIN_SMALL_LETTER_U || reader.source.codePointAt(reader.cursor) === LATIN_CAPITAL_LETTER_U) && // The second code point is U+002B PLUS SIGN (+).
    reader.source.codePointAt(reader.cursor + 1) === PLUS_SIGN && // The third code point is either U+003F QUESTION MARK (?) or a hex digit
    (reader.source.codePointAt(reader.cursor + 2) === QUESTION_MARK || isHexDigitCodePoint(reader.source.codePointAt(reader.cursor + 2) ?? -1))
  ) {
    return true;
  }
  return false;
}
__name(checkIfThreeCodePointsWouldStartAUnicodeRange, "checkIfThreeCodePointsWouldStartAUnicodeRange");

// src/css-tokenizer/consume/unicode-range-token.ts
function consumeUnicodeRangeToken(ctx, reader) {
  reader.advanceCodePoint(2);
  const firstSegment = [];
  const secondSegment = [];
  let codePoint;
  while (typeof (codePoint = reader.source.codePointAt(reader.cursor)) !== "undefined" && firstSegment.length < 6 && isHexDigitCodePoint(codePoint)) {
    firstSegment.push(codePoint);
    reader.advanceCodePoint();
  }
  while (typeof (codePoint = reader.source.codePointAt(reader.cursor)) !== "undefined" && firstSegment.length < 6 && codePoint === QUESTION_MARK) {
    if (secondSegment.length === 0) {
      secondSegment.push(...firstSegment);
    }
    firstSegment.push(DIGIT_ZERO);
    secondSegment.push(LATIN_CAPITAL_LETTER_F);
    reader.advanceCodePoint();
  }
  if (!secondSegment.length) {
    if (reader.source.codePointAt(reader.cursor) === HYPHEN_MINUS && isHexDigitCodePoint(reader.source.codePointAt(reader.cursor + 1) ?? -1)) {
      reader.advanceCodePoint();
      while (typeof (codePoint = reader.source.codePointAt(reader.cursor)) !== "undefined" && secondSegment.length < 6 && isHexDigitCodePoint(codePoint)) {
        secondSegment.push(codePoint);
        reader.advanceCodePoint();
      }
    }
  }
  if (!secondSegment.length) {
    const startOfRange2 = parseInt(String.fromCodePoint(...firstSegment), 16);
    return [
      "unicode-range-token" /* UnicodeRange */,
      reader.source.slice(reader.representationStart, reader.representationEnd + 1),
      reader.representationStart,
      reader.representationEnd,
      {
        startOfRange: startOfRange2,
        endOfRange: startOfRange2
      }
    ];
  }
  const startOfRange = parseInt(String.fromCodePoint(...firstSegment), 16);
  const endOfRange = parseInt(String.fromCodePoint(...secondSegment), 16);
  return [
    "unicode-range-token" /* UnicodeRange */,
    reader.source.slice(reader.representationStart, reader.representationEnd + 1),
    reader.representationStart,
    reader.representationEnd,
    {
      startOfRange,
      endOfRange
    }
  ];
}
__name(consumeUnicodeRangeToken, "consumeUnicodeRangeToken");

// src/css-tokenizer/tokenizer.ts
function tokenizer2(input, options) {
  const css = input.css.valueOf();
  const unicodeRangesAllowed = input.unicodeRangesAllowed ?? false;
  const reader = new Reader(css);
  const ctx = {
    onParseError: options?.onParseError ?? noop
  };
  function endOfFile() {
    return typeof reader.source.codePointAt(reader.cursor) === "undefined";
  }
  __name(endOfFile, "endOfFile");
  function nextToken() {
    reader.resetRepresentation();
    const peeked = reader.source.codePointAt(reader.cursor);
    if (typeof peeked === "undefined") {
      return ["EOF-token" /* EOF */, "", -1, -1, void 0];
    }
    if (peeked === SOLIDUS && checkIfTwoCodePointsStartAComment(reader)) {
      return consumeComment(ctx, reader);
    }
    if (unicodeRangesAllowed && (peeked === LATIN_SMALL_LETTER_U || peeked === LATIN_CAPITAL_LETTER_U) && checkIfThreeCodePointsWouldStartAUnicodeRange(reader)) {
      return consumeUnicodeRangeToken(ctx, reader);
    }
    if (isIdentStartCodePoint(peeked)) {
      return consumeIdentLikeToken(ctx, reader);
    }
    if (isDigitCodePoint(peeked)) {
      return consumeNumericToken(ctx, reader);
    }
    switch (peeked) {
      case COMMA:
        reader.advanceCodePoint();
        return ["comma-token" /* Comma */, ",", reader.representationStart, reader.representationEnd, void 0];
      case COLON2:
        reader.advanceCodePoint();
        return ["colon-token" /* Colon */, ":", reader.representationStart, reader.representationEnd, void 0];
      case SEMICOLON2:
        reader.advanceCodePoint();
        return ["semicolon-token" /* Semicolon */, ";", reader.representationStart, reader.representationEnd, void 0];
      case LEFT_PARENTHESIS:
        reader.advanceCodePoint();
        return ["(-token" /* OpenParen */, "(", reader.representationStart, reader.representationEnd, void 0];
      case RIGHT_PARENTHESIS:
        reader.advanceCodePoint();
        return [")-token" /* CloseParen */, ")", reader.representationStart, reader.representationEnd, void 0];
      case LEFT_SQUARE_BRACKET:
        reader.advanceCodePoint();
        return ["[-token" /* OpenSquare */, "[", reader.representationStart, reader.representationEnd, void 0];
      case RIGHT_SQUARE_BRACKET:
        reader.advanceCodePoint();
        return ["]-token" /* CloseSquare */, "]", reader.representationStart, reader.representationEnd, void 0];
      case LEFT_CURLY_BRACKET:
        reader.advanceCodePoint();
        return ["{-token" /* OpenCurly */, "{", reader.representationStart, reader.representationEnd, void 0];
      case RIGHT_CURLY_BRACKET:
        reader.advanceCodePoint();
        return ["}-token" /* CloseCurly */, "}", reader.representationStart, reader.representationEnd, void 0];
      case APOSTROPHE:
      case QUOTATION_MARK:
        return consumeStringToken(ctx, reader);
      case NUMBER_SIGN:
        return consumeHashToken(ctx, reader);
      case PLUS_SIGN:
      case FULL_STOP:
        if (checkIfThreeCodePointsWouldStartANumber(reader)) {
          return consumeNumericToken(ctx, reader);
        }
        reader.advanceCodePoint();
        return ["delim-token" /* Delim */, reader.source[reader.representationStart], reader.representationStart, reader.representationEnd, {
          value: reader.source[reader.representationStart]
        }];
      case LINE_FEED:
      case CARRIAGE_RETURN:
      case FORM_FEED:
      case CHARACTER_TABULATION:
      case SPACE2:
        return consumeWhiteSpace(reader);
      case HYPHEN_MINUS:
        if (checkIfThreeCodePointsWouldStartANumber(reader)) {
          return consumeNumericToken(ctx, reader);
        }
        if (checkIfThreeCodePointsWouldStartCDC(reader)) {
          reader.advanceCodePoint(3);
          return ["CDC-token" /* CDC */, "-->", reader.representationStart, reader.representationEnd, void 0];
        }
        if (checkIfThreeCodePointsWouldStartAnIdentSequence(ctx, reader)) {
          return consumeIdentLikeToken(ctx, reader);
        }
        reader.advanceCodePoint();
        return ["delim-token" /* Delim */, "-", reader.representationStart, reader.representationEnd, {
          value: "-"
        }];
      case LESS_THAN_SIGN:
        if (checkIfFourCodePointsWouldStartCDO(reader)) {
          reader.advanceCodePoint(4);
          return ["CDO-token" /* CDO */, "<!--", reader.representationStart, reader.representationEnd, void 0];
        }
        reader.advanceCodePoint();
        return ["delim-token" /* Delim */, "<", reader.representationStart, reader.representationEnd, {
          value: "<"
        }];
      case COMMERCIAL_AT:
        reader.advanceCodePoint();
        if (checkIfThreeCodePointsWouldStartAnIdentSequence(ctx, reader)) {
          const identSequence = consumeIdentSequence(ctx, reader);
          return ["at-keyword-token" /* AtKeyword */, reader.source.slice(reader.representationStart, reader.representationEnd + 1), reader.representationStart, reader.representationEnd, {
            value: String.fromCodePoint(...identSequence)
          }];
        }
        return ["delim-token" /* Delim */, "@", reader.representationStart, reader.representationEnd, {
          value: "@"
        }];
      case REVERSE_SOLIDUS: {
        if (checkIfTwoCodePointsAreAValidEscape(reader)) {
          return consumeIdentLikeToken(ctx, reader);
        }
        reader.advanceCodePoint();
        const token = ["delim-token" /* Delim */, "\\", reader.representationStart, reader.representationEnd, {
          value: "\\"
        }];
        ctx.onParseError(new ParseErrorWithToken(
          ParseErrorMessage.InvalidEscapeSequenceAfterBackslash,
          reader.representationStart,
          reader.representationEnd,
          [
            "4.3.1. Consume a token",
            "U+005C REVERSE SOLIDUS (\\)",
            "The input stream does not start with a valid escape sequence"
          ],
          token
        ));
        return token;
      }
    }
    reader.advanceCodePoint();
    return ["delim-token" /* Delim */, reader.source[reader.representationStart], reader.representationStart, reader.representationEnd, {
      value: reader.source[reader.representationStart]
    }];
  }
  __name(nextToken, "nextToken");
  return {
    nextToken,
    endOfFile
  };
}
__name(tokenizer2, "tokenizer");
function noop() {
}
__name(noop, "noop");

// src/css-tokenizer/util/type-predicates.ts
var tokenTypes = Object.values(TokenType);
function isTokenWhiteSpaceOrComment(x) {
  if (!x) return false;
  switch (x[0]) {
    case "whitespace-token" /* Whitespace */:
    case "comment" /* Comment */:
      return true;
    default:
      return false;
  }
}
__name(isTokenWhiteSpaceOrComment, "isTokenWhiteSpaceOrComment");

// src/postcss-minify/index.ts
var HAS_LEGAL_KEYWORDS_OR_SOURCE_MAP_REGEX = /license|copyright|sourcemappingurl/i;
var HAS_WHITESPACE_OR_COMMENTS_REGEX = /\s|\/\*/;
var IS_LAYER_REGEX = /^layer$/i;
function minify(cache, x) {
  if (!x) {
    return x;
  }
  if (cache.has(x)) {
    return cache.get(x);
  }
  const y = x.trim();
  if (y === "") {
    cache.set(x, "");
    return "";
  }
  if (!HAS_WHITESPACE_OR_COMMENTS_REGEX.test(y)) {
    cache.set(x, y);
    return y;
  }
  let lastWasWhitespace = false;
  let minified = "";
  const t = tokenizer2({ css: y });
  while (!t.endOfFile()) {
    const token = t.nextToken();
    if (isTokenWhiteSpaceOrComment(token)) {
      if (!lastWasWhitespace) {
        minified = minified + " ";
      }
      lastWasWhitespace = true;
    } else {
      lastWasWhitespace = false;
      minified = minified + token[1];
    }
  }
  cache.set(x, minified);
  return minified;
}
__name(minify, "minify");
function removeEmptyNodes(node) {
  if (node.type === "rule") {
    if (node.nodes?.length === 0) {
      const parent = node.parent;
      if (!parent) {
        return false;
      }
      node.remove();
      removeEmptyNodes(parent);
      return true;
    }
  } else if (node.type === "atrule") {
    if (node.nodes?.length === 0 && !IS_LAYER_REGEX.test(node.name)) {
      const parent = node.parent;
      if (!parent) {
        return false;
      }
      node.remove();
      removeEmptyNodes(parent);
      return true;
    }
  }
  return false;
}
__name(removeEmptyNodes, "removeEmptyNodes");
function setSemicolon(node) {
  if (!node.raws.semicolon) {
    return;
  }
  const last = node.last;
  if (last?.type === "decl" && last.variable) {
    return;
  }
  node.raws.semicolon = false;
}
__name(setSemicolon, "setSemicolon");
var creator = /* @__PURE__ */ __name(() => {
  const cache = /* @__PURE__ */ new Map();
  return {
    postcssPlugin: "postcss-minify",
    OnceExit(css) {
      css.raws.before = "";
      css.raws.after = "\n";
      css.walk((node) => {
        switch (node.type) {
          case "atrule":
            if (removeEmptyNodes(node)) {
              return;
            }
            node.raws.after = "";
            node.raws.afterName = " ";
            node.raws.before = "";
            node.raws.between = "";
            node.raws.params = void 0;
            setSemicolon(node);
            node.params = minify(cache, node.params);
            return;
          case "rule":
            if (removeEmptyNodes(node)) {
              return;
            }
            node.raws.after = "";
            node.raws.before = "";
            node.raws.between = "";
            node.raws.selector = void 0;
            setSemicolon(node);
            node.selector = minify(cache, node.selector);
            return;
          case "decl":
            if (node.prop.startsWith("--")) {
              node.raws.before = "";
              return;
            }
            node.raws.before = "";
            node.raws.between = ":";
            node.raws.important = node.important ? "!important" : "";
            node.raws.value = void 0;
            node.value = minify(cache, node.value);
            return;
          case "comment":
            if (
              // `/*! ... */` is a common pattern to indicate that a comment is important and should not be removed.
              node.text.startsWith("!") || // Comments containing the words `license` or `copyright` should not be removed.
              // Comments containing the word `sourceMappingURL` should not be removed.
              HAS_LEGAL_KEYWORDS_OR_SOURCE_MAP_REGEX.test(node.text)
            ) {
              node.raws.before = "";
              return;
            }
            node.remove();
            return;
          default:
            break;
        }
      });
    }
  };
}, "creator");
creator.postcss = true;
var postcss_minify_default = creator;
export {
  postcss_minify_default as postCSSMinifyPlugin,
  postcss_default as postcss,
  purgeCSSPlugin
};
//# sourceMappingURL=entry.mjs.map
