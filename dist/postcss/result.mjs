var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

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
export {
  Result
};
//# sourceMappingURL=result.mjs.map
