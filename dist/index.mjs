var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
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
        const sep = match ? match[0] : "," + this.raw("between", "beforeOpen");
        this.selector = values.join(sep);
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
var fromOffsetCache, Input;
var init_input = __esm({
  "src/postcss/input.js"() {
    "use strict";
    init_non_secure();
    init_css_syntax_error();
    fromOffsetCache = Symbol("fromOffsetCache");
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
        if (!this.map) return false;
        const consumer = this.map.consumer();
        const from = consumer.originalPositionFor({ column, line });
        if (!from.source) return false;
        let to;
        if (typeof endLine === "number") {
          to = consumer.originalPositionFor({ column: endColumn, line: endLine });
        }
        let fromUrl;
        fromUrl = new URL(
          from.source,
          this.map.consumer().sourceRoot || pathToFileURL(this.map.mapFile)
        );
        const result = {
          column: from.column,
          endColumn: to && to.column,
          endLine: to && to.line,
          line: from.line,
          url: fromUrl.toString()
        };
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
var MapGenerator;
var init_map_generator = __esm({
  "src/postcss/map-generator.js"() {
    "use strict";
    init_input();
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
            if (input.map) this.previousMaps.push(input.map);
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
        throw new Error(
          "`map.absolute` option is not available in this PostCSS build"
        );
      }
      toUrl(path) {
        const cached = this.memoizedURLs.get(path);
        if (cached) return cached;
        path = path.replace(/\\/g, "/");
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

// node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/util/unesc.js
var require_unesc = __commonJS({
  "node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/util/unesc.js"(exports, module) {
    "use strict";
    exports.__esModule = true;
    exports["default"] = unesc;
    function gobbleHex(str) {
      var lower = str.toLowerCase();
      var hex = "";
      var spaceTerminated = false;
      for (var i = 0; i < 6 && lower[i] !== void 0; i++) {
        var code = lower.charCodeAt(i);
        var valid = code >= 97 && code <= 102 || code >= 48 && code <= 57;
        spaceTerminated = code === 32;
        if (!valid) {
          break;
        }
        hex += lower[i];
      }
      if (hex.length === 0) {
        return void 0;
      }
      var codePoint = parseInt(hex, 16);
      var isSurrogate = codePoint >= 55296 && codePoint <= 57343;
      if (isSurrogate || codePoint === 0 || codePoint > 1114111) {
        return ["\uFFFD", hex.length + (spaceTerminated ? 1 : 0)];
      }
      return [String.fromCodePoint(codePoint), hex.length + (spaceTerminated ? 1 : 0)];
    }
    __name(gobbleHex, "gobbleHex");
    var CONTAINS_ESCAPE = /\\/;
    function unesc(str) {
      var needToProcess = CONTAINS_ESCAPE.test(str);
      if (!needToProcess) {
        return str;
      }
      var ret = "";
      for (var i = 0; i < str.length; i++) {
        if (str[i] === "\\") {
          var gobbled = gobbleHex(str.slice(i + 1, i + 7));
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
    module.exports = exports.default;
  }
});

// node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/util/getProp.js
var require_getProp = __commonJS({
  "node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/util/getProp.js"(exports, module) {
    "use strict";
    exports.__esModule = true;
    exports["default"] = getProp;
    function getProp(obj) {
      for (var _len = arguments.length, props = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        props[_key - 1] = arguments[_key];
      }
      while (props.length > 0) {
        var prop = props.shift();
        if (!obj[prop]) {
          return void 0;
        }
        obj = obj[prop];
      }
      return obj;
    }
    __name(getProp, "getProp");
    module.exports = exports.default;
  }
});

// node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/util/ensureObject.js
var require_ensureObject = __commonJS({
  "node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/util/ensureObject.js"(exports, module) {
    "use strict";
    exports.__esModule = true;
    exports["default"] = ensureObject;
    function ensureObject(obj) {
      for (var _len = arguments.length, props = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        props[_key - 1] = arguments[_key];
      }
      while (props.length > 0) {
        var prop = props.shift();
        if (!obj[prop]) {
          obj[prop] = {};
        }
        obj = obj[prop];
      }
    }
    __name(ensureObject, "ensureObject");
    module.exports = exports.default;
  }
});

// node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/util/stripComments.js
var require_stripComments = __commonJS({
  "node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/util/stripComments.js"(exports, module) {
    "use strict";
    exports.__esModule = true;
    exports["default"] = stripComments;
    function stripComments(str) {
      var s = "";
      var commentStart = str.indexOf("/*");
      var lastEnd = 0;
      while (commentStart >= 0) {
        s = s + str.slice(lastEnd, commentStart);
        var commentEnd = str.indexOf("*/", commentStart + 2);
        if (commentEnd < 0) {
          return s;
        }
        lastEnd = commentEnd + 2;
        commentStart = str.indexOf("/*", lastEnd);
      }
      s = s + str.slice(lastEnd);
      return s;
    }
    __name(stripComments, "stripComments");
    module.exports = exports.default;
  }
});

// node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/util/index.js
var require_util = __commonJS({
  "node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/util/index.js"(exports) {
    "use strict";
    exports.__esModule = true;
    exports.unesc = exports.stripComments = exports.getProp = exports.ensureObject = void 0;
    var _unesc = _interopRequireDefault(require_unesc());
    exports.unesc = _unesc["default"];
    var _getProp = _interopRequireDefault(require_getProp());
    exports.getProp = _getProp["default"];
    var _ensureObject = _interopRequireDefault(require_ensureObject());
    exports.ensureObject = _ensureObject["default"];
    var _stripComments = _interopRequireDefault(require_stripComments());
    exports.stripComments = _stripComments["default"];
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    __name(_interopRequireDefault, "_interopRequireDefault");
  }
});

// node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/selectors/node.js
var require_node = __commonJS({
  "node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/selectors/node.js"(exports, module) {
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _util = require_util();
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    __name(_defineProperties, "_defineProperties");
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    __name(_createClass, "_createClass");
    var cloneNode2 = /* @__PURE__ */ __name(function cloneNode3(obj, parent) {
      if (typeof obj !== "object" || obj === null) {
        return obj;
      }
      var cloned = new obj.constructor();
      for (var i in obj) {
        if (!obj.hasOwnProperty(i)) {
          continue;
        }
        var value = obj[i];
        var type = typeof value;
        if (i === "parent" && type === "object") {
          if (parent) {
            cloned[i] = parent;
          }
        } else if (value instanceof Array) {
          cloned[i] = value.map(function(j) {
            return cloneNode3(j, cloned);
          });
        } else {
          cloned[i] = cloneNode3(value, cloned);
        }
      }
      return cloned;
    }, "cloneNode");
    var Node2 = /* @__PURE__ */ function() {
      function Node3(opts) {
        if (opts === void 0) {
          opts = {};
        }
        Object.assign(this, opts);
        this.spaces = this.spaces || {};
        this.spaces.before = this.spaces.before || "";
        this.spaces.after = this.spaces.after || "";
      }
      __name(Node3, "Node");
      var _proto = Node3.prototype;
      _proto.remove = /* @__PURE__ */ __name(function remove() {
        if (this.parent) {
          this.parent.removeChild(this);
        }
        this.parent = void 0;
        return this;
      }, "remove");
      _proto.replaceWith = /* @__PURE__ */ __name(function replaceWith() {
        if (this.parent) {
          for (var index in arguments) {
            this.parent.insertBefore(this, arguments[index]);
          }
          this.remove();
        }
        return this;
      }, "replaceWith");
      _proto.next = /* @__PURE__ */ __name(function next() {
        return this.parent.at(this.parent.index(this) + 1);
      }, "next");
      _proto.prev = /* @__PURE__ */ __name(function prev() {
        return this.parent.at(this.parent.index(this) - 1);
      }, "prev");
      _proto.clone = /* @__PURE__ */ __name(function clone(overrides) {
        if (overrides === void 0) {
          overrides = {};
        }
        var cloned = cloneNode2(this);
        for (var name in overrides) {
          cloned[name] = overrides[name];
        }
        return cloned;
      }, "clone");
      _proto.appendToPropertyAndEscape = /* @__PURE__ */ __name(function appendToPropertyAndEscape(name, value, valueEscaped) {
        if (!this.raws) {
          this.raws = {};
        }
        var originalValue = this[name];
        var originalEscaped = this.raws[name];
        this[name] = originalValue + value;
        if (originalEscaped || valueEscaped !== value) {
          this.raws[name] = (originalEscaped || originalValue) + valueEscaped;
        } else {
          delete this.raws[name];
        }
      }, "appendToPropertyAndEscape");
      _proto.setPropertyAndEscape = /* @__PURE__ */ __name(function setPropertyAndEscape(name, value, valueEscaped) {
        if (!this.raws) {
          this.raws = {};
        }
        this[name] = value;
        this.raws[name] = valueEscaped;
      }, "setPropertyAndEscape");
      _proto.setPropertyWithoutEscape = /* @__PURE__ */ __name(function setPropertyWithoutEscape(name, value) {
        this[name] = value;
        if (this.raws) {
          delete this.raws[name];
        }
      }, "setPropertyWithoutEscape");
      _proto.isAtPosition = /* @__PURE__ */ __name(function isAtPosition(line, column) {
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
      }, "isAtPosition");
      _proto.stringifyProperty = /* @__PURE__ */ __name(function stringifyProperty(name) {
        return this.raws && this.raws[name] || this[name];
      }, "stringifyProperty");
      _proto.valueToString = /* @__PURE__ */ __name(function valueToString() {
        return String(this.stringifyProperty("value"));
      }, "valueToString");
      _proto.toString = /* @__PURE__ */ __name(function toString() {
        return [this.rawSpaceBefore, this.valueToString(), this.rawSpaceAfter].join("");
      }, "toString");
      _createClass(Node3, [{
        key: "rawSpaceBefore",
        get: /* @__PURE__ */ __name(function get() {
          var rawSpace = this.raws && this.raws.spaces && this.raws.spaces.before;
          if (rawSpace === void 0) {
            rawSpace = this.spaces && this.spaces.before;
          }
          return rawSpace || "";
        }, "get"),
        set: /* @__PURE__ */ __name(function set(raw) {
          (0, _util.ensureObject)(this, "raws", "spaces");
          this.raws.spaces.before = raw;
        }, "set")
      }, {
        key: "rawSpaceAfter",
        get: /* @__PURE__ */ __name(function get() {
          var rawSpace = this.raws && this.raws.spaces && this.raws.spaces.after;
          if (rawSpace === void 0) {
            rawSpace = this.spaces.after;
          }
          return rawSpace || "";
        }, "get"),
        set: /* @__PURE__ */ __name(function set(raw) {
          (0, _util.ensureObject)(this, "raws", "spaces");
          this.raws.spaces.after = raw;
        }, "set")
      }]);
      return Node3;
    }();
    exports["default"] = Node2;
    module.exports = exports.default;
  }
});

// node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/selectors/types.js
var require_types = __commonJS({
  "node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/selectors/types.js"(exports) {
    "use strict";
    exports.__esModule = true;
    exports.UNIVERSAL = exports.TAG = exports.STRING = exports.SELECTOR = exports.ROOT = exports.PSEUDO = exports.NESTING = exports.ID = exports.COMMENT = exports.COMBINATOR = exports.CLASS = exports.ATTRIBUTE = void 0;
    var TAG = "tag";
    exports.TAG = TAG;
    var STRING = "string";
    exports.STRING = STRING;
    var SELECTOR = "selector";
    exports.SELECTOR = SELECTOR;
    var ROOT = "root";
    exports.ROOT = ROOT;
    var PSEUDO = "pseudo";
    exports.PSEUDO = PSEUDO;
    var NESTING = "nesting";
    exports.NESTING = NESTING;
    var ID = "id";
    exports.ID = ID;
    var COMMENT = "comment";
    exports.COMMENT = COMMENT;
    var COMBINATOR = "combinator";
    exports.COMBINATOR = COMBINATOR;
    var CLASS = "class";
    exports.CLASS = CLASS;
    var ATTRIBUTE = "attribute";
    exports.ATTRIBUTE = ATTRIBUTE;
    var UNIVERSAL = "universal";
    exports.UNIVERSAL = UNIVERSAL;
  }
});

// node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/selectors/container.js
var require_container = __commonJS({
  "node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/selectors/container.js"(exports, module) {
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _node = _interopRequireDefault(require_node());
    var types = _interopRequireWildcard(require_types());
    function _getRequireWildcardCache(nodeInterop) {
      if (typeof WeakMap !== "function") return null;
      var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
      var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
      return (_getRequireWildcardCache = /* @__PURE__ */ __name(function _getRequireWildcardCache2(nodeInterop2) {
        return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
      }, "_getRequireWildcardCache"))(nodeInterop);
    }
    __name(_getRequireWildcardCache, "_getRequireWildcardCache");
    function _interopRequireWildcard(obj, nodeInterop) {
      if (!nodeInterop && obj && obj.__esModule) {
        return obj;
      }
      if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return { "default": obj };
      }
      var cache = _getRequireWildcardCache(nodeInterop);
      if (cache && cache.has(obj)) {
        return cache.get(obj);
      }
      var newObj = {};
      var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var key in obj) {
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
          if (desc && (desc.get || desc.set)) {
            Object.defineProperty(newObj, key, desc);
          } else {
            newObj[key] = obj[key];
          }
        }
      }
      newObj["default"] = obj;
      if (cache) {
        cache.set(obj, newObj);
      }
      return newObj;
    }
    __name(_interopRequireWildcard, "_interopRequireWildcard");
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    __name(_interopRequireDefault, "_interopRequireDefault");
    function _createForOfIteratorHelperLoose(o, allowArrayLike) {
      var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
      if (it) return (it = it.call(o)).next.bind(it);
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;
        return function() {
          if (i >= o.length) return { done: true };
          return { done: false, value: o[i++] };
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    __name(_createForOfIteratorHelperLoose, "_createForOfIteratorHelperLoose");
    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }
    __name(_unsupportedIterableToArray, "_unsupportedIterableToArray");
    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
      for (var i = 0, arr2 = new Array(len); i < len; i++) {
        arr2[i] = arr[i];
      }
      return arr2;
    }
    __name(_arrayLikeToArray, "_arrayLikeToArray");
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    __name(_defineProperties, "_defineProperties");
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    __name(_createClass, "_createClass");
    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      _setPrototypeOf(subClass, superClass);
    }
    __name(_inheritsLoose, "_inheritsLoose");
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : /* @__PURE__ */ __name(function _setPrototypeOf2(o2, p2) {
        o2.__proto__ = p2;
        return o2;
      }, "_setPrototypeOf");
      return _setPrototypeOf(o, p);
    }
    __name(_setPrototypeOf, "_setPrototypeOf");
    var Container3 = /* @__PURE__ */ function(_Node) {
      _inheritsLoose(Container4, _Node);
      function Container4(opts) {
        var _this;
        _this = _Node.call(this, opts) || this;
        if (!_this.nodes) {
          _this.nodes = [];
        }
        return _this;
      }
      __name(Container4, "Container");
      var _proto = Container4.prototype;
      _proto.append = /* @__PURE__ */ __name(function append(selector) {
        selector.parent = this;
        this.nodes.push(selector);
        return this;
      }, "append");
      _proto.prepend = /* @__PURE__ */ __name(function prepend(selector) {
        selector.parent = this;
        this.nodes.unshift(selector);
        return this;
      }, "prepend");
      _proto.at = /* @__PURE__ */ __name(function at(index) {
        return this.nodes[index];
      }, "at");
      _proto.index = /* @__PURE__ */ __name(function index(child) {
        if (typeof child === "number") {
          return child;
        }
        return this.nodes.indexOf(child);
      }, "index");
      _proto.removeChild = /* @__PURE__ */ __name(function removeChild(child) {
        child = this.index(child);
        this.at(child).parent = void 0;
        this.nodes.splice(child, 1);
        var index;
        for (var id in this.indexes) {
          index = this.indexes[id];
          if (index >= child) {
            this.indexes[id] = index - 1;
          }
        }
        return this;
      }, "removeChild");
      _proto.removeAll = /* @__PURE__ */ __name(function removeAll() {
        for (var _iterator = _createForOfIteratorHelperLoose(this.nodes), _step; !(_step = _iterator()).done; ) {
          var node = _step.value;
          node.parent = void 0;
        }
        this.nodes = [];
        return this;
      }, "removeAll");
      _proto.empty = /* @__PURE__ */ __name(function empty() {
        return this.removeAll();
      }, "empty");
      _proto.insertAfter = /* @__PURE__ */ __name(function insertAfter(oldNode, newNode) {
        newNode.parent = this;
        var oldIndex = this.index(oldNode);
        this.nodes.splice(oldIndex + 1, 0, newNode);
        newNode.parent = this;
        var index;
        for (var id in this.indexes) {
          index = this.indexes[id];
          if (oldIndex <= index) {
            this.indexes[id] = index + 1;
          }
        }
        return this;
      }, "insertAfter");
      _proto.insertBefore = /* @__PURE__ */ __name(function insertBefore(oldNode, newNode) {
        newNode.parent = this;
        var oldIndex = this.index(oldNode);
        this.nodes.splice(oldIndex, 0, newNode);
        newNode.parent = this;
        var index;
        for (var id in this.indexes) {
          index = this.indexes[id];
          if (index <= oldIndex) {
            this.indexes[id] = index + 1;
          }
        }
        return this;
      }, "insertBefore");
      _proto._findChildAtPosition = /* @__PURE__ */ __name(function _findChildAtPosition(line, col) {
        var found = void 0;
        this.each(function(node) {
          if (node.atPosition) {
            var foundChild = node.atPosition(line, col);
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
      }, "_findChildAtPosition");
      _proto.atPosition = /* @__PURE__ */ __name(function atPosition(line, col) {
        if (this.isAtPosition(line, col)) {
          return this._findChildAtPosition(line, col) || this;
        } else {
          return void 0;
        }
      }, "atPosition");
      _proto._inferEndPosition = /* @__PURE__ */ __name(function _inferEndPosition() {
        if (this.last && this.last.source && this.last.source.end) {
          this.source = this.source || {};
          this.source.end = this.source.end || {};
          Object.assign(this.source.end, this.last.source.end);
        }
      }, "_inferEndPosition");
      _proto.each = /* @__PURE__ */ __name(function each(callback) {
        if (!this.lastEach) {
          this.lastEach = 0;
        }
        if (!this.indexes) {
          this.indexes = {};
        }
        this.lastEach++;
        var id = this.lastEach;
        this.indexes[id] = 0;
        if (!this.length) {
          return void 0;
        }
        var index, result;
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
      }, "each");
      _proto.walk = /* @__PURE__ */ __name(function walk(callback) {
        return this.each(function(node, i) {
          var result = callback(node, i);
          if (result !== false && node.length) {
            result = node.walk(callback);
          }
          if (result === false) {
            return false;
          }
        });
      }, "walk");
      _proto.walkAttributes = /* @__PURE__ */ __name(function walkAttributes(callback) {
        var _this2 = this;
        return this.walk(function(selector) {
          if (selector.type === types.ATTRIBUTE) {
            return callback.call(_this2, selector);
          }
        });
      }, "walkAttributes");
      _proto.walkClasses = /* @__PURE__ */ __name(function walkClasses(callback) {
        var _this3 = this;
        return this.walk(function(selector) {
          if (selector.type === types.CLASS) {
            return callback.call(_this3, selector);
          }
        });
      }, "walkClasses");
      _proto.walkCombinators = /* @__PURE__ */ __name(function walkCombinators(callback) {
        var _this4 = this;
        return this.walk(function(selector) {
          if (selector.type === types.COMBINATOR) {
            return callback.call(_this4, selector);
          }
        });
      }, "walkCombinators");
      _proto.walkComments = /* @__PURE__ */ __name(function walkComments(callback) {
        var _this5 = this;
        return this.walk(function(selector) {
          if (selector.type === types.COMMENT) {
            return callback.call(_this5, selector);
          }
        });
      }, "walkComments");
      _proto.walkIds = /* @__PURE__ */ __name(function walkIds(callback) {
        var _this6 = this;
        return this.walk(function(selector) {
          if (selector.type === types.ID) {
            return callback.call(_this6, selector);
          }
        });
      }, "walkIds");
      _proto.walkNesting = /* @__PURE__ */ __name(function walkNesting(callback) {
        var _this7 = this;
        return this.walk(function(selector) {
          if (selector.type === types.NESTING) {
            return callback.call(_this7, selector);
          }
        });
      }, "walkNesting");
      _proto.walkPseudos = /* @__PURE__ */ __name(function walkPseudos(callback) {
        var _this8 = this;
        return this.walk(function(selector) {
          if (selector.type === types.PSEUDO) {
            return callback.call(_this8, selector);
          }
        });
      }, "walkPseudos");
      _proto.walkTags = /* @__PURE__ */ __name(function walkTags(callback) {
        var _this9 = this;
        return this.walk(function(selector) {
          if (selector.type === types.TAG) {
            return callback.call(_this9, selector);
          }
        });
      }, "walkTags");
      _proto.walkUniversals = /* @__PURE__ */ __name(function walkUniversals(callback) {
        var _this10 = this;
        return this.walk(function(selector) {
          if (selector.type === types.UNIVERSAL) {
            return callback.call(_this10, selector);
          }
        });
      }, "walkUniversals");
      _proto.split = /* @__PURE__ */ __name(function split(callback) {
        var _this11 = this;
        var current = [];
        return this.reduce(function(memo, node, index) {
          var split2 = callback.call(_this11, node);
          current.push(node);
          if (split2) {
            memo.push(current);
            current = [];
          } else if (index === _this11.length - 1) {
            memo.push(current);
          }
          return memo;
        }, []);
      }, "split");
      _proto.map = /* @__PURE__ */ __name(function map(callback) {
        return this.nodes.map(callback);
      }, "map");
      _proto.reduce = /* @__PURE__ */ __name(function reduce(callback, memo) {
        return this.nodes.reduce(callback, memo);
      }, "reduce");
      _proto.every = /* @__PURE__ */ __name(function every(callback) {
        return this.nodes.every(callback);
      }, "every");
      _proto.some = /* @__PURE__ */ __name(function some(callback) {
        return this.nodes.some(callback);
      }, "some");
      _proto.filter = /* @__PURE__ */ __name(function filter(callback) {
        return this.nodes.filter(callback);
      }, "filter");
      _proto.sort = /* @__PURE__ */ __name(function sort(callback) {
        return this.nodes.sort(callback);
      }, "sort");
      _proto.toString = /* @__PURE__ */ __name(function toString() {
        return this.map(String).join("");
      }, "toString");
      _createClass(Container4, [{
        key: "first",
        get: /* @__PURE__ */ __name(function get() {
          return this.at(0);
        }, "get")
      }, {
        key: "last",
        get: /* @__PURE__ */ __name(function get() {
          return this.at(this.length - 1);
        }, "get")
      }, {
        key: "length",
        get: /* @__PURE__ */ __name(function get() {
          return this.nodes.length;
        }, "get")
      }]);
      return Container4;
    }(_node["default"]);
    exports["default"] = Container3;
    module.exports = exports.default;
  }
});

// node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/selectors/root.js
var require_root = __commonJS({
  "node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/selectors/root.js"(exports, module) {
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _container = _interopRequireDefault(require_container());
    var _types = require_types();
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    __name(_interopRequireDefault, "_interopRequireDefault");
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    __name(_defineProperties, "_defineProperties");
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    __name(_createClass, "_createClass");
    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      _setPrototypeOf(subClass, superClass);
    }
    __name(_inheritsLoose, "_inheritsLoose");
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : /* @__PURE__ */ __name(function _setPrototypeOf2(o2, p2) {
        o2.__proto__ = p2;
        return o2;
      }, "_setPrototypeOf");
      return _setPrototypeOf(o, p);
    }
    __name(_setPrototypeOf, "_setPrototypeOf");
    var Root3 = /* @__PURE__ */ function(_Container) {
      _inheritsLoose(Root4, _Container);
      function Root4(opts) {
        var _this;
        _this = _Container.call(this, opts) || this;
        _this.type = _types.ROOT;
        return _this;
      }
      __name(Root4, "Root");
      var _proto = Root4.prototype;
      _proto.toString = /* @__PURE__ */ __name(function toString() {
        var str = this.reduce(function(memo, selector) {
          memo.push(String(selector));
          return memo;
        }, []).join(",");
        return this.trailingComma ? str + "," : str;
      }, "toString");
      _proto.error = /* @__PURE__ */ __name(function error(message, options) {
        if (this._error) {
          return this._error(message, options);
        } else {
          return new Error(message);
        }
      }, "error");
      _createClass(Root4, [{
        key: "errorGenerator",
        set: /* @__PURE__ */ __name(function set(handler) {
          this._error = handler;
        }, "set")
      }]);
      return Root4;
    }(_container["default"]);
    exports["default"] = Root3;
    module.exports = exports.default;
  }
});

// node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/selectors/selector.js
var require_selector = __commonJS({
  "node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/selectors/selector.js"(exports, module) {
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _container = _interopRequireDefault(require_container());
    var _types = require_types();
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    __name(_interopRequireDefault, "_interopRequireDefault");
    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      _setPrototypeOf(subClass, superClass);
    }
    __name(_inheritsLoose, "_inheritsLoose");
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : /* @__PURE__ */ __name(function _setPrototypeOf2(o2, p2) {
        o2.__proto__ = p2;
        return o2;
      }, "_setPrototypeOf");
      return _setPrototypeOf(o, p);
    }
    __name(_setPrototypeOf, "_setPrototypeOf");
    var Selector = /* @__PURE__ */ function(_Container) {
      _inheritsLoose(Selector2, _Container);
      function Selector2(opts) {
        var _this;
        _this = _Container.call(this, opts) || this;
        _this.type = _types.SELECTOR;
        return _this;
      }
      __name(Selector2, "Selector");
      return Selector2;
    }(_container["default"]);
    exports["default"] = Selector;
    module.exports = exports.default;
  }
});

// node_modules/.pnpm/cssesc@3.0.0/node_modules/cssesc/cssesc.js
var require_cssesc = __commonJS({
  "node_modules/.pnpm/cssesc@3.0.0/node_modules/cssesc/cssesc.js"(exports, module) {
    "use strict";
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
    var cssesc = /* @__PURE__ */ __name(function cssesc2(string, options) {
      options = merge(options, cssesc2.options);
      if (options.quotes != "single" && options.quotes != "double") {
        options.quotes = "single";
      }
      var quote = options.quotes == "double" ? '"' : "'";
      var isIdentifier = options.isIdentifier;
      var firstChar = string.charAt(0);
      var output = "";
      var counter = 0;
      var length = string.length;
      while (counter < length) {
        var character = string.charAt(counter++);
        var codePoint = character.charCodeAt();
        var value = void 0;
        if (codePoint < 32 || codePoint > 126) {
          if (codePoint >= 55296 && codePoint <= 56319 && counter < length) {
            var extra = string.charCodeAt(counter++);
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
      output = output.replace(regexExcessiveSpaces, function($0, $1, $2) {
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
    cssesc.version = "3.0.0";
    module.exports = cssesc;
  }
});

// node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/selectors/className.js
var require_className = __commonJS({
  "node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/selectors/className.js"(exports, module) {
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _cssesc = _interopRequireDefault(require_cssesc());
    var _util = require_util();
    var _node = _interopRequireDefault(require_node());
    var _types = require_types();
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    __name(_interopRequireDefault, "_interopRequireDefault");
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    __name(_defineProperties, "_defineProperties");
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    __name(_createClass, "_createClass");
    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      _setPrototypeOf(subClass, superClass);
    }
    __name(_inheritsLoose, "_inheritsLoose");
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : /* @__PURE__ */ __name(function _setPrototypeOf2(o2, p2) {
        o2.__proto__ = p2;
        return o2;
      }, "_setPrototypeOf");
      return _setPrototypeOf(o, p);
    }
    __name(_setPrototypeOf, "_setPrototypeOf");
    var ClassName = /* @__PURE__ */ function(_Node) {
      _inheritsLoose(ClassName2, _Node);
      function ClassName2(opts) {
        var _this;
        _this = _Node.call(this, opts) || this;
        _this.type = _types.CLASS;
        _this._constructed = true;
        return _this;
      }
      __name(ClassName2, "ClassName");
      var _proto = ClassName2.prototype;
      _proto.valueToString = /* @__PURE__ */ __name(function valueToString() {
        return "." + _Node.prototype.valueToString.call(this);
      }, "valueToString");
      _createClass(ClassName2, [{
        key: "value",
        get: /* @__PURE__ */ __name(function get() {
          return this._value;
        }, "get"),
        set: /* @__PURE__ */ __name(function set(v) {
          if (this._constructed) {
            var escaped = (0, _cssesc["default"])(v, {
              isIdentifier: true
            });
            if (escaped !== v) {
              (0, _util.ensureObject)(this, "raws");
              this.raws.value = escaped;
            } else if (this.raws) {
              delete this.raws.value;
            }
          }
          this._value = v;
        }, "set")
      }]);
      return ClassName2;
    }(_node["default"]);
    exports["default"] = ClassName;
    module.exports = exports.default;
  }
});

// node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/selectors/comment.js
var require_comment = __commonJS({
  "node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/selectors/comment.js"(exports, module) {
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _node = _interopRequireDefault(require_node());
    var _types = require_types();
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    __name(_interopRequireDefault, "_interopRequireDefault");
    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      _setPrototypeOf(subClass, superClass);
    }
    __name(_inheritsLoose, "_inheritsLoose");
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : /* @__PURE__ */ __name(function _setPrototypeOf2(o2, p2) {
        o2.__proto__ = p2;
        return o2;
      }, "_setPrototypeOf");
      return _setPrototypeOf(o, p);
    }
    __name(_setPrototypeOf, "_setPrototypeOf");
    var Comment2 = /* @__PURE__ */ function(_Node) {
      _inheritsLoose(Comment3, _Node);
      function Comment3(opts) {
        var _this;
        _this = _Node.call(this, opts) || this;
        _this.type = _types.COMMENT;
        return _this;
      }
      __name(Comment3, "Comment");
      return Comment3;
    }(_node["default"]);
    exports["default"] = Comment2;
    module.exports = exports.default;
  }
});

// node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/selectors/id.js
var require_id = __commonJS({
  "node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/selectors/id.js"(exports, module) {
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _node = _interopRequireDefault(require_node());
    var _types = require_types();
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    __name(_interopRequireDefault, "_interopRequireDefault");
    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      _setPrototypeOf(subClass, superClass);
    }
    __name(_inheritsLoose, "_inheritsLoose");
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : /* @__PURE__ */ __name(function _setPrototypeOf2(o2, p2) {
        o2.__proto__ = p2;
        return o2;
      }, "_setPrototypeOf");
      return _setPrototypeOf(o, p);
    }
    __name(_setPrototypeOf, "_setPrototypeOf");
    var ID = /* @__PURE__ */ function(_Node) {
      _inheritsLoose(ID2, _Node);
      function ID2(opts) {
        var _this;
        _this = _Node.call(this, opts) || this;
        _this.type = _types.ID;
        return _this;
      }
      __name(ID2, "ID");
      var _proto = ID2.prototype;
      _proto.valueToString = /* @__PURE__ */ __name(function valueToString() {
        return "#" + _Node.prototype.valueToString.call(this);
      }, "valueToString");
      return ID2;
    }(_node["default"]);
    exports["default"] = ID;
    module.exports = exports.default;
  }
});

// node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/selectors/namespace.js
var require_namespace = __commonJS({
  "node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/selectors/namespace.js"(exports, module) {
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _cssesc = _interopRequireDefault(require_cssesc());
    var _util = require_util();
    var _node = _interopRequireDefault(require_node());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    __name(_interopRequireDefault, "_interopRequireDefault");
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    __name(_defineProperties, "_defineProperties");
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    __name(_createClass, "_createClass");
    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      _setPrototypeOf(subClass, superClass);
    }
    __name(_inheritsLoose, "_inheritsLoose");
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : /* @__PURE__ */ __name(function _setPrototypeOf2(o2, p2) {
        o2.__proto__ = p2;
        return o2;
      }, "_setPrototypeOf");
      return _setPrototypeOf(o, p);
    }
    __name(_setPrototypeOf, "_setPrototypeOf");
    var Namespace = /* @__PURE__ */ function(_Node) {
      _inheritsLoose(Namespace2, _Node);
      function Namespace2() {
        return _Node.apply(this, arguments) || this;
      }
      __name(Namespace2, "Namespace");
      var _proto = Namespace2.prototype;
      _proto.qualifiedName = /* @__PURE__ */ __name(function qualifiedName(value) {
        if (this.namespace) {
          return this.namespaceString + "|" + value;
        } else {
          return value;
        }
      }, "qualifiedName");
      _proto.valueToString = /* @__PURE__ */ __name(function valueToString() {
        return this.qualifiedName(_Node.prototype.valueToString.call(this));
      }, "valueToString");
      _createClass(Namespace2, [{
        key: "namespace",
        get: /* @__PURE__ */ __name(function get() {
          return this._namespace;
        }, "get"),
        set: /* @__PURE__ */ __name(function set(namespace) {
          if (namespace === true || namespace === "*" || namespace === "&") {
            this._namespace = namespace;
            if (this.raws) {
              delete this.raws.namespace;
            }
            return;
          }
          var escaped = (0, _cssesc["default"])(namespace, {
            isIdentifier: true
          });
          this._namespace = namespace;
          if (escaped !== namespace) {
            (0, _util.ensureObject)(this, "raws");
            this.raws.namespace = escaped;
          } else if (this.raws) {
            delete this.raws.namespace;
          }
        }, "set")
      }, {
        key: "ns",
        get: /* @__PURE__ */ __name(function get() {
          return this._namespace;
        }, "get"),
        set: /* @__PURE__ */ __name(function set(namespace) {
          this.namespace = namespace;
        }, "set")
      }, {
        key: "namespaceString",
        get: /* @__PURE__ */ __name(function get() {
          if (this.namespace) {
            var ns = this.stringifyProperty("namespace");
            if (ns === true) {
              return "";
            } else {
              return ns;
            }
          } else {
            return "";
          }
        }, "get")
      }]);
      return Namespace2;
    }(_node["default"]);
    exports["default"] = Namespace;
    module.exports = exports.default;
  }
});

// node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/selectors/tag.js
var require_tag = __commonJS({
  "node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/selectors/tag.js"(exports, module) {
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _namespace = _interopRequireDefault(require_namespace());
    var _types = require_types();
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    __name(_interopRequireDefault, "_interopRequireDefault");
    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      _setPrototypeOf(subClass, superClass);
    }
    __name(_inheritsLoose, "_inheritsLoose");
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : /* @__PURE__ */ __name(function _setPrototypeOf2(o2, p2) {
        o2.__proto__ = p2;
        return o2;
      }, "_setPrototypeOf");
      return _setPrototypeOf(o, p);
    }
    __name(_setPrototypeOf, "_setPrototypeOf");
    var Tag = /* @__PURE__ */ function(_Namespace) {
      _inheritsLoose(Tag2, _Namespace);
      function Tag2(opts) {
        var _this;
        _this = _Namespace.call(this, opts) || this;
        _this.type = _types.TAG;
        return _this;
      }
      __name(Tag2, "Tag");
      return Tag2;
    }(_namespace["default"]);
    exports["default"] = Tag;
    module.exports = exports.default;
  }
});

