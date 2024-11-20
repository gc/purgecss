var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

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
export {
  ExtractorResultSets_default as default
};
//# sourceMappingURL=ExtractorResultSets.js.map
