var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/css-tokenizer/code-points/code-points.ts
var HYPHEN_MINUS = 45;
var LOW_LINE = 95;

// src/css-tokenizer/code-points/ranges.ts
function isDigitCodePoint(search) {
  return search >= 48 && search <= 57;
}
__name(isDigitCodePoint, "isDigitCodePoint");
function isUppercaseLetterCodePoint(search) {
  return search >= 65 && search <= 90;
}
__name(isUppercaseLetterCodePoint, "isUppercaseLetterCodePoint");
function isLowercaseLetterCodePoint(search) {
  return search >= 97 && search <= 122;
}
__name(isLowercaseLetterCodePoint, "isLowercaseLetterCodePoint");
function isHexDigitCodePoint(search) {
  return search >= 48 && search <= 57 || // 0 .. 9
  search >= 97 && search <= 102 || // a .. f
  search >= 65 && search <= 70;
}
__name(isHexDigitCodePoint, "isHexDigitCodePoint");
function isLetterCodePoint(search) {
  return isLowercaseLetterCodePoint(search) || isUppercaseLetterCodePoint(search);
}
__name(isLetterCodePoint, "isLetterCodePoint");
function isIdentStartCodePoint(search) {
  return isLetterCodePoint(search) || isNonASCII_IdentCodePoint(search) || search === LOW_LINE;
}
__name(isIdentStartCodePoint, "isIdentStartCodePoint");
function isIdentCodePoint(search) {
  return isIdentStartCodePoint(search) || isDigitCodePoint(search) || search === HYPHEN_MINUS;
}
__name(isIdentCodePoint, "isIdentCodePoint");
function isNonASCII_IdentCodePoint(search) {
  if (search === 183 || search === 8204 || search === 8205 || search === 8255 || search === 8256 || search === 8204) {
    return true;
  }
  if (192 <= search && search <= 214 || 216 <= search && search <= 246 || 248 <= search && search <= 893 || 895 <= search && search <= 8191 || 8304 <= search && search <= 8591 || 11264 <= search && search <= 12271 || 12289 <= search && search <= 55295 || 63744 <= search && search <= 64975 || 65008 <= search && search <= 65533) {
    return true;
  }
  if (search === 0) {
    return true;
  } else if (isSurrogate(search)) {
    return true;
  }
  return search >= 65536;
}
__name(isNonASCII_IdentCodePoint, "isNonASCII_IdentCodePoint");
function isSurrogate(search) {
  return search >= 55296 && search <= 57343;
}
__name(isSurrogate, "isSurrogate");

// src/css-tokenizer/util/mutations.ts
function mutateIdent(ident, newValue) {
  const codePoints = [];
  for (const codePoint of newValue) {
    codePoints.push(codePoint.codePointAt(0));
  }
  const result = String.fromCodePoint(...ensureThatValueRoundTripsAsIdent(codePoints));
  ident[1] = result;
  ident[4].value = newValue;
}
__name(mutateIdent, "mutateIdent");
function mutateUnit(ident, newUnit) {
  const codePoints = [];
  for (const codePoint of newUnit) {
    codePoints.push(codePoint.codePointAt(0));
  }
  const escapedCodePoints = ensureThatValueRoundTripsAsIdent(codePoints);
  if (escapedCodePoints[0] === 101) {
    insertEscapedCodePoint(escapedCodePoints, 0, escapedCodePoints[0]);
  }
  const result = String.fromCodePoint(...escapedCodePoints);
  const signCharacter = ident[4].signCharacter === "+" ? ident[4].signCharacter : "";
  const numericValue = ident[4].value.toString();
  ident[1] = `${signCharacter}${numericValue}${result}`;
  ident[4].unit = newUnit;
}
__name(mutateUnit, "mutateUnit");
function ensureThatValueRoundTripsAsIdent(codePoints) {
  let remainderStartIndex = 0;
  if (codePoints[0] === HYPHEN_MINUS && codePoints[1] === HYPHEN_MINUS) {
    remainderStartIndex = 2;
  } else if (codePoints[0] === HYPHEN_MINUS && codePoints[1]) {
    remainderStartIndex = 2;
    if (!isIdentStartCodePoint(codePoints[1])) {
      remainderStartIndex += insertEscapedCodePoint(codePoints, 1, codePoints[1]);
    }
  } else if (isIdentStartCodePoint(codePoints[0])) {
    remainderStartIndex = 1;
  } else {
    remainderStartIndex = 1;
    remainderStartIndex += insertEscapedCodePoint(codePoints, 0, codePoints[0]);
  }
  for (let i = remainderStartIndex; i < codePoints.length; i++) {
    if (isIdentCodePoint(codePoints[i])) {
      continue;
    }
    i += insertEscapedCodePoint(codePoints, i, codePoints[i]);
  }
  return codePoints;
}
__name(ensureThatValueRoundTripsAsIdent, "ensureThatValueRoundTripsAsIdent");
function insertEscapedCodePoint(codePoints, index, codePoint) {
  const hexRepresentation = codePoint.toString(16);
  const codePointsForHexRepresentation = [];
  for (const x of hexRepresentation) {
    codePointsForHexRepresentation.push(x.codePointAt(0));
  }
  const next = codePoints[index + 1];
  if (index === codePoints.length - 1 || next && isHexDigitCodePoint(next)) {
    codePoints.splice(
      index,
      1,
      92,
      ...codePointsForHexRepresentation,
      32
      // ` ` space
    );
    return 1 + codePointsForHexRepresentation.length;
  }
  codePoints.splice(
    index,
    1,
    92,
    ...codePointsForHexRepresentation
  );
  return codePointsForHexRepresentation.length;
}
__name(insertEscapedCodePoint, "insertEscapedCodePoint");
export {
  mutateIdent,
  mutateUnit
};
//# sourceMappingURL=mutations.mjs.map