// node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/selectors/string.js
var require_string = __commonJS({
  "node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/selectors/string.js"(exports, module) {
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _node = _interopRequireDefault(require_node());
    var _types = require_types();
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    __name(_interopRequireDefault, "_interopRequireDefault");
    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      _setPrototypeOf(subClass, superClass);
    }
    __name(_inheritsLoose, "_inheritsLoose");
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : /* @__PURE__ */ __name(function _setPrototypeOf2(o2, p2) {
        o2.__proto__ = p2;
        return o2;
      }, "_setPrototypeOf");
      return _setPrototypeOf(o, p);
    }
    __name(_setPrototypeOf, "_setPrototypeOf");
    var String2 = /* @__PURE__ */ function(_Node) {
      _inheritsLoose(String3, _Node);
      function String3(opts) {
        var _this;
        _this = _Node.call(this, opts) || this;
        _this.type = _types.STRING;
        return _this;
      }
      __name(String3, "String");
      return String3;
    }(_node["default"]);
    exports["default"] = String2;
    module.exports = exports.default;
  }
});

// node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/selectors/pseudo.js
var require_pseudo = __commonJS({
  "node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/selectors/pseudo.js"(exports, module) {
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _container = _interopRequireDefault(require_container());
    var _types = require_types();
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    __name(_interopRequireDefault, "_interopRequireDefault");
    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      _setPrototypeOf(subClass, superClass);
    }
    __name(_inheritsLoose, "_inheritsLoose");
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : /* @__PURE__ */ __name(function _setPrototypeOf2(o2, p2) {
        o2.__proto__ = p2;
        return o2;
      }, "_setPrototypeOf");
      return _setPrototypeOf(o, p);
    }
    __name(_setPrototypeOf, "_setPrototypeOf");
    var Pseudo = /* @__PURE__ */ function(_Container) {
      _inheritsLoose(Pseudo2, _Container);
      function Pseudo2(opts) {
        var _this;
        _this = _Container.call(this, opts) || this;
        _this.type = _types.PSEUDO;
        return _this;
      }
      __name(Pseudo2, "Pseudo");
      var _proto = Pseudo2.prototype;
      _proto.toString = /* @__PURE__ */ __name(function toString() {
        var params = this.length ? "(" + this.map(String).join(",") + ")" : "";
        return [this.rawSpaceBefore, this.stringifyProperty("value"), params, this.rawSpaceAfter].join("");
      }, "toString");
      return Pseudo2;
    }(_container["default"]);
    exports["default"] = Pseudo;
    module.exports = exports.default;
  }
});

