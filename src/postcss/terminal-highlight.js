

import pico from 'picocolors';
import { tokenizer } from "./tokenize";

let Input

function registerInput(dependant) {
  Input = dependant
}

const HIGHLIGHT_THEME = {
  ';': pico.yellow,
  ':': pico.yellow,
  '(': pico.cyan,
  ')': pico.cyan,
  '[': pico.yellow,
  ']': pico.yellow,
  '{': pico.yellow,
  '}': pico.yellow,
  'at-word': pico.cyan,
  'brackets': pico.cyan,
  'call': pico.cyan,
  'class': pico.yellow,
  'comment': pico.gray,
  'hash': pico.magenta,
  'string': pico.green
}

function getTokenType([type, value], processor) {
  if (type === 'word') {
    if (value[0] === '.') {
      return 'class'
    }
    if (value[0] === '#') {
      return 'hash'
    }
  }

  if (!processor.endOfFile()) {
    const next = processor.nextToken()
    processor.back(next)
    if (next[0] === 'brackets' || next[0] === '(') return 'call'
  }

  return type
}

export function terminalHighlight(css) {
  const processor = tokenizer(new Input(css), { ignoreErrors: true })
  let result = ''
  while (!processor.endOfFile()) {
    const token = processor.nextToken()
    const color = HIGHLIGHT_THEME[getTokenType(token, processor)]
    if (color) {
      result += token[1]
        .split(/\r?\n/)
        .map(i => color(i))
        .join('\n')
    } else {
      result += token[1]
    }
  }
  return result
}

terminalHighlight.registerInput = registerInput
