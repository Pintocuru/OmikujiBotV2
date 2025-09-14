// src\MainGenerator\scripts\VariablePlaceholder\PlaceholderExtractor.ts

/**
 * テキストからプレースホルダーを抽出するクラス
 */
export class PlaceholderExtractor {
  /**
   * テキスト内の変数プレースホルダーを抽出（解析用）
   */
  extract(text: string): {
    declarations: Array<{ name: string; expression: string }>
    references: string[]
    builtins: string[]
  } {
    const declarations: Array<{ name: string; expression: string }> = []
    const references: string[] = []
    const builtins: string[] = []

    // 変数宣言を抽出
    const varPattern = /\{\{var\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([^}]+)\}\}/g
    let match
    while ((match = varPattern.exec(text)) !== null) {
      declarations.push({ name: match[1], expression: match[2].trim() })
    }

    // 変数参照を抽出（宣言以外）
    const refPattern = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g
    const tempText = text.replace(varPattern, '') // 宣言部分を除外
    while ((match = refPattern.exec(tempText)) !== null) {
      if (!references.includes(match[1])) {
        references.push(match[1])
      }
    }

    // 組み込み関数を抽出
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
}
