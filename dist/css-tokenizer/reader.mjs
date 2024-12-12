var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

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
export {
  Reader
};
//# sourceMappingURL=reader.mjs.map
