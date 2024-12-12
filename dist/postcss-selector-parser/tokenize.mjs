var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/postcss-selector-parser/tokenTypes.js
var ampersand = 38;
var asterisk = 42;
var comma = 44;
var colon = 58;
var semicolon = 59;
var openParenthesis = 40;
var closeParenthesis = 41;
var openSquare = 91;
var closeSquare = 93;
var dollar = 36;
var tilde = 126;
var caret = 94;
var plus = 43;
var equals = 61;
var pipe = 124;
var greaterThan = 62;
var space = 32;
var singleQuote = 39;
var doubleQuote = 34;
var slash = 47;
var bang = 33;
var backslash = 92;
var cr = 13;
var feed = 12;
var newline = 10;
var tab = 9;
var str = singleQuote;
var comment = -1;
var word = -2;
var combinator = -3;

// src/postcss-selector-parser/tokenize.js
var unescapable = {
  [tab]: true,
  [newline]: true,
  [cr]: true,
  [feed]: true
};
var wordDelimiters = {
  [space]: true,
  [tab]: true,
  [newline]: true,
  [cr]: true,
  [feed]: true,
  [ampersand]: true,
  [asterisk]: true,
  [bang]: true,
  [comma]: true,
  [colon]: true,
  [semicolon]: true,
  [openParenthesis]: true,
  [closeParenthesis]: true,
  [openSquare]: true,
  [closeSquare]: true,
  [singleQuote]: true,
  [doubleQuote]: true,
  [plus]: true,
  [pipe]: true,
  [tilde]: true,
  [greaterThan]: true,
  [equals]: true,
  [dollar]: true,
  [caret]: true,
  [slash]: true
};
var hex = {};
var hexChars = "0123456789abcdefABCDEF";
for (let i = 0; i < hexChars.length; i++) {
  hex[hexChars.charCodeAt(i)] = true;
}
function consumeWord(css, start) {
  let next = start;
  let code;
  do {
    code = css.charCodeAt(next);
    if (wordDelimiters[code]) {
      return next - 1;
    } else if (code === backslash) {
      next = consumeEscape(css, next) + 1;
    } else {
      next++;
    }
  } while (next < css.length);
  return next - 1;
}
__name(consumeWord, "consumeWord");
function consumeEscape(css, start) {
  let next = start;
  let code = css.charCodeAt(next + 1);
  if (unescapable[code]) {
  } else if (hex[code]) {
    let hexDigits = 0;
    do {
      next++;
      hexDigits++;
      code = css.charCodeAt(next + 1);
    } while (hex[code] && hexDigits < 6);
    if (hexDigits < 6 && code === space) {
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
function tokenize(input) {
  const tokens = [];
  let css = input.css.valueOf();
  let { length } = css;
  let offset = -1;
  let line = 1;
  let start = 0;
  let end = 0;
  let code, content, endColumn, endLine, escaped, escapePos, last, lines, next, nextLine, nextOffset, quote, tokenType;
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
    if (code === newline) {
      offset = start;
      line += 1;
    }
    switch (code) {
      case space:
      case tab:
      case newline:
      case cr:
      case feed:
        next = start;
        do {
          next += 1;
          code = css.charCodeAt(next);
          if (code === newline) {
            offset = next;
            line += 1;
          }
        } while (code === space || code === newline || code === tab || code === cr || code === feed);
        tokenType = space;
        endLine = line;
        endColumn = next - offset - 1;
        end = next;
        break;
      case plus:
      case greaterThan:
      case tilde:
      case pipe:
        next = start;
        do {
          next += 1;
          code = css.charCodeAt(next);
        } while (code === plus || code === greaterThan || code === tilde || code === pipe);
        tokenType = combinator;
        endLine = line;
        endColumn = start - offset;
        end = next;
        break;
      // Consume these characters as single tokens.
      case asterisk:
      case ampersand:
      case bang:
      case comma:
      case equals:
      case dollar:
      case caret:
      case openSquare:
      case closeSquare:
      case colon:
      case semicolon:
      case openParenthesis:
      case closeParenthesis:
        next = start;
        tokenType = code;
        endLine = line;
        endColumn = start - offset;
        end = next + 1;
        break;
      case singleQuote:
      case doubleQuote:
        quote = code === singleQuote ? "'" : '"';
        next = start;
        do {
          escaped = false;
          next = css.indexOf(quote, next + 1);
          if (next === -1) {
            unclosed("quote", quote);
          }
          escapePos = next;
          while (css.charCodeAt(escapePos - 1) === backslash) {
            escapePos -= 1;
            escaped = !escaped;
          }
        } while (escaped);
        tokenType = str;
        endLine = line;
        endColumn = start - offset;
        end = next + 1;
        break;
      default:
        if (code === slash && css.charCodeAt(start + 1) === asterisk) {
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
          tokenType = comment;
          line = nextLine;
          endLine = nextLine;
          endColumn = next - nextOffset;
        } else if (code === slash) {
          next = start;
          tokenType = code;
          endLine = line;
          endColumn = start - offset;
          end = next + 1;
        } else {
          next = consumeWord(css, start);
          tokenType = word;
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
export {
  FIELDS,
  tokenize as default
};
//# sourceMappingURL=tokenize.mjs.map