// node_modules/.pnpm/util-deprecate@1.0.2/node_modules/util-deprecate/node.js
var require_node2 = __commonJS({
  "node_modules/.pnpm/util-deprecate@1.0.2/node_modules/util-deprecate/node.js"(exports, module) {
    module.exports = __require("util").deprecate;
  }
});

// node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/selectors/attribute.js
var require_attribute = __commonJS({
  "node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/selectors/attribute.js"(exports) {
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    exports.unescapeValue = unescapeValue;
    var _cssesc = _interopRequireDefault(require_cssesc());
    var _unesc = _interopRequireDefault(require_unesc());
    var _namespace = _interopRequireDefault(require_namespace());
    var _types = require_types();
    var _CSSESC_QUOTE_OPTIONS;
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    __name(_interopRequireDefault, "_interopRequireDefault");
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    __name(_defineProperties, "_defineProperties");
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    __name(_createClass, "_createClass");
    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      _setPrototypeOf(subClass, superClass);
    }
    __name(_inheritsLoose, "_inheritsLoose");
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : /* @__PURE__ */ __name(function _setPrototypeOf2(o2, p2) {
        o2.__proto__ = p2;
        return o2;
      }, "_setPrototypeOf");
      return _setPrototypeOf(o, p);
    }
    __name(_setPrototypeOf, "_setPrototypeOf");
    var deprecate = require_node2();
    var WRAPPED_IN_QUOTES = /^('|")([^]*)\1$/;
    var warnOfDeprecatedValueAssignment = deprecate(function() {
    }, "Assigning an attribute a value containing characters that might need to be escaped is deprecated. Call attribute.setValue() instead.");
    var warnOfDeprecatedQuotedAssignment = deprecate(function() {
    }, "Assigning attr.quoted is deprecated and has no effect. Assign to attr.quoteMark instead.");
    var warnOfDeprecatedConstructor = deprecate(function() {
    }, "Constructing an Attribute selector with a value without specifying quoteMark is deprecated. Note: The value should be unescaped now.");
    function unescapeValue(value) {
      var deprecatedUsage = false;
      var quoteMark = null;
      var unescaped = value;
      var m = unescaped.match(WRAPPED_IN_QUOTES);
      if (m) {
        quoteMark = m[1];
        unescaped = m[2];
      }
      unescaped = (0, _unesc["default"])(unescaped);
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
      var _unescapeValue = unescapeValue(opts.value), quoteMark = _unescapeValue.quoteMark, unescaped = _unescapeValue.unescaped;
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
    var Attribute = /* @__PURE__ */ function(_Namespace) {
      _inheritsLoose(Attribute2, _Namespace);
      function Attribute2(opts) {
        var _this;
        if (opts === void 0) {
          opts = {};
        }
        _this = _Namespace.call(this, handleDeprecatedContructorOpts(opts)) || this;
        _this.type = _types.ATTRIBUTE;
        _this.raws = _this.raws || {};
        Object.defineProperty(_this.raws, "unquoted", {
          get: deprecate(function() {
            return _this.value;
          }, "attr.raws.unquoted is deprecated. Call attr.value instead."),
          set: deprecate(function() {
            return _this.value;
          }, "Setting attr.raws.unquoted is deprecated and has no effect. attr.value is unescaped by default now.")
        });
        _this._constructed = true;
        return _this;
      }
      __name(Attribute2, "Attribute");
      var _proto = Attribute2.prototype;
      _proto.getQuotedValue = /* @__PURE__ */ __name(function getQuotedValue(options) {
        if (options === void 0) {
          options = {};
        }
        var quoteMark = this._determineQuoteMark(options);
        var cssescopts = CSSESC_QUOTE_OPTIONS[quoteMark];
        var escaped = (0, _cssesc["default"])(this._value, cssescopts);
        return escaped;
      }, "getQuotedValue");
      _proto._determineQuoteMark = /* @__PURE__ */ __name(function _determineQuoteMark(options) {
        return options.smart ? this.smartQuoteMark(options) : this.preferredQuoteMark(options);
      }, "_determineQuoteMark");
      _proto.setValue = /* @__PURE__ */ __name(function setValue(value, options) {
        if (options === void 0) {
          options = {};
        }
        this._value = value;
        this._quoteMark = this._determineQuoteMark(options);
        this._syncRawValue();
      }, "setValue");
      _proto.smartQuoteMark = /* @__PURE__ */ __name(function smartQuoteMark(options) {
        var v = this.value;
        var numSingleQuotes = v.replace(/[^']/g, "").length;
        var numDoubleQuotes = v.replace(/[^"]/g, "").length;
        if (numSingleQuotes + numDoubleQuotes === 0) {
          var escaped = (0, _cssesc["default"])(v, {
            isIdentifier: true
          });
          if (escaped === v) {
            return Attribute2.NO_QUOTE;
          } else {
            var pref = this.preferredQuoteMark(options);
            if (pref === Attribute2.NO_QUOTE) {
              var quote = this.quoteMark || options.quoteMark || Attribute2.DOUBLE_QUOTE;
              var opts = CSSESC_QUOTE_OPTIONS[quote];
              var quoteValue = (0, _cssesc["default"])(v, opts);
              if (quoteValue.length < escaped.length) {
                return quote;
              }
            }
            return pref;
          }
        } else if (numDoubleQuotes === numSingleQuotes) {
          return this.preferredQuoteMark(options);
        } else if (numDoubleQuotes < numSingleQuotes) {
          return Attribute2.DOUBLE_QUOTE;
        } else {
          return Attribute2.SINGLE_QUOTE;
        }
      }, "smartQuoteMark");
      _proto.preferredQuoteMark = /* @__PURE__ */ __name(function preferredQuoteMark(options) {
        var quoteMark = options.preferCurrentQuoteMark ? this.quoteMark : options.quoteMark;
        if (quoteMark === void 0) {
          quoteMark = options.preferCurrentQuoteMark ? options.quoteMark : this.quoteMark;
        }
        if (quoteMark === void 0) {
          quoteMark = Attribute2.DOUBLE_QUOTE;
        }
        return quoteMark;
      }, "preferredQuoteMark");
      _proto._syncRawValue = /* @__PURE__ */ __name(function _syncRawValue() {
        var rawValue = (0, _cssesc["default"])(this._value, CSSESC_QUOTE_OPTIONS[this.quoteMark]);
        if (rawValue === this._value) {
          if (this.raws) {
            delete this.raws.value;
          }
        } else {
          this.raws.value = rawValue;
        }
      }, "_syncRawValue");
      _proto._handleEscapes = /* @__PURE__ */ __name(function _handleEscapes(prop, value) {
        if (this._constructed) {
          var escaped = (0, _cssesc["default"])(value, {
            isIdentifier: true
          });
          if (escaped !== value) {
            this.raws[prop] = escaped;
          } else {
            delete this.raws[prop];
          }
        }
      }, "_handleEscapes");
      _proto._spacesFor = /* @__PURE__ */ __name(function _spacesFor(name) {
        var attrSpaces = {
          before: "",
          after: ""
        };
        var spaces = this.spaces[name] || {};
        var rawSpaces = this.raws.spaces && this.raws.spaces[name] || {};
        return Object.assign(attrSpaces, spaces, rawSpaces);
      }, "_spacesFor");
      _proto._stringFor = /* @__PURE__ */ __name(function _stringFor(name, spaceName, concat) {
        if (spaceName === void 0) {
          spaceName = name;
        }
        if (concat === void 0) {
          concat = defaultAttrConcat;
        }
        var attrSpaces = this._spacesFor(spaceName);
        return concat(this.stringifyProperty(name), attrSpaces);
      }, "_stringFor");
      _proto.offsetOf = /* @__PURE__ */ __name(function offsetOf(name) {
        var count = 1;
        var attributeSpaces = this._spacesFor("attribute");
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
        var operatorSpaces = this._spacesFor("operator");
        count += operatorSpaces.before.length;
        var operator = this.stringifyProperty("operator");
        if (name === "operator") {
          return operator ? count : -1;
        }
        count += operator.length;
        count += operatorSpaces.after.length;
        var valueSpaces = this._spacesFor("value");
        count += valueSpaces.before.length;
        var value = this.stringifyProperty("value");
        if (name === "value") {
          return value ? count : -1;
        }
        count += value.length;
        count += valueSpaces.after.length;
        var insensitiveSpaces = this._spacesFor("insensitive");
        count += insensitiveSpaces.before.length;
        if (name === "insensitive") {
          return this.insensitive ? count : -1;
        }
        return -1;
      }, "offsetOf");
      _proto.toString = /* @__PURE__ */ __name(function toString() {
        var _this2 = this;
        var selector = [this.rawSpaceBefore, "["];
        selector.push(this._stringFor("qualifiedAttribute", "attribute"));
        if (this.operator && (this.value || this.value === "")) {
          selector.push(this._stringFor("operator"));
          selector.push(this._stringFor("value"));
          selector.push(this._stringFor("insensitiveFlag", "insensitive", function(attrValue, attrSpaces) {
            if (attrValue.length > 0 && !_this2.quoted && attrSpaces.before.length === 0 && !(_this2.spaces.value && _this2.spaces.value.after)) {
              attrSpaces.before = " ";
            }
            return defaultAttrConcat(attrValue, attrSpaces);
          }));
        }
        selector.push("]");
        selector.push(this.rawSpaceAfter);
        return selector.join("");
      }, "toString");
      _createClass(Attribute2, [{
        key: "quoted",
        get: /* @__PURE__ */ __name(function get() {
          var qm = this.quoteMark;
          return qm === "'" || qm === '"';
        }, "get"),
        set: /* @__PURE__ */ __name(function set(value) {
          warnOfDeprecatedQuotedAssignment();
        }, "set")
        /**
         * returns a single (`'`) or double (`"`) quote character if the value is quoted.
         * returns `null` if the value is not quoted.
         * returns `undefined` if the quotation state is unknown (this can happen when
         * the attribute is constructed without specifying a quote mark.)
         */
      }, {
        key: "quoteMark",
        get: /* @__PURE__ */ __name(function get() {
          return this._quoteMark;
        }, "get"),
        set: /* @__PURE__ */ __name(function set(quoteMark) {
          if (!this._constructed) {
            this._quoteMark = quoteMark;
            return;
          }
          if (this._quoteMark !== quoteMark) {
            this._quoteMark = quoteMark;
            this._syncRawValue();
          }
        }, "set")
      }, {
        key: "qualifiedAttribute",
        get: /* @__PURE__ */ __name(function get() {
          return this.qualifiedName(this.raws.attribute || this.attribute);
        }, "get")
      }, {
        key: "insensitiveFlag",
        get: /* @__PURE__ */ __name(function get() {
          return this.insensitive ? "i" : "";
        }, "get")
      }, {
        key: "value",
        get: /* @__PURE__ */ __name(function get() {
          return this._value;
        }, "get"),
        set: (
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
          /* @__PURE__ */ __name(function set(v) {
            if (this._constructed) {
              var _unescapeValue2 = unescapeValue(v), deprecatedUsage = _unescapeValue2.deprecatedUsage, unescaped = _unescapeValue2.unescaped, quoteMark = _unescapeValue2.quoteMark;
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
          }, "set")
        )
      }, {
        key: "insensitive",
        get: /* @__PURE__ */ __name(function get() {
          return this._insensitive;
        }, "get"),
        set: /* @__PURE__ */ __name(function set(insensitive) {
          if (!insensitive) {
            this._insensitive = false;
            if (this.raws && (this.raws.insensitiveFlag === "I" || this.raws.insensitiveFlag === "i")) {
              this.raws.insensitiveFlag = void 0;
            }
          }
          this._insensitive = insensitive;
        }, "set")
      }, {
        key: "attribute",
        get: /* @__PURE__ */ __name(function get() {
          return this._attribute;
        }, "get"),
        set: /* @__PURE__ */ __name(function set(name) {
          this._handleEscapes("attribute", name);
          this._attribute = name;
        }, "set")
      }]);
      return Attribute2;
    }(_namespace["default"]);
    exports["default"] = Attribute;
    Attribute.NO_QUOTE = null;
    Attribute.SINGLE_QUOTE = "'";
    Attribute.DOUBLE_QUOTE = '"';
    var CSSESC_QUOTE_OPTIONS = (_CSSESC_QUOTE_OPTIONS = {
      "'": {
        quotes: "single",
        wrap: true
      },
      '"': {
        quotes: "double",
        wrap: true
      }
    }, _CSSESC_QUOTE_OPTIONS[null] = {
      isIdentifier: true
    }, _CSSESC_QUOTE_OPTIONS);
    function defaultAttrConcat(attrValue, attrSpaces) {
      return "" + attrSpaces.before + attrValue + attrSpaces.after;
    }
    __name(defaultAttrConcat, "defaultAttrConcat");
  }
});

// node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/selectors/universal.js
var require_universal = __commonJS({
  "node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/selectors/universal.js"(exports, module) {
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _namespace = _interopRequireDefault(require_namespace());
    var _types = require_types();
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    __name(_interopRequireDefault, "_interopRequireDefault");
    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      _setPrototypeOf(subClass, superClass);
    }
    __name(_inheritsLoose, "_inheritsLoose");
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : /* @__PURE__ */ __name(function _setPrototypeOf2(o2, p2) {
        o2.__proto__ = p2;
        return o2;
      }, "_setPrototypeOf");
      return _setPrototypeOf(o, p);
    }
    __name(_setPrototypeOf, "_setPrototypeOf");
    var Universal = /* @__PURE__ */ function(_Namespace) {
      _inheritsLoose(Universal2, _Namespace);
      function Universal2(opts) {
        var _this;
        _this = _Namespace.call(this, opts) || this;
        _this.type = _types.UNIVERSAL;
        _this.value = "*";
        return _this;
      }
      __name(Universal2, "Universal");
      return Universal2;
    }(_namespace["default"]);
    exports["default"] = Universal;
    module.exports = exports.default;
  }
});

// node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/selectors/combinator.js
var require_combinator = __commonJS({
  "node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/selectors/combinator.js"(exports, module) {
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _node = _interopRequireDefault(require_node());
    var _types = require_types();
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    __name(_interopRequireDefault, "_interopRequireDefault");
    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      _setPrototypeOf(subClass, superClass);
    }
    __name(_inheritsLoose, "_inheritsLoose");
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : /* @__PURE__ */ __name(function _setPrototypeOf2(o2, p2) {
        o2.__proto__ = p2;
        return o2;
      }, "_setPrototypeOf");
      return _setPrototypeOf(o, p);
    }
    __name(_setPrototypeOf, "_setPrototypeOf");
    var Combinator = /* @__PURE__ */ function(_Node) {
      _inheritsLoose(Combinator2, _Node);
      function Combinator2(opts) {
        var _this;
        _this = _Node.call(this, opts) || this;
        _this.type = _types.COMBINATOR;
        return _this;
      }
      __name(Combinator2, "Combinator");
      return Combinator2;
    }(_node["default"]);
    exports["default"] = Combinator;
    module.exports = exports.default;
  }
});

// node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/selectors/nesting.js
var require_nesting = __commonJS({
  "node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/selectors/nesting.js"(exports, module) {
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _node = _interopRequireDefault(require_node());
    var _types = require_types();
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    __name(_interopRequireDefault, "_interopRequireDefault");
    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      _setPrototypeOf(subClass, superClass);
    }
    __name(_inheritsLoose, "_inheritsLoose");
    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : /* @__PURE__ */ __name(function _setPrototypeOf2(o2, p2) {
        o2.__proto__ = p2;
        return o2;
      }, "_setPrototypeOf");
      return _setPrototypeOf(o, p);
    }
    __name(_setPrototypeOf, "_setPrototypeOf");
    var Nesting = /* @__PURE__ */ function(_Node) {
      _inheritsLoose(Nesting2, _Node);
      function Nesting2(opts) {
        var _this;
        _this = _Node.call(this, opts) || this;
        _this.type = _types.NESTING;
        _this.value = "&";
        return _this;
      }
      __name(Nesting2, "Nesting");
      return Nesting2;
    }(_node["default"]);
    exports["default"] = Nesting;
    module.exports = exports.default;
  }
});

