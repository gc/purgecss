var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

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
export {
  isAttribute,
  isClassName,
  isCombinator,
  isComment,
  isContainer,
  isIdentifier,
  isNamespace,
  isNesting,
  isNode,
  isPseudo,
  isPseudoClass,
  isPseudoElement,
  isRoot,
  isSelector,
  isString,
  isTag,
  isUniversal
};
//# sourceMappingURL=guards.mjs.map
