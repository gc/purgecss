var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/postcss/css-syntax-error.js
var CssSyntaxError = class _CssSyntaxError extends Error {
  static {
    __name(this, "CssSyntaxError");
  }
  constructor(message, line, column, source, file, plugin) {
    super(message);
    this.name = "CssSyntaxError";
    this.reason = message;
    if (file) {
      this.file = file;
    }
    if (source) {
      this.source = source;
    }
    if (plugin) {
      this.plugin = plugin;
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
function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}
__name(capitalize, "capitalize");
var Stringifier = class {
  static {
    __name(this, "Stringifier");
  }
  constructor(builder) {
    this.builder = builder;
  }
  atrule(node, semicolon) {
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
      const end = (node.raws.between || "") + (semicolon ? ";" : "");
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
        for (let step = 0; step < depth; step++) value += indent;
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
    if (after) this.builder(after);
    this.builder("}", node, "end");
  }
  body(node) {
    let last = node.nodes.length - 1;
    while (last > 0) {
      if (node.nodes[last].type !== "comment") break;
      last -= 1;
    }
    const semicolon = this.raw(node, "semicolon");
    for (let i = 0; i < node.nodes.length; i++) {
      const child = node.nodes[i];
      const before = this.raw(child, "before");
      if (before) this.builder(before);
      this.stringify(child, last !== i || semicolon);
    }
  }
  comment(node) {
    const left = this.raw(node, "left", "commentLeft");
    const right = this.raw(node, "right", "commentRight");
    this.builder("/*" + left + node.text + right + "*/", node);
  }
  decl(node, semicolon) {
    const between = this.raw(node, "between", "colon");
    let string = node.prop + between + this.rawValue(node, "value");
    if (node.important) {
      string += node.raws.important || " !important";
    }
    if (semicolon) string += ";";
    this.builder(string, node);
  }
  document(node) {
    this.body(node);
  }
  raw(node, own, detect) {
    let value;
    if (!detect) detect = own;
    if (own) {
      value = node.raws[own];
      if (typeof value !== "undefined") return value;
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
    if (!parent) return DEFAULT_RAW[detect];
    const root = node.root();
    if (!root.rawCache) root.rawCache = {};
    if (typeof root.rawCache[detect] !== "undefined") {
      return root.rawCache[detect];
    }
    if (detect === "before" || detect === "after") {
      return this.beforeAfter(node, detect);
    } else {
      const method = "raw" + capitalize(detect);
      if (this[method]) {
        value = this[method](root, node);
      } else {
        root.walk((i) => {
          value = i.raws[own];
          if (typeof value !== "undefined") return false;
        });
      }
    }
    if (typeof value === "undefined") value = DEFAULT_RAW[detect];
    root.rawCache[detect] = value;
    return value;
  }
  rawBeforeClose(root) {
    let value;
    root.walk((i) => {
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
    if (value) value = value.replace(/\S/g, "");
    return value;
  }
  rawBeforeComment(root, node) {
    let value;
    root.walkComments((i) => {
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
  rawBeforeDecl(root, node) {
    let value;
    root.walkDecls((i) => {
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
  rawBeforeOpen(root) {
    let value;
    root.walk((i) => {
      if (i.type !== "decl") {
        value = i.raws.between;
        if (typeof value !== "undefined") return false;
      }
    });
    return value;
  }
  rawBeforeRule(root) {
    let value;
    root.walk((i) => {
      if (i.nodes && (i.parent !== root || root.first !== i)) {
        if (typeof i.raws.before !== "undefined") {
          value = i.raws.before;
          if (value.includes("\n")) {
            value = value.replace(/[^\n]+$/, "");
          }
          return false;
        }
      }
    });
    if (value) value = value.replace(/\S/g, "");
    return value;
  }
  rawColon(root) {
    let value;
    root.walkDecls((i) => {
      if (typeof i.raws.between !== "undefined") {
        value = i.raws.between.replace(/[^\s:]/g, "");
        return false;
      }
    });
    return value;
  }
  rawEmptyBody(root) {
    let value;
    root.walk((i) => {
      if (i.nodes && i.nodes.length === 0) {
        value = i.raws.after;
        if (typeof value !== "undefined") return false;
      }
    });
    return value;
  }
  rawIndent(root) {
    if (root.raws.indent) return root.raws.indent;
    let value;
    root.walk((i) => {
      const p = i.parent;
      if (p && p !== root && p.parent && p.parent === root) {
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
  rawSemicolon(root) {
    let value;
    root.walk((i) => {
      if (i.nodes && i.nodes.length && i.last.type === "decl") {
        value = i.raws.semicolon;
        if (typeof value !== "undefined") return false;
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
    if (node.raws.after) this.builder(node.raws.after);
  }
  rule(node) {
    this.block(node, this.rawValue(node, "selector"));
    if (node.raws.ownSemicolon) {
      this.builder(node.raws.ownSemicolon, node, "end");
    }
  }
  stringify(node, semicolon) {
    if (!this[node.type]) {
      throw new Error(
        "Unknown AST node type " + node.type + ". Maybe you need to change PostCSS stringifier."
      );
    }
    this[node.type](node, semicolon);
  }
};

// src/postcss/stringify.js
function stringify(node, builder) {
  const str = new Stringifier(builder);
  str.stringify(node);
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
    if (i === "proxyCache") continue;
    let value = obj[i];
    const type = typeof value;
    if (i === "parent" && type === "object") {
      if (parent) cloned[i] = parent;
    } else if (i === "source") {
      cloned[i] = value;
    } else if (Array.isArray(value)) {
      cloned[i] = value.map((j) => cloneNode(j, cloned));
    } else {
      if (type === "object" && value !== null) value = cloneNode(value);
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
      error.stack = error.stack.replace(
        /\n\s{4}at /,
        `$&${s.input.from}:${s.start.line}:${s.start.column}$&`
      );
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
    if (!keepBetween) delete this.raws.between;
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
      return this.source.input.error(
        message,
        { column: start.column, line: start.line },
        { column: end.column, line: end.line },
        opts
      );
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
        if (node[prop] === value) return true;
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
    if (!this.parent) return void 0;
    const index = this.parent.index(this);
    return this.parent.nodes[index + 1];
  }
  positionBy(opts) {
    let pos = this.source.start;
    if (opts.index) {
      pos = this.positionInside(opts.index);
    } else if (opts.word) {
      const stringRepresentation = this.source.input.css.slice(
        sourceOffset(this.source.input.css, this.source.start),
        sourceOffset(this.source.input.css, this.source.end)
      );
      const index = stringRepresentation.indexOf(opts.word);
      if (index !== -1) pos = this.positionInside(index);
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
    if (!this.parent) return void 0;
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
      const stringRepresentation = this.source.input.css.slice(
        sourceOffset(this.source.input.css, this.source.start),
        sourceOffset(this.source.input.css, this.source.end)
      );
      const index = stringRepresentation.indexOf(opts.word);
      if (index !== -1) {
        start = this.positionInside(index);
        end = this.positionInside(
          index + opts.word.length
        );
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
    const str = new Stringifier();
    return str.raw(this, prop, defaultType);
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
      if (name === "parent" || name === "proxyCache") continue;
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
    if (stringifier.stringify) stringifier = stringifier.stringify;
    let result = "";
    stringifier(this, (i) => {
      result += i;
    });
    return result;
  }
  warn(result, text, opts) {
    const data = { node: this };
    for (const i in opts) data[i] = opts[i];
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
    if (i.nodes) i.nodes = cleanSource(i.nodes);
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
      for (const node of nodes) this.proxyOf.nodes.push(node);
    }
    this.markDirty();
    return this;
  }
  cleanRaws(keepBetween) {
    super.cleanRaws(keepBetween);
    if (this.nodes) {
      for (const node of this.nodes) node.cleanRaws(keepBetween);
    }
  }
  each(callback) {
    if (!this.proxyOf.nodes) return void 0;
    const iterator = this.getIterator();
    let index, result;
    while (this.indexes[iterator] < this.proxyOf.nodes.length) {
      index = this.indexes[iterator];
      result = callback(this.proxyOf.nodes[index], index);
      if (result === false) break;
      this.indexes[iterator] += 1;
    }
    delete this.indexes[iterator];
    return result;
  }
  every(condition) {
    return this.nodes.every(condition);
  }
  getIterator() {
    if (!this.lastEach) this.lastEach = 0;
    if (!this.indexes) this.indexes = {};
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
            return node[prop](
              ...args.map((i) => {
                if (typeof i === "function") {
                  return (child, index) => i(child.toProxy(), index);
                } else {
                  return i;
                }
              })
            );
          };
        } else if (prop === "every" || prop === "some") {
          return (cb) => {
            return node[prop](
              (child, ...other) => cb(child.toProxy(), ...other)
            );
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
        if (node[prop] === value) return true;
        node[prop] = value;
        if (prop === "name" || prop === "params" || prop === "selector") {
          node.markDirty();
        }
        return true;
      }
    };
  }
  index(child) {
    if (typeof child === "number") return child;
    if (child.proxyOf) child = child.proxyOf;
    return this.proxyOf.nodes.indexOf(child);
  }
  insertAfter(exist, add) {
    let existIndex = this.index(exist);
    const nodes = this.normalize(add, this.proxyOf.nodes[existIndex]).reverse();
    existIndex = this.index(exist);
    for (const node of nodes) this.proxyOf.nodes.splice(existIndex + 1, 0, node);
    let index;
    for (const id in this.indexes) {
      index = this.indexes[id];
      if (existIndex < index) {
        this.indexes[id] = index + nodes.length;
      }
    }
    this.markDirty();
    return this;
  }
  insertBefore(exist, add) {
    let existIndex = this.index(exist);
    const type = existIndex === 0 ? "prepend" : false;
    const nodes = this.normalize(
      add,
      this.proxyOf.nodes[existIndex],
      type
    ).reverse();
    existIndex = this.index(exist);
    for (const node of nodes) this.proxyOf.nodes.splice(existIndex, 0, node);
    let index;
    for (const id in this.indexes) {
      index = this.indexes[id];
      if (existIndex <= index) {
        this.indexes[id] = index + nodes.length;
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
        if (i.parent) i.parent.removeChild(i, "ignore");
      }
    } else if (nodes.type === "root" && this.type !== "document") {
      nodes = nodes.nodes.slice(0);
      for (const i of nodes) {
        if (i.parent) i.parent.removeChild(i, "ignore");
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
      if (!i[my]) _Container.rebuild(i);
      i = i.proxyOf;
      if (i.parent) i.parent.removeChild(i);
      if (i[isClean]) markTreeDirty(i);
      if (!i.raws) i.raws = {};
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
      for (const node of nodes) this.proxyOf.nodes.unshift(node);
      for (const id in this.indexes) {
        this.indexes[id] = this.indexes[id] + nodes.length;
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
    for (const node of this.proxyOf.nodes) node.parent = void 0;
    this.proxyOf.nodes = [];
    this.markDirty();
    return this;
  }
  removeChild(child) {
    child = this.index(child);
    this.proxyOf.nodes[child].parent = void 0;
    this.proxyOf.nodes.splice(child, 1);
    let index;
    for (const id in this.indexes) {
      index = this.indexes[id];
      if (index >= child) {
        this.indexes[id] = index - 1;
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
      if (opts.props && !opts.props.includes(decl.prop)) return;
      if (opts.fast && !decl.value.includes(opts.fast)) return;
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
  walkRules(selector, callback) {
    if (!callback) {
      callback = selector;
      return this.walk((child, i) => {
        if (child.type === "rule") {
          return callback(child, i);
        }
      });
    }
    if (selector instanceof RegExp) {
      return this.walk((child, i) => {
        if (child.type === "rule" && selector.test(child.selector)) {
          return callback(child, i);
        }
      });
    }
    return this.walk((child, i) => {
      if (child.type === "rule" && child.selector === selector) {
        return callback(child, i);
      }
    });
  }
  get first() {
    if (!this.proxyOf.nodes) return void 0;
    return this.proxyOf.nodes[0];
  }
  get last() {
    if (!this.proxyOf.nodes) return void 0;
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
    if (!this.proxyOf.nodes) this.nodes = [];
    return super.append(...children);
  }
  prepend(...children) {
    if (!this.proxyOf.nodes) this.nodes = [];
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
    if (!this.nodes) this.nodes = [];
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
  comma(string) {
    return list.split(string, [","], true);
  },
  space(string) {
    const spaces = [" ", "\n", "	"];
    return list.split(string, spaces);
  },
  split(string, separators, last) {
    const array = [];
    let current = "";
    let split = false;
    let func = 0;
    let inQuote = false;
    let prevQuote = "";
    let escape = false;
    for (const letter of string) {
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
        if (func > 0) func -= 1;
      } else if (func === 0) {
        if (separators.includes(letter)) split = true;
      }
      if (split) {
        if (current !== "") array.push(current.trim());
        current = "";
        split = false;
      } else {
        current += letter;
      }
    }
    if (last || current !== "") array.push(current.trim());
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
    if (!this.nodes) this.nodes = [];
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
    if (returned.length) return returned.pop();
    if (pos >= length) return;
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
    if (pos) return pos;
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
    const colon = this.colon(tokens);
    if (colon === false) return;
    let founded = 0;
    let token;
    for (let j = colon - 1; j >= 0; j--) {
      token = tokens[j];
      if (token[0] !== "space") {
        founded += 1;
        if (founded === 2) break;
      }
    }
    throw this.input.error(
      "Missed semicolon",
      token[0] === "word" ? token[3] + 1 : token[2]
    );
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
    node.source.end = this.getPosition(
      last[3] || last[2] || findLastWithPosition(tokens)
    );
    node.source.end.offset++;
    while (tokens[0][0] !== "word") {
      if (tokens.length === 1) this.unknownWord(tokens);
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
      if (next !== "space" && next !== "comment") break;
      firstSpaces.push(tokens.shift());
    }
    this.precheckMissedSemicolon(tokens);
    for (let i = tokens.length - 1; i >= 0; i--) {
      token = tokens[i];
      if (token[1].toLowerCase() === "!important") {
        node.important = true;
        let string = this.stringFrom(tokens, i);
        string = this.spacesFromEnd(tokens) + string;
        if (string !== " !important") node.raws.important = string;
        break;
      } else if (token[1].toLowerCase() === "important") {
        const cache = tokens.slice(0);
        let str = "";
        for (let j = i; j > 0; j--) {
          const type = cache[j][0];
          if (str.trim().startsWith("!") && type !== "space") {
            break;
          }
          str = cache.pop()[1] + str;
        }
        if (str.trim().startsWith("!")) {
          node.important = true;
          node.raws.important = str;
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
    throw this.input.error(
      "Double colon",
      { offset: token[2] },
      { offset: token[2] + token[1].length }
    );
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
    if (this.current.parent) this.unclosedBlock();
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
    if (node.type !== "comment") this.semicolon = false;
  }
  other(start) {
    let end = false;
    let type = null;
    let colon = false;
    let bracket = null;
    const brackets = [];
    const customProperty = start[1].startsWith("--");
    const tokens = [];
    let token = start;
    while (token) {
      type = token[0];
      tokens.push(token);
      if (type === "(" || type === "[") {
        if (!bracket) bracket = token;
        brackets.push(type === "(" ? ")" : "]");
      } else if (customProperty && colon && type === "{") {
        if (!bracket) bracket = token;
        brackets.push("}");
      } else if (brackets.length === 0) {
        if (type === ";") {
          if (colon) {
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
          colon = true;
        }
      } else if (type === brackets[brackets.length - 1]) {
        brackets.pop();
        if (brackets.length === 0) bracket = null;
      }
      token = this.tokenizer.nextToken();
    }
    if (this.tokenizer.endOfFile()) end = true;
    if (brackets.length > 0) this.unclosedBracket(bracket);
    if (end && colon) {
      if (!customProperty) {
        while (tokens.length) {
          token = tokens[tokens.length - 1][0];
          if (token !== "space" && token !== "comment") break;
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
      if (lastTokenType !== "space" && lastTokenType !== "comment") break;
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
      if (next !== "space" && next !== "comment") break;
      spaces += tokens.shift()[1];
    }
    return spaces;
  }
  spacesFromEnd(tokens) {
    let lastTokenType;
    let spaces = "";
    while (tokens.length) {
      lastTokenType = tokens[tokens.length - 1][0];
      if (lastTokenType !== "space") break;
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
    throw this.input.error(
      "Unclosed bracket",
      { offset: bracket[2] },
      { offset: bracket[2] + 1 }
    );
  }
  unexpectedClose(token) {
    throw this.input.error(
      "Unexpected }",
      { offset: token[2] },
      { offset: token[2] + 1 }
    );
  }
  unknownWord(tokens) {
    throw this.input.error(
      "Unknown word",
      { offset: tokens[0][2] },
      { offset: tokens[0][2] + tokens[0][1].length }
    );
  }
  unnamedAtrule(node, token) {
    throw this.input.error(
      "At-rule without name",
      { offset: token[2] },
      { offset: token[2] + token[1].length }
    );
  }
};
export {
  Parser
};
//# sourceMappingURL=parser.mjs.map
