

import { tokenizer } from "./tokenize";

let Input

function registerInput(dependant) {
  Input = dependant
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
  return '';
}

terminalHighlight.registerInput = registerInput
