// C:\_root\_nodejs\OmikenTemplates\templates\OmikujiBot\src\MainGenerator\scripts\VariablePlaceholder\VariablePlaceholderProcessor.ts

/**
 * 変数プレースホルダー処理エンジン
 * {{rank}}, {{var}}, {{rand}}などの特殊プレースホルダーを処理
 */
export class VariablePlaceholderProcessor {
  private variables: Map<string, string | number> = new Map()
  private currentRank?: number
  private valuesLength?: number

  /**
   * コンテキストを設定
   */
  setContext(rank?: number, valuesLength?: number): void {
    this.currentRank = rank
    this.valuesLength = valuesLength
  }

  /**
   * 変数をクリア（新しい解決サイクルの開始時に呼ぶ）
   */
  clearVariables(): void {
    this.variables.clear()
  }

  /**
   * テキスト内の変数プレースホルダーを処理
   * 処理順序：var宣言 → その他の変数参照 → rank/rand
   */
  process(text: string): string {
    let processedText = text

    // 1. var宣言を先に処理（宣言順に処理）
    processedText = this.processVariableDeclarations(processedText)

    // 2. 変数参照を処理
    processedText = this.processVariableReferences(processedText)

    // 3. rank, rand などの組み込み関数を処理
    processedText = this.processBuiltinFunctions(processedText)

    return processedText
  }

  /**
   * 変数宣言を処理
   * {{var variableName = expression}}
   */
  private processVariableDeclarations(text: string): string {
    const varPattern = /\{\{var\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([^}]+)\}\}/g

    return text.replace(varPattern, (match, varName, expression) => {
      try {
        const value = this.evaluateExpression(expression.trim())
        this.variables.set(varName, value)
        return '' // 宣言は空文字に置換
      } catch (error) {
        console.warn(`変数宣言の評価に失敗しました: ${match}`, error)
        return match // エラー時は元のテキストを返す
      }
    })
  }

  /**
   * 変数参照を処理
   * {{variableName}}
   */
  private processVariableReferences(text: string): string {
    const refPattern = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g

    return text.replace(refPattern, (match, varName) => {
      if (this.variables.has(varName)) {
        return String(this.variables.get(varName))
      }

      // 未定義変数は警告して元のまま返す
      console.warn(`未定義の変数が参照されました: ${varName}`)
      return match
    })
  }

  /**
   * 組み込み関数を処理
   * {{rank}}, {{rand(min,max)}}など
   */
  private processBuiltinFunctions(text: string): string {
    let processedText = text

    // rank処理
    if (this.currentRank !== undefined) {
      processedText = processedText.replace(/\{\{rank\}\}/g, String(this.currentRank))
    }

    // rand関数処理
    processedText = processedText.replace(/\{\{rand\((\d+),(\d+)\)\}\}/g, (match, minStr, maxStr) => {
      const min = parseInt(minStr, 10)
      const max = parseInt(maxStr, 10)

      if (isNaN(min) || isNaN(max) || min > max) {
        console.warn(`無効なrand関数パラメータ: ${match}`)
        return match
      }

      return String(this.randomInt(min, max))
    })

    return processedText
  }

  /**
   * 式を評価（現在はrand関数のみサポート）
   */
  private evaluateExpression(expression: string): string | number {
    // rand(min, max)関数の処理
    const randMatch = expression.match(/^rand\((\d+),(\d+)\)$/)
    if (randMatch) {
      const min = parseInt(randMatch[1], 10)
      const max = parseInt(randMatch[2], 10)

      if (isNaN(min) || isNaN(max) || min > max) {
        throw new Error(`無効なrandパラメータ: ${expression}`)
      }

      return this.randomInt(min, max)
    }

    // 数値リテラル
    const numMatch = expression.match(/^-?\d+(\.\d+)?$/)
    if (numMatch) {
      return parseFloat(expression)
    }

    // 文字列リテラル（クォートありの場合）
    const stringMatch = expression.match(/^["'](.*)["']$/)
    if (stringMatch) {
      return stringMatch[1]
    }

    // 変数参照
    if (this.variables.has(expression)) {
      return this.variables.get(expression)!
    }

    // その他は文字列として扱う
    return expression
  }

  /**
   * 指定範囲の乱数生成
   */
  private randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  /**
   * デバッグ用：現在の変数状態を取得
   */
  getVariables(): Record<string, string | number> {
    return Object.fromEntries(this.variables)
  }

  /**
   * テキスト内の変数プレースホルダーを抽出（解析用）
   */
  extractVariablePlaceholders(text: string): {
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
