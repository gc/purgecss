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

// src/postcss/css-syntax-error.js
var CssSyntaxError;
var init_css_syntax_error = __esm({
  "src/postcss/css-syntax-error.js"() {
    "use strict";
    CssSyntaxError = class _CssSyntaxError extends Error {
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
  }
});

// src/postcss/stringifier.js
function capitalize(str) {
  return str[0].toUpperCase() + str.slice(1);
}
var DEFAULT_RAW, Stringifier;
var init_stringifier = __esm({
  "src/postcss/stringifier.js"() {
    "use strict";
    DEFAULT_RAW = {
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
    __name(capitalize, "capitalize");
    Stringifier = class {
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
  }
});

// src/postcss/stringify.js
var stringify_exports = {};
__export(stringify_exports, {
  stringify: () => stringify
});
function stringify(node, builder) {
  const str = new Stringifier(builder);
  str.stringify(node);
}
var init_stringify = __esm({
  "src/postcss/stringify.js"() {
    "use strict";
    init_stringifier();
    __name(stringify, "stringify");
  }
});

// src/postcss/symbols.js
var symbols_exports = {};
__export(symbols_exports, {
  isClean: () => isClean,
  my: () => my
});
var isClean, my;
var init_symbols = __esm({
  "src/postcss/symbols.js"() {
    "use strict";
    isClean = Symbol("isClean");
    my = Symbol("my");
  }
});

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
var Node;
var init_node = __esm({
  "src/postcss/node.js"() {
    "use strict";
    init_css_syntax_error();
    init_stringifier();
    init_stringify();
    init_symbols();
    __name(cloneNode, "cloneNode");
    __name(sourceOffset, "sourceOffset");
    Node = class {
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
  }
});

// src/postcss/comment.js
var Comment;
var init_comment = __esm({
  "src/postcss/comment.js"() {
    "use strict";
    init_node();
    Comment = class extends Node {
      static {
        __name(this, "Comment");
      }
      constructor(defaults) {
        super(defaults);
        this.type = "comment";
      }
    };
  }
});

// src/postcss/declaration.js
var Declaration;
var init_declaration = __esm({
  "src/postcss/declaration.js"() {
    "use strict";
    init_node();
    Declaration = class extends Node {
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
  }
});

// src/postcss/container.js
var container_exports = {};
__export(container_exports, {
  Container: () => Container
});
function cleanSource(nodes) {
  return nodes.map((i) => {
    if (i.nodes) i.nodes = cleanSource(i.nodes);
    delete i.source;
    return i;
  });
}
function markTreeDirty(node) {
  node[isClean] = false;
  if (node.proxyOf.nodes) {
    for (const i of node.proxyOf.nodes) {
      markTreeDirty(i);
    }
  }
}
var AtRule, parse, Root, Rule, Container;
var init_container = __esm({
  "src/postcss/container.js"() {
    "use strict";
    init_comment();
    init_declaration();
    init_symbols();
    init_node();
    __name(cleanSource, "cleanSource");
    __name(markTreeDirty, "markTreeDirty");
    Container = class _Container extends Node {
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
  }
});

// src/postcss/at-rule.js
var AtRule2;
var init_at_rule = __esm({
  "src/postcss/at-rule.js"() {
    "use strict";
    init_container();
    AtRule2 = class extends Container {
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
  }
});

// src/postcss/root.js
var LazyResult, Processor, Root2;
var init_root = __esm({
  "src/postcss/root.js"() {
    "use strict";
    init_container();
    Root2 = class extends Container {
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
  }
});

// src/postcss/list.js
var list;
var init_list = __esm({
  "src/postcss/list.js"() {
    "use strict";
    list = {
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
  }
});

// src/postcss/rule.js
var Rule2;
var init_rule = __esm({
  "src/postcss/rule.js"() {
    "use strict";
    init_container();
    init_list();
    Rule2 = class extends Container {
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
        const sep2 = match ? match[0] : "," + this.raw("between", "beforeOpen");
        this.selector = values.join(sep2);
      }
    };
    Container.registerRule(Rule2);
  }
});

// node_modules/.pnpm/nanoid@5.0.8/node_modules/nanoid/non-secure/index.js
var urlAlphabet, nanoid;
var init_non_secure = __esm({
  "node_modules/.pnpm/nanoid@5.0.8/node_modules/nanoid/non-secure/index.js"() {
    urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
    nanoid = /* @__PURE__ */ __name((size = 21) => {
      let id = "";
      let i = size;
      while (i--) {
        id += urlAlphabet[Math.random() * 64 | 0];
      }
      return id;
    }, "nanoid");
  }
});

// src/postcss/input.js
import { isAbsolute, resolve } from "path";
import { fileURLToPath, pathToFileURL } from "url";
var fromOffsetCache, sourceMapAvailable, pathAvailable, Input;
var init_input = __esm({
  "src/postcss/input.js"() {
    "use strict";
    init_non_secure();
    init_css_syntax_error();
    fromOffsetCache = Symbol("fromOffsetCache");
    sourceMapAvailable = Boolean(false);
    pathAvailable = Boolean(resolve && isAbsolute);
    Input = class {
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
        if (opts.from) {
          if (!pathAvailable || /^\w+:\/\//.test(opts.from) || isAbsolute(opts.from)) {
            this.file = opts.from;
          } else {
            this.file = resolve(opts.from);
          }
        }
        if (!this.file) {
          this.id = "<input css " + nanoid(6) + ">";
        }
        if (this.map) this.map.file = this.from;
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
          result = new CssSyntaxError(
            message,
            origin.endLine === void 0 ? origin.line : { column: origin.column, line: origin.line },
            origin.endLine === void 0 ? origin.column : { column: origin.endColumn, line: origin.endLine },
            origin.source,
            origin.file,
            opts.plugin
          );
        } else {
          result = new CssSyntaxError(
            message,
            endLine === void 0 ? line : { column, line },
            endLine === void 0 ? column : { column: endColumn, line: endLine },
            this.css,
            this.file,
            opts.plugin
          );
        }
        result.input = { column, endColumn, endLine, line, source: this.css };
        if (this.file) {
          if (pathToFileURL) {
            result.input.url = pathToFileURL(this.file).toString();
          }
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
      mapResolve(file) {
        if (/^\w+:\/\//.test(file)) {
          return file;
        }
        return resolve(this.map.consumer().sourceRoot || this.map.root || ".", file);
      }
      origin(line, column, endLine, endColumn) {
        if (!this.map) return false;
        const consumer = this.map.consumer();
        const from = consumer.originalPositionFor({ column, line });
        if (!from.source) return false;
        let to;
        if (typeof endLine === "number") {
          to = consumer.originalPositionFor({ column: endColumn, line: endLine });
        }
        let fromUrl;
        if (isAbsolute(from.source)) {
          fromUrl = pathToFileURL(from.source);
        } else {
          fromUrl = new URL(
            from.source,
            this.map.consumer().sourceRoot || pathToFileURL(this.map.mapFile)
          );
        }
        const result = {
          column: from.column,
          endColumn: to && to.column,
          endLine: to && to.line,
          line: from.line,
          url: fromUrl.toString()
        };
        if (fromUrl.protocol === "file:") {
          if (fileURLToPath) {
            result.file = fileURLToPath(fromUrl);
          } else {
            throw new Error(`file: protocol is not available in this PostCSS build`);
          }
        }
        const source = consumer.sourceContentFor(from.source);
        if (source) result.source = source;
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
  }
});

// src/postcss/tokenize.js
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
var SINGLE_QUOTE, DOUBLE_QUOTE, BACKSLASH, SLASH, NEWLINE, SPACE, FEED, TAB, CR, OPEN_SQUARE, CLOSE_SQUARE, OPEN_PARENTHESES, CLOSE_PARENTHESES, OPEN_CURLY, CLOSE_CURLY, SEMICOLON, ASTERISK, COLON, AT, RE_AT_END, RE_WORD_END, RE_BAD_BRACKET, RE_HEX_ESCAPE;
var init_tokenize = __esm({
  "src/postcss/tokenize.js"() {
    "use strict";
    SINGLE_QUOTE = "'".charCodeAt(0);
    DOUBLE_QUOTE = '"'.charCodeAt(0);
    BACKSLASH = "\\".charCodeAt(0);
    SLASH = "/".charCodeAt(0);
    NEWLINE = "\n".charCodeAt(0);
    SPACE = " ".charCodeAt(0);
    FEED = "\f".charCodeAt(0);
    TAB = "	".charCodeAt(0);
    CR = "\r".charCodeAt(0);
    OPEN_SQUARE = "[".charCodeAt(0);
    CLOSE_SQUARE = "]".charCodeAt(0);
    OPEN_PARENTHESES = "(".charCodeAt(0);
    CLOSE_PARENTHESES = ")".charCodeAt(0);
    OPEN_CURLY = "{".charCodeAt(0);
    CLOSE_CURLY = "}".charCodeAt(0);
    SEMICOLON = ";".charCodeAt(0);
    ASTERISK = "*".charCodeAt(0);
    COLON = ":".charCodeAt(0);
    AT = "@".charCodeAt(0);
    RE_AT_END = /[\t\n\f\r "#'()/;[\\\]{}]/g;
    RE_WORD_END = /[\t\n\f\r !"#'():;@[\\\]{}]|\/(?=\*)/g;
    RE_BAD_BRACKET = /.[\r\n"'(/\\]/;
    RE_HEX_ESCAPE = /[\da-f]/i;
    __name(tokenizer, "tokenizer");
  }
});

// src/postcss/parser.js
function findLastWithPosition(tokens) {
  for (let i = tokens.length - 1; i >= 0; i--) {
    const token = tokens[i];
    const pos = token[3] || token[2];
    if (pos) return pos;
  }
}
var SAFE_COMMENT_NEIGHBOR, Parser;
var init_parser = __esm({
  "src/postcss/parser.js"() {
    "use strict";
    init_at_rule();
    init_comment();
    init_declaration();
    init_root();
    init_rule();
    init_tokenize();
    SAFE_COMMENT_NEIGHBOR = {
      empty: true,
      space: true
    };
    __name(findLastWithPosition, "findLastWithPosition");
    Parser = class {
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
  }
});

// src/postcss/parse.js
var parse_exports = {};
__export(parse_exports, {
  parse: () => parse2
});
function parse2(css, opts) {
  const input = new Input(css, opts);
  const parser = new Parser(input);
  try {
    parser.parse();
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
  return parser.root;
}
var init_parse = __esm({
  "src/postcss/parse.js"() {
    "use strict";
    init_container();
    init_input();
    init_parser();
    __name(parse2, "parse");
    Container.registerParse(parse2);
  }
});

// src/postcss/document.js
var document_exports = {};
__export(document_exports, {
  Document: () => Document
});
var LazyResult2, Processor2, Document;
var init_document = __esm({
  "src/postcss/document.js"() {
    "use strict";
    init_container();
    Document = class extends Container {
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
  }
});

// src/postcss/map-generator.js
var map_generator_exports = {};
__export(map_generator_exports, {
  MapGenerator: () => MapGenerator
});
import { dirname, relative, resolve as resolve2, sep } from "path";
import { pathToFileURL as pathToFileURL2 } from "url";
var sourceMapAvailable2, pathAvailable2, MapGenerator;
var init_map_generator = __esm({
  "src/postcss/map-generator.js"() {
    "use strict";
    init_input();
    sourceMapAvailable2 = Boolean(false);
    pathAvailable2 = Boolean(dirname && resolve2 && relative && sep);
    MapGenerator = class {
      static {
        __name(this, "MapGenerator");
      }
      constructor(stringify3, root, opts, cssString) {
        this.stringify = stringify3;
        this.mapOpts = opts.map || {};
        this.root = root;
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
        if (this.css.includes("\r\n")) eol = "\r\n";
        this.css += eol + "/*# sourceMappingURL=" + content + " */";
      }
      applyPrevMaps() {
        for (const prev of this.previous()) {
          const from = this.toUrl(this.path(prev.file));
          const root = prev.root || dirname(prev.file);
          let map;
          if (this.mapOpts.sourcesContent === false) {
            map = new SourceMapConsumer(prev.text);
            if (map.sourcesContent) {
              map.sourcesContent = null;
            }
          } else {
            map = prev.consumer();
          }
          this.map.applySourceMap(map, from, this.toUrl(this.path(root)));
        }
      }
      clearAnnotation() {
        if (this.mapOpts.annotation === false) return;
        if (this.root) {
          let node;
          for (let i = this.root.nodes.length - 1; i >= 0; i--) {
            node = this.root.nodes[i];
            if (node.type !== "comment") continue;
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
        if (pathAvailable2 && sourceMapAvailable2 && this.isMap()) {
          return this.generateMap();
        } else {
          let result = "";
          this.stringify(this.root, (i) => {
            result += i;
          });
          return [result];
        }
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
        if (this.isSourcesContent()) this.setSourcesContent();
        if (this.root && this.previous().length > 0) this.applyPrevMaps();
        if (this.isAnnotation()) this.addAnnotation();
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
        this.stringify(this.root, (str, node, type) => {
          this.css += str;
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
          lines = str.match(/\n/g);
          if (lines) {
            line += lines.length;
            last = str.lastIndexOf("\n");
            column = str.length - last;
          } else {
            column += str.length;
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
        if (this.mapOpts.absolute) return file;
        if (file.charCodeAt(0) === 60) return file;
        if (/^\w+:\/\//.test(file)) return file;
        const cached = this.memoizedPaths.get(file);
        if (cached) return cached;
        let from = this.opts.to ? dirname(this.opts.to) : ".";
        if (typeof this.mapOpts.annotation === "string") {
          from = dirname(resolve2(from, this.mapOpts.annotation));
        }
        const path = relative(from, file);
        this.memoizedPaths.set(file, path);
        return path;
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
            if (input.map) this.previousMaps.push(input.map);
          }
        }
        return this.previousMaps;
      }
      setSourcesContent() {
        const already = {};
        if (this.root) {
          this.root.walk((node) => {
            if (node.source) {
              const from = node.source.input.from;
              if (from && !already[from]) {
                already[from] = true;
                const fromUrl = this.usesFileUrls ? this.toFileUrl(from) : this.toUrl(this.path(from));
                this.map.setSourceContent(fromUrl, node.source.input.css);
              }
            }
          });
        } else if (this.css) {
          const from = this.opts.from ? this.toUrl(this.path(this.opts.from)) : "<no source>";
          this.map.setSourceContent(from, this.css);
        }
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
      toBase64(str) {
        if (Buffer) {
          return Buffer.from(str).toString("base64");
        } else {
          return window.btoa(unescape(encodeURIComponent(str)));
        }
      }
      toFileUrl(path) {
        const cached = this.memoizedFileURLs.get(path);
        if (cached) return cached;
        if (pathToFileURL2) {
          const fileURL = pathToFileURL2(path).toString();
          this.memoizedFileURLs.set(path, fileURL);
          return fileURL;
        } else {
          throw new Error(
            "`map.absolute` option is not available in this PostCSS build"
          );
        }
      }
      toUrl(path) {
        const cached = this.memoizedURLs.get(path);
        if (cached) return cached;
        if (sep === "\\") {
          path = path.replace(/\\/g, "/");
        }
        const url = encodeURI(path).replace(/[#?]/g, encodeURIComponent);
        this.memoizedURLs.set(path, url);
        return url;
      }
    };
  }
});

// src/postcss/warn-once.js
var warn_once_exports = {};
__export(warn_once_exports, {
  warnOnce: () => warnOnce
});
function warnOnce(message) {
  if (printed[message]) return;
  printed[message] = true;
  if (typeof console !== "undefined" && console.warn) {
    console.warn(message);
  }
}
var printed;
var init_warn_once = __esm({
  "src/postcss/warn-once.js"() {
    "use strict";
    printed = {};
    __name(warnOnce, "warnOnce");
  }
});

// src/postcss/warning.js
var Warning;
var init_warning = __esm({
  "src/postcss/warning.js"() {
    "use strict";
    Warning = class {
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
        for (const opt in opts) this[opt] = opts[opt];
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
  }
});

// src/postcss/result.js
var result_exports = {};
__export(result_exports, {
  Result: () => Result
});
var Result;
var init_result = __esm({
  "src/postcss/result.js"() {
    "use strict";
    init_warning();
    Result = class {
      static {
        __name(this, "Result");
      }
      constructor(processor, root, opts) {
        this.processor = processor;
        this.messages = [];
        this.root = root;
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
  }
});

// src/postcss/postcss.js
init_at_rule();
init_comment();
init_declaration();
init_root();
init_rule();
init_parse();
init_list();
init_input();
init_stringify();
init_css_syntax_error();
init_container();
init_document();
init_node();

// src/postcss/fromJSON.js
init_at_rule();
init_comment();
init_declaration();
init_root();
init_rule();
init_input();
function fromJSON(json, inputs) {
  if (Array.isArray(json)) return json.map((n) => fromJSON(n));
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

// src/postcss/processor.js
init_document();
init_root();

// src/postcss/no-work-result.js
init_map_generator();
init_warn_once();
init_parse();
init_result();
init_stringify();
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
    let root;
    const str = stringify;
    this.result = new Result(this._processor, root, this._opts);
    this.result.css = css;
    const self = this;
    Object.defineProperty(this.result, "root", {
      get() {
        return self.root;
      }
    });
    const map = new MapGenerator(str, root, this._opts, css);
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
    if (this.error) return Promise.reject(this.error);
    return Promise.resolve(this.result);
  }
  catch(onRejected) {
    return this.async().catch(onRejected);
  }
  finally(onFinally) {
    return this.async().then(onFinally, onFinally);
  }
  sync() {
    if (this.error) throw this.error;
    return this.result;
  }
  then(onFulfilled, onRejected) {
    if (process.env.NODE_ENV !== "production") {
      if (!("from" in this._opts)) {
        warnOnce(
          "Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning."
        );
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
    let root;
    const parser = parse2;
    try {
      root = parser(this._css, this._opts);
    } catch (error) {
      this.error = error;
    }
    if (this.error) {
      throw this.error;
    } else {
      this._root = root;
      return root;
    }
  }
  get [Symbol.toStringTag]() {
    return "NoWorkResult";
  }
};

// src/postcss/lazy-result.js
init_root();
var { Container: Container2 } = (init_container(), __toCommonJS(container_exports));
var { Document: Document2 } = (init_document(), __toCommonJS(document_exports));
var { MapGenerator: MapGenerator2 } = (init_map_generator(), __toCommonJS(map_generator_exports));
var { parse: parse3 } = (init_parse(), __toCommonJS(parse_exports));
var { Result: Result2 } = (init_result(), __toCommonJS(result_exports));
var { stringify: stringify2 } = (init_stringify(), __toCommonJS(stringify_exports));
var { isClean: isClean2, my: my2 } = (init_symbols(), __toCommonJS(symbols_exports));
var { warnOnce: warnOnce2 } = (init_warn_once(), __toCommonJS(warn_once_exports));
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
  node[isClean2] = false;
  if (node.nodes) node.nodes.forEach((i) => cleanMarks(i));
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
    let root;
    if (typeof css === "object" && css !== null && (css.type === "root" || css.type === "document")) {
      root = cleanMarks(css);
    } else if (css instanceof _LazyResult || css instanceof Result2) {
      root = cleanMarks(css.root);
      if (css.map) {
        if (typeof opts.map === "undefined") opts.map = {};
        if (!opts.map.inline) opts.map.inline = false;
        opts.map.prev = css.map;
      }
    } else {
      let parser = parse3;
      if (opts.syntax) parser = opts.syntax.parse;
      if (opts.parser) parser = opts.parser;
      if (parser.parse) parser = parser.parse;
      try {
        root = parser(css, opts);
      } catch (error) {
        this.processed = true;
        this.error = error;
      }
      if (root && !root[my2]) {
        Container2.rebuild(root);
      }
    }
    this.result = new Result2(processor, root, opts);
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
    if (this.error) return Promise.reject(this.error);
    if (this.processed) return Promise.resolve(this.result);
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
      if (node) node.addToError(error);
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
            console.error(
              "Unknown error from PostCSS plugin. Your current PostCSS version is " + runtimeVer + ", but " + pluginName + " uses " + pluginVer + ". Perhaps this is the source of the error below."
            );
          }
        }
      }
    } catch (err) {
      if (console && console.error) console.error(err);
    }
    return error;
  }
  prepareVisitors() {
    this.listeners = {};
    const add = /* @__PURE__ */ __name((plugin2, type, cb) => {
      if (!this.listeners[type]) this.listeners[type] = [];
      this.listeners[type].push([plugin2, cb]);
    }, "add");
    for (const plugin2 of this.plugins) {
      if (typeof plugin2 === "object") {
        for (const event in plugin2) {
          if (!PLUGIN_PROPS[event] && /^[A-Z]/.test(event)) {
            throw new Error(
              `Unknown event ${event} in ${plugin2.postcssPlugin}. Try to update PostCSS (${this.processor.version} now).`
            );
          }
          if (!NOT_VISITORS[event]) {
            if (typeof plugin2[event] === "object") {
              for (const filter in plugin2[event]) {
                if (filter === "*") {
                  add(plugin2, event, plugin2[event][filter]);
                } else {
                  add(
                    plugin2,
                    event + "-" + filter.toLowerCase(),
                    plugin2[event][filter]
                  );
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
      const root = this.result.root;
      while (!root[isClean2]) {
        root[isClean2] = true;
        const stack = [toStack(root)];
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
            if (root.type === "document") {
              const roots = root.nodes.map(
                (subRoot) => visitor(subRoot, this.helpers)
              );
              await Promise.all(roots);
            } else {
              await visitor(root, this.helpers);
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
          const roots = this.result.root.nodes.map(
            (root) => plugin2.Once(root, this.helpers)
          );
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
    if (this.error) throw this.error;
    if (this.stringified) return this.result;
    this.stringified = true;
    this.sync();
    const opts = this.result.opts;
    let str = stringify2;
    if (opts.syntax) str = opts.syntax.stringify;
    if (opts.stringifier) str = opts.stringifier;
    if (str.stringify) str = str.stringify;
    const map = new MapGenerator2(str, this.result.root, this.result.opts);
    const data = map.generate();
    this.result.css = data[0];
    this.result.map = data[1];
    return this.result;
  }
  sync() {
    if (this.error) throw this.error;
    if (this.processed) return this.result;
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
      const root = this.result.root;
      while (!root[isClean2]) {
        root[isClean2] = true;
        this.walkSync(root);
      }
      if (this.listeners.OnceExit) {
        if (root.type === "document") {
          for (const subRoot of root.nodes) {
            this.visitSync(this.listeners.OnceExit, subRoot);
          }
        } else {
          this.visitSync(this.listeners.OnceExit, root);
        }
      }
    }
    return this.result;
  }
  then(onFulfilled, onRejected) {
    if (process.env.NODE_ENV !== "production") {
      if (!("from" in this.opts)) {
        warnOnce2(
          "Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning."
        );
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
        if (!child[isClean2]) {
          child[isClean2] = true;
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
          node[isClean2] = true;
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
    node[isClean2] = true;
    const events = getEvents(node);
    for (const event of events) {
      if (event === CHILDREN) {
        if (node.nodes) {
          node.each((child) => {
            if (!child[isClean2]) this.walkSync(child);
          });
        }
      } else {
        const visitors = this.listeners[event];
        if (visitors) {
          if (this.visitSync(visitors, node.toProxy())) return;
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
Document2.registerLazyResult(LazyResult3);

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
          throw new Error(
            "PostCSS syntaxes cannot be used as plugins. Instead, please use one of the syntax/parser/stringifier options as outlined in your PostCSS runner documentation."
          );
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
init_warning();
init_result();
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
  function creator(...args) {
    if (console && console.warn && !warningPrinted) {
      warningPrinted = true;
      console.warn(
        name + ": postcss.plugin was deprecated. Migration guide:\nhttps://evilmartians.com/chronicles/postcss-8-plugin-migration"
      );
    }
    const transformer = initializer(...args);
    transformer.postcssPlugin = name;
    transformer.postcssVersion = new Processor3().version;
    return transformer;
  }
  __name(creator, "creator");
  let cache;
  Object.defineProperty(creator, "postcss", {
    get() {
      if (!cache) cache = creator();
      return cache;
    }
  });
  creator.process = (css, processOpts, pluginOpts) => postcss2([creator(pluginOpts)]).process(css, processOpts);
  return creator;
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

// src/index.ts
import selectorParser from "postcss-selector-parser";

// src/constants.ts
var IGNORE_ANNOTATION_CURRENT = "purgecss ignore current";
var IGNORE_ANNOTATION_NEXT = "purgecss ignore";
var IGNORE_ANNOTATION_START = "purgecss start ignore";
var IGNORE_ANNOTATION_END = "purgecss end ignore";

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
      (word) => this.someAttrValue((value) => value.includes(word))
    );
  }
  hasAttrValue(value) {
    return this.attrValues.has(value) || this.undetermined.has(value);
  }
  hasClass(name) {
    return this.classes.has(name) || this.undetermined.has(name);
  }
  hasId(id) {
    return this.ids.has(id) || this.undetermined.has(id);
  }
  hasTag(tag) {
    return this.tags.has(tag) || this.undetermined.has(tag);
  }
};
var ExtractorResultSets_default = ExtractorResultSets;

// src/internal-safelist.ts
var CSS_SAFELIST = ["*", ":root", ":after", ":before"];

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
async function extractSelectors(content, extractor) {
  return new ExtractorResultSets_default(await extractor(content));
}
__name(extractSelectors, "extractSelectors");
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
function isRuleEmpty(node) {
  if (isPostCSSRule(node) && !node.selector || node?.nodes && !node.nodes.length || isPostCSSAtRule(node) && (!node.nodes && !node.params || !node.params && node.nodes && !node.nodes.length)) {
    return true;
  }
  return false;
}
__name(isRuleEmpty, "isRuleEmpty");
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
function mergeExtractorSelectors(...extractors) {
  const result = new ExtractorResultSets_default([]);
  extractors.forEach(result.merge, result);
  return result;
}
__name(mergeExtractorSelectors, "mergeExtractorSelectors");
function stripQuotes(str) {
  return str.replace(/(^["'])|(["']$)/g, "");
}
__name(stripQuotes, "stripQuotes");
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
function isClassFound(classNode, selectors) {
  return selectors.hasClass(classNode.value);
}
__name(isClassFound, "isClassFound");
function isIdentifierFound(identifierNode, selectors) {
  return selectors.hasId(identifierNode.value);
}
__name(isIdentifierFound, "isIdentifierFound");
function isTagFound(tagNode, selectors) {
  return selectors.hasTag(tagNode.value);
}
__name(isTagFound, "isTagFound");
function isInPseudoClass(selector) {
  return selector.parent && selector.parent.type === "pseudo" && selector.parent.value.startsWith(":") || false;
}
__name(isInPseudoClass, "isInPseudoClass");
function isInPseudoClassWhereOrIs(selector) {
  return selector.parent && selector.parent.type === "pseudo" && (selector.parent.value === ":where" || selector.parent.value === ":is") || false;
}
__name(isInPseudoClassWhereOrIs, "isInPseudoClassWhereOrIs");
function isPseudoClassAtRootLevel(selector) {
  let result = false;
  if (selector.type === "selector" && selector.parent?.type === "root" && selector.nodes.length === 1) {
    selector.walk((node) => {
      if (node.type === "pseudo" && (node.value === ":where" || node.value === ":is" || node.value === ":has" || node.value === ":not")) {
        result = true;
      }
    });
  }
  return result;
}
__name(isPseudoClassAtRootLevel, "isPseudoClassAtRootLevel");
function isPostCSSAtRule(node) {
  return node?.type === "atrule";
}
__name(isPostCSSAtRule, "isPostCSSAtRule");
function isPostCSSRule(node) {
  return node?.type === "rule";
}
__name(isPostCSSRule, "isPostCSSRule");
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
        for (const word of value.split(/[\s,]+/)) {
          this.usedAnimations.add(word);
        }
        return;
      }
    }
    if (this.options.fontFace) {
      if (prop === "font-family") {
        for (const fontName of value.split(",")) {
          const cleanedFontFace = stripQuotes(fontName.trim());
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
      const extractedSelectors = await extractSelectors(raw, extractor);
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
            name: stripQuotes(childNode.value),
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
    if (isPostCSSComment(annotation) && isIgnoreAnnotation(annotation, "next")) {
      annotation.remove();
      return;
    }
    if (node.parent && isPostCSSAtRule(node.parent) && node.parent.name.endsWith("keyframes")) {
      return;
    }
    if (!isPostCSSRule(node)) {
      return;
    }
    if (hasIgnoreAnnotation(node)) {
      return;
    }
    const selectorsRemovedFromRule = [];
    node.selector = selectorParser((selectorsParsed) => {
      selectorsParsed.walk((selector) => {
        if (selector.type !== "selector") {
          return;
        }
        const keepSelector = this.shouldKeepSelector(selector, selectors);
        if (!keepSelector) {
          if (this.options.rejected) {
            this.selectorsRemoved.add(selector.toString());
          }
          if (this.options.rejectedCss) {
            selectorsRemovedFromRule.push(selector.toString());
          }
          selector.remove();
        }
      });
      selectorsParsed.walk((selector) => {
        if (selector.type !== "selector") {
          return;
        }
        if (selector.toString() && /(:where)|(:is)/.test(selector.toString())) {
          selector.walk((node2) => {
            if (node2.type !== "pseudo") return;
            if (node2.value !== ":where" && node2.value !== ":is") return;
            if (node2.nodes.length === 0) {
              selector.remove();
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
    if (isRuleEmpty(parent)) parent?.remove();
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
      const root = postcss_default.parse(cssContent, {
        from: isFromFile ? option : void 0
      });
      this.walkThroughCSS(root, selectors);
      if (this.options.fontFace) this.removeUnusedFontFaces();
      if (this.options.keyframes) this.removeUnusedKeyframes();
      if (this.options.variables) this.removeUnusedCSSVariables();
      const postCSSResult = root.toResult({
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
  isSelectorBlocklisted(selector) {
    return this.options.blocklist.some((blocklistItem) => {
      return typeof blocklistItem === "string" ? blocklistItem === selector : blocklistItem.test(selector);
    });
  }
  /**
   * Check if the selector is safelisted with the option safelist standard
   *
   * @param selector - css selector
   */
  isSelectorSafelisted(selector) {
    const isSafelisted = this.options.safelist.standard.some((safelistItem) => {
      return typeof safelistItem === "string" ? safelistItem === selector : safelistItem.test(selector);
    });
    const isPseudoElement = /^::.*/.test(selector);
    return CSS_SAFELIST.includes(selector) || isPseudoElement || isSafelisted;
  }
  /**
   * Check if the selector is safelisted with the option safelist deep
   *
   * @param selector - selector
   */
  isSelectorSafelistedDeep(selector) {
    return this.options.safelist.deep.some(
      (safelistItem) => safelistItem.test(selector)
    );
  }
  /**
   * Check if the selector is safelisted with the option safelist greedy
   *
   * @param selector - selector
   */
  isSelectorSafelistedGreedy(selector) {
    return this.options.safelist.greedy.some(
      (safelistItem) => safelistItem.test(selector)
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
      safelist: standardizeSafelist(userOptions.safelist)
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
      mergeExtractorSelectors({}, cssRawSelectors)
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
  getSelectorValue(selector) {
    return selector.type === "attribute" && selector.attribute || selector.value;
  }
  /**
   * Determine if the selector should be kept, based on the selectors found in the files
   *
   * @param selector - set of css selectors found in the content files or string
   * @param selectorsFromExtractor - selectors in the css rule
   *
   * @returns true if the selector should be kept in the processed CSS
   */
  shouldKeepSelector(selector, selectorsFromExtractor) {
    if (isInPseudoClass(selector) && !isInPseudoClassWhereOrIs(selector)) {
      return true;
    }
    if (isPseudoClassAtRootLevel(selector)) {
      return true;
    }
    if (this.options.safelist.greedy.length > 0) {
      const selectorParts = selector.nodes.map(this.getSelectorValue);
      if (selectorParts.some(
        (selectorPart) => selectorPart && this.isSelectorSafelistedGreedy(selectorPart)
      )) {
        return true;
      }
    }
    let isPresent = false;
    for (const selectorNode of selector.nodes) {
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
          ].includes(selectorNode.attribute) ? true : isAttributeFound(selectorNode, selectorsFromExtractor);
          break;
        case "class":
          isPresent = isClassFound(selectorNode, selectorsFromExtractor);
          break;
        case "id":
          isPresent = isIdentifierFound(selectorNode, selectorsFromExtractor);
          break;
        case "tag":
          isPresent = isTagFound(selectorNode, selectorsFromExtractor);
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
  walkThroughCSS(root, selectors) {
    root.walk((node) => {
      if (node.type === "rule") {
        return this.evaluateRule(node, selectors);
      }
      if (node.type === "atrule") {
        return this.evaluateAtRule(node);
      }
      if (node.type === "comment") {
        if (isIgnoreAnnotation(node, "start")) {
          this.ignore = true;
          node.remove();
        } else if (isIgnoreAnnotation(node, "end")) {
          this.ignore = false;
          node.remove();
        }
      }
    });
  }
};
export {
  ExtractorResultSets_default as ExtractorResultSets,
  PurgeCSS,
  VariableNode,
  VariablesStructure,
  defaultOptions,
  mergeExtractorSelectors,
  standardizeSafelist
};
//# sourceMappingURL=index.mjs.map