// node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/sortAscending.js
var require_sortAscending = __commonJS({
  "node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/sortAscending.js"(exports, module) {
    "use strict";
    exports.__esModule = true;
    exports["default"] = sortAscending;
    function sortAscending(list2) {
      return list2.sort(function(a, b) {
        return a - b;
      });
    }
    __name(sortAscending, "sortAscending");
    module.exports = exports.default;
  }
});

// node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/tokenTypes.js
var require_tokenTypes = __commonJS({
  "node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/tokenTypes.js"(exports) {
    "use strict";
    exports.__esModule = true;
    exports.word = exports.tilde = exports.tab = exports.str = exports.space = exports.slash = exports.singleQuote = exports.semicolon = exports.plus = exports.pipe = exports.openSquare = exports.openParenthesis = exports.newline = exports.greaterThan = exports.feed = exports.equals = exports.doubleQuote = exports.dollar = exports.cr = exports.comment = exports.comma = exports.combinator = exports.colon = exports.closeSquare = exports.closeParenthesis = exports.caret = exports.bang = exports.backslash = exports.at = exports.asterisk = exports.ampersand = void 0;
    var ampersand = 38;
    exports.ampersand = ampersand;
    var asterisk = 42;
    exports.asterisk = asterisk;
    var at = 64;
    exports.at = at;
    var comma = 44;
    exports.comma = comma;
    var colon = 58;
    exports.colon = colon;
    var semicolon = 59;
    exports.semicolon = semicolon;
    var openParenthesis = 40;
    exports.openParenthesis = openParenthesis;
    var closeParenthesis = 41;
    exports.closeParenthesis = closeParenthesis;
    var openSquare = 91;
    exports.openSquare = openSquare;
    var closeSquare = 93;
    exports.closeSquare = closeSquare;
    var dollar = 36;
    exports.dollar = dollar;
    var tilde = 126;
    exports.tilde = tilde;
    var caret = 94;
    exports.caret = caret;
    var plus = 43;
    exports.plus = plus;
    var equals = 61;
    exports.equals = equals;
    var pipe = 124;
    exports.pipe = pipe;
    var greaterThan = 62;
    exports.greaterThan = greaterThan;
    var space = 32;
    exports.space = space;
    var singleQuote = 39;
    exports.singleQuote = singleQuote;
    var doubleQuote = 34;
    exports.doubleQuote = doubleQuote;
    var slash = 47;
    exports.slash = slash;
    var bang = 33;
    exports.bang = bang;
    var backslash = 92;
    exports.backslash = backslash;
    var cr = 13;
    exports.cr = cr;
    var feed = 12;
    exports.feed = feed;
    var newline = 10;
    exports.newline = newline;
    var tab = 9;
    exports.tab = tab;
    var str = singleQuote;
    exports.str = str;
    var comment = -1;
    exports.comment = comment;
    var word = -2;
    exports.word = word;
    var combinator = -3;
    exports.combinator = combinator;
  }
});

