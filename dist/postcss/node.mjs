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
export {
  Node
};
//# sourceMappingURL=node.mjs.map
