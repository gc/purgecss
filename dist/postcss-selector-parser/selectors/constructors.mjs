var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/cssesc/index.js
var object = {};
var hasOwnProperty = object.hasOwnProperty;
var merge = /* @__PURE__ */ __name((options, defaults) => {
  if (!options) {
    return defaults;
  }
  const result = {};
  for (const key in defaults) {
    result[key] = hasOwnProperty.call(options, key) ? options[key] : defaults[key];
  }
  return result;
}, "merge");
var regexAnySingleEscape = /<%= anySingleEscape %>/;
var regexSingleEscape = /<%= singleEscapes %>/;
var regexExcessiveSpaces = /(^|\\+)?(\\[A-F0-9]{1,6})\x20(?![a-fA-F0-9\x20])/g;
var cssesc = /* @__PURE__ */ __name(/* @__NO_SIDE_EFFECTS__ */ (string2, options) => {
  options = merge(options, cssesc.options);
  if (options.quotes != "single" && options.quotes != "double") {
    options.quotes = "single";
  }
  const quote = options.quotes == "double" ? '"' : "'";
  const isIdentifier = options.isIdentifier;
  const firstChar = string2.charAt(0);
  let output = "";
  let counter = 0;
  const length = string2.length;
  while (counter < length) {
    const character = string2.charAt(counter++);
    let codePoint = character.charCodeAt();
    let value;
    if (codePoint < 32 || codePoint > 126) {
      if (codePoint >= 55296 && codePoint <= 56319 && counter < length) {
        const extra = string2.charCodeAt(counter++);
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
  output = output.replace(regexExcessiveSpaces, ($0, $1, $2) => {
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
var cssesc_default = cssesc;

// src/postcss-selector-parser/util/unesc.js
function gobbleHex(str) {
  const lower = str.toLowerCase();
  let hex = "";
  let spaceTerminated = false;
  for (let i = 0; i < 6 && lower[i] !== void 0; i++) {
    const code = lower.charCodeAt(i);
    const valid = code >= 97 && code <= 102 || code >= 48 && code <= 57;
    spaceTerminated = code === 32;
    if (!valid) {
      break;
    }
    hex += lower[i];
  }
  if (hex.length === 0) {
    return void 0;
  }
  const codePoint = parseInt(hex, 16);
  const isSurrogate = codePoint >= 55296 && codePoint <= 57343;
  if (isSurrogate || codePoint === 0 || codePoint > 1114111) {
    return ["\uFFFD", hex.length + (spaceTerminated ? 1 : 0)];
  }
  return [
    String.fromCodePoint(codePoint),
    hex.length + (spaceTerminated ? 1 : 0)
  ];
}
__name(gobbleHex, "gobbleHex");
var CONTAINS_ESCAPE = /\\/;
function unesc(str) {
  let needToProcess = CONTAINS_ESCAPE.test(str);
  if (!needToProcess) {
    return str;
  }
  let ret = "";
  for (let i = 0; i < str.length; i++) {
    if (str[i] === "\\") {
      const gobbled = gobbleHex(str.slice(i + 1, i + 7));
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

// src/postcss-selector-parser/selectors/namespace.js
var Namespace = class extends Node {
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
      const {
        deprecatedUsage,
        unescaped,
        quoteMark
      } = unescapeValue(v);
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

// src/postcss-selector-parser/selectors/className.js
var ClassName = class extends Node {
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

// src/postcss-selector-parser/selectors/combinator.js
var Combinator = class extends Node {
  static {
    __name(this, "Combinator");
  }
  constructor(opts) {
    super(opts);
    this.type = COMBINATOR;
  }
};

// src/postcss-selector-parser/selectors/comment.js
var Comment = class extends Node {
  static {
    __name(this, "Comment");
  }
  constructor(opts) {
    super(opts);
    this.type = COMMENT;
  }
};

// src/postcss-selector-parser/selectors/id.js
var ID2 = class extends Node {
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

// src/postcss-selector-parser/selectors/nesting.js
var Nesting = class extends Node {
  static {
    __name(this, "Nesting");
  }
  constructor(opts) {
    super(opts);
    this.type = NESTING;
    this.value = "&";
  }
};

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

// src/postcss-selector-parser/selectors/pseudo.js
var Pseudo = class extends Container {
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

// src/postcss-selector-parser/selectors/root.js
var Root = class extends Container {
  static {
    __name(this, "Root");
  }
  constructor(opts) {
    super(opts);
    this.type = ROOT;
  }
  toString() {
    let str = this.reduce((memo, selector2) => {
      memo.push(String(selector2));
      return memo;
    }, []).join(",");
    return this.trailingComma ? str + "," : str;
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
var Selector = class extends Container {
  static {
    __name(this, "Selector");
  }
  constructor(opts) {
    super(opts);
    this.type = SELECTOR;
  }
};

// src/postcss-selector-parser/selectors/string.js
var String2 = class extends Node {
  static {
    __name(this, "String");
  }
  constructor(opts) {
    super(opts);
    this.type = STRING;
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

// src/postcss-selector-parser/selectors/constructors.js
var attribute = /* @__PURE__ */ __name((opts) => new Attribute(opts), "attribute");
var className = /* @__PURE__ */ __name((opts) => new ClassName(opts), "className");
var combinator = /* @__PURE__ */ __name((opts) => new Combinator(opts), "combinator");
var comment = /* @__PURE__ */ __name((opts) => new Comment(opts), "comment");
var id = /* @__PURE__ */ __name((opts) => new ID2(opts), "id");
var nesting = /* @__PURE__ */ __name((opts) => new Nesting(opts), "nesting");
var pseudo = /* @__PURE__ */ __name((opts) => new Pseudo(opts), "pseudo");
var root = /* @__PURE__ */ __name((opts) => new Root(opts), "root");
var selector = /* @__PURE__ */ __name((opts) => new Selector(opts), "selector");
var string = /* @__PURE__ */ __name((opts) => new String2(opts), "string");
var tag = /* @__PURE__ */ __name((opts) => new Tag(opts), "tag");
var universal = /* @__PURE__ */ __name((opts) => new Universal(opts), "universal");
export {
  attribute,
  className,
  combinator,
  comment,
  id,
  nesting,
  pseudo,
  root,
  selector,
  string,
  tag,
  universal
};
//# sourceMappingURL=constructors.mjs.map
