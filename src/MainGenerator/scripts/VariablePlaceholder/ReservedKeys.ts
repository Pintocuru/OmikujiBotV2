// src/MainGenerator/scripts/VariablePlaceholder/ReservedKeys.ts

export const RESERVED_KEYS = [
  'text',
  'symbol',
  'name',
  'variant',
  'unique',
  'slot0',
  'slot1',
  'slot2',
  'slot3',
  'slot4',
  'slot5',
  'slot6',
  'slot7',
  'slot8',
  'slot9',
]

// パターン定数
// var Foo = 'hoge'
export const VAR_DECLARATION_PATTERN = /\{\{\s*[Vv][Aa][Rr]\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.*?)\s*\}\}/g

// {{Foo}}
export const VAR_REFERENCE_PATTERN = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g

// {{rand(1,6)}}
export const RAND_PATTERN = /\{\{\s*[Rr][Aa][Nn][Dd]\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)\s*\}\}/g

// {{calc score += 10}}
export const CALC_PATTERN = /\{\{\s*[Cc][Aa][Ll][Cc]\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*([\+\-\*\/])=\s*(.*?)\s*\}\}/g
