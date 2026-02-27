// src/MainGenerator/scripts/VariablePlaceholder/ReservedKeys.ts

export const RESERVED_KEYS = [
  'name',
  'symbol',
  'text',
  'order',
  'variant',
  'unique',
  'visible',
  'flag',
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

// ----------------------------------------------------------------
// v2 パターン（推奨）
// ----------------------------------------------------------------

// {{score}} - 単体変数参照（出力）
export const VAR_REFERENCE_PATTERN = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g

// {{式}} - 式評価（代入・複合代入・三項演算子など）
// 単体変数参照と区別するため、= を含むものにマッチ
export const EXPRESSION_PATTERN = /\{\{\s*([^}]+?[=+\-*\/][^}]+?)\s*\}\}/g

// ----------------------------------------------------------------
// v1 パターン（非推奨・後方互換）
// ----------------------------------------------------------------

// {{var name = value}}
/** @deprecated v2 では {{name = value}} を使用してください */
export const VAR_DECLARATION_PATTERN = /\{\{\s*[Vv][Aa][Rr]\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.*?)\s*\}\}/g

// {{rand(1,6)}}
/** @deprecated v2 では {{result = rand(1,6)}} を使用してください */
export const RAND_PATTERN = /\{\{\s*[Rr][Aa][Nn][Dd]\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)\s*\}\}/g