// node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/tokenize.js
var require_tokenize = __commonJS({
  "node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/tokenize.js"(exports) {
    "use strict";
    exports.__esModule = true;
    exports.FIELDS = void 0;
    exports["default"] = tokenize;
    var t = _interopRequireWildcard(require_tokenTypes());
    var _unescapable;
    var _wordDelimiters;
    function _getRequireWildcardCache(nodeInterop) {
      if (typeof WeakMap !== "function") return null;
      var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
      var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
      return (_getRequireWildcardCache = /* @__PURE__ */ __name(function _getRequireWildcardCache2(nodeInterop2) {
        return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
      }, "_getRequireWildcardCache"))(nodeInterop);
    }
    __name(_getRequireWildcardCache, "_getRequireWildcardCache");
    function _interopRequireWildcard(obj, nodeInterop) {
      if (!nodeInterop && obj && obj.__esModule) {
        return obj;
      }
      if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return { "default": obj };
      }
      var cache = _getRequireWildcardCache(nodeInterop);
      if (cache && cache.has(obj)) {
        return cache.get(obj);
      }
      var newObj = {};
      var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var key in obj) {
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
          if (desc && (desc.get || desc.set)) {
            Object.defineProperty(newObj, key, desc);
          } else {
            newObj[key] = obj[key];
          }
        }
      }
      newObj["default"] = obj;
      if (cache) {
        cache.set(obj, newObj);
      }
      return newObj;
    }
    __name(_interopRequireWildcard, "_interopRequireWildcard");
    var unescapable = (_unescapable = {}, _unescapable[t.tab] = true, _unescapable[t.newline] = true, _unescapable[t.cr] = true, _unescapable[t.feed] = true, _unescapable);
    var wordDelimiters = (_wordDelimiters = {}, _wordDelimiters[t.space] = true, _wordDelimiters[t.tab] = true, _wordDelimiters[t.newline] = true, _wordDelimiters[t.cr] = true, _wordDelimiters[t.feed] = true, _wordDelimiters[t.ampersand] = true, _wordDelimiters[t.asterisk] = true, _wordDelimiters[t.bang] = true, _wordDelimiters[t.comma] = true, _wordDelimiters[t.colon] = true, _wordDelimiters[t.semicolon] = true, _wordDelimiters[t.openParenthesis] = true, _wordDelimiters[t.closeParenthesis] = true, _wordDelimiters[t.openSquare] = true, _wordDelimiters[t.closeSquare] = true, _wordDelimiters[t.singleQuote] = true, _wordDelimiters[t.doubleQuote] = true, _wordDelimiters[t.plus] = true, _wordDelimiters[t.pipe] = true, _wordDelimiters[t.tilde] = true, _wordDelimiters[t.greaterThan] = true, _wordDelimiters[t.equals] = true, _wordDelimiters[t.dollar] = true, _wordDelimiters[t.caret] = true, _wordDelimiters[t.slash] = true, _wordDelimiters);
    var hex = {};
    var hexChars = "0123456789abcdefABCDEF";
    for (i = 0; i < hexChars.length; i++) {
      hex[hexChars.charCodeAt(i)] = true;
    }
    var i;
    function consumeWord(css, start) {
      var next = start;
      var code;
      do {
        code = css.charCodeAt(next);
        if (wordDelimiters[code]) {
          return next - 1;
        } else if (code === t.backslash) {
          next = consumeEscape(css, next) + 1;
        } else {
          next++;
        }
      } while (next < css.length);
      return next - 1;
    }
    __name(consumeWord, "consumeWord");
    function consumeEscape(css, start) {
      var next = start;
      var code = css.charCodeAt(next + 1);
      if (unescapable[code]) {
      } else if (hex[code]) {
        var hexDigits = 0;
        do {
          next++;
          hexDigits++;
          code = css.charCodeAt(next + 1);
        } while (hex[code] && hexDigits < 6);
        if (hexDigits < 6 && code === t.space) {
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
    exports.FIELDS = FIELDS;
    function tokenize(input) {
      var tokens = [];
      var css = input.css.valueOf();
      var _css = css, length = _css.length;
      var offset = -1;
      var line = 1;
      var start = 0;
      var end = 0;
      var code, content, endColumn, endLine, escaped, escapePos, last, lines, next, nextLine, nextOffset, quote, tokenType;
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
        if (code === t.newline) {
          offset = start;
          line += 1;
        }
        switch (code) {
          case t.space:
          case t.tab:
          case t.newline:
          case t.cr:
          case t.feed:
            next = start;
            do {
              next += 1;
              code = css.charCodeAt(next);
              if (code === t.newline) {
                offset = next;
                line += 1;
              }
            } while (code === t.space || code === t.newline || code === t.tab || code === t.cr || code === t.feed);
            tokenType = t.space;
            endLine = line;
            endColumn = next - offset - 1;
            end = next;
            break;
          case t.plus:
          case t.greaterThan:
          case t.tilde:
          case t.pipe:
            next = start;
            do {
              next += 1;
              code = css.charCodeAt(next);
            } while (code === t.plus || code === t.greaterThan || code === t.tilde || code === t.pipe);
            tokenType = t.combinator;
            endLine = line;
            endColumn = start - offset;
            end = next;
            break;
          // Consume these characters as single tokens.
          case t.asterisk:
          case t.ampersand:
          case t.bang:
          case t.comma:
          case t.equals:
          case t.dollar:
          case t.caret:
          case t.openSquare:
          case t.closeSquare:
          case t.colon:
          case t.semicolon:
          case t.openParenthesis:
          case t.closeParenthesis:
            next = start;
            tokenType = code;
            endLine = line;
            endColumn = start - offset;
            end = next + 1;
            break;
          case t.singleQuote:
          case t.doubleQuote:
            quote = code === t.singleQuote ? "'" : '"';
            next = start;
            do {
              escaped = false;
              next = css.indexOf(quote, next + 1);
              if (next === -1) {
                unclosed("quote", quote);
              }
              escapePos = next;
              while (css.charCodeAt(escapePos - 1) === t.backslash) {
                escapePos -= 1;
                escaped = !escaped;
              }
            } while (escaped);
            tokenType = t.str;
            endLine = line;
            endColumn = start - offset;
            end = next + 1;
            break;
          default:
            if (code === t.slash && css.charCodeAt(start + 1) === t.asterisk) {
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
              tokenType = t.comment;
              line = nextLine;
              endLine = nextLine;
              endColumn = next - nextOffset;
            } else if (code === t.slash) {
              next = start;
              tokenType = code;
              endLine = line;
              endColumn = start - offset;
              end = next + 1;
            } else {
              next = consumeWord(css, start);
              tokenType = t.word;
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
  }
});

// node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/parser.js
var require_parser = __commonJS({
  "node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/parser.js"(exports, module) {
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _root = _interopRequireDefault(require_root());
    var _selector = _interopRequireDefault(require_selector());
    var _className = _interopRequireDefault(require_className());
    var _comment = _interopRequireDefault(require_comment());
    var _id = _interopRequireDefault(require_id());
    var _tag = _interopRequireDefault(require_tag());
    var _string = _interopRequireDefault(require_string());
    var _pseudo = _interopRequireDefault(require_pseudo());
    var _attribute = _interopRequireWildcard(require_attribute());
    var _universal = _interopRequireDefault(require_universal());
    var _combinator = _interopRequireDefault(require_combinator());
    var _nesting = _interopRequireDefault(require_nesting());
    var _sortAscending = _interopRequireDefault(require_sortAscending());
    var _tokenize = _interopRequireWildcard(require_tokenize());
    var tokens = _interopRequireWildcard(require_tokenTypes());
    var types = _interopRequireWildcard(require_types());
    var _util = require_util();
    var _WHITESPACE_TOKENS;
    var _Object$assign;
    function _getRequireWildcardCache(nodeInterop) {
      if (typeof WeakMap !== "function") return null;
      var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
      var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
      return (_getRequireWildcardCache = /* @__PURE__ */ __name(function _getRequireWildcardCache2(nodeInterop2) {
        return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
      }, "_getRequireWildcardCache"))(nodeInterop);
    }
    __name(_getRequireWildcardCache, "_getRequireWildcardCache");
    function _interopRequireWildcard(obj, nodeInterop) {
      if (!nodeInterop && obj && obj.__esModule) {
        return obj;
      }
      if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return { "default": obj };
      }
      var cache = _getRequireWildcardCache(nodeInterop);
      if (cache && cache.has(obj)) {
        return cache.get(obj);
      }
      var newObj = {};
      var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var key in obj) {
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
          if (desc && (desc.get || desc.set)) {
            Object.defineProperty(newObj, key, desc);
          } else {
            newObj[key] = obj[key];
          }
        }
      }
      newObj["default"] = obj;
      if (cache) {
        cache.set(obj, newObj);
      }
      return newObj;
    }
    __name(_interopRequireWildcard, "_interopRequireWildcard");
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    __name(_interopRequireDefault, "_interopRequireDefault");
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    __name(_defineProperties, "_defineProperties");
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      Object.defineProperty(Constructor, "prototype", { writable: false });
      return Constructor;
    }
    __name(_createClass, "_createClass");
    var WHITESPACE_TOKENS = (_WHITESPACE_TOKENS = {}, _WHITESPACE_TOKENS[tokens.space] = true, _WHITESPACE_TOKENS[tokens.cr] = true, _WHITESPACE_TOKENS[tokens.feed] = true, _WHITESPACE_TOKENS[tokens.newline] = true, _WHITESPACE_TOKENS[tokens.tab] = true, _WHITESPACE_TOKENS);
    var WHITESPACE_EQUIV_TOKENS = Object.assign({}, WHITESPACE_TOKENS, (_Object$assign = {}, _Object$assign[tokens.comment] = true, _Object$assign));
    function tokenStart(token) {
      return {
        line: token[_tokenize.FIELDS.START_LINE],
        column: token[_tokenize.FIELDS.START_COL]
      };
    }
    __name(tokenStart, "tokenStart");
    function tokenEnd(token) {
      return {
        line: token[_tokenize.FIELDS.END_LINE],
        column: token[_tokenize.FIELDS.END_COL]
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
      return getSource(token[_tokenize.FIELDS.START_LINE], token[_tokenize.FIELDS.START_COL], token[_tokenize.FIELDS.END_LINE], token[_tokenize.FIELDS.END_COL]);
    }
    __name(getTokenSource, "getTokenSource");
    function getTokenSourceSpan(startToken, endToken) {
      if (!startToken) {
        return void 0;
      }
      return getSource(startToken[_tokenize.FIELDS.START_LINE], startToken[_tokenize.FIELDS.START_COL], endToken[_tokenize.FIELDS.END_LINE], endToken[_tokenize.FIELDS.END_COL]);
    }
    __name(getTokenSourceSpan, "getTokenSourceSpan");
    function unescapeProp(node, prop) {
      var value = node[prop];
      if (typeof value !== "string") {
        return;
      }
      if (value.indexOf("\\") !== -1) {
        (0, _util.ensureObject)(node, "raws");
        node[prop] = (0, _util.unesc)(value);
        if (node.raws[prop] === void 0) {
          node.raws[prop] = value;
        }
      }
      return node;
    }
    __name(unescapeProp, "unescapeProp");
    function indexesOf(array, item) {
      var i = -1;
      var indexes = [];
      while ((i = array.indexOf(item, i + 1)) !== -1) {
        indexes.push(i);
      }
      return indexes;
    }
    __name(indexesOf, "indexesOf");
    function uniqs() {
      var list2 = Array.prototype.concat.apply([], arguments);
      return list2.filter(function(item, i) {
        return i === list2.indexOf(item);
      });
    }
    __name(uniqs, "uniqs");
    var Parser2 = /* @__PURE__ */ function() {
      function Parser3(rule, options) {
        if (options === void 0) {
          options = {};
        }
        this.rule = rule;
        this.options = Object.assign({
          lossy: false,
          safe: false
        }, options);
        this.position = 0;
        this.css = typeof this.rule === "string" ? this.rule : this.rule.selector;
        this.tokens = (0, _tokenize["default"])({
          css: this.css,
          error: this._errorGenerator(),
          safe: this.options.safe
        });
        var rootSource = getTokenSourceSpan(this.tokens[0], this.tokens[this.tokens.length - 1]);
        this.root = new _root["default"]({
          source: rootSource
        });
        this.root.errorGenerator = this._errorGenerator();
        var selector = new _selector["default"]({
          source: {
            start: {
              line: 1,
              column: 1
            }
          },
          sourceIndex: 0
        });
        this.root.append(selector);
        this.current = selector;
        this.loop();
      }
      __name(Parser3, "Parser");
      var _proto = Parser3.prototype;
      _proto._errorGenerator = /* @__PURE__ */ __name(function _errorGenerator() {
        var _this = this;
        return function(message, errorOptions) {
          if (typeof _this.rule === "string") {
            return new Error(message);
          }
          return _this.rule.error(message, errorOptions);
        };
      }, "_errorGenerator");
      _proto.attribute = /* @__PURE__ */ __name(function attribute() {
        var attr = [];
        var startingToken = this.currToken;
        this.position++;
        while (this.position < this.tokens.length && this.currToken[_tokenize.FIELDS.TYPE] !== tokens.closeSquare) {
          attr.push(this.currToken);
          this.position++;
        }
        if (this.currToken[_tokenize.FIELDS.TYPE] !== tokens.closeSquare) {
          return this.expected("closing square bracket", this.currToken[_tokenize.FIELDS.START_POS]);
        }
        var len = attr.length;
        var node = {
          source: getSource(startingToken[1], startingToken[2], this.currToken[3], this.currToken[4]),
          sourceIndex: startingToken[_tokenize.FIELDS.START_POS]
        };
        if (len === 1 && !~[tokens.word].indexOf(attr[0][_tokenize.FIELDS.TYPE])) {
          return this.expected("attribute", attr[0][_tokenize.FIELDS.START_POS]);
        }
        var pos = 0;
        var spaceBefore = "";
        var commentBefore = "";
        var lastAdded = null;
        var spaceAfterMeaningfulToken = false;
        while (pos < len) {
          var token = attr[pos];
          var content = this.content(token);
          var next = attr[pos + 1];
          switch (token[_tokenize.FIELDS.TYPE]) {
            case tokens.space:
              spaceAfterMeaningfulToken = true;
              if (this.options.lossy) {
                break;
              }
              if (lastAdded) {
                (0, _util.ensureObject)(node, "spaces", lastAdded);
                var prevContent = node.spaces[lastAdded].after || "";
                node.spaces[lastAdded].after = prevContent + content;
                var existingComment = (0, _util.getProp)(node, "raws", "spaces", lastAdded, "after") || null;
                if (existingComment) {
                  node.raws.spaces[lastAdded].after = existingComment + content;
                }
              } else {
                spaceBefore = spaceBefore + content;
                commentBefore = commentBefore + content;
              }
              break;
            case tokens.asterisk:
              if (next[_tokenize.FIELDS.TYPE] === tokens.equals) {
                node.operator = content;
                lastAdded = "operator";
              } else if ((!node.namespace || lastAdded === "namespace" && !spaceAfterMeaningfulToken) && next) {
                if (spaceBefore) {
                  (0, _util.ensureObject)(node, "spaces", "attribute");
                  node.spaces.attribute.before = spaceBefore;
                  spaceBefore = "";
                }
                if (commentBefore) {
                  (0, _util.ensureObject)(node, "raws", "spaces", "attribute");
                  node.raws.spaces.attribute.before = spaceBefore;
                  commentBefore = "";
                }
                node.namespace = (node.namespace || "") + content;
                var rawValue = (0, _util.getProp)(node, "raws", "namespace") || null;
                if (rawValue) {
                  node.raws.namespace += content;
                }
                lastAdded = "namespace";
              }
              spaceAfterMeaningfulToken = false;
              break;
            case tokens.dollar:
              if (lastAdded === "value") {
                var oldRawValue = (0, _util.getProp)(node, "raws", "value");
                node.value += "$";
                if (oldRawValue) {
                  node.raws.value = oldRawValue + "$";
                }
                break;
              }
            // Falls through
            case tokens.caret:
              if (next[_tokenize.FIELDS.TYPE] === tokens.equals) {
                node.operator = content;
                lastAdded = "operator";
              }
              spaceAfterMeaningfulToken = false;
              break;
            case tokens.combinator:
              if (content === "~" && next[_tokenize.FIELDS.TYPE] === tokens.equals) {
                node.operator = content;
                lastAdded = "operator";
              }
              if (content !== "|") {
                spaceAfterMeaningfulToken = false;
                break;
              }
              if (next[_tokenize.FIELDS.TYPE] === tokens.equals) {
                node.operator = content;
                lastAdded = "operator";
              } else if (!node.namespace && !node.attribute) {
                node.namespace = true;
              }
              spaceAfterMeaningfulToken = false;
              break;
            case tokens.word:
              if (next && this.content(next) === "|" && attr[pos + 2] && attr[pos + 2][_tokenize.FIELDS.TYPE] !== tokens.equals && // this look-ahead probably fails with comment nodes involved.
              !node.operator && !node.namespace) {
                node.namespace = content;
                lastAdded = "namespace";
              } else if (!node.attribute || lastAdded === "attribute" && !spaceAfterMeaningfulToken) {
                if (spaceBefore) {
                  (0, _util.ensureObject)(node, "spaces", "attribute");
                  node.spaces.attribute.before = spaceBefore;
                  spaceBefore = "";
                }
                if (commentBefore) {
                  (0, _util.ensureObject)(node, "raws", "spaces", "attribute");
                  node.raws.spaces.attribute.before = commentBefore;
                  commentBefore = "";
                }
                node.attribute = (node.attribute || "") + content;
                var _rawValue = (0, _util.getProp)(node, "raws", "attribute") || null;
                if (_rawValue) {
                  node.raws.attribute += content;
                }
                lastAdded = "attribute";
              } else if (!node.value && node.value !== "" || lastAdded === "value" && !(spaceAfterMeaningfulToken || node.quoteMark)) {
                var _unescaped = (0, _util.unesc)(content);
                var _oldRawValue = (0, _util.getProp)(node, "raws", "value") || "";
                var oldValue = node.value || "";
                node.value = oldValue + _unescaped;
                node.quoteMark = null;
                if (_unescaped !== content || _oldRawValue) {
                  (0, _util.ensureObject)(node, "raws");
                  node.raws.value = (_oldRawValue || oldValue) + content;
                }
                lastAdded = "value";
              } else {
                var insensitive = content === "i" || content === "I";
                if ((node.value || node.value === "") && (node.quoteMark || spaceAfterMeaningfulToken)) {
                  node.insensitive = insensitive;
                  if (!insensitive || content === "I") {
                    (0, _util.ensureObject)(node, "raws");
                    node.raws.insensitiveFlag = content;
                  }
                  lastAdded = "insensitive";
                  if (spaceBefore) {
                    (0, _util.ensureObject)(node, "spaces", "insensitive");
                    node.spaces.insensitive.before = spaceBefore;
                    spaceBefore = "";
                  }
                  if (commentBefore) {
                    (0, _util.ensureObject)(node, "raws", "spaces", "insensitive");
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
            case tokens.str:
              if (!node.attribute || !node.operator) {
                return this.error("Expected an attribute followed by an operator preceding the string.", {
                  index: token[_tokenize.FIELDS.START_POS]
                });
              }
              var _unescapeValue = (0, _attribute.unescapeValue)(content), unescaped = _unescapeValue.unescaped, quoteMark = _unescapeValue.quoteMark;
              node.value = unescaped;
              node.quoteMark = quoteMark;
              lastAdded = "value";
              (0, _util.ensureObject)(node, "raws");
              node.raws.value = content;
              spaceAfterMeaningfulToken = false;
              break;
            case tokens.equals:
              if (!node.attribute) {
                return this.expected("attribute", token[_tokenize.FIELDS.START_POS], content);
              }
              if (node.value) {
                return this.error('Unexpected "=" found; an operator was already defined.', {
                  index: token[_tokenize.FIELDS.START_POS]
                });
              }
              node.operator = node.operator ? node.operator + content : content;
              lastAdded = "operator";
              spaceAfterMeaningfulToken = false;
              break;
            case tokens.comment:
              if (lastAdded) {
                if (spaceAfterMeaningfulToken || next && next[_tokenize.FIELDS.TYPE] === tokens.space || lastAdded === "insensitive") {
                  var lastComment = (0, _util.getProp)(node, "spaces", lastAdded, "after") || "";
                  var rawLastComment = (0, _util.getProp)(node, "raws", "spaces", lastAdded, "after") || lastComment;
                  (0, _util.ensureObject)(node, "raws", "spaces", lastAdded);
                  node.raws.spaces[lastAdded].after = rawLastComment + content;
                } else {
                  var lastValue = node[lastAdded] || "";
                  var rawLastValue = (0, _util.getProp)(node, "raws", lastAdded) || lastValue;
                  (0, _util.ensureObject)(node, "raws");
                  node.raws[lastAdded] = rawLastValue + content;
                }
              } else {
                commentBefore = commentBefore + content;
              }
              break;
            default:
              return this.error('Unexpected "' + content + '" found.', {
                index: token[_tokenize.FIELDS.START_POS]
              });
          }
          pos++;
        }
        unescapeProp(node, "attribute");
        unescapeProp(node, "namespace");
        this.newNode(new _attribute["default"](node));
        this.position++;
      }, "attribute");
      _proto.parseWhitespaceEquivalentTokens = /* @__PURE__ */ __name(function parseWhitespaceEquivalentTokens(stopPosition) {
        if (stopPosition < 0) {
          stopPosition = this.tokens.length;
        }
        var startPosition = this.position;
        var nodes = [];
        var space = "";
        var lastComment = void 0;
        do {
          if (WHITESPACE_TOKENS[this.currToken[_tokenize.FIELDS.TYPE]]) {
            if (!this.options.lossy) {
              space += this.content();
            }
          } else if (this.currToken[_tokenize.FIELDS.TYPE] === tokens.comment) {
            var spaces = {};
            if (space) {
              spaces.before = space;
              space = "";
            }
            lastComment = new _comment["default"]({
              value: this.content(),
              source: getTokenSource(this.currToken),
              sourceIndex: this.currToken[_tokenize.FIELDS.START_POS],
              spaces
            });
            nodes.push(lastComment);
          }
        } while (++this.position < stopPosition);
        if (space) {
          if (lastComment) {
            lastComment.spaces.after = space;
          } else if (!this.options.lossy) {
            var firstToken = this.tokens[startPosition];
            var lastToken = this.tokens[this.position - 1];
            nodes.push(new _string["default"]({
              value: "",
              source: getSource(firstToken[_tokenize.FIELDS.START_LINE], firstToken[_tokenize.FIELDS.START_COL], lastToken[_tokenize.FIELDS.END_LINE], lastToken[_tokenize.FIELDS.END_COL]),
              sourceIndex: firstToken[_tokenize.FIELDS.START_POS],
              spaces: {
                before: space,
                after: ""
              }
            }));
          }
        }
        return nodes;
      }, "parseWhitespaceEquivalentTokens");
      _proto.convertWhitespaceNodesToSpace = /* @__PURE__ */ __name(function convertWhitespaceNodesToSpace(nodes, requiredSpace) {
        var _this2 = this;
        if (requiredSpace === void 0) {
          requiredSpace = false;
        }
        var space = "";
        var rawSpace = "";
        nodes.forEach(function(n) {
          var spaceBefore = _this2.lossySpace(n.spaces.before, requiredSpace);
          var rawSpaceBefore = _this2.lossySpace(n.rawSpaceBefore, requiredSpace);
          space += spaceBefore + _this2.lossySpace(n.spaces.after, requiredSpace && spaceBefore.length === 0);
          rawSpace += spaceBefore + n.value + _this2.lossySpace(n.rawSpaceAfter, requiredSpace && rawSpaceBefore.length === 0);
        });
        if (rawSpace === space) {
          rawSpace = void 0;
        }
        var result = {
          space,
          rawSpace
        };
        return result;
      }, "convertWhitespaceNodesToSpace");
      _proto.isNamedCombinator = /* @__PURE__ */ __name(function isNamedCombinator(position) {
        if (position === void 0) {
          position = this.position;
        }
        return this.tokens[position + 0] && this.tokens[position + 0][_tokenize.FIELDS.TYPE] === tokens.slash && this.tokens[position + 1] && this.tokens[position + 1][_tokenize.FIELDS.TYPE] === tokens.word && this.tokens[position + 2] && this.tokens[position + 2][_tokenize.FIELDS.TYPE] === tokens.slash;
      }, "isNamedCombinator");
      _proto.namedCombinator = /* @__PURE__ */ __name(function namedCombinator() {
        if (this.isNamedCombinator()) {
          var nameRaw = this.content(this.tokens[this.position + 1]);
          var name = (0, _util.unesc)(nameRaw).toLowerCase();
          var raws = {};
          if (name !== nameRaw) {
            raws.value = "/" + nameRaw + "/";
          }
          var node = new _combinator["default"]({
            value: "/" + name + "/",
            source: getSource(this.currToken[_tokenize.FIELDS.START_LINE], this.currToken[_tokenize.FIELDS.START_COL], this.tokens[this.position + 2][_tokenize.FIELDS.END_LINE], this.tokens[this.position + 2][_tokenize.FIELDS.END_COL]),
            sourceIndex: this.currToken[_tokenize.FIELDS.START_POS],
            raws
          });
          this.position = this.position + 3;
          return node;
        } else {
          this.unexpected();
        }
      }, "namedCombinator");
      _proto.combinator = /* @__PURE__ */ __name(function combinator() {
        var _this3 = this;
        if (this.content() === "|") {
          return this.namespace();
        }
        var nextSigTokenPos = this.locateNextMeaningfulToken(this.position);
        if (nextSigTokenPos < 0 || this.tokens[nextSigTokenPos][_tokenize.FIELDS.TYPE] === tokens.comma || this.tokens[nextSigTokenPos][_tokenize.FIELDS.TYPE] === tokens.closeParenthesis) {
          var nodes = this.parseWhitespaceEquivalentTokens(nextSigTokenPos);
          if (nodes.length > 0) {
            var last = this.current.last;
            if (last) {
              var _this$convertWhitespa = this.convertWhitespaceNodesToSpace(nodes), space = _this$convertWhitespa.space, rawSpace = _this$convertWhitespa.rawSpace;
              if (rawSpace !== void 0) {
                last.rawSpaceAfter += rawSpace;
              }
              last.spaces.after += space;
            } else {
              nodes.forEach(function(n) {
                return _this3.newNode(n);
              });
            }
          }
          return;
        }
        var firstToken = this.currToken;
        var spaceOrDescendantSelectorNodes = void 0;
        if (nextSigTokenPos > this.position) {
          spaceOrDescendantSelectorNodes = this.parseWhitespaceEquivalentTokens(nextSigTokenPos);
        }
        var node;
        if (this.isNamedCombinator()) {
          node = this.namedCombinator();
        } else if (this.currToken[_tokenize.FIELDS.TYPE] === tokens.combinator) {
          node = new _combinator["default"]({
            value: this.content(),
            source: getTokenSource(this.currToken),
            sourceIndex: this.currToken[_tokenize.FIELDS.START_POS]
          });
          this.position++;
        } else if (WHITESPACE_TOKENS[this.currToken[_tokenize.FIELDS.TYPE]]) {
        } else if (!spaceOrDescendantSelectorNodes) {
          this.unexpected();
        }
        if (node) {
          if (spaceOrDescendantSelectorNodes) {
            var _this$convertWhitespa2 = this.convertWhitespaceNodesToSpace(spaceOrDescendantSelectorNodes), _space = _this$convertWhitespa2.space, _rawSpace = _this$convertWhitespa2.rawSpace;
            node.spaces.before = _space;
            node.rawSpaceBefore = _rawSpace;
          }
        } else {
          var _this$convertWhitespa3 = this.convertWhitespaceNodesToSpace(spaceOrDescendantSelectorNodes, true), _space2 = _this$convertWhitespa3.space, _rawSpace2 = _this$convertWhitespa3.rawSpace;
          if (!_rawSpace2) {
            _rawSpace2 = _space2;
          }
          var spaces = {};
          var raws = {
            spaces: {}
          };
          if (_space2.endsWith(" ") && _rawSpace2.endsWith(" ")) {
            spaces.before = _space2.slice(0, _space2.length - 1);
            raws.spaces.before = _rawSpace2.slice(0, _rawSpace2.length - 1);
          } else if (_space2.startsWith(" ") && _rawSpace2.startsWith(" ")) {
            spaces.after = _space2.slice(1);
            raws.spaces.after = _rawSpace2.slice(1);
          } else {
            raws.value = _rawSpace2;
          }
          node = new _combinator["default"]({
            value: " ",
            source: getTokenSourceSpan(firstToken, this.tokens[this.position - 1]),
            sourceIndex: firstToken[_tokenize.FIELDS.START_POS],
            spaces,
            raws
          });
        }
        if (this.currToken && this.currToken[_tokenize.FIELDS.TYPE] === tokens.space) {
          node.spaces.after = this.optionalSpace(this.content());
          this.position++;
        }
        return this.newNode(node);
      }, "combinator");
      _proto.comma = /* @__PURE__ */ __name(function comma() {
        if (this.position === this.tokens.length - 1) {
          this.root.trailingComma = true;
          this.position++;
          return;
        }
        this.current._inferEndPosition();
        var selector = new _selector["default"]({
          source: {
            start: tokenStart(this.tokens[this.position + 1])
          },
          sourceIndex: this.tokens[this.position + 1][_tokenize.FIELDS.START_POS]
        });
        this.current.parent.append(selector);
        this.current = selector;
        this.position++;
      }, "comma");
      _proto.comment = /* @__PURE__ */ __name(function comment() {
        var current = this.currToken;
        this.newNode(new _comment["default"]({
          value: this.content(),
          source: getTokenSource(current),
          sourceIndex: current[_tokenize.FIELDS.START_POS]
        }));
        this.position++;
      }, "comment");
      _proto.error = /* @__PURE__ */ __name(function error(message, opts) {
        throw this.root.error(message, opts);
      }, "error");
      _proto.missingBackslash = /* @__PURE__ */ __name(function missingBackslash() {
        return this.error("Expected a backslash preceding the semicolon.", {
          index: this.currToken[_tokenize.FIELDS.START_POS]
        });
      }, "missingBackslash");
      _proto.missingParenthesis = /* @__PURE__ */ __name(function missingParenthesis() {
        return this.expected("opening parenthesis", this.currToken[_tokenize.FIELDS.START_POS]);
      }, "missingParenthesis");
      _proto.missingSquareBracket = /* @__PURE__ */ __name(function missingSquareBracket() {
        return this.expected("opening square bracket", this.currToken[_tokenize.FIELDS.START_POS]);
      }, "missingSquareBracket");
      _proto.unexpected = /* @__PURE__ */ __name(function unexpected() {
        return this.error("Unexpected '" + this.content() + "'. Escaping special characters with \\ may help.", this.currToken[_tokenize.FIELDS.START_POS]);
      }, "unexpected");
      _proto.unexpectedPipe = /* @__PURE__ */ __name(function unexpectedPipe() {
        return this.error("Unexpected '|'.", this.currToken[_tokenize.FIELDS.START_POS]);
      }, "unexpectedPipe");
      _proto.namespace = /* @__PURE__ */ __name(function namespace() {
        var before = this.prevToken && this.content(this.prevToken) || true;
        if (this.nextToken[_tokenize.FIELDS.TYPE] === tokens.word) {
          this.position++;
          return this.word(before);
        } else if (this.nextToken[_tokenize.FIELDS.TYPE] === tokens.asterisk) {
          this.position++;
          return this.universal(before);
        }
        this.unexpectedPipe();
      }, "namespace");
      _proto.nesting = /* @__PURE__ */ __name(function nesting() {
        if (this.nextToken) {
          var nextContent = this.content(this.nextToken);
          if (nextContent === "|") {
            this.position++;
            return;
          }
        }
        var current = this.currToken;
        this.newNode(new _nesting["default"]({
          value: this.content(),
          source: getTokenSource(current),
          sourceIndex: current[_tokenize.FIELDS.START_POS]
        }));
        this.position++;
      }, "nesting");
      _proto.parentheses = /* @__PURE__ */ __name(function parentheses() {
        var last = this.current.last;
        var unbalanced = 1;
        this.position++;
        if (last && last.type === types.PSEUDO) {
          var selector = new _selector["default"]({
            source: {
              start: tokenStart(this.tokens[this.position])
            },
            sourceIndex: this.tokens[this.position][_tokenize.FIELDS.START_POS]
          });
          var cache = this.current;
          last.append(selector);
          this.current = selector;
          while (this.position < this.tokens.length && unbalanced) {
            if (this.currToken[_tokenize.FIELDS.TYPE] === tokens.openParenthesis) {
              unbalanced++;
            }
            if (this.currToken[_tokenize.FIELDS.TYPE] === tokens.closeParenthesis) {
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
          var parenStart = this.currToken;
          var parenValue = "(";
          var parenEnd;
          while (this.position < this.tokens.length && unbalanced) {
            if (this.currToken[_tokenize.FIELDS.TYPE] === tokens.openParenthesis) {
              unbalanced++;
            }
            if (this.currToken[_tokenize.FIELDS.TYPE] === tokens.closeParenthesis) {
              unbalanced--;
            }
            parenEnd = this.currToken;
            parenValue += this.parseParenthesisToken(this.currToken);
            this.position++;
          }
          if (last) {
            last.appendToPropertyAndEscape("value", parenValue, parenValue);
          } else {
            this.newNode(new _string["default"]({
              value: parenValue,
              source: getSource(parenStart[_tokenize.FIELDS.START_LINE], parenStart[_tokenize.FIELDS.START_COL], parenEnd[_tokenize.FIELDS.END_LINE], parenEnd[_tokenize.FIELDS.END_COL]),
              sourceIndex: parenStart[_tokenize.FIELDS.START_POS]
            }));
          }
        }
        if (unbalanced) {
          return this.expected("closing parenthesis", this.currToken[_tokenize.FIELDS.START_POS]);
        }
      }, "parentheses");
      _proto.pseudo = /* @__PURE__ */ __name(function pseudo() {
        var _this4 = this;
        var pseudoStr = "";
        var startingToken = this.currToken;
        while (this.currToken && this.currToken[_tokenize.FIELDS.TYPE] === tokens.colon) {
          pseudoStr += this.content();
          this.position++;
        }
        if (!this.currToken) {
          return this.expected(["pseudo-class", "pseudo-element"], this.position - 1);
        }
        if (this.currToken[_tokenize.FIELDS.TYPE] === tokens.word) {
          this.splitWord(false, function(first, length) {
            pseudoStr += first;
            _this4.newNode(new _pseudo["default"]({
              value: pseudoStr,
              source: getTokenSourceSpan(startingToken, _this4.currToken),
              sourceIndex: startingToken[_tokenize.FIELDS.START_POS]
            }));
            if (length > 1 && _this4.nextToken && _this4.nextToken[_tokenize.FIELDS.TYPE] === tokens.openParenthesis) {
              _this4.error("Misplaced parenthesis.", {
                index: _this4.nextToken[_tokenize.FIELDS.START_POS]
              });
            }
          });
        } else {
          return this.expected(["pseudo-class", "pseudo-element"], this.currToken[_tokenize.FIELDS.START_POS]);
        }
      }, "pseudo");
      _proto.space = /* @__PURE__ */ __name(function space() {
        var content = this.content();
        if (this.position === 0 || this.prevToken[_tokenize.FIELDS.TYPE] === tokens.comma || this.prevToken[_tokenize.FIELDS.TYPE] === tokens.openParenthesis || this.current.nodes.every(function(node) {
          return node.type === "comment";
        })) {
          this.spaces = this.optionalSpace(content);
          this.position++;
        } else if (this.position === this.tokens.length - 1 || this.nextToken[_tokenize.FIELDS.TYPE] === tokens.comma || this.nextToken[_tokenize.FIELDS.TYPE] === tokens.closeParenthesis) {
          this.current.last.spaces.after = this.optionalSpace(content);
          this.position++;
        } else {
          this.combinator();
        }
      }, "space");
      _proto.string = /* @__PURE__ */ __name(function string() {
        var current = this.currToken;
        this.newNode(new _string["default"]({
          value: this.content(),
          source: getTokenSource(current),
          sourceIndex: current[_tokenize.FIELDS.START_POS]
        }));
        this.position++;
      }, "string");
      _proto.universal = /* @__PURE__ */ __name(function universal(namespace) {
        var nextToken = this.nextToken;
        if (nextToken && this.content(nextToken) === "|") {
          this.position++;
          return this.namespace();
        }
        var current = this.currToken;
        this.newNode(new _universal["default"]({
          value: this.content(),
          source: getTokenSource(current),
          sourceIndex: current[_tokenize.FIELDS.START_POS]
        }), namespace);
        this.position++;
      }, "universal");
      _proto.splitWord = /* @__PURE__ */ __name(function splitWord(namespace, firstCallback) {
        var _this5 = this;
        var nextToken = this.nextToken;
        var word = this.content();
        while (nextToken && ~[tokens.dollar, tokens.caret, tokens.equals, tokens.word].indexOf(nextToken[_tokenize.FIELDS.TYPE])) {
          this.position++;
          var current = this.content();
          word += current;
          if (current.lastIndexOf("\\") === current.length - 1) {
            var next = this.nextToken;
            if (next && next[_tokenize.FIELDS.TYPE] === tokens.space) {
              word += this.requiredSpace(this.content(next));
              this.position++;
            }
          }
          nextToken = this.nextToken;
        }
        var hasClass = indexesOf(word, ".").filter(function(i) {
          var escapedDot = word[i - 1] === "\\";
          var isKeyframesPercent = /^\d+\.\d+%$/.test(word);
          return !escapedDot && !isKeyframesPercent;
        });
        var hasId = indexesOf(word, "#").filter(function(i) {
          return word[i - 1] !== "\\";
        });
        var interpolations = indexesOf(word, "#{");
        if (interpolations.length) {
          hasId = hasId.filter(function(hashIndex) {
            return !~interpolations.indexOf(hashIndex);
          });
        }
        var indices = (0, _sortAscending["default"])(uniqs([0].concat(hasClass, hasId)));
        indices.forEach(function(ind, i) {
          var index = indices[i + 1] || word.length;
          var value = word.slice(ind, index);
          if (i === 0 && firstCallback) {
            return firstCallback.call(_this5, value, indices.length);
          }
          var node;
          var current2 = _this5.currToken;
          var sourceIndex = current2[_tokenize.FIELDS.START_POS] + indices[i];
          var source = getSource(current2[1], current2[2] + ind, current2[3], current2[2] + (index - 1));
          if (~hasClass.indexOf(ind)) {
            var classNameOpts = {
              value: value.slice(1),
              source,
              sourceIndex
            };
            node = new _className["default"](unescapeProp(classNameOpts, "value"));
          } else if (~hasId.indexOf(ind)) {
            var idOpts = {
              value: value.slice(1),
              source,
              sourceIndex
            };
            node = new _id["default"](unescapeProp(idOpts, "value"));
          } else {
            var tagOpts = {
              value,
              source,
              sourceIndex
            };
            unescapeProp(tagOpts, "value");
            node = new _tag["default"](tagOpts);
          }
          _this5.newNode(node, namespace);
          namespace = null;
        });
        this.position++;
      }, "splitWord");
      _proto.word = /* @__PURE__ */ __name(function word(namespace) {
        var nextToken = this.nextToken;
        if (nextToken && this.content(nextToken) === "|") {
          this.position++;
          return this.namespace();
        }
        return this.splitWord(namespace);
      }, "word");
      _proto.loop = /* @__PURE__ */ __name(function loop() {
        while (this.position < this.tokens.length) {
          this.parse(true);
        }
        this.current._inferEndPosition();
        return this.root;
      }, "loop");
      _proto.parse = /* @__PURE__ */ __name(function parse4(throwOnParenthesis) {
        switch (this.currToken[_tokenize.FIELDS.TYPE]) {
          case tokens.space:
            this.space();
            break;
          case tokens.comment:
            this.comment();
            break;
          case tokens.openParenthesis:
            this.parentheses();
            break;
          case tokens.closeParenthesis:
            if (throwOnParenthesis) {
              this.missingParenthesis();
            }
            break;
          case tokens.openSquare:
            this.attribute();
            break;
          case tokens.dollar:
          case tokens.caret:
          case tokens.equals:
          case tokens.word:
            this.word();
            break;
          case tokens.colon:
            this.pseudo();
            break;
          case tokens.comma:
            this.comma();
            break;
          case tokens.asterisk:
            this.universal();
            break;
          case tokens.ampersand:
            this.nesting();
            break;
          case tokens.slash:
          case tokens.combinator:
            this.combinator();
            break;
          case tokens.str:
            this.string();
            break;
          // These cases throw; no break needed.
          case tokens.closeSquare:
            this.missingSquareBracket();
          case tokens.semicolon:
            this.missingBackslash();
          default:
            this.unexpected();
        }
      }, "parse");
      _proto.expected = /* @__PURE__ */ __name(function expected(description, index, found) {
        if (Array.isArray(description)) {
          var last = description.pop();
          description = description.join(", ") + " or " + last;
        }
        var an = /^[aeiou]/.test(description[0]) ? "an" : "a";
        if (!found) {
          return this.error("Expected " + an + " " + description + ".", {
            index
          });
        }
        return this.error("Expected " + an + " " + description + ', found "' + found + '" instead.', {
          index
        });
      }, "expected");
      _proto.requiredSpace = /* @__PURE__ */ __name(function requiredSpace(space) {
        return this.options.lossy ? " " : space;
      }, "requiredSpace");
      _proto.optionalSpace = /* @__PURE__ */ __name(function optionalSpace(space) {
        return this.options.lossy ? "" : space;
      }, "optionalSpace");
      _proto.lossySpace = /* @__PURE__ */ __name(function lossySpace(space, required) {
        if (this.options.lossy) {
          return required ? " " : "";
        } else {
          return space;
        }
      }, "lossySpace");
      _proto.parseParenthesisToken = /* @__PURE__ */ __name(function parseParenthesisToken(token) {
        var content = this.content(token);
        if (token[_tokenize.FIELDS.TYPE] === tokens.space) {
          return this.requiredSpace(content);
        } else {
          return content;
        }
      }, "parseParenthesisToken");
      _proto.newNode = /* @__PURE__ */ __name(function newNode(node, namespace) {
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
      }, "newNode");
      _proto.content = /* @__PURE__ */ __name(function content(token) {
        if (token === void 0) {
          token = this.currToken;
        }
        return this.css.slice(token[_tokenize.FIELDS.START_POS], token[_tokenize.FIELDS.END_POS]);
      }, "content");
      _proto.locateNextMeaningfulToken = /* @__PURE__ */ __name(function locateNextMeaningfulToken(startPosition) {
        if (startPosition === void 0) {
          startPosition = this.position + 1;
        }
        var searchPosition = startPosition;
        while (searchPosition < this.tokens.length) {
          if (WHITESPACE_EQUIV_TOKENS[this.tokens[searchPosition][_tokenize.FIELDS.TYPE]]) {
            searchPosition++;
            continue;
          } else {
            return searchPosition;
          }
        }
        return -1;
      }, "locateNextMeaningfulToken");
      _createClass(Parser3, [{
        key: "currToken",
        get: /* @__PURE__ */ __name(function get() {
          return this.tokens[this.position];
        }, "get")
      }, {
        key: "nextToken",
        get: /* @__PURE__ */ __name(function get() {
          return this.tokens[this.position + 1];
        }, "get")
      }, {
        key: "prevToken",
        get: /* @__PURE__ */ __name(function get() {
          return this.tokens[this.position - 1];
        }, "get")
      }]);
      return Parser3;
    }();
    exports["default"] = Parser2;
    module.exports = exports.default;
  }
});

// node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/processor.js
var require_processor = __commonJS({
  "node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/processor.js"(exports, module) {
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _parser = _interopRequireDefault(require_parser());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    __name(_interopRequireDefault, "_interopRequireDefault");
    var Processor4 = /* @__PURE__ */ function() {
      function Processor5(func, options) {
        this.func = func || /* @__PURE__ */ __name(function noop() {
        }, "noop");
        this.funcRes = null;
        this.options = options;
      }
      __name(Processor5, "Processor");
      var _proto = Processor5.prototype;
      _proto._shouldUpdateSelector = /* @__PURE__ */ __name(function _shouldUpdateSelector(rule, options) {
        if (options === void 0) {
          options = {};
        }
        var merged = Object.assign({}, this.options, options);
        if (merged.updateSelector === false) {
          return false;
        } else {
          return typeof rule !== "string";
        }
      }, "_shouldUpdateSelector");
      _proto._isLossy = /* @__PURE__ */ __name(function _isLossy(options) {
        if (options === void 0) {
          options = {};
        }
        var merged = Object.assign({}, this.options, options);
        if (merged.lossless === false) {
          return true;
        } else {
          return false;
        }
      }, "_isLossy");
      _proto._root = /* @__PURE__ */ __name(function _root(rule, options) {
        if (options === void 0) {
          options = {};
        }
        var parser = new _parser["default"](rule, this._parseOptions(options));
        return parser.root;
      }, "_root");
      _proto._parseOptions = /* @__PURE__ */ __name(function _parseOptions(options) {
        return {
          lossy: this._isLossy(options)
        };
      }, "_parseOptions");
      _proto._run = /* @__PURE__ */ __name(function _run(rule, options) {
        var _this = this;
        if (options === void 0) {
          options = {};
        }
        return new Promise(function(resolve, reject) {
          try {
            var root = _this._root(rule, options);
            Promise.resolve(_this.func(root)).then(function(transform) {
              var string = void 0;
              if (_this._shouldUpdateSelector(rule, options)) {
                string = root.toString();
                rule.selector = string;
              }
              return {
                transform,
                root,
                string
              };
            }).then(resolve, reject);
          } catch (e) {
            reject(e);
            return;
          }
        });
      }, "_run");
      _proto._runSync = /* @__PURE__ */ __name(function _runSync(rule, options) {
        if (options === void 0) {
          options = {};
        }
        var root = this._root(rule, options);
        var transform = this.func(root);
        if (transform && typeof transform.then === "function") {
          throw new Error("Selector processor returned a promise to a synchronous call.");
        }
        var string = void 0;
        if (options.updateSelector && typeof rule !== "string") {
          string = root.toString();
          rule.selector = string;
        }
        return {
          transform,
          root,
          string
        };
      }, "_runSync");
      _proto.ast = /* @__PURE__ */ __name(function ast(rule, options) {
        return this._run(rule, options).then(function(result) {
          return result.root;
        });
      }, "ast");
      _proto.astSync = /* @__PURE__ */ __name(function astSync(rule, options) {
        return this._runSync(rule, options).root;
      }, "astSync");
      _proto.transform = /* @__PURE__ */ __name(function transform(rule, options) {
        return this._run(rule, options).then(function(result) {
          return result.transform;
        });
      }, "transform");
      _proto.transformSync = /* @__PURE__ */ __name(function transformSync(rule, options) {
        return this._runSync(rule, options).transform;
      }, "transformSync");
      _proto.process = /* @__PURE__ */ __name(function process2(rule, options) {
        return this._run(rule, options).then(function(result) {
          return result.string || result.root.toString();
        });
      }, "process");
      _proto.processSync = /* @__PURE__ */ __name(function processSync(rule, options) {
        var result = this._runSync(rule, options);
        return result.string || result.root.toString();
      }, "processSync");
      return Processor5;
    }();
    exports["default"] = Processor4;
    module.exports = exports.default;
  }
});

// node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/selectors/constructors.js
var require_constructors = __commonJS({
  "node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/selectors/constructors.js"(exports) {
    "use strict";
    exports.__esModule = true;
    exports.universal = exports.tag = exports.string = exports.selector = exports.root = exports.pseudo = exports.nesting = exports.id = exports.comment = exports.combinator = exports.className = exports.attribute = void 0;
    var _attribute = _interopRequireDefault(require_attribute());
    var _className = _interopRequireDefault(require_className());
    var _combinator = _interopRequireDefault(require_combinator());
    var _comment = _interopRequireDefault(require_comment());
    var _id = _interopRequireDefault(require_id());
    var _nesting = _interopRequireDefault(require_nesting());
    var _pseudo = _interopRequireDefault(require_pseudo());
    var _root = _interopRequireDefault(require_root());
    var _selector = _interopRequireDefault(require_selector());
    var _string = _interopRequireDefault(require_string());
    var _tag = _interopRequireDefault(require_tag());
    var _universal = _interopRequireDefault(require_universal());
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    __name(_interopRequireDefault, "_interopRequireDefault");
    var attribute = /* @__PURE__ */ __name(function attribute2(opts) {
      return new _attribute["default"](opts);
    }, "attribute");
    exports.attribute = attribute;
    var className = /* @__PURE__ */ __name(function className2(opts) {
      return new _className["default"](opts);
    }, "className");
    exports.className = className;
    var combinator = /* @__PURE__ */ __name(function combinator2(opts) {
      return new _combinator["default"](opts);
    }, "combinator");
    exports.combinator = combinator;
    var comment = /* @__PURE__ */ __name(function comment2(opts) {
      return new _comment["default"](opts);
    }, "comment");
    exports.comment = comment;
    var id = /* @__PURE__ */ __name(function id2(opts) {
      return new _id["default"](opts);
    }, "id");
    exports.id = id;
    var nesting = /* @__PURE__ */ __name(function nesting2(opts) {
      return new _nesting["default"](opts);
    }, "nesting");
    exports.nesting = nesting;
    var pseudo = /* @__PURE__ */ __name(function pseudo2(opts) {
      return new _pseudo["default"](opts);
    }, "pseudo");
    exports.pseudo = pseudo;
    var root = /* @__PURE__ */ __name(function root2(opts) {
      return new _root["default"](opts);
    }, "root");
    exports.root = root;
    var selector = /* @__PURE__ */ __name(function selector2(opts) {
      return new _selector["default"](opts);
    }, "selector");
    exports.selector = selector;
    var string = /* @__PURE__ */ __name(function string2(opts) {
      return new _string["default"](opts);
    }, "string");
    exports.string = string;
    var tag = /* @__PURE__ */ __name(function tag2(opts) {
      return new _tag["default"](opts);
    }, "tag");
    exports.tag = tag;
    var universal = /* @__PURE__ */ __name(function universal2(opts) {
      return new _universal["default"](opts);
    }, "universal");
    exports.universal = universal;
  }
});

// node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/selectors/guards.js
var require_guards = __commonJS({
  "node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/selectors/guards.js"(exports) {
    "use strict";
    exports.__esModule = true;
    exports.isComment = exports.isCombinator = exports.isClassName = exports.isAttribute = void 0;
    exports.isContainer = isContainer;
    exports.isIdentifier = void 0;
    exports.isNamespace = isNamespace;
    exports.isNesting = void 0;
    exports.isNode = isNode;
    exports.isPseudo = void 0;
    exports.isPseudoClass = isPseudoClass;
    exports.isPseudoElement = isPseudoElement;
    exports.isUniversal = exports.isTag = exports.isString = exports.isSelector = exports.isRoot = void 0;
    var _types = require_types();
    var _IS_TYPE;
    var IS_TYPE = (_IS_TYPE = {}, _IS_TYPE[_types.ATTRIBUTE] = true, _IS_TYPE[_types.CLASS] = true, _IS_TYPE[_types.COMBINATOR] = true, _IS_TYPE[_types.COMMENT] = true, _IS_TYPE[_types.ID] = true, _IS_TYPE[_types.NESTING] = true, _IS_TYPE[_types.PSEUDO] = true, _IS_TYPE[_types.ROOT] = true, _IS_TYPE[_types.SELECTOR] = true, _IS_TYPE[_types.STRING] = true, _IS_TYPE[_types.TAG] = true, _IS_TYPE[_types.UNIVERSAL] = true, _IS_TYPE);
    function isNode(node) {
      return typeof node === "object" && IS_TYPE[node.type];
    }
    __name(isNode, "isNode");
    function isNodeType(type, node) {
      return isNode(node) && node.type === type;
    }
    __name(isNodeType, "isNodeType");
    var isAttribute = isNodeType.bind(null, _types.ATTRIBUTE);
    exports.isAttribute = isAttribute;
    var isClassName = isNodeType.bind(null, _types.CLASS);
    exports.isClassName = isClassName;
    var isCombinator = isNodeType.bind(null, _types.COMBINATOR);
    exports.isCombinator = isCombinator;
    var isComment = isNodeType.bind(null, _types.COMMENT);
    exports.isComment = isComment;
    var isIdentifier = isNodeType.bind(null, _types.ID);
    exports.isIdentifier = isIdentifier;
    var isNesting = isNodeType.bind(null, _types.NESTING);
    exports.isNesting = isNesting;
    var isPseudo = isNodeType.bind(null, _types.PSEUDO);
    exports.isPseudo = isPseudo;
    var isRoot = isNodeType.bind(null, _types.ROOT);
    exports.isRoot = isRoot;
    var isSelector = isNodeType.bind(null, _types.SELECTOR);
    exports.isSelector = isSelector;
    var isString = isNodeType.bind(null, _types.STRING);
    exports.isString = isString;
    var isTag = isNodeType.bind(null, _types.TAG);
    exports.isTag = isTag;
    var isUniversal = isNodeType.bind(null, _types.UNIVERSAL);
    exports.isUniversal = isUniversal;
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
  }
});

// node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/selectors/index.js
var require_selectors = __commonJS({
  "node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/selectors/index.js"(exports) {
    "use strict";
    exports.__esModule = true;
    var _types = require_types();
    Object.keys(_types).forEach(function(key) {
      if (key === "default" || key === "__esModule") return;
      if (key in exports && exports[key] === _types[key]) return;
      exports[key] = _types[key];
    });
    var _constructors = require_constructors();
    Object.keys(_constructors).forEach(function(key) {
      if (key === "default" || key === "__esModule") return;
      if (key in exports && exports[key] === _constructors[key]) return;
      exports[key] = _constructors[key];
    });
    var _guards = require_guards();
    Object.keys(_guards).forEach(function(key) {
      if (key === "default" || key === "__esModule") return;
      if (key in exports && exports[key] === _guards[key]) return;
      exports[key] = _guards[key];
    });
  }
});

// node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/index.js
var require_dist = __commonJS({
  "node_modules/.pnpm/postcss-selector-parser@6.1.2/node_modules/postcss-selector-parser/dist/index.js"(exports, module) {
    "use strict";
    exports.__esModule = true;
    exports["default"] = void 0;
    var _processor = _interopRequireDefault(require_processor());
    var selectors = _interopRequireWildcard(require_selectors());
    function _getRequireWildcardCache(nodeInterop) {
      if (typeof WeakMap !== "function") return null;
      var cacheBabelInterop = /* @__PURE__ */ new WeakMap();
      var cacheNodeInterop = /* @__PURE__ */ new WeakMap();
      return (_getRequireWildcardCache = /* @__PURE__ */ __name(function _getRequireWildcardCache2(nodeInterop2) {
        return nodeInterop2 ? cacheNodeInterop : cacheBabelInterop;
      }, "_getRequireWildcardCache"))(nodeInterop);
    }
    __name(_getRequireWildcardCache, "_getRequireWildcardCache");
    function _interopRequireWildcard(obj, nodeInterop) {
      if (!nodeInterop && obj && obj.__esModule) {
        return obj;
      }
      if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return { "default": obj };
      }
      var cache = _getRequireWildcardCache(nodeInterop);
      if (cache && cache.has(obj)) {
        return cache.get(obj);
      }
      var newObj = {};
      var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
      for (var key in obj) {
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
          var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
          if (desc && (desc.get || desc.set)) {
            Object.defineProperty(newObj, key, desc);
          } else {
            newObj[key] = obj[key];
          }
        }
      }
      newObj["default"] = obj;
      if (cache) {
        cache.set(obj, newObj);
      }
      return newObj;
    }
    __name(_interopRequireWildcard, "_interopRequireWildcard");
    function _interopRequireDefault(obj) {
      return obj && obj.__esModule ? obj : { "default": obj };
    }
    __name(_interopRequireDefault, "_interopRequireDefault");
    var parser = /* @__PURE__ */ __name(function parser2(processor) {
      return new _processor["default"](processor);
    }, "parser");
    Object.assign(parser, selectors);
    delete parser.__esModule;
    var _default = parser;
    exports["default"] = _default;
    module.exports = exports.default;
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
var import_postcss_selector_parser = __toESM(require_dist(), 1);

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
    node.selector = (0, import_postcss_selector_parser.default)((selectorsParsed) => {
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
/*! Bundled license information:

cssesc/cssesc.js:
  (*! https://mths.be/cssesc v3.0.0 by @mathias *)
*/
//# sourceMappingURL=index.mjs.map
