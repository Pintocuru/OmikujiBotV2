// src\MainGenerator\scripts\VariablePlaceholder\PlaceholderExtractor.ts
// ! 使わないかも
/**
 * テキスト内の変数プレースホルダーを抽出（解析用）
 */
type PlaceholderExtractResult = {
  declarations: {
    name: string
    expression: string
  }[]
  references: string[]
  builtins: string[]
}

export function extractPlaceholders(text: string): PlaceholderExtractResult {
  const declarations: Array<{ name: string; expression: string }> = []
  const references: string[] = []
  const builtins: string[] = []

  // 変数宣言
  const varPattern = /\{\{var\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([^}]+)\}\}/g
  let match: RegExpExecArray | null

  while ((match = varPattern.exec(text)) !== null) {
    declarations.push({
      name: match[1],
      expression: match[2].trim(),
    })
  }

  // 変数参照（宣言除外）
  const refPattern = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g
  const tempText = text.replace(varPattern, '')

  while ((match = refPattern.exec(tempText)) !== null) {
    if (!references.includes(match[1])) {
      references.push(match[1])
    }
  }

  // 組み込み
  const builtinPatterns = [/\{\{rank\}\}/g, /\{\{rand\(\d+,\d+\)\}\}/g]

  for (const pattern of builtinPatterns) {
    while ((match = pattern.exec(text)) !== null) {
      if (!builtins.includes(match[0])) {
        builtins.push(match[0])
      }
    }
  }

  return { declarations, references, builtins }
}
