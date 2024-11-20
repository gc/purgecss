var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/postcss/previous-map.js
function fromBase64(str) {
  if (Buffer) {
    return Buffer.from(str, "base64").toString();
  } else {
    return window.atob(str);
  }
}
__name(fromBase64, "fromBase64");
var PreviousMap = class {
  static {
    __name(this, "PreviousMap");
  }
  constructor(css, opts) {
    if (opts.map === false) return;
    this.loadAnnotation(css);
    this.inline = this.startWith(this.annotation, "data:");
    const prev = opts.map ? opts.map.prev : void 0;
    const text = this.loadMap(opts.from, prev);
    if (!this.mapFile && opts.from) {
      this.mapFile = opts.from;
    }
    if (text) this.text = text;
  }
  consumer() {
    if (!this.consumerCache) {
      this.consumerCache = new SourceMapConsumer(this.text);
    }
    return this.consumerCache;
  }
  decodeInline(text) {
    const baseCharsetUri = /^data:application\/json;charset=utf-?8;base64,/;
    const baseUri = /^data:application\/json;base64,/;
    const charsetUri = /^data:application\/json;charset=utf-?8,/;
    const uri = /^data:application\/json,/;
    const uriMatch = text.match(charsetUri) || text.match(uri);
    if (uriMatch) {
      return decodeURIComponent(text.substr(uriMatch[0].length));
    }
    const baseUriMatch = text.match(baseCharsetUri) || text.match(baseUri);
    if (baseUriMatch) {
      return fromBase64(text.substr(baseUriMatch[0].length));
    }
    const encoding = text.match(/data:application\/json;([^,]+),/)[1];
    throw new Error("Unsupported source map encoding " + encoding);
  }
  getAnnotationURL(sourceMapString) {
    return sourceMapString.replace(/^\/\*\s*# sourceMappingURL=/, "").trim();
  }
  isMap(map) {
    if (typeof map !== "object") return false;
    return typeof map.mappings === "string" || typeof map._mappings === "string" || Array.isArray(map.sections);
  }
  loadAnnotation(css) {
    const comments = css.match(/\/\*\s*# sourceMappingURL=/g);
    if (!comments) return;
    const start = css.lastIndexOf(comments.pop());
    const end = css.indexOf("*/", start);
    if (start > -1 && end > -1) {
      this.annotation = this.getAnnotationURL(css.substring(start, end));
    }
  }
  loadFile(path) {
    throw new Error("Shouldnt be used");
  }
  loadMap(file, prev) {
    if (prev === false) return false;
    if (prev) {
      if (typeof prev === "string") {
        return prev;
      } else if (typeof prev === "function") {
        const prevPath = prev(file);
        if (prevPath) {
          const map = this.loadFile(prevPath);
          if (!map) {
            throw new Error(
              "Unable to load previous source map: " + prevPath.toString()
            );
          }
          return map;
        }
      } else if (this.isMap(prev)) {
        return JSON.stringify(prev);
      } else {
        throw new Error(
          "Unsupported previous source map format: " + prev.toString()
        );
      }
    } else if (this.inline) {
      return this.decodeInline(this.annotation);
    } else if (this.annotation) {
      const map = this.annotation;
      return this.loadFile(map);
    }
  }
  startWith(string, start) {
    if (!string) return false;
    return string.substr(0, start.length) === start;
  }
  withContent() {
    return !!(this.consumer().sourcesContent && this.consumer().sourcesContent.length > 0);
  }
};
export {
  PreviousMap
};
//# sourceMappingURL=previous-map.mjs.map
