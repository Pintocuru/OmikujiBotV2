// src\MainGenerator\scripts\VariablePlaceholder\ReservedKeys.ts

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

// パターン定数（VariableProcessorと同じ）
export const VAR_DECLARATION_PATTERN = /\{\{var\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.*?)\}\}/g
export const VAR_REFERENCE_PATTERN = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g
export const RAND_PATTERN = /\{\{rand\((\d+),(\d+)\)\}\}/g // rand関数
export const SELECT_PATTERN = /\{\{select\(([^)]+)\)\}\}/g // select関数
